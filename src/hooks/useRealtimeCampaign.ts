import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSharingStore } from '../store/useSharingStore';
import type { CharacterSummary } from '../types/sharing';

/**
 * Subscribes to Supabase Realtime for a specific campaign.
 * Updates the sharing store on INSERT/UPDATE/DELETE of character_summaries.
 * Automatically unsubscribes on unmount or campaignId change.
 */
export function useRealtimeCampaign(campaignId: string | null) {
  const { upsertSummary, removeSummary, loadCampaignDetail } = useSharingStore();

  useEffect(() => {
    if (!campaignId) return;

    // Subscribe to character_summaries changes for this campaign
    const channel = supabase
      .channel(`campaign-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'character_summaries',
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          const { eventType } = payload;
          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            upsertSummary(payload.new as CharacterSummary);
          } else if (eventType === 'DELETE') {
            const old = payload.old as { id?: string };
            if (old.id) removeSummary(old.id);
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaign_members',
          filter: `campaign_id=eq.${campaignId}`,
        },
        () => {
          // Reload full member list on any membership change
          loadCampaignDetail(campaignId);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, upsertSummary, removeSummary, loadCampaignDetail]);
}
