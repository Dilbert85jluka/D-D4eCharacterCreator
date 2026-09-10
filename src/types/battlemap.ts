/**
 * Battle maps — VTT-style tactical grid for running encounters.
 *
 * Design notes (why it's shaped this way):
 *
 * 1. A map is a plain image plus a GRID DESCRIPTOR. We never bake a grid into
 *    the pixels. Roll20/Foundry both work this way: store px-per-square plus the
 *    offset of the first gridline, then overlay. Most purchased maps already have
 *    squares printed on them at an arbitrary scale, so the descriptor has to be
 *    calibrated per map rather than assumed.
 *
 * 2. Image BYTES are never stored here. The blob lives in Dexie (`db.mapImages`)
 *    for offline use and in Supabase Storage for players; this record carries only
 *    the key and the URL. Putting base64 pixels in the campaign bundle JSONB would
 *    push megabytes on every debounced campaign edit against a 500 MB database and
 *    5 GB/month egress — see CLAUDE.md "Cloud Character + Campaign Backup".
 *
 * 3. Tokens live on the ENCOUNTER, not on the map, because the same map is reused
 *    across fights while token positions are per-fight.
 */

/** How the square grid is laid over the map image. All values in SOURCE IMAGE pixels. */
export interface GridConfig {
  /** Width/height of one square, in source-image pixels. */
  size: number;
  /** X position of the first vertical gridline, in source-image pixels. 0 ≤ offsetX < size. */
  offsetX: number;
  /** Y position of the first horizontal gridline. 0 ≤ offsetY < size. */
  offsetY: number;
  /** Draw our overlay grid. Turn OFF when the map art already has squares printed on it. */
  visible: boolean;
  /** CSS colour for the overlay lines. */
  color: string;
  /** 0–1 opacity for the overlay lines. */
  opacity: number;
}

export const DEFAULT_GRID: GridConfig = {
  size: 70, // Roll20's long-standing default; a reasonable first guess before calibration
  offsetX: 0,
  offsetY: 0,
  visible: true,
  color: '#000000',
  opacity: 0.25,
};

export interface BattleMap {
  id: string;
  campaignId: string;
  name: string;
  /** Key into `db.mapImages`. Present on the device that uploaded (or has cached) the image. */
  imageKey?: string;
  /** Supabase Storage URL. How players — and the DM's other devices — get the pixels. */
  imageUrl?: string | null;
  /** Natural dimensions of the stored image, in pixels. */
  width: number;
  height: number;
  grid: GridConfig;
  createdAt: number;
  updatedAt: number;
  /** Tombstone flag — see src/db/tombstones.ts. Filtered out of all reads. */
  deleted?: boolean;
}

/** A combatant's position on the board.
 *  `instanceKey` matches InitiativeEntry.instanceKey — a token IS a combatant,
 *  so HP, damage, display name and turn order all come from the initiative tracker. */
export interface MapToken {
  instanceKey: string;
  /** Grid coordinates of the token's TOP-LEFT square. May be negative / off-image;
   *  the board clamps on drop rather than rejecting, so a mis-calibrated grid is recoverable. */
  col: number;
  row: number;
  /** Footprint in squares. 1 = Medium, 2 = Large (2×2), etc. See SIZE_SQUARES. */
  size: number;
  /** Optional ring colour override. Falls back to a colour derived from combatant type. */
  color?: string;
  /** Hidden from the player-facing board (ambush, invisible, not-yet-revealed). */
  hidden?: boolean;
}

/** Per-encounter board state. Stored on SessionEncounter.mapState. */
export interface EncounterMapState {
  /** References BattleMap.id. */
  mapId: string;
  tokens: MapToken[];
}

/**
 * Squares occupied by each creature size in D&D 4e.
 *
 * SOURCED, NOT ASSUMED — per the CLAUDE.md source-accuracy rule:
 *   • Small and Medium each occupy 1 square, and Large occupies 2×2 — confirmed
 *     (an ogre "takes up a space 2 squares by 2 squares").
 *   • Gargantuan is "4×4 or larger" — confirmed.
 *   • Tiny occupies 1 square on the board (4e lets Tiny creatures share a square;
 *     we render one square and leave sharing to the DM).
 *   • HUGE = 3 is the interpolated value and is the one entry NOT yet confirmed
 *     against the PHB table. It is flagged here deliberately. Every token's size is
 *     overridable in the token editor regardless (Foundry does the same), so a wrong
 *     default is a nuisance rather than a trap.
 */
export const SIZE_SQUARES: Record<string, number> = {
  Tiny: 1,
  Small: 1,
  Medium: 1,
  Large: 2,
  Huge: 3, // ← verify against PHB before treating as authoritative
  Gargantuan: 4,
};

export function squaresForSize(size: string | undefined): number {
  if (!size) return 1;
  return SIZE_SQUARES[size] ?? 1;
}

/**
 * Distance between two squares in D&D 4e = Chebyshev distance.
 *
 * 4e dropped 3.5's 1-2-1 diagonal rule: a diagonal move costs exactly 1 square,
 * so distance is max(|Δcol|, |Δrow|) rather than anything Euclidean. This is also
 * why 4e bursts and blasts are literal squares on the grid.
 *
 * Measured in SQUARES. The app never displays feet — 4e's unit is the square.
 */
export function squareDistance(
  a: { col: number; row: number },
  b: { col: number; row: number },
): number {
  return Math.max(Math.abs(a.col - b.col), Math.abs(a.row - b.row));
}

/** Distance between two token footprints — 0 when they overlap or are adjacent-touching
 *  is NOT assumed here; this measures nearest-square to nearest-square. */
export function tokenDistance(a: MapToken, b: MapToken): number {
  const dx = Math.max(0, Math.max(a.col - (b.col + b.size - 1), b.col - (a.col + a.size - 1)));
  const dy = Math.max(0, Math.max(a.row - (b.row + b.size - 1), b.row - (a.row + a.size - 1)));
  return Math.max(dx, dy);
}
