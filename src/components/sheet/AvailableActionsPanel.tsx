import { useState } from 'react';

type ActionCategory = 'standard' | 'move' | 'minor' | 'free' | 'immediate-interrupt' | 'immediate-reaction' | 'opportunity';

interface ActionEntry {
  name: string;
  description: string;
  note?: string;
}

const STANDARD_ACTIONS: ActionEntry[] = [
  {
    name: 'Melee Basic Attack',
    description: 'Attack: Strength vs. AC. Hit: 1[W] + Strength modifier damage.',
  },
  {
    name: 'Ranged Basic Attack',
    description: 'Attack: Dexterity vs. AC. Hit: 1[W] + Dexterity modifier damage.',
    note: 'Provokes opportunity attacks.',
  },
  {
    name: 'Aid Another',
    description:
      'Help an ally with an attack or skill check. Make a DC 10 check; on a success, your ally gains a +2 bonus to the same type of roll against the same target or DC.',
  },
  {
    name: 'Bull Rush',
    description:
      'Attack: Strength vs. Fortitude. Hit: Push the target 1 square; you can shift 1 square into the space it left. Miss: No effect.',
    note: 'Provokes opportunity attacks if used as a ranged attack.',
  },
  {
    name: 'Charge',
    description:
      'Move up to your speed and make a melee basic attack with a +1 bonus to the attack roll. You must move at least 2 squares and must end the move closer to the target. You cannot charge through difficult terrain.',
  },
  {
    name: 'Coup de Grace',
    description:
      'Make a melee attack against a helpless adjacent creature. You automatically score a critical hit. If the damage equals or exceeds the target\'s bloodied value, the target dies.',
  },
  {
    name: 'Delay',
    description:
      'Remove yourself from the initiative order. After any other combatant ends their turn, you may rejoin the order immediately before or after that combatant. Your new initiative count becomes the one you chose.',
  },
  {
    name: 'Escape',
    description:
      'Make an Acrobatics or Athletics check against the grabber\'s Reflex or Fortitude (your choice of check and defense). Success: You are no longer grabbed.',
  },
  {
    name: 'Grab',
    description:
      'Attack: Strength vs. Reflex. Hit: The target is grabbed (immobilized until it escapes or you release it). Sustain the grab as a minor action each round.',
  },
  {
    name: 'Second Wind',
    description:
      'Spend a healing surge; regain hit points equal to your healing surge value. Gain a +2 bonus to all defenses until the start of your next turn.',
    note: 'Once per encounter.',
  },
  {
    name: 'Total Defense',
    description:
      'Gain a +2 bonus to all defenses until the start of your next turn. You cannot take other standard actions this turn.',
  },
];

const MOVE_ACTIONS: ActionEntry[] = [
  {
    name: 'Walk',
    description: 'Move up to your speed.',
  },
  {
    name: 'Shift',
    description: 'Move 1 square. This movement does not provoke opportunity attacks.',
  },
  {
    name: 'Stand Up',
    description:
      'Stand up, ending the prone condition. This movement costs half your speed (minimum 1 square) and does not provoke opportunity attacks.',
  },
  {
    name: 'Squeeze',
    description:
      'Move through a space 1 size category smaller than normal for your size. While squeezing, you grant combat advantage and take a −5 penalty to attack rolls.',
  },
  {
    name: 'Transfer an Item',
    description:
      'Transfer a held item to an adjacent willing creature, or take a held item from an adjacent willing creature.',
  },
];

const MINOR_ACTIONS: ActionEntry[] = [
  {
    name: 'Draw or Sheathe a Weapon',
    description: 'Ready or put away a weapon or implement.',
  },
  {
    name: 'Drop Prone',
    description: 'Drop to the prone condition.',
  },
  {
    name: 'Drink a Potion',
    description: 'Drink a potion you are holding and immediately gain its effects.',
  },
  {
    name: 'Open or Close a Door',
    description: 'Open or close an unlocked door adjacent to you.',
  },
  {
    name: 'Pick Up an Item',
    description: 'Pick up an item in your square or in an adjacent square.',
  },
  {
    name: 'Retrieve or Stow an Item',
    description:
      'Retrieve an item stored on your person (making it a held item), or stow a held item on your person.',
  },
];

const FREE_ACTIONS: ActionEntry[] = [
  {
    name: 'Drop an Item',
    description: 'Release a held item into your square or an adjacent square.',
  },
  {
    name: 'Talk',
    description: 'Speak up to about 25 words.',
  },
];

const IMMEDIATE_INTERRUPTS: ActionEntry[] = [
  {
    name: 'Ready an Action',
    description:
      'Take a standard action to ready an interrupt. Declare a trigger and a standard, move, or minor action. When that trigger occurs before the start of your next turn, take the declared action as an immediate interrupt — it resolves before the trigger does.',
    note: 'You lose the readied action type on your next turn (e.g., readying a standard action means you have no standard action next turn).',
  },
];

