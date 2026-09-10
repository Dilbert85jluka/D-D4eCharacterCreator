import { useEffect, useRef, useState } from 'react';
import { useBattleMapsStore } from '../../store/useBattleMapsStore';
import { formatBytes, MAX_MAP_EDGE } from '../../lib/mapImageProcessing';
import { mapImageStore } from '../../db/battleMapRepository';
import type { BattleMap } from '../../types/battlemap';
import { GridCalibrator } from './GridCalibrator';
import { MapThumbnail } from './MapThumbnail';

interface MapLibraryModalProps {
  campaignId: string;
  /** When set, the library is being used to pick a map for an encounter. */
  onPick?: (map: BattleMap) => void;
  onClose: () => void;
}

/** Per-campaign map library: import, calibrate, rename, delete. */
export function MapLibraryModal({ campaignId, onPick, onClose }: MapLibraryModalProps) {
  const maps = useBattleMapsStore((s) => s.mapsByCampaign[campaignId] ?? []);
  const loadByCampaign = useBattleMapsStore((s) => s.loadByCampaign);
  const importMap = useBattleMapsStore((s) => s.importMap);
  const updateGrid = useBattleMapsStore((s) => s.updateGrid);
  const renameMap = useBattleMapsStore((s) => s.renameMap);
  const deleteMap = useBattleMapsStore((s) => s.deleteMap);

  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calibrating, setCalibrating] = useState<BattleMap | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [cacheBytes, setCacheBytes] = useState<number | null>(null);

  useEffect(() => { loadByCampaign(campaignId); }, [campaignId, loadByCampaign]);
  useEffect(() => { mapImageStore.totalBytes().then(setCacheBytes).catch(() => {}); }, [maps.length]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      // Import sequentially — each one decodes a multi-megabyte image, and doing
      // several at once on a tablet is a reliable way to get the tab killed.
      for (const file of Array.from(files)) {
        await importMap(campaignId, file);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not import that image.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="bg-stone-100 rounded-lg shadow-xl w-full max-w-3xl max-h-full flex flex-col overflow-hidden">
          <div className="bg-amber-900 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-white font-bold">
                {onPick ? 'Choose a Battle Map' : 'Battle Maps'}
              </h3>
              <p className="text-amber-200 text-xs">
                {maps.length} map{maps.length === 1 ? '' : 's'} in this campaign
                {cacheBytes !== null && ` · ${formatBytes(cacheBytes)} stored on this device`}
              </p>
            </div>
            <button onClick={onClose} className="text-amber-200 hover:text-white text-xl leading-none px-2">×</button>
          </div>

          <div className="px-4 py-3 border-b border-stone-200 bg-amber-50 flex-shrink-0">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="px-4 py-2 rounded text-sm font-semibold bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50"
              >
                {busy ? 'Importing…' : '+ Import Map Image'}
              </button>
              <p className="text-xs text-stone-600">
                PNG, JPEG or WebP up to 25 MB. Scaled down to {MAX_MAP_EDGE}px on the long edge.
              </p>
            </div>
            {error && <p className="text-xs text-red-700 mt-2">{error}</p>}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {maps.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-stone-500 text-sm">No maps yet.</p>
                <p className="text-stone-400 text-xs mt-1">
                  Import a map image, then align the grid to the squares printed on it.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {maps.map((map) => {
                  const cols = Math.floor(map.width / map.grid.size);
                  const rows = Math.floor(map.height / map.grid.size);
                  return (
                    <div key={map.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden">
                      <MapThumbnail map={map} className="h-32 w-full bg-stone-800" />
                      <div className="p-3">
                        {renaming === map.id ? (
                          <div className="flex gap-1 mb-2">
                            <input
                              autoFocus
                              value={renameDraft}
                              onChange={(e) => setRenameDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && renameDraft.trim()) {
                                  renameMap(map.id, campaignId, renameDraft.trim());
                                  setRenaming(null);
                                }
                                if (e.key === 'Escape') setRenaming(null);
                              }}
                              className="flex-1 min-w-0 px-2 py-1 text-sm border border-amber-400 rounded"
                            />
                            <button
                              onClick={() => {
                                if (renameDraft.trim()) renameMap(map.id, campaignId, renameDraft.trim());
                                setRenaming(null);
                              }}
                              className="px-2 py-1 text-xs font-bold bg-amber-700 text-white rounded"
                            >Save</button>
                          </div>
                        ) : (
                          <p className="font-semibold text-stone-800 text-sm truncate">{map.name}</p>
                        )}

                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {map.width}×{map.height}px · grid {map.grid.size}px · {cols}×{rows} squares
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {onPick && (
                            <button
                              onClick={() => onPick(map)}
                              className="px-3 py-1.5 rounded text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800"
                            >Use This Map</button>
                          )}
                          <button
                            onClick={() => setCalibrating(map)}
                            className="px-3 py-1.5 rounded text-xs font-bold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
                          >Align Grid</button>
                          <button
                            onClick={() => { setRenaming(map.id); setRenameDraft(map.name); }}
                            className="px-3 py-1.5 rounded text-xs font-bold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
                          >Rename</button>
                          {confirmDelete === map.id ? (
                            <>
                              <button
                                onClick={() => { deleteMap(map.id, campaignId); setConfirmDelete(null); }}
                                className="px-3 py-1.5 rounded text-xs font-bold bg-red-700 text-white hover:bg-red-800"
                              >Confirm</button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-3 py-1.5 rounded text-xs font-bold bg-white border border-stone-300 text-stone-700"
                              >Cancel</button>
                            </>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(map.id)}
                              className="px-3 py-1.5 rounded text-xs font-bold bg-white border border-red-300 text-red-700 hover:bg-red-50"
                            >Delete</button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {calibrating && (
        <GridCalibrator
          map={calibrating}
          onCancel={() => setCalibrating(null)}
          onSave={(grid) => {
            updateGrid(calibrating.id, campaignId, grid);
            setCalibrating(null);
          }}
        />
      )}
    </>
  );
}
