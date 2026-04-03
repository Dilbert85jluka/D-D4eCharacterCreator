import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { FeatData } from '../../types/gameData';
import { RACES } from '../../data/races';
import { CLASSES } from '../../data/classes';
import { SKILLS } from '../../data/skills';

const TIERS = ['Heroic', 'Paragon', 'Epic'] as const;

function defaults(): FeatData {
  return {
    id: '',
    name: '',
    tier: 'Heroic',
    prerequisites: {},
    benefit: '',
    special: '',
  };
}

/** Reusable dropdown + add + tag list for prerequisite arrays */
function PrereqPicker({ items, selected, onAdd, onRemove, placeholder }: {
  items: { id: string; name: string }[];
  selected: string[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  placeholder: string;
}) {
  const [pending, setPending] = useState('');
  const available = items.filter((i) => !selected.includes(i.id));
  const resolve = (id: string) => items.find((i) => i.id === id)?.name ?? id;

  const handleAdd = () => {
    if (pending) { onAdd(pending); setPending(''); }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          className={selectCls}
          value={pending}
          onChange={(e) => setPending(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {available.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!pending}
          className="px-3 py-2 rounded-lg bg-amber-600 text-white font-semibold text-sm hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0 min-h-[44px]"
        >
          + Add
        </button>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 text-sm bg-stone-100 border border-stone-200 text-stone-700 px-2.5 py-1 rounded-lg"
            >
              {resolve(id)}
              <button
                type="button"
                onClick={() => onRemove(id)}
                className="text-stone-400 hover:text-red-500 transition-colors text-base leading-none ml-0.5"
                title={`Remove ${resolve(id)}`}
              >×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function FeatEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as FeatData | undefined;

  const [form, setForm] = useState<FeatData>(existing ? { ...existing } : defaults());
  const [selectedRaces, setSelectedRaces] = useState<string[]>(existing?.prerequisites.race ?? []);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(existing?.prerequisites.class ?? []);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(existing?.prerequisites.trainedSkill ?? []);
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof FeatData>(key: K, val: FeatData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0 && form.benefit.trim().length > 0;

  const handleSave = async () => {
    const data: FeatData = {
      ...form,
      id: existing?.id ?? '',
      prerequisites: {
        ...form.prerequisites,
        ...(selectedRaces.length ? { race: selectedRaces } : {}),
        ...(selectedClasses.length ? { class: selectedClasses } : {}),
        ...(selectedSkills.length ? { trainedSkill: selectedSkills } : {}),
      },
    };
    // Clean empty prerequisite keys
    if (!selectedRaces.length) delete data.prerequisites.race;
    if (!selectedClasses.length) delete data.prerequisites.class;
    if (!selectedSkills.length) delete data.prerequisites.trainedSkill;

    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({
        contentType: 'feat',
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
      title={editingItem ? 'Edit Feat' : 'New Feat'}
      campaignIds={campaignIds}
      onCampaignToggle={toggleCampaign}
      onSave={handleSave}
      onCancel={onClose}
      canSave={canSave}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Feat name" />
        </Field>
        <Field label="Tier">
          <select className={selectCls} value={form.tier} onChange={(e) => set('tier', e.target.value as typeof TIERS[number])}>
            {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Benefit" required>
        <textarea className={textareaCls} value={form.benefit} onChange={(e) => set('benefit', e.target.value)} placeholder="What this feat does" rows={3} />
      </Field>
      <Field label="Special">
        <input className={inputCls} value={form.special ?? ''} onChange={(e) => set('special', e.target.value)} placeholder="e.g. You can select this feat more than once" />
      </Field>
      <div className="border-t border-stone-200 pt-3 mt-2">
        <p className="text-sm font-semibold text-stone-600 mb-2">Prerequisites (optional)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Min Level">
            <input className={inputCls} type="number" min={1} max={30} value={form.prerequisites.minLevel ?? ''} onChange={(e) => set('prerequisites', { ...form.prerequisites, minLevel: e.target.value ? Number(e.target.value) : undefined })} />
          </Field>
        </div>
        <div className="mt-4 space-y-4">
          <Field label="Race">
            <PrereqPicker
              items={RACES.map((r) => ({ id: r.id, name: r.name }))}
              selected={selectedRaces}
              onAdd={(id) => setSelectedRaces((prev) => [...prev, id])}
              onRemove={(id) => setSelectedRaces((prev) => prev.filter((r) => r !== id))}
              placeholder="Select a race…"
            />
          </Field>
          <Field label="Class">
            <PrereqPicker
              items={CLASSES.map((c) => ({ id: c.id, name: c.name }))}
              selected={selectedClasses}
              onAdd={(id) => setSelectedClasses((prev) => [...prev, id])}
              onRemove={(id) => setSelectedClasses((prev) => prev.filter((c) => c !== id))}
              placeholder="Select a class…"
            />
          </Field>
          <Field label="Trained Skill">
            <PrereqPicker
              items={SKILLS.map((s) => ({ id: s.id, name: s.name }))}
              selected={selectedSkills}
              onAdd={(id) => setSelectedSkills((prev) => [...prev, id])}
              onRemove={(id) => setSelectedSkills((prev) => prev.filter((s) => s !== id))}
              placeholder="Select a skill…"
            />
          </Field>
        </div>
      </div>
    </EditorLayout>
  );
}
