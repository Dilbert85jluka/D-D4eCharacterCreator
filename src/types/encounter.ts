/**
 * Session Encounters — a DM planning tool attached to a CampaignSession.
 * Each session can have multiple encounters; each encounter can reference
 * one or more monsters from the Monster Compendium.
 */

export interface EncounterMonsterEntry {
  /** References MonsterData.id from static monster data — not persisted separately */
  monsterId: string;
  /** Number of this monster in the encounter (≥ 1) */
  quantity: number;
}

export interface SessionEncounter {
  id: string;
  sessionId: string;
  campaignId: string;
  createdAt: number;
  updatedAt: number;
  /** Ascending display order within the session */
  sortOrder: number;
  title: string;
  description: string;
  monsterEntries: EncounterMonsterEntry[];
}
