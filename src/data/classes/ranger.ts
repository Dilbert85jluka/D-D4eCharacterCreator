import type { ClassData } from '../../types/gameData';

export const ranger: ClassData = {
  id: 'ranger',
  name: 'Ranger',
  role: 'Striker',
  powerSource: 'Martial',
  keyAbilities: ['str', 'dex', 'wis'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide'],
  weaponProficiencies: ['Simple melee', 'Military melee', 'Simple ranged', 'Military ranged'],
  shieldProficiency: false,
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 6,
  fortitudeBonus: 1,
  reflexBonus: 1,
  willBonus: 0,
  trainedSkillCount: 5,
  mandatorySkillChoice: ['dungeoneering', 'nature'],
  availableSkills: ['acrobatics', 'athletics', 'dungeoneering', 'endurance', 'heal', 'nature', 'perception', 'stealth'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Fighting Style',
      description: 'Choose Archer Fighting Style or Two-Blade Fighting Style. Archer: You gain the Defensive Mobility feat. Two-Blade: You gain the Toughness feat.',
    },
    {
      level: 1,
      name: 'Hunter\'s Quarry',
      description: 'Once per turn as a minor action, designate the nearest enemy you can see as your quarry. Once per round, you deal 1d6 extra damage to your quarry if you hit it. The extra damage increases to 2d6 at 11th level and 3d6 at 21st level.',
    },
    {
      level: 1,
      name: 'Prime Shot',
      description: 'If none of your allies are nearer to your target than you are, you gain a +1 bonus to ranged attack rolls against that target.',
    },
  ],
};
