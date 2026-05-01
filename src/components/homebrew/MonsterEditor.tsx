import { useRef, useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type {
  MonsterData, MonsterPower, MonsterRole, MonsterRoleModifier,
  MonsterSize, MonsterOrigin,
} from '../../types/monster';
import { processSquareImage, validateImageFile, MAX_IMAGE_FILE_BYTES } from '../../lib/imageProcessing';

const ROLES: MonsterRole[] = ['Brute', 'Soldier', 'Artillery', 'Lurker', 'Controller', 'Skirmisher', 'Solo', 'Minion'];
const ROLE_MODIFIERS: (MonsterRoleModifier | '')[] = ['', 'Elite', 'Solo', 'Minion'];
const SIZES: MonsterSize[] = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
const ORIGINS: MonsterOrigin[] = ['Natural', 'Fey', 'Shadow', 'Elemental', 'Immortal', 'Aberrant', 'Undead', 'Astral'];
const ALIGNMENTS = ['Lawful Good', 'Good', 'Unaligned', 'Evil', 'Chaotic Evil'] as const;
const ACTION_TYPES: MonsterPower['action'][] = ['Standard', 'Move', 'Minor', 'Free', 'Triggered', 'Trait', 'Aura'];

function defaults(): MonsterData {
  return {
    id: '',
    name: '',
    source: 'homebrew',
    level: 1,
    role: 'Soldier',
    xp: 100,
    size: 'Medium',
    origin: 'Natural',
    type: 'Humanoid',
    keywords: [],
    hp: 30,
    ac: 15,
    fort: 13,
    ref: 13,
    will: 13,
    initiative: 0,
    perception: 0,
    speed: '6',
    senses: [],
    resist: [],
    immune: [],
    vulnerable: [],
    powers: [],
    alignment: 'Unaligned',
    languages: [],
    description: '',
  };
}

/** Input whose value is a comma/semicolon-separated list rendered from a string array. */
function ListInput({ value, onChange, placeholder, separator = ',' }: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  separator?: ',' | ';';
}) {
  const sep = separator;
  return (
    <input
      className={inputCls}
      value={value.join(`${sep} `)}
      onChange={(e) => {
        const parts = e.target.value.split(sep).map((s) => s.trim()).filter(Boolean);
        onChange(parts);
      }}
      placeholder={placeholder}
    />
  );
}

