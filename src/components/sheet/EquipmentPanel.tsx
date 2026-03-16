import { useState } from 'react';
import type { Character, DerivedStats, EquipmentItem } from '../../types/character';
import type { WeaponData, ArmorData, GearData, MagicItemData, ConsumableData } from '../../types/gameData';
import { WEAPONS } from '../../data/equipment/weapons';
import { ARMOR } from '../../data/equipment/armor';
import { GEAR } from '../../data/equipment/gear';
import { MAGIC_ITEMS } from '../../data/equipment/magicItems';
import { CONSUMABLES } from '../../data/equipment/consumables';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';

interface Props {
  character: Character;
  derived: DerivedStats;
}

type SectionTab = 'weapons' | 'armor' | 'magic' | 'consumables' | 'gear';

const SECTION_LABELS: Record<SectionTab, string> = {
  weapons: 'Weapons', armor: 'Armor', magic: 'Magic', consumables: 'Consumables', gear: 'Gear',
};

const SLOT_LABELS: Record<string, string> = {
  head: 'Head', neck: 'Neck', arms: 'Arms', hands: 'Hands',
  ring: 'Ring', waist: 'Waist', feet: 'Feet',
  implement: 'Implement', wondrous: 'Wondrous',
};

/** Stable unique key for an inventory row — uses instanceId if present, falls back to itemId */
const itemKey = (e: EquipmentItem) => e.instanceId ?? e.itemId;

