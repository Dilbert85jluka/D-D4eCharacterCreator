import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useSharingStore } from '../store/useSharingStore';
import type { CharacterSummary, SharedCampaign } from '../types/sharing';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { registerCampaignHomebrew } from '../lib/homebrewContentSync';

/**
 * Subscribes to Supabase Realtime for a specific campaign.
 * Updates the sharing store on INSERT/UPDATE/DELETE of character_summaries,
 * campaign_members changes, and shared_campaigns content updates.
 * Automatically unsubscribes on unmount or campaignId change.
 *
 * Also reconnects when the browser tab regains visibility (minimize/restore)
 * since the browser kills WebSocket connections on backgrounded tabs.
 */
export function useRealtimeCampaign(campaignId: string | null) {
  const { upsertSummary, removeSummary, loadCampaignDetail, updateSharedCampaign } = useSharingStore();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!campaignId) return;
    const cid = campaignId; // capture narrowed string for closures

    function createChannel() {
      // Remove existing channel if any
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      const channel = supabase
        .channel(`campaign-${cid}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'character_summaries',
            filter: `campaign_id=eq.${cid}`,
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
            filter: `campaign_id=eq.${cid}`,
          },
          () => {
            loadCampaignDetail(cid);
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'shared_campaigns',
            filter: `id=eq.${cid}`,
          },
          (payload) => {
            const updated = payload.new as SharedCampaign;
            updateSharedCampaign(updated);
            if (updated.homebrew_content) {
              registerCampaignHomebrew(updated.homebrew_content);
            }
          },
        )
        .subscribe();

      channelRef.current = channel;
    }

    // Initial subscription
    createChannel();

    // Reconnect when the tab becomes visible again after being backgrounded.
    // Browsers kill/throttle WebSocket connections on minimized tabs.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        createChannel();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [campaignId, upsertSummary, removeSummary, loadCampaignDetail, updateSharedCampaign]);
}