export function MonsterEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as MonsterData | undefined;

  const [form, setForm] = useState<MonsterData>(existing ? { ...existing } : defaults());
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof MonsterData>(key: K, val: MonsterData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0;

  // ── Image upload ──────────────────────────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = '';
    if (!file) return;
    setImageError(null);

    const err = validateImageFile(file);
    if (err) { setImageError(err); return; }

    setImageProcessing(true);
    try {
      const dataUrl = await processSquareImage(file, { size: 300, quality: 0.88 });
      set('portrait', dataUrl);
    } catch (caught) {
      setImageError(caught instanceof Error ? caught.message : 'Failed to process image.');
    } finally {
      setImageProcessing(false);
    }
  };

  const removeImage = () => set('portrait', undefined);

  // ── Powers ────────────────────────────────────────────────────
  const addPower = () =>
    set('powers', [...form.powers, { name: '', action: 'Standard', description: '' }]);
  const updatePower = (idx: number, patch: Partial<MonsterPower>) =>
    set('powers', form.powers.map((p, i) => i === idx ? { ...p, ...patch } : p));
  const removePower = (idx: number) =>
    set('powers', form.powers.filter((_, i) => i !== idx));

  // ── Save ──────────────────────────────────────────────────────
  const handleSave = async () => {
    const data: MonsterData = { ...form, id: existing?.id ?? '', source: 'homebrew' };
    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({
        contentType: 'monster',
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
      title={editingItem ? 'Edit Monster' : 'New Monster'}
      campaignIds={campaignIds}
      onCampaignToggle={toggleCampaign}
      onSave={handleSave}
      onCancel={onClose}
      canSave={canSave}
    >
      {/* Portrait / Illustration */}
      <Field label="Illustration">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-xl border-2 border-stone-200 bg-stone-50 overflow-hidden flex items-center justify-center flex-shrink-0">
            {form.portrait ? (
              <img src={form.portrait} alt="Monster" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-stone-300 select-none">🐲</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={imageProcessing}
                className="px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 disabled:opacity-50 transition-colors min-h-[36px]"
              >
                {imageProcessing ? 'Processing…' : form.portrait ? 'Change Image' : 'Select Image'}
              </button>
              {form.portrait && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="px-3 py-1.5 text-xs font-semibold border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors min-h-[36px]"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              PNG, JPEG, GIF, or WebP. Max {Math.round(MAX_IMAGE_FILE_BYTES / (1024 * 1024))} MB.
              Will be center-cropped to a 300×300 square.
            </p>
            {imageError && <p className="text-xs text-red-600">{imageError}</p>}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </Field>

      {/* Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" required>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Orcish Warlord" />
        </Field>
        <Field label="Level">
          <input className={inputCls} type="number" min={1} max={40} value={form.level}
            onChange={(e) => set('level', Number(e.target.value))} />
        </Field>
        <Field label="Role">
          <select className={selectCls} value={form.role} onChange={(e) => set('role', e.target.value as MonsterRole)}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Role Modifier">
          <select className={selectCls} value={form.roleModifier ?? ''}
            onChange={(e) => set('roleModifier', (e.target.value || undefined) as MonsterRoleModifier | undefined)}>
            {ROLE_MODIFIERS.map((m) => <option key={m} value={m}>{m || '(none)'}</option>)}
          </select>
        </Field>
        <Field label="XP">
          <input className={inputCls} type="number" min={0} value={form.xp}
            onChange={(e) => set('xp', Number(e.target.value))} />
        </Field>
        <Field label="Size">
          <select className={selectCls} value={form.size} onChange={(e) => set('size', e.target.value as MonsterSize)}>
            {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Origin">
          <select className={selectCls} value={form.origin} onChange={(e) => set('origin', e.target.value as MonsterOrigin)}>
            {ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Type">
          <input className={inputCls} value={form.type} onChange={(e) => set('type', e.target.value)} placeholder="Humanoid, Magical Beast, Undead…" />
        </Field>
        <Field label="Alignment">
          <select className={selectCls} value={form.alignment}
            onChange={(e) => set('alignment', e.target.value as MonsterData['alignment'])}>
            {ALIGNMENTS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Field>
        <Field label="Keywords (comma-separated)">
          <ListInput value={form.keywords ?? []} onChange={(v) => set('keywords', v)}
            placeholder="Dragon, Goblinoid, Demon" />
        </Field>
      </div>

      {/* Defenses */}
      <div>
        <p className="text-sm font-bold text-stone-700 mb-2 pt-2 border-t border-stone-100">Defenses &amp; Stats</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Field label="HP">
            <input className={inputCls} type="number" min={1} value={form.hp} onChange={(e) => set('hp', Number(e.target.value))} />
          </Field>
          <Field label="AC">
            <input className={inputCls} type="number" value={form.ac} onChange={(e) => set('ac', Number(e.target.value))} />
          </Field>
          <Field label="Fort">
            <input className={inputCls} type="number" value={form.fort} onChange={(e) => set('fort', Number(e.target.value))} />
          </Field>
          <Field label="Ref">
            <input className={inputCls} type="number" value={form.ref} onChange={(e) => set('ref', Number(e.target.value))} />
          </Field>
          <Field label="Will">
            <input className={inputCls} type="number" value={form.will} onChange={(e) => set('will', Number(e.target.value))} />
          </Field>
          <Field label="Initiative">
            <input className={inputCls} type="number" value={form.initiative} onChange={(e) => set('initiative', Number(e.target.value))} />
          </Field>
          <Field label="Perception">
            <input className={inputCls} type="number" value={form.perception} onChange={(e) => set('perception', Number(e.target.value))} />
          </Field>
          <Field label="Speed">
            <input className={inputCls} value={form.speed} onChange={(e) => set('speed', e.target.value)} placeholder='6, fly 8 (clumsy)' />
          </Field>
        </div>
      </div>

      {/* Senses / resistances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Senses (comma-separated)">
          <ListInput value={form.senses ?? []} onChange={(v) => set('senses', v)}
            placeholder="Darkvision, Tremorsense 10" />
        </Field>
        <Field label="Languages (comma-separated)">
          <ListInput value={form.languages ?? []} onChange={(v) => set('languages', v)}
            placeholder="Common, Giant" />
        </Field>
        <Field label="Resist (comma-separated)">
          <ListInput value={form.resist ?? []} onChange={(v) => set('resist', v)}
            placeholder="10 fire, 5 cold" />
        </Field>
        <Field label="Immune (comma-separated)">
          <ListInput value={form.immune ?? []} onChange={(v) => set('immune', v)}
            placeholder="poison, fear, charm" />
        </Field>
        <Field label="Vulnerable (comma-separated)">
          <ListInput value={form.vulnerable ?? []} onChange={(v) => set('vulnerable', v)}
            placeholder="5 radiant" />
        </Field>
      </div>

      {/* Description */}
      <Field label="Flavor Description">
        <textarea
          className={textareaCls}
          value={form.description ?? ''}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          placeholder="Appearance, tactics, lore…"
        />
      </Field>

      {/* Powers */}
      <div>
        <div className="flex items-center justify-between mb-2 pt-2 border-t border-stone-100">
          <p className="text-sm font-bold text-stone-700">Powers / Abilities</p>
          <button
            type="button"
            onClick={addPower}
            className="px-3 py-1.5 text-xs font-semibold bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-colors min-h-[36px]"
          >
            + Add Power
          </button>
        </div>
        {form.powers.length === 0 && (
          <p className="text-sm text-stone-400 italic py-3 text-center border border-dashed border-stone-200 rounded-lg">
            No powers yet. Add a power, trait, or aura.
          </p>
        )}
        <div className="space-y-3">
          {form.powers.map((p, idx) => (
            <div key={idx} className="border border-stone-200 rounded-lg p-3 bg-stone-50 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Field label="Name">
                  <input className={inputCls} value={p.name} onChange={(e) => updatePower(idx, { name: e.target.value })} placeholder="Bite" />
                </Field>
                <Field label="Action">
                  <select className={selectCls} value={p.action} onChange={(e) => updatePower(idx, { action: e.target.value as MonsterPower['action'] })}>
                    {ACTION_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="Recharge">
                  <input className={inputCls} value={p.recharge ?? ''} onChange={(e) => updatePower(idx, { recharge: e.target.value || undefined })}
                    placeholder="Encounter / Recharge 5-6" />
                </Field>
              </div>
              <Field label="Keywords (comma-separated)">
                <ListInput value={p.keywords ?? []} onChange={(v) => updatePower(idx, { keywords: v })}
                  placeholder="Fire, Weapon" />
              </Field>
              <Field label="Description">
                <textarea className={textareaCls} value={p.description}
                  onChange={(e) => updatePower(idx, { description: e.target.value })} rows={2}
                  placeholder="Melee 1; +10 vs AC; 1d8+5 damage." />
              </Field>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removePower(idx)}
                  className="px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Remove Power
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditorLayout>
  );
}
