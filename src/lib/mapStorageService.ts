import { supabase } from './supabase';

/**
 * Battle map image storage.
 *
 * Map pixels go to Supabase STORAGE, never into a database column. The free tier
 * is 500 MB of database against 1 GB of storage, and the campaign bundle JSONB is
 * re-pushed wholesale on every debounced campaign edit — a few base64 maps in
 * there would burn both the database cap and the 5 GB monthly egress. Storage
 * holds roughly 2000 maps at the ~500 KB our downscale produces.
 *
 * ONE-TIME SETUP (like the npc_content column before it): create a PUBLIC bucket
 * named `battlemaps` in the Supabase dashboard under Storage, then add policies
 * allowing authenticated users to write only under their own user id:
 *
 *   create policy "own map upload" on storage.objects for insert to authenticated
 *     with check (bucket_id = 'battlemaps' and (storage.foldername(name))[1] = auth.uid()::text);
 *   create policy "own map update" on storage.objects for update to authenticated
 *     using (bucket_id = 'battlemaps' and (storage.foldername(name))[1] = auth.uid()::text);
 *   create policy "own map delete" on storage.objects for delete to authenticated
 *     using (bucket_id = 'battlemaps' and (storage.foldername(name))[1] = auth.uid()::text);
 *
 * Reads are public so players can load a map by URL without a signed-URL round
 * trip. Paths are `<userId>/<mapId>.jpg` — both UUIDs, so they aren't guessable,
 * which matches the threat model the rest of this app already runs under.
 */
export const MAP_BUCKET = 'battlemaps';

function objectPath(userId: string, mapId: string): string {
  return `${userId}/${mapId}.jpg`;
}

/** Upload (or replace) a map image. Returns the public URL, or null if storage
 *  isn't set up yet — a missing bucket must not break local map use, which works
 *  entirely from the Dexie blob. */
export async function uploadMapImage(
  mapId: string,
  userId: string,
  blob: Blob,
): Promise<string | null> {
  const path = objectPath(userId, mapId);

  const { error } = await supabase.storage.from(MAP_BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: true,
    cacheControl: '31536000', // immutable: the path changes only when the map does
  });

  if (error) {
    // "Bucket not found" is the expected state before the one-time setup above.
    console.warn(
      `[uploadMapImage] Upload failed for map ${mapId}: ${error.message}. ` +
        `The map still works on this device; players won't see it until the ` +
        `"${MAP_BUCKET}" storage bucket exists.`,
    );
    return null;
  }

  const { data } = supabase.storage.from(MAP_BUCKET).getPublicUrl(path);
  return data?.publicUrl ?? null;
}

/** Remove a map image from storage. Best-effort — a failure here leaves an orphan
 *  object, which costs a few hundred KB and is preferable to blocking the delete. */
export async function deleteMapImage(mapId: string, userId: string): Promise<void> {
  const { error } = await supabase.storage
    .from(MAP_BUCKET)
    .remove([objectPath(userId, mapId)]);
  if (error) {
    console.warn(`[deleteMapImage] Could not remove map ${mapId} from storage: ${error.message}`);
  }
}
