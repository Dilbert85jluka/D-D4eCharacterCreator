import { useState, useEffect } from 'react';
import { playDiceRollSound } from '../../utils/diceSound';
import type { Character, DerivedStats, Ability } from '../../types/character';
import { ABILITY_ABBR, ABILITY_NAMES, ABILITIES, formatModifier } from '../../utils/abilityScores';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';

interface Props {
  character: Character;
  derived: DerivedStats;
}

interface AbilityRoll {
  abilityName: string;
  roll: number;
  bonus: number;
  total: number;
}

export function AbilityBlock({ character, derived }: Props) {
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);
  const [editing, setEditing] = useState(false);
  const [activeAbility, setActiveAbility] = useState<Ability | null>(null);
  const [lastRoll, setLastRoll] = useState<AbilityRoll | null>(null);

  // Auto-dismiss roll result after 4 seconds
  useEffect(() => {
    if (!lastRoll) return;
    const timer = setTimeout(() => setLastRoll(null), 4000);
    return () => clearTimeout(timer);
  }, [lastRoll]);

  const adjustScore = async (ab: Ability, delta: number) => {
    const current = character.baseAbilityScores[ab];
    const next = Math.min(20, Math.max(3, current + delta));
    if (next === current) return;
    const newBase = { ...character.baseAbilityScores, [ab]: next };
    await characterRepository.patch(character.id, { baseAbilityScores: newBase });
    updateCharacter({ ...character, baseAbilityScores: newBase });
  };

  const handleAbilityClick = (ab: Ability) => {
    if (editing) return;
    const mod = derived.abilityModifiers[ab];
    const roll = Math.floor(Math.random() * 20) + 1;
    playDiceRollSound(1);
    setLastRoll({
      abilityName: ABILITY_NAMES[ab],
      roll,
      bonus: mod,
      total: roll + mod,
    });
  };

  const activeRows = activeAbility ? derived.abilityBreakdowns[activeAbility] : null;
  const activeScore = activeAbility ? derived.finalAbilityScores[activeAbility] : null;
  const activeMod = activeAbility ? derived.abilityModifiers[activeAbility] : null;

  return (
    <div
      className="bg-white rounded-xl border border-stone-200 overflow-hidden"
      onMouseLeave={() => { if (!editing) setActiveAbility(null); }}
    >
      <div className="bg-amber-800 px-4 py-2 flex items-center justify-between">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Ability Scores</h3>
        <button
          onClick={() => { setEditing((e) => !e); setActiveAbility(null); }}
          className={[
            'text-xs px-2 py-1 rounded font-semibold transition-colors min-h-[30px]',
            editing
              ? 'bg-amber-200 text-amber-900'
              : 'bg-amber-700 text-amber-100 hover:bg-amber-600',
          ].join(' ')}
        >
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>

      {/* Roll result card */}
      {lastRoll && !editing && (
        <div className="mx-2 mt-2 mb-1 bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              {lastRoll.abilityName} Check
            </span>
            <button
              onClick={() => setLastRoll(null)}
              className="text-amber-400 hover:text-amber-700 text-lg leading-none w-6 h-6 flex items-center justify-center rounded transition-colors"
              aria-label="Dismiss roll result"
            >
              ×
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* d20 result chip */}
            <span className="flex flex-col items-center bg-amber-100 border border-amber-300 rounded-lg px-2.5 py-1 min-w-[44px]">
              <span className="text-xs text-amber-600 font-semibold leading-none mb-0.5">d20</span>
              <span className="text-xl font-black text-amber-900 leading-none">{lastRoll.roll}</span>
            </span>

            <span className="text-stone-400 font-bold text-lg">{lastRoll.bonus >= 0 ? '+' : '−'}</span>

            {/* Bonus chip */}
            <span className="flex flex-col items-center bg-stone-100 border border-stone-300 rounded-lg px-2.5 py-1 min-w-[44px]">
              <span className="text-xs text-stone-500 font-semibold leading-none mb-0.5">mod</span>
              <span className="text-xl font-black text-stone-700 leading-none">{Math.abs(lastRoll.bonus)}</span>
            </span>

            <span className="text-stone-400 font-bold text-lg">=</span>

            {/* Total */}
            <span className={`text-3xl font-black leading-none ${lastRoll.roll === 20 ? 'text-emerald-600' : lastRoll.roll === 1 ? 'text-red-600' : 'text-amber-700'}`}>
              {lastRoll.total}
            </span>

            {/* Natural 20 / Natural 1 label */}
            {lastRoll.roll === 20 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                Nat 20!
              </span>
            )}
            {lastRoll.roll === 1 && (
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                Nat 1
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-0 divide-x divide-y divide-stone-100">
        {ABILITIES.map((ab) => {
          const score = derived.finalAbilityScores[ab as Ability];
          const mod = derived.abilityModifiers[ab as Ability];
          const base = character.baseAbilityScores[ab as Ability];
          const racialBonus = score - base;
          const isActive = activeAbility === ab;
          return (
            <div
              key={ab}
              className={[
                'p-2 text-center transition-all',
                editing
                  ? ''
                  : isActive
                    ? 'bg-amber-50 ring-2 ring-inset ring-amber-300 cursor-pointer'
                    : 'hover:bg-stone-50 cursor-pointer',
              ].join(' ')}
              onMouseEnter={() => { if (!editing) setActiveAbility(ab as Ability); }}
              onClick={() => handleAbilityClick(ab as Ability)}
              title={editing ? undefined : `${ABILITY_NAMES[ab as Ability]} — click to roll, hover for breakdown`}
            >
              <div className="text-xs font-bold text-stone-400 uppercase mb-1">
                {ABILITY_ABBR[ab as Ability]}
                {!editing && (
                  <span className={`ml-0.5 text-[9px] ${isActive ? 'text-amber-500' : 'text-stone-300'}`}>
                    {isActive ? '▲' : 'ℹ'}
                  </span>
                )}
              </div>

              {editing ? (
                <div className="flex items-center justify-center gap-1 my-0.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); adjustScore(ab as Ability, -1); }}
                    disabled={base <= 3}
                    className="w-7 h-7 rounded bg-red-100 text-red-600 font-bold hover:bg-red-200 disabled:opacity-30 transition-colors"
                  >−</button>
                  <span className="text-xl font-bold text-stone-900 w-7 text-center">{score}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); adjustScore(ab as Ability, 1); }}
                    disabled={base >= 20}
                    className="w-7 h-7 rounded bg-emerald-100 text-emerald-600 font-bold hover:bg-emerald-200 disabled:opacity-30 transition-colors"
                  >+</button>
                </div>
              ) : (
                <div className="text-2xl font-bold text-stone-900">{score}</div>
              )}

              <div className={`text-sm font-bold ${mod >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {formatModifier(mod)}
              </div>
              <div className="text-xs text-stone-300">{ABILITY_NAMES[ab as Ability].slice(0, 3)}</div>
              {editing && racialBonus > 0 && (
                <div className="text-xs text-amber-500 leading-tight">+{racialBonus} racial</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Breakdown panel — expands inside the card below the grid */}
      {!editing && activeAbility && activeRows && activeScore !== null && activeMod !== null && (
        <div className="border-t-2 border-amber-300">
          {/* Breakdown header */}
          <div className="bg-amber-700 px-3 py-2 flex items-center justify-between">
            <p className="text-white text-xs font-bold uppercase tracking-wide">
              {ABILITY_NAMES[activeAbility]} Breakdown
            </p>
            <button
              onClick={() => setActiveAbility(null)}
              className="text-white/70 hover:text-white text-sm font-bold leading-none ml-2"
              aria-label="Close breakdown"
            >
              ✕
            </button>
          </div>

          {/* Rows */}
          <div className="bg-amber-50 px-3 py-2 space-y-0.5">
            {activeRows.map((row, i) => (
              <div key={i} className="flex items-center justify-between py-0.5">
                <span className="text-xs text-stone-600 pr-4">{row.label}</span>
                <span className={[
                  'text-xs font-semibold tabular-nums',
                  row.value > 0 && i > 0 ? 'text-emerald-700' :
                  row.value < 0 ? 'text-red-600' : 'text-stone-500',
                ].join(' ')}>
                  {i === 0 ? row.value : row.value > 0 ? `+${row.value}` : row.value}
                </span>
              </div>
            ))}

            {/* Total separator + total */}
            <div className="border-t border-amber-300 mt-1 pt-1.5 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                Total Score
              </span>
              <span className="text-xl font-bold text-amber-800">{activeScore}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">Modifier</span>
              <span className={`text-sm font-bold ${activeMod >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {formatModifier(activeMod)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
