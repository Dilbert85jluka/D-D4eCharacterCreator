import type { ClassData } from '../../types/gameData';

export const avenger: ClassData = {
  id: 'avenger',
  name: 'Avenger',
  role: 'Striker',
  powerSource: 'Divine',
  keyAbilities: ['wis', 'dex', 'int'],
  armorProficiencies: ['Cloth'],
  weaponProficiencies: ['Simple melee', 'Military melee', 'Simple ranged'],
  shieldProficiency: false,
  implements: ['Holy Symbol'],
  hpAtFirstLevel: 14,
  hpPerLevel: 6,
  healingSurgesPerDay: 7,
  fortitudeBonus: 1,
  reflexBonus: 1,
  willBonus: 1,
  trainedSkillCount: 4,
  availableSkills: ['acrobatics', 'athletics', 'endurance', 'heal', 'intimidate', 'perception', 'stealth', 'streetwise'],
  mandatorySkills: ['religion'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Armor of Faith',
      description: 'While you are wearing cloth armor or no armor and aren\'t using a shield, you gain a +3 bonus to AC.',
    },
    {
      level: 1,
      name: 'Avenger\'s Censure',
      description: 'You choose a censure that reflects your deity\'s goals: Censure of Pursuit or Censure of Retribution. Your choice provides a bonus that applies when your oath of enmity target makes an attack that doesn\'t include you.',
    },
    {
      level: 1,
      name: 'Censure of Pursuit',
      description: 'If your oath of enmity target moves away from you willingly, you gain a bonus to damage rolls against the target equal to your Dexterity modifier until the end of your next turn.',
    },
    {
      level: 1,
      name: 'Censure of Retribution',
      description: 'When any enemy other than your oath of enmity target hits you, you gain a bonus to damage rolls against your oath of enmity target equal to your Intelligence modifier until the end of your next turn.',
    },
    {
      level: 1,
      name: 'Channel Divinity',
      description: 'You can invoke divine power, filling yourself with the might of your patron deity. You can use the abjure undead and divine guidance Channel Divinity powers.',
    },
    {
      level: 1,
      name: 'Oath of Enmity',
      description: 'As a minor action, you can choose one enemy you can see within close burst 10. When you make a melee attack against that enemy and the enemy is the only one adjacent to you, you make two attack rolls and use either result. The oath lasts until the end of the encounter or until the enemy drops to 0 hit points.',
    },
  ],
};
