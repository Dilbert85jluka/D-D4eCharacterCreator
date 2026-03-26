import type { ArmorData } from '../../types/gameData';

export const ARMOR: ArmorData[] = [
  // Light armor — no speed penalty
  { id: 'cloth',      name: 'Cloth Armor',    type: 'Cloth',    acBonus: 0,  checkPenalty: 0,  speedPenalty: 0, cost: 1,   weight: 4  },
  { id: 'leather',    name: 'Leather Armor',  type: 'Leather',  acBonus: 2,  checkPenalty: 0,  speedPenalty: 0, cost: 25,  weight: 15 },
  // Heavy armor — speed -1 (PHB p.214)
  { id: 'hide',       name: 'Hide Armor',     type: 'Hide',     acBonus: 3,  checkPenalty: -1, speedPenalty: -1, cost: 30,  weight: 25 },
  { id: 'chainmail',  name: 'Chainmail',      type: 'Chainmail',acBonus: 6,  checkPenalty: -1, speedPenalty: -1, minStrength: 13, cost: 40,  weight: 40 },
  { id: 'scale',      name: 'Scale Armor',    type: 'Scale',    acBonus: 7,  checkPenalty: 0,  speedPenalty: -1, minStrength: 13, cost: 45,  weight: 45 },
  { id: 'plate',      name: 'Plate Armor',    type: 'Plate',    acBonus: 8,  checkPenalty: -2, speedPenalty: -1, minStrength: 15, cost: 50,  weight: 50 },
  // Shields — no speed penalty
  { id: 'light-shield', name: 'Light Shield', type: 'Shield',   acBonus: 1,  checkPenalty: -1, speedPenalty: 0, cost: 5,   weight: 6  },
  { id: 'heavy-shield', name: 'Heavy Shield', type: 'Shield',   acBonus: 2,  checkPenalty: -2, speedPenalty: 0, cost: 10,  weight: 15 },
];
