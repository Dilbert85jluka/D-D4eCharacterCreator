import type {
  PowerData,
  FeatData,
  WeaponData,
  ArmorData,
  GearData,
  MagicItemData,
  MagicArmorData,
  MagicWeaponData,
  MagicImplementData,
  ConsumableData,
} from './gameData';

export type HomebrewContentType =
  | 'power'
  | 'feat'
  | 'weapon'
  | 'armor'
  | 'gear'
  | 'magicItem'
  | 'magicArmor'
  | 'magicWeapon'
  | 'magicImplement'
  | 'consumable';

export const HOMEBREW_CONTENT_TYPES: { key: HomebrewContentType; label: string }[] = [
  { key: 'power', label: 'Powers' },
  { key: 'feat', label: 'Feats' },
  { key: 'weapon', label: 'Weapons' },
  { key: 'armor', label: 'Armor' },
  { key: 'gear', label: 'Gear' },
  { key: 'magicItem', label: 'Magic Items' },
  { key: 'magicArmor', label: 'Magic Armor' },
  { key: 'magicWeapon', label: 'Magic Weapons' },
  { key: 'magicImplement', label: 'Magic Implements' },
  { key: 'consumable', label: 'Consumables' },
];

export type HomebrewDataMap = {
  power: PowerData;
  feat: FeatData;
  weapon: WeaponData;
  armor: ArmorData;
  gear: GearData;
  magicItem: MagicItemData;
  magicArmor: MagicArmorData;
  magicWeapon: MagicWeaponData;
  magicImplement: MagicImplementData;
  consumable: ConsumableData;
};

export interface HomebrewItem<T extends HomebrewContentType = HomebrewContentType> {
  id: string;                    // UUID prefixed with 'homebrew-'
  contentType: T;
  name: string;                  // Display name (duplicated from data for indexing)
  createdAt: number;
  updatedAt: number;
  createdBy: string;             // Supabase user ID
  campaignIds: string[];         // Local campaign IDs this is shared to (empty = personal)
  data: HomebrewDataMap[T];
}
