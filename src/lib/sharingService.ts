import { supabase } from './supabase';
import type { SharedCampaign, CampaignMember, CharacterSummary, Profile } from '../types/sharing';
import type { Character } from '../types/character';

/** Generate a unique 6-char invite code via Supabase RPC */
export async function generateInviteCode(): Promise<string> {
  const { data, error } = await supabase.rpc('generate_invite_code');
  if (error) throw new Error(`Failed to generate invite code: ${error.message}`);
  return data as string;
}

/** Create a shared campaign. DM is auto-added as a member with role 'dm'. */
export async function createSharedCampaign(
  name: string,
  description: string,
  createdBy: string
): Promise<SharedCampaign> {
  const inviteCode = await generateInviteCode();

  const { data: campaign, error: campaignError } = await supabase
    .from('shared_campaigns')
    .insert({ name, description, created_by: createdBy, invite_code: inviteCode })
    .select()
    .single();

  if (campaignError) throw new Error(`Failed to create campaign: ${campaignError.message}`);

  const { error: memberError } = await supabase
    .from('campaign_members')
    .insert({ campaign_id: campaign.id, user_id: createdBy, role: 'dm' });

  if (memberError) throw new Error(`Failed to add DM as member: ${memberError.message}`);

  return campaign as SharedCampaign;
}

/** Lookup a campaign by invite code (uses security definer function to bypass RLS) */
export async function lookupCampaignByInviteCode(
  code: string
): Promise<{ id: string; name: string; description: string; created_by: string; dm_display_name: string } | null> {
  const { data, error } = await supabase.rpc('lookup_campaign_by_invite_code', { code });
  if (error) throw new Error(`Failed to lookup invite code: ${error.message}`);
  if (!data || (Array.isArray(data) && data.length === 0)) return null;
  return Array.isArray(data) ? data[0] : data;
}

/** Join a campaign as a player */
export async function joinCampaign(campaignId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('campaign_members')
    .insert({ campaign_id: campaignId, user_id: userId, role: 'player' });

  if (error) throw new Error(`Failed to join campaign: ${error.message}`);
}

/** Leave a campaign (deletes member row + any character summaries) */
export async function leaveCampaign(campaignId: string, userId: string): Promise<void> {
  const { error: summaryError } = await supabase
    .from('character_summaries')
    .delete()
    .eq('campaign_id', campaignId)
    .eq('user_id', userId);

  if (summaryError) throw new Error(`Failed to remove character summaries: ${summaryError.message}`);

  const { error: memberError } = await supabase
    .from('campaign_members')
    .delete()
    .eq('campaign_id', campaignId)
    .eq('user_id', userId);

  if (memberError) throw new Error(`Failed to leave campaign: ${memberError.message}`);
}

/** Get all shared campaigns for the current user */
export async function getMySharedCampaigns(userId: string): Promise<SharedCampaign[]> {
  const { data: memberships, error: memberError } = await supabase
    .from('campaign_members')
    .select('campaign_id')
    .eq('user_id', userId);

  if (memberError) throw new Error(`Failed to fetch memberships: ${memberError.message}`);
  if (!memberships || memberships.length === 0) return [];

  const campaignIds = memberships.map((m: { campaign_id: string }) => m.campaign_id);

  const { data: campaigns, error: campaignError } = await supabase
    .from('shared_campaigns')
    .select('*')
    .in('id', campaignIds)
    .order('created_at', { ascending: false });

  if (campaignError) throw new Error(`Failed to fetch campaigns: ${campaignError.message}`);
  return (campaigns ?? []) as SharedCampaign[];
}

/** Get all members of a campaign with profile info */
export async function getCampaignMembers(
  campaignId: string
): Promise<(CampaignMember & { profile: Profile })[]> {
  const { data: members, error: memberError } = await supabase
    .from('campaign_members')
    .select('*')
    .eq('campaign_id', campaignId);

  if (memberError) throw new Error(`Failed to fetch members: ${memberError.message}`);
  if (!members || members.length === 0) return [];

  const userIds = members.map((m: { user_id: string }) => m.user_id);

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);

  if (profileError) throw new Error(`Failed to fetch profiles: ${profileError.message}`);

  const profileMap = new Map<string, Profile>();
  for (const profile of (profiles ?? []) as Profile[]) {
    profileMap.set(profile.id, profile);
  }

  return (members as CampaignMember[]).map((member) => ({
    ...member,
    profile: profileMap.get(member.user_id)!,
  }));
}

