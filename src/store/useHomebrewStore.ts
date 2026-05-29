import { create } from 'zustand';
import { homebrewRepository } from '../db/homebrewRepository';
import { db } from '../db/database';
import type { HomebrewItem, HomebrewContentType } from '../types/homebrew';
import { deleteCloudHomebrew } from '../lib/homebrewCloudService';
import { useAuthStore } from './useAuthStore';
import { setLocalHomebrew } from '../lib/homebrewRegistry';

// Local homebrew is registered into the merged data-layer registry through the
// homebrewRegistry singleton — which also holds campaign-shared homebrew. This
// indirection prevents the two sources from wiping each other out (each
// per-type register call REPLACES the homebrew section).
function syncToDataLayer(items: HomebrewItem[]) {
  setLocalHomebrew(items);
}

interface HomebrewState {
  items: HomebrewItem[];
  isLoading: boolean;
  hasLoaded: boolean;

  loadHomebrew: () => Promise<void>;
  addItem: (data: Omit<HomebrewItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<HomebrewItem>;
  updateItem: (item: HomebrewItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItemsByType: (contentType: HomebrewContentType) => HomebrewItem[];
  getItemsByCampaign: (campaignId: string) => HomebrewItem[];
  mergeCloudHomebrew: (cloudItems: HomebrewItem[]) => Promise<void>;
  importItems: (items: HomebrewItem[]) => Promise<void>;
}

export const useHomebrewStore = create<HomebrewState>((set, get) => ({
  items: [],
  isLoading: false,
  hasLoaded: false,

  loadHomebrew: async () => {
    if (get().hasLoaded) return;
    set({ isLoading: true });
    try {
      const items = await homebrewRepository.getAll();
      set({ items, isLoading: false, hasLoaded: true });
      syncToDataLayer(items);
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (data) => {
    const item = await homebrewRepository.create(data);
    const items = [item, ...get().items];
    set({ items });
    syncToDataLayer(items);
    return item;
  },

  updateItem: async (item) => {
    await homebrewRepository.update(item);
    const items = get().items.map((i) => (i.id === item.id ? { ...item, updatedAt: Date.now() } : i));
    set({ items });
    syncToDataLayer(items);
  },

  deleteItem: async (id) => {
    await homebrewRepository.delete(id);
    const items = get().items.filter((i) => i.id !== id);
    set({ items });
    syncToDataLayer(items);
    // Soft-delete in cloud (fire-and-forget)
    const user = useAuthStore.getState().user;
    if (user) {
      deleteCloudHomebrew(id, user.id).catch(() => { /* Offline — silent */ });
    }
  },

  getItemsByType: (contentType) => get().items.filter((i) => i.contentType === contentType),

  getItemsByCampaign: (campaignId) => get().items.filter((i) => i.campaignIds.includes(campaignId)),

  importItems: async (items) => {
    if (items.length === 0) return;
    await db.homebrew.bulkPut(items);
    const fresh = await homebrewRepository.getAll();
    set({ items: fresh });
    syncToDataLayer(fresh);
  },

  mergeCloudHomebrew: async (cloudItems) => {
    const localItems = await homebrewRepository.getAll();
    const localMap = new Map(localItems.map((i) => [i.id, i]));

    for (const cloudItem of cloudItems) {
      const local = localMap.get(cloudItem.id);
      if (!local) {
        // New from cloud — insert locally
        await db.homebrew.put(cloudItem);
      } else if (cloudItem.updatedAt > local.updatedAt) {
        // Cloud is newer — overwrite local
        await db.homebrew.put(cloudItem);
      }
      // else: local is newer or same — keep local (will push to cloud on next change)
    }

    // Reload from Dexie to pick up new/updated items
    const updated = await homebrewRepository.getAll();
    set({ items: updated });
    syncToDataLayer(updated);
  },
}));
