import type { RaceData } from '../../types/gameData';

export const human: RaceData = {
  id: 'human',
  name: 'Human',
  size: 'Medium',
  speed: 6,
  vision: 'Normal',
  languages: ['Common', 'One extra language of choice'],
  abilityBonuses: {},  // +2 to any one ability score of player's choice
  skillBonuses: [],
  traits: [
    {
      name: '+2 to One Ability Score',
      description: 'Humans gain a +2 bonus to one ability score of their choice at character creation.',
    },
    {
      name: 'Bonus At-Will Power',
      description: 'You know one extra 1st-level at-will attack power from your class.',
    },
    {
      name: 'Bonus Feat',
      description: 'You gain one extra feat at 1st level.',
    },
    {
      name: 'Bonus Skill',
      description: 'You gain training in one extra skill from your class skill list.',
    },
    {
      name: 'Human Defense Bonuses',
      description: 'You gain a +1 racial bonus to your Fortitude, Reflex, and Will defenses.',
    },
  ],
  racialPowerIds: [],
  bonusFeat: true,
  bonusSkill: true,
};
