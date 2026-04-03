import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { TierEditor } from './TierEditor';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { MagicWeaponData } from '../../types/gameData';

const RARITIES = ['Common', 'Uncommon', 'Rare'] as const;

/** Preset options that cover broad weapon categories */
const PRESET_OPTIONS = ['Any', 'Any melee', 'Any ranged'] as const;

/** Weapon groups used in official magic weapon data */
const WEAPON_GROUPS = [
  'Axe', 'Bow', 'Crossbow', 'Flail', 'Hammer', 'Heavy blade', 'Heavy thrown',
  'Light blade', 'Light thrown', 'Mace', 'Pick', 'Polearm', 'Sling', 'Spear', 'Staff',
] as const;

const ENHANCEMENT_TYPES = [
  { value: 'attack rolls and damage rolls', label: 'Attack rolls and damage rolls' },
] as const;

function defaults(): MagicWeaponData {
  return {
    id: '', name: '', description: '', weaponTypes: 'Any', enhancementType: 'attack rolls and damage rolls',
    tiers: [{ level: 1, enhancement: 1, cost: 360 }], rarity: 'Uncommon', source: 'Homebrew',
  };
}

/** Convert the stored weaponTypes value to our UI mode + selected list */
function parseWeaponTypes(val: MagicWeaponData['weaponTypes']): { mode: 'preset' | 'specific'; preset: string; selected: string[] } {
  if (val === 'Any') return { mode: 'preset', preset: 'Any', selected: [] };
  if (val === 'Any melee') return { mode: 'preset', preset: 'Any melee', selected: [] };
  if (val === 'Any ranged') return { mode: 'preset', preset: 'Any ranged', selected: [] };
  return { mode: 'specific', preset: '', selected: val as string[] };
}

export function MagicWeaponEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as MagicWeaponData | undefined;

  const [form, setForm] = useState<MagicWeaponData>(existing ? { ...existing } : defaults());
  const parsed = parseWeaponTypes(existing?.weaponTypes ?? 'Any');
  const [weaponMode, setWeaponMode] = useState<'preset' | 'specific'>(parsed.mode);
  const [weaponPreset, setWeaponPreset] = useState(parsed.preset || 'Any');
  const [selectedGroups, setSelectedGroups] = useState<string[]>(parsed.selected);
  const [pendingGroup, setPendingGroup] = useState('');
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof MagicWeaponData>(key: K, val: MagicWeaponData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0 && form.tiers.length > 0;

  const addWeaponGroup = () => {
    if (pendingGroup && !selectedGroups.includes(pendingGroup)) {
      setSelectedGroups((prev) => [...prev, pendingGroup]);
    }
    setPendingGroup('');
  };

  const removeWeaponGroup = (group: string) => {
    setSelectedGroups((prev) => prev.filter((g) => g !== group));
  };

  const availableGroups = WEAPON_GROUPS.filter((g) => !selectedGroups.includes(g));

  const handleSave = async () => {
    let weaponTypes: MagicWeaponData['weaponTypes'];
    if (weaponMode === 'preset') {
      weaponTypes = weaponPreset as 'Any' | 'Any melee' | 'Any ranged';
    } else {
      weaponTypes = selectedGroups.length > 0 ? selectedGroups : ['Heavy blade'];
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
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setWeaponMode('preset'); setWeaponPreset('Any'); }}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors min-h-[36px] ${weaponMode === 'preset' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                Preset
              </button>
              <button
                type="button"
                onClick={() => setWeaponMode('specific')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors min-h-[36px] ${weaponMode === 'specific' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                Specific Groups
              </button>
            </div>
            {weaponMode === 'preset' && (
              <select className={selectCls} value={weaponPreset} onChange={(e) => setWeaponPreset(e.target.value)}>
                {PRESET_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            )}
            {weaponMode === 'specific' && (
              <>
                <div className="flex gap-2">
                  <select
                    className={selectCls}
                    value={pendingGroup}
                    onChange={(e) => setPendingGroup(e.target.value)}
                  >
                    <option value="">Select weapon group…</option>
                    {availableGroups.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={addWeaponGroup}
                    disabled={!pendingGroup}
                    className="px-3 py-2 rounded-lg bg-amber-600 text-white font-semibold text-sm hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0 min-h-[44px]"
                  >
                    + Add
                  </button>
                </div>
                {selectedGroups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGroups.map((group) => (
                      <span
                        key={group}
                        className="inline-flex items-center gap-1 text-sm bg-stone-100 border border-stone-200 text-stone-700 px-2.5 py-1 rounded-lg"
                      >
                        {group}
                        <button
                          type="button"
                          onClick={() => removeWeaponGroup(group)}
                          className="text-stone-400 hover:text-red-500 transition-colors text-base leading-none ml-0.5"
                          title={`Remove ${group}`}
                        >×</button>
                      </span>
                    ))}
                  </div>
                )}
                {selectedGroups.length === 0 && (
                  <p className="text-xs text-stone-400">No weapon groups selected yet.</p>
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
