import { useRef, useState } from 'react';
import type { CampaignNPC } from '../../types/npc';
import type { Alignment } from '../../types/character';
import { useNpcsStore } from '../../store/useNpcsStore';
import { processSquareImage, validateImageFile, MAX_IMAGE_FILE_BYTES, ACCEPTED_IMAGE_TYPES } from '../../lib/imageProcessing';
import { RichTextEditor } from '../ui/RichTextEditor';

const ALIGNMENTS: Alignment[] = ['Lawful Good', 'Good', 'Unaligned', 'Evil', 'Chaotic Evil'];

interface Props {
  campaignId: string;
  /** Existing NPC to edit, or null to create a new one. */
  editing: CampaignNPC | null;
  onClose: () => void;
}

function defaults(campaignId: string): Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    campaignId,
    name: '',
    sex: '',
    alignment: 'Unaligned',
    race: '',
    characterClass: '',
    level: 1,
    currentHp: 0,
    maxHp: 0,
    location: '',
    portrait: undefined,
    publicDescription: '',
    privateDescription: '',
    visibleToPlayers: false,
  };
}

const inputCls = 'w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[40px]';
const selectCls = inputCls;
const labelCls = 'block text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wide';

export function NpcEditorModal({ campaignId, editing, onClose }: Props) {
  const createNpc = useNpcsStore((s) => s.createNpc);
  const updateNpc = useNpcsStore((s) => s.updateNpc);

  const [form, setForm] = useState(() =>
    editing
      ? { ...editing }
      : { ...defaults(campaignId), id: '', createdAt: 0, updatedAt: 0 } as CampaignNPC,
  );
  const [imageProcessing, setImageProcessing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof CampaignNPC>(key: K, val: CampaignNPC[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    const err = validateImageFile(file);
    if (err) { setImageError(err); return; }
    setImageProcessing(true);
    try {
      const dataUrl = await processSquareImage(file);
      set('portrait', dataUrl);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Could not process image.');
    } finally {
      setImageProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => set('portrait', undefined);

  const canSave = form.name.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) return;
    if (editing) {
      await updateNpc(form);
    } else {
      // Strip the synthetic empty id/timestamps; repository assigns real ones.
      const { id: _ignoredId, createdAt: _ignoredCreated, updatedAt: _ignoredUpdated, ...data } = form;
      void _ignoredId; void _ignoredCreated; void _ignoredUpdated;
      await createNpc(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4 pb-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="bg-amber-800 px-5 py-3 rounded-t-xl flex items-center justify-between">
          <h2 className="text-white font-bold text-base uppercase tracking-wide">
            {editing ? 'Edit NPC' : 'New NPC'}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center">×</button>
        </div>

        <div className="p-5 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {/* Portrait + Identity row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-28 h-28 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center overflow-hidden">
                {form.portrait
                  ? <img src={form.portrait} alt="NPC portrait" className="w-full h-full object-cover" />
                  : <span className="text-3xl text-amber-400">👤</span>}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                onChange={onImageChange}
                className="hidden"
              />
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageProcessing}
                  className="text-xs px-2.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors min-h-[32px] disabled:opacity-50"
                >
                  {imageProcessing ? 'Processing…' : form.portrait ? 'Replace' : 'Upload'}
                </button>
                {form.portrait && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-xs px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition-colors min-h-[32px]"
                  >
                    Remove
                  </button>
                )}
              </div>
              {imageError && <p className="text-xs text-red-600 max-w-[7rem] text-center">{imageError}</p>}
              <p className="text-[10px] text-stone-400 text-center max-w-[7rem]">PNG/JPG/GIF/WebP, up to {Math.round(MAX_IMAGE_FILE_BYTES / 1024 / 1024)} MB</p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={labelCls}>Name <span className="text-red-500">*</span></label>
                <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Marrick the Innkeeper" />
              </div>
              <div>
                <label className={labelCls}>Sex</label>
                <input className={inputCls} value={form.sex} onChange={(e) => set('sex', e.target.value)} placeholder="Male / Female / Other / —" />
              </div>
              <div>
                <label className={labelCls}>Alignment</label>
                <select className={selectCls} value={form.alignment} onChange={(e) => set('alignment', e.target.value as Alignment)}>
                  {ALIGNMENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Race</label>
                <input className={inputCls} value={form.race} onChange={(e) => set('race', e.target.value)} placeholder="e.g. Human, Eladrin, Mind Flayer" />
              </div>
              <div>
                <label className={labelCls}>Class / Role</label>
                <input className={inputCls} value={form.characterClass} onChange={(e) => set('characterClass', e.target.value)} placeholder="e.g. Wizard, Innkeeper, Royal Vizier" />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Level</label>
              <input className={inputCls} type="number" min={1} max={40} value={form.level} onChange={(e) => set('level', Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelCls}>Current HP</label>
              <input className={inputCls} type="number" min={0} value={form.currentHp} onChange={(e) => set('currentHp', Number(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelCls}>Max HP</label>
              <input className={inputCls} type="number" min={0} value={form.maxHp} onChange={(e) => set('maxHp', Number(e.target.value) || 0)} />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className={labelCls}>Home Location / Where Met</label>
            <input className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. The Wandering Lantern Inn, Fallcrest" />
          </div>

          {/* Visibility */}
          <div className="border border-stone-200 rounded-lg p-3 bg-stone-50 flex items-start gap-2">
            <input
              id="npc-visible"
              type="checkbox"
              checked={form.visibleToPlayers}
              onChange={(e) => set('visibleToPlayers', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-stone-300"
            />
            <label htmlFor="npc-visible" className="text-sm text-stone-700 cursor-pointer flex-1">
              <span className="font-semibold">Visible to players</span>
              <span className="block text-xs text-stone-500 mt-0.5">When checked, this NPC appears in the player-facing campaign view (Public Description only — private notes never sync).</span>
            </label>
          </div>

          {/* Public description */}
          <div>
            <label className={labelCls}>Public Description <span className="text-stone-400 normal-case font-normal">(shown to players when visible)</span></label>
            <RichTextEditor
              content={form.publicDescription}
              onChange={(html) => set('publicDescription', html)}
              placeholder="What players see — appearance, mannerisms, public reputation…"
            />
          </div>

          {/* Private description */}
          <div>
            <label className={labelCls}>Private Description <span className="text-red-600 normal-case font-normal">(DM only — never synced to players)</span></label>
            <RichTextEditor
              content={form.privateDescription}
              onChange={(html) => set('privateDescription', html)}
              placeholder="DM-only notes — secret motives, hidden stats, plot hooks…"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-5 py-3 rounded-b-xl border-t border-stone-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-200 rounded-lg transition-colors min-h-[40px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={[
              'px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors min-h-[40px]',
              canSave ? 'bg-amber-700 hover:bg-amber-600' : 'bg-stone-300 cursor-not-allowed',
            ].join(' ')}
          >
            {editing ? 'Save Changes' : 'Create NPC'}
          </button>
        </div>
      </div>
    </div>
  );
}
