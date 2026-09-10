import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCharactersStore } from '../store/useCharactersStore';
import { pushCharacterToCloud, pullAllCharactersFromCloud } from '../lib/characterCloudService';
import { createSyncDebouncer } from '../lib/summarySync';

/**
 * Cloud character sync hook.
 * - On startup (once): pulls all cloud characters and merges into local Dexie (newer wins).
 * - On character change (debounced 3s): pushes changed characters to Supabase.
 *
 * Must be called inside App after auth is initialized.
 */
export function useCharacterCloudSync() {
  const user = useAuthStore((s) => s.user);
  const characters = useCharactersStore((s) => s.characters);
  const hasLoaded = useCharactersStore((s) => s.hasLoaded);
  const mergeCloudCharacters = useCharactersStore((s) => s.mergeCloudCharacters);

  const hasPulledRef = useRef(false);
  const debouncersRef = useRef(new Map<string, ReturnType<typeof createSyncDebouncer>>());
  /** Per-character last-seen updatedAt. Keyed so we can push ONLY what changed —
   *  see the write-amplification note on the push effect below. */
  const prevStampsRef = useRef<Map<string, number>>(new Map());
  const baselineCapturedRef = useRef(false);

  // ── ONE-TIME PULL on startup (after auth + Dexie load) ──
  useEffect(() => {
    if (!user || !hasLoaded || hasPulledRef.current) return;
    hasPulledRef.current = true;

    (async () => {
      try {
        const cloudChars = await pullAllCharactersFromCloud(user.id);
        if (cloudChars.length > 0) {
          await mergeCloudCharacters(cloudChars);
        }
      } catch {
        // Offline or error — silent fail; local data works fine
      }
    })();
  }, [user, hasLoaded, mergeCloudCharacters]);

  // ── DEBOUNCED PUSH on character changes ──
  useEffect(() => {
    if (!user || !hasLoaded || !hasPulledRef.current) return;

    // Push ONLY the characters whose own updatedAt moved.
    //
    // This used to compute one combined hash across every character and, when it
    // differed, loop over ALL of them and push each — so ticking one character's HP
    // rewrote every character's full JSON (portrait included, 30–50 KB apiece) into
    // Supabase. With a dozen characters that's a ~500 KB write for a 1 HP change,
    // every 3 seconds of combat, and the resulting dead-tuple churn is exactly the
    // kind of load that drains a free-tier Disk IO budget. useCampaignCloudSync
    // already did per-record fingerprinting; this hook never got the same treatment.
    const changed = characters.filter(
      (c) => prevStampsRef.current.get(c.id) !== c.updatedAt,
    );

    // Refresh the baseline before any early return, so a character is never
    // considered "changed" twice for the same edit.
    prevStampsRef.current = new Map(characters.map((c) => [c.id, c.updatedAt]));

    // First run after the pull: record what's already here without pushing it.
    // Otherwise every character on disk would be re-uploaded on every app start.
    if (!baselineCapturedRef.current) {
      baselineCapturedRef.current = true;
      return;
    }

    if (changed.length === 0) return;

    // Debounce each character's push independently (3s delay)
    for (const char of changed) {
      if (!debouncersRef.current.has(char.id)) {
        debouncersRef.current.set(char.id, createSyncDebouncer(3000));
      }
      const { debounce } = debouncersRef.current.get(char.id)!;
      debounce(async () => {
        try {
          await pushCharacterToCloud(char, user.id);
        } catch {
          // Offline — silent fail; will push on next change
        }
      });
    }
  }, [characters, user, hasLoaded]);

  // ── Cleanup all debouncers on unmount ──
  useEffect(() => {
    return () => {
      for (const { cancel } of debouncersRef.current.values()) {
        cancel();
      }
    };
  }, []);
}
