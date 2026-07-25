import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import type { CampaignNPC } from '../types/npc';

type NewNpcData = Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>;

export const npcRepository = {
  async getAll(): Promise<CampaignNPC[]> {
    return db.npcs.orderBy('updatedAt').reverse().filter((n) => !n.deleted).toArray();
  },

  async getByCampaignId(campaignId: string): Promise<CampaignNPC[]> {
    // Sort by name within a campaign — DM's glossary view reads better alphabetically.
    const npcs = await db.npcs
      .where('campaignId')
      .equals(campaignId)
      .filter((n) => !n.deleted)
      .toArray();
    return npcs.sort((a, b) => a.name.localeCompare(b.name));
  },

  /** Includes tombstones — for the cloud bundle push, so deletions propagate to other devices. */
  async getByCampaignIdIncludingDeleted(campaignId: string): Promise<CampaignNPC[]> {
    return db.npcs.where('campaignId').equals(campaignId).toArray();
  },

  async getById(id: string): Promise<CampaignNPC | undefined> {
    return db.npcs.get(id);
  },

  async create(data: NewNpcData): Promise<CampaignNPC> {
    const now = Date.now();
    const npc: CampaignNPC = {
      ...data,
      id: `npc-${uuidv4()}`,
      createdAt: now,
      updatedAt: now,
    };
    await db.npcs.add(npc);
    return npc;
  },

  async update(npc: CampaignNPC): Promise<void> {
    await db.npcs.put({ ...npc, updatedAt: Date.now() });
  },

  async patch(id: string, changes: Partial<CampaignNPC>): Promise<void> {
    await db.npcs.update(id, { ...changes, updatedAt: Date.now() });
  },

  /** Soft-delete: converts the record into a tombstone (portrait + descriptions
   *  blanked, updatedAt bumped) so the deletion wins the per-record newer-wins
   *  merge on other devices instead of the NPC resurrecting. */
  async delete(id: string): Promise<void> {
    const existing = await db.npcs.get(id);
    if (!existing) return;
    const tombstone: CampaignNPC = {
      ...existing,
      deleted: true,
      updatedAt: Date.now(),
      publicDescription: '',
      privateDescription: '',
    };
    delete tombstone.portrait; // drop the ~25-40 KB image from the tombstone
    await db.npcs.put(tombstone);
  },

  /** Hard-delete all NPCs for a campaign — used when the campaign is deleted
   *  (no tombstones needed, the cloud campaign row is soft-deleted whole). */
  async deleteByCampaignId(campaignId: string): Promise<void> {
    await db.npcs.where('campaignId').equals(campaignId).delete();
  },
};
