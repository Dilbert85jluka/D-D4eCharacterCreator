import { useState } from 'react';
import type { Character, DerivedStats, EquipmentItem } from '../../types/character';
import type { WeaponData, ArmorData, GearData, MagicItemData, ConsumableData, MasterworkArmorData, MagicArmorData, ArmorType } from '../../types/gameData';
import { WEAPONS } from '../../data/equipment/weapons';
import { ARMOR } from '../../data/equipment/armor';
import { MASTERWORK_ARMOR } from '../../data/equipment/masterworkArmor';
import { MAGIC_ARMOR } from '../../data/equipment/magicArmor';
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

  /** Get compatible base armor types for a magic armor entry */
  const getCompatibleBaseArmors = (ma: MagicArmorData): ArmorData[] => {
    if (ma.armorTypes === 'Any') return ARMOR.filter(a => a.type !== 'Shield');
    if (ma.armorTypes === 'Any shield') return ARMOR.filter(a => a.type === 'Shield');
    return ARMOR.filter(a => (ma.armorTypes as ArmorType[]).includes(a.type));
  };

  const addMagicArmorItem = (baseArmor: ArmorData, maId: string, tierLevel: number) => {
    const slot = baseArmor.type === 'Shield' ? 'off-hand' : 'body';
    const newItem: EquipmentItem = {
      instanceId: crypto.randomUUID(),
      itemId: baseArmor.id, name: baseArmor.name, quantity: 1, equipped: false, slot,
      magicArmorId: maId,
      magicArmorTier: tierLevel,
    };
    patch({ equipment: [...character.equipment, newItem] });
    setPendingMagicArmor(null);
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

  // ── Masterwork & Magic Armor ─────────────────────────────────────────────
  const [expandedArmor, setExpandedArmor] = useState<string | null>(null);
  // Picker: when user clicks Add on a magic armor tier, show base armor type selector
  const [pendingMagicArmor, setPendingMagicArmor] = useState<{ maId: string; tierLevel: number } | null>(null);

  const setMasterwork = (key: string, masterworkId: string | undefined) => {
    patch({
      equipment: character.equipment.map((e) =>
        itemKey(e) === key ? { ...e, masterworkId } : e,
      ),
    });
  };

  const setMagicArmorTier = (key: string, tier: number) => {
    // When changing tier, also validate masterwork minEnhancement
    const item = character.equipment.find(e => itemKey(e) === key);
    const ma = item?.magicArmorId ? MAGIC_ARMOR.find(m => m.id === item.magicArmorId) : undefined;
    const newTier = ma?.tiers.find(t => t.level === tier);
    const newEnhancement = newTier?.enhancement ?? 0;
    const mw = item?.masterworkId ? MASTERWORK_ARMOR.find(m => m.id === item.masterworkId) : undefined;
    // Clear masterwork if new enhancement is below its minimum
    const clearMasterwork = mw && newEnhancement < mw.minEnhancement;
    patch({
      equipment: character.equipment.map((e) =>
        itemKey(e) === key ? { ...e, magicArmorTier: tier, ...(clearMasterwork ? { masterworkId: undefined } : {}) } : e,
      ),
    });
  };

  const setBaseArmorType = (key: string, newBaseId: string) => {
    const newBase = ARMOR.find(a => a.id === newBaseId);
    if (!newBase) return;
    const newSlot = newBase.type === 'Shield' ? 'off-hand' : 'body';
    patch({
      equipment: character.equipment.map((e) =>
        itemKey(e) === key ? { ...e, itemId: newBaseId, name: newBase.name, slot: newSlot, masterworkId: undefined } : e,
      ),
    });
  };

  /** Get masterwork options compatible with a base armor type */
  const getMasterworkOptions = (baseType: ArmorType): MasterworkArmorData[] =>
    MASTERWORK_ARMOR.filter(m => m.baseType === baseType);

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

  // Build flat list of magic armor × tier entries, filtered by character level
  const magicArmorTierEntries = MAGIC_ARMOR.flatMap((ma) =>
    ma.tiers
      .filter(t => t.level <= character.level)
      .map(t => ({ ma, tier: t }))
  );
  const filteredMagicArmorTiers = magicArmorTierEntries.filter(({ ma }) =>
    !q || ma.name.toLowerCase().includes(q) || ma.rarity.toLowerCase().includes(q) || (ma.property ?? '').toLowerCase().includes(q) || (ma.description ?? '').toLowerCase().includes(q)
  );
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
                  const mw = item.masterworkId ? MASTERWORK_ARMOR.find(m => m.id === item.masterworkId) : undefined;
                  const ma = item.magicArmorId ? MAGIC_ARMOR.find(m => m.id === item.magicArmorId) : undefined;
                  const maTier = ma?.tiers.find(t => t.level === item.magicArmorTier);
                  const effectiveAc = mw ? mw.acBonus : a.acBonus;
                  const effectiveCheck = mw ? mw.checkPenalty : a.checkPenalty;
                  const effectiveSpeed = mw ? mw.speedPenalty : a.speedPenalty;
                  // Primary name: magic armor name if present, otherwise masterwork, otherwise base
                  const displayName = ma && maTier
                    ? `${ma.name} +${maTier.enhancement}`
                    : mw ? mw.name : a.name;
                  const isExpanded = expandedArmor === key;

                  return (
                    <div key={key} className={item.equipped ? 'bg-white' : 'bg-stone-50'}>
                      <div className="px-4 py-3 flex items-center gap-2">
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedArmor(isExpanded ? null : key)}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-semibold text-sm ${item.equipped ? 'text-stone-800' : 'text-stone-500'}`}>{displayName}</span>
                            {ma && <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ma.rarity === 'Rare' ? 'bg-amber-100 text-amber-700' : ma.rarity === 'Uncommon' ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-stone-500'}`}>{ma.rarity}</span>}
                            {mw && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">{mw.name}</span>}
                            {item.equipped && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">Equipped</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-stone-400">{isShield ? 'Shield' : `${a.type} Armor`} (base: {a.name})</span>
                            <span className="text-xs text-stone-500 font-medium">AC +{effectiveAc}{maTier ? ` (+${maTier.enhancement} enh)` : ''}</span>
                            {effectiveCheck < 0 && <span className="text-xs text-red-500">Check {effectiveCheck}</span>}
                            {effectiveSpeed < 0 && <span className="text-xs text-red-500">Speed {effectiveSpeed}</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            {maTier && <span className="text-xs text-stone-500">Lvl {maTier.level}</span>}
                            <span className="text-xs text-stone-400">{maTier ? `${maTier.cost.toLocaleString()} gp` : `${a.cost} gp`}</span>
                            <span className="text-xs text-stone-400">{mw ? mw.weight : a.weight} lb</span>
                            {a.minStrength && <span className="text-xs text-stone-400">Min Str {a.minStrength}</span>}
                            {mw && <span className="text-xs text-stone-400">Min Enh +{mw.minEnhancement}</span>}
                          </div>
                          {ma?.description && (
                            <p className="text-xs text-stone-400 mt-0.5 line-clamp-1 italic">{ma.description}</p>
                          )}
                          {ma?.property && (
                            <p className="text-xs text-blue-600 mt-0.5 line-clamp-1">{ma.property}</p>
                          )}
                          {ma?.power && (
                            <p className="text-xs text-violet-600 mt-0.5 line-clamp-1">Power: {ma.power.substring(0, 80)}...</p>
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
                        <RemoveConfirm itemK={key} name={displayName} />
                      </div>

                      {/* Expandable: full details + selectors */}
                      {isExpanded && (
                        <div className="px-4 pb-3 space-y-3 border-t border-stone-100 pt-3">
                          {/* Base armor stats summary */}
                          <div className="bg-stone-50 rounded-lg p-2 text-xs text-stone-600 space-y-0.5">
                            <div className="font-semibold text-stone-700 mb-1">Base: {a.name}</div>
                            <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                              <span>Type: {a.type}</span>
                              <span>AC Bonus: +{a.acBonus}</span>
                              <span>Check: {a.checkPenalty}</span>
                              <span>Speed: {a.speedPenalty}</span>
                              <span>Cost: {a.cost} gp</span>
                              <span>Weight: {a.weight} lb</span>
                              {a.minStrength && <span>Min Str: {a.minStrength}</span>}
                            </div>
                          </div>
                          {mw && (
                            <div className="bg-amber-50 rounded-lg p-2 text-xs text-amber-700 space-y-0.5">
                              <div className="font-semibold">Masterwork: {mw.name}</div>
                              <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                                <span>AC Bonus: +{mw.acBonus}</span>
                                <span>Check: {mw.checkPenalty}</span>
                                <span>Speed: {mw.speedPenalty}</span>
                                <span>Min Enh: +{mw.minEnhancement}</span>
                                <span>Weight: {mw.weight} lb</span>
                              </div>
                              {mw.description && <p className="text-amber-600 mt-1 italic">{mw.description}</p>}
                              <p className="text-amber-500 text-[10px]">Source: {mw.source}</p>
                            </div>
                          )}
                          {ma && maTier && (
                            <div className="bg-violet-50 rounded-lg p-2 text-xs text-violet-700 space-y-0.5">
                              <div className="font-semibold">{ma.name} +{maTier.enhancement}</div>
                              <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                                <span>Enhancement: +{maTier.enhancement} {ma.enhancementType}</span>
                                <span>Level: {maTier.level}</span>
                                <span>Cost: {maTier.cost.toLocaleString()} gp</span>
                                <span>Rarity: {ma.rarity}</span>
                              </div>
                              {ma.description && <p className="text-violet-600 mt-1 italic">{ma.description}</p>}
                              <p className="text-violet-500 text-[10px]">Source: {ma.source}</p>
                            </div>
                          )}

                          {/* Base Armor Type (only for magic armor — allows changing the underlying base) */}
                          {ma && (() => {
                            const compatBases = getCompatibleBaseArmors(ma);
                            return compatBases.length > 1 ? (
                              <div>
                                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Base Armor Type</label>
                                <select
                                  value={item.itemId}
                                  onChange={(e) => setBaseArmorType(key, e.target.value)}
                                  className="mt-1 w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white"
                                >
                                  {compatBases.map(base => (
                                    <option key={base.id} value={base.id}>
                                      {base.name} (AC +{base.acBonus}{base.checkPenalty < 0 ? `, Check ${base.checkPenalty}` : ''}{base.speedPenalty < 0 ? `, Speed ${base.speedPenalty}` : ''})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : null;
                          })()}

                          {/* Masterwork Upgrade */}
                          {!isShield && (() => {
                            const currentEnhancement = maTier?.enhancement ?? 0;
                            const mwOptions = getMasterworkOptions(a.type);
                            return (
                              <div>
                                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Masterwork Upgrade</label>
                                <select
                                  value={item.masterworkId ?? ''}
                                  onChange={(e) => setMasterwork(key, e.target.value || undefined)}
                                  className="mt-1 w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white"
                                >
                                  <option value="">None (base {a.name})</option>
                                  {mwOptions.map(mwOpt => {
                                    const eligible = currentEnhancement >= mwOpt.minEnhancement;
                                    return (
                                      <option key={mwOpt.id} value={mwOpt.id} disabled={!eligible}>
                                        {mwOpt.name} (AC +{mwOpt.acBonus}, min +{mwOpt.minEnhancement}){!eligible ? ' — requires higher enhancement' : ''}
                                      </option>
                                    );
                                  })}
                                </select>
                                {mw && <p className="text-xs text-stone-400 mt-1">{mw.description}</p>}
                              </div>
                            );
                          })()}

                          {/* Item Level / Tier selector (when magic armor is set) */}
                          {ma && (
                            <div>
                              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Item Level</label>
                              <select
                                value={item.magicArmorTier ?? ''}
                                onChange={(e) => setMagicArmorTier(key, parseInt(e.target.value))}
                                className="mt-1 w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white"
                              >
                                {ma.tiers.map(t => {
                                  const available = t.level <= character.level;
                                  return (
                                    <option key={t.level} value={t.level} disabled={!available}>
                                      Lvl {t.level} — +{t.enhancement} Enhancement ({t.cost.toLocaleString()} gp){!available ? ' — not yet available' : ''}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          )}

                          {/* Property & Power display */}
                          {ma?.property && (
                            <div className="bg-blue-50 rounded-lg p-2">
                              <p className="text-xs font-semibold text-blue-700">Property</p>
                              <p className="text-xs text-blue-600 mt-0.5">{ma.property}</p>
                              {ma.bonuses && maTier && (() => {
                                const parts: string[] = [];
                                if (ma.bonuses.skills) {
                                  for (const [sk, val] of Object.entries(ma.bonuses.skills)) {
                                    parts.push(`${sk.charAt(0).toUpperCase() + sk.slice(1)} +${val}`);
                                  }
                                }
                                if (ma.bonuses.skillsFromEnhancement) {
                                  for (const sk of ma.bonuses.skillsFromEnhancement) {
                                    parts.push(`${sk.charAt(0).toUpperCase() + sk.slice(1)} +${maTier.enhancement}`);
                                  }
                                }
                                if (ma.bonuses.skillsByLevel) {
                                  for (const [sk, tiers] of Object.entries(ma.bonuses.skillsByLevel)) {
                                    let best = 0;
                                    for (const [minLvl, val] of tiers) {
                                      if (maTier.level >= minLvl && val > best) best = val;
                                    }
                                    if (best > 0) parts.push(`${sk.charAt(0).toUpperCase() + sk.slice(1)} +${best}`);
                                  }
                                }
                                if (ma.bonuses.initiative) parts.push(`Initiative +${ma.bonuses.initiative}`);
                                if (ma.bonuses.speed) parts.push(`Speed +${ma.bonuses.speed}`);
                                if (ma.bonuses.ac) parts.push(`AC +${ma.bonuses.ac}`);
                                if (ma.bonuses.fortitude) parts.push(`Fortitude +${ma.bonuses.fortitude}`);
                                if (ma.bonuses.reflex) parts.push(`Reflex +${ma.bonuses.reflex}`);
                                if (ma.bonuses.will) parts.push(`Will +${ma.bonuses.will}`);
                                return parts.length > 0 ? (
                                  <p className="text-xs text-emerald-600 font-semibold mt-1">Applied: {parts.join(', ')}</p>
                                ) : null;
                              })()}
                            </div>
                          )}
                          {ma?.power && (
                            <div className="bg-violet-50 rounded-lg p-2">
                              <p className="text-xs font-semibold text-violet-700">Power</p>
                              <p className="text-xs text-violet-600 mt-0.5">{ma.power}</p>
                            </div>
                          )}
                        </div>
                      )}
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

              {/* Magic Armor (in armor tab) — each tier as a separate entry */}
              {pickerTab === 'armor' && filteredMagicArmorTiers.length > 0 && (
                <>
                  <div className="px-3 py-2 bg-violet-50 border-y border-violet-200">
                    <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Magic Armor</p>
                  </div>
                  {filteredMagicArmorTiers.map(({ ma, tier }) => {
                    const entryKey = `${ma.id}-${tier.level}`;
                    const isPending = pendingMagicArmor?.maId === ma.id && pendingMagicArmor?.tierLevel === tier.level;
                    const compatBases = getCompatibleBaseArmors(ma);
                    const compatLabel = ma.armorTypes === 'Any' ? 'Any armor'
                      : ma.armorTypes === 'Any shield' ? 'Any shield'
                      : (ma.armorTypes as string[]).join(', ');
                    return (
                      <div key={entryKey} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-stone-800">{ma.name} +{tier.enhancement}</p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ma.rarity === 'Rare' ? 'bg-amber-100 text-amber-700' : ma.rarity === 'Uncommon' ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-stone-500'}`}>{ma.rarity}</span>
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Lvl {tier.level} · +{tier.enhancement} {ma.enhancementType} · {tier.cost.toLocaleString()} gp · {compatLabel}
                            </p>
                            {ma.description && <p className="text-xs text-stone-400 mt-0.5 line-clamp-1 italic">{ma.description}</p>}
                            {ma.property && <p className="text-xs text-blue-500 mt-0.5 line-clamp-1">{ma.property}</p>}
                          </div>
                          {!isPending && (
                            <button
                              onClick={() => {
                                // If only 1 compatible base, add directly
                                if (compatBases.length === 1) {
                                  addMagicArmorItem(compatBases[0], ma.id, tier.level);
                                } else {
                                  setPendingMagicArmor({ maId: ma.id, tierLevel: tier.level });
                                }
                              }}
                              className={addPickerBtnCls}
                            >
                              Add
                            </button>
                          )}
                          {isPending && (
                            <button onClick={() => setPendingMagicArmor(null)} className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1">
                              Cancel
                            </button>
                          )}
                        </div>
                        {/* Base armor type selector (shown when multiple options) */}
                        {isPending && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 space-y-1.5">
                            <p className="text-xs font-semibold text-amber-700">Choose base armor type:</p>
                            <div className="flex flex-wrap gap-2">
                              {compatBases.map(base => (
                                <button
                                  key={base.id}
                                  onClick={() => addMagicArmorItem(base, ma.id, tier.level)}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 font-medium min-h-[32px]"
                                >
                                  {base.name} (AC +{base.acBonus})
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
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
