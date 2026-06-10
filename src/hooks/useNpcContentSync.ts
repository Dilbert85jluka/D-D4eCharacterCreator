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
  // Per-campaign last-successfully-pushed fingerprint. Push failures clear
  // the entry so the next render retries — without this, an initial failure
  // (e.g. column not yet present, transient network error) would silently
  // wedge sync for that campaign until the visible NPC set changed.
  const lastPushedRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;

    const sharedLocal = campaigns.filter((c) => c.sharedCampaignId);
    if (sharedLocal.length === 0) return;

    // Build per-campaign fingerprints so we can push only campaigns that
    // actually changed (or that failed previously and need retry).
    const campaignsToPush: { localId: string; sharedId: string; fingerprint: string }[] = [];
    for (const c of sharedLocal) {
      if (!c.sharedCampaignId) continue;
      const visibleNpcs = (npcsByCampaign[c.id] ?? [])
        .filter((n) => n.visibleToPlayers)
        .map((n) => ({ id: n.id, u: n.updatedAt }));
      const fingerprint = JSON.stringify(visibleNpcs);
      if (lastPushedRef.current[c.sharedCampaignId] === fingerprint) continue;
      campaignsToPush.push({
        localId: c.id,
        sharedId: c.sharedCampaignId,
        fingerprint,
      });
    }
    if (campaignsToPush.length === 0) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      for (const { localId, sharedId, fingerprint } of campaignsToPush) {
        const content = extractPublicNpcs(npcsByCampaign[localId] ?? []);
        pushNpcContent(sharedId, content)
          .then(() => {
            // Only mark as pushed AFTER success — failures stay un-cached so a
            // future render retries the same payload (no toggle workaround needed).
            lastPushedRef.current[sharedId] = fingerprint;
            console.info('[useNpcContentSync] pushed', content.length, 'NPC(s) to', sharedId);
          })
          .catch((err) => {
            // Most likely cause: SQL migration not run yet (column missing) OR transient
            // network error. Either way leave the fingerprint un-cached so we retry.
            console.warn('[useNpcContentSync] push failed for', sharedId, '— will retry on next change:', err);
          });
      }
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, campaigns, npcsByCampaign]);
}
