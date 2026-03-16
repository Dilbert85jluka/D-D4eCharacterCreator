import type { ClassData } from '../../types/gameData';

export const rogue: ClassData = {
  id: 'rogue',
  name: 'Rogue',
  role: 'Striker',
  powerSource: 'Martial',
  keyAbilities: ['dex', 'str', 'cha'],
  armorProficiencies: ['Cloth', 'Leather'],
  weaponProficiencies: ['Simple melee', 'Military melee (hand crossbow, shuriken, sling)', 'Simple ranged'],
  shieldProficiency: false,
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 6,
  fortitudeBonus: 0,
  reflexBonus: 2,
  willBonus: 0,
  trainedSkillCount: 6,
  mandatorySkills: ['stealth', 'thievery'],
  availableSkills: ['acrobatics', 'athletics', 'bluff', 'dungeoneering', 'insight', 'intimidate', 'perception', 'stealth', 'streetwise', 'thievery'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'First Strike',
      description: 'At the start of an encounter, you have combat advantage against any creatures that have not yet acted in that encounter.',
    },
    {
      level: 1,
      name: 'Rogue Tactics',
      description: 'Choose Artful Dodger or Brutal Scoundrel. Artful Dodger: Add Charisma modifier to AC when not wearing heavy armor or using a shield. Brutal Scoundrel: Add Strength modifier to Sneak Attack damage.',
    },
    {
      level: 1,
      name: 'Rogue Weapon Talent',
      description: 'When you wield a shuriken, your weapon damage die is d6 instead of d4. When you wield a dagger, you gain a +1 bonus to attack rolls.',
    },
    {
      level: 1,
      name: 'Sneak Attack',
      description: 'Once per turn, deal an extra 2d6 damage when you have combat advantage against the target and are using a light blade, a hand crossbow, a shortbow, or a sling. The extra damage increases as you level up.',
    },
  ],
};
