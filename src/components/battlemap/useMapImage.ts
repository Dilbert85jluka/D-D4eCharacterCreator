import { useEffect, useState } from 'react';
import { mapImageStore } from '../../db/battleMapRepository';
import type { BattleMap } from '../../types/battlemap';

type Status = 'idle' | 'loading' | 'ready' | 'error';

interface MapImageState {
  /** Object URL (local blob) or remote URL — feed straight to <img src>. */
  src: string | null;
  status: Status;
  error: string | null;
}

/**
 * Resolves a BattleMap to something an <img> can display.
 *
 * Order matters:
 *   1. Local Dexie blob — instant, works offline. This is the normal DM path.
 *   2. Remote imageUrl — the DM's second device, or any player. On success the
 *      blob is cached back into Dexie under the map's existing imageKey so the
 *      map works offline on that device from then on.
 *
 * Object URLs are revoked on unmount/change; forgetting that leaks the whole
 * image (maps are 300–700 KB each, so it shows up fast across a session).
 */
export function useMapImage(map: BattleMap | null | undefined): MapImageState {
  const [state, setState] = useState<MapImageState>({ src: null, status: 'idle', error: null });

  const mapId = map?.id;
  const imageKey = map?.imageKey;
  const imageUrl = map?.imageUrl;

  useEffect(() => {
    if (!mapId) {
      setState({ src: null, status: 'idle', error: null });
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    setState({ src: null, status: 'loading', error: null });

    (async () => {
      // 1. Local blob
      if (imageKey) {
        try {
          const blob = await mapImageStore.get(imageKey);
          if (cancelled) return;
          if (blob) {
            objectUrl = URL.createObjectURL(blob);
            setState({ src: objectUrl, status: 'ready', error: null });
            return;
          }
        } catch (err) {
          console.warn('[useMapImage] local blob read failed', err);
        }
      }

      // 2. Remote — and back-fill the local cache so this device works offline next time.
      if (imageUrl) {
        try {
          const res = await fetch(imageUrl);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          if (cancelled) return;

          objectUrl = URL.createObjectURL(blob);
          setState({ src: objectUrl, status: 'ready', error: null });

          if (imageKey) {
            mapImageStore
              .putWithKey(imageKey, blob)
              .catch((err) => console.warn('[useMapImage] cache back-fill failed', err));
          }
          return;
        } catch (err) {
          if (cancelled) return;
          console.warn('[useMapImage] remote fetch failed', err);
          setState({
            src: null,
            status: 'error',
            error: 'Could not load the map image. Check your connection.',
          });
          return;
        }
      }

      if (!cancelled) {
        setState({
          src: null,
          status: 'error',
          error: 'This map has no image on this device yet.',
        });
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [mapId, imageKey, imageUrl]);

  return state;
}
