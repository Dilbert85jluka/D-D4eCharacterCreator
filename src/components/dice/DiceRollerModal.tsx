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

interface HistoryEntry {
  id: number;
  time: string;      // HH:MM display time
  groups: RollGroup[];
  total: number;
}

const EMPTY_COUNTS: Counts = { d20: 0, d12: 0, d10: 0, 'd%': 0, d8: 0, d6: 0, d4: 0, d2: 0 };

const HISTORY_LIMIT = 10;

// ── Main component ─────────────────────────────────────────────────────────────────────────────
//
// Docked bottom tray (not a blocking modal): no backdrop, so the character sheet
// above stays scrollable and tappable — pick your attack, read your modifiers and
// dice count, and roll without leaving the page. The component stays mounted while
// the sheet is open, so counts/results/history survive closing and reopening the tray.

export function DiceRollerModal({ isOpen, onClose }: Props) {
  const [counts, setCounts] = useState<Counts>(EMPTY_COUNTS);
  const [results, setResults] = useState<RollGroup[] | null>(null);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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
    const newTotal = newResults.reduce((sum, g) => sum + g.rolls.reduce((a, b) => a + b, 0), 0);

    // Play sound, reset counts, enter "rolling" state
    playDiceRollSound(totalDice);
    setCounts(EMPTY_COUNTS);
    setRolling(true);
    setResults(null);

    // Reveal results after sound finishes (~2.2 s), then log to history
    setTimeout(() => {
      setResults(newResults);
      setRolling(false);
      setHistory((prev) =>
        [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            groups: newResults,
            total: newTotal,
          },
          ...prev,
        ].slice(0, HISTORY_LIMIT),
      );
    }, 2200);
  };

  const handleClear = () => {
    setCounts(EMPTY_COUNTS);
    setResults(null);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto bg-white rounded-t-2xl border border-b-0 border-stone-300 shadow-[0_-6px_24px_rgba(0,0,0,0.28)]">

        {/* ── Header strip ── */}
        <div className="bg-amber-950 rounded-t-2xl px-4 py-2 flex items-center gap-2">
          <span className="text-lg">🎲</span>
          <h2 className="text-white font-bold text-sm">Dice Roller</h2>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setShowHistory((v) => !v)}
              className={[
                'text-xs font-semibold rounded-lg px-2.5 py-1.5 transition-colors',
                showHistory
                  ? 'bg-amber-700 text-white'
                  : 'text-amber-300 hover:text-white hover:bg-amber-900',
              ].join(' ')}
              aria-label="Toggle roll history"
            >
              🕘 History{history.length > 0 ? ` (${history.length})` : ''}
            </button>
            {(hasAnyDice || results !== null) && (
              <button
                onClick={handleClear}
                className="text-xs font-semibold text-amber-300 hover:text-white hover:bg-amber-900 rounded-lg px-2.5 py-1.5 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="text-amber-300 hover:text-white transition-colors text-xl leading-none w-8 h-8 flex items-center justify-center"
              aria-label="Close dice roller"
            >
              ×
            </button>
          </div>
        </div>

        {/* ── Roll history (last 10) ── */}
        {showHistory && (
          <div className="border-b border-stone-200 max-h-40 overflow-y-auto">
            {history.length === 0 ? (
              <p className="px-4 py-2.5 text-xs text-stone-400 italic">No rolls yet this session.</p>
            ) : (
              <div className="divide-y divide-stone-100">
                {history.map((h) => (
                  <div key={h.id} className="px-4 py-1.5 flex items-center gap-2 text-xs">
                    <span className="text-stone-400 tabular-nums flex-shrink-0 w-12">{h.time}</span>
                    <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
                      {h.groups.map((g) => {
                        const c = colorMap[g.color];
                        return (
                          <span key={g.label} className="inline-flex items-center gap-1 flex-shrink-0">
                            <span className={`${c.badge} font-bold rounded px-1 py-0.5 text-[10px]`}>
                              {g.rolls.length}×{g.label}
                            </span>
                            <span className="text-stone-600">{g.rolls.join(', ')}</span>
                          </span>
                        );
                      })}
                    </div>
                    <span className="font-black text-amber-700 text-sm flex-shrink-0 tabular-nums">{h.total}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="px-3 pt-2.5 pb-3 space-y-2.5">

          {/* ── Die selectors — tap a die to add one, thin − bar to remove ── */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {DICE.map((die) => {
              const c = colorMap[die.color];
              const count = counts[die.label];
              return (
                <div key={die.label} className="flex flex-col gap-1">
                  <button
                    onClick={() => adjust(die.label, +1)}
                    disabled={count >= 10}
                    className={[
                      'relative h-11 rounded-lg border font-bold text-sm transition-colors',
                      c.bg, c.text, c.border,
                      count >= 10 ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95 active:brightness-90',
                    ].join(' ')}
                    aria-label={`Add ${die.label}`}
                  >
                    {die.label}
                    {count > 0 && (
                      <span
                        className={`${c.badge} absolute -top-1.5 -right-1.5 text-[11px] font-bold rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => adjust(die.label, -1)}
                    disabled={count === 0}
                    className={[
                      'h-6 rounded text-sm font-bold leading-none transition-colors',
                      count === 0
                        ? 'bg-stone-50 text-stone-200 cursor-not-allowed'
                        : 'bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-stone-600',
                    ].join(' ')}
                    aria-label={`Remove ${die.label}`}
                  >
                    −
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Roll button + inline results ── */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRoll}
              disabled={!hasAnyDice || rolling}
              className={[
                'h-11 px-5 rounded-xl text-base font-bold transition-colors flex-shrink-0',
                !hasAnyDice || rolling
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white',
              ].join(' ')}
            >
              {rolling ? 'Rolling…' : '🎲 Roll'}
            </button>

            <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
              {rolling ? (
                <span className="text-sm text-stone-400 italic">Dice are tumbling…</span>
              ) : results !== null ? (
                results.map((group) => {
                  const c = colorMap[group.color];
                  return (
                    <span key={group.label} className="inline-flex items-center gap-1 flex-shrink-0">
                      <span className={`${c.badge} text-[10px] font-bold rounded px-1 py-0.5`}>
                        {group.label}
                      </span>
                      {group.rolls.map((r, i) => (
                        <span
                          key={i}
                          className={[
                            'min-w-[1.75rem] h-7 px-1 rounded-full border flex items-center justify-center text-xs font-bold',
                            c.bg, c.text, c.border,
                          ].join(' ')}
                        >
                          {r}
                        </span>
                      ))}
                    </span>
                  );
                })
              ) : (
                <span className="text-sm text-stone-400">
                  {hasAnyDice ? 'Ready — hit Roll' : 'Tap dice to add them'}
                </span>
              )}
            </div>

            {results !== null && !rolling && (
              <div className="flex-shrink-0 flex items-baseline gap-1.5 pl-1">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">Total</span>
                <span className="text-3xl font-black text-amber-700 tabular-nums">{total}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
