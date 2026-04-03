import { supabase } from './supabase';
import type { HomebrewItem } from '../types/homebrew';
import type { RaceData, ClassData, PowerData, FeatData, WeaponData, ArmorData, GearData, MagicItemData, MagicArmorData, MagicWeaponData, MagicImplementData, ConsumableData } from '../types/gameData';
import { registerHomebrewRaces } from '../data/races';
import { registerHomebrewClasses } from '../data/classes';
import { registerHomebrewPowers } from '../data/powers';
import { registerHomebrewFeats } from '../data/feats';
import {
  registerHomebrewWeapons,
  registerHomebrewArmor,
  registerHomebrewGear,
  registerHomebrewConsumables,
  registerHomebrewMagicItems,
  registerHomebrewMagicArmor,
  registerHomebrewMagicWeapons,
  registerHomebrewMagicImplements,
} from '../data/equipment';

/** Extract homebrew items linked to a specific campaign */
export function extractHomebrewContent(
  campaignId: string,
  allItems: HomebrewItem[]
): HomebrewItem[] {
  return allItems.filter((item) => item.campaignIds.includes(campaignId));
}

/** Push homebrew content to the shared_campaigns row in Supabase */
export async function pushHomebrewContent(
  sharedCampaignId: string,
  content: HomebrewItem[]
): Promise<void> {
  const { error } = await supabase
    .from('shared_campaigns')
    .update({ homebrew_content: content })
    .eq('id', sharedCampaignId);

  if (error) throw new Error(`Failed to push homebrew content: ${error.message}`);
}

/**
 * Register homebrew items received from a campaign into the data layer.
 * Called on the player side when campaign homebrew content is received via realtime.
 */
export function registerCampaignHomebrew(items: HomebrewItem[]): void {
  const races = items.filter((i) => i.contentType === 'race').map((i) => i.data as RaceData);
  const classes = items.filter((i) => i.contentType === 'class').map((i) => i.data as ClassData);
  const powers = items.filter((i) => i.contentType === 'power').map((i) => i.data as PowerData);
  const feats = items.filter((i) => i.contentType === 'feat').map((i) => i.data as FeatData);
  const weapons = items.filter((i) => i.contentType === 'weapon').map((i) => i.data as WeaponData);
  const armor = items.filter((i) => i.contentType === 'armor').map((i) => i.data as ArmorData);
  const gear = items.filter((i) => i.contentType === 'gear').map((i) => i.data as GearData);
  const consumables = items.filter((i) => i.contentType === 'consumable').map((i) => i.data as ConsumableData);
  const magicItems = items.filter((i) => i.contentType === 'magicItem').map((i) => i.data as MagicItemData);
  const magicArmor = items.filter((i) => i.contentType === 'magicArmor').map((i) => i.data as MagicArmorData);
  const magicWeapons = items.filter((i) => i.contentType === 'magicWeapon').map((i) => i.data as MagicWeaponData);
  const magicImplements = items.filter((i) => i.contentType === 'magicImplement').map((i) => i.data as MagicImplementData);

  if (races.length) registerHomebrewRaces(races);
  if (classes.length) registerHomebrewClasses(classes);
  if (powers.length) registerHomebrewPowers(powers);
  if (feats.length) registerHomebrewFeats(feats);
  if (weapons.length) registerHomebrewWeapons(weapons);
  if (armor.length) registerHomebrewArmor(armor);
  if (gear.length) registerHomebrewGear(gear);
  if (consumables.length) registerHomebrewConsumables(consumables);
  if (magicItems.length) registerHomebrewMagicItems(magicItems);
  if (magicArmor.length) registerHomebrewMagicArmor(magicArmor);
  if (magicWeapons.length) registerHomebrewMagicWeapons(magicWeapons);
  if (magicImplements.length) registerHomebrewMagicImplements(magicImplements);
}
