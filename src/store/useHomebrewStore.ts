import { create } from 'zustand';
import { homebrewRepository } from '../db/homebrewRepository';
import { db } from '../db/database';
import type { HomebrewItem, HomebrewContentType } from '../types/homebrew';
import { deleteCloudHomebrew } from '../lib/homebrewCloudService';
import { useAuthStore } from './useAuthStore';
import type { RaceData, ClassData, PowerData, FeatData, WeaponData, ArmorData, GearData, MagicItemData, MagicArmorData, MagicWeaponData, MagicImplementData, ConsumableData } from '../types/gameData';
import { registerHomebrewRaces, unregisterHomebrewRaces } from '../data/races';
import { registerHomebrewClasses, unregisterHomebrewClasses } from '../data/classes';
import { registerHomebrewPowers, unregisterHomebrewPowers } from '../data/powers';
import { registerHomebrewFeats, unregisterHomebrewFeats } from '../data/feats';
import {
  registerHomebrewWeapons, unregisterHomebrewWeapons,
  registerHomebrewArmor, unregisterHomebrewArmor,
  registerHomebrewGear, unregisterHomebrewGear,
  registerHomebrewConsumables, unregisterHomebrewConsumables,
  registerHomebrewMagicItems, unregisterHomebrewMagicItems,
  registerHomebrewMagicArmor, unregisterHomebrewMagicArmor,
  registerHomebrewMagicWeapons, unregisterHomebrewMagicWeapons,
  registerHomebrewMagicImplements, unregisterHomebrewMagicImplements,
} from '../data/equipment';

function syncToDataLayer(items: HomebrewItem[]) {
  // Group items by contentType and register them into the static data arrays
  const races = items.filter((i) => i.contentType === 'race').map((i) => i.data as RaceData);
  const classes = items.filter((i) => i.contentType === 'class').map((i) => i.data as ClassData);
  const powers = items.filter((i) => i.contentType === 'power').map((i) => i.data as PowerData);
  const feats = items.filter((i) => i.contentType === 'feat').map((i) => i.data as FeatData);
  const weapons = items.filter((i) => i.contentType === 'weapon').map((i) => i.data as WeaponData);
  const armor = items.filter((i) => i.contentType === 'armor').map((i) => i.data as ArmorData);
  const gear = items.filter((i) => i.contentType === 'gear').map((i) => i.data as GearData);
  const consumables = items.filter((i) => i.contentType === 'consumable').map((i) => i.data as ConsumableData);
  const magicItems = items.filter((i) => i.contentType === 'magicItem').map((i) => i.data as MagicItemData);
  const magicArmor = items.filter((i) => i.contentType === 'magicArmor').map((i) => i.data as MagicArmorData);
  const magicWeapons = items.filter((i) => i.contentType === 'magicWeapon').map((i) => i.data as MagicWeaponData);
  const magicImplements = items.filter((i) => i.contentType === 'magicImplement').map((i) => i.data as MagicImplementData);

  if (races.length) registerHomebrewRaces(races); else unregisterHomebrewRaces();
  if (classes.length) registerHomebrewClasses(classes); else unregisterHomebrewClasses();
  if (powers.length) registerHomebrewPowers(powers); else unregisterHomebrewPowers();
  if (feats.length) registerHomebrewFeats(feats); else unregisterHomebrewFeats();
  if (weapons.length) registerHomebrewWeapons(weapons); else unregisterHomebrewWeapons();
  if (armor.length) registerHomebrewArmor(armor); else unregisterHomebrewArmor();
  if (gear.length) registerHomebrewGear(gear); else unregisterHomebrewGear();
  if (consumables.length) registerHomebrewConsumables(consumables); else unregisterHomebrewConsumables();
  if (magicItems.length) registerHomebrewMagicItems(magicItems); else unregisterHomebrewMagicItems();
  if (magicArmor.length) registerHomebrewMagicArmor(magicArmor); else unregisterHomebrewMagicArmor();
  if (magicWeapons.length) registerHomebrewMagicWeapons(magicWeapons); else unregisterHomebrewMagicWeapons();
  if (magicImplements.length) registerHomebrewMagicImplements(magicImplements); else unregisterHomebrewMagicImplements();
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
