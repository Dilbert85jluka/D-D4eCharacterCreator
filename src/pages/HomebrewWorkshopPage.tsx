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
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white px-4 py-6 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🔧 Homebrew Workshop
          </h1>
          <p className="text-amber-300 text-sm mt-1">
            Create custom content for your characters and campaigns
          </p>
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
