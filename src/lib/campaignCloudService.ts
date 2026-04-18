import { supabase } from './supabase';
import type { Campaign } from '../types/campaign';
import type { CampaignSession } from '../types/session';
import type { SessionEncounter } from '../types/encounter';
import { sessionRepository } from '../db/sessionRepository';
import { encounterRepository } from '../db/encounterRepository';

/** Bundled campaign data including sessions and encounters. */
export interface CampaignBundle {
  campaign: Campaign;
  sessions: CampaignSession[];
  encounters: SessionEncounter[];
}

/** Push a campaign + its sessions + encounters to Supabase cloud backup (upsert). */
export async function pushCampaignToCloud(campaign: Campaign, userId: string): Promise<void> {
  const sessions = await sessionRepository.getAllForCampaign(campaign.id);
  const encounters = await encounterRepository.getAllForCampaign(campaign.id);

  console.info(
    `[pushCampaignToCloud] "${campaign.name}" (id=${campaign.id}) — bundling ${sessions.length} session(s), ${encounters.length} encounter(s) from Dexie`,
  );

  const bundle: CampaignBundle = { campaign, sessions, encounters };

  const { error } = await supabase.from('user_campaigns').upsert(
    {
      id: campaign.id,
      user_id: userId,
      campaign_data: bundle,
      updated_at: new Date(campaign.updatedAt).toISOString(),
      deleted: false,
    },
    { onConflict: 'id' },
  );
  if (error) throw new Error(`Failed to push campaign to cloud: ${error.message}`);
}

/** Pull all non-deleted campaign bundles for the current user from Supabase. */
export async function pullAllCampaignsFromCloud(userId: string): Promise<CampaignBundle[]> {
  const { data, error } = await supabase
    .from('user_campaigns')
    .select('id, campaign_data, updated_at, deleted')
    .eq('user_id', userId)
    .eq('deleted', false);

  if (error) throw new Error(`Failed to pull campaigns from cloud: ${error.message}`);

  return (data ?? []).map((row) => {
    const raw = row.campaign_data as Record<string, unknown>;
    // Handle both old format (just Campaign) and new format (CampaignBundle)
    if (raw.campaign && raw.sessions && raw.encounters) {
      return {
        campaign: { ...(raw.campaign as Campaign), id: row.id },
        sessions: raw.sessions as CampaignSession[],
        encounters: raw.encounters as SessionEncounter[],
      };
    }
    // Legacy format: campaign_data IS the Campaign object directly
    return {
      campaign: { ...(raw as unknown as Campaign), id: row.id },
      sessions: [],
      encounters: [],
    };
  });
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
