import { inputCls } from './EditorLayout';

export interface Tier {
  level: number;
  enhancement: number;
  cost: number;
}

interface Props {
  tiers: Tier[];
  onChange: (tiers: Tier[]) => void;
}

export function TierEditor({ tiers, onChange }: Props) {
  const addTier = () => onChange([...tiers, { level: 1, enhancement: 1, cost: 360 }]);

  const updateTier = (idx: number, field: keyof Tier, val: number) => {
    const updated = tiers.map((t, i) => i === idx ? { ...t, [field]: val } : t);
    onChange(updated);
  };

  const removeTier = (idx: number) => onChange(tiers.filter((_, i) => i !== idx));

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-stone-700">Tiers</label>
        <button
          type="button"
          onClick={addTier}
          className="text-xs font-semibold text-amber-700 hover:text-amber-600 min-h-[32px] px-2"
        >
          + Add Tier
        </button>
      </div>
      {tiers.length === 0 && (
        <p className="text-xs text-stone-400">No tiers yet — add at least one</p>
      )}
      {tiers.map((tier, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div>
              <span className="text-xs text-stone-400">Lvl</span>
              <input className={inputCls} type="number" min={1} max={30} value={tier.level} onChange={(e) => updateTier(idx, 'level', Number(e.target.value))} />
            </div>
            <div>
              <span className="text-xs text-stone-400">+Enh</span>
              <input className={inputCls} type="number" min={0} max={6} value={tier.enhancement} onChange={(e) => updateTier(idx, 'enhancement', Number(e.target.value))} />
            </div>
            <div>
              <span className="text-xs text-stone-400">Cost (gp)</span>
              <input className={inputCls} type="number" min={0} value={tier.cost} onChange={(e) => updateTier(idx, 'cost', Number(e.target.value))} />
            </div>
          </div>
          <button
            onClick={() => removeTier(idx)}
            className="text-red-400 hover:text-red-600 text-sm font-bold min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
