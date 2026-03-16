export function calculateMaxHp(
  hpAtFirstLevel: number,
  hpPerLevel: number,
  conScore: number,
  level: number,
): number {
  return hpAtFirstLevel + conScore + hpPerLevel * (level - 1);
}

export function calculateBloodied(maxHp: number): number {
  return Math.floor(maxHp / 2);
}

export function calculateHealingSurgeValue(
  maxHp: number,
  conModifier: number,
  isDragonborn: boolean,
): number {
  const base = Math.floor(maxHp / 4);
  return isDragonborn ? base + conModifier : base;
}

export function calculateSurgesPerDay(
  baseSurgesPerDay: number,
  conModifier: number,
): number {
  return baseSurgesPerDay + conModifier;
}