/** Get all character summaries for a campaign */
export async function getCampaignSummaries(campaignId: string): Promise<CharacterSummary[]> {
  const { data, error } = await supabase
    .from('character_summaries')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch character summaries: ${error.message}`);
  return (data ?? []) as CharacterSummary[];
}

/** Upsert a character summary (insert or update) */
export async function upsertCharacterSummary(
  summary: Omit<CharacterSummary, 'updated_at'>
): Promise<void> {
  const { error } = await supabase
    .from('character_summaries')
    .upsert(summary, { onConflict: 'id' });

  if (error) throw new Error(`Failed to upsert character summary: ${error.message}`);
}

/** Remove a character from a campaign */
export async function removeCharacterFromCampaign(
  characterId: string,
  campaignId: string
): Promise<void> {
  const { error } = await supabase
    .from('character_summaries')
    .delete()
    .eq('id', characterId)
    .eq('campaign_id', campaignId);

  if (error) throw new Error(`Failed to remove character: ${error.message}`);
}

const _supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const _supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const _storageKey = `sb-${new URL(_supabaseUrl).hostname.split('.')[0]}-auth-token`;

/** Read the Supabase session directly from localStorage. */
function getStoredSession(): { access_token: string; refresh_token: string } | null {
  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.access_token && parsed?.refresh_token) return parsed;
    return null;
  } catch {
    return null;
  }
}

/** Refresh an expired JWT using the refresh token via raw fetch.
 *  Returns a fresh access token, or null on failure. Also updates localStorage. */
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${_supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'apikey': _supabaseAnonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.access_token) return null;
    // Update localStorage so future reads get the fresh token
    localStorage.setItem(_storageKey, JSON.stringify(data));
    return data.access_token;
  } catch {
    return null;
  }
}

/** Fetch full character data for a campaign member's linked character.
 *  Uses raw fetch + localStorage token to completely bypass the Supabase client,
 *  which breaks when the browser tab is minimized/backgrounded.
 *  On 401, refreshes the JWT via the refresh token and retries once.
 *  Returns { character, error } — character is null when data hasn't synced,
 *  error is set when the query itself failed (network error, etc). */
export async function getCharacterData(
  summaryId: string,
  campaignId: string
): Promise<{ character: Character | null; error: string | null }> {
  try {
    const session = getStoredSession();
    let token = session?.access_token || null;

    const url = `${_supabaseUrl}/rest/v1/character_summaries` +
      `?select=character_data,portrait_url` +
      `&id=eq.${encodeURIComponent(summaryId)}` +
      `&campaign_id=eq.${encodeURIComponent(campaignId)}`;

    let res = await fetch(url, {
      headers: {
        'apikey': _supabaseAnonKey,
        'Authorization': `Bearer ${token || _supabaseAnonKey}`,
        'Accept': 'application/vnd.pgrst.object+json',
      },
    });

    // 401 = expired JWT. Refresh the token and retry once.
    if (res.status === 401 && session?.refresh_token) {
      token = await refreshAccessToken(session.refresh_token);
      if (token) {
        res = await fetch(url, {
          headers: {
            'apikey': _supabaseAnonKey,
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.pgrst.object+json',
          },
        });
      }
    }

    if (!res.ok) {
      return { character: null, error: `HTTP ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();

    if (!data?.character_data) return { character: null, error: null };

    const charData = data.character_data as Character;
    if (data.portrait_url && !charData.portrait) {
      charData.portrait = data.portrait_url;
    }
    return { character: charData, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Request failed';
    return { character: null, error: msg };
  }
}

/** Delete a shared campaign (DM only — cascades) */
export async function deleteSharedCampaign(campaignId: string): Promise<void> {
  const { error } = await supabase
    .from('shared_campaigns')
    .delete()
    .eq('id', campaignId);

  if (error) throw new Error(`Failed to delete campaign: ${error.message}`);
}
