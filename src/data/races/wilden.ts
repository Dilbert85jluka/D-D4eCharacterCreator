import type { RaceData } from '../../types/gameData';

export const wilden: RaceData = {
  id: 'wilden',
  name: 'Wilden',
  size: 'Medium',
  speed: 6,
  vision: 'Low-light',
  languages: ['Common', 'Elven'],
  abilityBonuses: { wis: 2 },
  abilityBonusOptions: { amount: 2, options: ['con', 'dex'] },
  skillBonuses: [
    { skillId: 'nature', bonus: 2 },
    { skillId: 'stealth', bonus: 2 },
  ],
  traits: [
    {
      name: 'Fey Origin',
      description: 'You are considered a fey creature for the purpose of effects that relate to creature origin.',
    },
    {
      name: 'Hardy Form',
      description: 'Choose Fortitude, Reflex, or Will defense at character creation; you gain a +1 racial bonus to that defense.',
    },
    {
      name: "Nature's Aspect",
      description: 'After each extended rest, choose one of three aspects: Aspect of the Ancients (Voyage of the Ancients power), Aspect of the Destroyer (Wrath of the Destroyer power), or Aspect of the Hunter (Pursuit of the Hunter power). Each aspect grants you a different encounter power.',
    },
  ],
  racialPowerIds: [
    'racial-voyage-of-the-ancients',
    'racial-wrath-of-the-destroyer',
    'racial-pursuit-of-the-hunter',
  ],
};
