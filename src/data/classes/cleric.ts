import type { ClassData } from '../../types/gameData';

export const cleric: ClassData = {
  id: 'cleric',
  name: 'Cleric',
  role: 'Leader',
  powerSource: 'Divine',
  keyAbilities: ['wis', 'str', 'cha'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide', 'Chainmail'],
  weaponProficiencies: ['Simple melee', 'Simple ranged'],
  shieldProficiency: false,
  implements: ['Holy symbol'],
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 7,
  fortitudeBonus: 0,
  reflexBonus: 0,
  willBonus: 2,
  trainedSkillCount: 4,
  mandatorySkills: ['religion'],
  availableSkills: ['arcana', 'diplomacy', 'heal', 'history', 'insight', 'religion'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Channel Divinity',
      description: 'You can invoke divine power, filling yourself with the might of your deity. You can use one Channel Divinity power per encounter. Clerics can use turn undead and one of the following Channel Divinity prayers: divine fortune or healer\'s mercy.',
    },
    {
      level: 1,
      name: 'Healer\'s Lore',
      description: 'When you grant healing with a cleric power, the target regains additional hit points equal to your Wisdom modifier.',
    },
    {
      level: 1,
      name: 'Healing Word',
      description: 'You can use healing word as a minor action twice per encounter (plus once per tier per day). Close burst 5. One bloodied ally in burst can spend a healing surge and regain additional hit points equal to your Wisdom modifier.',
    },
    {
      level: 1,
      name: 'Ritual Casting',
      description: 'You gain the Ritual Caster feat as a bonus feat, allowing you to use magical rituals.',
    },
  ],
};
