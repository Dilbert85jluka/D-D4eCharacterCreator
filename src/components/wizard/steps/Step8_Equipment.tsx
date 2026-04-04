import { useState } from 'react';
import { useWizardStore } from '../../../store/useWizardStore';
import { WEAPONS } from '../../../data/equipment/weapons';
import { ARMOR } from '../../../data/equipment/armor';
import { GEAR } from '../../../data/equipment/gear';
import { getRituals } from '../../../data/rituals';
import type { EquipmentItem } from '../../../types/character';

type Tab = 'weapons' | 'armor' | 'gear';

export function Step8_Equipment() {
  const {
    classId,
    equipment, goldPieces, addEquipment, removeEquipment, removeEquipmentByInstance,
    updateEquipmentQuantity, spendGold, refundGold,
    wizardStartingRitualIds, toggleWizardStartingRitual,
  } = useWizardStore();
  const [tab, setTab] = useState<Tab>('weapons');
  const [search, setSearch] = useState('');
  const [ritualSearch, setRitualSearch] = useState('');

  const isWizard = classId === 'wizard';
  const level1Rituals = getRituals().filter((r) => r.level === 1);
  const filteredStartingRituals = ritualSearch
    ? level1Rituals.filter((r) => r.name.toLowerCase().includes(ritualSearch.toLowerCase()))
    : level1Rituals;

  const addItem = (id: string, name: string, cost: number, slot?: string) => {
    if (cost > goldPieces) return; // can't afford

    // Gear (no slot) stacks by quantity
    if (!slot) {
      const existing = equipment.find((e) => e.itemId === id);
      if (existing) {
        updateEquipmentQuantity(id, existing.quantity + 1);
        spendGold(cost);
        return;
      }
    }

    const item: EquipmentItem = {
      instanceId: crypto.randomUUID(),
      itemId: id,
      name,
      quantity: 1,
      equipped: slot === 'body' || slot === 'main-hand' ? true : false,
      slot,
    };
    addEquipment(item);
    spendGold(cost);
  };

  const removeItem = (item: EquipmentItem, cost: number) => {
    const isGear = !item.slot;
    if (isGear && item.quantity > 1) {
      updateEquipmentQuantity(item.itemId, item.quantity - 1);
    } else if (item.instanceId) {
      removeEquipmentByInstance(item.instanceId);
    } else {
      removeEquipment(item.itemId);
    }
    refundGold(cost);
  };

  const ownedCount = (id: string) => equipment.filter((e) => e.itemId === id).length;
  const ownedGearQty = (id: string) => equipment.find((e) => e.itemId === id)?.quantity ?? 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Equipment</h2>
        <div className="flex items-center justify-between">
          <p className="text-stone-500 text-sm">Spend your starting gold on gear.</p>
          <div className="font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg text-sm">
            {goldPieces} gp remaining
          </div>
        </div>
      </div>

      {/* Wizard starting rituals (free class feature — choose 3 level 1 rituals) */}
      {isWizard && (
        <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-teal-800">📖 Wizard Class Feature — Starting Rituals</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Choose 3 level 1 rituals to master. These are free — they don't cost gold.
              </p>
            </div>
            <div className={[
              'text-sm font-bold px-3 py-1.5 rounded-lg',
              wizardStartingRitualIds.length >= 3 ? 'bg-teal-700 text-white' : 'bg-teal-100 text-teal-700',
            ].join(' ')}>
              {wizardStartingRitualIds.length} / 3
            </div>
          </div>
          <input
            type="text"
            placeholder="Search rituals..."
            value={ritualSearch}
            onChange={(e) => setRitualSearch(e.target.value)}
            className="w-full border border-teal-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 mb-3 min-h-[44px] bg-white"
          />
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredStartingRituals.length === 0 && (
              <p className="text-stone-400 text-sm text-center py-4">No rituals match your search.</p>
            )}
            {filteredStartingRituals.map((ritual) => {
              const isPicked  = wizardStartingRitualIds.includes(ritual.id);
              const canToggle = isPicked || wizardStartingRitualIds.length < 3;
              return (
                <button
                  key={ritual.id}
                  onClick={() => toggleWizardStartingRitual(ritual.id)}
                  disabled={!canToggle}
                  className={[
                    'w-full text-left p-3 rounded-xl border transition-all min-h-[44px]',
                    isPicked
                      ? 'bg-teal-50 border-teal-400 ring-1 ring-teal-300'
                      : canToggle
                        ? 'bg-white border-stone-200 hover:border-teal-300'
                        : 'bg-stone-50 border-stone-200 opacity-50',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-2">
                    <div className={[
                      'w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center',
                      isPicked ? 'bg-teal-600 border-teal-600' : 'border-stone-300',
                    ].join(' ')}>
                      {isPicked && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-stone-800 text-sm">{ritual.name}</span>
                        <span className="text-xs text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded font-medium">
                          {ritual.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {ritual.castingTime} · {ritual.keySkill}
                        {ritual.componentCost > 0 ? ` · ${ritual.componentCost} gp component` : ''}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Current inventory */}
      {equipment.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-2">Your Inventory</h3>
          <div className="space-y-1">
            {equipment.map((item) => {
              const weaponData = WEAPONS.find(w => w.id === item.itemId);
              const armorData = ARMOR.find(a => a.id === item.itemId);
              const gearData = GEAR.find(g => g.id === item.itemId);
              const cost = weaponData?.cost ?? armorData?.cost ?? gearData?.cost ?? 0;

              return (
                <div
                  key={item.instanceId ?? item.itemId}
                  className="flex items-center justify-between bg-white border border-stone-200 rounded-lg px-3 py-2"
                >
                  <span className="text-sm text-stone-800">
                    {item.name}
                    {item.quantity > 1 && <span className="text-xs text-stone-400 ml-1">×{item.quantity}</span>}
                  </span>
                  <button
                    onClick={() => removeItem(item, cost)}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1 min-h-[36px]"
                  >
                    {item.quantity > 1 ? 'Remove 1' : 'Remove'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-4">
        {(['weapons', 'armor', 'gear'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSearch(''); }}
            className={[
              'flex-1 py-2 px-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] capitalize',
              tab === t ? 'bg-white shadow text-stone-800' : 'text-stone-500 hover:text-stone-700',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search ${tab}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
        />
      </div>

      {/* Item lists */}
      <div className="space-y-2">
        {tab === 'weapons' && WEAPONS.filter((w) =>
          !search.trim() || w.name.toLowerCase().includes(search.toLowerCase())
        ).map((w) => {
          const n = ownedCount(w.id);
          const canAfford = w.cost <= goldPieces;
          return (
            <div
              key={w.id}
              className={[
                'flex items-center gap-3 p-3 rounded-xl border bg-white',
                n > 0 ? 'border-amber-300 bg-amber-50' : 'border-stone-200',
              ].join(' ')}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-stone-800">{w.name}</span>
                  <span className="text-xs text-stone-400">{w.category}</span>
                  {n > 0 && <span className="text-xs text-emerald-600 font-semibold">×{n} owned</span>}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Dmg: {w.damage} · Prof +{w.proficiencyBonus}
                  {w.range && ` · Range ${w.range}`}
                  {w.properties.length > 0 && ` · ${w.properties.slice(0, 2).join(', ')}`}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-bold text-amber-700">{w.cost}gp</span>
                <button
                  onClick={() => addItem(w.id, w.name, w.cost, 'main-hand')}
                  disabled={!canAfford}
                  className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-40 min-h-[36px]"
                >
                  Buy
                </button>
              </div>
            </div>
          );
        })}

        {tab === 'armor' && ARMOR.filter((a) =>
          !search.trim() || a.name.toLowerCase().includes(search.toLowerCase())
        ).map((a) => {
          const n = ownedCount(a.id);
          const canAfford = a.cost <= goldPieces;
          return (
            <div
              key={a.id}
              className={[
                'flex items-center gap-3 p-3 rounded-xl border bg-white',
                n > 0 ? 'border-amber-300 bg-amber-50' : 'border-stone-200',
              ].join(' ')}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-stone-800">{a.name}</span>
                  {n > 0 && <span className="text-xs text-emerald-600 font-semibold">×{n} owned</span>}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  AC +{a.acBonus} · Type: {a.type}
                  {a.checkPenalty < 0 && ` · Check ${a.checkPenalty}`}
                  {a.speedPenalty < 0 && ` · Speed ${a.speedPenalty}`}
                  {a.minStrength && ` · Min STR ${a.minStrength}`}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-bold text-amber-700">{a.cost}gp</span>
                <button
                  onClick={() => addItem(a.id, a.name, a.cost, a.type === 'Shield' ? 'off-hand' : 'body')}
                  disabled={!canAfford}
                  className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-40 min-h-[36px]"
                >
                  Buy
                </button>
              </div>
            </div>
          );
        })}

        {tab === 'gear' && GEAR.filter((g) =>
          !search.trim() || g.name.toLowerCase().includes(search.toLowerCase())
        ).map((g) => {
          const qty = ownedGearQty(g.id);
          const canAfford = g.cost <= goldPieces;
          return (
            <div
              key={g.id}
              className={[
                'flex items-center gap-3 p-3 rounded-xl border bg-white',
                qty > 0 ? 'border-amber-300 bg-amber-50' : 'border-stone-200',
              ].join(' ')}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-stone-800">{g.name}</span>
                  {qty > 0 && <span className="text-xs text-emerald-600 font-semibold">×{qty} owned</span>}
                </div>
                <div className="text-xs text-stone-500 mt-0.5 line-clamp-2">{g.description}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-bold text-amber-700">{g.cost}gp</span>
                <button
                  onClick={() => addItem(g.id, g.name, g.cost)}
                  disabled={!canAfford}
                  className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-40 min-h-[36px]"
                >
                  Buy
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
