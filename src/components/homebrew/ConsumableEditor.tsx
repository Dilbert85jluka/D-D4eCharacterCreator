import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { ConsumableData } from '../../types/gameData';

const CATEGORIES: ConsumableData['category'][] = ['Potion', 'Elixir', 'Alchemical', 'Other'];

function defaults(): ConsumableData {
  return { id: '', name: '', level: 1, category: 'Potion', effect: '', cost: 50, weight: 0 };
}

export function ConsumableEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as ConsumableData | undefined;

  const [form, setForm] = useState<ConsumableData>(existing ? { ...existing } : defaults());
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof ConsumableData>(key: K, val: ConsumableData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0 && form.effect.trim().length > 0;

  const handleSave = async () => {
    const data: ConsumableData = { ...form, id: existing?.id ?? '' };
    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({ contentType: 'consumable', name: data.name, createdBy: userId, campaignIds, data: { ...data, id: '' } });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout title={editingItem ? 'Edit Consumable' : 'New Consumable'} campaignIds={campaignIds} onCampaignToggle={toggleCampaign} onSave={handleSave} onCancel={onClose} canSave={canSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Consumable name" />
        </Field>
        <Field label="Category">
          <select className={selectCls} value={form.category} onChange={(e) => set('category', e.target.value as ConsumableData['category'])}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Level">
          <input className={inputCls} type="number" min={1} max={30} value={form.level} onChange={(e) => set('level', Number(e.target.value))} />
        </Field>
        <Field label="Cost (gp)">
          <input className={inputCls} type="number" min={0} value={form.cost} onChange={(e) => set('cost', Number(e.target.value))} />
        </Field>
        <Field label="Weight (lb)">
          <input className={inputCls} type="number" min={0} step={0.1} value={form.weight} onChange={(e) => set('weight', Number(e.target.value))} />
        </Field>
      </div>
      <Field label="Effect" required>
        <textarea className={textareaCls} value={form.effect} onChange={(e) => set('effect', e.target.value)} placeholder="What happens when consumed" rows={3} />
      </Field>
    </EditorLayout>
  );
}
