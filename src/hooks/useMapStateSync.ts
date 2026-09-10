import { useEffect, useRef } from 'react';
import type { BattleMap, MapToken } from '../types/battlemap';
import type { BoardCombatant } from '../components/battlemap/BattleMapBoard';
import { extractPublicMapState, pushMapState } from '../lib/mapStateSync';

interface UseMapStateSyncArgs {
  /** The shared campaign to broadcast into, or null/undefined if this campaign isn't shared. */
  sharedCampaignId: string | null | undefined;
  /** DM's on-air switch. Going false pushes a null state, clearing the player board. */
  live: boolean;
  map: BattleMap | null | undefined;
  tokens: MapToken[];
  combatants: BoardCombatant[];
  activeInstanceKey: string | null;
  encounterId: string | null;
  encounterTitle: string;
}

/**
 * Broadcasts the DM's board to `shared_campaigns.map_state` while the DM is live.
 *
 * Mounted from CampaignManagementPage rather than App.tsx, unlike the other content
 * sync hooks: the live board is tied to the initiative tracker being open, which is
 * transient UI state that has no business in a global store.
 *
 * Debounced at 600ms — much tighter than the 3s used for notes and NPCs, because a
 * board that lags three seconds behind the DM's finger is worse than no board. The
 * payload is a few KB and Supabase's free tier allows 2M realtime messages a month,
 * so even a frantic combat costs nothing meaningful.
 */
export function useMapStateSync({
  sharedCampaignId,
  live,
  map,
  tokens,
  combatants,
  activeInstanceKey,
  encounterId,
  encounterTitle,
}: UseMapStateSyncArgs) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Last payload successfully pushed. Failures leave it stale so the next change retries. */
  const lastPushedRef = useRef<string | null>(null);
  /** Whether we've pushed a clearing null since going off-air, so it happens once. */
  const clearedRef = useRef(true);

  useEffect(() => {
    if (!sharedCampaignId) return;

    // ── Off-air: clear the player board exactly once ──
    if (!live || !map || !encounterId) {
      if (clearedRef.current) return;
      clearedRef.current = true;
      lastPushedRef.current = null;
      pushMapState(sharedCampaignId, null)
        .then(() => console.info('[useMapStateSync] cleared player board'))
        .catch((err) => {
          // Leave clearedRef true regardless: retrying a clear forever would spam,
          // and the next time the DM goes live the fresh state overwrites anyway.
          console.warn('[useMapStateSync] failed to clear board:', err);
        });
      return;
    }

    clearedRef.current = false;

    const state = extractPublicMapState(
      map,
      tokens,
      combatants,
      activeInstanceKey,
      encounterId,
      encounterTitle,
    );
    if (!state) return;

    // Fingerprint excludes updatedAt — otherwise every render would look like a change.
    const { updatedAt: _ignored, ...comparable } = state;
    void _ignored;
    const fingerprint = JSON.stringify(comparable);
    if (fingerprint === lastPushedRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pushMapState(sharedCampaignId, state)
        .then(() => {
          lastPushedRef.current = fingerprint;
          console.info(
            `[useMapStateSync] pushed board — ${state.tokens.length} token(s) to ${sharedCampaignId}`,
          );
        })
        .catch((err) => {
          // Most likely the map_state column doesn't exist yet. Leave the
          // fingerprint uncached so the next token move retries.
          console.warn('[useMapStateSync] push failed — will retry on next change:', err);
        });
    }, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    sharedCampaignId,
    live,
    map,
    tokens,
    combatants,
    activeInstanceKey,
    encounterId,
    encounterTitle,
  ]);

  // Unmount (DM navigates away from Campaigns entirely) must also take the board
  // off-air, or players sit staring at a frozen fight indefinitely. Closing just the
  // tracker is already handled by the off-air branch above, since activeEncounterId
  // goes null — but that branch never runs if the component itself is gone.
  //
  // Read through refs: the cleanup below runs once, at unmount, and would otherwise
  // close over whatever `live`/`sharedCampaignId` were on first render.
  const liveRef = useRef(live);
  liveRef.current = live;
  const sharedIdRef = useRef(sharedCampaignId);
  sharedIdRef.current = sharedCampaignId;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (liveRef.current && sharedIdRef.current) {
        // Fire-and-forget: the component is going away and there is nothing left to
        // retry into. A failure here leaves a stale board until the DM next goes live.
        pushMapState(sharedIdRef.current, null).catch((err) =>
          console.warn('[useMapStateSync] failed to clear board on unmount:', err),
        );
      }
    };
  }, []);
}