const IMMEDIATE_REACTIONS: ActionEntry[] = [
  {
    name: 'Immediate Reaction',
    description:
      'An immediate reaction happens in response to a trigger and resolves after that trigger. You can only take one immediate action (interrupt or reaction) per round, and you cannot take an immediate action on your own turn.',
    note: 'Most immediate reactions are granted by class powers, not general combat rules.',
  },
];

const OPPORTUNITY_ACTIONS: ActionEntry[] = [
  {
    name: 'Opportunity Attack',
    description:
      'Trigger: An enemy adjacent to you either moves to a non-adjacent square without shifting, or makes a ranged or area attack. Effect: Make a melee basic attack against the triggering enemy.',
    note: 'Once per turn. You cannot take an opportunity action on your own turn.',
  },
];

const CATEGORY_DATA: Record<ActionCategory, { label: string; color: string; actions: ActionEntry[] }> = {
  standard:             { label: 'Standard Actions',     color: 'red',    actions: STANDARD_ACTIONS    },
  move:                 { label: 'Move Actions',         color: 'blue',   actions: MOVE_ACTIONS        },
  minor:                { label: 'Minor Actions',        color: 'green',  actions: MINOR_ACTIONS       },
  free:                 { label: 'Free Actions',         color: 'stone',  actions: FREE_ACTIONS        },
  'immediate-interrupt':{ label: 'Immediate Interrupts', color: 'orange', actions: IMMEDIATE_INTERRUPTS },
  'immediate-reaction': { label: 'Immediate Reactions',  color: 'teal',   actions: IMMEDIATE_REACTIONS  },
  opportunity:          { label: 'Opportunity Actions',  color: 'purple', actions: OPPORTUNITY_ACTIONS },
};

const COLOR_MAP: Record<string, { header: string; badge: string; border: string }> = {
  red:    { header: 'bg-red-700',    badge: 'bg-red-100 text-red-700',       border: 'border-l-red-500'    },
  blue:   { header: 'bg-blue-700',   badge: 'bg-blue-100 text-blue-700',     border: 'border-l-blue-500'   },
  green:  { header: 'bg-green-700',  badge: 'bg-green-100 text-green-700',   border: 'border-l-green-500'  },
  stone:  { header: 'bg-stone-600',  badge: 'bg-stone-100 text-stone-600',   border: 'border-l-stone-400'  },
  orange: { header: 'bg-orange-600', badge: 'bg-orange-100 text-orange-700', border: 'border-l-orange-500' },
  teal:   { header: 'bg-teal-700',   badge: 'bg-teal-100 text-teal-700',     border: 'border-l-teal-500'   },
  purple: { header: 'bg-purple-700', badge: 'bg-purple-100 text-purple-700', border: 'border-l-purple-500' },
};

const CATEGORIES: ActionCategory[] = ['standard', 'move', 'minor', 'free', 'immediate-interrupt', 'immediate-reaction', 'opportunity'];

export function AvailableActionsPanel() {
  const [activeCategory, setActiveCategory] = useState<ActionCategory>('standard');
  const { label, color, actions } = CATEGORY_DATA[activeCategory];
  const colors = COLOR_MAP[color];

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Actions in Combat</h3>
        <p className="text-amber-300 text-xs mt-0.5">Player's Handbook, p. 289</p>
      </div>

      {/* Category tab bar — wraps to two rows on narrow containers */}
      <div className="flex flex-wrap border-b border-stone-200">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={[
              'py-2.5 px-4 text-xs font-semibold whitespace-nowrap transition-colors min-h-[44px]',
              activeCategory === cat
                ? 'border-b-2 border-amber-600 text-amber-700'
                : 'text-stone-500 hover:text-stone-700',
            ].join(' ')}
          >
            {CATEGORY_DATA[cat].label}
          </button>
        ))}
      </div>

      {/* Action cards */}
      <div className="p-3 space-y-2">
        {/* Section badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.badge}`}>
            {label}
          </span>
          <span className="text-xs text-stone-400">
            {actions.length} action{actions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {actions.map((action) => (
          <div
            key={action.name}
            className={`rounded-lg border border-stone-200 border-l-4 ${colors.border} bg-stone-50 px-3 py-2.5`}
          >
            <p className="font-semibold text-stone-800 text-sm mb-1">{action.name}</p>
            <p className="text-xs text-stone-600 leading-relaxed">{action.description}</p>
            {action.note && (
              <p className="text-xs text-amber-700 font-medium mt-1.5 italic">{action.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
