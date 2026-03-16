import type { ClassData } from '../../types/gameData';

export const bard: ClassData = {
  id: 'bard',
  name: 'Bard',
  role: 'Leader',
  powerSource: 'Arcane',
  keyAbilities: ['cha', 'int', 'con'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide', 'Chainmail'],
  weaponProficiencies: ['Simple melee', 'Simple ranged', 'Military ranged', 'Longsword', 'Scimitar', 'Short sword'],
  shieldProficiency: false, // light shields only — we mark false and handle via armorProficiencies
  implements: ['Wand'],
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 7,
  fortitudeBonus: 0,
  reflexBonus: 1,
  willBonus: 1,
  trainedSkillCount: 5,
  availableSkills: ['acrobatics', 'athletics', 'bluff', 'diplomacy', 'dungeoneering', 'heal', 'history', 'insight', 'intimidate', 'nature', 'perception', 'religion', 'streetwise'],
  mandatorySkills: ['arcana'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Bardic Training',
      description: 'You gain the Ritual Caster feat as a bonus feat, and you own a ritual book with two 1st-level rituals of your choice. In addition, you can perform one bard ritual per day of your level or lower without expending components.',
    },
    {
      level: 1,
      name: 'Bardic Virtue',
      description: 'You choose Virtue of Cunning or Virtue of Valor. Your choice determines how your Majestic Word power (and some other powers) functions.',
    },
    {
      level: 1,
      name: 'Virtue of Cunning',
      description: 'Once per round, when an enemy attack misses an ally within a number of squares of you equal to 5 + your Intelligence modifier, you can slide that ally 1 square as a free action.',
    },
    {
      level: 1,
      name: 'Virtue of Valor',
      description: 'Once per round, when any ally within 5 squares of you reduces an enemy to 0 hit points or bloodies an enemy, you can grant temporary hit points equal to 1 + your Constitution modifier to that ally as a free action. The temporary hit points increase to 3 + your Constitution modifier at 11th level and 5 + your Constitution modifier at 21st level.',
    },
    {
      level: 1,
      name: 'Majestic Word',
      description: 'You can use the majestic word power twice per encounter (three times at 16th level). Each use is a minor action that lets an ally within 5 squares spend a healing surge and regain additional hit points based on your Charisma modifier.',
    },
    {
      level: 1,
      name: 'Multiclass Versatility',
      description: 'You can choose class-specific multiclass feats from more than one class.',
    },
    {
      level: 1,
      name: 'Skill Versatility',
      description: 'You gain a +1 bonus to untrained skill checks.',
    },
    {
      level: 1,
      name: 'Song of Rest',
      description: 'When you play an instrument or sing during a short rest, you and each ally who can hear you are affected by your Song of Rest. When an affected character spends healing surges at the end of the rest, that character regains additional hit points equal to your Charisma modifier with each healing surge.',
    },
    {
      level: 1,
      name: 'Words of Friendship',
      description: 'You gain the words of friendship power, which gives you a +5 power bonus to a Diplomacy check as a minor action once per encounter.',
    },
  ],
};
