import type { Alignment } from './character';

/**
 * Campaign NPC — a non-player character authored by the DM and scoped to one
 * local campaign. NPCs are stored only in Dexie (DM device); the visible
 * subset gets synced to Supabase for players via a Phase-2 push hook.
 *
 * Visibility model:
 *   - DM sees every NPC, including `privateDescription`
 *   - Players see only NPCs where `visibleToPlayers === true`, and only the
 *     player-safe fields (`privateDescription` is stripped before push)
 *
 * Free-text fields (race, characterClass, sex) intentionally — NPCs aren't
 * bound by PC race/class rules (a "Mind Flayer Vizier" or "Bandit Captain"
 * is fine).
 */
export interface CampaignNPC {
  id: string;
  /** Local Campaign.id this NPC belongs to. */
  campaignId: string;

  // Identity
  name: string;
  sex: string;
  alignment: Alignment;
  race: string;
  /** Free-text class/role — "Innkeeper", "Royal Vizier", "Bandit Captain", etc. Field renamed
   *  from `class` to `characterClass` to avoid the JavaScript reserved-keyword warning some
   *  TS configs still emit on property access. UI labels it as "Class". */
  characterClass: string;

  // Stats
  level: number;
  currentHp: number;
  maxHp: number;

  // Story
  /** Where the NPC lives, or where the PCs first met them. Free-form. */
  location: string;

  /** Center-cropped JPEG data URL (300×300, ~25–40 KB) — same pipeline as PC + homebrew monster portraits. */
  portrait?: string;

  /** TipTap-authored HTML. Shown to players when the NPC is visible. */
  publicDescription: string;
  /** TipTap-authored HTML. DM-only — never synced to players. */
  privateDescription: string;

  /** Default false. When true, the NPC appears on the player-facing campaign view. */
  visibleToPlayers: boolean;

  createdAt: number;
  updatedAt: number;
}

/**
 * Player-safe view of an NPC. `privateDescription`, `currentHp`, `maxHp`, and `level`
 * are stripped before sync — players don't need (or see) the DM's combat stats or notes.
 * This is the shape pushed to `shared_campaigns.npc_content` JSONB in Phase 2.
 */
export interface PublicNPC {
  id: string;
  name: string;
  sex: string;
  alignment: Alignment;
  race: string;
  characterClass: string;
  location: string;
  portrait?: string;
  publicDescription: string;
}

/** Build the player-safe view from a full NPC. */
export function toPublicNPC(npc: CampaignNPC): PublicNPC {
  return {
    id: npc.id,
    name: npc.name,
    sex: npc.sex,
    alignment: npc.alignment,
    race: npc.race,
    characterClass: npc.characterClass,
    location: npc.location,
    portrait: npc.portrait,
    publicDescription: npc.publicDescription,
  };
}
