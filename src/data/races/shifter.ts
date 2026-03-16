import type { RaceData } from '../../types/gameData';

export const shifter: RaceData = {
  id: 'shifter',
  name: 'Shifter',
  size: 'Medium',
  speed: 6,
  vision: 'Low-light',
  languages: ['Common', 'Choice of one other'],
  // Base ability bonuses are empty — subraces provide them
  abilityBonuses: {},
  skillBonuses: [],
  traits: [],
  racialPowerIds: [],
  subraces: [
    {
      id: 'longtooth',
      name: 'Longtooth Shifter',
      abilityBonuses: { str: 2, wis: 2 },
      skillBonuses: [
        { skillId: 'athletics', bonus: 2 },
        { skillId: 'endurance', bonus: 2 },
      ],
      traits: [
        {
          name: 'Longtooth Shifting',
          description: 'You have the longtooth shifting power.',
        },
      ],
      racialPowerIds: ['racial-longtooth-shifting'],
    },
    {
      id: 'razorclaw',
      name: 'Razorclaw Shifter',
      abilityBonuses: { dex: 2, wis: 2 },
      skillBonuses: [
        { skillId: 'acrobatics', bonus: 2 },
        { skillId: 'stealth', bonus: 2 },
      ],
      traits: [
        {
          name: 'Razorclaw Shifting',
          description: 'You have the razorclaw shifting power.',
        },
      ],
      racialPowerIds: ['racial-razorclaw-shifting'],
    },
  ],
};
