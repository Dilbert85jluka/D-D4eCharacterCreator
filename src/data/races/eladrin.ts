import type { RaceData } from '../../types/gameData';

export const eladrin: RaceData = {
  id: 'eladrin',
  name: 'Eladrin',
  size: 'Medium',
  speed: 6,
  vision: 'Low-light',
  languages: ['Common', 'Elven'],
  // Always +2 INT; player chooses +2 CHA or +2 DEX
  abilityBonuses: { int: 2 },
  abilityBonusOptions: { amount: 2, options: ['cha', 'dex'] },
  skillBonuses: [
    { skillId: 'arcana', bonus: 2 },
    { skillId: 'history', bonus: 2 },
  ],
  traits: [
    {
      name: 'Eladrin Education',
      description: 'You gain training in one additional skill selected from the following list: Arcana, Diplomacy, Dungeoneering, Endurance, History, Insight, Nature, or Perception.',
    },
    {
      name: 'Eladrin Weapon Proficiency',
      description: 'You gain proficiency with the longsword.',
    },
    {
      name: 'Eladrin Will',
      description: 'You gain a +1 racial bonus to your Will defense. In addition, you gain a +5 racial bonus to saving throws against the charmed condition.',
    },
    {
      name: 'Fey Origin',
      description: 'Your origin is fey, not natural. You are considered a fey creature for the purpose of effects that relate to creature origin.',
    },
    {
      name: 'Trance',
      description: 'Rather than sleeping, eladrin enter a meditative state known as trance. You need to spend 4 hours in this state to gain the same benefits other races gain from taking a 6-hour extended rest. While in a trance, you are fully aware of your surroundings and notice approaching enemies and other events as normal.',
    },
    {
      name: 'Fey Step',
      description: 'You can use fey step as an encounter power. Effect: Teleport up to 5 squares.',
    },
  ],
  racialPowerIds: ['fey-step'],
  bonusSkill: true,
  bonusSkillOptions: ['arcana', 'diplomacy', 'dungeoneering', 'endurance', 'history', 'insight', 'nature', 'perception'],
};
