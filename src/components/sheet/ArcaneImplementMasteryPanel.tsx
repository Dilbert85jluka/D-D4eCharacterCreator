import type { Character } from '../../types/character';

// ─── Verified from iws.mx https://iws.mx/dnd/?view=class9 (Wizard / PHB) ────
interface AimOption {
  id: 'orb' | 'staff' | 'wand';
  name: string;
  usage: string;
  action: string;
  /** Passive bonus granted at all times (no action required) */
  passiveNote?: string;
  /** Trigger for Immediate Interrupt options */
  trigger?: string;
  /** Full feature benefit text — sourced from iws.mx PHB wizard entry */
  benefit: string;
  /** Requirement line */
  requirement: string;
}

const AIM_OPTIONS: AimOption[] = [
  {
    id: 'orb',
    name: 'Orb of Imposition',
    usage: 'Encounter',
    action: 'Free Action',
    benefit:
      'You can use your orb to gain one of the following two effects. ' +
      'You can designate one creature you have cast a wizard spell upon that has an effect that lasts until ' +
      'the subject succeeds on a saving throw. That creature takes a penalty to its next saving throw ' +
      'against that effect equal to your Wisdom modifier. Alternatively, you can choose to extend the ' +
      'duration of an effect created by a wizard at-will spell (such as cloud of daggers or ray of frost) ' +
      'that would otherwise end at the end of your current turn. The effect instead ends at the end of ' +
      'your next turn.',
    requirement: 'You must wield an orb to use this ability.',
  },
  {
    id: 'staff',
    name: 'Staff of Defense',
    usage: 'Encounter',
    action: 'Immediate Interrupt',
    passiveNote: '+1 bonus to AC while wielding your staff.',
    trigger: 'You are hit by an attack.',
    benefit:
      'You gain a bonus to defense against one attack equal to your Constitution modifier. ' +
      'You can declare the bonus after the Dungeon Master has already told you the damage total.',
    requirement: 'You must wield your staff.',
  },
  {
    id: 'wand',
    name: 'Wand of Accuracy',
    usage: 'Encounter',
    action: 'Free Action',
    benefit: 'You gain a bonus to a single attack roll equal to your Dexterity modifier.',
    requirement: 'You must wield your wand.',
  },
];

interface Props {
  character: Character;
}

export function ArcaneImplementMasteryPanel({ character }: Props) {
  const chosen = character.arcaneImplement; // 'orb' | 'staff' | 'wand' | undefined

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs text-stone-500 italic">
        {chosen
          ? 'Your chosen implement mastery is highlighted. The others are shown for reference.'
          : 'No implement mastery selected. Edit your character to choose one in Step 3 (Class).'}
      </p>

      {AIM_OPTIONS.map((opt) => {
        const isChosen = chosen === opt.id;
        const isOther  = chosen !== undefined && !isChosen;

        return (
          <div
            key={opt.id}
            className={`rounded-xl border p-4 transition-opacity ${
              isChosen
                ? 'border-amber-400 bg-amber-50'
                : isOther
                  ? 'border-stone-200 bg-stone-50 opacity-40'
                  : 'border-stone-200 bg-white'
            }`}
          >
            {/* ── Header row ── */}
            <div className="flex items-center gap-2 flex-wrap">
              {isChosen && (
                <span className="text-amber-600 text-base leading-none" aria-hidden>★</span>
              )}
              <span className={`text-sm font-bold ${isChosen ? 'text-amber-800' : 'text-stone-600'}`}>
                {opt.name}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                isChosen ? 'bg-amber-200 text-amber-800' : 'bg-stone-100 text-stone-500'
              }`}>
                {opt.usage}
              </span>
              <span className={`text-xs font-medium ${isChosen ? 'text-amber-700' : 'text-stone-400'}`}>
                {opt.action}
              </span>
            </div>

            {/* ── Passive note (always-on benefit) ── */}
            {opt.passiveNote && (
              <p className={`text-xs mt-1.5 font-medium ${isChosen ? 'text-amber-700' : 'text-stone-400'}`}>
                <span className="font-semibold">Passive:</span> {opt.passiveNote}
              </p>
            )}

            {/* ── Trigger ── */}
            {opt.trigger && (
              <p className={`text-xs mt-1.5 ${isChosen ? 'text-amber-700' : 'text-stone-400'}`}>
                <span className="font-semibold">Trigger:</span> {opt.trigger}
              </p>
            )}

            {/* ── Benefit ── */}
            <p className={`text-xs mt-1.5 leading-relaxed ${isChosen ? 'text-stone-700' : 'text-stone-400'}`}>
              <span className="font-semibold">Effect:</span> {opt.benefit}
            </p>

            {/* ── Requirement ── */}
            <p className={`text-xs mt-1 italic ${isChosen ? 'text-amber-600' : 'text-stone-300'}`}>
              {opt.requirement}
            </p>
          </div>
        );
      })}
    </div>
  );
}
