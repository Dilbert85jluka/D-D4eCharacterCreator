import type { RaceData } from '../../types/gameData';

export const deva: RaceData = {
  id: 'deva',
  name: 'Deva',
  size: 'Medium',
  speed: 6,
  vision: 'Normal',
  languages: ['Common', 'Choice of one other'],
  abilityBonuses: { wis: 2 },
  abilityBonusOptions: { amount: 2, options: ['cha', 'int'] },
  skillBonuses: [
    { skillId: 'history', bonus: 2 },
    { skillId: 'religion', bonus: 2 },
  ],
  traits: [
    {
      name: 'Astral Majesty',
      description: 'You have a +1 bonus to all defenses against attacks made by bloodied creatures.',
    },
    {
      name: 'Astral Resistance',
      description: 'You have resistance to necrotic damage and radiant damage equal to 5 + one-half your level.',
    },
    {
      name: 'Immortal Origin',
      description: 'Your spirit is native to the Astral Sea, so you are considered an immortal creature for the purpose of effects that relate to creature origin.',
    },
    {
      name: 'Memory of a Thousand Lifetimes',
      description: 'You have the memory of a thousand lifetimes power.',
    },
  ],
  racialPowerIds: ['racial-memory-of-a-thousand-lifetimes'],
};
