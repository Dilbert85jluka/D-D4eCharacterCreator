import type { WeaponData } from '../../types/gameData';

const OFFICIAL_WEAPONS: WeaponData[] = [
  // Simple Melee
  { id: 'club', name: 'Club', category: 'Simple Melee', proficiencyBonus: 2, damage: '1d6', properties: ['Mace'], cost: 1, weight: 3 },
  { id: 'dagger', name: 'Dagger', category: 'Simple Melee', proficiencyBonus: 3, damage: '1d4', properties: ['Light blade', 'Light thrown', 'Off-hand'], range: '5/10', cost: 1, weight: 1 },
  { id: 'greatclub', name: 'Greatclub', category: 'Simple Melee', proficiencyBonus: 2, damage: '2d4', properties: ['Mace', 'Two-handed'], cost: 1, weight: 10 },
  { id: 'javelin', name: 'Javelin', category: 'Simple Melee', proficiencyBonus: 2, damage: '1d6', properties: ['Spear', 'Heavy thrown'], range: '10/20', cost: 5, weight: 2 },
  { id: 'mace', name: 'Mace', category: 'Simple Melee', proficiencyBonus: 2, damage: '1d8', properties: ['Mace', 'Versatile'], cost: 5, weight: 6 },
  { id: 'monk-unarmed-strike', name: 'Monk unarmed strike', category: 'Simple Melee', proficiencyBonus: 3, damage: '1d8', properties: ['Unarmed', 'Off-hand'], cost: 0, weight: 0 },
  { id: 'morningstar', name: 'Morningstar', category: 'Simple Melee', proficiencyBonus: 2, damage: '1d10', properties: ['Mace', 'Two-handed'], cost: 10, weight: 8 },
  { id: 'quarterstaff', name: 'Quarterstaff', category: 'Simple Melee', proficiencyBonus: 2, damage: '1d8', properties: ['Staff', 'Two-handed'], cost: 5, weight: 4 },
  { id: 'scythe', name: 'Scythe', category: 'Simple Melee', proficiencyBonus: 2, damage: '2d4', properties: ['Heavy blade', 'Two-handed'], cost: 5, weight: 10 },
  { id: 'sickle', name: 'Sickle', category: 'Simple Melee', proficiencyBonus: 2, damage: '1d6', properties: ['Light blade', 'Off-hand'], cost: 2, weight: 2 },
  { id: 'spear', name: 'Spear', category: 'Simple Melee', proficiencyBonus: 2, damage: '1d8', properties: ['Spear', 'Versatile'], cost: 5, weight: 6 },
  // Simple Ranged
  { id: 'crossbow', name: 'Crossbow', category: 'Simple Ranged', proficiencyBonus: 2, damage: '1d8', properties: ['Crossbow', 'Load minor', 'Two-handed'], range: '15/30', cost: 25, weight: 4 },
  { id: 'hand-crossbow', name: 'Hand crossbow', category: 'Simple Ranged', proficiencyBonus: 2, damage: '1d6', properties: ['Crossbow', 'Load free'], range: '10/20', cost: 25, weight: 2 },
  { id: 'sling', name: 'Sling', category: 'Simple Ranged', proficiencyBonus: 2, damage: '1d6', properties: ['Sling', 'Load free'], range: '10/20', cost: 1, weight: 0 },
  // Military Melee
  { id: 'battleaxe', name: 'Battleaxe', category: 'Military Melee', proficiencyBonus: 2, damage: '1d10', properties: ['Axe', 'Versatile'], cost: 15, weight: 6 },
  { id: 'falchion', name: 'Falchion', category: 'Military Melee', proficiencyBonus: 3, damage: '2d4', properties: ['Heavy blade', 'High crit', 'Two-handed'], cost: 25, weight: 7 },
  { id: 'flail', name: 'Flail', category: 'Military Melee', proficiencyBonus: 2, damage: '1d10', properties: ['Flail', 'Versatile'], cost: 10, weight: 5 },
  { id: 'glaive', name: 'Glaive', category: 'Military Melee', proficiencyBonus: 2, damage: '2d4', properties: ['Heavy blade', 'Polearm', 'Reach', 'Two-handed'], cost: 25, weight: 10 },
  { id: 'greataxe', name: 'Greataxe', category: 'Military Melee', proficiencyBonus: 2, damage: '1d12', properties: ['Axe', 'High crit', 'Two-handed'], cost: 30, weight: 12 },
  { id: 'greatsword', name: 'Greatsword', category: 'Military Melee', proficiencyBonus: 3, damage: '1d10', properties: ['Heavy blade', 'Two-handed'], cost: 30, weight: 8 },
  { id: 'halberd', name: 'Halberd', category: 'Military Melee', proficiencyBonus: 2, damage: '1d10', properties: ['Axe', 'Polearm', 'Reach', 'Two-handed'], cost: 25, weight: 12 },
  { id: 'handaxe', name: 'Handaxe', category: 'Military Melee', proficiencyBonus: 2, damage: '1d6', properties: ['Axe', 'Off-hand', 'Heavy thrown'], range: '5/10', cost: 5, weight: 3 },
  { id: 'heavy-flail', name: 'Heavy flail', category: 'Military Melee', proficiencyBonus: 2, damage: '2d6', properties: ['Flail', 'Two-handed'], cost: 25, weight: 10 },
  { id: 'longspear', name: 'Longspear', category: 'Military Melee', proficiencyBonus: 2, damage: '1d10', properties: ['Polearm', 'Spear', 'Reach', 'Two-handed'], cost: 10, weight: 9 },
  { id: 'longsword', name: 'Longsword', category: 'Military Melee', proficiencyBonus: 3, damage: '1d8', properties: ['Heavy blade', 'Versatile'], cost: 15, weight: 4 },
  { id: 'maul', name: 'Maul', category: 'Military Melee', proficiencyBonus: 2, damage: '2d6', properties: ['Hammer', 'Two-handed'], cost: 30, weight: 12 },
  { id: 'rapier', name: 'Rapier', category: 'Military Melee', proficiencyBonus: 3, damage: '1d8', properties: ['Light blade'], cost: 25, weight: 2 },
  { id: 'scimitar', name: 'Scimitar', category: 'Military Melee', proficiencyBonus: 2, damage: '1d8', properties: ['Heavy blade', 'High crit'], cost: 10, weight: 4 },
  { id: 'short-sword', name: 'Short sword', category: 'Military Melee', proficiencyBonus: 3, damage: '1d6', properties: ['Light blade', 'Off-hand'], cost: 10, weight: 2 },
  { id: 'throwing-hammer', name: 'Throwing hammer', category: 'Military Melee', proficiencyBonus: 2, damage: '1d6', properties: ['Hammer', 'Off-hand', 'Heavy thrown'], range: '5/10', cost: 5, weight: 2 },
  { id: 'war-pick', name: 'War Pick', category: 'Military Melee', proficiencyBonus: 2, damage: '1d8', properties: ['Pick', 'Versatile', 'High crit'], cost: 15, weight: 6 },
  { id: 'warhammer', name: 'Warhammer', category: 'Military Melee', proficiencyBonus: 2, damage: '1d10', properties: ['Hammer', 'Versatile'], cost: 15, weight: 5 },
  // Military Ranged
  { id: 'longbow', name: 'Longbow', category: 'Military Ranged', proficiencyBonus: 2, damage: '1d10', properties: ['Bow', 'Load free', 'Two-handed'], range: '20/40', cost: 30, weight: 3 },
  { id: 'shortbow', name: 'Shortbow', category: 'Military Ranged', proficiencyBonus: 2, damage: '1d8', properties: ['Bow', 'Load free', 'Two-handed'], range: '15/30', cost: 25, weight: 2 },
  // Superior Melee
  { id: 'bastard-sword', name: 'Bastard sword', category: 'Superior Melee', proficiencyBonus: 3, damage: '1d10', properties: ['Heavy blade', 'Versatile'], cost: 30, weight: 6 },
  { id: 'katar', name: 'Katar', category: 'Superior Melee', proficiencyBonus: 3, damage: '1d6', properties: ['Light blade', 'High crit', 'Off-hand'], cost: 3, weight: 1 },
  { id: 'spiked-chain', name: 'Spiked chain', category: 'Superior Melee', proficiencyBonus: 3, damage: '2d4', properties: ['Flail', 'Reach', 'Two-handed'], cost: 30, weight: 10 },
  // Superior Ranged
  { id: 'shuriken', name: 'Shuriken', category: 'Superior Ranged', proficiencyBonus: 3, damage: '1d4', properties: ['Light blade', 'Light thrown'], range: '6/12', cost: 0, weight: 0.1 },
];

export let WEAPONS: WeaponData[] = [...OFFICIAL_WEAPONS];

export function registerHomebrewWeapons(items: WeaponData[]): void {
  WEAPONS = [...OFFICIAL_WEAPONS, ...items];
}
export function unregisterHomebrewWeapons(): void {
  WEAPONS = [...OFFICIAL_WEAPONS];
}
