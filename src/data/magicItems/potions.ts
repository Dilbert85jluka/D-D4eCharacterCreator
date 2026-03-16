import type { MagicItemData } from '../../types/magicItem';

/** Potions & Oils */
export const potions: MagicItemData[] = [
  {
    id: 'potion-animal-control',
    name: 'Animal Control',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion enables the imbiber to empathize with and control the emotions of animals of one type--cats, dogs, horses, etc. The number of animals controlled depends upon size: 5d4 animals of the size of giant rats; 3d4 animals of about man-size; or 1d4 animals weighing about � ton or more. The type of animal that can be controlled depends upon the particular potion, as indicated by die roll (d20): D20 Roll Animal Type 1-4 mammal/marsupial 5-8 avian 9-12 reptile/amphibian 13-15 fish 16-17 mammal/marsupial/avian 18-19 reptile/amphibian/fish 20 all of the above Animals with Intelligence of 5 (low Intelligence) or better are entitled to a saving throw vs. spell. Control is limited to emotions or drives unless some form of communication is possible. Note that many monsters can\'t be controlled by the use of this potion, nor can humans, demihumans, or humanoids (see ring of mammal control).',
        xpValue: 600,
        gpValue: 1200,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion enables the imbiber to empathize with and control the emotions of animals of one type--cats, dogs, horses, etc. The number of animals controlled depends upon size: 5d4 animals of the size of giant rats; 3d4 animals of about man-size; or 1d4 animals weighing about � ton or more. The type of animal that can be controlled depends upon the particular potion, as indicated by die roll (d20): D20 Roll Animal Type 1-4 mammal/marsupial 5-8 avian 9-12 reptile/amphibian 13-15 fish 16-17 mammal/marsupial/avian 18-19 reptile/amphibian/fish 20 all of the above Animals with Intelligence of 5 (low Intelligence) or better are entitled to a saving throw vs. spell. Control is limited to emotions or drives unless some form of communication is possible. Note that many monsters can\'t be controlled by the use of this potion, nor can humans, demihumans, or humanoids (see ring of mammal control).',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Minor Action. You dominate one creature of the appropriate type (level 10 or lower) within 10 squares until the end of the encounter (save ends).',
      },
      '5e': {
        description: 'This potion enables the imbiber to empathize with and control the emotions of animals of one type--cats, dogs, horses, etc. The number of animals controlled depends upon size: 5d4 animals of the size of giant rats; 3d4 animals of about man-size; or 1d4 animals weighing about � ton or more. The type of animal that can be controlled depends upon the particular potion, as indicated by die roll (d20): D20 Roll Animal Type 1-4 mammal/marsupial 5-8 avian 9-12 reptile/amphibian 13-15 fish 16-17 mammal/marsupial/avian 18-19 reptile/amphibian/fish 20 all of the above Animals with Intelligence of 5 (low Intelligence) or better are entitled to a saving throw vs. spell. Control is limited to emotions or drives unless some form of communication is possible. Note that many monsters can\'t be controlled by the use of this potion, nor can humans, demihumans, or humanoids (see ring of mammal control).',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-aroma-of-dreams',
    name: 'Aroma of Dreams',
    category: 'Potion',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'All creatures who come within 5\' of the wearer of this oil are put to sleep. Potential victims are allowed a saving throw vs. al spell. If successful, the victim suffers no effect and may remain near the wearer without need of further saving throws. If the roll is failed, the creature slumps to the ground, the victim of a magical slumber that lasts 1d4+4 rounds. When an application of the oil is worn, the scent is y (for potent for 3d4 rounds. After this time, the perfume will evaporates and another dose must be applied if the wearer wishes to renew the effect.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'All creatures who come within 5\' of the wearer of this oil are put to sleep. Potential victims are allowed a saving throw vs. al spell. If successful, the victim suffers no effect and may remain near the wearer without need of further saving throws. If the roll is failed, the creature slumps to the ground, the victim of a magical slumber that lasts 1d4+4 rounds. When an application of the oil is worn, the scent is y (for potent for 3d4 rounds. After this time, the perfume will evaporates and another dose must be applied if the wearer wishes to renew the effect.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of aroma of dreams until the end of the encounter.',
      },
      '5e': {
        description: 'All creatures who come within 5\' of the wearer of this oil are put to sleep. Potential victims are allowed a saving throw vs. al spell. If successful, the victim suffers no effect and may remain near the wearer without need of further saving throws. If the roll is failed, the creature slumps to the ground, the victim of a magical slumber that lasts 1d4+4 rounds. When an application of the oil is worn, the scent is y (for potent for 3d4 rounds. After this time, the perfume will evaporates and another dose must be applied if the wearer wishes to renew the effect.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-clairaudience',
    name: 'Clairaudience',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion empowers the creature drinking it to hear as the 3rd-level wizard spell of the same name. However, the potion can be used to hear even unknown areas within 30 yards. Its effects last for two turns.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion empowers the creature drinking it to hear as the 3rd-level wizard spell of the same name. However, the potion can be used to hear even unknown areas within 30 yards.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of clairaudience until the end of the encounter.',
      },
      '5e': {
        description: 'This potion empowers the creature drinking it to hear as the 3rd-level wizard spell of the same name. However, the potion can be used to hear even unknown areas within 30 yards. Its effects last for two turns.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-clairvoyance',
    name: 'Clairvoyance',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion empowers the individual to see as the 3rd- level wizard spell, clairvoyance. It differs from the spell in that unknown areas up to 30 yards distant can be seen. Its effects last for one turn.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion empowers the individual to see as the 3rd- level wizard spell, clairvoyance. It differs from the spell in that unknown areas up to 30 yards distant can be seen.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of clairvoyance until the end of the encounter.',
      },
      '5e': {
        description: 'This potion empowers the individual to see as the 3rd- level wizard spell, clairvoyance. It differs from the spell in that unknown areas up to 30 yards distant can be seen. Its effects last for one turn.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-climbing',
    name: 'Climbing',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'Imbibing this potion enables the individual to climb as a thief, up or down vertical surfaces. A climbing potion is effective for one turn plus 5d4 rounds. The base chance of slipping and falling is 1%. Make a percentile check at the halfway point of the climb--01 means the character falls. For every 100 pounds carried by the character, add 1% to the chance of slipping. If the climber wears armor, add the following to the falling chance: Armor Chance to Fall studded leather 1% ring mail 2% scale mail 4% chain mail 7% banded or splinted armor 8% plate mail 10% field plate 10% full plate 12% magical armor, any type 1% Curdled Death (Aromatic Oil, Source: Tome of Magic): Perhaps the most powerful of all aromatic oils, the smell of curdled death has the ability to slay all living creatures of 3 or fewer Hit Dice or experience levels who come within 5\' of the wearer. Magical, undead, and extraplanar creatures are immune to this oil, as are all creatures of 4 or more Hit Dice or experience levels. Upon smelling the oil, potential victims are allowed a saving throw vs. spell. If successful, a creature suffers no effect and may remain near the wearer without need of further saving throws. Those who fail the save drop dead in their tracks. When a dose is worn, it remains potent enough to kill creatures for 1d3 rounds. After this time, the fragrance evaporates and another dose must be applied if the wearer wishes to renew the effect.',
        xpValue: 250,
        gpValue: 500,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'Imbibing this potion enables the individual to climb as a thief, up or down vertical surfaces. A climbing potion is effective for one turn plus 5d4 rounds. The base chance of slipping and falling is 1%. Make a percentile check at the halfway point of the climb--01 means the character falls. For every 100 pounds carried by the character, add 1% to the chance of slipping. If the climber wears armor, add the following to the falling chance: Armor Chance to Fall studded leather 1% ring mail 2% scale mail 4% chain mail 7% banded or splinted armor 8% plate mail 10% field plate 10% full plate 12% magical armor, any type 1% Curdled Death (Aromatic Oil, Source: Tome of Magic): Perhaps the most powerful of all aromatic oils, the smell of curdled death has the ability to slay all living creatures of 3 or fewer Hit Dice or experience levels who come within 5\' of the wearer. Magical, undead, and extraplanar creatures are immune to this oil, as are all creatures of 4 or more Hit Dice or experience levels. Upon smelling the oil, potential victims are allowed a saving throw vs. spell. If successful, a creature suffers no effect and may remain near the wearer without need of further saving throws. Those who fail the save drop dead in their tracks. When a dose is worn, it remains potent enough to kill creatures for 1d3 rounds. After this time, the fragrance evaporates and another dose must be applied if the wearer wishes to renew the effect.',
        rarity: 'Common',
        level: 3,
        powerText: 'Power (Consumable): Minor Action. You gain a climb speed of 6 until the end of the encounter.',
      },
      '5e': {
        description: 'Imbibing this potion enables the individual to climb as a thief, up or down vertical surfaces. A climbing potion is effective for one turn plus 5d4 rounds. The base chance of slipping and falling is 1%. Make a percentile check at the halfway point of the climb--01 means the character falls. For every 100 pounds carried by the character, add 1% to the chance of slipping. If the climber wears armor, add the following to the falling chance: Armor Chance to Fall studded leather 1% ring mail 2% scale mail 4% chain mail 7% banded or splinted armor 8% plate mail 10% field plate 10% full plate 12% magical armor, any type 1% Curdled Death (Aromatic Oil, Source: Tome of Magic): Perhaps the most powerful of all aromatic oils, the smell of curdled death has the ability to slay all living creatures of 3 or fewer Hit Dice or experience levels who come within 5\' of the wearer. Magical, undead, and extraplanar creatures are immune to this oil, as are all creatures of 4 or more Hit Dice or experience levels. Upon smelling the oil, potential victims are allowed a saving throw vs. spell. If successful, a creature suffers no effect and may remain near the wearer without need of further saving throws. Those who fail the save drop dead in their tracks. When a dose is worn, it remains potent enough to kill creatures for 1d3 rounds. After this time, the fragrance evaporates and another dose must be applied if the wearer wishes to renew the effect.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-delusion',
    name: 'Delusion',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion affects the mind of the character so that he believes the liquid is some other potion (healing, for example, is a good choice--damage is "restored\'\' by drinking it, and only death or rest after an adventure will reveal that the potion only caused the imbiber to believe that he was aided). If several individuals taste this potion, it is 90% probable that they will all agree it is the same potion (or whatever type the DM announces or hints at).',
        xpValue: 500,
        gpValue: 1000,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion affects the mind of the character so that he believes the liquid is some other potion (healing, for example, is a good choice--damage is "restored\'\' by drinking it, and only death or rest after an adventure will reveal that the potion only caused the imbiber to believe that he was aided). If several individuals taste this potion, it is 90% probable that they will all agree it is the same potion (or whatever type the DM announces or hints at).',
        rarity: 'Uncommon',
        level: 8,
        powerText: 'Power (Consumable): Minor Action. You regain hit points as if you had spent a healing surge.',
      },
      '5e': {
        description: 'This potion affects the mind of the character so that he believes the liquid is some other potion (healing, for example, is a good choice--damage is "restored\'\' by drinking it, and only death or rest after an adventure will reveal that the potion only caused the imbiber to believe that he was aided). If several individuals taste this potion, it is 90% probable that they will all agree it is the same potion (or whatever type the DM announces or hints at).',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-diminution',
    name: 'Diminution',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'After drinking this potion, the individual (and everything he\'s carrying and wearing) diminishes in size--to as small as 5% of normal size. The percentage of the potion drunk determines the amount a character shrinks: For example, if 40% of the contents are swallowed, the person shrinks to 60% of normal size. The effects of this potion last for six turns p 1d4+1 turns.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'After drinking this potion, the individual (and everything he\'s carrying and wearing) diminishes in size--to as small as 5% of normal size. The percentage of the potion drunk determines the amount a character shrinks: For example, if 40% of the contents are swallowed, the person shrinks to 60% of normal size. The effects of this potion last for six turns p 1d4+1 turns.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of diminution until the end of the encounter.',
      },
      '5e': {
        description: 'After drinking this potion, the individual (and everything he\'s carrying and wearing) diminishes in size--to as small as 5% of normal size. The percentage of the potion drunk determines the amount a character shrinks: For example, if 40% of the contents are swallowed, the person shrinks to 60% of normal size. The effects of this potion last for six turns p 1d4+1 turns.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-dragon-control',
    name: 'Dragon Control',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion enables the individual drinking it to cast what is, in effect, a charm monster spell upon a particular dragon within 60 yards. The dragon is entitled to a saving throw vs. spell, but with a -2 penalty. Control lasts for 5-20 (5d4) rounds. There are various sorts of dragon potions, as shown below: Dragon Type White Dragon control D20 Roll Black Dragon control 1-2 Green Dragon control 3-4 Blue Dragon control 5-7 Red Dragon control 8-9 Brass Dragon control 10 Copper Dragon control 11-12 Bronze Dragon control 13-14 Silver Dragon control 17 Gold Dragon control 18-19 Evil Dragon control* 20 Good Dragon control** * Black, blue, green, red, and white ** Brass, bronze, copper, gold, and silver',
        xpValue: 600,
        gpValue: 1200,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion enables the individual drinking it to cast what is, in effect, a charm monster spell upon a particular dragon within 60 yards. The dragon is entitled to a saving throw vs. spell, but with a -2 penalty. Control lasts for 5-20 (5d4) rounds. There are various sorts of dragon potions, as shown below: Dragon Type White Dragon control D20 Roll Black Dragon control 1-2 Green Dragon control 3-4 Blue Dragon control 5-7 Red Dragon control 8-9 Brass Dragon control 10 Copper Dragon control 11-12 Bronze Dragon control 13-14 Silver Dragon control 17 Gold Dragon control 18-19 Evil Dragon control* 20 Good Dragon control** * Black, blue, green, red, and white ** Brass, bronze, copper, gold, and silver',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Minor Action. You dominate one creature of the appropriate type (level 10 or lower) within 10 squares until the end of the encounter (save ends).',
      },
      '5e': {
        description: 'This potion enables the individual drinking it to cast what is, in effect, a charm monster spell upon a particular dragon within 60 yards. The dragon is entitled to a saving throw vs. spell, but with a -2 penalty. Control lasts for 5-20 (5d4) rounds. There are various sorts of dragon potions, as shown below: Dragon Type White Dragon control D20 Roll Black Dragon control 1-2 Green Dragon control 3-4 Blue Dragon control 5-7 Red Dragon control 8-9 Brass Dragon control 10 Copper Dragon control 11-12 Bronze Dragon control 13-14 Silver Dragon control 17 Gold Dragon control 18-19 Evil Dragon control* 20 Good Dragon control** * Black, blue, green, red, and white ** Brass, bronze, copper, gold, and silver',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-elasticity',
    name: 'Elasticity',
    category: 'Potion',
    source: 'TcWiH',
    editions: {
      '2e': {
        description: 'A character consuming one dose of this potion is able to stretch his legs, arms, neck, or any other appendage up to a distance In feet equal to twice his Constitution score; for instance, a character with a Constitution of 15 can stretch up to 30 feet. A character can stretch only one appendage at a time; for instance, he can stretch one arm, one finger, or his neck. Whenever he stretches any appendage, he must make a Constitution Check; if he fails, the stress of the stretch causes 1d6 hit points of damage. The potion lasts for 1-4 turns; during this time, the character can make as many stretches as he likes, as long as he checks for damage for each stretch.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'A character consuming one dose of this potion is able to stretch his legs, arms, neck, or any other appendage up to a distance In feet equal to twice his Constitution score; for instance, a character with a Constitution of 15 can stretch up to 30 feet. A character can stretch only one appendage at a time; for instance, he can stretch one arm, one finger, or his neck. Whenever he stretches any appendage, he must make a Constitution Check; if he fails, the stress of the stretch causes 1d6 hit points of damage. The potion lasts for 1-4 turns; during this time, the character can make as many stretches as he likes, as long as he checks for damage for each stretch.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of elasticity until the end of the encounter.',
      },
      '5e': {
        description: 'A character consuming one dose of this potion is able to stretch his legs, arms, neck, or any other appendage up to a distance In feet equal to twice his Constitution score; for instance, a character with a Constitution of 15 can stretch up to 30 feet. A character can stretch only one appendage at a time; for instance, he can stretch one arm, one finger, or his neck. Whenever he stretches any appendage, he must make a Constitution Check; if he fails, the stress of the stretch causes 1d6 hit points of damage. The potion lasts for 1-4 turns; during this time, the character can make as many stretches as he likes, as long as he checks for damage for each stretch.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-elemental-control',
    name: 'Elemental Control',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'When this potion is consumed, the imbiber can influence one or two elementals in a manner similar to a charm monster spell. The elementals must be within 60 feet of the imbiber and are allowed a saving throw vs. petrification to avoid the effect. If only one elemental is influenced, it is subject to a - 4 penalty on its save. If two are influenced, their saving throws gain a +2 bonus because the effect of the potion is weakened. If either elemental is controlled by another wizard, it gains a +2 bonus to its saving throw. Note that if the elemental was summoned by the 5th-level lus conjure elemental spell, the summoner has a 50% chance of dispelling the creature. Control lasts for 5d6 rounds. The type of elemental subject to a particular potion is randomly determined.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'When this potion is consumed, the imbiber can influence one or two elementals in a manner similar to a charm monster spell. The elementals must be within 60 feet of the imbiber and are allowed a saving throw vs. petrification to avoid the effect. If only one elemental is influenced, it is subject to a - 4 penalty on its save. If two are influenced, their saving throws gain a +2 bonus because the effect of the potion is weakened. If either elemental is controlled by another wizard, it gains a +2 bonus to its saving throw. Note that if the elemental was summoned by the 5th-level lus conjure elemental spell, the summoner has a 50% chance of dispelling the creature. Control lasts for 5d6 rounds. The type of elemental subject to a particular potion is randomly determined.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of elemental control until the end of the encounter.',
      },
      '5e': {
        description: 'When this potion is consumed, the imbiber can influence one or two elementals in a manner similar to a charm monster spell. The elementals must be within 60 feet of the imbiber and are allowed a saving throw vs. petrification to avoid the effect. If only one elemental is influenced, it is subject to a - 4 penalty on its save. If two are influenced, their saving throws gain a +2 bonus because the effect of the potion is weakened. If either elemental is controlled by another wizard, it gains a +2 bonus to its saving throw. Note that if the elemental was summoned by the 5th-level lus conjure elemental spell, the summoner has a 50% chance of dispelling the creature. Control lasts for 5d6 rounds. The type of elemental subject to a particular potion is randomly determined.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-water-elixir-of-health',
    name: 'Water Elixir of Health',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion cures blindness, deafness, disease, feeblemindedness, insanity, infection, infestation, poisoning, and rot. It will not heal wounds or restore hit points lost through any of the above causes.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This glowing elixir mends wounds and restores vitality to the drinker.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You regain hit points as if you had spent a healing surge.',
      },
      '5e': {
        description: 'This liquid looks, smells, and tastes like a beneficial potion but is actually a deadly poison. You must make a DC 13 Constitution saving throw or take 3d6 poison damage.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-elixir-of-madness',
    name: 'Elixir of Madness',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A single sip of this elixir causes the imbiber to go mad, as if affected by the 4th-level wizard spell, confusion, until a heal, restoration, or wish spell is used to remove the madness. Once any creature is affected by the elixir, the remaining draught loses all magical properties, becoming merely a foul-tasting liquid.',
        xpValue: 1350,
        gpValue: 2700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'A single sip of this elixir causes the imbiber to go mad, as if affected by the 4th-level wizard spell, confusion, until a heal, restoration, or wish spell is used to remove the madness. Once any creature is affected by the elixir, the remaining draught loses all magical properties, becoming merely a foul-tasting liquid.',
        rarity: 'Rare',
        level: 25,
        powerText: 'Power (Consumable): Minor Action. You regain hit points as if you had spent a healing surge.',
      },
      '5e': {
        description: 'A single sip of this elixir causes the imbiber to go mad, as if affected by the 4th-level wizard spell, confusion, until a heal, restoration, or wish spell is used to remove the madness. Once any creature is affected by the elixir, the remaining draught loses all magical properties, becoming merely a foul-tasting liquid.',
        rarity: 'Legendary',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-elixir-of-youth',
    name: 'Elixir of Youth',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'Quaffing this rare and potent elixir will reverse aging. Taking the full potion at once reduces the imbiber\'s age by 1d4 + 1 years. Taking just a sip first, instead of drinking it down, will reduce the potency of the liquid, and drinking the lower- potency liquid reduces age by only 1d3 years.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'Quaffing this rare and potent elixir will reverse aging. Taking the full potion at once reduces the imbiber\'s age by 1d4 + 1 years. Taking just a sip first, instead of drinking it down, will reduce the potency of the liquid, and drinking the lower- potency liquid reduces age by only 1d3 years.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of elixir of youth until the end of the encounter.',
      },
      '5e': {
        description: 'Quaffing this rare and potent elixir will reverse aging. Taking the full potion at once reduces the imbiber\'s age by 1d4 + 1 years. Taking just a sip first, instead of drinking it down, will reduce the potency of the liquid, and drinking the lower- potency liquid reduces age by only 1d3 years.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-essence-of-darkness',
    name: 'Essence of Darkness',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This pure black oily fluid must be kept in tough, light- proof containers, since it is destroyed after one tur in bright sunlight or one hour exposed to daylight. Essence of darkness is pure, concentrated, liquefied darkness itself. It can be used in a number of ways: (i) When a dose is swallowed it makes the imbiber\'s entire body, including hair, teeth, and even the whites of the eyes, pure matte black in color. This can enhance a thief\'s chance of hiding in shadows as shown below. (ii) Similarly, if one dose is diluted in a gallon so of warm water, the essence creates a powerful black dye. A gallon of this diluted form can be used to dye clothes and even armor and weapons; one gallon of the dye is sufficient to treat the clothes and equipment of one character. The dye takes one turn to mix and soak into the items and one turn to dry. This process also affects the chances for successful hiding in shadows. Body only (wearing normal clothes) + 5% Body only (wearing no clothes) + 25% Clothes only + 20% Both body and clothes + 40% These bonuses only apply when the thief is trying to hide in darkened areas, obviously; that is, to "traditional" hiding in shadows. Detection resistance operates on a thief using essence of darkness to hide in this way. (iii) Essence of darkness is unstable and if a vial is struck by a crushing blow it will explode into darkness 15\' radius. A single dose of the magical essence will create a darkness 5\' radius if so struck This property has been exploited by making small glass or ceramic globes filled with the liquid which are then thrown forcefully onto hard surfaces to create "darkness bombs." At the DM\'s option, a thief who has ingested the essence or applied it to his clothing might similarly become the center of a darkness 5\' radius effect if struck a severe blow (50% of remaining hit points, with a 12 hit point minimum for the effect to operate) with a blunt weapon. The effects of essence of darkness last for six hours plus 1d6 turns, if used externally; if ingested, it has the same duration as a standard potion. Each bottle or vial of the essence found usually contains sufficient fluid for 1d4+4 doses.',
        xpValue: 250,
        gpValue: 500,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This pure black oily fluid must be kept in tough, light- proof containers, since it is destroyed after one tur in bright sunlight or one hour exposed to daylight. Essence of darkness is pure, concentrated, liquefied darkness itself. It can be used in a number of ways: (i) When a dose is swallowed it makes the imbiber\'s entire body, including hair, teeth, and even the whites of the eyes, pure matte black in color. This can enhance a thief\'s chance of hiding in shadows as shown below. (ii) Similarly, if one dose is diluted in a gallon so of warm water, the essence creates a powerful black dye. A gallon of this diluted form can be used to dye clothes and even armor and weapons; one gallon of the dye is sufficient to treat the clothes and equipment of one character. The dye takes one turn to mix and soak into the items and one turn to dry. This process also affects the chances for successful hiding in shadows. Body only (wearing normal clothes) + 5% Body only (wearing no clothes) + 25% Clothes only + 20% Both body and clothes + 40% These bonuses only apply when the thief is trying to hide in darkened areas, obviously; that is, to "traditional" hiding in shadows. Detection resistance operates on a thief using essence of darkness to hide in this way. (iii) Essence of darkness is unstable and if a vial is struck by a crushing blow it will explode into darkness 15\' radius. A single dose of the magical essence will create a darkness 5\' radius if so struck This property has been exploited by making small glass or ceramic globes filled with the liquid which are then thrown forcefully onto hard surfaces to create "darkness bombs." At the DM\'s option, a thief who has ingested the essence or applied it to his clothing might similarly become the center of a darkness 5\' radius effect if struck a severe blow (50% of remaining hit points, with a 12 hit point minimum for the effect to operate) with a blunt weapon. The effects of essence of darkness last for six hours plus 1d6 turns, if used externally; if ingested, it has the same duration as a standard potion. Each bottle or vial of the essence found usually contains sufficient fluid for 1d4+4 doses.',
        rarity: 'Common',
        level: 3,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of essence of darkness until the end of the encounter.',
      },
      '5e': {
        description: 'This pure black oily fluid must be kept in tough, light- proof containers, since it is destroyed after one tur in bright sunlight or one hour exposed to daylight. Essence of darkness is pure, concentrated, liquefied darkness itself. It can be used in a number of ways: (i) When a dose is swallowed it makes the imbiber\'s entire body, including hair, teeth, and even the whites of the eyes, pure matte black in color. This can enhance a thief\'s chance of hiding in shadows as shown below. (ii) Similarly, if one dose is diluted in a gallon so of warm water, the essence creates a powerful black dye. A gallon of this diluted form can be used to dye clothes and even armor and weapons; one gallon of the dye is sufficient to treat the clothes and equipment of one character. The dye takes one turn to mix and soak into the items and one turn to dry. This process also affects the chances for successful hiding in shadows. Body only (wearing normal clothes) + 5% Body only (wearing no clothes) + 25% Clothes only + 20% Both body and clothes + 40% These bonuses only apply when the thief is trying to hide in darkened areas, obviously; that is, to "traditional" hiding in shadows. Detection resistance operates on a thief using essence of darkness to hide in this way. (iii) Essence of darkness is unstable and if a vial is struck by a crushing blow it will explode into darkness 15\' radius. A single dose of the magical essence will create a darkness 5\' radius if so struck This property has been exploited by making small glass or ceramic globes filled with the liquid which are then thrown forcefully onto hard surfaces to create "darkness bombs." At the DM\'s option, a thief who has ingested the essence or applied it to his clothing might similarly become the center of a darkness 5\' radius effect if struck a severe blow (50% of remaining hit points, with a 12 hit point minimum for the effect to operate) with a blunt weapon. The effects of essence of darkness last for six hours plus 1d6 turns, if used externally; if ingested, it has the same duration as a standard potion. Each bottle or vial of the essence found usually contains sufficient fluid for 1d4+4 doses.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-healing',
    name: 'Healing',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion restores 3d8 + 3 hit points of damage when wholly consumed, or 1d8 hit points of damage for each one-third that is drunk.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion restores 3d8 + 3 hit points of damage when wholly consumed, or 1d8 hit points of damage for each one-third that is drunk.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of healing until the end of the encounter.',
      },
      '5e': {
        description: 'This potion restores 3d8 + 3 hit points of damage when wholly consumed, or 1d8 hit points of damage for each one-third that is drunk.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-fire-breath',
    name: 'Fire Breath',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion allows the imbiber to spew a tongue of flame any time within one hour of quaffing the n liquid. Each potion contains enough liquid for four small draughts. One draught allows the imbiber to breathe a cone of fire 10 feet wide and up to 20 feet long that inflicts 1d10 + 2 points of damage (d10 + 2). A double draught doubles the range and damage. If the entire potion is taken at once, the cone is 20 feet wide, up to 80 feet long, and inflicts 5d10 points of damage. Saving throws vs. breath weapon for half damage apply in all cases. If the flame is not expelled before the hour expires, the potion fails, with a 10% chance that the flames or erupt in the imbiber\'s system, inflicting double damage upon him, with no saving throw allowed.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion allows the imbiber to spew a tongue of flame any time within one hour of quaffing the n liquid. Each potion contains enough liquid for four small draughts. One draught allows the imbiber to breathe a cone of fire 10 feet wide and up to 20 feet long that inflicts 1d10 + 2 points of damage (d10 + 2). A double draught doubles the range and damage. If the entire potion is taken at once, the cone is 20 feet wide, up to 80 feet long, and inflicts 5d10 points of damage. Saving throws vs. breath weapon for half damage apply in all cases. If the flame is not expelled before the hour expires, the potion fails, with a 10% chance that the flames or erupt in the imbiber\'s system, inflicting double damage upon him, with no saving throw allowed.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of fire breath until the end of the encounter.',
      },
      '5e': {
        description: 'This potion allows the imbiber to spew a tongue of flame any time within one hour of quaffing the n liquid. Each potion contains enough liquid for four small draughts. One draught allows the imbiber to breathe a cone of fire 10 feet wide and up to 20 feet long that inflicts 1d10 + 2 points of damage (d10 + 2). A double draught doubles the range and damage. If the entire potion is taken at once, the cone is 20 feet wide, up to 80 feet long, and inflicts 5d10 points of damage. Saving throws vs. breath weapon for half damage apply in all cases. If the flame is not expelled before the hour expires, the potion fails, with a 10% chance that the flames or erupt in the imbiber\'s system, inflicting double damage upon him, with no saving throw allowed.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-fire-resistance',
    name: 'Fire Resistance',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion bestows upon the person drinking it magical invulnerability to all forms of normal fire (such as bonfires, burning oil, or even huge pyres of flaming wood). It also gives resistance to fires generated by molten lava, a wall of fire, a fireball, fiery dragon breath, and similar intense flame/heat. All damage from such fires is reduced by -2 from each die of damage, and if a saving throw is applicable, it is rolled with a +4 bonus. If one-half of the potion is consumed, it confers invulnerability to normal fires and half the benefits noted above (-1, +2). The potion lasts one turn, or five rounds for half doses.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion bestows upon the person drinking it magical invulnerability to all forms of normal fire (such as bonfires, burning oil, or even huge pyres of flaming wood). It also gives resistance to fires generated by molten lava, a wall of fire, a fireball, fiery dragon breath, and similar intense flame/heat. All damage from such fires is reduced by -2 from each die of damage, and if a saving throw is applicable, it is rolled with a +4 bonus. If one-half of the potion is consumed, it confers invulnerability to normal fires and half the benefits noted above (-1, +2). The potion lasts one turn, or five rounds for half doses.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of fire resistance until the end of the encounter.',
      },
      '5e': {
        description: 'This potion bestows upon the person drinking it magical invulnerability to all forms of normal fire (such as bonfires, burning oil, or even huge pyres of flaming wood). It also gives resistance to fires generated by molten lava, a wall of fire, a fireball, fiery dragon breath, and similar intense flame/heat. All damage from such fires is reduced by -2 from each die of damage, and if a saving throw is applicable, it is rolled with a +4 bonus. If one-half of the potion is consumed, it confers invulnerability to normal fires and half the benefits noted above (-1, +2). The potion lasts one turn, or five rounds for half doses.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-flying',
    name: 'Flying',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A flying potion enables the individual drinking it to fly in the same manner as the 3rd-level wizard spell, fly. === PAGE 34 ===',
        xpValue: 800,
        gpValue: 1600,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This effervescent potion grants the drinker the power of flight.',
        rarity: 'Rare',
        level: 14,
        powerText: 'Power (Consumable): Minor Action. You gain a fly speed of 8 until the end of the encounter.',
      },
      '5e': {
        description: 'When you drink this potion, you gain a flying speed equal to your walking speed for 1 hour.',
        rarity: 'Rare',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-gaseous-form',
    name: 'Gaseous Form',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'By imbibing this magical liquid, the individual causes his body, as well as anything he\'s carrying or wearing, to become gaseous. The gaseous form is able to flow at a base speed of 3/round. (A gust of wind spell, or even normal strong air currents, will blow the gaseous form at air speed.) The gaseous form is transparent and insubstantial. It wavers and shifts, and can\'t be harmed except by magical fire or lightning, which do normal damage. A whirlwind inflicts double damage upon a creature in gaseous form. When in such condition the individual is able to enter any space that is not airtight--even a small crack or hole that allows air to penetrate also allows entry by a creature in gaseous form. The entire potion must be consumed to achieve this result, and the effects last the enti duration (4+1d4 turns).',
        xpValue: 500,
        gpValue: 1000,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'By imbibing this magical liquid, the individual causes his body, as well as anything he\'s carrying or wearing, to become gaseous. The gaseous form is able to flow at a base speed of 3/round. (A gust of wind spell, or even normal strong air currents, will blow the gaseous form at air speed.) The gaseous form is transparent and insubstantial. It wavers and shifts, and can\'t be harmed except by magical fire or lightning, which do normal damage. A whirlwind inflicts double damage upon a creature in gaseous form. When in such condition the individual is able to enter any space that is not airtight--even a small crack or hole that allows air to penetrate also allows entry by a creature in gaseous form. The entire potion must be consumed to achieve this result, and the effects last the enti duration (4+1d4 turns).',
        rarity: 'Uncommon',
        level: 8,
        powerText: 'Power (Consumable): Minor Action. You gain a +2 power bonus to speed and can take an extra move action each turn until the end of the encounter.',
      },
      '5e': {
        description: 'By imbibing this magical liquid, the individual causes his body, as well as anything he\'s carrying or wearing, to become gaseous. The gaseous form is able to flow at a base speed of 3/round. (A gust of wind spell, or even normal strong air currents, will blow the gaseous form at air speed.) The gaseous form is transparent and insubstantial. It wavers and shifts, and can\'t be harmed except by magical fire or lightning, which do normal damage. A whirlwind inflicts double damage upon a creature in gaseous form. When in such condition the individual is able to enter any space that is not airtight--even a small crack or hole that allows air to penetrate also allows entry by a creature in gaseous form. The entire potion must be consumed to achieve this result, and the effects last the enti duration (4+1d4 turns).',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-giant-control',
    name: 'Giant Control',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A full potion of this draught must be consumed for its effects to be felt. It will influence one or two gian like a charm monster spell. Control lasts for 5d6 rounds. If only one giant is influenced, it is entitl to a saving throw vs. spell with a �4 penalty; if two are influenced, the die rolls gain a +2 bonus-- you\'re weakening the effect of the potion. The type of giant subject to a particular potion is randomly determined.',
        xpValue: 600,
        gpValue: 1200,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'A full potion of this draught must be consumed for its effects to be felt. It will influence one or two gian like a charm monster spell. Control lasts for 5d6 rounds. If only one giant is influenced, it is entitl to a saving throw vs. spell with a �4 penalty; if two are influenced, the die rolls gain a +2 bonus-- you\'re weakening the effect of the potion. The type of giant subject to a particular potion is randomly determined.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Minor Action. You dominate one creature of the appropriate type (level 10 or lower) within 10 squares until the end of the encounter (save ends).',
      },
      '5e': {
        description: 'A full potion of this draught must be consumed for its effects to be felt. It will influence one or two gian like a charm monster spell. Control lasts for 5d6 rounds. If only one giant is influenced, it is entitl to a saving throw vs. spell with a �4 penalty; if two are influenced, the die rolls gain a +2 bonus-- you\'re weakening the effect of the potion. The type of giant subject to a particular potion is randomly determined.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-storm-giant-giant-strength',
    name: 'Storm Giant Giant Strength',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion can be used only by warriors. When a giant strength potion is consumed, the individual gains great strength and bonuses to damage when he scores a hit with any hand-held or thrown weapon.',
        xpValue: 500,
        gpValue: 1000,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This bubbling draught imbues the drinker with tremendous physical strength.',
        rarity: 'Uncommon',
        level: 8,
        powerText: 'Power (Consumable): Minor Action. You gain a +2 power bonus to melee damage rolls until the end of the encounter.',
      },
      '5e': {
        description: 'When you drink this potion, your Strength score changes for 1 hour. The score depends on the type of giant.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-growth',
    name: 'Growth',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion causes the height and weight of the person consuming it to increase. Garments and other worn and carried gear also grow in size. Each fourth of the liquid consumed causes 6 feet of height growth--in other words, a full potion increases height by 24 feet. Weight increases should be proportional to the change in height. Strength is increased sufficiently to allow bearing armor and weapons commensurate with the increased size, but does not provide combat bonuses. Movement increases to that of a giant of approximately equal size. (Please also read the following from the Plo: C&T for situations on the battlefield.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion causes the height and weight of the person consuming it to increase. Garments and other worn and carried gear also grow in size. Each fourth of the liquid consumed causes 6 feet of height growth--in other words, a full potion increases height by 24 feet. Weight increases should be proportional to the change in height. Strength is increased sufficiently to allow bearing armor and weapons commensurate with the increased size, but does not provide combat bonuses. Movement increases to that of a giant of approximately equal size. (Please also read the following from the Plo: C&T for situations on the battlefield.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of growth until the end of the encounter.',
      },
      '5e': {
        description: 'This potion causes the height and weight of the person consuming it to increase. Garments and other worn and carried gear also grow in size. Each fourth of the liquid consumed causes 6 feet of height growth--in other words, a full potion increases height by 24 feet. Weight increases should be proportional to the change in height. Strength is increased sufficiently to allow bearing armor and weapons commensurate with the increased size, but does not provide combat bonuses. Movement increases to that of a giant of approximately equal size. (Please also read the following from the Plo: C&T for situations on the battlefield.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-heroism',
    name: 'Heroism',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This gives the imbiber a temporary increase in levels (hit points, combat ability, and saves) if he has fewer than 10 levels of experience. Level of Number of Additonal Imbiber Levels Temporary 0 Bestowed Hit Dice 1st-3rd 4 4th-6th 3 4d10 7th-9th 2 3d10+1 1 2d10+2 1d10+3 When the potion is quaffed, the individual fights as if he were at the experience level bestowed by the magic of the elixir. Damage sustained is taken first from magically gained hit dice and bonus points. This potion can only be used by warriors.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This gives the imbiber a temporary increase in levels (hit points, combat ability, and saves) if he has fewer than 10 levels of experience. Level of Number of Additonal Imbiber Levels Temporary 0 Bestowed Hit Dice 1st-3rd 4 4th-6th 3 4d10 7th-9th 2 3d10+1 1 2d10+2 1d10+3 When the potion is quaffed, the individual fights as if he were at the experience level bestowed by the magic of the elixir. Damage sustained is taken first from magically gained hit dice and bonus points. This potion can only be used by warriors.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of heroism until the end of the encounter.',
      },
      '5e': {
        description: 'This gives the imbiber a temporary increase in levels (hit points, combat ability, and saves) if he has fewer than 10 levels of experience. Level of Number of Additonal Imbiber Levels Temporary 0 Bestowed Hit Dice 1st-3rd 4 4th-6th 3 4d10 7th-9th 2 3d10+1 1 2d10+2 1d10+3 When the potion is quaffed, the individual fights as if he were at the experience level bestowed by the magic of the elixir. Damage sustained is taken first from magically gained hit dice and bonus points. This potion can only be used by warriors.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-human-control',
    name: 'Human Control',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A potion of human control allows the imbiber to control up to 32 levels or Hit Dice of humans, humanoids, and demihumans as if a charm person spell had been cast. All creatures are entitled to saving throws vs. spell.',
        xpValue: 600,
        gpValue: 1200,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion gives the drinker mental dominion over creatures of a specific type.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Minor Action. You dominate one creature of the appropriate type (level 10 or lower) within 10 squares until the end of the encounter (save ends).',
      },
      '5e': {
        description: 'When you drink this potion, you can cast a charm or dominate effect on creatures of the associated type for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-humans-invisibility',
    name: 'Humans Invisibility',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion confers invisibility similar to the 2nd-level wizard spell of the same name. Actions involving combat cause termination of the invisible state.',
        xpValue: 800,
        gpValue: 1600,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This shimmering draught bends light around the drinker, rendering them invisible.',
        rarity: 'Rare',
        level: 14,
        powerText: 'Power (Consumable): Minor Action. You become invisible until the end of your next turn or until you attack.',
      },
      '5e': {
        description: 'When you drink this potion, you become invisible for 1 hour. The effect ends early if you attack or cast a spell.',
        rarity: 'Rare',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-invulnerability',
    name: 'Invulnerability',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion confers immunity to nonmagical weapons. It also protects against attacks from creatures (not characters) with no magical properties or with fewer than 4 Hit Dice. Thus, an 8th-level character without a magical weapon could not harm the imbiber of an invulnerability potion. The potion also improves Armor Class rating by 2 classes and gives a bonus of +2 to the individual on his saving throws versus all forms of attack. Its effects are realized only when the entire potion is consumed, and they last for 5d4 rounds. Only warriors can use this potion. (Please also read the following from the Plo: C&T for situations on the battlefield.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion confers immunity to nonmagical weapons. It also protects against attacks from creatures (not characters) with no magical properties or with fewer than 4 Hit Dice. Thus, an 8th-level character without a magical weapon could not harm the imbiber of an invulnerability potion. The potion also improves Armor Class rating by 2 classes and gives a bonus of +2 to the individual on his saving throws versus all forms of attack. Its effects are realized only when the entire potion is consumed, and they last for 5d4 rounds. Only warriors can use this potion. (Please also read the following from the Plo: C&T for situations on the battlefield.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of invulnerability until the end of the encounter.',
      },
      '5e': {
        description: 'This potion confers immunity to nonmagical weapons. It also protects against attacks from creatures (not characters) with no magical properties or with fewer than 4 Hit Dice. Thus, an 8th-level character without a magical weapon could not harm the imbiber of an invulnerability potion. The potion also improves Armor Class rating by 2 classes and gives a bonus of +2 to the individual on his saving throws versus all forms of attack. Its effects are realized only when the entire potion is consumed, and they last for 5d4 rounds. Only warriors can use this potion. (Please also read the following from the Plo: C&T for situations on the battlefield.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-levitation',
    name: 'Levitation',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A levitation potion enables the consumer to levitate in much the same manner as the 2nd-level wizard spell of the same name. The potion allows levitation of the individual only, to a maximum weight of 600 pounds. The consumer can carry another person, as long as their total weight is within this limit.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'A levitation potion enables the consumer to levitate in much the same manner as the 2nd-level wizard spell of the same name. The potion allows levitation of the individual only, to a maximum weight of 600 pounds. The consumer can carry another person, as long as their total weight is within this limit.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain a fly speed of 4 (hover only) until the end of the encounter.',
      },
      '5e': {
        description: 'A levitation potion enables the consumer to levitate in much the same manner as the 2nd-level wizard spell of the same name. The potion allows levitation of the individual only, to a maximum weight of 600 pounds. The consumer can carry another person, as long as their total weight is within this limit.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-longevity',
    name: 'Longevity',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'The longevity potion reduces the character\'s age by 1d12 years, restoring youth and vigor. The entire potion must be consumed to achieve the desired result. It is also useful as a counter to magical or monster-based aging attacks. Each time one drinks a longevity potion, there is a 1% cumulative chance the effect will be the reverse of what the consumer wants--all age removed by previous drinks will be restored!',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'The longevity potion reduces the character\'s age by 1d12 years, restoring youth and vigor. The entire potion must be consumed to achieve the desired result. It is also useful as a counter to magical or monster-based aging attacks. Each time one drinks a longevity potion, there is a 1% cumulative chance the effect will be the reverse of what the consumer wants--all age removed by previous drinks will be restored!',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of longevity until the end of the encounter.',
      },
      '5e': {
        description: 'The longevity potion reduces the character\'s age by 1d12 years, restoring youth and vigor. The entire potion must be consumed to achieve the desired result. It is also useful as a counter to magical or monster-based aging attacks. Each time one drinks a longevity potion, there is a 1% cumulative chance the effect will be the reverse of what the consumer wants--all age removed by previous drinks will be restored!',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-master-thievery',
    name: 'Master Thievery',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion gives the thief a temporary increase in levels if he has fewer than 13 levels of experience. The number of levels gained depend on the thief\'s level, as shown below. Level of Levels Added Increase in each Imbiber bestowed hit dice skill 1st-3rd 5 5d6 +20% 4th-6th 4 4d6+1 +16% 7th-9th 3 3d6+2 +12% 10th-12th 2 2d6+3 +8% The thief acts as if he were at the experience level bestowed by the magic of the potion. Damage sustained is taken first from magically gained temporary extra hit points. So far as thieving skills are concerned, the potion affects these all equally by the increase shown. The effects of this potion last for 5d6 rounds.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion gives the thief a temporary increase in levels if he has fewer than 13 levels of experience. The number of levels gained depend on the thief\'s level, as shown below. Level of Levels Added Increase in each Imbiber bestowed hit dice skill 1st-3rd 5 5d6 +20% 4th-6th 4 4d6+1 +16% 7th-9th 3 3d6+2 +12% 10th-12th 2 2d6+3 +8% The thief acts as if he were at the experience level bestowed by the magic of the potion. Damage sustained is taken first from magically gained temporary extra hit points. So far as thieving skills are concerned, the potion affects these all equally by the increase shown. The effects of this potion last for 5d6 rounds.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of master thievery until the end of the encounter.',
      },
      '5e': {
        description: 'This potion gives the thief a temporary increase in levels if he has fewer than 13 levels of experience. The number of levels gained depend on the thief\'s level, as shown below. Level of Levels Added Increase in each Imbiber bestowed hit dice skill 1st-3rd 5 5d6 +20% 4th-6th 4 4d6+1 +16% 7th-9th 3 3d6+2 +12% 10th-12th 2 2d6+3 +8% The thief acts as if he were at the experience level bestowed by the magic of the potion. Damage sustained is taken first from magically gained temporary extra hit points. So far as thieving skills are concerned, the potion affects these all equally by the increase shown. The effects of this potion last for 5d6 rounds.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-murdock-s-insect-ward',
    name: 'Murdock\'s Insect Ward',
    category: 'Potion',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'This fragrance is a boon to travelers, since it repels insectoid creatures (both normal and monstrous) that come within 5 feet of the wearer of this fragrance. Insectoid monsters with Intelligence scores of 5 or more are allowed a saving throw vs. spell. If successful, they suffer no effects and may remain near the wearer without need of further saving throws. If the save is failed, the creature cannot approach within 5 feet of the wearer. (Note that this still may be close enough to cause harm.) One dose is effective for 1d3+1 hours.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This fragrance is a boon to travelers, since it repels insectoid creatures (both normal and monstrous) that come within 5 feet of the wearer of this fragrance. Insectoid monsters with Intelligence scores of 5 or more are allowed a saving throw vs. spell. If successful, they suffer no effects and may remain near the wearer without need of further saving throws. If the save is failed, the creature cannot approach within 5 feet of the wearer. (Note that this still may be close enough to cause harm.) One dose is effective for 1d3+1 hours.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of murdock\'s insect ward until the end of the encounter.',
      },
      '5e': {
        description: 'This fragrance is a boon to travelers, since it repels insectoid creatures (both normal and monstrous) that come within 5 feet of the wearer of this fragrance. Insectoid monsters with Intelligence scores of 5 or more are allowed a saving throw vs. spell. If successful, they suffer no effects and may remain near the wearer without need of further saving throws. If the save is failed, the creature cannot approach within 5 feet of the wearer. (Note that this still may be close enough to cause harm.) One dose is effective for 1d3+1 hours.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-acid-resistance',
    name: 'Oil of Acid Resistance',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'When this oil is applied to skin, cloth, or any other material, it confers virtual invulnerability against acid. The oil wears off, but slowly--one application lasts for a whole day (1440 rounds). Each time the protected material is exposed to acid, the duration of the oil is reduced by as many rounds as hit points of damage the acid would have caused to exposed flesh. Thus, if a black dragon breathes for 64 points of acid damage, a person protected by this oil would lose 1 hour and 4 minutes of protection (64 rounds--32 if a saving throw vs. breath weapon was successful). Each flask contains sufficient oil to protect one man-sized creature (and equipment) for 24 hours; or to protect any combination of creatures and duration between these extremes.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'When this oil is applied to skin, cloth, or any other material, it confers virtual invulnerability against acid. The oil wears off, but slowly--one application lasts for a whole day (1440 rounds). Each time the protected material is exposed to acid, the duration of the oil is reduced by as many rounds as hit points of damage the acid would have caused to exposed flesh. Thus, if a black dragon breathes for 64 points of acid damage, a person protected by this oil would lose 1 hour and 4 minutes of protection (64 rounds--32 if a saving throw vs. breath weapon was successful). Each flask contains sufficient oil to protect one man-sized creature (and equipment) for 24 hours; or to protect any combination of creatures and duration between these extremes.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of oil of acid resistance until the end of the encounter.',
      },
      '5e': {
        description: 'When this oil is applied to skin, cloth, or any other material, it confers virtual invulnerability against acid. The oil wears off, but slowly--one application lasts for a whole day (1440 rounds). Each time the protected material is exposed to acid, the duration of the oil is reduced by as many rounds as hit points of damage the acid would have caused to exposed flesh. Thus, if a black dragon breathes for 64 points of acid damage, a person protected by this oil would lose 1 hour and 4 minutes of protection (64 rounds--32 if a saving throw vs. breath weapon was successful). Each flask contains sufficient oil to protect one man-sized creature (and equipment) for 24 hours; or to protect any combination of creatures and duration between these extremes.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-disenchantment',
    name: 'Oil of Disenchantment',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This oi enables the removal of all enchantments and charms placed upon living things, and the suppression of such effects on objects. If the oil is rubbed in a creature, all enchantments and charms on it are immediately removed. If rubbed onto objects bearing an enchantment, the magic will be lost for 1d10 + 20 turns. After this time, the oil loses potency and the item regains its enchantment. The oil does not radiate magic once it is applied, and masks the enchantment of whatever it coats, so that an item so coated will not show any enchantment for as long as the oil remains effective.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This oi enables the removal of all enchantments and charms placed upon living things, and the suppression of such effects on objects. If the oil is rubbed in a creature, all enchantments and charms on it are immediately removed. If rubbed onto objects bearing an enchantment, the magic will be lost for 1d10 + 20 turns. After this time, the oil loses potency and the item regains its enchantment. The oil does not radiate magic once it is applied, and masks the enchantment of whatever it coats, so that an item so coated will not show any enchantment for as long as the oil remains effective.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of oil of disenchantment until the end of the encounter.',
      },
      '5e': {
        description: 'This oi enables the removal of all enchantments and charms placed upon living things, and the suppression of such effects on objects. If the oil is rubbed in a creature, all enchantments and charms on it are immediately removed. If rubbed onto objects bearing an enchantment, the magic will be lost for 1d10 + 20 turns. After this time, the oil loses potency and the item regains its enchantment. The oil does not radiate magic once it is applied, and masks the enchantment of whatever it coats, so that an item so coated will not show any enchantment for as long as the oil remains effective.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-elemental-invulnerability',
    name: 'Oil of Elemental Invulnerability',
    category: 'Potion',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'This precious substance gives total invulnerability to one type of normal elemental force on the Prime Material Plane: wind storms, fires, earth slides, floods, and so forth. There is a 10% chance that each such flask will also be effective on the appropriate Elemental plane-- this allows the protected individual to operate freely and without danger from elemental forces. Attacks by elemental creatures are still effective, but with a -1 penalty per die of damage. A flask contains enough oil to coat one man-sized creature for eight days or eight individuals for one day. The element protected against is determined randomly.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This precious substance gives total invulnerability to one type of normal elemental force on the Prime Material Plane: wind storms, fires, earth slides, floods, and so forth. There is a 10% chance that each such flask will also be effective on the appropriate Elemental plane-- this allows the protected individual to operate freely and without danger from elemental forces. Attacks by elemental creatures are still effective, but with a -1 penalty per die of damage. A flask contains enough oil to coat one man-sized creature for eight days or eight individuals for one day. The element protected against is determined randomly.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of oil of elemental invulnerability until the end of the encounter.',
      },
      '5e': {
        description: 'This precious substance gives total invulnerability to one type of normal elemental force on the Prime Material Plane: wind storms, fires, earth slides, floods, and so forth. There is a 10% chance that each such flask will also be effective on the appropriate Elemental plane-- this allows the protected individual to operate freely and without danger from elemental forces. Attacks by elemental creatures are still effective, but with a -1 penalty per die of damage. A flask contains enough oil to coat one man-sized creature for eight days or eight individuals for one day. The element protected against is determined randomly.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-water-oil-of-elemental-plane-invulnerability',
    name: 'Water Oil of Elemental Plane Invulnerability',
    category: 'Potion',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'These precious oils provide total invulnerability against the elemental forces on one inner plane, as well as offering the same protection as the oil of elemental invulnerability .',
        xpValue: 600,
        gpValue: 1200,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion shields the drinker with a protective magical ward.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Minor Action. You gain resist 10 to the specified damage type until the end of the encounter.',
      },
      '5e': {
        description: 'When you drink this potion, you gain resistance to the associated damage type for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-etherealness',
    name: 'Oil of Etherealness',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion is actually a light oil that is applied externally to clothes and exposed flesh, conferring etherealness. In the ethereal state, the individual can pass through solid objects in any direction-- sideways, upward, downward--or to different planes. The individual cannot touch non-ethereal objects. The oil takes effect three rounds after application, and it lasts for 4 + 1d4 turns unless removed with a weak acidic solution prior to the expiration of its normal effective duration. It can be applied to objects as well as creatures. One potion is sufficient to anoint a normal human and such gear as he typically carries (two or three weapons, garments, armor, shield, and miscellaneous gear). Ethereal individuals are invisible.',
        xpValue: 800,
        gpValue: 1600,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion is actually a light oil that is applied externally to clothes and exposed flesh, conferring etherealness. In the ethereal state, the individual can pass through solid objects in any direction-- sideways, upward, downward--or to different planes. The individual cannot touch non-ethereal objects. The oil takes effect three rounds after application, and it lasts for 4 + 1d4 turns unless removed with a weak acidic solution prior to the expiration of its normal effective duration. It can be applied to objects as well as creatures. One potion is sufficient to anoint a normal human and such gear as he typically carries (two or three weapons, garments, armor, shield, and miscellaneous gear). Ethereal individuals are invisible.',
        rarity: 'Rare',
        level: 14,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of oil of etherealness until the end of the encounter.',
      },
      '5e': {
        description: 'This potion is actually a light oil that is applied externally to clothes and exposed flesh, conferring etherealness. In the ethereal state, the individual can pass through solid objects in any direction-- sideways, upward, downward--or to different planes. The individual cannot touch non-ethereal objects. The oil takes effect three rounds after application, and it lasts for 4 + 1d4 turns unless removed with a weak acidic solution prior to the expiration of its normal effective duration. It can be applied to objects as well as creatures. One potion is sufficient to anoint a normal human and such gear as he typically carries (two or three weapons, garments, armor, shield, and miscellaneous gear). Ethereal individuals are invisible.',
        rarity: 'Rare',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-fiery-burning',
    name: 'Oil of Fiery Burning',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'When this oil is exposed to air, it immediately bursts into flame, inflicting 5d6 points of damage to any creature directly exposed to the substance (save vs. spell for half damage). If hurled, the flask will always break. Any creature within 10 feet of the point of impact (up to a maximum of six creatures) will be affected. The oil can, for instance, be used to consume the bodies of as many as six regenerating creatures, such as trolls. If the flask is opened, the creature holding it immediately suffers 1d4 points of damage. Unless a roll equal to or less than the creature\'s Dexterity is made on 2d10, the flask cannot be re-stoppered in time to prevent the oil from exploding, with effects as described above.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'When this oil is exposed to air, it immediately bursts into flame, inflicting 5d6 points of damage to any creature directly exposed to the substance (save vs. spell for half damage). If hurled, the flask will always break. Any creature within 10 feet of the point of impact (up to a maximum of six creatures) will be affected. The oil can, for instance, be used to consume the bodies of as many as six regenerating creatures, such as trolls. If the flask is opened, the creature holding it immediately suffers 1d4 points of damage. Unless a roll equal to or less than the creature\'s Dexterity is made on 2d10, the flask cannot be re-stoppered in time to prevent the oil from exploding, with effects as described above.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of oil of fiery burning until the end of the encounter.',
      },
      '5e': {
        description: 'When this oil is exposed to air, it immediately bursts into flame, inflicting 5d6 points of damage to any creature directly exposed to the substance (save vs. spell for half damage). If hurled, the flask will always break. Any creature within 10 feet of the point of impact (up to a maximum of six creatures) will be affected. The oil can, for instance, be used to consume the bodies of as many as six regenerating creatures, such as trolls. If the flask is opened, the creature holding it immediately suffers 1d4 points of damage. Unless a roll equal to or less than the creature\'s Dexterity is made on 2d10, the flask cannot be re-stoppered in time to prevent the oil from exploding, with effects as described above.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-fumbling',
    name: 'Oil of Fumbling',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This oi will seem to be of a useful type--acid resistance, slipperiness, etc.--until the wearer is under stress in an actual melee situation. At that point, he has a 50% chance each round to fumble and drop whatever he holds--weapon, shield, spell components, and so forth. Only a thorough bath of some solvent (alcohol, etc.) will remove the oil before it wears off.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This oi will seem to be of a useful type--acid resistance, slipperiness, etc.--until the wearer is under stress in an actual melee situation. At that point, he has a 50% chance each round to fumble and drop whatever he holds--weapon, shield, spell components, and so forth. Only a thorough bath of some solvent (alcohol, etc.) will remove the oil before it wears off.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain resist 10 to the specified damage type until the end of the encounter.',
      },
      '5e': {
        description: 'This oi will seem to be of a useful type--acid resistance, slipperiness, etc.--until the wearer is under stress in an actual melee situation. At that point, he has a 50% chance each round to fumble and drop whatever he holds--weapon, shield, spell components, and so forth. Only a thorough bath of some solvent (alcohol, etc.) will remove the oil before it wears off.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-impact',
    name: 'Oil of Impact',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This oi has beneficial effects on blunt weapons and missiles, both magical and nonmagical. When applied to a blunt weapon such as a club, hammer, or mace, it bestows a +3 bonus to attack rolls and a +6 bonus to damage. The effect lasts 1d4 + 8 rounds per application. One application will treat one weapon. When applied to a blunt missile, such as a hurled hammer, hurled club, sling stone, or bullet, it bestows a +3 bonus to attack rolls and a +3 bonus to damage. The effect last until the missile is used once. One application will treat 4-5 sling stones or two larger weapons. A flask of oil of impact holds 1d3+2 applications.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This oi has beneficial effects on blunt weapons and missiles, both magical and nonmagical. When applied to a blunt weapon such as a club, hammer, or mace, it bestows a +3 bonus to attack rolls and a +6 bonus to damage. The effect lasts 1d4 + 8 rounds per application. One application will treat one weapon. When applied to a blunt missile, such as a hurled hammer, hurled club, sling stone, or bullet, it bestows a +3 bonus to attack rolls and a +3 bonus to damage. The effect last until the missile is used once. One application will treat 4-5 sling stones or two larger weapons. A flask of oil of impact holds 1d3+2 applications.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of oil of impact until the end of the encounter.',
      },
      '5e': {
        description: 'This oi has beneficial effects on blunt weapons and missiles, both magical and nonmagical. When applied to a blunt weapon such as a club, hammer, or mace, it bestows a +3 bonus to attack rolls and a +6 bonus to damage. The effect lasts 1d4 + 8 rounds per application. One application will treat one weapon. When applied to a blunt missile, such as a hurled hammer, hurled club, sling stone, or bullet, it bestows a +3 bonus to attack rolls and a +3 bonus to damage. The effect last until the missile is used once. One application will treat 4-5 sling stones or two larger weapons. A flask of oil of impact holds 1d3+2 applications.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-preservation',
    name: 'Oil of Preservation',
    category: 'Potion',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'Any nonliving, non- magical object may be coated with a layer of oil of preservation. If every surface of the object is covered, it will suffer no ill effects from the passage of time. Thus, wood will not rot, metal will not rust, and masonry will not crumble. The oil provides protection from both natural and magical aging. One flask of oil of preservation will protect 1 cubic foot of surface area. The effects of the oil wear off after one century, at which time normal aging resumes.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'Any nonliving, non- magical object may be coated with a layer of oil of preservation. If every surface of the object is covered, it will suffer no ill effects from the passage of time. Thus, wood will not rot, metal will not rust, and masonry will not crumble. The oil provides protection from both natural and magical aging. One flask of oil of preservation will protect 1 cubic foot of surface area. The effects of the oil wear off after one century, at which time normal aging resumes.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of oil of preservation until the end of the encounter.',
      },
      '5e': {
        description: 'Any nonliving, non- magical object may be coated with a layer of oil of preservation. If every surface of the object is covered, it will suffer no ill effects from the passage of time. Thus, wood will not rot, metal will not rust, and masonry will not crumble. The oil provides protection from both natural and magical aging. One flask of oil of preservation will protect 1 cubic foot of surface area. The effects of the oil wear off after one century, at which time normal aging resumes.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-slickness',
    name: 'Oil of Slickness',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'The consistency of this magical substance is variable; sometimes it is found as a small vial of very viscous oil, sometimes as a pot of thin, creamy white salve. It is applied by rubbing into the skin o the hands (taking one round). When rubbed in, it improves the speed and coordination of the hands so that all manually-based thieving skills (pick pockets, open locks, find/remove traps) are improved by 10%. A vial or pot of this oil (or salve) usually contains 1d4+4 applications. The effect lasts for 1d4+4 turns. The bonuses to the ability scores cannot be claimed by any thief who is wearing gauntlets or gloves of any kind, including magical ones!',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'The consistency of this magical substance is variable; sometimes it is found as a small vial of very viscous oil, sometimes as a pot of thin, creamy white salve. It is applied by rubbing into the skin o the hands (taking one round). When rubbed in, it improves the speed and coordination of the hands so that all manually-based thieving skills (pick pockets, open locks, find/remove traps) are improved by 10%. A vial or pot of this oil (or salve) usually contains 1d4+4 applications. The effect lasts for 1d4+4 turns. The bonuses to the ability scores cannot be claimed by any thief who is wearing gauntlets or gloves of any kind, including magical ones!',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of oil of slickness until the end of the encounter.',
      },
      '5e': {
        description: 'The consistency of this magical substance is variable; sometimes it is found as a small vial of very viscous oil, sometimes as a pot of thin, creamy white salve. It is applied by rubbing into the skin o the hands (taking one round). When rubbed in, it improves the speed and coordination of the hands so that all manually-based thieving skills (pick pockets, open locks, find/remove traps) are improved by 10%. A vial or pot of this oil (or salve) usually contains 1d4+4 applications. The effect lasts for 1d4+4 turns. The bonuses to the ability scores cannot be claimed by any thief who is wearing gauntlets or gloves of any kind, including magical ones!',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-slipperiness',
    name: 'Oil of Slipperiness',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'Similar to the oil of etherealness described above, this liquid is to be applied externally. This application makes it impossible for the individual to be grabbed, grasped, or hugged by any opponent, or constricted by snakes or tentacles.',
        xpValue: 800,
        gpValue: 1600,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'Similar to the oil of etherealness described above, this liquid is to be applied externally. This application makes it impossible for the individual to be grabbed, grasped, or hugged by any opponent, or constricted by snakes or tentacles.',
        rarity: 'Rare',
        level: 14,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of oil of slipperiness until the end of the encounter.',
      },
      '5e': {
        description: 'Similar to the oil of etherealness described above, this liquid is to be applied externally. This application makes it impossible for the individual to be grabbed, grasped, or hugged by any opponent, or constricted by snakes or tentacles.',
        rarity: 'Rare',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-timelessness',
    name: 'Oil of Timelessness',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'When this oil is applied to any matter that was once alive (leather, leaves, paper, wood, dead flesh, etc.), it allows that substance to resist the passage of time. Each year of actual time affects the substance as if only a day had passed. The coated object has a +1 bonus on all saving throws. The oil never wears off, although it can be magically removed. One flask contains enough oil to coat eight mansized objects, or an equivalent area.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'When this oil is applied to any matter that was once alive (leather, leaves, paper, wood, dead flesh, etc.), it allows that substance to resist the passage of time. Each year of actual time affects the substance as if only a day had passed. The coated object has a +1 bonus on all saving throws. The oil never wears off, although it can be magically removed. One flask contains enough oil to coat eight mansized objects, or an equivalent area.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain resist 10 to the specified damage type until the end of the encounter.',
      },
      '5e': {
        description: 'When this oil is applied to any matter that was once alive (leather, leaves, paper, wood, dead flesh, etc.), it allows that substance to resist the passage of time. Each year of actual time affects the substance as if only a day had passed. The coated object has a +1 bonus on all saving throws. The oil never wears off, although it can be magically removed. One flask contains enough oil to coat eight mansized objects, or an equivalent area.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-pebble-flesh',
    name: 'Pebble Flesh',
    category: 'Potion',
    source: 'TcBbH',
    editions: {
      '2e': {
        description: 'The user rubs his entire body with this greasy potion before he goes to sleep. When he awakens, his skin has become rough and lumpy as if it were made of pebbles, and colored a dull green. The pebble flesh improves the user\'s natural Armor Class by +4; a human\' from 10 to 6. The effect is cumulative; a human with pebble flesh wearing leather armor has an effective AC of 4. Pebble flesh lasts for 1-4 Weeks. Because of pebble flesh\'s rough texture and odd appearance, the user also suffers the following penal ties : f � His movement rate is reduced by 1/3. � He cannot swim. The extra weight of the pebble flesh pulls him down, as if he were wearing metal armor. � His Dexterity and Charisma checks are made at a -2 penalty. � He is vulnerable to stone shpe and any other spells that affect stone. (Stone to flesh negates pebble flesh, causing the skin to revert to its normal form.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'The user rubs his entire body with this greasy potion before he goes to sleep. When he awakens, his skin has become rough and lumpy as if it were made of pebbles, and colored a dull green. The pebble flesh improves the user\'s natural Armor Class by +4; a human\' from 10 to 6. The effect is cumulative; a human with pebble flesh wearing leather armor has an effective AC of 4. Pebble flesh lasts for 1-4 Weeks. Because of pebble flesh\'s rough texture and odd appearance, the user also suffers the following penal ties : f � His movement rate is reduced by 1/3. � He cannot swim. The extra weight of the pebble flesh pulls him down, as if he were wearing metal armor. � His Dexterity and Charisma checks are made at a -2 penalty. � He is vulnerable to stone shpe and any other spells that affect stone. (Stone to flesh negates pebble flesh, causing the skin to revert to its normal form.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of pebble flesh until the end of the encounter.',
      },
      '5e': {
        description: 'The user rubs his entire body with this greasy potion before he goes to sleep. When he awakens, his skin has become rough and lumpy as if it were made of pebbles, and colored a dull green. The pebble flesh improves the user\'s natural Armor Class by +4; a human\' from 10 to 6. The effect is cumulative; a human with pebble flesh wearing leather armor has an effective AC of 4. Pebble flesh lasts for 1-4 Weeks. Because of pebble flesh\'s rough texture and odd appearance, the user also suffers the following penal ties : f � His movement rate is reduced by 1/3. � He cannot swim. The extra weight of the pebble flesh pulls him down, as if he were wearing metal armor. � His Dexterity and Charisma checks are made at a -2 penalty. � He is vulnerable to stone shpe and any other spells that affect stone. (Stone to flesh negates pebble flesh, causing the skin to revert to its normal form.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-perception',
    name: 'Perception',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This enhances the senses of the imbiber to a great degree, with numerous effects: (i) A thief gains a 10% bonus to his open locks and remove traps skills. (ii) A thief gains a 20% bonus to his find traps and hear noise skills.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This enhances the senses of the imbiber to a great degree, with numerous effects: (i) A thief gains a 10% bonus to his open locks and remove traps skills. (ii) A thief gains a 20% bonus to his find traps and hear noise skills.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of perception until the end of the encounter.',
      },
      '5e': {
        description: 'This enhances the senses of the imbiber to a great degree, with numerous effects: (i) A thief gains a 10% bonus to their open locks and remove traps skills. (ii) A thief gains a 20% bonus to their find traps and hear noise skills.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-philter-of-glibness',
    name: 'Philter of Glibness',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion enables the imbiber to speak fluently--even tell lies--smoothly, believably, and undetectably. Magical investigation (such as the 4thlevel priest spell, detect lie) will not give the usual results, b will reveal that some minor "stretching of the truth\' might be occurring.',
        xpValue: 250,
        gpValue: 500,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion enables the imbiber to speak fluently--even tell lies--smoothly, believably, and undetectably. Magical investigation (such as the 4thlevel priest spell, detect lie) will not give the usual results, b will reveal that some minor "stretching of the truth\' might be occurring.',
        rarity: 'Common',
        level: 3,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of philter of glibness until the end of the encounter.',
      },
      '5e': {
        description: 'This potion enables the imbiber to speak fluently--even tell lies--smoothly, believably, and undetectably. Magical investigation (such as the 4thlevel priest spell, detect lie) will not give the usual results, b will reveal that some minor "stretching of the truth\' might be occurring.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-philter-of-love',
    name: 'Philter of Love',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion causes the individual drinking it to become charmed (see charm spells) with the first creature seen after consuming the draught. The imbiber may actually become enamored if the creature is of similar race and of the opposite sex. Charm effects wear off in 1d4+4 turns, but the enamoring effects last until a dispel magic spell is cast upon the individual.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion causes the individual drinking it to become charmed (see charm spells) with the first creature seen after consuming the draught. The imbiber may actually become enamored if the creature is of similar race and of the opposite sex. Charm effects wear off in 1d4+4 turns, but the enamoring effects last until a dispel magic spell is cast upon the individual.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of philter of love until the end of the encounter.',
      },
      '5e': {
        description: 'This potion causes the individual drinking it to become charmed (see charm spells) with the first creature seen after consuming the draught. The imbiber may actually become enamored if the creature is of similar race and of the opposite sex. Charm effects wear off in 1d4+4 turns, but the enamoring effects last until a dispel magic spell is cast upon the individual.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-philter-of-persuasiveness',
    name: 'Philter of Persuasiveness',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'When this potion is imbibed the individual becomes more charismatic, gaining a bonus of +5 on reaction dice rolls. The individual is also able to suggest (see the 3rd-level wizard spell, suggestion) once per turn to all creatures within 30 yards of him.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'When this potion is imbibed the individual becomes more charismatic, gaining a bonus of +5 on reaction dice rolls. The individual is also able to suggest (see the 3rd-level wizard spell, suggestion) once per turn to all creatures within 30 yards of him.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of philter of persuasiveness until the end of the encounter.',
      },
      '5e': {
        description: 'When this potion is imbibed the individual becomes more charismatic, gaining a bonus of +5 on reaction dice rolls. The individual is also able to suggest (see the 3rd-level wizard spell, suggestion) once per turn to all creatures within 30 yards of him.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-philter-of-stammering-and-stuttering',
    name: 'Philter of Stammering and Stuttering',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'When this liquid is consumed, it will seem to be beneficial—philter of glibness or persuasiveness, for instance.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'When this liquid is consumed, it will seem to be beneficial—philter of glibness or persuasiveness, for instance.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of philter of stammering and stuttering until the end of the encounter.',
      },
      '5e': {
        description: 'When this liquid is consumed, it will seem to be beneficial—philter of glibness or persuasiveness, for instance.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-potion-of-plant-health',
    name: 'Potion of Plant Health',
    category: 'Potion',
    source: 'TcDrH',
    editions: {
      '2e': {
        description: 'This potion vitalizes a living plant when poured upon its roots. It cures the plant\'s illnesses and keeps it free from natural parasites and disease for a year. During this time, the plant grows 50% better than normal, and 10% better than normal the next year. Edible fruit, berries, or sap from the plant taste unusually succulent, while flowering plants bloom exceptionally well. If a vegetable monster such as a treant or shambling mound drinks this potion, treat it as a potion of extra-healing.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion vitalizes a living plant when poured upon its roots. It cures the plant\'s illnesses and keeps it free from natural parasites and disease for a year. During this time, the plant grows 50% better than normal, and 10% better than normal the next year. Edible fruit, berries, or sap from the plant taste unusually succulent, while flowering plants bloom exceptionally well. If a vegetable monster such as a treant or shambling mound drinks this potion, treat it as a potion of extra-healing.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of potion of plant health until the end of the encounter.',
      },
      '5e': {
        description: 'This potion vitalizes a living plant when poured upon its roots. It cures the plant\'s illnesses and keeps it free from natural parasites and disease for a year. During this time, the plant grows 50% better than normal, and 10% better than normal the next year. Edible fruit, berries, or sap from the plant taste unusually succulent, while flowering plants bloom exceptionally well. If a vegetable monster such as a treant or shambling mound drinks this potion, treat it as a potion of extra-healing.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-plant-control',
    name: 'Plant Control',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A plant control potion enables the individual who consumes it to influence the behavior of vegetable life forms. This includes normal plants, fungi, and even molds and shambling mounds—within the parameters of their normal abilities.',
        xpValue: 600,
        gpValue: 1200,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion gives the drinker mental dominion over creatures of a specific type.',
        rarity: 'Uncommon',
        level: 10,
        powerText: 'Power (Consumable): Minor Action. You dominate one creature of the appropriate type (level 10 or lower) within 10 squares until the end of the encounter (save ends).',
      },
      '5e': {
        description: 'When you drink this potion, you can cast a charm or dominate effect on creatures of the associated type for 1 hour.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-poison',
    name: 'Poison',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A poison potion is simply a highly toxic liquid in a potion flask. Typically, poison potions are odorless and can be of any color. Ingestion, introduction of the poison through a break in the skin, or, in some cases, just skin contact, will cause death. Poison can be weak (+4 to +1 bonus to the saving throw), average, or deadly (-1 to -4 penalty or greater on the saving throw). Some poison can be so toxic that a neutralize poison spell will simply lower the toxicity level by 40%--say, from a -4 penalty to a +4 bonus to the saving throw vs. poison. The DM selects the strength of poison desired, although most are strength "J\'\' (see Table 51, Poison Strength). You might wish to allow characters to hurl poison flasks (see Combat, "Grenade-Like Missiles").',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'A poison potion is simply a highly toxic liquid in a potion flask. Typically, poison potions are odorless and can be of any color. Ingestion, introduction of the poison through a break in the skin, or, in some cases, just skin contact, will cause death. Poison can be weak (+4 to +1 bonus to the saving throw), average, or deadly (-1 to -4 penalty or greater on the saving throw). Some poison can be so toxic that a neutralize poison spell will simply lower the toxicity level by 40%--say, from a -4 penalty to a +4 bonus to the saving throw vs. poison. The DM selects the strength of poison desired, although most are strength "J\'\' (see Table 51, Poison Strength). You might wish to allow characters to hurl poison flasks (see Combat, "Grenade-Like Missiles").',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. The drinker takes 3d6 poison damage and is dazed (save ends).',
      },
      '5e': {
        description: 'This liquid looks, smells, and tastes like a beneficial potion but is actually a deadly poison. You must make a DC 13 Constitution saving throw or take 3d6 poison damage.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-polymorph-self',
    name: 'Polymorph Self',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion duplicates the effects of the 4th-level wizard spell of the same name.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion duplicates the effects of the 4th-level wizard spell of the same name.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of polymorph self until the end of the encounter.',
      },
      '5e': {
        description: 'This potion duplicates the effects of the 4th-level wizard spell of the same name.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-rainbow-hues',
    name: 'Rainbow Hues',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This rather syrupy potion must be stored in a metallic container. The imbiber can become any hue or combination of hues desired at will.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This rather syrupy potion must be stored in a metallic container. The imbiber can become any hue or combination of hues desired at will.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of rainbow hues until the end of the encounter.',
      },
      '5e': {
        description: 'This rather syrupy potion must be stored in a metallic container. The imbiber can become any hue or combination of hues desired at will.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-sap-of-the-eldest-tree',
    name: 'Sap of the Eldest Tree',
    category: 'Potion',
    source: 'TcDrH',
    editions: {
      '2e': {
        description: 'Usually found in an earthen flask, this potion resembles thick corn or maple syrup. Characters who drink the sap (or bake it in a cake and eat it) will not age a day for the next 10 years! However, unlike a longevity potion, it does not make the drinker any younger. A person must consume the entire potion to gain the full benefit; if five characters share the syrup, each stops aging for two years. Additional doses are not cumulative--later imbibings supplant earlier ones.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'Usually found in an earthen flask, this potion resembles thick corn or maple syrup. Characters who drink the sap (or bake it in a cake and eat it) will not age a day for the next 10 years! However, unlike a longevity potion, it does not make the drinker any younger. A person must consume the entire potion to gain the full benefit; if five characters share the syrup, each stops aging for two years. Additional doses are not cumulative--later imbibings supplant earlier ones.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of sap of the eldest tree until the end of the encounter.',
      },
      '5e': {
        description: 'Usually found in an earthen flask, this potion resembles thick corn or maple syrup. Characters who drink the sap (or bake it in a cake and eat it) will not age a day for the next 10 years! However, unlike a longevity potion, it does not make the drinker any younger. A person must consume the entire potion to gain the full benefit; if five characters share the syrup, each stops aging for two years. Additional doses are not cumulative--later imbibings supplant earlier ones.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-sleep-breathing',
    name: 'Sleep Breathing',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion allows the imbiber to breathe a colorless, odorless cloud of sleep-inducing gas up to three times within an hour after drinking it. This cloud is effectively a 20\' x 20\' x 20\' cube. Within the cloud, creatures are affected as if struck by a sleep spell, the effects of which are exactly duplicated by the cloud. If the thief does not breathe out a cloud in this way within an hour after drinking the potion, he must save versus spells or fall into a deep, comatose sleep himself for 1d4+4 turns. This potion is obviously of great value for the thief in dealing with numbers of low-level and peripheral guards when he is trespassing, breaking and entering, etc.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion allows the imbiber to breathe a colorless, odorless cloud of sleep-inducing gas up to three times within an hour after drinking it. This cloud is effectively a 20\' x 20\' x 20\' cube. Within the cloud, creatures are affected as if struck by a sleep spell, the effects of which are exactly duplicated by the cloud. If the thief does not breathe out a cloud in this way within an hour after drinking the potion, he must save versus spells or fall into a deep, comatose sleep himself for 1d4+4 turns. This potion is obviously of great value for the thief in dealing with numbers of low-level and peripheral guards when he is trespassing, breaking and entering, etc.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of sleep breathing until the end of the encounter.',
      },
      '5e': {
        description: 'This potion allows the imbiber to breathe a colorless, odorless cloud of sleep-inducing gas up to three times within an hour after drinking it. This cloud is effectively a 20\' x 20\' x 20\' cube. Within the cloud, creatures are affected as if struck by a sleep spell, the effects of which are exactly duplicated by the cloud. If the thief does not breathe out a cloud in this way within an hour after drinking the potion, he must save versus spells or fall into a deep, comatose sleep himself for 1d4+4 turns. This potion is obviously of great value for the thief in dealing with numbers of low-level and peripheral guards when he is trespassing, breaking and entering, etc.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-speed',
    name: 'Speed',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A potion of speed increases the movement and combat capabilities of the imbiber by 100%. Thus, a movement rate of 9 becomes 18, and a character normally able to attack once per round attacks twice. This does not reduce spellcasting time, however. Use of a speed potion ages the individual by one year. The aging is permanent, but the other effects last for 5d4 rounds.',
        xpValue: 500,
        gpValue: 1000,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'A potion of speed increases the movement and combat capabilities of the imbiber by 100%. Thus, a movement rate of 9 becomes 18, and a character normally able to attack once per round attacks twice. This does not reduce spellcasting time, however. Use of a speed potion ages the individual by one year. The aging is permanent, but the other effects last for 5d4 rounds.',
        rarity: 'Uncommon',
        level: 8,
        powerText: 'Power (Consumable): Minor Action. You gain a +2 power bonus to speed and can take an extra move action each turn until the end of the encounter.',
      },
      '5e': {
        description: 'A potion of speed increases the movement and combat capabilities of the imbiber by 100%. Thus, a movement rate of 9 becomes 18, and a character normally able to attack once per round attacks twice. This does not reduce spellcasting time, however. Use of a speed potion ages the individual by one year. The aging is permanent, but the other effects last for 5d4 rounds.',
        rarity: 'Uncommon',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-starella-s-aphrodisiac',
    name: 'Starella\'s Aphrodisiac',
    category: 'Potion',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'Any creature of a similar race and opposite sex who approaches within 5 feet of the wearer becomes thoroughly enamored with the wearer as if under the effect of a powerful charm. Potential victims are allowed a saving throw vs. spell. If the roll is successful, the victim suffers no effects and may remain near the wearer without need of further saving throws. If the save is failed, the creature is charmed as long as he or she remains within 5\' of the wearer (as long as the aphrodisiac is still potent) plus 2d4 turns outside that area. An affected creature regards the wearer as a trusted friend, ally, and romantic interest to be heeded and protected. The charmed individual does not behave as if he were a mindless automaton, but any word or action of the wearer is viewed in the most favorable way. This attitude does not extend to others, and it is possible for the person so enamored to be overcome by jealousy, viewing all others (especially other victims) as potential rivals. When a dose of Starella\'s aphrodisiac is worn, it remains potent for 3d4 turns. After this time, the perfume evaporates and another dose must be applied if the wearer wishes to renew the effect.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'Any creature of a similar race and opposite sex who approaches within 5 feet of the wearer becomes thoroughly enamored with the wearer as if under the effect of a powerful charm. Potential victims are allowed a saving throw vs. spell. If the roll is successful, the victim suffers no effects and may remain near the wearer without need of further saving throws. If the save is failed, the creature is charmed as long as he or she remains within 5\' of the wearer (as long as the aphrodisiac is still potent) plus 2d4 turns outside that area. An affected creature regards the wearer as a trusted friend, ally, and romantic interest to be heeded and protected. The charmed individual does not behave as if he were a mindless automaton, but any word or action of the wearer is viewed in the most favorable way. This attitude does not extend to others, and it is possible for the person so enamored to be overcome by jealousy, viewing all others (especially other victims) as potential rivals. When a dose of Starella\'s aphrodisiac is worn, it remains potent for 3d4 turns. After this time, the perfume evaporates and another dose must be applied if the wearer wishes to renew the effect.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of starella\'s aphrodisiac until the end of the encounter.',
      },
      '5e': {
        description: 'Any creature of a similar race and opposite sex who approaches within 5 feet of the wearer becomes thoroughly enamored with the wearer as if under the effect of a powerful charm. Potential victims are allowed a saving throw vs. spell. If the roll is successful, the victim suffers no effects and may remain near the wearer without need of further saving throws. If the save is failed, the creature is charmed as long as he or she remains within 5\' of the wearer (as long as the aphrodisiac is still potent) plus 2d4 turns outside that area. An affected creature regards the wearer as a trusted friend, ally, and romantic interest to be heeded and protected. The charmed individual does not behave as if he were a mindless automaton, but any word or action of the wearer is viewed in the most favorable way. This attitude does not extend to others, and it is possible for the person so enamored to be overcome by jealousy, viewing all others (especially other victims) as potential rivals. When a dose of Starella\'s aphrodisiac is worn, it remains potent for 3d4 turns. After this time, the perfume evaporates and another dose must be applied if the wearer wishes to renew the effect.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-sweet-water',
    name: 'Sweet Water',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This liquid is not actually a potion to be drunk (though i tastes good). Sweet water is added to other liquids in order to change them to pure, drinkable water. It will neutralize poison and ruin magical potions (no saving throw). The contents of a single container will change up to 100,000 cubic feet of polluted, salt, or alkaline water to fresh water. It will turn to 1,000 cubic feet of acid into pure water. The effects of the potion are permanent, but the liquid may be contaminated after an initial period of 5d4 rounds.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This liquid is not actually a potion to be drunk (though i tastes good). Sweet water is added to other liquids in order to change them to pure, drinkable water. It will neutralize poison and ruin magical potions (no saving throw). The contents of a single container will change up to 100,000 cubic feet of polluted, salt, or alkaline water to fresh water. It will turn to 1,000 cubic feet of acid into pure water. The effects of the potion are permanent, but the liquid may be contaminated after an initial period of 5d4 rounds.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. The drinker takes 3d6 poison damage and is dazed (save ends).',
      },
      '5e': {
        description: 'This liquid is not actually a potion to be drunk (though i tastes good). Sweet water is added to other liquids in order to change them to pure, drinkable water. It will neutralize poison and ruin magical potions (no saving throw). The contents of a single container will change up to 100,000 cubic feet of polluted, salt, or alkaline water to fresh water. It will turn to 1,000 cubic feet of acid into pure water. The effects of the potion are permanent, but the liquid may be contaminated after an initial period of 5d4 rounds.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-oil-of-tempering',
    name: 'Oil of tempering',
    category: 'Potion',
    source: 'TcPaH',
    editions: {
      '2e': {
        description: 'When this oil is applied to entire suit of chain or other metallic armor, the armor\'s AC is improved by 1 for 24 hours; for example, chain mail armor (AC 5) will have an effective AC of 4. The AC can\'t be improved beyond AC 0. It takes 1-2 hours to completely coat a suit of armor with oil of tempering.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'When this oil is applied to entire suit of chain or other metallic armor, the armor\'s AC is improved by 1 for 24 hours; for example, chain mail armor (AC 5) will have an effective AC of 4. The AC can\'t be improved beyond AC 0. It takes 1-2 hours to completely coat a suit of armor with oil of tempering.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of oil of tempering until the end of the encounter.',
      },
      '5e': {
        description: 'When this oil is applied to entire suit of chain or other metallic armor, the armor\'s AC is improved by 1 for 24 hours; for example, chain mail armor (AC 5) will have an effective AC of 4. The AC can\'t be improved beyond AC 0. It takes 1-2 hours to completely coat a suit of armor with oil of tempering.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-thievery',
    name: 'Thievery',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'Similar to, but weaker than, the potion of master thievery, this potion also grants the thief drinking temporary increases in levels, hit dice, and skills, he is of 9th or lower level prior to drinking it, as shown below. Level of Levels Added Increase Imbiber bestowed hit dice in each 1st-3rd 3 3d6 skill 4th-6th 2 2d6+1 +12% 7th-9th 1 1d6+2 +8% +4% As with the potion of master thievery, the individual acts in all respects as a thief of the hig level gained after drinking the potion, with the increase in thieving skills being equally spread across all categories by the bonus shown. Damage sustained is taken from additional temporary hit points gained first. The effects of the potion last f 1d4+4 turns.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'Similar to, but weaker than, the potion of master thievery, this potion also grants the thief drinking temporary increases in levels, hit dice, and skills, he is of 9th or lower level prior to drinking it, as shown below. Level of Levels Added Increase Imbiber bestowed hit dice in each 1st-3rd 3 3d6 skill 4th-6th 2 2d6+1 +12% 7th-9th 1 1d6+2 +8% +4% As with the potion of master thievery, the individual acts in all respects as a thief of the hig level gained after drinking the potion, with the increase in thieving skills being equally spread across all categories by the bonus shown. Damage sustained is taken from additional temporary hit points gained first. The effects of the potion last f 1d4+4 turns.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of thievery until the end of the encounter.',
      },
      '5e': {
        description: 'Similar to, but weaker than, the potion of master thievery, this potion also grants the thief drinking temporary increases in levels, hit dice, and skills, he is of 9th or lower level prior to drinking it, as shown below. Level of Levels Added Increase Imbiber bestowed hit dice in each 1st-3rd 3 3d6 skill 4th-6th 2 2d6+1 +12% 7th-9th 1 1d6+2 +8% +4% As with the potion of master thievery, the individual acts in all respects as a thief of the hig level gained after drinking the potion, with the increase in thieving skills being equally spread across all categories by the bonus shown. Damage sustained is taken from additional temporary hit points gained first. The effects of the potion last f 1d4+4 turns.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-treasure-finding',
    name: 'Treasure Finding',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A potion of treasure finding empowers the drinker with a location sense, so that he can point to the direction of the nearest mass of treasure. The treasure must be within 240 yards, and its mass must equal metal of at least 10,000 copper pieces or 100 gems or any combination. Note that only valuable metals (copper, silver, electrum, gold, platinum, etc.) and gems (and jewelry, of course) are located. The potion won\'t locate worthless metals or magical items which don\'t contain precious metals or gems. The imbiber t of the potion can "feel\'\' the direction in which the treasure lies, but not its distance. Intervening substances other than special magical wards or lead-lined walls will not withstand the powers that the liquor bestows upon the individual. The effects of the potion last for 5d4 rounds. up (Clever players will attempt triangulation.)',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'A potion of treasure finding empowers the drinker with a location sense, so that he can point to the direction of the nearest mass of treasure. The treasure must be within 240 yards, and its mass must equal metal of at least 10,000 copper pieces or 100 gems or any combination. Note that only valuable metals (copper, silver, electrum, gold, platinum, etc.) and gems (and jewelry, of course) are located. The potion won\'t locate worthless metals or magical items which don\'t contain precious metals or gems. The imbiber t of the potion can "feel\'\' the direction in which the treasure lies, but not its distance. Intervening substances other than special magical wards or lead-lined walls will not withstand the powers that the liquor bestows upon the individual. The effects of the potion last for 5d4 rounds. up (Clever players will attempt triangulation.)',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of treasure finding until the end of the encounter.',
      },
      '5e': {
        description: 'A potion of treasure finding empowers the drinker with a location sense, so that he can point to the direction of the nearest mass of treasure. The treasure must be within 240 yards, and its mass must equal metal of at least 10,000 copper pieces or 100 gems or any combination. Note that only valuable metals (copper, silver, electrum, gold, platinum, etc.) and gems (and jewelry, of course) are located. The potion won\'t locate worthless metals or magical items which don\'t contain precious metals or gems. The imbiber t of the potion can "feel\'\' the direction in which the treasure lies, but not its distance. Intervening substances other than special magical wards or lead-lined walls will not withstand the powers that the liquor bestows upon the individual. The effects of the potion last for 5d4 rounds. up (Clever players will attempt triangulation.)',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-undead-control',
    name: 'Undead Control',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion in effect gives the imbiber the ability to charm certain ghasts, ghosts, ghouls, shadows, skeletons, spectres, wights, wraiths, vampires, and zombies. The charm ability is similar to the 1st- level wizard spell, charm person. It affects a maximum of 16 Hit Dice of undead, rounding down any hit point additions to the lowest die (e.g., 4 + 1 equals 4 Hit Dice). The undead are entitled to saving throws vs. spell only if they have intelligence. Saving throws are rolled with -2 penalties due to the power of the potion; the effects wear off in 5d4 rounds.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion in effect gives the imbiber the ability to charm certain ghasts, ghosts, ghouls, shadows, skeletons, spectres, wights, wraiths, vampires, and zombies. The charm ability is similar to the 1st- level wizard spell, charm person. It affects a maximum of 16 Hit Dice of undead, rounding down any hit point additions to the lowest die (e.g., 4 + 1 equals 4 Hit Dice). The undead are entitled to saving throws vs. spell only if they have intelligence. Saving throws are rolled with -2 penalties due to the power of the potion; the effects wear off in 5d4 rounds.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of undead control until the end of the encounter.',
      },
      '5e': {
        description: 'This potion in effect gives the imbiber the ability to charm certain ghasts, ghosts, ghouls, shadows, skeletons, spectres, wights, wraiths, vampires, and zombies. The charm ability is similar to the 1st- level wizard spell, charm person. It affects a maximum of 16 Hit Dice of undead, rounding down any hit point additions to the lowest die (e.g., 4 + 1 equals 4 Hit Dice). The undead are entitled to saving throws vs. spell only if they have intelligence. Saving throws are rolled with -2 penalties due to the power of the potion; the effects wear off in 5d4 rounds.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-zombies-ventriloquism',
    name: 'Zombies Ventriloquism',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This allows the user to make his voice sound as if it (or someone\'s voice or a similar sound) were issuing from someplace other than where he is—from another creature, a statue, from behind a door, down a passage, etc.',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This allows the user to make his voice sound as if it (or someone\'s voice or a similar sound) were issuing from someplace other than where he is—from another creature, a statue, from behind a door, down a passage, etc.',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of zombies ventriloquism until the end of the encounter.',
      },
      '5e': {
        description: 'This allows the user to make their voice sound as if it (or someone\'s voice or a similar sound) were issuing from someplace other than where he is—from another creature, a statue, from behind a door, down a passage, etc.',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-vitality',
    name: 'Vitality',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potion restores the user to full vitality despi exertion, lack of sleep, and going without food and drink for up to seven days. It will nullify up to seven days of deprivation, and will continue in effect for the remainder of its seven-day duration. The potion also makes the user proof against poison and disease while it is in effect, and the user will recover lost hit points at the rate of 1 every 4 hour (Please also read the following form the DMs Option: High level campaign.) Potion of Vitality (DMs Option High Level Campaign): A character drinking this potion increases his body\'s natural healing ability to the rate of one hit point recovered even/ four hours. Damage that cannot be healed by magical means-such as from a sword of wounding -is restored. Damage that can be healed only by magical means-such as wounds from a chasme tanar\'ri\'s claws or the fists of a clay golem-is not restored',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'This potion restores the user to full vitality despi exertion, lack of sleep, and going without food and drink for up to seven days. It will nullify up to seven days of deprivation, and will continue in effect for the remainder of its seven-day duration. The potion also makes the user proof against poison and disease while it is in effect, and the user will recover lost hit points at the rate of 1 every 4 hour (Please also read the following form the DMs Option: High level campaign.) Potion of Vitality (DMs Option High Level Campaign): A character drinking this potion increases his body\'s natural healing ability to the rate of one hit point recovered even/ four hours. Damage that cannot be healed by magical means-such as from a sword of wounding -is restored. Damage that can be healed only by magical means-such as wounds from a chasme tanar\'ri\'s claws or the fists of a clay golem-is not restored',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You gain the benefits of vitality until the end of the encounter.',
      },
      '5e': {
        description: 'This potion restores the user to full vitality despi exertion, lack of sleep, and going without food and drink for up to seven days. It will nullify up to seven days of deprivation, and will continue in effect for the remainder of its seven-day duration. The potion also makes the user proof against poison and disease while it is in effect, and the user will recover lost hit points at the rate of 1 every 4 hour (Please also read the following form the DMs Option: High level campaign.) Potion of Vitality (DMs Option High Level Campaign): A character drinking this potion increases his body\'s natural healing ability to the rate of one hit point recovered even/ four hours. Damage that cannot be healed by magical means-such as from a sword of wounding -is restored. Damage that can be healed only by magical means-such as wounds from a chasme tanar\'ri\'s claws or the fists of a clay golem-is not restored',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
  {
    id: 'potion-water-breathing',
    name: 'Water Breathing',
    category: 'Potion',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'Water Walk Weather Prediction Wind Servant Zone of Sweet Air 7th Level Age Dragon Animate Rock I Antimineral Shell Astral Spell Breath of Life Changestaff Chariot of Sustarre Confusion Conjure Air or Water Elemental tal Conjure Earth Elemental Control Weather Create Crypt Thing Creeping Doom Divine Inspiration Earthquake Exaction Fire Storm Gate Holy Word Hovering Road Illusory Fortifications Impervious Sanctity of Mind Mind Tracker Regenerate Reincarnate Restoration Resurrection Shadow Engines Spacewarp Spirit of Power* Succor Sunray Symbol Tentacle Walls Timelessness Transmute Metal to Wood Tree Spirit Dust Tsunami s Uncontrolled Weather Unwilling Wood Wind Walk',
        xpValue: 350,
        gpValue: 700,
        duration: '4+1d4 turns',
      },
      '4e': {
        description: 'Water Walk Weather Prediction Wind Servant Zone of Sweet Air 7th Level Age Dragon Animate Rock I Antimineral Shell Astral Spell Breath of Life Changestaff Chariot of Sustarre Confusion Conjure Air or Water Elemental tal Conjure Earth Elemental Control Weather Create Crypt Thing Creeping Doom Divine Inspiration Earthquake Exaction Fire Storm Gate Holy Word Hovering Road Illusory Fortifications Impervious Sanctity of Mind Mind Tracker Regenerate Reincarnate Restoration Resurrection Shadow Engines Spacewarp Spirit of Power* Succor Sunray Symbol Tentacle Walls Timelessness Transmute Metal to Wood Tree Spirit Dust Tsunami s Uncontrolled Weather Unwilling Wood Wind Walk',
        rarity: 'Common',
        level: 5,
        powerText: 'Power (Consumable): Minor Action. You can breathe underwater until the end of the encounter.',
      },
      '5e': {
        description: 'Water Walk Weather Prediction Wind Servant Zone of Sweet Air 7th Level Age Dragon Animate Rock I Antimineral Shell Astral Spell Breath of Life Changestaff Chariot of Sustarre Confusion Conjure Air or Water Elemental tal Conjure Earth Elemental Control Weather Create Crypt Thing Creeping Doom Divine Inspiration Earthquake Exaction Fire Storm Gate Holy Word Hovering Road Illusory Fortifications Impervious Sanctity of Mind Mind Tracker Regenerate Reincarnate Restoration Resurrection Shadow Engines Spacewarp Spirit of Power* Succor Sunray Symbol Tentacle Walls Timelessness Transmute Metal to Wood Tree Spirit Dust Tsunami s Uncontrolled Weather Unwilling Wood Wind Walk',
        rarity: 'Common',
        duration: '1 hour',
      },
    },
  },
];
