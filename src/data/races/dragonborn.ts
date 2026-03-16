import type { RaceData } from '../../types/gameData';

export const dragonborn: RaceData = {
  id: 'dragonborn',
  name: 'Dragonborn',
  size: 'Medium',
  speed: 6,
  vision: 'Normal',
  languages: ['Common', 'Draconic'],
  // Always +2 CHA; player chooses +2 CON or +2 STR
  abilityBonuses: { cha: 2 },
  abilityBonusOptions: { amount: 2, options: ['con', 'str'] },
  skillBonuses: [
    { skillId: 'history', bonus: 2 },
    { skillId: 'intimidate', bonus: 2 },
  ],
  traits: [
    {
      name: 'Dragonborn Fury',
      description: 'When you are bloodied, you gain a +1 racial bonus to attack rolls.',
    },
    {
      name: 'Draconic Heritage',
      description: 'Your healing surge value equals one-quarter of your maximum hit points plus your Constitution modifier.',
    },
    {
      name: 'Dragon Breath',
      description: 'You can use dragon breath as an encounter power. Choose a damage type when you create your character: acid, cold, fire, lightning, or poison.',
    },
  ],
  racialPowerIds: ['dragon-breath'],
};
