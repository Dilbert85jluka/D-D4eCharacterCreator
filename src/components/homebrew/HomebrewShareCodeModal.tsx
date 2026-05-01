import { useMemo, useState } from 'react';
import type { HomebrewItem } from '../../types/homebrew';
import { encodeShareCode, buildShareUrl } from '../../lib/homebrewExport';

interface Props {
  item: HomebrewItem;
  onClose: () => void;
}

export function HomebrewShareCodeModal({ item, onClose }: Props) {
  const [copied, setCopied] = useState<'code' | 'url' | null>(null);

  const code = useMemo(() => encodeShareCode([item]), [item]);
  const url = useMemo(() => buildShareUrl(code), [code]);

  const sizeLabel =
    code.length < 1000
      ? `${code.length} characters`
      : `${(code.length / 1000).toFixed(1)} KB`;

  // Most browsers handle URLs up to ~8KB without trouble; flag anything larger.
  const urlMightBeTooLong = url.length > 8000;

  async function copy(text: string, kind: 'code' | 'url') {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied((prev) => (prev === kind ? null : prev)), 2000);
    } catch {
      // Older browsers / non-secure contexts: fall back to manual selection prompt
      window.prompt('Copy this:', text);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-bold text-stone-800">Share Homebrew</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-stone-800 truncate">{item.name}</p>
            <p className="text-xs text-stone-500 capitalize">{item.contentType}</p>
          </div>

          <p className="text-sm text-stone-500">
            Send the code or link below to another player. They can paste it into the Homebrew Workshop's <span className="font-semibold">Import → From code</span> tab to add this item.
          </p>

          {/* Share URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500">Share link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                readOnly
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 text-xs font-mono px-2.5 py-2 rounded-lg border border-stone-300 bg-stone-50 text-stone-700"
              />
              <button
                onClick={() => copy(url, 'url')}
                className={[
                  'px-3 py-2 text-xs font-semibold rounded-lg transition-colors min-h-[36px] whitespace-nowrap',
                  copied === 'url'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200',
                ].join(' ')}
              >
                {copied === 'url' ? 'Copied' : 'Copy URL'}
              </button>
            </div>
            {urlMightBeTooLong && (
              <p className="text-[11px] text-amber-700">
                URL is {(url.length / 1000).toFixed(1)} KB — some chat apps may truncate it. Use the code instead.
              </p>
            )}
          </div>

          {/* Share code */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
              Share code <span className="text-stone-400 font-normal normal-case">({sizeLabel})</span>
            </label>
            <textarea
              value={code}
              readOnly
              rows={6}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full text-[11px] font-mono px-2.5 py-2 rounded-lg border border-stone-300 bg-stone-50 text-stone-700 resize-none break-all"
            />
            <button
              onClick={() => copy(code, 'code')}
              className={[
                'w-full py-2.5 text-sm font-semibold rounded-lg transition-colors min-h-[44px]',
                copied === 'code'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-700 hover:bg-amber-600 text-white',
              ].join(' ')}
            >
              {copied === 'code' ? 'Copied to clipboard' : 'Copy code'}
            </button>
          </div>

          <p className="text-[11px] text-stone-400">
            The code includes everything the recipient needs — no internet lookup required. Campaign links are stripped automatically; the recipient can re-link the item to their own campaigns afterward.
          </p>
        </div>
      </div>
    </div>
  );
}
