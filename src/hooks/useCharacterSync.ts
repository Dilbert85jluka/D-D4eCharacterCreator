import { useEffect, useRef } from 'react';
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
  const campaignIdRef = useRef<string | null>(null);
  const debouncerRef = useRef(createSyncDebouncer());

  // Look up which campaign (if any) this character is linked to
  useEffect(() => {
    if (!character || !user) {
      campaignIdRef.current = null;
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

        if (!cancelled && data && data.length > 0) {
          campaignIdRef.current = data[0].campaign_id;
        } else if (!cancelled) {
          campaignIdRef.current = null;
        }
      } catch {
        // Offline or query error — no-op
      }
    })();

    return () => { cancelled = true; };
  }, [character?.id, user?.id]);

  // Watch character changes and debounce sync
  useEffect(() => {
    if (!character || !user || !campaignIdRef.current) return;

    const { debounce } = debouncerRef.current;

    debounce(async () => {
      const campaignId = campaignIdRef.current;
      if (!campaignId) return;

      try {
        const summary = extractSummary(character, campaignId, user.id, derived.maxHp);
        await upsertCharacterSummary(summary);
      } catch {
        // Offline or error — silent fail, will sync on next change
      }
    });
  }, [
    character?.name,
    character?.classId,
    character?.raceId,
    character?.level,
    character?.currentHp,
    character?.paragonPath,
    character?.epicDestiny,
    character?.alignment,
    character?.deity,
    character?.playerName,
    character?.portrait,
    derived.maxHp,
    user?.id,
  ]);

  // Cleanup debouncer on unmount
  useEffect(() => {
    const { cancel } = debouncerRef.current;
    return cancel;
  }, []);
}
