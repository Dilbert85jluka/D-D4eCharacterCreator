import type { RaceData } from '../../types/gameData';

export const halfling: RaceData = {
  id: 'halfling',
  name: 'Halfling',
  size: 'Small',
  speed: 6,
  vision: 'Normal',
  languages: ['Common', 'Choice of one other'],
  // Always +2 DEX; player chooses +2 CHA or +2 CON
  abilityBonuses: { dex: 2 },
  abilityBonusOptions: { amount: 2, options: ['cha', 'con'] },
  skillBonuses: [
    { skillId: 'acrobatics', bonus: 2 },
    { skillId: 'thievery', bonus: 2 },
  ],
  traits: [
    {
      name: 'Bold',
      description: 'You gain a +5 racial bonus to saving throws against fear.',
    },
    {
      name: 'Nimble Reaction',
      description: 'You gain a +2 racial bonus to AC against opportunity attacks.',
    },
    {
      name: 'Second Chance',
      description: 'You can use second chance as an encounter power. Trigger: An enemy hits you. Effect (immediate interrupt): Force the enemy to reroll the attack. The enemy must use the second roll, even if it\'s lower.',
    },
  ],
  racialPowerIds: ['second-chance'],
};
