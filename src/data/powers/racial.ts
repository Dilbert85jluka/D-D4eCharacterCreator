import type { PowerData } from '../../types/gameData';

/**
 * Racial encounter powers for all PHB1 / PHB2 / PHB3 races.
 * These use classId: 'racial' to distinguish from class powers.
 * Level 0 = auto-granted racial feature (not a player choice).
 */
export const RACIAL_POWERS: PowerData[] = [
  // ────────────────────────────────────────────────────────────────────────────
  // PHB1 RACIAL POWERS
  // ────────────────────────────────────────────────────────────────────────────

  // ── Dragonborn ──────────────────────────────────────────────────────────────
  {
    id: 'dragon-breath',
    name: 'Dragon Breath',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'minor',
    range: 'Close blast 3',
    keywords: ['Varies'],
    target: 'Each creature in blast',
    attack: 'Strength, Constitution, or Dexterity vs. Reflex. You gain a +2 bonus to the attack roll. Level 11: +4. Level 21: +6.',
    hit: '1d6 + Constitution modifier damage. Level 11: 2d6 + Constitution modifier damage. Level 21: 3d6 + Constitution modifier damage.',
    special: 'When you create your character, choose Strength, Constitution, or Dexterity as the ability score you use when making attack rolls with this power. You also choose the power\'s damage type: acid, cold, fire, lightning, or poison. Close blast 3.',
    flavor: 'As you open your mouth with a roar, the deadly power of your draconic kin blasts forth to engulf your foes.',
  },

  // ── Eladrin ─────────────────────────────────────────────────────────────────
  {
    id: 'fey-step',
    name: 'Fey Step',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'move',
    range: 'Personal',
    keywords: ['Teleportation'],
    effect: 'Teleport up to 5 squares.',
    flavor: 'You step through the boundary between the planes, crossing the distance in a single stride.',
  },

  // ── Elf ─────────────────────────────────────────────────────────────────────
  {
    id: 'elven-accuracy',
    name: 'Elven Accuracy',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'free',
    range: 'Personal',
    keywords: [],
    trigger: 'You make an attack roll and dislike the result.',
    effect: 'Reroll the attack roll. Use the second roll, even if it\'s lower.',
    flavor: 'With an elf\'s supernatural accuracy, you take careful aim and strike again.',
  },

  // ── Halfling ────────────────────────────────────────────────────────────────
  {
    id: 'second-chance',
    name: 'Second Chance',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'immediate-interrupt',
    range: 'Personal',
    keywords: [],
    trigger: 'You are hit by an attack.',
    effect: 'The attacker must reroll the attack and use the second roll, even if it is lower.',
    flavor: 'Luck and small size combine to work in your favor as you dodge your enemy\'s attack.',
  },

  // ── Tiefling ────────────────────────────────────────────────────────────────
  {
    id: 'infernal-wrath',
    name: 'Infernal Wrath',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'free',
    range: 'Close burst 10',
    keywords: ['Fire'],
    trigger: 'An enemy within 10 squares of you hits you.',
    target: 'The triggering enemy in close burst 10',
    effect: 'The target takes 1d6 + Intelligence modifier or Charisma modifier fire damage. Level 11: 2d6 + modifier. Level 21: 3d6 + modifier.',
    flavor: 'You invoke the wrath of your infernal bloodline, causing a foe to burst into flame.',
  },

  // ────────────────────────────────────────────────────────────────────────────
  // PHB2 RACIAL POWERS
  // ────────────────────────────────────────────────────────────────────────────

  // ── Deva ──────────────────────────────────────────────────────────────────
  {
    id: 'racial-memory-of-a-thousand-lifetimes',
    name: 'Memory of a Thousand Lifetimes',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'free',
    range: 'Personal',
    keywords: [],
    trigger: 'You make an attack roll, a saving throw, a skill check, or an ability check and dislike the result.',
    effect: 'You add 1d6 to the triggering roll.',
    flavor: 'The dreamlike memories of your previous lives lend a helping hand.',
  },

  // ── Gnome ─────────────────────────────────────────────────────────────────
  {
    id: 'racial-fade-away',
    name: 'Fade Away',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'immediate-reaction',
    range: 'Personal',
    keywords: ['Illusion'],
    trigger: 'You take damage.',
    effect: 'You are invisible until you attack or until the end of your next turn.',
    flavor: 'You vanish from sight, eluding your attackers.',
  },

  // ── Goliath ───────────────────────────────────────────────────────────────
  {
    id: 'racial-stones-endurance',
    name: "Stone's Endurance",
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'minor',
    range: 'Personal',
    keywords: [],
    effect: 'You gain resist 5 to all damage until the end of your next turn. Level 11: Resist 10 to all damage. Level 21: Resist 15 to all damage.',
    flavor: 'Your skin turns to stone, shrugging off blows.',
  },

  // ── Half-Orc ──────────────────────────────────────────────────────────────
  {
    id: 'racial-furious-assault',
    name: 'Furious Assault',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'free',
    range: 'Personal',
    keywords: [],
    trigger: 'You hit an enemy with an attack.',
    effect: 'The attack deals 1[W] extra damage if it is a weapon attack, or 1d8 extra damage if it is not.',
    flavor: 'You channel your rage into a devastating assault.',
  },

  // ── Longtooth Shifter ─────────────────────────────────────────────────────
  {
    id: 'racial-longtooth-shifting',
    name: 'Longtooth Shifting',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'minor',
    range: 'Personal',
    keywords: ['Healing'],
    requirement: 'You must be bloodied.',
    effect: 'Until the end of the encounter, you gain a +2 bonus to damage rolls. In addition, while you are bloodied, you gain regeneration 2. Level 11: Regeneration 4. Level 21: Regeneration 6.',
    flavor: 'You unleash the beast within and grow savage jaws.',
  },

  // ── Razorclaw Shifter ─────────────────────────────────────────────────────
  {
    id: 'racial-razorclaw-shifting',
    name: 'Razorclaw Shifting',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'minor',
    range: 'Personal',
    keywords: [],
    requirement: 'You must be bloodied.',
    effect: 'Until the end of the encounter, your speed increases by 2, and you gain a +1 bonus to AC and Reflex.',
    flavor: 'You unleash the beast within and grow razor-sharp claws.',
  },

  // ────────────────────────────────────────────────────────────────────────────
  // PHB3 RACIAL POWERS
  // ────────────────────────────────────────────────────────────────────────────

  // ── Githzerai ───────────────────────────────────────────────────────────────
  {
    id: 'racial-iron-mind',
    name: 'Iron Mind',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'immediate-interrupt',
    range: 'Personal',
    keywords: [],
    trigger: 'You are hit by an attack.',
    effect: 'You gain a +2 bonus to all defenses until the end of your next turn.',
    flavor: 'Your mental discipline deflects the incoming blow.',
  },

  // ── Minotaur ────────────────────────────────────────────────────────────────
  {
    id: 'racial-goring-charge',
    name: 'Goring Charge',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'standard',
    range: 'Melee 1',
    keywords: [],
    target: 'One creature',
    attack: 'Strength + 4 vs. AC, Constitution + 4 vs. AC, or Dexterity + 4 vs. AC (increases to +6 at 11th level and +8 at 21st level)',
    hit: '1d6 + Strength, Constitution, or Dexterity modifier damage, and you knock the target prone. Level 11: 2d6 + modifier damage. Level 21: 3d6 + modifier damage.',
    effect: 'You charge and make the above attack in place of a melee basic attack.',
    flavor: 'You lower your horns and charge headlong into your foe.',
  },

  // ── Shardmind ───────────────────────────────────────────────────────────────
  {
    id: 'racial-shard-swarm',
    name: 'Shard Swarm',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'move',
    range: 'Close burst 1',
    keywords: ['Teleportation'],
    target: 'Each enemy in burst',
    effect: 'Close burst 1. Each target grants combat advantage to you until the end of your next turn. You then teleport a number of squares equal to half your speed.',
    flavor: 'Your body explodes into a cloud of crystalline shards, disorienting nearby foes before you reform elsewhere.',
  },

  // ── Wilden ──────────────────────────────────────────────────────────────────
  {
    id: 'racial-voyage-of-the-ancients',
    name: 'Voyage of the Ancients',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'free',
    range: 'Personal',
    keywords: ['Teleportation'],
    trigger: 'You hit an enemy with a close or area attack.',
    effect: 'You teleport 3 squares. Choose a single enemy you hit with the triggering attack; you and one ally within 5 squares of you gain combat advantage against that enemy until the end of your next turn.',
    flavor: 'The ancient wisdom of the Feywild carries you to safety.',
    special: 'Aspect of the Ancients. You choose this power after an extended rest when you adopt the Aspect of the Ancients.',
  },
  {
    id: 'racial-wrath-of-the-destroyer',
    name: 'Wrath of the Destroyer',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'immediate-reaction',
    range: 'Personal',
    keywords: [],
    trigger: 'A bloodied enemy attacks you or an ally adjacent to you.',
    effect: 'You make a melee basic attack or charge the triggering enemy. If you hit, the enemy is also dazed until the end of your next turn.',
    flavor: 'Primal fury surges through you as nature strikes back.',
    special: 'Aspect of the Destroyer. You choose this power after an extended rest when you adopt the Aspect of the Destroyer.',
  },
  {
    id: 'racial-pursuit-of-the-hunter',
    name: 'Pursuit of the Hunter',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'immediate-reaction',
    range: 'Personal',
    keywords: [],
    trigger: 'An enemy within 2 squares of you moves on its turn.',
    effect: 'You shift 3 squares. Until the end of your next turn, you deal 1d6 extra damage to the triggering enemy on your next hit, and you do not take the -2 penalty for attacking it with cover or concealment.',
    flavor: 'Like a predator on the hunt, you pursue your quarry with relentless focus.',
    special: 'Aspect of the Hunter. You choose this power after an extended rest when you adopt the Aspect of the Hunter.',
  },

  // ────────────────────────────────────────────────────────────────────────────
  // HotF (HEROES OF THE FEYWILD) RACIAL POWERS
  // ────────────────────────────────────────────────────────────────────────────

  // ── Hamadryad ──────────────────────────────────────────────────────────────
  {
    id: 'racial-hamadryad-aspects',
    name: 'Hamadryad Aspects',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'minor',
    range: 'Personal',
    keywords: [],
    effect: 'Choose one of the following aspects: Spellbinding Beauty — every enemy that can see you grants combat advantage to you until the end of your next turn. Wooden Form — you gain resist 5 to all damage until the end of your next turn. Level 11: Resist 10. Level 21: Resist 15.',
    flavor: 'You call upon the dual nature of your fey heritage, adopting the aspect of beauty or resilience.',
  },

  // ── Pixie ──────────────────────────────────────────────────────────────────
  {
    id: 'racial-pixie-dust',
    name: 'Pixie Dust',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'move',
    range: 'Ranged 5',
    keywords: [],
    target: 'One ally',
    effect: 'The target can fly up to 6 squares as a free action.',
    flavor: 'You sprinkle a shower of sparkling pixie dust, granting an ally the gift of flight.',
  },
  {
    id: 'racial-shrink',
    name: 'Shrink',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'minor',
    range: 'Melee 1',
    keywords: [],
    target: 'One object that is sized for a Medium or Small creature, is not inside a container, does not contain anything, and is not held, worn, or carried by anyone other than you.',
    effect: 'The target shrinks to a size appropriate for a Tiny creature\'s use. The new size ends at the end of your next extended rest unless the shrunken target is on your person. The size also ends if you or another pixie uses this power on the shrunken target. While shrunk, the target keeps its game statistics, such as damage dice and weight. A shrunken weapon, however, becomes an improvised one-handed weapon for a non-Tiny creature.',
    flavor: 'With a wave of your hand, you reduce an object to pixie proportions.',
  },

  // ── Satyr ──────────────────────────────────────────────────────────────────
  {
    id: 'racial-lure-of-enchantment',
    name: 'Lure of Enchantment',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'free',
    range: 'Personal',
    keywords: ['Charm'],
    trigger: 'You hit an enemy with an attack.',
    effect: 'You slide the enemy up to 3 squares, but not into hindering terrain. The enemy grants combat advantage until the end of your next turn.',
    flavor: 'Your fey charm beguiles your foe, drawing them where you wish.',
  },
];
