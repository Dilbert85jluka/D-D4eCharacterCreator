import { useWizardStore } from '../../../store/useWizardStore';
import { getClassById } from '../../../data/classes';
import { getRaceById } from '../../../data/races';
import { SKILLS } from '../../../data/skills';
import { abilityModifier, formatModifier } from '../../../utils/abilityScores';

export function Step5_Skills() {
  const {
    classId, raceId, baseAbilityScores, humanAbilityBonus,
    trainedSkills, mandatorySkillChoicePick, bonusSkillTrained,
    toggleSkill, setMandatorySkillChoicePick, setBonusSkill,
  } = useWizardStore();

  const cls = getClassById(classId);
  const race = getRaceById(raceId);
  const hasBonusSkill = race?.bonusSkill ?? false;
  const mandatorySkills = cls?.mandatorySkills ?? [];
  const mandatorySkillChoice = cls?.mandatorySkillChoice ?? [];
  const hasMandatoryChoice = mandatorySkillChoice.length > 0;

  // Total trained skill slots (including mandatory)
  const totalMax = cls?.trainedSkillCount ?? 0;
  // How many are mandatory (auto-trained + mandatory choice)
  const mandatoryCount = mandatorySkills.length + (hasMandatoryChoice ? 1 : 0);
  // How many are free picks
  const freePickMax = totalMax - mandatoryCount;
  // Count free picks currently in trainedSkills
  const freePickCount = trainedSkills.filter(
    (s) => !mandatorySkills.includes(s) && !(hasMandatoryChoice && s === mandatorySkillChoicePick),
  ).length;

  const finalScores = { ...baseAbilityScores };
  if (raceId === 'human' && humanAbilityBonus) {
    finalScores[humanAbilityBonus] = finalScores[humanAbilityBonus] + 2;
  }
  if (race) {
    Object.entries(race.abilityBonuses).forEach(([ab, val]) => {
      (finalScores as Record<string, number>)[ab] += (val ?? 0);
    });
  }

  const halfLevel = 0; // Level 1

  // Build description text
  const mandatorySkillNames = mandatorySkills.map(
    (id) => SKILLS.find((s) => s.id === id)?.name ?? id,
  );
  const mandatoryChoiceNames = mandatorySkillChoice.map(
    (id) => SKILLS.find((s) => s.id === id)?.name ?? id,
  );

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Choose Trained Skills</h2>
        <p className="text-stone-500 text-sm">
          {cls?.name} can train <strong>{totalMax}</strong> skills.
          {mandatorySkills.length > 0 && (
            <> <strong>{mandatorySkillNames.join(' and ')}</strong> {mandatorySkills.length === 1 ? 'is' : 'are'} automatically trained.</>
          )}
          {hasMandatoryChoice && (
            <> Choose <strong>{mandatoryChoiceNames.join(' or ')}</strong>, plus {freePickMax} more from the class list.</>
          )}
          {!hasMandatoryChoice && mandatorySkills.length > 0 && (
            <> Choose {freePickMax} more from the class list.</>
          )}
          {mandatorySkills.length === 0 && !hasMandatoryChoice && (
            <> Choose from the class list.</>
          )}
          {hasBonusSkill && (
            race?.bonusSkillOptions
              ? ` ${race.name} Education grants 1 bonus trained skill from a special list.`
              : ' You also get 1 bonus trained skill.'
          )}
          {' '}Trained skills get a +5 bonus.
        </p>
      </div>

      {/* Mandatory skill choice section (e.g. Ranger: Dungeoneering or Nature) */}
      {hasMandatoryChoice && (
        <div className="mb-4 p-4 bg-sky-50 rounded-xl border border-sky-200">
          <p className="text-sm font-semibold text-sky-900 mb-3">
            Choose one — {mandatoryChoiceNames.join(' or ')}:
          </p>
          <div className="space-y-1">
            {mandatorySkillChoice.map((skillId) => {
              const skill = SKILLS.find((s) => s.id === skillId);
              if (!skill) return null;
              const isSelected = mandatorySkillChoicePick === skillId;
              return (
                <button
                  key={skillId}
                  onClick={() => setMandatorySkillChoicePick(skillId)}
                  className={[
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors min-h-[44px]',
                    isSelected
                      ? 'bg-sky-100 border-sky-400'
                      : 'bg-white border-stone-200 hover:border-sky-300',
                  ].join(' ')}
                >
                  <div className={[
                    'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                    isSelected ? 'bg-sky-600 border-sky-600' : 'border-stone-300',
                  ].join(' ')}>
                    {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm font-medium text-stone-800">{skill.name}</span>
                  <span className="text-xs text-stone-400">({skill.keyAbility.toUpperCase()})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Free pick counter */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-700">Class Skills</span>
        <span className={`text-sm font-bold ${freePickCount >= freePickMax ? 'text-emerald-600' : 'text-amber-600'}`}>
          {freePickCount} / {freePickMax} selected
        </span>
      </div>

      {/* Main skill list */}
      <div className="space-y-1 mb-6">
        {SKILLS.map((skill) => {
          const isClassSkill = cls?.availableSkills.includes(skill.id) ?? false;
          const isMandatory = mandatorySkills.includes(skill.id);
          const isMandatoryChoicePick = hasMandatoryChoice && skill.id === mandatorySkillChoicePick;
          const isLocked = isMandatory || isMandatoryChoicePick;
          const isTrained = trainedSkills.includes(skill.id);
          const abilityMod = abilityModifier(finalScores[skill.keyAbility]);
          const racialBonus = race?.skillBonuses.find((s) => s.skillId === skill.id)?.bonus ?? 0;
          const trainedBonus = 5;
          const totalTrained = abilityMod + halfLevel + racialBonus + trainedBonus;
          const totalUntrained = abilityMod + halfLevel + racialBonus;
          const atMax = freePickCount >= freePickMax && !isTrained;
          const isDisabled = !isClassSkill || isLocked || (atMax && !isTrained);

          return (
            <button
              key={skill.id}
              disabled={isDisabled}
              onClick={() => !isLocked && isClassSkill && toggleSkill(skill.id)}
              className={[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors min-h-[44px]',
                isLocked && isTrained
                  ? 'bg-sky-50 border-sky-200 cursor-default'
                  : isClassSkill
                    ? isTrained
                      ? 'bg-amber-50 border-amber-300 hover:bg-amber-100'
                      : atMax
                        ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed'
                        : 'bg-white border-stone-200 hover:border-amber-300'
                    : 'bg-stone-50 border-stone-100 opacity-40 cursor-not-allowed',
              ].join(' ')}
            >
              {/* Checkbox */}
              <div className={[
                'w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center',
                isLocked && isTrained
                  ? 'bg-sky-600 border-sky-600'
                  : isTrained
                    ? 'bg-amber-600 border-amber-600'
                    : 'border-stone-300',
              ].join(' ')}>
                {isTrained && <span className="text-white text-xs font-bold">✓</span>}
              </div>

              {/* Skill name */}
              <div className="flex-1 text-left">
                <span className={`text-sm font-medium ${isClassSkill || isLocked ? 'text-stone-800' : 'text-stone-400'}`}>
                  {skill.name}
                </span>
                <span className="text-xs text-stone-400 ml-2">({skill.keyAbility.toUpperCase()})</span>
                {racialBonus > 0 && (
                  <span className="text-xs text-emerald-600 ml-1">+{racialBonus} racial</span>
                )}
                {isMandatory && (
                  <span className="text-xs text-sky-600 ml-1 font-semibold">required</span>
                )}
                {isMandatoryChoicePick && (
                  <span className="text-xs text-sky-600 ml-1 font-semibold">required choice</span>
                )}
              </div>

              {/* Bonus */}
              <div className="text-right flex-shrink-0">
                <span className={`text-sm font-bold ${isTrained ? 'text-emerald-700' : 'text-stone-400'}`}>
                  {formatModifier(isTrained ? totalTrained : totalUntrained)}
                </span>
                {isTrained && (
                  <span className="text-xs text-stone-400 ml-1">(trained)</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Racial bonus skill (Human: any class skill, Eladrin: from Education list) */}
      {hasBonusSkill && (
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-sm font-semibold text-amber-900 mb-3">
            {race?.bonusSkillOptions
              ? `${race.name} Education — choose 1 additional skill from the following list:`
              : 'Human Bonus Skill — choose any 1 additional skill from your class list:'}
          </p>
          <div className="space-y-1">
            {SKILLS.filter(s => {
              // Eladrin Education: from a specific list; Human: from class skill list
              const isEligible = race?.bonusSkillOptions
                ? race.bonusSkillOptions.includes(s.id)
                : (cls?.availableSkills.includes(s.id) ?? false);
              return isEligible && !trainedSkills.includes(s.id);
            }).map((skill) => (
              <button
                key={skill.id}
                onClick={() => setBonusSkill(bonusSkillTrained === skill.id ? '' : skill.id)}
                className={[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors min-h-[44px]',
                  bonusSkillTrained === skill.id
                    ? 'bg-amber-100 border-amber-400'
                    : 'bg-white border-stone-200 hover:border-amber-300',
                ].join(' ')}
              >
                <div className={[
                  'w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center',
                  bonusSkillTrained === skill.id ? 'bg-amber-600 border-amber-600' : 'border-stone-300',
                ].join(' ')}>
                  {bonusSkillTrained === skill.id && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="text-sm font-medium text-stone-800">{skill.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
