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
  if (!race) return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Racial Features</h3>
      </div>
      <p className="p-4 text-stone-400 italic">No race selected.</p>
    </div>
  );

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

  // Racial summary rows — each renders as an appearance-style card.
  // Single-value rows use span 1; multi-value rows span both columns.
  const summaryRows: { label: string; value: string; span?: 2 }[] = [
    { label: 'Size',      value: race.size },
    { label: 'Speed',     value: `${race.speed} squares` },
    { label: 'Vision',    value: race.vision },
    { label: 'Languages', value: race.languages.join(', ') },
  ];
  if (abilityParts.length > 0) {
    summaryRows.push({ label: 'Ability Bonuses', value: abilityParts.join(', '), span: 2 });
  }
  if (skillParts.length > 0) {
    summaryRows.push({ label: 'Skill Bonuses', value: skillParts.join(', '), span: 2 });
  }
  if (race.fortitudeBonus || race.reflexBonus || race.willBonus) {
    const parts = [
      race.fortitudeBonus ? `+${race.fortitudeBonus} Fort` : '',
      race.reflexBonus    ? `+${race.reflexBonus} Ref`     : '',
      race.willBonus      ? `+${race.willBonus} Will`      : '',
    ].filter(Boolean).join(', ');
    summaryRows.push({ label: 'Defense Bonuses', value: parts, span: 2 });
  }
  if (race.initiativeBonus) {
    summaryRows.push({ label: 'Initiative Bonus', value: `+${race.initiativeBonus}`, span: 2 });
  }
  if (race.surgesPerDayBonus) {
    summaryRows.push({ label: 'Extra Healing Surges', value: `+${race.surgesPerDayBonus}`, span: 2 });
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Racial Features</h3>
        <p className="text-amber-300 text-xs mt-0.5">Granted by the {subrace ? subrace.name : race.name} race</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Racial Summary — same card grid layout as Profile → Appearance */}
        <div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Racial Summary</p>
          <div className="grid grid-cols-2 gap-2">
            {summaryRows.map(({ label, value, span }) => (
              <div
                key={label}
                className={`bg-stone-50 rounded-lg border border-stone-200 px-3 py-2 ${span === 2 ? 'col-span-2' : ''}`}
              >
                <p className="text-xs text-stone-400 font-semibold">{label}</p>
                <p className="text-sm text-stone-800 font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Race traits */}
        {raceTraits.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">Racial Traits</p>
            {raceTraits.map((trait) => (
              <TraitCard key={trait.name} trait={trait} />
            ))}
          </div>
        )}

        {/* Subrace traits */}
        {subrace && subraceTraits.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">{subrace.name} Traits</p>
            {subraceTraits.map((trait) => (
              <TraitCard key={trait.name} trait={trait} />
            ))}
          </div>
        )}

        {/* Racial Powers */}
        {racialPowerIds.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">Racial Powers</p>
            {racialPowerIds.map((pid) => (
              <RacialPowerCard key={pid} powerId={pid} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
