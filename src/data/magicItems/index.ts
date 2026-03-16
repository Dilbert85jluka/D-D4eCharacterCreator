import type { MagicItemData } from '../../types/magicItem';
import { potions } from './potions';
import { scrolls } from './scrolls';
import { rings } from './rings';
import { rods } from './rods';
import { staves } from './staves';
import { wands } from './wands';
import { miscA } from './miscA';
import { miscG } from './miscG';
import { miscO } from './miscO';
import { armor } from './armor';
import { weapons } from './weapons';

export const ALL_MAGIC_ITEMS: MagicItemData[] = [
  ...potions,
  ...scrolls,
  ...rings,
  ...rods,
  ...staves,
  ...wands,
  ...miscA,
  ...miscG,
  ...miscO,
  ...armor,
  ...weapons,
];

export function getMagicItemById(id: string): MagicItemData | undefined {
  return ALL_MAGIC_ITEMS.find((m) => m.id === id);
}

/** Mulberry32 PRNG — deterministic 32-bit seeded RNG */
function mulberry32(seed: number): () => number {
  let t = seed | 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rolling counter to guarantee uniqueness even within the same millisecond */
let rollCounter = 0;

/** Get a random item seeded from D10 + D% dice rolls, varying each invocation */
export function getRandomMagicItem(
  d10: number,
  dPercent: number,
  items: MagicItemData[] = ALL_MAGIC_ITEMS,
): MagicItemData | undefined {
  if (items.length === 0) return undefined;
  const seed = (d10 * 100 + dPercent) + Date.now() + (++rollCounter * 997);
  const rng = mulberry32(seed);
  const index = Math.floor(rng() * items.length);
  return items[index];
}
