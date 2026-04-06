import { useState } from 'react';
import { useWizardStore } from '../../store/useWizardStore';
import { useAppStore } from '../../store/useAppStore';
import { getClassById } from '../../data/classes';
import { getRaceById } from '../../data/races';
import { getPowerById } from '../../data/powers';
import { ABILITIES } from '../../utils/abilityScores';
import { WizardNav } from './WizardNav';
import { Step1_Basics } from './steps/Step1_Basics';
import { Step2_Race } from './steps/Step2_Race';
import { Step3_Class } from './steps/Step3_Class';
import { Step4_AbilityScores } from './steps/Step4_AbilityScores';
import { Step5_Skills } from './steps/Step5_Skills';
import { Step6_Powers } from './steps/Step6_Powers';
import { Step7_Feats } from './steps/Step7_Feats';
import { Step8_Equipment } from './steps/Step8_Equipment';
import { Step9_HitPoints } from './steps/Step9_HitPoints';
import { Step10_Review } from './steps/Step10_Review';
import { Button } from '../ui/Button';
import type React from 'react';

const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  1: Step1_Basics,
  2: Step2_Race,
  3: Step3_Class,
  4: Step4_AbilityScores,
  5: Step5_Skills,
  6: Step6_Powers,
  7: Step7_Feats,
  8: Step8_Equipment,
  9: Step9_HitPoints,
  10: Step10_Review,
};

function canProceed(step: number, wizard: ReturnType<typeof useWizardStore.getState>): boolean {
  switch (step) {
    case 1: return wizard.name.trim().length > 0;
    case 2: {
      if (!wizard.raceId) return false;
      if (wizard.raceId === 'human') return wizard.humanAbilityBonus !== '';
      const race = getRaceById(wizard.raceId);
      if (race?.abilityBonusOptions) return wizard.racialAbilityBonusChoice !== '';
      return true;
    }
    case 3: {
      if (!wizard.classId) return false;
      if (wizard.classId === 'wizard') return wizard.arcaneImplement !== '';
      if (wizard.classId === 'warlock') return wizard.warlockPact !== '';
      if (wizard.classId === 'fighter') return wizard.fighterCombatStyle !== '';
      if (wizard.classId === 'avenger') return wizard.avengerCensure !== '';
      if (wizard.classId === 'barbarian') return wizard.barbarianFeralMight !== '';
      if (wizard.classId === 'bard') return wizard.bardVirtue !== '';
      if (wizard.classId === 'druid') return wizard.druidPrimalAspect !== '';
      if (wizard.classId === 'invoker') return wizard.invokerCovenant !== '';
      if (wizard.classId === 'shaman') return wizard.shamanSpirit !== '';
      if (wizard.classId === 'sorcerer') return wizard.sorcererSpellSource !== '';
      if (wizard.classId === 'warden') return wizard.wardenGuardianMight !== '';
      // PHB3 build choices
      if (wizard.classId === 'ardent') return wizard.ardentMantle !== '';
      if (wizard.classId === 'battlemind') return wizard.battlemindOption !== '';
      if (wizard.classId === 'monk') return wizard.monkTradition !== '';
      if (wizard.classId === 'psion') return wizard.psionDiscipline !== '' && wizard.psionStartingRitualId !== '';
      if (wizard.classId === 'runepriest') return wizard.runepriestArtistry !== '';
      if (wizard.classId === 'seeker') return wizard.seekerBond !== '';
      return true;
    }
    case 4: {
      const m = wizard.abilityScoreMethod ?? 'point-buy';
      // All methods require all 6 abilities to have a value > 0
      const allAssigned = ABILITIES.every((ab) => wizard.baseAbilityScores[ab] > 0);
      if (!allAssigned) return false;
      if (m === 'point-buy') return wizard.pointBuyStartingSet; // must be in adjust phase
      if (m === 'standard-array') {
        const stdArr = [16, 14, 13, 12, 11, 10];
        return ABILITIES.every((ab) => stdArr.includes(wizard.baseAbilityScores[ab]));
      }
      if (m === 'rolled') return wizard.activeRollGroup >= 0;
      return true;
    }
    case 5: {
      const cls = getClassById(wizard.classId);
      return wizard.trainedSkills.length >= (cls?.trainedSkillCount ?? 0);
    }
    case 6: {
      const cls6 = getClassById(wizard.classId);
      if (!cls6) return false;
      const isHuman6 = wizard.raceId === 'human';
      const isHalfElf6 = wizard.raceId === 'half-elf';
      const isWizard6 = wizard.classId === 'wizard';
      const countUsage = (usage: string) =>
        wizard.selectedPowerIds.filter((id) => getPowerById(id)?.usage === usage).length;
      const atWillNeeded = isHuman6 ? cls6.atWillPowerCount + 1 : cls6.atWillPowerCount;
      const encounterNeeded = cls6.encounterPowerCount;
      const dailyNeeded = isWizard6 ? 2 : cls6.dailyPowerCount;
      if (countUsage('at-will') < atWillNeeded) return false;
      if (countUsage('encounter') < encounterNeeded) return false;
      if (countUsage('daily') < dailyNeeded) return false;
      if (isHalfElf6 && !wizard.dilettantePowerId) return false;
      return true;
    }
    case 7: return true;
    case 8: return true;
    case 9: return true;
    case 10: return false;
    default: return true;
  }
}

export function CreationWizard() {
  const wizard = useWizardStore();
  const navigate = useAppStore((s) => s.navigate);
  const { currentStep, nextStep, prevStep } = wizard;
  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLastStep = currentStep === 10;
  const proceed = canProceed(currentStep, wizard);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancelConfirmed = () => {
    wizard.resetWizard();
    navigate('home');
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#f5e6c8' }}>
      <WizardNav />

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {StepComponent && <StepComponent />}
      </div>

      {/* Navigation footer — always visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 py-3 flex gap-3 shadow-lg no-print">
        {/* Cancel — always on the left */}
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="flex-shrink-0 px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 hover:border-red-300 active:bg-red-100 transition-colors min-h-[44px]"
        >
          ✕ Cancel
        </button>

        {/* Back */}
        {currentStep > 1 && (
          <Button variant="outline" onClick={prevStep} size="lg">
            ← Back
          </Button>
        )}

        {/* Next — only on non-review steps */}
        {!isLastStep && (
          <Button
            fullWidth
            size="lg"
            onClick={nextStep}
            disabled={!proceed}
          >
            {currentStep === 9 ? 'Review →' : 'Next →'}
          </Button>
        )}
      </div>

      {/* Discard confirmation modal */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCancelConfirm(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="bg-red-600 px-5 py-4 text-white">
              <h3 className="font-bold text-lg">Discard Character?</h3>
              <p className="text-sm text-red-100 mt-0.5">
                All progress on this character will be lost.
              </p>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-sm text-stone-600">
                Are you sure you want to cancel? Your character
                {wizard.name ? ` "${wizard.name}"` : ''} has not been saved and will be discarded.
              </p>
            </div>

            {/* Buttons */}
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 border-2 border-stone-200 rounded-xl text-stone-700 font-semibold hover:bg-stone-50 transition-colors min-h-[44px]"
              >
                Keep Building
              </button>
              <button
                onClick={handleCancelConfirmed}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-xl text-white font-semibold transition-colors min-h-[44px]"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
