import type { ClassData } from '../../types/gameData';

export const ardent: ClassData = {
  id: 'ardent',
  name: 'Ardent',
  role: 'Leader',
  powerSource: 'Psionic',
  keyAbilities: ['cha', 'con', 'wis'],
  armorProficiencies: ['Cloth', 'Leather', 'Hide', 'Chainmail'],
  weaponProficiencies: ['Simple melee', 'Military melee', 'Simple ranged'],
  shieldProficiency: false,
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 7,
  fortitudeBonus: 1,
  reflexBonus: 0,
  willBonus: 1,
  trainedSkillCount: 4,
  availableSkills: ['arcana', 'athletics', 'bluff', 'diplomacy', 'endurance', 'heal', 'insight', 'intimidate', 'streetwise'],
  atWillPowerCount: 2,
  encounterPowerCount: 0,  // Psionic augmentation replaces encounter powers
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Ardent Mantle',
      description: 'You choose a mantle that defines the emotional state you project to your allies: Mantle of Clarity or Mantle of Elation. Your choice grants you a specific aura benefit and an associated encounter power.',
    },
    {
      level: 1,
      name: 'Mantle of Clarity',
      description: 'Allies within 5 squares of you gain a bonus to all defenses against opportunity attacks equal to your Wisdom modifier. You gain a +2 bonus to Insight and Perception checks. You gain the Ardent Alacrity power.',
    },
    {
      level: 1,
      name: 'Mantle of Elation',
      description: 'Allies within 5 squares of you gain a bonus to damage rolls for opportunity attacks equal to your Constitution modifier. You gain a +2 bonus to Diplomacy and Intimidate checks. You gain the Ardent Outrage power.',
    },
    {
      level: 1,
      name: 'Ardent Surge',
      description: 'You can use ardent surge twice per encounter (three times at 16th level). Close burst 5 (10 at 16th level). One ally in burst spends a healing surge and regains additional hit points (1d6 at 1st level, scaling to 6d6 at 26th level).',
    },
    {
      level: 1,
      name: 'Psionic Augmentation',
      description: 'You do not gain encounter attack powers. Instead, you augment your at-will attack powers using power points. You start with 2 power points and gain more as you level (up to 15 at 27th level). Augmenting a power costs 1 or 2 power points. Power points are regained after a short or extended rest.',
    },
  ],
};
