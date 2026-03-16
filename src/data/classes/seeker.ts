import type { ClassData } from '../../types/gameData';

export const seeker: ClassData = {
  id: 'seeker',
  name: 'Seeker',
  role: 'Controller',
  powerSource: 'Primal',
  keyAbilities: ['wis', 'str', 'dex'],
  armorProficiencies: ['Cloth', 'Leather'],
  weaponProficiencies: ['Simple melee', 'Simple ranged', 'Military ranged'],
  shieldProficiency: false,
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 7,
  fortitudeBonus: 0,
  reflexBonus: 1,
  willBonus: 1,
  trainedSkillCount: 4,
  availableSkills: ['acrobatics', 'athletics', 'endurance', 'heal', 'insight', 'intimidate', 'nature', 'perception', 'stealth'],
  mandatorySkills: ['nature'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: "Seeker's Bond",
      description: "You forge a bond with primal spirits that shapes your fighting style: Bloodbond or Spiritbond. Your choice grants you an encounter power and a combat benefit.",
    },
    {
      level: 1,
      name: 'Bloodbond',
      description: 'You gain Encaging Spirits (encounter, minor, close burst 1; push each enemy 1 and slow until end of next turn; burst increases to 2 at 11th, 3 at 21st). While not wearing heavy armor, you can shift as a minor action.',
    },
    {
      level: 1,
      name: 'Spiritbond',
      description: "You gain Spirits' Rebuke (encounter, immediate reaction when enemy misses you with melee, 1[W] + Str damage and push 1; requires light/heavy thrown weapon). You gain +1 to attack rolls with thrown weapons, and thrown weapons return to you after an attack. While not wearing heavy armor, you can use your Strength modifier for AC instead of Dexterity or Intelligence.",
    },
    {
      level: 1,
      name: 'Inevitable Shot',
      description: 'You gain the Inevitable Shot power: encounter, no action, personal. Trigger: You miss with a ranged attack. Effect: Make a ranged basic attack against a different enemy within 5 squares of the missed target.',
    },
  ],
};
