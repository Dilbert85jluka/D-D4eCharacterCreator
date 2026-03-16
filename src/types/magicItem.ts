export type MagicItemCategory =
  | 'Potion'
  | 'Scroll'
  | 'Ring'
  | 'Rod'
  | 'Staff'
  | 'Wand'
  | 'Miscellaneous'
  | 'Armor'
  | 'Weapon';

export type EditionKey = '2e' | '4e' | '5e';

/** Edition-specific stats for an item */
export interface MagicItemEdition {
  description: string;
  properties?: string[];
  rarity?: string;
  aura?: string;
  xpValue?: number;
  gpValue?: number;
  weight?: string;
  duration?: string;
  charges?: string;
  attunement?: string;
  level?: number;
  enhancementBonus?: number;
  slot?: string;
  powerText?: string;
}

/** A single magic item with all 3 edition versions */
export interface MagicItemData {
  id: string;
  name: string;
  category: MagicItemCategory;
  source: string;
  editions: Record<EditionKey, MagicItemEdition>;
}

/** Filter state for compendium page */
export interface MagicItemFilters {
  categories: MagicItemCategory[];
  query: string;
}
