import { useState } from 'react';
import { playDiceRollSound } from '../../utils/diceSound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ── Die config ────────────────────────────────────────────────────────────────────────────────

const DICE = [
  { sides: 20,  label: 'd20', color: 'amber'  },
  { sides: 12,  label: 'd12', color: 'purple' },
  { sides: 10,  label: 'd10', color: 'blue'   },
  { sides: 100, label: 'd%',  color: 'teal'   },
  { sides: 8,   label: 'd8',  color: 'green'  },
  { sides: 6,   label: 'd6',  color: 'red'    },
  { sides: 4,   label: 'd4',  color: 'orange' },
  { sides: 2,   label: 'd2',  color: 'stone'  },
] as const;

type DieLabel = typeof DICE[number]['label'];
type DieColor = typeof DICE[number]['color'];

// Static color map — Tailwind v4 requires full literal class strings (no dynamic interpolation)
const colorMap: Record<DieColor, { bg: string; text: string; border: string; badge: string }> = {
  amber:  { bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-300',  badge: 'bg-amber-700 text-white'  },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', badge: 'bg-purple-700 text-white' },
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300',   badge: 'bg-blue-700 text-white'   },
  teal:   { bg: 'bg-teal-100',   text: 'text-teal-800',   border: 'border-teal-300',   badge: 'bg-teal-600 text-white'   },
  green:  { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  badge: 'bg-green-700 text-white'  },
  red:    { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300',    badge: 'bg-red-700 text-white'    },
  orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', badge: 'bg-orange-600 text-white' },
  stone:  { bg: 'bg-stone-100',  text: 'text-stone-700',  border: 'border-stone-300',  badge: 'bg-stone-600 text-white'  },
};

// ── Types ────────────────────────────────────────────────────────────────────────────────────

type Counts = Record<DieLabel, number>;

interface RollGroup {
  label: DieLabel;
  sides: number;
  rolls: number[];
  color: DieColor;
}

// ── Main component ─────────────────────────────────────────────────────────────────────────────

export function DiceRollerModal({ isOpen, onClose }: Props) {
  const [counts, setCounts] = useState<Counts>({
    d20: 0, d12: 0, d10: 0, 'd%': 0, d8: 0, d6: 0, d4: 0, d2: 0,
  });
  const [results, setResults] = useState<RollGroup[] | null>(null);
  const [rolling, setRolling] = useState(false);

  if (!isOpen) return null;

  const hasAnyDice = Object.values(counts).some((c) => c > 0);

  const total = results
    ? results.reduce((sum, g) => sum + g.rolls.reduce((a, b) => a + b, 0), 0)
    : 0;

  const adjust = (label: DieLabel, delta: number) => {
    setCounts((prev) => ({
      ...prev,
      [label]: Math.min(10, Math.max(0, prev[label] + delta)),
    }));
  };

  const handleRoll = () => {
    if (!hasAnyDice || rolling) return;

    // Compute results eagerly so the values are captured before counts reset
    const totalDice = Object.values(counts).reduce((a, b) => a + b, 0);
    const newResults: RollGroup[] = [];
    for (const die of DICE) {
      const count = counts[die.label];
      if (count <= 0) continue;
      const rolls: number[] = [];
      for (let i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * die.sides) + 1);
      }
      newResults.push({ label: die.label, sides: die.sides, rolls, color: die.color });
    }

    // Play sound, reset counts, enter "rolling" state
    playDiceRollSound(totalDice);
    setCounts({ d20: 0, d12: 0, d10: 0, 'd%': 0, d8: 0, d6: 0, d4: 0, d2: 0 });
    setRolling(true);
    setResults(null);

    // Reveal results after sound finishes (~2.2 s)
    setTimeout(() => {
      setResults(newResults);
      setRolling(false);
    }, 2200);
  };

  const handleClear = () => {
    setCounts({ d20: 0, d12: 0, d10: 0, 'd%': 0, d8: 0, d6: 0, d4: 0, d2: 0 });
    setResults(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-3 pb-3 sm:pb-0"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-amber-950 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎲</span>
            <h2 className="text-white font-bold text-lg">Dice Roller</h2>
          </div>
          <button
            onClick={onClose}
            className="text-amber-300 hover:text-white transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center"
            aria-label="Close dice roller"
          >
            ×
          </button>
        </div>

        <div className="px-4 pt-4 pb-3 space-y-3">

          {/* ── Die selectors — 2 columns × 4 rows ── */}
          <div className="grid grid-cols-2 gap-2">
            {DICE.map((die) => {
              const c = colorMap[die.color];
              return (
                <div key={die.label} className="flex items-center gap-2">
                  {/* Die label badge */}
                  <span className={`${c.badge} text-xs font-bold rounded-lg px-2 py-1.5 min-w-[3rem] text-center flex-shrink-0`}>
                    {die.label}
                  </span>

                  {/* minus button */}
                  <button
                    onClick={() => adjust(die.label, -1)}
                    disabled={counts[die.label] === 0}
                    className={[
                      'w-9 h-9 rounded-lg text-lg font-bold transition-colors flex items-center justify-center flex-shrink-0',
                      counts[die.label] === 0
                        ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                        : 'bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-stone-700',
                    ].join(' ')}
                    aria-label={`Remove ${die.label}`}
                  >
                    −
                  </button>

                  {/* Count */}
                  <span className="w-6 text-center font-bold text-xl text-stone-800 flex-shrink-0">
                    {counts[die.label]}
                  </span>

                  {/* plus button */}
                  <button
                    onClick={() => adjust(die.label, +1)}
                    disabled={counts[die.label] >= 10}
                    className={[
                      'w-9 h-9 rounded-lg text-lg font-bold transition-colors flex items-center justify-center flex-shrink-0',
                      counts[die.label] >= 10
                        ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                        : 'bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-stone-700',
                    ].join(' ')}
                    aria-label={`Add ${die.label}`}
                  >
                    +
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Roll button ── */}
          <button
            onClick={handleRoll}
            disabled={!hasAnyDice || rolling}
            className={[
              'w-full h-12 rounded-xl text-lg font-bold transition-colors',
              !hasAnyDice || rolling
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white',
            ].join(' ')}
          >
            {rolling ? 'Rolling…' : '🎲 Roll'}
          </button>

          {/* ── Results ── */}
          {results !== null && (
            <div className="border border-stone-200 rounded-xl overflow-hidden">

              {/* Individual result groups */}
              <div className="px-4 pt-3 pb-2 space-y-2">
                {results.map((group) => {
                  const c = colorMap[group.color];
                  return (
                    <div key={group.label} className="flex items-center gap-2 flex-wrap">
                      <span className={`${c.badge} text-xs font-bold rounded px-1.5 py-0.5 flex-shrink-0`}>
                        {group.label}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {group.rolls.map((r, i) => (
                          <span
                            key={i}
                            className={[
                              'min-w-[2rem] h-8 rounded-full border flex items-center justify-center text-sm font-bold',
                              c.bg, c.text, c.border,
                            ].join(' ')}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="bg-stone-50 border-t border-stone-200 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-500 uppercase tracking-wide">Total</span>
                <span className="text-4xl font-black text-amber-700">{total}</span>
              </div>

            </div>
          )}

          {/* ── Clear ── */}
          {(hasAnyDice || results !== null) && (
            <div className="flex justify-end">
              <button
                onClick={handleClear}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
              >
                Clear
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

