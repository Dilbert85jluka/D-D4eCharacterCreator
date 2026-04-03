import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCampaignsStore } from '../store/useCampaignsStore';
import { useHomebrewStore } from '../store/useHomebrewStore';
import { extractHomebrewContent, pushHomebrewContent } from '../lib/homebrewContentSync';

/**
 * Auto-syncs homebrew content to Supabase for all shared campaigns.
 * Only the DM (campaign creator) pushes homebrew content.
 * Debounced 3s, silent fail on offline.
 */
export function useHomebrewContentSync() {
  const user = useAuthStore((s) => s.user);
  const campaigns = useCampaignsStore((s) => s.campaigns);
  const homebrewItems = useHomebrewStore((s) => s.items);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevHashRef = useRef('');

  useEffect(() => {
    if (!user) return;

    // Only sync campaigns that are shared online
    const sharedLocal = campaigns.filter((c) => c.sharedCampaignId);
    if (sharedLocal.length === 0) return;

    // Build a hash of relevant homebrew data to detect changes
    const hash = JSON.stringify(
      sharedLocal.map((c) => ({
        sid: c.sharedCampaignId,
        items: extractHomebrewContent(c.id, homebrewItems).map((i) => ({
          id: i.id,
          u: i.updatedAt,
        })),
      }))
    );

    if (hash === prevHashRef.current) return;
    prevHashRef.current = hash;

    // Debounce 3s
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      for (const c of sharedLocal) {
        if (!c.sharedCampaignId) continue;
        const content = extractHomebrewContent(c.id, homebrewItems);
        pushHomebrewContent(c.sharedCampaignId, content).catch(() => {});
      }
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, campaigns, homebrewItems]);
}
