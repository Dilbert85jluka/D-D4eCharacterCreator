import type { ClassData } from '../../types/gameData';

export const paladin: ClassData = {
  id: 'paladin',
  name: 'Paladin',
  role: 'Defender',
  powerSource: 'Divine',
  keyAbilities: ['str', 'cha', 'wis'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide', 'Chainmail', 'Scale', 'Plate'],
  weaponProficiencies: ['Simple melee', 'Military melee', 'Simple ranged'],
  shieldProficiency: true,
  implements: ['Holy symbol'],
  hpAtFirstLevel: 15,
  hpPerLevel: 6,
  healingSurgesPerDay: 10,
  fortitudeBonus: 1,
  reflexBonus: 0,
  willBonus: 1,
  trainedSkillCount: 4,
  mandatorySkills: ['religion'],
  availableSkills: ['diplomacy', 'endurance', 'heal', 'history', 'insight', 'intimidate', 'religion'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Channel Divinity',
      description: 'You can invoke divine power filling yourself with the might of your deity. You can use one Channel Divinity power per encounter. Paladins can use divine mettle and divine strength.',
    },
    {
      level: 1,
      name: 'Divine Challenge',
      description: 'You can use divine challenge as a minor action. You mark a creature within 5 squares of you. If the marked creature makes an attack that doesn\'t include you as a target, it takes radiant damage equal to 3 + your Charisma modifier.',
    },
    {
      level: 1,
      name: 'Lay on Hands',
      description: 'You can use lay on hands as an at-will power. You can use this power a number of times per day equal to your Wisdom modifier (minimum 1).',
    },
  ],
};
