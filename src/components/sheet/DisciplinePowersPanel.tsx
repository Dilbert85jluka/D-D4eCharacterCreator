import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { getPowerById } from '../../data/powers';
import type { Character } from '../../types/character';
import type { PowerData } from '../../types/gameData';

interface Props {
  character: Character;
}

/** Classes that have Discipline / Mantle / Battlemind Powers */
export const DISCIPLINE_CLASSES = ['psion', 'ardent', 'battlemind'] as const;

/** Map discipline/mantle/study choice → the auto-granted encounter power IDs */
const DISCIPLINE_POWER_MAP: Record<string, string[]> = {
  // Psion disciplines
  telekinesis: ['psion-far-hand', 'psion-forceful-push'],
  telepathy: ['psion-distract', 'psion-send-thoughts'],
  // Ardent mantles
  clarity: ['ardent-ardent-alacrity', 'ardent-ardent-surge'],
  elation: ['ardent-ardent-outrage', 'ardent-ardent-surge'],
  // Battlemind psionic studies
  resilience: ['battlemind-battle-resilience'],
  speed: ['battlemind-speed-of-thought'],
};

/** Battlemind Psionic Defense at-will powers (all Battleminds get all 3) */
const BATTLEMIND_DEFENSE_POWERS = [
  'battlemind-battleminds-demand',
  'battlemind-blurred-step',
  'battlemind-mind-spike',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function ActionBadge({ action }: { action: PowerData['actionType'] }) {
  const labels: Record<PowerData['actionType'], string> = {
    standard:              'Standard',
    move:                  'Move',
    minor:                 'Minor',
    free:                  'Free',
    'immediate-interrupt': 'Imm. Interrupt',
    'immediate-reaction':  'Imm. Reaction',
    opportunity:           'Opportunity',
  };
  return (
    <span className="text-xs font-semibold bg-stone-100 border border-stone-300 text-stone-600 px-2 py-0.5 rounded-full">
      {labels[action] ?? action}
    </span>
  );
}

function PowerBody({ power }: { power: PowerData }) {
  return (
    <div className="bg-white px-4 py-3 space-y-2">
      {/* Keywords */}
      {power.keywords.length > 0 && (
        <p className="text-xs text-stone-400 font-medium">
          {power.keywords.join(' • ')}
        </p>
      )}

      {/* Target */}
      <div className="text-sm">
        <span className="font-semibold text-stone-600">Target: </span>
        <span className="text-stone-700">{power.target}</span>
      </div>

      {/* Attack */}
      {power.attack && (
        <div className="text-sm">
          <span className="font-semibold text-stone-600">Attack: </span>
          <span className="text-stone-700">{power.attack}</span>
        </div>
      )}

      {/* Hit */}
      {power.hit && (
        <div className="text-sm">
          <span className="font-semibold text-red-700">Hit: </span>
          <span className="text-stone-700">{power.hit}</span>
        </div>
      )}

      {/* Effect */}
      {power.effect && (
        <div className="text-sm">
          <span className="font-semibold text-indigo-700">Effect: </span>
          <span className="text-stone-700">{power.effect}</span>
        </div>
      )}

      {/* Special */}
      {power.special && (
        <div className="text-xs text-stone-500 italic border-t border-stone-100 pt-2 mt-1">
          {power.special}
        </div>
      )}
    </div>
  );
}

function DisciplinePowerCard({
  power,
  used,
  onUse,
  badgeLabel,
}: {
  power: PowerData;
  used: boolean;
  onUse: () => void;
  badgeLabel: string;
}) {
  return (
    <div className={[
      'rounded-xl border overflow-hidden transition-opacity',
      used ? 'opacity-50' : '',
    ].join(' ')}>
      {/* Header */}
      <div className={[
        'px-4 py-2.5 flex items-center justify-between gap-2',
        used ? 'bg-stone-400' : 'bg-indigo-800',
      ].join(' ')}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white font-bold text-sm truncate">{power.name}</span>
          <span className="text-xs font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
            {badgeLabel}
          </span>
        </div>
        <ActionBadge action={power.actionType} />
      </div>

      <PowerBody power={power} />

      {/* Use button */}
      <div className="bg-white px-4 pb-3">
        <button
          onClick={onUse}
          disabled={used}
          className={[
            'w-full py-2 rounded-lg text-sm font-bold transition-colors',
            used
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 text-white',
          ].join(' ')}
        >
          {used ? 'Used' : 'Use'}
        </button>
      </div>
    </div>
  );
}

// ── Label maps ────────────────────────────────────────────────────────────────

const DISCIPLINE_LABELS: Record<string, string> = {
  telekinesis: 'Telekinesis',
  telepathy: 'Telepathy',
  clarity: 'Clarity',
  elation: 'Elation',
  resilience: 'Battle Resilience',
  speed: 'Speed of Thought',
};

// ── Main Component ────────────────────────────────────────────────────────────

/** Read-only power card for at-will class feature powers (no Use button) */
function AtWillPowerCard({ power, badgeLabel }: { power: PowerData; badgeLabel: string }) {
  return (
    <div className="rounded-xl border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2 bg-teal-800">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white font-bold text-sm truncate">{power.name}</span>
          <span className="text-xs font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
            {badgeLabel}
          </span>
        </div>
        <ActionBadge action={power.actionType} />
      </div>

      <PowerBody power={power} />
    </div>
  );
}

export function DisciplinePowersPanel({ character }: Props) {
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const isArdent = character.classId === 'ardent';
  const isBattlemind = character.classId === 'battlemind';
  const discipline = isBattlemind
    ? (character.battlemindOption ?? 'resilience')
    : isArdent
      ? (character.ardentMantle ?? 'clarity')
      : (character.psionDiscipline ?? 'telekinesis');
  const powerIds = DISCIPLINE_POWER_MAP[discipline] ?? [];
  const powers: PowerData[] = powerIds
    .map((id) => getPowerById(id))
    .filter((p): p is PowerData => !!p);

  // Battlemind Psionic Defense at-will powers (always available)
  const defensePowers: PowerData[] = isBattlemind
    ? BATTLEMIND_DEFENSE_POWERS.map((id) => getPowerById(id)).filter((p): p is PowerData => !!p)
    : [];

  const patch = async (changes: Partial<typeof character>) => {
    await characterRepository.patch(character.id, changes);
    updateCharacter({ ...character, ...changes });
  };

  const handleUse = async (power: PowerData) => {
    if (character.usedEncounterPowers.includes(power.id)) return;
    await patch({
      usedEncounterPowers: [...character.usedEncounterPowers, power.id],
    });
  };

  const sectionLabel = isBattlemind ? 'Battlemind Powers' : isArdent ? 'Ardent Powers' : 'Discipline Powers';
  const badgeLabel = isBattlemind ? 'Study' : isArdent ? 'Mantle' : 'Discipline';
  const disciplineLabel = DISCIPLINE_LABELS[discipline] ?? discipline;

  return (
    <div className="space-y-3 p-3">
      {/* Header card */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
        <p className="text-sm font-bold text-indigo-800">{sectionLabel} — {disciplineLabel}</p>
        <p className="text-xs text-indigo-600 mt-0.5">
          {isBattlemind
            ? 'Psionic study encounter power and psionic defense at-will powers.'
            : 'Encounter powers — each can be used once between rests.'}
        </p>
      </div>

      {/* Encounter power cards */}
      {powers.map((power) => (
        <DisciplinePowerCard
          key={power.id}
          power={power}
          used={character.usedEncounterPowers.includes(power.id)}
          onUse={() => handleUse(power)}
          badgeLabel={badgeLabel}
        />
      ))}

      {/* Battlemind Psionic Defense at-will powers */}
      {defensePowers.length > 0 && (
        <>
          <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 mt-2">
            <p className="text-sm font-bold text-teal-800">Psionic Defense</p>
            <p className="text-xs text-teal-600 mt-0.5">
              At-will powers — always available, no rest needed.
            </p>
          </div>
          {defensePowers.map((power) => (
            <AtWillPowerCard key={power.id} power={power} badgeLabel="Defense" />
          ))}
        </>
      )}

      {powers.length === 0 && defensePowers.length === 0 && (
        <div className="text-center py-8 text-stone-400 text-sm">
          No {isBattlemind ? 'battlemind' : isArdent ? 'ardent' : 'discipline'} powers found.
        </div>
      )}
    </div>
  );
}
