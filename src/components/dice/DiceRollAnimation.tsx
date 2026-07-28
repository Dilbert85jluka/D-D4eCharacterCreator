import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Sprite dice that tumble across the screen while the roll sound plays.
 *
 * Purely cosmetic: the roll values are computed before the animation starts,
 * and each sprite's face flickers through random numbers while tumbling, then
 * settles on the real rolled value just before the tray reveals the result
 * chips. Rendered as a full-screen `pointer-events-none` overlay under the
 * dice tray (z-30 vs the tray's z-40), so nothing is blocked while dice fly.
 *
 * Motion is three nested CSS animations (keyframes in src/index.css):
 * horizontal skid, diminishing vertical bounces, decelerating spin — all GPU
 * transforms, cheap on older iPads. The parent (DiceRollerModal) skips
 * rendering this entirely when `prefers-reduced-motion` is set.
 */

export type DieSpriteColor =
  | 'amber' | 'purple' | 'blue' | 'teal' | 'green' | 'red' | 'orange' | 'stone';

export interface DiceSpriteSpec {
  id: string;
  label: string;          // 'd20', 'd%', …
  sides: number;
  value: number;          // the real rolled value shown on settle
  color: DieSpriteColor;
}

interface Props {
  sprites: DiceSpriteSpec[];
}

/** How long settled dice stay fully visible before fading (ms). */
export const DICE_LINGER_MS = 3000;
/** Fade-out duration once the linger ends (ms). Keep in sync with the
 *  `duration-700` class on the overlay. */
export const DICE_FADE_MS = 700;

// Static fill classes — Tailwind v4 requires full literal class strings
const fillMap: Record<DieSpriteColor, string> = {
  amber:  'fill-amber-600',
  purple: 'fill-purple-600',
  blue:   'fill-blue-600',
  teal:   'fill-teal-600',
  green:  'fill-green-600',
  red:    'fill-red-600',
  orange: 'fill-orange-500',
  stone:  'fill-stone-500',
};

/** Classic 2D die silhouettes, viewBox 0 0 100 100, number centered. */
function DieShape({ label, color, face }: { label: string; color: DieSpriteColor; face: number }) {
  const fill = fillMap[color];
  const facet = 'fill-none stroke-white/25';
  // d4 is a triangle — drop the number toward the wide base so it stays inside
  const textY = label === 'd4' ? 74 : 50;
  const fontSize = face >= 100 ? 30 : face >= 10 ? 36 : 42;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" aria-hidden="true">
      {label === 'd20' && (
        <>
          <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" className={fill} />
          <polygon points="50,16 82,70 18,70" className={facet} strokeWidth={3} />
        </>
      )}
      {label === 'd12' && <polygon points="50,3 95,36 78,94 22,94 5,36" className={fill} />}
      {(label === 'd10' || label === 'd%') && (
        <>
          <polygon points="50,2 93,44 50,98 7,44" className={fill} />
          <polyline points="7,44 50,58 93,44" className={facet} strokeWidth={3} />
        </>
      )}
      {label === 'd8' && (
        <>
          <polygon points="50,2 98,50 50,98 2,50" className={fill} />
          <polyline points="2,50 98,50" className={facet} strokeWidth={3} />
        </>
      )}
      {label === 'd6' && <rect x="7" y="7" width="86" height="86" rx="16" className={fill} />}
      {label === 'd4' && <polygon points="50,4 97,92 3,92" className={fill} />}
      {label === 'd2' && <circle cx="50" cy="50" r="47" className={fill} />}

      <text
        x="50"
        y={textY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="800"
        className="fill-white"
      >
        {face}
      </text>
    </svg>
  );
}

interface SpriteMotion {
  delayMs: number;
  durationMs: number;
  endXvw: number;
  bottomPx: number;
  spinDeg: number;
  sizePx: number;
}

export function DiceRollAnimation({ sprites }: Props) {
  // Randomized trajectory per sprite, fixed for the lifetime of this roll.
  // Landing X is spread evenly across the screen (with jitter) so dice don't
  // pile up on one spot; spin is whole turns so every die settles upright and
  // its final value is readable.
  const motions = useMemo<SpriteMotion[]>(
    () =>
      sprites.map((_, i) => ({
        delayMs: Math.random() * 300,
        durationMs: 1400 + Math.random() * 450, // settles before the ~2.2s result reveal
        endXvw: 30 + ((i + 0.5) / sprites.length) * 56 + (Math.random() * 8 - 4),
        bottomPx: 200 + (i % 3) * 60 + Math.random() * 30, // staggered lanes above the tray
        spinDeg: Math.round(2 + Math.random() * 3) * 360,  // whole turns → upright settle
        sizePx: Math.round(46 + Math.random() * 14),
      })),
    [sprites],
  );

  // ~90ms tick drives the face flicker while sprites are still tumbling.
  // Ticking stops once the last sprite settles — the overlay then renders
  // static final faces, lingers so players can read them, and fades out.
  // The parent unmounts it after the fade completes.
  const startRef = useRef(performance.now());
  const [now, setNow] = useState(() => performance.now());
  const [fading, setFading] = useState(false);
  useEffect(() => {
    startRef.current = performance.now();
    setFading(false);
    const lastSettle = Math.max(...motions.map((m) => m.delayMs + m.durationMs));
    const interval = setInterval(() => {
      setNow(performance.now());
      if (performance.now() - startRef.current > lastSettle + 100) clearInterval(interval);
    }, 90);
    const fadeTimer = setTimeout(() => setFading(true), lastSettle + DICE_LINGER_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
    };
  }, [motions]);

  const elapsed = now - startRef.current;

  return (
    <div
      className={[
        'fixed inset-0 z-30 pointer-events-none overflow-hidden transition-opacity duration-700 ease-out',
        fading ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
      aria-hidden="true"
    >
      {sprites.map((sprite, i) => {
        const m = motions[i];
        // Settle slightly before the motion ends so the final face is readable
        // during the last small hop and skid
        const settled = elapsed >= m.delayMs + m.durationMs * 0.8;
        const face = settled ? sprite.value : Math.floor(Math.random() * sprite.sides) + 1;
        return (
          <div
            key={sprite.id}
            className="absolute"
            style={{
              left: -72,
              bottom: m.bottomPx,
              ['--dice-end-x' as string]: `calc(${m.endXvw}vw + 72px)`,
              animation: `dice-roll-x ${m.durationMs}ms cubic-bezier(0.12, 0.68, 0.32, 0.99) ${m.delayMs}ms both`,
            }}
          >
            <div style={{ animation: `dice-roll-bounce ${m.durationMs}ms linear ${m.delayMs}ms both` }}>
              <div
                style={{
                  width: m.sizePx,
                  height: m.sizePx,
                  ['--dice-spin' as string]: `${m.spinDeg}deg`,
                  animation: `dice-roll-spin ${m.durationMs}ms cubic-bezier(0.15, 0.65, 0.25, 1) ${m.delayMs}ms both`,
                }}
              >
                <DieShape label={sprite.label} color={sprite.color} face={face} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
