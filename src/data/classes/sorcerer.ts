import type { ClassData } from '../../types/gameData';

export const sorcerer: ClassData = {
  id: 'sorcerer',
  name: 'Sorcerer',
  role: 'Striker',
  powerSource: 'Arcane',
  keyAbilities: ['cha', 'dex', 'str'],
  armorProficiencies: ['Cloth'],
  weaponProficiencies: ['Simple melee', 'Simple ranged'],
  shieldProficiency: false,
  implements: ['Dagger', 'Staff'],
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 6,
  fortitudeBonus: 0,
  reflexBonus: 0,
  willBonus: 2,
  trainedSkillCount: 4,
  availableSkills: ['athletics', 'bluff', 'diplomacy', 'dungeoneering', 'endurance', 'history', 'insight', 'intimidate', 'nature'],
  mandatorySkills: ['arcana'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Spell Source',
      description: 'You choose Dragon Magic or Wild Magic as the source of your arcane power. Your choice provides benefits and determines how some of your powers work.',
    },
    {
      level: 1,
      name: 'Dragon Magic',
      description: 'Your AC is increased by 2 while you are not wearing heavy armor. You gain a bonus to damage rolls with arcane powers equal to your Strength modifier. The bonus increases to your Strength modifier + 2 at 11th level and your Strength modifier + 4 at 21st level.',
    },
    {
      level: 1,
      name: 'Wild Magic',
      description: 'When you roll a natural 20 on an attack roll for an arcane power, you slide the target 1 square and knock it prone after applying the attack\'s other effects. In addition, you gain a bonus to damage rolls with arcane powers equal to your Dexterity modifier.',
    },
    {
      level: 1,
      name: 'Unfettered Power',
      description: 'When you roll a natural 20 on an attack roll for a sorcerer power, you gain a +2 bonus to each damage roll you make until the end of your next turn. When you roll a natural 1 on an attack roll for a sorcerer power, you must push each creature within 5 squares of you 1 square.',
    },
  ],
};
