import { useState, useEffect } from 'react';
import { playDiceRollSound } from '../../utils/diceSound';
import type { Character, DerivedStats, SkillBreakdown } from '../../types/character';
import type { SkillData } from '../../types/gameData';
import { SKILLS } from '../../data/skills';
import { ABILITY_ABBR, formatModifier } from '../../utils/abilityScores';
import type { Ability } from '../../types/character';

interface Props {
  character: Character;
  derived: DerivedStats;
}

interface SkillRoll {
  skillName: string;
  roll: number;
  bonus: number;
  total: number;
}

function buildTooltip(skill: SkillData, breakdown: SkillBreakdown): string {
  const lines: string[] = [skill.name];
  lines.push(`Ability (${ABILITY_ABBR[skill.keyAbility as Ability]}): ${formatModifier(breakdown.abilityMod)}`);
  lines.push(`Half Level: +${breakdown.halfLevel}`);
  if (breakdown.trainedBonus > 0) lines.push(`Trained: +${breakdown.trainedBonus}`);
  if (breakdown.racialBonus !== 0) lines.push(`Racial Bonus: ${formatModifier(breakdown.racialBonus)}`);
  if (breakdown.featBonusDetails.length > 0) {
    for (const detail of breakdown.featBonusDetails) {
      lines.push(`${detail.label}: +${detail.bonus}`);
    }
  }
  if (breakdown.armorPenalty > 0) lines.push(`Armor Penalty: \u2212${breakdown.armorPenalty}`);
  lines.push(`Total: ${formatModifier(breakdown.total)}`);
  return lines.join('\n');
}

export function SkillsPanel({ character, derived }: Props) {
  const [lastRoll, setLastRoll] = useState<SkillRoll | null>(null);

  // Auto-dismiss result after 4 seconds
  useEffect(() => {
    if (!lastRoll) return;
    const timer = setTimeout(() => setLastRoll(null), 4000);
    return () => clearTimeout(timer);
  }, [lastRoll]);

  const handleSkillClick = (skill: SkillData) => {
    const breakdown = derived.skillBreakdowns?.[skill.id];
    const bonus = breakdown?.total ?? derived.skillBonuses[skill.id] ?? 0;
    const roll = Math.floor(Math.random() * 20) + 1;
    playDiceRollSound(1);
    setLastRoll({ skillName: skill.name, roll, bonus, total: roll + bonus });
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col h-full">
      <div className="bg-amber-800 px-4 py-2 flex-shrink-0">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Skills</h3>
      </div>

      {/* Roll result card */}
      {lastRoll && (
        <div className="mx-2 mt-2 mb-1 flex-shrink-0 bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              {lastRoll.skillName} Check
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

            <span className="text-stone-400 font-bold text-lg">+</span>

            {/* Bonus chip */}
            <span className="flex flex-col items-center bg-stone-100 border border-stone-300 rounded-lg px-2.5 py-1 min-w-[44px]">
              <span className="text-xs text-stone-500 font-semibold leading-none mb-0.5">bonus</span>
              <span className="text-xl font-black text-stone-700 leading-none">{lastRoll.bonus}</span>
            </span>

            <span className="text-stone-400 font-bold text-lg">=</span>

            {/* Total */}
            <span className={`text-3xl font-black leading-none ${lastRoll.total >= 20 ? 'text-emerald-600' : lastRoll.roll === 1 ? 'text-red-600' : 'text-amber-700'}`}>
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

      <div className="divide-y divide-stone-50 flex-1 overflow-y-auto">
        {SKILLS.map((skill) => {
          const isTrained = character.trainedSkills.includes(skill.id);
          const breakdown = derived.skillBreakdowns?.[skill.id];
          const bonus = breakdown?.total ?? derived.skillBonuses[skill.id] ?? 0;
          const isJoaT = !isTrained && (breakdown?.featBonus ?? 0) > 0;

          // Dot: solid amber (trained) | half amber/gray (JoAT untrained) | gray (untrained)
          const dotStyle: React.CSSProperties = isTrained
            ? { background: '#f59e0b' }
            : isJoaT
            ? { background: 'linear-gradient(to right, #f59e0b 50%, #e7e5e4 50%)' }
            : { background: '#e7e5e4' };

          // Number colour: green-600 for JoAT, emerald-700 for positive, red-500 for negative
          const bonusClass = isJoaT
            ? 'text-green-600'
            : bonus >= 0
            ? 'text-emerald-700'
            : 'text-red-500';

          const isActiveRoll = lastRoll?.skillName === skill.name;

          return (
            <div
              key={skill.id}
              title={breakdown ? buildTooltip(skill, breakdown) : `${skill.name} — click to roll`}
              onClick={() => handleSkillClick(skill)}
              className={[
                'flex items-center px-3 py-2.5 cursor-pointer select-none transition-colors',
                isActiveRoll
                  ? 'bg-amber-100'
                  : isTrained
                  ? 'bg-amber-50 hover:bg-amber-100'
                  : 'hover:bg-stone-50',
              ].join(' ')}
            >
              {/* Trained dot */}
              <div
                className="w-3 h-3 rounded-full mr-2.5 flex-shrink-0"
                style={dotStyle}
              />

              {/* Skill name */}
              <span className={`flex-1 text-base ${isTrained ? 'font-semibold text-stone-800' : 'text-stone-600'}`}>
                {skill.name}
              </span>

              {/* Key ability */}
              <span className="text-base text-stone-400 mr-3">
                {ABILITY_ABBR[skill.keyAbility as Ability]}
              </span>

              {/* Bonus */}
              <span className={`text-base font-bold min-w-[36px] text-right ${bonusClass}`}>
                {formatModifier(bonus)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
