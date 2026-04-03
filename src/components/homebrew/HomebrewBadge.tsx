/** Small "Homebrew" badge shown on items with homebrew- prefixed IDs */
export function HomebrewBadge() {
  return (
    <span className="text-xs bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-semibold">
      Homebrew
    </span>
  );
}

export function isHomebrew(id: string): boolean {
  return id.startsWith('homebrew-');
}

/** Placeholder card shown when a homebrew item has been deleted but is still referenced by a character */
export function MissingHomebrewPlaceholder({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-red-700 truncate">Missing Homebrew {label}</p>
          <p className="text-xs text-red-500">This homebrew item was deleted or is no longer available.</p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1.5 rounded font-medium transition-colors flex-shrink-0"
      >
        Remove
      </button>
    </div>
  );
}
