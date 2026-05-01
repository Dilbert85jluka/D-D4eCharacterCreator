import { useMemo, useState } from 'react';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import { useAuthStore } from '../../store/useAuthStore';
import { HOMEBREW_CONTENT_TYPES } from '../../types/homebrew';
import type { HomebrewContentType } from '../../types/homebrew';
import {
  parseHomebrewImport,
  prepareImport,
  type HomebrewExportFile,
  type ImportConflictMode,
} from '../../lib/homebrewExport';

interface Props {
  onClose: () => void;
}

export function HomebrewImportModal({ onClose }: Props) {
  const existingItems = useHomebrewStore((s) => s.items);
  const importItems = useHomebrewStore((s) => s.importItems);
  const userId = useAuthStore((s) => s.user?.id);

  const [parsed, setParsed] = useState<HomebrewExportFile | null>(null);
  const [conflictMode, setConflictMode] = useState<ImportConflictMode>('skip');
  const [status, setStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fileName, setFileName] = useState<string>('');

  const prepared = useMemo(() => {
    if (!parsed || !userId) return null;
    return prepareImport(parsed.items, existingItems, conflictMode, userId);
  }, [parsed, existingItems, conflictMode, userId]);

  const countsByType = useMemo(() => {
    if (!parsed) return {} as Record<HomebrewContentType, number>;
    const c: Partial<Record<HomebrewContentType, number>> = {};
    for (const item of parsed.items) {
      c[item.contentType] = (c[item.contentType] ?? 0) + 1;
    }
    return c as Record<HomebrewContentType, number>;
  }, [parsed]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setStatus('idle');
    setErrorMsg('');
    try {
      const text = await file.text();
      const data = parseHomebrewImport(text);
      setParsed(data);
    } catch (err) {
      setParsed(null);
      setErrorMsg(err instanceof Error ? err.message : 'Could not read file.');
    }
  }

  async function handleImport() {
    if (!prepared || !userId) return;
    setStatus('importing');
    try {
      await importItems(prepared.toInsert);
      setStatus('success');
      setTimeout(() => onClose(), 1200);
    } catch {
      setStatus('error');
      setErrorMsg('Import failed. Please try again.');
    }
  }

  const insertCount = prepared?.toInsert.length ?? 0;
  const duplicateCount = prepared?.duplicates.length ?? 0;
  const newCount = prepared?.newItems.length ?? 0;
  const skippedCount = conflictMode === 'skip' ? duplicateCount : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-bold text-stone-800">Import Homebrew</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-stone-500">
            Import homebrew items shared by another player. Choose a <code className="text-xs bg-stone-100 px-1 rounded">.json</code> file exported from the Homebrew Workshop.
          </p>

          <label className="block">
            <span className="sr-only">Choose import file</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="block w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 file:min-h-[36px] file:cursor-pointer cursor-pointer"
            />
          </label>

          {fileName && !errorMsg && parsed && (
            <p className="text-xs text-stone-400 -mt-2">Loaded: {fileName}</p>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {parsed && (
            <>
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm space-y-2">
                <p className="font-semibold text-stone-700">
                  File contains {parsed.items.length} item{parsed.items.length !== 1 ? 's' : ''}:
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-stone-600 text-xs">
                  {HOMEBREW_CONTENT_TYPES.filter((t) => countsByType[t.key]).map((t) => (
                    <div key={t.key} className="flex justify-between">
                      <span>{t.label}</span>
                      <span className="font-semibold">{countsByType[t.key]}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-200 pt-2 text-xs text-stone-500">
                  <span className="text-green-700 font-semibold">{newCount}</span> new
                  {duplicateCount > 0 && (
                    <>
                      , <span className="text-amber-700 font-semibold">{duplicateCount}</span> already exist
                      {skippedCount > 0 && ` (will be skipped)`}
                    </>
                  )}
                </div>
              </div>

              {duplicateCount > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-stone-700">For items that already exist:</p>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="conflictMode"
                      value="skip"
                      checked={conflictMode === 'skip'}
                      onChange={() => setConflictMode('skip')}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium text-stone-700">Skip duplicates</span>
                      <p className="text-xs text-stone-500">Keep your existing version. Recommended.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="conflictMode"
                      value="replace"
                      checked={conflictMode === 'replace'}
                      onChange={() => setConflictMode('replace')}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium text-amber-700">Replace duplicates</span>
                      <p className="text-xs text-stone-500">Overwrite your existing version with the imported one.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="conflictMode"
                      value="duplicate"
                      checked={conflictMode === 'duplicate'}
                      onChange={() => setConflictMode('duplicate')}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium text-stone-700">Import as a copy</span>
                      <p className="text-xs text-stone-500">Add the imported version alongside yours under a new ID.</p>
                    </div>
                  </label>
                </div>
              )}

              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-700 font-medium">
                  Imported {insertCount} item{insertCount !== 1 ? 's' : ''}.
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={!userId || status === 'importing' || status === 'success' || insertCount === 0}
                className="w-full py-2.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors min-h-[44px]"
              >
                {status === 'importing'
                  ? 'Importing…'
                  : insertCount === 0
                    ? 'Nothing to import'
                    : `Import ${insertCount} item${insertCount !== 1 ? 's' : ''}`}
              </button>

              {!userId && (
                <p className="text-xs text-amber-700 text-center">
                  Sign in before importing so items sync to the cloud.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
