import { supabase } from './supabase';
import type { BattleMap, MapToken } from '../types/battlemap';
import type { BoardCombatant } from '../components/battlemap/BattleMapBoard';

/**
 * Player-safe battle map broadcast.
 *
 * What players are allowed to know is a real design decision, not an oversight:
 *
 *  • HIDDEN tokens are dropped entirely — not sent with a flag, DROPPED. A flag
 *    would put the ambush's position in a payload the browser can read.
 *  • MONSTER hit points are never sent. Players get a status only: healthy /
 *    bloodied / dead. Bloodied is a real, publicly-visible 4e condition, so this
 *    is both the correct privacy default and faithful to the rules — exact
 *    monster HP is DM information.
 *  • PC hit points ARE sent exactly. Players already own those characters and
 *    see the numbers on their own sheets.
 *  • The map's imageUrl is included so players can render it from Supabase
 *    Storage; the local Dexie imageKey is meaningless off the DM's device and
 *    is deliberately not sent.
 */

export type TokenStatus = 'healthy' | 'bloodied' | 'dead';

export interface PublicMapToken {
  instanceKey: string;
  displayName: string;
  type: 'monster' | 'pc';
  col: number;
  row: number;
  size: number;
  color?: string;
  status: TokenStatus;
  /** Exact HP — PCs only. Omitted for monsters by design. */
  hp?: number;
  maxHp?: number;
  portrait?: string;
}

export interface PublicMapState {
  /** Map metadata only — enough to render. No image bytes. */
  map: {
    id: string;
    name: string;
    width: number;
    height: number;
    imageUrl: string | null;
    grid: BattleMap['grid'];
  };
  tokens: PublicMapToken[];
  /** instanceKey of whoever's turn it is, if the DM has started the turn order. */
  activeInstanceKey: string | null;
  /** Encounter this board belongs to, so a stale board can be identified. */
  encounterId: string;
  encounterTitle: string;
  /** When the DM last broadcast, epoch ms. */
  updatedAt: number;
}

function statusFor(c: BoardCombatant): TokenStatus {
  if (c.maxHp > 0 && c.hp <= 0) return 'dead';
  if (c.maxHp > 0 && c.hp <= c.maxHp / 2) return 'bloodied';
  return 'healthy';
}

/** Build the player-safe board payload. Returns null when there's nothing to show. */
export function extractPublicMapState(
  map: BattleMap | null | undefined,
  tokens: MapToken[],
  combatants: BoardCombatant[],
  activeInstanceKey: string | null,
  encounterId: string,
  encounterTitle: string,
): PublicMapState | null {
  if (!map) return null;

  const byKey = new Map(combatants.map((c) => [c.instanceKey, c]));

  const publicTokens: PublicMapToken[] = [];
  for (const t of tokens) {
    if (t.hidden) continue; // dropped, not flagged — see the note above
    const c = byKey.get(t.instanceKey);
    if (!c) continue; // combatant left the initiative order

    const isPc = c.type === 'pc';
    publicTokens.push({
      instanceKey: t.instanceKey,
      displayName: c.displayName,
      type: c.type,
      col: t.col,
      row: t.row,
      size: t.size,
      color: t.color,
      status: statusFor(c),
      ...(isPc ? { hp: c.hp, maxHp: c.maxHp } : {}),
      portrait: c.portrait,
    });
  }

  return {
    map: {
      id: map.id,
      name: map.name,
      width: map.width,
      height: map.height,
      imageUrl: map.imageUrl ?? null,
      grid: map.grid,
    },
    tokens: publicTokens,
    activeInstanceKey,
    encounterId,
    encounterTitle,
    updatedAt: Date.now(),
  };
}

/**
 * Push the board to `shared_campaigns.map_state`. The existing Realtime UPDATE
 * subscription in `useRealtimeCampaign` delivers it — no new channel needed.
 *
 * Schema: ALTER TABLE shared_campaigns ADD COLUMN map_state JSONB;
 *
 * Passing null clears the board (DM went off-air or ended the encounter).
 */
export async function pushMapState(
  sharedCampaignId: string,
  state: PublicMapState | null,
): Promise<void> {
  const { error } = await supabase
    .from('shared_campaigns')
    .update({ map_state: state })
    .eq('id', sharedCampaignId);

  if (error) throw new Error(`Failed to push map state: ${error.message}`);
}
