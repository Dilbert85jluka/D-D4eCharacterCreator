import { useState, useCallback } from 'react';
import type { MagicItemData } from '../../types/magicItem';
import { getRandomMagicItem, ALL_MAGIC_ITEMS } from '../../data/magicItems';
import { playDiceRollSound } from '../../utils/diceSound';

export function RandomItemRoller({
  onSelectItem,
}: {
  onSelectItem: (item: MagicItemData) => void;
}) {
  const [d10, setD10] = useState('');
  const [dPercent, setDPercent] = useState('');
  const [result, setResult] = useState<MagicItemData | null>(null);
  const [rolling, setRolling] = useState(false);

  const handleRoll = useCallback(() => {
    const d10Val = parseInt(d10, 10);
    const dpVal = parseInt(dPercent, 10);
    if (isNaN(d10Val) || d10Val < 1 || d10Val > 10) return;
    if (isNaN(dpVal) || dpVal < 1 || dpVal > 100) return;

    playDiceRollSound(2);
    setRolling(true);
    setResult(null);

    setTimeout(() => {
      const item = getRandomMagicItem(d10Val, dpVal, ALL_MAGIC_ITEMS);
      setResult(item ?? null);
      setRolling(false);
    }, 2200);
  }, [d10, dPercent]);

  const valid =
    !isNaN(parseInt(d10, 10)) && parseInt(d10, 10) >= 1 && parseInt(d10, 10) <= 10 &&
    !isNaN(parseInt(dPercent, 10)) && parseInt(dPercent, 10) >= 1 && parseInt(dPercent, 10) <= 100;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
      <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
        🎲 Random Magic Item Roller
      </h3>
      <p className="text-xs text-amber-700">
        Have your players roll a D10 and a D% (percentile), then enter the results below.
      </p>

      <div className="flex items-end gap-3">
        {/* D10 input */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-amber-800 mb-1">D10 (1–10)</label>
          <input
            type="number"
            min={1}
            max={10}
            value={d10}
            onChange={(e) => setD10(e.target.value)}
            placeholder="1–10"
            className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:outline-none focus:border-amber-500 min-h-[40px] bg-white"
          />
        </div>

        {/* D% input */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-amber-800 mb-1">D% (1–100)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={dPercent}
            onChange={(e) => setDPercent(e.target.value)}
            placeholder="1–100"
            className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:outline-none focus:border-amber-500 min-h-[40px] bg-white"
          />
        </div>

        {/* Roll button */}
        <button
          onClick={handleRoll}
          disabled={!valid || rolling}
          className="px-5 py-2 rounded-lg bg-amber-800 text-amber-100 font-semibold text-sm hover:bg-amber-700 disabled:opacity-40 min-h-[40px] min-w-[80px] transition-colors"
        >
          {rolling ? 'Rolling…' : 'Roll'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <button
          onClick={() => onSelectItem(result)}
          className="w-full text-left bg-white border border-amber-300 rounded-lg p-3 hover:bg-amber-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-stone-800 text-sm">{result.name}</div>
              <div className="text-xs text-stone-500">{result.category} · {result.source}</div>
            </div>
            <span className="text-xs text-amber-600 font-medium">View →</span>
          </div>
        </button>
      )}
    </div>
  );
}
