import { create } from 'zustand';
import { campaignRepository } from '../db/campaignRepository';
import { useAuthStore } from './useAuthStore';
import { deleteCloudCampaign } from '../lib/campaignCloudService';
import type { CampaignBundle } from '../lib/campaignCloudService';
import { sessionRepository } from '../db/sessionRepository';
import { encounterRepository } from '../db/encounterRepository';
import { useEncountersStore } from './useEncountersStore';
import { useSessionsStore } from './useSessionsStore';
import type { Campaign } from '../types/campaign';
import { db } from '../db/database';

interface CampaignsState {
  campaigns: Campaign[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;

  loadCampaigns: () => Promise<void>;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => Promise<void>;
  getCampaignById: (id: string) => Campaign | undefined;
  mergeCloudCampaigns: (cloudBundles: CampaignBundle[]) => Promise<void>;
}

export const useCampaignsStore = create<CampaignsState>((set, get) => ({
  campaigns: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  loadCampaigns: async () => {
    if (get().hasLoaded) return;
    set({ isLoading: true, error: null });
    try {
      const campaigns = await campaignRepository.getAll();
      set({ campaigns, isLoading: false, hasLoaded: true });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  addCampaign: (campaign) =>
    set((s) => ({ campaigns: [campaign, ...s.campaigns] })),

  updateCampaign: (campaign) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) => (c.id === campaign.id ? campaign : c)),
    })),

  deleteCampaign: async (id) => {
    // Cascade-delete all encounters and sessions belonging to this campaign
    await encounterRepository.deleteAllForCampaign(id);
    useEncountersStore.getState().deleteAllForCampaign(id);
    await sessionRepository.deleteAllForCampaign(id);
    await campaignRepository.delete(id);
    set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) }));
    // Cloud soft-delete (fire and forget)
    const user = useAuthStore.getState().user;
    if (user) deleteCloudCampaign(id, user.id).catch(() => {});
  },

  getCampaignById: (id) => get().campaigns.find((c) => c.id === id),

  mergeCloudCampaigns: async (cloudBundles) => {
    const localCampaigns = await campaignRepository.getAll();
    const localMap = new Map(localCampaigns.map((c) => [c.id, c]));

    // Load local sessions + encounters once so we can merge per-record.
    // Per-record merge is important: a campaign's updatedAt only changes when its OWN fields
    // change (name/notes/description). Editing a nested session or encounter does not bump
    // the parent campaign's timestamp, so comparing only at the campaign level would drop
    // incoming session/encounter updates.
    const allLocalSessions = await db.sessions.toArray();
    const localSessionMap = new Map(allLocalSessions.map((s) => [s.id, s]));
    const allLocalEncounters = await db.encounters.toArray();
    const localEncounterMap = new Map(allLocalEncounters.map((e) => [e.id, e]));

    for (const bundle of cloudBundles) {
      const { campaign: cloudCampaign, sessions, encounters } = bundle;
      const local = localMap.get(cloudCampaign.id);

      // Campaign: newer-wins by updatedAt
      if (!local || cloudCampaign.updatedAt > local.updatedAt) {
        await campaignRepository.upsertFromCloud(cloudCampaign);
      }

      // Sessions: per-record newer-wins
      for (const session of sessions) {
        const localSession = localSessionMap.get(session.id);
        if (!localSession || session.updatedAt > localSession.updatedAt) {
          await db.sessions.put(session);
        }
      }

      // Encounters: per-record newer-wins
      for (const encounter of encounters) {
        const localEncounter = localEncounterMap.get(encounter.id);
        if (!localEncounter || encounter.updatedAt > localEncounter.updatedAt) {
          await db.encounters.put(encounter);
        }
      }
    }

    // Reload all stores to pick up merged data
    const updated = await campaignRepository.getAll();
    set({ campaigns: updated });

    // Force-reload sessions and encounters stores to pick up merged data
    // Sessions store has no guard, encounters store does — reset it
    await useSessionsStore.getState().loadAllSessions();
    useEncountersStore.setState({ hasLoaded: false });
    await useEncountersStore.getState().loadAllEncounters();
  },
}));
