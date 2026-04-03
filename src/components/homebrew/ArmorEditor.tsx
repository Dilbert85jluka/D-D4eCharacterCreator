import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { ArmorData, ArmorType } from '../../types/gameData';

const ARMOR_TYPES: ArmorType[] = ['Cloth', 'Leather', 'Hide', 'Chainmail', 'Scale', 'Plate', 'Shield'];

function defaults(): ArmorData {
  return { id: '', name: '', type: 'Leather', acBonus: 2, checkPenalty: 0, speedPenalty: 0, cost: 25, weight: 15 };
}

export function ArmorEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as ArmorData | undefined;

  const [form, setForm] = useState<ArmorData>(existing ? { ...existing } : defaults());
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof ArmorData>(key: K, val: ArmorData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0;

  const handleSave = async () => {
    const data: ArmorData = { ...form, id: existing?.id ?? '' };
    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({ contentType: 'armor', name: data.name, createdBy: userId, campaignIds, data: { ...data, id: '' } });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout title={editingItem ? 'Edit Armor' : 'New Armor'} campaignIds={campaignIds} onCampaignToggle={toggleCampaign} onSave={handleSave} onCancel={onClose} canSave={canSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Armor name" />
        </Field>
        <Field label="Type">
          <select className={selectCls} value={form.type} onChange={(e) => set('type', e.target.value as ArmorType)}>
            {ARMOR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="AC Bonus">
          <input className={inputCls} type="number" min={0} value={form.acBonus} onChange={(e) => set('acBonus', Number(e.target.value))} />
        </Field>
        <Field label="Check Penalty">
          <input className={inputCls} type="number" max={0} value={form.checkPenalty} onChange={(e) => set('checkPenalty', Number(e.target.value))} />
        </Field>
        <Field label="Speed Penalty">
          <input className={inputCls} type="number" max={0} value={form.speedPenalty} onChange={(e) => set('speedPenalty', Number(e.target.value))} />
        </Field>
        <Field label="Min Strength">
          <input className={inputCls} type="number" min={0} value={form.minStrength ?? ''} onChange={(e) => set('minStrength', e.target.value ? Number(e.target.value) : undefined)} />
        </Field>
        <Field label="Cost (gp)">
          <input className={inputCls} type="number" min={0} value={form.cost} onChange={(e) => set('cost', Number(e.target.value))} />
        </Field>
        <Field label="Weight (lb)">
          <input className={inputCls} type="number" min={0} value={form.weight} onChange={(e) => set('weight', Number(e.target.value))} />
        </Field>
      </div>
    </EditorLayout>
  );
}
