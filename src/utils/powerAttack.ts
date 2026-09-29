import type { Ability, Character, DerivedStats, EquipmentItem } from '../types/character';
import type { PowerData, WeaponData } from '../types/gameData';
import { resolveEnhancementTargets } from '../types/gameData';
import { WEAPONS } from '../data/equipment/weapons';
import { MAGIC_WEAPONS } from '../data/equipment/magicWeapons';
import { IMPLEMENTS } from '../data/equipment/implements';
import { SUPERIOR_IMPLEMENTS } from '../data/equipment/superiorImplements';
import { MAGIC_IMPLEMENTS } from '../data/equipment/magicImplements';
import { getClassById } from '../data/classes';
import { isProficientWithWeapon } from './proficiencies';
import { weaponTalentAttackBonus } from './classWeaponTalent';
import { expertiseAttackBonus, pendingChoiceFeatNames } from './featChoices';

/**
 * The attack modifier a power actually rolls with, per equipped weapon/implement.
 *
 * A power's attack line ("Strength vs. AC") names the ability and the defense but
 * not the number, and the number is NOT one number: a Weapon-keyword power rolls
 * with whichever weapon you swing, and a longsword's +3 proficiency, a club's +2
 * and a magic weapon's enhancement all land on the same roll. So this returns one
 * row per equipped tool rather than a single total.
 *
 * The arithmetic deliberately mirrors `CombatActionsPanel`, which is where the same
 * bonuses are already shown for basic attacks — a power card and a basic attack with
 * the same weapon must not disagree about the proficiency bonus.
 *
 * WHAT IS AND ISN'T COUNTED
 *  • Weapon proficiency bonus applies only with the Weapon keyword, and only when
 *    the character is proficient. Implements have no proficiency bonus in 4e — an
 *    implement contributes its enhancement bonus and nothing else.
 *  • Conditional bonuses written into the attack prose ("+2 if no enemy is adjacent")
 *    are left out on purpose; they stay readable in the text above the breakdown.
 *  • Expertise feats ARE applied, through `expertiseAttackBonus`. The three that make
 *    you choose a weapon group / implement type only count once that choice has been
 *    made in the Feats tab; until then `pendingChoiceFeats` names them, so a missing
 *    1–3 is visible rather than silent. Expertise bonuses are feat bonuses and so do
 *    not stack with each other — the resolver returns the highest, not the sum.
 */

const ABILITY_LABELS: Record<Ability, string> = {
  str: 'STR', con: 'CON', dex: 'DEX', int: 'INT', wis: 'WIS', cha: 'CHA',
};

export interface AttackBonusPart {
  label: string;
  value: number;
  /** Where it came from, when the short label doesn't say (e.g. which Expertise feat). */
  note?: string;
}

export interface AttackBonusRow {
  /** Equipment instanceId/itemId, for React keys. */
  key: string;
  /** The weapon or implement this row is for. */
  label: string;
  total: number;
  parts: AttackBonusPart[];
  /** Set when the character can't legally attack with this tool. */
  warning?: string;
}

export interface PowerAttackInfo {
  /** 'AC' | 'Fortitude' | 'Reflex' | 'Will' */
  defense: string;
  abilityLabel: string;
  /** Which kind of tool the power's keywords say it is rolled with. */
  kind: 'weapon' | 'implement' | 'none';
  /** For weapon powers: which equipped weapons the range restricts it to, if any. */
  reach: WeaponReach;
  rows: AttackBonusRow[];
  /** Nothing equipped that this power can be used with. */
  emptyHint?: string;
  /** Expertise feats whose weapon group / implement type hasn't been chosen yet, so
   *  their bonus is missing from every row until the player picks one. */
  pendingChoiceFeats: string[];
}

/** An unconditional power bonus written into the attack line, e.g. "Strength + 2 vs. AC".
 *  Only a `+N` that appears BEFORE "vs" counts; anything after it is conditional prose. */
function flatPowerBonus(attack: string | undefined): number {
  const m = attack?.match(/^[^.]*?\+\s*(\d+)\s+vs/i);
  return m ? Number(m[1]) : 0;
}

function magicWeaponEnhancement(item: EquipmentItem): number {
  if (!item.magicWeaponId) return 0;
  const mw = MAGIC_WEAPONS.find((m) => m.id === item.magicWeaponId);
  if (!mw) return 0;
  if (!resolveEnhancementTargets(mw).includes('attack')) return 0;
  return mw.tiers.find((t) => t.level === item.magicWeaponTier)?.enhancement ?? 0;
}

