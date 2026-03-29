import type { RaceData } from '../../types/gameData';

export const gnome: RaceData = {
  id: 'gnome',
  name: 'Gnome',
  size: 'Small',
  speed: 5,
  vision: 'Low-light',
  languages: ['Common', 'Elven'],
  abilityBonuses: { int: 2 },
  abilityBonusOptions: { amount: 2, options: ['cha', 'dex'] },
  skillBonuses: [
    { skillId: 'arcana', bonus: 2 },
    { skillId: 'stealth', bonus: 2 },
  ],
  traits: [
    {
      name: 'Fade Away',
      description: 'You have the fade away power.',
      source: 'PHB2',
    },
    {
      name: 'Fey Origin',
      description: 'Your ancestors were native to the Feywild, so you are considered a fey creature for the purpose of effects that relate to creature origin.',
      source: 'PHB2',
    },
    {
      name: 'Master Trickster',
      description: 'Once per encounter, you can use the wizard cantrip ghost sound as a minor action.',
      source: 'PHB2',
    },
    {
      name: 'Reactive Stealth',
      description: 'If you have any cover or concealment when you make an initiative check, you can make a Stealth check.',
      source: 'PHB2',
    },
    {
      name: "Trickster's Cunning",
      description: 'You have a +5 racial bonus to saving throws against illusions.',
      source: 'PHB2',
      conditional: true,
    },
  ],
  racialPowerIds: ['racial-fade-away'],
};
