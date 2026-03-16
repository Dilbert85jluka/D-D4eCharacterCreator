export interface Campaign {
  /** Unique identifier (UUID) */
  id: string;
  createdAt: number;
  updatedAt: number;

  /** Campaign display name */
  name: string;

  /** DM-facing description / world notes */
  description: string;

  /** Notes that are visible to players */
  publicNotes: string;

  /** IDs of Character objects that belong to this campaign */
  characterIds: string[];
}
