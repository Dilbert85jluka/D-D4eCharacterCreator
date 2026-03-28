import type { GearData } from '../../types/gameData';

export const GEAR: GearData[] = [
  // ── Gear (PHB) ─────────────────────────────────────────────────────────────
  { id: 'adventurers-kit',   name: "Adventurer's Kit",       cost: 15,   weight: 33,  description: 'Includes backpack, bedroll, flint and steel, belt pouch, two sunrods, ten days\' trail rations, 50 ft. hempen rope, and waterskin.', category: 'Gear' },
  { id: 'backpack',          name: 'Backpack',               cost: 2,    weight: 2,   description: 'A sturdy leather backpack.', category: 'Gear' },
  { id: 'bedroll',           name: 'Bedroll',                cost: 0.1,  weight: 5,   description: 'A comfortable sleeping roll.', costLabel: '1 sp', category: 'Gear' },
  { id: 'flint-and-steel',   name: 'Flint and Steel',        cost: 1,    weight: 0,   description: 'Used to start fires.', category: 'Gear' },
  { id: 'pouch-belt',        name: 'Belt Pouch (empty)',      cost: 1,    weight: 0.5, description: 'A small pouch worn at the belt.', category: 'Gear' },
  { id: 'sunrod',            name: 'Sunrod (2)',              cost: 4,    weight: 2,   description: 'A gold-tipped iron rod that sheds bright light to a radius of 20 squares. Lasts 4 hours.', category: 'Gear' },
  { id: 'trail-rations',     name: 'Trail Rations (10 days)', cost: 5,   weight: 10,  description: 'Ten days of preserved food for traveling.', category: 'Gear' },
  { id: 'rope-hempen',       name: 'Hempen Rope (50 ft.)',   cost: 1,    weight: 10,  description: 'Standard 50-foot hempen rope.', category: 'Gear' },
  { id: 'waterskin',         name: 'Waterskin',              cost: 1,    weight: 4,   description: 'Holds 1 gallon of liquid.', category: 'Gear' },
  { id: 'candle',            name: 'Candle',                 cost: 0.01, weight: 0,   description: 'A simple wax candle.', costLabel: '1 cp', category: 'Gear' },
  { id: 'chain-10ft',        name: 'Chain (10 ft.)',         cost: 30,   weight: 2,   description: 'A 10-foot length of heavy chain.', category: 'Gear' },
  { id: 'chest-empty',       name: 'Chest (empty)',          cost: 2,    weight: 25,  description: 'A sturdy wooden chest.', category: 'Gear' },
  { id: 'climbers-kit',      name: "Climber's Kit",          cost: 2,    weight: 11,  description: 'Includes grappling hook, small hammer, and ten pitons. Grants a +2 bonus to Athletics checks for climbing.', category: 'Gear' },
  { id: 'grappling-hook',    name: 'Grappling Hook',         cost: 1,    weight: 4,   description: 'Allows you to throw a rope and hook it on an object above you.', category: 'Gear' },
  { id: 'hammer',            name: 'Hammer',                 cost: 0.5,  weight: 2,   description: 'A small hammer for driving pitons.', costLabel: '5 sp', category: 'Gear' },
  { id: 'pitons-10',         name: 'Pitons (10)',            cost: 0.5,  weight: 5,   description: 'Ten iron spikes for climbing.', costLabel: '5 sp', category: 'Gear' },
  { id: 'everburning-torch', name: 'Everburning Torch',      cost: 50,   weight: 1,   description: 'Never stops burning. Sheds bright light in a 5-square radius. Produces no heat and cannot set fire to anything.', category: 'Gear' },
  { id: 'fine-clothing',     name: 'Fine Clothing',          cost: 30,   weight: 6,   description: 'High-quality garments suitable for court or formal occasions.', category: 'Gear' },
  { id: 'flask-empty',       name: 'Flask (empty)',          cost: 0.03, weight: 1,   description: 'A small glass or ceramic flask.', costLabel: '3 cp', category: 'Gear' },
  { id: 'journeybreads-10',  name: 'Journeybreads (10 days)', cost: 50,  weight: 1,   description: 'Magic bread that fills the stomach and provides all necessary nutrients with only a few small bites.', category: 'Gear' },
  { id: 'lantern',           name: 'Lantern',               cost: 7,    weight: 2,   description: 'A hooded lantern that illuminates a 10-square radius. Burns for 8 hours per pint of oil.', category: 'Gear' },
  { id: 'rope-silk',         name: 'Silk Rope (50 ft.)',    cost: 10,   weight: 5,   description: 'High-quality 50-foot silk rope.', category: 'Gear' },
  { id: 'ritual-book',       name: 'Ritual Book',           cost: 50,   weight: 3,   description: 'A blank book for recording rituals. Ritual casters store mastered rituals in it.', category: 'Gear' },
  { id: 'spellbook',         name: 'Spellbook',             cost: 50,   weight: 3,   description: 'Wizards keep learned spells in a spellbook.', category: 'Gear' },
  { id: 'tent',              name: 'Tent',                  cost: 10,   weight: 20,  description: 'A two-person canvas tent.', category: 'Gear' },
  { id: 'thieves-tools',     name: "Thieves' Tools",        cost: 20,   weight: 1,   description: 'Picks, pries, skeleton keys, clamps, and other tools. Grants a +2 bonus to Thievery checks to open locks or disable traps.', category: 'Gear' },
  { id: 'torch',             name: 'Torch',                 cost: 0.1,  weight: 1,   description: 'Burns for 1 hour, shedding bright light in a 5-square radius.', costLabel: '1 sp', category: 'Gear' },
  { id: 'oil-1-pint',        name: 'Oil (1 pint)',          cost: 0.1,  weight: 1,   description: 'One pint of lamp oil. Provides 8 hours of illumination in a lantern.', costLabel: '1 sp', category: 'Gear' },
  { id: 'crowbar',           name: 'Crowbar',               cost: 2,    weight: 5,   description: 'Grants a +2 bonus to Strength checks to break things open.', category: 'Gear' },
  { id: 'mirror-small',      name: 'Mirror, Small Steel',   cost: 10,   weight: 0.5, description: 'A small polished steel mirror.', category: 'Gear' },

  // ── Ritual Components (PHB) ─────────────────────────────────────────────────
  { id: 'alchemical-reagents', name: 'Alchemical Reagents (Arcana)', cost: 1, weight: 0, description: 'Ritual components for Arcana rituals. Powdered metals, rare earths, acids, salts, and creature extracts.', category: 'Component' },
  { id: 'mystic-salves',      name: 'Mystic Salves (Heal)',         cost: 1, weight: 0, description: 'Ritual components for Heal rituals. Blessed oils and unguents from rare spices.', category: 'Component' },
  { id: 'rare-herbs',         name: 'Rare Herbs (Nature)',          cost: 1, weight: 0, description: 'Ritual components for Nature rituals. Collected during certain seasons.', category: 'Component' },
  { id: 'sanctified-incense', name: 'Sanctified Incense (Religion)', cost: 1, weight: 0, description: 'Ritual components for Religion rituals. Burned as powder or stick.', category: 'Component' },
  { id: 'residuum',           name: 'Residuum (Any)',               cost: 1, weight: 0, description: 'Concentrated magical substance produced by the Disenchant Magic Item ritual. Can substitute for any other component type.', category: 'Component' },

  // ── Musical Instruments (PHB2) ──────────────────────────────────────────────
  { id: 'drum',     name: 'Drum',     cost: 3,  weight: 1, description: 'A musical instrument. Nonmagical, confers no game benefit but can be enchanted.', category: 'Musical Instrument' },
  { id: 'flute',    name: 'Flute',    cost: 5,  weight: 1, description: 'A musical instrument. Nonmagical, confers no game benefit but can be enchanted.', category: 'Musical Instrument' },
  { id: 'harp',     name: 'Harp',     cost: 15, weight: 4, description: 'A musical instrument. Nonmagical, confers no game benefit but can be enchanted.', category: 'Musical Instrument' },
  { id: 'horn',     name: 'Horn',     cost: 7,  weight: 3, description: 'A musical instrument. Nonmagical, confers no game benefit but can be enchanted.', category: 'Musical Instrument' },
  { id: 'lute',     name: 'Lute',     cost: 12, weight: 2, description: 'A musical instrument. Nonmagical, confers no game benefit but can be enchanted.', category: 'Musical Instrument' },
  { id: 'lyre',     name: 'Lyre',     cost: 9,  weight: 2, description: 'A musical instrument. Nonmagical, confers no game benefit but can be enchanted.', category: 'Musical Instrument' },
  { id: 'woodwind', name: 'Woodwind', cost: 10, weight: 2, description: 'A musical instrument. Nonmagical, confers no game benefit but can be enchanted.', category: 'Musical Instrument' },

  // ── Totem (PHB2) ────────────────────────────────────────────────────────────
  { id: 'totem', name: 'Totem', cost: 5, weight: 2, description: 'A short length of wood or bone carved to resemble a nature spirit, adorned with feathers, fur, leaves, bones, or teeth. Used by druids and shamans as a focus for evocations. Nonmagical, confers no game benefit but can be enchanted.', category: 'Gear' },

  // ── Food & Drink (PHB) ─────────────────────────────────────────────────────
  { id: 'ale-pitcher',   name: 'Pitcher of Ale',  cost: 0.2, weight: 0, description: 'A pitcher of common ale.', costLabel: '2 sp', category: 'Food & Drink' },
  { id: 'meal-common',   name: 'Common Meal',     cost: 0.2, weight: 0, description: 'A basic meal at a tavern.', costLabel: '2 sp', category: 'Food & Drink' },
  { id: 'meal-feast',    name: 'Feast (one meal)', cost: 5,   weight: 0, description: 'An elaborate meal for one person.', category: 'Food & Drink' },
  { id: 'wine-bottle',   name: 'Bottle of Wine',  cost: 5,   weight: 0, description: 'A bottle of fine wine.', category: 'Food & Drink' },

  // ── Lodging (PHB) ──────────────────────────────────────────────────────────
  { id: 'room-typical', name: 'Typical Room (per day)', cost: 0.5, weight: 0, description: "One night's stay in a typical inn's common room.", costLabel: '5 sp', category: 'Lodging' },
  { id: 'room-luxury',  name: 'Luxury Room (per day)',  cost: 2,   weight: 0, description: "One night's stay in a typical inn's best room.", category: 'Lodging' },

  // ── Transport (PHB) ────────────────────────────────────────────────────────
  { id: 'cart',           name: 'Cart',          cost: 20,    weight: 0, description: 'A simple two-wheeled cart. Cart weight 2,000 lb.', category: 'Transport' },
  { id: 'wagon',          name: 'Wagon',         cost: 20,    weight: 0, description: 'A four-wheeled wagon. Wagon weight 2,000 lb.', category: 'Transport' },
  { id: 'rowboat',        name: 'Rowboat',       cost: 50,    weight: 0, description: 'A small rowing boat for lakes and rivers. Rowboat weight 600 lb.', category: 'Transport' },
  { id: 'sailing-ship',   name: 'Sailing Ship',  cost: 10000, weight: 0, description: 'A large oceangoing vessel. Ship weight 300,000 lb.', category: 'Transport' },

  // ── Mounts (PHB + AV) ────────────────────────────────────────────────────
  { id: 'riding-horse',       name: 'Riding Horse',          cost: 75,     weight: 0, description: 'Level 1 Brute. Speed 10. HP 36, AC 14, Fort 15, Ref 13, Will 10. Kick: +4 vs AC, 1d6+4 damage. Normal Load 237 lb, Heavy Load 475 lb, Max Drag 1,187 lb.', category: 'Mount' },
  { id: 'camel',              name: 'Camel',                 cost: 75,     weight: 0, description: 'Level 1 Brute. Speed 9. HP 38, AC 13, Fort 13, Ref 10, Will 9. Kick: +4 vs AC, 1d10+4 damage. Endurance +9.', category: 'Mount' },
  { id: 'giant-lizard-draft', name: 'Giant Lizard, Draft',   cost: 200,    weight: 0, description: 'Level 4 Brute. Speed 7 (swamp walk), climb 2. HP 69, AC 16, Fort 18, Ref 16, Will 13. Bite: +7 vs AC, 2d6+4 damage. Draft/pack animal.', category: 'Mount' },
  { id: 'warhorse',           name: 'Warhorse',              cost: 680,    weight: 0, description: 'Level 3 Brute. Speed 8. HP 58, AC 17, Fort 16, Ref 14, Will 14. Kick: +6 vs AC, 1d6+5. Trample: +4 vs Ref, 1d6+6 (prone). Charger: rider with Mounted Combat feat gains +5 damage on charge attacks. Normal Load 262 lb, Heavy Load 525 lb.', category: 'Mount' },
  { id: 'dire-wolf',          name: 'Dire Wolf',             cost: 1000,   weight: 0, description: 'Level 5 Skirmisher. Speed 8. Low-light vision. HP 67, AC 19, Fort 18, Ref 17, Will 16. Bite: +10 vs AC, 2d8+4 (3d8+4 vs prone). Pack Harrier: CA vs enemy adjacent to 2+ allies. Pack Hunter (mount): rider has CA vs enemy adjacent to 1+ allies.', category: 'Mount' },
  { id: 'giant-ant',          name: 'Giant Ant',             cost: 1800,   weight: 0, description: 'Level 4 Skirmisher. Speed 9. HP 54, AC 18, Fort 17, Ref 17, Will 14. Bite: +9 vs AC, 1d10+6 (prone). Skitter: when shifting, shift 2 squares instead of 1.', category: 'Mount' },
  { id: 'giant-lizard-riding', name: 'Giant Lizard, Riding', cost: 1800,   weight: 0, description: 'Level 6 Brute. Speed 9 (swamp walk), climb 4. HP 90, AC 18, Fort 20, Ref 18, Will 14. Bite: +9 vs AC, 2d8+5. Claw: +10 vs AC, 2d6+5. Combined Attack (encounter): when rider attacks, lizard claws same target.', category: 'Mount' },
  { id: 'dire-boar',          name: 'Dire Boar',             cost: 1800,   weight: 0, description: 'Level 6 Brute. Speed 8. HP 85, AC 17, Fort 21, Ref 17, Will 16. Gore: +11 vs AC, 2d10+4 (2d10+9 vs prone). Furious Charge: +5 damage, push 2, prone. Rabid Charger: when rider charges, boar gores. Death Strike: gores when drops to 0 HP.', category: 'Mount' },
  { id: 'sea-horse',          name: 'Sea Horse',             cost: 1800,   weight: 0, description: 'Level 5 Brute. Speed swim 10. HP 80, AC 17, Fort 19, Ref 17, Will 15. Tail Slap (reach 2): +8 vs AC, 2d8+4. Aquatic Charge: rider deals extra 1d10 on charge; +2 attack vs non-swimmers.', category: 'Mount' },
  { id: 'rage-drake',         name: 'Rage Drake',            cost: 2600,   weight: 0, description: 'Level 5 Brute. Speed 8. HP 77, AC 17, Fort 18, Ref 15, Will 16. Bite: +10 vs AC, 2d10+5 (+12/2d10+7 bloodied). Raking Charge: two attacks 1d6+4. Raging Mount: while bloodied, rider gains +2 attack and damage with melee.', category: 'Mount' },
  { id: 'rhinoceros',         name: 'Rhinoceros',            cost: 2600,   weight: 0, description: 'Level 7 Soldier. Speed 6. HP 83, AC 23, Fort 23, Ref 21, Will 18. Gore: +13 vs AC, 2d6+5. Crushing Charge: on charge, rhino gores in addition to rider\'s attack.', category: 'Mount' },
  { id: 'elephant',           name: 'Elephant',              cost: 3400,   weight: 0, description: 'Level 8 Brute. Speed 8. HP 111, AC 20, Fort 22, Ref 15, Will 18. Tusk Slam (reach 2): +11 vs AC, 2d6+7. Stamp: +11 vs AC, 1d10+7 (prone). Trampling Charge: moves through Medium/smaller creatures, stamping each.', category: 'Mount' },
  { id: 'riding-shark',       name: 'Riding Shark',          cost: 3400,   weight: 0, description: 'Level 8 Skirmisher. Speed swim 11. HP 88, AC 22, Fort 21, Ref 22, Will 17. Bite: +13 vs AC, 2d6+4. Deft Swimmer: rider gains +2 AC vs opportunity attacks; +2 attack vs non-swimmers in water.', category: 'Mount' },
  { id: 'hippogriff',         name: 'Hippogriff',            cost: 4200,   weight: 0, description: 'Level 5 Skirmisher. Speed 4, fly 10. HP 64, AC 19, Fort 18, Ref 17, Will 15. Bite: +10 vs AC, 2d6+6. Diving Overrun: +10 vs AC, 2d6+3 (prone). Flyby Attack. Aerial Agility: rider gains +1 to all defenses while flying.', category: 'Mount' },
  { id: 'hippogriff-dreadmount', name: 'Hippogriff Dreadmount', cost: 4200, weight: 0, description: 'Level 5 Soldier. Speed 4, fly 10. HP 66, AC 21, Fort 19, Ref 17, Will 15. Bite: +10 vs AC, 2d6+6. Wing Slam (interrupt): +8 vs Ref, 2d6+6 (prone). Sturdy Mount: reduces forced movement by 1; saves vs prone for rider.', category: 'Mount' },
  { id: 'griffon',            name: 'Griffon',               cost: 9000,   weight: 0, description: 'Level 7 Brute. Speed 6, fly 10. HP 98, AC 19, Fort 21, Ref 19, Will 17. Claws: +12 vs AC, 2d6+10 (+14 bloodied). Blood Frenzy: extra move action when bloodied. Rabid Charger: when rider charges, griffon claws twice.', category: 'Mount' },
  { id: 'blade-spider',       name: 'Blade Spider',          cost: 13000,  weight: 0, description: 'Level 10 Brute. Speed 6, climb 6 (spider climb). Tremorsense 10. HP 130, AC 22, Fort 21, Ref 20, Will 18. Claw (poison): +13 vs AC, 1d8+5 + ongoing 5 poison + weakened. Double Attack. Combined Attack (encounter): rider triggers free claw; on hit, ongoing 10 poison.', category: 'Mount' },
  { id: 'celestial-charger',  name: 'Celestial Charger',     cost: 13000,  weight: 0, description: 'Level 10 Soldier. Speed 8. Low-light vision. HP 111, AC 26, Fort 24, Ref 22, Will 21. Kick: +16 vs AC, 1d8+6. Trample: +14 vs Ref, 1d8+6 (prone). Celestial Charge (encounter): rider deals extra 2d6 radiant on charge. Zephyr Footing: ignores difficult terrain.', category: 'Mount' },
  { id: 'skeletal-horse',     name: 'Skeletal Horse',        cost: 17000,  weight: 0, description: 'Level 11 Brute. Speed 10. Immune poison, resist 20 necrotic. HP 143, AC 23, Fort 24, Ref 23, Will 20. Kick: +14 vs AC, 3d6+5. Shadow Symbiosis: rider gains resist 20 necrotic.', category: 'Mount' },
  { id: 'dire-shark',         name: 'Dire Shark',            cost: 21000,  weight: 0, description: 'Level 14 Skirmisher. Speed swim 11. HP 139, AC 28, Fort 26, Ref 28, Will 23. Bite: +17 vs AC, 3d6+5. Deft Swimmer: rider gains +2 AC vs opportunity attacks; +2 attack vs non-swimmers.', category: 'Mount' },
  { id: 'trihorn-behemoth',   name: 'Trihorn Behemoth',      cost: 21000,  weight: 0, description: 'Level 12 Soldier. Speed 6. HP 127, AC 28, Fort 30, Ref 26, Will 23. Gore: +17 vs AC, 2d8+8. Protective Crest: rider gains +1 shield bonus to AC and Reflex.', category: 'Mount' },
  { id: 'wyvern',             name: 'Wyvern',                cost: 21000,  weight: 0, description: 'Level 10 Skirmisher. Speed 4, fly 8 (hover). Low-light vision. HP 106, AC 24, Fort 24, Ref 22, Will 20. Bite (reach 2): +15 vs AC, 2d8+9. Sting (poison, reach 2): +15 vs AC, 2d6+3 then ongoing 10 poison. Flyby Attack. Aerial Agility: rider gains +2 to all defenses while flying.', category: 'Mount' },
  { id: 'nightmare',          name: 'Nightmare',             cost: 25000,  weight: 0, description: 'Level 13 Skirmisher. Speed 10. Darkvision, resist 20 fire. HP 138, AC 27, Fort 26, Ref 25, Will 24. Hooves (fire): +18 vs AC, 2d8+7 + ongoing 5 fire. Teleport (move action). Hell\'s Ride: rider gains resist 20 fire. Shroud of Smoke: +2 AC vs opportunity attacks.', category: 'Mount' },
  { id: 'manticore',          name: 'Manticore',             cost: 45000,  weight: 0, description: 'Level 10 Elite Skirmisher. Speed 6, fly 8. HP 210, AC 26, Fort 24, Ref 24, Will 22. Claw: +15 vs AC, 3d8+5. Spike (ranged 10): +15 vs AC, 2d8+10. Spike Volley (area burst 1, recharge 4-6). Guided Sniper: manticore gains +2 attack with ranged.', category: 'Mount' },
  { id: 'rimefire-griffon',   name: 'Rimefire Griffon',      cost: 525000, weight: 0, description: 'Level 20 Skirmisher. Speed 5, fly 10. Resist 10 cold, 10 fire. HP 186, AC 34, Fort 34, Ref 32, Will 31. Bite: +25 vs AC, 3d8+9 + 1d10 cold. Rimefire Blast (close blast 5, recharge): 2d10+10 fire. Rider Resistance: rider gains resist 10 cold and resist 10 fire.', category: 'Mount' },
];
