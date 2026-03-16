import type { RaceData } from '../../types/gameData';

export const halfOrc: RaceData = {
  id: 'half-orc',
  name: 'Half-Orc',
  size: 'Medium',
  speed: 6,
  vision: 'Low-light',
  languages: ['Common', 'Giant'],
  abilityBonuses: { dex: 2 },
  abilityBonusOptions: { amount: 2, options: ['con', 'str'] },
  skillBonuses: [
    { skillId: 'endurance', bonus: 2 },
    { skillId: 'intimidate', bonus: 2 },
  ],
  traits: [
    {
      name: 'Furious Assault',
      description: 'You have the furious assault power.',
    },
    {
      name: 'Half-Orc Resilience',
      description: 'The first time you are bloodied during an encounter, you gain 5 temporary hit points. The temporary hit points increase to 10 at 11th level and to 15 at 21st level.',
    },
    {
      name: 'Swift Charge',
      description: 'You gain a +2 bonus to speed when charging.',
    },
  ],
  racialPowerIds: ['racial-furious-assault'],
};
