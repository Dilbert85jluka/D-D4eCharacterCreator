import type { ClassData } from '../../types/gameData';

export const invoker: ClassData = {
  id: 'invoker',
  name: 'Invoker',
  role: 'Controller',
  powerSource: 'Divine',
  keyAbilities: ['wis', 'con', 'int'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide', 'Chainmail'],
  weaponProficiencies: ['Simple melee', 'Simple ranged'],
  shieldProficiency: false,
  implements: ['Rod', 'Staff'],
  hpAtFirstLevel: 10,
  hpPerLevel: 4,
  healingSurgesPerDay: 6,
  fortitudeBonus: 1,
  reflexBonus: 1,
  willBonus: 1,
  trainedSkillCount: 4,
  availableSkills: ['arcana', 'diplomacy', 'endurance', 'history', 'insight', 'intimidate'],
  mandatorySkills: ['religion'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Channel Divinity',
      description: 'You can invoke divine power, filling yourself with the might of your patron deity. You can use the rebuke undead and divine bolts Channel Divinity powers.',
    },
    {
      level: 1,
      name: 'Divine Covenant',
      description: 'You choose Covenant of Preservation or Covenant of Wrath. Your choice provides benefits that apply to your at-will and encounter attack powers.',
    },
    {
      level: 1,
      name: 'Covenant of Preservation',
      description: 'When you use a divine encounter or daily attack power on your turn, you can slide an ally within 10 squares of you 1 square.',
    },
    {
      level: 1,
      name: 'Covenant of Wrath',
      description: 'When you use a divine encounter or daily attack power on your turn, you gain a bonus to damage rolls equal to 1 for each enemy you attack with the power. If you use a divine at-will attack power on your turn and attack only one creature with it, you gain a +1 bonus to the damage roll.',
    },
    {
      level: 1,
      name: 'Ritual Caster',
      description: 'You gain the Ritual Caster feat as a bonus feat, and you own a ritual book with two 1st-level rituals of your choice.',
    },
  ],
};