function magicImplementEnhancement(item: EquipmentItem): number {
  if (!item.magicImplementId) return 0;
  const mi = MAGIC_IMPLEMENTS.find((m) => m.id === item.magicImplementId);
  if (!mi) return 0;
  if (!resolveEnhancementTargets(mi).includes('attack')) return 0;
  return mi.tiers.find((t) => t.level === item.magicImplementTier)?.enhancement ?? 0;
}

function itemKeyOf(item: EquipmentItem): string {
  return item.instanceId ?? item.itemId;
}

/** Everything the row builders need that isn't the equipment item itself. */
interface RowContext {
  abilityLabel: string;
  abilityMod: number;
  halfLevel: number;
  powerBonus: number;
  magicItemAttack: number;
}

/**
 * Which equipped weapons a power can actually be rolled with, read off its `range`.
 *
 * Only the ranges that state this outright are filtered on — "Melee weapon",
 * "Melee 1", "Ranged weapon", "Ranged 5", "Melee or Ranged weapon" and friends,
 * which between them cover the large majority of Weapon-keyword powers. The rest
 * ("Close burst 1", "Close blast 3", "Area burst 2 within weapon range") do not
 * say what they are wielded with in a form this can read, so they are NOT filtered:
 * listing a weapon the player can't use is recoverable, hiding one they can is not.
 */
export type WeaponReach = 'melee' | 'ranged' | 'either' | null;

export function weaponReachFor(range: string | undefined): WeaponReach {
  if (!range) return null;
  const r = range.trim().toLowerCase();
  if (r.startsWith('melee or ranged') || r.startsWith('ranged or melee')) return 'either';
  if (r.startsWith('melee')) return 'melee';
  if (r.startsWith('ranged')) return 'ranged';
  return null;
}

function isRangedWeapon(weapon: WeaponData): boolean {
  return weapon.category.toLowerCase().includes('ranged');
}

/** A thrown melee weapon counts for a power that calls for a ranged weapon — that is
 *  what the Heavy/Light thrown properties are for. Kept inclusive on purpose. */
function canThrow(weapon: WeaponData): boolean {
  return weapon.properties.some((p) => /thrown/i.test(p));
}

function weaponMatchesReach(weapon: WeaponData, reach: WeaponReach): boolean {
  switch (reach) {
    case 'melee':  return !isRangedWeapon(weapon);
    case 'ranged': return isRangedWeapon(weapon) || canThrow(weapon);
    default:       return true; // 'either' and null both list everything
  }
}

function weaponRows(character: Character, ctx: RowContext, reach: WeaponReach): AttackBonusRow[] {
  const { abilityLabel, abilityMod, halfLevel, powerBonus, magicItemAttack } = ctx;
  const rows: AttackBonusRow[] = [];

  for (const item of character.equipment) {
    if (!item.equipped) continue;
    const weapon = WEAPONS.find((w) => w.id === item.itemId);
    if (!weapon) continue;
    if (!weaponMatchesReach(weapon, reach)) continue;

    const proficient = isProficientWithWeapon(character, weapon);
    const parts: AttackBonusPart[] = [{ label: abilityLabel, value: abilityMod }];
    if (halfLevel) parts.push({ label: '½ lvl', value: halfLevel });
    if (proficient && weapon.proficiencyBonus) {
      parts.push({ label: 'prof', value: weapon.proficiencyBonus });
    }
    const enh = magicWeaponEnhancement(item);
    if (enh) parts.push({ label: 'enh', value: enh });
    const talent = weaponTalentAttackBonus(character, weapon, proficient);
    if (talent) parts.push({ label: 'talent', value: talent });
    // Expertise feats. Untyped class talents above stack with this; two Expertise
    // feats do not stack with each other (see expertiseAttackBonus).
    const expertise = expertiseAttackBonus(character, { weapon });
    if (expertise.bonus) parts.push({ label: 'feat', value: expertise.bonus, note: expertise.sources.join(', ') });
    if (magicItemAttack) parts.push({ label: 'item', value: magicItemAttack });
    if (powerBonus) parts.push({ label: 'power', value: powerBonus });

    rows.push({
      key: itemKeyOf(item),
      label: weapon.name,
      total: parts.reduce((s, p) => s + p.value, 0),
      parts,
      warning: proficient ? undefined : 'not proficient',
    });
  }

  return rows;
}

