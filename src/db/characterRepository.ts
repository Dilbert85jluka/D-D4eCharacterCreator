import { v4 as uuidv4 } from 'uuid';
import { db } from './database';
import type { Character } from '../types/character';

type NewCharacterData = Omit<Character, 'id' | 'createdAt' | 'updatedAt'>;

export const characterRepository = {
  async getAll(): Promise<Character[]> {
    return db.characters.orderBy('updatedAt').reverse().toArray();
  },

  async getById(id: string): Promise<Character | undefined> {
    return db.characters.get(id);
  },

  async create(data: NewCharacterData): Promise<Character> {
    const now = Date.now();
    const character: Character = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    await db.characters.add(character);
    return character;
  },

  async update(character: Character): Promise<void> {
    await db.characters.put({
      ...character,
      updatedAt: Date.now(),
    });
  },

  async patch(id: string, changes: Partial<Character>): Promise<void> {
    await db.characters.update(id, { ...changes, updatedAt: Date.now() });
  },

  async delete(id: string): Promise<void> {
    await db.characters.delete(id);
  },
};
