import type { ClassData } from '../../types/gameData';

export const battlemind: ClassData = {
  id: 'battlemind',
  name: 'Battlemind',
  role: 'Defender',
  powerSource: 'Psionic',
  keyAbilities: ['con', 'wis', 'cha'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide', 'Chainmail', 'Scale'],
  weaponProficiencies: ['Simple melee', 'Military melee', 'Simple ranged'],
  shieldProficiency: true,
  hpAtFirstLevel: 15,
  hpPerLevel: 6,
  healingSurgesPerDay: 9,
  fortitudeBonus: 0,
  reflexBonus: 0,
  willBonus: 2,
  trainedSkillCount: 3,
  availableSkills: ['arcana', 'athletics', 'bluff', 'diplomacy', 'endurance', 'heal', 'insight', 'intimidate'],
  atWillPowerCount: 2,
  encounterPowerCount: 0,  // Psionic augmentation replaces encounter powers
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Psionic Study',
      description: 'You choose a psionic study that defines your combat style: Battle Resilience or Speed of Thought. Your choice grants you an encounter power.',
    },
    {
      level: 1,
      name: 'Battle Resilience',
      description: 'When you hit or miss with your first attack in an encounter, you gain resist all equal to 3 + your Wisdom modifier until the end of your next turn. Resist increases to 6 + Wis at 11th level and 9 + Wis at 21st level.',
    },
    {
      level: 1,
      name: 'Speed of Thought',
      description: 'When you roll initiative, as a free action you can move a number of squares equal to 3 + your Charisma modifier. You can use this power even if you are surprised.',
    },
    {
      level: 1,
      name: 'Psionic Defense',
      description: "You gain three at-will psionic defense powers: Battlemind's Demand (mark an enemy in close burst 3), Blurred Step (shift 1 square when a marked enemy shifts), and Mind Spike (deal damage equal to damage an ally took from your marked enemy).",
    },
    {
      level: 1,
      name: 'Psionic Augmentation',
      description: 'You do not gain encounter attack powers. Instead, you augment your at-will attack powers using power points. You start with 2 power points and gain more as you level (up to 15 at 27th level). Augmenting a power costs 1 or 2 power points. Power points are regained after a short or extended rest.',
    },
  ],
};
