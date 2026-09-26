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
import { getMulticlassId, getFeatById } from '../../data/feats';
import {
  getMcGrantedPowerSlots,
  getMcPowerCandidates,
  type McGrantedPowerSlot,
} from '../../utils/multiclass';
import { getRaceById } from '../../data/races';
import { usesPowerPoints, getMaxPowerPoints, parseAugments, getNonAugmentSpecialText } from '../../utils/psionics';
import { useCharacterDerived } from '../../hooks/useCharacterDerived';
import { ARMOR } from '../../data/equipment/armor';
import { WEAPONS } from '../../data/equipment/weapons';
import { MAGIC_ARMOR } from '../../data/equipment/magicArmor';
import { MAGIC_WEAPONS } from '../../data/equipment/magicWeapons';
import { parseMagicArmorPower } from '../../utils/magicArmorPowers';
import { parseMagicWeaponPower } from '../../utils/magicWeaponPowers';
import { MAGIC_IMPLEMENTS } from '../../data/equipment/magicImplements';
import { parseMagicImplementPower } from '../../utils/magicImplementPowers';
import { MAGIC_ITEMS } from '../../data/equipment/magicItems';
import { parseMagicItemPower } from '../../utils/magicItemPowers';
import { isFullDisciplinePower, extractMovementTechnique } from '../../utils/fullDiscipline';
import { MissingHomebrewPlaceholder, isHomebrew } from '../homebrew/HomebrewBadge';
import { useReadOnly } from './ReadOnlyContext';

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
      // Psionic augmenters (Ardent, Battlemind, Psion) gain a 3rd at-will at level 3
      if (classId && usesPowerPoints(classId) && level >= 3) return baseCount + 1;
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

/** Human-readable recharge, for explaining a multiclass feat's usage override. */
/** Warlock pact display names, for powers carrying a `pact` tag. */
const PACT_LABEL: Record<'infernal' | 'fey' | 'star', string> = {
  infernal: 'Infernal Pact',
  fey: 'Fey Pact',
  star: 'Star Pact',
};

