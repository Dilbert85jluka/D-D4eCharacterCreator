import { supabase } from './supabase';
import type { HomebrewItem } from '../types/homebrew';

/**
 * Push a homebrew item to Supabase cloud backup (upsert — create or update).
 * Stores the full HomebrewItem object as JSONB.
 */
export async function pushHomebrewToCloud(item: HomebrewItem, userId: string): Promise<void> {
  const { error } = await supabase.from('user_homebrew').upsert(
    {
      id: item.id,
      user_id: userId,
      homebrew_data: item,
      updated_at: new Date(item.updatedAt).toISOString(),
      deleted: false,
    },
    { onConflict: 'id' },
  );
  if (error) throw new Error(`Failed to push homebrew to cloud: ${error.message}`);
}

/**
 * Pull all non-deleted homebrew items for the current user from Supabase.
 */
export async function pullAllHomebrewFromCloud(userId: string): Promise<HomebrewItem[]> {
  const { data, error } = await supabase
    .from('user_homebrew')
    .select('id, homebrew_data, updated_at, deleted')
    .eq('user_id', userId)
    .eq('deleted', false);

  if (error) throw new Error(`Failed to pull homebrew from cloud: ${error.message}`);

  return (data ?? []).map((row) => ({
    ...(row.homebrew_data as HomebrewItem),
    id: row.id, // Ensure row-level ID takes precedence
  }));
}

/**
 * Soft-delete a homebrew item in the cloud (marks deleted=true).
 * Does not physically remove the row — allows undo in the future.
 */
export async function deleteCloudHomebrew(itemId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_homebrew')
    .update({ deleted: true, updated_at: new Date().toISOString() })
    .eq('id', itemId)
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to delete cloud homebrew: ${error.message}`);
}
