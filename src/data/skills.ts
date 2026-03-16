import type { SkillData } from '../types/gameData';

export const SKILLS: SkillData[] = [
  { id: 'acrobatics',    name: 'Acrobatics',    keyAbility: 'dex', armorPenalty: true  },
  { id: 'arcana',        name: 'Arcana',         keyAbility: 'int', armorPenalty: false },
  { id: 'athletics',     name: 'Athletics',      keyAbility: 'str', armorPenalty: true  },
  { id: 'bluff',         name: 'Bluff',          keyAbility: 'cha', armorPenalty: false },
  { id: 'diplomacy',     name: 'Diplomacy',      keyAbility: 'cha', armorPenalty: false },
  { id: 'dungeoneering', name: 'Dungeoneering',  keyAbility: 'wis', armorPenalty: false },
  { id: 'endurance',     name: 'Endurance',      keyAbility: 'con', armorPenalty: true  },
  { id: 'heal',          name: 'Heal',           keyAbility: 'wis', armorPenalty: false },
  { id: 'history',       name: 'History',        keyAbility: 'int', armorPenalty: false },
  { id: 'insight',       name: 'Insight',        keyAbility: 'wis', armorPenalty: false },
  { id: 'intimidate',    name: 'Intimidate',     keyAbility: 'cha', armorPenalty: false },
  { id: 'nature',        name: 'Nature',         keyAbility: 'wis', armorPenalty: false },
  { id: 'perception',    name: 'Perception',     keyAbility: 'wis', armorPenalty: false },
  { id: 'religion',      name: 'Religion',       keyAbility: 'int', armorPenalty: false },
  { id: 'stealth',       name: 'Stealth',        keyAbility: 'dex', armorPenalty: true  },
  { id: 'streetwise',    name: 'Streetwise',     keyAbility: 'cha', armorPenalty: false },
  { id: 'thievery',      name: 'Thievery',       keyAbility: 'dex', armorPenalty: true  },
];

export function getSkillById(id: string): SkillData | undefined {
  return SKILLS.find((s) => s.id === id);
}
