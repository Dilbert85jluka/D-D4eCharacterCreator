import Dexie, { type Table } from 'dexie';
import type { Character } from '../types/character';
import type { Campaign } from '../types/campaign';
import type { CampaignSession } from '../types/session';
import type { SessionEncounter } from '../types/encounter';

export class Dnd4eDatabase extends Dexie {
  characters!: Table<Character, string>;
  campaigns!: Table<Campaign, string>;
  sessions!: Table<CampaignSession, string>;
  encounters!: Table<SessionEncounter, string>;

  constructor() {
    super('Dnd4eCharacterCreator');

    this.version(1).stores({
      characters: 'id, name, classId, raceId, level, updatedAt',
    });

    this.version(2).stores({
      characters: 'id, name, classId, raceId, level, updatedAt',
      campaigns: 'id, name, updatedAt',
    });

    this.version(3).stores({
      characters: 'id, name, classId, raceId, level, updatedAt',
      campaigns: 'id, name, updatedAt',
      sessions: 'id, campaignId, sessionNumber, updatedAt',
    });

    this.version(4).stores({
      characters: 'id, name, classId, raceId, level, updatedAt',
      campaigns:  'id, name, updatedAt',
      sessions:   'id, campaignId, sessionNumber, updatedAt',
      encounters: 'id, sessionId, campaignId, sortOrder, updatedAt',
    });

    // v5: quickTrayPowerIds field on characters (no index change)
    this.version(5).stores({
      characters: 'id, name, classId, raceId, level, updatedAt',
      campaigns:  'id, name, updatedAt',
      sessions:   'id, campaignId, sessionNumber, updatedAt',
      encounters: 'id, sessionId, campaignId, sortOrder, updatedAt',
    });

    // v6: sharedCampaignId field on campaigns (no index change needed)
    this.version(6).stores({
      characters: 'id, name, classId, raceId, level, updatedAt',
      campaigns:  'id, name, updatedAt',
      sessions:   'id, campaignId, sessionNumber, updatedAt',
      encounters: 'id, sessionId, campaignId, sortOrder, updatedAt',
    });
  }
}

export const db = new Dnd4eDatabase();
