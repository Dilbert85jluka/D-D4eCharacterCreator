import { useState } from 'react';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { getPowersByClass, getPowerById } from '../../data/powers';
import { getParagonPathById } from '../../data/paragonPaths';
import { getFeatById } from '../../data/feats';
import type { Character } from '../../types/character';
import type { PowerData } from '../../types/gameData';
import { useCharacterDerived } from '../../hooks/useCharacterDerived';
import { substituteMods } from '../../utils/powerText';
import type { Ability } from '../../types/character';

interface Props {
  character: Character;
}

/** Classes that have Channel Divinity powers */
export const CHANNEL_DIVINITY_CLASSES = ['avenger', 'cleric', 'invoker', 'paladin'] as const;

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

function PowerBody({ power, effectColor, abilityModifiers }: { power: PowerData; effectColor: string; abilityModifiers?: Record<Ability, number> }) {
  const sub = (text: string | undefined) => substituteMods(text, abilityModifiers);
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
          <span className="text-stone-700">{sub(power.attack)}</span>
        </div>
      )}

      {/* Hit */}
      {power.hit && (
        <div className="text-sm">
          <span className="font-semibold text-red-700">Hit: </span>
          <span className="text-stone-700">{sub(power.hit)}</span>
        </div>
      )}

      {/* Effect */}
      {power.effect && (
        <div className="text-sm">
          <span className={`font-semibold ${effectColor}`}>Effect: </span>
          <span className="text-stone-700">{sub(power.effect)}</span>
        </div>
      )}

      {/* Miss */}
      {power.miss && (
        <div className="text-sm">
          <span className="font-semibold text-stone-500">Miss: </span>
          <span className="text-stone-700">{sub(power.miss)}</span>
        </div>
      )}

      {/* Special */}
      {power.special && (
        <div className="text-xs text-stone-500 italic border-t border-stone-100 pt-2 mt-1">
          {sub(power.special)}
        </div>
      )}
    </div>
  );
}

function EncounterPowerCard({
  power,
  used,
  cdExpended,
  onUse,
  abilityModifiers,
}: {
  power: PowerData;
  used: boolean;
  cdExpended: boolean;
  onUse: () => void;
  abilityModifiers?: Record<Ability, number>;
}) {
  return (
    <div className={[
      'rounded-xl border overflow-hidden transition-opacity',
      used ? 'opacity-50' : '',
    ].join(' ')}>
      {/* Header */}
      <div className={[
        'px-4 py-2.5 flex items-center justify-between gap-2',
        used ? 'bg-stone-400' : 'bg-violet-800',
      ].join(' ')}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white font-bold text-sm truncate">{power.name}</span>
          <span className="text-xs font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
            Channel Divinity
          </span>
        </div>
        <ActionBadge action={power.actionType} />
      </div>

      <PowerBody power={power} abilityModifiers={abilityModifiers} effectColor="text-violet-700" />

      {/* Use button */}
      <div className="bg-white px-4 pb-3">
        <button
          onClick={onUse}
          disabled={cdExpended}
          className={[
            'w-full py-2 rounded-lg text-sm font-bold transition-colors',
            used
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : cdExpended
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
              : 'bg-violet-700 hover:bg-violet-600 active:bg-violet-800 text-white',
          ].join(' ')}
        >
          {used
            ? 'Used'
            : cdExpended
            ? 'Channel Divinity Expended'
            : 'Use Channel Divinity'}
        </button>
      </div>
    </div>
  );
}

/** Card for non-Channel-Divinity encounter class features (e.g. Healing Word) — tracked individually */
function ClassFeatureEncounterCard({
  power,
  used,
  onUse,
  abilityModifiers,
}: {
  power: PowerData;
  used: boolean;
  onUse: () => void;
  abilityModifiers?: Record<Ability, number>;
}) {
  return (
    <div className={[
      'rounded-xl border overflow-hidden transition-opacity',
      used ? 'opacity-50' : '',
    ].join(' ')}>
      {/* Header — blue for class features */}
      <div className={[
        'px-4 py-2.5 flex items-center justify-between gap-2',
        used ? 'bg-stone-400' : 'bg-blue-800',
      ].join(' ')}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white font-bold text-sm truncate">{power.name}</span>
          <span className="text-xs font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
            Class Feature
          </span>
        </div>
        <ActionBadge action={power.actionType} />
      </div>

      <PowerBody power={power} abilityModifiers={abilityModifiers} effectColor="text-blue-700" />

      {/* Use button */}
      <div className="bg-white px-4 pb-3">
        <button
          onClick={onUse}
          disabled={used}
          className={[
            'w-full py-2 rounded-lg text-sm font-bold transition-colors',
            used
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white',
          ].join(' ')}
        >
          {used ? 'Used' : 'Use'}
        </button>
      </div>
    </div>
  );
}

