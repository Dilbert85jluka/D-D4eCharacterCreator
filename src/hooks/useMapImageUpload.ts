import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useBattleMapsStore } from '../store/useBattleMapsStore';
import { battleMapRepository, mapImageStore } from '../db/battleMapRepository';
import { uploadMapImage } from '../lib/mapStorageService';

/**
 * Uploads map images that exist locally but have no cloud URL yet.
 *
 * Runs app-wide from App.tsx. A map is a candidate when it has a local blob
 * (imageKey) but no imageUrl — i.e. it was imported on this device and hasn't
 * been shared yet. Writing the URL back onto the map record bumps its updatedAt,
 * which the campaign push fingerprint already watches, so the URL reaches the
 * DM's other devices and the players through the normal bundle path.
 *
 * Deliberately sequential and un-debounced-per-item: each upload is hundreds of
 * KB, and firing a dozen at once on a tablet on hotel wifi is how you get a stalled
 * queue and a killed tab. One at a time, and a failure just leaves the map for the
 * next attempt rather than retrying in a loop.
 */
export function useMapImageUpload() {
  const user = useAuthStore((s) => s.user);
  const mapsByCampaign = useBattleMapsStore((s) => s.mapsByCampaign);
  const mapsLoaded = useBattleMapsStore((s) => s.hasLoaded);

  /** Maps already attempted this session — prevents a failing upload (no bucket,
   *  offline) from being retried on every store change for the rest of the session. */
  const attemptedRef = useRef<Set<string>>(new Set());
  const runningRef = useRef(false);

  useEffect(() => {
    if (!user || !mapsLoaded || runningRef.current) return;

    const pending = Object.values(mapsByCampaign)
      .flat()
      .filter((m) => !m.deleted && m.imageKey && !m.imageUrl && !attemptedRef.current.has(m.id));

    if (pending.length === 0) return;

    runningRef.current = true;
    (async () => {
      try {
        for (const map of pending) {
          attemptedRef.current.add(map.id);
          try {
            const blob = await mapImageStore.get(map.imageKey!);
            if (!blob) continue; // metadata arrived from another device; no pixels here

            const url = await uploadMapImage(map.id, user.id, blob);
            if (!url) continue; // storage not set up — warning already logged

            await battleMapRepository.patch(map.id, { imageUrl: url });
            await useBattleMapsStore.getState().loadByCampaign(map.campaignId);
            console.info(`[useMapImageUpload] ✓ Uploaded "${map.name}"`);
          } catch (err) {
            console.warn(`[useMapImageUpload] ✗ Upload failed for "${map.name}":`, err);
          }
        }
      } finally {
        runningRef.current = false;
      }
    })();
  }, [user, mapsByCampaign, mapsLoaded]);
}
