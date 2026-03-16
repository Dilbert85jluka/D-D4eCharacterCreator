import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import type { Campaign } from '../types/campaign';

type NewCampaignData = Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>;

export const campaignRepository = {
  async getAll(): Promise<Campaign[]> {
    return db.campaigns.orderBy('updatedAt').reverse().toArray();
  },

  async getById(id: string): Promise<Campaign | undefined> {
    return db.campaigns.get(id);
  },

  async create(data: NewCampaignData): Promise<Campaign> {
    const now = Date.now();
    const campaign: Campaign = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    await db.campaigns.add(campaign);
    return campaign;
  },

  async update(campaign: Campaign): Promise<void> {
    await db.campaigns.put({
      ...campaign,
      updatedAt: Date.now(),
    });
  },

  async patch(id: string, changes: Partial<Campaign>): Promise<void> {
    await db.campaigns.update(id, { ...changes, updatedAt: Date.now() });
  },

  async delete(id: string): Promise<void> {
    await db.campaigns.delete(id);
  },
};
