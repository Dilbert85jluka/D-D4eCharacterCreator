import type { RaceData } from '../../types/gameData';

export const githzerai: RaceData = {
  id: 'githzerai',
  name: 'Githzerai',
  size: 'Medium',
  speed: 6,
  vision: 'Normal',
  languages: ['Common', 'Deep Speech'],
  abilityBonuses: { wis: 2 },
  abilityBonusOptions: { amount: 2, options: ['dex', 'int'] },
  skillBonuses: [
    { skillId: 'acrobatics', bonus: 2 },
    { skillId: 'athletics', bonus: 2 },
  ],
  initiativeBonus: 2,
  traits: [
    {
      name: 'Danger Sense',
      description: 'You have a +2 racial bonus to initiative checks.',
      source: 'PHB3',
    },
    {
      name: 'Defended Mind',
      description: 'You have a +2 racial bonus to saving throws against effects that daze, dominate, or stun.',
      source: 'PHB3',
      conditional: true,
    },
    {
      name: 'Iron Mind',
      description: 'You have the iron mind power.',
      source: 'PHB3',
    },
    {
      name: 'Shifting Fortunes',
      description: 'When you use your second wind, you can shift 3 squares as a free action.',
      source: 'PHB3',
    },
  ],
  racialPowerIds: ['racial-iron-mind'],
};
