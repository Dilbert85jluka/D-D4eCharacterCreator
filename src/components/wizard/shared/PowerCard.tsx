import type { Ability } from '../../../types/character';
import type { PowerData, PowerUsage } from '../../../types/gameData';
import { Badge } from '../../ui/Badge';
import type { AugmentOption } from '../../../utils/psionics';
import { substituteMods } from '../../../utils/powerText';

interface PowerCardProps {
  power: PowerData;
  selected?: boolean;
  used?: boolean;
  onClick?: () => void;
  /** When provided, renders a circle toggle button in the header for encounter/daily powers. */
  onToggleUsed?: () => void;
  showCheckbox?: boolean;
  /** Psionic augment options parsed from the power's special text. */
  augmentOptions?: AugmentOption[];
  /** Current power points available to the character. */
  currentPowerPoints?: number;
  /** Non-augment prefix text from the special field. */
  nonAugmentSpecialText?: string;
  /** Callback when an augment is clicked — spends PP equal to cost. */
  onSpendAugment?: (cost: number) => void;
  /** Character ability modifiers — when provided, numeric values are substituted into power text. */
  abilityModifiers?: Record<Ability, number>;
}

const usageColors: Record<PowerUsage, string> = {
  'at-will': 'bg-emerald-800',
  'encounter': 'bg-red-800',
  'daily': 'bg-gray-900',
};

const usageLabels: Record<PowerUsage, string> = {
  'at-will': 'At-Will',
  'encounter': 'Encounter',
  'daily': 'Daily',
};

