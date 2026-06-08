import { useMemo, useState } from 'react';
import type { PublicNPC } from '../../types/npc';
import { RichTextDisplay } from '../ui/RichTextDisplay';

interface Props {
  /** Player-safe NPC list synced from `shared_campaigns.npc_content`. */
  npcs: PublicNPC[];
}

/**
 * Player-facing NPC glossary in SharedCampaignView. Read-only — players only
 * see NPCs the DM flagged visible, and only the public-safe fields (no level,
 * HP, or DM private notes — those are stripped server-side by toPublicNPC).
 *
 * Layout mirrors the DM NpcSection: list of cards with inline expand.
 */
export function PublicNpcSection({ npcs }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? npcs.filter(
          (n) =>
            n.name.toLowerCase().includes(q) ||
            n.location.toLowerCase().includes(q) ||
            n.race.toLowerCase().includes(q) ||
            n.characterClass.toLowerCase().includes(q),
        )
      : npcs;
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [npcs, search]);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">NPC Glossary</h3>
        <p className="text-amber-300 text-xs mt-0.5">
          {npcs.length} {npcs.length === 1 ? 'NPC the DM has revealed' : 'NPCs the DM has revealed'} so far.
        </p>
      </div>

      <div className="p-3 space-y-3">
        {npcs.length === 0 ? (
          <p className="text-sm text-stone-400 italic text-center py-6">
            No NPCs unlocked yet — the DM will reveal them as the party meets them.
          </p>
        ) : (
          <>
            {npcs.length > 3 && (
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name / location / race / class…"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[36px]"
              />
            )}
            {filtered.length === 0 && (
              <p className="text-sm text-stone-400 italic text-center py-3">No NPCs match that search.</p>
            )}
            {filtered.map((npc) => {
              const isOpen = expandedId === npc.id;
              return (
                <div
                  key={npc.id}
                  className="border border-stone-200 rounded-lg overflow-hidden bg-white"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : npc.id)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-amber-50/40 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-amber-100 border border-amber-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {npc.portrait
                        ? <img src={npc.portrait} alt="" className="w-full h-full object-cover" />
                        : <span className="text-xl text-amber-400">👤</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-stone-800 truncate">{npc.name}</p>
                      <p className="text-xs text-stone-500 truncate mt-0.5">
                        {[npc.race, npc.characterClass].filter(Boolean).join(' · ') || <span className="italic text-stone-400">No race/class</span>}
                        {npc.location && <span className="text-stone-400"> · 📍 {npc.location}</span>}
                      </p>
                    </div>
                    <span className="text-xs text-stone-400 flex-shrink-0">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {isOpen && (
                    <div className="px-3 py-3 border-t border-stone-200 bg-stone-50/60 space-y-3 text-sm">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div className="bg-white rounded border border-stone-200 px-2 py-1.5">
                          <div className="text-stone-400 uppercase tracking-wide text-[10px]">Sex</div>
                          <div className="text-stone-800 truncate">{npc.sex || <span className="text-stone-300 italic">—</span>}</div>
                        </div>
                        <div className="bg-white rounded border border-stone-200 px-2 py-1.5">
                          <div className="text-stone-400 uppercase tracking-wide text-[10px]">Alignment</div>
                          <div className="text-stone-800 truncate">{npc.alignment}</div>
                        </div>
                        {npc.location && (
                          <div className="bg-white rounded border border-stone-200 px-2 py-1.5 col-span-2 sm:col-span-1">
                            <div className="text-stone-400 uppercase tracking-wide text-[10px]">Location</div>
                            <div className="text-stone-800 truncate">{npc.location}</div>
                          </div>
                        )}
                      </div>

                      {npc.publicDescription ? (
                        <div className="bg-white rounded border border-stone-200 px-3 py-2">
                          <RichTextDisplay content={npc.publicDescription} />
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 italic">The DM hasn't added a description yet.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
