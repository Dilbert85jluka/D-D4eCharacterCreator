import type { RaceData } from '../../types/gameData';

export const shardmind: RaceData = {
  id: 'shardmind',
  name: 'Shardmind',
  size: 'Medium',
  speed: 6,
  vision: 'Normal',
  languages: ['Common', 'Deep Speech', 'Choice of one other'],
  abilityBonuses: { int: 2 },
  abilityBonusOptions: { amount: 2, options: ['cha', 'wis'] },
  skillBonuses: [
    { skillId: 'arcana', bonus: 2 },
    { skillId: 'endurance', bonus: 2 },
  ],
  bonusSkill: true,
  bonusSkillOptions: ['arcana', 'endurance', 'religion', 'history', 'insight', 'nature', 'perception', 'streetwise', 'athletics', 'acrobatics', 'bluff', 'diplomacy', 'dungeoneering', 'heal', 'intimidate', 'stealth', 'thievery'],
  traits: [
    {
      name: 'Crystalline Mind',
      description: 'You have resist 5 psychic. The resistance increases to 10 at 11th level and 15 at 21st level.',
    },
    {
      name: 'Immortal Origin',
      description: 'You are considered an immortal creature for the purpose of effects that relate to creature origin.',
    },
    {
      name: 'Living Construct',
      description: 'You do not need to eat, drink, breathe, or sleep. You never make Endurance checks to resist the effect of starvation, thirst, or suffocation. You still need to take extended rests to gain their benefits.',
    },
    {
      name: 'Telepathy',
      description: 'You can communicate telepathically with any creature within 5 squares of you that has a language.',
    },
  ],
  racialPowerIds: ['racial-shard-swarm'],
};
