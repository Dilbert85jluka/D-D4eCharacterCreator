import type { RaceData } from '../../types/gameData';

export const elf: RaceData = {
  id: 'elf',
  name: 'Elf',
  size: 'Medium',
  speed: 7,
  vision: 'Low-light',
  languages: ['Common', 'Elven'],
  // Always +2 DEX; player chooses +2 INT or +2 WIS
  abilityBonuses: { dex: 2 },
  abilityBonusOptions: { amount: 2, options: ['int', 'wis'] },
  skillBonuses: [
    { skillId: 'nature', bonus: 2 },
    { skillId: 'perception', bonus: 2 },
  ],
  traits: [
    {
      name: 'Elven Weapon Proficiency',
      description: 'You gain proficiency with the longbow and the shortbow.',
      source: 'PHB',
    },
    {
      name: 'Fey Origin',
      description: 'Your origin is fey, not natural. You are considered a fey creature for the purpose of effects that relate to creature origin.',
      source: 'PHB',
    },
    {
      name: 'Group Awareness',
      description: 'You grant non-elf allies within 5 squares of you a +1 racial bonus to Perception checks.',
      source: 'PHB',
    },
    {
      name: 'Wild Step',
      description: 'You ignore difficult terrain when you shift (even if you have a power that allows you to shift multiple squares).',
      source: 'PHB',
    },
    {
      name: 'Elven Accuracy',
      description: 'You can use elven accuracy as an encounter power. Trigger: You make an attack roll. Effect: Reroll the attack roll. Use the second roll, even if it\'s lower.',
      source: 'PHB',
    },
  ],
  racialPowerIds: ['elven-accuracy'],
};
