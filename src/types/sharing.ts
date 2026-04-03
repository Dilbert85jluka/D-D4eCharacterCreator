/** Shared data types for Supabase multi-user campaign sharing */

import type { HomebrewItem } from './homebrew';

export interface Profile {
  id: string;           // matches auth.users.id
  email: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export type CampaignRole = 'dm' | 'player';

/** Player-visible session summary (excludes DM-only plannedSummary) */
export interface PublicSession {
  id: string;
  sessionNumber: number;
  name: string;
  date: string;
  importantEvents: string;
  additionalNotes: string;
}

/** Public-facing campaign content synced by DM to Supabase */
export interface CampaignContent {
  description: string;
  publicNotes: string;
  sessions: PublicSession[];
}

export interface SharedCampaign {
  id: string;
  name: string;
  description: string;
  public_notes: string;
  invite_code: string;  // 6-char alphanumeric, unique
  created_by: string;   // user id (DM)
  created_at: string;
  updated_at: string;
  campaign_content: CampaignContent | null;
  homebrew_content: HomebrewItem[] | null;
}

export interface CampaignMember {
  id: string;
  campaign_id: string;
  user_id: string;
  role: CampaignRole;
  joined_at: string;
}

export interface CharacterSummary {
  id: string;           // matches local Character.id
  campaign_id: string;
  user_id: string;
  name: string;
  class_id: string;
  race_id: string;
  level: number;
  current_hp: number;
  max_hp: number;
  paragon_path: string;
  epic_destiny: string;
  alignment: string;
  deity: string;
  player_name: string;
  portrait_url: string | null;
  updated_at: string;
}