function AtWillPowerCard({ power, abilityModifiers }: { power: PowerData; abilityModifiers?: Record<Ability, number> }) {
  return (
    <div className="rounded-xl border overflow-hidden">
      {/* Header — emerald for at-will */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2 bg-emerald-700">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white font-bold text-sm truncate">{power.name}</span>
          <span className="text-xs font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">
            At-Will
          </span>
        </div>
        <ActionBadge action={power.actionType} />
      </div>

      <PowerBody power={power} abilityModifiers={abilityModifiers} effectColor="text-emerald-700" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ChannelDivinityPanel({ character }: Props) {
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);
  const derived = useCharacterDerived(character);
  const abilityMods = derived.abilityModifiers;

  // All level-0 auto-granted class feature powers
  const baseLevel0Powers = getPowersByClass(character.classId).filter((p) => p.level === 0);

  // Add any CD powers granted by the paragon path (e.g. Warpriest cleric gains Divine Challenge)
  const grantedCdPowers: PowerData[] = [];
  if (character.level >= 11 && character.paragonPath) {
    const path = getParagonPathById(character.paragonPath);
    for (const id of (path?.bonuses?.grantedPowerIds ?? [])) {
      const power = getPowerById(id);
      if (power && power.keywords.includes('Channel Divinity') && !baseLevel0Powers.some((p) => p.id === id)) {
        grantedCdPowers.push(power);
      }
    }
  }

  // Add CD powers granted by feats (e.g. deity Channel Divinity feats)
  const seenIds = new Set(baseLevel0Powers.map((p) => p.id));
  for (const id of grantedCdPowers.map((p) => p.id)) seenIds.add(id);
  for (const featId of character.selectedFeatIds) {
    const feat = getFeatById(featId);
    if (feat?.grantedPowerIds) {
      for (const powerId of feat.grantedPowerIds) {
        if (seenIds.has(powerId)) continue;
        const power = getPowerById(powerId);
        if (power && power.keywords.includes('Channel Divinity')) {
          grantedCdPowers.push(power);
          seenIds.add(powerId);
        }
      }
    }
  }

  const allLevel0Powers = [...baseLevel0Powers, ...grantedCdPowers];

  // Split encounter powers into CD (shared resource) vs class feature (individual tracking)
  const encounterPowers    = allLevel0Powers.filter((p) => p.usage === 'encounter');
  const cdEncounterPowers  = encounterPowers.filter((p) => p.keywords.includes('Channel Divinity'));
  const cfEncounterPowers  = encounterPowers.filter((p) => !p.keywords.includes('Channel Divinity'));
  const atWillPowers       = allLevel0Powers.filter((p) => p.usage === 'at-will');

  const hasAtWill = atWillPowers.length > 0;

  type CDTab = 'encounter' | 'at-will';
  const [cdTab, setCdTab] = useState<CDTab>('encounter');

  // Channel Divinity is expended when ANY CD encounter power id is in usedEncounterPowers
  const cdExpended = cdEncounterPowers.some((p) =>
    character.usedEncounterPowers.includes(p.id),
  );

  const patch = async (changes: Partial<typeof character>) => {
    await characterRepository.patch(character.id, changes);
    updateCharacter({ ...character, ...changes });
  };

  const handleUse = async (power: PowerData) => {
    if (cdExpended) return;
    await patch({
      usedEncounterPowers: [...character.usedEncounterPowers, power.id],
    });
  };

  return (
    <div className="space-y-3 p-3">

      {/* Sub-tab bar — only shown when the class has both encounter AND at-will CD powers */}
      {hasAtWill && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex-shrink-0">
          <div className="flex">
            {(['encounter', 'at-will'] as CDTab[]).map((key) => (
              <button
                key={key}
                onClick={() => setCdTab(key)}
                className={[
                  'flex-1 py-2.5 text-sm font-semibold transition-colors',
                  cdTab === key
                    ? 'border-b-2 border-violet-600 text-violet-700'
                    : 'text-stone-500 hover:text-stone-700',
                ].join(' ')}
              >
                {key === 'encounter' ? 'Encounter' : 'At-Will'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Encounter sub-tab ── */}
      {cdTab === 'encounter' && (
        <>
          {/* Header card */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-violet-800">Channel Divinity</p>
              <p className="text-xs text-violet-600 mt-0.5">
                Once per encounter — using any option expends the use.
              </p>
            </div>
            {/* Usage pip */}
            <div className={[
              'w-5 h-5 rounded-full border-2 transition-colors flex-shrink-0',
              cdExpended
                ? 'bg-stone-300 border-stone-400'
                : 'bg-violet-500 border-violet-700',
            ].join(' ')} title={cdExpended ? 'Expended — resets on Short Rest' : 'Available'} />
          </div>

          {/* Channel Divinity encounter power cards */}
          {cdEncounterPowers.map((power) => (
            <EncounterPowerCard
              key={power.id}
              power={power}
              used={character.usedEncounterPowers.includes(power.id)}
              cdExpended={cdExpended}
              onUse={() => handleUse(power)}
              abilityModifiers={abilityMods}
            />
          ))}

          {cdEncounterPowers.length === 0 && cfEncounterPowers.length === 0 && (
            <div className="text-center py-8 text-stone-400 text-sm">
              No encounter powers found.
            </div>
          )}

          {/* Non-CD class feature encounter powers (e.g. Healing Word) */}
          {cfEncounterPowers.length > 0 && (
            <>
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400 font-medium uppercase tracking-wide">Class Features</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              {cfEncounterPowers.map((power) => (
                <ClassFeatureEncounterCard
                  key={power.id}
                  power={power}
                  used={character.usedEncounterPowers.includes(power.id)}
                  abilityModifiers={abilityMods}
                  onUse={async () => {
                    if (character.usedEncounterPowers.includes(power.id)) return;
                    await patch({ usedEncounterPowers: [...character.usedEncounterPowers, power.id] });
                  }}
                />
              ))}
            </>
          )}
        </>
      )}

      {/* ── At-Will sub-tab ── */}
      {cdTab === 'at-will' && (
        <>
          {/* Header card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <p className="text-sm font-bold text-emerald-800">At-Will Class Features</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              Unlimited uses — these powers are always available.
            </p>
          </div>

          {/* At-will power cards */}
          {atWillPowers.map((power) => (
            <AtWillPowerCard key={power.id} power={power} abilityModifiers={abilityMods} />
          ))}

          {atWillPowers.length === 0 && (
            <div className="text-center py-8 text-stone-400 text-sm">
              No at-will Channel Divinity powers found.
            </div>
          )}
        </>
      )}
    </div>
  );
}
