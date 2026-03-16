export function calculateAC(
  armorAcBonus: number,
  abilityMod: number,
  halfLevel: number,
  shieldBonus: number,
  featBonus: number = 0,
  enhancementBonus: number = 0,
): number {
  return 10 + armorAcBonus + abilityMod + halfLevel + shieldBonus + featBonus + enhancementBonus;
}

export function calculateFortitude(
  strMod: number,
  conMod: number,
  halfLevel: number,
  classBonus: number,
  racialBonus: number = 0,
  featBonus: number = 0,
  itemBonus: number = 0,
): number {
  return 10 + Math.max(strMod, conMod) + halfLevel + classBonus + racialBonus + featBonus + itemBonus;
}

export function calculateReflex(
  dexMod: number,
  intMod: number,
  halfLevel: number,
  classBonus: number,
  shieldBonus: number,
  racialBonus: number = 0,
  featBonus: number = 0,
  itemBonus: number = 0,
): number {
  return 10 + Math.max(dexMod, intMod) + halfLevel + classBonus + shieldBonus + racialBonus + featBonus + itemBonus;
}

export function calculateWill(
  wisMod: number,
  chaMod: number,
  halfLevel: number,
  classBonus: number,
  racialBonus: number = 0,
  featBonus: number = 0,
  itemBonus: number = 0,
): number {
  return 10 + Math.max(wisMod, chaMod) + halfLevel + classBonus + racialBonus + featBonus + itemBonus;
}
