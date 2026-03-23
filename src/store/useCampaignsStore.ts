import { create } from 'zustand';
import { campaignRepository } from '../db/campaignRepository';
import { useAuthStore } from './useAuthStore';
import { deleteCloudCampaign } from '../lib/campaignCloudService';
import { sessionRepository } from '../db/sessionRepository';
import { encounterRepository } from '../db/encounterRepository';
import { useEncountersStore } from './useEncountersStore';
import type { Campaign } from '../types/campaign';

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
  mergeCloudCampaigns: (cloudCampaigns: Campaign[]) => Promise<void>;
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

  mergeCloudCampaigns: async (cloudCampaigns) => {
    const localCampaigns = await campaignRepository.getAll();
    const localMap = new Map(localCampaigns.map((c) => [c.id, c]));

    for (const cloudCampaign of cloudCampaigns) {
      const local = localMap.get(cloudCampaign.id);
      if (!local) {
        await campaignRepository.upsertFromCloud(cloudCampaign);
      } else if (cloudCampaign.updatedAt > local.updatedAt) {
        await campaignRepository.upsertFromCloud(cloudCampaign);
      }
    }

    const updated = await campaignRepository.getAll();
    set({ campaigns: updated });
  },
}));
