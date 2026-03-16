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
      name: 'Combat Superiority',
      description: 'You gain a +2 bonus to opportunity attacks. An enemy struck by your opportunity attack stops moving if a move provoked the attack.',
    },
    {
      level: 1,
      name: 'Fighter Weapon Talent',
      description: 'When you wield a weapon with which you have proficiency, you gain a +1 bonus to attack rolls.',
    },
    {
      level: 1,
      name: 'Combat Agility',
      description: 'You can take opportunity attacks even when you are prone or when you have no speed (for example, due to a slow effect). In addition, leaving an enemy\'s threatened area provokes an opportunity attack from you.',
    },
  ],
};
