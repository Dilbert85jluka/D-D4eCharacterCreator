import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import type { SessionEncounter } from '../types/encounter';

type NewEncounterData = Omit<SessionEncounter, 'id' | 'createdAt' | 'updatedAt'>;

export const encounterRepository = {
  async getAllForSession(sessionId: string): Promise<SessionEncounter[]> {
    return db.encounters
      .where('sessionId')
      .equals(sessionId)
      .sortBy('sortOrder');
  },

  async getAllForCampaign(campaignId: string): Promise<SessionEncounter[]> {
    return db.encounters
      .where('campaignId')
      .equals(campaignId)
      .toArray();
  },

  async getAll(): Promise<SessionEncounter[]> {
    return db.encounters.orderBy('sortOrder').toArray();
  },

  async getById(id: string): Promise<SessionEncounter | undefined> {
    return db.encounters.get(id);
  },

  async create(data: NewEncounterData): Promise<SessionEncounter> {
    const now = Date.now();
    const encounter: SessionEncounter = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    await db.encounters.add(encounter);
    return encounter;
  },

  async update(encounter: SessionEncounter): Promise<void> {
    await db.encounters.put({
      ...encounter,
      updatedAt: Date.now(),
    });
  },

  async patch(id: string, changes: Partial<SessionEncounter>): Promise<void> {
    await db.encounters.update(id, { ...changes, updatedAt: Date.now() });
  },

  async delete(id: string): Promise<void> {
    await db.encounters.delete(id);
  },

  /** Delete all encounters for a session (called when session is deleted) */
  async deleteAllForSession(sessionId: string): Promise<void> {
    await db.encounters.where('sessionId').equals(sessionId).delete();
  },

  /** Delete all encounters for a campaign (called when campaign is deleted) */
  async deleteAllForCampaign(campaignId: string): Promise<void> {
    await db.encounters.where('campaignId').equals(campaignId).delete();
  },
};
