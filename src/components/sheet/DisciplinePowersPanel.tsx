import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { getPowerById } from '../../data/powers';
import type { Character } from '../../types/character';
import type { PowerData } from '../../types/gameData';

interface Props {
  character: Character;
}

/** Classes that have Discipline Powers */
export const DISCIPLINE_CLASSES = ['psion'] as const;

/** Map discipline choice → the two auto-granted encounter power IDs */
const DISCIPLINE_POWER_MAP: Record<string, string[]> = {
  telekinesis: ['psion-far-hand', 'psion-forceful-push'],
  telepathy: ['psion-distract', 'psion-send-thoughts'],
};

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
}: {
  power: PowerData;
  used: boolean;
  onUse: () => void;
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
            Discipline
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

// ── Main Component ────────────────────────────────────────────────────────────

export function DisciplinePowersPanel({ character }: Props) {
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const discipline = character.psionDiscipline ?? 'telekinesis';
  const powerIds = DISCIPLINE_POWER_MAP[discipline] ?? [];
  const powers: PowerData[] = powerIds
    .map((id) => getPowerById(id))
    .filter((p): p is PowerData => !!p);

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

  const disciplineLabel = discipline === 'telekinesis' ? 'Telekinesis' : 'Telepathy';

  return (
    <div className="space-y-3 p-3">
      {/* Header card */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
        <p className="text-sm font-bold text-indigo-800">Discipline Powers — {disciplineLabel}</p>
        <p className="text-xs text-indigo-600 mt-0.5">
          Encounter powers — each can be used once between rests.
        </p>
      </div>

      {/* Power cards */}
      {powers.map((power) => (
        <DisciplinePowerCard
          key={power.id}
          power={power}
          used={character.usedEncounterPowers.includes(power.id)}
          onUse={() => handleUse(power)}
        />
      ))}

      {powers.length === 0 && (
        <div className="text-center py-8 text-stone-400 text-sm">
          No discipline powers found.
        </div>
      )}
    </div>
  );
}
