import type { ClassData } from '../../types/gameData';

export const druid: ClassData = {
  id: 'druid',
  name: 'Druid',
  role: 'Controller',
  powerSource: 'Primal',
  keyAbilities: ['wis', 'dex', 'con'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide'],
  weaponProficiencies: ['Simple melee', 'Simple ranged'],
  shieldProficiency: false,
  implements: ['Staff', 'Totem'],
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 7,
  fortitudeBonus: 0,
  reflexBonus: 1,
  willBonus: 1,
  trainedSkillCount: 4,
  availableSkills: ['arcana', 'athletics', 'diplomacy', 'endurance', 'heal', 'history', 'insight', 'perception'],
  mandatorySkills: ['nature'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Balance of Nature',
      description: 'Some druid powers have the beast form keyword. You must be in beast form to use them. You start each encounter in humanoid form but can switch between humanoid and beast form. Your beast form at-will attack power does not count against your normal at-will power allotment — you get it in addition to your two humanoid form at-wills.',
    },
    {
      level: 1,
      name: 'Primal Aspect',
      description: 'You choose Primal Guardian or Primal Predator. Your choice provides a benefit while you are in beast form.',
    },
    {
      level: 1,
      name: 'Primal Guardian',
      description: 'While you are not wearing heavy armor, you can use your Constitution modifier in place of your Dexterity or Intelligence modifier to determine your AC. In addition, while you are in beast form, you gain a +1 bonus to AC.',
    },
    {
      level: 1,
      name: 'Primal Predator',
      description: 'While you are in beast form, your speed increases by 1.',
    },
    {
      level: 1,
      name: 'Ritual Casting',
      description: 'You gain the Ritual Caster feat as a bonus feat, and you own a ritual book with the Animal Messenger ritual.',
    },
    {
      level: 1,
      name: 'Wild Shape',
      description: 'You gain the wild shape power, which lets you change from your humanoid form to beast form or vice versa as a minor action. You choose a specific form when you use wild shape to change to beast form. Your beast form is a natural beast whose appearance is gray and indistinct.',
    },
  ],
};
