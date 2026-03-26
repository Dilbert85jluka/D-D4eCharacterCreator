export function calculateSkillBonus(
  isTrained: boolean,
  abilityMod: number,
  halfLevel: number,
  racialBonus: number = 0,
  featBonus: number = 0,
  armorCheckPenalty: number = 0,
  itemBonus: number = 0,
): number {
  const trainedBonus = isTrained ? 5 : 0;
  return trainedBonus + abilityMod + halfLevel + racialBonus + featBonus - armorCheckPenalty + itemBonus;
}
