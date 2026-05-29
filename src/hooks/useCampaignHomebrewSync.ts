import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';
import { useSharingStore } from '../store/useSharingStore';
import { setCampaignHomebrew, removeCampaignHomebrew, clearAllCampaignHomebrew } from '../lib/homebrewRegistry';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { HomebrewItem } from '../types/homebrew';
import type { SharedCampaign } from '../types/sharing';

/**
 * App-wide sync for homebrew shared into the campaigns the user has joined.
 *
 * Previously, players only received DM-shared homebrew while sitting on the
 * SharedCampaignView (via `useRealtimeCampaign`'s per-campaign-view subscription)
 * and the data was lost on reload. This hook lifts both concerns app-wide:
 *
 *  1. On login + whenever the joined-campaigns list changes, pull each
 *     campaign's current `homebrew_content` and register it via
 *     `setCampaignHomebrew(sharedCampaignId, items)`. So a player can use
 *     DM-shared homebrew anywhere in the app (character wizard, sheet,
 *     workshop browser, etc.) — not just inside the campaign view.
 *
 *  2. Open a realtime channel per joined campaign that fires whenever its
 *     `homebrew_content` updates, re-registering the new items. So a DM
 *     adding a race shows up in every player's live registry within seconds.
 *
 * Drop the channel when the user leaves a campaign or logs out. The
 * homebrewRegistry holds campaign items in a Map keyed by sharedCampaignId,
 * so re-registering one campaign doesn't disturb others or the user's local
 * Workshop items.
 */
export function useCampaignHomebrewSync() {
  const user = useAuthStore((s) => s.user);
  const sharedCampaigns = useSharingStore((s) => s.sharedCampaigns);
  const channelsRef = useRef<Map<string, RealtimeChannel>>(new Map());

  // Cleanup all channels + clear campaign registry on user change (login/logout).
  useEffect(() => {
    if (user) return;
    // Logged out — drop everything.
    for (const ch of channelsRef.current.values()) supabase.removeChannel(ch);
    channelsRef.current.clear();
    clearAllCampaignHomebrew();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const desiredIds = new Set(sharedCampaigns.map((c) => c.id));

    // Drop channels + registry buckets for campaigns the user is no longer in.
    for (const [scId, ch] of channelsRef.current) {
      if (!desiredIds.has(scId)) {
        supabase.removeChannel(ch);
        channelsRef.current.delete(scId);
        removeCampaignHomebrew(scId);
      }
    }

    // Seed registry from the SharedCampaign rows currently in the store
    // (loadSharedCampaigns already fetched homebrew_content as part of the row).
    for (const sc of sharedCampaigns) {
      setCampaignHomebrew(sc.id, sc.homebrew_content ?? []);
    }

    // Subscribe to live updates for each campaign we don't already watch.
    for (const sc of sharedCampaigns) {
      if (channelsRef.current.has(sc.id)) continue;

      const channel = supabase
        .channel(`homebrew-${sc.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'shared_campaigns', filter: `id=eq.${sc.id}` },
          (payload) => {
            const updated = payload.new as SharedCampaign;
            const items: HomebrewItem[] = updated.homebrew_content ?? [];
            setCampaignHomebrew(sc.id, items);
          },
        )
        .subscribe();

      channelsRef.current.set(sc.id, channel);
    }
  }, [user, sharedCampaigns]);

  // Final cleanup on unmount.
  useEffect(() => {
    const channels = channelsRef.current;
    return () => {
      for (const ch of channels.values()) supabase.removeChannel(ch);
      channels.clear();
    };
  }, []);
}
