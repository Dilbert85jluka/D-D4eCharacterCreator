import type { RaceData } from '../../types/gameData';

export const minotaur: RaceData = {
  id: 'minotaur',
  name: 'Minotaur',
  size: 'Medium',
  speed: 6,
  vision: 'Normal',
  languages: ['Common', 'Choice of one other'],
  abilityBonuses: { str: 2 },
  abilityBonusOptions: { amount: 2, options: ['con', 'wis'] },
  skillBonuses: [
    { skillId: 'nature', bonus: 2 },
    { skillId: 'perception', bonus: 2 },
  ],
  traits: [
    {
      name: 'Ferocity',
      description: 'When you drop to 0 hit points or fewer, you can make a melee basic attack as an immediate interrupt.',
    },
    {
      name: 'Heedless Charge',
      description: '+2 racial bonus to AC against opportunity attacks you provoke during a charge.',
    },
    {
      name: 'Vitality',
      description: 'You have one additional healing surge.',
    },
    {
      name: 'Oversized',
      description: 'You can use weapons intended for Large creatures without penalty.',
    },
  ],
  racialPowerIds: ['racial-goring-charge'],
};
