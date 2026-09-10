import { useEffect, useMemo, useState } from 'react';
import { useBattleMapsStore } from '../../store/useBattleMapsStore';
import type { BattleMap, EncounterMapState, MapToken } from '../../types/battlemap';
import { BattleMapBoard, type BoardCombatant } from './BattleMapBoard';
import { MapLibraryModal } from './MapLibraryModal';
import { GridCalibrator } from './GridCalibrator';

interface EncounterMapViewProps {
  campaignId: string;
  /** Current board state for this encounter, or null if no map is attached yet. */
  mapState: EncounterMapState | null | undefined;
  /** Everyone in the initiative order. Tokens are drawn only for these. */
  combatants: BoardCombatant[];
  /** instanceKey of whoever's turn it is. */
  activeInstanceKey?: string | null;
  readOnly?: boolean;
  onChange: (next: EncounterMapState | null) => void;
  className?: string;
}

/**
 * The encounter board: a battle map plus the initiative order's combatants as tokens.
 *
 * Tokens carry only position — everything else (name, HP, portrait, whose turn it is)
 * comes from the initiative tracker via `combatants`, so damage entered in the tracker
 * shows on the board and vice versa with no second source of truth.
 */
export function EncounterMapView({
  campaignId,
  mapState,
  combatants,
  activeInstanceKey,
  readOnly = false,
  onChange,
  className = '',
}: EncounterMapViewProps) {
  const maps = useBattleMapsStore((s) => s.mapsByCampaign[campaignId] ?? []);
  const loadByCampaign = useBattleMapsStore((s) => s.loadByCampaign);
  const updateGrid = useBattleMapsStore((s) => s.updateGrid);

  const [showLibrary, setShowLibrary] = useState(false);
  const [calibrating, setCalibrating] = useState<BattleMap | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  /** Combatant armed for tap-to-place, if any. */
  const [placing, setPlacing] = useState<string | null>(null);

  useEffect(() => { loadByCampaign(campaignId); }, [campaignId, loadByCampaign]);

  const map = useMemo(
    () => (mapState ? maps.find((m) => m.id === mapState.mapId) ?? null : null),
    [maps, mapState],
  );

  const tokens = mapState?.tokens ?? [];
  const placedKeys = useMemo(() => new Set(tokens.map((t) => t.instanceKey)), [tokens]);

  // Combatants in initiative that aren't on the board yet.
  const unplaced = combatants.filter((c) => !placedKeys.has(c.instanceKey));

  const patchTokens = (next: MapToken[]) => {
    if (!mapState) return;
    onChange({ ...mapState, tokens: next });
  };

  const handleAttachMap = (m: BattleMap) => {
    // Keep any tokens already placed — swapping to a re-scanned version of the same
    // map shouldn't wipe the board. Positions are in grid coords, so they survive
    // as long as the grid is comparable; the DM can nudge afterwards.
    onChange({ mapId: m.id, tokens: mapState?.tokens ?? [] });
    setShowLibrary(false);
  };

  const handleMoveToken = (instanceKey: string, col: number, row: number) => {
    patchTokens(tokens.map((t) => (t.instanceKey === instanceKey ? { ...t, col, row } : t)));
  };

  const handleCellTap = (col: number, row: number) => {
    if (!placing || !mapState) return;
    const c = combatants.find((x) => x.instanceKey === placing);
    if (!c) { setPlacing(null); return; }
    patchTokens([
      ...tokens.filter((t) => t.instanceKey !== placing),
      { instanceKey: placing, col, row, size: c.size },
    ]);
    setPlacing(null);
  };

  const handleRemoveToken = (instanceKey: string) => {
    patchTokens(tokens.filter((t) => t.instanceKey !== instanceKey));
    if (selected === instanceKey) setSelected(null);
  };

  /** Lay every unplaced combatant out in rows near the top-left, PCs first.
   *  A starting point the DM then drags into position — not an attempt to be clever
   *  about where anyone should actually stand. */
  const handleAutoPlace = () => {
    if (!mapState || !map) return;
    const cols = Math.max(1, Math.floor(map.width / map.grid.size));
    const occupied = new Set(tokens.map((t) => `${t.col},${t.row}`));
    const next = [...tokens];

    let cursor = 0;
    const ordered = [...unplaced].sort((a, b) =>
      a.type === b.type ? 0 : a.type === 'pc' ? -1 : 1,
    );

    for (const c of ordered) {
      let col = 0;
      let row = 0;
      // Walk the grid in reading order until a free square turns up.
      for (let guard = 0; guard < 10000; guard++) {
        col = cursor % cols;
        row = Math.floor(cursor / cols);
        cursor++;
        if (!occupied.has(`${col},${row}`)) break;
      }
      occupied.add(`${col},${row}`);
      next.push({ instanceKey: c.instanceKey, col, row, size: c.size });
    }
    patchTokens(next);
  };

  const toggleHidden = (instanceKey: string) => {
    patchTokens(
      tokens.map((t) => (t.instanceKey === instanceKey ? { ...t, hidden: !t.hidden } : t)),
    );
  };

  // ── No map attached ─────────────────────────────────────────────────────
  if (!mapState || !map) {
    return (
      <>
        <div className={`grid place-items-center bg-stone-800 rounded-lg ${className}`}>
          <div className="text-center px-6 py-10">
            <p className="text-stone-300 text-sm font-semibold">No battle map on this encounter</p>
            <p className="text-stone-500 text-xs mt-1 max-w-xs">
              {mapState && !map
                ? 'The attached map is missing on this device.'
                : 'Attach a map to place tokens and run the fight on a grid.'}
            </p>
            {!readOnly && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                <button
                  onClick={() => setShowLibrary(true)}
                  className="px-4 py-2 rounded text-sm font-semibold bg-amber-700 text-white hover:bg-amber-800"
                >Choose a Map</button>
                {mapState && (
                  <button
                    onClick={() => onChange(null)}
                    className="px-4 py-2 rounded text-sm font-semibold bg-stone-700 text-stone-200 hover:bg-stone-600"
                  >Detach</button>
                )}
              </div>
            )}
          </div>
        </div>

        {showLibrary && (
          <MapLibraryModal
            campaignId={campaignId}
            onPick={handleAttachMap}
            onClose={() => setShowLibrary(false)}
          />
        )}
      </>
    );
  }

  // ── Map attached ────────────────────────────────────────────────────────
  const cols = Math.floor(map.width / map.grid.size);
  const rows = Math.floor(map.height / map.grid.size);

  return (
    <>
      <div className={`flex flex-col ${className}`}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-stone-800 rounded-t-lg border-b border-stone-700">
          <span className="text-amber-200 text-xs font-bold truncate max-w-[10rem]">{map.name}</span>
          <span className="text-stone-400 text-[11px]">{cols}×{rows} squares</span>

          {!readOnly && (
            <div className="flex flex-wrap gap-1.5 ml-auto">
              {unplaced.length > 0 && (
                <button
                  onClick={handleAutoPlace}
                  className="px-2.5 py-1.5 rounded text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800"
                >Place All ({unplaced.length})</button>
              )}
              <button
                onClick={() => setCalibrating(map)}
                className="px-2.5 py-1.5 rounded text-xs font-bold bg-stone-700 text-stone-100 hover:bg-stone-600"
              >Align Grid</button>
              <button
                onClick={() => setShowLibrary(true)}
                className="px-2.5 py-1.5 rounded text-xs font-bold bg-stone-700 text-stone-100 hover:bg-stone-600"
              >Change Map</button>
              <button
                onClick={() => onChange(null)}
                className="px-2.5 py-1.5 rounded text-xs font-bold bg-stone-700 text-stone-100 hover:bg-stone-600"
              >Detach</button>
            </div>
          )}
        </div>

        {/* Board */}
        <BattleMapBoard
          map={map}
          tokens={tokens}
          combatants={combatants}
          activeInstanceKey={activeInstanceKey}
          selectedInstanceKey={selected}
          readOnly={readOnly}
          placing={!!placing}
          onMoveToken={handleMoveToken}
          onSelectToken={setSelected}
          onCellTap={placing ? handleCellTap : undefined}
          className="flex-1 min-h-[320px]"
        />

        {/* Dock */}
        {!readOnly && (
          <div className="bg-stone-800 rounded-b-lg px-3 py-2 border-t border-stone-700">
            {placing ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-amber-200 text-xs font-bold">
                  Tap the map to place{' '}
                  {combatants.find((c) => c.instanceKey === placing)?.displayName}
                </span>
                <button
                  onClick={() => setPlacing(null)}
                  className="px-2.5 py-1 rounded text-xs font-bold bg-stone-700 text-stone-200 hover:bg-stone-600"
                >Cancel</button>
              </div>
            ) : unplaced.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-stone-400 text-[11px] uppercase font-semibold">Not placed</span>
                {unplaced.map((c) => (
                  <button
                    key={c.instanceKey}
                    onClick={() => setPlacing(c.instanceKey)}
                    className={
                      c.type === 'pc'
                        ? 'px-2.5 py-1 rounded text-xs font-bold bg-emerald-900 text-emerald-100 border border-emerald-600 hover:bg-emerald-800'
                        : 'px-2.5 py-1 rounded text-xs font-bold bg-red-900 text-red-100 border border-red-700 hover:bg-red-800'
                    }
                  >{c.displayName}</button>
                ))}
              </div>
            ) : selected ? (
              <SelectedTokenBar
                token={tokens.find((t) => t.instanceKey === selected)}
                combatant={combatants.find((c) => c.instanceKey === selected)}
                onRemove={() => handleRemoveToken(selected)}
                onToggleHidden={() => toggleHidden(selected)}
                onResize={(size) =>
                  patchTokens(
                    tokens.map((t) => (t.instanceKey === selected ? { ...t, size } : t)),
                  )
                }
              />
            ) : (
              <p className="text-stone-500 text-[11px]">
                Everyone in the initiative order is on the board. Tap a token to select it.
              </p>
            )}
          </div>
        )}
      </div>

      {showLibrary && (
        <MapLibraryModal
          campaignId={campaignId}
          onPick={handleAttachMap}
          onClose={() => setShowLibrary(false)}
        />
      )}
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

