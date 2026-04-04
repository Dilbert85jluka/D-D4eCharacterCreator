import type { RaceData } from '../../types/gameData';

export const hamadryad: RaceData = {
  id: 'hamadryad',
  name: 'Hamadryad',
  size: 'Medium',
  speed: 6,
  vision: 'Low-light',
  languages: ['Common', 'Elven'],
  // Always +2 WIS; player chooses +2 CHA or +2 INT
  abilityBonuses: { wis: 2 },
  abilityBonusOptions: { amount: 2, options: ['cha', 'int'] },
  skillBonuses: [
    { skillId: 'diplomacy', bonus: 2 },
    { skillId: 'nature', bonus: 2 },
  ],
  traits: [
    {
      name: 'Female Only',
      description: 'All hamadryads are female.',
      source: 'HotF',
    },
    {
      name: 'Fey Origin',
      description: 'Your ancestors were native to the Feywild, so you are considered a fey creature for the purpose of effects that relate to creature origin.',
      source: 'HotF',
    },
    {
      name: 'Forest Walk',
      description: 'You ignore difficult terrain if that terrain is the result of trees, underbrush, plants, or natural growth.',
      source: 'HotF',
    },
    {
      name: 'Oaken Vitality',
      description: 'You gain a +5 racial bonus to Endurance checks to resist the effects of starvation, thirst, or suffocation, and you can survive for twice the normal time period before you are required to make such checks. You do not require sleep, but you must meditate at least four hours each day to absorb light, soak in water, or connect with the earth beneath your feet. This meditation grants you the benefits that other races receive from an extended rest. While meditating, you are fully aware of your surroundings and notice approaching enemies and other events as normal.',
      source: 'HotF',
    },
    {
      name: 'Tree Mind',
      description: 'You gain a +2 racial bonus to saving throws against effects that daze, dominate, or stun.',
      source: 'HotF',
      conditional: true,
    },
    {
      name: 'Hamadryad Aspects',
      description: 'You have the hamadryad aspects encounter power.',
      source: 'HotF',
    },
  ],
  racialPowerIds: ['racial-hamadryad-aspects'],
};
