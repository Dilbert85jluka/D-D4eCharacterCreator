import { create } from 'zustand';
import { characterRepository } from '../db/characterRepository';
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
  },

  getCharacterById: (id) => {
    return get().characters.find((c) => c.id === id);
  },
}));
