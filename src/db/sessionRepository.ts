import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import type { CampaignSession } from '../types/session';

type NewSessionData = Omit<CampaignSession, 'id' | 'createdAt' | 'updatedAt'>;

export const sessionRepository = {
  async getAllForCampaign(campaignId: string): Promise<CampaignSession[]> {
    return db.sessions
      .where('campaignId')
      .equals(campaignId)
      .sortBy('sessionNumber');
  },

  async getAll(): Promise<CampaignSession[]> {
    return db.sessions.orderBy('sessionNumber').toArray();
  },

  async getById(id: string): Promise<CampaignSession | undefined> {
    return db.sessions.get(id);
  },

  async create(data: NewSessionData): Promise<CampaignSession> {
    const now = Date.now();
    const session: CampaignSession = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    await db.sessions.add(session);
    return session;
  },

  async update(session: CampaignSession): Promise<void> {
    await db.sessions.put({
      ...session,
      updatedAt: Date.now(),
    });
  },

  async patch(id: string, changes: Partial<CampaignSession>): Promise<void> {
    await db.sessions.update(id, { ...changes, updatedAt: Date.now() });
  },

  async delete(id: string): Promise<void> {
    await db.sessions.delete(id);
  },

  /** Delete all sessions belonging to a campaign (called when campaign is deleted) */
  async deleteAllForCampaign(campaignId: string): Promise<void> {
    await db.sessions.where('campaignId').equals(campaignId).delete();
  },
};
