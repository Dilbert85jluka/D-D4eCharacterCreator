import { useEffect, useRef, useState } from 'react';
import type { BattleMap, GridConfig } from '../../types/battlemap';
import { useMapImage } from './useMapImage';

interface GridCalibratorProps {
  map: BattleMap;
  onSave: (grid: GridConfig) => void;
  onCancel: () => void;
}

/**
 * Grid calibration.
 *
 * Almost every purchased battle map already has squares printed on it at some
 * arbitrary scale, so the grid can't be assumed — it has to be measured. This is
 * Roll20's "Align to Grid" interaction: drag a box around a known number of the
 * map's OWN squares, and we derive pixels-per-square plus the offset of the first
 * gridline from it.
 *
 * The map is shown fit-to-frame (no pan/zoom) so the screen→image transform is a
 * single scalar. Tracing 3 squares divides any hand-wobble by three, and the
 * numeric nudges below clean up whatever is left.
 */
export function GridCalibrator({ map, onSave, onCancel }: GridCalibratorProps) {
  const { src, status, error } = useMapImage(map);
  const frameRef = useRef<HTMLDivElement>(null);

  const [grid, setGrid] = useState<GridConfig>(map.grid);
  /** How many of the map's squares the traced box spans, per side. */
  const [traceSquares, setTraceSquares] = useState(3);
  const [scale, setScale] = useState(1);

  // Drag-trace state, in IMAGE pixels.
  const [traceStart, setTraceStart] = useState<{ x: number; y: number } | null>(null);
  const [traceEnd, setTraceEnd] = useState<{ x: number; y: number } | null>(null);

  // Fit the image into the frame; recompute on resize so the transform stays exact.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !map.width || !map.height) return;
    const update = () => {
      const s = Math.min(el.clientWidth / map.width, el.clientHeight / map.height);
      setScale(s > 0 ? s : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [map.width, map.height, status]);

  const toImage = (clientX: number, clientY: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    // The image is centred in the frame.
    const offX = (rect.width - map.width * scale) / 2;
    const offY = (rect.height - map.height * scale) / 2;
    return {
      x: (clientX - rect.left - offX) / scale,
      y: (clientY - rect.top - offY) / scale,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const p = toImage(e.clientX, e.clientY);
    setTraceStart(p);
    setTraceEnd(p);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!traceStart) return;
    setTraceEnd(toImage(e.clientX, e.clientY));
  };

  const handlePointerUp = () => {
    if (!traceStart || !traceEnd) return;
    const w = Math.abs(traceEnd.x - traceStart.x);
    const h = Math.abs(traceEnd.y - traceStart.y);
    // Ignore an accidental tap — a real trace spans a meaningful area.
    if (w < 8 || h < 8) {
      setTraceStart(null);
      setTraceEnd(null);
      return;
    }
    const left = Math.min(traceStart.x, traceEnd.x);
    const top = Math.min(traceStart.y, traceEnd.y);
    // Average the two axes: a box traced over N×N squares should give the same
    // pixels-per-square either way, and averaging halves the wobble.
    const size = (w / traceSquares + h / traceSquares) / 2;
    setGrid((g) => ({
      ...g,
      size: Math.round(size * 100) / 100,
      offsetX: mod(left, size),
      offsetY: mod(top, size),
      visible: true,
    }));
    setTraceStart(null);
    setTraceEnd(null);
  };

  const nudge = (key: 'size' | 'offsetX' | 'offsetY', delta: number) =>
    setGrid((g) => {
      const next = { ...g, [key]: Math.round((g[key] + delta) * 100) / 100 };
      if (key === 'size') next.size = Math.max(4, next.size);
      // Keep offsets inside one square so the numbers stay comprehensible.
      next.offsetX = mod(next.offsetX, next.size);
      next.offsetY = mod(next.offsetY, next.size);
      return next;
    });

  const cols = Math.floor(map.width / grid.size);
  const rows = Math.floor(map.height / grid.size);

  const imgOffX = (frameRef.current?.clientWidth ?? 0) / 2 - (map.width * scale) / 2;
  const imgOffY = (frameRef.current?.clientHeight ?? 0) / 2 - (map.height * scale) / 2;

  const traceRect =
    traceStart && traceEnd
      ? {
          left: Math.min(traceStart.x, traceEnd.x),
          top: Math.min(traceStart.y, traceEnd.y),
          width: Math.abs(traceEnd.x - traceStart.x),
          height: Math.abs(traceEnd.y - traceStart.y),
        }
      : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-2 sm:p-4"
         onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="bg-stone-100 rounded-lg shadow-xl w-full max-w-5xl max-h-full flex flex-col overflow-hidden">
        <div className="bg-amber-900 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-white font-bold">Align the Grid</h3>
            <p className="text-amber-200 text-xs">{map.name}</p>
          </div>
          <button onClick={onCancel} className="text-amber-200 hover:text-white text-xl leading-none px-2">×</button>
        </div>

        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex-shrink-0">
          <p className="text-xs text-stone-700">
            Drag a box around <strong>{traceSquares} × {traceSquares}</strong> of the squares
            printed on the map. Fine-tune with the nudges below if it isn't quite right.
          </p>
        </div>

        {/* Map + live grid preview */}
        <div
          ref={frameRef}
          className="relative flex-1 min-h-[280px] bg-stone-900 overflow-hidden touch-none cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {status === 'loading' && (
            <div className="absolute inset-0 grid place-items-center text-stone-400 text-sm">Loading map…</div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 grid place-items-center text-red-300 text-sm px-6 text-center">{error}</div>
          )}
          {src && (
            <div
              className="absolute origin-top-left"
              style={{
                left: imgOffX,
                top: imgOffY,
                width: map.width,
                height: map.height,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <img src={src} alt={map.name} draggable={false}
                   className="absolute top-0 left-0 pointer-events-none"
                   style={{ width: map.width, height: map.height }} />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    `repeating-linear-gradient(to right, #22d3ee 0 1px, transparent 1px ${grid.size}px),` +
                    `repeating-linear-gradient(to bottom, #22d3ee 0 1px, transparent 1px ${grid.size}px)`,
                  backgroundPosition: `${grid.offsetX}px ${grid.offsetY}px`,
                  opacity: 0.85,
                }}
              />
              {traceRect && (
                <div
                  className="absolute border-2 border-amber-400 bg-amber-400/20 pointer-events-none"
                  style={traceRect}
                />
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex-shrink-0 space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="text-xs font-semibold text-stone-600 uppercase">Trace box spans</label>
            <div className="flex gap-1">
              {[1, 2, 3, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setTraceSquares(n)}
                  className={
                    traceSquares === n
                      ? 'px-3 py-1.5 rounded text-xs font-bold bg-amber-700 text-white'
                      : 'px-3 py-1.5 rounded text-xs font-bold bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                  }
                >{n}×{n}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <NudgeRow label="Square size" value={`${grid.size} px`}
                      onNudge={(d) => nudge('size', d)} steps={[-1, -0.1, 0.1, 1]} />
            <NudgeRow label="Offset X" value={`${grid.offsetX} px`}
                      onNudge={(d) => nudge('offsetX', d)} steps={[-1, -0.1, 0.1, 1]} />
            <NudgeRow label="Offset Y" value={`${grid.offsetY} px`}
                      onNudge={(d) => nudge('offsetY', d)} steps={[-1, -0.1, 0.1, 1]} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-stone-500">
              Board is <strong>{cols} × {rows}</strong> squares
              {' · '}each square is 1 square of movement (5 ft.)
            </p>
            <div className="flex gap-2">
              <button onClick={onCancel}
                      className="px-4 py-2 rounded text-sm font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100">
                Cancel
              </button>
              <button onClick={() => onSave(grid)}
                      className="px-4 py-2 rounded text-sm font-semibold bg-amber-700 text-white hover:bg-amber-800">
                Save Grid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NudgeRow({
  label, value, onNudge, steps,
}: { label: string; value: string; onNudge: (d: number) => void; steps: number[] }) {
  return (
    <div className="bg-white rounded border border-stone-200 px-3 py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-stone-400 uppercase">{label}</span>
        <span className="text-xs font-mono text-stone-800">{value}</span>
      </div>
      <div className="flex gap-1">
        {steps.map((s) => (
          <button
            key={s}
            onClick={() => onNudge(s)}
            className="flex-1 min-h-[32px] rounded text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300"
          >{s > 0 ? `+${s}` : s}</button>
        ))}
      </div>
    </div>
  );
}

/** Positive modulo — JS `%` keeps the sign of the dividend, which would put a
 *  gridline offset outside [0, size) and make the numbers confusing. */
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
