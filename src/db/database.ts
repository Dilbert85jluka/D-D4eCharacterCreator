import Dexie, { type Table } from 'dexie';
import type { Character } from '../types/character';
import type { Campaign } from '../types/campaign';
import type { CampaignSession } from '../types/session';
import type { SessionEncounter } from '../types/encounter';
import type { HomebrewItem } from '../types/homebrew';
import type { CampaignNPC } from '../types/npc';
import type { BattleMap } from '../types/battlemap';

/** Map image bytes, kept OUT of the map record so the cloud campaign bundle
 *  carries metadata only. Stored as a native Blob — IndexedDB handles Blobs
 *  directly, so there's no base64 inflation and no 500 MB Postgres pressure. */
export interface MapImageRecord {
  /** Matches BattleMap.imageKey. */
  id: string;
  blob: Blob;
  updatedAt: number;
}

export class Dnd4eDatabase extends Dexie {
  characters!: Table<Character, string>;
  campaigns!: Table<Campaign, string>;
  sessions!: Table<CampaignSession, string>;
  encounters!: Table<SessionEncounter, string>;
  homebrew!: Table<HomebrewItem, string>;
  npcs!: Table<CampaignNPC, string>;
  maps!: Table<BattleMap, string>;
  mapImages!: Table<MapImageRecord, string>;

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

    // v7: homebrew content table
    this.version(7).stores({
      characters: 'id, name, classId, raceId, level, updatedAt',
      campaigns:  'id, name, updatedAt',
      sessions:   'id, campaignId, sessionNumber, updatedAt',
      encounters: 'id, sessionId, campaignId, sortOrder, updatedAt',
      homebrew:   'id, contentType, name, createdBy, updatedAt, *campaignIds',
    });

    // v8: privateNotes field on campaigns (no index change)
    this.version(8).stores({
      characters: 'id, name, classId, raceId, level, updatedAt',
      campaigns:  'id, name, updatedAt',
      sessions:   'id, campaignId, sessionNumber, updatedAt',
      encounters: 'id, sessionId, campaignId, sortOrder, updatedAt',
      homebrew:   'id, contentType, name, createdBy, updatedAt, *campaignIds',
    }).upgrade((tx) => {
      // Add empty privateNotes to existing campaigns
      return tx.table('campaigns').toCollection().modify((campaign) => {
        if (campaign.privateNotes === undefined) campaign.privateNotes = '';
      });
    });

    // v9: npcs table — DM-authored non-player characters scoped per campaign.
    // Indexed by id (PK), campaignId (per-campaign queries), and updatedAt (sort).
    this.version(9).stores({
      characters: 'id, name, classId, raceId, level, updatedAt',
      campaigns:  'id, name, updatedAt',
      sessions:   'id, campaignId, sessionNumber, updatedAt',
      encounters: 'id, sessionId, campaignId, sortOrder, updatedAt',
      homebrew:   'id, contentType, name, createdBy, updatedAt, *campaignIds',
      npcs:       'id, campaignId, name, updatedAt, visibleToPlayers',
    });

    // v10: battle maps. Two tables on purpose —
    //   `maps`      = small metadata records (name, dimensions, grid config, remote URL).
    //                 These ride inside the cloud CampaignBundle like sessions/encounters/NPCs.
    //   `mapImages` = the actual image Blobs, LOCAL ONLY. Never synced through the
    //                 campaign bundle; players fetch pixels from Supabase Storage via
    //                 BattleMap.imageUrl. Keeps the JSONB bundle small enough that the
    //                 existing per-record merge and 3s debounced push stay viable.
    this.version(10).stores({
      characters: 'id, name, classId, raceId, level, updatedAt',
      campaigns:  'id, name, updatedAt',
      sessions:   'id, campaignId, sessionNumber, updatedAt',
      encounters: 'id, sessionId, campaignId, sortOrder, updatedAt',
      homebrew:   'id, contentType, name, createdBy, updatedAt, *campaignIds',
      npcs:       'id, campaignId, name, updatedAt, visibleToPlayers',
      maps:       'id, campaignId, name, updatedAt',
      mapImages:  'id, updatedAt',
    });
  }
}

export const db = new Dnd4eDatabase();
