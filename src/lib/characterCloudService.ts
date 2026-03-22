import { supabase } from './supabase';
import type { Character } from '../types/character';

/**
 * Push a character to Supabase cloud backup (upsert — create or update).
 * Stores the full Character object as JSONB.
 */
export async function pushCharacterToCloud(character: Character, userId: string): Promise<void> {
  const { error } = await supabase.from('user_characters').upsert(
    {
      id: character.id,
      user_id: userId,
      character_data: character,
      updated_at: new Date(character.updatedAt).toISOString(),
      deleted: false,
    },
    { onConflict: 'id' },
  );
  if (error) throw new Error(`Failed to push character to cloud: ${error.message}`);
}

/**
 * Pull all non-deleted characters for the current user from Supabase.
 */
export async function pullAllCharactersFromCloud(userId: string): Promise<Character[]> {
  const { data, error } = await supabase
    .from('user_characters')
    .select('id, character_data, updated_at, deleted')
    .eq('user_id', userId)
    .eq('deleted', false);

  if (error) throw new Error(`Failed to pull characters from cloud: ${error.message}`);

  return (data ?? []).map((row) => ({
    ...(row.character_data as Character),
    id: row.id, // Ensure row-level ID takes precedence
  }));
}

/**
 * Soft-delete a character in the cloud (marks deleted=true).
 * Does not physically remove the row — allows undo in the future.
 */
export async function deleteCloudCharacter(characterId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_characters')
    .update({ deleted: true, updated_at: new Date().toISOString() })
    .eq('id', characterId)
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to delete cloud character: ${error.message}`);
}
