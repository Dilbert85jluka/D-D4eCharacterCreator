import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCampaignsStore } from '../store/useCampaignsStore';
import { useSessionsStore } from '../store/useSessionsStore';
import { extractPublicContent, pushCampaignContent } from '../lib/campaignContentSync';

/**
 * Auto-syncs public campaign content (description, notes, sessions) to Supabase
 * for all local campaigns that have a sharedCampaignId.
 * Debounced 3s, silent fail on offline.
 */
export function useCampaignContentSync() {
  const user = useAuthStore((s) => s.user);
  const campaigns = useCampaignsStore((s) => s.campaigns);
  const getSessionsForCampaign = useSessionsStore((s) => s.getSessionsForCampaign);
  const sessionsByCampaign = useSessionsStore((s) => s.sessionsByCampaign);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevHashRef = useRef('');

  useEffect(() => {
    if (!user) return;

    // Only sync campaigns that are shared online
    const sharedLocal = campaigns.filter((c) => c.sharedCampaignId);
    if (sharedLocal.length === 0) return;

    // Build a hash of relevant data to detect changes
    const hash = JSON.stringify(
      sharedLocal.map((c) => {
        const sessions = getSessionsForCampaign(c.id);
        return {
          id: c.id,
          sid: c.sharedCampaignId,
          desc: c.description,
          notes: c.publicNotes,
          sess: sessions.map((s) => ({
            id: s.id,
            n: s.sessionNumber,
            nm: s.name,
            d: s.date,
            ie: s.importantEvents,
            an: s.additionalNotes,
            u: s.updatedAt,
          })),
        };
      })
    );

    if (hash === prevHashRef.current) return;
    prevHashRef.current = hash;

    // Debounce 3s
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      for (const c of sharedLocal) {
        if (!c.sharedCampaignId) continue;
        const sessions = getSessionsForCampaign(c.id);
        const content = extractPublicContent(c, sessions);
        pushCampaignContent(c.sharedCampaignId, content).catch(() => {});
      }
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, campaigns, sessionsByCampaign, getSessionsForCampaign]);
}
