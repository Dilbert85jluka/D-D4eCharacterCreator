import type { RaceData } from '../../types/gameData';

export const pixie: RaceData = {
  id: 'pixie',
  name: 'Pixie',
  size: 'Tiny',
  speed: 4,
  vision: 'Low-light',
  languages: ['Common', 'Elven'],
  // Always +2 CHA; player chooses +2 DEX or +2 INT
  abilityBonuses: { cha: 2 },
  abilityBonusOptions: { amount: 2, options: ['dex', 'int'] },
  skillBonuses: [
    { skillId: 'nature', bonus: 2 },
    { skillId: 'stealth', bonus: 2 },
  ],
  traits: [
    {
      name: 'Fey Origin',
      description: 'Your ancestors were native to the Feywild, so you are considered a fey creature for the purpose of effects that relate to creature origin.',
      source: 'HotF',
    },
    {
      name: 'Pixie Magic',
      description: 'You have the pixie dust and shrink encounter powers.',
      source: 'HotF',
    },
    {
      name: 'Speak with Beasts',
      description: 'You can communicate with natural beasts and fey beasts.',
      source: 'HotF',
    },
    {
      name: 'Wee Warrior',
      description: 'You have a reach of 1, rather than the reach of 0 that is typical for a Tiny creature. You also take a -5 penalty to Strength checks to break or force open objects. When wielding a weapon of your size, you follow the same rules that Small creatures do.',
      source: 'HotF',
    },
    {
      name: 'Pixie Flight',
      description: 'You have a fly speed of 6 (altitude limit 1). You cannot use this fly speed if you are carrying more than a normal load. You fall at the end of your turn if you are more than 1 square above the ground.',
      source: 'HotF',
    },
    {
      name: 'Sharing a Space',
      description: 'Because you are Tiny, you can enter the space of a Small or larger creature and end your turn there. Two creatures are considered adjacent if they are in the same square.',
      source: 'HotF',
    },
  ],
  racialPowerIds: ['racial-pixie-dust', 'racial-shrink'],
};
