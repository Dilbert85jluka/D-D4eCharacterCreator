import { create } from 'zustand';
import { characterRepository } from '../db/characterRepository';
import { useAuthStore } from './useAuthStore';
import { deleteCloudCharacter } from '../lib/characterCloudService';
import type { Character } from '../types/character';

interface CharactersState {
  characters: Character[];
  isLoading: boolean;
  hasLoaded: boolean;   // true once the first DB load has completed
  error: string | null;

  loadCharacters: () => Promise<void>;
  addCharacter: (char: Character) => void;
  updateCharacter: (char: Character) => void;
  deleteCharacter: (id: string) => Promise<void>;
  getCharacterById: (id: string) => Character | undefined;
  mergeCloudCharacters: (cloudChars: Character[]) => Promise<void>;
}

export const useCharactersStore = create<CharactersState>((set, get) => ({
  characters: [],
  isLoading: false,
  hasLoaded: false,
  error: null,

  loadCharacters: async () => {
    set({ isLoading: true, error: null });
    try {
      const characters = await characterRepository.getAll();
      set({ characters, isLoading: false, hasLoaded: true });
    } catch (e) {
      set({ error: String(e), isLoading: false, hasLoaded: true });
    }
  },

  addCharacter: (char) => {
    set((s) => ({ characters: [char, ...s.characters] }));
  },

  updateCharacter: (char) => {
    set((s) => ({
      characters: s.characters.map((c) => (c.id === char.id ? char : c)),
    }));
  },

  deleteCharacter: async (id) => {
    await characterRepository.delete(id);
    set((s) => ({ characters: s.characters.filter((c) => c.id !== id) }));
    // Cloud soft-delete (fire and forget)
    const user = useAuthStore.getState().user;
    if (user) deleteCloudCharacter(id, user.id).catch(() => {});
  },

  getCharacterById: (id) => {
    return get().characters.find((c) => c.id === id);
  },

  mergeCloudCharacters: async (cloudChars) => {
    const localChars = await characterRepository.getAll();
    const localMap = new Map(localChars.map((c) => [c.id, c]));

    for (const cloudChar of cloudChars) {
      const local = localMap.get(cloudChar.id);
      if (!local) {
        // New from cloud — insert locally
        await characterRepository.upsertFromCloud(cloudChar);
      } else if (cloudChar.updatedAt > local.updatedAt) {
        // Cloud is newer — overwrite local
        await characterRepository.upsertFromCloud(cloudChar);
      }
      // else: local is newer or same — keep local (will push to cloud on next change)
    }

    // Reload from Dexie to pick up new/updated characters
    const updated = await characterRepository.getAll();
    set({ characters: updated });
  },
}));
