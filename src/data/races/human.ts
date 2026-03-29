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
  fortitudeBonus: 1,
  reflexBonus: 1,
  willBonus: 1,
  traits: [
    {
      name: '+2 to One Ability Score',
      description: 'Humans gain a +2 bonus to one ability score of their choice at character creation.',
      source: 'PHB',
    },
    {
      name: 'Bonus At-Will Power',
      description: 'You know one extra 1st-level at-will attack power from your class.',
      source: 'PHB',
    },
    {
      name: 'Bonus Feat',
      description: 'You gain one extra feat at 1st level.',
      source: 'PHB',
    },
    {
      name: 'Bonus Skill',
      description: 'You gain training in one extra skill from your class skill list.',
      source: 'PHB',
    },
    {
      name: 'Human Defense Bonuses',
      description: 'You gain a +1 racial bonus to Fortitude, Reflex, and Will defenses.',
      source: 'PHB',
    },
    {
      name: 'Heroic Effort',
      description: 'You have the heroic effort power. Trigger: You miss with an attack or fail a saving throw. Effect (no action): You gain a +4 racial bonus to the attack roll or saving throw. (Replaces Bonus At-Will Power.)',
      source: 'HotFK',
    },
  ],
  racialPowerIds: [],
  bonusFeat: true,
  bonusSkill: true,
};
