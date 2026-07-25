import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import type { SessionEncounter } from '../types/encounter';

type NewEncounterData = Omit<SessionEncounter, 'id' | 'createdAt' | 'updatedAt'>;

export const encounterRepository = {
  async getAllForSession(sessionId: string): Promise<SessionEncounter[]> {
    return db.encounters
      .where('sessionId')
      .equals(sessionId)
      .filter((e) => !e.deleted)
      .sortBy('sortOrder');
  },

  async getAllForCampaign(campaignId: string): Promise<SessionEncounter[]> {
    return db.encounters
      .where('campaignId')
      .equals(campaignId)
      .filter((e) => !e.deleted)
      .toArray();
  },

  /** Includes tombstones — for the cloud bundle push, so deletions propagate to other devices. */
  async getAllForCampaignIncludingDeleted(campaignId: string): Promise<SessionEncounter[]> {
    return db.encounters
      .where('campaignId')
      .equals(campaignId)
      .toArray();
  },

  async getAll(): Promise<SessionEncounter[]> {
    return db.encounters.orderBy('sortOrder').filter((e) => !e.deleted).toArray();
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

  /** Soft-delete: converts the record into a tombstone (content blanked, updatedAt
   *  bumped) so the deletion wins the per-record newer-wins merge on other devices. */
  async delete(id: string): Promise<void> {
    const existing = await db.encounters.get(id);
    if (!existing) return;
    await db.encounters.put({
      ...existing,
      deleted: true,
      updatedAt: Date.now(),
      description: '',
      monsterEntries: [],
      characterIds: [],
      initiativeState: null,
    });
  },

  /** Soft-delete all encounters for a session (called when session is deleted) —
   *  tombstoned so they don't resurrect alongside the tombstoned parent session. */
  async deleteAllForSession(sessionId: string): Promise<void> {
    const now = Date.now();
    await db.encounters
      .where('sessionId')
      .equals(sessionId)
      .filter((e) => !e.deleted)
      .modify((e) => {
        e.deleted = true;
        e.updatedAt = now;
        e.description = '';
        e.monsterEntries = [];
        e.characterIds = [];
        e.initiativeState = null;
      });
  },

  /** Hard-delete all encounters for a campaign (called when campaign is
   *  deleted — no tombstones needed, the cloud campaign row is soft-deleted whole). */
  async deleteAllForCampaign(campaignId: string): Promise<void> {
    await db.encounters.where('campaignId').equals(campaignId).delete();
  },
};
