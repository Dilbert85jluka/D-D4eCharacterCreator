import { useCallback, useEffect, useRef, useState } from 'react';
import type { PublicMapState, PublicMapToken } from '../../lib/mapStateSync';

interface PlayerBattleMapProps {
  state: PublicMapState;
}

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 4;

interface View { zoom: number; x: number; y: number }
interface Point { x: number; y: number }

/**
 * Read-only battle map for players.
 *
 * Deliberately NOT a `readOnly` mode of `BattleMapBoard`. That component is built
 * around a local `BattleMap` record and Dexie blob resolution, neither of which a
 * player has — they get a flat `PublicMapState` payload with a Storage URL. Sharing
 * the component would have meant threading two unrelated data sources through every
 * prop. The ~100 lines of shared pan/zoom logic are cheaper than that coupling.
 *
 * Everything a player must not see was already removed on the DM's device by
 * `extractPublicMapState` — hidden tokens are absent from the payload and monster
 * HP never leaves the DM's machine. This component is not a security boundary and
 * does not pretend to be one.
 */
export function PlayerBattleMap({ state }: PlayerBattleMapProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ zoom: 1, x: 0, y: 0 });
  const viewRef = useRef(view);
  viewRef.current = view;

  const [imgFailed, setImgFailed] = useState(false);
  const { map, tokens, activeInstanceKey } = state;

  const pointersRef = useRef<Map<number, Point>>(new Map());
  const panStartRef = useRef<{ view: View; pointer: Point } | null>(null);
  const pinchStartRef = useRef<{ dist: number; zoom: number; center: Point } | null>(null);

  const fitToViewport = useCallback(() => {
    const el = viewportRef.current;
    if (!el || !map.width || !map.height) return;
    const { clientWidth: vw, clientHeight: vh } = el;
    if (!vw || !vh) return;
    const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(vw / map.width, vh / map.height)));
    setView({ zoom, x: (vw - map.width * zoom) / 2, y: (vh - map.height * zoom) / 2 });
  }, [map.width, map.height]);

  // Refit when the map changes (DM swapped maps mid-session), not on every push.
  useEffect(() => {
    setImgFailed(false);
    fitToViewport();
  }, [map.id, fitToViewport]);

  const zoomAbout = useCallback((nextZoomRaw: number, screen: Point) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    setView((prev) => {
      const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoomRaw));
      const sx = screen.x - rect.left;
      const sy = screen.y - rect.top;
      return {
        zoom,
        x: sx - ((sx - prev.x) / prev.zoom) * zoom,
        y: sy - ((sy - prev.y) / prev.zoom) * zoom,
      };
    });
  }, []);

  // Native non-passive listener — React's synthetic onWheel is passive, so
  // preventDefault there is ignored and the page scrolls instead of zooming.
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

  const onPointerDown = (e: React.PointerEvent) => {
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
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2 && pinchStartRef.current) {
      const [a, b] = [...pointersRef.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchStartRef.current.dist > 0) {
        zoomAbout(
          pinchStartRef.current.zoom * (dist / pinchStartRef.current.dist),
          pinchStartRef.current.center,
        );
      }
      return;
    }
    if (panStartRef.current) {
      const { view: v0, pointer } = panStartRef.current;
      setView({
        zoom: v0.zoom,
        x: v0.x + (e.clientX - pointer.x),
        y: v0.y + (e.clientY - pointer.y),
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchStartRef.current = null;
    if (pointersRef.current.size === 0) panStartRef.current = null;
  };

  const gridStyle: React.CSSProperties = map.grid.visible
    ? {
        backgroundImage:
          `repeating-linear-gradient(to right, ${map.grid.color} 0 1px, transparent 1px ${map.grid.size}px),` +
          `repeating-linear-gradient(to bottom, ${map.grid.color} 0 1px, transparent 1px ${map.grid.size}px)`,
        backgroundPosition: `${map.grid.offsetX}px ${map.grid.offsetY}px`,
        opacity: map.grid.opacity,
      }
    : {};

  return (
    <div className="relative overflow-hidden bg-stone-900 rounded-lg touch-none select-none h-[55vh] min-h-[300px]">
      <div
        ref={viewportRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {(!map.imageUrl || imgFailed) && (
          <div className="absolute inset-0 grid place-items-center px-6 text-center">
            <p className="text-stone-400 text-sm">
              {map.imageUrl
                ? 'Could not load the map image.'
                : 'The DM hasn’t shared this map’s image yet.'}
            </p>
          </div>
        )}

        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: map.width,
            height: map.height,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
          }}
        >
          {map.imageUrl && !imgFailed && (
            <img
              src={map.imageUrl}
              alt={map.name}
              draggable={false}
              onError={() => setImgFailed(true)}
              className="absolute top-0 left-0 pointer-events-none"
              style={{ width: map.width, height: map.height }}
            />
          )}

          <div className="absolute inset-0 pointer-events-none" style={gridStyle} />

          {tokens.map((t) => (
            <PlayerToken
              key={t.instanceKey}
              token={t}
              grid={map.grid}
              isActive={activeInstanceKey === t.instanceKey}
            />
          ))}
        </div>
      </div>

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

function PlayerToken({
  token, grid, isActive,
}: {
  token: PublicMapToken;
  grid: PublicMapState['map']['grid'];
  isActive: boolean;
}) {
  const side = token.size * grid.size;
  const left = grid.offsetX + token.col * grid.size;
  const top = grid.offsetY + token.row * grid.size;

  const ring = token.color ?? (token.type === 'pc' ? '#10b981' : '#dc2626');
  const isDead = token.status === 'dead';
  const isBloodied = token.status === 'bloodied';

  // PCs show a real HP bar; monsters show only the bloodied pip, because exact
  // monster HP is never sent (see extractPublicMapState).
  const hpRatio =
    token.hp !== undefined && token.maxHp ? Math.max(0, Math.min(1, token.hp / token.maxHp)) : null;

  return (
    <div
      className="absolute"
      style={{ left, top, width: side, height: side, zIndex: isActive ? 20 : 10 }}
      title={token.displayName}
    >
      <div
        className="absolute inset-[6%] rounded-full overflow-hidden bg-stone-800 shadow-lg"
        style={{
          border: `${Math.max(2, side * 0.06)}px solid ${ring}`,
          filter: isDead ? 'grayscale(1) brightness(0.6)' : undefined,
        }}
      >
        {token.portrait ? (
          <img src={token.portrait} alt="" draggable={false}
               className="w-full h-full object-cover pointer-events-none" />
        ) : (
          <div className="w-full h-full grid place-items-center text-white font-bold"
               style={{ fontSize: Math.max(9, side * 0.32) }}>
            {token.displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {isActive && (
        <div className="absolute inset-0 rounded-full pointer-events-none animate-pulse"
             style={{ border: `${Math.max(3, side * 0.08)}px solid #fbbf24` }} />
      )}

      {isBloodied && (
        <div
          className="absolute rounded-full bg-red-600 border border-white pointer-events-none"
          style={{
            width: Math.max(6, side * 0.2),
            height: Math.max(6, side * 0.2),
            right: '9%',
            top: '9%',
          }}
          title="Bloodied"
        />
      )}

      {isDead && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none"
             style={{ fontSize: Math.max(12, side * 0.45) }}>💀</div>
      )}

      {hpRatio !== null && !isDead && (
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
    </div>
  );
}

function centerOf(el: HTMLElement | null): Point {
  if (!el) return { x: 0, y: 0 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
