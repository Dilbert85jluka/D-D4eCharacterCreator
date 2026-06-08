import { useMemo, useState } from 'react';
import { useNpcsStore } from '../../store/useNpcsStore';
import type { CampaignNPC } from '../../types/npc';
import { NpcEditorModal } from './NpcEditorModal';
import { RichTextDisplay } from '../ui/RichTextDisplay';

interface Props {
  campaignId: string;
}

type FilterMode = 'all' | 'visible' | 'hidden';

/**
 * DM-facing NPC glossary section, embedded in CampaignManagementPage between
 * the Characters and Encounters sections. Lists all NPCs for the active
 * campaign with a visibility toggle and inline expand for details.
 *
 * In Phase 2, visible NPCs (with privateDescription stripped) will be pushed
 * to Supabase so players can see them in their SharedCampaignView.
 */
export function NpcSection({ campaignId }: Props) {
  const npcsByCampaign = useNpcsStore((s) => s.npcsByCampaign);
  const deleteNpc = useNpcsStore((s) => s.deleteNpc);
  const setVisibility = useNpcsStore((s) => s.setVisibility);

  const npcs = npcsByCampaign[campaignId] ?? [];

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CampaignNPC | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const visibleCount = npcs.filter((n) => n.visibleToPlayers).length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return npcs.filter((n) => {
      if (filter === 'visible' && !n.visibleToPlayers) return false;
      if (filter === 'hidden' && n.visibleToPlayers) return false;
      if (q && !n.name.toLowerCase().includes(q) && !n.location.toLowerCase().includes(q) && !n.race.toLowerCase().includes(q) && !n.characterClass.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [npcs, filter, search]);

  const openNew = () => { setEditing(null); setEditorOpen(true); };
  const openEdit = (npc: CampaignNPC) => { setEditing(npc); setEditorOpen(true); };
  const closeEditor = () => { setEditorOpen(false); setEditing(null); };

  const handleDelete = async (id: string) => {
    await deleteNpc(id, campaignId);
    setDeleteConfirm(null);
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-amber-800 px-4 py-2 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wide">Non-Player Characters (NPCs)</h3>
          <p className="text-amber-300 text-xs mt-0.5">
            DM glossary — {npcs.length} total · {visibleCount} visible to players · {npcs.length - visibleCount} hidden
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
        >
          + New NPC
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Filter + search */}
        {npcs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1">
              {(['all', 'visible', 'hidden'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={[
                    'px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors min-h-[32px] capitalize',
                    filter === f
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200',
                  ].join(' ')}
                >
                  {f}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / location / race / class…"
              className="flex-1 min-w-[180px] px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[36px]"
            />
          </div>
        )}

        {/* Empty states */}
        {npcs.length === 0 && (
          <div className="text-center py-8 text-stone-400">
            <p className="text-sm font-semibold mb-1">No NPCs yet</p>
            <p className="text-xs">Click <span className="font-semibold text-amber-700">+ New NPC</span> to start building your glossary.</p>
          </div>
        )}
        {npcs.length > 0 && filtered.length === 0 && (
          <p className="text-sm text-stone-400 italic text-center py-3">No NPCs match the current filter.</p>
        )}

        {/* List */}
        {filtered.map((npc) => {
          const isOpen = expandedId === npc.id;
          const confirming = deleteConfirm === npc.id;
          return (
            <div
              key={npc.id}
              className={[
                'border rounded-lg overflow-hidden transition-colors',
                npc.visibleToPlayers ? 'border-emerald-200 bg-emerald-50/30' : 'border-stone-200 bg-white',
              ].join(' ')}
            >
              {/* Row */}
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-12 h-12 rounded-lg bg-amber-100 border border-amber-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {npc.portrait
                    ? <img src={npc.portrait} alt="" className="w-full h-full object-cover" />
                    : <span className="text-xl text-amber-400">👤</span>}
                </div>
                <button
                  onClick={() => setExpandedId(isOpen ? null : npc.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-stone-800 truncate">{npc.name}</span>
                    <span className="text-[10px] font-bold bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">Lv {npc.level}</span>
                    {npc.visibleToPlayers ? (
                      <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">👁 Visible</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded">🔒 Hidden</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 truncate mt-0.5">
                    {[npc.race, npc.characterClass].filter(Boolean).join(' · ') || <span className="italic text-stone-400">No race/class</span>}
                    {npc.location && <span className="text-stone-400"> · 📍 {npc.location}</span>}
                  </p>
                </button>

                {/* Quick controls */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setVisibility(npc.id, campaignId, !npc.visibleToPlayers)}
                    title={npc.visibleToPlayers ? 'Hide from players' : 'Reveal to players'}
                    className={[
                      'text-xs px-2 py-1.5 rounded-lg font-semibold transition-colors min-h-[36px] min-w-[40px]',
                      npc.visibleToPlayers
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600',
                    ].join(' ')}
                  >
                    {npc.visibleToPlayers ? '👁' : '🔒'}
                  </button>
                  <button
                    onClick={() => openEdit(npc)}
                    title="Edit NPC"
                    className="text-xs px-2 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-semibold transition-colors min-h-[36px] min-w-[40px]"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(npc.id)}
                    title="Delete NPC"
                    className="text-xs px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition-colors min-h-[36px] min-w-[40px]"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Delete confirm */}
              {confirming && (
                <div className="px-3 py-2 bg-red-50 border-t border-red-200 flex items-center gap-2 text-xs">
                  <span className="text-red-700 flex-1">Delete <strong>{npc.name}</strong>? This can't be undone.</span>
                  <button onClick={() => handleDelete(npc.id)} className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-semibold min-h-[28px]">Confirm</button>
                  <button onClick={() => setDeleteConfirm(null)} className="px-2.5 py-1 bg-white text-stone-600 border border-stone-300 rounded font-semibold min-h-[28px]">Cancel</button>
                </div>
              )}

              {/* Expanded detail */}
              {isOpen && !confirming && (
                <div className="px-3 py-3 border-t border-stone-200 bg-stone-50/60 space-y-3 text-sm">
                  {/* Identity grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white rounded border border-stone-200 px-2 py-1.5">
                      <div className="text-stone-400 uppercase tracking-wide text-[10px]">Sex</div>
                      <div className="text-stone-800 truncate">{npc.sex || <span className="text-stone-300 italic">—</span>}</div>
                    </div>
                    <div className="bg-white rounded border border-stone-200 px-2 py-1.5">
                      <div className="text-stone-400 uppercase tracking-wide text-[10px]">Alignment</div>
                      <div className="text-stone-800 truncate">{npc.alignment}</div>
                    </div>
                    <div className="bg-white rounded border border-stone-200 px-2 py-1.5">
                      <div className="text-stone-400 uppercase tracking-wide text-[10px]">HP</div>
                      <div className="text-stone-800">{npc.currentHp} / {npc.maxHp}</div>
                    </div>
                    <div className="bg-white rounded border border-stone-200 px-2 py-1.5">
                      <div className="text-stone-400 uppercase tracking-wide text-[10px]">Level</div>
                      <div className="text-stone-800">{npc.level}</div>
                    </div>
                  </div>

                  {/* Public description */}
                  {npc.publicDescription && (
                    <div>
                      <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-wide mb-1">Public Description {npc.visibleToPlayers && <span className="text-emerald-700 normal-case font-normal">— synced to players</span>}</h4>
                      <div className="bg-white rounded border border-stone-200 px-3 py-2">
                        <RichTextDisplay content={npc.publicDescription} />
                      </div>
                    </div>
                  )}

                  {/* Private description */}
                  {npc.privateDescription && (
                    <div>
                      <h4 className="text-[11px] font-bold text-red-700 uppercase tracking-wide mb-1">Private Description <span className="normal-case font-normal text-red-600">— DM only, never synced</span></h4>
                      <div className="bg-red-50 rounded border border-red-200 px-3 py-2">
                        <RichTextDisplay content={npc.privateDescription} />
                      </div>
                    </div>
                  )}

                  {!npc.publicDescription && !npc.privateDescription && (
                    <p className="text-xs text-stone-400 italic">No descriptions added yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Editor modal */}
      {editorOpen && (
        <NpcEditorModal
          campaignId={campaignId}
          editing={editing}
          onClose={closeEditor}
        />
      )}
    </div>
  );
}
