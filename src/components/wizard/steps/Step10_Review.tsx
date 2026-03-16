import { useWizardStore } from '../../../store/useWizardStore';
import { useCharactersStore } from '../../../store/useCharactersStore';
import { useAppStore } from '../../../store/useAppStore';
import { characterRepository } from '../../../db/characterRepository';
import { getRaceById } from '../../../data/races';
import { getClassById } from '../../../data/classes';
import { getPowerById } from '../../../data/powers';
import { getFeatById } from '../../../data/feats';
import { abilityModifier, formatModifier, ABILITY_ABBR, ABILITIES } from '../../../utils/abilityScores';
import { calculateMaxHp } from '../../../utils/hitPoints';
import { Button } from '../../ui/Button';
import { Badge, RoleBadge } from '../../ui/Badge';
import type { Ability } from '../../../types/character';
import { parseRaceLanguages, CHOOSABLE_LANGUAGES } from '../../../data/languages';

export function Step10_Review() {
  const wizard = useWizardStore();
  const addCharacter = useCharactersStore((s) => s.addCharacter);
  const { navigate, showToast } = useAppStore();

  const race = getRaceById(wizard.raceId);
  const cls = getClassById(wizard.classId);

  const isValid = wizard.name.trim().length > 0 && wizard.raceId && wizard.classId;

  const handleCreate = async () => {
    const data = wizard.buildCharacter();
    const character = await characterRepository.create(data);
    addCharacter(character);
    wizard.resetWizard();
    showToast(`${character.name} created!`, 'success');
    navigate('sheet', character.id);
  };

  // Calculate final scores for review (matching buildCharacter + useCharacterDerived)
  const finalScores = { ...wizard.baseAbilityScores };
  if (wizard.raceId === 'human' && wizard.humanAbilityBonus) {
    finalScores[wizard.humanAbilityBonus] = finalScores[wizard.humanAbilityBonus] + 2;
  }
  if (race) {
    Object.entries(race.abilityBonuses).forEach(([ab, val]) => {
      (finalScores as Record<string, number>)[ab] += (val ?? 0);
    });
  }
  // Apply racial ability choice bonus (e.g. Half-Elf choosing CON)
  if (wizard.racialAbilityBonusChoice && wizard.raceId !== 'human') {
    finalScores[wizard.racialAbilityBonusChoice] = finalScores[wizard.racialAbilityBonusChoice] + 2;
  }

  const maxHp = cls ? calculateMaxHp(cls.hpAtFirstLevel, cls.hpPerLevel, finalScores.con, 1) : 12;
  const startingHp = wizard.customHp ?? maxHp;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Review & Create</h2>
        <p className="text-stone-500 text-sm">Review your character before finalizing.</p>
      </div>

      {!isValid && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Please complete all required steps (name, race, and class) before creating.
        </div>
      )}

      {/* Identity */}
      <section className="mb-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="text-lg font-bold text-stone-900">{wizard.name || '(No name)'}</h3>
              <p className="text-stone-500 text-sm">
                {race?.name ?? '—'} {cls?.name ?? '—'} · Level 1
              </p>
            </div>
            {cls && <RoleBadge role={cls.role} />}
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-stone-600 mb-2">
            {wizard.alignment && <Badge color="stone">{wizard.alignment}</Badge>}
            {wizard.gender && <Badge color="stone">{wizard.gender}</Badge>}
            {wizard.age && <span className="text-stone-500 text-xs">Age {wizard.age}</span>}
            {wizard.deity && <span className="text-stone-500 text-xs">Deity: {wizard.deity}</span>}
          </div>

          {/* Appearance */}
          {(wizard.height || wizard.weight || wizard.build || wizard.eyeColor || wizard.hairColor) && (
            <div className="mt-2 pt-2 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Appearance</p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-stone-500">
                {wizard.height    && <span>Height: {wizard.height}</span>}
                {wizard.weight    && <span>Weight: {wizard.weight}</span>}
                {wizard.build     && <span>Build: {wizard.build}</span>}
                {wizard.eyeColor  && <span>Eyes: {wizard.eyeColor}</span>}
                {wizard.hairColor && <span>Hair: {wizard.hairColor}</span>}
              </div>
            </div>
          )}

          {/* Languages */}
          {race && (() => {
            const { automatic, hasBonusChoice } = parseRaceLanguages(race.languages);
            const langs = [...automatic];
            if (hasBonusChoice && wizard.bonusLanguage) {
              const found = CHOOSABLE_LANGUAGES.find((l) => l.id === wizard.bonusLanguage);
              langs.push(found?.name ?? wizard.bonusLanguage);
            }
            if (langs.length === 0) return null;
            return (
              <div className="mt-2 pt-2 border-t border-stone-100">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Languages</p>
                <div className="flex flex-wrap gap-1.5">
                  {langs.map((l) => (
                    <span key={l} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      {l}
                    </span>
                  ))}
                  {hasBonusChoice && !wizard.bonusLanguage && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600 border border-red-200">
                      ⚠ Bonus language not chosen
                    </span>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Ability Scores */}
      <section className="mb-4">
        <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Ability Scores</h4>
        <div className="grid grid-cols-3 gap-2">
          {ABILITIES.map((ab) => {
            const base = wizard.baseAbilityScores[ab];
            const score = finalScores[ab];
            const mod = abilityModifier(score);
            const racialBonus = race?.abilityBonuses[ab] ?? 0;
            const humanBonus = (wizard.raceId === 'human' && wizard.humanAbilityBonus === ab) ? 2 : 0;
            const choiceBonus = (wizard.racialAbilityBonusChoice === ab && wizard.raceId !== 'human' && race?.abilityBonusOptions) ? 2 : 0;
            const hasBonus = racialBonus !== 0 || humanBonus !== 0 || choiceBonus !== 0;
            return (
              <div key={ab} className="bg-white border border-stone-200 rounded-lg p-2 text-center">
                <div className="text-xs text-stone-400 font-semibold">{ABILITY_ABBR[ab as Ability]}</div>
                <div className="text-xl font-bold text-stone-800">{score}</div>
                <div className={`text-sm font-semibold ${mod >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatModifier(mod)}
                </div>
                {hasBonus && (
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {base}
                    {racialBonus !== 0 && <span className="text-emerald-600"> +{racialBonus} race</span>}
                    {humanBonus !== 0 && <span className="text-emerald-600"> +{humanBonus} human</span>}
                    {choiceBonus !== 0 && <span className="text-emerald-600"> +{choiceBonus} race</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Defenses preview */}
      {cls && race && (() => {
        const strMod = abilityModifier(finalScores.str);
        const conMod = abilityModifier(finalScores.con);
        const dexMod = abilityModifier(finalScores.dex);
        const intMod = abilityModifier(finalScores.int);
        const wisMod = abilityModifier(finalScores.wis);
        const chaMod = abilityModifier(finalScores.cha);
        const humanBonus = wizard.raceId === 'human' ? 1 : 0;
        const eladrinBonus = wizard.raceId === 'eladrin' ? 1 : 0;
        const racialWillBonus = race.willBonus ?? 0;
        const armorBonus = cls.armorProficiencies.includes('Scale') || cls.armorProficiencies.includes('Plate') ? 6 : 2;

        const defenses = [
          {
            label: 'AC',
            value: 10 + armorBonus,
            parts: [
              { text: '10 base', color: '' },
              { text: `+${armorBonus} armor`, color: 'text-blue-600' },
            ],
          },
          {
            label: 'Fort',
            value: 10 + Math.max(strMod, conMod) + cls.fortitudeBonus + humanBonus,
            parts: [
              { text: '10 base', color: '' },
              { text: `${formatModifier(Math.max(strMod, conMod))} ${strMod >= conMod ? 'STR' : 'CON'}`, color: 'text-emerald-600' },
              ...(cls.fortitudeBonus > 0 ? [{ text: `+${cls.fortitudeBonus} ${cls.name}`, color: 'text-blue-600' }] : []),
              ...(humanBonus > 0 ? [{ text: `+${humanBonus} race`, color: 'text-amber-600' }] : []),
            ],
          },
          {
            label: 'Ref',
            value: 10 + Math.max(dexMod, intMod) + cls.reflexBonus + humanBonus,
            parts: [
              { text: '10 base', color: '' },
              { text: `${formatModifier(Math.max(dexMod, intMod))} ${dexMod >= intMod ? 'DEX' : 'INT'}`, color: 'text-emerald-600' },
              ...(cls.reflexBonus > 0 ? [{ text: `+${cls.reflexBonus} ${cls.name}`, color: 'text-blue-600' }] : []),
              ...(humanBonus > 0 ? [{ text: `+${humanBonus} race`, color: 'text-amber-600' }] : []),
            ],
          },
          {
            label: 'Will',
            value: 10 + Math.max(wisMod, chaMod) + cls.willBonus + humanBonus + eladrinBonus + racialWillBonus,
            parts: [
              { text: '10 base', color: '' },
              { text: `${formatModifier(Math.max(wisMod, chaMod))} ${wisMod >= chaMod ? 'WIS' : 'CHA'}`, color: 'text-emerald-600' },
              ...(cls.willBonus > 0 ? [{ text: `+${cls.willBonus} ${cls.name}`, color: 'text-blue-600' }] : []),
              ...(humanBonus > 0 ? [{ text: `+${humanBonus} Human`, color: 'text-amber-600' }] : []),
              ...(eladrinBonus > 0 ? [{ text: `+${eladrinBonus} Eladrin`, color: 'text-amber-600' }] : []),
              ...(racialWillBonus > 0 ? [{ text: `+${racialWillBonus} ${race.name}`, color: 'text-amber-600' }] : []),
            ],
          },
        ];

        return (
          <section className="mb-4">
            <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Defenses (estimated)</h4>
            <div className="grid grid-cols-4 gap-2">
              {defenses.map((d) => (
                <div key={d.label} className="bg-white border border-stone-200 rounded-lg p-2 text-center">
                  <div className="text-xs text-stone-400 font-semibold">{d.label}</div>
                  <div className="text-xl font-bold text-stone-800">{d.value}</div>
                  <div className="mt-1 space-y-px">
                    {d.parts.map((p, i) => (
                      <div key={i} className={`text-[10px] leading-tight ${p.color || 'text-stone-400'}`}>{p.text}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* HP */}
      {cls && (
        <section className="mb-4">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Hit Points</h4>
          <div className="bg-white border border-stone-200 rounded-lg p-3 flex items-center gap-4">
            <div>
              <span className="text-2xl font-bold text-stone-800">{startingHp}</span>
              <span className="text-stone-400 ml-1 text-sm">starting HP</span>
              {wizard.customHp !== null && wizard.customHp !== maxHp && (
                <span className="ml-2 text-xs text-amber-600 font-semibold">(custom)</span>
              )}
            </div>
            <div className="text-stone-400 text-sm">
              Max: {maxHp} · Bloodied: {Math.floor(maxHp / 2)}
            </div>
          </div>
        </section>
      )}

      {/* Trained Skills */}
      {wizard.trainedSkills.length > 0 && (
        <section className="mb-4">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Trained Skills</h4>
          <div className="flex flex-wrap gap-2">
            {wizard.trainedSkills.map((s) => (
              <Badge key={s} color="teal">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Badge>
            ))}
            {wizard.bonusSkillTrained && (
              <Badge color="amber">
                {wizard.bonusSkillTrained.charAt(0).toUpperCase() + wizard.bonusSkillTrained.slice(1)} ({race?.bonusSkillOptions ? `${race.name} Education` : 'human'})
              </Badge>
            )}
          </div>
        </section>
      )}

      {/* Powers */}
      {(wizard.selectedPowerIds.length > 0 || wizard.dilettantePowerId) && (
        <section className="mb-4">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Powers</h4>
          <div className="space-y-1">
            {wizard.selectedPowerIds.map((pid) => {
              const pw = getPowerById(pid);
              return pw ? (
                <div key={pid} className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-2">
                  <span className="text-sm text-stone-800">{pw.name}</span>
                  <Badge color={pw.usage === 'at-will' ? 'green' : pw.usage === 'encounter' ? 'blue' : 'purple'}>
                    {pw.usage === 'at-will' ? 'At-Will' : pw.usage.charAt(0).toUpperCase() + pw.usage.slice(1)}
                  </Badge>
                </div>
              ) : null;
            })}
            {/* Half-Elf Dilettante power */}
            {wizard.dilettantePowerId && (() => {
              const pw = getPowerById(wizard.dilettantePowerId);
              return pw ? (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <span className="text-sm text-stone-800">{pw.name}</span>
                  <Badge color="green">At-Will</Badge>
                  <Badge color="amber">Dilettante</Badge>
                </div>
              ) : null;
            })()}
          </div>
        </section>
      )}

      {/* Feats */}
      {wizard.selectedFeatIds.length > 0 && (
        <section className="mb-4">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Feats</h4>
          <div className="flex flex-wrap gap-2">
            {wizard.selectedFeatIds.map((fid) => {
              const feat = getFeatById(fid);
              return feat ? (
                <Badge key={fid} color="amber">{feat.name}</Badge>
              ) : null;
            })}
          </div>
        </section>
      )}

      {/* Equipment */}
      {wizard.equipment.length > 0 && (
        <section className="mb-6">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
            Equipment <span className="text-amber-600 font-bold">({wizard.goldPieces} gp remaining)</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {wizard.equipment.map((e) => (
              <Badge key={e.itemId} color="stone">{e.name}</Badge>
            ))}
          </div>
        </section>
      )}

      {/* Create button */}
      <Button
        size="lg"
        fullWidth
        disabled={!isValid}
        onClick={handleCreate}
      >
        ⚔️ Create Character
      </Button>
    </div>
  );
}
