import { create } from 'zustand';
import { sessionRepository } from '../db/sessionRepository';
import { encounterRepository } from '../db/encounterRepository';
import { useEncountersStore } from './useEncountersStore';
import type { CampaignSession } from '../types/session';

interface SessionsState {
  /** All sessions, keyed by campaignId for fast lookup */
  sessionsByCampaign: Record<string, CampaignSession[]>;
  hasLoaded: boolean;

  loadAllSessions: () => Promise<void>;
  loadSessionsForCampaign: (campaignId: string) => Promise<void>;
  addSession: (session: CampaignSession) => void;
  updateSession: (session: CampaignSession) => void;
  deleteSession: (id: string, campaignId: string) => Promise<void>;
  deleteAllForCampaign: (campaignId: string) => Promise<void>;
  getSessionsForCampaign: (campaignId: string) => CampaignSession[];
  nextSessionNumber: (campaignId: string) => number;
}

export const useSessionsStore = create<SessionsState>((set, get) => ({
  sessionsByCampaign: {},
  hasLoaded: false,

  loadAllSessions: async () => {
    const all = await sessionRepository.getAll();
    const grouped: Record<string, CampaignSession[]> = {};
    for (const s of all) {
      if (!grouped[s.campaignId]) grouped[s.campaignId] = [];
      grouped[s.campaignId].push(s);
    }
    // Sort each group ascending by sessionNumber
    for (const key of Object.keys(grouped)) {
      grouped[key].sort((a, b) => a.sessionNumber - b.sessionNumber);
    }
    set({ sessionsByCampaign: grouped, hasLoaded: true });
  },

  loadSessionsForCampaign: async (campaignId) => {
    const sessions = await sessionRepository.getAllForCampaign(campaignId);
    set((s) => ({
      sessionsByCampaign: {
        ...s.sessionsByCampaign,
        [campaignId]: sessions,
      },
    }));
  },

  addSession: (session) =>
    set((s) => {
      const existing = s.sessionsByCampaign[session.campaignId] ?? [];
      const updated = [...existing, session].sort((a, b) => a.sessionNumber - b.sessionNumber);
      return { sessionsByCampaign: { ...s.sessionsByCampaign, [session.campaignId]: updated } };
    }),

  updateSession: (session) =>
    set((s) => {
      const existing = s.sessionsByCampaign[session.campaignId] ?? [];
      const updated = existing
        .map((sess) => (sess.id === session.id ? session : sess))
        .sort((a, b) => a.sessionNumber - b.sessionNumber);
      return { sessionsByCampaign: { ...s.sessionsByCampaign, [session.campaignId]: updated } };
    }),

  deleteSession: async (id, campaignId) => {
    // Cascade-delete all encounters for this session first
    await encounterRepository.deleteAllForSession(id);
    useEncountersStore.getState().deleteAllForSession(id);
    await sessionRepository.delete(id);
    set((s) => {
      const existing = s.sessionsByCampaign[campaignId] ?? [];
      return {
        sessionsByCampaign: {
          ...s.sessionsByCampaign,
          [campaignId]: existing.filter((sess) => sess.id !== id),
        },
      };
    });
  },

  deleteAllForCampaign: async (campaignId) => {
    await sessionRepository.deleteAllForCampaign(campaignId);
    set((s) => {
      const next = { ...s.sessionsByCampaign };
      delete next[campaignId];
      return { sessionsByCampaign: next };
    });
  },

  getSessionsForCampaign: (campaignId) =>
    get().sessionsByCampaign[campaignId] ?? [],

  nextSessionNumber: (campaignId) => {
    const sessions = get().sessionsByCampaign[campaignId] ?? [];
    if (sessions.length === 0) return 0;
    return Math.max(...sessions.map((s) => s.sessionNumber)) + 1;
  },
}));
