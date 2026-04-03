import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { TierEditor } from './TierEditor';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { MagicArmorData, ArmorType } from '../../types/gameData';

const ARMOR_TYPES: ArmorType[] = ['Cloth', 'Leather', 'Hide', 'Chainmail', 'Scale', 'Plate', 'Shield'];
const RARITIES = ['Common', 'Uncommon', 'Rare'] as const;

/** Preset options that cover all or a subset of armor types */
const PRESET_OPTIONS = ['Any', 'Any shield'] as const;

const ENHANCEMENT_TYPES = [
  { value: 'AC', label: 'AC' },
] as const;

function defaults(): MagicArmorData {
  return {
    id: '', name: '', description: '', armorTypes: 'Any', enhancementType: 'AC',
    tiers: [{ level: 1, enhancement: 1, cost: 360 }], rarity: 'Uncommon', source: 'Homebrew',
  };
}

/** Convert the stored armorTypes value to our UI mode + selected list */
function parseArmorTypes(val: MagicArmorData['armorTypes']): { mode: 'preset' | 'specific'; preset: string; selected: ArmorType[] } {
  if (val === 'Any') return { mode: 'preset', preset: 'Any', selected: [] };
  if (val === 'Any shield') return { mode: 'preset', preset: 'Any shield', selected: [] };
  return { mode: 'specific', preset: '', selected: val as ArmorType[] };
}

export function MagicArmorEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as MagicArmorData | undefined;

  const [form, setForm] = useState<MagicArmorData>(existing ? { ...existing } : defaults());
  const parsed = parseArmorTypes(existing?.armorTypes ?? 'Any');
  const [armorMode, setArmorMode] = useState<'preset' | 'specific'>(parsed.mode);
  const [armorPreset, setArmorPreset] = useState(parsed.preset || 'Any');
  const [selectedTypes, setSelectedTypes] = useState<ArmorType[]>(parsed.selected);
  const [pendingType, setPendingType] = useState('');
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof MagicArmorData>(key: K, val: MagicArmorData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0 && form.tiers.length > 0;

  const addArmorType = () => {
    if (pendingType && !selectedTypes.includes(pendingType as ArmorType)) {
      setSelectedTypes((prev) => [...prev, pendingType as ArmorType]);
    }
    setPendingType('');
  };

  const removeArmorType = (type: ArmorType) => {
    setSelectedTypes((prev) => prev.filter((t) => t !== type));
  };

  const availableTypes = ARMOR_TYPES.filter((t) => !selectedTypes.includes(t));

  const handleSave = async () => {
    let armorTypes: MagicArmorData['armorTypes'];
    if (armorMode === 'preset') {
      armorTypes = armorPreset as 'Any' | 'Any shield';
    } else {
      armorTypes = selectedTypes.length > 0 ? selectedTypes : ['Cloth'];
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
          <div className="space-y-2">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setArmorMode('preset'); setArmorPreset('Any'); }}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors min-h-[36px] ${armorMode === 'preset' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                Preset
              </button>
              <button
                type="button"
                onClick={() => setArmorMode('specific')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors min-h-[36px] ${armorMode === 'specific' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                Specific Types
              </button>
            </div>
            {armorMode === 'preset' && (
              <select className={selectCls} value={armorPreset} onChange={(e) => setArmorPreset(e.target.value)}>
                {PRESET_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            )}
            {armorMode === 'specific' && (
              <>
                <div className="flex gap-2">
                  <select
                    className={selectCls}
                    value={pendingType}
                    onChange={(e) => setPendingType(e.target.value)}
                  >
                    <option value="">Select armor type…</option>
                    {availableTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={addArmorType}
                    disabled={!pendingType}
                    className="px-3 py-2 rounded-lg bg-amber-600 text-white font-semibold text-sm hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0 min-h-[44px]"
                  >
                    + Add
                  </button>
                </div>
                {selectedTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1 text-sm bg-stone-100 border border-stone-200 text-stone-700 px-2.5 py-1 rounded-lg"
                      >
                        {type}
                        <button
                          type="button"
                          onClick={() => removeArmorType(type)}
                          className="text-stone-400 hover:text-red-500 transition-colors text-base leading-none ml-0.5"
                          title={`Remove ${type}`}
                        >×</button>
                      </span>
                    ))}
                  </div>
                )}
                {selectedTypes.length === 0 && (
                  <p className="text-xs text-stone-400">No armor types selected yet.</p>
                )}
              </>
            )}
          </div>
        </Field>
        <Field label="Enhancement Type">
          <select className={selectCls} value={form.enhancementType} onChange={(e) => set('enhancementType', e.target.value)}>
            {ENHANCEMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
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
