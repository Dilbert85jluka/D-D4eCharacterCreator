import { useState } from 'react';
import type { Character, DerivedStats, Ability, WizardSpellbook } from '../../types/character';
import { getClassById } from '../../data/classes';
import { calculateMaxHp } from '../../utils/hitPoints';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { getPowersByClass, getPowersByClassUpToLevel, getUtilityPowersByClass, getPowerById } from '../../data/powers';
import { FEATS, getFeatById, featMeetsPrerequisites } from '../../data/feats';
import { FEAT_LEVELS } from '../../data/advancement';
import { getParagonPathsForCharacter, getParagonPathById } from '../../data/paragonPaths';
import { getRituals } from '../../data/rituals';
import { isPsionicClass, getMaxPowerPoints } from '../../utils/psionics';
import type { PowerData, FeatData, ParagonPathData, RitualData } from '../../types/gameData';

interface Props {
  character: Character;
  derived: DerivedStats;
  onClose: () => void;
}

interface PowerGain {
  usage: 'encounter' | 'daily' | 'utility' | 'at-will';
  level: number;
  label: string;
  options: PowerData[];
}

/** Returns structured information about what power slots are gained at the new level. */
function getPowerGains(
  classId: string,
  newLevel: number,
  selectedIds: string[],
  spellbookIds: string[] = [],
): PowerGain[] {
  const gains: PowerGain[] = [];
  // Exclude powers already prepared OR already in the spellbook
  const allExcluded = [...new Set([...selectedIds, ...spellbookIds])];
  const cls = getClassById(classId);

  const makeAttackGain = (usage: 'encounter' | 'daily', label: string): PowerGain => ({
    usage,
    level: newLevel,
    label,
    options: getPowersByClass(classId, usage, newLevel)
               .filter((p) => p.powerType !== 'utility' && !allExcluded.includes(p.id)),
  });

  // Psionic classes (encounterPowerCount: 0) don't gain encounter powers — they augment at-wills
  if ([1, 3, 7, 13, 17, 23, 27].includes(newLevel) && (cls?.encounterPowerCount ?? 1) > 0)
    gains.push(makeAttackGain('encounter', `Level ${newLevel} Encounter Power`));

  // Psionic augmenters (Ardent, Battlemind, Psion) gain a new at-will at level 3 (instead of encounter power)
  if (newLevel === 3 && isPsionicClass(classId)) {
    gains.push({
      usage: 'at-will',
      level: newLevel,
      label: 'Level 3 At-Will Attack Power',
      options: getPowersByClass(classId, 'at-will', newLevel)
                 .filter((p) => p.powerType !== 'utility' && !allExcluded.includes(p.id)),
    });
  }
  if ([1, 5, 9, 15, 19, 25, 29].includes(newLevel))
    gains.push(makeAttackGain('daily', `Level ${newLevel} Daily Power`));
  if ([2, 6, 10, 16, 22].includes(newLevel))
    gains.push({
      usage: 'utility',
      level: newLevel,
      label: `Level ${newLevel} Utility Power`,
      options: getUtilityPowersByClass(classId, newLevel).filter((p) => !allExcluded.includes(p.id)),
    });

  return gains;
}

/** Levels that grant +1 to two ability scores. */
const ABILITY_INCREASE_LEVELS = [4, 8, 14, 18, 24, 28];

const ABILITY_BOOST_COUNT = 2; // always +1 to 2 scores

/** Tier milestone messages shown at the bottom of the level-up summary. */
function getTierGains(newLevel: number): string[] {
  const gains: string[] = [];
  if (newLevel === 11) gains.push('⭐ You\'ve reached Paragon Tier! A Paragon Path has been unlocked.');
  if (newLevel === 21) gains.push('🏆 You\'ve reached Epic Tier! Choose an Epic Destiny.');
  return gains;
}

const USAGE_COLOR: Record<PowerGain['usage'], string> = {
  encounter: 'bg-red-700',
  daily:     'bg-gray-800',
  utility:   'bg-amber-700',
  'at-will': 'bg-teal-700',
};

/** Levels at which a wizard gains 2 rituals mastered as a class feature. */
const RITUAL_MASTERY_LEVELS = [5, 11, 15, 21, 25];

const ABILITIES: Ability[] = ['str', 'con', 'dex', 'int', 'wis', 'cha'];
const ABILITY_LABEL: Record<Ability, string> = {
  str: 'STR', con: 'CON', dex: 'DEX', int: 'INT', wis: 'WIS', cha: 'CHA',
};
const ABILITY_NAME: Record<Ability, string> = {
  str: 'Strength', con: 'Constitution', dex: 'Dexterity',
  int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma',
};

