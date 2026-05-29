import type { HomebrewItem } from '../types/homebrew';
import type {
  RaceData, ClassData, PowerData, FeatData, WeaponData, ArmorData, GearData,
  MagicItemData, MagicArmorData, MagicWeaponData, MagicImplementData, ConsumableData,
} from '../types/gameData';
import type { MonsterData } from '../types/monster';

import { registerHomebrewRaces, unregisterHomebrewRaces } from '../data/races';
import { registerHomebrewClasses, unregisterHomebrewClasses } from '../data/classes';
import { registerHomebrewPowers, unregisterHomebrewPowers } from '../data/powers';
import { registerHomebrewFeats, unregisterHomebrewFeats } from '../data/feats';
import {
  registerHomebrewWeapons, unregisterHomebrewWeapons,
  registerHomebrewArmor, unregisterHomebrewArmor,
  registerHomebrewGear, unregisterHomebrewGear,
  registerHomebrewConsumables, unregisterHomebrewConsumables,
  registerHomebrewMagicItems, unregisterHomebrewMagicItems,
  registerHomebrewMagicArmor, unregisterHomebrewMagicArmor,
  registerHomebrewMagicWeapons, unregisterHomebrewMagicWeapons,
  registerHomebrewMagicImplements, unregisterHomebrewMagicImplements,
} from '../data/equipment';
import { registerHomebrewMonsters, unregisterHomebrewMonsters } from '../data/monsters';

/**
 * Single-source-of-truth for the merged homebrew data layer.
 *
 * Each data type's `registerHomebrew*()` REPLACES the homebrew section of its
 * mutable array — so we cannot call register from local AND from campaign
 * directly, because the second call would wipe the first. This module holds
 * both sets, merges them, and dispatches one register call per type whenever
 * either source changes.
 *
 *  - Local: items the user authored in their Workshop (from useHomebrewStore).
 *  - Campaigns: items shared into a campaign by its DM. Keyed by
 *    sharedCampaignId so realtime updates on one campaign don't wipe others.
 *
 * Collision policy: local wins (it's the user's own copy). When two campaigns
 * contain a homebrew item with the same ID, the first one encountered wins
 * (insertion order — usually the order joined campaigns are listed).
 */

let localItems: HomebrewItem[] = [];
const campaignItems: Map<string, HomebrewItem[]> = new Map();

function dispatch() {
  const seen = new Set<string>();
  const merged: HomebrewItem[] = [];
  for (const item of localItems) {
    if (!seen.has(item.id)) { seen.add(item.id); merged.push(item); }
  }
  for (const items of campaignItems.values()) {
    for (const item of items) {
      if (!seen.has(item.id)) { seen.add(item.id); merged.push(item); }
    }
  }

  const races           = merged.filter((i) => i.contentType === 'race').map((i) => i.data as RaceData);
  const classes         = merged.filter((i) => i.contentType === 'class').map((i) => i.data as ClassData);
  const powers          = merged.filter((i) => i.contentType === 'power').map((i) => i.data as PowerData);
  const feats           = merged.filter((i) => i.contentType === 'feat').map((i) => i.data as FeatData);
  const weapons         = merged.filter((i) => i.contentType === 'weapon').map((i) => i.data as WeaponData);
  const armor           = merged.filter((i) => i.contentType === 'armor').map((i) => i.data as ArmorData);
  const gear            = merged.filter((i) => i.contentType === 'gear').map((i) => i.data as GearData);
  const consumables     = merged.filter((i) => i.contentType === 'consumable').map((i) => i.data as ConsumableData);
  const magicItems      = merged.filter((i) => i.contentType === 'magicItem').map((i) => i.data as MagicItemData);
  const magicArmor      = merged.filter((i) => i.contentType === 'magicArmor').map((i) => i.data as MagicArmorData);
  const magicWeapons    = merged.filter((i) => i.contentType === 'magicWeapon').map((i) => i.data as MagicWeaponData);
  const magicImplements = merged.filter((i) => i.contentType === 'magicImplement').map((i) => i.data as MagicImplementData);
  const monsters        = merged.filter((i) => i.contentType === 'monster').map((i) => i.data as MonsterData);

  if (races.length)           registerHomebrewRaces(races);                       else unregisterHomebrewRaces();
  if (classes.length)         registerHomebrewClasses(classes);                   else unregisterHomebrewClasses();
  if (powers.length)          registerHomebrewPowers(powers);                     else unregisterHomebrewPowers();
  if (feats.length)           registerHomebrewFeats(feats);                       else unregisterHomebrewFeats();
  if (weapons.length)         registerHomebrewWeapons(weapons);                   else unregisterHomebrewWeapons();
  if (armor.length)           registerHomebrewArmor(armor);                       else unregisterHomebrewArmor();
  if (gear.length)            registerHomebrewGear(gear);                         else unregisterHomebrewGear();
  if (consumables.length)     registerHomebrewConsumables(consumables);           else unregisterHomebrewConsumables();
  if (magicItems.length)      registerHomebrewMagicItems(magicItems);             else unregisterHomebrewMagicItems();
  if (magicArmor.length)      registerHomebrewMagicArmor(magicArmor);             else unregisterHomebrewMagicArmor();
  if (magicWeapons.length)    registerHomebrewMagicWeapons(magicWeapons);         else unregisterHomebrewMagicWeapons();
  if (magicImplements.length) registerHomebrewMagicImplements(magicImplements);   else unregisterHomebrewMagicImplements();
  if (monsters.length)        registerHomebrewMonsters(monsters);                 else unregisterHomebrewMonsters();
}

/** Called by useHomebrewStore.syncToDataLayer whenever the user's local Dexie items change. */
export function setLocalHomebrew(items: HomebrewItem[]): void {
  localItems = items;
  dispatch();
}

/** Called by the campaign-homebrew sync hook when a shared campaign's homebrew_content arrives or changes. */
export function setCampaignHomebrew(sharedCampaignId: string, items: HomebrewItem[]): void {
  campaignItems.set(sharedCampaignId, items);
  dispatch();
}

/** Drop one campaign's contributions (e.g. user left the campaign). */
export function removeCampaignHomebrew(sharedCampaignId: string): void {
  if (campaignItems.delete(sharedCampaignId)) dispatch();
}

/** Drop all campaign contributions (e.g. user logged out). Local items are preserved. */
export function clearAllCampaignHomebrew(): void {
  if (campaignItems.size === 0) return;
  campaignItems.clear();
  dispatch();
}
