import type { Character } from '../types/character';
import type { CharacterSummary } from '../types/sharing';

/**
 * Build a CharacterSummary payload from a local Character + derived maxHp.
 * The `updated_at` field is omitted — Supabase auto-fills it via default.
 */
export function extractSummary(
  character: Character,
  campaignId: string,
  userId: string,
  maxHp: number,
): Omit<CharacterSummary, 'updated_at'> {
  return {
    id: character.id,
    campaign_id: campaignId,
    user_id: userId,
    name: character.name,
    class_id: character.classId,
    race_id: character.raceId,
    level: character.level,
    current_hp: character.currentHp,
    max_hp: maxHp,
    paragon_path: character.paragonPath || '',
    epic_destiny: character.epicDestiny || '',
    alignment: character.alignment || 'Unaligned',
    deity: character.deity || '',
    player_name: character.playerName || '',
    portrait_url: character.portrait || null,
    character_data: { ...character, portrait: undefined } as CharacterSummary['character_data'],
  };
}

/**
 * Creates a debounced wrapper. Each call resets the timer.
 * Returns a cancel function for cleanup.
 */
export function createSyncDebouncer(delayMs = 2000) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounce = (fn: () => void) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fn, delayMs);
  };

  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return { debounce, cancel };
}
