import type { Ability } from '../types/character';

const ABILITY_NAMES: Record<string, Ability> = {
  'Strength': 'str',
  'Constitution': 'con',
  'Dexterity': 'dex',
  'Intelligence': 'int',
  'Wisdom': 'wis',
  'Charisma': 'cha',
};

// Matches: optional "your ", then ability name, then " modifier"
// Case-insensitive to handle any capitalization in power text
const MOD_REGEX = /(your )?(Strength|Constitution|Dexterity|Intelligence|Wisdom|Charisma) modifier/gi;

/**
 * Replaces ability modifier references in power text with computed numeric values.
 * e.g. "1[W] + Dexterity modifier damage" → "1[W] + 3 (Dexterity modifier) damage"
 *      "your Charisma modifier" → "2 (your Charisma modifier)"
 *
 * Returns the original text unchanged if mods is undefined (e.g. during character creation).
 */
export function substituteMods(
  text: string | undefined,
  mods: Record<Ability, number> | undefined,
): string | undefined {
  if (!text || !mods) return text;
  return text.replace(MOD_REGEX, (match, _your, abilityName: string) => {
    // Capitalize first letter for lookup (regex is case-insensitive)
    const normalized = abilityName.charAt(0).toUpperCase() + abilityName.slice(1).toLowerCase();
    const key = ABILITY_NAMES[normalized];
    if (!key) return match;
    const val = mods[key];
    return `${val} (${match})`;
  });
}
