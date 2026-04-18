import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCampaignsStore } from '../store/useCampaignsStore';
import { useSessionsStore } from '../store/useSessionsStore';
import { useEncountersStore } from '../store/useEncountersStore';
import { pushCampaignToCloud, pullAllCampaignsFromCloud } from '../lib/campaignCloudService';
import type { CampaignBundle } from '../lib/campaignCloudService';
import { createSyncDebouncer } from '../lib/summarySync';

/**
 * Cloud campaign sync hook.
 * - On startup (once): pulls all cloud campaigns and merges into local Dexie (newer wins).
 * - On campaign / session / encounter change (debounced 3s): pushes the affected campaign
 *   bundle (campaign + sessions + encounters) to Supabase. Watching sessions + encounters is
 *   required because modifying an encounter only bumps encounter.updatedAt — the parent
 *   campaign's timestamp stays the same. Without this, encounter edits would stay local-only.
 */
export function useCampaignCloudSync() {
  const user = useAuthStore((s) => s.user);
  const campaigns = useCampaignsStore((s) => s.campaigns);
  const hasLoaded = useCampaignsStore((s) => s.hasLoaded);
  const mergeCloudCampaigns = useCampaignsStore((s) => s.mergeCloudCampaigns);
  const sessionsByCampaign = useSessionsStore((s) => s.sessionsByCampaign);
  const encountersBySession = useEncountersStore((s) => s.encountersBySession);

  const hasPulledRef = useRef(false);
  const debouncersRef = useRef(new Map<string, ReturnType<typeof createSyncDebouncer>>());
  const prevHashRef = useRef('');

  // ── ONE-TIME PULL on startup ──
  useEffect(() => {
    if (!user || !hasLoaded || hasPulledRef.current) return;
    hasPulledRef.current = true;

    (async () => {
      try {
        const cloudCampaigns = await pullAllCampaignsFromCloud(user.id);
        if (cloudCampaigns.length > 0) {
          await mergeCloudCampaigns(cloudCampaigns);
        }
      } catch {
        // Offline — silent
      }
    })();
  }, [user, hasLoaded, mergeCloudCampaigns]);

  // ── DEBOUNCED PUSH on campaign / session / encounter changes ──
  useEffect(() => {
    if (!user || !hasLoaded || !hasPulledRef.current) return;

    // Hash includes campaign + all sessions + all encounters so any change triggers a push
    const currentHash = JSON.stringify({
      campaigns: campaigns.map((c) => ({ id: c.id, u: c.updatedAt })),
      sessions: Object.entries(sessionsByCampaign).flatMap(([cid, ss]) =>
        ss.map((s) => ({ c: cid, id: s.id, u: s.updatedAt })),
      ),
      encounters: Object.values(encountersBySession).flat().map((e) => ({
        id: e.id, c: e.campaignId, u: e.updatedAt,
      })),
    });
    if (currentHash === prevHashRef.current) return;
    prevHashRef.current = currentHash;

    for (const campaign of campaigns) {
      if (!debouncersRef.current.has(campaign.id)) {
        debouncersRef.current.set(campaign.id, createSyncDebouncer(3000));
      }
      const { debounce } = debouncersRef.current.get(campaign.id)!;
      debounce(async () => {
        try {
          await pushCampaignToCloud(campaign, user.id);
          console.debug('[useCampaignCloudSync] Pushed campaign', campaign.name);
        } catch (err) {
          console.warn('[useCampaignCloudSync] Failed to push campaign:', err);
        }
      });
    }
  }, [campaigns, sessionsByCampaign, encountersBySession, user, hasLoaded]);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      for (const { cancel } of debouncersRef.current.values()) {
        cancel();
      }
    };
  }, []);
}
