import type { GearData } from '../../types/gameData';

export const GEAR: GearData[] = [
  { id: 'adventurers-kit',   name: "Adventurer's Kit",    cost: 15,  weight: 33, description: 'Backpack, bedroll, flint and steel, belt pouch, trail rations (10 days), hempen rope (50 ft.), sunrods (2), waterskin.' },
  { id: 'rope-hempen',       name: 'Rope, Hempen (50 ft.)',cost: 1,  weight: 10, description: 'Standard 50-foot hempen rope.' },
  { id: 'rope-silk',         name: 'Rope, Silk (50 ft.)', cost: 10,  weight: 5,  description: 'High-quality 50-foot silk rope.' },
  { id: 'sunrod',            name: 'Sunrod',              cost: 2,   weight: 1,  description: 'This 1-foot-long, gold-tipped, iron rod glows when struck. It illuminates a 20-square radius and lasts 4 hours.' },
  { id: 'torch',             name: 'Torch',               cost: 1,   weight: 1,  description: 'A torch illuminates a 5-square radius and lasts 1 hour.' },
  { id: 'lantern',           name: 'Lantern',             cost: 7,   weight: 2,  description: 'A lantern illuminates a 10-square radius and lasts 8 hours per pint of oil.' },
  { id: 'oil-flask',         name: 'Oil, Flask',          cost: 1,   weight: 1,  description: 'One flask of lamp oil provides 8 hours of illumination in a lantern.' },
  { id: 'waterskin',         name: 'Waterskin',           cost: 1,   weight: 4,  description: 'Holds 1 gallon of liquid.' },
  { id: 'trail-rations',     name: 'Trail Rations (10)',  cost: 5,   weight: 10, description: 'Ten days of preserved food for traveling.' },
  { id: 'healer-s-kit',      name: "Healer's Kit",        cost: 15,  weight: 1,  description: 'You gain a +2 bonus to Heal checks. The kit has 10 uses.' },
  { id: 'thieves-tools',     name: "Thieves' Tools",      cost: 20,  weight: 1,  description: 'You gain a +2 bonus to Thievery checks to open locks. Has 10 uses.' },
  { id: 'holy-symbol-iron',  name: 'Holy Symbol, Iron',   cost: 10,  weight: 1,  description: 'An iron holy symbol, used as an implement by divine characters.' },
  { id: 'ritual-book',       name: 'Ritual Book',         cost: 50,  weight: 3,  description: 'A blank book for recording rituals.' },
  { id: 'pouch-belt',        name: 'Pouch, Belt',         cost: 1,   weight: 0,  description: 'A small pouch worn at the belt.' },
  { id: 'backpack',          name: 'Backpack',            cost: 2,   weight: 2,  description: 'A sturdy leather backpack.' },
  { id: 'bedroll',           name: 'Bedroll',             cost: 1,   weight: 5,  description: 'A comfortable sleeping roll.' },
  { id: 'grappling-hook',    name: 'Grappling Hook',      cost: 1,   weight: 4,  description: 'Allows you to throw a rope and hook it on an object above you.' },
  { id: 'climbers-kit',      name: "Climber's Kit",       cost: 2,   weight: 11, description: 'Grants a +2 bonus to Athletics checks to climb. Has 5 uses.' },
  { id: 'mirror-small',      name: 'Mirror, Small Steel', cost: 10,  weight: 0,  description: 'A small polished steel mirror.' },
  { id: 'crowbar',           name: 'Crowbar',             cost: 2,   weight: 5,  description: 'Grants a +2 bonus to Strength checks to break things open.' },
];
