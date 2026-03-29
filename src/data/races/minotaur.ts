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
  surgesPerDayBonus: 1,
  traits: [
    {
      name: 'Ferocity',
      description: 'When you drop to 0 hit points or fewer, you can make a melee basic attack as an immediate interrupt.',
      source: 'PHB3',
      conditional: true,
    },
    {
      name: 'Goring Charge',
      description: 'You have the goring charge power.',
      source: 'PHB3',
    },
    {
      name: 'Heedless Charge',
      description: 'You have a +2 racial bonus to AC against opportunity attacks you provoke during a charge.',
      source: 'PHB3',
      conditional: true,
    },
    {
      name: 'Vitality',
      description: 'You have one additional healing surge per day.',
      source: 'PHB3',
    },
    {
      name: 'Oversized',
      description: 'You can use weapons intended for Large creatures without penalty.',
      source: 'PHB3',
    },
  ],
  racialPowerIds: ['racial-goring-charge'],
};
