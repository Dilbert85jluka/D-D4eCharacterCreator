import type { ClassData } from '../../types/gameData';

export const monk: ClassData = {
  id: 'monk',
  name: 'Monk',
  role: 'Striker',
  powerSource: 'Psionic',
  keyAbilities: ['dex', 'str', 'wis'],
  armorProficiencies: ['Cloth'],
  weaponProficiencies: ['Club', 'Dagger', 'Monk unarmed strike', 'Quarterstaff', 'Shuriken', 'Sling', 'Spear'],
  shieldProficiency: false,
  implements: ['Ki Focus'],
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 7,
  fortitudeBonus: 1,
  reflexBonus: 1,
  willBonus: 1,
  trainedSkillCount: 4,
  availableSkills: ['acrobatics', 'athletics', 'diplomacy', 'endurance', 'heal', 'insight', 'perception', 'religion', 'stealth', 'thievery'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Monastic Tradition',
      description: 'You choose a monastic tradition that shapes your fighting style: Centered Breath or Stone Fist. Your choice determines your Flurry of Blows power and a defensive benefit.',
    },
    {
      level: 1,
      name: 'Centered Breath',
      description: 'You gain the Centered Flurry of Blows power (at-will, triggered on hit, deals Wisdom modifier damage and slides target 1 square). You also gain Mental Equilibrium: +1 bonus to Fortitude (+2 at 11th, +3 at 21st level).',
    },
    {
      level: 1,
      name: 'Stone Fist',
      description: 'You gain the Stone Fist Flurry of Blows power (at-will, triggered on hit, deals 3 + Strength modifier damage). You also gain Mental Bastion: +1 bonus to Will (+2 at 11th, +3 at 21st level).',
    },
    {
      level: 1,
      name: 'Unarmed Combatant',
      description: 'Monk unarmed strike: +3 proficiency bonus, 1d8 damage, off-hand property. You must have a hand free to use it. You can enchant and disenchant your unarmed strike as if it were a weapon.',
    },
    {
      level: 1,
      name: 'Unarmored Defense',
      description: 'While you are wearing cloth armor or no armor and not using a shield, you gain a +2 bonus to AC.',
    },
  ],
};
