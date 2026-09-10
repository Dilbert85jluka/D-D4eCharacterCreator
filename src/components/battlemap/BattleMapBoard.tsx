import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BattleMap, MapToken } from '../../types/battlemap';
import { squareDistance } from '../../types/battlemap';
import { useMapImage } from './useMapImage';

/** What the board needs to know about a combatant to draw its token.
 *  Sourced from the initiative tracker — the board never owns HP or names. */
export interface BoardCombatant {
  instanceKey: string;
  displayName: string;
  type: 'monster' | 'pc';
  hp: number;
  maxHp: number;
  portrait?: string;
  /** Footprint in squares. */
  size: number;
}

interface BattleMapBoardProps {
  map: BattleMap;
  tokens: MapToken[];
  combatants: BoardCombatant[];
  /** instanceKey of the combatant whose turn it is — gets the pulsing ring. */
  activeInstanceKey?: string | null;
  selectedInstanceKey?: string | null;
  /** Players get a read-only board: pan and zoom work, dragging does not. */
  readOnly?: boolean;
  onMoveToken?: (instanceKey: string, col: number, row: number) => void;
  onSelectToken?: (instanceKey: string | null) => void;
  /** Fires on a tap that wasn't a pan or a token drag — used for tap-to-place. */
  onCellTap?: (col: number, row: number) => void;
  /** Highlights the board as armed for placement. */
  placing?: boolean;
  className?: string;
}

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 4;
/** Screen px a pointer may travel and still count as a tap rather than a pan.
 *  Generous because the primary target is a tablet, where a "still" finger drifts. */
const TAP_SLOP = 8;

interface Point { x: number; y: number }

/** Zoom and pan are one atomic value: a zoom always has to adjust pan in the same
 *  commit to keep the anchor point fixed. Holding them as two states made that a
 *  cross-setter dependency, which React has no ordering guarantee for. */
interface View { zoom: number; x: number; y: number }

/** Live drag state. Kept in state (not a ref) because the ghost + distance readout
 *  need to re-render as the pointer moves. */
interface DragState {
  instanceKey: string;
  /** Grid cell the pointer was over when the drag started. */
  grabCol: number;
  grabRow: number;
  /** Token's position when the drag started — the distance readout measures from here. */
  startCol: number;
  startRow: number;
  col: number;
  row: number;
  moved: boolean;
}

