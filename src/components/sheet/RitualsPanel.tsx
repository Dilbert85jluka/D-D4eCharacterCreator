import { useState } from 'react';
import type { Character, RitualScroll, RitualBook, RitualBookEntry } from '../../types/character';
import { getRituals, getRitualById } from '../../data/rituals';
import type { RitualData } from '../../types/gameData';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { useAppStore } from '../../store/useAppStore';
import { useReadOnly } from './ReadOnlyContext';

const BOOK_COST = 50;
const MAX_PAGES = 128;

interface Props {
  character: Character;
}

// ── helpers ─────────────────────────────────────────────────────────────────

function pagesUsed(book: RitualBook): number {
  return book.rituals.reduce((sum, r) => sum + r.level, 0);
}

// ── sub-components ──────────────────────────────────────────────────────────

function PageBar({ used, max }: { used: number; max: number }) {
  const pct = Math.min((used / max) * 100, 100);
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-1.5 text-xs text-stone-500">
      <div className="w-20 h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span>{used}/{max} pages</span>
    </div>
  );
}

// ── SkillCheckTable ──────────────────────────────────────────────────────────

function SkillCheckTable({ table, skill }: { table: { result: string; effect: string }[]; skill: string }) {
  return (
    <div className="mt-2 border-t border-stone-100 pt-1.5">
      <p className="text-xs font-semibold text-stone-500 mb-1">⚄ {skill} Check</p>
      <div className="space-y-0.5">
        {table.map((row) => (
          <div key={row.result} className="flex gap-2 text-xs">
            <span className="text-stone-400 font-medium w-24 flex-shrink-0">{row.result}</span>
            <span className="text-stone-600">{row.effect}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Buy Scroll Modal ─────────────────────────────────────────────────────────

interface BuyScrollModalProps {
  goldPieces: number;
  onClose: () => void;
  onBuy: (ritual: RitualData, acquired: 'purchased' | 'found') => string | null;
}

function BuyScrollModal({ goldPieces, onClose, onBuy }: BuyScrollModalProps) {
  const [search, setSearch] = useState('');
  const [acquired, setAcquired] = useState<'purchased' | 'found'>('purchased');
  const [selected, setSelected] = useState<RitualData | null>(null);
  const [error, setError] = useState('');

  const all = getRituals();
  const filtered = search
    ? all.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.keySkill.toLowerCase().includes(search.toLowerCase()))
    : all;

  const cost = selected
    ? acquired === 'purchased' ? selected.marketPrice : selected.componentCost
    : 0;

  function handleConfirm() {
    if (!selected) return;
    const err = onBuy(selected, acquired);
    if (err) { setError(err); return; }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-violet-800 px-5 py-4 text-white flex items-center justify-between flex-shrink-0">
          <h3 className="font-bold text-lg">📜 Buy Ritual Scroll</h3>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 text-xl leading-none">×</button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Search rituals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            autoFocus
          />
        </div>

        {/* Ritual list */}
        <div className="overflow-y-auto flex-1 px-4 pb-2">
          {filtered.length === 0 && (
            <p className="text-sm text-stone-400 py-4 text-center">No rituals match.</p>
          )}
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => { setSelected(r); setError(''); }}
              className={[
                'w-full text-left px-3 py-2.5 rounded-lg mb-1 border transition-colors',
                selected?.id === r.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-transparent hover:bg-stone-50',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-stone-800">{r.name}</span>
                  <span className="text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-medium">{r.category}</span>
                </div>
                <span className="text-xs text-stone-400 font-medium flex-shrink-0">Lv {r.level}</span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0 mt-1 text-xs text-stone-500">
                <span>{r.keySkill}</span>
                <span>⏱ {r.castingTime}</span>
                <span>⏳ {r.duration}</span>
                <span>Market: {r.marketPrice} gp</span>
                <span>Cast: {r.componentNote ? r.componentNote : `${r.componentCost} gp`}</span>
              </div>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{r.description}</p>
              {r.skillCheckTable && <SkillCheckTable table={r.skillCheckTable} skill={r.keySkill} />}
            </button>
          ))}
        </div>

        {/* Acquisition + confirm */}
        <div className="border-t border-stone-200 px-4 py-3 flex-shrink-0 space-y-2">
          {selected && (
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="acquired" value="purchased" checked={acquired === 'purchased'} onChange={() => setAcquired('purchased')} />
                <span>Purchased <span className="text-stone-500">({selected.marketPrice} gp)</span></span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="acquired" value="found" checked={acquired === 'found'} onChange={() => setAcquired('found')} />
                <span>Found <span className="text-stone-500">
                  {selected.componentCost === 0 ? '(free)' : `(components: ${selected.componentCost} gp)`}
                </span></span>
              </label>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500">
              You have: <strong>{goldPieces} gp</strong>
              {selected && <span className="ml-2 text-violet-700 font-semibold">Cost: {cost} gp</span>}
            </span>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50">Cancel</button>
              <button
                onClick={handleConfirm}
                disabled={!selected}
                className="px-3 py-1.5 text-sm bg-violet-700 hover:bg-violet-600 disabled:opacity-40 text-white rounded-lg font-semibold"
              >
                Acquire
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Buy Book Modal ───────────────────────────────────────────────────────────

interface BuyBookModalProps {
  goldPieces: number;
  onClose: () => void;
  onBuy: (name: string) => string | null;
}

function BuyBookModal({ goldPieces, onClose, onBuy }: BuyBookModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleConfirm() {
    if (!name.trim()) { setError('Please enter a name for the book.'); return; }
    const err = onBuy(name.trim());
    if (err) { setError(err); return; }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
        <div className="bg-amber-800 px-5 py-4 text-white flex items-center justify-between">
          <h3 className="font-bold text-lg">📖 Buy Ritual Book</h3>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 text-xl leading-none">×</button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Book Name</label>
            <input
              type="text"
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); if (e.key === 'Escape') onClose(); }}
              placeholder="e.g. Spellbook of Kira"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              autoFocus
            />
          </div>
          <p className="text-xs text-stone-500">
            Cost: <strong>{BOOK_COST} gp</strong> &nbsp;·&nbsp; You have: <strong>{goldPieces} gp</strong>
          </p>
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold hover:bg-stone-50 text-sm">Cancel</button>
          <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-semibold text-sm">Purchase</button>
        </div>
      </div>
    </div>
  );
}

// ── Add Ritual to Book Modal ─────────────────────────────────────────────────

interface AddToBookModalProps {
  book: RitualBook;
  goldPieces: number;
  onClose: () => void;
  onAdd: (bookId: string, ritual: RitualData) => string | null;
}

function AddToBookModal({ book, goldPieces, onClose, onAdd }: AddToBookModalProps) {
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const used = pagesUsed(book);
  const remaining = MAX_PAGES - used;
  const alreadyInBook = new Set(book.rituals.map((r) => r.ritualId));

  const all = getRituals();
  const filtered = (search
    ? all.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.keySkill.toLowerCase().includes(search.toLowerCase()))
    : all
  ).filter((r) => !alreadyInBook.has(r.id));

  function handleAdd(r: RitualData) {
    const err = onAdd(book.id, r);
    if (err) { setError(err); return; }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-amber-800 px-5 py-4 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-bold text-lg">Add Ritual to Book</h3>
            <p className="text-xs opacity-80 mt-0.5">"{book.name}" · {used}/{MAX_PAGES} pages used</p>
          </div>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 text-xl leading-none">×</button>
        </div>

        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <input
            type="text"
            placeholder="Search rituals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            autoFocus
          />
        </div>

        <div className="overflow-y-auto flex-1 px-4 pb-2">
          {filtered.length === 0 && (
            <p className="text-sm text-stone-400 py-4 text-center">
              {alreadyInBook.size === all.length ? 'All rituals are already in this book.' : 'No rituals match.'}
            </p>
          )}
          {filtered.map((r) => {
            const fitsInBook = r.level <= remaining;
            return (
              <div
                key={r.id}
                className={[
                  'px-3 py-2.5 rounded-lg mb-1 border',
                  fitsInBook ? 'border-transparent hover:bg-stone-50' : 'border-transparent opacity-40',
                ].join(' ')}
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-stone-800">{r.name}</span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">{r.category}</span>
                      <span className="text-xs text-stone-500">Lv {r.level} · {r.level} page{r.level !== 1 ? 's' : ''}</span>
                    </div>
                    <button
                      onClick={() => handleAdd(r)}
                      disabled={!fitsInBook}
                      className="ml-1 px-3 py-1 text-xs bg-amber-700 hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex-shrink-0"
                    >
                      Add ({r.marketPrice} gp)
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0 text-xs text-stone-500 mt-1">
                    <span>{r.keySkill}</span>
                    <span>⏱ {r.castingTime}</span>
                    <span>⏳ {r.duration}</span>
                    <span>Copy: {r.marketPrice} gp</span>
                    <span>Cast: {r.componentNote ? r.componentNote : `${r.componentCost} gp`}</span>
                    {!fitsInBook && <span className="text-red-500 font-medium">Not enough pages</span>}
                  </div>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{r.description}</p>
                  {r.skillCheckTable && <SkillCheckTable table={r.skillCheckTable} skill={r.keySkill} />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-stone-200 px-4 py-3 flex-shrink-0 flex items-center justify-between">
          <span className="text-xs text-stone-500">You have: <strong>{goldPieces} gp</strong> &nbsp;·&nbsp; {remaining} pages remaining</span>
          <button onClick={onClose} className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50">Close</button>
        </div>
        {error && <p className="text-xs text-red-600 font-semibold px-4 pb-3">{error}</p>}
      </div>
    </div>
  );
}

// ── Main Panel ───────────────────────────────────────────────────────────────

export function RitualsPanel({ character }: Props) {
  const readOnly = useReadOnly();
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);
  const showToast       = useAppStore((s) => s.showToast);

  const scrolls = character.ritualScrolls ?? [];
  const books   = character.ritualBooks   ?? [];

  const [showBuyScroll, setShowBuyScroll] = useState(false);
  const [showBuyBook,   setShowBuyBook]   = useState(false);
  const [addToBookId,   setAddToBookId]   = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function patch(changes: Partial<Character>) {
    const updated = { ...character, ...changes };
    await characterRepository.patch(character.id, changes);
    updateCharacter(updated);
  }

  // ── scroll handlers ───────────────────────────────────────────────────────

  function handleBuyScroll(ritual: RitualData, acquired: 'purchased' | 'found'): string | null {
    const cost = acquired === 'purchased' ? ritual.marketPrice : ritual.componentCost;
    if (character.goldPieces < cost) {
      return `Not enough gold. You need ${cost} gp but have ${character.goldPieces} gp.`;
    }
    // Stack with an existing scroll of the same ritual if present
    const existingIdx = scrolls.findIndex((s) => s.ritualId === ritual.id);
    let newScrolls: RitualScroll[];
    if (existingIdx >= 0) {
      newScrolls = scrolls.map((s, i) =>
        i === existingIdx ? { ...s, quantity: (s.quantity ?? 1) + 1 } : s
      );
    } else {
      const scroll: RitualScroll = {
        id: crypto.randomUUID(),
        ritualId: ritual.id,
        name: ritual.name,
        level: ritual.level,
        componentCost: ritual.componentCost,
        keySkill: ritual.keySkill,
        acquired,
        quantity: 1,
      };
      newScrolls = [...scrolls, scroll];
    }
    patch({
      ritualScrolls: newScrolls,
      goldPieces: character.goldPieces - cost,
    });
    showToast(
      cost === 0
        ? `${ritual.name} scroll acquired (free).`
        : `${ritual.name} scroll acquired for ${cost} gp.`,
      'success'
    );
    return null;
  }

  function handleUseScroll(scroll: RitualScroll): void {
    if (character.goldPieces < scroll.componentCost) {
      showToast(
        `Not enough gold — ${scroll.name} requires ${scroll.componentCost} gp in components.`,
        'error'
      );
      return;
    }
    const qty = scroll.quantity ?? 1;
    const newScrolls = qty <= 1
      ? scrolls.filter((s) => s.id !== scroll.id)
      : scrolls.map((s) => s.id === scroll.id ? { ...s, quantity: qty - 1 } : s);
    patch({
      ritualScrolls: newScrolls,
      goldPieces: character.goldPieces - scroll.componentCost,
    });
    const costMsg = scroll.componentCost === 0 ? '(no component cost)' : `(${scroll.componentCost} gp deducted)`;
    showToast(`${scroll.name} cast ${costMsg}.`, 'success');
  }

  function removeScroll(id: string) {
    patch({ ritualScrolls: scrolls.filter((s) => s.id !== id) });
  }

  // ── book handlers ─────────────────────────────────────────────────────────

  function handleBuyBook(name: string): string | null {
    if (character.goldPieces < BOOK_COST) {
      return `Not enough gold. You need ${BOOK_COST} gp but have ${character.goldPieces} gp.`;
    }
    const book: RitualBook = { id: crypto.randomUUID(), name, rituals: [] };
    patch({
      ritualBooks: [...books, book],
      goldPieces: character.goldPieces - BOOK_COST,
    });
    showToast(`"${name}" purchased for ${BOOK_COST} gp.`, 'success');
    return null;
  }

  function handleAddToBook(bookId: string, ritual: RitualData): string | null {
    const book = books.find((b) => b.id === bookId);
    if (!book) return 'Book not found.';
    if (character.goldPieces < ritual.marketPrice) {
      return `Not enough gold. You need ${ritual.marketPrice} gp but have ${character.goldPieces} gp.`;
    }
    const entry: RitualBookEntry = { ritualId: ritual.id, name: ritual.name, level: ritual.level };
    const updatedBooks = books.map((b) =>
      b.id === bookId ? { ...b, rituals: [...b.rituals, entry] } : b
    );
    patch({
      ritualBooks: updatedBooks,
      goldPieces: character.goldPieces - ritual.marketPrice,
    });
    showToast(`${ritual.name} added to "${book.name}" for ${ritual.marketPrice} gp.`, 'success');
    return null;
  }

  function removeRitualFromBook(bookId: string, ritualId: string) {
    const updatedBooks = books.map((b) =>
      b.id === bookId ? { ...b, rituals: b.rituals.filter((r) => r.ritualId !== ritualId) } : b
    );
    patch({ ritualBooks: updatedBooks });
  }

  function handleToggleMastered(bookId: string, ritualId: string, current: boolean): void {
    const updatedBooks = books.map((b) => {
      if (b.id !== bookId) return b;
      return {
        ...b,
        rituals: b.rituals.map((r) =>
          r.ritualId === ritualId ? { ...r, mastered: !current } : r
        ),
      };
    });
    patch({ ritualBooks: updatedBooks });
  }

  function handleUseBookRitual(entry: RitualBookEntry, rd: RitualData): void {
    if (rd.componentCost > 0 && character.goldPieces < rd.componentCost) {
      showToast(
        `Not enough gold — ${entry.name} requires ${rd.componentCost} gp in components.`,
        'error'
      );
      return;
    }
    patch({ goldPieces: character.goldPieces - rd.componentCost });
    const costMsg =
      rd.componentCost === 0
        ? rd.componentNote ?? '(special component cost)'
        : `(${rd.componentCost} gp deducted)${rd.componentNote ? ' — ' + rd.componentNote : ''}`;
    showToast(`${entry.name} cast ${costMsg}.`, 'success');
  }

  function deleteBook(bookId: string) {
    patch({ ritualBooks: books.filter((b) => b.id !== bookId) });
    setConfirmDeleteId(null);
    showToast('Ritual book deleted.', 'success');
  }

  const addToBook = addToBookId ? books.find((b) => b.id === addToBookId) ?? null : null;

  return (
    <div className="p-4 space-y-6">

      {/* ── Ritual Scrolls ─────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Ritual Scrolls</h2>
          {!readOnly && (
            <button
              onClick={() => setShowBuyScroll(true)}
              className="bg-violet-700 hover:bg-violet-600 active:bg-violet-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              + Buy Scroll
            </button>
          )}
        </div>

        {scrolls.length === 0 ? (
          <p className="text-sm text-stone-400 italic py-2">No ritual scrolls. Buy or find one above.</p>
        ) : (
          <div className="space-y-1.5">
            {scrolls.map((scroll) => {
              const rd = getRitualById(scroll.ritualId);
              const qty = scroll.quantity ?? 1;
              return (
                <div key={scroll.id} className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-violet-700">Lv {scroll.level}</span>
                        <span className="text-sm font-semibold text-stone-800">{scroll.name}</span>
                        {rd && <span className="text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-medium">{rd.category}</span>}
                        {qty > 1 && (
                          <span className="text-xs font-bold bg-violet-700 text-white px-1.5 py-0.5 rounded">×{qty}</span>
                        )}
                        {scroll.acquired === 'found' && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">Found</span>
                        )}
                      </div>
                      {rd && (
                        <>
                          <div className="flex flex-wrap gap-x-3 gap-y-0 text-xs text-stone-500 mt-1">
                            <span>{rd.keySkill}</span>
                            <span>⏱ {rd.castingTime}</span>
                            <span>⏳ {rd.duration}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0 text-xs text-stone-500 mt-0.5">
                            <span>Market: {rd.marketPrice} gp</span>
                            <span>Cast: {rd.componentNote ?? (scroll.componentCost === 0 ? '0 gp' : `${scroll.componentCost} gp`)}</span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{rd.description}</p>
                          {rd.skillCheckTable && <SkillCheckTable table={rd.skillCheckTable} skill={rd.keySkill} />}
                        </>
                      )}
                    </div>
                    {/* Action column: Use + Remove */}
                    {!readOnly && (
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-1">
                        <button
                          onClick={() => removeScroll(scroll.id)}
                          className="text-stone-400 hover:text-red-500 text-lg leading-none transition-colors"
                          aria-label="Remove scroll"
                          title="Discard scroll"
                        >×</button>
                        <button
                          onClick={() => handleUseScroll(scroll)}
                          className="text-xs bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-semibold px-2 py-1 rounded-lg transition-colors whitespace-nowrap"
                          title={scroll.componentCost === 0 ? 'Cast (no component cost)' : `Cast — deducts ${scroll.componentCost} gp`}
                        >
                          {scroll.componentCost === 0 ? 'Use (free)' : `Use (${scroll.componentCost} gp)`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Ritual Books ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wide">Ritual Books</h2>
          {!readOnly && (
            <button
              onClick={() => setShowBuyBook(true)}
              className="bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              + Buy Book ({BOOK_COST} gp)
            </button>
          )}
        </div>

        {books.length === 0 ? (
          <p className="text-sm text-stone-400 italic py-2">No ritual books. Purchase one above.</p>
        ) : (
          <div className="space-y-3">
            {books.map((book) => {
              const used = pagesUsed(book);
              const isConfirmingDelete = confirmDeleteId === book.id;
              return (
                <div key={book.id} className="border border-amber-200 rounded-xl overflow-hidden">
                  {/* Book header */}
                  <div className="flex items-center justify-between bg-amber-50 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📖</span>
                      <span className="font-semibold text-sm text-stone-800">{book.name}</span>
                      <PageBar used={used} max={MAX_PAGES} />
                    </div>
                    {!readOnly && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setAddToBookId(book.id)}
                          className="text-xs bg-amber-700 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg font-semibold transition-colors"
                        >
                          + Add Ritual
                        </button>
                        {isConfirmingDelete ? (
                          <span className="flex items-center gap-1 text-xs">
                            <span className="text-stone-600">Delete?</span>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-stone-500 hover:text-stone-700 font-semibold px-1">Cancel</button>
                            <button onClick={() => deleteBook(book.id)} className="text-red-600 hover:text-red-800 font-bold px-1">Delete</button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(book.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors text-sm px-1"
                            aria-label="Delete book"
                            title="Delete book"
                          >
                            🗑
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ritual entries */}
                  {book.rituals.length === 0 ? (
                    <p className="text-xs text-stone-400 italic px-4 py-2">No rituals copied in yet.</p>
                  ) : (
                    <div className="divide-y divide-stone-100">
                      {book.rituals.map((entry) => {
                        const rd = getRitualById(entry.ritualId);
                        return (
                          <div key={entry.ritualId} className="flex items-start justify-between px-4 py-2.5">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-amber-700">Lv {entry.level}</span>
                                <span className="text-sm font-semibold text-stone-800">{entry.name}</span>
                                {rd && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">{rd.category}</span>}
                                <span className="text-xs text-stone-400">{entry.level} page{entry.level !== 1 ? 's' : ''}</span>
                              </div>
                              {rd && (
                                <>
                                  <div className="flex flex-wrap gap-x-3 gap-y-0 text-xs text-stone-500 mt-1">
                                    <span>{rd.keySkill}</span>
                                    <span>⏱ {rd.castingTime}</span>
                                    <span>⏳ {rd.duration}</span>
                                    <span>Market: {rd.marketPrice} gp</span>
                                    <span>Cast: {rd.componentNote ?? `${rd.componentCost} gp`}</span>
                                  </div>
                                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{rd.description}</p>
                                  {rd.skillCheckTable && <SkillCheckTable table={rd.skillCheckTable} skill={rd.keySkill} />}
                                </>
                              )}
                            </div>
                            {!readOnly && (
                              <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                                {/* Mastered toggle */}
                                <button
                                  onClick={() => handleToggleMastered(book.id, entry.ritualId, entry.mastered ?? false)}
                                  className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                                    entry.mastered
                                      ? 'bg-amber-500 hover:bg-amber-400 text-white'
                                      : 'bg-stone-100 hover:bg-stone-200 text-stone-500'
                                  }`}
                                  title={entry.mastered ? 'Mastered — click to unmark' : 'Mark as mastered'}
                                >
                                  {entry.mastered ? '★ Mastered' : '☆ Master'}
                                </button>

                                {/* Use button — only when mastered */}
                                {entry.mastered && rd && (
                                  <button
                                    onClick={() => handleUseBookRitual(entry, rd)}
                                    className="text-xs bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-semibold px-2 py-1 rounded-lg transition-colors whitespace-nowrap"
                                    title={rd.componentCost === 0 ? 'Cast (special cost — see component note)' : `Cast — deducts ${rd.componentCost} gp`}
                                  >
                                    {rd.componentCost === 0 ? 'Use (special)' : `Use (${rd.componentCost} gp)`}
                                  </button>
                                )}

                                {/* Remove */}
                                <button
                                  onClick={() => removeRitualFromBook(book.id, entry.ritualId)}
                                  className="text-stone-300 hover:text-red-400 text-lg leading-none transition-colors"
                                  aria-label="Remove ritual from book"
                                >×</button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {!readOnly && showBuyScroll && (
        <BuyScrollModal
          goldPieces={character.goldPieces}
          onClose={() => setShowBuyScroll(false)}
          onBuy={handleBuyScroll}
        />
      )}
      {!readOnly && showBuyBook && (
        <BuyBookModal
          goldPieces={character.goldPieces}
          onClose={() => setShowBuyBook(false)}
          onBuy={handleBuyBook}
        />
      )}
      {!readOnly && addToBook && (
        <AddToBookModal
          book={addToBook}
          goldPieces={character.goldPieces}
          onClose={() => setAddToBookId(null)}
          onAdd={handleAddToBook}
        />
      )}
    </div>
  );
}