export function EquipmentPanel({ character, derived }: Props) {
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);
  const [activeSection, setActiveSection] = useState<SectionTab>('weapons');
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<SectionTab>('weapons');
  const [search, setSearch] = useState('');
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  const patch = async (changes: Partial<Character>) => {
    await characterRepository.patch(character.id, changes);
    updateCharacter({ ...character, ...changes });
  };

  // ── Equip / Unequip ──────────────────────────────────────────────────────
  const toggleEquip = (key: string) => {
    patch({
      equipment: character.equipment.map((e) =>
        itemKey(e) === key ? { ...e, equipped: !e.equipped } : e,
      ),
    });
  };

  // ── Remove ───────────────────────────────────────────────────────────────
  const removeItem = (key: string) => {
    patch({ equipment: character.equipment.filter((e) => itemKey(e) !== key) });
  };

  // ── Use Consumable ────────────────────────────────────────────────────────
  const useConsumable = (item: EquipmentItem, consumable: ConsumableData) => {
    const newQty = item.quantity - 1;
    let newHp = character.currentHp;
    let newSurges = character.currentSurges;

    if (consumable.healType === 'surge' && newSurges > 0) {
      newSurges -= 1;
      newHp = Math.min(derived.maxHp, newHp + derived.healingSurgeValue + (consumable.healBonus ?? 0));
    } else if (consumable.healType === 'flat' && consumable.healBonus) {
      newHp = Math.min(derived.maxHp, newHp + consumable.healBonus);
    }

    const newEquipment = newQty <= 0
      ? character.equipment.filter((e) => itemKey(e) !== itemKey(item))
      : character.equipment.map((e) =>
          itemKey(e) === itemKey(item) ? { ...e, quantity: newQty } : e,
        );

    patch({ equipment: newEquipment, currentHp: newHp, currentSurges: newSurges });
  };

  // ── Add helpers ───────────────────────────────────────────────────────────
  const addWeapon = (w: WeaponData) => {
    const newItem: EquipmentItem = {
      instanceId: crypto.randomUUID(),
      itemId: w.id, name: w.name, quantity: 1, equipped: false, slot: 'main-hand',
    };
    patch({ equipment: [...character.equipment, newItem] });
  };

  const addArmor = (a: ArmorData) => {
    const slot = a.type === 'Shield' ? 'off-hand' : 'body';
    const newItem: EquipmentItem = {
      instanceId: crypto.randomUUID(),
      itemId: a.id, name: a.name, quantity: 1, equipped: false, slot,
    };
    patch({ equipment: [...character.equipment, newItem] });
  };

  const addMagicItem = (m: MagicItemData) => {
    const newItem: EquipmentItem = {
      instanceId: crypto.randomUUID(),
      itemId: m.id, name: m.name, quantity: 1, equipped: false, slot: m.slot,
    };
    patch({ equipment: [...character.equipment, newItem] });
  };

  const addConsumable = (c: ConsumableData) => {
    const existing = character.equipment.find((e) => e.itemId === c.id);
    if (existing) {
      patch({
        equipment: character.equipment.map((e) =>
          e.itemId === c.id ? { ...e, quantity: e.quantity + 1 } : e,
        ),
      });
    } else {
      const newItem: EquipmentItem = { itemId: c.id, name: c.name, quantity: 1, equipped: false };
      patch({ equipment: [...character.equipment, newItem] });
    }
  };

  const addGear = (g: GearData) => {
    const existing = character.equipment.find((e) => e.itemId === g.id);
    if (existing) {
      patch({
        equipment: character.equipment.map((e) =>
          e.itemId === g.id ? { ...e, quantity: e.quantity + 1 } : e,
        ),
      });
    } else {
      const newItem: EquipmentItem = { itemId: g.id, name: g.name, quantity: 1, equipped: false };
      patch({ equipment: [...character.equipment, newItem] });
    }
  };

  const decrementGear = (item: EquipmentItem) => {
    const newQty = item.quantity - 1;
    if (newQty <= 0) {
      patch({ equipment: character.equipment.filter((e) => itemKey(e) !== itemKey(item)) });
    } else {
      patch({
        equipment: character.equipment.map((e) =>
          itemKey(e) === itemKey(item) ? { ...e, quantity: newQty } : e,
        ),
      });
    }
  };

  const openPicker = (tab: SectionTab) => {
    setPickerTab(tab);
    setSearch('');
    setShowPicker(true);
  };

  const switchSection = (tab: SectionTab) => {
    setActiveSection(tab);
    setPendingRemove(null); // cancel any pending confirm when switching tabs
  };

  // ── D&D 4e slot validation ────────────────────────────────────────────────
  const isTwoHanded = (weaponId: string) =>
    WEAPONS.find((w) => w.id === weaponId)?.properties.includes('Two-handed') ?? false;

  const canEquip = (key: string): { allowed: boolean; reason?: string } => {
    const item = character.equipment.find((e) => itemKey(e) === key);
    if (!item) return { allowed: false };
    if (item.equipped) return { allowed: true }; // unequip is always allowed

    // ── Weapons ──────────────────────────────────────────────────────────
    if (WEAPONS.some((w) => w.id === item.itemId)) {
      const equippedWeapons = character.equipment.filter(
        (e) => e.equipped && WEAPONS.some((w) => w.id === e.itemId),
      );
      const mainIsTwoHanded = equippedWeapons.some((e) => isTwoHanded(e.itemId));
      if (mainIsTwoHanded)
        return { allowed: false, reason: 'Unequip your two-handed weapon first' };
      if (isTwoHanded(item.itemId)) {
        if (equippedWeapons.length > 0)
          return { allowed: false, reason: 'Unequip all weapons before equipping a two-handed weapon' };
        const hasShield = character.equipment.some(
          (e) => e.equipped && ARMOR.some((a) => a.id === e.itemId && a.type === 'Shield'),
        );
        if (hasShield)
          return { allowed: false, reason: 'Cannot use a two-handed weapon with a shield' };
      }
      if (equippedWeapons.length >= 2)
        return { allowed: false, reason: 'Already wielding 2 weapons — unequip one first' };
      return { allowed: true };
    }

    // ── Armor / Shield ────────────────────────────────────────────────────
    const armorDef = ARMOR.find((a) => a.id === item.itemId);
    if (armorDef) {
      if (armorDef.type === 'Shield') {
        const hasShield = character.equipment.some(
          (e) => e.equipped && itemKey(e) !== key && ARMOR.some((a) => a.id === e.itemId && a.type === 'Shield'),
        );
        if (hasShield) return { allowed: false, reason: 'Only one shield can be equipped' };
        const hasTwoHanded = character.equipment.some(
          (e) => e.equipped && isTwoHanded(e.itemId),
        );
        if (hasTwoHanded)
          return { allowed: false, reason: 'Cannot use a shield with a two-handed weapon' };
      } else {
        const hasBodyArmor = character.equipment.some(
          (e) => e.equipped && itemKey(e) !== key &&
            ARMOR.some((a) => a.id === e.itemId && a.type !== 'Shield'),
        );
        if (hasBodyArmor) return { allowed: false, reason: 'Only one armor can be equipped — unequip the current one first' };
      }
      return { allowed: true };
    }

    // ── Magic items ───────────────────────────────────────────────────────
    const magicDef = MAGIC_ITEMS.find((m) => m.id === item.itemId);
    if (magicDef) {
      if (magicDef.slot === 'wondrous') return { allowed: true };
      const limit = magicDef.slot === 'ring' ? 2 : 1;
      const occupied = character.equipment.filter(
        (e) => e.equipped && itemKey(e) !== key &&
          MAGIC_ITEMS.some((m) => m.id === e.itemId && m.slot === magicDef.slot),
      ).length;
      if (occupied >= limit) {
        const label = SLOT_LABELS[magicDef.slot] ?? magicDef.slot;
        return {
          allowed: false,
          reason: limit === 1
            ? `Already wearing a ${label} item — unequip it first`
            : `Already wearing ${limit} ${label} items`,
        };
      }
    }
    return { allowed: true };
  };

  // ── Magic item bonus summary string ──────────────────────────────────────
  const magicBonusSummary = (m: MagicItemData): string | null => {
    if (!m.bonuses) return null;
    const parts: string[] = [];
    if (m.bonuses.ac)                parts.push(`+${m.bonuses.ac} AC`);
    if (m.bonuses.fortitude)         parts.push(`+${m.bonuses.fortitude} Fort`);
    if (m.bonuses.reflex)            parts.push(`+${m.bonuses.reflex} Ref`);
    if (m.bonuses.will)              parts.push(`+${m.bonuses.will} Will`);
    if (m.bonuses.initiative)        parts.push(`+${m.bonuses.initiative} Init`);
    if (m.bonuses.speed)             parts.push(`+${m.bonuses.speed} Spd`);
    if (m.bonuses.healingSurgeBonus) parts.push(`+${m.bonuses.healingSurgeBonus} Surge HP`);
    if (m.bonuses.surgesPerDay)      parts.push(`+${m.bonuses.surgesPerDay} Surges/day`);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  // ── Categorise current inventory ─────────────────────────────────────────
  const weapons         = character.equipment.filter((e) => WEAPONS.find((w) => w.id === e.itemId));
  const armorItems      = character.equipment.filter((e) => ARMOR.find((a) => a.id === e.itemId));
  const magicItems      = character.equipment.filter((e) => MAGIC_ITEMS.find((m) => m.id === e.itemId));
  const consumableItems = character.equipment.filter((e) => CONSUMABLES.find((c) => c.id === e.itemId));
  const gearItems       = character.equipment.filter(
    (e) =>
      !WEAPONS.find((w) => w.id === e.itemId) &&
      !ARMOR.find((a) => a.id === e.itemId) &&
      !MAGIC_ITEMS.find((m) => m.id === e.itemId) &&
      !CONSUMABLES.find((c) => c.id === e.itemId),
  );

  const sectionCounts: Record<SectionTab, number> = {
    weapons: weapons.length,
    armor: armorItems.length,
    magic: magicItems.length,
    consumables: consumableItems.length,
    gear: gearItems.length,
  };

  // Count owned instances by itemId (for picker badge)
  const ownedCount = (id: string) => character.equipment.filter((e) => e.itemId === id).length;

  // ── Filtered picker lists ────────────────────────────────────────────────
  const q = search.trim().toLowerCase();
  const filteredWeapons     = WEAPONS.filter((w) => !q || w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q));
  const filteredArmor       = ARMOR.filter((a) => !q || a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
  const filteredMagic       = MAGIC_ITEMS.filter((m) => !q || m.name.toLowerCase().includes(q) || m.slot.toLowerCase().includes(q) || m.properties.toLowerCase().includes(q));
  const filteredConsumables = CONSUMABLES.filter((c) => !q || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.effect.toLowerCase().includes(q));
  const filteredGear        = GEAR.filter((g) => !q || g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));

  // ── Shared UI helpers ─────────────────────────────────────────────────────
  const equipBtnCls = (equipped: boolean) =>
    [
      'flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-lg transition-colors min-h-[36px]',
      equipped
        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
        : 'bg-white border border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-700',
    ].join(' ');

  const blockedBtnCls =
    'flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-lg min-h-[36px] bg-stone-100 text-stone-400 cursor-not-allowed';

  const removeBtnCls =
    'text-stone-300 hover:text-red-500 transition-colors text-xl leading-none flex-shrink-0 w-7 h-7 flex items-center justify-center rounded hover:bg-red-50';

  const addPickerBtnCls =
    'flex-shrink-0 text-xs bg-amber-600 hover:bg-amber-500 text-white font-semibold px-3 py-2 rounded-lg transition-colors min-h-[36px]';

  // Inline remove-confirmation controls
  const RemoveConfirm = ({ itemK, name }: { itemK: string; name: string }) =>
    pendingRemove === itemK ? (
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs text-red-600 font-medium whitespace-nowrap">Remove?</span>
        <button
          onClick={() => { removeItem(itemK); setPendingRemove(null); }}
          className="text-xs bg-red-500 hover:bg-red-600 text-white font-semibold px-2.5 py-1.5 rounded-lg min-h-[36px] transition-colors"
        >Yes</button>
        <button
          onClick={() => setPendingRemove(null)}
          className="text-xs border border-stone-300 text-stone-600 hover:border-stone-400 font-semibold px-2.5 py-1.5 rounded-lg min-h-[36px] transition-colors"
        >No</button>
      </div>
    ) : (
      <button
        onClick={() => setPendingRemove(itemK)}
        className={removeBtnCls}
        title={`Remove ${name} from inventory`}
      >×</button>
    );

  // Empty state for a section
  const EmptySection = ({ tab }: { tab: SectionTab }) => (
    <div className="text-center py-10">
      <p className="text-stone-400 text-sm mb-3">No {SECTION_LABELS[tab].toLowerCase()} in your inventory.</p>
      <button
        onClick={() => openPicker(tab)}
        className="text-xs bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        + Add {SECTION_LABELS[tab]}
      </button>
    </div>
  );

  return (
    <>
      {/* ── Main panel ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">

        {/* Panel header */}
        <div className="bg-amber-800 px-4 py-2 flex items-center justify-between">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide">Equipment</h3>
          <button
            onClick={() => openPicker(activeSection)}
            className="text-xs px-2 py-1 rounded bg-amber-600 text-white hover:bg-amber-500 font-semibold transition-colors min-h-[30px]"
          >
            + Add {SECTION_LABELS[activeSection]}
          </button>
        </div>

        {/* Sub-tab bar */}
        <div className="flex overflow-x-auto border-b border-stone-200 bg-stone-50">
          {(['weapons', 'armor', 'magic', 'consumables', 'gear'] as SectionTab[]).map((tab) => {
            const count = sectionCounts[tab];
            return (
              <button
                key={tab}
                onClick={() => switchSection(tab)}
                className={[
                  'flex-shrink-0 px-3 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5',
                  activeSection === tab
                    ? 'border-b-2 border-amber-600 text-amber-700 bg-white'
                    : 'text-stone-500 hover:text-stone-700',
                ].join(' ')}
              >
                {SECTION_LABELS[tab]}
                {count > 0 && (
                  <span className={[
                    'text-xs px-1.5 py-0.5 rounded-full font-bold leading-none',
                    activeSection === tab
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-stone-200 text-stone-500',
                  ].join(' ')}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Section content ── */}

        {/* Weapons */}
        {activeSection === 'weapons' && (
          weapons.length === 0
            ? <EmptySection tab="weapons" />
            : <div className="divide-y divide-stone-100">
                {weapons.map((item) => {
                  const w = WEAPONS.find((wp) => wp.id === item.itemId);
                  if (!w) return null;
                  const key = itemKey(item);
                  return (
                    <div key={key} className={`px-4 py-3 flex items-center gap-2 ${item.equipped ? 'bg-white' : 'bg-stone-50'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold text-sm ${item.equipped ? 'text-stone-800' : 'text-stone-500'}`}>{w.name}</span>
                          {item.equipped && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">Equipped</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-stone-400">{w.category}</span>
                          <span className="text-xs text-stone-500 font-medium">{w.damage} · Prof +{w.proficiencyBonus}</span>
                          {w.range && <span className="text-xs text-stone-400">Range {w.range}</span>}
                        </div>
                      </div>
                      {pendingRemove !== key && (() => {
                        const check = canEquip(key);
                        const blocked = !item.equipped && !check.allowed;
                        return (
                          <button
                            onClick={() => !blocked && toggleEquip(key)}
                            disabled={blocked}
                            className={blocked ? blockedBtnCls : equipBtnCls(item.equipped)}
                            title={blocked ? check.reason : undefined}
                          >
                            {item.equipped ? 'Unequip' : 'Equip'}
                          </button>
                        );
                      })()}
                      <RemoveConfirm itemK={key} name={w.name} />
                    </div>
                  );
                })}
              </div>
        )}

        {/* Armor & Shields */}
        {activeSection === 'armor' && (
          armorItems.length === 0
            ? <EmptySection tab="armor" />
            : <div className="divide-y divide-stone-100">
                {armorItems.map((item) => {
                  const a = ARMOR.find((ar) => ar.id === item.itemId);
                  if (!a) return null;
                  const isShield = a.type === 'Shield';
                  const key = itemKey(item);
                  return (
                    <div key={key} className={`px-4 py-3 flex items-center gap-2 ${item.equipped ? 'bg-white' : 'bg-stone-50'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold text-sm ${item.equipped ? 'text-stone-800' : 'text-stone-500'}`}>{a.name}</span>
                          {item.equipped && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">Equipped</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-stone-400">{isShield ? 'Shield' : `${a.type} Armor`}</span>
                          <span className="text-xs text-stone-500 font-medium">AC +{a.acBonus}</span>
                          {a.checkPenalty < 0 && <span className="text-xs text-red-500">Check {a.checkPenalty}</span>}
                          {a.speedPenalty < 0 && <span className="text-xs text-red-500">Speed {a.speedPenalty}</span>}
                        </div>
                      </div>
                      {pendingRemove !== key && (() => {
                        const check = canEquip(key);
                        const blocked = !item.equipped && !check.allowed;
                        return (
                          <button
                            onClick={() => !blocked && toggleEquip(key)}
                            disabled={blocked}
                            className={blocked ? blockedBtnCls : equipBtnCls(item.equipped)}
                            title={blocked ? check.reason : undefined}
                          >
                            {item.equipped ? 'Unequip' : 'Equip'}
                          </button>
                        );
                      })()}
                      <RemoveConfirm itemK={key} name={a.name} />
                    </div>
                  );
                })}
              </div>
        )}

        {/* Magic Items */}
        {activeSection === 'magic' && (
          magicItems.length === 0
            ? <EmptySection tab="magic" />
            : <div className="divide-y divide-stone-100">
                {magicItems.map((item) => {
                  const m = MAGIC_ITEMS.find((mi) => mi.id === item.itemId);
                  if (!m) return null;
                  const bonusSummary = magicBonusSummary(m);
                  const key = itemKey(item);
                  return (
                    <div key={key} className={`px-4 py-3 flex items-center gap-2 ${item.equipped ? 'bg-white' : 'bg-stone-50'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold text-sm ${item.equipped ? 'text-stone-800' : 'text-stone-500'}`}>{m.name}</span>
                          {item.equipped && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">Equipped</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-stone-400">{SLOT_LABELS[m.slot] ?? m.slot} · Lv {m.level}</span>
                          {item.equipped && bonusSummary && (
                            <span className="text-xs text-emerald-600 font-medium">{bonusSummary}</span>
                          )}
                        </div>
                        {m.power && item.equipped && (
                          <p className="text-xs text-violet-600 mt-0.5 line-clamp-1">⚡ {m.power.split('–')[0].trim()}</p>
                        )}
                      </div>
                      {pendingRemove !== key && (() => {
                        const check = canEquip(key);
                        const blocked = !item.equipped && !check.allowed;
                        return (
                          <button
                            onClick={() => !blocked && toggleEquip(key)}
                            disabled={blocked}
                            className={blocked ? blockedBtnCls : equipBtnCls(item.equipped)}
                            title={blocked ? check.reason : undefined}
                          >
                            {item.equipped ? 'Unequip' : 'Equip'}
                          </button>
                        );
                      })()}
                      <RemoveConfirm itemK={key} name={m.name} />
                    </div>
                  );
                })}
              </div>
        )}

        {/* Consumables */}
        {activeSection === 'consumables' && (
          consumableItems.length === 0
            ? <EmptySection tab="consumables" />
            : <div className="divide-y divide-stone-100">
                {consumableItems.map((item) => {
                  const c = CONSUMABLES.find((ci) => ci.id === item.itemId);
                  if (!c) return null;
                  const needsSurge = c.healType === 'surge';
                  const canUse = !needsSurge || character.currentSurges > 0;
                  const key = itemKey(item);
                  return (
                    <div key={key} className="px-4 py-3 flex items-center gap-2 bg-stone-50">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-stone-700">{c.name}</span>
                          <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">×{item.quantity}</span>
                          <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">{c.category}</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{c.effect}</p>
                        {needsSurge && (
                          <p className="text-xs text-blue-500 mt-0.5">
                            Restores {derived.healingSurgeValue}{c.healBonus ? `+${c.healBonus}` : ''} HP · spends 1 surge
                            {character.currentSurges === 0 && <span className="text-red-400 ml-1">(no surges left)</span>}
                          </p>
                        )}
                      </div>
                      {pendingRemove !== key && (
                        <button
                          onClick={() => useConsumable(item, c)}
                          disabled={!canUse}
                          className={[
                            'flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-lg transition-colors min-h-[36px]',
                            canUse ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-stone-100 text-stone-400 cursor-not-allowed',
                          ].join(' ')}
                          title={!canUse ? 'No healing surges remaining' : `Use ${c.name}`}
                        >Use</button>
                      )}
                      <RemoveConfirm itemK={key} name={c.name} />
                    </div>
                  );
                })}
              </div>
        )}

        {/* Adventuring Gear */}
        {activeSection === 'gear' && (
          gearItems.length === 0
            ? <EmptySection tab="gear" />
            : <div className="divide-y divide-stone-100">
                {gearItems.map((item) => {
                  const g = GEAR.find((gr) => gr.id === item.itemId);
                  const key = itemKey(item);
                  return (
                    <div key={key} className="px-4 py-3 flex items-center gap-2 bg-stone-50">
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm text-stone-600">
                          {g?.name ?? item.name}
                        </span>
                        {g?.description && <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{g.description}</p>}
                      </div>
                      {pendingRemove !== key && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => decrementGear(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-300 text-stone-600 hover:border-red-400 hover:text-red-600 font-bold text-base transition-colors"
                            title="Remove one"
                          >−</button>
                          <span className="text-sm font-semibold text-stone-700 w-7 text-center">{item.quantity}</span>
                          {g && (
                            <button
                              onClick={() => addGear(g)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-700 font-bold text-base transition-colors"
                              title="Add one"
                            >+</button>
                          )}
                        </div>
                      )}
                      <RemoveConfirm itemK={key} name={g?.name ?? item.name} />
                    </div>
                  );
                })}
              </div>
        )}

      </div>

      {/* ── Add Item Picker Modal ───────────────────────────────────────────── */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-3 pb-3 sm:pb-0"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPicker(false); }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh]">

            {/* Modal header */}
            <div className="bg-amber-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <h3 className="text-white font-bold">Add Equipment</h3>
              <button
                onClick={() => setShowPicker(false)}
                className="text-amber-200 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center"
              >×</button>
            </div>

            {/* Category tabs */}
            <div className="flex overflow-x-auto border-b border-stone-200 flex-shrink-0">
              {(['weapons', 'armor', 'magic', 'consumables', 'gear'] as SectionTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setPickerTab(tab); setSearch(''); }}
                  className={[
                    'flex-shrink-0 px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap',
                    pickerTab === tab
                      ? 'border-b-2 border-amber-600 text-amber-700'
                      : 'text-stone-500 hover:text-stone-700',
                  ].join(' ')}
                >
                  {SECTION_LABELS[tab]}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-stone-100 flex-shrink-0">
              <input
                type="text"
                placeholder={`Search ${SECTION_LABELS[pickerTab].toLowerCase()}…`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            {/* Item list */}
            <div className="overflow-y-auto flex-1 p-3 space-y-2">

              {/* Weapons */}
              {pickerTab === 'weapons' && (
                filteredWeapons.length === 0
                  ? <p className="text-stone-400 text-sm text-center py-8">No weapons found.</p>
                  : filteredWeapons.map((w) => {
                    const n = ownedCount(w.id);
                    return (
                      <div key={w.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800">
                            {w.name}
                            {n > 0 && <span className="text-xs text-stone-400 font-normal ml-1.5">×{n} owned</span>}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {w.category} · {w.damage} · Prof +{w.proficiencyBonus}
                            {w.range ? ` · Range ${w.range}` : ''}
                          </p>
                          {w.properties.length > 0 && <p className="text-xs text-stone-400 mt-0.5">{w.properties.join(', ')}</p>}
                        </div>
                        <button onClick={() => addWeapon(w)} className={addPickerBtnCls}>
                          {n > 0 ? `+${n + 1}` : 'Add'}
                        </button>
                      </div>
                    );
                  })
              )}

              {/* Armor */}
              {pickerTab === 'armor' && (
                filteredArmor.length === 0
                  ? <p className="text-stone-400 text-sm text-center py-8">No armor found.</p>
                  : filteredArmor.map((a) => {
                    const n = ownedCount(a.id);
                    const isShield = a.type === 'Shield';
                    return (
                      <div key={a.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800">
                            {a.name}
                            {n > 0 && <span className="text-xs text-stone-400 font-normal ml-1.5">×{n} owned</span>}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {isShield ? 'Shield' : `${a.type} Armor`} · AC +{a.acBonus}
                            {a.checkPenalty < 0 ? ` · Check ${a.checkPenalty}` : ''}
                            {a.speedPenalty < 0 ? ` · Speed ${a.speedPenalty}` : ''}
                          </p>
                        </div>
                        <button onClick={() => addArmor(a)} className={addPickerBtnCls}>
                          {n > 0 ? `+${n + 1}` : 'Add'}
                        </button>
                      </div>
                    );
                  })
              )}

              {/* Magic Items */}
              {pickerTab === 'magic' && (
                filteredMagic.length === 0
                  ? <p className="text-stone-400 text-sm text-center py-8">No magic items found.</p>
                  : filteredMagic.map((m) => {
                    const n = ownedCount(m.id);
                    const bonusSummary = magicBonusSummary(m);
                    return (
                      <div key={m.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800">
                            {m.name}
                            {n > 0 && <span className="text-xs text-stone-400 font-normal ml-1.5">×{n} owned</span>}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {SLOT_LABELS[m.slot] ?? m.slot} · Lv {m.level} · {m.cost} gp
                          </p>
                          {bonusSummary && <p className="text-xs text-emerald-600 mt-0.5">{bonusSummary}</p>}
                          <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{m.properties}</p>
                        </div>
                        <button onClick={() => addMagicItem(m)} className={addPickerBtnCls}>
                          {n > 0 ? `+${n + 1}` : 'Add'}
                        </button>
                      </div>
                    );
                  })
              )}

              {/* Consumables */}
              {pickerTab === 'consumables' && (
                filteredConsumables.length === 0
                  ? <p className="text-stone-400 text-sm text-center py-8">No consumables found.</p>
                  : filteredConsumables.map((c) => {
                    const owned = character.equipment.find((e) => e.itemId === c.id);
                    return (
                      <div key={c.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800">
                            {c.name}
                            {owned && <span className="text-xs text-amber-600 font-semibold ml-1.5">×{owned.quantity} owned</span>}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5">{c.category} · Lv {c.level} · {c.cost} gp</p>
                          <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{c.effect}</p>
                        </div>
                        <button onClick={() => addConsumable(c)} className={addPickerBtnCls}>
                          {owned ? `+${owned.quantity + 1}` : 'Add'}
                        </button>
                      </div>
                    );
                  })
              )}

              {/* Gear */}
              {pickerTab === 'gear' && (
                filteredGear.length === 0
                  ? <p className="text-stone-400 text-sm text-center py-8">No gear found.</p>
                  : filteredGear.map((g) => {
                    const owned = character.equipment.find((e) => e.itemId === g.id);
                    return (
                      <div key={g.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800">
                            {g.name}
                            {owned && <span className="text-xs text-stone-400 font-normal ml-1">×{owned.quantity} owned</span>}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{g.description}</p>
                        </div>
                        <button onClick={() => addGear(g)} className={addPickerBtnCls}>
                          {owned ? `+${owned.quantity + 1}` : 'Add'}
                        </button>
                      </div>
                    );
                  })
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
