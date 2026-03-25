import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCampaignsStore } from '../store/useCampaignsStore';
import { pushCampaignToCloud, pullAllCampaignsFromCloud } from '../lib/campaignCloudService';
import type { CampaignBundle } from '../lib/campaignCloudService';
import { createSyncDebouncer } from '../lib/summarySync';

/**
 * Cloud campaign sync hook.
 * - On startup (once): pulls all cloud campaigns and merges into local Dexie (newer wins).
 * - On campaign change (debounced 3s): pushes changed campaigns to Supabase.
 */
export function useCampaignCloudSync() {
  const user = useAuthStore((s) => s.user);
  const campaigns = useCampaignsStore((s) => s.campaigns);
  const hasLoaded = useCampaignsStore((s) => s.hasLoaded);
  const mergeCloudCampaigns = useCampaignsStore((s) => s.mergeCloudCampaigns);

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

  // ── DEBOUNCED PUSH on campaign changes ──
  useEffect(() => {
    if (!user || !hasLoaded || !hasPulledRef.current) return;

    const currentHash = JSON.stringify(
      campaigns.map((c) => ({ id: c.id, u: c.updatedAt })),
    );
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
        } catch {
          // Offline — silent
        }
      });
    }
  }, [campaigns, user, hasLoaded]);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      for (const { cancel } of debouncersRef.current.values()) {
        cancel();
      }
    };
  }, []);
}
