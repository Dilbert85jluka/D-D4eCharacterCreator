import { useState } from 'react';
import { FEATS, featMeetsPrerequisites, getFeatById, isFeatRepeatable } from '../../../data/feats';
import { getClassById } from '../../../data/classes';
import { getSkillById } from '../../../data/skills';
import { getRaceById } from '../../../data/races';
import { useWizardStore } from '../../../store/useWizardStore';
import { Badge } from '../../ui/Badge';
import type { FeatData } from '../../../types/gameData';

export function Step7_Feats() {
  const {
    raceId, classId, trainedSkills, selectedFeatIds, toggleFeat,
    mcFeatSkillChoices, mcFeatProficiencyChoices,
    setMcFeatSkillChoice, setMcFeatProficiencyChoice, clearMcFeatChoices,
    baseAbilityScores, humanAbilityBonus, racialAbilityBonusChoice,
    deity,
  } = useWizardStore();

  const [search, setSearch]               = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  // MC choice modals — store the featId awaiting a choice
  const [mcSkillModal, setMcSkillModal] = useState<string | null>(null);
  const [mcProfModal, setMcProfModal]   = useState<string | null>(null);

  const isHuman  = raceId === 'human';
  const isWizard = classId === 'wizard';
  const maxFeats = isHuman ? 2 : 1;

  // Feats auto-granted by class feature (not selectable, don't count against the budget)
  const AUTO_GRANTED_IDS: Record<string, string[]> = {
    wizard: ['ritual-caster'], cleric: ['ritual-caster'], bard: ['ritual-caster'],
    druid: ['ritual-caster'], invoker: ['ritual-caster'], psion: ['ritual-caster'],
  };
  const autoGrantedIds = AUTO_GRANTED_IDS[classId] ?? [];

  // Compute final ability scores for prerequisite checking:
  // point-buy base + human +2 (not yet baked in the wizard) + fixed racial + chosen racial
  const raceData = getRaceById(raceId);
  const finalAbilityScores: Record<string, number> = { ...baseAbilityScores };
  if (isHuman && humanAbilityBonus) {
    finalAbilityScores[humanAbilityBonus] = (finalAbilityScores[humanAbilityBonus] ?? 0) + 2;
  }
  if (raceData?.abilityBonuses) {
    for (const [ab, bonus] of Object.entries(raceData.abilityBonuses)) {
      finalAbilityScores[ab] = (finalAbilityScores[ab] ?? 0) + (bonus as number);
    }
  }
  if (racialAbilityBonusChoice && raceData?.abilityBonusOptions) {
    finalAbilityScores[racialAbilityBonusChoice] =
      (finalAbilityScores[racialAbilityBonusChoice] ?? 0) + (raceData.abilityBonusOptions.amount ?? 2);
  }

  // Combined IDs for prereq checking: what the character will have (selected + auto-grants)
  const allFeatIds = [...selectedFeatIds, ...autoGrantedIds];

  const meetsPrereqs = (feat: FeatData) =>
    featMeetsPrerequisites(feat, raceId, classId, trainedSkills, allFeatIds, 1, finalAbilityScores, deity);

  const filtered = FEATS.filter((feat) => {
    if (feat.tier !== 'Heroic') return false;
    if (autoGrantedIds.includes(feat.id)) return false;   // hide auto-granted feats from picker
    if (search && !feat.name.toLowerCase().includes(search.toLowerCase())) return false;
    // Always hide multiclass feats whose prerequisites aren't met (the toggle doesn't override this)
    if (feat.multiclassFor && !meetsPrereqs(feat)) return false;
    if (availableOnly && !meetsPrereqs(feat)) return false;
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));

  const handleFeatClick = (feat: FeatData) => {
    const isSelected = selectedFeatIds.includes(feat.id);
    if (isSelected) {
      // Un-selecting: clear any MC choices first, then toggle off
      clearMcFeatChoices(feat.id);
      toggleFeat(feat.id);
    } else {
      // Selecting: toggle on, then handle MC choices
      toggleFeat(feat.id);
      if (feat.multiclassFor) {
        if (feat.mcFixedSkill) {
          // Auto-grant fixed skill
          setMcFeatSkillChoice(feat.id, feat.mcFixedSkill);
        } else {
          // Open skill choice modal
          setMcSkillModal(feat.id);
        }
        if (feat.mcFixedProficiency) {
          setMcFeatProficiencyChoice(feat.id, feat.mcFixedProficiency);
        }
      }
    }
  };

  const confirmSkillChoice = (featId: string, skillId: string) => {
    const feat = getFeatById(featId);
    setMcFeatSkillChoice(featId, skillId);
    setMcSkillModal(null);
    // Chain into proficiency modal if needed
    if (feat?.mcProficiencyChoices?.length) setMcProfModal(featId);
  };

  const confirmProfChoice = (featId: string, proficiency: string) => {
    setMcFeatProficiencyChoice(featId, proficiency);
    setMcProfModal(null);
  };

  // Skills available for an MC feat's skill modal (class skills not already trained)
  const getMcSkillOptions = (featId: string) => {
    const feat = getFeatById(featId);
    if (!feat?.multiclassFor) return [];
    const cls = getClassById(feat.multiclassFor);
    const currentChoice = mcFeatSkillChoices[featId];
    return (cls?.availableSkills ?? [])
      .filter((sk) => !trainedSkills.includes(sk) || currentChoice === sk)
      .map((sk) => getSkillById(sk))
      .filter(Boolean);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Choose Feats</h2>
        <p className="text-stone-500 text-sm">
          Select {maxFeats} feat{maxFeats > 1 ? 's' : ''} for your character.
          {isHuman && ' Humans get an extra feat at 1st level!'}
        </p>
      </div>

      {/* Auto-granted class feature feats */}
      {autoGrantedIds.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Class Feature — Free Feat</p>
          <p className="text-sm font-semibold text-stone-800">Ritual Caster</p>
          <p className="text-xs text-stone-600 mt-0.5">
            {classId === 'wizard' && 'Wizards gain Ritual Caster as a bonus feat from their Ritual Casting class feature.'}
            {classId === 'bard' && 'Bards gain Ritual Caster as a bonus feat from their Bardic Training class feature.'}
            {classId === 'cleric' && 'Clerics gain Ritual Caster as a bonus feat from their Ritual Casting class feature.'}
            {classId === 'druid' && 'Druids gain Ritual Caster as a bonus feat from their Ritual Casting class feature.'}
            {classId === 'invoker' && 'Invokers gain Ritual Caster as a bonus feat from their Ritual Casting class feature.'}
            {classId === 'psion' && 'Psions gain Ritual Caster as a bonus feat from their Ritual Casting class feature.'}
            {' '}This does not cost a feat slot.
          </p>
        </div>
      )}

      {/* Selected count */}
      <div className={[
        'text-center py-3 rounded-xl mb-4 font-bold text-base',
        selectedFeatIds.length >= maxFeats ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
      ].join(' ')}>
        {selectedFeatIds.length} / {maxFeats} feat{maxFeats > 1 ? 's' : ''} selected
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search feats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
        />
        <button
          onClick={() => setAvailableOnly(!availableOnly)}
          className={[
            'px-3 py-2 rounded-lg border text-sm font-medium min-h-[44px] transition-colors',
            availableOnly ? 'bg-amber-600 text-white border-amber-700' : 'bg-white text-stone-700 border-stone-300',
          ].join(' ')}
        >
          Eligible only
        </button>
      </div>

      {/* Feat list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-stone-500 text-sm text-center py-8">No feats match your filters.</p>
        )}
        {filtered.map((feat) => {
          const isSelected = selectedFeatIds.includes(feat.id);
          const available  = meetsPrereqs(feat);
          const chosenSkill = mcFeatSkillChoices[feat.id];
          const chosenProf  = mcFeatProficiencyChoices[feat.id];
          const needsSkill  = isSelected && feat.multiclassFor && !feat.mcFixedSkill && !chosenSkill;
          const needsProf   = isSelected && feat.mcProficiencyChoices?.length && !chosenProf;

          return (
            <button
              key={feat.id}
              onClick={() => { if (available || isSelected) handleFeatClick(feat); }}
              disabled={!available && !isSelected}
              className={[
                'w-full text-left p-3 rounded-xl border transition-all min-h-[44px]',
                isSelected
                  ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-300'
                  : available
                    ? 'bg-white border-stone-200 hover:border-amber-300'
                    : 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed',
              ].join(' ')}
            >
              <div className="flex items-start gap-2">
                <div className={[
                  'w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center',
                  isSelected ? 'bg-amber-600 border-amber-600' : 'border-stone-300',
                ].join(' ')}>
                  {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-stone-800 text-sm">{feat.name}</span>
                    {feat.multiclassFor && (
                      <Badge color="purple">
                        Multiclass · {getClassById(feat.multiclassFor)?.name ?? feat.multiclassFor}
                      </Badge>
                    )}
                    {!available && (
                      <span className="text-xs text-red-500 flex-shrink-0">Prerequisites not met</span>
                    )}
                  </div>
                  {Object.keys(feat.prerequisites).length > 0 && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      Req: {[
                        feat.prerequisites.race?.join(' or '),
                        feat.prerequisites.class?.join(' or '),
                        feat.prerequisites.trainedSkill && `Trained in ${feat.prerequisites.trainedSkill.join(' or ')}`,
                        feat.prerequisites.abilities && Object.entries(feat.prerequisites.abilities).map(([ab, val]) => `${ab.toUpperCase()} ${val}`).join(', '),
                        feat.prerequisites.anyMulticlassFeat && 'Any multiclass feat',
                        feat.prerequisites.minLevel && `Level ${feat.prerequisites.minLevel}+`,
                      ].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <p className="text-xs text-stone-600 mt-1">{feat.benefit}</p>
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
                  {/* Pending choice warnings (stop propagation so the feat isn't toggled) */}
                  {needsSkill && (
                    <span
                      className="text-xs text-amber-700 font-semibold mt-1 underline"
                      onClick={(e) => { e.stopPropagation(); setMcSkillModal(feat.id); }}
                    >
                      ⚠ Choose a skill from the {getClassById(feat.multiclassFor!)?.name} list
                    </span>
                  )}
                  {!needsSkill && needsProf && (
                    <span
                      className="text-xs text-amber-700 font-semibold mt-1 underline"
                      onClick={(e) => { e.stopPropagation(); setMcProfModal(feat.id); }}
                    >
                      ⚠ Choose a weapon proficiency
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* MC Skill choice modal */}
      {mcSkillModal && (() => {
        const feat = getFeatById(mcSkillModal);
        const cls  = feat?.multiclassFor ? getClassById(feat.multiclassFor) : undefined;
        const skillOptions = getMcSkillOptions(mcSkillModal);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
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
    </div>
  );
}
