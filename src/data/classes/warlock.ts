import type { ClassData } from '../../types/gameData';

export const warlock: ClassData = {
  id: 'warlock',
  name: 'Warlock',
  role: 'Striker',
  powerSource: 'Arcane',
  keyAbilities: ['con', 'cha', 'int'],
  armorProficiencies: ['Cloth', 'Leather'],
  weaponProficiencies: ['Simple melee', 'Simple ranged'],
  shieldProficiency: false,
  implements: ['Rod', 'Wand'],
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 6,
  fortitudeBonus: 0,
  reflexBonus: 1,
  willBonus: 1,
  trainedSkillCount: 4,
  availableSkills: ['arcana', 'bluff', 'history', 'insight', 'intimidate', 'religion', 'streetwise', 'thievery'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Eldritch Blast',
      description: 'You can use eldritch blast as a cantrip (at-will power).',
    },
    {
      level: 1,
      name: 'Eldritch Pact',
      description: 'Choose Fey Pact, Infernal Pact, or Star Pact. Your choice determines your Warlock\'s Curse benefit, certain class features, and powers.',
    },
    {
      level: 1,
      name: 'Prime Shot',
      description: 'If none of your allies are nearer to your target than you are, you gain a +1 bonus to ranged attack rolls against that target.',
    },
    {
      level: 1,
      name: 'Shadow Walk',
      description: 'On your turn, if you move at least 3 squares away from where you started your turn, you gain concealment until the start of your next turn.',
    },
    {
      level: 1,
      name: 'Warlock\'s Curse',
      description: 'Once per turn as a minor action, place a Warlock\'s Curse on the nearest enemy you can see. Once per round, deal 1d6 extra damage when you hit a cursed target. The extra damage increases to 2d6 at 11th level and 3d6 at 21st level.',
    },
  ],
};
