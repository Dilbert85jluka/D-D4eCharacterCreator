import type { PowerData } from '../../types/gameData';

/**
 * PHB2 racial encounter powers.
 * These use classId: 'racial' to distinguish from class powers.
 * Level 0 = auto-granted racial feature (not a player choice).
 */
export const RACIAL_POWERS: PowerData[] = [
  // ── Deva ──────────────────────────────────────────────────────────────────
  {
    id: 'racial-memory-of-a-thousand-lifetimes',
    name: 'Memory of a Thousand Lifetimes',
    classId: 'racial',
    level: 0,
    usage: 'encounter',
    actionType: 'free',
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
    keywords: [],
    trigger: 'An enemy within 2 squares of you moves on its turn.',
    effect: 'You shift 3 squares. Until the end of your next turn, you deal 1d6 extra damage to the triggering enemy on your next hit, and you do not take the -2 penalty for attacking it with cover or concealment.',
    flavor: 'Like a predator on the hunt, you pursue your quarry with relentless focus.',
    special: 'Aspect of the Hunter. You choose this power after an extended rest when you adopt the Aspect of the Hunter.',
  },
];
