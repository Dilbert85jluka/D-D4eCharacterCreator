import type { RaceData } from '../../types/gameData';

export const halfElf: RaceData = {
  id: 'half-elf',
  name: 'Half-Elf',
  size: 'Medium',
  speed: 6,
  vision: 'Low-light',
  languages: ['Common', 'Elven', 'Choice of one other'],
  // Always +2 CON; player chooses +2 CHA or +2 WIS
  abilityBonuses: { con: 2 },
  abilityBonusOptions: { amount: 2, options: ['cha', 'wis'] },
  skillBonuses: [
    { skillId: 'diplomacy', bonus: 2 },
    { skillId: 'insight', bonus: 2 },
  ],
  traits: [
    {
      name: 'Dilettante',
      description: 'At 1st level, you choose a 1st-level at-will attack power from a class different from yours. You can use that power as an encounter power.',
      source: 'PHB',
    },
    {
      name: 'Dual Heritage',
      description: 'You can take feats that have either elf or human as a prerequisite (as well as those specifically for half-elves), as long as you meet any other requirements.',
      source: 'PHB',
    },
    {
      name: 'Group Diplomacy',
      description: 'You grant allies within 10 squares of you a +1 racial bonus to Diplomacy checks.',
      source: 'PHB',
    },
    {
      name: 'Knack for Success',
      description: 'You have the knack for success power. You or one ally in the burst gains one of the following: a saving throw, a shift up to 2 squares, or a +2 bonus to the next attack roll before the end of your next turn. (Replaces Dilettante.)',
      source: 'HotFK',
    },
  ],
  racialPowerIds: [],
  bonusAtWill: true,
};
