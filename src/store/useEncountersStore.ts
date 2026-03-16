import { create } from 'zustand';
import { encounterRepository } from '../db/encounterRepository';
import type { SessionEncounter } from '../types/encounter';

interface EncountersState {
  /** Encounters grouped by sessionId, sorted by sortOrder */
  encountersBySession: Record<string, SessionEncounter[]>;
  hasLoaded: boolean;

  loadAllEncounters(): Promise<void>;
  loadEncountersForSession(sessionId: string): Promise<void>;

  addEncounter(encounter: SessionEncounter): void;
  updateEncounter(encounter: SessionEncounter): void;
  deleteEncounter(id: string, sessionId: string): void;
  deleteAllForSession(sessionId: string): void;
  deleteAllForCampaign(campaignId: string): void;

  getEncountersForSession(sessionId: string): SessionEncounter[];

  /** Returns the next sortOrder value for a new encounter in a session */
  nextSortOrder(sessionId: string): number;
}

export const useEncountersStore = create<EncountersState>((set, get) => ({
  encountersBySession: {},
  hasLoaded: false,

  async loadAllEncounters() {
    if (get().hasLoaded) return;
    const all = await encounterRepository.getAll();
    const grouped: Record<string, SessionEncounter[]> = {};
    for (const enc of all) {
      if (!grouped[enc.sessionId]) grouped[enc.sessionId] = [];
      grouped[enc.sessionId].push(enc);
    }
    // Each group is already sorted by sortOrder from the DB query
    set({ encountersBySession: grouped, hasLoaded: true });
  },

  async loadEncountersForSession(sessionId: string) {
    const encounters = await encounterRepository.getAllForSession(sessionId);
    set((state) => ({
      encountersBySession: {
        ...state.encountersBySession,
        [sessionId]: encounters,
      },
    }));
  },

  addEncounter(encounter: SessionEncounter) {
    set((state) => {
      const existing = state.encountersBySession[encounter.sessionId] ?? [];
      return {
        encountersBySession: {
          ...state.encountersBySession,
          [encounter.sessionId]: [...existing, encounter].sort(
            (a, b) => a.sortOrder - b.sortOrder,
          ),
        },
      };
    });
  },

  updateEncounter(encounter: SessionEncounter) {
    set((state) => {
      const existing = state.encountersBySession[encounter.sessionId] ?? [];
      return {
        encountersBySession: {
          ...state.encountersBySession,
          [encounter.sessionId]: existing
            .map((e) => (e.id === encounter.id ? encounter : e))
            .sort((a, b) => a.sortOrder - b.sortOrder),
        },
      };
    });
  },

  deleteEncounter(id: string, sessionId: string) {
    set((state) => ({
      encountersBySession: {
        ...state.encountersBySession,
        [sessionId]: (state.encountersBySession[sessionId] ?? []).filter(
          (e) => e.id !== id,
        ),
      },
    }));
  },

  deleteAllForSession(sessionId: string) {
    set((state) => {
      const next = { ...state.encountersBySession };
      delete next[sessionId];
      return { encountersBySession: next };
    });
  },

  deleteAllForCampaign(campaignId: string) {
    set((state) => {
      const next: Record<string, SessionEncounter[]> = {};
      for (const [sessionId, encs] of Object.entries(state.encountersBySession)) {
        const filtered = encs.filter((e) => e.campaignId !== campaignId);
        if (filtered.length > 0) next[sessionId] = filtered;
      }
      return { encountersBySession: next };
    });
  },

  getEncountersForSession(sessionId: string) {
    return get().encountersBySession[sessionId] ?? [];
  },

  nextSortOrder(sessionId: string) {
    const encs = get().encountersBySession[sessionId] ?? [];
    if (encs.length === 0) return 0;
    return Math.max(...encs.map((e) => e.sortOrder)) + 1;
  },
}));
