import { getClassById } from '../data/classes';

/**
 * Power point gain levels — these are the same levels where encounter
 * attack powers would normally be gained.  Psionic classes gain 2 PP
 * at each of these levels instead of an encounter power.
 */
const PP_LEVELS = [1, 3, 7, 13, 17, 23, 27] as const;

/** Check whether a class has the Psionic power source (Ardent, Battlemind, Monk, Psion). */
export function isPsionicClass(classId: string): boolean {
  return getClassById(classId)?.powerSource === 'Psionic';
}

/**
 * Check whether a class uses psionic power points and augmentation.
 * True for Ardent, Battlemind, Psion — NOT Monk (which is Psionic but uses
 * normal encounter powers instead of augmentation).
 */
export function usesPowerPoints(classId: string): boolean {
  const cls = getClassById(classId);
  return cls?.powerSource === 'Psionic' && cls.encounterPowerCount === 0;
}

/** Maximum power points for a psionic character at the given level. */
export function getMaxPowerPoints(level: number): number {
  return PP_LEVELS.filter((l) => l <= level).length * 2;
}

/** A single augment tier parsed from a power's `special` text. */
export interface AugmentOption {
  cost: number;
  description: string;
}

/**
 * Parse augment tiers from a power's `special` field.
 * Handles patterns like "Augment 1 Hit : ...", "Augment 2 Effect : ..." etc.
 * Returns an empty array for non-augmentable powers.
 */
export function parseAugments(special: string | undefined): AugmentOption[] {
  if (!special) return [];
  const results: AugmentOption[] = [];
  const regex = /Augment (\d+)\s+([\s\S]*?)(?=\s*Augment \d|$)/g;
  let match;
  while ((match = regex.exec(special)) !== null) {
    results.push({ cost: parseInt(match[1], 10), description: match[2].trim() });
  }
  return results;
}

/**
 * Extract any text that appears BEFORE the first "Augment N" marker.
 * E.g. "You can use this power unaugmented as a ranged basic attack."
 * Returns undefined if there is no prefix text.
 */
export function getNonAugmentSpecialText(special: string | undefined): string | undefined {
  if (!special) return undefined;
  const idx = special.indexOf('Augment ');
  if (idx <= 0) return undefined;
  const text = special.substring(0, idx).trim();
  return text || undefined;
}
