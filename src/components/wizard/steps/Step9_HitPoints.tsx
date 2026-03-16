import { useState } from 'react';
import { useWizardStore } from '../../../store/useWizardStore';
import { getClassById } from '../../../data/classes';
import { getRaceById } from '../../../data/races';
import { calculateMaxHp, calculateBloodied, calculateHealingSurgeValue, calculateSurgesPerDay } from '../../../utils/hitPoints';
import { abilityModifier } from '../../../utils/abilityScores';

export function Step9_HitPoints() {
  const {
    classId, raceId, baseAbilityScores, humanAbilityBonus, racialAbilityBonusChoice,
    customHp, setCustomHp,
  } = useWizardStore();

  const cls = getClassById(classId);
  const race = getRaceById(raceId);

  // Replicate buildCharacter's finalBaseScores (human +2 applied)
  const finalBaseScores = { ...baseAbilityScores };
  if (raceId === 'human' && humanAbilityBonus) {
    finalBaseScores[humanAbilityBonus] = finalBaseScores[humanAbilityBonus] + 2;
  }

  // Racial bonus map
  const racialChoiceBonus: Partial<Record<string, number>> = {};
  if (racialAbilityBonusChoice && raceId !== 'human') {
    racialChoiceBonus[racialAbilityBonusChoice] = 2;
  }

  // Final CON (matches buildCharacter + useCharacterDerived)
  const finalCon = finalBaseScores.con
    + (race?.abilityBonuses.con ?? 0)
    + ((racialChoiceBonus.con as number) ?? 0);

  const autoHp = cls ? calculateMaxHp(cls.hpAtFirstLevel, cls.hpPerLevel, finalCon, 1) : 12;
  const bloodied = calculateBloodied(autoHp);
  const conMod = abilityModifier(finalCon);
  const surgeValue = calculateHealingSurgeValue(autoHp, conMod, raceId === 'dragonborn');
  const surgesPerDay = cls ? calculateSurgesPerDay(cls.healingSurgesPerDay, conMod) : 6;

  const isCustom = customHp !== null;
  const [inputVal, setInputVal] = useState<string>(String(customHp ?? autoHp));

  const handleModeChange = (custom: boolean) => {
    if (custom) {
      const val = autoHp;
      setInputVal(String(val));
      setCustomHp(val);
    } else {
      setCustomHp(null);
    }
  };

  const handleInputChange = (raw: string) => {
    setInputVal(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setCustomHp(parsed);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-amber-900 mb-1">Hit Points</h2>
        <p className="text-stone-500 text-sm">
          Review your starting HP or set a custom value.
        </p>
      </div>

      {/* Calculated breakdown card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">Standard Starting HP</p>
            <p className="text-xs text-stone-500 mt-0.5">
              {cls ? `${cls.hpAtFirstLevel} (class base) + ${finalCon} (CON score)` : 'Select a class first'}
            </p>
          </div>
          <div className="text-4xl font-bold text-amber-900">{autoHp}</div>
        </div>

        <div className="border-t border-amber-200 pt-3 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-stone-400 uppercase font-semibold">Bloodied</p>
            <p className="text-lg font-bold text-red-700">{bloodied}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 uppercase font-semibold">Surge Value</p>
            <p className="text-lg font-bold text-amber-800">{surgeValue}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 uppercase font-semibold">Surges/Day</p>
            <p className="text-lg font-bold text-amber-800">{surgesPerDay}</p>
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div>
        <p className="text-sm font-semibold text-stone-700 mb-2">Starting current HP</p>
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange(false)}
            className={[
              'flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all',
              !isCustom
                ? 'border-amber-600 bg-amber-600 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300',
            ].join(' ')}
          >
            Standard ({autoHp} HP)
          </button>
          <button
            onClick={() => handleModeChange(true)}
            className={[
              'flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all',
              isCustom
                ? 'border-amber-600 bg-amber-600 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300',
            ].join(' ')}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Custom HP input */}
      {isCustom && (
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <label className="text-xs text-stone-500 font-semibold uppercase block mb-2">
            Enter starting current HP
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleInputChange(String(Math.max(1, (customHp ?? autoHp) - 1)))}
              className="w-12 h-12 rounded-xl bg-red-100 text-red-700 font-bold text-xl hover:bg-red-200 transition-colors"
            >−</button>
            <input
              type="number"
              min={1}
              max={autoHp}
              value={inputVal}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 text-center text-3xl font-bold border-b-2 border-stone-300 focus:border-amber-500 outline-none py-1"
            />
            <button
              onClick={() => handleInputChange(String(Math.min(autoHp, (customHp ?? autoHp) + 1)))}
              className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xl hover:bg-emerald-200 transition-colors"
            >+</button>
          </div>
          <p className="text-xs text-stone-400 mt-2 text-center">
            Max HP is {autoHp} — your current HP can be set lower if your campaign has already started.
          </p>
        </div>
      )}
    </div>
  );
}
