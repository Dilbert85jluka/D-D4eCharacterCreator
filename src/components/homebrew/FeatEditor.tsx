import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { FeatData } from '../../types/gameData';

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

export function FeatEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as FeatData | undefined;

  const [form, setForm] = useState<FeatData>(existing ? { ...existing } : defaults());
  const [prereqRace, setPrereqRace] = useState(existing?.prerequisites.race?.join(', ') ?? '');
  const [prereqClass, setPrereqClass] = useState(existing?.prerequisites.class?.join(', ') ?? '');
  const [prereqSkill, setPrereqSkill] = useState(existing?.prerequisites.trainedSkill?.join(', ') ?? '');
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  const set = <K extends keyof FeatData>(key: K, val: FeatData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0 && form.benefit.trim().length > 0;

  const handleSave = async () => {
    const race = prereqRace.split(',').map((s) => s.trim()).filter(Boolean);
    const cls = prereqClass.split(',').map((s) => s.trim()).filter(Boolean);
    const skill = prereqSkill.split(',').map((s) => s.trim()).filter(Boolean);

    const data: FeatData = {
      ...form,
      id: existing?.id ?? '',
      prerequisites: {
        ...form.prerequisites,
        ...(race.length ? { race } : {}),
        ...(cls.length ? { class: cls } : {}),
        ...(skill.length ? { trainedSkill: skill } : {}),
      },
    };

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
          <Field label="Race (comma-separated IDs)">
            <input className={inputCls} value={prereqRace} onChange={(e) => setPrereqRace(e.target.value)} placeholder="e.g. human, elf" />
          </Field>
          <Field label="Class (comma-separated IDs)">
            <input className={inputCls} value={prereqClass} onChange={(e) => setPrereqClass(e.target.value)} placeholder="e.g. fighter, paladin" />
          </Field>
          <Field label="Trained Skill (comma-separated IDs)">
            <input className={inputCls} value={prereqSkill} onChange={(e) => setPrereqSkill(e.target.value)} placeholder="e.g. athletics, endurance" />
          </Field>
        </div>
      </div>
    </EditorLayout>
  );
}
