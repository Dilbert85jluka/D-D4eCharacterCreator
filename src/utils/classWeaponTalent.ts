import type { Character } from '../types/character';
import type { ClassWeaponTalent, WeaponData } from '../types/gameData';
import { getClassById } from '../data/classes';

/**
 * Class-feature weapon perks (Fighter Weapon Talent, Rogue Weapon Talent).
 *
 * Lives in one place because the attack bonus is rendered in
 * `CombatActionsPanel` while the damage die also feeds
 * `DerivedStats.equippedWeaponDamage` — two consumers that would otherwise
 * each need their own copy of the rule and could disagree about a rogue's
 * shuriken.
 */

export function getClassWeaponTalent(character: Character): ClassWeaponTalent | undefined {
  return getClassById(character.classId)?.weaponTalent;
}

function matchesName(names: string[] | undefined, weapon: WeaponData): boolean {
  // Undefined means "any weapon" — the Fighter's talent, which is narrowed by
  // requiresProficiency rather than by name.
  if (!names?.length) return true;
  return names.some((n) => n.toLowerCase() === weapon.name.toLowerCase());
}

/**
 * Attack-roll bonus this character's class talent grants with `weapon`.
 *
 * `proficient` is passed in rather than recomputed so the caller's single
 * `isProficientWithWeapon` result is reused — that lookup aggregates class,
 * feat, multiclass and paragon grants and isn't cheap.
 */
export function weaponTalentAttackBonus(
  character: Character,
  weapon: WeaponData,
  proficient: boolean,
): number {
  const talent = getClassWeaponTalent(character);
  if (!talent?.attackBonus) return 0;
  if (talent.requiresProficiency && !proficient) return 0;
  if (!matchesName(talent.attackWeaponNames, weapon)) return 0;
  return talent.attackBonus;
}

/**
 * The weapon's damage expression after any class-feature die replacement —
 * a rogue's shuriken reads `1d6`, not `1d4`.
 *
 * Only the die SIZE is replaced; the count is whatever the weapon data says,
 * so a hypothetical `2d4` weapon would become `2d6` rather than losing a die.
 */
export function effectiveWeaponDamage(character: Character, weapon: WeaponData): string {
  const talent = getClassWeaponTalent(character);
  if (!talent?.damageDie || !talent.damageDieWeaponNames?.length) return weapon.damage;
  if (!matchesName(talent.damageDieWeaponNames, weapon)) return weapon.damage;
  // Guard the no-op case so a data entry that already matches doesn't get
  // rewritten into something subtly different.
  const replaced = weapon.damage.replace(/d\d+/i, talent.damageDie);
  return replaced === weapon.damage ? weapon.damage : replaced;
}

/** True when `effectiveWeaponDamage` actually changed the weapon's die. */
export function hasDamageDieUpgrade(character: Character, weapon: WeaponData): boolean {
  return effectiveWeaponDamage(character, weapon) !== weapon.damage;
}