const USAGE_LABEL: Record<PowerUsage, string> = {
  'at-will': 'at-will',
  encounter: 'encounter power',
  daily: 'daily power',
};

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
  const readOnly = useReadOnly();
  const [tab, setTab]           = useState<Tab>('at-will');
  const [showPicker, setShowPicker] = useState(false);
  const [mcPickerSlot, setMcPickerSlot] = useState<McSlot | null>(null);
  const [mcGrantPicker, setMcGrantPicker] = useState<McGrantedPowerSlot | null>(null);
  const [showDilettantePicker, setShowDilettantePicker] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState<string | null>(null);
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const cls       = getClassById(character.classId);
  const isHalfElf = character.raceId === 'half-elf';
  const isHuman   = character.raceId === 'human';
  const isWizard  = character.classId === 'wizard';
  const isPsionic = usesPowerPoints(character.classId);
  const derived = useCharacterDerived(character);
  const abilityMods = derived.abilityModifiers;
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

  // ── Powers granted by the multiclass feat itself ──────────────────────────
  // Distinct from the MC slots above, which come from the power-SWAP feats
  // (Novice/Acolyte/Adept Power). Arcane Initiate and friends hand you a power
  // outright, so these add a slot rather than trading one away — and they do
  // NOT count against any primary power budget.
  const mcGrantedSlots = getMcGrantedPowerSlots(character);

  // Multiclass feat CHOICE slots count toward a tab's "Known x/y", so a feat
  // that owes you a power visibly raises the maximum (0/3 → 0/4) instead of
  // leaving the player hunting for a slot that never appeared — which is
  // exactly how this bug was reported. Fixed grants are excluded: they are
  // auto-granted extras, not slots you fill.
  const mcGrantedChoiceSlots = mcGrantedSlots.filter((s) => !!s.spec.choose);
  const mcGrantedChoiceMax = (tabName: Tab) =>
    mcGrantedChoiceSlots.filter((s) => (s.power ? s.power.usage : s.spec.usage) === tabName).length;
  const mcGrantedChoiceFilled = (tabName: Tab) =>
    mcGrantedChoiceSlots.filter((s) => s.power?.usage === tabName).length;

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
    'at-will':   primaryMax['at-will'] + (isHalfElf ? 1 : 0) + mcGrantedChoiceMax('at-will'),
    'encounter': primaryMax['encounter'] + mcEncounterSlots.length + mcGrantedChoiceMax('encounter'),
    'daily':     primaryMax['daily']     + mcDailySlots.length + mcGrantedChoiceMax('daily'),
    'utility':   maxUtilityForLevel(character.level),
  };

  // ── Cantrips (auto-granted class features, not in selectedPowers) ────────
  const classCantrips = getPowersByClass(character.classId).filter((p) => p.cantrip);

  // ── Warlock pact boon (auto-granted based on chosen pact, not in selectedPowers) ──
  const pactBoonPower = character.classId === 'warlock' && character.warlockPact
    ? getPowersByClass('warlock').find((p) => p.pactBoon === character.warlockPact) ?? null
    : null;

  // ── Monk Flurry of Blows (auto-granted based on chosen monastic tradition) ──
  const monkFlurryPower: PowerData | null = (() => {
    if (character.classId !== 'monk' || !character.monkTradition) return null;
    const flurryId = character.monkTradition === 'centered-breath'
      ? 'monk-centered-flurry-of-blows'
      : 'monk-stone-fist-flurry-of-blows';
    return getPowerById(flurryId) ?? null;
  })();

  // ── Fighter Combat Style power (auto-granted based on combat style choice) ──
  const fighterCombatPower: PowerData | null = (() => {
    if (character.classId !== 'fighter') return null;
    const powerId = character.fighterCombatStyle === 'agility'
      ? 'fighter-combat-agility'
      : 'fighter-combat-challenge';
    return getPowerById(powerId) ?? null;
  })();

  // ── Generic level 0 class powers (covers all classes not handled above) ──
  const genericClassPowers: PowerData[] = (() => {
    const handled = new Set<string>();
    for (const p of classCantrips) handled.add(p.id);
    if (pactBoonPower) handled.add(pactBoonPower.id);
    if (monkFlurryPower) handled.add(monkFlurryPower.id);
    if (fighterCombatPower) handled.add(fighterCombatPower.id);

    const powers: PowerData[] = [];
    const seen = new Set<string>();
    for (const p of getPowersByClass(character.classId)) {
      if (p.level !== 0 || handled.has(p.id) || seen.has(p.id)) continue;
      // Build-specific filtering
      if (p.pactBoon && p.pactBoon !== character.warlockPact) continue;
      if ((p as any).feralMight && (p as any).feralMight !== character.barbarianFeralMight) continue;
      if ((p as any).censure && (p as any).censure !== character.avengerCensure) continue;
      if ((p as any).sorcererSource && (p as any).sorcererSource !== character.sorcererSpellSource) continue;
      powers.push(p);
      seen.add(p.id);
    }
    // Homebrew classPowerIds
    const cls = getClassById(character.classId);
    for (const id of cls?.classPowerIds ?? []) {
      if (!handled.has(id) && !seen.has(id)) {
        const p = getPowerById(id);
        if (p) { powers.push(p); seen.add(id); }
      }
    }
    return powers;
  })();

  // ── Feat-granted powers (e.g. deity Channel Divinity feats) ──────────────
  const featGrantedPowers: PowerData[] = [];
  for (const featId of character.selectedFeatIds) {
    const feat = getFeatById(featId);
    if (feat?.grantedPowerIds) {
      for (const powerId of feat.grantedPowerIds) {
        const p = getPowerById(powerId);
        if (p) featGrantedPowers.push(p);
      }
    }
  }

  // ── Racial powers (auto-granted racial encounter/at-will powers) ─────────
  const racialPowers: PowerData[] = (() => {
    const race = getRaceById(character.raceId);
    const subrace = race?.subraces?.find(sr => sr.id === character.subraceId);
    const powers: PowerData[] = [];
    for (const pid of [...(race?.racialPowerIds ?? []), ...(subrace?.racialPowerIds ?? [])]) {
      const p = getPowerById(pid);
      if (p) powers.push(p);
    }
    return powers;
  })();

  // ── Magic armor powers (from equipped armor/shield with power text) ─────
  const magicArmorPowers: PowerData[] = [];
  for (const item of character.equipment) {
    if (!item.equipped || !item.magicArmorId) continue;
    const baseArmor = ARMOR.find(a => a.id === item.itemId);
    if (!baseArmor) continue;
    const ma = MAGIC_ARMOR.find(m => m.id === item.magicArmorId);
    if (!ma?.power) continue;
    const tier = ma.tiers.find(t => t.level === item.magicArmorTier);
    if (!tier) continue;
    const p = parseMagicArmorPower(ma, tier);
    if (p) magicArmorPowers.push(p);
  }

  // ── Magic weapon powers (from equipped weapons with power text) ──────────
  const magicWeaponPowers: PowerData[] = [];
  for (const item of character.equipment) {
    if (!item.equipped || !item.magicWeaponId) continue;
    const baseWeapon = WEAPONS.find(w => w.id === item.itemId);
    if (!baseWeapon) continue;
    const mw = MAGIC_WEAPONS.find(m => m.id === item.magicWeaponId);
    if (!mw?.power) continue;
    const tier = mw.tiers.find(t => t.level === item.magicWeaponTier);
    if (!tier) continue;
    const p = parseMagicWeaponPower(mw, tier);
    if (p) magicWeaponPowers.push(p);
  }

  // ── Magic implement powers (from equipped implements with power text) ─────
  const magicImplementPowers: PowerData[] = [];
  for (const item of character.equipment) {
    if (!item.equipped || !item.magicImplementId) continue;
    const mi = MAGIC_IMPLEMENTS.find(m => m.id === item.magicImplementId);
    if (!mi?.power) continue;
    const tier = mi.tiers.find(t => t.level === item.magicImplementTier);
    if (!tier) continue;
    const p = parseMagicImplementPower(mi, tier);
    if (p) magicImplementPowers.push(p);
  }

  // ── Magic item powers (from equipped items with power text) ───────────────
  const magicItemPowers: PowerData[] = [];
  for (const item of character.equipment) {
    if (!item.equipped) continue;
    const mi = MAGIC_ITEMS.find(m => m.id === item.itemId);
    if (!mi?.power) continue;
    const tier = mi.tiers.find(t => t.level === item.magicItemTier) ?? mi.tiers[0];
    if (!tier) continue;
    const p = parseMagicItemPower(mi, tier);
    if (p) magicItemPowers.push(p);
  }

  // ── Power categorisation ──────────────────────────────────────────────────
  const selectedIds = character.selectedPowers.map((p) => p.powerId);

  // Detect missing homebrew powers (deleted or unavailable)
  const missingHomebrewPowerIds = character.selectedPowers
    .filter((sp) => isHomebrew(sp.powerId) && !getPowerById(sp.powerId))
    .map((sp) => sp.powerId);

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
    'at-will':   primaryCount('at-will') + dilettanteCount + mcGrantedChoiceFilled('at-will'),
    'encounter': primaryCount('encounter') + mcEncounterPowers.length + mcGrantedChoiceFilled('encounter'),
    'daily':     primaryCount('daily')     + mcDailyPowers.length + mcGrantedChoiceFilled('daily'),
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
    if (readOnly) return;
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

  /**
   * Record the pick for a multiclass feat's "choose a power" grant.
   *
   * Stored in `mcFeatPowerChoices` rather than `selectedPowers` on purpose:
   * the power belongs to the SECONDARY class, so dropping it into
   * selectedPowers would let the greedy slot assignment hand it a primary
   * class power slot and silently eat one of the character's real picks.
   */
  const chooseMcGrantedPower = (powerId: string) => {
    if (!mcGrantPicker) return;
    const prev = character.mcFeatPowerChoices ?? {};
    const replacedId = prev[mcGrantPicker.featId];
    const changes: Partial<Character> = {
      mcFeatPowerChoices: { ...prev, [mcGrantPicker.featId]: powerId },
    };
    // Swapping the choice must not leave the old power's spent-use marker (or
    // its quick-tray pin) behind pointing at a power you no longer have.
    if (replacedId && replacedId !== powerId) {
      changes.usedEncounterPowers = character.usedEncounterPowers.filter((id) => id !== replacedId);
      changes.usedDailyPowers = character.usedDailyPowers.filter((id) => id !== replacedId);
      changes.quickTrayPowerIds = (character.quickTrayPowerIds ?? []).filter((id) => id !== replacedId);
    }
    patch(changes);
    setMcGrantPicker(null);
  };

  const addToQuickTray = (powerId: string) => {
    const tray = character.quickTrayPowerIds ?? [];
    if (tray.includes(powerId)) return;
    patch({ quickTrayPowerIds: [...tray, powerId] });
  };

  const removePower = (powerId: string) => {
    // Also remove from quick tray — including the movement technique variant for Full Discipline powers
    const tray = character.quickTrayPowerIds ?? [];
    const mtId = `${powerId}-mt`;
    const newTray = tray.filter((id) => id !== powerId && id !== mtId);
    patch({
      selectedPowers: character.selectedPowers.filter((p) => p.powerId !== powerId),
      usedEncounterPowers: character.usedEncounterPowers.filter((id) => id !== powerId),
      usedDailyPowers: character.usedDailyPowers.filter((id) => id !== powerId),
      quickTrayPowerIds: newTray,
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
    if (readOnly) return;
    const newPP = Math.max(0, currentPP - cost);
    await patch({ currentPowerPoints: newPP });
  };

  // ── Available powers for primary picker (attack powers, utility excluded) ─
  const nonUtilityTab = (tab === 'at-will' || tab === 'encounter' || tab === 'daily') ? tab : null;
  const availablePowers = nonUtilityTab
    ? getPowersByClassUpToLevel(character.classId, character.level, nonUtilityTab)
        .filter((p) => p.level > 0 && p.powerType !== 'utility' && !p.cantrip && !p.pactBoon && !selectedIds.includes(p.id))
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
          <div className="flex items-center gap-2">
            {(character.quickTrayPowerIds ?? []).includes(sp.powerId) ? (
              <span
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 text-sm leading-none border border-amber-300"
                title="In quick tray"
              >✓</span>
            ) : (
              <button
                onClick={() => addToQuickTray(sp.powerId)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors text-sm leading-none border border-amber-200"
                title="Pin to quick tray"
              >⚡</button>
            )}
            {!readOnly && (confirmingRemove === sp.powerId ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { removePower(sp.powerId); setConfirmingRemove(null); }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold min-h-[44px] min-w-[60px] transition-colors hover:bg-red-700"
                >Yes</button>
                <button
                  onClick={() => setConfirmingRemove(null)}
                  className="px-4 py-2 rounded-lg bg-stone-200 text-stone-700 text-sm font-bold min-h-[44px] min-w-[60px] transition-colors hover:bg-stone-300"
                >No</button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingRemove(sp.powerId)}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold min-h-[44px] border border-stone-200"
              >Remove</button>
            ))}
          </div>
        </div>
        <PowerCard
          power={power}
          used={isUsed}
          onToggleUsed={
            power.usage !== 'at-will' && !readOnly
              ? () => toggleUsed(sp.powerId, power.usage)
              : undefined
          }
          abilityModifiers={abilityMods}
          {...(readOnly ? {} : psionicAugmentProps)}
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
      {!readOnly && (
        <button
          onClick={() => setMcPickerSlot(mcSlot)}
          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex-shrink-0"
        >
          Choose
        </button>
      )}
    </div>
  );

  /**
   * A power granted by the multiclass feat itself — rendered at the recharge
   * the FEAT grants, not the one the source class uses it at. Auto-granted, so
   * there is no remove button; a choice slot gets a Replace button instead.
   */
  const renderMcGrantedSlot = (slot: McGrantedPowerSlot) => {
    if (!slot.power) {
      if (!slot.needsChoice) return null;   // dangling powerId — nothing to show
      return (
        <div
          key={`mc-grant-empty-${slot.key}`}
          className="border-2 border-dashed border-indigo-300 rounded-lg p-4 flex items-center justify-between gap-3 bg-indigo-50/40"
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold text-indigo-700">{slot.spec.label}</p>
            <p className="text-xs text-stone-400 mt-0.5">
              Granted by {slot.featName} · used once per {slot.spec.usage}
            </p>
            {slot.spec.note && (
              <p className="text-[11px] text-stone-400 mt-0.5 italic">{slot.spec.note}</p>
            )}
          </div>
          {!readOnly && (
            <button
              onClick={() => setMcGrantPicker(slot)}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex-shrink-0"
            >
              Choose Power
            </button>
          )}
        </div>
      );
    }

    const power = slot.power;
    // The power as its OWN class knows it — `slot.power` already carries the
    // feat's usage, so the original has to be looked up to compare.
    const sourceUsage = getPowerById(power.id)?.usage;
    const sourceClassName = getClassById(power.classId)?.name;
    const isUsed =
      power.usage === 'encounter'
        ? character.usedEncounterPowers.includes(power.id)
        : power.usage === 'daily'
          ? character.usedDailyPowers.includes(power.id)
          : false;
    const pinned = (character.quickTrayPowerIds ?? []).includes(power.id);

    return (
      <div key={`mc-grant-${slot.key}`}>
        <div className="flex items-center justify-between gap-2 mb-0.5 px-1">
          <span className="text-[10px] font-bold bg-indigo-700 text-white px-1.5 py-0.5 rounded">
            Multiclass · {slot.featName}
          </span>
          <div className="flex items-center gap-1">
            {!readOnly && slot.spec.choose && (
              <button
                onClick={() => setMcGrantPicker(slot)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded transition-colors"
                title="Choose a different power"
              >
                Replace
              </button>
            )}
            {pinned ? (
              <span
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 text-sm leading-none border border-amber-300"
                title="In quick tray"
              >✓</span>
            ) : (
              <button
                onClick={() => addToQuickTray(power.id)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors text-sm leading-none border border-amber-200"
                title="Pin to quick tray"
              >⚡</button>
            )}
          </div>
        </div>
        {/* Say out loud why a wizard AT-WILL is sitting under Encounter.
            Without this the card reads as a misfiled power — which is exactly
            how it was reported. Only shown when the feat's usage differs from
            the one the source class knows the power at. */}
        {sourceUsage && sourceUsage !== power.usage && (
          <p className="text-[11px] text-indigo-700 px-1 mb-0.5">
            {sourceClassName ? `${sourceClassName} ` : ''}
            {USAGE_LABEL[sourceUsage]} · usable once per {power.usage === 'daily' ? 'day' : 'encounter'}
            {/* Pact Initiate: which pact you ended up with is not obvious from
                the power name, and it gates your warlock paragon paths. */}
            {power.pact && ` · ${PACT_LABEL[power.pact]}`}
          </p>
        )}
        {slot.spec.note && (
          <p className="text-[11px] text-stone-400 italic px-1 mb-0.5">{slot.spec.note}</p>
        )}
        <PowerCard
          power={power}
          used={isUsed}
          onToggleUsed={() => toggleUsed(power.id, power.usage)}
          abilityModifiers={abilityMods}
        />
      </div>
    );
  };

  /**
   * One auto-granted power card: source badge, quick-tray pin, and a usage
   * toggle when the power has a recharge to spend.
   *
   * This replaced fourteen near-identical copies of the same markup — one per
   * (source × tab) pair — which had already drifted apart in coverage: feat
   * powers were wired for Encounter only, racial for Encounter/Daily/At-Will,
   * equipment for all but At-Will on armor and weapons. Nothing was visibly
   * broken because every feat power happens to be an encounter power today,
   * but the first daily one would have rendered nowhere. Going through one
   * renderer means a source is wired for every tab or none.
   */
  const renderSourceCard = (power: PowerData, badge: string, badgeClass: string) => {
    const isUsed =
      power.usage === 'encounter'
        ? character.usedEncounterPowers.includes(power.id)
        : power.usage === 'daily'
          ? character.usedDailyPowers.includes(power.id)
          : false;
    const pinned = (character.quickTrayPowerIds ?? []).includes(power.id);
    return (
      <div key={`${badge}-${power.id}`}>
        <div className="flex items-center justify-between mb-0.5 px-1">
          <span className={`text-[10px] font-bold ${badgeClass} text-white px-1.5 py-0.5 rounded`}>
            {badge}
          </span>
          <div className="flex items-center gap-1">
            {pinned ? (
              <span
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 text-sm leading-none border border-amber-300"
                title="In quick tray"
              >✓</span>
            ) : (
              <button
                onClick={() => addToQuickTray(power.id)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors text-sm leading-none border border-amber-200"
                title="Pin to quick tray"
              >⚡</button>
            )}
          </div>
        </div>
        <PowerCard
          power={power}
          used={isUsed}
          onToggleUsed={() => toggleUsed(power.id, power.usage)}
          abilityModifiers={abilityMods}
        />
      </div>
    );
  };

  /**
   * The auto-granted powers for the current tab, bucketed by where they came
   * from. Order is fixed (class → multiclass → feat → racial → equipment) so
   * the sheet reads the same on every character.
   */
  const sourceGroups: {
    key: string;
    label: string;
    labelClass: string;
    ruleClass: string;
    nodes: React.ReactNode[];
  }[] = (() => {
    if (tab === 'utility') return [];
    const forTab = (list: PowerData[]) => list.filter((p) => p.usage === tab);

    // Cantrips, pact boons, Flurry of Blows and the fighter's combat-style
    // power are all level 0 class grants; genericClassPowers deliberately
    // excludes whichever of them this class already handles.
    const classPowers = forTab([
      ...classCantrips,
      ...(pactBoonPower ? [pactBoonPower] : []),
      ...(monkFlurryPower ? [monkFlurryPower] : []),
      ...(fighterCombatPower ? [fighterCombatPower] : []),
      ...genericClassPowers,
    ]);
    const featPowers = forTab(featGrantedPowers);
    const racePowers = forTab(racialPowers);
    const equipmentPowers: { power: PowerData; badge: string; badgeClass: string }[] = [
      ...forTab(magicArmorPowers).map((p) => ({ power: p, badge: 'Armor', badgeClass: 'bg-teal-700' })),
      ...forTab(magicWeaponPowers).map((p) => ({ power: p, badge: 'Weapon', badgeClass: 'bg-orange-700' })),
      ...forTab(magicImplementPowers).map((p) => ({ power: p, badge: 'Implement', badgeClass: 'bg-indigo-700' })),
      ...forTab(magicItemPowers).map((p) => ({ power: p, badge: 'Item', badgeClass: 'bg-cyan-700' })),
    ];
    // Filter on the usage the FEAT grants, not the source power's own — a
    // pending choice has no power yet, so fall back to the spec.
    const mcSlots = mcGrantedSlots.filter(
      (s) => (s.power ? s.power.usage : s.spec.usage) === tab,
    );

    const groups: {
      key: string; label: string; labelClass: string; ruleClass: string; nodes: React.ReactNode[];
    }[] = [];
    if (classPowers.length) groups.push({
      key: 'class', label: 'Class Features',
      labelClass: 'text-teal-700', ruleClass: 'bg-teal-200',
      nodes: classPowers.map((p) => renderSourceCard(p, 'Class', 'bg-teal-700')),
    });
    if (mcSlots.length) groups.push({
      key: 'mc',
      label: secondaryCls ? `Multiclass — ${secondaryCls.name}` : 'Multiclass',
      labelClass: 'text-indigo-700', ruleClass: 'bg-indigo-200',
      nodes: mcSlots.map(renderMcGrantedSlot),
    });
    if (featPowers.length) groups.push({
      key: 'feat', label: 'Feat Powers',
      labelClass: 'text-violet-700', ruleClass: 'bg-violet-200',
      nodes: featPowers.map((p) => renderSourceCard(p, 'Feat', 'bg-violet-700')),
    });
    if (racePowers.length) groups.push({
      key: 'race', label: 'Racial Powers',
      labelClass: 'text-emerald-700', ruleClass: 'bg-emerald-200',
      nodes: racePowers.map((p) => renderSourceCard(p, 'Race', 'bg-emerald-700')),
    });
    if (equipmentPowers.length) groups.push({
      key: 'equip', label: 'Equipment Powers',
      labelClass: 'text-cyan-700', ruleClass: 'bg-cyan-200',
      nodes: equipmentPowers.map((e) => renderSourceCard(e.power, e.badge, e.badgeClass)),
    });
    return groups;
  })();

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
          {!readOnly && !atLimit && pickerPowers.length > 0 && (
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

              {powersForTab.map(({ sp, power }) => {
                if (!power) return null;
                const mt = isFullDisciplinePower(power) ? extractMovementTechnique(power) : null;
                if (!mt) return renderFilledCard(sp, power, `Lvl ${power.level}`);
                return (
                  <div key={`fd-${power.id}`}>
                    {renderFilledCard(sp, power, `Lvl ${power.level}`)}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-0.5 px-1">
                        <span className="text-[10px] font-bold bg-teal-700 text-white px-1.5 py-0.5 rounded">Lvl {power.level}</span>
                        {(character.quickTrayPowerIds ?? []).includes(mt.id) ? (
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 text-sm leading-none border border-amber-300" title="In quick tray">✓</span>
                        ) : (
                          <button onClick={() => addToQuickTray(mt.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors text-sm leading-none border border-amber-200" title="Pin to quick tray">⚡</button>
                        )}
                      </div>
                      <PowerCard power={mt} abilityModifiers={abilityMods} />
                    </div>
                  </div>
                );
              })}
              {!readOnly && primaryCount('at-will') < primaryMax['at-will'] && availablePowers.length > 0 &&
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
                        {!readOnly && (
                          <button
                            onClick={() => setShowDilettantePicker(true)}
                            className="text-[10px] font-semibold px-2 py-1 rounded bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors min-h-[28px]"
                          >
                            Replace
                          </button>
                        )}
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
                      {!readOnly && (
                        <button
                          onClick={() => setShowDilettantePicker(true)}
                          className="text-xs bg-violet-600 hover:bg-violet-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex-shrink-0"
                        >
                          Choose
                        </button>
                      )}
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
              const mt = isFullDisciplinePower(filled.power) ? extractMovementTechnique(filled.power) : null;
              if (!mt) {
                return renderFilledCard(filled.sp, filled.power, `Lvl ${filled.power.level}`);
              }
              const isUsed = filled.power.usage === 'encounter'
                ? character.usedEncounterPowers.includes(filled.sp.powerId)
                : character.usedDailyPowers.includes(filled.sp.powerId);
              return (
                <div key={`fd-${filled.power.id}`}>
                  {renderFilledCard(filled.sp, filled.power, `Lvl ${filled.power.level}`)}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-0.5 px-1">
                      <span className="text-[10px] font-bold bg-teal-700 text-white px-1.5 py-0.5 rounded">Lvl {filled.power.level}</span>
                      {(character.quickTrayPowerIds ?? []).includes(mt.id) ? (
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 text-sm leading-none border border-amber-300" title="In quick tray">✓</span>
                      ) : (
                        <button onClick={() => addToQuickTray(mt.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors text-sm leading-none border border-amber-200" title="Pin to quick tray">⚡</button>
                      )}
                    </div>
                    <PowerCard
                      power={mt}
                      used={isUsed}
                      onToggleUsed={() => toggleUsed(filled.sp.powerId, filled.power!.usage)}
                      abilityModifiers={abilityMods}
                    />
                  </div>
                </div>
              );
            }
            if (readOnly || atLimit || availablePowers.length === 0) return null;
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
            const mt = isFullDisciplinePower(power) ? extractMovementTechnique(power) : null;
            if (!mt) return renderFilledCard(sp, power, `Lvl ${power.level}`);
            const isUsed = power.usage === 'encounter'
              ? character.usedEncounterPowers.includes(sp.powerId)
              : character.usedDailyPowers.includes(sp.powerId);
            return (
              <div key={`fd-${power.id}`}>
                {renderFilledCard(sp, power, `Lvl ${power.level}`)}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-0.5 px-1">
                    <span className="text-[10px] font-bold bg-teal-700 text-white px-1.5 py-0.5 rounded">Lvl {power.level}</span>
                    {(character.quickTrayPowerIds ?? []).includes(mt.id) ? (
                      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 text-sm leading-none border border-amber-300" title="In quick tray">✓</span>
                    ) : (
                      <button onClick={() => addToQuickTray(mt.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors text-sm leading-none border border-amber-200" title="Pin to quick tray">⚡</button>
                    )}
                  </div>
                  <PowerCard power={mt} used={isUsed} onToggleUsed={() => toggleUsed(sp.powerId, power.usage)} abilityModifiers={abilityMods} />
                </div>
              </div>
            );
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


          {/* ── Powers grouped by the source that granted them ───────────────
              Every non-slot power used to render as a bare card in one long
              run: a bard with Arcane Initiate saw Majestic Word, Words of
              Friendship, Skald's Aura and a wizard Magic Missile stacked with
              nothing on screen to say why any of them were there. Each source
              now gets a labelled heading.

              Grouping is by SOURCE. Which TAB a power lands in is still decided
              by how often you may use it, which is not always the usage its own
              class knows it at — Arcane Initiate hands you a wizard at-will and
              rations it to once per encounter, so it belongs under Encounter. */}
          {sourceGroups.map((group) => (
            <div key={group.key} className="space-y-3">
              <div className="flex items-center gap-2 mt-2 px-1">
                <span className={`text-xs font-semibold uppercase tracking-wide ${group.labelClass}`}>
                  {group.label}
                </span>
                <div className={`flex-1 h-px ${group.ruleClass}`} />
              </div>
              {group.nodes}
            </div>
          ))}

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
                    const mt = isFullDisciplinePower(filled.power) ? extractMovementTechnique(filled.power) : null;
                    if (!mt) return renderFilledCard(filled.sp, filled.power, `Lv ${filled.power.level}`, 'bg-blue-700');
                    return (
                      <div key={`fd-${filled.power.id}`}>
                        {renderFilledCard(filled.sp, filled.power, `Lv ${filled.power.level}`, 'bg-blue-700')}
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-0.5 px-1">
                            <span className="text-[10px] font-bold bg-teal-700 text-white px-1.5 py-0.5 rounded">Lv {filled.power.level}</span>
                            {(character.quickTrayPowerIds ?? []).includes(mt.id) ? (
                              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 text-sm leading-none border border-amber-300" title="In quick tray">✓</span>
                            ) : (
                              <button onClick={() => addToQuickTray(mt.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors text-sm leading-none border border-amber-200" title="Pin to quick tray">⚡</button>
                            )}
                          </div>
                          <PowerCard power={mt} abilityModifiers={abilityMods} />
                        </div>
                      </div>
                    );
                  }
                  if (readOnly || atLimit || availableUtilityPowers.length === 0) return null;
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

          {/* Missing homebrew powers — shown on every tab */}
          {missingHomebrewPowerIds.map((id) => (
            <MissingHomebrewPlaceholder
              key={id}
              label="Power"
              onRemove={readOnly ? undefined : () => removePower(id)}
            />
          ))}

        </div>
      </div>

      {/* ── Primary / Utility power picker modal ──────────────────────────────── */}
      {!readOnly && showPicker && pickerPowers.length > 0 && !atLimit && (
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
      {!readOnly && mcPickerSlot && (() => {
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

      {/* ── Multiclass feat granted-power picker ───────────────────────────────── */}
      {!readOnly && mcGrantPicker?.spec.choose && (() => {
        const choose = mcGrantPicker.spec.choose;
        const candidates = getMcPowerCandidates(choose);
        const chosenId = (character.mcFeatPowerChoices ?? {})[mcGrantPicker.featId];
        const sourceCls = getClassById(choose.classId);
        return (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-3 pb-3 sm:pb-0"
            onClick={(e) => { if (e.target === e.currentTarget) setMcGrantPicker(null); }}
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="bg-indigo-800 px-4 py-3 flex items-start justify-between gap-2 flex-shrink-0">
                <div className="min-w-0">
                  <h3 className="text-white font-bold">{mcGrantPicker.spec.label}</h3>
                  <p className="text-indigo-300 text-xs mt-0.5">
                    Granted by {mcGrantPicker.featName} · used once per {mcGrantPicker.spec.usage}
                  </p>
                  {mcGrantPicker.spec.note && (
                    <p className="text-indigo-200 text-[11px] mt-0.5 italic">{mcGrantPicker.spec.note}</p>
                  )}
                </div>
                <button
                  onClick={() => setMcGrantPicker(null)}
                  className="text-indigo-200 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center flex-shrink-0"
                >×</button>
              </div>
              <div className="overflow-y-auto flex-1 p-3 space-y-2">
                {candidates.length === 0 ? (
                  <p className="text-stone-500 text-sm text-center py-8">
                    No eligible {sourceCls?.name ?? choose.classId} powers found.
                  </p>
                ) : candidates.map((power) => (
                  <div key={power.id} className={power.id === chosenId ? 'ring-2 ring-indigo-400 rounded-lg' : ''}>
                    {/* Pact Initiate: the power IS the pact choice, so name the
                        pact on the row rather than making the player know the
                        warlock table by heart. */}
                    {power.pact && (
                      <p className="text-[11px] font-semibold text-indigo-700 px-1 mb-0.5">
                        {PACT_LABEL[power.pact]}
                      </p>
                    )}
                    <PickerRow power={power} onSelect={chooseMcGrantedPower} accentColor="indigo" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Dilettante power picker modal ──────────────────────────────────────── */}
      {!readOnly && showDilettantePicker && isHalfElf && dilettanteClassId && (() => {
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
