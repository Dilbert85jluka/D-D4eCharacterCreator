import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { DiceRollAnimation, DICE_OVERLAY_CLEANUP_MS } from './DiceRollAnimation';
import type { DiceSpriteSpec } from './DiceRollAnimation';

/**
 * Shared single-d20 roll animation for click-to-roll spots outside the dice
 * tray (skill checks, ability checks, …). Usage:
 *
 *   const { animationEl, launchD20 } = useD20RollAnimation();
 *   // in the click handler, alongside playDiceRollSound(1):
 *   if (launchD20(roll)) {
 *     // animation launched — delay the result reveal by DICE_SOUND_MS
 *   } else {
 *     // prefers-reduced-motion — reveal instantly as before
 *   }
 *   // render {animationEl} anywhere in the panel
 *
 * The overlay manages its own linger + fade (DiceRollAnimation); this hook
 * clears the sprite state after DICE_OVERLAY_CLEANUP_MS, with a
 * reference-equality guard so back-to-back rolls aren't wiped by the previous
 * roll's cleanup timer.
 */
export function useD20RollAnimation(): {
  animationEl: ReactNode;
  launchD20: (value: number) => boolean;
} {
  const [sprites, setSprites] = useState<DiceSpriteSpec[] | null>(null);

  const launchD20 = useCallback((value: number): boolean => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduceMotion) return false;
    const spec: DiceSpriteSpec[] = [
      { id: `d20-${Date.now()}`, label: 'd20', sides: 20, value, color: 'amber' },
    ];
    setSprites(spec);
    setTimeout(() => {
      setSprites((prev) => (prev === spec ? null : prev));
    }, DICE_OVERLAY_CLEANUP_MS);
    return true;
  }, []);

  const animationEl = sprites !== null ? <DiceRollAnimation sprites={sprites} /> : null;
  return { animationEl, launchD20 };
}
