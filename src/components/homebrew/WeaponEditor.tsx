import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { WeaponData } from '../../types/gameData';

const CATEGORIES: WeaponData['category'][] = [
  'Simple Melee', 'Military Melee', 'Simple Ranged', 'Military Ranged', 'Superior Melee', 'Superior Ranged',
];

function defaults(): WeaponData {
  return { id: '', name: '', category: 'Simple Melee', proficiencyBonus: 2, damage: '1d8', properties: [], cost: 5, weight: 5 };
}

export function WeaponEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as WeaponData | undefined;

  const [form, setForm] = useState<WeaponData>(existing ? { ...existing } : defaults());
  const [propsText, setPropsText] = useState(existing?.properties.join(', ') ?? '');
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof WeaponData>(key: K, val: WeaponData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0;

  const handleSave = async () => {
    const properties = propsText.split(',').map((s) => s.trim()).filter(Boolean);
    const data: WeaponData = { ...form, id: existing?.id ?? '', properties };

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
          <input className={inputCls} value={propsText} onChange={(e) => setPropsText(e.target.value)} placeholder="Heavy blade, Versatile (comma-separated)" />
        </Field>
      </div>
    </EditorLayout>
  );
}
