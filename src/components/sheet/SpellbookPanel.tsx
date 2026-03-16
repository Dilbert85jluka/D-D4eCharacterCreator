import { useState, useEffect } from 'react';
import type { Character, WizardSpellbook } from '../../types/character';
import { getPowerById } from '../../data/powers';
import { getRituals, getRitualById } from '../../data/rituals';
import { getClassById } from '../../data/classes';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { useAppStore } from '../../store/useAppStore';
import {
  getAllSpellbookPowerIds,
  getAllSpellbookRitualIds,
  spellbookPagesUsed,
  SPELLBOOK_MAX_PAGES,
} from '../../utils/spellbook';
import type { PowerData, RitualData } from '../../types/gameData';

const SPELLBOOK_COST = 50;

// Wizard class feature: levels where 2 additional rituals are mastered
const RITUAL_MASTERY_LEVELS = [5, 11, 15, 21, 25];

function totalEarnedRituals(level: number): number {
  return 3 + 2 * RITUAL_MASTERY_LEVELS.filter((l) => l <= level).length;
}

// ── Prepare-max helpers ────────────────────────────────────────────────────────
function maxDailyForLevel(level: number): number {
  if (level >= 29) return 7;
  if (level >= 25) return 6;
  if (level >= 19) return 5;
  if (level >= 15) return 4;
  if (level >= 9)  return 3;
  if (level >= 5)  return 2;
  return 1;
}
function maxUtilityForLevel(level: number): number {
  if (level >= 22) return 5;
  if (level >= 16) return 4;
  if (level >= 10) return 3;
  if (level >= 6)  return 2;
  if (level >= 2)  return 1;
  return 0;
}

interface Props {
  character: Character;
}

// ── SkillCheckTable ────────────────────────────────────────────────────────────
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

// ── PageBar ────────────────────────────────────────────────────────────────────
function PageBar({ used, max }: { used: number; max: number }) {
  const pct = Math.min((used / max) * 100, 100);
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-1.5 text-xs text-stone-500">
      <div className="w-20 h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="whitespace-nowrap">{used}/{max} pages</span>
    </div>
  );
}

