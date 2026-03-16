import type { MagicItemData } from '../../types/magicItem';

/** Protection Scrolls */
export const scrolls: MagicItemData[] = [
  {
    id: 'scroll-protection-from-acid',
    name: 'Protection from Acid',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--6) The reader is protected from all forms of acid, to a maximum damage of 20 Hit Dice or a maximum duration of 1d4+8 turns, whichever occurs first.',
      },
      '4e': {
        description: '(Reading time--6) The reader is protected from all forms of acid, to a maximum damage of 20 Hit Dice or a maximum duration of 1d4+8 turns, whichever occurs first.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to acid effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-cold',
    name: 'Protection from Cold',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--3) Protection extends outward from the reader to a 30-foot diameter sphere. All within the area are protected from the effects of nonmagical cold to a temperature of absolute zero (-460 degrees). Against magical cold, the scroll confers a +6 bonus to saving throws and one- quarter damage (one-eighth if the saving throw is made). The duration of the scroll is 1d4+4 turns.',
      },
      '4e': {
        description: '(Reading time--3) Protection extends outward from the reader to a 30-foot diameter sphere. All within the area are protected from the effects of nonmagical cold to a temperature of absolute zero (-460 degrees). Against magical cold, the scroll confers a +6 bonus to saving throws and one- quarter damage (one-eighth if the saving throw is made). The duration of the scroll is 1d4+4 turns.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to cold effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-dragon-breath',
    name: 'Protection from Dragon Breath',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This protection scroll creates a circle of protection that grants resistance to dragon breath effects.',
      },
      '4e': {
        description: 'Reading this scroll invokes a protective ward that shields against dragon breath effects.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to dragon breath effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-electricity',
    name: 'Protection from Electricity',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--5) Protection is provided in a 20- foot diameter sphere centered on the reader. Those protected are immune to all electrical attacks and associated effects. The protection lasts 3d4 rounds.',
      },
      '4e': {
        description: '(Reading time--5) Protection is provided in a 20- foot diameter sphere centered on the reader. Those protected are immune to all electrical attacks and associated effects. The protection lasts 3d4 rounds.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to electricity effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-elementals',
    name: 'Protection from Elementals',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--6) There are 5 varieties of this scroll. Roll percentile dice and consult the following table: D100 Roll Type of Scroll 01-15 Protection from Air Elementals (including aerial servants, djinn, 16-30 invisible stalkers, and wind walkers) 31-45 Protection from Earth Elementals 46-60 (including xorn) 61-00 Protection from Fire Elementals (including efreeti and salamanders)',
      },
      '4e': {
        description: '(Reading time--6) There are 5 varieties of this scroll. Roll percentile dice and consult the following table: D100 Roll Type of Scroll 01-15 Protection from Air Elementals (including aerial servants, djinn, 16-30 invisible stalkers, and wind walkers) 31-45 Protection from Earth Elementals 46-60 (including xorn) 61-00 Protection from Fire Elementals (including efreeti and salamanders)',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to elementals effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-air-elementals',
    name: 'Protection from Air Elementals',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This protection scroll creates a circle of protection that grants resistance to air elementals effects.',
      },
      '4e': {
        description: 'Reading this scroll invokes a protective ward that shields against air elementals effects.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to air elementals effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-earth-elementals',
    name: 'Protection from Earth Elementals',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This protection scroll creates a circle of protection that grants resistance to earth elementals effects.',
      },
      '4e': {
        description: 'Reading this scroll invokes a protective ward that shields against earth elementals effects.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to earth elementals effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-fire-elementals',
    name: 'Protection from Fire Elementals',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This protection scroll creates a circle of protection that grants resistance to fire elementals effects.',
      },
      '4e': {
        description: 'Reading this scroll invokes a protective ward that shields against fire elementals effects.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to fire elementals effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-water-elementals',
    name: 'Protection from Water Elementals',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(including tritons and water weirds) Protection from all Elementals The magic protects the reader and all within 10 feet of him from the type of elemental noted, as well as elemental creatures of the same plane(s). The protection affects a maximum of 24 Hit Dice of elemental creatures if the scroll is of a specific elemental type, 16 Hit Dice if it is against all sorts of elementals. The spell lasts for 5d8 rounds. Attack out of the circle is possible, as is attack into it by any elemental creature with more Hit Dice than are protected against or by several elemental creatures--those in excess of the protected number of Hit Dice are able to enter and attack.',
      },
      '4e': {
        description: '(including tritons and water weirds) Protection from all Elementals The magic protects the reader and all within 10 feet of him from the type of elemental noted, as well as elemental creatures of the same plane(s). The protection affects a maximum of 24 Hit Dice of elemental creatures if the scroll is of a specific elemental type, 16 Hit Dice if it is against all sorts of elementals. The spell lasts for 5d8 rounds. Attack out of the circle is possible, as is attack into it by any elemental creature with more Hit Dice than are protected against or by several elemental creatures--those in excess of the protected number of Hit Dice are able to enter and attack.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to water elementals effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-fire',
    name: 'Protection from Fire',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--8) Protection extends to a 30-foot diameter sphere centered on the reader. All in this area are able to withstand flame and heat of the hottest type, even of magical and elemental nature. The protection lasts 1d4+4 turns.',
      },
      '4e': {
        description: '(Reading time--8) Protection extends to a 30-foot diameter sphere centered on the reader. All in this area are able to withstand flame and heat of the hottest type, even of magical and elemental nature. The protection lasts 1d4+4 turns.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to fire effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-gas',
    name: 'Protection from Gas',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--3) This scroll generates a 10-foot diameter sphere of protection centered on the reader. All within the area are immune to the effects of any gas--poison gas, gaseous breath weapons, spells that generate gas (such as stinking cloud and cloudkill), and all similar forms of noxious, toxic vapors. The protection lasts for 1d4+4 rounds.',
      },
      '4e': {
        description: '(Reading time--3) This scroll generates a 10-foot diameter sphere of protection centered on the reader. All within the area are immune to the effects of any gas--poison gas, gaseous breath weapons, spells that generate gas (such as stinking cloud and cloudkill), and all similar forms of noxious, toxic vapors. The protection lasts for 1d4+4 rounds.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to gas effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-lycanthropes',
    name: 'Protection from Lycanthropes',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--4) There are seven common types of this scroll. The DM can select one from the table below or make a percentile roll to determine it randomly: D100 Roll Scroll Type 01-05 Protection from Werebears 06-10 Protection from Wereboars 11-20 Protection from Wererats 21-25 Protection from Weretigers 26-40 Protection from Werewolves 41-98 Protection from all Lycanthropes 99-00 Protection from Shape-Changers The magical circle from the reading of the scroll extends in a 10-foot radius and moves with the reader. Each scroll protects against 49 Hit Dice of lycanthropes, rounding all hit point pluses down unless they exceed +2. The protection is otherwise similar to that against elementals, above. The protection from shape-changers spell protects against monsters (except gods and godlike creatures) able to change their form to that of man: dopplegangers, certain dragons, druids, jackalweres, and lycanthropes, for example. The magic lasts for 5d6 rounds.',
      },
      '4e': {
        description: '(Reading time--4) There are seven common types of this scroll. The DM can select one from the table below or make a percentile roll to determine it randomly: D100 Roll Scroll Type 01-05 Protection from Werebears 06-10 Protection from Wereboars 11-20 Protection from Wererats 21-25 Protection from Weretigers 26-40 Protection from Werewolves 41-98 Protection from all Lycanthropes 99-00 Protection from Shape-Changers The magical circle from the reading of the scroll extends in a 10-foot radius and moves with the reader. Each scroll protects against 49 Hit Dice of lycanthropes, rounding all hit point pluses down unless they exceed +2. The protection is otherwise similar to that against elementals, above. The protection from shape-changers spell protects against monsters (except gods and godlike creatures) able to change their form to that of man: dopplegangers, certain dragons, druids, jackalweres, and lycanthropes, for example. The magic lasts for 5d6 rounds.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to lycanthropes effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-shape',
    name: 'Protection from Shape',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This protection scroll creates a circle of protection that grants resistance to shape effects.',
      },
      '4e': {
        description: 'Reading this scroll invokes a protective ward that shields against shape effects.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to shape effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-magic',
    name: 'Protection from Magic',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--8) This scroll invokes a very powerful, invisible globe of antimagic in a 5-foot radius from the reader. No form of magic can pass into or out of it, but physical things are not restricted by the globe. As with other protections, the globe of antimagic moves with its invoker. The protection lasts for 5d6 rounds.',
      },
      '4e': {
        description: '(Reading time--8) This scroll invokes a very powerful, invisible globe of antimagic in a 5-foot radius from the reader. No form of magic can pass into or out of it, but physical things are not restricted by the globe. As with other protections, the globe of antimagic moves with its invoker. The protection lasts for 5d6 rounds.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to magic effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-petrification',
    name: 'Protection from Petrification',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--5) A 10-foot radius circle of protection extends from, and moves with, the reader of this scroll. Everyone within its confines i absolutely immune to all attack forms, magical or otherwise, that turn flesh to stone. The protection lasts for 5d4 rounds.',
      },
      '4e': {
        description: '(Reading time--5) A 10-foot radius circle of protection extends from, and moves with, the reader of this scroll. Everyone within its confines i absolutely immune to all attack forms, magical or otherwise, that turn flesh to stone. The protection lasts for 5d4 rounds.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to petrification effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-plants',
    name: 'Protection from Plants',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--1 round). A protective sphere 10 feet in diameter is centered on the reader. All forms of vegetable life (including fungi, slimes, molds, and the like) are unable to penetrate the sphere. If it is moved toward plant life that is capable of movement, the plant will be pushed away. If the plant is immobile (a well-rooted shrub, bush, or tree, for instance), the sphere cannot be moved through or past it unless the reader has enough strength and mass to uproot the plant under normal conditions. The protection lasts for 1d4+4 turns.',
      },
      '4e': {
        description: '(Reading time--1 round). A protective sphere 10 feet in diameter is centered on the reader. All forms of vegetable life (including fungi, slimes, molds, and the like) are unable to penetrate the sphere. If it is moved toward plant life that is capable of movement, the plant will be pushed away. If the plant is immobile (a well-rooted shrub, bush, or tree, for instance), the sphere cannot be moved through or past it unless the reader has enough strength and mass to uproot the plant under normal conditions. The protection lasts for 1d4+4 turns.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to plants effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-poison',
    name: 'Protection from Poison',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--3) The protection afforded by this scroll extends only to the reader. No form of poison--ingested, contacted, breathed, etc.--will affect the protected individual, and any poison in the reader\'s system is permanently neutralized. The protection otherwise lasts 1d10+2 rounds.',
      },
      '4e': {
        description: '(Reading time--3) The protection afforded by this scroll extends only to the reader. No form of poison--ingested, contacted, breathed, etc.--will affect the protected individual, and any poison in the reader\'s system is permanently neutralized. The protection otherwise lasts 1d10+2 rounds.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to poison effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-possession',
    name: 'Protection from Possession',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--1 round) This scroll generates a magical circle of 10-foot radius that extends from, and moves with, the reader. All creatures within its confines are protected from possession by magical spell attacks such as magic jar or attack forms aimed at possession or mental control. Even the dead are protected if they are within the magic circle. The protection lasts for 10d6 rounds in 90% of these scrolls; 10% have power that lasts 10d6 turns, but the spell effect is stationary.',
      },
      '4e': {
        description: '(Reading time--1 round) This scroll generates a magical circle of 10-foot radius that extends from, and moves with, the reader. All creatures within its confines are protected from possession by magical spell attacks such as magic jar or attack forms aimed at possession or mental control. Even the dead are protected if they are within the magic circle. The protection lasts for 10d6 rounds in 90% of these scrolls; 10% have power that lasts 10d6 turns, but the spell effect is stationary.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to possession effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-undead',
    name: 'Protection from Undead',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: '(Reading time--4) When this scroll is read, a 5- foot radius circle of protection extends from, and moves with, the reader. It protects everyone within it from all physical attacks made by undead (ghasts, ghosts, ghouls, shadows, skeletons, spectres, wights, wraiths, vampires, zombies, etc.) but not magical spells or other attack forms. If a creature leaves the protected area, it is subject to physical attack. The protection restrains up to 35 Hit Dice/levels of undead; excess Hit Dice/levels can pass through the circle. It remains in effect for 10d8 rounds. Some protection scrolls of this nature protect only against certain types of undead (one or more) rather than all undead, at the DM\'s option. (See "Potions, Undead Control" for a die roll table.)',
      },
      '4e': {
        description: '(Reading time--4) When this scroll is read, a 5- foot radius circle of protection extends from, and moves with, the reader. It protects everyone within it from all physical attacks made by undead (ghasts, ghosts, ghouls, shadows, skeletons, spectres, wights, wraiths, vampires, zombies, etc.) but not magical spells or other attack forms. If a creature leaves the protected area, it is subject to physical attack. The protection restrains up to 35 Hit Dice/levels of undead; excess Hit Dice/levels can pass through the circle. It remains in effect for 10d8 rounds. Some protection scrolls of this nature protect only against certain types of undead (one or more) rather than all undead, at the DM\'s option. (See "Potions, Undead Control" for a die roll table.)',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to undead effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'scroll-protection-from-water',
    name: 'Protection from Water',
    category: 'Scroll',
    source: 'DMG',
    editions: {
      '2e': {
        description: 's (Reading time--6) This protection extends in a 10- foot diameter sphere centered on the reader. All forms of water--liquid, solid, and vapor, ice, hail, snow, sleet, steam, and so forth--are unable to penetrate the sphere of protection. If those protected come upon a form of water, the substance simply will not touch them; thus, they will not slip on ice, sink into a body of water, etc. The protection lasts for 1d4+4 turns. Rings All magical rings normally radiate magic, but most are impossible to detect as magical rings without some mystic means. Furthermore, all magical rings look alike, so determination of a given ring\'s magical powers is difficult. The ring must be put on and various things tried in order to find what it does. No ring radiates good or evil. No more than two magical rings can be worn by a character at the same time. If more are worn, none will function. No more than one magical ring can be worn on the same hand. A second ring worn on one hand causes both to be useless. Rings must be worn on the fingers. Rings on toes, in ear lobes, etc., do not function as magical rings. The spell-like abilities of rings function as 12th- level magic unless the power requires a higher level. In cases where a higher level is necessary, rings function at the minimum level of magic use needed to cast the equivalent spell. Magical rings can be worn and used by all character classes and humans/humanoids not specifically prohibited elsewhere. You might allow "monsters\'\' with digits to wear rings, and some can actually benefit from them. For example, a troll could wear a ring of regeneration and gain its benefits in addition to its normal regenerative abilities. List of Rings',
      },
      '4e': {
        description: 's (Reading time--6) This protection extends in a 10- foot diameter sphere centered on the reader. All forms of water--liquid, solid, and vapor, ice, hail, snow, sleet, steam, and so forth--are unable to penetrate the sphere of protection. If those protected come upon a form of water, the substance simply will not touch them; thus, they will not slip on ice, sink into a body of water, etc. The protection lasts for 1d4+4 turns. Rings All magical rings normally radiate magic, but most are impossible to detect as magical rings without some mystic means. Furthermore, all magical rings look alike, so determination of a given ring\'s magical powers is difficult. The ring must be put on and various things tried in order to find what it does. No ring radiates good or evil. No more than two magical rings can be worn by a character at the same time. If more are worn, none will function. No more than one magical ring can be worn on the same hand. A second ring worn on one hand causes both to be useless. Rings must be worn on the fingers. Rings on toes, in ear lobes, etc., do not function as magical rings. The spell-like abilities of rings function as 12th- level magic unless the power requires a higher level. In cases where a higher level is necessary, rings function at the minimum level of magic use needed to cast the equivalent spell. Magical rings can be worn and used by all character classes and humans/humanoids not specifically prohibited elsewhere. You might allow "monsters\'\' with digits to wear rings, and some can actually benefit from them. For example, a troll could wear a ring of regeneration and gain its benefits in addition to its normal regenerative abilities. List of Rings',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Standard Action. You and each ally within 2 squares gain resist 10 to the associated damage type until the end of the encounter.',
      },
      '5e': {
        description: 'Using this scroll creates a 10-foot-radius protective ward. Creatures within gain resistance to water effects and advantage on saving throws against them for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
];
