import { useState, useMemo, useCallback, useEffect } from 'react';
import type { MagicItemData, MagicItemCategory, MagicItemFilters } from '../types/magicItem';
import { ALL_MAGIC_ITEMS } from '../data/magicItems';
import { MagicItemModal, CATEGORY_COLORS } from '../components/magicItems/MagicItemModal';
import { RandomItemRoller } from '../components/magicItems/RandomItemRoller';

// ─── Category badge colours for list rows ────────────────────────────────────
const CATEGORY_BADGE_BG: Record<MagicItemCategory, string> = {
  Potion:        'bg-emerald-100 text-emerald-800',
  Scroll:        'bg-sky-100 text-sky-800',
  Ring:          'bg-amber-100 text-amber-800',
  Rod:           'bg-red-100 text-red-800',
  Staff:         'bg-purple-100 text-purple-800',
  Wand:          'bg-indigo-100 text-indigo-800',
  Miscellaneous: 'bg-teal-100 text-teal-800',
  Armor:         'bg-stone-200 text-stone-800',
  Weapon:        'bg-rose-100 text-rose-800',
};

// ─── Filter constants ────────────────────────────────────────────────────────
const ALL_CATEGORIES: MagicItemCategory[] = [
  'Potion', 'Scroll', 'Ring', 'Rod', 'Staff', 'Wand', 'Miscellaneous', 'Armor', 'Weapon',
];

const DEFAULT_FILTERS: MagicItemFilters = {
  categories: [...ALL_CATEGORIES],
  query: '',
};

