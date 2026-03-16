import { useState } from 'react';
import type { Character } from '../../types/character';
import { getPowerById, getPowersByClass, getPowersByClassUpToLevel, getUtilityPowersByClassUpToLevel } from '../../data/powers';
import { getAllSpellbookPowerIds } from '../../utils/spellbook';
import { getClassById } from '../../data/classes';
import { PowerCard } from '../wizard/shared/PowerCard';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import type { PowerUsage } from '../../types/character';
import type { PowerData } from '../../types/gameData';
import { getMulticlassId } from '../../data/feats';
import { isPsionicClass, getMaxPowerPoints, parseAugments, getNonAugmentSpecialText } from '../../utils/psionics';

interface Props {
  character: Character;
}

type Tab = 'at-will' | 'encounter' | 'daily' | 'utility';

// ── D&D 4e power counts by character level ────────────────────────────────────
function maxPowersForLevel(
  usage: 'at-will' | 'encounter' | 'daily',
  level: number,
  baseCount: number,
  classId?: string,
): number {
  // Psionic classes have encounterPowerCount: 0 — they augment at-wills instead
  if (baseCount === 0) return 0;
  switch (usage) {
    case 'at-will':
      // Psion gains a 3rd at-will at level 3 (psionic at-will progression)
      if (classId === 'psion' && level >= 3) return baseCount + 1;
      return baseCount;
    case 'encounter':
      if (level >= 27) return 7;
      if (level >= 23) return 6;
      if (level >= 17) return 5;
      if (level >= 13) return 4;
      if (level >= 7)  return 3;
      if (level >= 3)  return 2;
      return 1;
    case 'daily':
      if (level >= 29) return 7;
      if (level >= 25) return 6;
      if (level >= 19) return 5;
      if (level >= 15) return 4;
      if (level >= 9)  return 3;
      if (level >= 5)  return 2;
      return 1;
  }
}

// Levels at which each power type is gained — used to label empty slots
const ENCOUNTER_LEVELS = [1, 3, 7, 13, 17, 23, 27];
const DAILY_LEVELS     = [1, 5, 9, 15, 19, 25, 29];
const UTILITY_LEVELS   = [2, 6, 10, 16, 22];

function getSlotLevels(usage: 'encounter' | 'daily', characterLevel: number): number[] {
  const source = usage === 'encounter' ? ENCOUNTER_LEVELS : DAILY_LEVELS;
  return source.filter((l) => l <= characterLevel);
}

function maxUtilityForLevel(level: number): number {
  if (level >= 22) return 5;
  if (level >= 16) return 4;
  if (level >= 10) return 3;
  if (level >= 6)  return 2;
  if (level >= 2)  return 1;
  return 0;
}

// ── MC slot definitions ────────────────────────────────────────────────────────
interface McSlot {
  key: 'novice' | 'acolyte' | 'adept';
  label: string;
  usage: 'encounter' | 'daily';
  maxLevel: number;
}

