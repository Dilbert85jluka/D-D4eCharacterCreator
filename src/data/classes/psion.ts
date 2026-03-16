import type { ClassData } from '../../types/gameData';

export const psion: ClassData = {
  id: 'psion',
  name: 'Psion',
  role: 'Controller',
  powerSource: 'Psionic',
  keyAbilities: ['int', 'cha', 'wis'],
  armorProficiencies: ['Cloth'],
  weaponProficiencies: ['Simple melee', 'Simple ranged'],
  shieldProficiency: false,
  implements: ['Orb', 'Staff'],
  hpAtFirstLevel: 12,
  hpPerLevel: 4,
  healingSurgesPerDay: 6,
  fortitudeBonus: 0,
  reflexBonus: 0,
  willBonus: 2,
  trainedSkillCount: 4,
  availableSkills: ['arcana', 'bluff', 'diplomacy', 'dungeoneering', 'history', 'insight', 'intimidate', 'perception'],
  atWillPowerCount: 2,
  encounterPowerCount: 0,  // Psionic augmentation replaces encounter powers
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Discipline Focus',
      description: 'You choose a discipline focus that defines your psionic specialty: Telekinesis Focus or Telepathy Focus. Your choice grants you two encounter utility powers.',
    },
    {
      level: 1,
      name: 'Telekinesis Focus',
      description: 'You gain Far Hand (minor action, ranged 5, telekinetically move/manipulate objects up to 20 lbs) and Forceful Push (free action, ranged 10, slide target 1 square; 2 at 11th, 3 at 21st).',
    },
    {
      level: 1,
      name: 'Telepathy Focus',
      description: 'You gain Distract (minor action, ranged 10, target grants combat advantage to next attacker) and Send Thoughts (free action, ranged 20, send a mental message of 25 words or fewer).',
    },
    {
      level: 1,
      name: 'Psionic Augmentation',
      description: 'You do not gain encounter attack powers. Instead, you augment your at-will attack powers using power points. You start with 2 power points and gain more as you level (up to 15 at 27th level). Augmenting a power costs 1 or 2 power points. Power points are regained after a short or extended rest.',
    },
    {
      level: 1,
      name: 'Ritual Casting',
      description: 'You gain the Ritual Caster feat as a bonus feat. You own a ritual book with one 1st-level ritual (Sending or Tenser\'s Floating Disk). You can use one of these rituals once per day without expending components.',
    },
  ],
};
