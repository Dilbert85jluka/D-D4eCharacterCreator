import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { TierEditor } from './TierEditor';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { MagicArmorData, ArmorType } from '../../types/gameData';

const ARMOR_TYPES: ArmorType[] = ['Cloth', 'Leather', 'Hide', 'Chainmail', 'Scale', 'Plate', 'Shield'];
const RARITIES = ['Common', 'Uncommon', 'Rare'] as const;

function defaults(): MagicArmorData {
  return {
    id: '', name: '', description: '', armorTypes: 'Any', enhancementType: 'AC',
    tiers: [{ level: 1, enhancement: 1, cost: 360 }], rarity: 'Uncommon', source: 'Homebrew',
  };
}

export function MagicArmorEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as MagicArmorData | undefined;

  const [form, setForm] = useState<MagicArmorData>(existing ? { ...existing } : defaults());
  const [armorTypesText, setArmorTypesText] = useState(
    existing ? (typeof existing.armorTypes === 'string' ? existing.armorTypes : existing.armorTypes.join(', ')) : 'Any'
  );
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof MagicArmorData>(key: K, val: MagicArmorData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0 && form.tiers.length > 0;

  const handleSave = async () => {
    let armorTypes: MagicArmorData['armorTypes'];
    const txt = armorTypesText.trim();
    if (txt === 'Any' || txt === 'Any shield') {
      armorTypes = txt as 'Any' | 'Any shield';
    } else {
      armorTypes = txt.split(',').map((s) => s.trim()).filter(Boolean) as ArmorType[];
    }

    const data: MagicArmorData = { ...form, id: existing?.id ?? '', armorTypes };
    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({ contentType: 'magicArmor', name: data.name, createdBy: userId, campaignIds, data: { ...data, id: '' } });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout title={editingItem ? 'Edit Magic Armor' : 'New Magic Armor'} campaignIds={campaignIds} onCampaignToggle={toggleCampaign} onSave={handleSave} onCancel={onClose} canSave={canSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Magic armor name" />
        </Field>
        <Field label="Rarity">
          <select className={selectCls} value={form.rarity} onChange={(e) => set('rarity', e.target.value as typeof RARITIES[number])}>
            {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Armor Types">
          <input className={inputCls} value={armorTypesText} onChange={(e) => setArmorTypesText(e.target.value)} placeholder="Any, Any shield, or Cloth, Leather, etc." />
          <p className="text-xs text-stone-400 mt-0.5">"{ARMOR_TYPES.join('", "')}", "Any", or "Any shield"</p>
        </Field>
        <Field label="Enhancement Type">
          <input className={inputCls} value={form.enhancementType} onChange={(e) => set('enhancementType', e.target.value)} placeholder="e.g. AC" />
        </Field>
      </div>
      <Field label="Description">
        <textarea className={textareaCls} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Flavor description" rows={2} />
      </Field>
      <Field label="Property">
        <textarea className={textareaCls} value={form.property ?? ''} onChange={(e) => set('property', e.target.value)} placeholder="Passive bonus when worn" rows={2} />
      </Field>
      <Field label="Power">
        <textarea className={textareaCls} value={form.power ?? ''} onChange={(e) => set('power', e.target.value)} placeholder="Activatable power text" rows={3} />
      </Field>
      <TierEditor tiers={form.tiers} onChange={(tiers) => set('tiers', tiers)} />
    </EditorLayout>
  );
}
