export interface CampaignSession {
  /** Unique identifier (UUID) */
  id: string;
  /** Parent campaign ID */
  campaignId: string;
  createdAt: number;
  updatedAt: number;

  /** Tombstone flag — deleted records are kept (with content blanked) so the
   *  deletion propagates through the cloud bundle merge instead of the record
   *  resurrecting from another device's push. Filtered out of all reads;
   *  purged after the tombstone TTL (see src/db/tombstones.ts). */
  deleted?: boolean;

  /** Display number (1, 2, 3 …) — ascending in the nav tree */
  sessionNumber: number;

  /** Short title for the session */
  name: string;

  /** Date the session was / will be played (YYYY-MM-DD) */
  date: string;

  /** Context carried forward — important events from previous sessions */
  importantEvents: string;

  /** DM prep — what is planned for this session */
  plannedSummary: string;

  /** Catch-all notes (post-session recap, rule reminders, etc.) */
  additionalNotes: string;
}
