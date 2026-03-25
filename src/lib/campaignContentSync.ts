import { supabase } from './supabase';
import type { Campaign } from '../types/campaign';
import type { CampaignSession } from '../types/session';
import type { CampaignContent, PublicSession } from '../types/sharing';

/** Extract player-visible content from local campaign + sessions */
export function extractPublicContent(
  campaign: Campaign,
  sessions: CampaignSession[]
): CampaignContent {
  const publicSessions: PublicSession[] = sessions
    .sort((a, b) => a.sessionNumber - b.sessionNumber)
    .map((s) => ({
      id: s.id,
      sessionNumber: s.sessionNumber,
      name: s.name,
      date: s.date,
      importantEvents: s.importantEvents,
      additionalNotes: s.additionalNotes,
      // plannedSummary deliberately excluded — DM only
    }));

  return {
    description: campaign.description,
    publicNotes: campaign.publicNotes,
    sessions: publicSessions,
  };
}

/** Push campaign content to the shared_campaigns row in Supabase */
export async function pushCampaignContent(
  sharedCampaignId: string,
  content: CampaignContent
): Promise<void> {
  const { error } = await supabase
    .from('shared_campaigns')
    .update({ campaign_content: content })
    .eq('id', sharedCampaignId);

  if (error) throw new Error(`Failed to push campaign content: ${error.message}`);
}
