import type { Character } from '../types/character';
import type { PowerData, McGrantedPower, McPowerChoice } from '../types/gameData';
import { getFeatById } from '../data/feats';
import { ALL_POWERS, getPowerById } from '../data/powers';

/**
 * Multiclass feat power grants.
 *
 * A multiclass feat borrows a power from its secondary class and almost always
 * changes how often you may use it — Arcane Initiate hands a bard a WIZARD
 * AT-WILL and lets them use it once per ENCOUNTER. The character sheet
 * therefore can't just render the source power: it has to render it at the
 * recharge the FEAT grants, which is what `resolveUsage` below does.
 *
 * Feats whose multiclass benefit is a class FEATURE rather than a power
 * (Sneak of Shadows → Sneak Attack, Warrior of the Wild → Hunter's Quarry) or
 * a bare numeric effect (Student of the Sword's +1 to one attack) carry no
 * `mcGrantedPowers` — there is no PowerData for them to point at.
 */

export interface McGrantedPowerSlot {
  /** Stable identity for React keys and for addressing the slot in handlers. */
  key: string;
  featId: string;
  featName: string;
  spec: McGrantedPower;
  /**
   * The power as the FEAT grants it: the source power with `usage` replaced by
   * the feat's. Undefined while a choice is still pending, or if the power id
   * no longer resolves (e.g. homebrew that has since been deleted).
   */
  power?: PowerData;
  /** True when this slot is a choice the player has not made yet. */
  needsChoice: boolean;
}

/**
 * Powers a `choose` spec allows.
 *
 * Note the `level >= 1` floor on the filtered path: level 0 is this codebase's
 * marker for an auto-granted class feature (wizard cantrips, warlock pact
 * boons, Wild Shape), and every one of these feats says "1st-level" — so a
 * level 0 power is never a legal pick. Choices that DO target level 0 powers
 * (the monk's Flurry of Blows) list them explicitly in `powerIds`, which skips
 * the filter entirely.
 */
export function getMcPowerCandidates(choose: McPowerChoice): PowerData[] {
  if (choose.powerIds?.length) {
    return choose.powerIds
      .map((id) => getPowerById(id))
      .filter((p): p is PowerData => !!p);
  }

  const maxLevel = choose.maxLevel ?? 1;
  return ALL_POWERS.filter((p) => {
    if (p.classId !== choose.classId) return false;
    if (choose.fromUsage && p.usage !== choose.fromUsage) return false;
    if (p.level < 1 || p.level > maxLevel) return false;
    if (p.cantrip || p.pactBoon) return false;
    if (choose.attackOnly && p.powerType === 'utility') return false;
    if (choose.requiredKeyword && !p.keywords.includes(choose.requiredKeyword)) return false;
    return true;
  }).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
}

/** The source power re-stamped with the usage the feat grants it at. */
function resolveUsage(power: PowerData, spec: McGrantedPower): PowerData {
  // Never mutate: PowerData objects are shared module-level singletons, and
  // the secondary class's own members must keep seeing the printed usage.
  return power.usage === spec.usage ? power : { ...power, usage: spec.usage };
}

/**
 * Every power slot the character's multiclass feats grant, filled or pending.
 * Pending slots are included so the UI can offer the picker.
 */
export function getMcGrantedPowerSlots(character: Character): McGrantedPowerSlot[] {
  const choices = character.mcFeatPowerChoices ?? {};
  const slots: McGrantedPowerSlot[] = [];
  const seenFeats = new Set<string>();

  for (const featId of character.selectedFeatIds) {
    // A multiclass feat can only be taken once; guard against a duplicate in
    // selectedFeatIds producing two copies of the same granted power.
    if (seenFeats.has(featId)) continue;
    const feat = getFeatById(featId);
    if (!feat?.mcGrantedPowers?.length) continue;
    seenFeats.add(featId);

    feat.mcGrantedPowers.forEach((spec, idx) => {
      const key = `${featId}:${idx}`;
      if (spec.choose) {
        const chosenId = choices[featId];
        const chosen = chosenId ? getPowerById(chosenId) : undefined;
        slots.push({
          key,
          featId,
          featName: feat.name,
          spec,
          power: chosen ? resolveUsage(chosen, spec) : undefined,
          needsChoice: !chosen,
        });
      } else if (spec.powerId) {
        const p = getPowerById(spec.powerId);
        slots.push({
          key,
          featId,
          featName: feat.name,
          spec,
          power: p ? resolveUsage(p, spec) : undefined,
          needsChoice: false,
        });
      }
    });
  }

  return slots;
}

/** Just the resolved powers, for panels that only render what exists. */
export function getMcGrantedPowers(character: Character): PowerData[] {
  return getMcGrantedPowerSlots(character)
    .map((s) => s.power)
    .filter((p): p is PowerData => !!p);
}

/** Slots still waiting on a pick — drives the "choose a power" prompts. */
export function getPendingMcPowerChoices(character: Character): McGrantedPowerSlot[] {
  return getMcGrantedPowerSlots(character).filter((s) => s.needsChoice);
}
