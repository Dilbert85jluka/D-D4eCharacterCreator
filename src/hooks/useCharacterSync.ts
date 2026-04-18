import { useEffect, useRef, useState } from 'react';
import type { Character } from '../types/character';
import { useAuthStore } from '../store/useAuthStore';
import { useCharacterDerived } from './useCharacterDerived';
import { supabase } from '../lib/supabase';
import { upsertCharacterSummary } from '../lib/sharingService';
import { extractSummary, createSyncDebouncer } from '../lib/summarySync';

/**
 * Auto-syncs a character summary to Supabase whenever tracked fields change.
 * Only fires if the character is linked to a campaign AND the user is authenticated.
 * Debounced at 2 seconds to avoid excessive writes.
 */
export function useCharacterSync(character: Character | undefined) {
  const user = useAuthStore((s) => s.user);
  const derived = useCharacterDerived(character as Character);
  // Use state (not ref) so changes to the campaign ID re-trigger the sync effect
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const debouncerRef = useRef(createSyncDebouncer());

  // Look up which campaign (if any) this character is linked to
  useEffect(() => {
    if (!character || !user) {
      setCampaignId(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('character_summaries')
          .select('campaign_id')
          .eq('id', character.id)
          .eq('user_id', user.id)
          .limit(1);

        if (!cancelled) {
          setCampaignId(data && data.length > 0 ? data[0].campaign_id : null);
        }
      } catch {
        // Offline or query error — no-op
      }
    })();

    return () => { cancelled = true; };
  }, [character?.id, user?.id]);

  // Watch character changes AND initial campaign lookup — push summary to Supabase
  useEffect(() => {
    if (!character || !user || !campaignId) return;

    const { debounce } = debouncerRef.current;

    debounce(async () => {
      try {
        const summary = extractSummary(character, campaignId, user.id, derived.maxHp);
        await upsertCharacterSummary(summary);
        console.debug('[useCharacterSync] Pushed summary for', character.name, 'campaign', campaignId);
      } catch (err) {
        // Log so we can diagnose silent sync failures (RLS violations, offline, etc.)
        console.warn('[useCharacterSync] Failed to push character summary:', err);
      }
    });
  }, [
    // campaignId in deps — when the lookup resolves, an initial sync fires immediately
    // (this catches characters whose local state is ahead of the stored summary, e.g. a portrait
    // added before the sync hook could see the campaign link).
    campaignId,
    // updatedAt is bumped on every patch — triggers sync on any character edit
    character?.updatedAt,
    derived.maxHp,
    user?.id,
  ]);

  // Cleanup debouncer on unmount
  useEffect(() => {
    const { cancel } = debouncerRef.current;
    return cancel;
  }, []);
}
