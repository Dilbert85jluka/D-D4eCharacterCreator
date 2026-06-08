import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCampaignsStore } from '../store/useCampaignsStore';
import { useNpcsStore } from '../store/useNpcsStore';
import { extractPublicNpcs, pushNpcContent } from '../lib/npcContentSync';

/**
 * Auto-syncs the DM's NPC list to `shared_campaigns.npc_content` for every
 * campaign that has a `sharedCampaignId`. Debounced 3s, silent fail on
 * offline / missing column (same pattern as `useHomebrewContentSync`).
 *
 * Only the player-safe view is pushed (visible NPCs, with `privateDescription`,
 * `currentHp`, `maxHp`, and `level` stripped via `extractPublicNpcs`).
 *
 * Fingerprint-based change detection: each campaign's payload is hashed by
 * `(scId, npcId, visibility, updatedAt)` so unchanged campaigns don't push.
 * Mirrors the per-campaign fingerprint approach used by
 * `useCampaignCloudSync` and `useHomebrewContentSync`.
 */
export function useNpcContentSync() {
  const user = useAuthStore((s) => s.user);
  const campaigns = useCampaignsStore((s) => s.campaigns);
  const npcsByCampaign = useNpcsStore((s) => s.npcsByCampaign);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevHashRef = useRef('');

  useEffect(() => {
    if (!user) return;

    const sharedLocal = campaigns.filter((c) => c.sharedCampaignId);
    if (sharedLocal.length === 0) return;

    const hash = JSON.stringify(
      sharedLocal.map((c) => ({
        sid: c.sharedCampaignId,
        npcs: (npcsByCampaign[c.id] ?? [])
          .filter((n) => n.visibleToPlayers)
          .map((n) => ({ id: n.id, u: n.updatedAt })),
      })),
    );
    if (hash === prevHashRef.current) return;
    prevHashRef.current = hash;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      for (const c of sharedLocal) {
        if (!c.sharedCampaignId) continue;
        const content = extractPublicNpcs(npcsByCampaign[c.id] ?? []);
        pushNpcContent(c.sharedCampaignId, content).catch((err) => {
          // Most likely cause: SQL migration not run yet (column missing).
          // Silent in production, console in dev so the failure isn't invisible.
          console.warn('[useNpcContentSync] push failed for', c.sharedCampaignId, err);
        });
      }
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, campaigns, npcsByCampaign]);
}
