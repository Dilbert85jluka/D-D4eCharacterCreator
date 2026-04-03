import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { PowerData, PowerUsage, PowerAction } from '../../types/gameData';
import type { Ability } from '../../types/character';
import { CLASSES } from '../../data/classes';

const USAGE_OPTIONS: PowerUsage[] = ['at-will', 'encounter', 'daily'];
const ACTION_OPTIONS: PowerAction[] = ['standard', 'move', 'minor', 'free', 'immediate-interrupt', 'immediate-reaction', 'opportunity'];
const POWER_TYPES = ['attack', 'utility', 'channel-divinity'] as const;
const ABILITIES: Ability[] = ['str', 'con', 'dex', 'int', 'wis', 'cha'];
const DEFENSES = ['AC', 'Fortitude', 'Reflex', 'Will'] as const;

/** All official D&D 4e power keywords (alphabetical) */
const KEYWORDS = [
  'Acid', 'Arcane', 'BeastForm', 'ChannelDivinity', 'Charm', 'Cold', 'Conjuration',
  'Divine', 'Enchantment', 'Evocation', 'Fear', 'Fire', 'Force', 'FullDiscipline',
  'Healing', 'Illusion', 'Implement', 'Lightning', 'Martial', 'Necrotic', 'Poison',
  'Polymorph', 'Primal', 'Psionic', 'Psychic', 'Radiant', 'Rage', 'Reliable',
  'Runic', 'Sleep', 'Spirit', 'Stance', 'Summoning', 'Teleportation', 'Thunder',
  'Varies', 'Weapon', 'Zone',
] as const;

/** Range type prefixes — some need a value, some are standalone */
const RANGE_TYPES = [
  { value: 'Melee weapon', label: 'Melee weapon', needsValue: false },
  { value: 'Melee touch', label: 'Melee touch', needsValue: false },
  { value: 'Melee', label: 'Melee', needsValue: true },
  { value: 'Ranged weapon', label: 'Ranged weapon', needsValue: false },
  { value: 'Ranged sight', label: 'Ranged sight', needsValue: false },
  { value: 'Ranged', label: 'Ranged', needsValue: true },
  { value: 'Close burst', label: 'Close burst', needsValue: true },
  { value: 'Close blast', label: 'Close blast', needsValue: true },
  { value: 'Area burst', label: 'Area burst', needsValue: true },
  { value: 'Area wall', label: 'Area wall', needsValue: true },
  { value: 'Personal', label: 'Personal', needsValue: false },
  { value: 'Melee or Ranged weapon', label: 'Melee or Ranged weapon', needsValue: false },
] as const;

/** Parse a range string like "Ranged 10" into { type: 'Ranged', value: '10' } */
function parseRange(range?: string): { type: string; value: string } {
  if (!range) return { type: 'Melee weapon', value: '' };
  // Try matching longest prefix first
  const sorted = [...RANGE_TYPES].sort((a, b) => b.value.length - a.value.length);
  for (const rt of sorted) {
    if (range.startsWith(rt.value)) {
      const rest = range.slice(rt.value.length).trim();
      return { type: rt.value, value: rest };
    }
  }
  return { type: 'Melee weapon', value: range };
}

function defaults(): PowerData {
  return {
    id: '',
    name: '',
    classId: 'fighter',
    level: 1,
    usage: 'encounter',
    powerType: 'attack',
    actionType: 'standard',
    range: '',
    keywords: [],
    flavor: '',
    target: '',
    attack: '',
    hit: '',
    miss: '',
    effect: '',
    special: '',
    requirement: '',
    trigger: '',
  };
}

