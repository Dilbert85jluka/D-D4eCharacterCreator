import { useState } from 'react';
import type { Character } from '../../types/character';
import type { CampaignNpc } from '../../types/campaign';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { useReadOnly } from './ReadOnlyContext';
import { RichTextEditor } from '../ui/RichTextEditor';
import { RichTextDisplay } from '../ui/RichTextDisplay';
import { getNpcGlossaryForCharacter } from '../../lib/sharingService';

interface Props {
  character: Character;
}

function NpcCard({ npc }: { npc: CampaignNpc }) {
  const imgSrc = npc.imageData || npc.imageUrl;
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {imgSrc ? (
            <img src={imgSrc} alt={npc.name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <span className="text-stone-300 text-2xl">👤</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-stone-800">{npc.name}</p>
          {npc.location && <p className="text-xs text-stone-500 mt-0.5">📍 {npc.location}</p>}
        </div>
      </div>
      {npc.details && npc.details !== '<p></p>' && (
        <div className="mt-2 text-sm">
          <RichTextDisplay content={npc.details} />
        </div>
      )}
    </div>
  );
}

/** Collapsible NPC Glossary — campaign NPCs the DM has revealed to players.
 *  Lazy-fetches from the linked shared campaign on first expand. */
function NpcGlossary({ characterId }: { characterId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [campaignName, setCampaignName] = useState<string | null>(null);
  const [npcs, setNpcs] = useState<CampaignNpc[]>([]);

  const fetchGlossary = async () => {
    setLoading(true);
    try {
      // 8s guard: a stalled connection (offline tablet, suspended auth refresh) must not
      // leave the section stuck on "Loading…" — fall through to the empty state instead.
      const result = await Promise.race([
        getNpcGlossaryForCharacter(characterId),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
      ]);
      setCampaignName(result?.campaignName ?? null);
      setNpcs(result?.npcs ?? []);
    } catch {
      // Offline or not linked — render the empty state
      setCampaignName(null);
      setNpcs([]);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !fetched) fetchGlossary();
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <button
        onClick={toggle}
        className="w-full bg-amber-800 px-4 py-2 flex items-center justify-between min-h-[44px] hover:bg-amber-700 transition-colors"
        aria-expanded={open}
      >
        <span className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          NPC Glossary
          {fetched && npcs.length > 0 && (
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-medium normal-case">{npcs.length}</span>
          )}
        </span>
        <span className="text-amber-200 text-xs flex items-center gap-2">
          {fetched && campaignName && open && <span className="normal-case hidden sm:inline">{campaignName}</span>}
          <svg
            className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="p-3 space-y-2">
          {loading ? (
            <p className="text-stone-400 text-sm italic py-2 text-center">Loading glossary…</p>
          ) : npcs.length === 0 ? (
            <p className="text-stone-400 text-sm italic py-2 text-center">
              {campaignName
                ? 'The DM hasn’t revealed any NPCs yet.'
                : 'No campaign glossary — link this character to a shared campaign to see NPCs the DM reveals.'}
            </p>
          ) : (
            npcs.map((npc) => <NpcCard key={npc.id} npc={npc} />)
          )}
          {fetched && !loading && (
            <div className="text-right">
              <button
                onClick={fetchGlossary}
                className="text-xs text-amber-700 hover:text-amber-600 font-semibold px-2 py-1.5 min-h-[36px] transition-colors"
              >↻ Refresh</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function NotesPanel({ character }: Props) {
  const readOnly = useReadOnly();
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const updateNotes = async (notes: string) => {
    const updated = { ...character, notes };
    await characterRepository.patch(character.id, { notes });
    updateCharacter(updated);
  };

  return (
    <div className="space-y-4">
      {/* Campaign NPC Glossary — collapsible, above the notes editor */}
      <NpcGlossary characterId={character.id} />

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="bg-amber-800 px-4 py-2">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide">Notes</h3>
        </div>

        <div className="p-3">
          {readOnly ? (
            <RichTextDisplay content={character.notes} />
          ) : (
            <RichTextEditor
              content={character.notes}
              onChange={updateNotes}
              placeholder="Character notes, session log, important NPCs, quest details..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
