/** Supabase Database type definitions for type-safe client queries */

import type { Profile, SharedCampaign, CampaignMember, CharacterSummary } from './sharing';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      shared_campaigns: {
        Row: SharedCampaign;
        Insert: Omit<SharedCampaign, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<SharedCampaign, 'id'>>;
      };
      campaign_members: {
        Row: CampaignMember;
        Insert: Omit<CampaignMember, 'id' | 'joined_at'> & { id?: string; joined_at?: string };
        Update: Partial<Omit<CampaignMember, 'id'>>;
      };
      character_summaries: {
        Row: CharacterSummary;
        Insert: Omit<CharacterSummary, 'updated_at'> & { updated_at?: string };
        Update: Partial<Omit<CharacterSummary, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      lookup_campaign_by_invite_code: {
        Args: { code: string };
        Returns: { id: string; name: string; description: string; created_by: string; dm_display_name: string }[];
      };
      generate_invite_code: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
