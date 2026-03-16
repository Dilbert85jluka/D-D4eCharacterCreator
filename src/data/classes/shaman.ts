import type { ClassData } from '../../types/gameData';

export const shaman: ClassData = {
  id: 'shaman',
  name: 'Shaman',
  role: 'Leader',
  powerSource: 'Primal',
  keyAbilities: ['wis', 'con', 'int'],
  armorProficiencies: ['Cloth', 'Leather'],
  weaponProficiencies: ['Simple melee', 'Longspear'],
  shieldProficiency: false,
  implements: ['Totem'],
  hpAtFirstLevel: 12,
  hpPerLevel: 5,
  healingSurgesPerDay: 7,
  fortitudeBonus: 1,
  reflexBonus: 0,
  willBonus: 1,
  trainedSkillCount: 4,
  availableSkills: ['arcana', 'athletics', 'endurance', 'heal', 'history', 'insight', 'perception', 'religion'],
  mandatorySkills: ['nature'],
  atWillPowerCount: 2,
  encounterPowerCount: 1,
  dailyPowerCount: 1,
  features: [
    {
      level: 1,
      name: 'Companion Spirit',
      description: 'You gain a spirit companion, an intangible creature that appears in an unoccupied square within 20 squares of you. Your spirit companion occupies 1 square. Enemies cannot move through its space, but allies can. It uses your defenses. If an attack that targets the spirit companion hits, you take the damage.',
    },
    {
      level: 1,
      name: 'Companion Spirit Choice',
      description: 'You choose a Protector Spirit or a Stalker Spirit. Your choice determines the type of opportunity attack your spirit companion can make and the benefit you and your allies receive when adjacent to your spirit companion.',
    },
    {
      level: 1,
      name: 'Protector Spirit',
      description: 'Any ally adjacent to your spirit companion regains additional hit points equal to your Constitution modifier when the ally uses second wind or when you use a healing power on that ally. The spirit companion\'s opportunity attack is Spirit\'s Shield.',
    },
    {
      level: 1,
      name: 'Stalker Spirit',
      description: 'Any ally adjacent to your spirit companion gains a +1 bonus to attack rolls against bloodied enemies. The spirit companion\'s opportunity attack is Spirit\'s Fangs.',
    },
    {
      level: 1,
      name: 'Healing Spirit',
      description: 'You gain the healing spirit power, which you can use twice per encounter. When you use it, an ally adjacent to your spirit companion can spend a healing surge. You or one ally adjacent to the spirit companion also regains additional hit points.',
    },
    {
      level: 1,
      name: 'Speak with Spirits',
      description: 'You gain the speak with spirits power. As a minor action, you consult the spirits and gain a +2 bonus to your next skill check before the end of your turn.',
    },
  ],
};
