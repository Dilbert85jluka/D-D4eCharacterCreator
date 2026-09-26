import { useState, useEffect } from 'react';
import { playDiceRollSound } from '../../utils/diceSound';
import { useD20RollAnimation } from '../dice/useD20RollAnimation';
import { DICE_SOUND_MS } from '../dice/DiceRollAnimation';
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
  skillId: string;
  skillName: string;
  roll: number;
  bonus: number;
  total: number;
}

/**
 * The bonus, itemised. Shared by the hover tooltip and the tap-triggered result
 * card so the two can never disagree about where a number came from.
 *
 * Feat bonuses come through `featBonusDetails`, which is already labelled per
 * feat upstream — so a Bard with Bardic Knowledge sees "Bardic Knowledge +2"
 * rather than an unexplained lump.
 */
function buildBreakdownRows(
  skill: SkillData,
  b: SkillBreakdown,
): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [
    { label: ABILITY_ABBR[skill.keyAbility as Ability], value: formatModifier(b.abilityMod) },
    { label: '½ level', value: `+${b.halfLevel}` },
  ];
  if (b.trainedBonus > 0) rows.push({ label: 'Trained', value: `+${b.trainedBonus}` });
  if (b.racialBonus !== 0) rows.push({ label: 'Racial', value: formatModifier(b.racialBonus) });
  if (b.classBonus > 0) rows.push({ label: b.classBonusSource ?? 'Class', value: `+${b.classBonus}` });
  for (const d of b.featBonusDetails) rows.push({ label: d.label, value: `+${d.bonus}` });
  if (b.itemBonus > 0) rows.push({ label: b.itemBonusSource ?? 'Magic Armor', value: `+${b.itemBonus}` });
  if (b.armorPenalty > 0) rows.push({ label: 'Armor', value: `−${b.armorPenalty}` });
  return rows;
}

function buildTooltip(skill: SkillData, breakdown: SkillBreakdown): string {
  const lines: string[] = [skill.name];
  lines.push(`Ability (${ABILITY_ABBR[skill.keyAbility as Ability]}): ${formatModifier(breakdown.abilityMod)}`);
  lines.push(`Half Level: +${breakdown.halfLevel}`);
  if (breakdown.trainedBonus > 0) lines.push(`Trained: +${breakdown.trainedBonus}`);
  if (breakdown.racialBonus !== 0) lines.push(`Racial Bonus: ${formatModifier(breakdown.racialBonus)}`);
  if (breakdown.classBonus > 0) {
    lines.push(`${breakdown.classBonusSource ?? 'Class'}: +${breakdown.classBonus}`);
  }
  if (breakdown.featBonusDetails.length > 0) {
    for (const detail of breakdown.featBonusDetails) {
      lines.push(`${detail.label}: +${detail.bonus}`);
    }
  }
  if (breakdown.armorPenalty > 0) lines.push(`Armor Penalty: \u2212${breakdown.armorPenalty}`);
  if (breakdown.itemBonus > 0) lines.push(`${breakdown.itemBonusSource ?? 'Magic Armor'}: +${breakdown.itemBonus}`);
  lines.push(`Total: ${formatModifier(breakdown.total)}`);
  return lines.join('\n');
}

export function SkillsPanel({ character, derived }: Props) {
  const [lastRoll, setLastRoll] = useState<SkillRoll | null>(null);
  const { animationEl, launchD20 } = useD20RollAnimation();

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
    const entry: SkillRoll = { skillId: skill.id, skillName: skill.name, roll, bonus, total: roll + bonus };
    if (launchD20(roll)) {
      // d20 tumbles across the screen — reveal the result card when the
      // sound finishes and the die has settled (same timing as the tray)
      setLastRoll(null);
      setTimeout(() => setLastRoll(entry), DICE_SOUND_MS);
    } else {
      // prefers-reduced-motion: instant reveal, as before
      setLastRoll(entry);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col h-full">
      {animationEl}
      <div className="bg-amber-800 px-4 py-2 flex-shrink-0">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Skills</h3>
      </div>

      <div className="divide-y divide-stone-50 flex-1 overflow-y-auto">
        {SKILLS.map((skill) => {
          const isTrained = character.trainedSkills.includes(skill.id);
          const breakdown = derived.skillBreakdowns?.[skill.id];
          const bonus = breakdown?.total ?? derived.skillBonuses[skill.id] ?? 0;
          // "Untrained but boosted" — the half-filled dot. Counts the class
          // feature too (Bard's Skill Versatility), not just feat bonuses,
          // or a bard's untrained skills show a plain grey dot while carrying
          // a bonus.
          const isJoaT = !isTrained && ((breakdown?.featBonus ?? 0) + (breakdown?.classBonus ?? 0)) > 0;

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

          const isActiveRoll = lastRoll?.skillId === skill.id;

          return (
            <div key={skill.id}>
              {/* Inline roll result — renders above the rolled skill */}
              {isActiveRoll && lastRoll && (
                <div className="mx-2 mt-2 mb-1 bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                      {lastRoll.skillName} Check
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setLastRoll(null); }}
                      className="text-amber-400 hover:text-amber-700 text-lg leading-none w-6 h-6 flex items-center justify-center rounded transition-colors"
                      aria-label="Dismiss roll result"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex flex-col items-center bg-amber-100 border border-amber-300 rounded-lg px-2.5 py-1 min-w-[44px]">
                      <span className="text-xs text-amber-600 font-semibold leading-none mb-0.5">d20</span>
                      <span className="text-xl font-black text-amber-900 leading-none">{lastRoll.roll}</span>
                    </span>
                    <span className="text-stone-400 font-bold text-lg">+</span>
                    <span className="flex flex-col items-center bg-stone-100 border border-stone-300 rounded-lg px-2.5 py-1 min-w-[44px]">
                      <span className="text-xs text-stone-500 font-semibold leading-none mb-0.5">bonus</span>
                      <span className="text-xl font-black text-stone-700 leading-none">{lastRoll.bonus}</span>
                    </span>
                    <span className="text-stone-400 font-bold text-lg">=</span>
                    <span className={`text-3xl font-black leading-none ${lastRoll.total >= 20 ? 'text-emerald-600' : lastRoll.roll === 1 ? 'text-red-600' : 'text-amber-700'}`}>
                      {lastRoll.total}
                    </span>
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

                  {/* Where the bonus came from.
                      This breakdown already existed, but only as a `title` tooltip on
                      the row — which needs a mouse. On the tablet this app is built
                      for there is no hover, so the bonus was a bare number with no way
                      to see what fed it. Showing it in the tap-triggered result card
                      puts it where it is actually reachable. */}
                  {breakdown && (
                    <div className="mt-2 pt-2 border-t border-amber-200 flex flex-wrap gap-x-3 gap-y-0.5">
                      {buildBreakdownRows(skill, breakdown).map((row) => (
                        <span key={row.label} className="text-[11px] leading-tight whitespace-nowrap">
                          <span className="text-amber-700/70">{row.label}</span>{' '}
                          <span className="font-semibold text-amber-900">{row.value}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
