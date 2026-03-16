import type { WeaponData } from '../../types/gameData';

export const WEAPONS: WeaponData[] = [
  // Simple Melee
  { id: 'club',            name: 'Club',            category: 'Simple Melee',    proficiencyBonus: 2, damage: '1d6',  properties: ['Off-hand'],                                 cost: 1,   weight: 4  },
  { id: 'dagger',          name: 'Dagger',          category: 'Simple Melee',    proficiencyBonus: 3, damage: '1d4',  properties: ['Light blade', 'Off-hand', 'Light thrown'],  cost: 1,   weight: 1  },
  { id: 'handaxe',         name: 'Handaxe',         category: 'Simple Melee',    proficiencyBonus: 2, damage: '1d6',  properties: ['Axe', 'Off-hand', 'Heavy thrown'],          cost: 5,   weight: 3  },
  { id: 'javelin',         name: 'Javelin',         category: 'Simple Melee',    proficiencyBonus: 2, damage: '1d6',  properties: ['Spear', 'Heavy thrown'],                    cost: 5,   weight: 2  },
  { id: 'throwing-hammer', name: 'Throwing Hammer', category: 'Simple Melee',   proficiencyBonus: 2, damage: '1d6',  properties: ['Hammer', 'Off-hand', 'Heavy thrown'],       cost: 5,   weight: 3  },
  { id: 'mace',            name: 'Mace',            category: 'Simple Melee',    proficiencyBonus: 2, damage: '1d8',  properties: ['Mace'],                                     cost: 5,   weight: 8  },
  { id: 'quarterstaff',    name: 'Quarterstaff',    category: 'Simple Melee',    proficiencyBonus: 2, damage: '1d8',  properties: ['Staff', 'Versatile'],                       cost: 5,   weight: 4  },
  { id: 'sickle',          name: 'Sickle',          category: 'Simple Melee',    proficiencyBonus: 2, damage: '1d6',  properties: ['Light blade', 'Off-hand'],                  cost: 2,   weight: 2  },
  { id: 'spear',           name: 'Spear',           category: 'Simple Melee',    proficiencyBonus: 2, damage: '1d8',  properties: ['Spear', 'Versatile'],                       cost: 5,   weight: 6  },
  // Military Melee
  { id: 'bastard-sword',   name: 'Bastard Sword',   category: 'Military Melee',  proficiencyBonus: 3, damage: '1d10', properties: ['Heavy blade', 'Versatile'],                 cost: 30,  weight: 6  },
  { id: 'battleaxe',       name: 'Battleaxe',       category: 'Military Melee',  proficiencyBonus: 2, damage: '1d10', properties: ['Axe', 'Versatile'],                         cost: 15,  weight: 6  },
  { id: 'flail',           name: 'Flail',           category: 'Military Melee',  proficiencyBonus: 2, damage: '1d10', properties: ['Flail'],                                    cost: 10,  weight: 5  },
  { id: 'greatsword',      name: 'Greatsword',      category: 'Military Melee',  proficiencyBonus: 3, damage: '1d10', properties: ['Heavy blade', 'Two-handed'],                cost: 30,  weight: 8  },
  { id: 'greataxe',        name: 'Greataxe',        category: 'Military Melee',  proficiencyBonus: 2, damage: '1d12', properties: ['Axe', 'Two-handed'],                        cost: 30,  weight: 12 },
  { id: 'halberd',         name: 'Halberd',         category: 'Military Melee',  proficiencyBonus: 2, damage: '1d10', properties: ['Axe', 'Polearm', 'Reach', 'Two-handed'],   cost: 25,  weight: 12 },
  { id: 'kama',            name: 'Kama',            category: 'Military Melee',  proficiencyBonus: 3, damage: '1d6',  properties: ['Light blade', 'Off-hand'],                  cost: 5,   weight: 2  },
  { id: 'khopesh',         name: 'Khopesh',         category: 'Military Melee',  proficiencyBonus: 2, damage: '1d8',  properties: ['Heavy blade', 'Off-hand'],                  cost: 20,  weight: 8  },
  { id: 'longsword',       name: 'Longsword',       category: 'Military Melee',  proficiencyBonus: 3, damage: '1d8',  properties: ['Heavy blade', 'Versatile'],                 cost: 15,  weight: 4  },
  { id: 'morningstar',     name: 'Morningstar',     category: 'Military Melee',  proficiencyBonus: 2, damage: '1d10', properties: ['Mace'],                                     cost: 12,  weight: 8  },
  { id: 'scimitar',        name: 'Scimitar',        category: 'Military Melee',  proficiencyBonus: 2, damage: '1d8',  properties: ['Heavy blade', 'Off-hand'],                  cost: 10,  weight: 4  },
  { id: 'shortsword',      name: 'Shortsword',      category: 'Military Melee',  proficiencyBonus: 3, damage: '1d6',  properties: ['Light blade', 'Off-hand'],                  cost: 10,  weight: 2  },
  { id: 'war-pick',        name: 'War Pick',        category: 'Military Melee',  proficiencyBonus: 2, damage: '1d8',  properties: ['Pick'],                                     cost: 15,  weight: 6  },
  { id: 'warhammer',       name: 'Warhammer',       category: 'Military Melee',  proficiencyBonus: 2, damage: '1d10', properties: ['Hammer', 'Versatile'],                      cost: 15,  weight: 5  },
  // Simple Ranged
  { id: 'crossbow',        name: 'Crossbow',        category: 'Simple Ranged',   proficiencyBonus: 2, damage: '1d8',  range: '15/30',  properties: ['Crossbow', 'Load minor'], cost: 25,  weight: 4  },
  { id: 'hand-crossbow',   name: 'Hand Crossbow',   category: 'Simple Ranged',   proficiencyBonus: 2, damage: '1d6',  range: '10/20',  properties: ['Crossbow', 'Load free', 'Off-hand'], cost: 25, weight: 2 },
  { id: 'shuriken',        name: 'Shuriken',        category: 'Simple Ranged',   proficiencyBonus: 3, damage: '1d4',  range: '4/8',    properties: ['Light thrown', 'Off-hand'], cost: 1,  weight: 0  },
  { id: 'sling',           name: 'Sling',           category: 'Simple Ranged',   proficiencyBonus: 2, damage: '1d6',  range: '10/20',  properties: ['Sling'],                  cost: 1,   weight: 0  },
  // Military Ranged
  { id: 'longbow',         name: 'Longbow',         category: 'Military Ranged', proficiencyBonus: 2, damage: '1d10', range: '20/40',  properties: ['Bow', 'Load free', 'Two-handed'], cost: 30, weight: 3 },
  { id: 'shortbow',        name: 'Shortbow',        category: 'Military Ranged', proficiencyBonus: 2, damage: '1d8',  range: '15/30',  properties: ['Bow', 'Load free'],       cost: 25,  weight: 2  },
];
