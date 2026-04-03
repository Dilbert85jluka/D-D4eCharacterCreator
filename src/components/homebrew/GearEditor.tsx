import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { GearData } from '../../types/gameData';

const GEAR_CATEGORIES = [
  'Gear', 'Component', 'Musical Instrument', 'Food & Drink', 'Lodging', 'Transport', 'Mount',
] as const;

function defaults(): GearData {
  return { id: '', name: '', category: 'Gear', cost: 5, weight: 1, description: '' };
}

export function GearEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as GearData | undefined;

  const [form, setForm] = useState<GearData>(existing ? { ...existing } : defaults());
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof GearData>(key: K, val: GearData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0;

  const handleSave = async () => {
    const data: GearData = { ...form, id: existing?.id ?? '' };
    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({ contentType: 'gear', name: data.name, createdBy: userId, campaignIds, data: { ...data, id: '' } });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout title={editingItem ? 'Edit Gear' : 'New Gear'} campaignIds={campaignIds} onCampaignToggle={toggleCampaign} onSave={handleSave} onCancel={onClose} canSave={canSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Item name" />
        </Field>
        <Field label="Category">
          <select className={selectCls} value={form.category ?? 'Gear'} onChange={(e) => set('category', e.target.value)}>
            {GEAR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Cost (gp)">
          <input className={inputCls} type="number" min={0} step={0.01} value={form.cost} onChange={(e) => set('cost', Number(e.target.value))} />
        </Field>
        <Field label="Weight (lb)">
          <input className={inputCls} type="number" min={0} step={0.1} value={form.weight} onChange={(e) => set('weight', Number(e.target.value))} />
        </Field>
      </div>
      <Field label="Description">
        <textarea className={textareaCls} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What does this item do?" rows={3} />
      </Field>
    </EditorLayout>
  );
}
