import { useWizardStore } from '../../../store/useWizardStore';
import { getRaceById } from '../../../data/races';
import { getClassById } from '../../../data/classes';
import {
  ABILITIES, ABILITY_NAMES, ABILITY_ABBR,
  abilityModifier, formatModifier,
  totalPointsSpent, POINT_BUY_BUDGET, POINT_BUY_COSTS, ABILITY_MIN, ABILITY_MAX,
} from '../../../utils/abilityScores';
import type { Ability } from '../../../types/character';

export function Step4_AbilityScores() {
  const { raceId, classId, baseAbilityScores, humanAbilityBonus, racialAbilityBonusChoice, setAbilityScore } = useWizardStore();
  const race = getRaceById(raceId);
  const cls = getClassById(classId);
  const spent = totalPointsSpent(baseAbilityScores);
  const remaining = POINT_BUY_BUDGET - spent;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Ability Scores</h2>
        <p className="text-stone-500 text-sm">
          Distribute {POINT_BUY_BUDGET} points across your ability scores (point buy system).
        </p>
      </div>

      {/* Points remaining */}
      <div className={[
        'text-center py-3 rounded-xl mb-5 font-bold text-lg',
        remaining === 0
          ? 'bg-emerald-100 text-emerald-700'
          : remaining < 0
            ? 'bg-red-100 text-red-700'
            : 'bg-amber-100 text-amber-700',
      ].join(' ')}>
        Points Remaining: {remaining} / {POINT_BUY_BUDGET}
      </div>

      {/* Class recommendation */}
      {cls && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-200">
          <strong>{cls.name}</strong> key abilities: {cls.keyAbilities.slice(0, 2).map(ab => ABILITY_ABBR[ab as Ability]).join(', ')}
        </div>
      )}

      {/* Ability score grid */}
      <div className="grid grid-cols-1 gap-3">
        {ABILITIES.map((ab) => {
          const base = baseAbilityScores[ab];
          const racialBonus = race?.abilityBonuses[ab] ?? 0;
          const humanBonus = (raceId === 'human' && humanAbilityBonus === ab) ? 2 : 0;
          const choiceBonus = (racialAbilityBonusChoice === ab && raceId !== 'human' && race?.abilityBonusOptions) ? (race.abilityBonusOptions.amount ?? 2) : 0;
          const final = base + racialBonus + humanBonus + choiceBonus;
          const mod = abilityModifier(final);
          const isKeyAbility = cls?.keyAbilities.includes(ab);

          const canIncrease = base < ABILITY_MAX &&
            (totalPointsSpent({ ...baseAbilityScores, [ab]: base + 1 }) <= POINT_BUY_BUDGET) &&
            POINT_BUY_COSTS[base + 1] !== undefined;
          const canDecrease = base > ABILITY_MIN;

          return (
            <div
              key={ab}
              className={[
                'flex items-center gap-3 p-3 rounded-xl border',
                isKeyAbility ? 'border-amber-300 bg-amber-50' : 'border-stone-200 bg-white',
              ].join(' ')}
            >
              {/* Ability name */}
              <div className="w-28 flex-shrink-0">
                <div className="font-bold text-stone-800 text-sm">
                  {ABILITY_ABBR[ab]}
                  {isKeyAbility && <span className="text-amber-600 ml-1">★</span>}
                </div>
                <div className="text-xs text-stone-400">{ABILITY_NAMES[ab]}</div>
              </div>

              {/* Score controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAbilityScore(ab, base - 1)}
                  disabled={!canDecrease}
                  className="w-10 h-10 rounded-lg border border-stone-300 bg-white flex items-center justify-center
                             text-lg font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed
                             transition-colors"
                >
                  −
                </button>
                <div className="text-center w-10">
                  <div className="text-xl font-bold text-stone-800">{base}</div>
                </div>
                <button
                  onClick={() => setAbilityScore(ab, base + 1)}
                  disabled={!canIncrease}
                  className="w-10 h-10 rounded-lg border border-stone-300 bg-white flex items-center justify-center
                             text-lg font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed
                             transition-colors"
                >
                  +
                </button>
              </div>

              {/* Final score with bonuses */}
              <div className="flex-1 text-right">
                {(racialBonus !== 0 || humanBonus !== 0 || choiceBonus !== 0) && (
                  <div className="text-xs text-stone-400">
                    {base}
                    {racialBonus !== 0 && <span className="text-emerald-600"> +{racialBonus} race</span>}
                    {humanBonus !== 0 && <span className="text-emerald-600"> +{humanBonus} human</span>}
                    {choiceBonus !== 0 && <span className="text-emerald-600"> +{choiceBonus} race</span>}
                  </div>
                )}
                <div className="text-2xl font-bold text-stone-900">{final}</div>
                <div className={`text-sm font-semibold ${mod >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatModifier(mod)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Point buy reference */}
      <div className="mt-5 p-3 bg-stone-50 rounded-lg border border-stone-200">
        <p className="text-xs font-semibold text-stone-600 mb-2">Point Buy Cost Reference</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((score) => (
            <span key={score} className="text-xs text-stone-500">
              {score} = {POINT_BUY_COSTS[score]}pt
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
