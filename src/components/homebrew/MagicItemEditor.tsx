import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { TierEditor } from './TierEditor';
import { EnhancementTargetsPicker } from './EnhancementTargetsPicker';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { MagicItemData, MagicItemSlot, EnhancementTarget } from '../../types/gameData';
import { resolveEnhancementTargets } from '../../types/gameData';

const SLOTS: MagicItemSlot[] = ['head', 'neck', 'arms', 'hands', 'ring', 'waist', 'feet', 'companion', 'wondrous'];
const RARITIES = ['Common', 'Uncommon', 'Rare'] as const;

function defaults(): MagicItemData {
  return { id: '', name: '', slot: 'wondrous', tiers: [{ level: 1, enhancement: 0, cost: 360 }], rarity: 'Uncommon', source: 'Homebrew' };
}

export function MagicItemEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as MagicItemData | undefined;

  const [form, setForm] = useState<MagicItemData>(existing ? { ...existing } : defaults());
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof MagicItemData>(key: K, val: MagicItemData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Initialize the multi-target picker from the structured field if present,
  // otherwise parse the legacy enhancementType string (so editing an official
  // amulet shows the three NAD chips checked).
  const initialTargets: EnhancementTarget[] = resolveEnhancementTargets(form);
  const [targets, setTargets] = useState<EnhancementTarget[]>(initialTargets);

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0 && form.tiers.length > 0;

  const handleSave = async () => {
    const data: MagicItemData = {
      ...form,
      id: existing?.id ?? '',
      // Persist the structured targets and drop the legacy string so the runtime
      // reads from `enhancementTargets` only (and we don't keep stale text in sync).
      enhancementTargets: targets.length > 0 ? targets : undefined,
      enhancementType: undefined,
    };
    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({ contentType: 'magicItem', name: data.name, createdBy: userId, campaignIds, data: { ...data, id: '' } });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout title={editingItem ? 'Edit Magic Item' : 'New Magic Item'} campaignIds={campaignIds} onCampaignToggle={toggleCampaign} onSave={handleSave} onCancel={onClose} canSave={canSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Magic item name" />
        </Field>
        <Field label="Slot">
          <select className={selectCls} value={form.slot} onChange={(e) => set('slot', e.target.value as MagicItemSlot)}>
            {SLOTS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Rarity">
          <select className={selectCls} value={form.rarity} onChange={(e) => set('rarity', e.target.value as typeof RARITIES[number])}>
            {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Enhancement Bonus Targets">
        <EnhancementTargetsPicker
          value={targets}
          onChange={setTargets}
          hint="Each selected target receives the tier's enhancement number while this item is equipped. Pick multiple to grant several bonuses (e.g. +1 Will and +1 attack rolls)."
        />
      </Field>
      <Field label="Property">
        <textarea className={textareaCls} value={form.property ?? ''} onChange={(e) => set('property', e.target.value)} placeholder="Passive bonus when equipped" rows={2} />
      </Field>
      <Field label="Power">
        <textarea className={textareaCls} value={form.power ?? ''} onChange={(e) => set('power', e.target.value)} placeholder="Activatable power text" rows={3} />
      </Field>
      <TierEditor tiers={form.tiers} onChange={(tiers) => set('tiers', tiers)} />
    </EditorLayout>
  );
}