function matchesFilters(item: MagicItemData, f: MagicItemFilters): boolean {
  if (!f.categories.includes(item.category)) return false;
  if (f.query) {
    const q = f.query.toLowerCase();
    if (!item.name.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q) &&
        !item.source.toLowerCase().includes(q)) {
      return false;
    }
  }
  return true;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ToggleChip<T extends string>({
  label, value, active, onToggle,
}: { label: string; value: T; active: boolean; onToggle: (v: T) => void }) {
  return (
    <button
      onClick={() => onToggle(value)}
      className={[
        'px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors min-h-[32px]',
        active
          ? 'bg-amber-700 text-white border-amber-700'
          : 'bg-white text-stone-600 border-stone-300 hover:border-amber-400',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function ItemRow({ item, onClick }: { item: MagicItemData; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2.5 border-b border-stone-100 hover:bg-amber-50 transition-colors flex items-center gap-3 min-h-[52px]"
    >
      {/* Category colour strip */}
      <span className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${CATEGORY_COLORS[item.category].split(' ')[0]}`} />

      {/* Name + source */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-stone-800 text-sm truncate">{item.name}</div>
        <div className="text-xs text-stone-400 truncate">
          {item.source}
        </div>
      </div>

      {/* Category badge */}
      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold flex-shrink-0 ${CATEGORY_BADGE_BG[item.category]}`}>
        {item.category}
      </span>
    </button>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 30;

export function MagicItemCompendiumPage() {
  const [filters, setFilters] = useState<MagicItemFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<MagicItemData | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRoller, setShowRoller] = useState(false);

  const toggle = useCallback(<T extends string>(
    key: keyof MagicItemFilters,
    value: T,
    current: T[],
  ) => {
    setFilters((f) => ({
      ...f,
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    }));
  }, []);

  const filtered = useMemo(() => {
    const list = ALL_MAGIC_ITEMS.filter((m) => matchesFilters(m, filters));
    if (sortBy === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return [...list].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  }, [filters, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-stone-100">

      {/* ── Magic Item Banner ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: '160px' }}>
        <svg
          viewBox="0 0 1200 160"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mi-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#0c0020" />
              <stop offset="40%"  stopColor="#1a0040" />
              <stop offset="70%"  stopColor="#2d0060" />
              <stop offset="100%" stopColor="#0c0020" />
            </linearGradient>
            <radialGradient id="mi-glow-l" cx="20%" cy="60%" r="35%">
              <stop offset="0%"   stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mi-glow-r" cx="80%" cy="50%" r="30%">
              <stop offset="0%"   stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mi-orb" cx="50%" cy="40%" r="20%">
              <stop offset="0%"   stopColor="#c084fc" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="1200" height="160" fill="url(#mi-bg)" />
          <rect width="1200" height="160" fill="url(#mi-glow-l)" />
          <rect width="1200" height="160" fill="url(#mi-glow-r)" />
          <rect width="1200" height="160" fill="url(#mi-orb)" />

          {/* Stars / sparkles */}
          {[
            [80,15,1.5],[200,10,1],[340,22,1.5],[480,8,1],[600,18,1.2],[720,12,1.5],
            [850,6,1],[950,20,1.2],[1080,14,1],[1150,9,1.5],[160,35,0.8],[500,30,0.8],
            [780,33,0.8],[1020,28,0.8],[380,42,1],[640,38,0.8],[900,44,1],[1120,40,0.8],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#e9d5ff" opacity={0.4 + (i % 3) * 0.2} />
          ))}

          {/* Treasure chest (center-left) */}
          <rect x="180" y="90" width="70" height="45" rx="4" fill="#1a0040" />
          <rect x="180" y="90" width="70" height="16" rx="4" fill="#2d0060" />
          <rect x="208" y="95" width="14" height="8" rx="2" fill="#f59e0b" opacity="0.7" />
          <circle cx="215" cy="118" r="5" fill="#f59e0b" opacity="0.5" />

          {/* Floating orb (center) */}
          <circle cx="600" cy="75" r="22" fill="#7c3aed" opacity="0.5" />
          <circle cx="600" cy="75" r="14" fill="#a78bfa" opacity="0.6" />
          <circle cx="594" cy="69" r="5" fill="#e9d5ff" opacity="0.7" />
          {/* Orb glow ring */}
          <circle cx="600" cy="75" r="30" fill="none" stroke="#c084fc" strokeWidth="1" opacity="0.4" />
          <circle cx="600" cy="75" r="38" fill="none" stroke="#c084fc" strokeWidth="0.5" opacity="0.2" />

          {/* Sword silhouette (right) */}
          <rect x="920" y="30" width="6" height="80" rx="2" fill="#1a0040" />
          <rect x="908" y="72" width="30" height="6" rx="2" fill="#1a0040" />
          <path d="M 920,30 L 923,20 L 926,30 Z" fill="#1a0040" />
          {/* Sword glow */}
          <rect x="920" y="30" width="6" height="80" rx="2" fill="#f59e0b" opacity="0.15" />

          {/* Potion bottle (far left) */}
          <rect x="60" y="85" width="20" height="35" rx="3" fill="#1a0040" />
          <rect x="64" y="78" width="12" height="10" rx="2" fill="#1a0040" />
          <circle cx="70" cy="105" r="6" fill="#10b981" opacity="0.3" />

          {/* Ring (far right) */}
          <circle cx="1080" cy="90" r="18" fill="none" stroke="#1a0040" strokeWidth="8" />
          <circle cx="1080" cy="90" r="18" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
          <circle cx="1080" cy="75" r="5" fill="#f59e0b" opacity="0.3" />

          {/* Magical runes along bottom */}
          {[120, 300, 500, 700, 900, 1100].map((x, i) => (
            <text key={i} x={x} y={150} fontSize="14" fill="#7c3aed" opacity="0.15" fontFamily="serif">
              {['⊕', '◈', '⊗', '◇', '⊙', '◆'][i]}
            </text>
          ))}
        </svg>

        {/* Title overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="text-center">
            <h1
              className="text-3xl font-bold tracking-widest text-purple-200 uppercase"
              style={{ textShadow: '0 0 24px rgba(168,85,247,0.9), 0 0 8px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,1)' }}
            >
              ✨ Magic Item Compendium
            </h1>
            <p
              className="text-sm tracking-widest mt-1 text-purple-400/80 uppercase"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,1)' }}
            >
              AD&amp;D 2e / D&amp;D 4e / D&amp;D 5e · {ALL_MAGIC_ITEMS.length} Items
            </p>
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 py-3 space-y-2">

          {/* Search + Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search items, categories, sources…"
                value={filters.query}
                onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-amber-500 min-h-[40px]"
              />
              {filters.query && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, query: '' }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'category')}
              className="border border-stone-300 rounded-lg text-sm px-2 py-2 focus:outline-none focus:border-amber-500 min-h-[40px] bg-white"
            >
              <option value="name">Sort: Name</option>
              <option value="category">Sort: Category</option>
            </select>

            {/* Roller toggle */}
            <button
              onClick={() => setShowRoller((v) => !v)}
              className={[
                'px-3 py-2 rounded-lg text-sm font-semibold border transition-colors min-h-[40px]',
                showRoller
                  ? 'bg-amber-700 text-white border-amber-700'
                  : 'bg-white text-amber-700 border-amber-300 hover:border-amber-500',
              ].join(' ')}
            >
              🎲
            </button>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-stone-400 uppercase w-14 flex-shrink-0">Type</span>
            {ALL_CATEGORIES.map((cat) => (
              <ToggleChip
                key={cat}
                label={cat}
                value={cat}
                active={filters.categories.includes(cat)}
                onToggle={(v) => toggle('categories', v, filters.categories)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Roller panel */}
      {showRoller && (
        <div className="max-w-4xl mx-auto px-3 pt-3">
          <RandomItemRoller onSelectItem={(item) => setSelected(item)} />
        </div>
      )}

      {/* Results count */}
      <div className="max-w-4xl mx-auto px-3 pt-3 pb-1 flex items-center justify-between">
        <span className="text-sm text-stone-500">
          {filtered.length === 0
            ? '0 items found'
            : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
        </span>
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="text-xs text-amber-700 hover:text-amber-900 underline"
        >
          Reset filters
        </button>
      </div>

      {/* Item list */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-stone-200 mx-3 mb-8 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <div className="text-4xl mb-3">✨</div>
            <div className="font-semibold">No items match your filters</div>
            <div className="text-sm mt-1">Try broadening your search or resetting the filters</div>
          </div>
        ) : (
          paginated.map((item) => (
            <ItemRow key={item.id} item={item} onClick={() => setSelected(item)} />
          ))
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-4 border-t border-stone-100">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-amber-800 text-amber-100 disabled:opacity-40 hover:bg-amber-700 min-w-[80px] min-h-[44px] font-medium"
            >
              ← Prev
            </button>
            <span className="text-stone-600 font-medium text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-amber-800 text-amber-100 disabled:opacity-40 hover:bg-amber-700 min-w-[80px] min-h-[44px] font-medium"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <MagicItemModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
