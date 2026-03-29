import { useState } from 'react';
import { useCharacterDerived } from '../../hooks/useCharacterDerived';
import type { Character, PowerUsage } from '../../types/character';
import type { PowerData } from '../../types/gameData';
import { getPowerById, getPowersByClass } from '../../data/powers';
import { getFeatById } from '../../data/feats';
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
import { PowerCard } from '../wizard/shared/PowerCard';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';

interface Props {
  character: Character;
}

type ActionTab = 'standard' | 'minor' | 'move' | 'immediate' | 'free';

const TABS: { key: ActionTab; label: string }[] = [
  { key: 'standard',  label: 'Standard Actions' },
  { key: 'minor',     label: 'Minor Actions'    },
  { key: 'move',      label: 'Move Actions'     },
  { key: 'immediate', label: 'Immediate Action' },
  { key: 'free',      label: 'Free Actions'     },
];

function collectAllPowers(character: Character): PowerData[] {
  const seenIds = new Set<string>();
  const result: PowerData[] = [];

  const add = (p: PowerData) => {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      result.push(p);
    }
  };

  // 1. Selected powers (player-chosen at-wills, encounters, dailies, utilities)
  for (const sp of character.selectedPowers) {
    const p = getPowerById(sp.powerId);
    if (p) {
      add(p);
      // Full Discipline: also add the Movement Technique as a separate power under its action type
      if (isFullDisciplinePower(p)) {
        const mt = extractMovementTechnique(p);
        if (mt) add(mt);
      }
    }
  }

  // 2. Auto-granted level 0 class powers (cantrips, pact boons, CD powers, class features)
  const level0 = getPowersByClass(character.classId).filter((p) => p.level === 0);
  for (const p of level0) {
    if (p.cantrip) {
      add(p);
    } else if (p.pactBoon) {
      if (p.pactBoon === character.warlockPact) add(p);
    } else if (p.id === 'monk-centered-flurry-of-blows') {
      if (character.monkTradition === 'centered-breath') add(p);
    } else if (p.id === 'monk-stone-fist-flurry-of-blows') {
      if (character.monkTradition === 'stone-fist') add(p);
    } else {
      add(p);
    }
  }

  // 3. Half-Elf Dilettante power
  if (character.dilettantePowerId) {
    const dp = getPowerById(character.dilettantePowerId);
    if (dp) add(dp);
  }

  // 4. Feat-granted powers (e.g. deity Channel Divinity feats)
  for (const featId of character.selectedFeatIds) {
    const feat = getFeatById(featId);
    if (feat?.grantedPowerIds) {
      for (const powerId of feat.grantedPowerIds) {
        const p = getPowerById(powerId);
        if (p) add(p);
      }
    }
  }

  // 5. Magic armor powers (from equipped armor/shield with power text)
  for (const item of character.equipment) {
    if (!item.equipped || !item.magicArmorId) continue;
    const isArmor = ARMOR.find(a => a.id === item.itemId);
    if (!isArmor) continue;
    const ma = MAGIC_ARMOR.find(m => m.id === item.magicArmorId);
    if (!ma?.power) continue;
    const tier = ma.tiers.find(t => t.level === item.magicArmorTier);
    if (!tier) continue;
    const p = parseMagicArmorPower(ma, tier);
    if (p) add(p);
  }

  // 6. Magic weapon powers (from equipped weapons with power text)
  for (const item of character.equipment) {
    if (!item.equipped || !item.magicWeaponId) continue;
    const isWeapon = WEAPONS.find(w => w.id === item.itemId);
    if (!isWeapon) continue;
    const mw = MAGIC_WEAPONS.find(m => m.id === item.magicWeaponId);
    if (!mw?.power) continue;
    const tier = mw.tiers.find(t => t.level === item.magicWeaponTier);
    if (!tier) continue;
    const p = parseMagicWeaponPower(mw, tier);
    if (p) add(p);
  }

  // 7. Magic implement powers (from equipped implements with power text)
  for (const item of character.equipment) {
    if (!item.equipped || !item.magicImplementId) continue;
    const mi = MAGIC_IMPLEMENTS.find(m => m.id === item.magicImplementId);
    if (!mi?.power) continue;
    const tier = mi.tiers.find(t => t.level === item.magicImplementTier);
    if (!tier) continue;
    const p = parseMagicImplementPower(mi, tier);
    if (p) add(p);
  }

  // 8. Magic item powers (from equipped items with power text)
  for (const item of character.equipment) {
    if (!item.equipped) continue;
    const mi = MAGIC_ITEMS.find(m => m.id === item.itemId);
    if (!mi?.power) continue;
    const tier = mi.tiers.find(t => t.level === item.magicItemTier) ?? mi.tiers[0];
    if (!tier) continue;
    const p = parseMagicItemPower(mi, tier);
    if (p) add(p);
  }

  return result;
}

