import { supabase } from './supabase';
import type { CampaignNPC, PublicNPC } from '../types/npc';
import { toPublicNPC } from '../types/npc';

/**
 * Build the player-safe view of NPCs for one campaign. Only NPCs with
 * `visibleToPlayers === true` are included, and `toPublicNPC` strips the
 * DM-only fields (`privateDescription`, `currentHp`, `maxHp`, `level`).
 */
export function extractPublicNpcs(allNpcs: CampaignNPC[]): PublicNPC[] {
  return allNpcs
    .filter((n) => n.visibleToPlayers)
    .map(toPublicNPC);
}

/**
 * Push the player-safe NPC list to the `npc_content` JSONB column on
 * `shared_campaigns`. Realtime UPDATE event delivers the change to every
 * connected player's `useRealtimeCampaign` subscription.
 *
 * Schema: ALTER TABLE shared_campaigns ADD COLUMN npc_content JSONB;
 */
export async function pushNpcContent(
  sharedCampaignId: string,
  content: PublicNPC[],
): Promise<void> {
  const { error } = await supabase
    .from('shared_campaigns')
    .update({ npc_content: content })
    .eq('id', sharedCampaignId);

  if (error) throw new Error(`Failed to push NPC content: ${error.message}`);
}
