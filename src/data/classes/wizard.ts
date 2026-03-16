import type { ClassData } from '../../types/gameData';

export const wizard: ClassData = {
  id: 'wizard',
  name: 'Wizard',
  role: 'Controller',
  powerSource: 'Arcane',
  keyAbilities: ['int', 'wis', 'dex'],
  armorProficiencies: ['Cloth'],
  weaponProficiencies: ['Dagger', 'Quarterstaff'],
  shieldProficiency: false,
  implements: ['Orb', 'Staff', 'Wand'],
  hpAtFirstLevel: 10,
  hpPerLevel: 4,
  healingSurgesPerDay: 6,
  fortitudeBonus: 0,
  reflexBonus: 0,
  willBonus: 2,
  trainedSkillCount: 4,
  mandatorySkills: ['arcana'],
  availableSkills: ['arcana', 'diplomacy', 'dungeoneering', 'history', 'insight', 'nature', 'religion'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Arcane Implement Proficiency',
      description: 'Choose one of the following implements: orb, staff, or wand. You gain proficiency with that implement and a specific benefit based on your choice.',
    },
    {
      level: 1,
      name: 'Cantrips',
      description: 'You can use the following cantrips at will: ghost sound, light, mage hand, and prestidigitation.',
    },
    {
      level: 1,
      name: 'Ritual Casting',
      description: 'You gain the Ritual Caster feat as a bonus feat, allowing you to use magical rituals. You own a ritual book and it contains two rituals of your choice that you have mastered.',
    },
    {
      level: 1,
      name: 'Spellbook',
      description: 'You possess a spellbook. At 1st level, your book contains all the wizard at-will attack powers, all the encounter attack powers from this book, plus three daily attack powers from this book. Each day when you prepare your spells, you can choose which daily powers you will use from your spellbook.',
    },
  ],
};
