import { useState } from 'react';
import type { Character } from '../../types/character';
import { getFeatById, FEATS, featMeetsPrerequisites } from '../../data/feats';
import { getClassById } from '../../data/classes';
import { getSkillById } from '../../data/skills';
import { getRaceById } from '../../data/races';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { Badge } from '../ui/Badge';
import { featsEarnedByLevel } from '../../data/advancement';

interface Props {
  character: Character;
}

/**
 * Returns the number of feat slots a character has earned by their current level,
 * per the D&D 4e PHB character advancement table (p.29).
 * Humans receive one bonus feat at level 1.
 */
function expectedFeatCount(character: Character): number {
  return featsEarnedByLevel(character.level) + (character.raceId === 'human' ? 1 : 0);
}

export function FeatsPanel({ character }: Props) {
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');

  // MC choice modals — store the featId awaiting a choice
  const [mcSkillModal, setMcSkillModal] = useState<string | null>(null);
  const [mcProfModal, setMcProfModal]   = useState<string | null>(null);

  // Auto-granted feats from class features (not stored in selectedFeatIds, don't count against budget)
  const AUTO_GRANTED: Record<string, string[]> = {
    wizard: ['ritual-caster'], cleric: ['ritual-caster'], bard: ['ritual-caster'],
    druid: ['ritual-caster'], invoker: ['ritual-caster'], psion: ['ritual-caster'],
  };
  const autoGrantedIds = AUTO_GRANTED[character.classId] ?? [];
  const autoGrantedFeats = autoGrantedIds.map((id) => getFeatById(id)).filter(Boolean);

  const feats = character.selectedFeatIds.map((id) => getFeatById(id)).filter(Boolean);
  const maxFeats = expectedFeatCount(character);
  const atLimit = character.selectedFeatIds.length >= maxFeats;
  const remaining = maxFeats - character.selectedFeatIds.length;

  const mcFeatSkillChoices     = character.mcFeatSkillChoices     ?? {};
  const mcFeatProficiencyChoices = character.mcFeatProficiencyChoices ?? {};

  const patch = async (changes: Partial<Character>) => {
    await characterRepository.patch(character.id, changes);
    updateCharacter({ ...character, ...changes });
  };

  const addFeat = async (id: string) => {
    if (character.selectedFeatIds.includes(id) || atLimit) return;
    const feat = getFeatById(id);
    const changes: Partial<Character> = {
      selectedFeatIds: [...character.selectedFeatIds, id],
    };
    // Fixed skill (e.g. Arcane Initiate → Arcana): auto-grant, no modal
    if (feat?.mcFixedSkill) {
      if (!character.trainedSkills.includes(feat.mcFixedSkill)) {
        changes.trainedSkills = [...character.trainedSkills, feat.mcFixedSkill];
      }
      changes.mcFeatSkillChoices = { ...mcFeatSkillChoices, [id]: feat.mcFixedSkill };
    }
    // Fixed proficiency (e.g. Sneak of Shadows → Hand Crossbow): auto-store, no modal
    if (feat?.mcFixedProficiency) {
      changes.mcFeatProficiencyChoices = { ...mcFeatProficiencyChoices, [id]: feat.mcFixedProficiency };
    }
    await patch(changes);
    if (remaining === 1) setShowPicker(false);
    // Open choice modals as needed (skill first, proficiency chains after skill pick)
    if (feat?.multiclassFor && !feat.mcFixedSkill) {
      setMcSkillModal(id);
    } else if (feat?.mcProficiencyChoices?.length) {
      setMcProfModal(id);
    }
  };

  const removeFeat = async (id: string) => {
    const skillToRemove = mcFeatSkillChoices[id];
    const newSkillChoices = { ...mcFeatSkillChoices };
    const newProfChoices  = { ...mcFeatProficiencyChoices };
    delete newSkillChoices[id];
    delete newProfChoices[id];
    const changes: Partial<Character> = {
      selectedFeatIds: character.selectedFeatIds.filter((f) => f !== id),
      mcFeatSkillChoices: newSkillChoices,
      mcFeatProficiencyChoices: newProfChoices,
    };
    if (skillToRemove) {
      changes.trainedSkills = character.trainedSkills.filter((s) => s !== skillToRemove);
    }
    await patch(changes);
  };

  const confirmSkillChoice = async (featId: string, skillId: string) => {
    const feat = getFeatById(featId);
    const changes: Partial<Character> = {
      trainedSkills: character.trainedSkills.includes(skillId)
        ? character.trainedSkills
        : [...character.trainedSkills, skillId],
      mcFeatSkillChoices: { ...mcFeatSkillChoices, [featId]: skillId },
    };
    await patch(changes);
    setMcSkillModal(null);
    // Chain into proficiency modal if needed
    if (feat?.mcProficiencyChoices?.length) setMcProfModal(featId);
  };

  const confirmProfChoice = async (featId: string, proficiency: string) => {
    await patch({ mcFeatProficiencyChoices: { ...mcFeatProficiencyChoices, [featId]: proficiency } });
    setMcProfModal(null);
  };

  // Compute final ability scores: base (includes human +2 if already baked in)
  // + fixed racial bonuses + player's chosen racial bonus
  const raceData = getRaceById(character.raceId);
  const finalAbilityScores: Record<string, number> = { ...character.baseAbilityScores };
  if (raceData?.abilityBonuses) {
    for (const [ab, bonus] of Object.entries(raceData.abilityBonuses)) {
      finalAbilityScores[ab] = (finalAbilityScores[ab] ?? 0) + (bonus as number);
    }
  }
  if (character.racialAbilityChoiceBonus) {
    for (const [ab, bonus] of Object.entries(character.racialAbilityChoiceBonus)) {
      if (bonus) finalAbilityScores[ab] = (finalAbilityScores[ab] ?? 0) + bonus;
    }
  }

  // All feats not yet selected (excluding auto-grants), filtered by search — eligibility checked per-card
  const pickerFeats = FEATS.filter(
    (f) =>
      !character.selectedFeatIds.includes(f.id) &&
      !autoGrantedIds.includes(f.id) &&
      (search.trim() === '' ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.benefit.toLowerCase().includes(search.toLowerCase())),
  );

  // Combined feat IDs seen by prerequisite checker (selected + auto-granted)
  const allFeatIds = [...character.selectedFeatIds, ...autoGrantedIds];

  // Helper: class skills available for an MC feat's skill modal
  const getMcSkillOptions = (featId: string) => {
    const feat = getFeatById(featId);
    if (!feat?.multiclassFor) return [];
    const cls = getClassById(feat.multiclassFor);
    return (cls?.availableSkills ?? [])
      .filter((sk) => !character.trainedSkills.includes(sk) || mcFeatSkillChoices[featId] === sk)
      .map((sk) => getSkillById(sk))
      .filter(Boolean);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden h-full flex flex-col">
        <div className="bg-amber-800 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wide">Feats</h3>
            <p className={`text-xs mt-0.5 font-semibold ${atLimit ? 'text-amber-300' : 'text-amber-400'}`}>
              {character.selectedFeatIds.length} / {maxFeats}
              {!atLimit && ` · ${remaining} to choose`}
            </p>
          </div>
          {!atLimit && (
            <button
              onClick={() => { setShowPicker(true); setSearch(''); }}
              className="text-xs px-2 py-1 rounded bg-amber-600 text-white hover:bg-amber-500 font-semibold transition-colors min-h-[30px]"
            >
              + Add Feat
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-stone-100 flex-shrink-0">
          <div
            className={`h-1 transition-all ${atLimit ? 'bg-emerald-500' : 'bg-amber-400'}`}
            style={{ width: `${Math.min(100, (character.selectedFeatIds.length / maxFeats) * 100)}%` }}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
          {/* Auto-granted class feature feats — no remove button, don't count against budget */}
          {autoGrantedFeats.map((feat) => {
            if (!feat) return null;
            return (
              <div key={feat.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <h4 className="font-semibold text-stone-800 text-sm">{feat.name}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-600 text-white flex-shrink-0">
                      Class Feature
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-600 mt-1">{feat.benefit}</p>
              </div>
            );
          })}

          {feats.length === 0 && autoGrantedFeats.length === 0 && (
            <p className="text-stone-400 text-sm text-center py-4">No feats selected yet.</p>
          )}
          {feats.map((feat) => {
            if (!feat) return null;
            const chosenSkill = mcFeatSkillChoices[feat.id];
            const chosenProf  = mcFeatProficiencyChoices[feat.id];
            const needsSkill  = feat.multiclassFor && !feat.mcFixedSkill && !chosenSkill;
            const needsProf   = feat.mcProficiencyChoices?.length && !chosenProf;
            return (
              <div key={feat.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <h4 className="font-semibold text-stone-800 text-sm">{feat.name}</h4>
                    {feat.multiclassFor && (
                      <Badge color="purple">
                        Multiclass · {getClassById(feat.multiclassFor)?.name ?? feat.multiclassFor}
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={() => removeFeat(feat.id)}
                    className="text-stone-300 hover:text-red-500 transition-colors text-xl leading-none flex-shrink-0"
                    title="Remove feat"
                  >×</button>
                </div>
                {Object.keys(feat.prerequisites).length > 0 && (
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Req: {[
                      feat.prerequisites.race?.join(' or '),
                      feat.prerequisites.class?.join(' or '),
                      feat.prerequisites.trainedSkill && `Trained in ${feat.prerequisites.trainedSkill.join(' or ')}`,
                      feat.prerequisites.abilities &&
                        Object.entries(feat.prerequisites.abilities)
                          .map(([ab, val]) => `${ab.toUpperCase()} ${val}`)
                          .join(', '),
                      feat.prerequisites.proficiency && `Proficient: ${feat.prerequisites.proficiency}`,
                      feat.prerequisites.otherFeat && `Feat: ${feat.prerequisites.otherFeat}`,
                      feat.prerequisites.anyMulticlassFeat && 'Any multiclass feat',
                      feat.prerequisites.minLevel && `Level ${feat.prerequisites.minLevel}+`,
                    ].filter(Boolean).join(' · ')}
                  </p>
                )}
                <p className="text-xs text-stone-600 mt-1">{feat.benefit}</p>
                {feat.special && (
                  <p className="text-xs text-amber-700 mt-1"><strong>Special:</strong> {feat.special}</p>
                )}
                {/* MC choices confirmed */}
                {chosenSkill && (
                  <p className="text-xs text-emerald-700 mt-1 font-medium">
                    ✓ Skill: {getSkillById(chosenSkill)?.name ?? chosenSkill}
                  </p>
                )}
                {chosenProf && (
                  <p className="text-xs text-emerald-700 mt-1 font-medium">
                    ✓ Proficiency: {chosenProf}
                  </p>
                )}
                {/* Pending choice warnings */}
                {needsSkill && (
                  <button
                    onClick={() => setMcSkillModal(feat.id)}
                    className="text-xs text-amber-700 font-semibold mt-1.5 underline"
                  >
                    ⚠ Choose a skill from the {getClassById(feat.multiclassFor!)?.name} list
                  </button>
                )}
                {!needsSkill && needsProf && (
                  <button
                    onClick={() => setMcProfModal(feat.id)}
                    className="text-xs text-amber-700 font-semibold mt-1.5 underline"
                  >
                    ⚠ Choose a weapon proficiency
                  </button>
                )}
              </div>
            );
          })}

          {/* Prompt when slots remain */}
          {!atLimit && feats.length > 0 && (
            <button
              onClick={() => { setShowPicker(true); setSearch(''); }}
              className="w-full py-2 border-2 border-dashed border-amber-200 rounded-lg text-sm text-amber-600 hover:border-amber-400 hover:bg-amber-50 transition-colors"
            >
              + Choose {remaining} more feat{remaining !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* Feat picker modal */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-3 pb-3 sm:pb-0"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPicker(false); }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-amber-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-white font-bold">Choose a Feat</h3>
                <p className="text-amber-300 text-xs mt-0.5">
                  {remaining} slot{remaining !== 1 ? 's' : ''} remaining
                </p>
              </div>
              <button
                onClick={() => setShowPicker(false)}
                className="text-amber-200 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
              >×</button>
            </div>

            <div className="px-4 py-3 border-b border-stone-100 flex-shrink-0">
              <input
                type="text"
                placeholder="Search feats…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            <div className="overflow-y-auto flex-1 p-3 space-y-2">
              {pickerFeats.length === 0 && (
                <p className="text-stone-400 text-sm text-center py-6">No feats found.</p>
              )}
              {pickerFeats.map((feat) => {
                const canSelect = !atLimit && featMeetsPrerequisites(
                  feat,
                  character.raceId,
                  character.classId,
                  character.trainedSkills,
                  allFeatIds,
                  character.level,
                  finalAbilityScores,
                  character.deity,
                );
                const prereqText = Object.keys(feat.prerequisites).length > 0 ? [
                  feat.prerequisites.race?.join(' or '),
                  feat.prerequisites.class?.join(' or '),
                  feat.prerequisites.trainedSkill && `Trained in ${feat.prerequisites.trainedSkill.join(' or ')}`,
                  feat.prerequisites.abilities &&
                    Object.entries(feat.prerequisites.abilities)
                      .map(([ab, val]) => `${ab.toUpperCase()} ${val}`)
                      .join(', '),
                  feat.prerequisites.proficiency && `Proficient: ${feat.prerequisites.proficiency}`,
                  feat.prerequisites.otherFeat && `Feat: ${feat.prerequisites.otherFeat}`,
                  feat.prerequisites.anyMulticlassFeat && 'Any multiclass feat',
                  feat.prerequisites.minLevel && `Level ${feat.prerequisites.minLevel}+`,
                ].filter(Boolean).join(' · ') : null;

                return (
                  <div
                    key={feat.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      canSelect ? 'bg-stone-50 border-stone-200' : 'bg-stone-50/40 border-stone-100'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold ${canSelect ? 'text-stone-800' : 'text-stone-400'}`}>
                          {feat.name}
                        </p>
                        {feat.multiclassFor && (
                          <Badge color="purple">
                            Multiclass · {getClassById(feat.multiclassFor)?.name ?? feat.multiclassFor}
                          </Badge>
                        )}
                      </div>
                      {prereqText && (
                        <p className={`text-[11px] mt-0.5 ${canSelect ? 'text-stone-400' : 'text-red-600 font-bold'}`}>
                          Req: {prereqText}
                        </p>
                      )}
                      <p className={`text-xs mt-0.5 ${canSelect ? 'text-stone-500' : 'text-stone-400'}`}>
                        {feat.benefit}
                      </p>
                    </div>
                    <button
                      onClick={() => canSelect && addFeat(feat.id)}
                      disabled={!canSelect}
                      className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px] ${
                        canSelect
                          ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      Select
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MC Skill choice modal */}
      {mcSkillModal && (() => {
        const feat = getFeatById(mcSkillModal);
        const cls  = feat?.multiclassFor ? getClassById(feat.multiclassFor) : undefined;
        const skillOptions = getMcSkillOptions(mcSkillModal);
        return (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setMcSkillModal(null); }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="bg-purple-700 px-5 py-4 text-white">
                <h3 className="font-bold text-lg">Choose a Skill</h3>
                <p className="text-sm opacity-80 mt-0.5">
                  {cls?.name} class skill list
                </p>
              </div>
              <div className="px-4 py-3 space-y-2 max-h-72 overflow-y-auto">
                {skillOptions.length === 0 && (
                  <p className="text-stone-400 text-sm text-center py-4">
                    All class skills are already trained.
                  </p>
                )}
                {skillOptions.map((skill) => skill && (
                  <button
                    key={skill.id}
                    onClick={() => confirmSkillChoice(mcSkillModal, skill.id)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center justify-between min-h-[44px]"
                  >
                    <span className="font-semibold text-stone-800 text-sm">{skill.name}</span>
                    <span className="text-xs text-stone-400 uppercase font-medium">{skill.keyAbility}</span>
                  </button>
                ))}
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={() => setMcSkillModal(null)}
                  className="w-full py-2.5 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold hover:bg-stone-50 transition-colors"
                >
                  Choose Later
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MC Proficiency choice modal */}
      {mcProfModal && (() => {
        const feat = getFeatById(mcProfModal);
        const cls  = feat?.multiclassFor ? getClassById(feat.multiclassFor) : undefined;
        return (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setMcProfModal(null); }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="bg-purple-700 px-5 py-4 text-white">
                <h3 className="font-bold text-lg">Choose a Proficiency</h3>
                <p className="text-sm opacity-80 mt-0.5">
                  {cls?.name} multiclass benefit
                </p>
              </div>
              <div className="px-4 py-3 space-y-2">
                {(feat?.mcProficiencyChoices ?? []).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => confirmProfChoice(mcProfModal, opt)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 hover:border-purple-400 hover:bg-purple-50 transition-all font-semibold text-stone-800 text-sm min-h-[44px]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={() => setMcProfModal(null)}
                  className="w-full py-2.5 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold hover:bg-stone-50 transition-colors"
                >
                  Choose Later
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
