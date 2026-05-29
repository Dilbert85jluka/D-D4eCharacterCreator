import { supabase } from './supabase';
import type { HomebrewItem } from '../types/homebrew';
import { setCampaignHomebrew } from './homebrewRegistry';

/** Extract homebrew items linked to a specific campaign */
export function extractHomebrewContent(
  campaignId: string,
  allItems: HomebrewItem[]
): HomebrewItem[] {
  return allItems.filter((item) => item.campaignIds.includes(campaignId));
}

/** Push homebrew content to the shared_campaigns row in Supabase */
export async function pushHomebrewContent(
  sharedCampaignId: string,
  content: HomebrewItem[]
): Promise<void> {
  const { error } = await supabase
    .from('shared_campaigns')
    .update({ homebrew_content: content })
    .eq('id', sharedCampaignId);

  if (error) throw new Error(`Failed to push homebrew content: ${error.message}`);
}

/**
 * Register homebrew items received from a campaign into the merged data-layer registry.
 * Routes through `homebrewRegistry.setCampaignHomebrew` so this campaign's items merge
 * with the user's local items + every other joined campaign's items, instead of
 * overwriting them.
 */
export function registerCampaignHomebrew(sharedCampaignId: string, items: HomebrewItem[]): void {
  setCampaignHomebrew(sharedCampaignId, items);
}