export function BattleMapBoard({
  map,
  tokens,
  combatants,
  activeInstanceKey,
  selectedInstanceKey,
  readOnly = false,
  onMoveToken,
  onSelectToken,
  onCellTap,
  placing = false,
  className = '',
}: BattleMapBoardProps) {
  const { src, status, error } = useMapImage(map);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<View>({ zoom: 1, x: 0, y: 0 });
  const [drag, setDrag] = useState<DragState | null>(null);

  // Mirror of `view` for use inside native (non-React) event listeners and pointer
  // handlers, which would otherwise close over a stale value between renders.
  const viewRef = useRef(view);
  viewRef.current = view;

  // Active pointers, for pinch-zoom. Tablet is the primary target for this app,
  // so two-finger pinch has to work as well as the desktop wheel.
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const panStartRef = useRef<{ view: View; pointer: Point } | null>(null);
  const pinchStartRef = useRef<{ dist: number; zoom: number; center: Point } | null>(null);
  /** Where a single-pointer gesture began, so pointerup can tell a tap from a pan.
   *  Cleared as soon as the pointer travels past TAP_SLOP. */
  const tapCandidateRef = useRef<Point | null>(null);

  const combatantByKey = useMemo(() => {
    const m = new Map<string, BoardCombatant>();
    for (const c of combatants) m.set(c.instanceKey, c);
    return m;
  }, [combatants]);

  // ── Fit the map to the viewport on first load / map change ──────────────
  const fitToViewport = useCallback(() => {
    const el = viewportRef.current;
    if (!el || !map.width || !map.height) return;
    const { clientWidth: vw, clientHeight: vh } = el;
    if (!vw || !vh) return;
    const next = Math.min(vw / map.width, vh / map.height);
    const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    setView({
      zoom,
      x: (vw - map.width * zoom) / 2,
      y: (vh - map.height * zoom) / 2,
    });
  }, [map.width, map.height]);

  useEffect(() => {
    if (status === 'ready') fitToViewport();
  }, [status, map.id, fitToViewport]);

  // ── Coordinate conversion ───────────────────────────────────────────────
  /** Client (screen) coords → source-image pixels. */
  const clientToImage = useCallback((clientX: number, clientY: number): Point => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const v = viewRef.current;
    return {
      x: (clientX - rect.left - v.x) / v.zoom,
      y: (clientY - rect.top - v.y) / v.zoom,
    };
  }, []);

  /** Source-image pixels → grid cell. Cells may be negative when the grid has an
   *  offset; that's legitimate (a partial square before the first gridline). */
  const imageToCell = useCallback(
    (p: Point) => ({
      col: Math.floor((p.x - map.grid.offsetX) / map.grid.size),
      row: Math.floor((p.y - map.grid.offsetY) / map.grid.size),
    }),
    [map.grid.offsetX, map.grid.offsetY, map.grid.size],
  );

  /** Grid cell → source-image pixel of its top-left corner. */
  const cellToImage = useCallback(
    (col: number, row: number): Point => ({
      x: map.grid.offsetX + col * map.grid.size,
      y: map.grid.offsetY + row * map.grid.size,
    }),
    [map.grid.offsetX, map.grid.offsetY, map.grid.size],
  );

  // ── Zoom ────────────────────────────────────────────────────────────────
  /** Zoom about a fixed screen point, so the map doesn't slide out from under the
   *  cursor/fingers. Zoom and pan move together in one commit — see `View`. */
  const zoomAbout = useCallback((nextZoomRaw: number, screen: Point) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    setView((prev) => {
      const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoomRaw));
      const sx = screen.x - rect.left;
      const sy = screen.y - rect.top;
      // Keep the image point currently under (sx, sy) pinned there after the zoom.
      return {
        zoom,
        x: sx - ((sx - prev.x) / prev.zoom) * zoom,
        y: sy - ((sy - prev.y) / prev.zoom) * zoom,
      };
    });
  }, []);

  // Wheel is a non-passive NATIVE listener on purpose: React's synthetic onWheel is
  // registered passively, so preventDefault() there is ignored and the page scrolls
  // behind the board instead of zooming it.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAbout(viewRef.current.zoom * Math.exp(-e.deltaY * 0.0015), {
        x: e.clientX,
        y: e.clientY,
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAbout]);

  // ── Pan / pinch on the stage background ─────────────────────────────────
  const handleStagePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      pinchStartRef.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        zoom: viewRef.current.zoom,
        center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
      panStartRef.current = null;
    } else if (pointersRef.current.size === 1) {
      panStartRef.current = { view: viewRef.current, pointer: { x: e.clientX, y: e.clientY } };
      tapCandidateRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleStagePointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2 && pinchStartRef.current) {
      const [a, b] = [...pointersRef.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchStartRef.current.dist > 0) {
        const ratio = dist / pinchStartRef.current.dist;
        zoomAbout(pinchStartRef.current.zoom * ratio, pinchStartRef.current.center);
      }
      return;
    }

    if (panStartRef.current) {
      const { view: v0, pointer } = panStartRef.current;
      if (
        tapCandidateRef.current &&
        Math.hypot(e.clientX - tapCandidateRef.current.x, e.clientY - tapCandidateRef.current.y) >
          TAP_SLOP
      ) {
        tapCandidateRef.current = null; // it's a pan, not a tap
      }
      setView({
        zoom: v0.zoom,
        x: v0.x + (e.clientX - pointer.x),
        y: v0.y + (e.clientY - pointer.y),
      });
    }
  };

  const handleStagePointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;

    if (pointersRef.current.size === 0) {
      panStartRef.current = null;
      // A tap on empty board: either place an armed token, or clear the selection.
      if (tapCandidateRef.current) {
        const cell = imageToCell(clientToImage(e.clientX, e.clientY));
        if (onCellTap) onCellTap(cell.col, cell.row);
        else onSelectToken?.(null);
      }
      tapCandidateRef.current = null;
    }
  };

  // ── Token dragging ──────────────────────────────────────────────────────
  const handleTokenPointerDown = (e: React.PointerEvent, token: MapToken) => {
    if (readOnly) return;
    e.stopPropagation(); // don't start a pan
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const cell = imageToCell(clientToImage(e.clientX, e.clientY));
    setDrag({
      instanceKey: token.instanceKey,
      grabCol: cell.col,
      grabRow: cell.row,
      startCol: token.col,
      startRow: token.row,
      col: token.col,
      row: token.row,
      moved: false,
    });
    onSelectToken?.(token.instanceKey);
  };

  const handleTokenPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    e.stopPropagation();
    const cell = imageToCell(clientToImage(e.clientX, e.clientY));
    // Offset by where within the token the drag began, so a 2×2 token doesn't
    // jump its top-left corner to the pointer.
    const col = drag.startCol + (cell.col - drag.grabCol);
    const row = drag.startRow + (cell.row - drag.grabRow);
    if (col !== drag.col || row !== drag.row) {
      setDrag({ ...drag, col, row, moved: true });
    }
  };

  const handleTokenPointerUp = (e: React.PointerEvent) => {
    if (!drag) return;
    e.stopPropagation();
    if (drag.moved) onMoveToken?.(drag.instanceKey, drag.col, drag.row);
    setDrag(null);
  };

  // ── Damage flashes ──────────────────────────────────────────────────────
  // Watch HP per combatant and float the delta over the token for a moment.
  // Derived here rather than passed in, so every HP path (tracker buttons, sync
  // from another device) produces the same feedback without extra plumbing.
  const prevHpRef = useRef<Map<string, number>>(new Map());
  const [flashes, setFlashes] = useState<{ key: string; delta: number; id: number }[]>([]);
  const flashIdRef = useRef(0);

  useEffect(() => {
    const next: { key: string; delta: number; id: number }[] = [];
    for (const c of combatants) {
      const prev = prevHpRef.current.get(c.instanceKey);
      if (prev !== undefined && prev !== c.hp) {
        next.push({ key: c.instanceKey, delta: c.hp - prev, id: ++flashIdRef.current });
      }
      prevHpRef.current.set(c.instanceKey, c.hp);
    }
    if (next.length === 0) return;
    setFlashes((f) => [...f, ...next]);
    const ids = new Set(next.map((n) => n.id));
    const t = setTimeout(() => setFlashes((f) => f.filter((x) => !ids.has(x.id))), 1400);
    return () => clearTimeout(t);
  }, [combatants]);

  // ── Render ──────────────────────────────────────────────────────────────
  const gridStyle: React.CSSProperties = map.grid.visible
    ? {
        backgroundImage:
          `repeating-linear-gradient(to right, ${map.grid.color} 0 1px, transparent 1px ${map.grid.size}px),` +
          `repeating-linear-gradient(to bottom, ${map.grid.color} 0 1px, transparent 1px ${map.grid.size}px)`,
        backgroundPosition: `${map.grid.offsetX}px ${map.grid.offsetY}px`,
        opacity: map.grid.opacity,
      }
    : {};

  const dragDistance =
    drag && drag.moved
      ? squareDistance({ col: drag.startCol, row: drag.startRow }, { col: drag.col, row: drag.row })
      : null;

  return (
    <div
      className={`relative overflow-hidden bg-stone-900 touch-none select-none ${className} ${
        placing ? 'ring-2 ring-inset ring-amber-400' : ''
      }`}
    >
      <div
        ref={viewportRef}
        className={`absolute inset-0 ${placing ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerUp}
        onPointerCancel={handleStagePointerUp}
      >
        {status === 'loading' && (
          <div className="absolute inset-0 grid place-items-center text-stone-400 text-sm">
            Loading map…
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {src && (
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: map.width,
              height: map.height,
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
            }}
          >
            <img
              src={src}
              alt={map.name}
              draggable={false}
              className="absolute top-0 left-0 pointer-events-none"
              style={{ width: map.width, height: map.height }}
            />

            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none" style={gridStyle} />

            {/* Ghost of the drag destination */}
            {drag && drag.moved && (() => {
              const p = cellToImage(drag.col, drag.row);
              const c = combatantByKey.get(drag.instanceKey);
              const side = (c?.size ?? 1) * map.grid.size;
              return (
                <div
                  className="absolute pointer-events-none rounded-md border-2 border-dashed border-amber-300 bg-amber-300/20"
                  style={{ left: p.x, top: p.y, width: side, height: side }}
                />
              );
            })()}

            {/* Tokens */}
            {tokens.map((token) => {
              const c = combatantByKey.get(token.instanceKey);
              if (!c) return null; // combatant left initiative — don't render an orphan
              if (readOnly && token.hidden) return null;

              const isDragging = drag?.instanceKey === token.instanceKey;
              const col = isDragging ? drag.col : token.col;
              const row = isDragging ? drag.row : token.row;
              const p = cellToImage(col, row);
              const side = c.size * map.grid.size;

              const isActive = activeInstanceKey === token.instanceKey;
              const isSelected = selectedInstanceKey === token.instanceKey;
              const hpRatio = c.maxHp > 0 ? Math.max(0, Math.min(1, c.hp / c.maxHp)) : 1;
              const isDown = c.maxHp > 0 && c.hp <= 0;
              // Bloodied at half HP or below — a real 4e condition, already used
              // elsewhere in the app for the HP tracker.
              const isBloodied = !isDown && c.maxHp > 0 && c.hp <= c.maxHp / 2;

              const ring = token.color
                ? token.color
                : c.type === 'pc'
                  ? '#10b981' // emerald-500
                  : '#dc2626'; // red-600

              const flash = flashes.find((f) => f.key === token.instanceKey);

              return (
                <div
                  key={token.instanceKey}
                  className="absolute"
                  style={{
                    left: p.x,
                    top: p.y,
                    width: side,
                    height: side,
                    zIndex: isDragging ? 30 : isActive ? 20 : 10,
                    opacity: isDragging ? 0.55 : 1,
                    cursor: readOnly ? 'default' : 'grab',
                    touchAction: 'none',
                  }}
                  onPointerDown={(e) => handleTokenPointerDown(e, token)}
                  onPointerMove={handleTokenPointerMove}
                  onPointerUp={handleTokenPointerUp}
                  onPointerCancel={handleTokenPointerUp}
                >
                  {/* Body */}
                  <div
                    className="absolute inset-[6%] rounded-full overflow-hidden bg-stone-800 shadow-lg"
                    style={{
                      border: `${Math.max(2, side * 0.06)}px solid ${ring}`,
                      filter: isDown ? 'grayscale(1) brightness(0.6)' : undefined,
                      boxShadow: isSelected ? `0 0 0 3px #fbbf24` : undefined,
                    }}
                  >
                    {c.portrait ? (
                      <img
                        src={c.portrait}
                        alt=""
                        draggable={false}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-white font-bold"
                           style={{ fontSize: Math.max(9, side * 0.32) }}>
                        {c.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Active-turn ring */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none animate-pulse"
                      style={{ border: `${Math.max(3, side * 0.08)}px solid #fbbf24` }}
                    />
                  )}

                  {/* Bloodied marker */}
                  {isBloodied && (
                    <div
                      className="absolute rounded-full bg-red-600 border border-white pointer-events-none"
                      style={{
                        width: Math.max(6, side * 0.2),
                        height: Math.max(6, side * 0.2),
                        right: '2%',
                        top: '2%',
                      }}
                      title="Bloodied"
                    />
                  )}

                  {/* Downed marker */}
                  {isDown && (
                    <div
                      className="absolute inset-0 grid place-items-center pointer-events-none"
                      style={{ fontSize: Math.max(12, side * 0.45) }}
                    >
                      💀
                    </div>
                  )}

                  {/* HP bar */}
                  {c.maxHp > 0 && !isDown && (
                    <div
                      className="absolute left-[8%] right-[8%] rounded-full bg-stone-900/80 overflow-hidden pointer-events-none"
                      style={{ bottom: '-2%', height: Math.max(3, side * 0.08) }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${hpRatio * 100}%`,
                          backgroundColor: isBloodied ? '#dc2626' : '#10b981',
                        }}
                      />
                    </div>
                  )}

                  {/* Damage / healing float */}
                  {flash && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 font-bold pointer-events-none drop-shadow"
                      style={{
                        top: '-30%',
                        fontSize: Math.max(11, side * 0.3),
                        color: flash.delta < 0 ? '#f87171' : '#4ade80',
                      }}
                    >
                      {flash.delta > 0 ? `+${flash.delta}` : flash.delta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Live movement readout — squares, never feet. 4e measures in squares. */}
      {dragDistance !== null && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-stone-900/90 text-amber-200 text-sm font-bold px-3 py-1.5 rounded-lg border border-amber-700 pointer-events-none">
          {dragDistance} {dragDistance === 1 ? 'square' : 'squares'}
        </div>
      )}

      {/* Zoom controls — big touch targets for tablet use. */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        <button
          onClick={() => zoomAbout(view.zoom * 1.25, centerOf(viewportRef.current))}
          className="w-11 h-11 rounded-lg bg-stone-800/90 text-white text-lg font-bold border border-stone-600 hover:bg-stone-700"
          title="Zoom in"
        >+</button>
        <button
          onClick={() => zoomAbout(view.zoom / 1.25, centerOf(viewportRef.current))}
          className="w-11 h-11 rounded-lg bg-stone-800/90 text-white text-lg font-bold border border-stone-600 hover:bg-stone-700"
          title="Zoom out"
        >−</button>
        <button
          onClick={fitToViewport}
          className="w-11 h-11 rounded-lg bg-stone-800/90 text-white text-xs font-bold border border-stone-600 hover:bg-stone-700"
          title="Fit map to screen"
        >Fit</button>
      </div>
    </div>
  );
}

function centerOf(el: HTMLElement | null): Point {
  if (!el) return { x: 0, y: 0 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
