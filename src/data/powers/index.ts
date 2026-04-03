import { avengerPowers } from './avengerPowers';
import { barbarianPowers } from './barbarianPowers';
import { bardPowers } from './bardPowers';
import { clericPowers } from './clericPowers';
import { druidPowers } from './druidPowers';
import { fighterPowers } from './fighterPowers';
import { invokerPowers } from './invokerPowers';
import { paladinPowers } from './paladinPowers';
import { rangerPowers } from './rangerPowers';
import { roguePowers } from './roguePowers';
import { shamanPowers } from './shamanPowers';
import { sorcererPowers } from './sorcererPowers';
import { wardenPowers } from './wardenPowers';
import { warlockPowers } from './warlockPowers';
import { warlordPowers } from './warlordPowers';
import { wizardPowers } from './wizardPowers';
// PHB3
import { ardentPowers } from './ardentPowers';
import { battlemindPowers } from './battlemindPowers';
import { monkPowers } from './monkPowers';
import { psionPowers } from './psionPowers';
import { runepriestPowers } from './runepriestPowers';
import { seekerPowers } from './seekerPowers';
import { RACIAL_POWERS } from './racial';
import { featPowers } from './featPowers';
import type { PowerData, PowerUsage } from '../../types/gameData';

const OFFICIAL_POWERS: PowerData[] = [
  ...avengerPowers,
  ...barbarianPowers,
  ...bardPowers,
  ...clericPowers,
  ...druidPowers,
  ...fighterPowers,
  ...invokerPowers,
  ...paladinPowers,
  ...rangerPowers,
  ...roguePowers,
  ...shamanPowers,
  ...sorcererPowers,
  ...wardenPowers,
  ...warlockPowers,
  ...warlordPowers,
  ...wizardPowers,
  // PHB3
  ...ardentPowers,
  ...battlemindPowers,
  ...monkPowers,
  ...psionPowers,
  ...runepriestPowers,
  ...seekerPowers,
  ...RACIAL_POWERS,
  ...featPowers,
];

// Mutable array that includes official + homebrew powers
export let ALL_POWERS: PowerData[] = [...OFFICIAL_POWERS];

/** Register homebrew powers into the global powers array */
export function registerHomebrewPowers(powers: PowerData[]): void {
  ALL_POWERS = [...OFFICIAL_POWERS, ...powers];
}

/** Remove all homebrew powers, restoring to official-only */
export function unregisterHomebrewPowers(): void {
  ALL_POWERS = [...OFFICIAL_POWERS];
}

export function getPowerById(id: string): PowerData | undefined {
  return ALL_POWERS.find((p) => p.id === id);
}

export function getPowersByClass(
  classId: string,
  usage?: PowerUsage,
  level?: number,
): PowerData[] {
  return ALL_POWERS.filter(
    (p) =>
      p.classId === classId &&
      (usage === undefined || p.usage === usage) &&
      (level === undefined || p.level === level),
  );
}

/**
 * Returns all powers for a class up to and including the given character level.
 * Optionally filter by usage type.
 */
export function getPowersByClassUpToLevel(
  classId: string,
  characterLevel: number,
  usage?: PowerUsage,
): PowerData[] {
  return ALL_POWERS.filter(
    (p) =>
      p.classId === classId &&
      p.level <= characterLevel &&
      (usage === undefined || p.usage === usage),
  );
}

/** Returns utility powers (powerType === 'utility') for a class at a specific power level. */
export function getUtilityPowersByClass(classId: string, level: number): PowerData[] {
  return ALL_POWERS.filter(
    (p) => p.classId === classId && p.powerType === 'utility' && p.level === level,
  );
}

/** Returns all utility powers (powerType === 'utility') for a class up to and including characterLevel. */
export function getUtilityPowersByClassUpToLevel(classId: string, characterLevel: number): PowerData[] {
  return ALL_POWERS.filter(
    (p) => p.classId === classId && p.powerType === 'utility' && p.level <= characterLevel,
  );
}
