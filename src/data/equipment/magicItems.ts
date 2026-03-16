import type { MagicItemData } from '../../types/gameData';

export const MAGIC_ITEMS: MagicItemData[] = [

  // ── Neck ──────────────────────────────────────────────────────────────────
  {
    id: 'amulet-protection-1',
    name: 'Amulet of Protection +1',
    level: 2, slot: 'neck', enhancement: 1, cost: 520, weight: 0,
    properties: 'Item Bonus: +1 to Fortitude, Reflex, and Will defenses.',
    bonuses: { fortitude: 1, reflex: 1, will: 1 },
  },
  {
    id: 'amulet-protection-2',
    name: 'Amulet of Protection +2',
    level: 7, slot: 'neck', enhancement: 2, cost: 2600, weight: 0,
    properties: 'Item Bonus: +2 to Fortitude, Reflex, and Will defenses.',
    bonuses: { fortitude: 2, reflex: 2, will: 2 },
  },
  {
    id: 'amulet-protection-3',
    name: 'Amulet of Protection +3',
    level: 12, slot: 'neck', enhancement: 3, cost: 13000, weight: 0,
    properties: 'Item Bonus: +3 to Fortitude, Reflex, and Will defenses.',
    bonuses: { fortitude: 3, reflex: 3, will: 3 },
  },
  {
    id: 'amulet-protection-4',
    name: 'Amulet of Protection +4',
    level: 17, slot: 'neck', enhancement: 4, cost: 65000, weight: 0,
    properties: 'Item Bonus: +4 to Fortitude, Reflex, and Will defenses.',
    bonuses: { fortitude: 4, reflex: 4, will: 4 },
  },
  {
    id: 'amulet-health-1',
    name: 'Amulet of Health +1',
    level: 4, slot: 'neck', enhancement: 1, cost: 840, weight: 0,
    properties: 'Item Bonus: +1 to Fortitude, Reflex, and Will. Gain +5 to saves against ongoing damage.',
    bonuses: { fortitude: 1, reflex: 1, will: 1 },
  },
  {
    id: 'periapt-cascading-health-1',
    name: 'Periapt of Cascading Health +1',
    level: 3, slot: 'neck', enhancement: 1, cost: 680, weight: 0,
    properties: 'Item Bonus: +1 to Fortitude, Reflex, and Will. Power (Encounter): When you spend a healing surge, one ally within 5 squares of you can also spend a healing surge.',
    power: 'Encounter – Minor Action. When you spend a healing surge, one ally within 5 squares of you may spend a healing surge.',
    bonuses: { fortitude: 1, reflex: 1, will: 1 },
  },

  // ── Arms ─────────────────────────────────────────────────────────────────
  {
    id: 'cloak-resistance-1',
    name: 'Cloak of Resistance +1',
    level: 2, slot: 'arms', enhancement: 1, cost: 520, weight: 0,
    properties: '+1 item bonus to Fortitude, Reflex, and Will. Power (Daily): Minor Action. Gain resist 5 to all damage until start of your next turn.',
    power: 'Daily – Minor Action. Gain resist 5 to all damage until the start of your next turn.',
    bonuses: { fortitude: 1, reflex: 1, will: 1 },
  },
  {
    id: 'cloak-resistance-2',
    name: 'Cloak of Resistance +2',
    level: 7, slot: 'arms', enhancement: 2, cost: 2600, weight: 0,
    properties: '+2 item bonus to Fortitude, Reflex, and Will. Power (Daily): Minor Action. Gain resist 10 to all damage until start of your next turn.',
    power: 'Daily – Minor Action. Gain resist 10 to all damage until the start of your next turn.',
    bonuses: { fortitude: 2, reflex: 2, will: 2 },
  },
  {
    id: 'bracers-defense-1',
    name: 'Bracers of Defense +1',
    level: 3, slot: 'arms', enhancement: 1, cost: 680, weight: 1,
    properties: '+1 item bonus to AC and Reflex when you are not wearing heavy armor.',
    bonuses: { ac: 1, reflex: 1 },
  },
  {
    id: 'bracers-defense-2',
    name: 'Bracers of Defense +2',
    level: 8, slot: 'arms', enhancement: 2, cost: 3400, weight: 1,
    properties: '+2 item bonus to AC and Reflex when you are not wearing heavy armor.',
    bonuses: { ac: 2, reflex: 2 },
  },
  {
    id: 'bracers-mighty-striking',
    name: 'Bracers of Mighty Striking',
    level: 6, slot: 'arms', enhancement: 0, cost: 1800, weight: 1,
    properties: 'Power (Encounter): Free Action. Use when you hit with a melee attack. The attack deals +1d6 damage.',
    power: 'Encounter – Free Action. Use this power when you hit with a melee attack. The attack deals 1d6 extra damage.',
  },

  // ── Head ─────────────────────────────────────────────────────────────────
  {
    id: 'helm-battle',
    name: 'Helm of Battle',
    level: 3, slot: 'head', enhancement: 0, cost: 680, weight: 2,
    properties: '+1 item bonus to initiative. Allies within 5 squares gain +1 item bonus to initiative on their first turn of the encounter.',
    bonuses: { initiative: 1 },
  },
  {
    id: 'crown-equilibrium',
    name: 'Crown of Equilibrium',
    level: 8, slot: 'head', enhancement: 0, cost: 3400, weight: 1,
    properties: 'Gain +1 item bonus to healing surge value per tier (Heroic +1, Paragon +2, Epic +3).',
    bonuses: { healingSurgeBonus: 1 },
  },
  {
    id: 'hat-disguise',
    name: 'Hat of Disguise',
    level: 5, slot: 'head', enhancement: 0, cost: 1000, weight: 0,
    properties: 'Power (At-Will): Minor Action. You disguise yourself to appear as any humanoid of your size. The illusion does not withstand physical scrutiny.',
    power: 'At-Will – Minor Action. Disguise yourself as any humanoid of your size. A DC 15 Insight check reveals the disguise. The disguise ends when you end it, are knocked unconscious, or enter combat.',
  },
  {
    id: 'headband-intellect',
    name: 'Headband of Intellect',
    level: 6, slot: 'head', enhancement: 0, cost: 1800, weight: 0,
    properties: '+2 item bonus to Arcana, History, and Religion checks.',
  },

  // ── Feet ─────────────────────────────────────────────────────────────────
  {
    id: 'boots-striding',
    name: 'Boots of Striding',
    level: 7, slot: 'feet', enhancement: 0, cost: 2600, weight: 1,
    properties: '+1 item bonus to speed. Power (At-Will): Minor Action. Ignore difficult terrain until end of your next move action.',
    bonuses: { speed: 1 },
  },
  {
    id: 'boots-fencing-master',
    name: 'Boots of the Fencing Master',
    level: 3, slot: 'feet', enhancement: 0, cost: 680, weight: 1,
    properties: '+1 item bonus to Reflex defense. +1 item bonus to speed while wearing light armor or no armor.',
    bonuses: { reflex: 1, speed: 1 },
  },
  {
    id: 'boots-eagerness',
    name: 'Boots of Eagerness',
    level: 2, slot: 'feet', enhancement: 0, cost: 520, weight: 1,
    properties: '+2 item bonus to initiative.',
    bonuses: { initiative: 2 },
  },
  {
    id: 'boots-spider-climbing',
    name: 'Boots of Spider Climbing',
    level: 9, slot: 'feet', enhancement: 0, cost: 4200, weight: 1,
    properties: 'Power (Encounter): Move Action. Climb at full speed until end of your next turn. You do not need to make Athletics checks to climb.',
    power: 'Encounter – Move Action. Climb at full speed until end of your next turn, no Athletics check required.',
  },

  // ── Hands ─────────────────────────────────────────────────────────────────
  {
    id: 'gauntlets-ogre-power',
    name: 'Gauntlets of Ogre Power',
    level: 9, slot: 'hands', enhancement: 0, cost: 4200, weight: 1,
    properties: '+2 item bonus to Strength-based ability checks (not attack rolls or damage).',
  },
  {
    id: 'gloves-piercing',
    name: 'Gloves of Piercing',
    level: 5, slot: 'hands', enhancement: 0, cost: 1000, weight: 0,
    properties: 'Your attacks ignore 5 points of a target\'s resistance.',
  },
  {
    id: 'iron-armbands-power',
    name: 'Iron Armbands of Power (Heroic)',
    level: 6, slot: 'hands', enhancement: 0, cost: 1800, weight: 1,
    properties: '+2 item bonus to melee damage rolls.',
  },

  // ── Waist ─────────────────────────────────────────────────────────────────
  {
    id: 'belt-vigor-1',
    name: 'Belt of Vigor +1',
    level: 2, slot: 'waist', enhancement: 1, cost: 520, weight: 0,
    properties: '+1 item bonus to healing surge value.',
    bonuses: { healingSurgeBonus: 1 },
  },
  {
    id: 'belt-vigor-2',
    name: 'Belt of Vigor +2',
    level: 7, slot: 'waist', enhancement: 2, cost: 2600, weight: 0,
    properties: '+2 item bonus to healing surge value.',
    bonuses: { healingSurgeBonus: 2 },
  },
  {
    id: 'belt-constitution',
    name: 'Belt of Constitution',
    level: 7, slot: 'waist', enhancement: 0, cost: 2600, weight: 0,
    properties: 'Gain one additional healing surge per day.',
    bonuses: { surgesPerDay: 1 },
  },

  // ── Ring ─────────────────────────────────────────────────────────────────
  {
    id: 'ring-protection',
    name: 'Ring of Protection',
    level: 4, slot: 'ring', enhancement: 0, cost: 840, weight: 0,
    properties: '+1 item bonus to AC and all other defenses.',
    bonuses: { ac: 1, fortitude: 1, reflex: 1, will: 1 },
  },
  {
    id: 'ring-free-time',
    name: 'Ring of Free Time',
    level: 10, slot: 'ring', enhancement: 0, cost: 5000, weight: 0,
    properties: 'Power (Daily): Free Action. Take an additional minor action on your turn.',
    power: 'Daily – Free Action. Take one additional minor action during your turn.',
  },
  {
    id: 'ring-feather-falling',
    name: 'Ring of Feather Falling',
    level: 6, slot: 'ring', enhancement: 0, cost: 1800, weight: 0,
    properties: 'You fall at a rate of 6 squares per round and land safely without taking falling damage. You also slow your fall automatically when adjacent to a wall.',
  },

  // ── Implements ────────────────────────────────────────────────────────────
  {
    id: 'orb-imposition-1',
    name: 'Orb of Imposition +1',
    level: 3, slot: 'implement', enhancement: 1, cost: 680, weight: 1,
    properties: '+1 enhancement bonus to attack rolls and damage rolls with arcane implement powers. Power (Daily): Free Action. Use when you hit an enemy with an arcane power. Extend the duration of one effect of that power by 1 round.',
    power: 'Daily – Free Action. Use when you hit an enemy with an arcane power. Extend the duration of one effect of that power by one round.',
  },
  {
    id: 'staff-warmage-1',
    name: 'Staff of the Warmage +1',
    level: 2, slot: 'implement', enhancement: 1, cost: 520, weight: 4,
    properties: '+1 enhancement bonus to attack rolls and damage rolls with arcane implement powers. The staff can also be used as a +1 quarterstaff (1d8 damage).',
  },
  {
    id: 'wand-accuracy-1',
    name: 'Wand of Accuracy +1',
    level: 2, slot: 'implement', enhancement: 1, cost: 520, weight: 0,
    properties: '+1 enhancement bonus to attack rolls and damage rolls with arcane implement powers. Power (Encounter): Free Action. Use when making an attack roll with this wand. Reroll the attack and use the higher result.',
    power: 'Encounter – Free Action. Use when making an arcane attack roll with this implement. Reroll the attack roll and use the higher result.',
  },
  {
    id: 'holy-symbol-battle-1',
    name: 'Holy Symbol of Battle +1',
    level: 2, slot: 'implement', enhancement: 1, cost: 520, weight: 0,
    properties: '+1 enhancement bonus to attack rolls and damage rolls with divine implement powers. Power (Daily): Free Action. Use when you hit an enemy with a divine attack. That enemy grants combat advantage until the end of your next turn.',
    power: 'Daily – Free Action. Use when you hit with a divine attack. That enemy grants combat advantage until end of your next turn.',
  },
  {
    id: 'rod-corruption-1',
    name: 'Rod of Corruption +1',
    level: 3, slot: 'implement', enhancement: 1, cost: 680, weight: 1,
    properties: '+1 enhancement bonus to attack rolls and damage rolls with arcane implement powers. Power (Encounter): Minor Action. One enemy within 5 squares takes a -1 penalty to saving throws until the end of your next turn.',
    power: 'Encounter – Minor Action. One enemy within 5 squares takes a -1 penalty to saving throws until the end of your next turn.',
  },
  {
    id: 'tome-clarity-1',
    name: 'Tome of Clarity +1',
    level: 3, slot: 'implement', enhancement: 1, cost: 680, weight: 2,
    properties: '+1 enhancement bonus to attack rolls and damage rolls with arcane implement powers. Power (Daily): Minor Action. You or one ally within 5 squares gains +2 power bonus to all defenses until end of your next turn.',
    power: 'Daily – Minor Action. You or one ally within 5 squares gains a +2 power bonus to all defenses until the end of your next turn.',
  },

  // ── Wondrous Items ────────────────────────────────────────────────────────
  {
    id: 'bag-of-holding',
    name: 'Bag of Holding',
    level: 5, slot: 'wondrous', enhancement: 0, cost: 1000, weight: 0,
    properties: 'This bag holds up to 200 pounds or 20 cubic feet of content, which weigh only 20 pounds outside the bag. The bag cannot hold living creatures.',
  },
  {
    id: 'everlasting-provisions',
    name: 'Everlasting Provisions',
    level: 5, slot: 'wondrous', enhancement: 0, cost: 1000, weight: 2,
    properties: 'Once per day, this container produces enough food and water to sustain five Medium or smaller creatures for 24 hours.',
    power: 'Daily – Minor Action. Produce food and water for five creatures for 24 hours.',
  },
  {
    id: 'salve-of-power',
    name: 'Salve of Power',
    level: 5, slot: 'wondrous', enhancement: 0, cost: 1000, weight: 0,
    properties: 'Power (Daily): Minor Action. You regain the use of one expended daily attack power.',
    power: 'Daily – Minor Action. Recover one expended daily attack power.',
  },
  {
    id: 'ritual-candle',
    name: 'Ritual Candle',
    level: 4, slot: 'wondrous', enhancement: 0, cost: 840, weight: 0,
    properties: 'When you perform a ritual, burning one ritual candle reduces the ritual\'s time by 10 minutes (minimum 1 minute). Lasts 1 hour of burning.',
  },
  {
    id: 'stone-good-luck',
    name: 'Stone of Good Luck',
    level: 7, slot: 'wondrous', enhancement: 0, cost: 2600, weight: 0,
    properties: '+1 item bonus to all skill checks and ability checks.',
  },
  {
    id: 'pouch-platinum',
    name: 'Pouch of Platinum',
    level: 6, slot: 'wondrous', enhancement: 0, cost: 1800, weight: 0,
    properties: 'Once per day, reaching into this pouch produces 1d10 gp. The pouch never produces more than 1d10 gp per day.',
    power: 'Daily – Minor Action. Produce 1d10 gp from the pouch.',
  },
];