export function PowersPanel({ character }: Props) {
  const [tab, setTab]           = useState<Tab>('at-will');
  const [showPicker, setShowPicker] = useState(false);
  const [mcPickerSlot, setMcPickerSlot] = useState<McSlot | null>(null);
  const [showDilettantePicker, setShowDilettantePicker] = useState(false);
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const cls       = getClassById(character.classId);
  const isHalfElf = character.raceId === 'half-elf';
  const isHuman   = character.raceId === 'human';
  const isWizard  = character.classId === 'wizard';
  const isPsionic = isPsionicClass(character.classId);
  const maxPP     = isPsionic ? getMaxPowerPoints(character.level) : 0;
  const currentPP = isPsionic ? (character.currentPowerPoints ?? maxPP) : 0;


  // ── Multiclass detection ──────────────────────────────────────────────────
  const multiclassId = getMulticlassId(character.selectedFeatIds);
  const secondaryCls = multiclassId ? getClassById(multiclassId) : undefined;
  const hasNovice    = character.selectedFeatIds.includes('novice-power');
  const hasAcolyte   = character.selectedFeatIds.includes('acolyte-power');
  const hasAdept     = character.selectedFeatIds.includes('adept-power');

  // ── MC slot definitions ───────────────────────────────────────────────────
  const mcEncounterSlots: McSlot[] = multiclassId ? [
    ...(hasNovice ? [{ key: 'novice' as const, label: 'Novice Power',  usage: 'encounter' as const, maxLevel: 1 }] : []),
    ...(hasAdept  ? [{ key: 'adept'  as const, label: 'Adept Power',   usage: 'encounter' as const, maxLevel: 3 }] : []),
  ] : [];

  const mcDailySlots: McSlot[] = multiclassId && hasAcolyte
    ? [{ key: 'acolyte', label: 'Acolyte Power', usage: 'daily', maxLevel: 1 }]
    : [];

  // ── Dilettante detection (Half-Elf bonus at-will from another class) ──────
  // Prefer stored fields; fall back to heuristic for older characters
  const dilettantePowerId = character.dilettantePowerId
    ?? (isHalfElf
      ? character.selectedPowers.find((sp) => {
          const p = getPowerById(sp.powerId);
          return p && p.usage === 'at-will' && p.classId !== character.classId && p.powerType !== 'utility';
        })?.powerId
      : undefined);
  const dilettanteClassId = character.dilettanteClassId
    ?? (dilettantePowerId ? getPowerById(dilettantePowerId)?.classId : undefined);
  const dilettantePower = dilettantePowerId ? getPowerById(dilettantePowerId) : undefined;
  const dilettanteSourceCls = dilettanteClassId ? getClassById(dilettanteClassId) : undefined;

  // ── Primary power maxCounts (adjusted for power swaps) ────────────────────
  // Half-Elf dilettante slot is NOT included in primary at-will max — it's separate
  const primaryMax = {
    'at-will':   maxPowersForLevel('at-will',   character.level, cls?.atWillPowerCount   ?? 2, character.classId)
                 + (isHuman ? 1 : 0)
                 - (hasNovice  && multiclassId ? 1 : 0),
    'encounter': maxPowersForLevel('encounter', character.level, cls?.encounterPowerCount ?? 1)
                 - (hasAcolyte && multiclassId ? 1 : 0),
    'daily':     maxPowersForLevel('daily',     character.level, cls?.dailyPowerCount     ?? 1)
                 - (hasAdept   && multiclassId ? 1 : 0),
  };

  // Tab totals (primary + MC slots + dilettante)
  const maxCounts: Record<Tab, number> = {
    'at-will':   primaryMax['at-will'] + (isHalfElf ? 1 : 0),
    'encounter': primaryMax['encounter'] + mcEncounterSlots.length,
    'daily':     primaryMax['daily']     + mcDailySlots.length,
    'utility':   maxUtilityForLevel(character.level),
  };

  // ── Cantrips (auto-granted class features, not in selectedPowers) ────────
  const classCantrips = getPowersByClass(character.classId).filter((p) => p.cantrip);

  // ── Warlock pact boon (auto-granted based on chosen pact, not in selectedPowers) ──
  const pactBoonPower = character.classId === 'warlock' && character.warlockPact
    ? getPowersByClass('warlock').find((p) => p.pactBoon === character.warlockPact) ?? null
    : null;

  // ── Power categorisation ──────────────────────────────────────────────────
  const selectedIds = character.selectedPowers.map((p) => p.powerId);

  // Attack powers for the current non-utility tab (primary class only, utility excluded)
  // Dilettante power is handled separately — excluded here
  const powersForTab = tab === 'utility' ? [] : character.selectedPowers
    .map((sp) => ({ sp, power: getPowerById(sp.powerId) }))
    .filter(({ power, sp }) =>
      power?.usage === tab &&
      power.classId === character.classId &&
      power.powerType !== 'utility' &&
      sp.powerId !== dilettantePowerId
    )
    .sort((a, b) => (a.power?.level ?? 0) - (b.power?.level ?? 0));

  // Utility powers for the Utility tab (primary class only)
  const utilityPowersSelected = character.selectedPowers
    .map((sp) => ({ sp, power: getPowerById(sp.powerId) }))
    .filter(({ power }) =>
      power?.powerType === 'utility' &&
      power.classId === character.classId
    )
    .sort((a, b) => (a.power?.level ?? 0) - (b.power?.level ?? 0));

  // Secondary class encounter powers (MC slots — attack powers only)
  const mcEncounterPowers = multiclassId
    ? character.selectedPowers
        .map((sp) => ({ sp, power: getPowerById(sp.powerId) }))
        .filter(({ power }) =>
          power?.usage === 'encounter' &&
          power.classId === multiclassId &&
          power.powerType !== 'utility'
        )
        .sort((a, b) => (a.power?.level ?? 0) - (b.power?.level ?? 0))
    : [];

  // Secondary class daily powers (MC slot — attack powers only)
  const mcDailyPowers = multiclassId
    ? character.selectedPowers
        .map((sp) => ({ sp, power: getPowerById(sp.powerId) }))
        .filter(({ power }) =>
          power?.usage === 'daily' &&
          power.classId === multiclassId &&
          power.powerType !== 'utility'
        )
        .sort((a, b) => (a.power?.level ?? 0) - (b.power?.level ?? 0))
    : [];

  // ── Counts (used for tab pills) ───────────────────────────────────────────
  // Primary count excludes dilettante — that has its own slot
  const primaryCount = (usage: 'at-will' | 'encounter' | 'daily') =>
    character.selectedPowers.filter((sp) => {
      const p = getPowerById(sp.powerId);
      return p?.usage === usage && p.classId === character.classId && p.powerType !== 'utility' && sp.powerId !== dilettantePowerId;
    }).length;
  // Dilettante adds 1 to at-will count if filled
  const dilettanteCount = dilettantePowerId && character.selectedPowers.some((sp) => sp.powerId === dilettantePowerId) ? 1 : 0;

  const utilityCount = utilityPowersSelected.length;

  const counts: Record<Tab, number> = {
    'at-will':   primaryCount('at-will') + dilettanteCount,
    'encounter': primaryCount('encounter') + mcEncounterPowers.length,
    'daily':     primaryCount('daily')     + mcDailyPowers.length,
    'utility':   utilityCount,
  };

  // ── Wizard spellbook "Known" counts (total in spellbook vs prepared) ─────
  const spellbookIds = getAllSpellbookPowerIds(character);
  const spellbookDailyCount = isWizard
    ? spellbookIds.filter((id) => {
        const p = getPowerById(id);
        return p?.usage === 'daily' && p.powerType !== 'utility';
      }).length
    : 0;
  const spellbookUtilityCount = isWizard
    ? spellbookIds.filter((id) => {
        const p = getPowerById(id);
        return p?.powerType === 'utility';
      }).length
    : 0;
  // Wizard daily/utility always show a Known line — use taller tab height
  const tabMinH = isWizard ? 'min-h-[62px]' : 'min-h-[52px]';

  // Wizard: powers in spellbook but NOT currently prepared (not in selectedPowers)
  const wizardKnownNotPreparedDailies: PowerData[] = isWizard
    ? spellbookIds
        .map((id) => getPowerById(id))
        .filter((p): p is PowerData =>
          p != null &&
          p.usage === 'daily' &&
          p.powerType !== 'utility' &&
          !selectedIds.includes(p.id)
        )
    : [];
  const wizardKnownNotPreparedUtilities: PowerData[] = isWizard
    ? spellbookIds
        .map((id) => getPowerById(id))
        .filter((p): p is PowerData =>
          p != null &&
          p.powerType === 'utility' &&
          !selectedIds.includes(p.id)
        )
    : [];

  // For at-will tab, check primary slots only (dilettante has its own slot/picker)
  const atLimit = tab === 'at-will'
    ? primaryCount('at-will') >= primaryMax['at-will']
    : counts[tab] >= maxCounts[tab];

  // ── DB helpers ──────────────────────────────────────────────────────────────
  const patch = async (changes: Partial<Character>) => {
    await characterRepository.patch(character.id, changes);
    updateCharacter({ ...character, ...changes });
  };

  const toggleUsed = async (powerId: string, usage: PowerUsage) => {
    if (usage === 'at-will') return;
    if (usage === 'encounter') {
      const usedEncounterPowers = character.usedEncounterPowers.includes(powerId)
        ? character.usedEncounterPowers.filter((id) => id !== powerId)
        : [...character.usedEncounterPowers, powerId];
      await patch({ usedEncounterPowers });
    } else {
      const usedDailyPowers = character.usedDailyPowers.includes(powerId)
        ? character.usedDailyPowers.filter((id) => id !== powerId)
        : [...character.usedDailyPowers, powerId];
      await patch({ usedDailyPowers });
    }
  };

  const addPower = (powerId: string) => {
    if (character.selectedPowers.some((p) => p.powerId === powerId)) return;
    patch({ selectedPowers: [...character.selectedPowers, { powerId, used: false }] });
    setShowPicker(false);
    setMcPickerSlot(null);
  };

  const removePower = (powerId: string) => {
    patch({
      selectedPowers: character.selectedPowers.filter((p) => p.powerId !== powerId),
      usedEncounterPowers: character.usedEncounterPowers.filter((id) => id !== powerId),
      usedDailyPowers: character.usedDailyPowers.filter((id) => id !== powerId),
    });
  };

  const replaceDilettante = (newPowerId: string) => {
    const newPowers = dilettantePowerId
      ? character.selectedPowers.map((sp) =>
          sp.powerId === dilettantePowerId ? { powerId: newPowerId, used: false } : sp
        )
      : [...character.selectedPowers, { powerId: newPowerId, used: false }];
    patch({
      selectedPowers: newPowers,
      dilettantePowerId: newPowerId,
    });
    setShowDilettantePicker(false);
  };

  /** Spend PP for a psionic augment. Each click just deducts the cost. */
  const spendAugment = async (cost: number) => {
    const newPP = Math.max(0, currentPP - cost);
    await patch({ currentPowerPoints: newPP });
  };

  // ── Available powers for primary picker (attack powers, utility excluded) ─
  const nonUtilityTab = (tab === 'at-will' || tab === 'encounter' || tab === 'daily') ? tab : null;
  const availablePowers = nonUtilityTab
    ? getPowersByClassUpToLevel(character.classId, character.level, nonUtilityTab)
        .filter((p) => p.powerType !== 'utility' && !selectedIds.includes(p.id))
    : [];

  // ── Available utility powers (for utility tab picker) ─────────────────────
  const availableUtilityPowers = getUtilityPowersByClassUpToLevel(character.classId, character.level)
    .filter((p) => !selectedIds.includes(p.id));

  // ── Unified picker power list (switches based on active tab) ──────────────
  const pickerPowers = tab === 'utility' ? availableUtilityPowers : availablePowers;
  const pickerByLevel = new Map<number, PowerData[]>();
  for (const p of pickerPowers) {
    if (!pickerByLevel.has(p.level)) pickerByLevel.set(p.level, []);
    pickerByLevel.get(p.level)!.push(p);
  }
  const pickerSortedLevels = Array.from(pickerByLevel.keys()).sort((a, b) => a - b);

  // ── Slot levels for primary slots ─────────────────────────────────────────
  const slotLevels = (tab === 'encounter' || tab === 'daily')
    ? getSlotLevels(tab, character.level)
    : [];

  // Greedy level-based slot assignment
  const slotAssignment = (() => {
    const map = new Map<number, typeof powersForTab[0] | undefined>();
    const usedIds = new Set<string>();
    for (const slotLvl of slotLevels) {
      const match = powersForTab.find(
        ({ sp, power }) => !usedIds.has(sp.powerId) && (power?.level ?? 0) <= slotLvl,
      );
      map.set(slotLvl, match);
      if (match) usedIds.add(match.sp.powerId);
    }
    return map;
  })();

  const assignedPowerIds = new Set(
    [...slotAssignment.values()].filter(Boolean).map((entry) => entry!.sp.powerId),
  );
  const unassignedPowers = powersForTab.filter(
    ({ sp }) => !assignedPowerIds.has(sp.powerId),
  );

  // Greedy assignment for MC encounter slots
  const mcEncounterAssignment = (() => {
    const map = new Map<string, typeof mcEncounterPowers[0] | undefined>();
    const usedIds = new Set<string>();
    for (const mcSlot of mcEncounterSlots) {
      const match = mcEncounterPowers.find(
        ({ sp, power }) => !usedIds.has(sp.powerId) && (power?.level ?? 0) <= mcSlot.maxLevel,
      );
      map.set(mcSlot.key, match);
      if (match) usedIds.add(match.sp.powerId);
    }
    return map;
  })();

  // ── Available powers for MC picker (attack only) ──────────────────────────
  const getMcAvailablePowers = (slot: McSlot): PowerData[] => {
    if (!multiclassId) return [];
    return getPowersByClassUpToLevel(multiclassId, slot.maxLevel, slot.usage)
      .filter((p) => p.powerType !== 'utility' && !selectedIds.includes(p.id));
  };

  // ── Tab config ──────────────────────────────────────────────────────────────
  const allTabs: { key: Tab; label: string }[] = [
    { key: 'at-will',   label: 'At-Will'  },
    // Hide Encounter tab for psionic classes (encounterPowerCount: 0) — they augment at-wills instead
    ...(maxCounts['encounter'] > 0 ? [{ key: 'encounter' as Tab, label: 'Encounter' }] : []),
    { key: 'daily',     label: 'Daily'     },
    { key: 'utility',   label: 'Utility'   },
  ];

  const countPillClass = (key: Tab, isCurrent: boolean) => {
    const c = counts[key];
    const m = maxCounts[key];
    if (isCurrent) {
      if (c >= m) return 'bg-emerald-100 text-emerald-700';
      if (c > 0)  return 'bg-amber-100 text-amber-700';
      return 'bg-red-100 text-red-600';
    }
    if (c >= m) return 'text-emerald-400';
    if (c > 0)  return 'text-amber-300';
    return 'text-red-300';
  };

  // ── Render helpers ──────────────────────────────────────────────────────────
  const renderFilledCard = (
    sp: { powerId: string; used: boolean },
    power: PowerData,
    slotLabel: string,
    badgeColor: string = 'bg-stone-700',
  ) => {
    const isUsed =
      power.usage === 'encounter'
        ? character.usedEncounterPowers.includes(sp.powerId)
        : power.usage === 'daily'
          ? character.usedDailyPowers.includes(sp.powerId)
          : false;

    // Psionic augment props — only for psionic at-will attack powers with augment text
    const psionicAugmentProps = isPsionic && power.usage === 'at-will' && power.special
      ? (() => {
          const options = parseAugments(power.special);
          if (options.length === 0) return {};
          return {
            augmentOptions: options,
            currentPowerPoints: currentPP,
            nonAugmentSpecialText: getNonAugmentSpecialText(power.special),
            onSpendAugment: (cost: number) => spendAugment(cost),
          };
        })()
      : {};

    return (
      <div key={sp.powerId}>
        {/* Slot label + remove button sit above the card — no overlap with card header badges */}
        <div className="flex items-center justify-between mb-0.5 px-1">
          <span className={`text-[10px] font-bold ${badgeColor} text-white px-1.5 py-0.5 rounded`}>
            {slotLabel}
          </span>
          <button
            onClick={() => removePower(sp.powerId)}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-100 text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors text-sm leading-none border border-stone-200"
            title="Remove power"
          >×</button>
        </div>
        <PowerCard
          power={power}
          used={isUsed}
          onToggleUsed={
            power.usage !== 'at-will'
              ? () => toggleUsed(sp.powerId, power.usage)
              : undefined
          }
          {...psionicAugmentProps}
        />
      </div>
    );
  };

  const renderMcEmptySlot = (mcSlot: McSlot) => (
    <div
      key={`mc-empty-${mcSlot.key}`}
      className="border-2 border-dashed border-indigo-300 rounded-lg p-4 flex items-center justify-between bg-indigo-50/40"
    >
      <div>
        <p className="text-xs font-semibold text-indigo-700">
          {mcSlot.label} — {secondaryCls?.name ?? 'Secondary Class'} {mcSlot.usage} power
        </p>
        <p className="text-xs text-stone-400 mt-0.5">
          Level ≤ {mcSlot.maxLevel} · Secondary class slot
        </p>
      </div>
      <button
        onClick={() => setMcPickerSlot(mcSlot)}
        className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex-shrink-0"
      >
        Choose
      </button>
    </div>
  );

  // ── Spellbook-only (known, not prepared) card ─────────────────────────────
  const renderSpellbookCard = (power: PowerData) => (
    <div key={power.id} className="relative opacity-55 pointer-events-none">
      <div className="absolute top-2 right-2 z-10">
        <span className="text-[10px] font-bold bg-teal-700 text-white px-1.5 py-0.5 rounded">
          📖 Not Prepared
        </span>
      </div>
      <PowerCard power={power} />
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {/* Panel header */}
        <div className="bg-amber-800 px-4 py-2 flex items-center justify-between">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide">Powers</h3>
          {!atLimit && pickerPowers.length > 0 && (
            <button
              onClick={() => setShowPicker(true)}
              className="text-xs px-2 py-1 rounded bg-amber-600 text-white hover:bg-amber-500 font-semibold transition-colors min-h-[30px]"
            >
              + Add Power
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          {allTabs.map(({ key, label }) => {
            const isCurrent = tab === key;
            const c = counts[key];
            const m = maxCounts[key];
            const knownCount = key === 'daily' ? spellbookDailyCount : key === 'utility' ? spellbookUtilityCount : 0;
            const showKnown  = isWizard && (key === 'daily' || key === 'utility');
            // Label in the c/m pill:
            //   Wizard daily/utility  → "Prepared"  (they can have more known than prepared)
            //   Everything else       → "Known"
            const pillLabel = (isWizard && (key === 'daily' || key === 'utility'))
              ? 'Prepared'
              : 'Known';
            return (
              <button
                key={key}
                onClick={() => { setTab(key); setShowPicker(false); setMcPickerSlot(null); }}
                className={[
                  'flex-1 py-2 flex flex-col items-center gap-0.5 text-xs font-semibold transition-colors',
                  tabMinH,
                  isCurrent
                    ? 'border-b-2 border-amber-600 text-amber-700'
                    : 'text-stone-500 hover:text-stone-700',
                ].join(' ')}
              >
                <span>{label}</span>
                <span className={['text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap', countPillClass(key, isCurrent)].join(' ')}>
                  {pillLabel}: {c}/{m}
                </span>
                {showKnown && (
                  <span className={[
                    'text-[10px] font-semibold leading-none',
                    isCurrent ? 'text-teal-600' : 'text-teal-400',
                  ].join(' ')}>
                    Known: {knownCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Power cards */}
        <div className="p-3 space-y-3">

          {/* At-will */}
          {tab === 'at-will' && (
            <>
              {/* Cantrips — auto-granted wizard class features, no remove button */}
              {classCantrips.map((power) => (
                <PowerCard key={power.id} power={power} />
              ))}
              {/* Pact Boon — auto-granted warlock class feature, no remove button */}
              {pactBoonPower && <PowerCard power={pactBoonPower} />}
              {powersForTab.map(({ sp, power }) => {
                if (!power) return null;
                return renderFilledCard(sp, power, `Lvl ${power.level}`);
              })}
              {primaryCount('at-will') < primaryMax['at-will'] && availablePowers.length > 0 &&
                Array.from({ length: primaryMax['at-will'] - primaryCount('at-will') }).map((_, i) => (
                  <div
                    key={`at-will-empty-${i}`}
                    className="border-2 border-dashed border-amber-200 rounded-lg p-4 flex items-center justify-between bg-amber-50/40"
                  >
                    <div>
                      <p className="text-xs font-semibold text-amber-700">At-Will power</p>
                      <p className="text-xs text-stone-400 mt-0.5">No power chosen — tap to pick one</p>
                    </div>
                    <button
                      onClick={() => setShowPicker(true)}
                      className="text-xs bg-amber-600 hover:bg-amber-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
                    >
                      Choose
                    </button>
                  </div>
                ))
              }

              {/* Half-Elf Dilettante — separate slot with source class badge */}
              {isHalfElf && (
                <>
                  <div className="flex items-center gap-2 mt-2 mb-1 px-1">
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                      Dilettante — {dilettanteSourceCls?.name ?? 'Other Class'}
                    </span>
                    <div className="flex-1 h-px bg-amber-200" />
                  </div>
                  {dilettantePower && dilettantePowerId && character.selectedPowers.some((sp) => sp.powerId === dilettantePowerId) ? (
                    <div>
                      <div className="flex items-center justify-between mb-0.5 px-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold bg-stone-700 text-white px-1.5 py-0.5 rounded">
                            Lvl {dilettantePower.level}
                          </span>
                          <span className="text-[10px] font-bold bg-violet-700 text-white px-1.5 py-0.5 rounded">
                            {dilettanteSourceCls?.name ?? 'Other Class'}
                          </span>
                        </div>
                        <button
                          onClick={() => setShowDilettantePicker(true)}
                          className="text-[10px] font-semibold px-2 py-1 rounded bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors min-h-[28px]"
                        >
                          Replace
                        </button>
                      </div>
                      <PowerCard power={dilettantePower} />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-violet-300 rounded-lg p-4 flex items-center justify-between bg-violet-50/40">
                      <div>
                        <p className="text-xs font-semibold text-violet-700">
                          Dilettante at-will — {dilettanteSourceCls?.name ?? 'another class'}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">Level 1 at-will from {dilettanteSourceCls?.name ?? 'another class'}</p>
                      </div>
                      <button
                        onClick={() => setShowDilettantePicker(true)}
                        className="text-xs bg-violet-600 hover:bg-violet-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex-shrink-0"
                      >
                        Choose
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Encounter / Daily: primary slots */}
          {(tab === 'encounter' || tab === 'daily') && slotLevels.map((slotLvl) => {
            const filled = slotAssignment.get(slotLvl);
            if (filled?.power) {
              return renderFilledCard(filled.sp, filled.power, `Lvl ${filled.power.level}`);
            }
            if (atLimit || availablePowers.length === 0) return null;
            return (
              <div
                key={`empty-${slotLvl}`}
                className="border-2 border-dashed border-amber-200 rounded-lg p-4 flex items-center justify-between bg-amber-50/40"
              >
                <div>
                  <p className="text-xs font-semibold text-amber-700">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} power
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">No power chosen — tap to pick one</p>
                </div>
                <button
                  onClick={() => setShowPicker(true)}
                  className="text-xs text-white font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px] bg-amber-600 hover:bg-amber-500"
                >
                  Choose
                </button>
              </div>
            );
          })}

          {/* Overflow primary powers */}
          {(tab === 'encounter' || tab === 'daily') && unassignedPowers.map(({ sp, power }) => {
            if (!power) return null;
            return renderFilledCard(sp, power, `Lvl ${power.level}`);
          })}

          {/* MC encounter slots */}
          {tab === 'encounter' && mcEncounterSlots.map((mcSlot) => {
            const filled = mcEncounterAssignment.get(mcSlot.key);
            if (filled?.power) {
              return renderFilledCard(
                filled.sp, filled.power,
                `${secondaryCls?.name ?? 'MC'} Lvl ${filled.power.level}`,
                'bg-indigo-700',
              );
            }
            return renderMcEmptySlot(mcSlot);
          })}

          {/* MC daily slot */}
          {tab === 'daily' && mcDailySlots.map((mcSlot) => {
            const filled = mcDailyPowers[0];
            if (filled?.power) {
              return renderFilledCard(
                filled.sp, filled.power,
                `${secondaryCls?.name ?? 'MC'} Lvl ${filled.power.level}`,
                'bg-indigo-700',
              );
            }
            return renderMcEmptySlot(mcSlot);
          })}

          {/* Wizard: known daily powers that are not currently prepared */}
          {tab === 'daily' && wizardKnownNotPreparedDailies.length > 0 && (
            <>
              <div className="flex items-center gap-2 mt-1 mb-1 px-1">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Known — Not Prepared</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              {wizardKnownNotPreparedDailies.map(renderSpellbookCard)}
            </>
          )}

          {/* Utility powers */}
          {tab === 'utility' && (() => {
            const utilitySlotLevels = UTILITY_LEVELS.filter((l) => l <= character.level);
            const maxUtility = maxUtilityForLevel(character.level);

            if (maxUtility === 0) {
              return (
                <p className="text-center text-stone-400 text-sm py-8">
                  Utility powers are gained starting at level 2.
                </p>
              );
            }

            // Greedy slot assignment for utility
            const utilityAssignment = new Map<number, typeof utilityPowersSelected[0] | undefined>();
            const usedUtilityIds = new Set<string>();
            for (const slotLvl of utilitySlotLevels) {
              const match = utilityPowersSelected.find(
                ({ sp, power }) => !usedUtilityIds.has(sp.powerId) && (power?.level ?? 0) <= slotLvl,
              );
              utilityAssignment.set(slotLvl, match);
              if (match) usedUtilityIds.add(match.sp.powerId);
            }
            const assignedUtilityIds = new Set(
              [...utilityAssignment.values()].filter(Boolean).map((e) => e!.sp.powerId),
            );
            const unassignedUtility = utilityPowersSelected.filter(
              ({ sp }) => !assignedUtilityIds.has(sp.powerId),
            );

            return (
              <>
                {utilitySlotLevels.map((slotLvl) => {
                  const filled = utilityAssignment.get(slotLvl);
                  if (filled?.power) {
                    return renderFilledCard(filled.sp, filled.power, `Lv ${filled.power.level}`, 'bg-blue-700');
                  }
                  if (atLimit || availableUtilityPowers.length === 0) return null;
                  return (
                    <div
                      key={`utility-empty-${slotLvl}`}
                      className="border-2 border-dashed border-blue-200 rounded-lg p-4 flex items-center justify-between bg-blue-50/40"
                    >
                      <div>
                        <p className="text-xs font-semibold text-blue-700">Level {slotLvl} Utility power</p>
                        <p className="text-xs text-stone-400 mt-0.5">No power chosen — tap to pick one</p>
                      </div>
                      <button
                        onClick={() => setShowPicker(true)}
                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
                      >
                        Choose
                      </button>
                    </div>
                  );
                })}
                {unassignedUtility.map(({ sp, power }) => {
                  if (!power) return null;
                  return renderFilledCard(sp, power, `Lv ${power.level}`, 'bg-blue-700');
                })}
                {/* Wizard: known utility powers that are not currently prepared */}
                {wizardKnownNotPreparedUtilities.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 mt-1 mb-1 px-1">
                      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Known — Not Prepared</span>
                      <div className="flex-1 h-px bg-stone-200" />
                    </div>
                    {wizardKnownNotPreparedUtilities.map(renderSpellbookCard)}
                  </>
                )}
              </>
            );
          })()}

        </div>
      </div>

      {/* ── Primary / Utility power picker modal ──────────────────────────────── */}
      {showPicker && pickerPowers.length > 0 && !atLimit && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-3 pb-3 sm:pb-0"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPicker(false); }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className={`${tab === 'utility' ? 'bg-blue-800' : 'bg-amber-800'} px-4 py-3 flex items-center justify-between flex-shrink-0`}>
              <div>
                <h3 className="text-white font-bold">
                  Choose {tab === 'at-will' ? 'At-Will' : tab === 'utility' ? 'Utility' : tab.charAt(0).toUpperCase() + tab.slice(1)} Power
                </h3>
                <p className={`${tab === 'utility' ? 'text-blue-300' : 'text-amber-300'} text-xs mt-0.5`}>
                  {(() => {
                    const rem = tab === 'at-will'
                      ? primaryMax['at-will'] - primaryCount('at-will')
                      : maxCounts[tab] - counts[tab];
                    return `${rem} slot${rem !== 1 ? 's' : ''} remaining`;
                  })()}
                  {' · '}Up to level {character.level} powers shown
                </p>
              </div>
              <button
                onClick={() => setShowPicker(false)}
                className={`${tab === 'utility' ? 'text-blue-200' : 'text-amber-200'} hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center`}
              >×</button>
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-4">
              {pickerSortedLevels.map((lvl) => {
                const powersAtLevel = pickerByLevel.get(lvl) ?? [];
                return (
                  <div key={lvl}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                        Level {lvl} Powers
                      </span>
                      <div className="flex-1 h-px bg-stone-200" />
                    </div>
                    <div className="space-y-2">
                      {powersAtLevel.map((power) => (
                        <PickerRow
                          key={power.id}
                          power={power}
                          onSelect={addPower}
                          accentColor={tab === 'utility' ? 'blue' : 'amber'}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MC power picker modal ────────────────────────────────────────────── */}
      {mcPickerSlot && (() => {
        const mcAvailable = getMcAvailablePowers(mcPickerSlot);
        const mcByLevel = new Map<number, PowerData[]>();
        for (const p of mcAvailable) {
          if (!mcByLevel.has(p.level)) mcByLevel.set(p.level, []);
          mcByLevel.get(p.level)!.push(p);
        }
        const mcSortedLevels = Array.from(mcByLevel.keys()).sort((a, b) => a - b);

        return (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-3 pb-3 sm:pb-0"
            onClick={(e) => { if (e.target === e.currentTarget) setMcPickerSlot(null); }}
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="bg-indigo-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="text-white font-bold">
                    Choose {secondaryCls?.name ?? 'Secondary'} {mcPickerSlot.usage.charAt(0).toUpperCase() + mcPickerSlot.usage.slice(1)} Power
                  </h3>
                  <p className="text-indigo-300 text-xs mt-0.5">
                    {mcPickerSlot.label} · Secondary class · Level ≤ {mcPickerSlot.maxLevel}
                  </p>
                </div>
                <button
                  onClick={() => setMcPickerSlot(null)}
                  className="text-indigo-200 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
                >×</button>
              </div>
              <div className="overflow-y-auto flex-1 p-3 space-y-4">
                {mcAvailable.length === 0 ? (
                  <p className="text-stone-500 text-sm text-center py-8">
                    No {mcPickerSlot.usage} powers available at level ≤ {mcPickerSlot.maxLevel} for {secondaryCls?.name ?? 'secondary class'}.
                  </p>
                ) : mcSortedLevels.map((lvl) => {
                  const powersAtLevel = mcByLevel.get(lvl) ?? [];
                  return (
                    <div key={lvl}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                          Level {lvl} Powers
                        </span>
                        <div className="flex-1 h-px bg-stone-200" />
                      </div>
                      <div className="space-y-2">
                        {powersAtLevel.map((power) => (
                          <PickerRow key={power.id} power={power} onSelect={addPower} accentColor="indigo" />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Dilettante power picker modal ──────────────────────────────────────── */}
      {showDilettantePicker && isHalfElf && dilettanteClassId && (() => {
        const dilAvailable = getPowersByClass(dilettanteClassId, 'at-will', 1)
          .filter((p) => !p.cantrip && !p.pactBoon && p.id !== dilettantePowerId);
        return (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-3 pb-3 sm:pb-0"
            onClick={(e) => { if (e.target === e.currentTarget) setShowDilettantePicker(false); }}
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="bg-violet-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="text-white font-bold">
                    Replace Dilettante Power
                  </h3>
                  <p className="text-violet-300 text-xs mt-0.5">
                    Level 1 at-will from {dilettanteSourceCls?.name ?? 'another class'}
                  </p>
                </div>
                <button
                  onClick={() => setShowDilettantePicker(false)}
                  className="text-violet-200 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
                >×</button>
              </div>
              <div className="overflow-y-auto flex-1 p-3 space-y-2">
                {dilAvailable.length === 0 ? (
                  <p className="text-stone-500 text-sm text-center py-8">
                    No other level 1 at-will powers available for {dilettanteSourceCls?.name ?? 'this class'}.
                  </p>
                ) : dilAvailable.map((power) => (
                  <PickerRow key={power.id} power={power} onSelect={replaceDilettante} accentColor="violet" />
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

// ── Picker row with expand/collapse ───────────────────────────────────────────
function PickerRow({
  power,
  onSelect,
  accentColor = 'amber',
}: {
  power: PowerData;
  onSelect: (id: string) => void;
  accentColor?: 'amber' | 'indigo' | 'blue' | 'violet';
}) {
  const [expanded, setExpanded] = useState(false);
  const btnClass =
    accentColor === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
    : accentColor === 'blue'  ? 'bg-blue-600 hover:bg-blue-500 text-white'
    : accentColor === 'violet' ? 'bg-violet-600 hover:bg-violet-500 text-white'
    : 'bg-amber-600 hover:bg-amber-500 text-white';
  const toggleClass =
    accentColor === 'indigo' ? 'text-indigo-600 hover:text-indigo-700'
    : accentColor === 'blue'  ? 'text-blue-600 hover:text-blue-700'
    : accentColor === 'violet' ? 'text-violet-600 hover:text-violet-700'
    : 'text-amber-600 hover:text-amber-700';

  return (
    <div className="bg-stone-50 rounded-lg border border-stone-200 overflow-hidden">
      <div className="flex items-start gap-3 p-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-semibold text-stone-800">{power.name}</p>
            {power.powerType === 'utility' && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Utility</span>
            )}
          </div>
          {power.keywords.length > 0 && (
            <p className="text-xs text-stone-400 mt-0.5">{power.keywords.join(' · ')}</p>
          )}
          {!expanded && (power.hit ?? power.effect) && (
            <p className="text-xs text-stone-600 mt-1 line-clamp-2">
              <strong>{power.hit ? 'Hit' : 'Effect'}:</strong>{' '}
              {power.hit ?? power.effect}
            </p>
          )}
          {expanded && (
            <div className="mt-2 text-xs space-y-1 text-stone-600 border-t border-stone-100 pt-2">
              {power.trigger     && <p><strong>Trigger:</strong> {power.trigger}</p>}
              {power.target      && <p><strong>Target:</strong> {power.target}</p>}
              {power.requirement && <p><strong>Requirement:</strong> {power.requirement}</p>}
              {power.attack      && <p><strong>Attack:</strong> {power.attack}</p>}
              {power.hit         && <p><strong className="text-emerald-700">Hit:</strong> {power.hit}</p>}
              {power.miss        && <p><strong className="text-red-600">Miss:</strong> {power.miss}</p>}
              {power.effect      && <p><strong className="text-blue-700">Effect:</strong> {power.effect}</p>}
              {power.special     && <p><strong className="text-amber-700">Special:</strong> {power.special}</p>}
              {power.flavor      && <p className="italic text-stone-400">{power.flavor}</p>}
            </div>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`text-[10px] mt-1.5 font-medium ${toggleClass}`}
          >
            {expanded ? '▲ Less' : '▼ Full details'}
          </button>
        </div>
        <button
          onClick={() => onSelect(power.id)}
          className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px] mt-1 ${btnClass}`}
        >
          Select
        </button>
      </div>
    </div>
  );
}
