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
  traits: [
    {
      name: 'Danger Sense',
      description: '+2 racial bonus to initiative checks.',
    },
    {
      name: 'Defended Mind',
      description: '+2 racial bonus to saving throws against effects that daze, dominate, or stun.',
    },
    {
      name: 'Shifting Fortunes',
      description: 'When you use your second wind, you can shift 3 squares as a free action.',
    },
  ],
  racialPowerIds: ['racial-iron-mind'],
};
