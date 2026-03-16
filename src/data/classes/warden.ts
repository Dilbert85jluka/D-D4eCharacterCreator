import type { ClassData } from '../../types/gameData';

export const warden: ClassData = {
  id: 'warden',
  name: 'Warden',
  role: 'Defender',
  powerSource: 'Primal',
  keyAbilities: ['str', 'con', 'wis'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide'],
  weaponProficiencies: ['Simple melee', 'Military melee', 'Simple ranged'],
  shieldProficiency: true, // light and heavy shields
  hpAtFirstLevel: 17,
  hpPerLevel: 7,
  healingSurgesPerDay: 9,
  fortitudeBonus: 1,
  reflexBonus: 0,
  willBonus: 1,
  trainedSkillCount: 4,
  availableSkills: ['athletics', 'dungeoneering', 'endurance', 'heal', 'intimidate', 'perception'],
  mandatorySkills: ['nature'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Font of Life',
      description: 'At the start of your turn, you can make a saving throw against one effect that a save can end. On a save, the effect immediately ends, preventing it from affecting you on your current turn. If you fail the saving throw, you still make a saving throw against the effect at the end of your turn.',
    },
    {
      level: 1,
      name: 'Guardian Might',
      description: 'You choose Earthstrength or Wildblood. Your choice determines an additional AC bonus and provides a secondary benefit.',
    },
    {
      level: 1,
      name: 'Earthstrength',
      description: 'While you are not wearing heavy armor, you can use your Constitution modifier in place of your Dexterity or Intelligence modifier to determine your AC. When you use your second wind, you also gain temporary hit points equal to your Constitution modifier.',
    },
    {
      level: 1,
      name: 'Wildblood',
      description: 'While you are not wearing heavy armor, you can use your Wisdom modifier in place of your Dexterity or Intelligence modifier to determine your AC. When you use your second wind, each enemy marked by you takes an additional penalty of -2 to attack rolls for attacks that don\'t include you until the end of your next turn.',
    },
    {
      level: 1,
      name: 'Nature\'s Wrath',
      description: 'Once during each of your turns, you can mark each adjacent enemy as a free action. The mark lasts until the end of your next turn.',
    },
  ],
};