export function PowerCard({
  power, selected, used, onClick, onToggleUsed, showCheckbox,
  augmentOptions, currentPowerPoints, nonAugmentSpecialText, onSpendAugment, abilityModifiers,
}: PowerCardProps) {
  const usageClass = `power-${power.usage}`;
  const hasAugments = augmentOptions && augmentOptions.length > 0 && onSpendAugment;
  const sub = (text: string | undefined) => substituteMods(text, abilityModifiers);

  return (
    <div
      className={[
        usageClass,
        'rounded-lg border border-stone-200 overflow-hidden',
        onClick ? 'cursor-pointer' : '',
        selected ? 'ring-2 ring-amber-400 shadow-md' : '',
        used ? 'opacity-50' : '',
        'transition-all',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {/* Header */}
      <div className={`power-header px-3 py-2 flex items-center justify-between gap-2 text-white`}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {showCheckbox && (
            <div
              className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center
                ${selected ? 'bg-white border-white' : 'border-white/60'}`}
            >
              {selected && <span className="text-stone-800 text-xs font-bold">✓</span>}
            </div>
          )}
          {/* Usage-tracking circle — only for encounter/daily, only in play view */}
          {onToggleUsed && (power.usage === 'encounter' || power.usage === 'daily') && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleUsed(); }}
              className={[
                'w-5 h-5 rounded-full flex-shrink-0 border-2 border-white/80 transition-all',
                'hover:border-white hover:scale-110 focus:outline-none focus:ring-1 focus:ring-white',
                used ? 'bg-white' : 'bg-transparent',
              ].join(' ')}
              title={used ? 'Used — click to restore' : 'Available — click to mark used'}
              aria-label={used ? 'Mark power as available' : 'Mark power as used'}
            />
          )}
          <span className="font-bold text-sm truncate">{power.name}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {power.cantrip && (
            <span className="text-[10px] font-bold bg-teal-600 text-white px-1.5 py-0.5 rounded">
              Cantrip
            </span>
          )}
          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">
            {usageLabels[power.usage]}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${power.powerType === 'utility' ? 'bg-blue-500/60' : 'bg-white/20'}`}>
            {power.powerType === 'utility' ? 'Utility' : 'Attack'}
          </span>
          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded capitalize">
            {power.actionType.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2 bg-white text-xs space-y-1.5">
        {/* Range */}
        {power.range && (
          <p className="font-semibold text-indigo-700">{power.range}</p>
        )}

        {/* Keywords */}
        {power.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {power.keywords.map((kw) => (
              <Badge key={kw} color="stone" size="sm">{kw}</Badge>
            ))}
          </div>
        )}

        {/* Full Discipline — technique header */}
        {power.keywords.includes('Full Discipline') && (
          power.id.endsWith('-mt') ? (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-teal-700 text-xs">Movement Technique</span>
              <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-medium">{power.actionType === 'move' ? 'Move Action' : power.actionType === 'minor' ? 'Minor Action' : 'Free Action'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-amber-700 text-xs">Attack Technique</span>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">{power.actionType === 'standard' ? 'Standard Action' : power.actionType.replace('-', ' ')}</span>
            </div>
          )
        )}

        {/* Trigger */}
        {power.trigger && (
          <p><span className="font-semibold text-orange-700">Trigger:</span> {sub(power.trigger)}</p>
        )}

        {/* Attack line */}
        {power.attack && (
          <p><span className="font-semibold">Attack:</span> {sub(power.attack)}</p>
        )}

        {/* Target */}
        {power.target && <p><span className="font-semibold">Target:</span> {power.target}</p>}

        {/* Hit */}
        {power.hit && (
          <p><span className="font-semibold text-emerald-700">Hit:</span> {sub(power.hit)}</p>
        )}

        {/* Miss */}
        {power.miss && (
          <p><span className="font-semibold text-red-600">Miss:</span> {sub(power.miss)}</p>
        )}

        {/* Effect */}
        {power.effect && (
          <p><span className="font-semibold text-blue-700">Effect:</span> {sub(power.effect)}</p>
        )}

        {/* Special — structured augment display for psionic powers, raw text otherwise */}
        {hasAugments ? (
          <div className="space-y-2 mt-1">
            {/* Non-augment prefix text */}
            {nonAugmentSpecialText && (
              <p><span className="font-semibold text-amber-700">Special:</span> {sub(nonAugmentSpecialText)}</p>
            )}

            {/* Augment cards — each card spends PP on click */}
            {augmentOptions!.map((aug) => {
              const pp = currentPowerPoints ?? 0;
              const canAfford = pp >= aug.cost;
              return (
                <button
                  key={aug.cost}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canAfford) onSpendAugment(aug.cost);
                  }}
                  disabled={!canAfford}
                  className={[
                    'w-full text-left rounded-lg px-2.5 py-2 border transition-all',
                    canAfford
                      ? 'bg-stone-50 border-stone-100 hover:border-violet-200 hover:bg-violet-50/50'
                      : 'bg-stone-50 border-stone-100 opacity-40 cursor-not-allowed',
                  ].join(' ')}
                  title={canAfford ? `Spend ${aug.cost} PP` : `Need ${aug.cost} PP (have ${pp})`}
                >
                  <span className={[
                    'inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mb-0.5',
                    canAfford ? 'bg-violet-600 text-white' : 'bg-stone-200 text-stone-400',
                  ].join(' ')}>
                    Augment +{aug.cost}PP
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">{sub(aug.description)}</p>
                </button>
              );
            })}
          </div>
        ) : (
          /* Standard special text (non-psionic) — Full Discipline techniques get linked sub-sections */
          power.special && (() => {
            // Attack Technique card → show Movement Technique as sub-section
            const isAttackTechnique = power.keywords.includes('Full Discipline') && power.special.startsWith('Movement Technique');
            if (isAttackTechnique) {
              const mtMatch = power.special.match(/^Movement Technique\s*\(([^)]+)\):\s*([\s\S]*)$/);
              const mtAction = mtMatch?.[1] ?? 'Move Action';
              const mtBody = mtMatch?.[2] ?? power.special;
              return (
                <div className="mt-2 border-t border-stone-200 pt-2 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-teal-700 text-xs">Movement Technique</span>
                    <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded font-medium">{mtAction}</span>
                  </div>
                  <p className="text-xs"><span className="font-semibold text-teal-700">Effect:</span> {sub(mtBody)}</p>
                </div>
              );
            }
            // Movement Technique card → show Attack Technique as sub-section
            const isMovementTechnique = power.keywords.includes('Full Discipline') && power.special.startsWith('Attack Technique');
            if (isMovementTechnique) {
              const atMatch = power.special.match(/^Attack Technique\s*\(([^)]+)\):\s*([\s\S]*)$/);
              const atAction = atMatch?.[1] ?? 'Standard Action';
              const atBody = atMatch?.[2] ?? power.special;
              return (
                <div className="mt-2 border-t border-stone-200 pt-2 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-amber-700 text-xs">Attack Technique</span>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">{atAction}</span>
                  </div>
                  <p className="text-xs text-stone-600">{sub(atBody)}</p>
                </div>
              );
            }
            return (
              <p><span className="font-semibold text-amber-700">Special:</span> {sub(power.special)}</p>
            );
          })()
        )}

        {/* Flavor */}
        {power.flavor && (
          <p className="italic text-stone-400">{power.flavor}</p>
        )}
      </div>
    </div>
  );
}
