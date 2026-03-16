import { useState } from 'react';
import type { MagicItemData, MagicItemCategory, EditionKey } from '../../types/magicItem';

export const CATEGORY_COLORS: Record<MagicItemCategory, string> = {
  Potion:        'bg-emerald-700 text-white',
  Scroll:        'bg-sky-700 text-white',
  Ring:          'bg-amber-700 text-white',
  Rod:           'bg-red-700 text-white',
  Staff:         'bg-purple-700 text-white',
  Wand:          'bg-indigo-700 text-white',
  Miscellaneous: 'bg-teal-700 text-white',
  Armor:         'bg-stone-700 text-white',
  Weapon:        'bg-rose-700 text-white',
};

const EDITION_LABELS: { key: EditionKey; label: string }[] = [
  { key: '2e', label: 'AD&D 2e' },
  { key: '4e', label: 'D&D 4e' },
  { key: '5e', label: 'D&D 5e' },
];

export function MagicItemModal({
  item,
  onClose,
}: {
  item: MagicItemData;
  onClose: () => void;
}) {
  const [edition, setEdition] = useState<EditionKey>('2e');
  const ed = item.editions[edition];
  const headerClass = CATEGORY_COLORS[item.category];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-stone-300" />
        </div>

        {/* Header */}
        <div className={`px-4 py-3 flex items-start justify-between gap-3 flex-shrink-0 ${headerClass}`}>
          <div>
            <h2 className="text-white font-bold text-xl leading-tight">{item.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                {item.category}
              </span>
              <span className="text-white/70 text-xs uppercase font-mono">
                {item.source}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none mt-0.5 w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Edition toggle */}
        <div className="px-4 py-2 bg-stone-50 border-b border-stone-200 flex-shrink-0">
          <div className="flex rounded-lg bg-stone-200 p-0.5">
            {EDITION_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setEdition(key)}
                className={[
                  'flex-1 text-center py-1.5 rounded-md text-xs font-semibold transition-colors min-h-[36px]',
                  edition === key
                    ? 'bg-white text-stone-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Edition-specific badges */}
          <div className="flex flex-wrap gap-1.5">
            {ed.rarity && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {ed.rarity}
              </span>
            )}
            {ed.level != null && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Level {ed.level}
              </span>
            )}
            {ed.enhancementBonus != null && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                +{ed.enhancementBonus}
              </span>
            )}
            {ed.slot && (
              <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                {ed.slot}
              </span>
            )}
            {ed.attunement && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                {ed.attunement}
              </span>
            )}
            {ed.duration && (
              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                Duration: {ed.duration}
              </span>
            )}
            {ed.charges && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                {ed.charges}
              </span>
            )}
          </div>

          {/* Value badges (2e only) */}
          {edition === '2e' && (ed.xpValue != null || ed.gpValue != null) && (
            <div className="flex gap-3">
              {ed.xpValue != null && (
                <span className="text-xs text-stone-500">
                  <span className="font-semibold">XP Value:</span> {ed.xpValue.toLocaleString()}
                </span>
              )}
              {ed.gpValue != null && (
                <span className="text-xs text-stone-500">
                  <span className="font-semibold">GP Value:</span> {ed.gpValue.toLocaleString()}
                </span>
              )}
              {ed.weight && (
                <span className="text-xs text-stone-500">
                  <span className="font-semibold">Weight:</span> {ed.weight}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          <div className="bg-stone-50 rounded-lg px-3 py-2">
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{ed.description}</p>
          </div>

          {/* Power text (4e) */}
          {ed.powerText && (
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <div className="px-3 py-1.5 bg-stone-50 border-b border-stone-200">
                <span className="font-semibold text-stone-700 text-sm">Item Power</span>
              </div>
              <div className="px-3 py-2 text-sm text-stone-700 leading-relaxed">
                {ed.powerText}
              </div>
            </div>
          )}

          {/* Properties */}
          {(ed.properties ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ed.properties!.map((prop) => (
                <span key={prop} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {prop}
                </span>
              ))}
            </div>
          )}

          {/* Aura */}
          {ed.aura && (
            <div className="text-xs text-stone-500">
              <span className="font-semibold">Aura:</span> {ed.aura}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
