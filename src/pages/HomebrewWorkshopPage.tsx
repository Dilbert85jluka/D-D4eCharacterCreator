import { useState, useMemo } from 'react';
import { useHomebrewStore } from '../store/useHomebrewStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCampaignsStore } from '../store/useCampaignsStore';
import { HOMEBREW_CONTENT_TYPES } from '../types/homebrew';
import type { HomebrewContentType, HomebrewItem } from '../types/homebrew';
import { HomebrewEditorModal } from '../components/homebrew/HomebrewEditorModal';

function ContentTypePill({ type, active, count, onClick }: {
  type: { key: HomebrewContentType; label: string };
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-3 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] flex items-center gap-2 whitespace-nowrap',
        active
          ? 'bg-amber-700 text-white'
          : 'bg-white text-stone-600 border border-stone-300 hover:border-amber-400 hover:bg-amber-50',
      ].join(' ')}
    >
      {type.label}
      {count > 0 && (
        <span className={[
          'text-xs px-1.5 py-0.5 rounded-full font-bold',
          active ? 'bg-amber-600 text-amber-100' : 'bg-stone-200 text-stone-500',
        ].join(' ')}>
          {count}
        </span>
      )}
    </button>
  );
}

function ItemRow({ item, onEdit, onDelete }: {
  item: HomebrewItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const campaigns = useCampaignsStore((s) => s.campaigns);
  const linkedCampaigns = campaigns.filter((c) => item.campaignIds.includes(c.id));

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 hover:bg-amber-50/50 transition-colors min-h-[56px]">
      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-stone-800 text-sm truncate">{item.name}</div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-stone-400">
            {new Date(item.updatedAt).toLocaleDateString()}
          </span>
          {linkedCampaigns.map((c) => (
            <span key={c.id} className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
              {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={onEdit}
        className="px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors min-h-[36px]"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="px-3 py-1.5 text-xs font-semibold bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors min-h-[36px]"
      >
        Delete
      </button>
    </div>
  );
}

export function HomebrewWorkshopPage() {
  const items = useHomebrewStore((s) => s.items);
  const deleteItem = useHomebrewStore((s) => s.deleteItem);
  const user = useAuthStore((s) => s.user);

  const [activeType, setActiveType] = useState<HomebrewContentType>('power');
  const [search, setSearch] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HomebrewItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Count items per type
  const countsByType = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.contentType] = (counts[item.contentType] ?? 0) + 1;
    }
    return counts;
  }, [items]);

  // Filter items for current type + search
  const filteredItems = useMemo(() => {
    let result = items.filter((i) => i.contentType === activeType);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    return result;
  }, [items, activeType, search]);

  const handleNew = () => {
    setEditingItem(null);
    setEditorOpen(true);
  };

  const handleEdit = (item: HomebrewItem) => {
    setEditingItem(item);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
    setDeleteConfirm(null);
  };

  const activeLabel = HOMEBREW_CONTENT_TYPES.find((t) => t.key === activeType)?.label ?? activeType;

  return (
    <div className="min-h-screen bg-parchment-100">
      {/* ── Homebrew Workshop Banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: '160px' }}>
        <svg
          viewBox="0 0 1200 160"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#451a03" />
              <stop offset="40%"  stopColor="#7c2d12" />
              <stop offset="70%"  stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
            <radialGradient id="hb-forge" cx="50%" cy="70%" r="40%">
              <stop offset="0%"   stopColor="#f97316" stopOpacity="0.5" />
              <stop offset="60%"  stopColor="#ea580c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hb-spark-l" cx="20%" cy="50%" r="30%">
              <stop offset="0%"   stopColor="#fbbf24" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hb-spark-r" cx="80%" cy="55%" r="30%">
              <stop offset="0%"   stopColor="#fbbf24" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width="1200" height="160" fill="url(#hb-bg)" />
          <rect width="1200" height="160" fill="url(#hb-spark-l)" />
          <rect width="1200" height="160" fill="url(#hb-spark-r)" />
          <rect width="1200" height="160" fill="url(#hb-forge)" />

          {/* Embers / sparks */}
          {[
            [90,20,1.5],[210,12,1],[340,28,1.2],[480,15,1.5],[600,22,1],[720,10,1.5],
            [860,18,1.2],[960,25,1],[1080,14,1.5],[1150,22,1],[160,40,0.8],[500,38,0.8],
            [780,42,1],[1020,36,0.8],[380,48,1],[640,44,0.8],[900,50,1],[1120,46,0.8],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={i % 2 === 0 ? '#fbbf24' : '#f97316'} opacity={0.35 + (i % 3) * 0.2} />
          ))}

          {/* Anvil (center) */}
          <g transform="translate(560, 95)">
            {/* Anvil top */}
            <rect x="-50" y="0" width="100" height="14" rx="3" fill="#1c1917" />
            <rect x="-55" y="0" width="10" height="8" rx="2" fill="#1c1917" />
            <rect x="45" y="0" width="10" height="8" rx="2" fill="#1c1917" />
            {/* Anvil waist */}
            <path d="M -35,14 L -20,40 L 20,40 L 35,14 Z" fill="#27272a" />
            {/* Anvil base */}
            <rect x="-40" y="40" width="80" height="15" rx="2" fill="#1c1917" />
            {/* Highlight */}
            <rect x="-48" y="1" width="96" height="2" fill="#57534e" opacity="0.6" />
          </g>

          {/* Hammer (right of anvil, angled, mid-swing) */}
          <g transform="translate(670, 70) rotate(30)">
            <rect x="0" y="0" width="6" height="70" rx="2" fill="#78350f" />
            <rect x="-14" y="-8" width="34" height="20" rx="3" fill="#44403c" />
            <rect x="-14" y="-8" width="34" height="4" fill="#57534e" />
          </g>

          {/* Wrench (far left) */}
          <g transform="translate(140, 70) rotate(-20)">
            <rect x="0" y="0" width="8" height="65" rx="2" fill="#57534e" />
            <circle cx="4" cy="0" r="12" fill="none" stroke="#57534e" strokeWidth="6" />
            <path d="M -4,-10 L 12,-10 L 12,-4 Z" fill="#292524" />
          </g>

          {/* Gear (upper right) */}
          <g transform="translate(960, 55)">
            <circle cx="0" cy="0" r="22" fill="none" stroke="#57534e" strokeWidth="3" />
            <circle cx="0" cy="0" r="8" fill="#44403c" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <rect
                key={angle}
                x="-3" y="-30" width="6" height="8"
                fill="#57534e"
                transform={`rotate(${angle})`}
              />
            ))}
          </g>

          {/* Small gear (upper left) */}
          <g transform="translate(240, 40)">
            <circle cx="0" cy="0" r="14" fill="none" stroke="#57534e" strokeWidth="2" />
            <circle cx="0" cy="0" r="5" fill="#44403c" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <rect
                key={angle}
                x="-2" y="-20" width="4" height="6"
                fill="#57534e"
                transform={`rotate(${angle})`}
              />
            ))}
          </g>

          {/* Forge glow at bottom */}
          <ellipse cx="600" cy="155" rx="180" ry="18" fill="#f97316" opacity="0.35" />
          <ellipse cx="600" cy="152" rx="100" ry="8" fill="#fbbf24" opacity="0.25" />

          {/* Rising sparks from anvil */}
          {[
            [580, 80], [610, 75], [595, 70], [620, 82], [570, 85],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.2} fill="#fbbf24" opacity="0.8" />
          ))}
        </svg>

        {/* Title overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="text-center">
            <h1
              className="text-3xl font-bold tracking-widest text-amber-200 uppercase"
              style={{ textShadow: '0 0 24px rgba(249,115,22,0.9), 0 0 8px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,1)' }}
            >
              🔧 Homebrew Workshop
            </h1>
            <p
              className="text-sm tracking-widest mt-1 text-amber-400/80 uppercase"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,1)' }}
            >
              Forge custom content · {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Content Type Selector — horizontal pill bar */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {HOMEBREW_CONTENT_TYPES.map((type) => (
            <ContentTypePill
              key={type.key}
              type={type}
              active={activeType === type.key}
              count={countsByType[type.key] ?? 0}
              onClick={() => { setActiveType(type.key); setSearch(''); }}
            />
          ))}
        </div>

        {/* Toolbar: search + new button */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeLabel.toLowerCase()}...`}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[44px]"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={handleNew}
            className="px-4 py-2.5 bg-amber-700 text-white font-semibold text-sm rounded-lg hover:bg-amber-600 transition-colors min-h-[44px] flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="text-lg leading-none">+</span>
            New {activeLabel.replace(/s$/, '')}
          </button>
        </div>

        {/* Items list */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <p className="text-lg font-semibold mb-1">
                {search ? 'No matching items' : `No homebrew ${activeLabel.toLowerCase()} yet`}
              </p>
              <p className="text-sm">
                {search
                  ? 'Try a different search term'
                  : `Click "New ${activeLabel.replace(/s$/, '')}" to create one`}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id}>
                {deleteConfirm === item.id ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border-b border-red-200 min-h-[56px]">
                    <span className="text-sm text-red-700 flex-1">
                      Delete <strong>{item.name}</strong>? This cannot be undone.
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors min-h-[36px]"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors min-h-[36px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <ItemRow
                    item={item}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => setDeleteConfirm(item.id)}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Item count */}
        {filteredItems.length > 0 && (
          <p className="text-xs text-stone-400 text-center">
            {filteredItems.length} {activeLabel.toLowerCase()}
          </p>
        )}
      </div>

      {/* Editor modal */}
      {editorOpen && user && (
        <HomebrewEditorModal
          contentType={activeType}
          editingItem={editingItem}
          userId={user.id}
          onClose={() => { setEditorOpen(false); setEditingItem(null); }}
        />
      )}
    </div>
  );
}
