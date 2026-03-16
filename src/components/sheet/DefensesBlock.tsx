import { useState } from 'react';
import type { DerivedStats } from '../../types/character';

interface Props {
  derived: DerivedStats;
}

type DefenseKey = 'ac' | 'fort' | 'ref' | 'will';

interface DefenseConfig {
  key:         DefenseKey;
  label:       string;
  fullName:    string;
  value:       number;
  color:       string;
  bg:          string;
  borderColor: string;
  headerBg:   string;
}

export function DefensesBlock({ derived }: Props) {
  const [activeDefense, setActiveDefense] = useState<DefenseKey | null>(null);

  const defenses: DefenseConfig[] = [
    {
      key: 'ac',   label: 'AC',   fullName: 'Armor Class',
      value: derived.armorClass,
      color: 'text-blue-700',    bg: 'bg-blue-50',
      borderColor: 'border-blue-300',  headerBg: 'bg-blue-600',
    },
    {
      key: 'fort', label: 'Fort', fullName: 'Fortitude',
      value: derived.fortitude,
      color: 'text-red-700',     bg: 'bg-red-50',
      borderColor: 'border-red-300',   headerBg: 'bg-red-600',
    },
    {
      key: 'ref',  label: 'Ref',  fullName: 'Reflex',
      value: derived.reflex,
      color: 'text-emerald-700', bg: 'bg-emerald-50',
      borderColor: 'border-emerald-300', headerBg: 'bg-emerald-600',
    },
    {
      key: 'will', label: 'Will', fullName: 'Will',
      value: derived.will,
      color: 'text-purple-700',  bg: 'bg-purple-50',
      borderColor: 'border-purple-300', headerBg: 'bg-purple-600',
    },
  ];

  const active = activeDefense ? defenses.find((d) => d.key === activeDefense) : null;
  const activeRows = activeDefense ? derived.defenseBreakdowns[activeDefense] : null;

  const toggle = (key: DefenseKey) =>
    setActiveDefense((prev) => (prev === key ? null : key));

  return (
    <div
      className="bg-white rounded-xl border border-stone-200 overflow-hidden"
      onMouseLeave={() => setActiveDefense(null)}
    >
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Defenses</h3>
      </div>

      {/* 2×2 defense grid */}
      <div className="grid grid-cols-2 divide-x divide-y divide-stone-100">
        {defenses.map((d) => (
          <button
            key={d.key}
            onClick={() => toggle(d.key)}
            onMouseEnter={() => setActiveDefense(d.key)}
            className={[
              'p-3 text-center select-none transition-all min-h-[44px] relative',
              d.bg,
              activeDefense === d.key
                ? `ring-2 ring-inset ${d.borderColor}`
                : 'hover:brightness-95',
            ].join(' ')}
            title={`${d.fullName} — tap to see breakdown`}
            aria-label={`${d.fullName}: ${d.value}`}
          >
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wide">
              {d.label}
            </div>
            <div className={`text-3xl font-bold leading-none mt-0.5 ${d.color}`}>
              {d.value}
            </div>
            {/* Small info pip */}
            <div className={`text-[9px] mt-1 font-semibold uppercase tracking-wide ${
              activeDefense === d.key ? d.color : 'text-stone-300'
            }`}>
              {activeDefense === d.key ? '▲ hide' : 'ℹ details'}
            </div>
          </button>
        ))}
      </div>

      {/* Breakdown panel — expands inside the card below the grid */}
      {active && activeRows && (
        <div className={`border-t-2 ${active.borderColor}`}>
          {/* Breakdown header */}
          <div className={`${active.headerBg} px-3 py-2 flex items-center justify-between`}>
            <p className="text-white text-xs font-bold uppercase tracking-wide">
              {active.fullName} Breakdown
            </p>
            <button
              onClick={() => setActiveDefense(null)}
              className="text-white/70 hover:text-white text-sm font-bold leading-none ml-2"
              aria-label="Close breakdown"
            >
              ✕
            </button>
          </div>

          {/* Rows */}
          <div className={`${active.bg} px-3 py-2 space-y-0.5`}>
            {activeRows.map((row, i) => (
              <div key={i} className="flex items-center justify-between py-0.5">
                <span className="text-xs text-stone-600 pr-4">{row.label}</span>
                <span className={[
                  'text-xs font-semibold tabular-nums',
                  row.value > 0 ? 'text-emerald-700' :
                  row.value < 0 ? 'text-red-600'     : 'text-stone-500',
                ].join(' ')}>
                  {row.value > 0 ? `+${row.value}` : row.value}
                </span>
              </div>
            ))}

            {/* Total separator + total */}
            <div className={`border-t ${active.borderColor} mt-1 pt-1.5 flex items-center justify-between`}>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">Total</span>
              <span className={`text-xl font-bold ${active.color}`}>{active.value}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