function groupByActionTab(powers: PowerData[]): Record<ActionTab, PowerData[]> {
  const groups: Record<ActionTab, PowerData[]> = {
    standard: [],
    minor: [],
    move: [],
    immediate: [],
    free: [],
  };

  for (const p of powers) {
    switch (p.actionType) {
      case 'standard':
        groups.standard.push(p);
        break;
      case 'minor':
        groups.minor.push(p);
        break;
      case 'move':
        groups.move.push(p);
        break;
      case 'immediate-interrupt':
      case 'immediate-reaction':
        groups.immediate.push(p);
        break;
      case 'free':
        groups.free.push(p);
        break;
      case 'opportunity':
      default:
        groups.standard.push(p);
        break;
    }
  }

  // Sort each group: at-will → encounter → daily, then by level
  const usageOrder: Record<string, number> = { 'at-will': 0, encounter: 1, daily: 2 };
  for (const key of Object.keys(groups) as ActionTab[]) {
    groups[key].sort((a, b) => {
      const diff = (usageOrder[a.usage] ?? 9) - (usageOrder[b.usage] ?? 9);
      return diff !== 0 ? diff : a.level - b.level;
    });
  }

  return groups;
}

export function ActionsByTypePanel({ character }: Props) {
  const [activeTab, setActiveTab] = useState<ActionTab>('standard');
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);
  const derived = useCharacterDerived(character);
  const abilityMods = derived.abilityModifiers;

  const allPowers = collectAllPowers(character);
  const grouped = groupByActionTab(allPowers);
  const currentPowers = grouped[activeTab];

  // ── DB helper ──
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

  const isUsed = (power: PowerData): boolean => {
    if (power.usage === 'encounter') return character.usedEncounterPowers.includes(power.id);
    if (power.usage === 'daily') return character.usedDailyPowers.includes(power.id);
    return false;
  };

  const addToQuickTray = async (powerId: string) => {
    const tray = character.quickTrayPowerIds ?? [];
    if (tray.includes(powerId)) return;
    await patch({ quickTrayPowerIds: [...tray, powerId] });
  };

  return (
    <div className="space-y-3">
      {/* Action-type sub-tabs */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="flex">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={[
                'flex-1 py-2.5 text-xs font-semibold transition-colors',
                activeTab === key
                  ? 'border-b-2 border-amber-600 text-amber-700'
                  : 'text-stone-500 hover:text-stone-700',
              ].join(' ')}
            >
              {label}
              {grouped[key].length > 0 && (
                <span className="ml-1 text-[10px] bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded-full">
                  {grouped[key].length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Powers list */}
      <div className="space-y-2">
        {currentPowers.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 px-4 py-8 text-center">
            <p className="text-stone-400 text-sm">
              No {TABS.find((t) => t.key === activeTab)?.label.toLowerCase() ?? 'powers'}
            </p>
          </div>
        ) : (
          currentPowers.map((power) => (
            <div key={power.id}>
              <div className="flex items-center justify-end mb-0.5 px-1">
                {(character.quickTrayPowerIds ?? []).includes(power.id) ? (
                  <span
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs leading-none border border-amber-300"
                    title="In quick tray"
                  >✓</span>
                ) : (
                  <button
                    onClick={() => addToQuickTray(power.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors text-xs leading-none border border-amber-200"
                    title="Pin to quick tray"
                  >⚡</button>
                )}
              </div>
              <PowerCard
                power={power}
                used={isUsed(power)}
                onToggleUsed={() => toggleUsed(power.id, power.usage)}
                abilityModifiers={abilityMods}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
