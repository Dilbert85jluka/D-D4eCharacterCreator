/** Total XP required to reach each level in D&D 4e. */
export const XP_THRESHOLDS: Record<number, number> = {
   1:        0,   2:    1_000,   3:    2_250,   4:    3_750,   5:    5_500,
   6:    7_500,   7:   10_000,   8:   13_000,   9:   16_500,  10:   20_500,
  11:   26_000,  12:   32_000,  13:   39_000,  14:   47_000,  15:   57_000,
  16:   69_000,  17:   83_000,  18:   99_000,  19:  119_000,  20:  143_000,
  21:  175_000,  22:  210_000,  23:  255_000,  24:  310_000,  25:  375_000,
  26:  450_000,  27:  540_000,  28:  650_000,  29:  780_000,  30: 1_000_000,
};

/** XP needed to reach the NEXT level from `level` (undefined at level 30). */
export function xpForNextLevel(level: number): number | undefined {
  return level < 30 ? XP_THRESHOLDS[level + 1] : undefined;
}

/** 0–100 progress percentage within the current level band. */
export function xpProgress(xp: number, level: number): number {
  if (level >= 30) return 100;
  const floor = XP_THRESHOLDS[level];
  const ceil  = XP_THRESHOLDS[level + 1];
  return Math.min(100, Math.max(0, ((xp - floor) / (ceil - floor)) * 100));
}
