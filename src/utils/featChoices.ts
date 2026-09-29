import type { Character } from '../types/character';
import type { ImplementType, WeaponData } from '../types/gameData';
import { getFeatById } from '../data/feats';

/**
 * Feats whose benefit depends on a choice the player makes when taking them.
 *
 * The Expertise feats were previously excluded from every computed attack bonus
 * for exactly this reason — "Choose a weapon group" has nowhere to be recorded, so
 * the sheet could not tell whether your Weapon Expertise applied to the axe in your
 * hand. `Character.featChoices` records it, keyed per feat INSTANCE because all
 * three choice feats are explicitly repeatable:
 *
 *   Weapon Expertise    — "You can take this feat more than once. Each time you
 *                          select this feat, choose another weapon group." (PHB2 190)
 *   Implement Expertise — same, a different implement type each time. (PHB2 185)
 *   Versatile Expertise — a different weapon group AND implement type. (PHB3 184)
 *
 * Totem Expertise and Two-Handed Weapon Expertise need no entry here: their text
 * names the totem / two-handed melee weapon outright, so they apply automatically.
 */

export type FeatChoiceKind = 'weapon-group' | 'implement-type';

/**
 * The PHB weapon groups.
 *
 * `weapons.ts` carries a weapon's group inside its `properties` array alongside true
 * properties (Versatile, Two-handed, High crit, …), so a group is matched by looking
 * for one of these names in that array. This list is exactly the set of group values
 * present in the weapon data — see `isProficientWithWeapon`, which matches the same
 * way for "Military hammers"-style proficiencies.
 */
export const WEAPON_GROUPS = [
  'Axe', 'Bow', 'Crossbow', 'Flail', 'Hammer', 'Heavy blade', 'Light blade',
  'Mace', 'Pick', 'Polearm', 'Sling', 'Spear', 'Staff', 'Unarmed',
] as const;

export const IMPLEMENT_TYPES: ImplementType[] = [
  'Holy Symbol', 'Orb', 'Rod', 'Staff', 'Wand', 'Totem', 'Ki Focus', 'Tome',
];

/** Which choices each feat requires, in the order the feat text names them. */
const CHOICE_FEATS: Record<string, FeatChoiceKind[]> = {
  'weapon-expertise': ['weapon-group'],
  'implement-expertise': ['implement-type'],
  'versatile-expertise': ['weapon-group', 'implement-type'],
};

export function featRequiresChoices(featId: string): FeatChoiceKind[] {
  return CHOICE_FEATS[featId] ?? [];
}

export const CHOICE_KIND_LABELS: Record<FeatChoiceKind, string> = {
  'weapon-group': 'Weapon group',
  'implement-type': 'Implement type',
};

export function choiceOptions(kind: FeatChoiceKind): readonly string[] {
  return kind === 'weapon-group' ? WEAPON_GROUPS : IMPLEMENT_TYPES;
}

/** Storage key. Includes the instance so a repeated feat gets its own choice. */
export function featChoiceKey(featId: string, occurrence: number, kind: FeatChoiceKind): string {
  return `${featId}#${occurrence}:${kind}`;
}

export function getFeatChoice(
  character: Character,
  featId: string,
  occurrence: number,
  kind: FeatChoiceKind,
): string | undefined {
  return character.featChoices?.[featChoiceKey(featId, occurrence, kind)];
}

export interface FeatChoiceSlot {
  featId: string;
  featName: string;
  /** 0-based index among this character's instances of this feat. */
  occurrence: number;
  kind: FeatChoiceKind;
  value?: string;
}

/** Every choice this character owes, filled or not, in feat order. */
export function getFeatChoiceSlots(character: Character): FeatChoiceSlot[] {
  const slots: FeatChoiceSlot[] = [];
  const seen = new Map<string, number>();

  for (const featId of character.selectedFeatIds) {
    const kinds = featRequiresChoices(featId);
    if (kinds.length === 0) continue;
    const occurrence = seen.get(featId) ?? 0;
    seen.set(featId, occurrence + 1);
    const featName = getFeatById(featId)?.name ?? featId;
    for (const kind of kinds) {
      slots.push({
        featId,
        featName,
        occurrence,
        kind,
        value: getFeatChoice(character, featId, occurrence, kind),
      });
    }
  }
  return slots;
}