// ── Buy Spellbook Modal ────────────────────────────────────────────────────────
interface BuySpellbookModalProps {
  goldPieces: number;
  isFree?: boolean;
  onClose: () => void;
  onBuy: (name: string) => string | null;
}
function BuySpellbookModal({ goldPieces, isFree, onClose, onBuy }: BuySpellbookModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleConfirm() {
    if (!name.trim()) { setError('Please enter a name for the spellbook.'); return; }
    const err = onBuy(name.trim());
    if (err) { setError(err); return; }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
        <div className="bg-indigo-800 px-5 py-4 text-white flex items-center justify-between">
          <h3 className="font-bold text-lg">📖 {isFree ? 'Name Your Spellbook' : 'Buy New Spellbook'}</h3>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 text-xl leading-none">×</button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1">Spellbook Name</label>
            <input
              type="text"
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); if (e.key === 'Escape') onClose(); }}
              placeholder="e.g. Grimoire of Kira"
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              autoFocus
            />
          </div>
          {!isFree && (
            <p className="text-xs text-stone-500">
              Cost: <strong>{SPELLBOOK_COST} gp</strong> &nbsp;·&nbsp; You have: <strong>{goldPieces} gp</strong>
            </p>
          )}
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold hover:bg-stone-50 text-sm">Cancel</button>
          <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-semibold text-sm">
            {isFree ? 'Confirm' : `Purchase (${SPELLBOOK_COST} gp)`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Mastered Ritual Modal ──────────────────────────────────────────────────
interface AddRitualToBookModalProps {
  book: WizardSpellbook;
  allMasteredRitualIds: Set<string>;
  characterLevel: number;
  onClose: () => void;
  onAdd: (ritual: RitualData) => void;
}
function AddRitualToBookModal({ book, allMasteredRitualIds, characterLevel, onClose, onAdd }: AddRitualToBookModalProps) {
  const [search, setSearch] = useState('');
  const pagesUsed = spellbookPagesUsed(book);
  const remaining = SPELLBOOK_MAX_PAGES - pagesUsed;
  const all = getRituals();
  const filtered = all
    .filter((r) => !allMasteredRitualIds.has(r.id))
    .filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.keySkill.toLowerCase().includes(search.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-violet-800 px-5 py-4 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-bold text-lg">📜 Add Mastered Ritual</h3>
            <p className="text-xs opacity-80 mt-0.5">"{book.name}" · {pagesUsed}/{SPELLBOOK_MAX_PAGES} pages</p>
          </div>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 text-xl leading-none">×</button>
        </div>
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
        <div className="overflow-y-auto flex-1 px-4 pb-4">
          {filtered.length === 0 && (
            <p className="text-sm text-stone-400 py-4 text-center">No rituals match.</p>
          )}
          {filtered.map((r) => {
            const levelOk = r.level <= characterLevel;
            const fits    = r.level <= remaining;
            const canAdd  = levelOk && fits;
            return (
              <div
                key={r.id}
                className={['rounded-lg mb-1 border px-3 py-2.5', canAdd ? 'border-stone-100' : 'border-transparent opacity-50'].join(' ')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-stone-800">{r.name}</span>
                      <span className="text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-medium">{r.category}</span>
                      <span className="text-xs text-stone-400">Lv {r.level} · {r.level} page{r.level !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 text-xs text-stone-500 mt-1">
                      <span>{r.keySkill}</span>
                      <span>⏱ {r.castingTime}</span>
                      <span>⧗ {r.duration}</span>
                      <span>Cast: {r.componentNote ?? `${r.componentCost} gp`}</span>
                      {!levelOk && <span className="text-amber-600 font-medium">Requires character level {r.level}</span>}
                      {levelOk && !fits && <span className="text-red-500 font-medium">Not enough pages ({remaining} remaining)</span>}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mt-1.5">{r.description}</p>
                    {r.skillCheckTable && (
                      <SkillCheckTable table={r.skillCheckTable} skill={r.keySkill} />
                    )}
                  </div>
                  <button
                    onClick={() => { onAdd(r); onClose(); }}
                    disabled={!canAdd}
                    className="ml-1 px-3 py-1 text-xs bg-violet-700 hover:bg-violet-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex-shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-stone-200 px-4 py-3 flex-shrink-0 flex items-center justify-between">
          <span className="text-xs text-stone-500">{remaining} pages remaining</span>
          <button onClick={onClose} className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50">Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Spellbook Power Row ────────────────────────────────────────────────────────
interface SpellbookPowerRowProps {
  power: PowerData;
  isPrepared: boolean;
  canPrepare: boolean;
  isWizard: boolean;
  onTogglePrepare: () => void;
  usedToday: boolean;
}
function SpellbookPowerRow({ power, isPrepared, canPrepare, isWizard, onTogglePrepare, usedToday }: SpellbookPowerRowProps) {
  const [expanded, setExpanded] = useState(false);
  const rowBg = isPrepared ? 'bg-emerald-50 border-emerald-200' : 'bg-stone-50 border-stone-200';
  return (
    <div className={`border rounded-lg px-3 py-2.5 ${rowBg} transition-colors`}>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-stone-800">{power.name}</span>
            <span className="text-[10px] font-bold bg-gray-800 text-white px-1.5 py-0.5 rounded uppercase">
              {power.actionType.replace('-', ' ')}
            </span>
            <span className="text-[10px] text-stone-400">{power.level}p</span>
            {power.keywords.length > 0 && (
              <span className="text-xs text-stone-400">{power.keywords.join(' · ')}</span>
            )}
            {usedToday && (
              <span className="text-[10px] font-bold bg-red-700 text-white px-1.5 py-0.5 rounded">Used</span>
            )}
          </div>
          {(power.hit ?? power.effect) && (
            <p className={['text-xs text-stone-600 mt-1', expanded ? '' : 'line-clamp-2'].join(' ')}>
              <strong>{power.hit ? 'Hit' : 'Effect'}:</strong> {power.hit ?? power.effect}
            </p>
          )}
          {expanded && (
            <div className="mt-2 text-xs space-y-0.5 text-stone-600 border-t border-stone-200 pt-2">
              {power.trigger  && <p><strong>Trigger:</strong> {power.trigger}</p>}
              {power.target   && <p><strong>Target:</strong> {power.target}</p>}
              {power.attack   && <p><strong>Attack:</strong> {power.attack}</p>}
              {power.miss     && <p><strong className="text-red-600">Miss:</strong> {power.miss}</p>}
              {power.special  && <p><strong className="text-amber-700">Special:</strong> {power.special}</p>}
              {power.flavor   && <p className="italic text-stone-400">{power.flavor}</p>}
            </div>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[10px] text-amber-600 hover:text-amber-700 mt-1 font-medium"
          >
            {expanded ? '▲ Less' : '▼ Details'}
          </button>
        </div>

        {/* Prepare toggle (wizard only) */}
        {isWizard && (
          <button
            onClick={onTogglePrepare}
            disabled={!isPrepared && !canPrepare}
            className={[
              'flex-shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors min-h-[36px] whitespace-nowrap',
              isPrepared
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : canPrepare
                  ? 'bg-white border border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-700'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed',
            ].join(' ')}
            title={isPrepared ? 'Click to unprepare' : canPrepare ? 'Click to prepare' : 'Prepare limit reached'}
          >
            {isPrepared ? '✓ Prepared' : 'Prepare'}
          </button>
        )}
        {!isWizard && (
          <span className="flex-shrink-0 text-[10px] font-bold bg-blue-700 text-white px-1.5 py-0.5 rounded whitespace-nowrap self-start mt-1">Known</span>
        )}
      </div>
    </div>
  );
}

// ── Main SpellbookPanel ────────────────────────────────────────────────────────
export function SpellbookPanel({ character }: Props) {
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);
  const showToast       = useAppStore((s) => s.showToast);

  const isWizard = character.classId === 'wizard';
  const cls      = getClassById(character.classId);

  // Modal state
  const [showBuyBook,        setShowBuyBook]        = useState(false);
  const [addRitualToBookId,  setAddRitualToBookId]  = useState<string | null>(null);
  const [confirmDeleteId,    setConfirmDeleteId]    = useState<string | null>(null);
  const [editingBookId,      setEditingBookId]      = useState<string | null>(null);
  const [editingName,        setEditingName]        = useState('');
  // Non-wizard buy-spellbook flow
  const [confirmBuy,         setConfirmBuy]         = useState(false);

  const patch = async (changes: Partial<Character>) => {
    const updated = { ...character, ...changes };
    await characterRepository.patch(character.id, changes);
    updateCharacter(updated);
  };

  // ── Auto-migrate legacy characters ────────────────────────────────────────
  // If character has spellbook data in old flat fields but no new spellbooks array, migrate once.
  useEffect(() => {
    if (character.hasSpellbook && !character.spellbooks?.length) {
      const newBook: WizardSpellbook = {
        id: crypto.randomUUID(),
        name: 'My Spellbook',
        powerIds:  character.spellbookPowerIds ?? [],
        ritualIds: character.spellbookMasteredRitualIds ?? [],
      };
      patch({ spellbooks: [newBook] });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived lists ─────────────────────────────────────────────────────────
  const spellbooks          = character.spellbooks ?? [];
  const allKnownPowerIds    = getAllSpellbookPowerIds(character);
  const allMasteredRitualIds = getAllSpellbookRitualIds(character);

  const earnedRituals  = isWizard ? totalEarnedRituals(character.level) : 0;
  const pendingRituals = isWizard ? Math.max(0, earnedRituals - allMasteredRitualIds.length) : 0;

  // Prepare/unprepare tracking
  const preparedDailyIds   = new Set(
    character.selectedPowers
      .map((sp) => getPowerById(sp.powerId))
      .filter((p): p is PowerData => !!p && p.usage === 'daily' && p.powerType !== 'utility')
      .map((p) => p.id),
  );
  const preparedUtilityIds = new Set(
    character.selectedPowers
      .map((sp) => getPowerById(sp.powerId))
      .filter((p) => p?.powerType === 'utility')
      .map((p) => p!.id),
  );
  const dailyPrepareMax   = maxDailyForLevel(character.level);
  const utilityPrepareMax = maxUtilityForLevel(character.level);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleBuyBook = (name: string): string | null => {
    if (character.goldPieces < SPELLBOOK_COST) {
      return `Not enough gold — need ${SPELLBOOK_COST} gp (have ${character.goldPieces} gp).`;
    }
    const newBook: WizardSpellbook = { id: crypto.randomUUID(), name, powerIds: [], ritualIds: [] };
    patch({
      spellbooks:  [...spellbooks, newBook],
      goldPieces:  character.goldPieces - SPELLBOOK_COST,
      hasSpellbook: true,
    });
    showToast(`"${name}" purchased for ${SPELLBOOK_COST} gp.`, 'success');
    return null;
  };

  // For non-wizards purchasing their first spellbook
  const handleBuyFirstSpellbook = () => {
    if (character.goldPieces < SPELLBOOK_COST) {
      showToast(`Not enough gold — need ${SPELLBOOK_COST} gp.`, 'error');
      setConfirmBuy(false);
      return;
    }
    // Populate with existing daily/utility powers
    const powerIds = character.selectedPowers
      .map((sp) => getPowerById(sp.powerId))
      .filter((p) => p?.usage === 'daily' || p?.powerType === 'utility')
      .map((p) => p!.id);
    const newBook: WizardSpellbook = {
      id: crypto.randomUUID(),
      name: 'My Spellbook',
      powerIds,
      ritualIds: [],
    };
    patch({
      hasSpellbook: true,
      spellbooks:   [newBook],
      spellbookPowerIds: powerIds,
      goldPieces:   character.goldPieces - SPELLBOOK_COST,
    });
    showToast(`Blank spellbook purchased for ${SPELLBOOK_COST} gp.`, 'success');
    setConfirmBuy(false);
  };

  const handleRenameBook = (bookId: string) => {
    const name = editingName.trim();
    if (!name) return;
    const updated = spellbooks.map((b) => b.id === bookId ? { ...b, name } : b);
    patch({ spellbooks: updated });
    setEditingBookId(null);
    setEditingName('');
  };

  const handleDeleteBook = (bookId: string) => {
    const book = spellbooks.find((b) => b.id === bookId);
    if (!book) return;
    if (isWizard && spellbooks.length === 1) {
      showToast('A wizard must have at least one spellbook.', 'error');
      setConfirmDeleteId(null);
      return;
    }
    // Move contents to the first remaining book (or just drop if no books remain)
    const remaining = spellbooks.filter((b) => b.id !== bookId);
    let updated = remaining;
    if (remaining.length > 0 && (book.powerIds.length > 0 || book.ritualIds.length > 0)) {
      updated = [
        {
          ...remaining[0],
          powerIds:  [...remaining[0].powerIds,  ...book.powerIds],
          ritualIds: [...remaining[0].ritualIds, ...book.ritualIds],
        },
        ...remaining.slice(1),
      ];
    }
    // Recompute flat legacy fields from remaining books
    const newPowerIds   = [...new Set(updated.flatMap((b) => b.powerIds))];
    const newRitualIds  = [...new Set(updated.flatMap((b) => b.ritualIds))];
    patch({
      spellbooks: updated,
      hasSpellbook: updated.length > 0 ? true : undefined,
      spellbookPowerIds:         newPowerIds,
      spellbookMasteredRitualIds: newRitualIds,
    });
    setConfirmDeleteId(null);
    showToast(`"${book.name}" deleted — contents moved to "${updated[0]?.name ?? ''}'.`, 'success');
  };

  const handleAddRitualToBook = (bookId: string, ritual: RitualData) => {
    const updated = spellbooks.map((b) =>
      b.id === bookId ? { ...b, ritualIds: [...b.ritualIds, ritual.id] } : b,
    );
    const newRitualIds = [...new Set(updated.flatMap((b) => b.ritualIds))];
    patch({ spellbooks: updated, spellbookMasteredRitualIds: newRitualIds });
    showToast(`${ritual.name} added to your mastered rituals.`, 'success');
  };

  const handleRemoveRitualFromBook = (bookId: string, ritualId: string) => {
    const updated = spellbooks.map((b) =>
      b.id === bookId ? { ...b, ritualIds: b.ritualIds.filter((id) => id !== ritualId) } : b,
    );
    const newRitualIds = [...new Set(updated.flatMap((b) => b.ritualIds))];
    patch({ spellbooks: updated, spellbookMasteredRitualIds: newRitualIds });
  };

  const handleUseMasteredRitual = (rd: RitualData) => {
    if (rd.componentCost > 0 && character.goldPieces < rd.componentCost) {
      showToast(`Not enough gold — ${rd.name} requires ${rd.componentCost} gp.`, 'error');
      return;
    }
    patch({ goldPieces: character.goldPieces - rd.componentCost });
    const costMsg = rd.componentCost === 0
      ? rd.componentNote ?? '(special component cost)'
      : `(${rd.componentCost} gp deducted)${rd.componentNote ? ' — ' + rd.componentNote : ''}`;
    showToast(`${rd.name} cast ${costMsg}.`, 'success');
  };

  const handleTogglePrepare = (power: PowerData) => {
    const isUtility  = power.powerType === 'utility';
    const isPrepared = isUtility
      ? preparedUtilityIds.has(power.id)
      : preparedDailyIds.has(power.id);

    if (isPrepared) {
      patch({
        selectedPowers:  character.selectedPowers.filter((sp) => sp.powerId !== power.id),
        usedDailyPowers: character.usedDailyPowers.filter((id) => id !== power.id),
      });
      showToast(`${power.name} unprepared.`, 'success');
    } else {
      const currentPrepared = isUtility ? preparedUtilityIds.size : preparedDailyIds.size;
      const max             = isUtility ? utilityPrepareMax      : dailyPrepareMax;
      if (currentPrepared >= max) {
        showToast(
          `Can only prepare ${max} ${isUtility ? 'utility' : 'daily'} power${max !== 1 ? 's' : ''} at a time.`,
          'error',
        );
        return;
      }
      patch({ selectedPowers: [...character.selectedPowers, { powerId: power.id, used: false }] });
      showToast(`${power.name} prepared!`, 'success');
    }
  };

  // ── Empty state (no spellbook at all) ─────────────────────────────────────
  if (!character.hasSpellbook && spellbooks.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
          <p className="text-4xl mb-3">📖</p>
          <h3 className="font-bold text-stone-800 mb-1">No Spellbook</h3>
          <p className="text-sm text-stone-500 mb-4">
            {isWizard
              ? 'A wizard should always have their spellbook! Something went wrong.'
              : 'Purchase a blank spellbook to record your daily and utility powers.'}
          </p>
          {!isWizard && (
            <>
              {confirmBuy ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-stone-700">
                    Buy blank spellbook for {SPELLBOOK_COST} gp? (You have {character.goldPieces} gp)
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => setConfirmBuy(false)} className="px-4 py-2 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold text-sm">Cancel</button>
                    <button
                      onClick={handleBuyFirstSpellbook}
                      disabled={character.goldPieces < SPELLBOOK_COST}
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl font-semibold text-sm"
                    >Buy</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setConfirmBuy(true)} className="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
                  + Buy Blank Spellbook ({SPELLBOOK_COST} gp)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Main content ──────────────────────────────────────────────────────────
  const addRitualToBook = addRitualToBookId ? spellbooks.find((b) => b.id === addRitualToBookId) : null;

  // When spellbooks is still empty (migration effect hasn't patched yet), show spinner
  if (character.hasSpellbook && spellbooks.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400 text-sm">Migrating spellbook data…</div>
    );
  }

  return (
    <div className="p-4 space-y-4">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📖</span>
          <div>
            <h2 className="font-bold text-stone-800 text-base">
              {isWizard ? `${cls?.name ?? 'Wizard'}'s Spellbook${spellbooks.length > 1 ? 's' : ''}` : 'Spellbook'}
            </h2>
            <p className="text-xs text-stone-500">
              {isWizard ? 'Class feature — 1 free book' : 'Purchased spellbook'}
              {spellbooks.length > 1 ? ` · ${spellbooks.length} books owned` : ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowBuyBook(true)}
          className="text-xs bg-indigo-700 hover:bg-indigo-600 text-white font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
        >
          + Buy Book ({SPELLBOOK_COST} gp)
        </button>
      </div>

      {/* ── Pending ritual grants banner (wizard) ───────────────────────── */}
      {isWizard && pendingRituals > 0 && (
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
          <span className="text-teal-600 text-base flex-shrink-0">📜</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-teal-800">
              {pendingRituals} free ritual grant{pendingRituals !== 1 ? 's' : ''} remaining
            </p>
            <p className="text-xs text-teal-600">
              Tap "+ Add Ritual" on any book below to choose {pendingRituals !== 1 ? 'them' : 'it'}.
            </p>
          </div>
          <span className="flex-shrink-0 text-xs font-bold bg-teal-600 text-white px-1.5 py-0.5 rounded-full">
            {pendingRituals}
          </span>
        </div>
      )}

      {/* ── Ritual mastery counter ───────────────────────────────────────── */}
      {isWizard && (
        <p className="text-xs text-stone-400">
          Mastered rituals: <strong className="text-stone-600">{allMasteredRitualIds.length}/{earnedRituals}</strong> class-feature grants used
        </p>
      )}

      {/* ── Per-book sections ────────────────────────────────────────────── */}
      {spellbooks.map((book) => {
        const pagesUsed     = spellbookPagesUsed(book);
        const pagesOver     = pagesUsed > SPELLBOOK_MAX_PAGES;
        const isEditingThis = editingBookId === book.id;
        const isDeleting    = confirmDeleteId === book.id;

        const bookPowers    = book.powerIds.map((id) => getPowerById(id)).filter((p): p is PowerData => !!p);
        const bookDailies   = bookPowers.filter((p) => p.usage === 'daily' && p.powerType !== 'utility');
        const bookUtilities = bookPowers.filter((p) => p.powerType === 'utility');
        const bookRituals   = book.ritualIds.map((id) => getRitualById(id)).filter((r): r is RitualData => !!r);

        const canAddRitual  = isWizard && pendingRituals > 0;

        return (
          <div key={book.id} className="border border-indigo-200 rounded-xl overflow-hidden">
            {/* Book header */}
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2.5">
              <span className="text-base flex-shrink-0">📖</span>

              {isEditingThis ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter')  { handleRenameBook(book.id); }
                      if (e.key === 'Escape') { setEditingBookId(null); setEditingName(''); }
                    }}
                    className="flex-1 border border-indigo-300 rounded-lg px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    autoFocus
                    maxLength={40}
                  />
                  <button onClick={() => handleRenameBook(book.id)} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg font-semibold">Save</button>
                  <button onClick={() => { setEditingBookId(null); setEditingName(''); }} className="text-xs text-stone-500 px-1">Cancel</button>
                </div>
              ) : (
                <>
                  <span className="font-semibold text-sm text-stone-800 flex-1 truncate">{book.name}</span>
                  <PageBar used={pagesUsed} max={SPELLBOOK_MAX_PAGES} />
                  {pagesOver && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded flex-shrink-0">Overfull!</span>
                  )}
                </>
              )}

              {!isEditingThis && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => { setEditingBookId(book.id); setEditingName(book.name); }}
                    className="text-stone-400 hover:text-indigo-600 transition-colors text-xs px-1 py-0.5"
                    title="Rename book"
                  >✏️</button>

                  {isDeleting ? (
                    <span className="flex items-center gap-1 text-xs">
                      <span className="text-stone-600">Delete?</span>
                      <button onClick={() => setConfirmDeleteId(null)} className="text-stone-500 hover:text-stone-700 font-semibold px-1">Cancel</button>
                      <button onClick={() => handleDeleteBook(book.id)} className="text-red-600 hover:text-red-800 font-bold px-1">Delete</button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(book.id)}
                      className="text-stone-300 hover:text-red-500 transition-colors text-sm px-1"
                      title="Delete book"
                    >🗑</button>
                  )}
                </div>
              )}
            </div>

            <div className="divide-y divide-stone-100">

              {/* ── Daily Powers ────────────────────────────────────────── */}
              {(bookDailies.length > 0 || character.level >= 1) && (
                <div className="px-3 py-2.5">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
                    Daily Powers
                    {isWizard && (
                      <span className="ml-2 font-normal normal-case tracking-normal text-stone-400">
                        {preparedDailyIds.size}/{dailyPrepareMax} prepared
                      </span>
                    )}
                  </p>
                  {bookDailies.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">No daily powers in this book.</p>
                  ) : (
                    <div className="space-y-2">
                      {bookDailies.map((power) => (
                        <SpellbookPowerRow
                          key={power.id}
                          power={power}
                          isPrepared={preparedDailyIds.has(power.id)}
                          canPrepare={preparedDailyIds.size < dailyPrepareMax}
                          isWizard={isWizard}
                          onTogglePrepare={() => handleTogglePrepare(power)}
                          usedToday={character.usedDailyPowers.includes(power.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Utility Powers ──────────────────────────────────────── */}
              {(bookUtilities.length > 0 || character.level >= 2) && (
                <div className="px-3 py-2.5">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
                    Utility Powers
                    {isWizard && (
                      <span className="ml-2 font-normal normal-case tracking-normal text-stone-400">
                        {preparedUtilityIds.size}/{utilityPrepareMax} prepared
                      </span>
                    )}
                  </p>
                  {bookUtilities.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">
                      No utility powers in this book.
                      {character.level < 2 && ' (Utility powers gained at level 2.)'}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {bookUtilities.map((power) => (
                        <SpellbookPowerRow
                          key={power.id}
                          power={power}
                          isPrepared={preparedUtilityIds.has(power.id)}
                          canPrepare={preparedUtilityIds.size < utilityPrepareMax}
                          isWizard={isWizard}
                          onTogglePrepare={() => handleTogglePrepare(power)}
                          usedToday={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Mastered Rituals ────────────────────────────────────── */}
              <div className="px-3 py-2.5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                    Mastered Rituals
                  </p>
                  {canAddRitual && (
                    <button
                      onClick={() => setAddRitualToBookId(book.id)}
                      className="text-xs bg-violet-700 hover:bg-violet-600 text-white font-semibold px-2 py-1 rounded-lg transition-colors"
                    >
                      + Add Ritual
                    </button>
                  )}
                </div>
                {bookRituals.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">
                    No mastered rituals in this book.
                    {isWizard && pendingRituals > 0 && ' Tap "+ Add Ritual" above.'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {bookRituals.map((rd) => (
                      <div key={rd.id} className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-violet-700">Lv {rd.level}</span>
                              <span className="text-sm font-semibold text-stone-800">{rd.name}</span>
                              <span className="text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-medium">{rd.category}</span>
                              <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">★ Mastered</span>
                              <span className="text-[10px] text-stone-400">{rd.level}p</span>
                            </div>
                            <div className="flex flex-wrap gap-x-3 text-xs text-stone-500 mt-1">
                              <span>{rd.keySkill}</span>
                              <span>⏱ {rd.castingTime}</span>
                              <span>⏳ {rd.duration}</span>
                              <span>Cast: {rd.componentNote ?? `${rd.componentCost} gp`}</span>
                            </div>
                            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{rd.description}</p>
                            {rd.skillCheckTable && <SkillCheckTable table={rd.skillCheckTable} skill={rd.keySkill} />}
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleRemoveRitualFromBook(book.id, rd.id)}
                              className="text-stone-300 hover:text-red-400 text-lg leading-none transition-colors"
                              title="Remove from spellbook"
                            >×</button>
                            <button
                              onClick={() => handleUseMasteredRitual(rd)}
                              className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-2 py-1 rounded-lg transition-colors whitespace-nowrap"
                            >
                              {rd.componentCost === 0 ? 'Use (special)' : `Use (${rd.componentCost} gp)`}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })}

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {showBuyBook && (
        <BuySpellbookModal
          goldPieces={character.goldPieces}
          onClose={() => setShowBuyBook(false)}
          onBuy={(name) => {
            const err = handleBuyBook(name);
            return err;
          }}
        />
      )}
      {addRitualToBook && (
        <AddRitualToBookModal
          book={addRitualToBook}
          allMasteredRitualIds={new Set(allMasteredRitualIds)}
          characterLevel={character.level}
          onClose={() => setAddRitualToBookId(null)}
          onAdd={(ritual) => handleAddRitualToBook(addRitualToBook.id, ritual)}
        />
      )}
    </div>
  );
}
