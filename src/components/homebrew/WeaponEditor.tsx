import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { WeaponData } from '../../types/gameData';

const CATEGORIES: WeaponData['category'][] = [
  'Simple Melee', 'Military Melee', 'Simple Ranged', 'Military Ranged', 'Superior Melee', 'Superior Ranged',
];

/** All official D&D 4e weapon properties (alphabetical) */
const WEAPON_PROPERTIES = [
  'Axe', 'Bow', 'Crossbow', 'Flail', 'Hammer', 'Heavy blade', 'Heavy thrown',
  'High crit', 'Light blade', 'Light thrown', 'Load free', 'Load minor',
  'Mace', 'Off-hand', 'Pick', 'Polearm', 'Reach', 'Sling', 'Spear',
  'Staff', 'Two-handed', 'Unarmed', 'Versatile',
] as const;

function defaults(): WeaponData {
  return { id: '', name: '', category: 'Simple Melee', proficiencyBonus: 2, damage: '1d8', properties: [], cost: 5, weight: 5 };
}

export function WeaponEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as WeaponData | undefined;

  const [form, setForm] = useState<WeaponData>(existing ? { ...existing } : defaults());
  const [selectedProps, setSelectedProps] = useState<string[]>(existing?.properties ?? []);
  const [pendingProp, setPendingProp] = useState('');
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof WeaponData>(key: K, val: WeaponData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0;

  const addProperty = () => {
    if (pendingProp && !selectedProps.includes(pendingProp)) {
      setSelectedProps((prev) => [...prev, pendingProp]);
    }
    setPendingProp('');
  };

  const removeProperty = (prop: string) => {
    setSelectedProps((prev) => prev.filter((p) => p !== prop));
  };

  // Properties not yet added
  const availableProps = WEAPON_PROPERTIES.filter((p) => !selectedProps.includes(p));

  const handleSave = async () => {
    const data: WeaponData = { ...form, id: existing?.id ?? '', properties: selectedProps };

    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({ contentType: 'weapon', name: data.name, createdBy: userId, campaignIds, data: { ...data, id: '' } });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout title={editingItem ? 'Edit Weapon' : 'New Weapon'} campaignIds={campaignIds} onCampaignToggle={toggleCampaign} onSave={handleSave} onCancel={onClose} canSave={canSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Weapon name" />
        </Field>
        <Field label="Category">
          <select className={selectCls} value={form.category} onChange={(e) => set('category', e.target.value as WeaponData['category'])}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Proficiency Bonus">
          <input className={inputCls} type="number" min={0} max={4} value={form.proficiencyBonus} onChange={(e) => set('proficiencyBonus', Number(e.target.value))} />
        </Field>
        <Field label="Damage">
          <input className={inputCls} value={form.damage} onChange={(e) => set('damage', e.target.value)} placeholder="e.g. 1d8, 2d6" />
        </Field>
        <Field label="Range">
          <input className={inputCls} value={form.range ?? ''} onChange={(e) => set('range', e.target.value || undefined)} placeholder="e.g. 5/10 (ranged only)" />
        </Field>
        <Field label="Cost (gp)">
          <input className={inputCls} type="number" min={0} value={form.cost} onChange={(e) => set('cost', Number(e.target.value))} />
        </Field>
        <Field label="Weight (lb)">
          <input className={inputCls} type="number" min={0} step={0.1} value={form.weight} onChange={(e) => set('weight', Number(e.target.value))} />
        </Field>
        <Field label="Properties">
          <div className="space-y-2">
            <div className="flex gap-2">
              <select
                className={selectCls}
                value={pendingProp}
                onChange={(e) => setPendingProp(e.target.value)}
              >
                <option value="">Select a property…</option>
                {availableProps.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <button
                type="button"
                onClick={addProperty}
                disabled={!pendingProp}
                className="px-3 py-2 rounded-lg bg-amber-600 text-white font-semibold text-sm hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0 min-h-[44px]"
              >
                + Add
              </button>
            </div>
            {selectedProps.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedProps.map((prop) => (
                  <span
                    key={prop}
                    className="inline-flex items-center gap-1 text-sm bg-stone-100 border border-stone-200 text-stone-700 px-2.5 py-1 rounded-lg"
                  >
                    {prop}
                    <button
                      type="button"
                      onClick={() => removeProperty(prop)}
                      className="text-stone-400 hover:text-red-500 transition-colors text-base leading-none ml-0.5"
                      title={`Remove ${prop}`}
                    >×</button>
                  </span>
                ))}
              </div>
            )}
            {selectedProps.length === 0 && (
              <p className="text-xs text-stone-400">No properties added yet.</p>
            )}
          </div>
        </Field>
      </div>
    </EditorLayout>
  );
}
