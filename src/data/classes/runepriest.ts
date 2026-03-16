import type { ClassData } from '../../types/gameData';

export const runepriest: ClassData = {
  id: 'runepriest',
  name: 'Runepriest',
  role: 'Leader',
  powerSource: 'Divine',
  keyAbilities: ['str', 'con', 'wis'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide', 'Chainmail', 'Scale'],
  weaponProficiencies: ['Simple melee', 'Simple ranged'],
  shieldProficiency: true,
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 7,
  fortitudeBonus: 0,
  reflexBonus: 0,
  willBonus: 2,
  trainedSkillCount: 4,
  availableSkills: ['arcana', 'athletics', 'endurance', 'heal', 'history', 'insight', 'religion', 'thievery'],
  mandatorySkills: ['religion'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Rune Master',
      description: 'Many of your powers have the runic keyword. When you use a runic power, you choose either the Rune of Destruction or the Rune of Protection, entering that rune state. Your rune state persists until you enter a different state or the encounter ends.',
    },
    {
      level: 1,
      name: 'Rune of Destruction',
      description: 'While in the Rune of Destruction state, allies within 5 squares of you gain a +1 bonus to attack rolls against enemies adjacent to you.',
    },
    {
      level: 1,
      name: 'Rune of Protection',
      description: 'While in the Rune of Protection state, allies adjacent to you gain resist 2 to all damage (resist 4 at 11th level, resist 6 at 21st level).',
    },
    {
      level: 1,
      name: 'Runic Artistry',
      description: 'You choose a runic artistry that defines your combat approach: Defiant Word or Wrathful Hammer. Your choice grants you an additional combat benefit.',
    },
    {
      level: 1,
      name: 'Defiant Word',
      description: 'When an enemy misses you with an attack, you gain a bonus to damage rolls equal to your Wisdom modifier against that enemy until the end of your next turn.',
    },
    {
      level: 1,
      name: 'Wrathful Hammer',
      description: 'You gain proficiency with military hammers and military maces. When an enemy damages you, you gain a bonus to damage rolls against that enemy equal to your Constitution modifier until the end of your next turn.',
    },
    {
      level: 1,
      name: 'Rune of Mending',
      description: 'You gain the Rune of Mending power: minor action, close burst 5, one ally in burst spends a healing surge. If you are in the Rune of Destruction state, the ally gains a +1 bonus to attack rolls until the end of your next turn. If in the Rune of Protection state, the ally gains a +1 bonus to all defenses until the end of your next turn.',
    },
  ],
};
