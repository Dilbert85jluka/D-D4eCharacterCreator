import { create } from 'zustand';
import { campaignRepository } from '../db/campaignRepository';
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
  },

  getCampaignById: (id) => get().campaigns.find((c) => c.id === id),
}));
