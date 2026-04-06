import { useWizardStore } from '../../../store/useWizardStore';
import { getRaceById } from '../../../data/races';
import { getClassById } from '../../../data/classes';
import {
  ABILITIES, ABILITY_NAMES, ABILITY_ABBR,
  abilityModifier, formatModifier,
  totalPointsSpent, POINT_BUY_BUDGET, POINT_BUY_COSTS, ABILITY_MIN, ABILITY_MAX,
} from '../../../utils/abilityScores';
import type { Ability } from '../../../types/character';

const STANDARD_ARRAY = [16, 14, 13, 12, 11, 10];
const POINT_BUY_STARTING_POOL = [10, 10, 10, 10, 10, 8];

type Method = 'point-buy' | 'standard-array' | 'rolled';

export function Step4_AbilityScores() {
  const {
    raceId, classId, baseAbilityScores, humanAbilityBonus, racialAbilityBonusChoice,
    abilityScoreMethod, setAbilityScoreMethod, pointBuyStartingSet,
    setAbilityScore, setStandardArrayAssignment,
    rolledGroups, activeRollGroup,
    addRollGroup, deleteRollGroup, rerollGroup, setRollAssignment, applyRollGroup, resetRollGroup,
  } = useWizardStore();
  const race = getRaceById(raceId);
  const cls = getClassById(classId);

  const method: Method = abilityScoreMethod ?? 'point-buy';

  // Compute final scores with racial bonuses
  const getFinal = (ab: Ability) => {
    const base = baseAbilityScores[ab];
    if (base === 0) return 0; // unassigned
    const racialBonus = race?.abilityBonuses[ab] ?? 0;
    const humanBonus = (raceId === 'human' && humanAbilityBonus === ab) ? 2 : 0;
    const choiceBonus = (racialAbilityBonusChoice === ab && raceId !== 'human' && race?.abilityBonusOptions) ? (race.abilityBonusOptions.amount ?? 2) : 0;
    return base + racialBonus + humanBonus + choiceBonus;
  };

  const getBonusBreakdown = (ab: Ability) => {
    const racialBonus = race?.abilityBonuses[ab] ?? 0;
    const humanBonus = (raceId === 'human' && humanAbilityBonus === ab) ? 2 : 0;
    const choiceBonus = (racialAbilityBonusChoice === ab && raceId !== 'human' && race?.abilityBonusOptions) ? (race.abilityBonusOptions.amount ?? 2) : 0;
    return { racialBonus, humanBonus, choiceBonus, hasBonus: racialBonus !== 0 || humanBonus !== 0 || choiceBonus !== 0 };
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Ability Scores</h2>
        <p className="text-stone-500 text-sm">Choose how to determine your ability scores.</p>
      </div>

      {/* Method selector */}
      <div className="mb-5">
        <select
          value={method}
          onChange={(e) => setAbilityScoreMethod(e.target.value as Method)}
          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base font-semibold text-stone-800 bg-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 min-h-[44px]"
        >
          <option value="point-buy">Customizing Scores (Point Buy)</option>
          <option value="standard-array">Standard Array</option>
          <option value="rolled">Rolling Scores</option>
        </select>
      </div>

      {/* Class recommendation */}
      {cls && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-200">
          <strong>{cls.name}</strong> key abilities: {cls.keyAbilities.slice(0, 2).map(ab => ABILITY_ABBR[ab as Ability]).join(', ')}
        </div>
      )}

      {method === 'point-buy' && <PointBuyPanel />}
      {method === 'standard-array' && <StandardArrayPanel />}
      {method === 'rolled' && <RolledPanel />}
    </div>
  );

  // ── Point Buy ──────────────────────────────────────────────────────────────
  function PointBuyPanel() {
    // Phase 1: Assign starting values from pool [10, 10, 10, 10, 10, 8]
    // Phase 2: +/- buttons for spending 22 points
    const allAssigned = ABILITIES.every((ab) => baseAbilityScores[ab] > 0);

    if (!pointBuyStartingSet) {
      return <PointBuyAssignmentPhase allAssigned={allAssigned} />;
    }

    return <PointBuyAdjustPhase />;
  }

  function PointBuyAssignmentPhase({ allAssigned }: { allAssigned: boolean }) {
    // Which pool values are used?
    const usedValues = ABILITIES.map((ab) => baseAbilityScores[ab]).filter((v) => v > 0);

    const handleConfirmStarting = () => {
      if (allAssigned) {
        useWizardStore.setState({ pointBuyStartingSet: true });
      }
    };

    return (
      <>
        <div className={[
          'text-center py-3 rounded-xl mb-5 font-bold text-base',
          allAssigned ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
        ].join(' ')}>
          {allAssigned ? 'Starting scores assigned — confirm to continue' : 'Assign each starting value to an ability'}
        </div>

        <div className="mb-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
          <p className="text-xs text-stone-600 mb-2 font-semibold">Starting Value Pool (PHB p.17)</p>
          <p className="text-xs text-stone-500 mb-2">Assign five 10s and one 8 to your abilities. Each value can only be used once.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {POINT_BUY_STARTING_POOL.map((val, i) => {
              const timesUsed = usedValues.filter((v) => v === val).length;
              const timesAvailable = POINT_BUY_STARTING_POOL.filter((v) => v === val).length;
              // Count how many of this value have been used up to index i
              let usedUpToI = 0;
              for (let j = 0; j <= i; j++) {
                if (POINT_BUY_STARTING_POOL[j] === val) usedUpToI++;
              }
              const isUsed = usedUpToI <= timesUsed;
              return (
                <span key={i} className={[
                  'inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg border',
                  isUsed ? 'bg-stone-100 text-stone-300 border-stone-200 line-through' : 'bg-amber-50 text-amber-800 border-amber-300',
                ].join(' ')}>{val}</span>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {ABILITIES.map((ab) => {
            const base = baseAbilityScores[ab];
            const final = getFinal(ab);
            const mod = base > 0 ? abilityModifier(final) : 0;
            const { racialBonus, humanBonus, choiceBonus, hasBonus } = getBonusBreakdown(ab);
            const isKeyAbility = cls?.keyAbilities.includes(ab);

            // Available values for this dropdown
            const availableValues = POINT_BUY_STARTING_POOL.filter((val) => {
              if (base > 0 && val === base) return true; // current selection always available
              const usedCount = ABILITIES.filter((a) => a !== ab && baseAbilityScores[a] === val).length;
              const totalCount = POINT_BUY_STARTING_POOL.filter((v) => v === val).length;
              return usedCount < totalCount;
            });

            // Deduplicate for dropdown display
            const uniqueAvailable = [...new Set(availableValues)].sort((a, b) => b - a);

            return (
              <div key={ab} className={[
                'flex items-center gap-3 p-3 rounded-xl border',
                isKeyAbility ? 'border-amber-300 bg-amber-50' : 'border-stone-200 bg-white',
              ].join(' ')}>
                <div className="w-28 flex-shrink-0">
                  <div className="font-bold text-stone-800 text-sm">
                    {ABILITY_ABBR[ab]}{isKeyAbility && <span className="text-amber-600 ml-1">★</span>}
                  </div>
                  <div className="text-xs text-stone-400">{ABILITY_NAMES[ab]}</div>
                </div>
                <select
                  value={base > 0 ? base : ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val) {
                      // Use setStandardArrayAssignment since it handles the swap logic
                      const scores = { ...baseAbilityScores };
                      // Clear any other ability that already has this value (if pool count exceeded)
                      const poolCount = POINT_BUY_STARTING_POOL.filter((v) => v === val).length;
                      const currentCount = ABILITIES.filter((a) => a !== ab && scores[a] === val).length;
                      if (currentCount >= poolCount) {
                        // Find and clear the first ability with this value
                        for (const a of ABILITIES) {
                          if (a !== ab && scores[a] === val) { scores[a] = 0; break; }
                        }
                      }
                      scores[ab] = val;
                      useWizardStore.setState({ baseAbilityScores: scores });
                    } else {
                      // Unassign
                      const scores = { ...baseAbilityScores, [ab]: 0 };
                      useWizardStore.setState({ baseAbilityScores: scores });
                    }
                  }}
                  className="border border-stone-300 rounded-lg px-3 py-2 text-base font-bold text-stone-800 bg-white min-h-[44px] min-w-[80px]"
                >
                  <option value="">--</option>
                  {uniqueAvailable.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                {base > 0 && (
                  <AbilityFinalDisplay base={base} final={final} mod={mod} hasBonus={hasBonus} racialBonus={racialBonus} humanBonus={humanBonus} choiceBonus={choiceBonus} />
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleConfirmStarting}
          disabled={!allAssigned}
          className={[
            'mt-5 w-full py-3 rounded-xl font-bold text-base min-h-[44px] transition-colors',
            allAssigned
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed',
          ].join(' ')}
        >
          Confirm Starting Scores → Customize with Points
        </button>
      </>
    );
  }

  function PointBuyAdjustPhase() {
    const spent = totalPointsSpent(baseAbilityScores);
    const remaining = POINT_BUY_BUDGET - spent;

    return (
      <>
        <div className={[
          'text-center py-3 rounded-xl mb-5 font-bold text-lg',
          remaining === 0 ? 'bg-emerald-100 text-emerald-700'
            : remaining < 0 ? 'bg-red-100 text-red-700'
            : 'bg-amber-100 text-amber-700',
        ].join(' ')}>
          Points Remaining: {remaining} / {POINT_BUY_BUDGET}
        </div>

        {/* Back to assignment button */}
        <button
          onClick={() => {
            useWizardStore.setState({
              pointBuyStartingSet: false,
              baseAbilityScores: { str: 0, con: 0, dex: 0, int: 0, wis: 0, cha: 0 },
            });
          }}
          className="mb-4 text-sm text-amber-700 underline hover:text-amber-800"
        >
          ← Re-assign starting values
        </button>

        <div className="grid grid-cols-1 gap-3">
          {ABILITIES.map((ab) => {
            const base = baseAbilityScores[ab];
            const final = getFinal(ab);
            const mod = abilityModifier(final);
            const { racialBonus, humanBonus, choiceBonus, hasBonus } = getBonusBreakdown(ab);
            const isKeyAbility = cls?.keyAbilities.includes(ab);

            const canIncrease = base < ABILITY_MAX &&
              (totalPointsSpent({ ...baseAbilityScores, [ab]: base + 1 }) <= POINT_BUY_BUDGET) &&
              POINT_BUY_COSTS[base + 1] !== undefined;
            const canDecrease = base > ABILITY_MIN;

            return (
              <div key={ab} className={[
                'flex items-center gap-3 p-3 rounded-xl border',
                isKeyAbility ? 'border-amber-300 bg-amber-50' : 'border-stone-200 bg-white',
              ].join(' ')}>
                <div className="w-28 flex-shrink-0">
                  <div className="font-bold text-stone-800 text-sm">
                    {ABILITY_ABBR[ab]}{isKeyAbility && <span className="text-amber-600 ml-1">★</span>}
                  </div>
                  <div className="text-xs text-stone-400">{ABILITY_NAMES[ab]}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAbilityScore(ab, base - 1)} disabled={!canDecrease}
                    className="w-10 h-10 rounded-lg border border-stone-300 bg-white flex items-center justify-center text-lg font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-30 transition-colors">−</button>
                  <div className="text-center w-10"><div className="text-xl font-bold text-stone-800">{base}</div></div>
                  <button onClick={() => setAbilityScore(ab, base + 1)} disabled={!canIncrease}
                    className="w-10 h-10 rounded-lg border border-stone-300 bg-white flex items-center justify-center text-lg font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-30 transition-colors">+</button>
                </div>
                <AbilityFinalDisplay base={base} final={final} mod={mod} hasBonus={hasBonus} racialBonus={racialBonus} humanBonus={humanBonus} choiceBonus={choiceBonus} />
              </div>
            );
          })}
        </div>

        <div className="mt-5 p-3 bg-stone-50 rounded-lg border border-stone-200">
          <p className="text-xs font-semibold text-stone-600 mb-2">Point Buy Cost Reference</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((score) => (
              <span key={score} className="text-xs text-stone-500">{score} = {POINT_BUY_COSTS[score]}pt</span>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ── Standard Array ─────────────────────────────────────────────────────────
  function StandardArrayPanel() {
    // Which standard array values are assigned to which abilities (ignore 0 = unassigned)
    const usedValues = ABILITIES.map((ab) => baseAbilityScores[ab]).filter((v) => v > 0 && STANDARD_ARRAY.includes(v));
    const allAssigned = ABILITIES.every((ab) => STANDARD_ARRAY.includes(baseAbilityScores[ab]));

    return (
      <>
        <div className={[
          'text-center py-3 rounded-xl mb-5 font-bold text-base',
          allAssigned ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
        ].join(' ')}>
          {allAssigned ? 'All scores assigned!' : 'Assign each value to an ability'}
        </div>

        {/* Available values */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {STANDARD_ARRAY.map((val, i) => {
            const timesUsed = usedValues.filter((v) => v === val).length;
            const timesAvailable = STANDARD_ARRAY.filter((v) => v === val).length;
            const isUsed = timesUsed >= timesAvailable;
            return (
              <span key={i} className={[
                'inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg border',
                isUsed ? 'bg-stone-100 text-stone-300 border-stone-200 line-through' : 'bg-amber-50 text-amber-800 border-amber-300',
              ].join(' ')}>{val}</span>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {ABILITIES.map((ab) => {
            const base = baseAbilityScores[ab];
            const isAssigned = base > 0 && STANDARD_ARRAY.includes(base);
            const final = isAssigned ? getFinal(ab) : 0;
            const mod = isAssigned ? abilityModifier(final) : 0;
            const { racialBonus, humanBonus, choiceBonus, hasBonus } = getBonusBreakdown(ab);
            const isKeyAbility = cls?.keyAbilities.includes(ab);

            // Available values for this dropdown
            const availableValues = STANDARD_ARRAY.filter((val) => {
              if (isAssigned && val === base) return true; // current selection is always available
              const usedCount = ABILITIES.filter((a) => a !== ab && baseAbilityScores[a] === val).length;
              const totalCount = STANDARD_ARRAY.filter((v) => v === val).length;
              return usedCount < totalCount;
            });

            return (
              <div key={ab} className={[
                'flex items-center gap-3 p-3 rounded-xl border',
                isKeyAbility ? 'border-amber-300 bg-amber-50' : 'border-stone-200 bg-white',
              ].join(' ')}>
                <div className="w-28 flex-shrink-0">
                  <div className="font-bold text-stone-800 text-sm">
                    {ABILITY_ABBR[ab]}{isKeyAbility && <span className="text-amber-600 ml-1">★</span>}
                  </div>
                  <div className="text-xs text-stone-400">{ABILITY_NAMES[ab]}</div>
                </div>
                <select
                  value={isAssigned ? base : ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val) {
                      setStandardArrayAssignment(ab, val);
                    } else {
                      // Unassign: set to 0
                      const scores = { ...baseAbilityScores, [ab]: 0 };
                      useWizardStore.setState({ baseAbilityScores: scores });
                    }
                  }}
                  className="border border-stone-300 rounded-lg px-3 py-2 text-base font-bold text-stone-800 bg-white min-h-[44px] min-w-[80px]"
                >
                  <option value="">--</option>
                  {availableValues.sort((a, b) => b - a).map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                {isAssigned && (
                  <AbilityFinalDisplay base={base} final={final} mod={mod} hasBonus={hasBonus} racialBonus={racialBonus} humanBonus={humanBonus} choiceBonus={choiceBonus} />
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ── Rolled Scores ──────────────────────────────────────────────────────────
  function RolledPanel() {
    return (
      <>
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-stone-700 text-sm">Dice Roll Groups</h3>
            <button
              onClick={addRollGroup}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold min-h-[36px] hover:bg-emerald-700 transition-colors"
            >+ Add Group</button>
          </div>
          <p className="text-xs text-stone-500">
            Groups: {rolledGroups.length} &mdash; Roll 4d6, drop the lowest die, for each of 6 ability scores.
          </p>
        </div>

        {rolledGroups.length === 0 && (
          <div className="text-center py-8 text-stone-400 text-sm">
            Click "+ Add Group" to roll your first set of ability scores.
          </div>
        )}

        {rolledGroups.map((group, gi) => (
          <RollGroupCard key={gi} group={group} groupIndex={gi} />
        ))}

        {/* Show final ability scores if a group is applied */}
        {activeRollGroup >= 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-stone-600 mb-2 uppercase tracking-wide">
              Applied Scores (Group {activeRollGroup + 1})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {ABILITIES.map((ab) => {
                const base = baseAbilityScores[ab];
                const final = getFinal(ab);
                const mod = abilityModifier(final);
                const { racialBonus, humanBonus, choiceBonus, hasBonus } = getBonusBreakdown(ab);
                const isKeyAbility = cls?.keyAbilities.includes(ab);
                return (
                  <div key={ab} className={[
                    'flex items-center gap-3 p-3 rounded-xl border',
                    isKeyAbility ? 'border-amber-300 bg-amber-50' : 'border-stone-200 bg-white',
                  ].join(' ')}>
                    <div className="w-28 flex-shrink-0">
                      <div className="font-bold text-stone-800 text-sm">
                        {ABILITY_ABBR[ab]}{isKeyAbility && <span className="text-amber-600 ml-1">★</span>}
                      </div>
                      <div className="text-xs text-stone-400">{ABILITY_NAMES[ab]}</div>
                    </div>
                    <div className="text-2xl font-bold text-stone-800 w-12 text-center">{base}</div>
                    <AbilityFinalDisplay base={base} final={final} mod={mod} hasBonus={hasBonus} racialBonus={racialBonus} humanBonus={humanBonus} choiceBonus={choiceBonus} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>
    );
  }

  function RollGroupCard({ group, groupIndex }: { group: typeof rolledGroups[number]; groupIndex: number }) {
    const isApplied = activeRollGroup === groupIndex;
    const allAssigned = Object.values(group.assignments).every((a) => a !== '');
    const assignedAbilities = new Set(Object.values(group.assignments).filter(Boolean));

    return (
      <div className={[
        'border rounded-xl p-4 mb-4',
        isApplied ? 'border-emerald-400 bg-emerald-50' : 'border-stone-200 bg-white',
      ].join(' ')}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-stone-700 text-sm">
            Group {groupIndex + 1}
            {isApplied && <span className="ml-2 text-emerald-600 text-xs font-bold">(Active)</span>}
          </h4>
          <button
            onClick={() => deleteRollGroup(groupIndex)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-500 text-xs font-semibold min-h-[36px] hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
          >Delete Group</button>
        </div>

        {/* Rolls grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
          {group.rolls.map((dice, ri) => {
            const total = dice[0] + dice[1] + dice[2]; // top 3 of sorted dice
            const droppedIndex = 3; // dice[3] is the dropped one (sorted desc)
            return (
              <div key={ri} className="text-center">
                <div className="text-2xl font-bold text-stone-800 mb-1">{total}</div>
                <div className="flex gap-0.5 justify-center mb-2">
                  {dice.map((d, di) => (
                    <span key={di} className={[
                      'inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold',
                      di >= droppedIndex
                        ? 'bg-stone-200 text-stone-400'
                        : d >= 5 ? 'bg-emerald-500 text-white'
                        : d >= 3 ? 'bg-blue-500 text-white'
                        : 'bg-red-400 text-white',
                    ].join(' ')}>{d}</span>
                  ))}
                </div>
                <select
                  value={group.assignments[ri] || ''}
                  onChange={(e) => setRollAssignment(groupIndex, ri, (e.target.value || '') as Ability | '')}
                  className="w-full border border-stone-300 rounded-lg px-1 py-1.5 text-sm font-semibold text-stone-800 bg-white min-h-[36px]"
                >
                  <option value="">--</option>
                  {ABILITIES.filter((ab) => !assignedAbilities.has(ab) || group.assignments[ri] === ab).map((ab) => (
                    <option key={ab} value={ab}>{ABILITY_ABBR[ab]}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => resetRollGroup(groupIndex)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold min-h-[44px] hover:bg-red-600 transition-colors"
          >Reset Group</button>
          <button
            onClick={() => applyRollGroup(groupIndex)}
            disabled={!allAssigned}
            className={[
              'px-4 py-2 rounded-lg text-xs font-bold min-h-[44px] transition-colors',
              allAssigned
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed',
            ].join(' ')}
          >Apply Ability Scores</button>
        </div>
      </div>
    );
  }
}

// ── Shared components ────────────────────────────────────────────────────────

function AbilityFinalDisplay({ base, final, mod, hasBonus, racialBonus, humanBonus, choiceBonus }: {
  base: number; final: number; mod: number; hasBonus: boolean;
  racialBonus: number; humanBonus: number; choiceBonus: number;
}) {
  return (
    <div className="flex-1 text-right">
      {hasBonus && (
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
  );
}
