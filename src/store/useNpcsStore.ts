import { create } from 'zustand';
import { npcRepository } from '../db/npcRepository';
import type { CampaignNPC } from '../types/npc';

interface NpcsState {
  /** Keyed by campaignId — each value is the alphabetically-sorted NPC list for that campaign. */
  npcsByCampaign: Record<string, CampaignNPC[]>;
  hasLoaded: boolean;

  loadAllNpcs: () => Promise<void>;
  loadByCampaign: (campaignId: string) => Promise<void>;

  createNpc: (data: Omit<CampaignNPC, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CampaignNPC>;
  updateNpc: (npc: CampaignNPC) => Promise<void>;
  deleteNpc: (id: string, campaignId: string) => Promise<void>;
  /** Toggle visibleToPlayers without rewriting the whole record. */
  setVisibility: (id: string, campaignId: string, visible: boolean) => Promise<void>;
}

function sortAndIndex(list: CampaignNPC[]): CampaignNPC[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

export const useNpcsStore = create<NpcsState>((set, get) => ({
  npcsByCampaign: {},
  hasLoaded: false,

  loadAllNpcs: async () => {
    if (get().hasLoaded) return;
    const all = await npcRepository.getAll();
    const grouped: Record<string, CampaignNPC[]> = {};
    for (const npc of all) {
      (grouped[npc.campaignId] ??= []).push(npc);
    }
    // Sort each campaign's list alphabetically
    for (const cid of Object.keys(grouped)) {
      grouped[cid] = sortAndIndex(grouped[cid]);
    }
    set({ npcsByCampaign: grouped, hasLoaded: true });
  },

  loadByCampaign: async (campaignId) => {
    const list = await npcRepository.getByCampaignId(campaignId);
    set((s) => ({
      npcsByCampaign: { ...s.npcsByCampaign, [campaignId]: sortAndIndex(list) },
    }));
  },

  createNpc: async (data) => {
    const npc = await npcRepository.create(data);
    set((s) => {
      const existing = s.npcsByCampaign[npc.campaignId] ?? [];
      return {
        npcsByCampaign: {
          ...s.npcsByCampaign,
          [npc.campaignId]: sortAndIndex([...existing, npc]),
        },
      };
    });
    return npc;
  },

  updateNpc: async (npc) => {
    await npcRepository.update(npc);
    set((s) => {
      const existing = s.npcsByCampaign[npc.campaignId] ?? [];
      const next = existing.map((n) => (n.id === npc.id ? { ...npc, updatedAt: Date.now() } : n));
      return {
        npcsByCampaign: { ...s.npcsByCampaign, [npc.campaignId]: sortAndIndex(next) },
      };
    });
  },

  deleteNpc: async (id, campaignId) => {
    await npcRepository.delete(id);
    set((s) => {
      const existing = s.npcsByCampaign[campaignId] ?? [];
      return {
        npcsByCampaign: { ...s.npcsByCampaign, [campaignId]: existing.filter((n) => n.id !== id) },
      };
    });
  },

  setVisibility: async (id, campaignId, visible) => {
    await npcRepository.patch(id, { visibleToPlayers: visible });
    set((s) => {
      const existing = s.npcsByCampaign[campaignId] ?? [];
      const next = existing.map((n) =>
        n.id === id ? { ...n, visibleToPlayers: visible, updatedAt: Date.now() } : n,
      );
      return {
        npcsByCampaign: { ...s.npcsByCampaign, [campaignId]: next },
      };
    });
  },
}));
