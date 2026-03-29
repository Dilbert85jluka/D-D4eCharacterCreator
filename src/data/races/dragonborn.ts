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
      name: 'Draconic Heritage',
      description: 'Your healing surge value is equal to one-quarter of your maximum hit points + your Constitution modifier.',
      source: 'PHB',
    },
    {
      name: 'Dragonborn Fury',
      description: 'While you are bloodied, you gain a +1 racial bonus to attack rolls.',
      source: 'PHB',
      conditional: true,
    },
    {
      name: 'Dragon Breath',
      description: 'You have the dragon breath power. When you create your character, choose a damage type: acid, cold, fire, lightning, or poison.',
      source: 'PHB',
    },
    {
      name: 'Dragonfear',
      description: 'You are naturally intimidating at the best of times, and when passions strike, you are positively terrifying. You gain the dragonfear racial power. (Replaces Dragon Breath.)',
      source: 'HotFK',
    },
  ],
  racialPowerIds: ['dragon-breath'],
};
