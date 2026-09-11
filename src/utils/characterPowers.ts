import type { Character } from '../types/character';
import type { PowerData } from '../types/gameData';
import { getPowerById, getPowersByClass } from '../data/powers';
import { getFeatById } from '../data/feats';
import { getRaceById } from '../data/races';
import { ARMOR } from '../data/equipment/armor';
import { WEAPONS } from '../data/equipment/weapons';
import { MAGIC_ARMOR } from '../data/equipment/magicArmor';
import { MAGIC_WEAPONS } from '../data/equipment/magicWeapons';
import { MAGIC_IMPLEMENTS } from '../data/equipment/magicImplements';
import { MAGIC_ITEMS } from '../data/equipment/magicItems';
import { parseMagicArmorPower } from './magicArmorPowers';
import { parseMagicWeaponPower } from './magicWeaponPowers';
import { parseMagicImplementPower } from './magicImplementPowers';
import { parseMagicItemPower } from './magicItemPowers';
import { isFullDisciplinePower, extractMovementTechnique } from './fullDiscipline';

/**
 * Every power a character actually has, from every source.
 *
 * Lifted out of ActionsByTypePanel so the printable sheet resolves powers the
 * exact same way the app does. Duplicating this was the alternative, and the two
 * copies would have drifted the first time a new power source was added.
 *
 * Sources, in order: selected powers (plus Full Discipline movement techniques),
 * auto-granted level 0 class powers gated on the character's build choices, the
 * Half-Elf dilettante pick, feat-granted powers, racial powers, and powers from
 * equipped magic armor / weapons / implements / slot items.
 */
export function collectAllPowers(character: Character): PowerData[] {
  const seenIds = new Set<string>();
  const result: PowerData[] = [];

  const add = (p: PowerData) => {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      result.push(p);
    }
  };

  // 1. Selected powers (player-chosen at-wills, encounters, dailies, utilities)
  for (const sp of character.selectedPowers) {
    const p = getPowerById(sp.powerId);
    if (p) {
      add(p);
      // Full Discipline: also add the Movement Technique as a separate power under its action type
      if (isFullDisciplinePower(p)) {
        const mt = extractMovementTechnique(p);
        if (mt) add(mt);
      }
    }
  }

  // 2. Auto-granted level 0 class powers (cantrips, pact boons, CD powers, class features)
  const level0 = getPowersByClass(character.classId).filter((p) => p.level === 0);
  for (const p of level0) {
    if (p.cantrip) {
      add(p);
    } else if (p.pactBoon) {
      if (p.pactBoon === character.warlockPact) add(p);
    } else if (p.id === 'monk-centered-flurry-of-blows') {
      if (character.monkTradition === 'centered-breath') add(p);
    } else if (p.id === 'monk-stone-fist-flurry-of-blows') {
      if (character.monkTradition === 'stone-fist') add(p);
    } else if (p.id === 'fighter-combat-challenge') {
      if (character.fighterCombatStyle !== 'agility') add(p);
    } else if (p.id === 'fighter-combat-agility') {
      if (character.fighterCombatStyle === 'agility') add(p);
    } else {
      add(p);
    }
  }

  // 3. Half-Elf Dilettante power
  if (character.dilettantePowerId) {
    const dp = getPowerById(character.dilettantePowerId);
    if (dp) add(dp);
  }

  // 4. Feat-granted powers (e.g. deity Channel Divinity feats)
  for (const featId of character.selectedFeatIds) {
    const feat = getFeatById(featId);
    if (feat?.grantedPowerIds) {
      for (const powerId of feat.grantedPowerIds) {
        const p = getPowerById(powerId);
        if (p) add(p);
      }
    }
  }

  // 5. Racial powers (auto-granted racial encounter/at-will powers)
  const race = getRaceById(character.raceId);
  const subrace = race?.subraces?.find(sr => sr.id === character.subraceId);
  for (const pid of [...(race?.racialPowerIds ?? []), ...(subrace?.racialPowerIds ?? [])]) {
    const p = getPowerById(pid);
    if (p) add(p);
  }

  // 6. Magic armor powers (from equipped armor/shield with power text)
  for (const item of character.equipment) {
    if (!item.equipped || !item.magicArmorId) continue;
    const isArmor = ARMOR.find(a => a.id === item.itemId);
    if (!isArmor) continue;
    const ma = MAGIC_ARMOR.find(m => m.id === item.magicArmorId);
    if (!ma?.power) continue;
    const tier = ma.tiers.find(t => t.level === item.magicArmorTier);
    if (!tier) continue;
    const p = parseMagicArmorPower(ma, tier);
    if (p) add(p);
  }

  // 6. Magic weapon powers (from equipped weapons with power text)
  for (const item of character.equipment) {
    if (!item.equipped || !item.magicWeaponId) continue;
    const isWeapon = WEAPONS.find(w => w.id === item.itemId);
    if (!isWeapon) continue;
    const mw = MAGIC_WEAPONS.find(m => m.id === item.magicWeaponId);
    if (!mw?.power) continue;
    const tier = mw.tiers.find(t => t.level === item.magicWeaponTier);
    if (!tier) continue;
    const p = parseMagicWeaponPower(mw, tier);
    if (p) add(p);
  }

  // 7. Magic implement powers (from equipped implements with power text)
  for (const item of character.equipment) {
    if (!item.equipped || !item.magicImplementId) continue;
    const mi = MAGIC_IMPLEMENTS.find(m => m.id === item.magicImplementId);
    if (!mi?.power) continue;
    const tier = mi.tiers.find(t => t.level === item.magicImplementTier);
    if (!tier) continue;
    const p = parseMagicImplementPower(mi, tier);
    if (p) add(p);
  }

  // 8. Magic item powers (from equipped items with power text)
  for (const item of character.equipment) {
    if (!item.equipped) continue;
    const mi = MAGIC_ITEMS.find(m => m.id === item.itemId);
    if (!mi?.power) continue;
    const tier = mi.tiers.find(t => t.level === item.magicItemTier) ?? mi.tiers[0];
    if (!tier) continue;
    const p = parseMagicItemPower(mi, tier);
    if (p) add(p);
  }

  return result;
}
