import { create } from 'zustand';
import type { SharedCampaign, CampaignMember, CharacterSummary, Profile } from '../types/sharing';
// SharedCampaign is used in state + updateSharedCampaign action
import * as sharing from '../lib/sharingService';

interface SharingState {
  sharedCampaigns: SharedCampaign[];
  isLoading: boolean;

  // Active campaign detail view state
  activeCampaignId: string | null;
  activeCampaignMembers: (CampaignMember & { profile: Profile })[];
  activeCampaignSummaries: CharacterSummary[];

  // Actions
  loadSharedCampaigns: (userId: string) => Promise<void>;
  createCampaign: (name: string, description: string, userId: string) => Promise<SharedCampaign>;
  joinWithCode: (code: string, userId: string) => Promise<{ success: boolean; campaignName?: string; error?: string }>;
  loadCampaignDetail: (campaignId: string) => Promise<void>;
  linkCharacter: (summary: Omit<CharacterSummary, 'updated_at'>) => Promise<void>;
  unlinkCharacter: (characterId: string, campaignId: string) => Promise<void>;
  leaveCampaign: (campaignId: string, userId: string) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;

  // Realtime update handlers
  addMember: (member: CampaignMember & { profile: Profile }) => void;
  removeMember: (memberId: string) => void;
  upsertSummary: (summary: CharacterSummary) => void;
  removeSummary: (summaryId: string) => void;
  updateSharedCampaign: (campaign: SharedCampaign) => void;
}

export const useSharingStore = create<SharingState>((set, get) => ({
  sharedCampaigns: [],
  isLoading: false,
  activeCampaignId: null,
  activeCampaignMembers: [],
  activeCampaignSummaries: [],

  loadSharedCampaigns: async (userId: string) => {
    set({ isLoading: true });
    try {
      const campaigns = await sharing.getMySharedCampaigns(userId);
      set({ sharedCampaigns: campaigns });
    } finally {
      set({ isLoading: false });
    }
  },

  createCampaign: async (name: string, description: string, userId: string) => {
    const campaign = await sharing.createSharedCampaign(name, description, userId);
    set((state) => ({
      sharedCampaigns: [campaign, ...state.sharedCampaigns],
    }));
    return campaign;
  },

  joinWithCode: async (code: string, userId: string) => {
    try {
      const result = await sharing.lookupCampaignByInviteCode(code);
      if (!result) {
        return { success: false, error: 'Invalid invite code' };
      }

      await sharing.joinCampaign(result.id, userId);
      await get().loadSharedCampaigns(userId);

      return { success: true, campaignName: result.name };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to join campaign';
      return { success: false, error: message };
    }
  },

  loadCampaignDetail: async (campaignId: string) => {
    set({ isLoading: true, activeCampaignId: campaignId });
    try {
      const [members, summaries] = await Promise.all([
        sharing.getCampaignMembers(campaignId),
        sharing.getCampaignSummaries(campaignId),
      ]);
      set({
        activeCampaignMembers: members,
        activeCampaignSummaries: summaries,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  linkCharacter: async (summary: Omit<CharacterSummary, 'updated_at'>) => {
    await sharing.upsertCharacterSummary(summary);
    const { activeCampaignId } = get();
    if (activeCampaignId && summary.campaign_id === activeCampaignId) {
      await get().loadCampaignDetail(activeCampaignId);
    }
  },

  unlinkCharacter: async (characterId: string, campaignId: string) => {
    await sharing.removeCharacterFromCampaign(characterId, campaignId);
    set((state) => ({
      activeCampaignSummaries: state.activeCampaignSummaries.filter(
        (s) => !(s.id === characterId && s.campaign_id === campaignId)
      ),
    }));
  },

  leaveCampaign: async (campaignId: string, userId: string) => {
    await sharing.leaveCampaign(campaignId, userId);
    set((state) => ({
      sharedCampaigns: state.sharedCampaigns.filter((c) => c.id !== campaignId),
      activeCampaignId: state.activeCampaignId === campaignId ? null : state.activeCampaignId,
      activeCampaignMembers: state.activeCampaignId === campaignId ? [] : state.activeCampaignMembers,
      activeCampaignSummaries: state.activeCampaignId === campaignId ? [] : state.activeCampaignSummaries,
    }));
  },

  deleteCampaign: async (campaignId: string) => {
    await sharing.deleteSharedCampaign(campaignId);
    set((state) => ({
      sharedCampaigns: state.sharedCampaigns.filter((c) => c.id !== campaignId),
      activeCampaignId: state.activeCampaignId === campaignId ? null : state.activeCampaignId,
      activeCampaignMembers: state.activeCampaignId === campaignId ? [] : state.activeCampaignMembers,
      activeCampaignSummaries: state.activeCampaignId === campaignId ? [] : state.activeCampaignSummaries,
    }));
  },

  // Realtime update handlers — called from subscription hooks
  addMember: (member) => {
    set((state) => ({
      activeCampaignMembers: [...state.activeCampaignMembers, member],
    }));
  },

  removeMember: (memberId: string) => {
    set((state) => ({
      activeCampaignMembers: state.activeCampaignMembers.filter((m) => m.id !== memberId),
    }));
  },

  upsertSummary: (summary: CharacterSummary) => {
    set((state) => {
      const existing = state.activeCampaignSummaries.findIndex((s) => s.id === summary.id);
      if (existing >= 0) {
        const updated = [...state.activeCampaignSummaries];
        updated[existing] = summary;
        return { activeCampaignSummaries: updated };
      }
      return { activeCampaignSummaries: [...state.activeCampaignSummaries, summary] };
    });
  },

  removeSummary: (summaryId: string) => {
    set((state) => ({
      activeCampaignSummaries: state.activeCampaignSummaries.filter((s) => s.id !== summaryId),
    }));
  },

  updateSharedCampaign: (campaign: SharedCampaign) => {
    set((state) => ({
      sharedCampaigns: state.sharedCampaigns.map((sc) =>
        sc.id === campaign.id ? campaign : sc
      ),
    }));
  },
}));
