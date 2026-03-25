import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSharingStore } from '../store/useSharingStore';
import type { CharacterSummary, SharedCampaign } from '../types/sharing';

/**
 * Subscribes to Supabase Realtime for a specific campaign.
 * Updates the sharing store on INSERT/UPDATE/DELETE of character_summaries,
 * campaign_members changes, and shared_campaigns content updates.
 * Automatically unsubscribes on unmount or campaignId change.
 */
export function useRealtimeCampaign(campaignId: string | null) {
  const { upsertSummary, removeSummary, loadCampaignDetail, updateSharedCampaign } = useSharingStore();

  useEffect(() => {
    if (!campaignId) return;

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
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shared_campaigns',
          filter: `id=eq.${campaignId}`,
        },
        (payload) => {
          // Update campaign content in real-time (DM synced notes/sessions)
          updateSharedCampaign(payload.new as SharedCampaign);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, upsertSummary, removeSummary, loadCampaignDetail, updateSharedCampaign]);
}
