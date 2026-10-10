import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import type { HomebrewItem, HomebrewContentType } from '../types/homebrew';

type NewHomebrewData = Omit<HomebrewItem, 'id' | 'createdAt' | 'updatedAt'>;

export const homebrewRepository = {
  async getAll(): Promise<HomebrewItem[]> {
    return db.homebrew.orderBy('updatedAt').reverse().toArray();
  },

  async getByContentType(contentType: HomebrewContentType): Promise<HomebrewItem[]> {
    return db.homebrew.where('contentType').equals(contentType).toArray();
  },

  async getByCampaignId(campaignId: string): Promise<HomebrewItem[]> {
    return db.homebrew.where('campaignIds').equals(campaignId).toArray();
  },

  async getById(id: string): Promise<HomebrewItem | undefined> {
    return db.homebrew.get(id);
  },

  async create(data: NewHomebrewData): Promise<HomebrewItem> {
    const now = Date.now();
    const id = `homebrew-${uuidv4()}`;
    // Every content type's `data` payload carries its own `id`, which has to match
    // the HomebrewItem id because the data layer resolves items by it. Stamping it
    // here makes creation a SINGLE write. The editors used to insert with `id: ''`
    // and then immediately update to fill it in, so a failure on that second write
    // left a persisted item whose data.id was the empty string — unreachable by
    // every `find(x => x.id === …)` lookup in the app.
    const item: HomebrewItem = {
      ...data,
      data: { ...data.data, id } as HomebrewItem['data'],
      id,
      createdAt: now,
      updatedAt: now,
    };
    await db.homebrew.add(item);
    return item;
  },

  async update(item: HomebrewItem): Promise<void> {
    await db.homebrew.put({
      ...item,
      updatedAt: Date.now(),
    });
  },

  async patch(id: string, changes: Partial<HomebrewItem>): Promise<void> {
    await db.homebrew.update(id, { ...changes, updatedAt: Date.now() });
  },

  async delete(id: string): Promise<void> {
    await db.homebrew.delete(id);
  },
};
