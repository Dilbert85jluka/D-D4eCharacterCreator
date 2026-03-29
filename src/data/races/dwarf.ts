import type { RaceData } from '../../types/gameData';

export const dwarf: RaceData = {
  id: 'dwarf',
  name: 'Dwarf',
  size: 'Medium',
  speed: 5,
  vision: 'Low-light',
  languages: ['Common', 'Dwarven'],
  // Always +2 CON; player chooses +2 STR or +2 WIS
  abilityBonuses: { con: 2 },
  abilityBonusOptions: { amount: 2, options: ['str', 'wis'] },
  skillBonuses: [
    { skillId: 'dungeoneering', bonus: 2 },
    { skillId: 'endurance', bonus: 2 },
  ],
  traits: [
    {
      name: 'Cast-Iron Stomach',
      description: 'You have a +5 racial bonus to saving throws against poison.',
      source: 'PHB',
      conditional: true,
    },
    {
      name: 'Dwarven Resilience',
      description: 'You can use your second wind as a minor action instead of a standard action.',
      source: 'PHB',
    },
    {
      name: 'Dwarven Weapon Proficiency',
      description: 'You gain proficiency with the throwing hammer and the warhammer.',
      source: 'PHB',
    },
    {
      name: 'Encumbered Speed',
      description: 'You move at your normal speed even when it would normally be reduced by armor or a heavy load. Other effects that limit speed (such as difficult terrain or magic) affect you normally.',
      source: 'PHB',
    },
    {
      name: 'Stand Your Ground',
      description: 'When an effect forces you to move—through a push, a pull, or a slide—you can move 1 square less than the effect specifies. Also, when an attack would knock you prone, you can make a saving throw to avoid falling prone.',
      source: 'PHB',
    },
  ],
  racialPowerIds: [],
};
