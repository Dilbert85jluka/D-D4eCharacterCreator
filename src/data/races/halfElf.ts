import type { RaceData } from '../../types/gameData';

export const halfElf: RaceData = {
  id: 'half-elf',
  name: 'Half-Elf',
  size: 'Medium',
  speed: 6,
  vision: 'Low-light',
  languages: ['Common', 'Elven', 'Choice of one other'],
  // Always +2 CON; player chooses +2 CHA or +2 WIS
  abilityBonuses: { con: 2 },
  abilityBonusOptions: { amount: 2, options: ['cha', 'wis'] },
  skillBonuses: [
    { skillId: 'diplomacy', bonus: 2 },
    { skillId: 'insight', bonus: 2 },
  ],
  traits: [
    {
      name: 'Dilettante',
      description: 'At 1st level, you choose an at-will power from a class different from yours. You can use that power as an encounter power.',
    },
    {
      name: 'Dual Heritage',
      description: 'You can take feats that have either elf or human as a prerequisite (as long as you meet any other requirements).',
    },
    {
      name: 'Group Diplomacy',
      description: 'You grant allies within 10 squares of you a +1 racial bonus to Diplomacy checks.',
    },
  ],
  racialPowerIds: [],
  bonusAtWill: true,
};
