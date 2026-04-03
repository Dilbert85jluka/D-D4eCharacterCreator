import { useState } from 'react';
import { useCharactersStore } from '../../store/useCharactersStore';
import { useCampaignsStore } from '../../store/useCampaignsStore';
import { useSessionsStore } from '../../store/useSessionsStore';
import { useEncountersStore } from '../../store/useEncountersStore';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import { db } from '../../db/database';

interface BackupPreview {
  characters: number;
  campaigns: number;
  sessions: number;
  encounters: number;
  homebrew: number;
}

/** v2 backup format — adds homebrew. v1 files lack the homebrew field. */
interface BackupData {
  version: number;
  exportedAt: string;
  characters: unknown[];
  campaigns: unknown[];
  sessions: unknown[];
  encounters: unknown[];
  homebrew?: unknown[];
}

interface Props {
  onClose: () => void;
}

export function ImportExportModal({ onClose }: Props) {
  const [parsed, setParsed]       = useState<BackupData | null>(null);
  const [preview, setPreview]     = useState<BackupPreview | null>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [status, setStatus]       = useState<'idle' | 'importing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg]   = useState('');

  // ── Export ─────────────────────────────────────────────────────────────────
  const characters = useCharactersStore((s) => s.characters);
  const campaigns  = useCampaignsStore((s) => s.campaigns);
  const sessionsByCampaign  = useSessionsStore((s) => s.sessionsByCampaign);
  const encountersBySession = useEncountersStore((s) => s.encountersBySession);
  const homebrewItems = useHomebrewStore((s) => s.items);

  function handleExport() {
    const sessions   = Object.values(sessionsByCampaign).flat();
    const encounters = Object.values(encountersBySession).flat();
    const backup: BackupData = {
      version:     2,
      exportedAt:  new Date().toISOString(),
      characters,
      campaigns,
      sessions,
      encounters,
      homebrew:    homebrewItems,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `dnd4e-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Import ─────────────────────────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as BackupData;
      if (!data.version || !Array.isArray(data.characters)) {
        throw new Error('Invalid backup file format.');
      }
      setParsed(data);
      setPreview({
        characters: data.characters?.length ?? 0,
        campaigns:  data.campaigns?.length  ?? 0,
        sessions:   data.sessions?.length   ?? 0,
        encounters: data.encounters?.length ?? 0,
        homebrew:   data.homebrew?.length   ?? 0,
      });
      setStatus('idle');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Could not read file. Make sure it is a valid D&D 4e backup JSON.');
      setParsed(null);
      setPreview(null);
    }
  }

  async function handleImport() {
    if (!parsed) return;
    setStatus('importing');
    try {
      if (importMode === 'replace') {
        await Promise.all([
          db.characters.clear(),
          db.campaigns.clear(),
          db.sessions.clear(),
          db.encounters.clear(),
          db.homebrew.clear(),
        ]);
      }
      if (parsed.characters?.length) await db.characters.bulkPut(parsed.characters as never[]);
      if (parsed.campaigns?.length)  await db.campaigns.bulkPut(parsed.campaigns as never[]);
      if (parsed.sessions?.length)   await db.sessions.bulkPut(parsed.sessions as never[]);
      if (parsed.encounters?.length) await db.encounters.bulkPut(parsed.encounters as never[]);
      // v1 files won't have homebrew — safely skip if absent
      if (parsed.homebrew?.length)   await db.homebrew.bulkPut(parsed.homebrew as never[]);

      setStatus('success');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Import failed. The file may be corrupted or incompatible.');
    }
  }

  const sessionCount   = Object.values(sessionsByCampaign).flat().length;
  const encounterCount = Object.values(encountersBySession).flat().length;
  const homebrewCount  = homebrewItems.length;

  const exportSummary = [
    `${characters.length} character${characters.length !== 1 ? 's' : ''}`,
    `${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''}`,
    `${sessionCount} session${sessionCount !== 1 ? 's' : ''}`,
    `${encounterCount} encounter${encounterCount !== 1 ? 's' : ''}`,
    `${homebrewCount} homebrew item${homebrewCount !== 1 ? 's' : ''}`,
  ].join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-bold text-stone-800">Import / Export</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Export Section ───────────────────────────────────────────── */}
          <section>
            <h3 className="font-bold text-stone-700 mb-1">Export Data</h3>
            <p className="text-sm text-stone-500 mb-3">
              Download all your characters, campaigns, and homebrew content as a JSON backup file.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-3 text-sm text-amber-800">
              Current data: <span className="font-semibold">{exportSummary}</span>
            </div>
            <button
              onClick={handleExport}
              className="w-full py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors min-h-[44px]"
            >
              Download Backup
            </button>
          </section>

          <div className="border-t border-stone-200" />

          {/* ── Import Section ───────────────────────────────────────────── */}
          <section>
            <h3 className="font-bold text-stone-700 mb-1">Import Data</h3>
            <p className="text-sm text-stone-500 mb-3">
              Restore from a previously exported backup file.
            </p>

            {/* File picker */}
            <label className="block">
              <span className="sr-only">Choose backup file</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="block w-full text-sm text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 file:min-h-[36px] file:cursor-pointer cursor-pointer"
              />
            </label>

            {/* Error */}
            {errorMsg && (
              <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
            )}

            {/* Preview */}
            {preview && (
              <div className="mt-3 bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm space-y-1">
                <p className="font-semibold text-stone-700 mb-1.5">File contains:</p>
                <div className="grid grid-cols-2 gap-1 text-stone-600">
                  <span>Characters</span>    <span className="font-semibold">{preview.characters}</span>
                  <span>Campaigns</span>     <span className="font-semibold">{preview.campaigns}</span>
                  <span>Sessions</span>      <span className="font-semibold">{preview.sessions}</span>
                  <span>Encounters</span>    <span className="font-semibold">{preview.encounters}</span>
                  <span>Homebrew Items</span><span className="font-semibold">{preview.homebrew}</span>
                </div>
                {parsed && parsed.version < 2 && (
                  <p className="text-xs text-amber-600 mt-2">
                    This is a v1 backup — homebrew items were not included in older exports.
                  </p>
                )}
              </div>
            )}

            {/* Import mode */}
            {preview && (
              <div className="mt-3 space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-stone-700">Merge with existing data</span>
                    <p className="text-xs text-stone-500">Adds imported records. Updates any with matching IDs.</p>
                  </div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-red-700">Replace all data</span>
                    <p className="text-xs text-stone-500">Deletes everything first, then imports. Cannot be undone.</p>
                  </div>
                </label>
              </div>
            )}

            {/* Success */}
            {status === 'success' && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-700 font-medium">
                Import successful! Reloading…
              </div>
            )}

            {/* Import button */}
            <button
              onClick={handleImport}
              disabled={!parsed || status === 'importing' || status === 'success'}
              className="mt-4 w-full py-2.5 bg-stone-700 hover:bg-stone-600 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors min-h-[44px]"
            >
              {status === 'importing' ? 'Importing…' : 'Import'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
