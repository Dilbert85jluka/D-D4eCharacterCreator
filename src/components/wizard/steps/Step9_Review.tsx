import { useWizardStore } from '../../../store/useWizardStore';
import { useCharactersStore } from '../../../store/useCharactersStore';
import { useAppStore } from '../../../store/useAppStore';
import { characterRepository } from '../../../db/characterRepository';
import { getRaceById } from '../../../data/races';
import { getClassById } from '../../../data/classes';
import { getPowerById } from '../../../data/powers';
import { getFeatById } from '../../../data/feats';
import { abilityModifier, formatModifier, ABILITY_ABBR, ABILITIES } from '../../../utils/abilityScores';
import { Button } from '../../ui/Button';
import { Badge, RoleBadge } from '../../ui/Badge';
import type { Ability } from '../../../types/character';

export function Step9_Review() {
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

  // Calculate final scores for review
  const finalScores = { ...wizard.baseAbilityScores };
  if (wizard.raceId === 'human' && wizard.humanAbilityBonus) {
    finalScores[wizard.humanAbilityBonus] = finalScores[wizard.humanAbilityBonus] + 2;
  }
  if (race) {
    Object.entries(race.abilityBonuses).forEach(([ab, val]) => {
      (finalScores as Record<string, number>)[ab] += (val ?? 0);
    });
  }

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
          <div className="flex flex-wrap gap-2 text-sm text-stone-600">
            {wizard.alignment && <Badge color="stone">{wizard.alignment}</Badge>}
            {wizard.deity && <span>Deity: {wizard.deity}</span>}
          </div>
        </div>
      </section>

      {/* Ability Scores */}
      <section className="mb-4">
        <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Ability Scores</h4>
        <div className="grid grid-cols-3 gap-2">
          {ABILITIES.map((ab) => {
            const score = finalScores[ab];
            const mod = abilityModifier(score);
            return (
              <div key={ab} className="bg-white border border-stone-200 rounded-lg p-2 text-center">
                <div className="text-xs text-stone-400 font-semibold">{ABILITY_ABBR[ab as Ability]}</div>
                <div className="text-xl font-bold text-stone-800">{score}</div>
                <div className={`text-sm font-semibold ${mod >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatModifier(mod)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Defenses preview */}
      {cls && race && (
        <section className="mb-4">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Defenses (estimated)</h4>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'AC', value: 10 + (cls.armorProficiencies.includes('Scale') || cls.armorProficiencies.includes('Plate') ? 6 : 2) },
              { label: 'Fort', value: 10 + Math.max(abilityModifier(finalScores.str), abilityModifier(finalScores.con)) + cls.fortitudeBonus + (wizard.raceId === 'human' ? 1 : 0) },
              { label: 'Ref', value: 10 + Math.max(abilityModifier(finalScores.dex), abilityModifier(finalScores.int)) + cls.reflexBonus + (wizard.raceId === 'human' ? 1 : 0) },
              { label: 'Will', value: 10 + Math.max(abilityModifier(finalScores.wis), abilityModifier(finalScores.cha)) + cls.willBonus + (wizard.raceId === 'human' ? 1 : 0) + (wizard.raceId === 'eladrin' ? 1 : 0) },
            ].map((d) => (
              <div key={d.label} className="bg-white border border-stone-200 rounded-lg p-2 text-center">
                <div className="text-xs text-stone-400 font-semibold">{d.label}</div>
                <div className="text-xl font-bold text-stone-800">{d.value}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HP */}
      {cls && (
        <section className="mb-4">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Hit Points</h4>
          <div className="bg-white border border-stone-200 rounded-lg p-3">
            <span className="text-2xl font-bold text-stone-800">
              {cls.hpAtFirstLevel + finalScores.con}
            </span>
            <span className="text-stone-400 ml-2 text-sm">max HP</span>
            <span className="ml-4 text-stone-600 text-sm">
              Bloodied: {Math.floor((cls.hpAtFirstLevel + finalScores.con) / 2)}
            </span>
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
      {wizard.selectedPowerIds.length > 0 && (
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
