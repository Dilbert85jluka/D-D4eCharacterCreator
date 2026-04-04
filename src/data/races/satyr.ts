import type { RaceData } from '../../types/gameData';

export const satyr: RaceData = {
  id: 'satyr',
  name: 'Satyr',
  size: 'Medium',
  speed: 6,
  vision: 'Low-light',
  languages: ['Common', 'Elven'],
  // Always +2 CHA; player chooses +2 CON or +2 DEX
  abilityBonuses: { cha: 2 },
  abilityBonusOptions: { amount: 2, options: ['con', 'dex'] },
  skillBonuses: [
    { skillId: 'nature', bonus: 2 },
    { skillId: 'thievery', bonus: 2 },
  ],
  traits: [
    {
      name: 'Male Only',
      description: 'All satyrs are male.',
      source: 'HotF',
    },
    {
      name: 'Fey Origin',
      description: 'Your ancestors were native to the Feywild, so you are considered a fey creature for the purpose of effects that relate to creature origin.',
      source: 'HotF',
    },
    {
      name: 'Light of Heart',
      description: 'You can make saving throws both at the start of your turn and the end of your turn against fear effects that a save can end.',
      source: 'HotF',
    },
    {
      name: 'Pleasant Recovery',
      description: 'You regain 1d8 additional hit points for each healing surge you spend during a short rest.',
      source: 'HotF',
    },
    {
      name: 'Sly Words',
      description: 'Bluff is always a class skill for you.',
      source: 'HotF',
    },
    {
      name: 'Lure of Enchantment',
      description: 'You have the lure of enchantment encounter power.',
      source: 'HotF',
    },
  ],
  racialPowerIds: ['racial-lure-of-enchantment'],
};
