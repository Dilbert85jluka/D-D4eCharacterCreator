/**
 * D&D 4e PHB character advancement constants (p.29 table).
 *
 * Feats are NOT granted at:
 *   - Encounter attack power levels : 3, 7, 13, 17, 23, 27
 *   - Daily attack power levels     : 5, 9, 15, 19, 25, 29
 *   - Paragon/Epic capstone levels  : 20 (paragon daily), 26 (epic destiny feature)
 */
export const FEAT_LEVELS: readonly number[] = [
  1, 2, 4, 6, 8, 10,          // Heroic Tier
  11, 12, 14, 16, 18,          // Paragon Tier
  21, 22, 24, 28, 30,          // Epic Tier
];

/**
 * Returns how many feat slots a character has earned by the given level.
 * Example: level 5 → 3 (feat levels 1, 2, 4 are ≤ 5).
 */
export function featsEarnedByLevel(level: number): number {
  return FEAT_LEVELS.filter((l) => l <= level).length;
}
