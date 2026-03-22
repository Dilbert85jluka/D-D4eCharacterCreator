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
  const prevHashRef = useRef('');

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

    // Quick hash to detect if any character actually changed
    const currentHash = JSON.stringify(
      characters.map((c) => ({ id: c.id, u: c.updatedAt })),
    );
    if (currentHash === prevHashRef.current) return;
    prevHashRef.current = currentHash;

    // Debounce each character's push independently (3s delay)
    for (const char of characters) {
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
