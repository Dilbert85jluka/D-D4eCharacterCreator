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
  // Per-campaign hash so we only push the campaign(s) that actually changed.
  // Previously a single combined hash caused every campaign to be pushed on every edit,
  // which wasted Supabase free-tier writes.
  const prevCampaignHashesRef = useRef<Map<string, string>>(new Map());
  const initialHashesCapturedRef = useRef(false);

  // ── ONE-TIME PULL on startup ──
  useEffect(() => {
    if (!user) {
      console.info('[useCampaignCloudSync] Skipping pull: not signed in');
      return;
    }
    if (!hasLoaded) {
      console.info('[useCampaignCloudSync] Skipping pull: campaigns store not yet loaded');
      return;
    }
    if (hasPulledRef.current) return;
    hasPulledRef.current = true;

    (async () => {
      try {
        console.info('[useCampaignCloudSync] Pulling campaigns from cloud…');
        const cloudCampaigns = await pullAllCampaignsFromCloud(user.id);
        console.info(`[useCampaignCloudSync] Pulled ${cloudCampaigns.length} campaign(s) from cloud`);
        if (cloudCampaigns.length > 0) {
          await mergeCloudCampaigns(cloudCampaigns);
        }
      } catch (err) {
        console.error('[useCampaignCloudSync] Pull failed:', err);
      }
    })();
  }, [user, hasLoaded, mergeCloudCampaigns]);

  // ── DEBOUNCED PUSH on campaign / session / encounter changes ──
  useEffect(() => {
    if (!user) {
      console.debug('[useCampaignCloudSync] Skipping push: not signed in');
      return;
    }
    if (!hasLoaded) {
      console.debug('[useCampaignCloudSync] Skipping push: campaigns store not loaded');
      return;
    }
    if (!hasPulledRef.current) {
      console.debug('[useCampaignCloudSync] Skipping push: initial pull not complete');
      return;
    }

    // Build a per-campaign fingerprint: campaign.updatedAt + all its sessions'/encounters' updatedAt.
    // Only campaigns whose fingerprint actually changed get pushed — saves Supabase writes.
    const encountersByCampaign = new Map<string, { id: string; u: number }[]>();
    for (const enc of Object.values(encountersBySession).flat()) {
      if (!encountersByCampaign.has(enc.campaignId)) encountersByCampaign.set(enc.campaignId, []);
      encountersByCampaign.get(enc.campaignId)!.push({ id: enc.id, u: enc.updatedAt });
    }

    const newHashes = new Map<string, string>();
    for (const c of campaigns) {
      const sessions = (sessionsByCampaign[c.id] ?? []).map((s) => ({ id: s.id, u: s.updatedAt }));
      const encounters = encountersByCampaign.get(c.id) ?? [];
      newHashes.set(
        c.id,
        JSON.stringify({ u: c.updatedAt, s: sessions, e: encounters }),
      );
    }

    // On first run, capture baseline hashes only — don't push anything.
    if (!initialHashesCapturedRef.current) {
      prevCampaignHashesRef.current = newHashes;
      initialHashesCapturedRef.current = true;
      console.debug('[useCampaignCloudSync] Initial per-campaign hashes captured; watching for changes');
      return;
    }

    // Find which campaigns changed
    const changedCampaigns = campaigns.filter((c) => {
      const prev = prevCampaignHashesRef.current.get(c.id);
      const curr = newHashes.get(c.id);
      return prev !== curr;
    });

    // Update baseline
    prevCampaignHashesRef.current = newHashes;

    if (changedCampaigns.length === 0) return;

    console.info(
      `[useCampaignCloudSync] Change detected — scheduling push for ${changedCampaigns.length} campaign(s): ${changedCampaigns.map((c) => `"${c.name}"`).join(', ')} (3s debounce)`,
    );

    for (const campaign of changedCampaigns) {
      if (!debouncersRef.current.has(campaign.id)) {
        debouncersRef.current.set(campaign.id, createSyncDebouncer(3000));
      }
      const { debounce } = debouncersRef.current.get(campaign.id)!;
      debounce(async () => {
        try {
          console.info(`[useCampaignCloudSync] Pushing "${campaign.name}" to Supabase…`);
          await pushCampaignToCloud(campaign, user.id);
          console.info(`[useCampaignCloudSync] ✓ Pushed "${campaign.name}"`);
        } catch (err) {
          console.error(`[useCampaignCloudSync] ✗ Push failed for "${campaign.name}":`, err);
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
