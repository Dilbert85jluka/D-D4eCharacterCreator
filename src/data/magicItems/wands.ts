import type { MagicItemData } from '../../types/magicItem';

/** Wands */
export const wands: MagicItemData[] = [
  {
    id: 'wand-wand-of-conjuration',
    name: 'Wand of Conjuration',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'Grasping this device enables a wizard to recognize any cast or written conjuration/ summoning spell (unseen servant, monster summoning, conjure elemental, death spell, invisible stalker, limited wish, symbol, maze, gate, prismatic sphere, wish). The wand also has the following powers, which require expenditure of one charge each: � unseen servant � monster summoning* * A maximum of six charges may be expended, one per level of the monster summoning, or six monster summoning I, three monster summoning II, two monster summoning II, or any combination totaling six. The wizard must be of a sufficient experience level to cast the appropriate summoning spell. The wand of conjuration can also conjure up a curtain of blackness--a veil of total black that absorbs all light. The curtain of blackness can cover a maximum area of 600 square feet (60\' x 10\', 40\' x 15\', 30\' x 20\'), but it must stretch from ceiling to floor, wall to wall. The curtain takes two charges to conjure. The veil of total lightlessness can be penetrated only by physical means or magic. The wand also enables its wielder to construct a prismatic sphere (or wall), one color at a time, red to violet, at a cost of one charge per color. Each function of the wand has an initiative penalty of +5, and only one function per round is possible. The wand may be recharged.',
      },
      '4e': {
        description: 'Grasping this device enables a wizard to recognize any cast or written conjuration/ summoning spell (unseen servant, monster summoning, conjure elemental, death spell, invisible stalker, limited wish, symbol, maze, gate, prismatic sphere, wish). The wand also has the following powers, which require expenditure of one charge each: � unseen servant � monster summoning* * A maximum of six charges may be expended, one per level of the monster summoning, or six monster summoning I, three monster summoning II, two monster summoning II, or any combination totaling six. The wizard must be of a sufficient experience level to cast the appropriate summoning spell. The wand of conjuration can also conjure up a curtain of blackness--a veil of total black that absorbs all light. The curtain of blackness can cover a maximum area of 600 square feet (60\' x 10\', 40\' x 15\', 30\' x 20\'), but it must stretch from ceiling to floor, wall to wall. The curtain takes two charges to conjure. The veil of total lightlessness can be penetrated only by physical means or magic. The wand also enables its wielder to construct a prismatic sphere (or wall), one color at a time, red to violet, at a cost of one charge per color. Each function of the wand has an initiative penalty of +5, and only one function per round is possible. The wand may be recharged.',
        rarity: 'Rare',
        level: 25,
        slot: 'Wand',
        powerText: 'Property: You gain a +5 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Close blast 3; +30 vs. Fortitude; 5d8 cold damage.',
      },
      '5e': {
        description: 'Grasping this device enables a wizard to recognize any cast or written conjuration/ summoning spell (unseen servant, monster summoning, conjure elemental, death spell, invisible stalker, limited wish, symbol, maze, gate, prismatic sphere, wish). The wand also has the following powers, which require expenditure of one charge each: � unseen servant � monster summoning* * A maximum of six charges may be expended, one per level of the monster summoning, or six monster summoning I, three monster summoning II, two monster summoning II, or any combination totaling six. The wizard must be of a sufficient experience level to cast the appropriate summoning spell. The wand of conjuration can also conjure up a curtain of blackness--a veil of total black that absorbs all light. The curtain of blackness can cover a maximum area of 600 square feet (60\' x 10\', 40\' x 15\', 30\' x 20\'), but it must stretch from ceiling to floor, wall to wall. The curtain takes two charges to conjure. The veil of total lightlessness can be penetrated only by physical means or magic. The wand also enables its wielder to construct a prismatic sphere (or wall), one color at a time, red to violet, at a cost of one charge per color. Each function of the wand has an initiative penalty of +5, and only one function per round is possible. The wand may be recharged.',
        rarity: 'Legendary',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-corridors',
    name: 'Wand of Corridors',
    category: 'Wand',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'This wand allows its user to clear short corridors through the plane of elemental Earth and the quasi- elemental plane of Minerals. It does not function on any other plane, although it radiates magic. It is especially useful on the plane of minerals since travelers need not contact the sharp edges of the minerals. One charge clears a 10\' x 10\' x 50\' path. The corridor is completed in 1 turn. The wand has no effect on animals or living creatures. Thus, if the wand clears a path through a space occupied by an earth elemental, the creature is unharmed, but is alerted to persons in the corridor. The wand can be recharged.',
      },
      '4e': {
        description: 'This wand allows its user to clear short corridors through the plane of elemental Earth and the quasi- elemental plane of Minerals. It does not function on any other plane, although it radiates magic. It is especially useful on the plane of minerals since travelers need not contact the sharp edges of the minerals. One charge clears a 10\' x 10\' x 50\' path. The corridor is completed in 1 turn. The wand has no effect on animals or living creatures. Thus, if the wand clears a path through a space occupied by an earth elemental, the creature is unharmed, but is alerted to persons in the corridor. The wand can be recharged.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. You unleash the wand\'s stored energy.',
      },
      '5e': {
        description: 'This wand allows its user to clear short corridors through the plane of elemental Earth and the quasi- elemental plane of Minerals. It does not function on any other plane, although it radiates magic. It is especially useful on the plane of minerals since travelers need not contact the sharp edges of the minerals. One charge clears a 10\' x 10\' x 50\' path. The corridor is completed in 1 turn. The wand has no effect on animals or living creatures. Thus, if the wand clears a path through a space occupied by an earth elemental, the creature is unharmed, but is alerted to persons in the corridor. The wand can be recharged.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-earth-and-stone',
    name: 'Wand of Earth and Stone',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A wand of this sort is typically short and tipped with some form of mineral. It is imbued with the following powers: Dig � charge/use Passwall one charge/use Move earth two charges/use In addition, 50% of all such wands have the following powers: Transmute mud to rock one charge/use Transmute rock to mud one charge/use',
      },
      '4e': {
        description: 'A wand of this sort is typically short and tipped with some form of mineral. It is imbued with the following powers: Dig � charge/use Passwall one charge/use Move earth two charges/use In addition, 50% of all such wands have the following powers: Transmute mud to rock one charge/use Transmute rock to mud one charge/use',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. You unleash the wand\'s stored energy.',
      },
      '5e': {
        description: 'This wand has 7 charges. You can expend charges to move and shape earth or stone within 120 feet, affecting up to a 15-foot cube.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-element-transmogrification',
    name: 'Wand of Element Transmogrification',
    category: 'Wand',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'This wand changes a quantity of one element into an equal amount of another element (water into fire, earth into air, etc The element to be affected must be within 60 feet of the wielder, who merely points the wand at the element and speaks the command word. For every 10 cubic feet (or portion thereof) transformed, one charge is drained from the wand. The transmogrification is permanent unless a successful dispel magic is cast on the element. Elements created by this wand have special characteristics. Fire requires no fuel to burn. Water never evaporates. Air is absolutely pure, but unless contained, the air mingles with the atmosphere and is lost forever. Earth can appear as soil, sand, clay, or stone, at the wielder\'s option. It is not possible to create treasure such as valuable metals or gemstones with this wand. This wand has no effect upon creatures of any kind, except those from the Elemental planes. By changing such creatures into their element of opposition (fire into water, air into earth, etc.), the creature is totally obliterated. Thus, transmuting a water elemental into fire disintegrates it. A creature attacked by the wand is allowed a saving throw vs. rods, staves, and wands. If the save is failed, the elemental is destroyed. If the save is successful, the creature is not obliterated outright, but suffers 6d6 points of damage and retains its true form. In attacking an elemental, the number of Hit Dice of the elemental determines the number of charges used: 1 charge for an 8 HD elemental, 2 charges for a 12 HD elemental, and 3 charges for a 16 HD elemental. It is not possible to use this wand to change an elemental into another type of elemental. The wand may be used once per round. It may be recharged.',
      },
      '4e': {
        description: 'This wand changes a quantity of one element into an equal amount of another element (water into fire, earth into air, etc The element to be affected must be within 60 feet of the wielder, who merely points the wand at the element and speaks the command word. For every 10 cubic feet (or portion thereof) transformed, one charge is drained from the wand. The transmogrification is permanent unless a successful dispel magic is cast on the element. Elements created by this wand have special characteristics. Fire requires no fuel to burn. Water never evaporates. Air is absolutely pure, but unless contained, the air mingles with the atmosphere and is lost forever. Earth can appear as soil, sand, clay, or stone, at the wielder\'s option. It is not possible to create treasure such as valuable metals or gemstones with this wand. This wand has no effect upon creatures of any kind, except those from the Elemental planes. By changing such creatures into their element of opposition (fire into water, air into earth, etc.), the creature is totally obliterated. Thus, transmuting a water elemental into fire disintegrates it. A creature attacked by the wand is allowed a saving throw vs. rods, staves, and wands. If the save is failed, the elemental is destroyed. If the save is successful, the creature is not obliterated outright, but suffers 6d6 points of damage and retains its true form. In attacking an elemental, the number of Hit Dice of the elemental determines the number of charges used: 1 charge for an 8 HD elemental, 2 charges for a 12 HD elemental, and 3 charges for a 16 HD elemental. It is not possible to use this wand to change an elemental into another type of elemental. The wand may be used once per round. It may be recharged.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Ranged 5; transmute up to 1 cubic foot of one nonmagical material into another for 2 hours.',
      },
      '5e': {
        description: 'This wand changes a quantity of one element into an equal amount of another element (water into fire, earth into air, etc The element to be affected must be within 60 feet of the wielder, who merely points the wand at the element and speaks the command word. For every 10 cubic feet (or portion thereof) transformed, one charge is drained from the wand. The transmogrification is permanent unless a successful dispel magic is cast on the element. Elements created by this wand have special characteristics. Fire requires no fuel to burn. Water never evaporates. Air is absolutely pure, but unless contained, the air mingles with the atmosphere and is lost forever. Earth can appear as soil, sand, clay, or stone, at the wielder\'s option. It is not possible to create treasure such as valuable metals or gemstones with this wand. This wand has no effect upon creatures of any kind, except those from the Elemental planes. By changing such creatures into their element of opposition (fire into water, air into earth, etc.), the creature is totally obliterated. Thus, transmuting a water elemental into fire disintegrates it. A creature attacked by the wand is allowed a saving throw vs. rods, staves, and wands. If the save is failed, the elemental is destroyed. If the save is successful, the creature is not obliterated outright, but suffers 6d6 points of damage and retains its true form. In attacking an elemental, the number of Hit Dice of the elemental determines the number of charges used: 1 charge for an 8 HD elemental, 2 charges for a 12 HD elemental, and 3 charges for a 16 HD elemental. It is not possible to use this wand to change an elemental into another type of elemental. The wand may be used once per round. It may be recharged.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-enemy-detection',
    name: 'Wand of Enemy Detection',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand pulses in the wielder\'s hand and points in the direction of any creature(s) hostile to the bearer of the device. The creature(s) can be invisible, ethereal, astral, out of phase, hidden, disguised, or in plain sight. Detection range is a 60-foot sphere. The function requires one charge to operate for one turn. The wand can be recharged.',
      },
      '4e': {
        description: 'This wand pulses in the wielder\'s hand and points in the direction of any creature(s) hostile to the bearer of the device. The creature(s) can be invisible, ethereal, astral, out of phase, hidden, disguised, or in plain sight. Detection range is a 60-foot sphere. The function requires one charge to operate for one turn. The wand can be recharged.',
        rarity: 'Rare',
        level: 14,
        slot: 'Wand',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Close burst 10; you sense all hostile creatures, their positions, and their numbers until the end of the encounter.',
      },
      '5e': {
        description: 'This wand pulses in the wielder\'s hand and points in the direction of any creature(s) hostile to the bearer of the device. The creature(s) can be invisible, ethereal, astral, out of phase, hidden, disguised, or in plain sight. Detection range is a 60-foot sphere. The function requires one charge to operate for one turn. The wand can be recharged.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-fear',
    name: 'Wand of Fear',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'When the fear wand is activated, a pale amber ray springs from the tip of the wand, forming a cone 60 feet long by 20 feet in base diameter, which flashes on and instantly disappears. Each creature touched by the ray must roll a successful saving throw vs. wand or react as per the cause fear spell (1st-level priest spell, remove fear reversal). In other words, creatures affected by the wand turn and move at fastest possible speed away from the wielder for six rounds. Each use costs one charge. It can operate just once per round. The wand can be recharged. .).',
      },
      '4e': {
        description: 'When the fear wand is activated, a pale amber ray springs from the tip of the wand, forming a cone 60 feet long by 20 feet in base diameter, which flashes on and instantly disappears. Each creature touched by the ray must roll a successful saving throw vs. wand or react as per the cause fear spell (1st-level priest spell, remove fear reversal). In other words, creatures affected by the wand turn and move at fastest possible speed away from the wielder for six rounds. Each use costs one charge. It can operate just once per round. The wand can be recharged. .).',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Close blast 5; +15 vs. Will; targets are stunned (save ends).',
      },
      '5e': {
        description: 'When the fear wand is activated, a pale amber ray springs from the tip of the wand, forming a cone 60 feet long by 20 feet in base diameter, which flashes on and instantly disappears. Each creature touched by the ray must roll a successful saving throw vs. wand or react as per the cause fear spell (1st-level priest spell, remove fear reversal). In other words, creatures affected by the wand turn and move at fastest possible speed away from the wielder for six rounds. Each use costs one charge. It can operate just once per round. The wand can be recharged. .).',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-fire',
    name: 'Wand of Fire',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand can function like the following wizard spells: � Burning hands: The wand emits a fan-shaped sheet of fire 10 feet wide at its end and 12 feet long. Each creature touched suffers six points of damage. The sheet of fire appears instantly, shoots forth dark red flames, and snuffs out in less than one second. It expends one charge. � Pyrotechnics: This function duplicates the spell of the same name. It has an initiative modifier of +2 and expends one charge. � Fireball: The wand coughs forth a pea-sized sphere that streaks out to the desired range (to a maximum of 160 feet) and bursts in a fiery, violet-red blast, just like the fireball spell. The initiative modifier is +2, and this expends two charges. The fireball inflicts 6d6 points of damage, but all 1s rolled are counted as 2s (i.e., the burst causes 12- 36 points). A saving throw vs. wand is applicable. � Wall of fire: The wand can be used to draw a fiery curtain of purplish-red flames 1200 feet square (10\' x 120\', 20\' x 60\', 30\' x 40\', etc.). The flames last for six rounds and cause 2d6+6 points damage if touched (2d4 points if within 10 feet of the fire, 1d4 if within 20 feet). The flames can also be shaped into a ring around the wand user (but the circle is 25 feet in diameter). The initiative modifier is +3, and its use expends two charges. The wand of fire can operate just once per round. It can be recharged.',
      },
      '4e': {
        description: 'This wand can function like the following wizard spells: � Burning hands: The wand emits a fan-shaped sheet of fire 10 feet wide at its end and 12 feet long. Each creature touched suffers six points of damage. The sheet of fire appears instantly, shoots forth dark red flames, and snuffs out in less than one second. It expends one charge. � Pyrotechnics: This function duplicates the spell of the same name. It has an initiative modifier of +2 and expends one charge. � Fireball: The wand coughs forth a pea-sized sphere that streaks out to the desired range (to a maximum of 160 feet) and bursts in a fiery, violet-red blast, just like the fireball spell. The initiative modifier is +2, and this expends two charges. The fireball inflicts 6d6 points of damage, but all 1s rolled are counted as 2s (i.e., the burst causes 12- 36 points). A saving throw vs. wand is applicable. � Wall of fire: The wand can be used to draw a fiery curtain of purplish-red flames 1200 feet square (10\' x 120\', 20\' x 60\', 30\' x 40\', etc.). The flames last for six rounds and cause 2d6+6 points damage if touched (2d4 points if within 10 feet of the fire, 1d4 if within 20 feet). The flames can also be shaped into a ring around the wand user (but the circle is 25 feet in diameter). The initiative modifier is +3, and its use expends two charges. The wand of fire can operate just once per round. It can be recharged.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Close blast 3; +15 vs. Reflex; 2d8 fire damage.',
      },
      '5e': {
        description: 'This wand can function like the following wizard spells: � Burning hands: The wand emits a fan-shaped sheet of fire 10 feet wide at its end and 12 feet long. Each creature touched suffers six points of damage. The sheet of fire appears instantly, shoots forth dark red flames, and snuffs out in less than one second. It expends one charge. � Pyrotechnics: This function duplicates the spell of the same name. It has an initiative modifier of +2 and expends one charge. � Fireball: The wand coughs forth a pea-sized sphere that streaks out to the desired range (to a maximum of 160 feet) and bursts in a fiery, violet-red blast, just like the fireball spell. The initiative modifier is +2, and this expends two charges. The fireball inflicts 6d6 points of damage, but all 1s rolled are counted as 2s (i.e., the burst causes 12- 36 points). A saving throw vs. wand is applicable. � Wall of fire: The wand can be used to draw a fiery curtain of purplish-red flames 1200 feet square (10\' x 120\', 20\' x 60\', 30\' x 40\', etc.). The flames last for six rounds and cause 2d6+6 points damage if touched (2d4 points if within 10 feet of the fire, 1d4 if within 20 feet). The flames can also be shaped into a ring around the wand user (but the circle is 25 feet in diameter). The initiative modifier is +3, and its use expends two charges. The wand of fire can operate just once per round. It can be recharged.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-flame-extinguishing',
    name: 'Wand of Flame Extinguishing',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This sort of wand has three separate functions: Nonmagical fires of normal size can be extinguished without using any charges. Normal size includes anything up to the size of a bonfire or a fire in a regular fireplace-- equal to four to six billets of wood burning hotly. To extinguish large, nonmagical fires, flaming oil in quantity equal to a gallon or more, the fire produced by a fiend, a flame tongue sword, or a burning hands spell, one charge is expended from the wand. Continual magical flames, such as those of a sword or a creature able to ignite, will be extinguished for six rounds and will flare up again after that time. When applied to large magical fires such as those caused by fireball, flame strike, or wall of fire spells, two charges are expended from the wand as the flames are extinguished. If the device is used upon a creature composed of flame (a fire elemental, for instance), a successful attack roll inflicts 6d6 points of damage upon the creature.',
      },
      '4e': {
        description: 'This sort of wand has three separate functions: Nonmagical fires of normal size can be extinguished without using any charges. Normal size includes anything up to the size of a bonfire or a fire in a regular fireplace-- equal to four to six billets of wood burning hotly. To extinguish large, nonmagical fires, flaming oil in quantity equal to a gallon or more, the fire produced by a fiend, a flame tongue sword, or a burning hands spell, one charge is expended from the wand. Continual magical flames, such as those of a sword or a creature able to ignite, will be extinguished for six rounds and will flare up again after that time. When applied to large magical fires such as those caused by fireball, flame strike, or wall of fire spells, two charges are expended from the wand as the flames are extinguished. If the device is used upon a creature composed of flame (a fire elemental, for instance), a successful attack roll inflicts 6d6 points of damage upon the creature.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. All nonmagical flames within 10 squares are extinguished. One magical fire effect within 5 squares is ended.',
      },
      '5e': {
        description: 'This wand has 7 charges. You can expend a charge to extinguish all nonmagical flames within 120 feet, or expend 3 charges to cast Dispel Magic targeting a fire-based magical effect.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-frost',
    name: 'Wand of Frost',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A frost wand can perform three functions that duplicate wizard spells: � Ice storm: A silvery ray springs forth from the wand and an ice (or sleet) storm occurs up to 60 feet away from the wand holder. This function requires one charge. � Wall of ice: The silvery ray forms a wall of ice, six inches thick, covering a 600-squarefoot area (10\' x 60\', 20\' x 30\', etc.). Its initiative modifier is +2, and it uses one charge. � Cone of cold: White crystalline motes spray forth from the wand in a cone with a 60-foot length and a terminal diameter of 20 feet. The initiative modifier is +2, and the effect lasts just one second. The temperature is -100 degrees F., and damage is 6d6, treating all 1s rolled as 2s (6d6, 12-36). The cost is two charges per use. Saving throw vs. wands is applicable. The wand can function once per round, and may be recharged.',
      },
      '4e': {
        description: 'A frost wand can perform three functions that duplicate wizard spells: � Ice storm: A silvery ray springs forth from the wand and an ice (or sleet) storm occurs up to 60 feet away from the wand holder. This function requires one charge. � Wall of ice: The silvery ray forms a wall of ice, six inches thick, covering a 600-squarefoot area (10\' x 60\', 20\' x 30\', etc.). Its initiative modifier is +2, and it uses one charge. � Cone of cold: White crystalline motes spray forth from the wand in a cone with a 60-foot length and a terminal diameter of 20 feet. The initiative modifier is +2, and the effect lasts just one second. The temperature is -100 degrees F., and damage is 6d6, treating all 1s rolled as 2s (6d6, 12-36). The cost is two charges per use. Saving throw vs. wands is applicable. The wand can function once per round, and may be recharged.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Close blast 3; +15 vs. Fortitude; 2d8 cold damage.',
      },
      '5e': {
        description: 'A frost wand can perform three functions that duplicate wizard spells: � Ice storm: A silvery ray springs forth from the wand and an ice (or sleet) storm occurs up to 60 feet away from the wand holder. This function requires one charge. � Wall of ice: The silvery ray forms a wall of ice, six inches thick, covering a 600-squarefoot area (10\' x 60\', 20\' x 30\', etc.). Its initiative modifier is +2, and it uses one charge. � Cone of cold: White crystalline motes spray forth from the wand in a cone with a 60-foot length and a terminal diameter of 20 feet. The initiative modifier is +2, and the effect lasts just one second. The temperature is -100 degrees F., and damage is 6d6, treating all 1s rolled as 2s (6d6, 12-36). The cost is two charges per use. Saving throw vs. wands is applicable. The wand can function once per round, and may be recharged.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-illumination',
    name: 'Wand of Illumination',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand has four separate functions, three of which approximate wizard spells, and one of which is unique: � Dancing lights: The wand produces this effect at a cost of one charge. � Light: The illumination wand sends forth light at an expenditure of one charge. � Continual light: This function require two charges. � Sunburst: When this effect is called forth, the wand delivers a sudden flash of brilliant, greenish-white light, with blazing golden rays. The range of this sunburst is 120 yards maximum, and its duration is 1/10 of a second. Its area of effect is a globe of 40-foot diameter. Any undead within this globe suffer 6d6 points of damage, with no saving throw. Creatures within or facing the burst must roll successful saving throws vs. wands or be blinded for one round and be unable to do anything during that period. (Of course, the creatures in question must have sight organs sensitive to the visible light spectrum). The function requires three charges. The wand can be recharged.',
      },
      '4e': {
        description: 'This wand has four separate functions, three of which approximate wizard spells, and one of which is unique: � Dancing lights: The wand produces this effect at a cost of one charge. � Light: The illumination wand sends forth light at an expenditure of one charge. � Continual light: This function require two charges. � Sunburst: When this effect is called forth, the wand delivers a sudden flash of brilliant, greenish-white light, with blazing golden rays. The range of this sunburst is 120 yards maximum, and its duration is 1/10 of a second. Its area of effect is a globe of 40-foot diameter. Any undead within this globe suffer 6d6 points of damage, with no saving throw. Creatures within or facing the burst must roll successful saving throws vs. wands or be blinded for one round and be unable to do anything during that period. (Of course, the creatures in question must have sight organs sensitive to the visible light spectrum). The function requires three charges. The wand can be recharged.',
        rarity: 'Common',
        level: 3,
        slot: 'Wand',
        powerText: 'Property: You gain a +1 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. You unleash the wand\'s stored energy.',
      },
      '5e': {
        description: 'This wand has four separate functions, three of which approximate wizard spells, and one of which is unique: � Dancing lights: The wand produces this effect at a cost of one charge. � Light: The illumination wand sends forth light at an expenditure of one charge. � Continual light: This function require two charges. � Sunburst: When this effect is called forth, the wand delivers a sudden flash of brilliant, greenish-white light, with blazing golden rays. The range of this sunburst is 120 yards maximum, and its duration is 1/10 of a second. Its area of effect is a globe of 40-foot diameter. Any undead within this globe suffer 6d6 points of damage, with no saving throw. Creatures within or facing the burst must roll successful saving throws vs. wands or be blinded for one round and be unable to do anything during that period. (Of course, the creatures in question must have sight organs sensitive to the visible light spectrum). The function requires three charges. The wand can be recharged.',
        rarity: 'Common',
      },
    },
  },
  {
    id: 'wand-wand-of-illusion',
    name: 'Wand of Illusion',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand creates audible and visual illusions (see audible glamer, phantasmal force). The wand emits an invisible ray, with a 140-yard maximum range. The effect has an initiative modifier of +3. The wand wielder must concentrate on the illusion in order to maintain it--he may move normally but can\'t melee during this time. Each portion, audible and visual, cost one charge to effect and one per round to continue. The wand may be recharged.',
      },
      '4e': {
        description: 'This wand creates audible and visual illusions (see audible glamer, phantasmal force). The wand emits an invisible ray, with a 140-yard maximum range. The effect has an initiative modifier of +3. The wand wielder must concentrate on the illusion in order to maintain it--he may move normally but can\'t melee during this time. Each portion, audible and visual, cost one charge to effect and one per round to continue. The wand may be recharged.',
        rarity: 'Rare',
        level: 14,
        slot: 'Wand',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Area burst 2 within 10; +19 vs. Will; targets grant combat advantage (save ends).',
      },
      '5e': {
        description: 'This wand creates audible and visual illusions (see audible glamer, phantasmal force). The wand emits an invisible ray, with a 140-yard maximum range. The effect has an initiative modifier of +3. The wand wielder must concentrate on the illusion in order to maintain it--he may move normally but can\'t melee during this time. Each portion, audible and visual, cost one charge to effect and one per round to continue. The wand may be recharged.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-lightning',
    name: 'Wand of Lightning',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand has two functions that closely resemble wizard spells: � Shock: This does 1-10 hit points of damage to a target struck in melee combat, with no saving throw. Characters wearing metal armor and/or shields are treated as armor class 10. Plain leather and wood work normally. Magical bonuses on metal armor do not affect Armor Class, but a ring of protection does. The shock uses one charge. � Lightning Bolt: The possessor of the wand can discharge a bolt of lightning. The stroke can be either a forked or straight bolt (see wizard spell, lightning bolt). Damage is 12-36 (6d6, treating 1s as 2s), but a saving throw is applicable. This function uses two charges and has an initiate modifier of +2. The wand may be recharged. It can perform only one function per round.',
      },
      '4e': {
        description: 'This wand has two functions that closely resemble wizard spells: � Shock: This does 1-10 hit points of damage to a target struck in melee combat, with no saving throw. Characters wearing metal armor and/or shields are treated as armor class 10. Plain leather and wood work normally. Magical bonuses on metal armor do not affect Armor Class, but a ring of protection does. The shock uses one charge. � Lightning Bolt: The possessor of the wand can discharge a bolt of lightning. The stroke can be either a forked or straight bolt (see wizard spell, lightning bolt). Damage is 12-36 (6d6, treating 1s as 2s), but a saving throw is applicable. This function uses two charges and has an initiate modifier of +2. The wand may be recharged. It can perform only one function per round.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. You unleash the wand\'s stored energy.',
      },
      '5e': {
        description: 'This wand has two functions that closely resemble wizard spells: � Shock: This does 1-10 hit points of damage to a target struck in melee combat, with no saving throw. Characters wearing metal armor and/or shields are treated as armor class 10. Plain leather and wood work normally. Magical bonuses on metal armor do not affect Armor Class, but a ring of protection does. The shock uses one charge. � Lightning Bolt: The possessor of the wand can discharge a bolt of lightning. The stroke can be either a forked or straight bolt (see wizard spell, lightning bolt). Damage is 12-36 (6d6, treating 1s as 2s), but a saving throw is applicable. This function uses two charges and has an initiate modifier of +2. The wand may be recharged. It can perform only one function per round.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-magic-detection',
    name: 'Wand of Magic Detection',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand is similar in operation to the enemy detection wand. If any form of magic is in operation, or a magical item exists within a 30-foot radius, the magic detection wand will pulse and point to the strongest source. Note that it will point to a person upon whom a spell has been cast. Operation requires one round, and successive rounds will point out successively less powerful magical radiation. The school of magic (abjuration, alteration, etc.) can be determined if one round is spent concentrating on the subject emanation. One charge is expended per turn (or fraction thereof) of use. Starting with the second round of continuous use, there is a 2% cumulative chance per round that the wand will temporarily malfunction and indicate nonmagical items as magical, or vice-versa. The wand may be recharged.',
      },
      '4e': {
        description: 'This wand is similar in operation to the enemy detection wand. If any form of magic is in operation, or a magical item exists within a 30-foot radius, the magic detection wand will pulse and point to the strongest source. Note that it will point to a person upon whom a spell has been cast. Operation requires one round, and successive rounds will point out successively less powerful magical radiation. The school of magic (abjuration, alteration, etc.) can be determined if one round is spent concentrating on the subject emanation. One charge is expended per turn (or fraction thereof) of use. Starting with the second round of continuous use, there is a 2% cumulative chance per round that the wand will temporarily malfunction and indicate nonmagical items as magical, or vice-versa. The wand may be recharged.',
        rarity: 'Common',
        level: 3,
        slot: 'Wand',
        powerText: 'Property: You gain a +1 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Close burst 10; you sense all hostile creatures, their positions, and their numbers until the end of the encounter.',
      },
      '5e': {
        description: 'This wand is similar in operation to the enemy detection wand. If any form of magic is in operation, or a magical item exists within a 30-foot radius, the magic detection wand will pulse and point to the strongest source. Note that it will point to a person upon whom a spell has been cast. Operation requires one round, and successive rounds will point out successively less powerful magical radiation. The school of magic (abjuration, alteration, etc.) can be determined if one round is spent concentrating on the subject emanation. One charge is expended per turn (or fraction thereof) of use. Starting with the second round of continuous use, there is a 2% cumulative chance per round that the wand will temporarily malfunction and indicate nonmagical items as magical, or vice-versa. The wand may be recharged.',
        rarity: 'Common',
      },
    },
  },
  {
    id: 'wand-wand-of-magic-missiles',
    name: 'Wand of Magic Missiles',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand discharges magic missiles similar to those of the 1st-level wizard spell of the same name. The missile causes 1d4+1 points of damage. It always hits its target when the wand is wielded by a wizard, otherwise an attack roll is required. The wand has an initiative modifier of +3, and each missile costs one charge. A maximum of two may be expended in one round. The wand may be recharged.',
      },
      '4e': {
        description: 'This wand discharges magic missiles similar to those of the 1st-level wizard spell of the same name. The missile causes 1d4+1 points of damage. It always hits its target when the wand is wielded by a wizard, otherwise an attack roll is required. The wand has an initiative modifier of +3, and each missile costs one charge. A maximum of two may be expended in one round. The wand may be recharged.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Ranged 20; automatically hits; 2d4 + 2 force damage.',
      },
      '5e': {
        description: 'This wand discharges magic missiles similar to those of the 1st-level wizard spell of the same name. The missile causes 1d4+1 points of damage. It always hits its target when the wand is wielded by a wizard, otherwise an attack roll is required. The wand has an initiative modifier of +3, and each missile costs one charge. A maximum of two may be expended in one round. The wand may be recharged.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-metal-and-mineral-detection',
    name: 'Wand of Metal and Mineral Detection',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand has a 30-foot radius range. It pulses in the wielder\'s hand and points to the largest mass of metal within its effective area of operation. However, the wielder can concentrate on a specific metal or mineral (gold, platinum, quartz, beryl, diamond, corundum, etc.). If the specific mineral is within range, the wand will point to any and all places it is located, and the wand possessor will know the approximate quantity as well. Each operation requires one round. Each charge powers the wand for two full turns. The wand may be recharged.',
      },
      '4e': {
        description: 'This wand has a 30-foot radius range. It pulses in the wielder\'s hand and points to the largest mass of metal within its effective area of operation. However, the wielder can concentrate on a specific metal or mineral (gold, platinum, quartz, beryl, diamond, corundum, etc.). If the specific mineral is within range, the wand will point to any and all places it is located, and the wand possessor will know the approximate quantity as well. Each operation requires one round. Each charge powers the wand for two full turns. The wand may be recharged.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Close burst 10; you detect the presence, type, and direction of all metals and minerals within range.',
      },
      '5e': {
        description: 'This wand has a 30-foot radius range. It pulses in the wielder\'s hand and points to the largest mass of metal within its effective area of operation. However, the wielder can concentrate on a specific metal or mineral (gold, platinum, quartz, beryl, diamond, corundum, etc.). If the specific mineral is within range, the wand will point to any and all places it is located, and the wand possessor will know the approximate quantity as well. Each operation requires one round. Each charge powers the wand for two full turns. The wand may be recharged.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-misplaced-objects',
    name: 'Wand of Misplaced Objects',
    category: 'Wand',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'This wand emits a multitude of golden orbs that rush toward a target creature. The orbs surround the victim and swirl around him wildly for 1 round. During this time the victim is confused and can take no action. At the end of the round, the orbs vanish and the victim is free to act. He discovers, however, that all objects on his person have been moved. Some items are inconveniently located, while others are nowhere to be seen. A warrior might find his magical ring on one of his toes, his sword in his pants, his gold pieces in the sheath of his sword, and his breastplate on his head. The more possessions a victim owns, the more confused the situation becomes. The DM is encouraged to be devious. Because of the chaotic placement of items, the victim suffers several penalties. Movement is reduced by half. Armor class of characters wearing armor is reduced by 2, since pieces are not worn properly. Attack rolls made by the victim are made at a �2 penalty. These penalties are eliminated if the victim devotes 2-5 rounds (1d4+1) to rearranging his gear. A character requiring an item carried in a backpack, pouch, pocket, or other container must spend 2-12 (2d6) rounds searching for the item. This penalty is canceled if 3 turns are spent unpacking and repacking all gear. The DM must define the locations of objects any time a character reaches for them or if they impair motion or sight. When deciding locations of objects, the DM should state the obvious effects of impaired sight and movement immediately, such as boots worn on hands or a cloak over the face. Items held within a bag of holding, Heward\'s handy haversack, or other magical containers are unaffected. However, the containers themselves are subject to relocation. The wand uses one charge per attack. It may be recharged.',
      },
      '4e': {
        description: 'This wand emits a multitude of golden orbs that rush toward a target creature. The orbs surround the victim and swirl around him wildly for 1 round. During this time the victim is confused and can take no action. At the end of the round, the orbs vanish and the victim is free to act. He discovers, however, that all objects on his person have been moved. Some items are inconveniently located, while others are nowhere to be seen. A warrior might find his magical ring on one of his toes, his sword in his pants, his gold pieces in the sheath of his sword, and his breastplate on his head. The more possessions a victim owns, the more confused the situation becomes. The DM is encouraged to be devious. Because of the chaotic placement of items, the victim suffers several penalties. Movement is reduced by half. Armor class of characters wearing armor is reduced by 2, since pieces are not worn properly. Attack rolls made by the victim are made at a �2 penalty. These penalties are eliminated if the victim devotes 2-5 rounds (1d4+1) to rearranging his gear. A character requiring an item carried in a backpack, pouch, pocket, or other container must spend 2-12 (2d6) rounds searching for the item. This penalty is canceled if 3 turns are spent unpacking and repacking all gear. The DM must define the locations of objects any time a character reaches for them or if they impair motion or sight. When deciding locations of objects, the DM should state the obvious effects of impaired sight and movement immediately, such as boots worn on hands or a cloak over the face. Items held within a bag of holding, Heward\'s handy haversack, or other magical containers are unaffected. However, the containers themselves are subject to relocation. The wand uses one charge per attack. It may be recharged.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Ranged 10; +15 vs. Will; one unattended object is teleported to a random location within 20 squares.',
      },
      '5e': {
        description: 'This wand emits a multitude of golden orbs that rush toward a target creature. The orbs surround the victim and swirl around him wildly for 1 round. During this time the victim is confused and can take no action. At the end of the round, the orbs vanish and the victim is free to act. He discovers, however, that all objects on his person have been moved. Some items are inconveniently located, while others are nowhere to be seen. A warrior might find his magical ring on one of his toes, his sword in his pants, his gold pieces in the sheath of his sword, and his breastplate on his head. The more possessions a victim owns, the more confused the situation becomes. The DM is encouraged to be devious. Because of the chaotic placement of items, the victim suffers several penalties. Movement is reduced by half. Armor class of characters wearing armor is reduced by 2, since pieces are not worn properly. Attack rolls made by the victim are made at a �2 penalty. These penalties are eliminated if the victim devotes 2-5 rounds (1d4+1) to rearranging his gear. A character requiring an item carried in a backpack, pouch, pocket, or other container must spend 2-12 (2d6) rounds searching for the item. This penalty is canceled if 3 turns are spent unpacking and repacking all gear. The DM must define the locations of objects any time a character reaches for them or if they impair motion or sight. When deciding locations of objects, the DM should state the obvious effects of impaired sight and movement immediately, such as boots worn on hands or a cloak over the face. Items held within a bag of holding, Heward\'s handy haversack, or other magical containers are unaffected. However, the containers themselves are subject to relocation. The wand uses one charge per attack. It may be recharged.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-negation',
    name: 'Wand of Negation',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This device negates the spell or spell-like function(s) of rods, staves, wands, and other magical items. The individual with the negation wand points to the device, and a pale gray beam shoots forth to touch the target device or individual. This totally negates any wand function, and makes any other spell or spell-like function from that device 75% likely to be negated, regardless of the level or power of the spell. The wand can function once per round, and each negation drains one charge. The wand cannot be recharged. (Please also read the following comments from theDMs Option: High Level Campaign) Wand of Negation (DMs Option: High Level Campaign): The wand temporary renders magical devices unable to create spellike effects. When a device\'s spell-like function is negated, any charges expended to produce the effect are lost, but the device is not otherwise harmed. A wand of negation has no effect on cast spells or a creature\'s spell-like abilities. The wand has an initiative modifier of +1.',
      },
      '4e': {
        description: 'This device negates the spell or spell-like function(s) of rods, staves, wands, and other magical items. The individual with the negation wand points to the device, and a pale gray beam shoots forth to touch the target device or individual. This totally negates any wand function, and makes any other spell or spell-like function from that device 75% likely to be negated, regardless of the level or power of the spell. The wand can function once per round, and each negation drains one charge. The wand cannot be recharged. (Please also read the following comments from theDMs Option: High Level Campaign) Wand of Negation (DMs Option: High Level Campaign): The wand temporary renders magical devices unable to create spellike effects. When a device\'s spell-like function is negated, any charges expended to produce the effect are lost, but the device is not otherwise harmed. A wand of negation has no effect on cast spells or a creature\'s spell-like abilities. The wand has an initiative modifier of +1.',
        rarity: 'Rare',
        level: 22,
        slot: 'Wand',
        powerText: 'Property: You gain a +5 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Close blast 3; +27 vs. Fortitude; 5d8 cold damage.',
      },
      '5e': {
        description: 'This device negates the spell or spell-like function(s) of rods, staves, wands, and other magical items. The individual with the negation wand points to the device, and a pale gray beam shoots forth to touch the target device or individual. This totally negates any wand function, and makes any other spell or spell-like function from that device 75% likely to be negated, regardless of the level or power of the spell. The wand can function once per round, and each negation drains one charge. The wand cannot be recharged. (Please also read the following comments from theDMs Option: High Level Campaign) Wand of Negation (DMs Option: High Level Campaign): The wand temporary renders magical devices unable to create spellike effects. When a device\'s spell-like function is negated, any charges expended to produce the effect are lost, but the device is not otherwise harmed. A wand of negation has no effect on cast spells or a creature\'s spell-like abilities. The wand has an initiative modifier of +1.',
        rarity: 'Legendary',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-paralyzation',
    name: 'Wand of Paralyzation',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand shoots forth a thin ray of bluish color to a maximum range of 60 feet. Any creature touched by the ray must roll successful saving throw vs. wand or be rendered rigidly immobile for 5d4 rounds. A save indicates the ray missed, and there is no effect. As soon as the ray touches one creature, it stops--the wand can attack only one target per round. The wand has an initiative modifier of +3 , and each use costs one charge. The wand may operate once per round. It may be recharged.',
      },
      '4e': {
        description: 'This wand shoots forth a thin ray of bluish color to a maximum range of 60 feet. Any creature touched by the ray must roll successful saving throw vs. wand or be rendered rigidly immobile for 5d4 rounds. A save indicates the ray missed, and there is no effect. As soon as the ray touches one creature, it stops--the wand can attack only one target per round. The wand has an initiative modifier of +3 , and each use costs one charge. The wand may operate once per round. It may be recharged.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. You unleash the wand\'s stored energy.',
      },
      '5e': {
        description: 'This wand shoots forth a thin ray of bluish color to a maximum range of 60 feet. Any creature touched by the ray must roll successful saving throw vs. wand or be rendered rigidly immobile for 5d4 rounds. A save indicates the ray missed, and there is no effect. As soon as the ray touches one creature, it stops--the wand can attack only one target per round. The wand has an initiative modifier of +3 , and each use costs one charge. The wand may operate once per round. It may be recharged.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-polymorphing',
    name: 'Wand of Polymorphing',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand emits a thin, green beam that darts forth a maximum distance of 60 yards. Any creature touched by this beam must make a saving throw vs. wands (success indicating a miss) or be polymorphed (as the polymorph others spell). The wielder may opt to turn the victim into a snail, frog insect, etc., as long as the result is a small and inoffensive creature. The possessor of the wand may elect to touch a creature with the device instead. Unwilling creatures must be hit and are also entitled to a saving throw. If the touch is successful, the recipient is surrounded by dancing motes of sparkling emerald light, and then transforms into whatever creature-shape the wielder wants. This is the same magical effect as the polymorph self spell. Either function has an initiative modifier of +3. Each draws one charge. Only one function per round is possible. The wand may be recharged.',
      },
      '4e': {
        description: 'This wand emits a thin, green beam that darts forth a maximum distance of 60 yards. Any creature touched by this beam must make a saving throw vs. wands (success indicating a miss) or be polymorphed (as the polymorph others spell). The wielder may opt to turn the victim into a snail, frog insect, etc., as long as the result is a small and inoffensive creature. The possessor of the wand may elect to touch a creature with the device instead. Unwilling creatures must be hit and are also entitled to a saving throw. If the touch is successful, the recipient is surrounded by dancing motes of sparkling emerald light, and then transforms into whatever creature-shape the wielder wants. This is the same magical effect as the polymorph self spell. Either function has an initiative modifier of +3. Each draws one charge. Only one function per round is possible. The wand may be recharged.',
        rarity: 'Very Rare',
        level: 18,
        slot: 'Wand',
        powerText: 'Property: You gain a +4 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. You unleash the wand\'s stored energy.',
      },
      '5e': {
        description: 'This wand emits a thin, green beam that darts forth a maximum distance of 60 yards. Any creature touched by this beam must make a saving throw vs. wands (success indicating a miss) or be polymorphed (as the polymorph others spell). The wielder may opt to turn the victim into a snail, frog insect, etc., as long as the result is a small and inoffensive creature. The possessor of the wand may elect to touch a creature with the device instead. Unwilling creatures must be hit and are also entitled to a saving throw. If the touch is successful, the recipient is surrounded by dancing motes of sparkling emerald light, and then transforms into whatever creature-shape the wielder wants. This is the same magical effect as the polymorph self spell. Either function has an initiative modifier of +3. Each draws one charge. Only one function per round is possible. The wand may be recharged.',
        rarity: 'Very Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-prime-material-pocket',
    name: 'Wand of Prime Material Pocket',
    category: 'Wand',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'This wand allows a spherical pocket to be created in any plane. The conditions within the pocket are similar to the environment of the wielder\'s Prime Material plane. The pocket typically contains ground, air, and a controlled temperature. The lower third of the sphere is usually occupied by land and water, while the upper portion of the sphere is usually occupied by atmosphere. The surface of the pocket is semipermeable, allowing creatures to exit and enter the sphere, but keeps the elemental conditions of the pocket completely separate from the elemental plane. One charge creates a sphere 10\' in diameter. If the wielder wishes, multiple charges can be used to create larger spheres. Thus, a 30\'-diameter sphere could be created using three charges. The conditions inside the pocket are of the wielder\'s choosing, although they must be similar to an area that naturally exists on the Prime Material plane. The pocket cannot contain buildings or man-made items. The pocket lasts 1d6+6 hours on any plane other than the plane of Fire, on which the pocket will last 1d6 hours. The wielder may choose to use the wand before the pocket dissipates to extend the life of the existing pocket. The pocket can be destroyed through the use of a dispel magic spell. The wand is not rechargeable.',
      },
      '4e': {
        description: 'This wand allows a spherical pocket to be created in any plane. The conditions within the pocket are similar to the environment of the wielder\'s Prime Material plane. The pocket typically contains ground, air, and a controlled temperature. The lower third of the sphere is usually occupied by land and water, while the upper portion of the sphere is usually occupied by atmosphere. The surface of the pocket is semipermeable, allowing creatures to exit and enter the sphere, but keeps the elemental conditions of the pocket completely separate from the elemental plane. One charge creates a sphere 10\' in diameter. If the wielder wishes, multiple charges can be used to create larger spheres. Thus, a 30\'-diameter sphere could be created using three charges. The conditions inside the pocket are of the wielder\'s choosing, although they must be similar to an area that naturally exists on the Prime Material plane. The pocket cannot contain buildings or man-made items. The pocket lasts 1d6+6 hours on any plane other than the plane of Fire, on which the pocket will last 1d6 hours. The wielder may choose to use the wand before the pocket dissipates to extend the life of the existing pocket. The pocket can be destroyed through the use of a dispel magic spell. The wand is not rechargeable.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. You create a small extradimensional pocket (10-foot cube) that lasts for 1 hour.',
      },
      '5e': {
        description: 'This wand allows a spherical pocket to be created in any plane. The conditions within the pocket are similar to the environment of the wielder\'s Prime Material plane. The pocket typically contains ground, air, and a controlled temperature. The lower third of the sphere is usually occupied by land and water, while the upper portion of the sphere is usually occupied by atmosphere. The surface of the pocket is semipermeable, allowing creatures to exit and enter the sphere, but keeps the elemental conditions of the pocket completely separate from the elemental plane. One charge creates a sphere 10\' in diameter. If the wielder wishes, multiple charges can be used to create larger spheres. Thus, a 30\'-diameter sphere could be created using three charges. The conditions inside the pocket are of the wielder\'s choosing, although they must be similar to an area that naturally exists on the Prime Material plane. The pocket cannot contain buildings or man-made items. The pocket lasts 1d6+6 hours on any plane other than the plane of Fire, on which the pocket will last 1d6 hours. The wielder may choose to use the wand before the pocket dissipates to extend the life of the existing pocket. The pocket can be destroyed through the use of a dispel magic spell. The wand is not rechargeable.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-secret-door-and-trap-location',
    name: 'Wand of Secret Door and Trap Location',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This wand has an effective radius of 15 feet for secret door location and 30 feet for trap location. When the wand is energized it will pulse in the wielder\'s hand and point to all secret doors or traps within range. Note that it locates either doors or traps, not both during one operation. It requires one round to function and draws one charge. The wand may be recharged.',
      },
      '4e': {
        description: 'This wand has an effective radius of 15 feet for secret door location and 30 feet for trap location. When the wand is energized it will pulse in the wielder\'s hand and point to all secret doors or traps within range. Note that it locates either doors or traps, not both during one operation. It requires one round to function and draws one charge. The wand may be recharged.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Close burst 5; all hidden doors, traps, and concealed objects are revealed until the end of the encounter.',
      },
      '5e': {
        description: 'This wand has an effective radius of 15 feet for secret door location and 30 feet for trap location. When the wand is energized it will pulse in the wielder\'s hand and point to all secret doors or traps within range. Note that it locates either doors or traps, not both during one operation. It requires one round to function and draws one charge. The wand may be recharged.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-shape-binding',
    name: 'Wand of Shape Binding',
    category: 'Wand',
    source: 'TcDrH',
    editions: {
      '2e': {
        description: ', Characters often use this item against druids. When hit by its multicolored beam (projected up to 80 feet), beings with the ability to shapechange or polymorph must save vs. wands at a -3 penalty. Victims who fail cannot voluntarily alter shape for 2d10 turns. Attempts to shift shape using spells, magical items, or innate powers result in failure. A use of this rechargeable wand consumes one charge per 4 HD or levels of the subject.',
      },
      '4e': {
        description: ', Characters often use this item against druids. When hit by its multicolored beam (projected up to 80 feet), beings with the ability to shapechange or polymorph must save vs. wands at a -3 penalty. Victims who fail cannot voluntarily alter shape for 2d10 turns. Attempts to shift shape using spells, magical items, or innate powers result in failure. A use of this rechargeable wand consumes one charge per 4 HD or levels of the subject.',
        rarity: 'Very Rare',
        level: 18,
        slot: 'Wand',
        powerText: 'Property: You gain a +4 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. You unleash the wand\'s stored energy.',
      },
      '5e': {
        description: ', Characters often use this item against druids. When hit by its multicolored beam (projected up to 80 feet), beings with the ability to shapechange or polymorph must save vs. wands at a -3 penalty. Victims who fail cannot voluntarily alter shape for 2d10 turns. Attempts to shift shape using spells, magical items, or innate powers result in failure. A use of this rechargeable wand consumes one charge per 4 HD or levels of the subject.',
        rarity: 'Very Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-size-alteration',
    name: 'Wand of Size Alteration',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A wand of this sort enables the wielder to cause any single creature of virtually any size to enlarge or diminish Either effect causes a 50% change in size. Relative Strength and power increases or decreases proportionally, providing the weaponry employed is proportionate or usable. For humanoid creatures enlarged, Strength is roughly proportional to that of a giant of corresponding size. For example, a humanoid enlarged to 9 feet tall is roughly equivalent to a hill giant (19 strength), and a 13- foot tall humanoid equals a fire giant (22 Strength). The wand\'s power has a range of 10 feet. The target creature and all it is wearing or carrying are affected unless a saving throw succeeds. Note that a willing target need not to make a saving throw. The effect of the wand can be removed by a dispel magic spell, but if this is done, the target must rol system shock check. It can also be countered if the possessor of the wand wills the effect to be canceled before the duration of the effect expires. Each usage of the wand (but not the cancellation of an effect) expends one charge. It can be recharged by a wizard of 12th or higher level.',
      },
      '4e': {
        description: 'A wand of this sort enables the wielder to cause any single creature of virtually any size to enlarge or diminish Either effect causes a 50% change in size. Relative Strength and power increases or decreases proportionally, providing the weaponry employed is proportionate or usable. For humanoid creatures enlarged, Strength is roughly proportional to that of a giant of corresponding size. For example, a humanoid enlarged to 9 feet tall is roughly equivalent to a hill giant (19 strength), and a 13- foot tall humanoid equals a fire giant (22 Strength). The wand\'s power has a range of 10 feet. The target creature and all it is wearing or carrying are affected unless a saving throw succeeds. Note that a willing target need not to make a saving throw. The effect of the wand can be removed by a dispel magic spell, but if this is done, the target must rol system shock check. It can also be countered if the possessor of the wand wills the effect to be canceled before the duration of the effect expires. Each usage of the wand (but not the cancellation of an effect) expends one charge. It can be recharged by a wizard of 12th or higher level.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. You unleash the wand\'s stored energy.',
      },
      '5e': {
        description: 'A wand of this sort enables the wielder to cause any single creature of virtually any size to enlarge or diminish Either effect causes a 50% change in size. Relative Strength and power increases or decreases proportionally, providing the weaponry employed is proportionate or usable. For humanoid creatures enlarged, Strength is roughly proportional to that of a giant of corresponding size. For example, a humanoid enlarged to 9 feet tall is roughly equivalent to a hill giant (19 strength), and a 13- foot tall humanoid equals a fire giant (22 Strength). The wand\'s power has a range of 10 feet. The target creature and all it is wearing or carrying are affected unless a saving throw succeeds. Note that a willing target need not to make a saving throw. The effect of the wand can be removed by a dispel magic spell, but if this is done, the target must rol system shock check. It can also be countered if the possessor of the wand wills the effect to be canceled before the duration of the effect expires. Each usage of the wand (but not the cancellation of an effect) expends one charge. It can be recharged by a wizard of 12th or higher level.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wand-of-wonder',
    name: 'Wand of Wonder',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'The wand of wonder is a strange and unpredictable device that will generate any number of strange effects, randomly, each time it is used. The usual effects are shown on the table below, but you may alter these for any or all of these wands in your campaign as you see fit. Possible of the wand include: D100 Roll Effect 01-10 Slow creature pointed at for one turn 11-18 Deludes wielder for one round into believing the wand functions as indicated 19-25 by a second die roll 26-30 Gust of wind, double force of spell 31-33 Stinking cloud at 30-foot range Heavy rain falls for one round in 60-foot 34-36 radius of wand wielder Summon rhino (1-25), elephant (26-50), or 37-46 mouse (51-00) 47-49 Lightning bolt (70\' x 5\') as wand Stream of 600 large butterflies pour forth 50-53 and flutter around for two rounds, 54-58 blinding everyone (including wielder) Enlarge target if within 60 feet of wand 59-62 Darkness in a 30-ft diameter hemisphere at 30 feet center distance from wand Grass grows in area of 160 square feet before the wand, or grass existing there grows to 10 times normal size 63-65 Vanish any nonliving object of up to 1,000 pounds mass and up to 30 cubic feet in size (object is ethereal) 66-69 Diminish wand wielder to 1/12 height 70-79 Fireball as wand 80-84 Invisibility covers wand wielder . 85-87 Leaves grow from target if within 60 feet of wand 88-90 10-40 gems of 1 gp base value shoot forth in a 30-foot-long stream, each causing one point of damage to any creature in path � roll 5d4 for number of hits 91-97 Shimmering colours dance and play over 40- by 30-foot area in front of wand � creatures therin are blinded for 1d6 rounds 98-100 Flesh to stone (or reverse if target is stone) if target is within 60 feet The wand uses one charge per function. It may not be recharged. Where applicable, saving throws should be made.',
      },
      '4e': {
        description: 'The wand of wonder is a strange and unpredictable device that will generate any number of strange effects, randomly, each time it is used. The usual effects are shown on the table below, but you may alter these for any or all of these wands in your campaign as you see fit. Possible of the wand include: D100 Roll Effect 01-10 Slow creature pointed at for one turn 11-18 Deludes wielder for one round into believing the wand functions as indicated 19-25 by a second die roll 26-30 Gust of wind, double force of spell 31-33 Stinking cloud at 30-foot range Heavy rain falls for one round in 60-foot 34-36 radius of wand wielder Summon rhino (1-25), elephant (26-50), or 37-46 mouse (51-00) 47-49 Lightning bolt (70\' x 5\') as wand Stream of 600 large butterflies pour forth 50-53 and flutter around for two rounds, 54-58 blinding everyone (including wielder) Enlarge target if within 60 feet of wand 59-62 Darkness in a 30-ft diameter hemisphere at 30 feet center distance from wand Grass grows in area of 160 square feet before the wand, or grass existing there grows to 10 times normal size 63-65 Vanish any nonliving object of up to 1,000 pounds mass and up to 30 cubic feet in size (object is ethereal) 66-69 Diminish wand wielder to 1/12 height 70-79 Fireball as wand 80-84 Invisibility covers wand wielder . 85-87 Leaves grow from target if within 60 feet of wand 88-90 10-40 gems of 1 gp base value shoot forth in a 30-foot-long stream, each causing one point of damage to any creature in path � roll 5d4 for number of hits 91-97 Shimmering colours dance and play over 40- by 30-foot area in front of wand � creatures therin are blinded for 1d6 rounds 98-100 Flesh to stone (or reverse if target is stone) if target is within 60 feet The wand uses one charge per function. It may not be recharged. Where applicable, saving throws should be made.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Roll 1d20 and consult the table to determine a random magical effect.',
      },
      '5e': {
        description: 'This wand has 7 charges. When you expend a charge and point the wand at a target within 120 feet, roll d100 on the Wand of Wonder table to determine a random magical effect.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-wild-mages',
    name: 'Wild Mages',
    category: 'Wand',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'Certain magical items behave differently in the hands of a wild mage. This is due to his understanding of the random processes that power them. Most notable of these is the Wond of Wonder.',
      },
      '4e': {
        description: 'This slender wand produces completely random magical effects when activated.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. Roll 1d20 and consult the table to determine a random magical effect.',
      },
      '5e': {
        description: 'This wand has 7 charges. When you expend a charge and point the wand at a target within 120 feet, roll d100 on the Wand of Wonder table to determine a random magical effect.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'wand-miscellaneous-magic',
    name: 'Miscellaneous Magic',
    category: 'Wand',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'As the name implies, this category is a catch-all for many sorts of magical items. Some are powerful, others weak; some are highly desirable, others are deadly to the finder. The number of miscellaneous items is great enough that duplication of items in a campaign can kept to a minimum. Reveal information about items with care. Initially, describe an item only in the most general of terms: wood, metal, cloth, leather, etc. Allow players to ask questions about the look, feel, and smell of an item. Likewise, do not simply blurt out the properties and powers of an item. Items must be held, or worn, or manipulated before revealing their secrets. Bards, sages, identify spells, and so on may be the best (and easiest) determiners of magical qualities, but experimentation and experience are useful and make for good role-playing. Items are listed alphabetically. Unless a descriptio specifically restricts item use, or a letter representing a particular class follows a listing, items are usable by any class. Class letters are (C) clerics, (F) fighters, etc., and each listing include appropriate sub-classes.',
      },
      '4e': {
        description: 'As the name implies, this category is a catch-all for many sorts of magical items. Some are powerful, others weak; some are highly desirable, others are deadly to the finder. The number of miscellaneous items is great enough that duplication of items in a campaign can kept to a minimum. Reveal information about items with care. Initially, describe an item only in the most general of terms: wood, metal, cloth, leather, etc. Allow players to ask questions about the look, feel, and smell of an item. Likewise, do not simply blurt out the properties and powers of an item. Items must be held, or worn, or manipulated before revealing their secrets. Bards, sages, identify spells, and so on may be the best (and easiest) determiners of magical qualities, but experimentation and experience are useful and make for good role-playing. Items are listed alphabetically. Unless a descriptio specifically restricts item use, or a letter representing a particular class follows a listing, items are usable by any class. Class letters are (C) clerics, (F) fighters, etc., and each listing include appropriate sub-classes.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Wand',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this implement. Power (Daily): Standard Action. You unleash the wand\'s stored energy.',
      },
      '5e': {
        description: 'As the name implies, this category is a catch-all for many sorts of magical items. Some are powerful, others weak; some are highly desirable, others are deadly to the finder. The number of miscellaneous items is great enough that duplication of items in a campaign can kept to a minimum. Reveal information about items with care. Initially, describe an item only in the most general of terms: wood, metal, cloth, leather, etc. Allow players to ask questions about the look, feel, and smell of an item. Likewise, do not simply blurt out the properties and powers of an item. Items must be held, or worn, or manipulated before revealing their secrets. Bards, sages, identify spells, and so on may be the best (and easiest) determiners of magical qualities, but experimentation and experience are useful and make for good role-playing. Items are listed alphabetically. Unless a descriptio specifically restricts item use, or a letter representing a particular class follows a listing, items are usable by any class. Class letters are (C) clerics, (F) fighters, etc., and each listing include appropriate sub-classes.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
];
