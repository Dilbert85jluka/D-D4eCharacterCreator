export { WEAPONS, registerHomebrewWeapons, unregisterHomebrewWeapons } from './weapons';
export { ARMOR, registerHomebrewArmor, unregisterHomebrewArmor } from './armor';
export { MASTERWORK_ARMOR } from './masterworkArmor';
export { MAGIC_ARMOR, registerHomebrewMagicArmor, unregisterHomebrewMagicArmor } from './magicArmor';
export { MAGIC_WEAPONS, registerHomebrewMagicWeapons, unregisterHomebrewMagicWeapons } from './magicWeapons';
export { GEAR, registerHomebrewGear, unregisterHomebrewGear } from './gear';
export { CONSUMABLES, registerHomebrewConsumables, unregisterHomebrewConsumables } from './consumables';
export { MAGIC_ITEMS, registerHomebrewMagicItems, unregisterHomebrewMagicItems } from './magicItems';
export { IMPLEMENTS } from './implements';
export { SUPERIOR_IMPLEMENTS } from './superiorImplements';
export { MAGIC_IMPLEMENTS, registerHomebrewMagicImplements, unregisterHomebrewMagicImplements } from './magicImplements';

export function getStartingGoldByClass(classId: string): number {
  const goldMap: Record<string, number> = {
    cleric: 100,
    fighter: 100,
    paladin: 100,
    ranger: 100,
    rogue: 100,
    warlock: 100,
    warlord: 100,
    wizard: 100,
  };
  return goldMap[classId] ?? 100;
}
