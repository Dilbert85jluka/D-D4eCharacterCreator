import type { MagicItemData } from '../../types/magicItem';

/** Staves */
export const staves: MagicItemData[] = [
  {
    id: 'staff-spear',
    name: 'Spear',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'When this seemingly ordinary quarterstaff is examined magically, it will have an aura of alteration. Upon proper command, a long and sharp spear blade will shoot forth from its upper end. This makes the weapon into a spear rather than a staff.',
      },
      '4e': {
        description: 'This rune-carved staff functions as a magical spear in combat.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. Ranged 10; +20 vs. Will; target is dominated (save ends).',
      },
      '5e': {
        description: 'This +2 staff functions as a magical spear, dealing 1d8 + 2 piercing damage.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-command',
    name: 'Staff of Command',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This device has three functions, only two of which will be effective if the wielder is a wizard; all three work when the staff is in a priest\'s hands. The three functions are: Human influence: This power duplicates that of the ring of the same name. Each suggestion or charge " draws one charge from the staff. Mammal control/animal control: This power functions only as mammal control (as the ring of that name) when the staff is used by a wizard. In the hands of a priest it is a staff of animal control (as the potion of that name, all types of animals listed). Either use drains one charge per turn or fraction thereof. Plant control: This function duplicates that of the potion of the same name, but for each 10-square- foot ares of plants controlled for one turn or lass, one charge is used. A wizard cannot control plants at all. The staff can be recharged.',
      },
      '4e': {
        description: 'This device has three functions, only two of which will be effective if the wielder is a wizard; all three work when the staff is in a priest\'s hands. The three functions are: Human influence: This power duplicates that of the ring of the same name. Each suggestion or charge " draws one charge from the staff. Mammal control/animal control: This power functions only as mammal control (as the ring of that name) when the staff is used by a wizard. In the hands of a priest it is a staff of animal control (as the potion of that name, all types of animals listed). Either use drains one charge per turn or fraction thereof. Plant control: This function duplicates that of the potion of the same name, but for each 10-square- foot ares of plants controlled for one turn or lass, one charge is used. A wizard cannot control plants at all. The staff can be recharged.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. Close blast 3; +20 vs. Fortitude; 3d8 cold damage.',
      },
      '5e': {
        description: 'This device has three functions, only two of which will be effective if the wielder is a wizard; all three work when the staff is in a priest\'s hands. The three functions are: Human influence: This power duplicates that of the ring of the same name. Each suggestion or charge " draws one charge from the staff. Mammal control/animal control: This power functions only as mammal control (as the ring of that name) when the staff is used by a wizard. In the hands of a priest it is a staff of animal control (as the potion of that name, all types of animals listed). Either use drains one charge per turn or fraction thereof. Plant control: This function duplicates that of the potion of the same name, but for each 10-square- foot ares of plants controlled for one turn or lass, one charge is used. A wizard cannot control plants at all. The staff can be recharged.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-curing',
    name: 'Staff of Curing',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This device can cure disease, cure blindness, cure wounds ( 3d6+3 hit points), or cure insanity. Each function drains one charge. The device can bi used once per day on any person (dwarf,elf,gnome,half- elf, halfling included), and no function may be employed more than twice per day (i.e., the staff can function only eight times during a 24-hour period). It can be recharged.',
      },
      '4e': {
        description: 'This device can cure disease, cure blindness, cure wounds ( 3d6+3 hit points), or cure insanity. Each function drains one charge. The device can bi used once per day on any person (dwarf,elf,gnome,half- elf, halfling included), and no function may be employed more than twice per day (i.e., the staff can function only eight times during a 24-hour period). It can be recharged.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. Close blast 3; +20 vs. Fortitude; 3d8 cold damage.',
      },
      '5e': {
        description: 'This +2 staff has 10 charges. You can expend charges to cast Cure Wounds (1 charge, 3d8 + 2), Lesser Restoration (2 charges), or Remove Curse (3 charges).',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-the-elements',
    name: 'Staff of the Elements',
    category: 'Staff',
    source: 'ToM',
    editions: {
      '2e': {
        description: 'This powerful item appears to be a staff +2. If it is grasped by an elementalist, however, its true powers become evident. A staff of the elements is charged by the life force of an elemental trapped within it. The staff has charges equal to the number of Hit Dice of the elemental multiplied by 2. Thus, a staff holding a 12 HD elemental has 24 charges. Every time two charges are expended, the elemental loses one Hit Die. When all charges are used, the elemental dies and the staff becomes dormant. If a dormant staff is used to successfully strike an elemental, the creature must immediately attempt a saving throw vs. rods, staves, and wands. If the save is failed, the elemental is absorbed into the staff, thereby recharging the device. If the roll is successful, the creature avoids the effect, but suffers normal damage from the strike of the magical staff (1d6+2). It is possible to absorb an elemental only if the sta is dormant. Only one elemental may be held in the staff at one time. The staff holds the following powers that do not drain charges; each may be used once per day even if the staff does not hold an elemental: � affect normal fires � detect elementals within a 100\' radius � fool\'s gold � metamorphose liquids* � wall of fog An occupied staff has the following powers depending upon the type of elemental trapped within. For example, if a fire elemental is held in the staff, only those powers related to fire are available. Each requires the expenditure of one charge per use: Air: � stinking cloud � wind wall Earth: � dig � Maximilian\'s stony grasp* Fire: � fireball � pyrotechnics Water: � water breathing � watery double* The following powers drain two charges per use: Air: � cloudkill � solid fog Earth: � passwall � transmute rock to mud Fire: � fire shield � wall of fire Water: � airy water � wall of ice The most powerful abilities of the staff drain four charges per use: Air: � airboat* � suffocate* ff Earth: � crystalbrittle � stone to flesh (reversible) Fire: � Forest\'s fiery constrictor* � Malec-Keth\'s flame fist* Water: � Abi-Dalzim\'s horrid wilting* � transmute water to dust The powers of a staff of the elements may be used only by an elementalist. Note that elementalists are restricted against the use of spells and magical items of the element that directly opposes their element of specialty. Thus, an elementalist specializing in water cannot use the staff\'s powers if it contains a fire elemental. Using a staff of the elements can be dangerous. Each time a power is used that requires the expenditure of one or more charges, there is a 5% chance that the trapped elemental bursts forth, destroying the staff in the process. A successful dispel magic spell cast on the staff automatically releases the creature. An escaped elemental will certainly seek revenge against its tormenter. Powers marked with an asterisk (*) are new spells found in this book.',
      },
      '4e': {
        description: 'This powerful item appears to be a staff +2. If it is grasped by an elementalist, however, its true powers become evident. A staff of the elements is charged by the life force of an elemental trapped within it. The staff has charges equal to the number of Hit Dice of the elemental multiplied by 2. Thus, a staff holding a 12 HD elemental has 24 charges. Every time two charges are expended, the elemental loses one Hit Die. When all charges are used, the elemental dies and the staff becomes dormant. If a dormant staff is used to successfully strike an elemental, the creature must immediately attempt a saving throw vs. rods, staves, and wands. If the save is failed, the elemental is absorbed into the staff, thereby recharging the device. If the roll is successful, the creature avoids the effect, but suffers normal damage from the strike of the magical staff (1d6+2). It is possible to absorb an elemental only if the sta is dormant. Only one elemental may be held in the staff at one time. The staff holds the following powers that do not drain charges; each may be used once per day even if the staff does not hold an elemental: � affect normal fires � detect elementals within a 100\' radius � fool\'s gold � metamorphose liquids* � wall of fog An occupied staff has the following powers depending upon the type of elemental trapped within. For example, if a fire elemental is held in the staff, only those powers related to fire are available. Each requires the expenditure of one charge per use: Air: � stinking cloud � wind wall Earth: � dig � Maximilian\'s stony grasp* Fire: � fireball � pyrotechnics Water: � water breathing � watery double* The following powers drain two charges per use: Air: � cloudkill � solid fog Earth: � passwall � transmute rock to mud Fire: � fire shield � wall of fire Water: � airy water � wall of ice The most powerful abilities of the staff drain four charges per use: Air: � airboat* � suffocate* ff Earth: � crystalbrittle � stone to flesh (reversible) Fire: � Forest\'s fiery constrictor* � Malec-Keth\'s flame fist* Water: � Abi-Dalzim\'s horrid wilting* � transmute water to dust The powers of a staff of the elements may be used only by an elementalist. Note that elementalists are restricted against the use of spells and magical items of the element that directly opposes their element of specialty. Thus, an elementalist specializing in water cannot use the staff\'s powers if it contains a fire elemental. Using a staff of the elements can be dangerous. Each time a power is used that requires the expenditure of one or more charges, there is a 5% chance that the trapped elemental bursts forth, destroying the staff in the process. A successful dispel magic spell cast on the staff automatically releases the creature. An escaped elemental will certainly seek revenge against its tormenter. Powers marked with an asterisk (*) are new spells found in this book.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. Ranged 5; transmute up to 1 cubic foot of one nonmagical material into another for 3 hours.',
      },
      '5e': {
        description: 'This powerful item appears to be a staff +2. If it is grasped by an elementalist, however, its true powers become evident. A staff of the elements is charged by the life force of an elemental trapped within it. The staff has charges equal to the number of Hit Dice of the elemental multiplied by 2. Thus, a staff holding a 12 HD elemental has 24 charges. Every time two charges are expended, the elemental loses one Hit Die. When all charges are used, the elemental dies and the staff becomes dormant. If a dormant staff is used to successfully strike an elemental, the creature must immediately attempt a saving throw vs. rods, staves, and wands. If the save is failed, the elemental is absorbed into the staff, thereby recharging the device. If the roll is successful, the creature avoids the effect, but suffers normal damage from the strike of the magical staff (1d6+2). It is possible to absorb an elemental only if the sta is dormant. Only one elemental may be held in the staff at one time. The staff holds the following powers that do not drain charges; each may be used once per day even if the staff does not hold an elemental: � affect normal fires � detect elementals within a 100\' radius � fool\'s gold � metamorphose liquids* � wall of fog An occupied staff has the following powers depending upon the type of elemental trapped within. For example, if a fire elemental is held in the staff, only those powers related to fire are available. Each requires the expenditure of one charge per use: Air: � stinking cloud � wind wall Earth: � dig � Maximilian\'s stony grasp* Fire: � fireball � pyrotechnics Water: � water breathing � watery double* The following powers drain two charges per use: Air: � cloudkill � solid fog Earth: � passwall � transmute rock to mud Fire: � fire shield � wall of fire Water: � airy water � wall of ice The most powerful abilities of the staff drain four charges per use: Air: � airboat* � suffocate* ff Earth: � crystalbrittle � stone to flesh (reversible) Fire: � Forest\'s fiery constrictor* � Malec-Keth\'s flame fist* Water: � Abi-Dalzim\'s horrid wilting* � transmute water to dust The powers of a staff of the elements may be used only by an elementalist. Note that elementalists are restricted against the use of spells and magical items of the element that directly opposes their element of specialty. Thus, an elementalist specializing in water cannot use the staff\'s powers if it contains a fire elemental. Using a staff of the elements can be dangerous. Each time a power is used that requires the expenditure of one or more charges, there is a 5% chance that the trapped elemental bursts forth, destroying the staff in the process. A successful dispel magic spell cast on the staff automatically releases the creature. An escaped elemental will certainly seek revenge against its tormenter. Powers marked with an asterisk (*) are new spells found in this book.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-the-magi',
    name: 'Staff of the Magi',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This potent staff contains many spell powers and other functions. Some of its powers drain charges; others don\'t. the following powers do not drain charges: � detect magic � enlarge � hold portal � light � protection form evil/good The following powers drain one charge per usage: � invisibility � fireball � knock � lightning bolt � pyrotechnics � ice storm � web � wall of fire � dispel magic � passwall These powers drain two charges per usage: � whirlwind* � conjure elemental** � plane travel � telekinesis*** * The whirlwind is identical to that caused by a dijinni. ** The staff can be used to conjure one elemental of each type per day, each having 8 Hit Dice. *** Telekinesis is at 8th level also (i.e., 200 pound maximum weight). The staff of the magi adds a +2 bonus to all saving throw rolls vs. spell. It can be used to absorb wizar spell energy directed at its wielder, but if the staf absorbs energy beyond its charge limit, it will explode as if a "retributive strike" (see below) had been made. The spell levels of energy absorbed count only as recharging the staff, but they cannot be redirected immediately, so if absorption is desired, that is the only action possible by the staf wielder that round. Note also that the wielder has no idea how many spell levels are cast at him, for the staff does not communicate this knowledge as a rod of absorption does. Absorbing spells is risky, but absorption is the only way this staff can be recharged. Retributive strike is a breaking of the staff. It mus be purposeful and declared by the wizard wielding it. When this is done all levels of spell energy in t staff are released in a globe of 30-foot radius. All creatures within 10 feet of the broken staff suffer hit points of damage equal to eight times the number of spell levels of energy in the rod (1 to 25), those between 10 feet to 20 feet take 6 x levels and those 20 feet to 30 feet distant take 4 x levels. Successful saving throws versus magic indicate only one-half damage is sustained. The wizard breaking the staff has a 50% chance of traveling to another plane of existence, but if he does not, the explosive release of spell energy totally destroys him. This staff and the staff of power are the only magical items capable of a retributive strike. (Please also read the following form the DMs Option: High level campaign.',
      },
      '4e': {
        description: 'This legendary rune-carved staff is one of the most powerful magical items in existence, granting mastery over arcane magic.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. You unleash the staff\'s stored energy.',
      },
      '5e': {
        description: 'This staff grants a +2 bonus to spell attack rolls and saving throw DCs. It has 50 charges and can cast a wide variety of spells.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-power',
    name: 'Staff of Power',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'The staff of power is a very potent magical item, with offensive and defensive abilities. The powers below cost one charge each: s � continual light � magic missile or lightning bolt � ray of enfeeblement � levitation d � cone of cold or fireball f The following powers drain two charges each: � shield, 5-foot radius � globe of invulnerability � paralyzation* f * Paralyzation is a ray from the end of the staff extending in a cone 40 feet long and 20 feet wide at the far end. The DM may assign alternate powers by random die roll. The wielder of a staff of power gains a +2 bonus to Armor Class and saving throws. He may use the t staff to smite opponents. It strikes as a +2 magical weapon and inflicts 1d6+2 points of damage; if one he charge is expended, the staff causes double damage, but two charges do not cause triple damage. A staff of power can be broken for a retributive strike (see staff of the magi). The staff can be recharged. ,',
      },
      '4e': {
        description: 'The staff of power is a very potent magical item, with offensive and defensive abilities. The powers below cost one charge each: s � continual light � magic missile or lightning bolt � ray of enfeeblement � levitation d � cone of cold or fireball f The following powers drain two charges each: � shield, 5-foot radius � globe of invulnerability � paralyzation* f * Paralyzation is a ray from the end of the staff extending in a cone 40 feet long and 20 feet wide at the far end. The DM may assign alternate powers by random die roll. The wielder of a staff of power gains a +2 bonus to Armor Class and saving throws. He may use the t staff to smite opponents. It strikes as a +2 magical weapon and inflicts 1d6+2 points of damage; if one he charge is expended, the staff causes double damage, but two charges do not cause triple damage. A staff of power can be broken for a retributive strike (see staff of the magi). The staff can be recharged. ,',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. You unleash the staff\'s stored energy.',
      },
      '5e': {
        description: 'This +2 quarterstaff has 20 charges. You can expend charges on a hit to deal an extra 1d6 force damage per charge spent (max 4).',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-the-serpent',
    name: 'Staff of the Serpent',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'There are two varieties of this staff--the "python\'\' and the "adder." The python strikes as a +2 magical weapon and inflicts 1d6+2 points of damage when it hits. If the priest throws the staff to the ground, it grows from its 6-foot length, becoming a constrictor snake, 25 feet long (AC 3, 49 hit points, movement rate of 9). This happens in one round. The snake will entwine if it scores a hit, the opponent being constricted for 2d4+2 points of damage per round. The victim will remain trapped by the python until he dies or the creature is destroyed. Note that the python will return to its owner upon command. If it is destroyed while in snake form, the staff is destroyed. The adder strikes as a +1 magical weapon and does 2d2 points of damage when it hits. Upon command the head of the staff becomes that of an actual serpent (AC 5, 20 hit points). This head remains for one full turn. When a hit is scored, damage is not increased, but the victim must roll a successful saving throw vs. poison (strength E) or be slain. Only evil priests will employ an adder staff. If the snake head is killed, the staff is destroyed. Neither staff has nor requires charges. Most of these staves--60%--are pythons.',
      },
      '4e': {
        description: 'There are two varieties of this staff--the "python\'\' and the "adder." The python strikes as a +2 magical weapon and inflicts 1d6+2 points of damage when it hits. If the priest throws the staff to the ground, it grows from its 6-foot length, becoming a constrictor snake, 25 feet long (AC 3, 49 hit points, movement rate of 9). This happens in one round. The snake will entwine if it scores a hit, the opponent being constricted for 2d4+2 points of damage per round. The victim will remain trapped by the python until he dies or the creature is destroyed. Note that the python will return to its owner upon command. If it is destroyed while in snake form, the staff is destroyed. The adder strikes as a +1 magical weapon and does 2d2 points of damage when it hits. Upon command the head of the staff becomes that of an actual serpent (AC 5, 20 hit points). This head remains for one full turn. When a hit is scored, damage is not increased, but the victim must roll a successful saving throw vs. poison (strength E) or be slain. Only evil priests will employ an adder staff. If the snake head is killed, the staff is destroyed. Neither staff has nor requires charges. Most of these staves--60%--are pythons.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. You unleash the staff\'s stored energy.',
      },
      '5e': {
        description: 'There are two varieties of this staff--the "python\'\' and the "adder." The python strikes as a +2 magical weapon and inflicts 1d6+2 points of damage when it hits. If the priest throws the staff to the ground, it grows from its 6-foot length, becoming a constrictor snake, 25 feet long (AC 3, 49 hit points, movement rate of 9). This happens in one round. The snake will entwine if it scores a hit, the opponent being constricted for 2d4+2 points of damage per round. The victim will remain trapped by the python until he dies or the creature is destroyed. Note that the python will return to its owner upon command. If it is destroyed while in snake form, the staff is destroyed. The adder strikes as a +1 magical weapon and does 2d2 points of damage when it hits. Upon command the head of the staff becomes that of an actual serpent (AC 5, 20 hit points). This head remains for one full turn. When a hit is scored, damage is not increased, but the victim must roll a successful saving throw vs. poison (strength E) or be slain. Only evil priests will employ an adder staff. If the snake head is killed, the staff is destroyed. Neither staff has nor requires charges. Most of these staves--60%--are pythons.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-slinging',
    name: 'Staff of Slinging',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This magical quarterstaff appears to be a +1 weapon unless it is grasped by a druid, whereupon its power of slinging becomes evident. This power, which can be employed only by a druid, is activated when one end of the staff is touched to a heavy object of roughly spherical shape (a stone, metal ball, pottery crock, etc.) of up to nine inches in diameter and five pounds in weight. The object adheres to the end of the staff, and the wielder need then only swing the staff in an overhand arc to release the missile toward a desired target. The missile leaves the staff on the downstroke of the overhand swing and travels in a low, rising trajectory, with the missile going one foot upward for every 10 feet traveled. Of course, the arc may be higher, or the missile aimed so as to travel nearly vertically. (In the latt case, reverse the arcing ratio so that one foot of distance laterally is covered for every 10 feet of vertical rise.) The maximum range of such a missile is 180 feet, with limits of 60 feet and 120 feet on short and medium range, respectively. This staff also carries charges, and a druid wielding the item can expend one charge and thereby use the staff to hurl a missile of large size, as if the wiel were a stone giant (range out to 300 feet, 3d10 points of damage per hit). Whether used as a magical quarterstaff or by employing one of its slinging powers, the staff bestows +1 to the wielder\'s attack roll and +1 per die to damage dealt out. The weapon may be recharged by a druid of 12th or higher level.',
      },
      '4e': {
        description: 'This magical quarterstaff appears to be a +1 weapon unless it is grasped by a druid, whereupon its power of slinging becomes evident. This power, which can be employed only by a druid, is activated when one end of the staff is touched to a heavy object of roughly spherical shape (a stone, metal ball, pottery crock, etc.) of up to nine inches in diameter and five pounds in weight. The object adheres to the end of the staff, and the wielder need then only swing the staff in an overhand arc to release the missile toward a desired target. The missile leaves the staff on the downstroke of the overhand swing and travels in a low, rising trajectory, with the missile going one foot upward for every 10 feet traveled. Of course, the arc may be higher, or the missile aimed so as to travel nearly vertically. (In the latt case, reverse the arcing ratio so that one foot of distance laterally is covered for every 10 feet of vertical rise.) The maximum range of such a missile is 180 feet, with limits of 60 feet and 120 feet on short and medium range, respectively. This staff also carries charges, and a druid wielding the item can expend one charge and thereby use the staff to hurl a missile of large size, as if the wiel were a stone giant (range out to 300 feet, 3d10 points of damage per hit). Whether used as a magical quarterstaff or by employing one of its slinging powers, the staff bestows +1 to the wielder\'s attack roll and +1 per die to damage dealt out. The weapon may be recharged by a druid of 12th or higher level.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. You unleash the staff\'s stored energy.',
      },
      '5e': {
        description: 'This +2 staff has 10 charges and is attuned to nature. You can expend charges to cast Animal Friendship (1 charge), Awaken (5 charges), or Wall of Thorns (6 charges).',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-striking',
    name: 'Staff of Striking',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This oaken staff is the equivalent of a +3 magical weapon. (If the weapon vs. armor type adjustment is used, the staff of striking is treated as the most favorable weapon type vs. any armor.) It causes 1d6+3 points of damage when a hit is scored. This expends a charge. If two charges are expended, bonus damage is doubled (1d6+6); if three charges are expended, bonus damage is tripled (1d6+9). No more than three charges can be expended per strike. The staff can be recharged.',
      },
      '4e': {
        description: 'This oaken staff is the equivalent of a +3 magical weapon. (If the weapon vs. armor type adjustment is used, the staff of striking is treated as the most favorable weapon type vs. any armor.) It causes 1d6+3 points of damage when a hit is scored. This expends a charge. If two charges are expended, bonus damage is doubled (1d6+6); if three charges are expended, bonus damage is tripled (1d6+9). No more than three charges can be expended per strike. The staff can be recharged.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. You unleash the staff\'s stored energy.',
      },
      '5e': {
        description: 'This oaken staff is the equivalent of a +3 magical weapon. (If the weapon vs. armor type adjustment is used, the staff of striking is treated as the most favorable weapon type vs. any armor.) It causes 1d6+3 points of damage when a hit is scored. This expends a charge. If two charges are expended, bonus damage is doubled (1d6+6); if three charges are expended, bonus damage is tripled (1d6+9). No more than three charges can be expended per strike. The staff can be recharged.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-swarming-insects',
    name: 'Staff of Swarming Insects',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'A staff of this sort is typically short and thick. When initially obtained or encountered, much of its length is covered with finely done carvings depicting winged biting and stinging insects (bees, deerflies, horseflies, wasps, and the like). Any priest character (cleric, druid, shaman, witch doctor, etc.) holding it can command the staff to create a swarm of such insects, at the same time expending one of the staff\'s charges. Range is 60 yards+10 yards per level of the user. The number of insects produced is 60 plus 10 per level. Every 10 insects will inflict 1 point of damage upon the target victim, regardless of Armor Class, unless the victim is protected by a force field, engulfed in flames, etc. Note, however, that the insects will not affect creatures larger than man- sized with a natural Armor Class of 5 or better. When a vulnerable target is attacked by the swarm of flying insects, the target will be unable to do anything other than attempt to dislodge and kill the things. The insect attack lasts for one round. Each time the staff is employed, one of the insect-shapes carved into its wooden surface will disappear, so it is easy to determine how many charges are left in the staff. Unlike others of its ilk, a staff of this sort can have as many as 50 initial charges. However, it cannot be recharged.',
      },
      '4e': {
        description: 'A staff of this sort is typically short and thick. When initially obtained or encountered, much of its length is covered with finely done carvings depicting winged biting and stinging insects (bees, deerflies, horseflies, wasps, and the like). Any priest character (cleric, druid, shaman, witch doctor, etc.) holding it can command the staff to create a swarm of such insects, at the same time expending one of the staff\'s charges. Range is 60 yards+10 yards per level of the user. The number of insects produced is 60 plus 10 per level. Every 10 insects will inflict 1 point of damage upon the target victim, regardless of Armor Class, unless the victim is protected by a force field, engulfed in flames, etc. Note, however, that the insects will not affect creatures larger than man- sized with a natural Armor Class of 5 or better. When a vulnerable target is attacked by the swarm of flying insects, the target will be unable to do anything other than attempt to dislodge and kill the things. The insect attack lasts for one round. Each time the staff is employed, one of the insect-shapes carved into its wooden surface will disappear, so it is easy to determine how many charges are left in the staff. Unlike others of its ilk, a staff of this sort can have as many as 50 initial charges. However, it cannot be recharged.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. You unleash the staff\'s stored energy.',
      },
      '5e': {
        description: 'A staff of this sort is typically short and thick. When initially obtained or encountered, much of its length is covered with finely done carvings depicting winged biting and stinging insects (bees, deerflies, horseflies, wasps, and the like). Any priest character (cleric, druid, shaman, witch doctor, etc.) holding it can command the staff to create a swarm of such insects, at the same time expending one of the staff\'s charges. Range is 60 yards+10 yards per level of the user. The number of insects produced is 60 plus 10 per level. Every 10 insects will inflict 1 point of damage upon the target victim, regardless of Armor Class, unless the victim is protected by a force field, engulfed in flames, etc. Note, however, that the insects will not affect creatures larger than man- sized with a natural Armor Class of 5 or better. When a vulnerable target is attacked by the swarm of flying insects, the target will be unable to do anything other than attempt to dislodge and kill the things. The insect attack lasts for one round. Each time the staff is employed, one of the insect-shapes carved into its wooden surface will disappear, so it is easy to determine how many charges are left in the staff. Unlike others of its ilk, a staff of this sort can have as many as 50 initial charges. However, it cannot be recharged.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-lightning',
    name: 'Lightning',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'Casual examination of this stout quarterstaff will show it to be exceptional, and if it is magically examined, it will radiate an aura of alteration magic.',
      },
      '4e': {
        description: 'This rune-carved staff crackles with electrical energy and can unleash thunderous blasts.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. You unleash the staff\'s stored energy.',
      },
      '5e': {
        description: 'This +2 staff has 10 charges. You can expend charges to cast Thunderwave (1 charge, DC 15), Lightning Bolt (3 charges), or Thunder and Lightning (4 charges).',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-withering',
    name: 'Staff of Withering',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'The staff of withering is a +1 magical weapon. A hit from it causes 1d4+1 points of damage. If two charges are expended when a hit is scored, the creature struck also ages 10 years, its abilities and lifespan adjusted for the resulting age increase. If three charges are expended when a hit is made, one of the opponent creature\'s limbs can be made to shrivel and become useless unless it successfully saves vs. spell (check by random number generation for which limb is struck). Ageless creatures (undead, demons, devils, etc) cannot be aged or withered. Each effect of the staff is cumulative, so that three charges will score damage, age, and wither. Aging a dwarf is of little effect, while aging a dragon could actually aid the creature. (Please also read the following form the DMs Option: High level campaign.',
      },
      '4e': {
        description: 'The staff of withering is a +1 magical weapon. A hit from it causes 1d4+1 points of damage. If two charges are expended when a hit is scored, the creature struck also ages 10 years, its abilities and lifespan adjusted for the resulting age increase. If three charges are expended when a hit is made, one of the opponent creature\'s limbs can be made to shrivel and become useless unless it successfully saves vs. spell (check by random number generation for which limb is struck). Ageless creatures (undead, demons, devils, etc) cannot be aged or withered. Each effect of the staff is cumulative, so that three charges will score damage, age, and wither. Aging a dwarf is of little effect, while aging a dragon could actually aid the creature. (Please also read the following form the DMs Option: High level campaign.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. You unleash the staff\'s stored energy.',
      },
      '5e': {
        description: 'The staff of withering is a +1 magical weapon. A hit from it causes 1d4+1 points of damage. If two charges are expended when a hit is scored, the creature struck also ages 10 years, its abilities and lifespan adjusted for the resulting age increase. If three charges are expended when a hit is made, one of the opponent creature\'s limbs can be made to shrivel and become useless unless it successfully saves vs. spell (check by random number generation for which limb is struck). Ageless creatures (undead, demons, devils, etc) cannot be aged or withered. Each effect of the staff is cumulative, so that three charges will score damage, age, and wither. Aging a dwarf is of little effect, while aging a dragon could actually aid the creature. (Please also read the following form the DMs Option: High level campaign.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-staff-of-the-woodlands',
    name: 'Staff of the Woodlands',
    category: 'Staff',
    source: 'DMG',
    editions: {
      '2e': {
        description: 'This sor of staff is always made from oak, ash, or yew, finely grained, beautifully carved, and bound with bronze. It is effective only in the hands of a druid. Each such staff has the following powers, with each expending one charge per use: � Wall of thorns � Animal friendship plus speak with animals � Animate tree* * This function duplicates the ability of a treant to a large tree to move at a movement rate of 3 and atta as if it were a largest-sized treant, and in all othe respects becoming a virtual treant for eight rounds p charge expended. Note that one round is required for tree to animate, and it will return to rooting on the eighth, so only six of the initial eight rounds are effectively available for the attack function. In addition to these powers, each staff of the woodlands has a magical weapon value. Those with a lesser value have extra magical powers that do not require charges and can be employed once per day: The +4 staff has no additional powers; the +3 staff also confers the power of pass without trace; the +2 staff confers the powers of pass without trace and barkskin; the +1 staff confers the powers of the +2 staff plus the power of the tree spell. To determine which sort of staff has been discovered, assign even chances for each of the four types.',
      },
      '4e': {
        description: 'This sor of staff is always made from oak, ash, or yew, finely grained, beautifully carved, and bound with bronze. It is effective only in the hands of a druid. Each such staff has the following powers, with each expending one charge per use: � Wall of thorns � Animal friendship plus speak with animals � Animate tree* * This function duplicates the ability of a treant to a large tree to move at a movement rate of 3 and atta as if it were a largest-sized treant, and in all othe respects becoming a virtual treant for eight rounds p charge expended. Note that one round is required for tree to animate, and it will return to rooting on the eighth, so only six of the initial eight rounds are effectively available for the attack function. In addition to these powers, each staff of the woodlands has a magical weapon value. Those with a lesser value have extra magical powers that do not require charges and can be employed once per day: The +4 staff has no additional powers; the +3 staff also confers the power of pass without trace; the +2 staff confers the powers of pass without trace and barkskin; the +1 staff confers the powers of the +2 staff plus the power of the tree spell. To determine which sort of staff has been discovered, assign even chances for each of the four types.',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. You unleash the staff\'s stored energy.',
      },
      '5e': {
        description: 'This sor of staff is always made from oak, ash, or yew, finely grained, beautifully carved, and bound with bronze. It is effective only in the hands of a druid. Each such staff has the following powers, with each expending one charge per use: � Wall of thorns � Animal friendship plus speak with animals � Animate tree* * This function duplicates the ability of a treant to a large tree to move at a movement rate of 3 and atta as if it were a largest-sized treant, and in all othe respects becoming a virtual treant for eight rounds p charge expended. Note that one round is required for tree to animate, and it will return to rooting on the eighth, so only six of the initial eight rounds are effectively available for the attack function. In addition to these powers, each staff of the woodlands has a magical weapon value. Those with a lesser value have extra magical powers that do not require charges and can be employed once per day: The +4 staff has no additional powers; the +3 staff also confers the power of pass without trace; the +2 staff confers the powers of pass without trace and barkskin; the +1 staff confers the powers of the +2 staff plus the power of the tree spell. To determine which sort of staff has been discovered, assign even chances for each of the four types.',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
  {
    id: 'staff-wanderer-s-staff',
    name: 'Wanderer\'s Staff',
    category: 'Staff',
    source: 'TcDrH',
    editions: {
      '2e': {
        description: 'This resembles a stout oaken staff, which radiates magic and, in fact, functions as a quarterstaff +1. However, its primary power is locomotion. If carried as a walking stick, users hiking at a steady pace do not tire or need sleep. Any time spent walking counts as sleep for the purpose of resting the character. If desired, the character can walk night and day, taking only brief breaks for food, drink, etc. Wands f Wands are 1� feet long and slender. They are made of ivory, bone, or wood and are usually tipped with something--metal, crystal, stone, etc. They are fragile and tend to break easily. Because of this, they are often kept in cases. Wands perform at 6th level of experience with respect to the damage they cause, range, duration, area of effect, etc., unless otherwise stated. At the DM\'s option, 1% of all wands can be trapped to backfire. Wands are powered by charges, each use costing one or more charges (depending on the item). When discovered, a wand typically contains 1d20+80 charges. Captured wands taken from a defeated foe often have many fewer charges. Wands never have a greater number of charges than those listed. Most wands can be recharged t according to the rules for making magical items. When a wand runs out of charges, it can no longer be recharged. Furthermore, the DM can rule that the wand immediately crumbles into useless dust (settling the issue) or is now a useless, nonmagical stick. cause Command Words (Optional Rule) ck r Like rods and staves, wands can require the er utterance of a command word (or phrase) to the operate, and like these other items, the key is seldom found in the lock. The DM can rule that the command word is etched in magical writing on the wand (requiring a read magic to translate) or he can make the characters resort to such methods as commune spells and expensive sages. If you choose not to use this option, ignore references to command words in the item descriptions below-- all items simply work. List of Wands',
      },
      '4e': {
        description: 'This resembles a stout oaken staff, which radiates magic and, in fact, functions as a quarterstaff +1. However, its primary power is locomotion. If carried as a walking stick, users hiking at a steady pace do not tire or need sleep. Any time spent walking counts as sleep for the purpose of resting the character. If desired, the character can walk night and day, taking only brief breaks for food, drink, etc. Wands f Wands are 1� feet long and slender. They are made of ivory, bone, or wood and are usually tipped with something--metal, crystal, stone, etc. They are fragile and tend to break easily. Because of this, they are often kept in cases. Wands perform at 6th level of experience with respect to the damage they cause, range, duration, area of effect, etc., unless otherwise stated. At the DM\'s option, 1% of all wands can be trapped to backfire. Wands are powered by charges, each use costing one or more charges (depending on the item). When discovered, a wand typically contains 1d20+80 charges. Captured wands taken from a defeated foe often have many fewer charges. Wands never have a greater number of charges than those listed. Most wands can be recharged t according to the rules for making magical items. When a wand runs out of charges, it can no longer be recharged. Furthermore, the DM can rule that the wand immediately crumbles into useless dust (settling the issue) or is now a useless, nonmagical stick. cause Command Words (Optional Rule) ck r Like rods and staves, wands can require the er utterance of a command word (or phrase) to the operate, and like these other items, the key is seldom found in the lock. The DM can rule that the command word is etched in magical writing on the wand (requiring a read magic to translate) or he can make the characters resort to such methods as commune spells and expensive sages. If you choose not to use this option, ignore references to command words in the item descriptions below-- all items simply work. List of Wands',
        rarity: 'Rare',
        level: 15,
        slot: 'Staff',
        powerText: 'Property: You gain a +3 enhancement bonus to attack and damage rolls with this implement. Power (Daily ✦ Implement): Standard Action. You unleash the staff\'s stored energy.',
      },
      '5e': {
        description: 'This resembles a stout oaken staff, which radiates magic and, in fact, functions as a quarterstaff +1. However, its primary power is locomotion. If carried as a walking stick, users hiking at a steady pace do not tire or need sleep. Any time spent walking counts as sleep for the purpose of resting the character. If desired, the character can walk night and day, taking only brief breaks for food, drink, etc. Wands f Wands are 1� feet long and slender. They are made of ivory, bone, or wood and are usually tipped with something--metal, crystal, stone, etc. They are fragile and tend to break easily. Because of this, they are often kept in cases. Wands perform at 6th level of experience with respect to the damage they cause, range, duration, area of effect, etc., unless otherwise stated. At the DM\'s option, 1% of all wands can be trapped to backfire. Wands are powered by charges, each use costing one or more charges (depending on the item). When discovered, a wand typically contains 1d20+80 charges. Captured wands taken from a defeated foe often have many fewer charges. Wands never have a greater number of charges than those listed. Most wands can be recharged t according to the rules for making magical items. When a wand runs out of charges, it can no longer be recharged. Furthermore, the DM can rule that the wand immediately crumbles into useless dust (settling the issue) or is now a useless, nonmagical stick. cause Command Words (Optional Rule) ck r Like rods and staves, wands can require the er utterance of a command word (or phrase) to the operate, and like these other items, the key is seldom found in the lock. The DM can rule that the command word is etched in magical writing on the wand (requiring a read magic to translate) or he can make the characters resort to such methods as commune spells and expensive sages. If you choose not to use this option, ignore references to command words in the item descriptions below-- all items simply work. List of Wands',
        rarity: 'Rare',
        attunement: 'Requires attunement',
      },
    },
  },
];
