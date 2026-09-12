import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCharactersStore } from '../store/useCharactersStore';
import { pushCharacterToCloud, pullAllCharactersFromCloud } from '../lib/characterCloudService';
import { createSyncDebouncer } from '../lib/summarySync';
import { characterRepository } from '../db/characterRepository';

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

        // ── Reconcile the other direction ──
        // The pull alone is not enough. The push effect captures a baseline on
        // its first run WITHOUT pushing (so a launch doesn't re-upload the whole
        // table), which means any edit that failed to push while the app was
        // last open is stranded in Dexie forever: on the next launch it is just
        // part of the baseline. Characters edited offline land in the same trap.
        //
        // So after pulling, push anything where the local record is genuinely
        // newer than the cloud's, or absent from the cloud entirely. Bounded by
        // an actual timestamp comparison, this is a no-op on a synced device —
        // it does not reintroduce per-launch write amplification.
        const cloudStamps = new Map(cloudChars.map((c) => [c.id, c.updatedAt]));
        const locals = await characterRepository.getAll();
        const stale = locals.filter((l) => {
          const cloudStamp = cloudStamps.get(l.id);
          return cloudStamp === undefined || l.updatedAt > cloudStamp;
        });

        if (stale.length > 0) {
          console.info(
            `[useCharacterCloudSync] Pushing ${stale.length} character(s) newer locally than in the cloud`,
          );
          for (const char of stale) {
            try {
              await pushCharacterToCloud(char, user.id);
            } catch (err) {
              console.warn('[useCharacterCloudSync] Reconcile push failed for', char.name, err);
            }
          }
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
          // Push the record from DEXIE, not the store copy. The store's
          // updatedAt is stamped by updateCharacter a beat after
          // characterRepository.patch stamps Dexie's, so the two differ by a
          // millisecond or so. Pushing the store copy would put the newer of
          // the two in Supabase, and every subsequent startup pull would then
          // see cloud-newer-than-local and rewrite the identical record — a
          // write per character per app launch, which is precisely the
          // amplification pattern documented in CLAUDE.md. Dexie is the
          // authority; the store copy only decides *whether* to push.
          const fresh = await characterRepository.getById(char.id);
          await pushCharacterToCloud(fresh ?? char, user.id);
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
