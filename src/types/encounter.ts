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
  /** Saved initiative tracker state — resume mid-combat */
  initiativeState?: SavedInitiativeState | null;
}

export interface SavedAdHocMonster {
  instanceKey: string;
  monsterId: string;
  displayName: string;
}

export interface SavedInitiativeState {
  initiativeEntries: InitiativeEntry[];
  activeTurnIndex: number;
  addedInstanceKeys: string[];          // Set<string> serialized as array
  adHocMonsters: SavedAdHocMonster[];   // without full MonsterData (reconstructed on load)
}

/** Local UI state for initiative tracking — NOT persisted to DB */
export interface InitiativeEntry {
  id: string;
  type: 'monster' | 'pc';
  monsterId?: string;
  characterId?: string;
  displayName: string;
  initiative: number;
  hp: number;
  maxHp: number;
  /** Pool instance key for tracking which pool row this came from */
  instanceKey: string;
}
