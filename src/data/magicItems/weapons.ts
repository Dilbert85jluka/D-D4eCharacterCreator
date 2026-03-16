import type { MagicItemData } from '../../types/magicItem';

/** Weapons */
export const weapons: MagicItemData[] = [
  {
    id: 'weapon-vorpal-sword',
    name: 'Vorpal Sword',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'Similar but superior to a sword of sharpness, a vorpal weapon has a +3 bonus to attack and damage rolls. On a modified attack roll high enough, the vorpal blade severs the neck/head of the opponent. Normal/armored opponents require a modified score of 20-23 to sever, larger than man-sized require 21-23, and solid metal or stone require 22-23 (considering only the sword\'s bonus of +3). Note that many creatures have no heads or can change their form and, therefore, cannot suffer decapitation. There are also creatures that have heads but will not necessarily be killed by decapitation (among these are dopplegangers, elementals, and golems). As with the sword of sharpness, the properties of a vorpal blade override the critical hit procedure. If the wielder rolls an 18 or higher that meets the criteria for a critical hit without invoking the vorpal power, a normal critical hit results.',
      },
      '4e': {
        description: 'Similar but superior to a sword of sharpness, a vorpal weapon has extraordinary cutting power. On a critical hit, the vorpal blade can sever the head of a foe, slaying it instantly if it has a head and can be killed by decapitation.',
        rarity: 'Very Rare',
        level: 25,
        slot: 'Weapon',
        powerText: 'Property: You gain a +5 enhancement bonus to attack and damage rolls with this weapon. Critical: +5d12 extra damage. Power (Daily): Free Action. Trigger: You score a critical hit with this weapon against a creature that has a head. Effect: The target is slain (no saving throw). Creatures without heads, or that can survive decapitation, are instead stunned (save ends).',
      },
      '5e': {
        description: 'Similar but superior to a sword of sharpness, a vorpal weapon has extraordinary cutting power. When you roll a 20 on an attack roll with this weapon against a creature that has at least one head, you cut off one of the creature\'s heads. A creature that can survive without the severed head is not slain. A creature is immune to this effect if it has no head, has legendary actions, or the DM decides that the creature is too big for its head to be cut off.',
        rarity: 'Legendary',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-arrow-of-extended-range',
    name: 'Arrow of Extended Range',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'There are three versions of this arrow, which allow the user to double, triple, or even quadruple the normal ranges for any type of bow. The first version, which allows double range, is encountered about 60% of the time. The triple- range version is found about 30% of the time, and the quadruple-range arrow is chanced upon only 10% of the time. Although these arrows do not have an attack bonus, they are effective against creatures who are e immune to all but magical weapons (up to +1). In s addition, these arrows cancel out the normal range modifiers of the bow being used, using instead the modified, multiplied range for purposes of figuring modifiers. These arrows are usually found in bunches of 2d10. Furthermore, if they miss their target, these arrows break only 25% of the time. If a magical elven arrow hits its target, it will be destroyed 75% of the time. Otherwise, it can be used repeatedly until it finally destroyed. (Please also read the entry at the beginning of the chapter concerning elvish weapons. Elvish weapons are very rare.)',
      },
      '4e': {
        description: 'There are three versions of this arrow, which allow the user to double, triple, or even quadruple the normal ranges for any type of bow. The first version, which allows double range, is encountered about 60% of the time. The triple- range version is found about 30% of the time, and the quadruple-range arrow is chanced upon only 10% of the time. Although these arrows do not have an attack bonus, they are effective against creatures who are e immune to all but magical weapons (up to +1). In s addition, these arrows cancel out the normal range modifiers of the bow being used, using instead the modified, multiplied range for purposes of figuring modifiers. These arrows are usually found in bunches of 2d10. Furthermore, if they miss their target, these arrows break only 25% of the time. If a magical elven arrow hits its target, it will be destroyed 75% of the time. Otherwise, it can be used repeatedly until it finally destroyed. (Please also read the entry at the beginning of the chapter concerning elvish weapons. Elvish weapons are very rare.)',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'There are three versions of this arrow, which allow the user to double, triple, or even quadruple the normal ranges for any type of bow. The first version, which allows double range, is encountered about 60% of the time. The triple- range version is found about 30% of the time, and the quadruple-range arrow is chanced upon only 10% of the time. Although these arrows do not have an attack bonus, they are effective against creatures who are e immune to all but magical weapons (up to +1). In s addition, these arrows cancel out the normal range modifiers of the bow being used, using instead the modified, multiplied range for purposes of figuring modifiers. These arrows are usually found in bunches of 2d10. Furthermore, if they miss their target, these arrows break only 25% of the time. If a magical elven arrow hits its target, it will be destroyed 75% of the time. Otherwise, it can be used repeatedly until it finally destroyed. (Please also read the entry at the beginning of the chapter concerning elvish weapons. Elvish weapons are very rare.)',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-arrow-of-seeking',
    name: 'Arrow of Seeking',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This is a more powerful version of an arrow imbued with the seeking spell. Not only does it round corners in pursuit of its prey, it also gains a bonus of +2 damage. These arrows are usually found in groups of 1d10, although sometimes as many as 2d8 can be found. Furthermore, if they miss their target, these arrows break only 25% of the time. If a magical elven arrow hits its target, it will be destroyed 75% of th time. Otherwise, it can be used repeatedly until it i finally destroyed. (Please also read the entry at the beginning of the chapter concerning elvish weapons. Elvish weapons are very rare.)',
      },
      '4e': {
        description: 'This is a more powerful version of an arrow imbued with the seeking spell. Not only does it round corners in pursuit of its prey, it also gains a bonus of +2 damage. These arrows are usually found in groups of 1d10, although sometimes as many as 2d8 can be found. Furthermore, if they miss their target, these arrows break only 25% of the time. If a magical elven arrow hits its target, it will be destroyed 75% of th time. Otherwise, it can be used repeatedly until it i finally destroyed. (Please also read the entry at the beginning of the chapter concerning elvish weapons. Elvish weapons are very rare.)',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This is a more powerful version of an arrow imbued with the seeking spell. Not only does it round corners in pursuit of its prey, it also gains a bonus of +2 damage. These arrows are usually found in groups of 1d10, although sometimes as many as 2d8 can be found. Furthermore, if they miss their target, these arrows break only 25% of the time. If a magical elven arrow hits its target, it will be destroyed 75% of th time. Otherwise, it can be used repeatedly until it i finally destroyed. (Please also read the entry at the beginning of the chapter concerning elvish weapons. Elvish weapons are very rare.)',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-arrow-of-slaying',
    name: 'Arrow of Slaying',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This is an arrow +3 with unusual physical characteristics-- a shaft of some special material, feathers of some rare creature, a head of some strange design, a rune carved on the nock, etc. These characteristics indicate the arrow is effective against some creature type. If the arrow is employed against the kind of creature it has been enchanted to slay, the missile will kill it instantly if it hits the target creature following list comprises only a portion of the possible kinds of these arrows: 1. Arachnids 11. Illusionists 2. Avians 12. Mages 3. Bards 13. Mammals 4. Clerics 14. Paladins 5. Dragons 15. Rangers 6. Druids 16. Reptile 7. Elementals 17. Sea monsters 8. Fighters 18. Thieves 9. Giants 19. Titans 10. Golems 20. Undead Develop your own types and modify or limit the foregoing as fits your campaign.',
      },
      '4e': {
        description: 'This is an arrow +3 with unusual physical characteristics-- a shaft of some special material, feathers of some rare creature, a head of some strange design, a rune carved on the nock, etc. These characteristics indicate the arrow is effective against some creature type. If the arrow is employed against the kind of creature it has been enchanted to slay, the missile will kill it instantly if it hits the target creature following list comprises only a portion of the possible kinds of these arrows: 1. Arachnids 11. Illusionists 2. Avians 12. Mages 3. Bards 13. Mammals 4. Clerics 14. Paladins 5. Dragons 15. Rangers 6. Druids 16. Reptile 7. Elementals 17. Sea monsters 8. Fighters 18. Thieves 9. Giants 19. Titans 10. Golems 20. Undead Develop your own types and modify or limit the foregoing as fits your campaign.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This is an arrow +3 with unusual physical characteristics-- a shaft of some special material, feathers of some rare creature, a head of some strange design, a rune carved on the nock, etc. These characteristics indicate the arrow is effective against some creature type. If the arrow is employed against the kind of creature it has been enchanted to slay, the missile will kill it instantly if it hits the target creature following list comprises only a portion of the possible kinds of these arrows: 1. Arachnids 11. Illusionists 2. Avians 12. Mages 3. Bards 13. Mammals 4. Clerics 14. Paladins 5. Dragons 15. Rangers 6. Druids 16. Reptile 7. Elementals 17. Sea monsters 8. Fighters 18. Thieves 9. Giants 19. Titans 10. Golems 20. Undead Develop your own types and modify or limit the foregoing as fits your campaign.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-wooden-arrow',
    name: 'Wooden Arrow',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This is a totally organic arrow. Made completely from wood and carved with ornate runes, it appears as nothing more than a novelty, or perhaps a woodcarver\'s doodle. In reality, this arrow is a most dangerous weapon, and it radiates strong enchantment magic. This weapon completely ignores all nonorganic armor. Thus, metal armor offers no protection against this missile, while leather, hide, and scale mail made from a creature\'s skin offer their normal bonus. Studded leather protects only as leather is armor. Those wearing metal armor are considered to be AC 10 against this arrow. Magical protection still applies; thus, plate mail +4, although normally AC �1, would instead be only AC 6 against the wooden arrow. These arrows are never found in bunches. If encountered, there will be but a single shaft. Furthermore, the wooden arrow is an exception to elven arrows in that it will always be destroyed when fired, regardless of whether it hits. The wood necessary to the enchantment is such that it can function no other way. e Furthermore, if they miss their target, these arrows s break only 25% of the time. If a magical elven arrow hits its target, it will be destroyed 75% of the time. Otherwise, it can be used repeatedly until it is finally destroyed. (Please also read the entry at the beginning of the chapter concerning elvish weapons. Elvish weapons are very rare.',
      },
      '4e': {
        description: 'This is a totally organic arrow. Made completely from wood and carved with ornate runes, it appears as nothing more than a novelty, or perhaps a woodcarver\'s doodle. In reality, this arrow is a most dangerous weapon, and it radiates strong enchantment magic. This weapon completely ignores all nonorganic armor. Thus, metal armor offers no protection against this missile, while leather, hide, and scale mail made from a creature\'s skin offer their normal bonus. Studded leather protects only as leather is armor. Those wearing metal armor are considered to be AC 10 against this arrow. Magical protection still applies; thus, plate mail +4, although normally AC �1, would instead be only AC 6 against the wooden arrow. These arrows are never found in bunches. If encountered, there will be but a single shaft. Furthermore, the wooden arrow is an exception to elven arrows in that it will always be destroyed when fired, regardless of whether it hits. The wood necessary to the enchantment is such that it can function no other way. e Furthermore, if they miss their target, these arrows s break only 25% of the time. If a magical elven arrow hits its target, it will be destroyed 75% of the time. Otherwise, it can be used repeatedly until it is finally destroyed. (Please also read the entry at the beginning of the chapter concerning elvish weapons. Elvish weapons are very rare.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This is a totally organic arrow. Made completely from wood and carved with ornate runes, it appears as nothing more than a novelty, or perhaps a woodcarver\'s doodle. In reality, this arrow is a most dangerous weapon, and it radiates strong enchantment magic. This weapon completely ignores all nonorganic armor. Thus, metal armor offers no protection against this missile, while leather, hide, and scale mail made from a creature\'s skin offer their normal bonus. Studded leather protects only as leather is armor. Those wearing metal armor are considered to be AC 10 against this arrow. Magical protection still applies; thus, plate mail +4, although normally AC �1, would instead be only AC 6 against the wooden arrow. These arrows are never found in bunches. If encountered, there will be but a single shaft. Furthermore, the wooden arrow is an exception to elven arrows in that it will always be destroyed when fired, regardless of whether it hits. The wood necessary to the enchantment is such that it can function no other way. e Furthermore, if they miss their target, these arrows s break only 25% of the time. If a magical elven arrow hits its target, it will be destroyed 75% of the time. Otherwise, it can be used repeatedly until it is finally destroyed. (Please also read the entry at the beginning of the chapter concerning elvish weapons. Elvish weapons are very rare.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-axe-of-hurling',
    name: 'Axe of Hurling',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This . The appears to be a normal hand axe. With familiarity and practice, however, the possessor will eventually discover that the axe can be hurled up to 180 feet, and it will return to the thrower in the same round whether or not it scores a hit. Damage inflicted by the magical throwing attack is twice normal (2d6 vs. S or M, 2d4 vs. L), with the weapon\'s magical bonus added thereafter. (For example, an axe of hurling +3 will inflict 2d6+3 points of damage vs. S- or M-sized creatures and 2d4+3 points of damage vs. creatures of size L if it hits the target after being thrown.) The axe will cause only normal damage (plus its magical bonus) when used as a hand-held weapon. After each week of using the weapon, the possessor has a one-in-eight chance of discovering the full properties of the weapon. In any event, the magical properties of the weapon will be fully known to the possessor after eight full weeks of such familiarization. The magical bonus of an axe of hurling is determined by referring to the table below: D20 Roll Magical XP Value 1-5 Bonus 1,500 6-10 +1 3,000 11-15 +2 4,500 16-19 +3 6,000 20 +4 7,500 +5 Bow +1',
      },
      '4e': {
        description: 'This . The appears to be a normal hand axe. With familiarity and practice, however, the possessor will eventually discover that the axe can be hurled up to 180 feet, and it will return to the thrower in the same round whether or not it scores a hit. Damage inflicted by the magical throwing attack is twice normal (2d6 vs. S or M, 2d4 vs. L), with the weapon\'s magical bonus added thereafter. (For example, an axe of hurling +3 will inflict 2d6+3 points of damage vs. S- or M-sized creatures and 2d4+3 points of damage vs. creatures of size L if it hits the target after being thrown.) The axe will cause only normal damage (plus its magical bonus) when used as a hand-held weapon. After each week of using the weapon, the possessor has a one-in-eight chance of discovering the full properties of the weapon. In any event, the magical properties of the weapon will be fully known to the possessor after eight full weeks of such familiarization. The magical bonus of an axe of hurling is determined by referring to the table below: D20 Roll Magical XP Value 1-5 Bonus 1,500 6-10 +1 3,000 11-15 +2 4,500 16-19 +3 6,000 20 +4 7,500 +5 Bow +1',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This . The appears to be a normal hand axe. With familiarity and practice, however, the possessor will eventually discover that the axe can be hurled up to 180 feet, and it will return to the thrower in the same round whether or not it scores a hit. Damage inflicted by the magical throwing attack is twice normal (2d6 vs. S or M, 2d4 vs. L), with the weapon\'s magical bonus added thereafter. (For example, an axe of hurling +3 will inflict 2d6+3 points of damage vs. S- or M-sized creatures and 2d4+3 points of damage vs. creatures of size L if it hits the target after being thrown.) The axe will cause only normal damage (plus its magical bonus) when used as a hand-held weapon. After each week of using the weapon, the possessor has a one-in-eight chance of discovering the full properties of the weapon. In any event, the magical properties of the weapon will be fully known to the possessor after eight full weeks of such familiarization. The magical bonus of an axe of hurling is determined by referring to the table below: D20 Roll Magical XP Value 1-5 Bonus 1,500 6-10 +1 3,000 11-15 +2 4,500 16-19 +3 6,000 20 +4 7,500 +5 Bow +1',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-crossbow-of-angling',
    name: 'Crossbow of Angling',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This appears to be a quite normal light crossbow, although it has a thick wrist strap attached which is of unusual design and toughness. On command it can fire bolts with special properties up to three times per day. The magical bolt fired counts as a +2 bolt for determination of attack rolls (and damage if appropriate). When fired, this special bolt is trailed by a pencil-thin snaking line of fain blue light (which radiates magic fairly strongly) which connects it to the crossbow. When the bolt impacts, the head expands into a small claw which embeds itself in the target, such that the bolt grips strongly. By the use of a second command word the crossbow user can "reel in" the target, the thin "cord" of magical energy shrinking to drag the target to the archer. The speed at which the target is retrieved depends on its weight, friction, etc.; the maximum speed is 60 feet per round. The DM may need to exercise his judgement in most cases. If the target is heavier than the archer or is immovable or braced in some way, then the crossbowman may actually be dragged to the target rather than the reverse applying. This can be exploited, of course, to pull a thief up to a ceiling or up a wall. The magical cord is AC -2 and takes 15 points of damage (nonmagical weapons do no damage) to destroy.',
      },
      '4e': {
        description: 'This appears to be a quite normal light crossbow, although it has a thick wrist strap attached which is of unusual design and toughness. On command it can fire bolts with special properties up to three times per day. The magical bolt fired counts as a +2 bolt for determination of attack rolls (and damage if appropriate). When fired, this special bolt is trailed by a pencil-thin snaking line of fain blue light (which radiates magic fairly strongly) which connects it to the crossbow. When the bolt impacts, the head expands into a small claw which embeds itself in the target, such that the bolt grips strongly. By the use of a second command word the crossbow user can "reel in" the target, the thin "cord" of magical energy shrinking to drag the target to the archer. The speed at which the target is retrieved depends on its weight, friction, etc.; the maximum speed is 60 feet per round. The DM may need to exercise his judgement in most cases. If the target is heavier than the archer or is immovable or braced in some way, then the crossbowman may actually be dragged to the target rather than the reverse applying. This can be exploited, of course, to pull a thief up to a ceiling or up a wall. The magical cord is AC -2 and takes 15 points of damage (nonmagical weapons do no damage) to destroy.',
        rarity: 'Common',
        level: 3,
        slot: 'Weapon',
        powerText: 'Property: You gain a +1 enhancement bonus to attack and damage rolls with this weapon. Critical: +1d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 1d6 damage.',
      },
      '5e': {
        description: 'This appears to be a quite normal light crossbow, although it has a thick wrist strap attached which is of unusual design and toughness. On command it can fire bolts with special properties up to three times per day. The magical bolt fired counts as a +2 bolt for determination of attack rolls (and damage if appropriate). When fired, this special bolt is trailed by a pencil-thin snaking line of fain blue light (which radiates magic fairly strongly) which connects it to the crossbow. When the bolt impacts, the head expands into a small claw which embeds itself in the target, such that the bolt grips strongly. By the use of a second command word the crossbow user can "reel in" the target, the thin "cord" of magical energy shrinking to drag the target to the archer. The speed at which the target is retrieved depends on its weight, friction, etc.; the maximum speed is 60 feet per round. The DM may need to exercise his judgement in most cases. If the target is heavier than the archer or is immovable or braced in some way, then the crossbowman may actually be dragged to the target rather than the reverse applying. This can be exploited, of course, to pull a thief up to a ceiling or up a wall. The magical cord is AC -2 and takes 15 points of damage (nonmagical weapons do no damage) to destroy.',
        rarity: 'Common',
      },
    },
  },
  {
    id: 'weapon-crossbow-of-distance',
    name: 'Crossbow of Distance',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This has double range in all categories. About 10% of these weapons will be heavy crossbows. This weapon is otherwise +1 bonus to attack and damage rolls.',
      },
      '4e': {
        description: 'This has double range in all categories. About 10% of these weapons will be heavy crossbows.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This has double range in all categories. About 10% of these weapons will be heavy crossbows. This weapon is otherwise +1 bonus to attack and damage rolls.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-crossbow-of-speed',
    name: 'Crossbow of Speed',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This item allows its possessor to double the rate of fire normal for the weapon. If it is grasped, the crossbow of speed will automatically cock itself. In surprise situations it is of no help. Otherwise, it allows first fire in any melee round, and end-of- t round fire also, when applicable. About 10% of these weapons are heavy crossbows. The weapon has a +1 bonus to attack and damage rolls.',
      },
      '4e': {
        description: 'This item allows its possessor to double the rate of fire normal for the weapon. If it is grasped, the crossbow of speed will automatically cock itself. In surprise situations it is of no help. Otherwise, it allows first fire in any melee round, and end-of- t round fire also, when applicable. About 10% of these weapons are heavy crossbows. The weapon has a +1 bonus to attack and damage rolls.',
        rarity: 'Uncommon',
        level: 8,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This item allows its possessor to double the rate of fire normal for the weapon. If it is grasped, the crossbow of speed will automatically cock itself. In surprise situations it is of no help. Otherwise, it allows first fire in any melee round, and end-of- t round fire also, when applicable. About 10% of these weapons are heavy crossbows. The weapon has a +1 bonus to attack and damage rolls.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-longtooth',
    name: 'Longtooth',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This appears to be a normal weapon, or perhaps a nonspecial magical weapon.',
      },
      '4e': {
        description: 'This appears to be a normal weapon, or perhaps a nonspecial magical weapon.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This appears to be a normal weapon, or perhaps a nonspecial magical weapon.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-dagger-of-impaling',
    name: 'Dagger of Impaling',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'These daggers are +2 to hit and damage, and on a natural roll of 20 (and also of 19 if this is sufficient to score a hit) on a backstab attack they impale the target, inflicting an additional 1d4+2/1d3+2 points of damage and also staying in the wound, where they cause an additional 1d4+2/1d3+2 points of damage each round until removed.',
      },
      '4e': {
        description: 'These daggers are +2 to hit and damage, and on a natural roll of 20 (and also of 19 if this is sufficient to score a hit) on a backstab attack they impale the target, inflicting an additional 1d4+2/1d3+2 points of damage and also staying in the wound, where they cause an additional 1d4+2/1d3+2 points of damage each round until removed.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'These daggers are +2 to hit and damage, and on a natural roll of 20 (and also of 19 if this is sufficient to score a hit) on a backstab attack they impale the target, inflicting an additional 1d4+2/1d3+2 points of damage and also staying in the wound, where they cause an additional 1d4+2/1d3+2 points of damage each round until removed.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-dagger-of-resource',
    name: 'Dagger of Resource',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'These daggers usually have handles of ebony or ivory, or some similarly valuable and exotic substance, and have 1d3+1 small studs in the cross guards. The dagger has attack and damage bonuses, but it also has additional tools located within it, and depressing one of the studs will cause the corresponding item to spring from the hilt of the dagger, ready for use (only one tool at a time can be used). These bonuses and tools depend on the number of studs in the weapon, as shown below: No. Hit/ of damage Tools Description studs bonus avail. of tools 2 +4 2 Lock picks adding +5% to Open Locks rolls, plus tool for removing stones from horses hooves\' 3 +3 3 As above, plus Lens of Detection (see DMG p.173) 4 +2 4 As above, plus Gem of Brightness with 3d10 charges',
      },
      '4e': {
        description: 'These daggers usually have handles of ebony or ivory, or some similarly valuable and exotic substance, and have 1d3+1 small studs in the cross guards. The dagger has attack and damage bonuses, but it also has additional tools located within it, and depressing one of the studs will cause the corresponding item to spring from the hilt of the dagger, ready for use (only one tool at a time can be used). These bonuses and tools depend on the number of studs in the weapon, as shown below: No. Hit/ of damage Tools Description studs bonus avail. of tools 2 +4 2 Lock picks adding +5% to Open Locks rolls, plus tool for removing stones from horses hooves\' 3 +3 3 As above, plus Lens of Detection (see DMG p.173) 4 +2 4 As above, plus Gem of Brightness with 3d10 charges',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'These daggers usually have handles of ebony or ivory, or some similarly valuable and exotic substance, and have 1d3+1 small studs in the cross guards. The dagger has attack and damage bonuses, but it also has additional tools located within it, and depressing one of the studs will cause the corresponding item to spring from the hilt of the dagger, ready for use (only one tool at a time can be used). These bonuses and tools depend on the number of studs in the weapon, as shown below: No. Hit/ of damage Tools Description studs bonus avail. of tools 2 +4 2 Lock picks adding +5% to Open Locks rolls, plus tool for removing stones from horses hooves\' 3 +3 3 As above, plus Lens of Detection (see DMG p.173) 4 +2 4 As above, plus Gem of Brightness with 3d10 charges',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-dagger-of-sounding',
    name: 'Dagger of Sounding',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This oddly-designed dagger is +1 for attack and damage determination, but it has a peculiar, hollow bronze bulb at the end of its pommel. If this is gently tapped against a hollow surface, it gives a resounding ring quite different from the dull tone emitted if struck against solid stone. Tapping it gently against walls allows the thief a 5 in 6 chance for finding a secret door, rising to 11 in 12 if the thief is elven or half-elven. Also, the thief can search for secret doors at twice the normal rate when using this dagger. In other cases, the thief is 80% likely to be able to determine successfully the approximate thickness and nature of the material the dagger is used to sound.',
      },
      '4e': {
        description: 'This oddly-designed dagger is +1 for attack and damage determination, but it has a peculiar, hollow bronze bulb at the end of its pommel. If this is gently tapped against a hollow surface, it gives a resounding ring quite different from the dull tone emitted if struck against solid stone. Tapping it gently against walls allows the thief a 5 in 6 chance for finding a secret door, rising to 11 in 12 if the thief is elven or half-elven. Also, the thief can search for secret doors at twice the normal rate when using this dagger. In other cases, the thief is 80% likely to be able to determine successfully the approximate thickness and nature of the material the dagger is used to sound.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This oddly-designed dagger is +1 for attack and damage determination, but it has a peculiar, hollow bronze bulb at the end of its pommel. If this is gently tapped against a hollow surface, it gives a resounding ring quite different from the dull tone emitted if struck against solid stone. Tapping it gently against walls allows the thief a 5 in 6 chance for finding a secret door, rising to 11 in 12 if the thief is elven or half-elven. Also, the thief can search for secret doors at twice the normal rate when using this dagger. In other cases, the thief is 80% likely to be able to determine successfully the approximate thickness and nature of the material the dagger is used to sound.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-dagger-of-throwing',
    name: 'Dagger of Throwing',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This appears to be a normal weapon but will radiate strongly of magic when this is checked for. The balance of this sturdy blade is perfect, such that when it is thrown by anyone, the dagger will demonstrate superb characteristics as a ranged weapon. The magic of the dagger enables it to be hurled up to 180 feet. A successful hit when it is thrown will inflict twice normal dagger damage, plus the bonus provided by the blade, which will range from +1 to +4. To determine the bonus for a specific dagger, roll percentile dice and consult the following table: D100 Magical XP Value 01-35 Roll Bonus 250 36-65 +1 350 66-90 +2 450 91-00 +3 550 +4',
      },
      '4e': {
        description: 'This appears to be a normal weapon but will radiate strongly of magic when this is checked for. The balance of this sturdy blade is perfect, such that when it is thrown by anyone, the dagger will demonstrate superb characteristics as a ranged weapon. The magic of the dagger enables it to be hurled up to 180 feet. A successful hit when it is thrown will inflict twice normal dagger damage, plus the bonus provided by the blade, which will range from +1 to +4. To determine the bonus for a specific dagger, roll percentile dice and consult the following table: D100 Magical XP Value 01-35 Roll Bonus 250 36-65 +1 350 66-90 +2 450 91-00 +3 550 +4',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This appears to be a normal weapon but will radiate strongly of magic when this is checked for. The balance of this sturdy blade is perfect, such that when it is thrown by anyone, the dagger will demonstrate superb characteristics as a ranged weapon. The magic of the dagger enables it to be hurled up to 180 feet. A successful hit when it is thrown will inflict twice normal dagger damage, plus the bonus provided by the blade, which will range from +1 to +4. To determine the bonus for a specific dagger, roll percentile dice and consult the following table: D100 Magical XP Value 01-35 Roll Bonus 250 36-65 +1 350 66-90 +2 450 91-00 +3 550 +4',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-dagger-of-venom',
    name: 'Dagger of Venom',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This appears to be a standard dagger +1, but its hilt holds a hidden store of poison. Any hit on a roll of 20 injects fatal poison into the opponent unless a saving throw vs. poison is successful. The dagger of venom holds up to six doses of poison. If the hilt contains fewer than six doses, the owner can pour more in up to the maximum. (Use of this weapon by good--particularly lawful good--characters must be carefully monitored for effects on alignment.)',
      },
      '4e': {
        description: 'This appears to be a standard dagger +1, but its hilt holds a hidden store of poison. Any hit on a roll of 20 injects fatal poison into the opponent unless a saving throw vs. poison is successful. The dagger of venom holds up to six doses of poison. If the hilt contains fewer than six doses, the owner can pour more in up to the maximum. (Use of this weapon by good--particularly lawful good--characters must be carefully monitored for effects on alignment.)',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This appears to be a standard dagger +1, but its hilt holds a hidden store of poison. Any hit on a roll of 20 injects fatal poison into the opponent unless a saving throw vs. poison is successful. The dagger of venom holds up to six doses of poison. If the hilt contains fewer than six doses, the owner can pour more in up to the maximum. (Use of this weapon by good--particularly lawful good--characters must be carefully monitored for effects on alignment.)',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-darts-of-homing',
    name: 'Darts of Homing',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'These appear to be normal projectiles, but are actually +3 magical weapons. If a dart hits the intended target, it will magically return to the thrower in the same round and can be re-used. A dart inflicts a base 1d6 points of damage plus its magical bonus on a successful hit against any size creature (4-9 points total). A dart that misses its target loses its magical power. These weapons have twice the range of ordinary darts--20 yards short, 40 yards medium, 80 yards long.',
      },
      '4e': {
        description: 'These appear to be normal projectiles, but are actually +3 magical weapons. If a dart hits the intended target, it will magically return to the thrower in the same round and can be re-used. A dart inflicts a base 1d6 points of damage plus its magical bonus on a successful hit against any size creature (4-9 points total). A dart that misses its target loses its magical power. These weapons have twice the range of ordinary darts--20 yards short, 40 yards medium, 80 yards long.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'These appear to be normal projectiles, but are actually +3 magical weapons. If a dart hits the intended target, it will magically return to the thrower in the same round and can be re-used. A dart inflicts a base 1d6 points of damage plus its magical bonus on a successful hit against any size creature (4-9 points total). A dart that misses its target loses its magical power. These weapons have twice the range of ordinary darts--20 yards short, 40 yards medium, 80 yards long.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-dwarven-thrower',
    name: 'Dwarven Thrower',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This appears to be a standard hammer +2. In the hands of a dwarven fighter who knows the appropriate command word, its full potential is realized.',
      },
      '4e': {
        description: 'This appears to be a standard hammer +2. In the hands of a dwarven fighter who knows the appropriate command word, its full potential is realized.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This appears to be a standard hammer +2. In the hands of a dwarven fighter who knows the appropriate command word, its full potential is realized.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-hammer-of-thunderbolts',
    name: 'Hammer of Thunderbolts',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This appears to be a large, extra-heavy hammer. A character less than 6 feet tall and with Strength less than 18/01 will find it too unbalanced to wield properly in combat. However, a character of sufficient Strength and size will find that the hammer functions with a +3 bonus and gains double damage dice on any hit. If the wielder wears a girdle of giant strength and gauntlets of ogre power and he knows the hammer\'s true name, the weapon can be used to full effect: When swung or hurled it gains a +5 bonus, double damage dice, all girdle and gauntlet bonuses, and it strikes dead any giant upon which it scores a hit. (Depending on the campaign, the DM might wish to limit the effect to exclude storm giants and include ogres, ogre magi, trolls, ettins, and clay, flesh, and stone golems.) When hurled and successfully hitting, a great noise, like a clap of thunder, stuns all creatures within 90 feet for one round. Throwing range is 180 feet. (Thor would throw the hammer about double the above range.) The hammer of thunderbolts is difficult to hurl, so only one throw every other round can be made. After five throws within the space of any two-turn period, the wielder must rest for one turn. Hammers can be hurled as hand axes.',
      },
      '4e': {
        description: 'This appears to be a large, extra-heavy hammer. A character less than 6 feet tall and with Strength less than 18/01 will find it too unbalanced to wield properly in combat. However, a character of sufficient Strength and size will find that the hammer functions with a +3 bonus and gains double damage dice on any hit. If the wielder wears a girdle of giant strength and gauntlets of ogre power and he knows the hammer\'s true name, the weapon can be used to full effect: When swung or hurled it gains a +5 bonus, double damage dice, all girdle and gauntlet bonuses, and it strikes dead any giant upon which it scores a hit. (Depending on the campaign, the DM might wish to limit the effect to exclude storm giants and include ogres, ogre magi, trolls, ettins, and clay, flesh, and stone golems.) When hurled and successfully hitting, a great noise, like a clap of thunder, stuns all creatures within 90 feet for one round. Throwing range is 180 feet. (Thor would throw the hammer about double the above range.) The hammer of thunderbolts is difficult to hurl, so only one throw every other round can be made. After five throws within the space of any two-turn period, the wielder must rest for one turn. Hammers can be hurled as hand axes.',
        rarity: 'Uncommon',
        level: 8,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 thunder damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This appears to be a large, extra-heavy hammer. A character less than 6 feet tall and with Strength less than 18/01 will find it too unbalanced to wield properly in combat. However, a character of sufficient Strength and size will find that the hammer functions with a +3 bonus and gains double damage dice on any hit. If the wielder wears a girdle of giant strength and gauntlets of ogre power and he knows the hammer\'s true name, the weapon can be used to full effect: When swung or hurled it gains a +5 bonus, double damage dice, all girdle and gauntlet bonuses, and it strikes dead any giant upon which it scores a hit. (Depending on the campaign, the DM might wish to limit the effect to exclude storm giants and include ogres, ogre magi, trolls, ettins, and clay, flesh, and stone golems.) When hurled and successfully hitting, a great noise, like a clap of thunder, stuns all creatures within 90 feet for one round. Throwing range is 180 feet. (Thor would throw the hammer about double the above range.) The hammer of thunderbolts is difficult to hurl, so only one throw every other round can be made. After five throws within the space of any two-turn period, the wielder must rest for one turn. Hammers can be hurled as hand axes.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-heartwood-cudgel',
    name: 'Heartwood Cudgel',
    category: 'Weapon',
    source: 'TcDrH',
    editions: {
      '2e': {
        description: 'This club, made from the heartwood of an oak, is a club +1-- club +2 in a druid\'s hands.',
      },
      '4e': {
        description: 'This club, made from the heartwood of an oak, is a club +1-- club +2 in a druid\'s hands.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This club, made from the heartwood of an oak, is a club +1-- club +2 in a druid\'s hands.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-hornblade',
    name: 'Hornblade',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This is a magical weapon with a sickle-like blade resembling some sort of animal horn. Hornblades range in size from that of a knife to somewhat less than the length of a short sword. Even a close inspection is 90% unlikely to reveal it as anything other than a piece of horn of a �-foot to 1�-foot in length, set in some sort of handle or grip. If magic is detected for, a hornblade will radiate faintly of enchantment magic. However, if the proper pressure is applied in the correct place, a curved blade of great strength and sharpness will spring out. The small versions (knife-sized and dagger-sized) are usually enchanted to +1 or +2, and the largest version (scimitar-sized) commonly has a bonus of +2 or +3. Smaller hornblades can be thrown, and the bonus applies to both the attack number and damage determination. Any character class permitted to use sickle-like weapons can use a hornblade. The possessor can use it with proficiency, providing he has proficiency with the appropriately sized weapon (knife, dagger, or scimitar). The experience-point value of a hornblade depends upon its size and the amount of its magical bonus: Size XP Value Knife-sized 500 per "plus" Dagger-sized 750 per "plus" Scimitar-sized 1,000 per "plus"',
      },
      '4e': {
        description: 'This is a magical weapon with a sickle-like blade resembling some sort of animal horn. Hornblades range in size from that of a knife to somewhat less than the length of a short sword. Even a close inspection is 90% unlikely to reveal it as anything other than a piece of horn of a �-foot to 1�-foot in length, set in some sort of handle or grip. If magic is detected for, a hornblade will radiate faintly of enchantment magic. However, if the proper pressure is applied in the correct place, a curved blade of great strength and sharpness will spring out. The small versions (knife-sized and dagger-sized) are usually enchanted to +1 or +2, and the largest version (scimitar-sized) commonly has a bonus of +2 or +3. Smaller hornblades can be thrown, and the bonus applies to both the attack number and damage determination. Any character class permitted to use sickle-like weapons can use a hornblade. The possessor can use it with proficiency, providing he has proficiency with the appropriately sized weapon (knife, dagger, or scimitar). The experience-point value of a hornblade depends upon its size and the amount of its magical bonus: Size XP Value Knife-sized 500 per "plus" Dagger-sized 750 per "plus" Scimitar-sized 1,000 per "plus"',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This is a magical weapon with a sickle-like blade resembling some sort of animal horn. Hornblades range in size from that of a knife to somewhat less than the length of a short sword. Even a close inspection is 90% unlikely to reveal it as anything other than a piece of horn of a �-foot to 1�-foot in length, set in some sort of handle or grip. If magic is detected for, a hornblade will radiate faintly of enchantment magic. However, if the proper pressure is applied in the correct place, a curved blade of great strength and sharpness will spring out. The small versions (knife-sized and dagger-sized) are usually enchanted to +1 or +2, and the largest version (scimitar-sized) commonly has a bonus of +2 or +3. Smaller hornblades can be thrown, and the bonus applies to both the attack number and damage determination. Any character class permitted to use sickle-like weapons can use a hornblade. The possessor can use it with proficiency, providing he has proficiency with the appropriately sized weapon (knife, dagger, or scimitar). The experience-point value of a hornblade depends upon its size and the amount of its magical bonus: Size XP Value Knife-sized 500 per "plus" Dagger-sized 750 per "plus" Scimitar-sized 1,000 per "plus"',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-javelin-of-lightning',
    name: 'Javelin of Lightning',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A javelin of lightning is considered equal to a +2 magical weapon, although it has neither attack nor damage bonuses. It has a range of 90 yards and whenever it strikes, the javelin becomes the head of a 5-foot wide, 30-foot long stroke of lightning. Any creature hit by the javelin suffers 1d6 points of damage, plus 20 points of electrical damage. Any other creatures in the path of the stroke take either 10 or 20 points of damage, based on whether their saving throws are successful or not. From 2-5 javelins will be found. The javelin is consumed in the lightning discharge. (Please also read the following from the DMs Option: High Level campaign) Javelin of Lightning (DMs Option: High Level campaign): This item has a maximum range of 90 yards. The lightning created is a single bolt that extends from the target toward the thrower. Thus, a javelin of lightning should not be used if the target is within 30 feet.',
      },
      '4e': {
        description: 'A javelin of lightning is considered equal to a +2 magical weapon, although it has neither attack nor damage bonuses. It has a range of 90 yards and whenever it strikes, the javelin becomes the head of a 5-foot wide, 30-foot long stroke of lightning. Any creature hit by the javelin suffers 1d6 points of damage, plus 20 points of electrical damage. Any other creatures in the path of the stroke take either 10 or 20 points of damage, based on whether their saving throws are successful or not. From 2-5 javelins will be found. The javelin is consumed in the lightning discharge. (Please also read the following from the DMs Option: High Level campaign) Javelin of Lightning (DMs Option: High Level campaign): This item has a maximum range of 90 yards. The lightning created is a single bolt that extends from the target toward the thrower. Thus, a javelin of lightning should not be used if the target is within 30 feet.',
        rarity: 'Common',
        level: 3,
        slot: 'Weapon',
        powerText: 'Property: You gain a +1 enhancement bonus to attack and damage rolls with this weapon. Critical: +1d6 lightning damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 1d6 damage.',
      },
      '5e': {
        description: 'A javelin of lightning is considered equal to a +2 magical weapon, although it has neither attack nor damage bonuses. It has a range of 90 yards and whenever it strikes, the javelin becomes the head of a 5-foot wide, 30-foot long stroke of lightning. Any creature hit by the javelin suffers 1d6 points of damage, plus 20 points of electrical damage. Any other creatures in the path of the stroke take either 10 or 20 points of damage, based on whether their saving throws are successful or not. From 2-5 javelins will be found. The javelin is consumed in the lightning discharge. (Please also read the following from the DMs Option: High Level campaign) Javelin of Lightning (DMs Option: High Level campaign): This item has a maximum range of 90 yards. The lightning created is a single bolt that extends from the target toward the thrower. Thus, a javelin of lightning should not be used if the target is within 30 feet.',
        rarity: 'Common',
      },
    },
  },
  {
    id: 'weapon-javelin-of-piercing',
    name: 'Javelin of Piercing',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This weapon is not actually hurled--when a command word is spoken, the javelin of piercing launches itself. Range is 180 feet, all distances considered as short range. The javelin has a +6 bonus to attack rolls and inflicts 1d6+6 points of damage. (Note this missile will fly horizontally, vertically, or any combination thereof to the full extent of its range.) From 2-8 (2d4) will be found at one time. The magic of the javelin of piercing is good for only one throw after which it becomes a normal javelin.',
      },
      '4e': {
        description: 'This weapon is not actually hurled--when a command word is spoken, the javelin of piercing launches itself. Range is 180 feet, all distances considered as short range. The javelin has a +6 bonus to attack rolls and inflicts 1d6+6 points of damage. (Note this missile will fly horizontally, vertically, or any combination thereof to the full extent of its range.) From 2-8 (2d4) will be found at one time. The magic of the javelin of piercing is good for only one throw after which it becomes a normal javelin.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This weapon is not actually hurled--when a command word is spoken, the javelin of piercing launches itself. Range is 180 feet, all distances considered as short range. The javelin has a +6 bonus to attack rolls and inflicts 1d6+6 points of damage. (Note this missile will fly horizontally, vertically, or any combination thereof to the full extent of its range.) From 2-8 (2d4) will be found at one time. The magic of the javelin of piercing is good for only one throw after which it becomes a normal javelin.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-buckle',
    name: 'Buckle',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This magical blade has a hilt that looks just like a large belt-buckle ornament or a complete small buckle. The hilt can be grasped easily and the weapon drawn from its belt-sheath.',
      },
      '4e': {
        description: 'This magical blade has a hilt that looks just like a large belt-buckle ornament or a complete small buckle. The hilt can be grasped easily and the weapon drawn from its belt-sheath.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This magical blade has a hilt that looks just like a large belt-buckle ornament or a complete small buckle. The hilt can be grasped easily and the weapon drawn from its belt-sheath.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-lunar-sickle',
    name: 'Lunar Sickle',
    category: 'Weapon',
    source: 'TcDrH',
    editions: {
      '2e': {
        description: 'This weapon, a sickle crafted from silver and bound to the moon, may have been forged for druids as a symbol of the cyclic nature of time. The sickle boasts its greatest strength during the waxing moon. It has a +2 bonus from the new moon to half moon, a +3 bonus from the half moon to full moon, and +4 during the full moon. When the moon begins to wane, the lunar sickle drops to a +1 bonus. During the dark of the moon it loses all magical bonuses; until the new moon rises, it no longer affects creatures that can be hit only by magical weapons.',
      },
      '4e': {
        description: 'This weapon, a sickle crafted from silver and bound to the moon, may have been forged for druids as a symbol of the cyclic nature of time. The sickle boasts its greatest strength during the waxing moon. It has a +2 bonus from the new moon to half moon, a +3 bonus from the half moon to full moon, and +4 during the full moon. When the moon begins to wane, the lunar sickle drops to a +1 bonus. During the dark of the moon it loses all magical bonuses; until the new moon rises, it no longer affects creatures that can be hit only by magical weapons.',
        rarity: 'Uncommon',
        level: 8,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This weapon, a sickle crafted from silver and bound to the moon, may have been forged for druids as a symbol of the cyclic nature of time. The sickle boasts its greatest strength during the waxing moon. It has a +2 bonus from the new moon to half moon, a +3 bonus from the half moon to full moon, and +4 during the full moon. When the moon begins to wane, the lunar sickle drops to a +1 bonus. During the dark of the moon it loses all magical bonuses; until the new moon rises, it no longer affects creatures that can be hit only by magical weapons.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-mace-of-disruption',
    name: 'Mace of Disruption',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This appears to be a mace +1, but it has a neutral good alignment, and any evil character touching it will receive 5d4 points of damage due to the powerful enchantments laid upon the weapon. If a mace of disruption strikes any undead creature or evil creature from one of the lower planes, may utterly destroy the creature. Skeletons, zombies, ghouls, shadows, wights, and ghasts, if hit, are instantly blasted out of existenc Other creatures roll saving throws as follows: Creature Save Wraiths 5% Mummies 20% Spectres 35% Vampires 50% Ghosts 65% Liches 80% Other affected evil creatures 95% Even if these saving throws are effective, the mace of disruption scores double damage upon opponents of this sort, and twice the damage bonus.',
      },
      '4e': {
        description: 'This appears to be a mace +1, but it has a neutral good alignment, and any evil character touching it will receive 5d4 points of damage due to the powerful enchantments laid upon the weapon. If a mace of disruption strikes any undead creature or evil creature from one of the lower planes, may utterly destroy the creature. Skeletons, zombies, ghouls, shadows, wights, and ghasts, if hit, are instantly blasted out of existenc Other creatures roll saving throws as follows: Creature Save Wraiths 5% Mummies 20% Spectres 35% Vampires 50% Ghosts 65% Liches 80% Other affected evil creatures 95% Even if these saving throws are effective, the mace of disruption scores double damage upon opponents of this sort, and twice the damage bonus.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This appears to be a mace +1, but it has a neutral good alignment, and any evil character touching it will receive 5d4 points of damage due to the powerful enchantments laid upon the weapon. If a mace of disruption strikes any undead creature or evil creature from one of the lower planes, may utterly destroy the creature. Skeletons, zombies, ghouls, shadows, wights, and ghasts, if hit, are instantly blasted out of existenc Other creatures roll saving throws as follows: Creature Save Wraiths 5% Mummies 20% Spectres 35% Vampires 50% Ghosts 65% Liches 80% Other affected evil creatures 95% Even if these saving throws are effective, the mace of disruption scores double damage upon opponents of this sort, and twice the damage bonus.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-mistletoe-dart',
    name: 'Mistletoe Dart',
    category: 'Weapon',
    source: 'TcDrH',
    editions: {
      '2e': {
        description: 'The body and tip of this dart are fashioned from enchanted mistletoe. Magical armor, shields, or rings give no bonus protection against it; for example, a person wearing chain mail +4 would have AC 5, not AC 1. Darts, while not innately poisonous, can be coated with any venom. Characters usually find these darts in groups of 2 to 8 (2d4).',
      },
      '4e': {
        description: 'The body and tip of this dart are fashioned from enchanted mistletoe. Magical armor, shields, or rings give no bonus protection against it; for example, a person wearing chain mail +4 would have AC 5, not AC 1. Darts, while not innately poisonous, can be coated with any venom. Characters usually find these darts in groups of 2 to 8 (2d4).',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'The body and tip of this dart are fashioned from enchanted mistletoe. Magical armor, shields, or rings give no bonus protection against it; for example, a person wearing chain mail +4 would have AC 5, not AC 1. Darts, while not innately poisonous, can be coated with any venom. Characters usually find these darts in groups of 2 to 8 (2d4).',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-net-of-entrapment',
    name: 'Net of Entrapment',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This magical rope net is strong enough to defy Strength under 20 and is equal to AC -10 with respect to blows aimed at cutting it. (Normal sawing attempts to cut it with dagger or sword will not succeed; to sever a strand of the mesh, a character must hack at it until he does 5 points of damage on a strand.) Each net is 10 feet square and has a 3-inch-square mesh. It can be thrown 20 feet so as to cover and close upon opponents; each creature in range must roll a successful saving throw vs. dragon breath to avoid being entrapped. It can be suspended from a ceiling (or generally overhead) and drop upon a command word. It can be laid upon the floor and close upward upon command. The net stretches so as to close over an area up to five cubic feet. It ca be loosened by its possessor on command.',
      },
      '4e': {
        description: 'This magical rope net is strong enough to defy Strength under 20 and is equal to AC -10 with respect to blows aimed at cutting it. (Normal sawing attempts to cut it with dagger or sword will not succeed; to sever a strand of the mesh, a character must hack at it until he does 5 points of damage on a strand.) Each net is 10 feet square and has a 3-inch-square mesh. It can be thrown 20 feet so as to cover and close upon opponents; each creature in range must roll a successful saving throw vs. dragon breath to avoid being entrapped. It can be suspended from a ceiling (or generally overhead) and drop upon a command word. It can be laid upon the floor and close upward upon command. The net stretches so as to close over an area up to five cubic feet. It ca be loosened by its possessor on command.',
        rarity: 'Uncommon',
        level: 8,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This magical rope net is strong enough to defy Strength under 20 and is equal to AC -10 with respect to blows aimed at cutting it. (Normal sawing attempts to cut it with dagger or sword will not succeed; to sever a strand of the mesh, a character must hack at it until he does 5 points of damage on a strand.) Each net is 10 feet square and has a 3-inch-square mesh. It can be thrown 20 feet so as to cover and close upon opponents; each creature in range must roll a successful saving throw vs. dragon breath to avoid being entrapped. It can be suspended from a ceiling (or generally overhead) and drop upon a command word. It can be laid upon the floor and close upward upon command. The net stretches so as to close over an area up to five cubic feet. It ca be loosened by its possessor on command.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-net-of-snaring',
    name: 'Net of Snaring',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This net looks just like a net of entrapment, but it functions only underwater. There, it can be commanded to shoot forth up to 30 feet to trap a creature. It is otherwise the same as the net of entrapment. Quarterstaff,',
      },
      '4e': {
        description: 'This net looks just like a net of entrapment, but it functions only underwater. There, it can be commanded to shoot forth up to 30 feet to trap a creature.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This net looks just like a net of entrapment, but it functions only underwater. There, it can be commanded to shoot forth up to 30 feet to trap a creature. It is otherwise the same as the net of entrapment.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-magical',
    name: 'Magical',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This appears to be a normal bronzewood staff banded with iron. The shaft is actually as strong as steel, and has two magical qualities.',
      },
      '4e': {
        description: 'This appears to be a normal bronzewood staff banded with iron. The shaft is actually as strong as steel, and has two magical qualities.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This appears to be a normal bronzewood staff banded with iron. The shaft is actually as strong as steel, and has two magical qualities.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-scabbard-of-poison',
    name: 'Scabbard of Poison',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'These scabbards have reservoirs in which poison can be stored, and when a blade is placed in the scabbard and then drawn, the venom will automatically and magically be drawn from the reservoir to coat the blade. The venom will be wiped from the blade after one successful hit on a target, or evaporate after 2d4 rounds in any event. Any venom can be used, for the dweomer gives the venom virulence against whatever creature is struck. The scabbard holds enough poison for six doses, but must be manually refilled when empty. 25% of these scabbards are the right size for long swords, 25% suitable for short swords, and 50% for daggers. All restrictions which apply to the use of poison weapons apply here, of course, and only evil characters would routinely use such a device.',
      },
      '4e': {
        description: 'These scabbards have reservoirs in which poison can be stored, and when a blade is placed in the scabbard and then drawn, the venom will automatically and magically be drawn from the reservoir to coat the blade. The venom will be wiped from the blade after one successful hit on a target, or evaporate after 2d4 rounds in any event. Any venom can be used, for the dweomer gives the venom virulence against whatever creature is struck. The scabbard holds enough poison for six doses, but must be manually refilled when empty. 25% of these scabbards are the right size for long swords, 25% suitable for short swords, and 50% for daggers. All restrictions which apply to the use of poison weapons apply here, of course, and only evil characters would routinely use such a device.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'You have a +1 bonus to attack and damage rolls made with this magic weapon. You can use a bonus action to cause the blade to secrete poison. On the next hit, the target takes an extra 1d6 poison damage and must succeed on a DC 12 Constitution saving throw or be poisoned for 1 minute.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-scimitar-of-speed',
    name: 'Scimitar of Speed',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This is a magical weapon, usually of +2 bonus, that automatically grants its wielder the first attack in a melee round, even though some magical effect might have otherwise slowed his speed and reaction time. It also allows more than one strike in some rounds, increasing the wielder\'s figure for attacks per melee round by one place, so that if one attack is normal, then the improvement is to two attacks per round. n This increase in attacks is cumulative with any other bonus attacks (such as those provided by a haste spell). The order of attacks in the round is determined normally after the wielder of the scimitar of speed t has made his first attack to begin activity in the round. It is possible, for instance, that a wielder entitled to three attacks in the round will attack once before any other action takes place, and then (because of poor initiative rolls or other factors) take his remaining two attacks at the very end of the round. There is a chance (25%) that the weapon will have a bonus of something other than +2; if this occurs, roll percentile dice and refer to the following tabl to determine the appropriate bonus: D100 Roll Type XP Value 01-50 +1 2,500 (normal form) +2 3,000 51-75 +3 3,500 76-90 +4 4,000 91-00 +5 4,500 (Please also read the following from the PlO: C&T for situations on the battlefield.',
      },
      '4e': {
        description: 'This is a magical weapon, usually of +2 bonus, that automatically grants its wielder the first attack in a melee round, even though some magical effect might have otherwise slowed his speed and reaction time. It also allows more than one strike in some rounds, increasing the wielder\'s figure for attacks per melee round by one place, so that if one attack is normal, then the improvement is to two attacks per round. n This increase in attacks is cumulative with any other bonus attacks (such as those provided by a haste spell). The order of attacks in the round is determined normally after the wielder of the scimitar of speed t has made his first attack to begin activity in the round. It is possible, for instance, that a wielder entitled to three attacks in the round will attack once before any other action takes place, and then (because of poor initiative rolls or other factors) take his remaining two attacks at the very end of the round. There is a chance (25%) that the weapon will have a bonus of something other than +2; if this occurs, roll percentile dice and refer to the following tabl to determine the appropriate bonus: D100 Roll Type XP Value 01-50 +1 2,500 (normal form) +2 3,000 51-75 +3 3,500 76-90 +4 4,000 91-00 +5 4,500 (Please also read the following from the PlO: C&T for situations on the battlefield.',
        rarity: 'Uncommon',
        level: 8,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This is a magical weapon, usually of +2 bonus, that automatically grants its wielder the first attack in a melee round, even though some magical effect might have otherwise slowed his speed and reaction time. It also allows more than one strike in some rounds, increasing the wielder\'s figure for attacks per melee round by one place, so that if one attack is normal, then the improvement is to two attacks per round. n This increase in attacks is cumulative with any other bonus attacks (such as those provided by a haste spell). The order of attacks in the round is determined normally after the wielder of the scimitar of speed t has made his first attack to begin activity in the round. It is possible, for instance, that a wielder entitled to three attacks in the round will attack once before any other action takes place, and then (because of poor initiative rolls or other factors) take his remaining two attacks at the very end of the round. There is a chance (25%) that the weapon will have a bonus of something other than +2; if this occurs, roll percentile dice and refer to the following tabl to determine the appropriate bonus: D100 Roll Type XP Value 01-50 +1 2,500 (normal form) +2 3,000 51-75 +3 3,500 76-90 +4 4,000 91-00 +5 4,500 (Please also read the following from the PlO: C&T for situations on the battlefield.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-sheath-of-holding',
    name: 'Sheath of Holding',
    category: 'Weapon',
    source: 'TcFiH',
    editions: {
      '2e': {
        description: 'This item looks like an ordinary sheath for a large knife; the sheath is anywhere from 6" to 10" long, including its belt loop. But it doesn\'t hold a knife. It holds a sword--a full sized sword. With magic rather like that found in the bag of holding, this item slides most of the length of the blade into a pocket dimension, so that only the weapon\'s hilt shows, with the sheath suggesting another 5" or so of blade. (This looks rather strange when it holds a bastard sword, where the hilt will be longer than the apparent blade, but the sheath of holding can do it.) Each sheath of holding is designed to hold one type of sword. The DM can decide which sort of sword it\'s designed to hold, or can roll on the table below The sheath will not hold a sword it is not built to hold. Roll Weapon Alternate d100 Held By Roll 01�10 Sheath 01�15 11�15 Bastard sword 16�20 Cutlass 16�25 21�25 Dagger 26�30 26�30 Dirk 31�33 Gladius/Drusus 31�35 34�38 Katana 36�45 39�43 Khopesh Knife 44�53 Long sword 46�65 54�58 Main-gauche 59�68 Rapier e 69�73 Sabre 66�75 74�78 Scimitar 76�90 79�88 Short sword 89�93 Stiletto 91�00 94�98 Two�handed sword 99�00 Wakizashi Ignore any rolls which are not appropriate for your campaign setting; if you have no katanas, you don\'t need to accept any rolls for sheathes for katanas. The "Alternate Roll" column is used if you are not using the new weapons introduced in The Complete Fighter\'s Handbook. This magical item can be used by any character class, but most end up in the hands of warriors and rogues.',
      },
      '4e': {
        description: 'This item looks like an ordinary sheath for a large knife; the sheath is anywhere from 6" to 10" long, including its belt loop. But it doesn\'t hold a knife. It holds a sword--a full sized sword. With magic rather like that found in the bag of holding, this item slides most of the length of the blade into a pocket dimension, so that only the weapon\'s hilt shows, with the sheath suggesting another 5" or so of blade. (This looks rather strange when it holds a bastard sword, where the hilt will be longer than the apparent blade, but the sheath of holding can do it.) Each sheath of holding is designed to hold one type of sword. The DM can decide which sort of sword it\'s designed to hold, or can roll on the table below The sheath will not hold a sword it is not built to hold. Roll Weapon Alternate d100 Held By Roll 01�10 Sheath 01�15 11�15 Bastard sword 16�20 Cutlass 16�25 21�25 Dagger 26�30 26�30 Dirk 31�33 Gladius/Drusus 31�35 34�38 Katana 36�45 39�43 Khopesh Knife 44�53 Long sword 46�65 54�58 Main-gauche 59�68 Rapier e 69�73 Sabre 66�75 74�78 Scimitar 76�90 79�88 Short sword 89�93 Stiletto 91�00 94�98 Two�handed sword 99�00 Wakizashi Ignore any rolls which are not appropriate for your campaign setting; if you have no katanas, you don\'t need to accept any rolls for sheathes for katanas. The "Alternate Roll" column is used if you are not using the new weapons introduced in The Complete Fighter\'s Handbook. This magical item can be used by any character class, but most end up in the hands of warriors and rogues.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This item looks like an ordinary sheath for a large knife; the sheath is anywhere from 6" to 10" long, including its belt loop. But it doesn\'t hold a knife. It holds a sword--a full sized sword. With magic rather like that found in the bag of holding, this item slides most of the length of the blade into a pocket dimension, so that only the weapon\'s hilt shows, with the sheath suggesting another 5" or so of blade. (This looks rather strange when it holds a bastard sword, where the hilt will be longer than the apparent blade, but the sheath of holding can do it.) Each sheath of holding is designed to hold one type of sword. The DM can decide which sort of sword it\'s designed to hold, or can roll on the table below The sheath will not hold a sword it is not built to hold. Roll Weapon Alternate d100 Held By Roll 01�10 Sheath 01�15 11�15 Bastard sword 16�20 Cutlass 16�25 21�25 Dagger 26�30 26�30 Dirk 31�33 Gladius/Drusus 31�35 34�38 Katana 36�45 39�43 Khopesh Knife 44�53 Long sword 46�65 54�58 Main-gauche 59�68 Rapier e 69�73 Sabre 66�75 74�78 Scimitar 76�90 79�88 Short sword 89�93 Stiletto 91�00 94�98 Two�handed sword 99�00 Wakizashi Ignore any rolls which are not appropriate for your campaign setting; if you have no katanas, you don\'t need to accept any rolls for sheathes for katanas. The "Alternate Roll" column is used if you are not using the new weapons introduced in The Complete Fighter\'s Handbook. This magical item can be used by any character class, but most end up in the hands of warriors and rogues.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-sheath-of-security',
    name: 'Sheath of security',
    category: 'Weapon',
    source: 'TcPaH',
    editions: {
      '2e': {
        description: 'Less than a foot long, this leather sheath appears to the perfect size for a dagger. In fact, a pointed weapon of any size--such as sword, spear, or lance--may be carried in the sheath of security. When the tip of the weapon is placed in the sheath, the entire weapon shrinks to the size of a normal dagger. The sheath holds the shrunken weapon tightly; the weapon can only be removed when a command word is spoken, or when affected by knock or a similar spell. The weapon retains its shrunken size until the tip leaves the sheath. It then expands to its normal size.',
      },
      '4e': {
        description: 'Less than a foot long, this leather sheath appears to the perfect size for a dagger. In fact, a pointed weapon of any size--such as sword, spear, or lance--may be carried in the sheath of security. When the tip of the weapon is placed in the sheath, the entire weapon shrinks to the size of a normal dagger. The sheath holds the shrunken weapon tightly; the weapon can only be removed when a command word is spoken, or when affected by knock or a similar spell. The weapon retains its shrunken size until the tip leaves the sheath. It then expands to its normal size.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'Less than a foot long, this leather sheath appears to the perfect size for a dagger. In fact, a pointed weapon of any size--such as sword, spear, or lance--may be carried in the sheath of security. When the tip of the weapon is placed in the sheath, the entire weapon shrinks to the size of a normal dagger. The sheath holds the shrunken weapon tightly; the weapon can only be removed when a command word is spoken, or when affected by knock or a similar spell. The weapon retains its shrunken size until the tip leaves the sheath. It then expands to its normal size.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-shortsword-of-backstabbing',
    name: 'Shortsword of Backstabbing',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'In the hands of any character this is a +2 magical weapon, but in the hands of a thief it is especially potent. When a thief makes a backstab attempt with this short sword, it allows him to attack as if he were four levels higher than he actually is, i.e. with a higher attack multiplier. For example, a 5th-level thief normally has a x3 backstab multiplier, but with this weapon the thief backstabs at x4 (as though he were 9th level). The maximum multiplier is x5.',
      },
      '4e': {
        description: 'In the hands of any character this is a +2 magical weapon, but in the hands of a thief it is especially potent. When a thief makes a backstab attempt with this short sword, it allows him to attack as if he were four levels higher than he actually is, i.e. with a higher attack multiplier. For example, a 5th-level thief normally has a x3 backstab multiplier, but with this weapon the thief backstabs at x4 (as though he were 9th level). The maximum multiplier is x5.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'In the hands of any character this is a +2 magical weapon, but in the hands of a thief it is especially potent. When a thief makes a backstab attempt with this short sword, it allows him to attack as if he were four levels higher than he actually is, i.e. with a higher attack multiplier. For example, a 5th-level thief normally has a x3 backstab multiplier, but with this weapon the thief backstabs at x4 (as though he were 9th level). The maximum multiplier is x5.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-shortsword-of-quickness',
    name: 'Shortsword of Quickness',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This is a special +2 blade that enables the wielder to strike first in every combat round. If the wielder encounters someone with a similar weapon (e.g., a scimitar of speed), both strike simultaneously. The weapon also allows the wielder to make two attacks each round. When the weapon is placed in the sheath, the entire weapon shrinks to the size of a normal dagger. The sheath holds the shrunken weapon tightly; the weapon grows back to normal size only when drawn.',
      },
      '4e': {
        description: 'This is a special +2 blade that enables the wielder to strike first in every combat round. If the wielder encounters someone with a similar weapon (e.g., a scimitar of speed), both strike simultaneously. The weapon also allows the wielder to make two attacks each round. When the weapon is placed in the sheath, the entire weapon shrinks to the size of a normal dagger. The sheath holds the shrunken weapon tightly; the weapon grows back to normal size only when drawn.',
        rarity: 'Uncommon',
        level: 8,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This is a special +2 blade that enables the wielder to strike first in every combat round. If the wielder encounters someone with a similar weapon (e.g., a scimitar of speed), both strike simultaneously. The weapon also allows the wielder to make two attacks each round. When the weapon is placed in the sheath, the entire weapon shrinks to the size of a normal dagger. The sheath holds the shrunken weapon tightly; the weapon grows back to normal size only when drawn.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-sickle-of-the-harvest',
    name: 'Sickle of the Harvest',
    category: 'Weapon',
    source: 'TcDrH',
    editions: {
      '2e': {
        description: 'This sickle appears to be a normal farm implement, albeit of superior quality. If used in combat, it functions as a +1 weapon. However, its real power is as a magical harvesting tool. Anyone who grasps the sickle and speaks in the secret language of the druids can order the sickle to harvest a field on its own. When so commanded, the sickle takes to the air and harvests up to half an acre of grain per turn. It can accept precise orders, such as, "Cut down all stalks of ripe grain within a mile, save for Farmer Dowd\'s field." The sickle continues working until: three hours pass; its owner orders it to stop; or it moves mile from its owner. Characters can also halt the sickle by destroying it or snatching it out of the ai Anyone trying to grab the sickle must make a successful attack roll against AC -4. Those who fail suffer 1d6+1 points of damage; success means a character grabs it and stops the harvesting. Treat attacks on the sickle as attacks against a sword of dancing; the sickle, while physically unstoppable, can be affected by failing a saving roll against a spell such as fireball, lightni bolt, or transmute metal to wood. Sling of Seeking +2',
      },
      '4e': {
        description: 'This sickle appears to be a normal farm implement, albeit of superior quality. If used in combat, it functions as a +1 weapon. However, its real power is as a magical harvesting tool. Anyone who grasps the sickle and speaks in the secret language of the druids can order the sickle to harvest a field on its own. When so commanded, the sickle takes to the air and harvests up to half an acre of grain per turn. It can accept precise orders, such as, "Cut down all stalks of ripe grain within a mile, save for Farmer Dowd\'s field." The sickle continues working until: three hours pass; its owner orders it to stop; or it moves mile from its owner. Characters can also halt the sickle by destroying it or snatching it out of the ai Anyone trying to grab the sickle must make a successful attack roll against AC -4. Those who fail suffer 1d6+1 points of damage; success means a character grabs it and stops the harvesting. Treat attacks on the sickle as attacks against a sword of dancing; the sickle, while physically unstoppable, can be affected by failing a saving roll against a spell such as fireball, lightni bolt, or transmute metal to wood. Sling of Seeking +2',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This sickle appears to be a normal farm implement, albeit of superior quality. If used in combat, it functions as a +1 weapon. However, its real power is as a magical harvesting tool. Anyone who grasps the sickle and speaks in the secret language of the druids can order the sickle to harvest a field on its own. When so commanded, the sickle takes to the air and harvests up to half an acre of grain per turn. It can accept precise orders, such as, "Cut down all stalks of ripe grain within a mile, save for Farmer Dowd\'s field." The sickle continues working until: three hours pass; its owner orders it to stop; or it moves mile from its owner. Characters can also halt the sickle by destroying it or snatching it out of the ai Anyone trying to grab the sickle must make a successful attack roll against AC -4. Those who fail suffer 1d6+1 points of damage; success means a character grabs it and stops the harvesting. Treat attacks on the sickle as attacks against a sword of dancing; the sickle, while physically unstoppable, can be affected by failing a saving roll against a spell such as fireball, lightni bolt, or transmute metal to wood. Sling of Seeking +2',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-cursed-backbiter',
    name: 'Cursed Backbiter',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This is to all tests a magical spear with a +1 bonus (or at the DM\'s option +2 or +3). It may even function normally in combat against a deadly enemy, but each time it is used in melee against a foe, there is a one in 20 cumulative chance that it will function against its wielder. Once it begins functioning in this way, you can\'t get rid of it without a remove curse spell. The character always seems to find the spear in his hand despite his best efforts or intentions. When the curse takes effect, the spear curls around to strike its wielder in the back, negating any shield and Dexterity bonuses to Armor Class, and inflicting normal damage. The curse even functions when the spear is hurled, but if the wielder has hurled the spear, the damage done to the hurler will be double.',
      },
      '4e': {
        description: 'This is to all tests a magical spear with a +1 bonus (or at the DM\'s option +2 or +3). It may even function normally in combat against a deadly enemy, but each time it is used in melee against a foe, there is a one in 20 cumulative chance that it will function against its wielder. Once it begins functioning in this way, you can\'t get rid of it without a remove curse spell. The character always seems to find the spear in his hand despite his best efforts or intentions. When the curse takes effect, the spear curls around to strike its wielder in the back, negating any shield and Dexterity bonuses to Armor Class, and inflicting normal damage. The curse even functions when the spear is hurled, but if the wielder has hurled the spear, the damage done to the hurler will be double.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This is to all tests a magical spear with a +1 bonus (or at the DM\'s option +2 or +3). It may even function normally in combat against a deadly enemy, but each time it is used in melee against a foe, there is a one in 20 cumulative chance that it will function against its wielder. Once it begins functioning in this way, you can\'t get rid of it without a remove curse spell. The character always seems to find the spear in his hand despite his best efforts or intentions. When the curse takes effect, the spear curls around to strike its wielder in the back, negating any shield and Dexterity bonuses to Armor Class, and inflicting normal damage. The curse even functions when the spear is hurled, but if the wielder has hurled the spear, the damage done to the hurler will be double.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-spear-of-the-eagle',
    name: 'Spear of the Eagle',
    category: 'Weapon',
    source: 'TcBbH',
    editions: {
      '2e': {
        description: 'This resembles a normal wooden spear, with 4d6 eagle feathers (the exact number is determined at the time of acquisition) attached near the blunt end. When thrown, the spear of the eagle sprouts a small pair of wings in mid-flight, allowing it to unerringly strike its target, much like a magic missile. As with a magic missile, the target must be seen or otherwise detectable to be hit. Unlike a magic missile, a spear of the eagle can be directed to strike inanimate objects. The target suffers ld8 damage. The spear of the eagle has the same range as a normal spear. After each strike, the spear ofthe eagle loses one of its feathers. When all of its feathers are lost, the a spear loses its magical properties; it still functions as a normal spear. Feathers may not be reattached. r. A spear of the eagle only gains its magical properties when thrown. If used as a thrusting weapon, it functions as a normal spear. Successful thrusts won\'t cause it to lose feathers.',
      },
      '4e': {
        description: 'This resembles a normal wooden spear, with 4d6 eagle feathers (the exact number is determined at the time of acquisition) attached near the blunt end. When thrown, the spear of the eagle sprouts a small pair of wings in mid-flight, allowing it to unerringly strike its target, much like a magic missile. As with a magic missile, the target must be seen or otherwise detectable to be hit. Unlike a magic missile, a spear of the eagle can be directed to strike inanimate objects. The target suffers ld8 damage. The spear of the eagle has the same range as a normal spear. After each strike, the spear ofthe eagle loses one of its feathers. When all of its feathers are lost, the a spear loses its magical properties; it still functions as a normal spear. Feathers may not be reattached. r. A spear of the eagle only gains its magical properties when thrown. If used as a thrusting weapon, it functions as a normal spear. Successful thrusts won\'t cause it to lose feathers.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This resembles a normal wooden spear, with 4d6 eagle feathers (the exact number is determined at the time of acquisition) attached near the blunt end. When thrown, the spear of the eagle sprouts a small pair of wings in mid-flight, allowing it to unerringly strike its target, much like a magic missile. As with a magic missile, the target must be seen or otherwise detectable to be hit. Unlike a magic missile, a spear of the eagle can be directed to strike inanimate objects. The target suffers ld8 damage. The spear of the eagle has the same range as a normal spear. After each strike, the spear ofthe eagle loses one of its feathers. When all of its feathers are lost, the a spear loses its magical properties; it still functions as a normal spear. Feathers may not be reattached. r. A spear of the eagle only gains its magical properties when thrown. If used as a thrusting weapon, it functions as a normal spear. Successful thrusts won\'t cause it to lose feathers.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-spirit-arrow',
    name: 'Spirit Arrow',
    category: 'Weapon',
    source: 'TcBbH',
    editions: {
      '2e': {
        description: 'The spirit arrow consists of an arrowhead of white flint ng attached to a wooden shaft. It may be fired from any bow, and if the attack is successful the victim suffers ld6 points of damage. Spirit arrms ignore various protection spells that seek to protect the target of the attack, such as stoneskin, fire shield, and others. In addition, Armor Class gained by magical means (armor, bracers of defense, rings of protection, cloaks of protection, etc.) are also totally negated. Only the actual armor class of the target is used for determining attack rolls; a wizard wearing bracers of defense AC 2 and a ring of protection +3 is considered AC 10 for purposes of striking. Regardless of whether the spirit arrow strikes its intended target, the arrow is destroyed. Spirit arrows have no bonuses to hit save for any granted by the wielder from high dexterity, magical items, or other abilities.',
      },
      '4e': {
        description: 'The spirit arrow consists of an arrowhead of white flint ng attached to a wooden shaft. It may be fired from any bow, and if the attack is successful the victim suffers ld6 points of damage. Spirit arrms ignore various protection spells that seek to protect the target of the attack, such as stoneskin, fire shield, and others. In addition, Armor Class gained by magical means (armor, bracers of defense, rings of protection, cloaks of protection, etc.) are also totally negated. Only the actual armor class of the target is used for determining attack rolls; a wizard wearing bracers of defense AC 2 and a ring of protection +3 is considered AC 10 for purposes of striking. Regardless of whether the spirit arrow strikes its intended target, the arrow is destroyed. Spirit arrows have no bonuses to hit save for any granted by the wielder from high dexterity, magical items, or other abilities.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'The spirit arrow consists of an arrowhead of white flint ng attached to a wooden shaft. It may be fired from any bow, and if the attack is successful the victim suffers ld6 points of damage. Spirit arrms ignore various protection spells that seek to protect the target of the attack, such as stoneskin, fire shield, and others. In addition, Armor Class gained by magical means (armor, bracers of defense, rings of protection, cloaks of protection, etc.) are also totally negated. Only the actual armor class of the target is used for determining attack rolls; a wizard wearing bracers of defense AC 2 and a ring of protection +3 is considered AC 10 for purposes of striking. Regardless of whether the spirit arrow strikes its intended target, the arrow is destroyed. Spirit arrows have no bonuses to hit save for any granted by the wielder from high dexterity, magical items, or other abilities.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-sun-blade',
    name: 'Sun Blade',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'a This sword is the size of a bastard sword. However, its enchantment enables the sun blade to be wielded as if it were a short sword with respect to encumbrance, weight, speed factor, and ease of use (i.e., the weapon appears to all viewers to be a bastard sword, and inflicts bastard sword damage, d but the wielder feels and reacts as if the weapon were a short sword). Any individual able to use either a bastard sword or a short sword with proficiency is proficient in the use of a sun blade. In normal combat, the glowing golden blade of the weapon is equal to a +2 sword. Against evil creatures, its bonus is +4. Against Negative Energy Plane creatures or those drawing power from that plane (such as certain undead), the sword inflicts double damage. Furthermore, the blade has a special sunray power. Once a day, upon command, the blade can be swung vigorously above the head, and it will shed a bright yellow radiance that is lik full daylight. The radiance begins shining in a 10- foot radius around the sword-wielder, spreading outward at 5 feet per round for 10 rounds thereafter, creating a globe of light with a 60-foot radius. When the swinging stops, the radiance fades to a dim glow that persists for another turn before disappearing entirely. All sun blades are of good alignment. Sword +1, +2 vs.',
      },
      '4e': {
        description: 'a This sword is the size of a bastard sword. However, its enchantment enables the sun blade to be wielded as if it were a short sword with respect to encumbrance, weight, speed factor, and ease of use (i.e., the weapon appears to all viewers to be a bastard sword, and inflicts bastard sword damage, d but the wielder feels and reacts as if the weapon were a short sword). Any individual able to use either a bastard sword or a short sword with proficiency is proficient in the use of a sun blade. In normal combat, the glowing golden blade of the weapon is equal to a +2 sword. Against evil creatures, its bonus is +4. Against Negative Energy Plane creatures or those drawing power from that plane (such as certain undead), the sword inflicts double damage. Furthermore, the blade has a special sunray power. Once a day, upon command, the blade can be swung vigorously above the head, and it will shed a bright yellow radiance that is lik full daylight. The radiance begins shining in a 10- foot radius around the sword-wielder, spreading outward at 5 feet per round for 10 rounds thereafter, creating a globe of light with a 60-foot radius. When the swinging stops, the radiance fades to a dim glow that persists for another turn before disappearing entirely. All sun blades are of good alignment. Sword +1, +2 vs.',
        rarity: 'Uncommon',
        level: 8,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 radiant damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'a This sword is the size of a bastard sword. However, its enchantment enables the sun blade to be wielded as if it were a short sword with respect to encumbrance, weight, speed factor, and ease of use (i.e., the weapon appears to all viewers to be a bastard sword, and inflicts bastard sword damage, d but the wielder feels and reacts as if the weapon were a short sword). Any individual able to use either a bastard sword or a short sword with proficiency is proficient in the use of a sun blade. In normal combat, the glowing golden blade of the weapon is equal to a +2 sword. Against evil creatures, its bonus is +4. Against Negative Energy Plane creatures or those drawing power from that plane (such as certain undead), the sword inflicts double damage. Furthermore, the blade has a special sunray power. Once a day, upon command, the blade can be swung vigorously above the head, and it will shed a bright yellow radiance that is lik full daylight. The radiance begins shining in a 10- foot radius around the sword-wielder, spreading outward at 5 feet per round for 10 rounds thereafter, creating a globe of light with a 60-foot radius. When the swinging stops, the radiance fades to a dim glow that persists for another turn before disappearing entirely. All sun blades are of good alignment. Sword +1, +2 vs.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-luck-blade',
    name: 'Luck Blade',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This gives its possessor a +1 bonus to all saving throws and will have 1d4+1 wishes. The DM should keep the number of wishes secret. Sword +2,',
      },
      '4e': {
        description: 'This magical weapon returns to its wielder\'s hand immediately after being thrown.',
        rarity: 'Rare',
        level: 25,
        slot: 'Weapon',
        powerText: 'Property: You gain a +5 enhancement bonus to attack and damage rolls with this weapon. Critical: +5d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 5d6 damage.',
      },
      '5e': {
        description: 'You have a +3 bonus to attack and damage rolls made with this magic weapon. This weapon has the thrown property (range 20/60) and returns to your hand immediately after you throw it.',
        rarity: 'Legendary',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-dragon-slayer',
    name: 'Dragon Slayer',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This has a +4 bonus against any sort of true dragon. It inflicts triple damage against one sort of dragon (i.e., 3d12+4). Note that an unusual sword with intelligence and alignment will not be made to slay dragons of the same alignment. Determine dragon type (excluding unique ones like Bahamut and Tiamat) by rolling 1d10: 1 black (CE), 2 blue (LE), 3 brass (CG), 4 bronze (LG), 5 copper (CG), 6 gold (LG), 7 green (LE), 8 red (CE), 9 silver (LG), 10 white (CE).',
      },
      '4e': {
        description: 'This has a +4 bonus against any sort of true dragon. It inflicts triple damage against one sort of dragon (i.e., 3d12+4). Note that an unusual sword with intelligence and alignment will not be made to slay dragons of the same alignment. Determine dragon type (excluding unique ones like Bahamut and Tiamat) by rolling 1d10: 1 black (CE), 2 blue (LE), 3 brass (CG), 4 bronze (LG), 5 copper (CG), 6 gold (LG), 7 green (LE), 8 red (CE), 9 silver (LG), 10 white (CE).',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This has a +4 bonus against any sort of true dragon. It inflicts triple damage against one sort of dragon (i.e., 3d12+4). Note that an unusual sword with intelligence and alignment will not be made to slay dragons of the same alignment. Determine dragon type (excluding unique ones like Bahamut and Tiamat) by rolling 1d10: 1 black (CE), 2 blue (LE), 3 brass (CG), 4 bronze (LG), 5 copper (CG), 6 gold (LG), 7 green (LE), 8 red (CE), 9 silver (LG), 10 white (CE).',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-giant-slayer',
    name: 'Giant Slayer',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This provides a +3 bonus versus any giant, giant-kin, ettin, ogre mage, or titan. Against any of the true giants (hill, stone, frost, fire, cloud, storm) the sword causes double damage (i.e., 2d12+3). Sword +2,',
      },
      '4e': {
        description: 'This magical weapon is especially deadly against giants and giant-kin, dealing devastating damage on impact.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'You have a +1 bonus to attack and damage rolls made with this magic weapon. The weapon deals an extra 1d6 damage against giants and giant-kin.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-nine-lives-stealer',
    name: 'Nine Lives Stealer',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This will always perform as a +2 weapon, but it also has the power to draw the life force from an opponent. It can do this nine times before the ability is lost. A natural 20 must be scored on the wielder\'s attack roll for the sword to function. The victim is entitled to a saving throw vs. spell. If this succeeds, the sword does not function, no charge is used, and normal damage is determined.',
      },
      '4e': {
        description: 'This will always perform as a +2 weapon, but it also has the power to draw the life force from an opponent. It can do this nine times before the ability is lost. A natural 20 must be scored on the wielder\'s attack roll for the sword to function. The victim is entitled to a saving throw vs. spell. If this succeeds, the sword does not function, no charge is used, and normal damage is determined.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This will always perform as a +2 weapon, but it also has the power to draw the life force from an opponent. It can do this nine times before the ability is lost. A natural 20 must be scored on the wielder\'s attack roll for the sword to function. The victim is entitled to a saving throw vs. spell. If this succeeds, the sword does not function, no charge is used, and normal damage is determined.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-defender',
    name: 'Defender',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This gives its wielder the option of using all, some, or none of the +4 bonus in defense (improving his Armor Class) against any opponent using a handheld weapon, such as a dagger, mace, spear (not hurled), sword, etc. For example, the wielder can, on the first round of battle, opt to use the sword as +2 and save the other two bonus factors to be added to his Armor Class. This can be done each round. Note that there is also a sword, +5 defender, identical to the +4 sword with one extra bonus point.',
      },
      '4e': {
        description: 'This gives its wielder the option of using all, some, or none of the +4 bonus in defense (improving his Armor Class) against any opponent using a handheld weapon, such as a dagger, mace, spear (not hurled), sword, etc. For example, the wielder can, on the first round of battle, opt to use the sword as +2 and save the other two bonus factors to be added to his Armor Class. This can be done each round. Note that there is also a sword, +5 defender, identical to the +4 sword with one extra bonus point.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This gives its wielder the option of using all, some, or none of the +4 bonus in defense (improving his Armor Class) against any opponent using a handheld weapon, such as a dagger, mace, spear (not hurled), sword, etc. For example, the wielder can, on the first round of battle, opt to use the sword as +2 and save the other two bonus factors to be added to his Armor Class. This can be done each round. Note that there is also a sword, +5 defender, identical to the +4 sword with one extra bonus point.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-holy-sword',
    name: 'Holy Sword',
    category: 'Weapon',
    source: 'TcPaH',
    editions: {
      '2e': {
        description: 'A holy sword is a special type of consecrated weapon that provides a paladin with unique benefits. Though the sword +5, Holy Avenger (described in the Appendix of the DMG) is one of the more common examples, others exist as well. A few are described in Chapter 6 of this book. Aside from their exceptional craftsmanship, holy swords are often indistinguishable from ordinary magical weapons. A paladin may not become aware of the sword\'s special powers until he uses it. In some cases, a paladin may be able to identify a holy sword by its cryptic inscription (which may require the Ancient Languages proficiency or a friendly mage\'s read magic spell to translate). A skilled weaponsmith or sage may also recognize a holy sword. Occasionally, a holy sword will glow when touched by a paladin, or the paladin\'s arm may tingle when he picks it up. in Holy swords are hard to come by, and a paladin rarely finds more than one in his entire career. Usually, a paladin acquires a holy , sword under difficult or extraordinary circumstances. A holy sword may be part of a venerable red dragon\'s treasure horde, concealed in a cave atop a high mountain. A . paladin may hear rumors of a holy sword buried in a desert ruins; in fact, the ruins contain a map that shows the actual location of the holy sword, embedded in a glacier in an arctic wilderness. If a paladin reaches a high level without acquiring a holy sword, his deity might direct him to one in a temple on the ocean floor or a treasure chest on a remote island. In any case, the DM should treat the acquisition of a holy sword as a significant campaign event, and design the circumstances of its discovery accordingly. When unsheathed and held by a paladin, every holy sword projects a circle of power 10 feet in diameter. The paladin\'s hand serves as the center of the circle. The circle moves with the paladin and persists as long as he grips the sword. The sword projects the circle even if a glove, gauntlet, or bandage covers the paladin\'s hand. Note: The first sentence in the paragraph regarding the paladin\'s holy sword in Chapter 3 of the Paladin Handbook (page 27) should read: "A paladin using a holy sword projects a circle of power 10 feet in diameter when the sword is unsheathed and held." Within its range, the circle of power dispels all hostile magic of a level less than or equal to the paladin\'s experience level the and creates a magic resistance of 50%. Specifically: All evil opponents within the circle are unable to cast spells, including monsters and characters of evil alignment; extraplanar, conjured, and summoned evil entities; and monsters and characters who have been charmed or controlled by evil casters. The circle neutralizes a spell the instant it\'s cast. Opponents may not make saving throws to resist the circle of power. � Evil opponents have normal use of their spell and spell-like abilities once they leave the range of the circle. However, the paladin remains immune to their spells, even when cast from outside the circle. An evil wizard can cast a fireball spell at a paladin, but the fireball dissipates as soon as it enters the circle. An evil spellcaster\'s attempts to mentally probe or control a paladin (with spells such as ESP and magic jar) will also fail. � Magical items created by evil magic won\'t work within the circle. Physical properties remain unchanged, however; a sword +1 may still be wielded as a normal sword. Outside the circle, magical items function normally, but the paladin remains immune to their effects. The following restrictions also apply: � The paladin is always vulnerable to magic from opponents whose level exceeds his own. The paladin has the normal chances of avoiding the affects of these magical attacks. � The circle functions only as long as the paladin grips the holy sword. Should he sheathe or drop it, he immediately becomes vulnerable to evil magic. � The paladin must be conscious and in control of his own actions for the holy sword to project a circle of power. A holy sword doesn\'t dispel magic in the grip of a comatose or sleeping paladin. � An evil spellcaster may temporarily negate the magic of a holy sword, including its power to project a circle of protection, by casting dispel magic directly on the weapon. The holy sword may resist the spell with a successful saving throw vs. spell, using the paladin\'s saving-throw number. If the throw fails, the holy sword\'s magic is inert for 1-4 rounds. � A paladin is still subject to indirect effects of evil magic. If an evil spellcaster uses a lighting bolt spell to cause an avalanche, the paladin risks damage from falling boulders. Certain holy swords may have additional benefits and limitations. A Holy Avenger, for instance, inflicts +10 points of damage on chaotic evil opponents. Each holy sword described in Chapter 6 has its own special properties. In designing holy swords, the DM may use the standard benefits and limits described above, perhaps adding a +1 to +5 bonus on attack and damage rolls against certain kinds of evil opponents.',
      },
      '4e': {
        description: 'A holy sword is a special type of consecrated weapon that provides a paladin with unique benefits. Though the sword +5, Holy Avenger (described in the Appendix of the DMG) is one of the more common examples, others exist as well. A few are described in Chapter 6 of this book. Aside from their exceptional craftsmanship, holy swords are often indistinguishable from ordinary magical weapons. A paladin may not become aware of the sword\'s special powers until he uses it. In some cases, a paladin may be able to identify a holy sword by its cryptic inscription (which may require the Ancient Languages proficiency or a friendly mage\'s read magic spell to translate). A skilled weaponsmith or sage may also recognize a holy sword. Occasionally, a holy sword will glow when touched by a paladin, or the paladin\'s arm may tingle when he picks it up. in Holy swords are hard to come by, and a paladin rarely finds more than one in his entire career. Usually, a paladin acquires a holy , sword under difficult or extraordinary circumstances. A holy sword may be part of a venerable red dragon\'s treasure horde, concealed in a cave atop a high mountain. A . paladin may hear rumors of a holy sword buried in a desert ruins; in fact, the ruins contain a map that shows the actual location of the holy sword, embedded in a glacier in an arctic wilderness. If a paladin reaches a high level without acquiring a holy sword, his deity might direct him to one in a temple on the ocean floor or a treasure chest on a remote island. In any case, the DM should treat the acquisition of a holy sword as a significant campaign event, and design the circumstances of its discovery accordingly. When unsheathed and held by a paladin, every holy sword projects a circle of power 10 feet in diameter. The paladin\'s hand serves as the center of the circle. The circle moves with the paladin and persists as long as he grips the sword. The sword projects the circle even if a glove, gauntlet, or bandage covers the paladin\'s hand. Note: The first sentence in the paragraph regarding the paladin\'s holy sword in Chapter 3 of the Paladin Handbook (page 27) should read: "A paladin using a holy sword projects a circle of power 10 feet in diameter when the sword is unsheathed and held." Within its range, the circle of power dispels all hostile magic of a level less than or equal to the paladin\'s experience level the and creates a magic resistance of 50%. Specifically: All evil opponents within the circle are unable to cast spells, including monsters and characters of evil alignment; extraplanar, conjured, and summoned evil entities; and monsters and characters who have been charmed or controlled by evil casters. The circle neutralizes a spell the instant it\'s cast. Opponents may not make saving throws to resist the circle of power. � Evil opponents have normal use of their spell and spell-like abilities once they leave the range of the circle. However, the paladin remains immune to their spells, even when cast from outside the circle. An evil wizard can cast a fireball spell at a paladin, but the fireball dissipates as soon as it enters the circle. An evil spellcaster\'s attempts to mentally probe or control a paladin (with spells such as ESP and magic jar) will also fail. � Magical items created by evil magic won\'t work within the circle. Physical properties remain unchanged, however; a sword +1 may still be wielded as a normal sword. Outside the circle, magical items function normally, but the paladin remains immune to their effects. The following restrictions also apply: � The paladin is always vulnerable to magic from opponents whose level exceeds his own. The paladin has the normal chances of avoiding the affects of these magical attacks. � The circle functions only as long as the paladin grips the holy sword. Should he sheathe or drop it, he immediately becomes vulnerable to evil magic. � The paladin must be conscious and in control of his own actions for the holy sword to project a circle of power. A holy sword doesn\'t dispel magic in the grip of a comatose or sleeping paladin. � An evil spellcaster may temporarily negate the magic of a holy sword, including its power to project a circle of protection, by casting dispel magic directly on the weapon. The holy sword may resist the spell with a successful saving throw vs. spell, using the paladin\'s saving-throw number. If the throw fails, the holy sword\'s magic is inert for 1-4 rounds. � A paladin is still subject to indirect effects of evil magic. If an evil spellcaster uses a lighting bolt spell to cause an avalanche, the paladin risks damage from falling boulders. Certain holy swords may have additional benefits and limitations. A Holy Avenger, for instance, inflicts +10 points of damage on chaotic evil opponents. Each holy sword described in Chapter 6 has its own special properties. In designing holy swords, the DM may use the standard benefits and limits described above, perhaps adding a +1 to +5 bonus on attack and damage rolls against certain kinds of evil opponents.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 radiant damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'A holy sword is a special type of consecrated weapon that provides a paladin with unique benefits. Though the sword +5, Holy Avenger (described in the Appendix of the DMG) is one of the more common examples, others exist as well. A few are described in Chapter 6 of this book. Aside from their exceptional craftsmanship, holy swords are often indistinguishable from ordinary magical weapons. A paladin may not become aware of the sword\'s special powers until he uses it. In some cases, a paladin may be able to identify a holy sword by its cryptic inscription (which may require the Ancient Languages proficiency or a friendly mage\'s read magic spell to translate). A skilled weaponsmith or sage may also recognize a holy sword. Occasionally, a holy sword will glow when touched by a paladin, or the paladin\'s arm may tingle when he picks it up. in Holy swords are hard to come by, and a paladin rarely finds more than one in his entire career. Usually, a paladin acquires a holy , sword under difficult or extraordinary circumstances. A holy sword may be part of a venerable red dragon\'s treasure horde, concealed in a cave atop a high mountain. A . paladin may hear rumors of a holy sword buried in a desert ruins; in fact, the ruins contain a map that shows the actual location of the holy sword, embedded in a glacier in an arctic wilderness. If a paladin reaches a high level without acquiring a holy sword, his deity might direct him to one in a temple on the ocean floor or a treasure chest on a remote island. In any case, the DM should treat the acquisition of a holy sword as a significant campaign event, and design the circumstances of its discovery accordingly. When unsheathed and held by a paladin, every holy sword projects a circle of power 10 feet in diameter. The paladin\'s hand serves as the center of the circle. The circle moves with the paladin and persists as long as he grips the sword. The sword projects the circle even if a glove, gauntlet, or bandage covers the paladin\'s hand. Note: The first sentence in the paragraph regarding the paladin\'s holy sword in Chapter 3 of the Paladin Handbook (page 27) should read: "A paladin using a holy sword projects a circle of power 10 feet in diameter when the sword is unsheathed and held." Within its range, the circle of power dispels all hostile magic of a level less than or equal to the paladin\'s experience level the and creates a magic resistance of 50%. Specifically: All evil opponents within the circle are unable to cast spells, including monsters and characters of evil alignment; extraplanar, conjured, and summoned evil entities; and monsters and characters who have been charmed or controlled by evil casters. The circle neutralizes a spell the instant it\'s cast. Opponents may not make saving throws to resist the circle of power. � Evil opponents have normal use of their spell and spell-like abilities once they leave the range of the circle. However, the paladin remains immune to their spells, even when cast from outside the circle. An evil wizard can cast a fireball spell at a paladin, but the fireball dissipates as soon as it enters the circle. An evil spellcaster\'s attempts to mentally probe or control a paladin (with spells such as ESP and magic jar) will also fail. � Magical items created by evil magic won\'t work within the circle. Physical properties remain unchanged, however; a sword +1 may still be wielded as a normal sword. Outside the circle, magical items function normally, but the paladin remains immune to their effects. The following restrictions also apply: � The paladin is always vulnerable to magic from opponents whose level exceeds his own. The paladin has the normal chances of avoiding the affects of these magical attacks. � The circle functions only as long as the paladin grips the holy sword. Should he sheathe or drop it, he immediately becomes vulnerable to evil magic. � The paladin must be conscious and in control of his own actions for the holy sword to project a circle of power. A holy sword doesn\'t dispel magic in the grip of a comatose or sleeping paladin. � An evil spellcaster may temporarily negate the magic of a holy sword, including its power to project a circle of protection, by casting dispel magic directly on the weapon. The holy sword may resist the spell with a successful saving throw vs. spell, using the paladin\'s saving-throw number. If the throw fails, the holy sword\'s magic is inert for 1-4 rounds. � A paladin is still subject to indirect effects of evil magic. If an evil spellcaster uses a lighting bolt spell to cause an avalanche, the paladin risks damage from falling boulders. Certain holy swords may have additional benefits and limitations. A Holy Avenger, for instance, inflicts +10 points of damage on chaotic evil opponents. Each holy sword described in Chapter 6 has its own special properties. In designing holy swords, the DM may use the standard benefits and limits described above, perhaps adding a +1 to +5 bonus on attack and damage rolls against certain kinds of evil opponents.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-purifier',
    name: 'Purifier',
    category: 'Weapon',
    source: 'TcPaH',
    editions: {
      '2e': {
        description: 'When a paladin holds this weapon in front of him, he turns undead as a cleric of equal level; a 3rd-level paladin turns undead with the same effectiveness as a 3rd-level cleric. The paladin must be of 3rd level or higher to turn undead, with or without this sword. The sword provides two benefits to paladins of all levels: a +5 bonus against all undead, and a +2 bonus to saving throws against undead magical attacks, including a ghoul\'s paralyzing touch and a vampire\'s charm.',
      },
      '4e': {
        description: 'When a paladin holds this weapon in front of him, he turns undead as a cleric of equal level; a 3rd-level paladin turns undead with the same effectiveness as a 3rd-level cleric. The paladin must be of 3rd level or higher to turn undead, with or without this sword. The sword provides two benefits to paladins of all levels: a +5 bonus against all undead, and a +2 bonus to saving throws against undead magical attacks, including a ghoul\'s paralyzing touch and a vampire\'s charm.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 necrotic damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'When a paladin holds this weapon in front of him, he turns undead as a cleric of equal level; a 3rd-level paladin turns undead with the same effectiveness as a 3rd-level cleric. The paladin must be of 3rd level or higher to turn undead, with or without this sword. The sword provides two benefits to paladins of all levels: a +5 bonus against all undead, and a +2 bonus to saving throws against undead magical attacks, including a ghoul\'s paralyzing touch and a vampire\'s charm.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-divine-protector',
    name: 'Divine protector',
    category: 'Weapon',
    source: 'TcPaH',
    editions: {
      '2e': {
        description: 'This sword alerts the paladin to the presence of evil by generating a soft hum that only he can hear. The sword detects evil within a 60-foot-radius of the paladin, but does not indicate the direction or intensity of the source. The hum is automatic, so long as the sword remains on the paladin\'s person. The hum is loud enough to awaken the paladin from a normal sleep, alert him to an ambush, or warn him of an evil character behind his back. Otherwise, the sword has all of the benefits and limitations of the paladin\'s detect evil intent ability. Additionally, if the paladin spends one full round swinging this sword over his head, all evil creatures and characters within a 60-foot-radius hear a disturbing sirenlike sound, audible only to them. Any affected creature or character who fails to save vs. paralyzation will continue to hear the siren ringing in his ears for the next 2-5 (1d4+1) rounds, with similar effects as a deafness spell (unable to hear any sounds, -1 penalty to surprise rolls, and a 20% chance of miscasting spells with verbal components).',
      },
      '4e': {
        description: 'This sword alerts the paladin to the presence of evil by generating a soft hum that only he can hear. The sword detects evil within a 60-foot-radius of the paladin, but does not indicate the direction or intensity of the source. The hum is automatic, so long as the sword remains on the paladin\'s person. The hum is loud enough to awaken the paladin from a normal sleep, alert him to an ambush, or warn him of an evil character behind his back. Otherwise, the sword has all of the benefits and limitations of the paladin\'s detect evil intent ability. Additionally, if the paladin spends one full round swinging this sword over his head, all evil creatures and characters within a 60-foot-radius hear a disturbing sirenlike sound, audible only to them. Any affected creature or character who fails to save vs. paralyzation will continue to hear the siren ringing in his ears for the next 2-5 (1d4+1) rounds, with similar effects as a deafness spell (unable to hear any sounds, -1 penalty to surprise rolls, and a 20% chance of miscasting spells with verbal components).',
        rarity: 'Common',
        level: 3,
        slot: 'Weapon',
        powerText: 'Property: You gain a +1 enhancement bonus to attack and damage rolls with this weapon. Critical: +1d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 1d6 damage.',
      },
      '5e': {
        description: 'This sword alerts the paladin to the presence of evil by generating a soft hum that only he can hear. The sword detects evil within a 60-foot-radius of the paladin, but does not indicate the direction or intensity of the source. The hum is automatic, so long as the sword remains on the paladin\'s person. The hum is loud enough to awaken the paladin from a normal sleep, alert him to an ambush, or warn him of an evil character behind his back. Otherwise, the sword has all of the benefits and limitations of the paladin\'s detect evil intent ability. Additionally, if the paladin spends one full round swinging this sword over his head, all evil creatures and characters within a 60-foot-radius hear a disturbing sirenlike sound, audible only to them. Any affected creature or character who fails to save vs. paralyzation will continue to hear the siren ringing in his ears for the next 2-5 (1d4+1) rounds, with similar effects as a deafness spell (unable to hear any sounds, -1 penalty to surprise rolls, and a 20% chance of miscasting spells with verbal components).',
        rarity: 'Common',
      },
    },
  },
  {
    id: 'weapon-invigorator',
    name: 'Invigorator',
    category: 'Weapon',
    source: 'TcPaH',
    editions: {
      '2e': {
        description: 'If the paladin heals a damaged creature or character by laying on hands, then touches him with this sword, the creature or character regains an additional 1d10 hit points. Further, any creature or character who touches this weapon gains immunity to fear effects for 2-5 (1d4+1) rounds. The sword\'s healing power can be used once per day.',
      },
      '4e': {
        description: 'If the paladin heals a damaged creature or character by laying on hands, then touches him with this sword, the creature or character regains an additional 1d10 hit points. Further, any creature or character who touches this weapon gains immunity to fear effects for 2-5 (1d4+1) rounds. The sword\'s healing power can be used once per day.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'If the paladin heals a damaged creature or character by laying on hands, then touches him with this sword, the creature or character regains an additional 1d10 hit points. Further, any creature or character who touches this weapon gains immunity to fear effects for 2-5 (1d4+1) rounds. The sword\'s healing power can be used once per day.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-hallowed-redeemer',
    name: 'Hallowed redeemer',
    category: 'Weapon',
    source: 'TcPaH',
    editions: {
      '2e': {
        description: 'Not only does this sword project a 10-foot-diameter circle of power, it also causes all evil characters and creatures within the area of effect to succumb to the effects of a fear spell. The fear effects may be avoided by a successful saving throw vs. spell.',
      },
      '4e': {
        description: 'Not only does this sword project a 10-foot-diameter circle of power, it also causes all evil characters and creatures within the area of effect to succumb to the effects of a fear spell. The fear effects may be avoided by a successful saving throw vs. spell.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'Not only does this sword project a 10-foot-diameter circle of power, it also causes all evil characters and creatures within the area of effect to succumb to the effects of a fear spell. The fear effects may be avoided by a successful saving throw vs. spell.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-sword-of-dancing',
    name: 'Sword of Dancing',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'On the first round of melee this weapon is +1, on the second +2, on the third +3, and on the fourth it is +4. On the fifth round, it drops back to +1 and the cycle begins again. In addition, after four rounds of melee its wielder can opt to allow it to "dance." Dancing consists of loosing the sword on any round (after the first) when its bonus is +1. The sword then fights on its own at the same level of experience as its wielder. After four rounds of dancing, the sword returns to its wielder, who must hold it (and use it) for four rounds before it can dance again. In other words, it is loosed to dance for four more rounds, going from +1 to +4, and must then be held by its wielder at a +1 state and physically used for four successive rounds of melee combat. When dancing, the sword will leave its owner\'s hand and may go up to 30 feet distant. At the end of its fourth round of solo combat, it wil move to its possessor\'s hand automatically. Note that when dancing the sword cannot be physically hit, although certain magical attacks such as a fireball, lightning bolt, or transmute metal to wood spell could affect it. Finally, remember that the dancing sword fights alone exactly the same; if a 7th-level thief is the wielder, the sword will so fight when dancing. Relieved of his weapon for four melee rounds, the possessor may act in virtually any manner desired--resting, discharging missiles, drawing another weapon and engaging in hand-to-hand combat, etc.--as long as he remains within 30 feet of the sword. If he moves more than 30 feet from the weapon, it falls lifeless to the ground and is a +1 weapon when again grasped.',
      },
      '4e': {
        description: 'On the first round of melee this weapon is +1, on the second +2, on the third +3, and on the fourth it is +4. On the fifth round, it drops back to +1 and the cycle begins again. In addition, after four rounds of melee its wielder can opt to allow it to "dance." Dancing consists of loosing the sword on any round (after the first) when its bonus is +1. The sword then fights on its own at the same level of experience as its wielder. After four rounds of dancing, the sword returns to its wielder, who must hold it (and use it) for four rounds before it can dance again. In other words, it is loosed to dance for four more rounds, going from +1 to +4, and must then be held by its wielder at a +1 state and physically used for four successive rounds of melee combat. When dancing, the sword will leave its owner\'s hand and may go up to 30 feet distant. At the end of its fourth round of solo combat, it wil move to its possessor\'s hand automatically. Note that when dancing the sword cannot be physically hit, although certain magical attacks such as a fireball, lightning bolt, or transmute metal to wood spell could affect it. Finally, remember that the dancing sword fights alone exactly the same; if a 7th-level thief is the wielder, the sword will so fight when dancing. Relieved of his weapon for four melee rounds, the possessor may act in virtually any manner desired--resting, discharging missiles, drawing another weapon and engaging in hand-to-hand combat, etc.--as long as he remains within 30 feet of the sword. If he moves more than 30 feet from the weapon, it falls lifeless to the ground and is a +1 weapon when again grasped.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'On the first round of melee this weapon is +1, on the second +2, on the third +3, and on the fourth it is +4. On the fifth round, it drops back to +1 and the cycle begins again. In addition, after four rounds of melee its wielder can opt to allow it to "dance." Dancing consists of loosing the sword on any round (after the first) when its bonus is +1. The sword then fights on its own at the same level of experience as its wielder. After four rounds of dancing, the sword returns to its wielder, who must hold it (and use it) for four rounds before it can dance again. In other words, it is loosed to dance for four more rounds, going from +1 to +4, and must then be held by its wielder at a +1 state and physically used for four successive rounds of melee combat. When dancing, the sword will leave its owner\'s hand and may go up to 30 feet distant. At the end of its fourth round of solo combat, it wil move to its possessor\'s hand automatically. Note that when dancing the sword cannot be physically hit, although certain magical attacks such as a fireball, lightning bolt, or transmute metal to wood spell could affect it. Finally, remember that the dancing sword fights alone exactly the same; if a 7th-level thief is the wielder, the sword will so fight when dancing. Relieved of his weapon for four melee rounds, the possessor may act in virtually any manner desired--resting, discharging missiles, drawing another weapon and engaging in hand-to-hand combat, etc.--as long as he remains within 30 feet of the sword. If he moves more than 30 feet from the weapon, it falls lifeless to the ground and is a +1 weapon when again grasped.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-sword-of-wounding',
    name: 'Sword of Wounding',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This is a sword of only +1 bonus, but any hit made with it cannot be healed by regeneration. In subsequent rounds, the opponent so wounded loses one additional hit point for each wound inflicted by the sword. Thus, an opponent hit for four points of damage on the first melee round will automatically lose one additional hit point on the second and each successive round of combat. Loss of the extra point stops only when the creature so wounded bandages its wound or after 10 melee rounds (one turn). Damage from a sword of wounding can be healed only by normal means (rest and time), never by potion, spell, or other magical means short of a wish. Note that successive wounds will damage in the same manner as the first.',
      },
      '4e': {
        description: 'This is a sword of only +1 bonus, but any hit made with it cannot be healed by regeneration. In subsequent rounds, the opponent so wounded loses one additional hit point for each wound inflicted by the sword. Thus, an opponent hit for four points of damage on the first melee round will automatically lose one additional hit point on the second and each successive round of combat. Loss of the extra point stops only when the creature so wounded bandages its wound or after 10 melee rounds (one turn). Damage from a sword of wounding can be healed only by normal means (rest and time), never by potion, spell, or other magical means short of a wish. Note that successive wounds will damage in the same manner as the first.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This is a sword of only +1 bonus, but any hit made with it cannot be healed by regeneration. In subsequent rounds, the opponent so wounded loses one additional hit point for each wound inflicted by the sword. Thus, an opponent hit for four points of damage on the first melee round will automatically lose one additional hit point on the second and each successive round of combat. Loss of the extra point stops only when the creature so wounded bandages its wound or after 10 melee rounds (one turn). Damage from a sword of wounding can be healed only by normal means (rest and time), never by potion, spell, or other magical means short of a wish. Note that successive wounds will damage in the same manner as the first.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-sword-of-life-stealing',
    name: 'Sword of Life Stealing',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This +2 weapon will eliminate one level of experience (or Hit Die) and accompanying hit points and abilities when it strikes any opponent on a natural roll of 20. This function is the same as the level-draining ability of certain undead creatures. The sword wielder can gain as many hit points as an opponent loses to this function of the weapon, up to the maximum number of hit points the character is allowed (i.e., only a character who has suffered loss of hit points can benefit from the function).',
      },
      '4e': {
        description: 'This +2 weapon will eliminate one level of experience (or Hit Die) and accompanying hit points and abilities when it strikes any opponent on a natural roll of 20. This function is the same as the level-draining ability of certain undead creatures. The sword wielder can gain as many hit points as an opponent loses to this function of the weapon, up to the maximum number of hit points the character is allowed (i.e., only a character who has suffered loss of hit points can benefit from the function).',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 necrotic damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This +2 weapon will eliminate one level of experience (or Hit Die) and accompanying hit points and abilities when it strikes any opponent on a natural roll of 20. This function is the same as the level-draining ability of certain undead creatures. The sword wielder can gain as many hit points as an opponent loses to this function of the weapon, up to the maximum number of hit points the character is allowed (i.e., only a character who has suffered loss of hit points can benefit from the function).',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-sword-of-sharpness',
    name: 'Sword of Sharpness',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This weapon is treated as +3 or better for purposes of who or what can be hit by it, even though it gets only a +1 bonus to attack and damage rolls. Its power is great, however, for on a very high attack roll, it will sever an extremity--arm, leg, neck, tail, tentacle, whatever (but not head). Normal/armored opponents require a modified score of 19-21 to sever, larger than man-sized require 20-21, and solid metal or stone require 21. A sword of sharpness will respond to its wielder\'s desire with respect to the light it sheds--none, a 5-foot circle of dim illumination, a 15-foot light, or a 30-foot radius glow equal to a light spell.',
      },
      '4e': {
        description: 'This weapon is treated as +3 or better for purposes of who or what can be hit by it, even though it gets only a +1 bonus to attack and damage rolls. Its power is great, however, for on a very high attack roll, it will sever an extremity--arm, leg, neck, tail, tentacle, whatever (but not head). Normal/armored opponents require a modified score of 19-21 to sever, larger than man-sized require 20-21, and solid metal or stone require 21. A sword of sharpness will respond to its wielder\'s desire with respect to the light it sheds--none, a 5-foot circle of dim illumination, a 15-foot light, or a 30-foot radius glow equal to a light spell.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This weapon is treated as +3 or better for purposes of who or what can be hit by it, even though it gets only a +1 bonus to attack and damage rolls. Its power is great, however, for on a very high attack roll, it will sever an extremity--arm, leg, neck, tail, tentacle, whatever (but not head). Normal/armored opponents require a modified score of 19-21 to sever, larger than man-sized require 20-21, and solid metal or stone require 21. A sword of sharpness will respond to its wielder\'s desire with respect to the light it sheds--none, a 5-foot circle of dim illumination, a 15-foot light, or a 30-foot radius glow equal to a light spell.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-vorpal',
    name: 'Vorpal',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'Similar but superior to a sword of sharpness, a vorpal weapon has a +3 bonus to attack and damage rolls.',
      },
      '4e': {
        description: 'This magical weapon is supernaturally sharp, capable of severing limbs and heads on a devastating strike.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'You have a +1 bonus to attack and damage rolls made with this magic weapon. On a natural 20, the weapon severs a limb or the head (creatures immune to slashing damage are unaffected).',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-sword-of-the-planes',
    name: 'Sword of the Planes',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This magical weapon has a base bonus of +1 on the Prime Material Plane, but on any Inner Plane its bonus increases to +2. (The +2 bonus also applies on the Prime Material Plane when the weapon is used against opponents from the Inner Planes.) Similarly, when used on an Outer Plane or against creatures from the Outer Planes, the sword becomes a +3 weapon. Finally, it operates as a +4 weapon on the Astral or Ethereal Plane or when used against opponents from either of those planes.',
      },
      '4e': {
        description: 'This magical weapon has a base bonus of +1 on the Prime Material Plane, but on any Inner Plane its bonus increases to +2. (The +2 bonus also applies on the Prime Material Plane when the weapon is used against opponents from the Inner Planes.) Similarly, when used on an Outer Plane or against creatures from the Outer Planes, the sword becomes a +3 weapon. Finally, it operates as a +4 weapon on the Astral or Ethereal Plane or when used against opponents from either of those planes.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This magical weapon has a base bonus of +1 on the Prime Material Plane, but on any Inner Plane its bonus increases to +2. (The +2 bonus also applies on the Prime Material Plane when the weapon is used against opponents from the Inner Planes.) Similarly, when used on an Outer Plane or against creatures from the Outer Planes, the sword becomes a +3 weapon. Finally, it operates as a +4 weapon on the Astral or Ethereal Plane or when used against opponents from either of those planes.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-cursed-berserking',
    name: 'Cursed Berserking',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This performs by every test, save that of the heat of battle, as a +2 magical sword of some sort. However, in actual battle its wielder will go berserk, attacking the nearest creature and continuing to fight until dead or until no living thing remains within 60 feet. The sword has a +2 bonus and otherwise acts as a cursed sword +1. The possessor of a cursed berserking sword can be rid of it only if it is exorcised via a remove curse spell or wish.',
      },
      '4e': {
        description: 'This performs by every test, save that of the heat of battle, as a +2 magical sword of some sort. However, in actual battle its wielder will go berserk, attacking the nearest creature and continuing to fight until dead or until no living thing remains within 60 feet. The sword has a +2 bonus and otherwise acts as a cursed sword +1. The possessor of a cursed berserking sword can be rid of it only if it is exorcised via a remove curse spell or wish.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This performs by every test, save that of the heat of battle, as a +2 magical sword of some sort. However, in actual battle its wielder will go berserk, attacking the nearest creature and continuing to fight until dead or until no living thing remains within 60 feet. The sword has a +2 bonus and otherwise acts as a cursed sword +1. The possessor of a cursed berserking sword can be rid of it only if it is exorcised via a remove curse spell or wish.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-thorn-of-sleep',
    name: 'Thorn of Sleep',
    category: 'Weapon',
    source: 'TcRaH',
    editions: {
      '2e': {
        description: 'thorn of sleep looks like the thorn of a plant, about three inches long. It is dry and smooth to the touch. If pricked by the thorn, a creature must make a saving throw vs. paralyzation. Failure means the creature falls into a deep slumber. The creature will not waken until attacked or strongly roused. Noises, even those of battle, will not awaken the sleeping creature. Each thorn can be used but once. Only 1-8 thorns will be found at any one time. A thorn of sleep can be projected by a blowgun.',
      },
      '4e': {
        description: 'thorn of sleep looks like the thorn of a plant, about three inches long. It is dry and smooth to the touch. If pricked by the thorn, a creature must make a saving throw vs. paralyzation. Failure means the creature falls into a deep slumber. The creature will not waken until attacked or strongly roused. Noises, even those of battle, will not awaken the sleeping creature. Each thorn can be used but once. Only 1-8 thorns will be found at any one time. A thorn of sleep can be projected by a blowgun.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'thorn of sleep looks like the thorn of a plant, about three inches long. It is dry and smooth to the touch. If pricked by the thorn, a creature must make a saving throw vs. paralyzation. Failure means the creature falls into a deep slumber. The creature will not waken until attacked or strongly roused. Noises, even those of battle, will not awaken the sleeping creature. Each thorn can be used but once. Only 1-8 thorns will be found at any one time. A thorn of sleep can be projected by a blowgun.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-trident-of-submission',
    name: 'Trident of Submission',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A weapon of this nature appears unremarkable, exactly as any normal trident. The wielder of a trident of submission causes any opponent struck to save vs. spell. If the opponent fails to save, it must check morale the next round instead of attacking; if morale is good, the opponent may act normally next round, but if it is poor, the opponent will cease fighting and surrender, overcome with a feeling of hopelessness. The duration of this hopelessness is 2-8 rounds. Thereafter the creature is normal once again. The trident has 17-20 charges. A trident of this type is a +1 magical weapon.',
      },
      '4e': {
        description: 'A weapon of this nature appears unremarkable, exactly as any normal trident. The wielder of a trident of submission causes any opponent struck to save vs. spell. If the opponent fails to save, it must check morale the next round instead of attacking; if morale is good, the opponent may act normally next round, but if it is poor, the opponent will cease fighting and surrender, overcome with a feeling of hopelessness. The duration of this hopelessness is 2-8 rounds. Thereafter the creature is normal once again. The trident has 17-20 charges. A trident of this type is a +1 magical weapon.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'A weapon of this nature appears unremarkable, exactly as any normal trident. The wielder of a trident of submission causes any opponent struck to save vs. spell. If the opponent fails to save, it must check morale the next round instead of attacking; if morale is good, the opponent may act normally next round, but if it is poor, the opponent will cease fighting and surrender, overcome with a feeling of hopelessness. The duration of this hopelessness is 2-8 rounds. Thereafter the creature is normal once again. The trident has 17-20 charges. A trident of this type is a +1 magical weapon.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-trident-of-fish-command',
    name: 'Trident of Fish Command',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This three-tined fork atop a stout 6-foot long rod appears to be a barbed military fork of some sort. However, its magical properties enable its wielder to cause all fish within a 60-foot radius to roll saving throws vs. spell. This uses one charge of the trident. Fish failing this throw are completely under empathic command and will not attack the possessor of the trident nor any creature within 10 feet of him. The wielder of the device can cause fish to move in whatever direction is desired and can convey messages of emotion (i.e., fear, hunger, anger, indifference, repletion, etc.). Fish making their saving throw are free of empathic control, but they will not approach within 10 feet of the trident. In addition to ordinary fish, the trident affects sharks and eels. It doesn\'t affect mollusks, crustaceans, amphibians, reptiles, mammals, and similar sorts of nonpiscine marine creatures. A school of fish should be checked as a single entity. A trident of this type contains 1d4+16 charges. It is otherwise a +1 magical weapon.',
      },
      '4e': {
        description: 'This three-tined fork atop a stout 6-foot long rod appears to be a barbed military fork of some sort. However, its magical properties enable its wielder to cause all fish within a 60-foot radius to roll saving throws vs. spell. This uses one charge of the trident. Fish failing this throw are completely under empathic command and will not attack the possessor of the trident nor any creature within 10 feet of him. The wielder of the device can cause fish to move in whatever direction is desired and can convey messages of emotion (i.e., fear, hunger, anger, indifference, repletion, etc.). Fish making their saving throw are free of empathic control, but they will not approach within 10 feet of the trident. In addition to ordinary fish, the trident affects sharks and eels. It doesn\'t affect mollusks, crustaceans, amphibians, reptiles, mammals, and similar sorts of nonpiscine marine creatures. A school of fish should be checked as a single entity. A trident of this type contains 1d4+16 charges. It is otherwise a +1 magical weapon.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'This three-tined fork atop a stout 6-foot long rod appears to be a barbed military fork of some sort. However, its magical properties enable its wielder to cause all fish within a 60-foot radius to roll saving throws vs. spell. This uses one charge of the trident. Fish failing this throw are completely under empathic command and will not attack the possessor of the trident nor any creature within 10 feet of him. The wielder of the device can cause fish to move in whatever direction is desired and can convey messages of emotion (i.e., fear, hunger, anger, indifference, repletion, etc.). Fish making their saving throw are free of empathic control, but they will not approach within 10 feet of the trident. In addition to ordinary fish, the trident affects sharks and eels. It doesn\'t affect mollusks, crustaceans, amphibians, reptiles, mammals, and similar sorts of nonpiscine marine creatures. A school of fish should be checked as a single entity. A trident of this type contains 1d4+16 charges. It is otherwise a +1 magical weapon.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-trident-of-warning',
    name: 'Trident of Warning',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A weapon of this type enables its wielder to determine the location, depth, species, and number of hostile or hungry marine predators within 240 feet. A trident of warning must be grasped and pointed in order for the person using it to gain such information, and it requires one round to scan a hemisphere with a radius of 240 feet. There are 19- 24 charges in a trident of this type, each charge sufficient to last for two rounds of scanning. The weapon is otherwise a +2 magical weapon.',
      },
      '4e': {
        description: 'A weapon of this type enables its wielder to determine the location, depth, species, and number of hostile or hungry marine predators within 240 feet. A trident of warning must be grasped and pointed in order for the person using it to gain such information, and it requires one round to scan a hemisphere with a radius of 240 feet. There are 19- 24 charges in a trident of this type, each charge sufficient to last for two rounds of scanning. The weapon is otherwise a +2 magical weapon.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'A weapon of this type enables its wielder to determine the location, depth, species, and number of hostile or hungry marine predators within 240 feet. A trident of warning must be grasped and pointed in order for the person using it to gain such information, and it requires one round to scan a hemisphere with a radius of 240 feet. There are 19- 24 charges in a trident of this type, each charge sufficient to last for two rounds of scanning. The weapon is otherwise a +2 magical weapon.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-trident-of-yearning',
    name: 'Trident of Yearning',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A trident of yearning looks exactly like any normal trident, and its aura is indistinguishable from that other enchanted weapons of this sort. Any character grasping this type of trident immediately feels an overwhelming desire to immerse himself in as great a depth of water as possible. This unquenchable longing causes the affected character to proceed immediately toward the largest/deepest body of water--in any event, one that is sufficient to completely cover his or her person. Once there, he will immerse himself permanently. The character cannot loose his grip on the trident, and only a water breathing spell (after submersion) or a wish will enable the character to do so. The trident is otherwise a - 2 cursed magical weapon. Note that this item does not confer the ability to breathe underwater.',
      },
      '4e': {
        description: 'A trident of yearning looks exactly like any normal trident, and its aura is indistinguishable from that other enchanted weapons of this sort. Any character grasping this type of trident immediately feels an overwhelming desire to immerse himself in as great a depth of water as possible. This unquenchable longing causes the affected character to proceed immediately toward the largest/deepest body of water--in any event, one that is sufficient to completely cover his or her person. Once there, he will immerse himself permanently. The character cannot loose his grip on the trident, and only a water breathing spell (after submersion) or a wish will enable the character to do so. The trident is otherwise a - 2 cursed magical weapon. Note that this item does not confer the ability to breathe underwater.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'A trident of yearning looks exactly like any normal trident, and its aura is indistinguishable from that other enchanted weapons of this sort. Any character grasping this type of trident immediately feels an overwhelming desire to immerse himself in as great a depth of water as possible. This unquenchable longing causes the affected character to proceed immediately toward the largest/deepest body of water--in any event, one that is sufficient to completely cover his or her person. Once there, he will immerse himself permanently. The character cannot loose his grip on the trident, and only a water breathing spell (after submersion) or a wish will enable the character to do so. The trident is otherwise a - 2 cursed magical weapon. Note that this item does not confer the ability to breathe underwater.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'weapon-intelligent-weapons',
    name: 'Intelligent Weapons',
    category: 'Weapon',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'Tables 113 through 119 should be used to determine the properties of an intelligent weapon: the number of powers, unusual properties, alignment, and special purpose of the item (if any). Such weapons are useful to give higher-level fighters some additional tactical options and limited-use special abilities. The DM is encouraged to design unusual magical weapons along special themes and for specific campaign purposes, using the tables as guidelines and for inspiration. Just because a power is rolled doesn\'t mean it must be given out. If the DM feels a combination is too bizarre or powerful, he can simply change or ignore it. The first step in creating an intelligent weapon is to determine its general capabilities. These are found by rolling 1d100 on Table 113. Then, move onto Tables 114-118 until all the capabilities of the weapon have been specified. Table 113: Weapon Intelligence and Capabilities D100 Communication Capabilities Roll Intelligence 01-34 12 Semi-empathy* 1 primary ability 35-59 13 60-79 14 Empathy 2 primary abilities 80-91 15 92-97 16 Speech** 2 primary abiliites 98-00 17 Speech** 3 primary abilities Speech** 3 primary abilities Speech and Telepathy*** 3 primary abilities +1 extraordinary power * The possessor will receive some signal (a throb, of tingle, etc.) and feel urges when its ability functions. ** The weapon will speak the character\'s native tongue plus one or more other tongues as indicated on Table 118 below. *** The weapon can use either communication mode at will, with language use as any speaking weapon. : The weapon can also read languages/maps of any nonmagical type. : The weapon can read languages as well as magical writings. Intelligent Weapon Alignment Any weapon with intelligence will have an alignment. Note that holy avenger swords have alignment restrictions. All cursed weapons are absolutely neutral. Table 114: Weapon Alignment D100 Roll Alignment of Weapon 01-05 Chaotic good 06-15 Chaotic neutral* 16-20 Chaotic evil 21-25 Neutral evil* 26-30 Lawful evil 31-55 Lawful good 56-60 Lawful neutral* 61-80 Neutral (absolute) 81-00 Neutral good* * The item can also be used by any character whose alignment corresponds to the nonneutral alignment portion of the weapon\'s alignment (i.e., chaotic, evil, good, or lawful). Thus any chaotic character can use a weapon with chaotic neutral alignment. Any character whose alignment does not correspond to that of the weapon, except as noted by the asterisk above, will sustain points of damage equal to the number of ego points (see Table 119) of the weapon. This damage is suffered every time (or for every round) the character touches any portion of the weapon unless the weapon is in the grasp or possession of a character whose alignment is compatible with the weapon. Weapon Abilities Using the number of capabilities determined by Table 113, the weapon\'s specific abilities are determined by rolling on the appropriate tables below. Table 115: Weapon Primary Abilities D100 Roll Ability 01-11 Detect "elevator"/shifting rooms/walls in a 10- foot radius 12-22 Detect sloping passages in a 10-foot radius 23-33 Detect traps of large size in a 10-foot radius 34-44 Detect evil/good in a 10-foot radius 45-55 Detect precious metals, kind, and amount in a 20-foot radius 56-66 Detect gems, kind, and number in a 5-foot radiu 67-77 Detect magic in a 10-foot radius 78-82 Detect invisible objects in a 10-foot radius 88-92 Locate object in a 120-foot radius 93-98 Roll twice on this table ignoring scores of 93 99-00 Roll on Table 116 instead If the same ability is rolled twice or more, range of the power is double, triple, etc. All abilities function only when the weapon is held, drawn, and the possessor is concentrating on the desired result. A weapon can perform only one function at a time, and thus can fight or detect but one thing at a time. Other abilities can be created by the DM. Table 116: Weapon Extraordinary Powers D100 Roll Power* 01-07 Charm person on contact--3 times/day 08-15 Clairaudience, 30 yards range--3 times/day, 1 round per use 16-22 Clairvoyance, 30 yards range--3 times/day, 1 round per use 23-28 Determine direction and depth--2 times/day 29-34 ESP, 30 yards range--3 times/day, 1 round per use 35-41 Flying, 120 feet/turn--1 hour/day 42-47 Heal--1 time/day 48-54 Illusion, 120 yards range--2 times/day, as the wand 55-61 Levitation, 1-turn duration--3 times/day, at 6t level of magic use ability 62-67 Strength--1 time/day (upon wielder only) 68-75 Telekinesis, 250 pounds maximum--2 times/day, 1 round each use 76-81 Telepathy, 60 yards range--2 times/day 82-88 Teleportation--1 time/day, 600 pounds maximum, casting time 2 89-94 X-ray vision, 40 yards range--2 times/day, 1 tu per use 95-97 Roll twice on this table ignoring scores of 95- 98-99 Character may choose 1 power from this table 00 Character may choose 1 power from this table, and then roll for a Special Purpose on Table 117 If the same power is rolled twice, the uses/day are doubled, etc. Powers function only when the weapon is drawn and held and the possessor is concentrating upon the desired effect. Most powers require that the character stop and concentrate for a full round. Table 117: Special Purpose Weapons A. Purpose Purpose must suit the type and alignment of the weapon in question. Killing is always restricted to evil when the weapon is of good alignment. Weapons edicated to slaying monsters will always be either good and slay neutral or evil monsters, or evil and slay neutral or good monsters. D100 Roll Purpose s 01-10 Defeat/slay diametrically opposed alignment* 11-20 Defeat priests (of a particular type) 21-30 Defeat fighters 31-40 Defeat wizards to 41-50 Defeat thieves 51-55 Overthrow law and/or chaos 66-75 Defeat good and/or evil 76-95 Defeat nonhuman monsters 96-00 Other * The purpose of the true neutral version of this weapon is to preserve the balance (see "Alignment\'\') by defeating/slaying powerful beings of the extreme alignments (lawful good, lawful evil, chaotic good, chaotic evil). B. Special Purpose Power The power will operate only in pursuit of the special purpose. D100 Roll Power 01-10 blindness* for 2d6 rounds 11-20 confusion* for 2d6 rounds 21-25 disintegrate* 26-55 fear* for 1d4 rounds 56-65 insanity* for 1d4 rounds 66-80 paralysis* for 1d4 rounds 81-00 +2 to all saving throws, -1 to each die of damage sustained * Upon scoring a hit with the weapon unless the opponent succeeds with a saving throw vs. spell. Table 118: Languages Spoken by Weapon h The DM should determine languages spoken by the weapon based on his campaign and the history of the weapon. Thus, an intelligent warhammer rn fashioned by the dwarves would certainly understand dwarvish as one of its powers. D100 Number of Roll Languages 01-40 1 41-70 2 71-85 3 86-95 4 96-99 5 00 6* * Or the result of 2 additional rolls ignoring a scor 00, whichever is the greater. Weapon Ego Only after all aspects of a weapon have been determined and recorded can the ego rating of a weapon be found. Ego, along with intelligence, will be a factor with regard to the dominance of weapon over character, as detailed on Table 119. Table 119: Weapon Ego Ego Points Attribute of Weapon 1 Each + of weapon* 1 Each primary ability** 2 Each extraordinary power** 5 Special purpose 1 Each language spoken 2 Telepathic ability 1 Reading languages ability 2 Reading magic ability * Thus, a sword +1 has one ego point, but if it has a other (higher) plus, these are also counted. For e ple, a flame tongue +1 has a maximum plus of 4, so is +1/+4 for five ego points. In addition, weapon have no extra pluses but extra powers (holy aveng sharpness, etc.) add double their + rating for ego ** If double ability, double ego points. Weapons Versus Characters When a weapon possesses unusual characteristics, it has a personality, which is rated by combining its intelligence and ego scores. The weapon will, of course, be absolutely true to its alignment, and if the character who possesses the weapon is not, personality conflict--weapon versus character-- will result. Similarly, any weapon with an ego of 19 or higher will always consider itself superior to any character, and a personality conflict will result if the possessor does not always agree with the weapon. The personality score of a character is: Intelligence + Charisma + Experience Level Note that the personality score is reduced by one for every group of hit points of damage taken equal to the character\'s average number of points per level. Divide the character\'s total hit points by his level (round up). For example: A fighter of 7th level has 53 hit points: 53 divided by 7 equals 7.6. Thus for every eight points of damage he suffers, his personality score will be lowered by one. Whenever personality conflict occurs, the weapon will resist the character\'s desires and demand concessions such as: 1. Removal of associates, henchmen, hirelings, or creatures of alignment or personality distasteful to the weapon. 2. The character divesting himself of all other magical weapons. 3. Obedience from the character so weapon can lead the expedition for its own purposes e of 4. Immediate seeking out and slaying of creatures hateful to the weapon 5. Encrustation of pommel, hilt, scabbard, baldric, or belt with gems and a special container made of precious substances for its safekeeping. 6. Magical protections and devices to protect it from molestation when not in use 7. That the character pay it handsomely for all abilities and powers the weapon is called upon to exercise in behalf of its possessor 8. That the character carry it with him on all occasions 9. That the character relinquish the weapon in favor of a more suitable person due to alignment differences or conduct Any time the personality score of a weapon exceeds the personality score of the character who possesses it, the weapon will dominate its n- possessor, and it can force any or all of the xam- above demands or actually cause any of the it following actions: s that 1. Force its possessor into combat er, . 2. Refuse to strike opponents 3. Strike at its wielder or his associates 4. Force its possessor to surrender to an opponent 5. Cause itself to drop from the character\'s grasp Naturally, such actions are unlikely where the character-weapon alignment and purposes are harmonious. However, the weapon might well wish to have a lesser character possess it so as to easily command him, or a higher level possessor so as to better accomplish its goals. All magical weapons with personalities will desire to play an important role in the success of activities, particularly combat. Such weapons are rivals of each other, even if of the same alignment. They will be aware of the presence of any similar weapon within 60 feet, and try their best to lead a possessor into missing or destroying the rival unless this is totally inimical to its nature--a holy avenger, for example, would certainly not allow destruction of any other lawful good weapon and might encourage their discovery, even at the risk of having to face grim odds to do so. Weapons of this nature will never be totally controlled or silenced by the characters who possess them, even though they may be heavily outweighed by personality force. They may be powerless to force their demands, but they will be in there plugging. Even a humble +1 weapon of unusual nature can be a vocal martyr, denigrating its own abilities and asking only that the character give it the chance to shatter itself against some hated enemy, etc. Note: Most players will be unwilling to play weapons with personalities as the personalities dictate. It is incumbent upon the DM to ensure that the role of the weapon is played to the hilt, so to speak, with the DM assuming the persons of the weapon if necessary. Appendix NPCs and magic item determination The following is derived from the Monster Manual, AD& NPC Parties To avoid delays, create NPC parties before play. The impartially, and the DM is encouraged to make any cha considered a starting point. A typical NPC party has 2-12 members -- 2-5 majo Characters: The Character Subtable provides a ty the NPC characters encountered. Determine character r the Racial Subtable (multiclass results can exceed th Character Level and Equipment: These will usuall NPC level will rarely exceed 12th. Arms, armor, and e scale or chain armor and minimal gear. At 2nd level, equipment complete (much oil, holy water, mirrors, et if the NPCs are defeated, their magical items will en Character spells: These are selected by the DM a are subject to the limits of spells known. Henchmen s Henchmen: The major NPCs will have a total of 2- men-at-arms. If the encounter is below the 3rd dungeo Henchman class and race is determined as for the order of Charisma, allowing for compatibility (e.g., 8th level have henchmen). A henchman\'s level is one-t master\'s level is above 8th, the henchman has 1 addit mage would have a 2nd level henchman, while an 11th l Henchmen are armed much as major NPCs, though they ar mored. Their magic is assigned as for major NPCs, but Men-at-Arms: Little detail is needed for these o weapons: for example, studded leather, crossbow and d and backpack. They are seldom found underground below Character Subtable Maximum Character Number Dice Score Type* in Party 01-17 Cleric 3 18-20 Druid 2 21-60 Fighter 5 61-62 Paladin 2 63-65 Ranger 2 66-86 Wizard 3 87-88 Specialist 1 89-98 Thief 4 99-00 Bard 1 * Typically, 20% of these will be non-human. Race Subtable Dice Score Race % of Multiclass 15% 01-30 Dwarf* 85%** 25% 31-55 Elf 85%** 10% 56-65 Gnome* 66-90 Half-Elf* 91-00 Halfling* * In an evilly aligned party, these will be half-orcs will be renegade drow). The chance for a multiclass h D 2nd Edition. tables allow such parties to be set up quickly and nges that will enhance play. The tables should be r characters and the rest henchmen or men-at-arms. pical party structure by limiting number and classes of ace (20% demihuman) and demihuman multiclasses on e Character Subtable limits). y be comparable to those of the player characters, but quipment will be typical: a 1st level warrior would have banded or plate mail is typical, weapons profuse, and c.). NPC magic will be used if a fight breaks out. Note that ter your campaign. ccording to those most suited to the NPC party. Wizards pellcasters are treated likewise. 5 henchmen, up to the party size, with any remainder n level, all those with the major NPCs will be henchmen. major characters. Major NPCs are assigned henchmen in a paladin would not follow a thief, nor would a ranger below hird of that of his master (round up or down). If the ional level per 3 full levels of the master. Thus, a 5th level evel mage would have a 5th level henchman (4 + 1). e not as heavily ar- is usually less powerful. ther than hit points. They often have poor armor and few agger, or (at best) scale mail, shield, spear, long sword, the 3rd dungeon level. orc is 50%: fighter-thief (01-33), fighter-cleric (34-45), or cleric-thief (45-50). ** If the roll for multiclass is 01-20, the character is triple-classed. Multiclass levels: For two classes, subtract 1 level; for three classes, subtract 2 levels. Adjust each class downward to the racial maximum, if applicable. Magical Items for NPC Parties Level Chance/No. of Items/Table 1st 10% / 1 / I 2nd 20% / 2 / I (im Original 2 items) 3rd 30% / 2 / I 10% / 1 / II 4th 40% / 2 / I 20% / 1 / II 5th 50% / 2 / I (im Original 2/1) 30% / 1 / II 6th 60% / 3 / I 40% / 2 / II 7th 70% / 3 / I 50% / 2 / II 10% / 1 / III 8th 80% / 3 / I (elves alf- 60% / 2 / II 20% / 1 / III 9th 90% / 3 / I 70% / 2 / II (3/2/1 im Original) 30% / 1 / III 10th * / 3 / I 80% / 3 / II (3/2/1) 40% / 2 / III 11th * / 3 / I 90% / 2 / II 50% / 1 / III (3/2/1/1) 10% / 1 / IV 12th * / 3 / I * / 3 / II 60% / 2 / III 20% / 1 / IV (13th+ * / 3 / I * / 3 / II * / 3 / III 60% / 2 / IV ) * Automatically has this with no roll needed. Use random determination only when any general magical item would be suitable to the individual. Note that some items are in groups or multiples. The following optional tables were added for NPCs of higher level. NEW: Optional tables for level 13 and up 13th+ */ 3 /I */ 3 / II */ 2 / II 70% / 1 / III 30% / 1 / IV 14th+ */ 3 /I */ 3 / II 80% / 3 / III 40% / 2 / IV 15th+ */ 3 /I */ 3 / II 90% / 3 / III 50% / 2 / IV 10% / 1 /V 16th+ */ 3 /I */ 2 / II */ 1 / III 60% / 1 / IV 20% / 1 /V 17th+ */ 3 /I */ 2 / II */ 1 / III 18th+ 70% / 1 / IV 19th+ 30% / 1 /V 20th+ */ 3 /I */ 2 / II */ 1 / III 80% / 1 / IV 40% / 1 /V */ 3 /I */ 2 / II */ 1 / III 90% / 1 / IV 50% / 1 /V 10% / 1 / VI */ 3 /I */ 2 / II */ 1 / III */ 1 / IV 60% / 1 /V 20% / 1 / VI Magical Items for Character Encounters TABLE I Die Roll Item (d20) 1 2 Potions: flying, healing 2 2 Potions: extra-healing, polymorph (self) 3 2 Potions: fire resistance, speed 4 2 Potions: healing, hill giant strength 5 2 Potions: heroism, invulnerability 6 2 Potions: human control, levitation 7 2 Potions: animal control, diminution 8 1 Scroll: 1 spell, level 1-6 9 1 Scroll: 2 spells, level 1-4 10 1 Scroll: protection from magic 11 1 Ring: mammal control 12 1 Ring: protection +1 13 1 Armor: leather +1 14 1 Shield:+1 15 1 Sword: +1 (no special abilities) 16 10 Arrows: +1 17 4 Bolts: +1 18 1 Dagger: +1 19 1 Javelin: +2 20 1 Mace: +1 TABLE II Die 1 Roll Item (d20) 1 1 2 Potions: oil of etherealness, super- heroism 2 2 2 Potions: ESP, gaseous form 3 1 Scroll: 3 Spells, level 2-9 or 2-7 * 4 2 Rings: fire resistance, invisibility 5 1 Ring: protection +2 TA 6 1 Staff: striking 7 1 Wand: magic missiles Di 8 1 Wand: wonder 9 1 bracers of defense AC 4 Ro 10 1 brooch of shielding 11 1 cloak of elvenkind 1 12 1 dust of appearance 13 1 figurine: serpentine owl 2 14 3 javelins of lightning 15 1 jar Keoghtom\'s ointment 3 16 1 robe of useful items 17 1 set: chain mail +1, shield +2 4 18 1 chain mail +3 19 1 Sword: +2 (or +1 with abilities*) 5 20 2 Weapons: crossbow of speed, hammer +1 TABLE III 13 Die 14 Roll 1 Item (d20) 15 2 1 Ring: spell storing 3 1 Ring: mind shielding 16 4 1 Rod: cancellation 5 1 Staff: command 17 6 1 Wand: fear 7 1 Wand: negation 18 8 1 bag of tricks 9 1 boots of speed 10 1 boots of striding and springing 11 1 cloak of displacement 19 12 1 necklace of missiles 13 1 pipes of the sewers 20 14 1 rope of climbing 15 1 rope of entanglement TA 16 1 scarab of protection 17 1 set: plate mail +2, shield +3 D 18 1 Shield: +5 R 19 1 Sword: +3 (or +2 with abilities*) 1 20 1 Mace or hammer: +2 2 1 Spear: +2 3 TABLE IV 5 Die 7 Roll Item (d20) 1 1 Ring: djinni summoning 9 2 1 Ring: human influence 1 3 1 Ring: spell turning 4 1 Rod: smiting 5 1 Rod: terror 1 6 1 Wand: lightning or fire 1 7 1 Wand: illusion 8 1 Staff: thunder & lightning 1 9 1 amulet of life protection 10 1 cube of force 11 1 deck of illusion 12 1 eyes of charming 13 1 helm of teleportation 14 1 horn of blasting 5 1 robe of blending 6 1 stone of good luck 7 1 set: plate mail +3, shield +4 8 1 Sword: +4 (or +3 with abilities*) 9 1 Arrow: of slaying (character class) 0 1 Net: of entrapment Intelligence, if any, will not exceed 16. BLE V (NEW) e ll Item (d20) 1 Ring: protection+3 1 Ring: wizardry , doubles 1st level spells 1 scroll: 5 spells, level 2-9 or 2-7 1 Staff: curing, serpent or swarming insects 1 Wand: lightning 1 Wand: paralyzation 1 bag of holding, 15 lbs., WL: 250 lbs. 1 boots of varied tracks 1 bracers of defense AC 3 1 cloak of protection +3 1 necklace of prayer beads (blessing, curing) 2 Ioun Stones: pale lavender (absorbs up to 4th level spells), pink (+1 to charisma, max 18) 1 figurine: goat of travelling 1 Dagger or sickle +3 1 Mace or hammer or flail +3 10 arrows or bolts or stones or darts +2 1 set: chainmail +3, shield +4 1 set: leather or studded leather +3 (and wooden shield +4 in the case of druids) 1 Sword: +5 (or +4 with abilities*) 1 Spear or Pike or Halberd +3 BLE VI (NEW) ie oll Item (d20) 1 Ring: blinking 1 Ring: jumping 1 Quarterstaff: +3 1 Staff: withering or power 1 Rod: Alertness or Lordly Might 1 Scroll: protection from demons or devils 1 boots of levitation or 1 boots of elvenkind 1 cloak of elvenkind 1 periapt of wound closure 0 1 beaker of plentiful potions 1 1 necklace of adaption 2 2 ioun stones: 1 deep red (+1 to dexterity, max.',
      },
      '4e': {
        description: 'Tables 113 through 119 should be used to determine the properties of an intelligent weapon: the number of powers, unusual properties, alignment, and special purpose of the item (if any). Such weapons are useful to give higher-level fighters some additional tactical options and limited-use special abilities. The DM is encouraged to design unusual magical weapons along special themes and for specific campaign purposes, using the tables as guidelines and for inspiration. Just because a power is rolled doesn\'t mean it must be given out. If the DM feels a combination is too bizarre or powerful, he can simply change or ignore it. The first step in creating an intelligent weapon is to determine its general capabilities. These are found by rolling 1d100 on Table 113. Then, move onto Tables 114-118 until all the capabilities of the weapon have been specified. Table 113: Weapon Intelligence and Capabilities D100 Communication Capabilities Roll Intelligence 01-34 12 Semi-empathy* 1 primary ability 35-59 13 60-79 14 Empathy 2 primary abilities 80-91 15 92-97 16 Speech** 2 primary abiliites 98-00 17 Speech** 3 primary abilities Speech** 3 primary abilities Speech and Telepathy*** 3 primary abilities +1 extraordinary power * The possessor will receive some signal (a throb, of tingle, etc.) and feel urges when its ability functions. ** The weapon will speak the character\'s native tongue plus one or more other tongues as indicated on Table 118 below. *** The weapon can use either communication mode at will, with language use as any speaking weapon. : The weapon can also read languages/maps of any nonmagical type. : The weapon can read languages as well as magical writings. Intelligent Weapon Alignment Any weapon with intelligence will have an alignment. Note that holy avenger swords have alignment restrictions. All cursed weapons are absolutely neutral. Table 114: Weapon Alignment D100 Roll Alignment of Weapon 01-05 Chaotic good 06-15 Chaotic neutral* 16-20 Chaotic evil 21-25 Neutral evil* 26-30 Lawful evil 31-55 Lawful good 56-60 Lawful neutral* 61-80 Neutral (absolute) 81-00 Neutral good* * The item can also be used by any character whose alignment corresponds to the nonneutral alignment portion of the weapon\'s alignment (i.e., chaotic, evil, good, or lawful). Thus any chaotic character can use a weapon with chaotic neutral alignment. Any character whose alignment does not correspond to that of the weapon, except as noted by the asterisk above, will sustain points of damage equal to the number of ego points (see Table 119) of the weapon. This damage is suffered every time (or for every round) the character touches any portion of the weapon unless the weapon is in the grasp or possession of a character whose alignment is compatible with the weapon. Weapon Abilities Using the number of capabilities determined by Table 113, the weapon\'s specific abilities are determined by rolling on the appropriate tables below. Table 115: Weapon Primary Abilities D100 Roll Ability 01-11 Detect "elevator"/shifting rooms/walls in a 10- foot radius 12-22 Detect sloping passages in a 10-foot radius 23-33 Detect traps of large size in a 10-foot radius 34-44 Detect evil/good in a 10-foot radius 45-55 Detect precious metals, kind, and amount in a 20-foot radius 56-66 Detect gems, kind, and number in a 5-foot radiu 67-77 Detect magic in a 10-foot radius 78-82 Detect invisible objects in a 10-foot radius 88-92 Locate object in a 120-foot radius 93-98 Roll twice on this table ignoring scores of 93 99-00 Roll on Table 116 instead If the same ability is rolled twice or more, range of the power is double, triple, etc. All abilities function only when the weapon is held, drawn, and the possessor is concentrating on the desired result. A weapon can perform only one function at a time, and thus can fight or detect but one thing at a time. Other abilities can be created by the DM. Table 116: Weapon Extraordinary Powers D100 Roll Power* 01-07 Charm person on contact--3 times/day 08-15 Clairaudience, 30 yards range--3 times/day, 1 round per use 16-22 Clairvoyance, 30 yards range--3 times/day, 1 round per use 23-28 Determine direction and depth--2 times/day 29-34 ESP, 30 yards range--3 times/day, 1 round per use 35-41 Flying, 120 feet/turn--1 hour/day 42-47 Heal--1 time/day 48-54 Illusion, 120 yards range--2 times/day, as the wand 55-61 Levitation, 1-turn duration--3 times/day, at 6t level of magic use ability 62-67 Strength--1 time/day (upon wielder only) 68-75 Telekinesis, 250 pounds maximum--2 times/day, 1 round each use 76-81 Telepathy, 60 yards range--2 times/day 82-88 Teleportation--1 time/day, 600 pounds maximum, casting time 2 89-94 X-ray vision, 40 yards range--2 times/day, 1 tu per use 95-97 Roll twice on this table ignoring scores of 95- 98-99 Character may choose 1 power from this table 00 Character may choose 1 power from this table, and then roll for a Special Purpose on Table 117 If the same power is rolled twice, the uses/day are doubled, etc. Powers function only when the weapon is drawn and held and the possessor is concentrating upon the desired effect. Most powers require that the character stop and concentrate for a full round. Table 117: Special Purpose Weapons A. Purpose Purpose must suit the type and alignment of the weapon in question. Killing is always restricted to evil when the weapon is of good alignment. Weapons edicated to slaying monsters will always be either good and slay neutral or evil monsters, or evil and slay neutral or good monsters. D100 Roll Purpose s 01-10 Defeat/slay diametrically opposed alignment* 11-20 Defeat priests (of a particular type) 21-30 Defeat fighters 31-40 Defeat wizards to 41-50 Defeat thieves 51-55 Overthrow law and/or chaos 66-75 Defeat good and/or evil 76-95 Defeat nonhuman monsters 96-00 Other * The purpose of the true neutral version of this weapon is to preserve the balance (see "Alignment\'\') by defeating/slaying powerful beings of the extreme alignments (lawful good, lawful evil, chaotic good, chaotic evil). B. Special Purpose Power The power will operate only in pursuit of the special purpose. D100 Roll Power 01-10 blindness* for 2d6 rounds 11-20 confusion* for 2d6 rounds 21-25 disintegrate* 26-55 fear* for 1d4 rounds 56-65 insanity* for 1d4 rounds 66-80 paralysis* for 1d4 rounds 81-00 +2 to all saving throws, -1 to each die of damage sustained * Upon scoring a hit with the weapon unless the opponent succeeds with a saving throw vs. spell. Table 118: Languages Spoken by Weapon h The DM should determine languages spoken by the weapon based on his campaign and the history of the weapon. Thus, an intelligent warhammer rn fashioned by the dwarves would certainly understand dwarvish as one of its powers. D100 Number of Roll Languages 01-40 1 41-70 2 71-85 3 86-95 4 96-99 5 00 6* * Or the result of 2 additional rolls ignoring a scor 00, whichever is the greater. Weapon Ego Only after all aspects of a weapon have been determined and recorded can the ego rating of a weapon be found. Ego, along with intelligence, will be a factor with regard to the dominance of weapon over character, as detailed on Table 119. Table 119: Weapon Ego Ego Points Attribute of Weapon 1 Each + of weapon* 1 Each primary ability** 2 Each extraordinary power** 5 Special purpose 1 Each language spoken 2 Telepathic ability 1 Reading languages ability 2 Reading magic ability * Thus, a sword +1 has one ego point, but if it has a other (higher) plus, these are also counted. For e ple, a flame tongue +1 has a maximum plus of 4, so is +1/+4 for five ego points. In addition, weapon have no extra pluses but extra powers (holy aveng sharpness, etc.) add double their + rating for ego ** If double ability, double ego points. Weapons Versus Characters When a weapon possesses unusual characteristics, it has a personality, which is rated by combining its intelligence and ego scores. The weapon will, of course, be absolutely true to its alignment, and if the character who possesses the weapon is not, personality conflict--weapon versus character-- will result. Similarly, any weapon with an ego of 19 or higher will always consider itself superior to any character, and a personality conflict will result if the possessor does not always agree with the weapon. The personality score of a character is: Intelligence + Charisma + Experience Level Note that the personality score is reduced by one for every group of hit points of damage taken equal to the character\'s average number of points per level. Divide the character\'s total hit points by his level (round up). For example: A fighter of 7th level has 53 hit points: 53 divided by 7 equals 7.6. Thus for every eight points of damage he suffers, his personality score will be lowered by one. Whenever personality conflict occurs, the weapon will resist the character\'s desires and demand concessions such as: 1. Removal of associates, henchmen, hirelings, or creatures of alignment or personality distasteful to the weapon. 2. The character divesting himself of all other magical weapons. 3. Obedience from the character so weapon can lead the expedition for its own purposes e of 4. Immediate seeking out and slaying of creatures hateful to the weapon 5. Encrustation of pommel, hilt, scabbard, baldric, or belt with gems and a special container made of precious substances for its safekeeping. 6. Magical protections and devices to protect it from molestation when not in use 7. That the character pay it handsomely for all abilities and powers the weapon is called upon to exercise in behalf of its possessor 8. That the character carry it with him on all occasions 9. That the character relinquish the weapon in favor of a more suitable person due to alignment differences or conduct Any time the personality score of a weapon exceeds the personality score of the character who possesses it, the weapon will dominate its n- possessor, and it can force any or all of the xam- above demands or actually cause any of the it following actions: s that 1. Force its possessor into combat er, . 2. Refuse to strike opponents 3. Strike at its wielder or his associates 4. Force its possessor to surrender to an opponent 5. Cause itself to drop from the character\'s grasp Naturally, such actions are unlikely where the character-weapon alignment and purposes are harmonious. However, the weapon might well wish to have a lesser character possess it so as to easily command him, or a higher level possessor so as to better accomplish its goals. All magical weapons with personalities will desire to play an important role in the success of activities, particularly combat. Such weapons are rivals of each other, even if of the same alignment. They will be aware of the presence of any similar weapon within 60 feet, and try their best to lead a possessor into missing or destroying the rival unless this is totally inimical to its nature--a holy avenger, for example, would certainly not allow destruction of any other lawful good weapon and might encourage their discovery, even at the risk of having to face grim odds to do so. Weapons of this nature will never be totally controlled or silenced by the characters who possess them, even though they may be heavily outweighed by personality force. They may be powerless to force their demands, but they will be in there plugging. Even a humble +1 weapon of unusual nature can be a vocal martyr, denigrating its own abilities and asking only that the character give it the chance to shatter itself against some hated enemy, etc. Note: Most players will be unwilling to play weapons with personalities as the personalities dictate. It is incumbent upon the DM to ensure that the role of the weapon is played to the hilt, so to speak, with the DM assuming the persons of the weapon if necessary. Appendix NPCs and magic item determination The following is derived from the Monster Manual, AD& NPC Parties To avoid delays, create NPC parties before play. The impartially, and the DM is encouraged to make any cha considered a starting point. A typical NPC party has 2-12 members -- 2-5 majo Characters: The Character Subtable provides a ty the NPC characters encountered. Determine character r the Racial Subtable (multiclass results can exceed th Character Level and Equipment: These will usuall NPC level will rarely exceed 12th. Arms, armor, and e scale or chain armor and minimal gear. At 2nd level, equipment complete (much oil, holy water, mirrors, et if the NPCs are defeated, their magical items will en Character spells: These are selected by the DM a are subject to the limits of spells known. Henchmen s Henchmen: The major NPCs will have a total of 2- men-at-arms. If the encounter is below the 3rd dungeo Henchman class and race is determined as for the order of Charisma, allowing for compatibility (e.g., 8th level have henchmen). A henchman\'s level is one-t master\'s level is above 8th, the henchman has 1 addit mage would have a 2nd level henchman, while an 11th l Henchmen are armed much as major NPCs, though they ar mored. Their magic is assigned as for major NPCs, but Men-at-Arms: Little detail is needed for these o weapons: for example, studded leather, crossbow and d and backpack. They are seldom found underground below Character Subtable Maximum Character Number Dice Score Type* in Party 01-17 Cleric 3 18-20 Druid 2 21-60 Fighter 5 61-62 Paladin 2 63-65 Ranger 2 66-86 Wizard 3 87-88 Specialist 1 89-98 Thief 4 99-00 Bard 1 * Typically, 20% of these will be non-human. Race Subtable Dice Score Race % of Multiclass 15% 01-30 Dwarf* 85%** 25% 31-55 Elf 85%** 10% 56-65 Gnome* 66-90 Half-Elf* 91-00 Halfling* * In an evilly aligned party, these will be half-orcs will be renegade drow). The chance for a multiclass h D 2nd Edition. tables allow such parties to be set up quickly and nges that will enhance play. The tables should be r characters and the rest henchmen or men-at-arms. pical party structure by limiting number and classes of ace (20% demihuman) and demihuman multiclasses on e Character Subtable limits). y be comparable to those of the player characters, but quipment will be typical: a 1st level warrior would have banded or plate mail is typical, weapons profuse, and c.). NPC magic will be used if a fight breaks out. Note that ter your campaign. ccording to those most suited to the NPC party. Wizards pellcasters are treated likewise. 5 henchmen, up to the party size, with any remainder n level, all those with the major NPCs will be henchmen. major characters. Major NPCs are assigned henchmen in a paladin would not follow a thief, nor would a ranger below hird of that of his master (round up or down). If the ional level per 3 full levels of the master. Thus, a 5th level evel mage would have a 5th level henchman (4 + 1). e not as heavily ar- is usually less powerful. ther than hit points. They often have poor armor and few agger, or (at best) scale mail, shield, spear, long sword, the 3rd dungeon level. orc is 50%: fighter-thief (01-33), fighter-cleric (34-45), or cleric-thief (45-50). ** If the roll for multiclass is 01-20, the character is triple-classed. Multiclass levels: For two classes, subtract 1 level; for three classes, subtract 2 levels. Adjust each class downward to the racial maximum, if applicable. Magical Items for NPC Parties Level Chance/No. of Items/Table 1st 10% / 1 / I 2nd 20% / 2 / I (im Original 2 items) 3rd 30% / 2 / I 10% / 1 / II 4th 40% / 2 / I 20% / 1 / II 5th 50% / 2 / I (im Original 2/1) 30% / 1 / II 6th 60% / 3 / I 40% / 2 / II 7th 70% / 3 / I 50% / 2 / II 10% / 1 / III 8th 80% / 3 / I (elves alf- 60% / 2 / II 20% / 1 / III 9th 90% / 3 / I 70% / 2 / II (3/2/1 im Original) 30% / 1 / III 10th * / 3 / I 80% / 3 / II (3/2/1) 40% / 2 / III 11th * / 3 / I 90% / 2 / II 50% / 1 / III (3/2/1/1) 10% / 1 / IV 12th * / 3 / I * / 3 / II 60% / 2 / III 20% / 1 / IV (13th+ * / 3 / I * / 3 / II * / 3 / III 60% / 2 / IV ) * Automatically has this with no roll needed. Use random determination only when any general magical item would be suitable to the individual. Note that some items are in groups or multiples. The following optional tables were added for NPCs of higher level. NEW: Optional tables for level 13 and up 13th+ */ 3 /I */ 3 / II */ 2 / II 70% / 1 / III 30% / 1 / IV 14th+ */ 3 /I */ 3 / II 80% / 3 / III 40% / 2 / IV 15th+ */ 3 /I */ 3 / II 90% / 3 / III 50% / 2 / IV 10% / 1 /V 16th+ */ 3 /I */ 2 / II */ 1 / III 60% / 1 / IV 20% / 1 /V 17th+ */ 3 /I */ 2 / II */ 1 / III 18th+ 70% / 1 / IV 19th+ 30% / 1 /V 20th+ */ 3 /I */ 2 / II */ 1 / III 80% / 1 / IV 40% / 1 /V */ 3 /I */ 2 / II */ 1 / III 90% / 1 / IV 50% / 1 /V 10% / 1 / VI */ 3 /I */ 2 / II */ 1 / III */ 1 / IV 60% / 1 /V 20% / 1 / VI Magical Items for Character Encounters TABLE I Die Roll Item (d20) 1 2 Potions: flying, healing 2 2 Potions: extra-healing, polymorph (self) 3 2 Potions: fire resistance, speed 4 2 Potions: healing, hill giant strength 5 2 Potions: heroism, invulnerability 6 2 Potions: human control, levitation 7 2 Potions: animal control, diminution 8 1 Scroll: 1 spell, level 1-6 9 1 Scroll: 2 spells, level 1-4 10 1 Scroll: protection from magic 11 1 Ring: mammal control 12 1 Ring: protection +1 13 1 Armor: leather +1 14 1 Shield:+1 15 1 Sword: +1 (no special abilities) 16 10 Arrows: +1 17 4 Bolts: +1 18 1 Dagger: +1 19 1 Javelin: +2 20 1 Mace: +1 TABLE II Die 1 Roll Item (d20) 1 1 2 Potions: oil of etherealness, super- heroism 2 2 2 Potions: ESP, gaseous form 3 1 Scroll: 3 Spells, level 2-9 or 2-7 * 4 2 Rings: fire resistance, invisibility 5 1 Ring: protection +2 TA 6 1 Staff: striking 7 1 Wand: magic missiles Di 8 1 Wand: wonder 9 1 bracers of defense AC 4 Ro 10 1 brooch of shielding 11 1 cloak of elvenkind 1 12 1 dust of appearance 13 1 figurine: serpentine owl 2 14 3 javelins of lightning 15 1 jar Keoghtom\'s ointment 3 16 1 robe of useful items 17 1 set: chain mail +1, shield +2 4 18 1 chain mail +3 19 1 Sword: +2 (or +1 with abilities*) 5 20 2 Weapons: crossbow of speed, hammer +1 TABLE III 13 Die 14 Roll 1 Item (d20) 15 2 1 Ring: spell storing 3 1 Ring: mind shielding 16 4 1 Rod: cancellation 5 1 Staff: command 17 6 1 Wand: fear 7 1 Wand: negation 18 8 1 bag of tricks 9 1 boots of speed 10 1 boots of striding and springing 11 1 cloak of displacement 19 12 1 necklace of missiles 13 1 pipes of the sewers 20 14 1 rope of climbing 15 1 rope of entanglement TA 16 1 scarab of protection 17 1 set: plate mail +2, shield +3 D 18 1 Shield: +5 R 19 1 Sword: +3 (or +2 with abilities*) 1 20 1 Mace or hammer: +2 2 1 Spear: +2 3 TABLE IV 5 Die 7 Roll Item (d20) 1 1 Ring: djinni summoning 9 2 1 Ring: human influence 1 3 1 Ring: spell turning 4 1 Rod: smiting 5 1 Rod: terror 1 6 1 Wand: lightning or fire 1 7 1 Wand: illusion 8 1 Staff: thunder & lightning 1 9 1 amulet of life protection 10 1 cube of force 11 1 deck of illusion 12 1 eyes of charming 13 1 helm of teleportation 14 1 horn of blasting 5 1 robe of blending 6 1 stone of good luck 7 1 set: plate mail +3, shield +4 8 1 Sword: +4 (or +3 with abilities*) 9 1 Arrow: of slaying (character class) 0 1 Net: of entrapment Intelligence, if any, will not exceed 16. BLE V (NEW) e ll Item (d20) 1 Ring: protection+3 1 Ring: wizardry , doubles 1st level spells 1 scroll: 5 spells, level 2-9 or 2-7 1 Staff: curing, serpent or swarming insects 1 Wand: lightning 1 Wand: paralyzation 1 bag of holding, 15 lbs., WL: 250 lbs. 1 boots of varied tracks 1 bracers of defense AC 3 1 cloak of protection +3 1 necklace of prayer beads (blessing, curing) 2 Ioun Stones: pale lavender (absorbs up to 4th level spells), pink (+1 to charisma, max 18) 1 figurine: goat of travelling 1 Dagger or sickle +3 1 Mace or hammer or flail +3 10 arrows or bolts or stones or darts +2 1 set: chainmail +3, shield +4 1 set: leather or studded leather +3 (and wooden shield +4 in the case of druids) 1 Sword: +5 (or +4 with abilities*) 1 Spear or Pike or Halberd +3 BLE VI (NEW) ie oll Item (d20) 1 Ring: blinking 1 Ring: jumping 1 Quarterstaff: +3 1 Staff: withering or power 1 Rod: Alertness or Lordly Might 1 Scroll: protection from demons or devils 1 boots of levitation or 1 boots of elvenkind 1 cloak of elvenkind 1 periapt of wound closure 0 1 beaker of plentiful potions 1 1 necklace of adaption 2 2 ioun stones: 1 deep red (+1 to dexterity, max.',
        rarity: 'Uncommon',
        level: 10,
        slot: 'Weapon',
        powerText: 'Property: You gain a +2 enhancement bonus to attack and damage rolls with this weapon. Critical: +2d6 extra damage. Power (Daily): Free Action. Trigger: You hit with this weapon. Effect: The target takes an extra 2d6 damage.',
      },
      '5e': {
        description: 'Tables 113 through 119 should be used to determine the properties of an intelligent weapon: the number of powers, unusual properties, alignment, and special purpose of the item (if any). Such weapons are useful to give higher-level fighters some additional tactical options and limited-use special abilities. The DM is encouraged to design unusual magical weapons along special themes and for specific campaign purposes, using the tables as guidelines and for inspiration. Just because a power is rolled doesn\'t mean it must be given out. If the DM feels a combination is too bizarre or powerful, he can simply change or ignore it. The first step in creating an intelligent weapon is to determine its general capabilities. These are found by rolling 1d100 on Table 113. Then, move onto Tables 114-118 until all the capabilities of the weapon have been specified. Table 113: Weapon Intelligence and Capabilities D100 Communication Capabilities Roll Intelligence 01-34 12 Semi-empathy* 1 primary ability 35-59 13 60-79 14 Empathy 2 primary abilities 80-91 15 92-97 16 Speech** 2 primary abiliites 98-00 17 Speech** 3 primary abilities Speech** 3 primary abilities Speech and Telepathy*** 3 primary abilities +1 extraordinary power * The possessor will receive some signal (a throb, of tingle, etc.) and feel urges when its ability functions. ** The weapon will speak the character\'s native tongue plus one or more other tongues as indicated on Table 118 below. *** The weapon can use either communication mode at will, with language use as any speaking weapon. : The weapon can also read languages/maps of any nonmagical type. : The weapon can read languages as well as magical writings. Intelligent Weapon Alignment Any weapon with intelligence will have an alignment. Note that holy avenger swords have alignment restrictions. All cursed weapons are absolutely neutral. Table 114: Weapon Alignment D100 Roll Alignment of Weapon 01-05 Chaotic good 06-15 Chaotic neutral* 16-20 Chaotic evil 21-25 Neutral evil* 26-30 Lawful evil 31-55 Lawful good 56-60 Lawful neutral* 61-80 Neutral (absolute) 81-00 Neutral good* * The item can also be used by any character whose alignment corresponds to the nonneutral alignment portion of the weapon\'s alignment (i.e., chaotic, evil, good, or lawful). Thus any chaotic character can use a weapon with chaotic neutral alignment. Any character whose alignment does not correspond to that of the weapon, except as noted by the asterisk above, will sustain points of damage equal to the number of ego points (see Table 119) of the weapon. This damage is suffered every time (or for every round) the character touches any portion of the weapon unless the weapon is in the grasp or possession of a character whose alignment is compatible with the weapon. Weapon Abilities Using the number of capabilities determined by Table 113, the weapon\'s specific abilities are determined by rolling on the appropriate tables below. Table 115: Weapon Primary Abilities D100 Roll Ability 01-11 Detect "elevator"/shifting rooms/walls in a 10- foot radius 12-22 Detect sloping passages in a 10-foot radius 23-33 Detect traps of large size in a 10-foot radius 34-44 Detect evil/good in a 10-foot radius 45-55 Detect precious metals, kind, and amount in a 20-foot radius 56-66 Detect gems, kind, and number in a 5-foot radiu 67-77 Detect magic in a 10-foot radius 78-82 Detect invisible objects in a 10-foot radius 88-92 Locate object in a 120-foot radius 93-98 Roll twice on this table ignoring scores of 93 99-00 Roll on Table 116 instead If the same ability is rolled twice or more, range of the power is double, triple, etc. All abilities function only when the weapon is held, drawn, and the possessor is concentrating on the desired result. A weapon can perform only one function at a time, and thus can fight or detect but one thing at a time. Other abilities can be created by the DM. Table 116: Weapon Extraordinary Powers D100 Roll Power* 01-07 Charm person on contact--3 times/day 08-15 Clairaudience, 30 yards range--3 times/day, 1 round per use 16-22 Clairvoyance, 30 yards range--3 times/day, 1 round per use 23-28 Determine direction and depth--2 times/day 29-34 ESP, 30 yards range--3 times/day, 1 round per use 35-41 Flying, 120 feet/turn--1 hour/day 42-47 Heal--1 time/day 48-54 Illusion, 120 yards range--2 times/day, as the wand 55-61 Levitation, 1-turn duration--3 times/day, at 6t level of magic use ability 62-67 Strength--1 time/day (upon wielder only) 68-75 Telekinesis, 250 pounds maximum--2 times/day, 1 round each use 76-81 Telepathy, 60 yards range--2 times/day 82-88 Teleportation--1 time/day, 600 pounds maximum, casting time 2 89-94 X-ray vision, 40 yards range--2 times/day, 1 tu per use 95-97 Roll twice on this table ignoring scores of 95- 98-99 Character may choose 1 power from this table 00 Character may choose 1 power from this table, and then roll for a Special Purpose on Table 117 If the same power is rolled twice, the uses/day are doubled, etc. Powers function only when the weapon is drawn and held and the possessor is concentrating upon the desired effect. Most powers require that the character stop and concentrate for a full round. Table 117: Special Purpose Weapons A. Purpose Purpose must suit the type and alignment of the weapon in question. Killing is always restricted to evil when the weapon is of good alignment. Weapons edicated to slaying monsters will always be either good and slay neutral or evil monsters, or evil and slay neutral or good monsters. D100 Roll Purpose s 01-10 Defeat/slay diametrically opposed alignment* 11-20 Defeat priests (of a particular type) 21-30 Defeat fighters 31-40 Defeat wizards to 41-50 Defeat thieves 51-55 Overthrow law and/or chaos 66-75 Defeat good and/or evil 76-95 Defeat nonhuman monsters 96-00 Other * The purpose of the true neutral version of this weapon is to preserve the balance (see "Alignment\'\') by defeating/slaying powerful beings of the extreme alignments (lawful good, lawful evil, chaotic good, chaotic evil). B. Special Purpose Power The power will operate only in pursuit of the special purpose. D100 Roll Power 01-10 blindness* for 2d6 rounds 11-20 confusion* for 2d6 rounds 21-25 disintegrate* 26-55 fear* for 1d4 rounds 56-65 insanity* for 1d4 rounds 66-80 paralysis* for 1d4 rounds 81-00 +2 to all saving throws, -1 to each die of damage sustained * Upon scoring a hit with the weapon unless the opponent succeeds with a saving throw vs. spell. Table 118: Languages Spoken by Weapon h The DM should determine languages spoken by the weapon based on his campaign and the history of the weapon. Thus, an intelligent warhammer rn fashioned by the dwarves would certainly understand dwarvish as one of its powers. D100 Number of Roll Languages 01-40 1 41-70 2 71-85 3 86-95 4 96-99 5 00 6* * Or the result of 2 additional rolls ignoring a scor 00, whichever is the greater. Weapon Ego Only after all aspects of a weapon have been determined and recorded can the ego rating of a weapon be found. Ego, along with intelligence, will be a factor with regard to the dominance of weapon over character, as detailed on Table 119. Table 119: Weapon Ego Ego Points Attribute of Weapon 1 Each + of weapon* 1 Each primary ability** 2 Each extraordinary power** 5 Special purpose 1 Each language spoken 2 Telepathic ability 1 Reading languages ability 2 Reading magic ability * Thus, a sword +1 has one ego point, but if it has a other (higher) plus, these are also counted. For e ple, a flame tongue +1 has a maximum plus of 4, so is +1/+4 for five ego points. In addition, weapon have no extra pluses but extra powers (holy aveng sharpness, etc.) add double their + rating for ego ** If double ability, double ego points. Weapons Versus Characters When a weapon possesses unusual characteristics, it has a personality, which is rated by combining its intelligence and ego scores. The weapon will, of course, be absolutely true to its alignment, and if the character who possesses the weapon is not, personality conflict--weapon versus character-- will result. Similarly, any weapon with an ego of 19 or higher will always consider itself superior to any character, and a personality conflict will result if the possessor does not always agree with the weapon. The personality score of a character is: Intelligence + Charisma + Experience Level Note that the personality score is reduced by one for every group of hit points of damage taken equal to the character\'s average number of points per level. Divide the character\'s total hit points by his level (round up). For example: A fighter of 7th level has 53 hit points: 53 divided by 7 equals 7.6. Thus for every eight points of damage he suffers, his personality score will be lowered by one. Whenever personality conflict occurs, the weapon will resist the character\'s desires and demand concessions such as: 1. Removal of associates, henchmen, hirelings, or creatures of alignment or personality distasteful to the weapon. 2. The character divesting himself of all other magical weapons. 3. Obedience from the character so weapon can lead the expedition for its own purposes e of 4. Immediate seeking out and slaying of creatures hateful to the weapon 5. Encrustation of pommel, hilt, scabbard, baldric, or belt with gems and a special container made of precious substances for its safekeeping. 6. Magical protections and devices to protect it from molestation when not in use 7. That the character pay it handsomely for all abilities and powers the weapon is called upon to exercise in behalf of its possessor 8. That the character carry it with him on all occasions 9. That the character relinquish the weapon in favor of a more suitable person due to alignment differences or conduct Any time the personality score of a weapon exceeds the personality score of the character who possesses it, the weapon will dominate its n- possessor, and it can force any or all of the xam- above demands or actually cause any of the it following actions: s that 1. Force its possessor into combat er, . 2. Refuse to strike opponents 3. Strike at its wielder or his associates 4. Force its possessor to surrender to an opponent 5. Cause itself to drop from the character\'s grasp Naturally, such actions are unlikely where the character-weapon alignment and purposes are harmonious. However, the weapon might well wish to have a lesser character possess it so as to easily command him, or a higher level possessor so as to better accomplish its goals. All magical weapons with personalities will desire to play an important role in the success of activities, particularly combat. Such weapons are rivals of each other, even if of the same alignment. They will be aware of the presence of any similar weapon within 60 feet, and try their best to lead a possessor into missing or destroying the rival unless this is totally inimical to its nature--a holy avenger, for example, would certainly not allow destruction of any other lawful good weapon and might encourage their discovery, even at the risk of having to face grim odds to do so. Weapons of this nature will never be totally controlled or silenced by the characters who possess them, even though they may be heavily outweighed by personality force. They may be powerless to force their demands, but they will be in there plugging. Even a humble +1 weapon of unusual nature can be a vocal martyr, denigrating its own abilities and asking only that the character give it the chance to shatter itself against some hated enemy, etc. Note: Most players will be unwilling to play weapons with personalities as the personalities dictate. It is incumbent upon the DM to ensure that the role of the weapon is played to the hilt, so to speak, with the DM assuming the persons of the weapon if necessary. Appendix NPCs and magic item determination The following is derived from the Monster Manual, AD& NPC Parties To avoid delays, create NPC parties before play. The impartially, and the DM is encouraged to make any cha considered a starting point. A typical NPC party has 2-12 members -- 2-5 majo Characters: The Character Subtable provides a ty the NPC characters encountered. Determine character r the Racial Subtable (multiclass results can exceed th Character Level and Equipment: These will usuall NPC level will rarely exceed 12th. Arms, armor, and e scale or chain armor and minimal gear. At 2nd level, equipment complete (much oil, holy water, mirrors, et if the NPCs are defeated, their magical items will en Character spells: These are selected by the DM a are subject to the limits of spells known. Henchmen s Henchmen: The major NPCs will have a total of 2- men-at-arms. If the encounter is below the 3rd dungeo Henchman class and race is determined as for the order of Charisma, allowing for compatibility (e.g., 8th level have henchmen). A henchman\'s level is one-t master\'s level is above 8th, the henchman has 1 addit mage would have a 2nd level henchman, while an 11th l Henchmen are armed much as major NPCs, though they ar mored. Their magic is assigned as for major NPCs, but Men-at-Arms: Little detail is needed for these o weapons: for example, studded leather, crossbow and d and backpack. They are seldom found underground below Character Subtable Maximum Character Number Dice Score Type* in Party 01-17 Cleric 3 18-20 Druid 2 21-60 Fighter 5 61-62 Paladin 2 63-65 Ranger 2 66-86 Wizard 3 87-88 Specialist 1 89-98 Thief 4 99-00 Bard 1 * Typically, 20% of these will be non-human. Race Subtable Dice Score Race % of Multiclass 15% 01-30 Dwarf* 85%** 25% 31-55 Elf 85%** 10% 56-65 Gnome* 66-90 Half-Elf* 91-00 Halfling* * In an evilly aligned party, these will be half-orcs will be renegade drow). The chance for a multiclass h D 2nd Edition. tables allow such parties to be set up quickly and nges that will enhance play. The tables should be r characters and the rest henchmen or men-at-arms. pical party structure by limiting number and classes of ace (20% demihuman) and demihuman multiclasses on e Character Subtable limits). y be comparable to those of the player characters, but quipment will be typical: a 1st level warrior would have banded or plate mail is typical, weapons profuse, and c.). NPC magic will be used if a fight breaks out. Note that ter your campaign. ccording to those most suited to the NPC party. Wizards pellcasters are treated likewise. 5 henchmen, up to the party size, with any remainder n level, all those with the major NPCs will be henchmen. major characters. Major NPCs are assigned henchmen in a paladin would not follow a thief, nor would a ranger below hird of that of his master (round up or down). If the ional level per 3 full levels of the master. Thus, a 5th level evel mage would have a 5th level henchman (4 + 1). e not as heavily ar- is usually less powerful. ther than hit points. They often have poor armor and few agger, or (at best) scale mail, shield, spear, long sword, the 3rd dungeon level. orc is 50%: fighter-thief (01-33), fighter-cleric (34-45), or cleric-thief (45-50). ** If the roll for multiclass is 01-20, the character is triple-classed. Multiclass levels: For two classes, subtract 1 level; for three classes, subtract 2 levels. Adjust each class downward to the racial maximum, if applicable. Magical Items for NPC Parties Level Chance/No. of Items/Table 1st 10% / 1 / I 2nd 20% / 2 / I (im Original 2 items) 3rd 30% / 2 / I 10% / 1 / II 4th 40% / 2 / I 20% / 1 / II 5th 50% / 2 / I (im Original 2/1) 30% / 1 / II 6th 60% / 3 / I 40% / 2 / II 7th 70% / 3 / I 50% / 2 / II 10% / 1 / III 8th 80% / 3 / I (elves alf- 60% / 2 / II 20% / 1 / III 9th 90% / 3 / I 70% / 2 / II (3/2/1 im Original) 30% / 1 / III 10th * / 3 / I 80% / 3 / II (3/2/1) 40% / 2 / III 11th * / 3 / I 90% / 2 / II 50% / 1 / III (3/2/1/1) 10% / 1 / IV 12th * / 3 / I * / 3 / II 60% / 2 / III 20% / 1 / IV (13th+ * / 3 / I * / 3 / II * / 3 / III 60% / 2 / IV ) * Automatically has this with no roll needed. Use random determination only when any general magical item would be suitable to the individual. Note that some items are in groups or multiples. The following optional tables were added for NPCs of higher level. NEW: Optional tables for level 13 and up 13th+ */ 3 /I */ 3 / II */ 2 / II 70% / 1 / III 30% / 1 / IV 14th+ */ 3 /I */ 3 / II 80% / 3 / III 40% / 2 / IV 15th+ */ 3 /I */ 3 / II 90% / 3 / III 50% / 2 / IV 10% / 1 /V 16th+ */ 3 /I */ 2 / II */ 1 / III 60% / 1 / IV 20% / 1 /V 17th+ */ 3 /I */ 2 / II */ 1 / III 18th+ 70% / 1 / IV 19th+ 30% / 1 /V 20th+ */ 3 /I */ 2 / II */ 1 / III 80% / 1 / IV 40% / 1 /V */ 3 /I */ 2 / II */ 1 / III 90% / 1 / IV 50% / 1 /V 10% / 1 / VI */ 3 /I */ 2 / II */ 1 / III */ 1 / IV 60% / 1 /V 20% / 1 / VI Magical Items for Character Encounters TABLE I Die Roll Item (d20) 1 2 Potions: flying, healing 2 2 Potions: extra-healing, polymorph (self) 3 2 Potions: fire resistance, speed 4 2 Potions: healing, hill giant strength 5 2 Potions: heroism, invulnerability 6 2 Potions: human control, levitation 7 2 Potions: animal control, diminution 8 1 Scroll: 1 spell, level 1-6 9 1 Scroll: 2 spells, level 1-4 10 1 Scroll: protection from magic 11 1 Ring: mammal control 12 1 Ring: protection +1 13 1 Armor: leather +1 14 1 Shield:+1 15 1 Sword: +1 (no special abilities) 16 10 Arrows: +1 17 4 Bolts: +1 18 1 Dagger: +1 19 1 Javelin: +2 20 1 Mace: +1 TABLE II Die 1 Roll Item (d20) 1 1 2 Potions: oil of etherealness, super- heroism 2 2 2 Potions: ESP, gaseous form 3 1 Scroll: 3 Spells, level 2-9 or 2-7 * 4 2 Rings: fire resistance, invisibility 5 1 Ring: protection +2 TA 6 1 Staff: striking 7 1 Wand: magic missiles Di 8 1 Wand: wonder 9 1 bracers of defense AC 4 Ro 10 1 brooch of shielding 11 1 cloak of elvenkind 1 12 1 dust of appearance 13 1 figurine: serpentine owl 2 14 3 javelins of lightning 15 1 jar Keoghtom\'s ointment 3 16 1 robe of useful items 17 1 set: chain mail +1, shield +2 4 18 1 chain mail +3 19 1 Sword: +2 (or +1 with abilities*) 5 20 2 Weapons: crossbow of speed, hammer +1 TABLE III 13 Die 14 Roll 1 Item (d20) 15 2 1 Ring: spell storing 3 1 Ring: mind shielding 16 4 1 Rod: cancellation 5 1 Staff: command 17 6 1 Wand: fear 7 1 Wand: negation 18 8 1 bag of tricks 9 1 boots of speed 10 1 boots of striding and springing 11 1 cloak of displacement 19 12 1 necklace of missiles 13 1 pipes of the sewers 20 14 1 rope of climbing 15 1 rope of entanglement TA 16 1 scarab of protection 17 1 set: plate mail +2, shield +3 D 18 1 Shield: +5 R 19 1 Sword: +3 (or +2 with abilities*) 1 20 1 Mace or hammer: +2 2 1 Spear: +2 3 TABLE IV 5 Die 7 Roll Item (d20) 1 1 Ring: djinni summoning 9 2 1 Ring: human influence 1 3 1 Ring: spell turning 4 1 Rod: smiting 5 1 Rod: terror 1 6 1 Wand: lightning or fire 1 7 1 Wand: illusion 8 1 Staff: thunder & lightning 1 9 1 amulet of life protection 10 1 cube of force 11 1 deck of illusion 12 1 eyes of charming 13 1 helm of teleportation 14 1 horn of blasting 5 1 robe of blending 6 1 stone of good luck 7 1 set: plate mail +3, shield +4 8 1 Sword: +4 (or +3 with abilities*) 9 1 Arrow: of slaying (character class) 0 1 Net: of entrapment Intelligence, if any, will not exceed 16. BLE V (NEW) e ll Item (d20) 1 Ring: protection+3 1 Ring: wizardry , doubles 1st level spells 1 scroll: 5 spells, level 2-9 or 2-7 1 Staff: curing, serpent or swarming insects 1 Wand: lightning 1 Wand: paralyzation 1 bag of holding, 15 lbs., WL: 250 lbs. 1 boots of varied tracks 1 bracers of defense AC 3 1 cloak of protection +3 1 necklace of prayer beads (blessing, curing) 2 Ioun Stones: pale lavender (absorbs up to 4th level spells), pink (+1 to charisma, max 18) 1 figurine: goat of travelling 1 Dagger or sickle +3 1 Mace or hammer or flail +3 10 arrows or bolts or stones or darts +2 1 set: chainmail +3, shield +4 1 set: leather or studded leather +3 (and wooden shield +4 in the case of druids) 1 Sword: +5 (or +4 with abilities*) 1 Spear or Pike or Halberd +3 BLE VI (NEW) ie oll Item (d20) 1 Ring: blinking 1 Ring: jumping 1 Quarterstaff: +3 1 Staff: withering or power 1 Rod: Alertness or Lordly Might 1 Scroll: protection from demons or devils 1 boots of levitation or 1 boots of elvenkind 1 cloak of elvenkind 1 periapt of wound closure 0 1 beaker of plentiful potions 1 1 necklace of adaption 2 2 ioun stones: 1 deep red (+1 to dexterity, max.',
        rarity: 'Uncommon',
        attunement: 'Requires attunement',
      },
    },
  },
];
