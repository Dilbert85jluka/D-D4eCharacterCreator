import { supabase } from './supabase';
import type { Campaign } from '../types/campaign';

/** Push a campaign to Supabase cloud backup (upsert). */
export async function pushCampaignToCloud(campaign: Campaign, userId: string): Promise<void> {
  const { error } = await supabase.from('user_campaigns').upsert(
    {
      id: campaign.id,
      user_id: userId,
      campaign_data: campaign,
      updated_at: new Date(campaign.updatedAt).toISOString(),
      deleted: false,
    },
    { onConflict: 'id' },
  );
  if (error) throw new Error(`Failed to push campaign to cloud: ${error.message}`);
}

/** Pull all non-deleted campaigns for the current user from Supabase. */
export async function pullAllCampaignsFromCloud(userId: string): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('user_campaigns')
    .select('id, campaign_data, updated_at, deleted')
    .eq('user_id', userId)
    .eq('deleted', false);

  if (error) throw new Error(`Failed to pull campaigns from cloud: ${error.message}`);

  return (data ?? []).map((row) => ({
    ...(row.campaign_data as Campaign),
    id: row.id,
  }));
}

/** Soft-delete a campaign in the cloud. */
export async function deleteCloudCampaign(campaignId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_campaigns')
    .update({ deleted: true, updated_at: new Date().toISOString() })
    .eq('id', campaignId)
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to delete cloud campaign: ${error.message}`);
}
