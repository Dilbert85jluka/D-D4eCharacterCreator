import type { ClassData } from '../../types/gameData';

export const warlord: ClassData = {
  id: 'warlord',
  name: 'Warlord',
  role: 'Leader',
  powerSource: 'Martial',
  keyAbilities: ['str', 'cha', 'int'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide', 'Chainmail', 'Scale'],
  weaponProficiencies: ['Simple melee', 'Military melee', 'Simple ranged'],
  shieldProficiency: false,
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 7,
  fortitudeBonus: 1,
  reflexBonus: 1,
  willBonus: 0,
  trainedSkillCount: 4,
  availableSkills: ['athletics', 'diplomacy', 'endurance', 'heal', 'history', 'intimidate'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Combat Leader',
      description: 'You and each ally within 10 squares who can see and hear you gain a +2 power bonus to initiative.',
    },
    {
      level: 1,
      name: 'Commanding Presence',
      description: 'Choose Inspiring Presence or Tactical Presence. Inspiring: When an ally spends an action point to take an extra action, that ally also regains hit points equal to 2 + your Charisma modifier. Tactical: When an ally spends an action point to take an extra action, each enemy adjacent to that ally grants combat advantage until the end of your next turn.',
    },
    {
      level: 1,
      name: 'Inspiring Word',
      description: 'You can use inspiring word as a minor action a number of times per encounter equal to half your level + 1 (minimum 2). An ally within 5 squares of you can spend a healing surge and regain additional hit points equal to 2 + your Charisma modifier.',
    },
  ],
};
