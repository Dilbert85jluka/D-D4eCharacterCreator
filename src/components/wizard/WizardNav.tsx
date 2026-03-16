import { useWizardStore } from '../../store/useWizardStore';

const STEP_LABELS = [
  'Basics',
  'Race',
  'Class',
  'Abilities',
  'Skills',
  'Powers',
  'Feats',
  'Equipment',
  'Hit Points',
  'Review',
];

export function WizardNav() {
  const { currentStep, setStep } = useWizardStore();

  return (
    <div className="bg-amber-950 px-4 py-3 overflow-x-auto">
      <div className="flex gap-1 min-w-max mx-auto" style={{ maxWidth: 'max-content' }}>
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <button
              key={step}
              onClick={() => isCompleted && setStep(step)}
              className={[
                'flex flex-col items-center px-3 py-2 rounded-lg transition-all min-w-[64px]',
                isCurrent
                  ? 'bg-amber-600 text-white'
                  : isCompleted
                    ? 'bg-amber-800/60 text-amber-100 cursor-pointer hover:bg-amber-700'
                    : 'bg-amber-900/40 text-amber-500 cursor-default',
              ].join(' ')}
            >
              <span className="text-xs font-bold mb-0.5">
                {isCompleted ? '✓' : step}
              </span>
              <span className="text-xs leading-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
