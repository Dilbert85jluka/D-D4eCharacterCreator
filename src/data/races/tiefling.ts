import type { RaceData } from '../../types/gameData';

export const tiefling: RaceData = {
  id: 'tiefling',
  name: 'Tiefling',
  size: 'Medium',
  speed: 6,
  vision: 'Low-light',
  languages: ['Common', 'Choice of one other'],
  // Always +2 CHA; player chooses +2 CON or +2 INT
  abilityBonuses: { cha: 2 },
  abilityBonusOptions: { amount: 2, options: ['con', 'int'] },
  skillBonuses: [
    { skillId: 'bluff', bonus: 2 },
    { skillId: 'stealth', bonus: 2 },
  ],
  traits: [
    {
      name: 'Bloodhunt',
      description: 'You gain a +1 racial bonus to attack rolls against bloodied enemies.',
      source: 'PHB',
      conditional: true,
    },
    {
      name: 'Fire Resistance',
      description: 'You have fire resistance equal to 5 + one-half your level.',
      source: 'PHB',
    },
    {
      name: 'Infernal Wrath',
      description: 'You can use infernal wrath as an encounter power. Trigger: An enemy within 10 squares of you hits you. Effect (free action): The triggering enemy takes 1d6 + Intelligence or Charisma modifier fire damage.',
      source: 'PHB',
    },
  ],
  racialPowerIds: ['infernal-wrath'],
};
