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
          description: 'You have the longtooth shifting power. While bloodied, you gain regeneration 2. This increases to regeneration 4 at 11th level and regeneration 6 at 21st level.',
          source: 'PHB2',
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
          description: 'You have the razorclaw shifting power. Your speed increases by 2 and you gain a +1 bonus to AC and Reflex until the end of the encounter.',
          source: 'PHB2',
        },
      ],
      racialPowerIds: ['racial-razorclaw-shifting'],
    },
  ],
};
