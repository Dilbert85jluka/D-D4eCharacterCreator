import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { TierEditor } from './TierEditor';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { MagicImplementData, ImplementType } from '../../types/gameData';

const IMPLEMENT_TYPES: ImplementType[] = ['Holy Symbol', 'Orb', 'Rod', 'Staff', 'Wand', 'Totem', 'Ki Focus', 'Tome'];
const RARITIES = ['Common', 'Uncommon', 'Rare'] as const;

function defaults(): MagicImplementData {
  return {
    id: '', name: '', type: 'Wand', enhancementType: 'attack rolls and damage rolls',
    tiers: [{ level: 1, enhancement: 1, cost: 360 }], rarity: 'Uncommon', source: 'Homebrew',
  };
}

export function MagicImplementEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as MagicImplementData | undefined;

  const [form, setForm] = useState<MagicImplementData>(existing ? { ...existing } : defaults());
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof MagicImplementData>(key: K, val: MagicImplementData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0 && form.tiers.length > 0;

  const handleSave = async () => {
    const data: MagicImplementData = { ...form, id: existing?.id ?? '' };
    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({ contentType: 'magicImplement', name: data.name, createdBy: userId, campaignIds, data: { ...data, id: '' } });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout title={editingItem ? 'Edit Magic Implement' : 'New Magic Implement'} campaignIds={campaignIds} onCampaignToggle={toggleCampaign} onSave={handleSave} onCancel={onClose} canSave={canSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Magic implement name" />
        </Field>
        <Field label="Implement Type">
          <select className={selectCls} value={form.type} onChange={(e) => set('type', e.target.value as ImplementType)}>
            {IMPLEMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Rarity">
          <select className={selectCls} value={form.rarity} onChange={(e) => set('rarity', e.target.value as typeof RARITIES[number])}>
            {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Enhancement Type">
          <input className={inputCls} value={form.enhancementType} onChange={(e) => set('enhancementType', e.target.value)} />
        </Field>
      </div>
      <Field label="Critical">
        <input className={inputCls} value={form.critical ?? ''} onChange={(e) => set('critical', e.target.value)} placeholder="e.g. +1d8 damage per plus" />
      </Field>
      <Field label="Property">
        <textarea className={textareaCls} value={form.property ?? ''} onChange={(e) => set('property', e.target.value)} placeholder="Passive bonus" rows={2} />
      </Field>
      <Field label="Power">
        <textarea className={textareaCls} value={form.power ?? ''} onChange={(e) => set('power', e.target.value)} placeholder="Activatable power text" rows={3} />
      </Field>
      <TierEditor tiers={form.tiers} onChange={(tiers) => set('tiers', tiers)} />
    </EditorLayout>
  );
}
