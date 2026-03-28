export { WEAPONS } from './weapons';
export { ARMOR } from './armor';
export { MASTERWORK_ARMOR } from './masterworkArmor';
export { MAGIC_ARMOR } from './magicArmor';
export { MAGIC_WEAPONS } from './magicWeapons';
export { GEAR } from './gear';
export { CONSUMABLES } from './consumables';
export { MAGIC_ITEMS } from './magicItems';
export { IMPLEMENTS } from './implements';
export { SUPERIOR_IMPLEMENTS } from './superiorImplements';
export { MAGIC_IMPLEMENTS } from './magicImplements';

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