function SelectedTokenBar({
  token, combatant, onRemove, onToggleHidden, onResize,
}: {
  token?: MapToken;
  combatant?: BoardCombatant;
  onRemove: () => void;
  onToggleHidden: () => void;
  onResize: (size: number) => void;
}) {
  if (!token || !combatant) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-amber-200 text-xs font-bold truncate max-w-[9rem]">
        {combatant.displayName}
      </span>
      <span className="text-stone-500 text-[11px]">({token.col}, {token.row})</span>

      <span className="text-stone-400 text-[11px] uppercase font-semibold ml-2">Size</span>
      {[1, 2, 3, 4].map((n) => (
        <button
          key={n}
          onClick={() => onResize(n)}
          className={
            token.size === n
              ? 'w-8 h-7 rounded text-xs font-bold bg-amber-700 text-white'
              : 'w-8 h-7 rounded text-xs font-bold bg-stone-700 text-stone-200 hover:bg-stone-600'
          }
          title={`${n}×${n} squares`}
        >{n}</button>
      ))}

      <button
        onClick={onToggleHidden}
        className="px-2.5 py-1 rounded text-xs font-bold bg-stone-700 text-stone-200 hover:bg-stone-600 ml-auto"
        title={token.hidden ? 'Hidden from players' : 'Visible to players'}
      >{token.hidden ? '🔒 Hidden' : '👁 Visible'}</button>
      <button
        onClick={onRemove}
        className="px-2.5 py-1 rounded text-xs font-bold bg-red-900 text-red-100 border border-red-700 hover:bg-red-800"
      >Remove</button>
    </div>
  );
}
