import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { TierEditor } from './TierEditor';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { MagicWeaponData } from '../../types/gameData';

const RARITIES = ['Common', 'Uncommon', 'Rare'] as const;

function defaults(): MagicWeaponData {
  return {
    id: '', name: '', description: '', weaponTypes: 'Any', enhancementType: 'attack rolls and damage rolls',
    tiers: [{ level: 1, enhancement: 1, cost: 360 }], rarity: 'Uncommon', source: 'Homebrew',
  };
}

export function MagicWeaponEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as MagicWeaponData | undefined;

  const [form, setForm] = useState<MagicWeaponData>(existing ? { ...existing } : defaults());
  const [weaponTypesText, setWeaponTypesText] = useState(
    existing ? (typeof existing.weaponTypes === 'string' ? existing.weaponTypes : existing.weaponTypes.join(', ')) : 'Any'
  );
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof MagicWeaponData>(key: K, val: MagicWeaponData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0 && form.tiers.length > 0;

  const handleSave = async () => {
    let weaponTypes: MagicWeaponData['weaponTypes'];
    const txt = weaponTypesText.trim();
    if (txt === 'Any' || txt === 'Any melee' || txt === 'Any ranged') {
      weaponTypes = txt as 'Any' | 'Any melee' | 'Any ranged';
    } else {
      weaponTypes = txt.split(',').map((s) => s.trim()).filter(Boolean);
    }

    const data: MagicWeaponData = { ...form, id: existing?.id ?? '', weaponTypes };
    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({ contentType: 'magicWeapon', name: data.name, createdBy: userId, campaignIds, data: { ...data, id: '' } });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout title={editingItem ? 'Edit Magic Weapon' : 'New Magic Weapon'} campaignIds={campaignIds} onCampaignToggle={toggleCampaign} onSave={handleSave} onCancel={onClose} canSave={canSave}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Magic weapon name" />
        </Field>
        <Field label="Rarity">
          <select className={selectCls} value={form.rarity} onChange={(e) => set('rarity', e.target.value as typeof RARITIES[number])}>
            {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Weapon Types">
          <input className={inputCls} value={weaponTypesText} onChange={(e) => setWeaponTypesText(e.target.value)} placeholder="Any, Any melee, Any ranged, or specific types" />
        </Field>
        <Field label="Enhancement Type">
          <input className={inputCls} value={form.enhancementType} onChange={(e) => set('enhancementType', e.target.value)} />
        </Field>
      </div>
      <Field label="Description">
        <textarea className={textareaCls} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Flavor description" rows={2} />
      </Field>
      <Field label="Critical">
        <input className={inputCls} value={form.critical ?? ''} onChange={(e) => set('critical', e.target.value)} placeholder="e.g. +1d6 fire damage per plus" />
      </Field>
      <Field label="Property">
        <textarea className={textareaCls} value={form.property ?? ''} onChange={(e) => set('property', e.target.value)} placeholder="Passive bonus when wielded" rows={2} />
      </Field>
      <Field label="Power">
        <textarea className={textareaCls} value={form.power ?? ''} onChange={(e) => set('power', e.target.value)} placeholder="Activatable power text" rows={3} />
      </Field>
      <Field label="Special">
        <input className={inputCls} value={form.special ?? ''} onChange={(e) => set('special', e.target.value)} />
      </Field>
      <TierEditor tiers={form.tiers} onChange={(tiers) => set('tiers', tiers)} />
    </EditorLayout>
  );
}
