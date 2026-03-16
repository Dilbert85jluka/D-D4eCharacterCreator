import { useState } from 'react';
import { RACES } from '../../../data/races';
import { useWizardStore } from '../../../store/useWizardStore';
import { Card, CardBody } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import type { Ability } from '../../../types/character';
import { ABILITY_ABBR } from '../../../utils/abilityScores';
import { getRaceById } from '../../../data/races';
import { CHOOSABLE_LANGUAGES, parseRaceLanguages } from '../../../data/languages';

const ALL_ABILITIES: Ability[] = ['str', 'con', 'dex', 'int', 'wis', 'cha'];

export function Step2_Race() {
  const {
    raceId, setRace,
    subraceId, setSubrace,
    humanAbilityBonus, setHumanAbilityBonus,
    racialAbilityBonusChoice, setRacialAbilityBonusChoice,
    bonusLanguage, setBonusLanguage,
  } = useWizardStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  const selectedRace = getRaceById(raceId);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Choose Your Race</h2>
        <p className="text-stone-500 text-sm">Your race grants ability score bonuses, racial traits, and may grant a racial power.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {RACES.map((race) => {
          const isSelected = raceId === race.id;
          const isExpanded = expanded === race.id;

          // Build display text for ability bonuses
          const hasSubraces = race.subraces && race.subraces.length > 0;
          const fixedBonuses = Object.entries(race.abilityBonuses)
            .map(([ab, val]) => `+${val} ${ABILITY_ABBR[ab as Ability]}`);
          const optionBonus = race.abilityBonusOptions
            ? `+${race.abilityBonusOptions.amount} ${race.abilityBonusOptions.options.map(a => ABILITY_ABBR[a]).join(' or ')}`
            : null;
          const humanBonus = race.id === 'human' ? '+2 to one ability of choice' : null;
          const subraceBonus = hasSubraces
            ? race.subraces!.map((sr) => {
                const parts = Object.entries(sr.abilityBonuses).map(([ab, val]) => `+${val} ${ABILITY_ABBR[ab as Ability]}`);
                return `${sr.name}: ${parts.join(', ')}`;
              }).join(' / ')
            : null;

          const allBonusParts = [
            ...fixedBonuses,
            ...(optionBonus ? [optionBonus] : []),
            ...(humanBonus ? [humanBonus] : []),
            ...(subraceBonus ? [subraceBonus] : []),
          ];
          const bonusText = allBonusParts.join(', ') || '+2 to one ability of choice';

          return (
            <Card
              key={race.id}
              interactive
              selected={isSelected}
              onClick={() => {
                setRace(race.id);
                setExpanded(isExpanded ? null : race.id);
              }}
            >
              <div className="p-3">
                {/* Race header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-stone-800">{race.name}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Size: {race.size} · Speed {race.speed} · Vision: {race.vision}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-amber-600 text-xl flex-shrink-0">✓</span>
                  )}
                </div>

                {/* Ability bonuses */}
                <div className="mt-2">
                  <Badge color="amber">{bonusText}</Badge>
                </div>

                {/* Skill bonuses */}
                {race.skillBonuses.length > 0 && (
                  <p className="text-xs text-stone-500 mt-1">
                    +2 {race.skillBonuses.map((s) => s.skillId.charAt(0).toUpperCase() + s.skillId.slice(1)).join(', ')}
                  </p>
                )}

                {/* Expand/collapse traits */}
                <button
                  onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : race.id); }}
                  className="mt-2 text-xs text-amber-700 font-medium"
                >
                  {isExpanded ? '▲ Hide traits' : '▼ Show traits'}
                </button>

                {isExpanded && (
                  <div className="mt-2 space-y-2 border-t border-stone-100 pt-2">
                    {race.traits.map((trait) => (
                      <div key={trait.name}>
                        <p className="text-xs font-semibold text-stone-700">{trait.name}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{trait.description}</p>
                      </div>
                    ))}
                    {race.subraces?.map((sr) => (
                      <div key={sr.id} className="border-t border-stone-100 pt-2">
                        <p className="text-xs font-bold text-amber-800 mb-1">{sr.name}</p>
                        {sr.traits.map((trait) => (
                          <div key={trait.name}>
                            <p className="text-xs font-semibold text-stone-700">{trait.name}</p>
                            <p className="text-xs text-stone-500 mt-0.5">{trait.description}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Human: choose which ability gets +2 */}
      {raceId === 'human' && (
        <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-sm font-semibold text-amber-900 mb-3">
            Humans get +2 to one ability score. Choose which:
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_ABILITIES.map((ab) => (
              <button
                key={ab}
                onClick={() => setHumanAbilityBonus(ab)}
                className={[
                  'px-4 py-2 rounded-lg border font-medium text-sm min-h-[44px] transition-colors',
                  humanAbilityBonus === ab
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-amber-400',
                ].join(' ')}
              >
                {ABILITY_ABBR[ab]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Non-human races with two ability bonus options */}
      {raceId && raceId !== 'human' && selectedRace?.abilityBonusOptions && (
        <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-sm font-semibold text-amber-900 mb-1">
            {selectedRace.name}s get +2 to one of these ability scores. Choose which:
          </p>
          <p className="text-xs text-stone-500 mb-3">
            (You also always receive{' '}
            {Object.entries(selectedRace.abilityBonuses)
              .map(([ab, val]) => `+${val} ${ABILITY_ABBR[ab as Ability]}`)
              .join(' and ')
            })
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedRace.abilityBonusOptions.options.map((ab) => (
              <button
                key={ab}
                onClick={() => setRacialAbilityBonusChoice(ab)}
                className={[
                  'px-4 py-2 rounded-lg border font-medium text-sm min-h-[44px] transition-colors',
                  racialAbilityBonusChoice === ab
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-amber-400',
                ].join(' ')}
              >
                +{selectedRace.abilityBonusOptions?.amount} {ABILITY_ABBR[ab]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sub-race picker (e.g. Shifter → Longtooth / Razorclaw) */}
      {raceId && selectedRace?.subraces && selectedRace.subraces.length > 0 && (
        <div className="mt-5 p-4 bg-violet-50 rounded-xl border border-violet-200">
          <p className="text-sm font-semibold text-violet-900 mb-3">
            Choose your sub-race:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedRace.subraces.map((sr) => {
              const isChosen = subraceId === sr.id;
              const abilityParts = Object.entries(sr.abilityBonuses)
                .map(([ab, val]) => `+${val} ${ABILITY_ABBR[ab as Ability]}`);
              const skillParts = sr.skillBonuses?.map((s) =>
                `+${s.bonus} ${s.skillId.charAt(0).toUpperCase() + s.skillId.slice(1)}`
              ) ?? [];
              return (
                <button
                  key={sr.id}
                  onClick={() => setSubrace(sr.id)}
                  className={[
                    'p-3 rounded-xl border text-left transition-colors min-h-[44px]',
                    isChosen
                      ? 'bg-violet-600 text-white border-violet-700'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-violet-400',
                  ].join(' ')}
                >
                  <p className="font-bold text-sm">{sr.name}</p>
                  <p className={`text-xs mt-1 ${isChosen ? 'text-violet-100' : 'text-stone-500'}`}>
                    {abilityParts.join(', ')}
                  </p>
                  {skillParts.length > 0 && (
                    <p className={`text-xs ${isChosen ? 'text-violet-200' : 'text-stone-400'}`}>
                      {skillParts.join(', ')}
                    </p>
                  )}
                  {sr.traits.map((t) => (
                    <p key={t.name} className={`text-xs mt-1 ${isChosen ? 'text-violet-100' : 'text-stone-500'}`}>
                      {t.name}: {t.description}
                    </p>
                  ))}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-race ability bonus options (if the selected subrace has abilityBonusOptions) */}
      {raceId && subraceId && selectedRace?.subraces && (() => {
        const sr = selectedRace.subraces.find((s) => s.id === subraceId);
        if (!sr?.abilityBonusOptions) return null;
        return (
          <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-sm font-semibold text-amber-900 mb-1">
              {sr.name} — choose an ability bonus:
            </p>
            <p className="text-xs text-stone-500 mb-3">
              (You also always receive{' '}
              {Object.entries(sr.abilityBonuses)
                .map(([ab, val]) => `+${val} ${ABILITY_ABBR[ab as Ability]}`)
                .join(' and ')
              })
            </p>
            <div className="flex flex-wrap gap-2">
              {sr.abilityBonusOptions.options.map((ab) => (
                <button
                  key={ab}
                  onClick={() => setRacialAbilityBonusChoice(ab)}
                  className={[
                    'px-4 py-2 rounded-lg border font-medium text-sm min-h-[44px] transition-colors',
                    racialAbilityBonusChoice === ab
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-amber-400',
                  ].join(' ')}
                >
                  +{sr.abilityBonusOptions?.amount} {ABILITY_ABBR[ab]}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── Languages ───────────────────────────────────────────────────── */}
      {raceId && selectedRace && (() => {
        const { automatic, hasBonusChoice } = parseRaceLanguages(selectedRace.languages);
        return (
          <div className="mt-5 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <p className="text-sm font-semibold text-stone-800 mb-1">🗣 Languages</p>
            <p className="text-xs text-stone-500 mb-3">
              In D&D 4e all characters speak Common. Your race determines any additional languages you know automatically.
              {hasBonusChoice && ' Your race also grants one additional language of your choice.'}
            </p>

            {/* Automatic languages */}
            <div className="flex flex-wrap gap-2 mb-3">
              {automatic.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                             bg-amber-100 text-amber-800 border border-amber-200"
                >
                  ✓ {lang}
                </span>
              ))}
              {hasBonusChoice && bonusLanguage && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                             bg-emerald-100 text-emerald-800 border border-emerald-200"
                >
                  ✓ {CHOOSABLE_LANGUAGES.find((l) => l.id === bonusLanguage)?.name ?? bonusLanguage}
                  <span className="text-emerald-600 font-normal">(chosen)</span>
                </span>
              )}
            </div>

            {/* Bonus language picker */}
            {hasBonusChoice && (
              <div>
                <p className="text-xs font-semibold text-stone-600 mb-2">
                  Choose your bonus language:
                </p>
                <select
                  value={bonusLanguage}
                  onChange={(e) => setBonusLanguage(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm
                             bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
                >
                  <option value="">— Select a language —</option>
                  {CHOOSABLE_LANGUAGES
                    .filter((l) => !automatic.includes(l.name))
                    .filter((l) => !selectedRace.bonusLanguageOptions || selectedRace.bonusLanguageOptions.includes(l.name))
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} — {l.speakers}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
