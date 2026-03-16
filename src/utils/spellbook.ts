import type { Character, WizardSpellbook } from '../types/character';
import { getPowerById } from '../data/powers';
import { getRitualById } from '../data/rituals';

export const SPELLBOOK_MAX_PAGES = 128;

/** All power IDs known to the wizard across all spellbooks. Falls back to legacy flat list. */
export function getAllSpellbookPowerIds(character: Character): string[] {
  if (character.spellbooks && character.spellbooks.length > 0) {
    return [...new Set(character.spellbooks.flatMap((b) => b.powerIds))];
  }
  return character.spellbookPowerIds ?? [];
}

/** All mastered ritual IDs across all spellbooks. Falls back to legacy flat list. */
export function getAllSpellbookRitualIds(character: Character): string[] {
  if (character.spellbooks && character.spellbooks.length > 0) {
    return [...new Set(character.spellbooks.flatMap((b) => b.ritualIds))];
  }
  return character.spellbookMasteredRitualIds ?? [];
}

/** Pages used by one spellbook (power levels + ritual levels). */
export function spellbookPagesUsed(book: WizardSpellbook): number {
  const powerPages = book.powerIds.reduce((sum, id) => {
    const p = getPowerById(id);
    return sum + (p?.level ?? 1);
  }, 0);
  const ritualPages = book.ritualIds.reduce((sum, id) => {
    const r = getRitualById(id);
    return sum + (r?.level ?? 1);
  }, 0);
  return powerPages + ritualPages;
}

/**
 * Return the index of the best book to add a new entry of the given level.
 * Picks the first book that has enough space. Falls back to book 0 if all are full.
 */
export function bestBookIndexForEntry(books: WizardSpellbook[], entryLevel: number): number {
  for (let i = 0; i < books.length; i++) {
    if (spellbookPagesUsed(books[i]) + entryLevel <= SPELLBOOK_MAX_PAGES) {
      return i;
    }
  }
  return 0; // overflow — still goes into first book
}
