/** An NPC entry in the DM's campaign glossary.
 *  Created hidden by default; players only ever receive unhidden NPCs
 *  (filtering happens at extractPublicContent() — hidden entries never leave the DM's device). */
export interface CampaignNpc {
  /** Unique identifier (UUID) */
  id: string;
  createdAt: number;
  updatedAt: number;

  /** NPC display name */
  name: string;

  /** Where the party knows them from (free text, e.g. "Fallcrest — Blue Moon Alehouse") */
  location: string;

  /** Rich details (HTML — supports hyperlinks pasted by the DM to reference other materials) */
  details: string;

  /** Inline portrait image as a data URL (uploaded file, center-cropped + scaled) */
  imageData?: string;

  /** External image URL (alternative to imageData — DM links a picture hosted elsewhere) */
  imageUrl?: string;

  /** True = DM-only; not pushed to players until the DM unhides it */
  hidden: boolean;
}

export interface Campaign {
  /** Unique identifier (UUID) */
  id: string;
  createdAt: number;
  updatedAt: number;

  /** Campaign display name */
  name: string;

  /** DM-facing description / world notes (HTML) */
  description: string;

  /** DM-only private notes — not shared with players (HTML) */
  privateNotes: string;

  /** Notes that are visible to players (HTML) */
  publicNotes: string;

  /** IDs of Character objects that belong to this campaign */
  characterIds: string[];

  /** NPC Glossary — DM-managed list of characters the party engages with */
  npcs?: CampaignNpc[];

  /** ID of the shared_campaigns row in Supabase (set when DM shares online) */
  sharedCampaignId?: string;
}
