import type { Character } from '../../types/character';
import type { RacialTrait } from '../../types/gameData';
import { getRaceById } from '../../data/races';
import { getPowerById } from '../../data/powers';

interface Props {
  character: Character;
}

const ABILITY_LABELS: Record<string, string> = {
  str: 'STR', con: 'CON', dex: 'DEX', int: 'INT', wis: 'WIS', cha: 'CHA',
};

function TraitCard({ trait }: { trait: RacialTrait }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold text-stone-800">{trait.name}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {trait.conditional && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-medium">
              Situational
            </span>
          )}
          {trait.source && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-medium">
              {trait.source}
            </span>
          )}
        </div>
      </div>
      {/* Description */}
      <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{trait.description}</p>
    </div>
  );
}

function RacialPowerCard({ powerId }: { powerId: string }) {
  const power = getPowerById(powerId);
  if (!power) return null;

  const usageColor = power.usage === 'at-will'
    ? 'bg-emerald-700'
    : power.usage === 'encounter'
      ? 'bg-red-700'
      : 'bg-stone-800';

  return (
    <div className={`rounded-xl border border-stone-200 overflow-hidden`}>
      {/* Header bar */}
      <div className={`${usageColor} px-4 py-2 flex items-center justify-between`}>
        <span className="text-sm font-bold text-white">{power.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-medium capitalize">
            {power.usage}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-medium capitalize">
            {power.actionType.replace('-', ' ')}
          </span>
        </div>
      </div>
      {/* Body */}
      <div className="p-4 bg-white space-y-1.5">
        {power.keywords.length > 0 && (
          <p className="text-[10px] text-stone-500 italic">{power.keywords.join(', ')}</p>
        )}
        {power.trigger && (
          <p className="text-xs text-stone-600"><span className="font-semibold">Trigger:</span> {power.trigger}</p>
        )}
        {power.target && (
          <p className="text-xs text-stone-600"><span className="font-semibold">Target:</span> {power.target}</p>
        )}
        {power.attack && (
          <p className="text-xs text-stone-600"><span className="font-semibold">Attack:</span> {power.attack}</p>
        )}
        {power.hit && (
          <p className="text-xs text-stone-600"><span className="font-semibold">Hit:</span> {power.hit}</p>
        )}
        {power.miss && (
          <p className="text-xs text-stone-600"><span className="font-semibold">Miss:</span> {power.miss}</p>
        )}
        {power.effect && (
          <p className="text-xs text-stone-600"><span className="font-semibold">Effect:</span> {power.effect}</p>
        )}
        {power.special && (
          <p className="text-xs text-stone-600"><span className="font-semibold">Special:</span> {power.special}</p>
        )}
      </div>
    </div>
  );
}

export function RacialFeaturesPanel({ character }: Props) {
  const race = getRaceById(character.raceId);
  if (!race) return <p className="p-4 text-stone-400 italic">No race selected.</p>;

  const subrace = race.subraces?.find(sr => sr.id === character.subraceId);

  // Build ability bonus display
  const abilityParts: string[] = [];
  for (const [ab, val] of Object.entries(race.abilityBonuses)) {
    if (val) abilityParts.push(`+${val} ${ABILITY_LABELS[ab] ?? ab.toUpperCase()}`);
  }
  if (subrace) {
    for (const [ab, val] of Object.entries(subrace.abilityBonuses)) {
      if (val) abilityParts.push(`+${val} ${ABILITY_LABELS[ab] ?? ab.toUpperCase()}`);
    }
  }
  if (race.abilityBonusOptions) {
    const opts = race.abilityBonusOptions.options.map(a => ABILITY_LABELS[a] ?? a.toUpperCase()).join(' or ');
    abilityParts.push(`+${race.abilityBonusOptions.amount} ${opts}`);
  }

  // Build skill bonus display
  const allSkillBonuses = [...race.skillBonuses, ...(subrace?.skillBonuses ?? [])];
  const skillParts = allSkillBonuses.map(sb => `+${sb.bonus} ${sb.skillId.charAt(0).toUpperCase() + sb.skillId.slice(1)}`);

  // Collect all traits (race + subrace)
  const raceTraits = race.traits;
  const subraceTraits = subrace?.traits ?? [];

  // Collect all racial power IDs
  const racialPowerIds = [...race.racialPowerIds, ...(subrace?.racialPowerIds ?? [])];

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs text-stone-500 italic">
        Racial features granted by the {subrace ? subrace.name : race.name} race.
      </p>

      {/* Summary card */}
      <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4">
        <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-2">
          Racial Summary
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-700">
          <div><span className="font-semibold text-stone-500">Size:</span> {race.size}</div>
          <div><span className="font-semibold text-stone-500">Speed:</span> {race.speed} squares</div>
          <div><span className="font-semibold text-stone-500">Vision:</span> {race.vision}</div>
          <div><span className="font-semibold text-stone-500">Languages:</span> {race.languages.join(', ')}</div>
          {abilityParts.length > 0 && (
            <div className="col-span-2">
              <span className="font-semibold text-stone-500">Ability Bonuses:</span> {abilityParts.join(', ')}
            </div>
          )}
          {skillParts.length > 0 && (
            <div className="col-span-2">
              <span className="font-semibold text-stone-500">Skill Bonuses:</span> {skillParts.join(', ')}
            </div>
          )}
          {(race.fortitudeBonus || race.reflexBonus || race.willBonus) && (
            <div className="col-span-2">
              <span className="font-semibold text-stone-500">Defense Bonuses:</span>{' '}
              {[
                race.fortitudeBonus ? `+${race.fortitudeBonus} Fort` : '',
                race.reflexBonus ? `+${race.reflexBonus} Ref` : '',
                race.willBonus ? `+${race.willBonus} Will` : '',
              ].filter(Boolean).join(', ')}
            </div>
          )}
          {race.initiativeBonus && (
            <div className="col-span-2">
              <span className="font-semibold text-stone-500">Initiative Bonus:</span> +{race.initiativeBonus}
            </div>
          )}
          {race.surgesPerDayBonus && (
            <div className="col-span-2">
              <span className="font-semibold text-stone-500">Extra Healing Surges:</span> +{race.surgesPerDayBonus}
            </div>
          )}
        </div>
      </div>

      {/* Race traits */}
      {raceTraits.map((trait) => (
        <TraitCard key={trait.name} trait={trait} />
      ))}

      {/* Subrace section */}
      {subrace && subraceTraits.length > 0 && (
        <>
          <div className="pt-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              {subrace.name} Traits
            </p>
          </div>
          {subraceTraits.map((trait) => (
            <TraitCard key={trait.name} trait={trait} />
          ))}
        </>
      )}

      {/* Racial Powers */}
      {racialPowerIds.length > 0 && (
        <>
          <div className="pt-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Racial Powers
            </p>
          </div>
          {racialPowerIds.map((pid) => (
            <RacialPowerCard key={pid} powerId={pid} />
          ))}
        </>
      )}
    </div>
  );
}
