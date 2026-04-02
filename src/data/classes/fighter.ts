import type { ClassData } from '../../types/gameData';

export const fighter: ClassData = {
  id: 'fighter',
  name: 'Fighter',
  role: 'Defender',
  powerSource: 'Martial',
  keyAbilities: ['str', 'con', 'dex', 'wis'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide', 'Chainmail', 'Scale'],
  weaponProficiencies: ['Simple melee', 'Military melee', 'Simple ranged', 'Military ranged'],
  shieldProficiency: true,
  hpAtFirstLevel: 15,
  hpPerLevel: 6,
  healingSurgesPerDay: 9,
  fortitudeBonus: 2,
  reflexBonus: 0,
  willBonus: 0,
  trainedSkillCount: 3,
  availableSkills: ['athletics', 'endurance', 'heal', 'intimidate', 'streetwise'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Combat Challenge',
      description: 'Every time you attack an enemy, whether the attack hits or misses, you can mark that target. The mark lasts until the end of your next turn. A marked creature that makes an attack not including you takes a -2 penalty to attack rolls. When a marked enemy adjacent to you shifts or makes an attack not including you, you can make a melee basic attack against that enemy as an immediate interrupt.',
    },
    {
      level: 1,
      name: 'Combat Style',
      description: 'Choose Combat Superiority (PHB) or Combat Agility (Martial Power 2). This choice determines your opportunity attack class feature and grants an associated at-will power.',
    },
    {
      level: 1,
      name: 'Fighter Weapon Talent',
      description: 'When you wield a weapon with which you have proficiency, you gain a +1 bonus to attack rolls.',
    },
  ],
};