/**
 * Drop the choices belonging to a removed feat instance and re-index the rest.
 * Mirrors the re-indexing `superiorImplementChoices` already does on removal —
 * without it, removing the first of two Weapon Expertise feats would leave the
 * second one reading the removed instance's weapon group.
 */
export function reindexFeatChoicesAfterRemoval(
  character: Character,
  featId: string,
  removedOccurrence: number,
): Record<string, string> {
  const kinds = featRequiresChoices(featId);
  if (kinds.length === 0) return character.featChoices ?? {};

  const old = character.featChoices ?? {};
  const next: Record<string, string> = {};

  // Keys for other feats pass through untouched.
  for (const [k, v] of Object.entries(old)) {
    if (!k.startsWith(`${featId}#`)) next[k] = v;
  }

  const instances = character.selectedFeatIds.filter((f) => f === featId).length;
  let writeIdx = 0;
  for (let readIdx = 0; readIdx < instances; readIdx++) {
    if (readIdx === removedOccurrence) continue;
    for (const kind of kinds) {
      const v = old[featChoiceKey(featId, readIdx, kind)];
      if (v !== undefined) next[featChoiceKey(featId, writeIdx, kind)] = v;
    }
    writeIdx++;
  }
  return next;
}

// ── Expertise attack bonus ───────────────────────────────────────────────────

/** +1 / +2 / +3 at 1st / 11th / 21st — the scaling every Expertise feat shares. */
function expertiseTier(level: number): number {
  return level >= 21 ? 3 : level >= 11 ? 2 : 1;
}

function weaponInGroup(weapon: WeaponData, group: string): boolean {
  return weapon.properties.some((p) => p.toLowerCase() === group.toLowerCase());
}

function isTwoHandedMelee(weapon: WeaponData): boolean {
  const melee = !weapon.category.toLowerCase().includes('ranged');
  return melee && weapon.properties.some((p) => p.toLowerCase() === 'two-handed');
}

export interface ExpertiseBonus {
  bonus: number;
  /** Feat names that grant `bonus` — for the breakdown tooltip/label. */
  sources: string[];
}

const NO_BONUS: ExpertiseBonus = { bonus: 0, sources: [] };

/**
 * The Expertise feat bonus to attack rolls with a specific weapon or implement.
 *
 * Returns the HIGHEST applicable bonus, not the sum: every Expertise feat grants a
 * "feat bonus" in so many words, and same-type bonuses don't stack in 4e. A
 * character with Weapon Expertise (Axe) and Two-Handed Weapon Expertise swinging a
 * greataxe gets +1, not +2.
 */
export function expertiseAttackBonus(
  character: Character,
  target: { weapon?: WeaponData; implementType?: ImplementType },
): ExpertiseBonus {
  const tier = expertiseTier(character.level);
  const applicable: string[] = [];
  const seen = new Map<string, number>();

  for (const featId of character.selectedFeatIds) {
    const occurrence = seen.get(featId) ?? 0;
    seen.set(featId, occurrence + 1);
    const name = getFeatById(featId)?.name ?? featId;

    if (target.weapon) {
      if (featId === 'hotf-two-handed-weapon-expertise' && isTwoHandedMelee(target.weapon)) {
        applicable.push(name);
      }
      if (featId === 'weapon-expertise' || featId === 'versatile-expertise') {
        const group = getFeatChoice(character, featId, occurrence, 'weapon-group');
        if (group && weaponInGroup(target.weapon, group)) applicable.push(`${name} (${group})`);
      }
    }

    if (target.implementType) {
      if (featId === 'hotf-totem-expertise' && target.implementType === 'Totem') {
        applicable.push(name);
      }
      if (featId === 'implement-expertise' || featId === 'versatile-expertise') {
        const type = getFeatChoice(character, featId, occurrence, 'implement-type');
        if (type && type === target.implementType) applicable.push(`${name} (${type})`);
      }
    }
  }

  if (applicable.length === 0) return NO_BONUS;
  // All Expertise feats share the same scaling, so the max is the tier value; kept
  // as an explicit max so a differently-scaled feat added later behaves correctly.
  return { bonus: tier, sources: applicable };
}

/** Choice feats whose choice is still unset — the reason a bonus is missing. */
export function pendingChoiceFeatNames(character: Character): string[] {
  const missing = getFeatChoiceSlots(character)
    .filter((s) => !s.value)
    .map((s) => s.featName);
  return Array.from(new Set(missing));
}
