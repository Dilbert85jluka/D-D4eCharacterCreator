import type { Character } from '../../types/character';

interface PactOption {
  id: 'infernal' | 'fey' | 'star';
  name: string;
  boonName: string;
  usage: string;
  action: string;
  trigger: string;
  effect: string;
  /** Additional mechanical notes beyond the boon itself */
  note?: string;
}

const PACT_OPTIONS: PactOption[] = [
  {
    id: 'infernal',
    name: 'Infernal Pact',
    boonName: "Dark One's Blessing",
    usage: 'At-Will',
    action: 'Free Action',
    trigger: 'You reduce an enemy to 0 hit points or fewer.',
    effect:
      'You gain temporary hit points equal to your Charisma modifier + your level.',
    note:
      'The Infernal Pact draws power from dark bargains with devils and demons. ' +
      'Your eldritch blast deals fire and necrotic damage, and your curse empowers ' +
      'your strikes with infernal wrath.',
  },
  {
    id: 'fey',
    name: 'Fey Pact',
    boonName: 'Misty Step',
    usage: 'At-Will',
    action: 'Free Action',
    trigger: 'You reduce an enemy to 0 hit points or fewer.',
    effect: 'You teleport 3 squares.',
    note:
      'The Fey Pact binds you to the capricious lords of the Feywild. ' +
      'Your eldritch blast deals radiant and psychic damage, and your curse ' +
      'lets you slip between shadows with supernatural speed.',
  },
  {
    id: 'star',
    name: 'Star Pact',
    boonName: 'Fate of the Void',
    usage: 'At-Will',
    action: 'Free Action',
    trigger: 'You reduce an enemy to 0 hit points or fewer.',
    effect:
      'You gain a cumulative +1 bonus to attack rolls until the end of the encounter. ' +
      'This bonus resets to 0 when the encounter ends.',
    note:
      'The Star Pact connects you to dark powers beyond the known planes — ' +
      'Elder Evils and alien entities. Your eldritch blast deals psychic and necrotic ' +
      'damage, and each kill fuels your growing power.',
  },
];

interface Props {
  character: Character;
}

export function EldritchPactPanel({ character }: Props) {
  const chosen = character.warlockPact; // 'infernal' | 'fey' | 'star' | undefined

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs text-stone-500 italic">
        {chosen
          ? 'Your chosen pact is highlighted. The others are shown for reference.'
          : 'No pact selected. Edit your character to choose one in Step 3 (Class).'}
      </p>

      {PACT_OPTIONS.map((opt) => {
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
            </div>

            {/* ── Flavour / lore note ── */}
            {opt.note && (
              <p className={`text-xs mt-1.5 italic leading-relaxed ${isChosen ? 'text-amber-700' : 'text-stone-400'}`}>
                {opt.note}
              </p>
            )}

            {/* ── Pact Boon header ── */}
            <div className="flex items-center gap-2 flex-wrap mt-3 pt-2 border-t border-stone-100">
              <span className={`text-xs font-bold uppercase tracking-wide ${isChosen ? 'text-amber-700' : 'text-stone-400'}`}>
                Pact Boon:
              </span>
              <span className={`text-xs font-semibold ${isChosen ? 'text-amber-800' : 'text-stone-500'}`}>
                {opt.boonName}
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

            {/* ── Trigger ── */}
            <p className={`text-xs mt-1.5 ${isChosen ? 'text-amber-700' : 'text-stone-400'}`}>
              <span className="font-semibold">Trigger:</span> {opt.trigger}
            </p>

            {/* ── Effect ── */}
            <p className={`text-xs mt-1 leading-relaxed ${isChosen ? 'text-stone-700' : 'text-stone-400'}`}>
              <span className="font-semibold">Effect:</span> {opt.effect}
            </p>
          </div>
        );
      })}
    </div>
  );
}
