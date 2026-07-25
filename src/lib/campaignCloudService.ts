import { supabase } from './supabase';
import type { Campaign } from '../types/campaign';
import type { CampaignSession } from '../types/session';
import type { SessionEncounter } from '../types/encounter';
import type { CampaignNPC } from '../types/npc';
import { sessionRepository } from '../db/sessionRepository';
import { encounterRepository } from '../db/encounterRepository';
import { npcRepository } from '../db/npcRepository';

/** Bundled campaign data including sessions, encounters, and NPCs. */
export interface CampaignBundle {
  campaign: Campaign;
  sessions: CampaignSession[];
  encounters: SessionEncounter[];
  /** Full NPC records (including privateDescription) — this is the DM's own
   *  private cross-device backup, unlike the player-facing npc_content push. */
  npcs: CampaignNPC[];
}

/** Push a campaign + its sessions + encounters + NPCs to Supabase cloud backup (upsert).
 *  Tombstones (deleted: true) ARE included in the bundle — that's how deletions
 *  propagate to the DM's other devices via the per-record newer-wins merge.
 *
 *  Resurrection guard: if the cloud row is soft-deleted (campaign deleted on
 *  another device) AND that deletion is newer than every piece of local activity
 *  in this campaign, the push is skipped — otherwise upserting `deleted: false`
 *  would silently resurrect a campaign the DM already deleted. If local activity
 *  is newer than the deletion, the push proceeds and deliberately resurrects
 *  (last-write-wins). Returns 'skipped-deleted' when the guard fires. */
export async function pushCampaignToCloud(
  campaign: Campaign,
  userId: string,
): Promise<'pushed' | 'skipped-deleted'> {
  const sessions = await sessionRepository.getAllForCampaignIncludingDeleted(campaign.id);
  const encounters = await encounterRepository.getAllForCampaignIncludingDeleted(campaign.id);
  const npcs = await npcRepository.getByCampaignIdIncludingDeleted(campaign.id);

  // Latest local activity across the whole bundle — campaign fields alone aren't
  // enough because session/encounter/NPC edits don't bump campaign.updatedAt.
  const maxLocalActivity = Math.max(
    campaign.updatedAt,
    ...sessions.map((s) => s.updatedAt),
    ...encounters.map((e) => e.updatedAt),
    ...npcs.map((n) => n.updatedAt),
  );

  const { data: existingRow, error: checkError } = await supabase
    .from('user_campaigns')
    .select('deleted, updated_at')
    .eq('id', campaign.id)
    .eq('user_id', userId)
    .maybeSingle();
  if (checkError) {
    // Transient check failure — proceed with the upsert (previous behavior);
    // if the network is really down the upsert fails and the caller logs it.
    console.warn('[pushCampaignToCloud] Pre-push deleted-check failed, proceeding:', checkError.message);
  } else if (existingRow?.deleted) {
    const deletedAt = new Date(existingRow.updated_at).getTime();
    if (deletedAt >= maxLocalActivity) {
      console.info(
        `[pushCampaignToCloud] Skipping "${campaign.name}" — deleted in cloud on another device (deletion is newer than all local activity)`,
      );
      return 'skipped-deleted';
    }
    console.info(
      `[pushCampaignToCloud] Cloud row for "${campaign.name}" is deleted but local activity is newer — resurrecting (last-write-wins)`,
    );
  }

  const tombstones =
    sessions.filter((s) => s.deleted).length +
    encounters.filter((e) => e.deleted).length +
    npcs.filter((n) => n.deleted).length;
  console.info(
    `[pushCampaignToCloud] "${campaign.name}" (id=${campaign.id}) — bundling ${sessions.length} session(s), ${encounters.length} encounter(s), ${npcs.length} NPC(s) from Dexie (${tombstones} tombstone(s))`,
  );

  const bundle: CampaignBundle = { campaign, sessions, encounters, npcs };

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
  return 'pushed';
}

/** Marker for a campaign soft-deleted in the cloud (deleted on another device). */
export interface CloudCampaignDeletion {
  campaignId: string;
  /** When the deletion happened (the cloud row's updated_at), epoch ms. */
  deletedAt: number;
}

export interface CloudCampaignPull {
  bundles: CampaignBundle[];
  deletions: CloudCampaignDeletion[];
}

/** Pull all campaign bundles for the current user from Supabase — live bundles
 *  plus deletion markers for soft-deleted rows, so a campaign deleted on one
 *  device can be removed from the DM's other devices instead of lingering
 *  locally (where any edit used to resurrect the cloud row). */
export async function pullAllCampaignsFromCloud(userId: string): Promise<CloudCampaignPull> {
  // Two queries so deleted rows don't ship their (potentially large) stale
  // campaign_data JSONB on every startup — markers only need id + timestamp.
  const [liveResult, deletedResult] = await Promise.all([
    supabase
      .from('user_campaigns')
      .select('id, campaign_data, updated_at, deleted')
      .eq('user_id', userId)
      .eq('deleted', false),
    supabase
      .from('user_campaigns')
      .select('id, updated_at')
      .eq('user_id', userId)
      .eq('deleted', true),
  ]);

  if (liveResult.error) throw new Error(`Failed to pull campaigns from cloud: ${liveResult.error.message}`);
  if (deletedResult.error) throw new Error(`Failed to pull campaign deletions from cloud: ${deletedResult.error.message}`);

  const deletions: CloudCampaignDeletion[] = (deletedResult.data ?? []).map((row) => ({
    campaignId: row.id,
    deletedAt: new Date(row.updated_at).getTime(),
  }));

  const bundles = (liveResult.data ?? []).map((row) => {
    const raw = row.campaign_data as Record<string, unknown>;
    // Handle both old format (just Campaign) and new format (CampaignBundle)
    if (raw.campaign && raw.sessions && raw.encounters) {
      return {
        campaign: { ...(raw.campaign as Campaign), id: row.id },
        sessions: raw.sessions as CampaignSession[],
        encounters: raw.encounters as SessionEncounter[],
        // Bundles pushed before NPCs were added to the format have no npcs key
        npcs: (raw.npcs as CampaignNPC[] | undefined) ?? [],
      };
    }
    // Legacy format: campaign_data IS the Campaign object directly
    return {
      campaign: { ...(raw as unknown as Campaign), id: row.id },
      sessions: [],
      encounters: [],
      npcs: [],
    };
  });

  return { bundles, deletions };
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
