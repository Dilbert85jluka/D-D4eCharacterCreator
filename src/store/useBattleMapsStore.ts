import { create } from 'zustand';
import { battleMapRepository, mapImageStore } from '../db/battleMapRepository';
import { processMapImage, validateMapFile } from '../lib/mapImageProcessing';
import { DEFAULT_GRID } from '../types/battlemap';
import type { BattleMap, GridConfig } from '../types/battlemap';

interface BattleMapsState {
  /** Keyed by campaignId. */
  mapsByCampaign: Record<string, BattleMap[]>;
  hasLoaded: boolean;

  loadAllMaps: () => Promise<void>;
  loadByCampaign: (campaignId: string) => Promise<void>;

  /** Process + store an image and create the map record. Throws with a
   *  user-presentable message on bad input. */
  importMap: (campaignId: string, file: File, name?: string) => Promise<BattleMap>;
  updateGrid: (id: string, campaignId: string, grid: GridConfig) => Promise<void>;
  renameMap: (id: string, campaignId: string, name: string) => Promise<void>;
  deleteMap: (id: string, campaignId: string) => Promise<void>;

  /** Merge maps pulled from the cloud campaign bundle — newer-wins per record,
   *  matching how sessions/encounters/NPCs merge. Image blobs are local-only and
   *  are never part of this; a device without the blob falls back to imageUrl. */
  mergeCloudMaps: (maps: BattleMap[]) => Promise<void>;
}

const byName = (list: BattleMap[]) => [...list].sort((a, b) => a.name.localeCompare(b.name));

export const useBattleMapsStore = create<BattleMapsState>((set, get) => ({
  mapsByCampaign: {},
  hasLoaded: false,

  loadAllMaps: async () => {
    if (get().hasLoaded) return;
    const { db } = await import('../db/database');
    const all = await db.maps.toArray();
    const grouped: Record<string, BattleMap[]> = {};
    for (const m of all) {
      if (m.deleted) continue;
      (grouped[m.campaignId] ??= []).push(m);
    }
    for (const cid of Object.keys(grouped)) grouped[cid] = byName(grouped[cid]);
    set({ mapsByCampaign: grouped, hasLoaded: true });
  },

  loadByCampaign: async (campaignId) => {
    const list = await battleMapRepository.getByCampaignId(campaignId);
    set((s) => ({ mapsByCampaign: { ...s.mapsByCampaign, [campaignId]: byName(list) } }));
  },

  importMap: async (campaignId, file, name) => {
    const invalid = validateMapFile(file);
    if (invalid) throw new Error(invalid);

    const { blob, width, height } = await processMapImage(file);
    const imageKey = await mapImageStore.put(blob);

    const map = await battleMapRepository.create({
      campaignId,
      name: name?.trim() || stripExtension(file.name),
      imageKey,
      imageUrl: null,
      width,
      height,
      // A fresh map is uncalibrated. DEFAULT_GRID is a starting guess, not a claim
      // about this image — the DM aligns it via GridCalibrator.
      grid: { ...DEFAULT_GRID },
    });

    set((s) => {
      const existing = s.mapsByCampaign[campaignId] ?? [];
      return { mapsByCampaign: { ...s.mapsByCampaign, [campaignId]: byName([...existing, map]) } };
    });
    return map;
  },

  updateGrid: async (id, campaignId, grid) => {
    await battleMapRepository.patch(id, { grid });
    set((s) => patchLocal(s, campaignId, id, { grid }));
  },

  renameMap: async (id, campaignId, name) => {
    await battleMapRepository.patch(id, { name });
    set((s) => patchLocal(s, campaignId, id, { name }));
  },

  deleteMap: async (id, campaignId) => {
    await battleMapRepository.delete(id);
    set((s) => ({
      mapsByCampaign: {
        ...s.mapsByCampaign,
        [campaignId]: (s.mapsByCampaign[campaignId] ?? []).filter((m) => m.id !== id),
      },
    }));
  },

  mergeCloudMaps: async (maps) => {
    const { db } = await import('../db/database');
    const touched = new Set<string>();
    let written = 0;

    for (const cloud of maps) {
      const local = await db.maps.get(cloud.id);
      if (local && local.updatedAt >= cloud.updatedAt) continue;
      // Keep this device's local imageKey if the cloud record doesn't carry one —
      // the blob is local and losing the pointer would strand it.
      const merged: BattleMap = { ...cloud, imageKey: cloud.imageKey ?? local?.imageKey };
      await db.maps.put(merged);
      touched.add(cloud.campaignId);
      written++;
    }

    if (written > 0) {
      console.info(`[mergeCloudMaps] Wrote ${written} map(s) from cloud`);
      for (const cid of touched) await get().loadByCampaign(cid);
    }
  },
}));

function patchLocal(
  s: BattleMapsState,
  campaignId: string,
  id: string,
  changes: Partial<BattleMap>,
): Partial<BattleMapsState> {
  const existing = s.mapsByCampaign[campaignId] ?? [];
  const next = existing.map((m) =>
    m.id === id ? { ...m, ...changes, updatedAt: Date.now() } : m,
  );
  return { mapsByCampaign: { ...s.mapsByCampaign, [campaignId]: byName(next) } };
}

function stripExtension(filename: string): string {
  return filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Untitled map';
}
