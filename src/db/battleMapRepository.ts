import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import type { BattleMap } from '../types/battlemap';

type NewMapData = Omit<BattleMap, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Battle map CRUD.
 *
 * Mirrors the tombstone conventions used by sessions / encounters / NPCs so map
 * deletions propagate through the cloud bundle merge instead of resurrecting from
 * another device's push (see src/db/tombstones.ts and CLAUDE.md).
 *
 * Image blobs are handled separately by mapImageStore below — they are LOCAL ONLY
 * and are hard-deleted, never tombstoned, because they never travel through the
 * bundle and so have nothing to lose a merge against.
 */
export const battleMapRepository = {
  async getByCampaignId(campaignId: string): Promise<BattleMap[]> {
    const maps = await db.maps.where('campaignId').equals(campaignId).toArray();
    return maps.filter((m) => !m.deleted).sort((a, b) => a.name.localeCompare(b.name));
  },

  /** Includes tombstones — for the cloud bundle push, so deletions reach other devices. */
  async getByCampaignIdIncludingDeleted(campaignId: string): Promise<BattleMap[]> {
    return db.maps.where('campaignId').equals(campaignId).toArray();
  },

  async getById(id: string): Promise<BattleMap | undefined> {
    return db.maps.get(id);
  },

  async create(data: NewMapData): Promise<BattleMap> {
    const now = Date.now();
    const map: BattleMap = { ...data, id: uuidv4(), createdAt: now, updatedAt: now };
    await db.maps.add(map);
    return map;
  },

  async update(map: BattleMap): Promise<void> {
    await db.maps.put({ ...map, updatedAt: Date.now() });
  },

  async patch(id: string, changes: Partial<BattleMap>): Promise<void> {
    await db.maps.update(id, { ...changes, updatedAt: Date.now() });
  },

  /** Soft-delete: tombstone the metadata record, hard-delete the local blob.
   *  The blob is local-only, so dropping it frees space immediately and costs nothing
   *  — a device that still needs the pixels re-fetches from BattleMap.imageUrl. */
  async delete(id: string): Promise<void> {
    const existing = await db.maps.get(id);
    if (!existing) return;
    if (existing.imageKey) await db.mapImages.delete(existing.imageKey);
    await db.maps.put({
      ...existing,
      deleted: true,
      updatedAt: Date.now(),
      imageKey: undefined,
      imageUrl: null,
    });
  },

  /** Hard-delete every map for a campaign (campaign deletion — the whole cloud row
   *  is soft-deleted, so per-record tombstones would be redundant). */
  async deleteAllForCampaign(campaignId: string): Promise<void> {
    const maps = await db.maps.where('campaignId').equals(campaignId).toArray();
    const keys = maps.map((m) => m.imageKey).filter((k): k is string => !!k);
    if (keys.length) await db.mapImages.bulkDelete(keys);
    await db.maps.where('campaignId').equals(campaignId).delete();
  },
};

/** Local image-blob store. Never synced — see database.ts v10 comment. */
export const mapImageStore = {
  async put(blob: Blob): Promise<string> {
    const id = uuidv4();
    await db.mapImages.put({ id, blob, updatedAt: Date.now() });
    return id;
  },

  async get(id: string): Promise<Blob | undefined> {
    const rec = await db.mapImages.get(id);
    return rec?.blob;
  },

  async has(id: string): Promise<boolean> {
    return (await db.mapImages.get(id)) !== undefined;
  },

  /** Cache a blob under a KNOWN key — used when a second device pulls a map's
   *  metadata from the cloud and back-fills the pixels from imageUrl, so the map
   *  works offline there too. */
  async putWithKey(id: string, blob: Blob): Promise<void> {
    await db.mapImages.put({ id, blob, updatedAt: Date.now() });
  },

  async delete(id: string): Promise<void> {
    await db.mapImages.delete(id);
  },

  /** Total bytes held locally — surfaced in the map library so a DM can see what
   *  their offline cache costs before it becomes a problem. */
  async totalBytes(): Promise<number> {
    const all = await db.mapImages.toArray();
    return all.reduce((sum, r) => sum + (r.blob?.size ?? 0), 0);
  },
};