function implementRows(character: Character, ctx: RowContext): AttackBonusRow[] {
  const { abilityLabel, abilityMod, halfLevel, powerBonus, magicItemAttack } = ctx;
  const rows: AttackBonusRow[] = [];
  const classImplements = getClassById(character.classId)?.implements ?? [];
  // Which superior implements this character has Superior Implement Training for.
  const trainedSuperior = new Set(Object.values(character.superiorImplementChoices ?? {}));

  for (const item of character.equipment) {
    if (!item.equipped || item.slot !== 'implement') continue;
    const basic = IMPLEMENTS.find((i) => i.id === item.itemId);
    const superior = SUPERIOR_IMPLEMENTS.find((i) => i.id === item.itemId);
    const base = basic ?? superior;
    if (!base) continue;

    const parts: AttackBonusPart[] = [{ label: abilityLabel, value: abilityMod }];
    if (halfLevel) parts.push({ label: '½ lvl', value: halfLevel });
    const enh = magicImplementEnhancement(item);
    if (enh) parts.push({ label: 'enh', value: enh });

    // A superior implement is only usable with Superior Implement Training, so its
    // Accurate property only counts once the feat instance is linked to this item.
    const trained = !superior || trainedSuperior.has(itemKeyOf(item));
    const accurate = superior?.properties.some((p) => p.name === 'Accurate') ?? false;
    if (accurate && trained) parts.push({ label: 'accurate', value: 1 });

    const expertise = expertiseAttackBonus(character, { implementType: base.type });
    if (expertise.bonus) parts.push({ label: 'feat', value: expertise.bonus, note: expertise.sources.join(', ') });

    if (magicItemAttack) parts.push({ label: 'item', value: magicItemAttack });
    if (powerBonus) parts.push({ label: 'power', value: powerBonus });

    const usableByClass = classImplements.length === 0 || classImplements.includes(base.type);
    const warning = !usableByClass
      ? 'class can\'t use this implement'
      : !trained
        ? 'needs Superior Implement Training'
        : undefined;

    rows.push({
      key: itemKeyOf(item),
      label: base.name,
      total: parts.reduce((s, p) => s + p.value, 0),
      parts,
      warning,
    });
  }

  return rows;
}

/**
 * Build the per-tool attack breakdown for a power, or null when the power has no
 * structured attack (utilities, and the handful of powers with no `attackAbility`).
 */
export function getPowerAttackInfo(
  character: Character,
  derived: DerivedStats,
  power: PowerData,
): PowerAttackInfo | null {
  if (!power.attackAbility || !power.defense) return null;

  const abilityMod = derived.abilityModifiers[power.attackAbility] ?? 0;
  const halfLevel = Math.floor(character.level / 2);
  const powerBonus = flatPowerBonus(power.attack);

  const isWeapon = power.keywords.includes('Weapon');
  const isImplement = power.keywords.includes('Implement');
  const kind: PowerAttackInfo['kind'] = isWeapon ? 'weapon' : isImplement ? 'implement' : 'none';

  const abilityLabel = ABILITY_LABELS[power.attackAbility];
  const ctx: RowContext = {
    abilityLabel,
    abilityMod,
    halfLevel,
    powerBonus,
    magicItemAttack: derived.magicItemAttackBonus,
  };

  const reach = kind === 'weapon' ? weaponReachFor(power.range) : null;

  let rows: AttackBonusRow[];
  let emptyHint: string | undefined;

  if (kind === 'weapon') {
    rows = weaponRows(character, ctx, reach);
    if (rows.length === 0) {
      emptyHint =
        reach === 'melee'  ? 'No melee weapon equipped'
        : reach === 'ranged' ? 'No ranged or thrown weapon equipped'
        : 'No weapon equipped';
    }
  } else if (kind === 'implement') {
    rows = implementRows(character, ctx);
    if (rows.length === 0) emptyHint = 'No implement equipped';
  } else {
    // No Weapon/Implement keyword: nothing you hold changes the roll.
    const parts: AttackBonusPart[] = [{ label: abilityLabel, value: abilityMod }];
    if (halfLevel) parts.push({ label: '½ lvl', value: halfLevel });
    if (derived.magicItemAttackBonus) {
      parts.push({ label: 'item', value: derived.magicItemAttackBonus });
    }
    if (powerBonus) parts.push({ label: 'power', value: powerBonus });
    rows = [{
      key: 'no-tool',
      label: 'Attack bonus',
      total: parts.reduce((s, p) => s + p.value, 0),
      parts,
    }];
  }

  const pendingChoiceFeats = pendingChoiceFeatNames(character);

  return {
    defense: power.defense,
    abilityLabel,
    kind,
    reach,
    rows,
    emptyHint,
    pendingChoiceFeats,
  };
}
