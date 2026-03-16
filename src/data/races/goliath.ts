import type { RaceData } from '../../types/gameData';

export const goliath: RaceData = {
  id: 'goliath',
  name: 'Goliath',
  size: 'Medium',
  speed: 6,
  vision: 'Normal',
  languages: ['Common', 'Choice of one other'],
  bonusLanguageOptions: ['Dwarven', 'Giant'],
  abilityBonuses: { str: 2 },
  abilityBonusOptions: { amount: 2, options: ['con', 'wis'] },
  skillBonuses: [
    { skillId: 'athletics', bonus: 2 },
    { skillId: 'nature', bonus: 2 },
  ],
  willBonus: 1,
  traits: [
    {
      name: "Mountain's Tenacity",
      description: 'You have a +1 racial bonus to Will.',
    },
    {
      name: 'Powerful Athlete',
      description: 'When you make an Athletics check to jump or climb, roll twice and use either result.',
    },
    {
      name: "Stone's Endurance",
      description: "You have the stone's endurance power.",
    },
  ],
  racialPowerIds: ['racial-stones-endurance'],
};
