import type { ClassData } from '../../types/gameData';

export const barbarian: ClassData = {
  id: 'barbarian',
  name: 'Barbarian',
  role: 'Striker',
  powerSource: 'Primal',
  keyAbilities: ['str', 'con', 'cha'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide'],
  weaponProficiencies: ['Simple melee', 'Military melee'],
  shieldProficiency: false,
  hpAtFirstLevel: 15,
  hpPerLevel: 6,
  healingSurgesPerDay: 8,
  fortitudeBonus: 2,
  reflexBonus: 0,
  willBonus: 0,
  trainedSkillCount: 3,
  availableSkills: ['acrobatics', 'athletics', 'endurance', 'heal', 'intimidate', 'nature', 'perception'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Barbarian Agility',
      description: 'While you are not wearing heavy armor, you gain a +1 bonus to AC and Reflex. The bonus increases to +2 at 11th level and +3 at 21st level.',
    },
    {
      level: 1,
      name: 'Feral Might',
      description: 'You choose Rageblood Vigor or Thaneborn Triumph. Your choice provides benefits when you reduce an enemy to 0 hit points.',
    },
    {
      level: 1,
      name: 'Rageblood Vigor',
      description: 'When you reduce an enemy to 0 hit points, you gain temporary hit points equal to your Constitution modifier. These temporary hit points increase to 5 + your Constitution modifier at 11th level and 10 + your Constitution modifier at 21st level.',
    },
    {
      level: 1,
      name: 'Thaneborn Triumph',
      description: 'When you reduce an enemy to 0 hit points, each enemy within 5 squares of you takes a penalty to attack rolls equal to your Charisma modifier until the end of your next turn.',
    },
    {
      level: 1,
      name: 'Rage Strike',
      description: 'Once per day, while you are raging, you can use the rage strike power to channel the fury of a daily attack power you haven\'t used.',
    },
    {
      level: 1,
      name: 'Rampage',
      description: 'Once per round, when you score a critical hit with a barbarian attack power, you can immediately make a melee basic attack as a free action. You do not have to attack the same target that you critically hit.',
    },
  ],
};
