import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import type { CampaignNPC } from '../types/npc';

type NewNpcData = Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>;

export const npcRepository = {
  async getAll(): Promise<CampaignNPC[]> {
    return db.npcs.orderBy('updatedAt').reverse().toArray();
  },

  async getByCampaignId(campaignId: string): Promise<CampaignNPC[]> {
    // Sort by name within a campaign — DM's glossary view reads better alphabetically.
    const npcs = await db.npcs.where('campaignId').equals(campaignId).toArray();
    return npcs.sort((a, b) => a.name.localeCompare(b.name));
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

  async delete(id: string): Promise<void> {
    await db.npcs.delete(id);
  },

  /** Bulk-delete all NPCs for a campaign — used when the campaign is deleted. */
  async deleteByCampaignId(campaignId: string): Promise<void> {
    await db.npcs.where('campaignId').equals(campaignId).delete();
  },
};
