import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useHomebrewStore } from '../store/useHomebrewStore';
import { pushHomebrewToCloud, pullAllHomebrewFromCloud } from '../lib/homebrewCloudService';
import { createSyncDebouncer } from '../lib/summarySync';

/**
 * Cloud homebrew sync hook.
 * - On startup (once): pulls all cloud homebrew items and merges into local Dexie (newer wins).
 * - On homebrew change (debounced 3s): pushes changed items to Supabase.
 *
 * Must be called inside App after auth is initialized.
 */
export function useHomebrewCloudSync() {
  const user = useAuthStore((s) => s.user);
  const items = useHomebrewStore((s) => s.items);
  const hasLoaded = useHomebrewStore((s) => s.hasLoaded);
  const mergeCloudHomebrew = useHomebrewStore((s) => s.mergeCloudHomebrew);

  const hasPulledRef = useRef(false);
  const debouncersRef = useRef(new Map<string, ReturnType<typeof createSyncDebouncer>>());
  /** Per-item last-seen updatedAt, so we push ONLY what changed. */
  const prevStampsRef = useRef<Map<string, number>>(new Map());
  const baselineCapturedRef = useRef(false);

  // ── ONE-TIME PULL on startup (after auth + Dexie load) ──
  useEffect(() => {
    if (!user || !hasLoaded || hasPulledRef.current) return;
    hasPulledRef.current = true;

    (async () => {
      try {
        const cloudItems = await pullAllHomebrewFromCloud(user.id);
        if (cloudItems.length > 0) {
          await mergeCloudHomebrew(cloudItems);
        }
      } catch {
        // Offline or error — silent fail; local data works fine
      }
    })();
  }, [user, hasLoaded, mergeCloudHomebrew]);

  // ── DEBOUNCED PUSH on homebrew changes ──
  useEffect(() => {
    if (!user || !hasLoaded || !hasPulledRef.current) return;

    // Push ONLY the items whose own updatedAt moved.
    //
    // Same defect as useCharacterCloudSync had: one combined hash across every
    // item, and on any difference the loop below pushed ALL of them. Because
    // prevHash started empty, the first run after the startup pull always
    // differed — so every app launch re-uploaded the entire homebrew library,
    // and each edit re-uploaded every item alongside the one that changed.
    // Server logs showed this firing in lockstep with the character version.
    const changed = items.filter((i) => prevStampsRef.current.get(i.id) !== i.updatedAt);

    // Refresh the baseline before any early return, so one edit is never
    // counted as a change twice.
    prevStampsRef.current = new Map(items.map((i) => [i.id, i.updatedAt]));

    // First run after the pull: record what's already here without pushing it,
    // so a cold start doesn't re-upload everything already on disk.
    if (!baselineCapturedRef.current) {
      baselineCapturedRef.current = true;
      return;
    }

    if (changed.length === 0) return;

    // Debounce each item's push independently (3s delay)
    for (const item of changed) {
      if (!debouncersRef.current.has(item.id)) {
        debouncersRef.current.set(item.id, createSyncDebouncer(3000));
      }
      const { debounce } = debouncersRef.current.get(item.id)!;
      debounce(async () => {
        try {
          await pushHomebrewToCloud(item, user.id);
        } catch {
          // Offline — silent fail; will push on next change
        }
      });
    }
  }, [items, user, hasLoaded]);

  // ── Cleanup all debouncers on unmount ──
  useEffect(() => {
    return () => {
      for (const { cancel } of debouncersRef.current.values()) {
        cancel();
      }
    };
  }, []);
}