export function LevelUpModal({ character, derived, onClose }: Props) {
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);
  const cls      = getClassById(character.classId);
  const newLevel = character.level + 1;
  const hpGain   = cls?.hpPerLevel ?? 5;
  const newMaxHp = calculateMaxHp(
    cls?.hpAtFirstLevel ?? 12,
    cls?.hpPerLevel     ?? 5,
    derived.finalAbilityScores.con,
    newLevel,
  );
  const newCurrentHp = Math.min(character.currentHp + hpGain, newMaxHp);

  const isWizard            = character.classId === 'wizard';
  const psionic             = isPsionicClass(character.classId);
  const hasAbilityIncrease  = ABILITY_INCREASE_LEVELS.includes(newLevel);
  const hasFeat             = FEAT_LEVELS.includes(newLevel);
  const hasParagonChoice    = newLevel === 11;
  const tierGains           = getTierGains(newLevel);
  const hasRitualMasteryGain = isWizard && RITUAL_MASTERY_LEVELS.includes(newLevel);
  const selectedIds         = character.selectedPowers.map((p) => p.powerId);
  const powerGains          = getPowerGains(character.classId, newLevel, selectedIds, character.spellbookPowerIds ?? []);

  // Power picks: for each gain label → array of selected powerIds (max 1 normally, max 2 for wizard daily/utility)
  const [allPicks, setAllPicks] = useState<Record<string, string[]>>({});
  // Wizard ritual mastery picks (up to 2 ritual IDs)
  const [ritualPicks, setRitualPicks] = useState<string[]>([]);
  const [ritualSearch, setRitualSearch] = useState('');
  // Feat pick
  const [selectedFeatId, setSelectedFeatId] = useState('');
  // Paragon path pick (only at level 11)
  const [selectedPathId, setSelectedPathId] = useState(character.paragonPath ?? '');
  // Ability score boosts: ability → number of +1s allocated (0–2, total ≤ ABILITY_BOOST_COUNT)
  const [abilityBoosts, setAbilityBoosts]   = useState<Partial<Record<Ability, number>>>({});
  // Psionic at-will swap (levels 7, 13, 17, 23, 27)
  const [psionSwapOldId, setPsionSwapOldId] = useState('');
  const [psionSwapNewId, setPsionSwapNewId] = useState('');

  // Psionic at-will swap at encounter-power levels (7, 13, 17, 23, 27)
  const psionSwapLevel = psionic && [7, 13, 17, 23, 27].includes(newLevel);
  const currentPsionAtWills = psionSwapLevel
    ? character.selectedPowers
        .map((sp) => getPowerById(sp.powerId))
        .filter((p): p is PowerData => !!p && p.classId === character.classId && p.usage === 'at-will' && p.powerType !== 'utility')
    : [];
  const psionSwapOptions = psionSwapLevel
    ? getPowersByClassUpToLevel(character.classId, newLevel, 'at-will')
        .filter((p) => p.powerType !== 'utility' && p.level > 0 && !selectedIds.includes(p.id) && p.id !== psionSwapOldId)
    : [];

  const togglePick = (gainLabel: string, powerId: string, maxPicks: number) =>
    setAllPicks((prev) => {
      if (!powerId) return { ...prev, [gainLabel]: [] };
      const current = prev[gainLabel] ?? [];
      if (current.includes(powerId)) {
        return { ...prev, [gainLabel]: current.filter((id) => id !== powerId) };
      }
      if (current.length < maxPicks) {
        return { ...prev, [gainLabel]: [...current, powerId] };
      }
      // At limit: drop oldest, add new
      return { ...prev, [gainLabel]: [...current.slice(1), powerId] };
    });

  // Total boosts allocated so far
  const totalBoosts = Object.values(abilityBoosts).reduce((s, v) => s + (v ?? 0), 0);

  const addBoost = (ab: Ability) => {
    if (totalBoosts >= ABILITY_BOOST_COUNT) return;
    setAbilityBoosts((prev) => ({ ...prev, [ab]: (prev[ab] ?? 0) + 1 }));
  };

  const removeBoost = (ab: Ability) => {
    setAbilityBoosts((prev) => {
      const current = prev[ab] ?? 0;
      if (current <= 0) return prev;
      const next = { ...prev, [ab]: current - 1 };
      if (next[ab] === 0) delete next[ab];
      return next;
    });
  };

  // Available paragon paths for this character's class
  const availableParagonPaths = hasParagonChoice
    ? getParagonPathsForCharacter(character.classId, character.raceId)
    : [];
  const selectedPath = selectedPathId ? getParagonPathById(selectedPathId) : undefined;

  // Auto-granted feats from class features (excluded from picker, included in prereq checks)
  const AUTO_GRANTED: Record<string, string[]> = {
    wizard: ['ritual-caster'], cleric: ['ritual-caster'], bard: ['ritual-caster'],
    druid: ['ritual-caster'], invoker: ['ritual-caster'], psion: ['ritual-caster'],
  };
  const autoGrantedIds = AUTO_GRANTED[character.classId] ?? [];
  const allFeatIds = [...character.selectedFeatIds, ...autoGrantedIds];

  // Available feats for this character (not already taken, meets prerequisites)
  const availableFeats = FEATS
    .filter((feat) =>
      !allFeatIds.includes(feat.id) &&
      featMeetsPrerequisites(
        feat,
        character.raceId,
        character.classId,
        character.trainedSkills,
        allFeatIds,
        newLevel,
        undefined,
        character.deity,
      ),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const selectedFeat = selectedFeatId ? getFeatById(selectedFeatId) : undefined;

  const handleConfirm = async () => {
    // Build new selected powers and spellbook for each gain
    const newPowers: Array<{ powerId: string; used: boolean }> = [];
    let newSpellbookPowerIds = [...(character.spellbookPowerIds ?? [])];

    for (const gain of powerGains) {
      const gainPicks = allPicks[gain.label] ?? [];
      const isWizardSpellbookGain = isWizard && (gain.usage === 'daily' || gain.usage === 'utility');

      if (isWizardSpellbookGain) {
        // All picks go to spellbook only — user prepares from Spellbook tab (no auto-prepare)
        newSpellbookPowerIds = [...newSpellbookPowerIds, ...gainPicks]
          .filter((id, i, arr) => arr.indexOf(id) === i);
      } else {
        if (gainPicks[0]) newPowers.push({ powerId: gainPicks[0], used: false });
      }
    }

    // Feat — only apply if this level actually grants a feat
    const newFeatIds = (hasFeat && selectedFeatId)
      ? [...character.selectedFeatIds, selectedFeatId]
      : character.selectedFeatIds;

    // Ability score boosts applied to BASE scores
    const newBaseScores = { ...character.baseAbilityScores };
    for (const [ab, boost] of Object.entries(abilityBoosts) as [Ability, number][]) {
      if (boost) newBaseScores[ab] = (newBaseScores[ab] ?? 10) + boost;
    }

    // Wizard ritual mastery: add picked rituals to legacy flat list
    const newMasteredRitualIds = (isWizard && hasRitualMasteryGain && ritualPicks.length > 0)
      ? [...(character.spellbookMasteredRitualIds ?? []), ...ritualPicks]
          .filter((id, i, arr) => arr.indexOf(id) === i)
      : character.spellbookMasteredRitualIds;

    // ── Update spellbooks (new per-book structure) ─────────────────────────
    // Find which powers/rituals are new (not already in any book)
    let newSpellbooks: WizardSpellbook[] | undefined = character.spellbooks;
    if (isWizard) {
      const existingBookPowerIds = new Set(
        character.spellbooks?.flatMap((b) => b.powerIds) ?? character.spellbookPowerIds ?? [],
      );
      const existingBookRitualIds = new Set(
        character.spellbooks?.flatMap((b) => b.ritualIds) ?? character.spellbookMasteredRitualIds ?? [],
      );

      const addedPowerIds   = newSpellbookPowerIds.filter((id) => !existingBookPowerIds.has(id));
      const addedRitualIds  = (newMasteredRitualIds ?? []).filter((id) => !existingBookRitualIds.has(id));

      if (addedPowerIds.length > 0 || addedRitualIds.length > 0) {
        if (!character.spellbooks || character.spellbooks.length === 0) {
          // No spellbooks yet — create default book with ALL known + new
          newSpellbooks = [{
            id: crypto.randomUUID(),
            name: 'My Spellbook',
            powerIds: newSpellbookPowerIds,
            ritualIds: newMasteredRitualIds ?? [],
          }];
        } else {
          // Add new items to the first book (overflow allowed — user manages via Spellbook tab)
          newSpellbooks = [
            {
              ...character.spellbooks[0],
              powerIds:  [...character.spellbooks[0].powerIds,  ...addedPowerIds],
              ritualIds: [...character.spellbooks[0].ritualIds, ...addedRitualIds],
            },
            ...character.spellbooks.slice(1),
          ];
        }
      }
    }

    // Psionic PP increase — when leveling to an encounter-power level, max PP grows by 2
    const ppPatch: Partial<Character> = {};
    if (psionic) {
      const oldMax = getMaxPowerPoints(character.level);
      const newMax = getMaxPowerPoints(newLevel);
      if (newMax > oldMax) {
        const currentPP = character.currentPowerPoints ?? oldMax;
        ppPatch.currentPowerPoints = currentPP + (newMax - oldMax);
      }
    }

    // Psion at-will swap: replace old at-will with new one
    const basePowers = (psionSwapOldId && psionSwapNewId)
      ? character.selectedPowers.map((sp) =>
          sp.powerId === psionSwapOldId ? { powerId: psionSwapNewId, used: false } : sp,
        )
      : character.selectedPowers;

    const updated: Character = {
      ...character,
      level: newLevel,
      currentHp: newCurrentHp,
      selectedPowers:    [...basePowers, ...newPowers],
      selectedFeatIds:   newFeatIds,
      baseAbilityScores: newBaseScores,
      paragonPath:       selectedPathId || character.paragonPath,
      ...(isWizard ? { spellbookPowerIds: newSpellbookPowerIds } : {}),
      ...(newMasteredRitualIds !== character.spellbookMasteredRitualIds
        ? { spellbookMasteredRitualIds: newMasteredRitualIds }
        : {}),
      ...(newSpellbooks !== character.spellbooks ? { spellbooks: newSpellbooks } : {}),
      ...ppPatch,
    };

    await characterRepository.patch(character.id, {
      level:             newLevel,
      currentHp:         newCurrentHp,
      selectedPowers:    [...basePowers, ...newPowers],
      selectedFeatIds:   updated.selectedFeatIds,
      baseAbilityScores: updated.baseAbilityScores,
      paragonPath:       updated.paragonPath,
      ...(isWizard ? { spellbookPowerIds: newSpellbookPowerIds } : {}),
      ...(newMasteredRitualIds !== character.spellbookMasteredRitualIds
        ? { spellbookMasteredRitualIds: newMasteredRitualIds }
        : {}),
      ...(newSpellbooks !== character.spellbooks ? { spellbooks: newSpellbooks } : {}),
      ...ppPatch,
    });
    updateCharacter(updated);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-4 sm:pb-0"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="bg-emerald-700 px-5 py-4 flex-shrink-0">
          <h2 className="text-white text-xl font-bold">Level Up to {newLevel}!</h2>
          <p className="text-emerald-200 text-sm mt-0.5">
            {character.name} · {cls?.name ?? ''}
          </p>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* ── HP gain ──────────────────────────────────────────────────────── */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide mb-2">Hit Points</p>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm text-stone-600">
                <span className="font-semibold text-stone-800">{character.currentHp}</span>
                <span className="text-stone-400"> / {derived.maxHp} current</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold text-lg">+{hpGain} HP</span>
                <span className="text-stone-400">→</span>
                <span className="font-bold text-stone-800 text-lg">{newCurrentHp} / {newMaxHp}</span>
              </div>
            </div>
          </div>

          {/* ── PP gain (psionic classes) ─────────────────────────────────────── */}
          {psionic && getMaxPowerPoints(newLevel) > getMaxPowerPoints(character.level) && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs text-violet-700 font-semibold uppercase tracking-wide mb-2">Power Points</p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-violet-600 font-bold text-lg">+2 PP</span>
                <span className="text-sm text-stone-600">
                  Max: {getMaxPowerPoints(character.level)} → <span className="font-bold text-violet-800">{getMaxPowerPoints(newLevel)}</span>
                </span>
              </div>
            </div>
          )}

          {/* ── Psion at-will swap (optional, levels 7/13/17/23/27) ──────────── */}
          {psionSwapLevel && currentPsionAtWills.length > 0 && (
            <div className="rounded-xl border border-teal-300 overflow-hidden">
              <div className="bg-teal-700 px-4 py-2">
                <p className="text-white text-sm font-bold">Replace At-Will Power (Optional)</p>
                <p className="text-teal-200 text-xs">You may replace one at-will with another.</p>
              </div>
              <div className="p-4 space-y-3 bg-teal-50/40">
                {/* Which at-will to replace */}
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">Replace:</label>
                  <select
                    value={psionSwapOldId}
                    onChange={(e) => { setPsionSwapOldId(e.target.value); setPsionSwapNewId(''); }}
                    className="w-full border border-teal-300 rounded-lg px-3 py-2.5 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[44px]"
                  >
                    <option value="">— Keep all current at-wills —</option>
                    {currentPsionAtWills.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (Lvl {p.level})</option>
                    ))}
                  </select>
                </div>

                {/* Replacement power */}
                {psionSwapOldId && (
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">With:</label>
                    <select
                      value={psionSwapNewId}
                      onChange={(e) => setPsionSwapNewId(e.target.value)}
                      className="w-full border border-teal-300 rounded-lg px-3 py-2.5 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[44px]"
                    >
                      <option value="">— Choose replacement —</option>
                      {psionSwapOptions.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} (Lvl {p.level})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Skip hint */}
                {psionSwapOldId && (
                  <button
                    onClick={() => { setPsionSwapOldId(''); setPsionSwapNewId(''); }}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Skip — keep current at-wills
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Power picks ───────────────────────────────────────────────────── */}
          {powerGains.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wide">
                New Powers — choose now or from the Powers panel later
              </p>
              {powerGains.map((gain) => {
                const isWizardSpellbookGain = isWizard && (gain.usage === 'daily' || gain.usage === 'utility');
                const gainPicksArr = allPicks[gain.label] ?? [];
                if (isWizardSpellbookGain) {
                  return (
                    <TwoPowerPickSection
                      key={gain.label}
                      gain={gain}
                      picks={gainPicksArr}
                      onToggle={(id) => togglePick(gain.label, id, 2)}
                    />
                  );
                }
                return (
                  <PowerPickSection
                    key={gain.label}
                    gain={gain}
                    currentPick={gainPicksArr[0] ?? ''}
                    onPick={(id) => setAllPicks((prev) => ({ ...prev, [gain.label]: id ? [id] : [] }))}
                  />
                );
              })}
            </div>
          )}

          {/* ── Wizard ritual mastery picker ──────────────────────────────────── */}
          {hasRitualMasteryGain && (
            <RitualPickSection
              existingIds={new Set(character.spellbookMasteredRitualIds ?? [])}
              picks={ritualPicks}
              search={ritualSearch}
              onSearchChange={setRitualSearch}
              onToggle={(id) => setRitualPicks((prev) => {
                if (prev.includes(id)) return prev.filter((x) => x !== id);
                if (prev.length < 2)   return [...prev, id];
                return [...prev.slice(1), id]; // drop oldest, add new
              })}
            />
          )}

          {/* ── Paragon Path picker (level 11 only) ───────────────────────────── */}
          {hasParagonChoice && (
            <ParagonPathPickSection
              availablePaths={availableParagonPaths}
              selectedPath={selectedPath}
              selectedPathId={selectedPathId}
              onSelect={setSelectedPathId}
            />
          )}

          {/* ── Feat picker (only at feat-granting levels per PHB p.29) ──────── */}
          {hasFeat && (
            <FeatPickSection
              availableFeats={availableFeats}
              selectedFeat={selectedFeat}
              selectedFeatId={selectedFeatId}
              onSelect={setSelectedFeatId}
            />
          )}

          {/* ── Ability score boosts ──────────────────────────────────────────── */}
          {hasAbilityIncrease && (
            <AbilityBoostSection
              derived={derived}
              abilityBoosts={abilityBoosts}
              totalBoosts={totalBoosts}
              maxBoosts={ABILITY_BOOST_COUNT}
              onAdd={addBoost}
              onRemove={removeBoost}
            />
          )}

          {/* ── Tier milestones ───────────────────────────────────────────────── */}
          {tierGains.length > 0 && (
            <div>
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wide mb-2">
                Milestone
              </p>
              <ul className="space-y-2">
                {tierGains.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Action buttons ────────────────────────────────────────────────── */}
        <div className="px-5 pb-5 flex gap-3 flex-shrink-0 border-t border-stone-100 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-stone-200 text-stone-600 font-semibold text-sm hover:border-stone-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm transition-colors"
          >
            Confirm Level Up ↑
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Paragon Path picker section ────────────────────────────────────────────────
interface ParagonPathPickSectionProps {
  availablePaths: ParagonPathData[];
  selectedPath: ParagonPathData | undefined;
  selectedPathId: string;
  onSelect: (id: string) => void;
}

function ParagonPathPickSection({
  availablePaths,
  selectedPath,
  selectedPathId,
  onSelect,
}: ParagonPathPickSectionProps) {
  return (
    <div className="rounded-xl border border-amber-300 overflow-hidden">
      {/* Section header */}
      <div className="bg-amber-600 px-4 py-2 flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-bold">⭐ Paragon Path</p>
          <p className="text-amber-100 text-xs">You've reached Paragon Tier — choose your path!</p>
        </div>
        {selectedPath && (
          <span className="text-xs text-white/90 font-semibold bg-amber-700 px-2 py-0.5 rounded-full">
            ✓ {selectedPath.name}
          </span>
        )}
      </div>

      <div className="p-4 space-y-3 bg-amber-50/40">
        {/* Dropdown */}
        <div>
          <select
            value={selectedPathId}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full border border-amber-300 rounded-lg px-3 py-2.5 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
          >
            <option value="">— Choose a Paragon Path —</option>
            {availablePaths.map((path) => (
              <option key={path.id} value={path.id}>{path.name}{path.prerequisite ? ` (${path.prerequisite})` : ''}</option>
            ))}
          </select>
          {availablePaths.length === 0 && (
            <p className="text-xs text-stone-400 mt-1">
              No paragon paths found for your class. You can set one from the character sheet later.
            </p>
          )}
        </div>

        {/* Selected path description */}
        {selectedPath && (
          <div className="bg-white border border-amber-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="font-semibold text-stone-800 text-sm">{selectedPath.name}</p>
              {selectedPath.prerequisite && (
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  Req: {selectedPath.prerequisite}
                </span>
              )}
            </div>
            <p className="text-sm text-stone-700 leading-relaxed">{selectedPath.description}</p>
            <div className="border-t border-amber-100 pt-2">
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">Features &amp; Powers</p>
              <ul className="space-y-1.5">
                {splitFeatures(selectedPath.features).map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-stone-600">
                    <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">⭐</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!selectedPathId && (
          <p className="text-xs text-stone-400">
            Skip for now — choose your Paragon Path from the character sheet later.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Feat picker section ────────────────────────────────────────────────────────
interface FeatPickSectionProps {
  availableFeats: FeatData[];
  selectedFeat: FeatData | undefined;
  selectedFeatId: string;
  onSelect: (id: string) => void;
}

function FeatPickSection({ availableFeats, selectedFeat, selectedFeatId, onSelect }: FeatPickSectionProps) {
  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden">
      {/* Section header */}
      <div className="bg-violet-700 px-4 py-2 flex items-center justify-between">
        <p className="text-white text-sm font-bold">New Feat</p>
        {selectedFeat && (
          <span className="text-xs text-white/80 font-medium">✓ {selectedFeat.name}</span>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Dropdown */}
        <div>
          <select
            value={selectedFeatId}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 min-h-[44px]"
          >
            <option value="">— Choose a feat —</option>
            {availableFeats.map((feat) => (
              <option key={feat.id} value={feat.id}>{feat.name}</option>
            ))}
          </select>
          {availableFeats.length === 0 && (
            <p className="text-xs text-stone-400 mt-1">
              No eligible feats found. You can update feats from the character sheet later.
            </p>
          )}
        </div>

        {/* Selected feat description */}
        {selectedFeat && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 space-y-1.5">
            {/* Prerequisites */}
            {Object.keys(selectedFeat.prerequisites).length > 0 && (
              <p className="text-[11px] text-violet-600 font-medium">
                Req: {[
                  selectedFeat.prerequisites.race?.join(' or '),
                  selectedFeat.prerequisites.class?.join(' or '),
                  selectedFeat.prerequisites.trainedSkill && `Trained in ${selectedFeat.prerequisites.trainedSkill.join(' or ')}`,
                  selectedFeat.prerequisites.abilities &&
                    Object.entries(selectedFeat.prerequisites.abilities)
                      .map(([ab, val]) => `${ab.toUpperCase()} ${val}`)
                      .join(', '),
                  selectedFeat.prerequisites.anyMulticlassFeat && 'Any multiclass feat',
                  selectedFeat.prerequisites.minLevel && `Level ${selectedFeat.prerequisites.minLevel}+`,
                ].filter(Boolean).join(' · ')}
              </p>
            )}
            {/* Benefit */}
            <p className="text-sm text-stone-700">{selectedFeat.benefit}</p>
            {/* Special tag (e.g. "Multiclass: Fighter") */}
            {selectedFeat.special && (
              <p className="text-xs text-violet-700 font-semibold">{selectedFeat.special}</p>
            )}
          </div>
        )}

        {!selectedFeatId && (
          <p className="text-xs text-stone-400">
            Skip for now — add a feat from the Feats panel later.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Ability score boost section ───────────────────────────────────────────────
interface AbilityBoostSectionProps {
  derived: DerivedStats;
  abilityBoosts: Partial<Record<Ability, number>>;
  totalBoosts: number;
  maxBoosts: number;
  onAdd: (ab: Ability) => void;
  onRemove: (ab: Ability) => void;
}

function AbilityBoostSection({
  derived,
  abilityBoosts,
  totalBoosts,
  maxBoosts,
  onAdd,
  onRemove,
}: AbilityBoostSectionProps) {
  const remaining = maxBoosts - totalBoosts;

  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden">
      {/* Section header */}
      <div className="bg-sky-700 px-4 py-2 flex items-center justify-between">
        <p className="text-white text-sm font-bold">Ability Score Increases</p>
        <span className={[
          'text-xs font-bold px-2 py-0.5 rounded-full',
          remaining === 0 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white',
        ].join(' ')}>
          {remaining === 0 ? '✓ All used' : `${remaining} remaining`}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-stone-500 mb-3">
          Add +1 to any two ability scores. Click + to apply, − to undo.
        </p>

        {/* 2-column grid of ability scores */}
        <div className="grid grid-cols-2 gap-2">
          {ABILITIES.map((ab) => {
            const boost      = abilityBoosts[ab] ?? 0;
            const baseScore  = derived.finalAbilityScores[ab];
            const newScore   = baseScore + boost;
            const canAdd     = remaining > 0;
            const canRemove  = boost > 0;

            return (
              <div
                key={ab}
                className={[
                  'flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 border transition-colors',
                  boost > 0
                    ? 'border-sky-300 bg-sky-50'
                    : 'border-stone-200 bg-stone-50',
                ].join(' ')}
              >
                {/* Ability name + score */}
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-stone-500 uppercase leading-none">
                    {ABILITY_LABEL[ab]}
                  </p>
                  <p className="text-xs text-stone-400 leading-none mt-0.5 truncate">
                    {ABILITY_NAME[ab]}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={[
                      'text-lg font-bold leading-none',
                      boost > 0 ? 'text-sky-700' : 'text-stone-800',
                    ].join(' ')}>
                      {newScore}
                    </span>
                    {boost > 0 && (
                      <span className="text-xs text-sky-500 font-semibold">
                        (+{boost})
                      </span>
                    )}
                  </div>
                </div>

                {/* +/− buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => onAdd(ab)}
                    disabled={!canAdd}
                    className={[
                      'w-8 h-8 rounded-lg font-bold text-base flex items-center justify-center transition-colors',
                      canAdd
                        ? 'bg-sky-600 hover:bg-sky-500 text-white'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed',
                    ].join(' ')}
                    title={canAdd ? `+1 to ${ABILITY_NAME[ab]}` : 'No increases remaining'}
                  >+</button>
                  <button
                    onClick={() => onRemove(ab)}
                    disabled={!canRemove}
                    className={[
                      'w-8 h-8 rounded-lg font-bold text-base flex items-center justify-center transition-colors',
                      canRemove
                        ? 'bg-stone-300 hover:bg-stone-400 text-stone-700'
                        : 'bg-stone-100 text-stone-300 cursor-not-allowed',
                    ].join(' ')}
                    title={canRemove ? `Remove +1 from ${ABILITY_NAME[ab]}` : 'Nothing to remove'}
                  >−</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Power pick sub-section ─────────────────────────────────────────────────────
interface PowerPickSectionProps {
  gain: PowerGain;
  currentPick: string;
  onPick: (id: string) => void;
  /** Override the section header label. */
  label?: string;
  /** Override the header background class (e.g. 'bg-teal-700' for spellbook picks). */
  headerColor?: string;
}

function PowerPickSection({ gain, currentPick, onPick, label, headerColor }: PowerPickSectionProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const resolvedHeaderColor = headerColor ?? USAGE_COLOR[gain.usage];
  const displayLabel = label ?? gain.label;
  const options = gain.options;

  if (options.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 overflow-hidden">
        <div className={`${resolvedHeaderColor} px-4 py-2`}>
          <p className="text-white text-sm font-bold">{displayLabel}</p>
        </div>
        <p className="text-xs text-stone-400 px-4 py-3">
          All level {gain.level} {gain.usage} powers already selected, or none exist at this level.
          Add powers from the Powers panel later.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden">
      <div className={`${resolvedHeaderColor} px-4 py-2 flex items-center justify-between`}>
        <p className="text-white text-sm font-bold">{displayLabel}</p>
        {currentPick && <span className="text-xs text-white/80 font-medium">✓ Selected</span>}
      </div>
      <div className="p-3 space-y-2">
        {options.map((power) => {
          const isSelected = currentPick === power.id;
          const isExpanded = expanded === power.id;
          return (
            <div
              key={power.id}
              className={[
                'rounded-lg border-2 overflow-hidden transition-all cursor-pointer',
                isSelected
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-stone-200 bg-stone-50 hover:border-amber-300',
              ].join(' ')}
              onClick={() => onPick(isSelected ? '' : power.id)}
            >
              <div className="flex items-start gap-3 p-3">
                <div className={[
                  'mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                  isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-stone-300',
                ].join(' ')}>
                  {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-stone-800">{power.name}</p>
                    <span className="text-[10px] font-semibold text-stone-500 uppercase">
                      {power.actionType.replace('-', ' ')}
                    </span>
                  </div>
                  {power.keywords.length > 0 && (
                    <p className="text-xs text-stone-400 mt-0.5">{power.keywords.join(' · ')}</p>
                  )}
                  {(power.hit ?? power.effect) && (
                    <p className={['text-xs text-stone-600 mt-1', isExpanded ? '' : 'line-clamp-2'].join(' ')}>
                      <strong>{power.hit ? 'Hit' : 'Effect'}:</strong> {power.hit ?? power.effect}
                    </p>
                  )}
                  {isExpanded && (
                    <div className="mt-2 text-xs space-y-0.5 text-stone-600 border-t border-stone-200 pt-2">
                      {power.trigger  && <p><strong>Trigger:</strong> {power.trigger}</p>}
                      {power.target   && <p><strong>Target:</strong> {power.target}</p>}
                      {power.attack   && <p><strong>Attack:</strong> {power.attack}</p>}
                      {power.miss     && <p><strong className="text-red-600">Miss:</strong> {power.miss}</p>}
                      {power.special  && <p><strong className="text-amber-700">Special:</strong> {power.special}</p>}
                      {power.flavor   && <p className="italic text-stone-400">{power.flavor}</p>}
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : power.id); }}
                    className="text-[10px] text-amber-600 hover:text-amber-700 mt-1 font-medium"
                  >
                    {isExpanded ? '▲ Less' : '▼ Details'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {!currentPick && (
          <p className="text-xs text-stone-400 text-center pt-1">
            Skip for now — choose from the Powers panel later.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Two-power pick section (wizard daily/utility — pick 2 from one list) ───────
interface TwoPowerPickSectionProps {
  gain: PowerGain;
  picks: string[];
  onToggle: (id: string) => void;
}

function TwoPowerPickSection({ gain, picks, onToggle }: TwoPowerPickSectionProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const selectedCount = picks.length;

  if (gain.options.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 overflow-hidden">
        <div className={`${USAGE_COLOR[gain.usage]} px-4 py-2`}>
          <p className="text-white text-sm font-bold">{gain.label}</p>
        </div>
        <p className="text-xs text-stone-400 px-4 py-3">
          No new level {gain.level} {gain.usage} powers available.
          Add powers from the Spellbook tab later.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden">
      <div className={`${USAGE_COLOR[gain.usage]} px-4 py-2 flex items-center justify-between`}>
        <div>
          <p className="text-white text-sm font-bold">{gain.label}</p>
          <p className="text-white/70 text-xs">Pick 2 — both go into your spellbook</p>
        </div>
        <span className={[
          'text-xs font-bold px-2 py-0.5 rounded-full',
          selectedCount >= 2 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white',
        ].join(' ')}>
          {selectedCount}/2
        </span>
      </div>
      <div className="p-3 space-y-2">
        {gain.options.map((power) => {
          const isSelected = picks.includes(power.id);
          const isExpanded = expanded === power.id;
          return (
            <div
              key={power.id}
              className={[
                'rounded-lg border-2 overflow-hidden transition-all cursor-pointer',
                isSelected
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-stone-200 bg-stone-50 hover:border-amber-300',
              ].join(' ')}
              onClick={() => onToggle(power.id)}
            >
              <div className="flex items-start gap-3 p-3">
                <div className={[
                  'mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                  isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-stone-300',
                ].join(' ')}>
                  {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-stone-800">{power.name}</p>
                    <span className="text-[10px] font-semibold text-stone-500 uppercase">
                      {power.actionType.replace('-', ' ')}
                    </span>
                  </div>
                  {power.keywords.length > 0 && (
                    <p className="text-xs text-stone-400 mt-0.5">{power.keywords.join(' · ')}</p>
                  )}
                  {(power.hit ?? power.effect) && (
                    <p className={['text-xs text-stone-600 mt-1', isExpanded ? '' : 'line-clamp-2'].join(' ')}>
                      <strong>{power.hit ? 'Hit' : 'Effect'}:</strong> {power.hit ?? power.effect}
                    </p>
                  )}
                  {isExpanded && (
                    <div className="mt-2 text-xs space-y-0.5 text-stone-600 border-t border-stone-200 pt-2">
                      {power.trigger  && <p><strong>Trigger:</strong> {power.trigger}</p>}
                      {power.target   && <p><strong>Target:</strong> {power.target}</p>}
                      {power.attack   && <p><strong>Attack:</strong> {power.attack}</p>}
                      {power.miss     && <p><strong className="text-red-600">Miss:</strong> {power.miss}</p>}
                      {power.special  && <p><strong className="text-amber-700">Special:</strong> {power.special}</p>}
                      {power.flavor   && <p className="italic text-stone-400">{power.flavor}</p>}
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : power.id); }}
                    className="text-[10px] text-amber-600 hover:text-amber-700 mt-1 font-medium"
                  >
                    {isExpanded ? '▲ Less' : '▼ Details'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {selectedCount < 2 && (
          <p className="text-xs text-stone-400 text-center pt-1">
            {selectedCount === 0
              ? 'Skip for now — add powers from the Spellbook tab later.'
              : 'Select one more power for your spellbook.'}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Ritual mastery pick section (wizard class feature) ────────────────────────
interface RitualPickSectionProps {
  existingIds: Set<string>;
  picks: string[];
  search: string;
  onSearchChange: (v: string) => void;
  onToggle: (id: string) => void;
}

function RitualPickSection({ existingIds, picks, search, onSearchChange, onToggle }: RitualPickSectionProps) {
  const all = getRituals();
  const available = all
    .filter((r) => !existingIds.has(r.id))
    .filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()) || r.keySkill.toLowerCase().includes(search.toLowerCase()));
  const selectedCount = picks.length;

  return (
    <div className="rounded-xl border border-teal-300 overflow-hidden">
      <div className="bg-teal-700 px-4 py-2 flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-bold">📖 Ritual Mastery — Class Feature</p>
          <p className="text-teal-200 text-xs">Pick 2 rituals to master for free</p>
        </div>
        <span className={[
          'text-xs font-bold px-2 py-0.5 rounded-full',
          selectedCount >= 2 ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white',
        ].join(' ')}>
          {selectedCount}/2
        </span>
      </div>
      <div className="p-3 bg-teal-50/40">
        <input
          type="text"
          placeholder="Search rituals…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border border-teal-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        />
        {/* Currently picked rituals */}
        {picks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {picks.map((id) => {
              const r = all.find((x) => x.id === id);
              if (!r) return null;
              return (
                <button
                  key={id}
                  onClick={() => onToggle(id)}
                  className="flex items-center gap-1 text-xs bg-teal-700 text-white px-2 py-1 rounded-full font-medium hover:bg-teal-600 transition-colors"
                >
                  {r.name} <span className="opacity-70">×</span>
                </button>
              );
            })}
          </div>
        )}
        <div className="space-y-1 max-h-52 overflow-y-auto">
          {available.length === 0 && (
            <p className="text-xs text-stone-400 text-center py-3">No rituals match.</p>
          )}
          {available.map((r) => {
            const isSelected = picks.includes(r.id);
            return (
              <button
                key={r.id}
                onClick={() => onToggle(r.id)}
                className={[
                  'w-full text-left px-3 py-2 rounded-lg border transition-colors',
                  isSelected
                    ? 'bg-teal-100 border-teal-400 text-teal-900'
                    : 'bg-white border-stone-200 hover:border-teal-300 hover:bg-teal-50',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-stone-500">Lv {r.level}</span>
                    <span className="text-sm font-semibold text-stone-800">{r.name}</span>
                    <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-medium">{r.category}</span>
                  </div>
                  {isSelected && <span className="text-teal-600 font-bold text-sm flex-shrink-0">✓</span>}
                </div>
                <div className="flex gap-3 text-xs text-stone-400 mt-0.5">
                  <span>{r.keySkill}</span>
                  <span>⏱ {r.castingTime}</span>
                  <span>Cast: {r.componentNote ?? `${r.componentCost} gp`}</span>
                </div>
              </button>
            );
          })}
        </div>
        {selectedCount < 2 && (
          <p className="text-xs text-stone-400 text-center pt-2">
            {selectedCount === 0
              ? 'Skip for now — add rituals from the Spellbook tab later.'
              : 'Select one more ritual.'}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Splits a features string into individual bullet points.
 * Features are separated by ". NAME (L1X):" pattern — split on the period before
 * each capital-letter segment that looks like "FeatureName (L11):".
 */
function splitFeatures(features: string): string[] {
  const parts = features
    .split(/\.\s+(?=[A-Z][^.]*\(L\d+\))/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return features
      .split(/\.\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return parts;
}
