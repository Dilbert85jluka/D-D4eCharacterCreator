import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Campaign, CampaignNpc } from '../../types/campaign';
import { RichTextEditor } from '../ui/RichTextEditor';
import { processSquareImage, validateImageFile } from '../../lib/imageProcessing';

const labelCls = 'block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1';
const hintCls = 'text-xs text-stone-400 mb-2';
const inputCls =
  'w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]';

interface Props {
  campaign: Campaign;
  /** Persists the updated campaign (Dexie + store). updatedAt is bumped by the repository. */
  onCampaignUpdate: (updated: Campaign) => void | Promise<void>;
}

interface NpcDraft {
  name: string;
  location: string;
  details: string;
  imageData?: string;
  imageUrl: string;
  hidden: boolean;
}

const EMPTY_DRAFT: NpcDraft = { name: '', location: '', details: '', imageData: undefined, imageUrl: '', hidden: true };

function NpcThumb({ npc, size = 'w-12 h-12' }: { npc: Pick<CampaignNpc, 'imageData' | 'imageUrl' | 'name'>; size?: string }) {
  const src = npc.imageData || npc.imageUrl;
  return (
    <div className={`${size} rounded-xl bg-stone-100 border border-stone-200 flex-shrink-0 flex items-center justify-center overflow-hidden`}>
      {src ? (
        <img src={src} alt={npc.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-stone-300 text-xl">👤</span>
      )}
    </div>
  );
}

/** DM-side NPC Glossary — create/edit/hide NPCs the party engages with.
 *  Hidden NPCs stay on the DM's device; unhidden ones publish to players via
 *  the campaign content sync (only when the campaign is shared online). */
export function NpcGlossarySection({ campaign, onCampaignUpdate }: Props) {
  const npcs = campaign.npcs ?? [];
  const visibleCount = npcs.filter((n) => !n.hidden).length;

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<NpcDraft>(EMPTY_DRAFT);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
    setDraftError(null);
    setEditorOpen(true);
  };

  const openEdit = (npc: CampaignNpc) => {
    setDraft({
      name: npc.name,
      location: npc.location,
      details: npc.details,
      imageData: npc.imageData,
      imageUrl: npc.imageUrl ?? '',
      hidden: npc.hidden,
    });
    setEditingId(npc.id);
    setDraftError(null);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setDraftError(null);
  };

  const saveNpcs = (next: CampaignNpc[]) => onCampaignUpdate({ ...campaign, npcs: next });

  const handleSave = async () => {
    const name = draft.name.trim();
    if (!name) {
      setDraftError('Name is required.');
      return;
    }
    const now = Date.now();
    const fields = {
      name,
      location: draft.location.trim(),
      details: draft.details,
      imageData: draft.imageData,
      imageUrl: draft.imageUrl.trim() || undefined,
      hidden: draft.hidden,
    };
    const next = editingId
      ? npcs.map((n) => (n.id === editingId ? { ...n, ...fields, updatedAt: now } : n))
      : [...npcs, { id: uuidv4(), createdAt: now, updatedAt: now, ...fields }];
    await saveNpcs(next);
    closeEditor();
  };

  const toggleHidden = (npc: CampaignNpc) =>
    saveNpcs(npcs.map((n) => (n.id === npc.id ? { ...n, hidden: !n.hidden, updatedAt: Date.now() } : n)));

  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setConfirmDeleteId(null);
    saveNpcs(npcs.filter((n) => n.id !== id));
  };

  const handleFileSelected = async (file: File | undefined) => {
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setDraftError(validationError);
      return;
    }
    setImageBusy(true);
    setDraftError(null);
    try {
      const dataUrl = await processSquareImage(file, { size: 300 });
      // Uploaded image takes the slot — clear any external URL to avoid ambiguity
      setDraft((d) => ({ ...d, imageData: dataUrl, imageUrl: '' }));
    } catch (err) {
      setDraftError(err instanceof Error ? err.message : 'Could not process the image.');
    } finally {
      setImageBusy(false);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className={labelCls}>NPC Glossary</p>
          <p className={hintCls}>
            {npcs.length === 0
              ? 'Characters the party engages with — prepare them ahead of time, reveal them when you choose.'
              : `${npcs.length} NPC${npcs.length !== 1 ? 's' : ''} · ${visibleCount} visible to players`}
            {!campaign.sharedCampaignId && npcs.length > 0 && (
              <span className="text-indigo-400"> — share the campaign online to publish visible NPCs</span>
            )}
          </p>
        </div>
        <button
          onClick={openNew}
          className="text-xs bg-amber-700 hover:bg-amber-600 text-white font-semibold
                     px-3 py-2 rounded-lg transition-colors min-h-[36px]"
        >+ Add NPC</button>
      </div>

      {npcs.length === 0 ? (
        <div className="border-2 border-dashed border-stone-200 rounded-xl py-8 text-center">
          <p className="text-stone-400 text-sm mb-3">No NPCs yet.</p>
          <button
            onClick={openNew}
            className="text-xs text-amber-700 hover:text-amber-600 font-semibold
                       underline underline-offset-2 transition-colors"
          >Add your first NPC →</button>
        </div>
      ) : (
        <div className="space-y-2">
          {npcs.map((npc) => (
            <div key={npc.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 shadow-sm">
              <NpcThumb npc={npc} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-stone-800 truncate">{npc.name}</p>
                  <span
                    className={[
                      'text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0',
                      npc.hidden ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600',
                    ].join(' ')}
                  >
                    {npc.hidden ? 'Hidden' : 'Visible'}
                  </span>
                </div>
                {npc.location && <p className="text-xs text-stone-400 truncate">{npc.location}</p>}
              </div>
              <button
                onClick={() => toggleHidden(npc)}
                className={[
                  'text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors min-h-[36px] flex-shrink-0',
                  npc.hidden
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200',
                ].join(' ')}
                title={npc.hidden ? 'Reveal this NPC to players' : 'Hide this NPC from players'}
              >
                {npc.hidden ? 'Unhide' : 'Hide'}
              </button>
              <button
                onClick={() => openEdit(npc)}
                className="text-xs text-amber-700 hover:text-amber-600 font-medium px-2 py-1 rounded transition-colors flex-shrink-0"
              >Edit</button>
              <button
                onClick={() => handleDelete(npc.id)}
                onBlur={() => setConfirmDeleteId(null)}
                className={[
                  'text-xs font-medium px-2 py-1 rounded transition-colors flex-shrink-0 min-h-[36px]',
                  confirmDeleteId === npc.id
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'text-red-400 hover:text-red-600 hover:bg-red-50',
                ].join(' ')}
                title="Delete NPC"
              >
                {confirmDeleteId === npc.id ? 'Confirm?' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* NPC editor modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-10 overflow-y-auto">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="bg-amber-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                {editingId ? 'Edit NPC' : 'New NPC'}
              </h3>
              <button
                onClick={closeEditor}
                className="text-amber-200 hover:text-white text-2xl leading-none min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Close"
              >×</button>
            </div>

            <div className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className={labelCls}>Name *</label>
                <input
                  className={inputCls}
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Lord Padraig"
                />
              </div>

              {/* Location */}
              <div>
                <label className={labelCls}>Location</label>
                <input
                  className={inputCls}
                  value={draft.location}
                  onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                  placeholder="e.g. Winterhaven — Wrafton's Inn"
                />
              </div>

              {/* Picture */}
              <div>
                <label className={labelCls}>Picture</label>
                <p className={hintCls}>Upload an image, or paste a link to a picture hosted elsewhere.</p>
                <div className="flex items-start gap-3">
                  <NpcThumb npc={{ name: draft.name, imageData: draft.imageData, imageUrl: draft.imageUrl }} size="w-20 h-20" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp"
                        className="hidden"
                        onChange={(e) => { handleFileSelected(e.target.files?.[0]); e.target.value = ''; }}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageBusy}
                        className="text-xs bg-stone-100 text-stone-700 font-semibold px-3 py-2 rounded-lg
                                   hover:bg-stone-200 disabled:opacity-50 transition-colors min-h-[36px]"
                      >
                        {imageBusy ? 'Processing…' : '📁 Upload Image'}
                      </button>
                      {(draft.imageData || draft.imageUrl) && (
                        <button
                          onClick={() => setDraft((d) => ({ ...d, imageData: undefined, imageUrl: '' }))}
                          className="text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-2 min-h-[36px]"
                        >Remove</button>
                      )}
                    </div>
                    <input
                      className={inputCls}
                      value={draft.imageUrl}
                      onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value, imageData: undefined }))}
                      placeholder="…or paste an image URL (https://…)"
                    />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <label className={labelCls}>Details</label>
                <p className={hintCls}>Anything relevant — role, secrets revealed, quest ties. Paste links to reference other materials.</p>
                <RichTextEditor
                  content={draft.details}
                  onChange={(html) => setDraft((d) => ({ ...d, details: html }))}
                  placeholder="Who are they? What does the party know about them?"
                />
              </div>

              {/* Visibility */}
              <label className="flex items-center gap-2.5 text-sm text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!draft.hidden}
                  onChange={(e) => setDraft((d) => ({ ...d, hidden: !e.target.checked }))}
                  className="rounded w-4 h-4"
                />
                <span>
                  <span className="font-semibold">Visible to players</span>
                  <span className="text-stone-400"> — leave unchecked to keep this NPC hidden until you reveal it</span>
                </span>
              </label>

              {draftError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{draftError}</p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={closeEditor}
                  className="px-4 py-2 rounded-lg bg-stone-100 text-stone-600 text-sm font-semibold hover:bg-stone-200 transition-colors min-h-[44px]"
                >Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={imageBusy}
                  className="px-4 py-2 rounded-lg bg-amber-700 text-white text-sm font-semibold hover:bg-amber-600 disabled:opacity-50 transition-colors min-h-[44px]"
                >
                  {editingId ? 'Save Changes' : 'Add NPC'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
