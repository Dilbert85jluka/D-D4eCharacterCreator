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
  const prevHashRef = useRef('');

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

    // Quick hash to detect if any item actually changed
    const currentHash = JSON.stringify(
      items.map((i) => ({ id: i.id, u: i.updatedAt })),
    );
    if (currentHash === prevHashRef.current) return;
    prevHashRef.current = currentHash;

    // Debounce each item's push independently (3s delay)
    for (const item of items) {
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
