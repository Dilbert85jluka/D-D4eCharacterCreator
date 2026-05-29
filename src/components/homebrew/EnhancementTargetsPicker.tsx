import type { EnhancementTarget } from '../../types/gameData';
import { ENHANCEMENT_TARGET_LABELS } from '../../types/gameData';

interface Props {
  /** Currently selected targets. Omit/empty array = no enhancement bonus applied. */
  value: EnhancementTarget[];
  onChange: (next: EnhancementTarget[]) => void;
  /** Which targets to show in the chip list. Default = all six. */
  allowed?: EnhancementTarget[];
  /** Short hint shown under the chips. */
  hint?: string;
}

const ALL_TARGETS: EnhancementTarget[] = ['AC', 'fortitude', 'reflex', 'will', 'attack', 'damage'];

/**
 * Multi-select chip group for the granular `enhancementTargets` field on magic items.
 * Replaces the legacy single-dropdown that bundled Fort/Ref/Will and attack+damage
 * into single options. Each chip toggles one EnhancementTarget. When any chip is
 * selected, that target receives the tier's enhancement bonus at runtime.
 */
export function EnhancementTargetsPicker({ value, onChange, allowed = ALL_TARGETS, hint }: Props) {
  const toggle = (t: EnhancementTarget) =>
    onChange(value.includes(t) ? value.filter((x) => x !== t) : [...value, t]);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {allowed.map((t) => {
          const selected = value.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={[
                'px-2.5 py-1 text-xs font-semibold rounded-full border transition-all min-h-[32px]',
                selected
                  ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-300 hover:border-amber-400 hover:bg-amber-50',
              ].join(' ')}
              aria-pressed={selected}
            >
              {selected ? '✓ ' : ''}{ENHANCEMENT_TARGET_LABELS[t]}
            </button>
          );
        })}
      </div>
      {hint && <p className="text-xs text-stone-400 mt-1.5">{hint}</p>}
      {value.length === 0 && (
        <p className="text-xs text-amber-700 mt-1.5 italic">No targets selected — the tier's enhancement number will not be applied to the character sheet.</p>
      )}
    </div>
  );
}