export function PowerEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as PowerData | undefined;

  const [form, setForm] = useState<PowerData>(existing ? { ...existing } : defaults());
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(existing?.keywords ?? []);
  const [pendingKeyword, setPendingKeyword] = useState('');
  const parsedRange = parseRange(existing?.range);
  const [rangeType, setRangeType] = useState(parsedRange.type);
  const [rangeValue, setRangeValue] = useState(parsedRange.value);
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof PowerData>(key: K, val: PowerData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0;

  const addKeyword = () => {
    if (pendingKeyword && !selectedKeywords.includes(pendingKeyword)) {
      setSelectedKeywords((prev) => [...prev, pendingKeyword]);
    }
    setPendingKeyword('');
  };

  const removeKeyword = (kw: string) => {
    setSelectedKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const availableKeywords = KEYWORDS.filter((k) => !selectedKeywords.includes(k));

  const currentRangeType = RANGE_TYPES.find((rt) => rt.value === rangeType);
  const needsValue = currentRangeType?.needsValue ?? false;

  const handleSave = async () => {
    const range = needsValue && rangeValue
      ? `${rangeType} ${rangeValue}`
      : rangeType;

    const data: PowerData = {
      ...form,
      id: existing?.id ?? '',
      keywords: selectedKeywords,
      range,
    };

    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({
        contentType: 'power',
        name: data.name,
        createdBy: userId,
        campaignIds,
        data: { ...data, id: '' },
      });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout
      title={editingItem ? 'Edit Power' : 'New Power'}
      campaignIds={campaignIds}
      onCampaignToggle={toggleCampaign}
      onSave={handleSave}
      onCancel={onClose}
      canSave={canSave}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Power name" />
        </Field>
        <Field label="Class">
          <select className={selectCls} value={form.classId} onChange={(e) => set('classId', e.target.value)}>
            {CLASSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Level">
          <input className={inputCls} type="number" min={1} max={30} value={form.level} onChange={(e) => set('level', Number(e.target.value))} />
        </Field>
        <Field label="Usage">
          <select className={selectCls} value={form.usage} onChange={(e) => set('usage', e.target.value as PowerUsage)}>
            {USAGE_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
        <Field label="Power Type">
          <select className={selectCls} value={form.powerType ?? 'attack'} onChange={(e) => set('powerType', e.target.value as typeof POWER_TYPES[number])}>
            {POWER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Action Type">
          <select className={selectCls} value={form.actionType} onChange={(e) => set('actionType', e.target.value as PowerAction)}>
            {ACTION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Field>
      </div>

      {/* Range — structured dropdown + value */}
      <Field label="Range">
        <div className="flex gap-2 items-start">
          <select
            className={selectCls}
            value={rangeType}
            onChange={(e) => { setRangeType(e.target.value); setRangeValue(''); }}
          >
            {RANGE_TYPES.map((rt) => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
          </select>
          {needsValue && (
            <input
              className={inputCls + ' !w-24 flex-shrink-0'}
              type="text"
              value={rangeValue}
              onChange={(e) => setRangeValue(e.target.value)}
              placeholder="e.g. 10"
            />
          )}
        </div>
      </Field>

      {/* Keywords — dropdown + add + tags */}
      <Field label="Keywords">
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              className={selectCls}
              value={pendingKeyword}
              onChange={(e) => setPendingKeyword(e.target.value)}
            >
              <option value="">Select a keyword…</option>
              {availableKeywords.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <button
              type="button"
              onClick={addKeyword}
              disabled={!pendingKeyword}
              className="px-3 py-2 rounded-lg bg-amber-600 text-white font-semibold text-sm hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0 min-h-[44px]"
            >
              + Add
            </button>
          </div>
          {selectedKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 text-sm bg-stone-100 border border-stone-200 text-stone-700 px-2.5 py-1 rounded-lg"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="text-stone-400 hover:text-red-500 transition-colors text-base leading-none ml-0.5"
                    title={`Remove ${kw}`}
                  >×</button>
                </span>
              ))}
            </div>
          )}
          {selectedKeywords.length === 0 && (
            <p className="text-xs text-stone-400">No keywords added yet.</p>
          )}
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Attack Ability">
          <select className={selectCls} value={form.attackAbility ?? ''} onChange={(e) => set('attackAbility', (e.target.value || undefined) as Ability | undefined)}>
            <option value="">None</option>
            {ABILITIES.map((a) => <option key={a} value={a}>{a.toUpperCase()}</option>)}
          </select>
        </Field>
        <Field label="Defense">
          <select className={selectCls} value={form.defense ?? ''} onChange={(e) => set('defense', (e.target.value || undefined) as typeof DEFENSES[number] | undefined)}>
            <option value="">None</option>
            {DEFENSES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Flavor Text">
        <textarea className={textareaCls} value={form.flavor ?? ''} onChange={(e) => set('flavor', e.target.value)} placeholder="Descriptive flavor text" rows={2} />
      </Field>
      <Field label="Requirement">
        <input className={inputCls} value={form.requirement ?? ''} onChange={(e) => set('requirement', e.target.value)} placeholder="e.g. You must be wielding a heavy blade" />
      </Field>
      <Field label="Trigger">
        <input className={inputCls} value={form.trigger ?? ''} onChange={(e) => set('trigger', e.target.value)} placeholder="For immediate/opportunity actions" />
      </Field>
      <Field label="Target">
        <input className={inputCls} value={form.target ?? ''} onChange={(e) => set('target', e.target.value)} placeholder="e.g. One creature" />
      </Field>
      <Field label="Attack">
        <input className={inputCls} value={form.attack ?? ''} onChange={(e) => set('attack', e.target.value)} placeholder="e.g. Strength vs. AC" />
      </Field>
      <Field label="Hit">
        <textarea className={textareaCls} value={form.hit ?? ''} onChange={(e) => set('hit', e.target.value)} placeholder="e.g. 2[W] + Strength modifier damage" rows={2} />
      </Field>
      <Field label="Miss">
        <input className={inputCls} value={form.miss ?? ''} onChange={(e) => set('miss', e.target.value)} placeholder="e.g. Half damage" />
      </Field>
      <Field label="Effect">
        <textarea className={textareaCls} value={form.effect ?? ''} onChange={(e) => set('effect', e.target.value)} placeholder="Additional effect text" rows={2} />
      </Field>
      <Field label="Special">
        <input className={inputCls} value={form.special ?? ''} onChange={(e) => set('special', e.target.value)} />
      </Field>
    </EditorLayout>
  );
}
