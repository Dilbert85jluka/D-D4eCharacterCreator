import type { Character, DerivedStats } from '../../types/character';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { usesPowerPoints, getMaxPowerPoints } from '../../utils/psionics';
import { IMPLEMENTS } from '../../data/equipment/implements';
import { SUPERIOR_IMPLEMENTS } from '../../data/equipment/superiorImplements';
import { MAGIC_IMPLEMENTS } from '../../data/equipment/magicImplements';
import { useReadOnly } from './ReadOnlyContext';

interface Props {
  character: Character;
  derived: DerivedStats;
}

export function HitPointsBlock({ character, derived }: Props) {
  const readOnly = useReadOnly();
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const patch = async (changes: Partial<Character>) => {
    const updated = { ...character, ...changes };
    await characterRepository.patch(character.id, changes);
    updateCharacter(updated);
  };

  const spendSurge = async () => {
    if (character.currentSurges <= 0) return;
    const newHp = Math.min(character.currentHp + derived.healingSurgeValue, derived.maxHp);
    await patch({ currentHp: newHp, currentSurges: character.currentSurges - 1 });
  };

  const isBloodied = character.currentHp <= derived.bloodiedValue && character.currentHp > 0;
  const isDead = character.currentHp <= 0;

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="bg-amber-800 px-4 py-2 flex items-center justify-between">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Hit Points</h3>
        {isBloodied && <span className="text-red-300 text-xs font-bold animate-pulse">BLOODIED</span>}
        {isDead && <span className="text-red-300 text-xs font-bold">DYING</span>}
      </div>

      <div className="p-3 space-y-3">
        {/* Current HP */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-stone-400 font-semibold uppercase">Current HP</label>
            <div className="flex items-center gap-2 mt-1">
              {!readOnly && (
              <button
                onClick={() => patch({ currentHp: Math.max(character.currentHp - 1, 0) })}
                className="w-10 h-10 rounded-lg bg-red-100 text-red-700 font-bold text-lg hover:bg-red-200 transition-colors"
              >−</button>
              )}
              <input
                type="number"
                value={character.currentHp}
                onChange={(e) => patch({ currentHp: Math.max(0, Math.min(parseInt(e.target.value) || 0, derived.maxHp + 50)) })}
                disabled={readOnly}
                className="w-16 text-center text-2xl font-bold border-b-2 border-stone-300 focus:border-amber-500 outline-none"
              />
              {!readOnly && (
              <button
                onClick={() => patch({ currentHp: Math.min(character.currentHp + 1, derived.maxHp) })}
                className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-lg hover:bg-emerald-200 transition-colors"
              >+</button>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-stone-400">Max</div>
            <div className="text-2xl font-bold text-stone-800">{derived.maxHp}</div>
            <div className="text-xs text-stone-400">Bloodied: {derived.bloodiedValue}</div>
          </div>
        </div>

        {/* Temp HP */}
        <div className="flex items-center justify-between bg-stone-50 rounded-lg px-3 py-2">
          <span className="text-xs text-stone-500 font-semibold uppercase">Temp HP</span>
          <div className="flex items-center gap-2">
            {!readOnly && (
            <button onClick={() => patch({ temporaryHp: Math.max(0, character.temporaryHp - 1) })}
              className="w-7 h-7 rounded bg-stone-200 text-stone-600 font-bold hover:bg-stone-300">−</button>
            )}
            <span className="text-lg font-bold text-stone-800 w-8 text-center">{character.temporaryHp}</span>
            {!readOnly && (
            <button onClick={() => patch({ temporaryHp: character.temporaryHp + 1 })}
              className="w-7 h-7 rounded bg-stone-200 text-stone-600 font-bold hover:bg-stone-300">+</button>
            )}
          </div>
        </div>

        {/* Healing Surges */}
        <div className="flex items-center justify-between bg-amber-50 rounded-lg px-3 py-2">
          <div>
            <div className="text-xs text-amber-700 font-semibold uppercase">Healing Surges</div>
            <div className="text-xs text-stone-400">Value: {derived.healingSurgeValue} HP each</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-800">
              {character.currentSurges} / {derived.surgesPerDay}
            </span>
            {!readOnly && (
            <button
              onClick={spendSurge}
              disabled={character.currentSurges <= 0}
              className="text-xs bg-amber-600 text-white px-2 py-1.5 rounded-lg disabled:opacity-40 min-h-[36px]"
            >
              Spend
            </button>
            )}
          </div>
        </div>

        {/* Action Points */}
        <div className="flex items-center justify-between bg-stone-50 rounded-lg px-3 py-2">
          <span className="text-xs text-stone-500 font-semibold uppercase">Action Points</span>
          <div className="flex items-center gap-2">
            {!readOnly && (
            <button onClick={() => patch({ actionPoints: Math.max(0, character.actionPoints - 1) })}
              className="w-7 h-7 rounded bg-stone-200 text-stone-600 font-bold hover:bg-stone-300">−</button>
            )}
            <span className="text-lg font-bold text-stone-800 w-6 text-center">{character.actionPoints}</span>
            {!readOnly && (
            <button onClick={() => patch({ actionPoints: character.actionPoints + 1 })}
              className="w-7 h-7 rounded bg-stone-200 text-stone-600 font-bold hover:bg-stone-300">+</button>
            )}
          </div>
        </div>

        {/* Power Points — psionic augmentation classes only (not Monk) */}
        {usesPowerPoints(character.classId) && (() => {
          const maxPP = getMaxPowerPoints(character.level);
          const currentPP = character.currentPowerPoints ?? maxPP;
          return (
            <div className="flex items-center justify-between bg-violet-50 rounded-lg px-3 py-2">
              <div>
                <div className="text-xs text-violet-700 font-semibold uppercase">Power Points</div>
                <div className="text-xs text-stone-400">Psionic augmentation</div>
              </div>
              <div className="flex items-center gap-2">
                {!readOnly && (
                <button
                  onClick={() => patch({ currentPowerPoints: Math.max(0, currentPP - 1) })}
                  disabled={currentPP <= 0}
                  className="w-7 h-7 rounded bg-violet-200 text-violet-700 font-bold hover:bg-violet-300 disabled:opacity-30 transition-colors"
                >−</button>
                )}
                <span className="font-bold text-violet-800">
                  {currentPP} / {maxPP}
                </span>
                {!readOnly && (
                <button
                  onClick={() => patch({ currentPowerPoints: Math.min(maxPP, currentPP + 1) })}
                  disabled={currentPP >= maxPP}
                  className="w-7 h-7 rounded bg-violet-200 text-violet-700 font-bold hover:bg-violet-300 disabled:opacity-30 transition-colors"
                >+</button>
                )}
              </div>
            </div>
          );
        })()}

        {/* Ki Focus Implement Slot — Monk only */}
        {character.classId === 'monk' && (() => {
          // Find equipped Ki Focus implement
          const kiFocusItem = character.equipment.find((e) => {
            if (!e.equipped || e.slot !== 'implement') return false;
            const basic = IMPLEMENTS.find(i => i.id === e.itemId);
            if (basic?.type === 'Ki Focus') return true;
            const sup = SUPERIOR_IMPLEMENTS.find(i => i.id === e.itemId);
            if (sup?.type === 'Ki Focus') return true;
            return false;
          });

          let label = 'None equipped';
          if (kiFocusItem) {
            const mi = kiFocusItem.magicImplementId
              ? MAGIC_IMPLEMENTS.find(m => m.id === kiFocusItem.magicImplementId)
              : null;
            const tier = mi ? mi.tiers.find(t => t.level === kiFocusItem.magicImplementTier) : null;
            if (mi && tier) {
              label = `${mi.name} +${tier.enhancement}`;
            } else {
              const sup = SUPERIOR_IMPLEMENTS.find(i => i.id === kiFocusItem.itemId);
              label = sup ? sup.name : kiFocusItem.name;
            }
          }

          return (
            <div className="flex items-center justify-between bg-teal-50 rounded-lg px-3 py-2">
              <div>
                <div className="text-xs text-teal-700 font-semibold uppercase">Ki Focus</div>
                <div className="text-xs text-stone-400">Implement Slot</div>
              </div>
              <div className="text-sm font-semibold text-teal-800">
                {label}
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
