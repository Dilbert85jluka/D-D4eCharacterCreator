import { useMemo } from 'react';
import type { Character, DerivedStats, Ability, AbilityScores, AbilityBreakdownRow, DefenseBreakdownRow, SkillBreakdown } from '../types/character';
import { getRaceById } from '../data/races';
import { getClassById } from '../data/classes';
import { getParagonPathById } from '../data/paragonPaths';
import { getFeatById } from '../data/feats';
import { SKILLS } from '../data/skills';
import { ARMOR } from '../data/equipment/armor';
import { MASTERWORK_ARMOR } from '../data/equipment/masterworkArmor';
import { MAGIC_ARMOR } from '../data/equipment/magicArmor';
import { MAGIC_ITEMS } from '../data/equipment/magicItems';
import { MAGIC_WEAPONS } from '../data/equipment/magicWeapons';
import { WEAPONS } from '../data/equipment/weapons';
import { abilityModifier, ABILITIES, formatModifier } from '../utils/abilityScores';
import { calculateAC, calculateFortitude, calculateReflex, calculateWill } from '../utils/defenses';
import { calculateMaxHp, calculateBloodied, calculateHealingSurgeValue, calculateSurgesPerDay } from '../utils/hitPoints';
import { calculateSkillBonus } from '../utils/skillUtils';

/** Only include a row when the value is non-zero. */
function rowIf(condition: boolean, label: string, value: number): DefenseBreakdownRow[] {
  return condition ? [{ label, value }] : [];
}

export function useCharacterDerived(character: Character): DerivedStats {
  return useMemo(() => {
    const race = getRaceById(character.raceId);
    const cls = getClassById(character.classId);
    const halfLevel = Math.floor(character.level / 2);

    // Get subrace data if applicable
    const subrace = race?.subraces?.find((sr) => sr.id === character.subraceId);

    // Final ability scores with racial bonuses (base race + subrace + player choice)
    const finalAbilityScores = ABILITIES.reduce((acc, ab) => {
      const fixedBonus = race?.abilityBonuses[ab] ?? 0;
      const subraceBonus = subrace?.abilityBonuses[ab] ?? 0;
      const choiceBonus = character.racialAbilityChoiceBonus?.[ab] ?? 0;
      acc[ab] = character.baseAbilityScores[ab] + fixedBonus + subraceBonus + choiceBonus;
      return acc;
    }, {} as AbilityScores);

    // Human's flexible +2 is stored in baseAbilityScores (applied during character creation)
    // Other races' optional second bonus is stored in racialAbilityChoiceBonus

    // ── Ability score breakdowns ───────────────────────────────────────────────
    const abilityBreakdowns = ABILITIES.reduce((acc, ab) => {
      const base = character.baseAbilityScores[ab];
      const fixedBonus = race?.abilityBonuses[ab] ?? 0;
      const subraceBonus = subrace?.abilityBonuses[ab] ?? 0;
      const choiceBonus = character.racialAbilityChoiceBonus?.[ab] ?? 0;
      const rows: AbilityBreakdownRow[] = [
        { label: 'Base Score', value: base },
      ];
      if (fixedBonus !== 0) rows.push({ label: `Racial (${race?.name ?? 'Race'})`, value: fixedBonus });
      if (subraceBonus !== 0) rows.push({ label: `Subrace (${subrace?.name ?? 'Subrace'})`, value: subraceBonus });
      if (choiceBonus !== 0) rows.push({ label: `Racial Choice`, value: choiceBonus });
      acc[ab] = rows;
      return acc;
    }, {} as Record<Ability, AbilityBreakdownRow[]>);

    const mods = ABILITIES.reduce((acc, ab) => {
      acc[ab] = abilityModifier(finalAbilityScores[ab]);
      return acc;
    }, {} as Record<Ability, number>);

    // Find equipped armor and shield
    const equippedArmorItem = character.equipment.find(
      (e) => e.equipped && e.slot === 'body',
    );
    const equippedShieldItem = character.equipment.find(
      (e) => e.equipped && e.slot?.startsWith('off-hand') && ARMOR.find(a => a.id === e.itemId && a.type === 'Shield'),
    );

    const equippedArmorData = equippedArmorItem
      ? ARMOR.find((a) => a.id === equippedArmorItem.itemId)
      : undefined;
    const equippedShieldData = equippedShieldItem
      ? ARMOR.find((a) => a.id === equippedShieldItem.itemId)
      : undefined;

    // Resolve masterwork upgrades (overrides base armor stats)
    const masterworkData = equippedArmorItem?.masterworkId
      ? MASTERWORK_ARMOR.find(m => m.id === equippedArmorItem.masterworkId)
      : undefined;
    const shieldMasterworkData = equippedShieldItem?.masterworkId
      ? MASTERWORK_ARMOR.find(m => m.id === equippedShieldItem.masterworkId)
      : undefined;

    // Masterwork overrides base armor AC/check/speed; fall back to base
    const armorAcBonus = masterworkData?.acBonus ?? equippedArmorData?.acBonus ?? 0;
    const shieldAcBonus = shieldMasterworkData?.acBonus ?? equippedShieldData?.acBonus ?? 0;
    const armorCheckPenalty =
      (masterworkData?.checkPenalty ?? equippedArmorData?.checkPenalty ?? 0) +
      (shieldMasterworkData?.checkPenalty ?? equippedShieldData?.checkPenalty ?? 0);
    const armorSpeedPenalty =
      (masterworkData?.speedPenalty ?? equippedArmorData?.speedPenalty ?? 0) +
      (shieldMasterworkData?.speedPenalty ?? equippedShieldData?.speedPenalty ?? 0);
    const armorName = masterworkData?.name ?? equippedArmorData?.name ?? 'Cloth (unarmored)';
    const shieldName = shieldMasterworkData?.name ?? equippedShieldData?.name ?? 'Shield';

    // Resolve magic armor enchantment (enhancement bonus to AC)
    const magicArmorEnchant = equippedArmorItem?.magicArmorId
      ? MAGIC_ARMOR.find(m => m.id === equippedArmorItem.magicArmorId)
      : undefined;
    const magicArmorTier = magicArmorEnchant?.tiers.find(
      t => t.level === equippedArmorItem?.magicArmorTier
    );
    const armorEnhancementBonus = magicArmorTier?.enhancement ?? 0;

    // Resolve magic shield enchantment
    const magicShieldEnchant = equippedShieldItem?.magicArmorId
      ? MAGIC_ARMOR.find(m => m.id === equippedShieldItem.magicArmorId)
      : undefined;
    const magicShieldTier = magicShieldEnchant?.tiers.find(
      t => t.level === equippedShieldItem?.magicArmorTier
    );
    const shieldEnhancementBonus = magicShieldTier?.enhancement ?? 0;

    // ── Magic armor property bonuses (unconditional) ─────────────────────────
    const magicArmorSkillBonuses: Record<string, { bonus: number; source: string }> = {};
    let magicArmorInitiativeBonus = 0;
    let magicArmorInitiativeSource = '';
    let magicArmorSpeedBonus = 0;
    let magicArmorDefBonuses = { ac: 0, fortitude: 0, reflex: 0, will: 0 };
    const magicArmorDefSources: string[] = [];

    // Collect bonuses from both equipped armor and equipped shield magic armor
    for (const { enchant, tier } of [
      { enchant: magicArmorEnchant, tier: magicArmorTier },
      { enchant: magicShieldEnchant, tier: magicShieldTier },
    ]) {
      if (!enchant?.bonuses || !tier) continue;
      const b = enchant.bonuses;
      const enh = tier.enhancement;
      const itemLevel = tier.level;

      // Flat skill bonuses
      if (b.skills) {
        for (const [skillId, bonus] of Object.entries(b.skills)) {
          if (bonus) {
            const existing = magicArmorSkillBonuses[skillId]?.bonus ?? 0;
            if (bonus > existing) {
              magicArmorSkillBonuses[skillId] = { bonus, source: enchant.name };
            }
          }
        }
      }

      // Enhancement-scaling skill bonuses
      if (b.skillsFromEnhancement) {
        for (const skillId of b.skillsFromEnhancement) {
          const existing = magicArmorSkillBonuses[skillId]?.bonus ?? 0;
          if (enh > existing) {
            magicArmorSkillBonuses[skillId] = { bonus: enh, source: `${enchant.name} (+${enh})` };
          }
        }
      }

      // Level-scaled skill bonuses
      if (b.skillsByLevel) {
        for (const [skillId, tiers] of Object.entries(b.skillsByLevel)) {
          // Find the highest tier that applies at the item's level
          let best = 0;
          for (const [minLvl, val] of tiers) {
            if (itemLevel >= minLvl && val > best) best = val;
          }
          if (best > 0) {
            const existing = magicArmorSkillBonuses[skillId]?.bonus ?? 0;
            if (best > existing) {
              magicArmorSkillBonuses[skillId] = { bonus: best, source: `${enchant.name} (+${best})` };
            }
          }
        }
      }

      // Initiative
      if (b.initiative) {
        magicArmorInitiativeBonus += b.initiative;
        magicArmorInitiativeSource = enchant.name;
      }

      // Speed
      if (b.speed) magicArmorSpeedBonus += b.speed;

      // Defense bonuses
      if (b.ac) { magicArmorDefBonuses.ac += b.ac; magicArmorDefSources.push(enchant.name); }
      if (b.fortitude) { magicArmorDefBonuses.fortitude += b.fortitude; magicArmorDefSources.push(enchant.name); }
      if (b.reflex) { magicArmorDefBonuses.reflex += b.reflex; magicArmorDefSources.push(enchant.name); }
      if (b.will) { magicArmorDefBonuses.will += b.will; magicArmorDefSources.push(enchant.name); }
    }

    // ── Resolve equipped weapon magic enhancement ──────────────────────────
    const equippedWeaponItem = character.equipment.find(
      (e) => e.equipped && e.slot === 'main-hand',
    );
    const equippedWeaponData = equippedWeaponItem
      ? WEAPONS.find(w => w.id === equippedWeaponItem.itemId)
      : undefined;
    const magicWeaponEnchant = equippedWeaponItem?.magicWeaponId
      ? MAGIC_WEAPONS.find(m => m.id === equippedWeaponItem.magicWeaponId)
      : undefined;
    const magicWeaponTier = magicWeaponEnchant?.tiers.find(
      t => t.level === equippedWeaponItem?.magicWeaponTier,
    );
    const weaponEnhancementBonus = magicWeaponTier?.enhancement ?? 0;

    // Determine AC ability modifier (some classes use INT or DEX to unarmored AC)
    let acAbilityMod = 0;
    let acAbilityLabel = '';
    let classAcBonus = 0;  // e.g. Avenger Armor of Faith
    let classAcLabel = '';
    const armorType = equippedArmorData?.type ?? 'Cloth';
    const isLightArmor = armorType === 'Cloth' || armorType === 'Leather' || armorType === 'Hide';
    let classReflexBonus = 0; // e.g. Barbarian Agility
    let classReflexLabel = '';
    let classFortBonus = 0; // e.g. Monk Mental Equilibrium
    let classFortLabel = '';
    let classWillBonus = 0; // e.g. Monk Mental Bastion
    let classWillLabel = '';
    if (armorType === 'Cloth') {
      if (cls?.id === 'wizard' || cls?.id === 'warlock') {
        acAbilityMod = Math.max(mods.int, mods.dex);
        const intFmt = formatModifier(mods.int);
        const dexFmt = formatModifier(mods.dex);
        const winner = mods.int >= mods.dex ? 'INT' : 'DEX';
        acAbilityLabel = `max(INT ${intFmt}, DEX ${dexFmt}) — ${winner}`;
      }
      // Avenger: Armor of Faith — +3 AC in cloth, no shield
      if (cls?.id === 'avenger' && !equippedShieldData) {
        classAcBonus = 3;
        classAcLabel = 'Armor of Faith';
      }
    }
    // Warden: Guardian Might — ability mod to AC in light armor
    if (isLightArmor && cls?.id === 'warden') {
      if (character.wardenGuardianMight === 'earthstrength') {
        acAbilityMod = mods.con; acAbilityLabel = `CON ${formatModifier(mods.con)} (Earthstrength)`;
      } else if (character.wardenGuardianMight === 'wildblood') {
        acAbilityMod = mods.wis; acAbilityLabel = `WIS ${formatModifier(mods.wis)} (Wildblood)`;
      }
    }
    // Druid: Primal Aspect — CON mod to AC in light armor (Guardian only)
    if (isLightArmor && cls?.id === 'druid' && character.druidPrimalAspect === 'guardian') {
      acAbilityMod = mods.con; acAbilityLabel = `CON ${formatModifier(mods.con)} (Primal Guardian)`;
    }
    // Sorcerer: Dragon Magic — +2 AC while not wearing heavy armor
    if (isLightArmor && cls?.id === 'sorcerer' && character.sorcererSpellSource === 'dragon') {
      classAcBonus += 2;
      classAcLabel = classAcLabel ? `${classAcLabel} + Dragon Magic` : 'Dragon Magic';
    }
    // Monk: Unarmored Defense — +2 AC in cloth, no shield; uses higher of DEX or WIS for AC
    if (armorType === 'Cloth' && cls?.id === 'monk' && !equippedShieldData) {
      classAcBonus += 2;
      classAcLabel = classAcLabel ? `${classAcLabel} + Unarmored Defense` : 'Unarmored Defense';
      acAbilityMod = Math.max(mods.dex, mods.wis);
      const dexFmt = formatModifier(mods.dex);
      const wisFmt = formatModifier(mods.wis);
      const winner = mods.dex >= mods.wis ? 'DEX' : 'WIS';
      acAbilityLabel = `max(DEX ${dexFmt}, WIS ${wisFmt}) — ${winner}`;
    }
    // Monk: Monastic Tradition defensive bonuses — tiered +1/+2/+3
    if (cls?.id === 'monk' && character.monkTradition) {
      const traditionBonus = character.level >= 21 ? 3 : character.level >= 11 ? 2 : 1;
      if (character.monkTradition === 'centered-breath') {
        classFortBonus = traditionBonus;
        classFortLabel = 'Mental Equilibrium';
      } else if (character.monkTradition === 'stone-fist') {
        classWillBonus = traditionBonus;
        classWillLabel = 'Mental Bastion';
      }
    }
    // Battlemind: uses CON for AC in light armor (optional — Battlemind already uses CON as primary)
    // Barbarian: Barbarian Agility — +1/+2/+3 AC and Reflex when not wearing heavy armor
    if (isLightArmor && cls?.id === 'barbarian') {
      const agilityBonus = character.level >= 21 ? 3 : character.level >= 11 ? 2 : 1;
      classAcBonus += agilityBonus;
      classAcLabel = classAcLabel ? `${classAcLabel} + Barbarian Agility` : 'Barbarian Agility';
      classReflexBonus = agilityBonus;
      classReflexLabel = 'Barbarian Agility';
    }

    // Human defense bonuses
    const isHuman = character.raceId === 'human';
    const humanDefBonus = isHuman ? 1 : 0;

    // Racial Will bonus (Eladrin +1, Goliath +1 Mountain's Tenacity)
    const racialWillBonus = (character.raceId === 'eladrin' ? 1 : 0) + (race?.willBonus ?? 0);

    // Sum passive bonuses from all equipped magic items
    const magicBonuses = character.equipment
      .filter((e) => e.equipped)
      .reduce(
        (acc, e) => {
          const item = MAGIC_ITEMS.find((m) => m.id === e.itemId);
          if (!item?.bonuses) return acc;
          return {
            ac:                acc.ac                + (item.bonuses.ac                ?? 0),
            fortitude:         acc.fortitude         + (item.bonuses.fortitude         ?? 0),
            reflex:            acc.reflex            + (item.bonuses.reflex            ?? 0),
            will:              acc.will              + (item.bonuses.will              ?? 0),
            initiative:        acc.initiative        + (item.bonuses.initiative        ?? 0),
            speed:             acc.speed             + (item.bonuses.speed             ?? 0),
            healingSurgeBonus: acc.healingSurgeBonus + (item.bonuses.healingSurgeBonus ?? 0),
            surgesPerDay:      acc.surgesPerDay      + (item.bonuses.surgesPerDay      ?? 0),
          };
        },
        { ac: 0, fortitude: 0, reflex: 0, will: 0, initiative: 0, speed: 0, healingSurgeBonus: 0, surgesPerDay: 0 },
      );

    // Paragon path bonuses (apply only at level 11+)
    const paragonPath = (character.level >= 11 && character.paragonPath)
      ? getParagonPathById(character.paragonPath)
      : undefined;
    const pb = paragonPath?.bonuses ?? {};

    // ── Feat bonuses ─────────────────────────────────────────────────────────
    // Tier offset used for tiered feats (Great Fortitude, Iron Will, etc.)
    const featTier = character.level >= 21 ? 2 : character.level >= 11 ? 1 : 0;

    const featBonuses = character.selectedFeatIds.reduce(
      (acc, featId) => {
        const feat = getFeatById(featId);
        if (!feat?.bonuses) return acc;
        const b = feat.bonuses;
        const defScale = b.tieredBonus ? featTier : 0;
        const hpScale  = b.tieredBonus ? featTier * 5 : 0;

        // AC bonus is conditional if acArmorCondition is set
        const acGrant = b.ac
          ? (!b.acArmorCondition || b.acArmorCondition === armorType)
            ? b.ac + defScale
            : 0
          : 0;

        // Merge per-skill bonuses
        const newSkills = { ...acc.skills };
        if (b.skills) {
          for (const [skillId, bonus] of Object.entries(b.skills)) {
            if (bonus !== undefined) newSkills[skillId] = (newSkills[skillId] ?? 0) + bonus;
          }
        }

        return {
          fortitude:        acc.fortitude        + (b.fortitude        ?? 0) + (b.fortitude        && b.tieredBonus ? defScale : 0),
          reflex:           acc.reflex           + (b.reflex           ?? 0) + (b.reflex           && b.tieredBonus ? defScale : 0),
          will:             acc.will             + (b.will             ?? 0) + (b.will             && b.tieredBonus ? defScale : 0),
          ac:               acc.ac              + acGrant,
          initiative:       acc.initiative       + (b.initiative       ?? 0),
          speed:            acc.speed            + (b.speed            ?? 0),
          hp:               acc.hp              + (b.hp               ?? 0) + (b.hp               && b.tieredBonus ? hpScale  : 0),
          surgesPerDay:     acc.surgesPerDay     + (b.surgesPerDay     ?? 0),
          savingThrowBonus: acc.savingThrowBonus + (b.savingThrowBonus ?? 0),
          skills:           newSkills,
        };
      },
      {
        fortitude: 0, reflex: 0, will: 0, ac: 0, initiative: 0, speed: 0,
        hp: 0, surgesPerDay: 0, savingThrowBonus: 0,
        skills: {} as Record<string, number>,
      },
    );

    const armorClass = calculateAC(armorAcBonus, acAbilityMod, halfLevel, shieldAcBonus) + classAcBonus + magicBonuses.ac + (pb.ac ?? 0) + featBonuses.ac + armorEnhancementBonus + shieldEnhancementBonus + magicArmorDefBonuses.ac;
    const fortitude = calculateFortitude(mods.str, mods.con, halfLevel, cls?.fortitudeBonus ?? 0, humanDefBonus) + classFortBonus + magicBonuses.fortitude + (pb.fortitude ?? 0) + featBonuses.fortitude + magicArmorDefBonuses.fortitude;
    const reflex = calculateReflex(mods.dex, mods.int, halfLevel, cls?.reflexBonus ?? 0, shieldAcBonus, humanDefBonus) + classReflexBonus + magicBonuses.reflex + (pb.reflex ?? 0) + featBonuses.reflex + magicArmorDefBonuses.reflex;
    const will = calculateWill(mods.wis, mods.cha, halfLevel, cls?.willBonus ?? 0, humanDefBonus + racialWillBonus) + classWillBonus + magicBonuses.will + (pb.will ?? 0) + featBonuses.will + magicArmorDefBonuses.will;

    // ── Defense breakdowns ─────────────────────────────────────────────────────
    const totalRacialWillBonus = humanDefBonus + racialWillBonus;
    const racialWillLabel = (() => {
      const parts: string[] = [];
      if (isHuman) parts.push('Human');
      if (character.raceId === 'eladrin') parts.push('Eladrin');
      if (race?.willBonus) parts.push(race.name);
      return parts.length > 0 ? `Racial (${parts.join(' + ')})` : 'Racial';
    })();

    const paragonLabel = paragonPath ? `Paragon (${paragonPath.name})` : 'Paragon';
    const defenseBreakdowns = {
      ac: [
        { label: 'Base',                   value: 10          },
        { label: `Armor (${armorName})`,   value: armorAcBonus },
        ...rowIf(armorEnhancementBonus > 0, `Enhancement (${magicArmorEnchant?.name ?? 'Armor'})`, armorEnhancementBonus),
        ...rowIf(acAbilityMod !== 0, acAbilityLabel, acAbilityMod),
        ...rowIf(shieldAcBonus > 0, `Shield (${shieldName})`, shieldAcBonus),
        ...rowIf(shieldEnhancementBonus > 0, `Enhancement (${magicShieldEnchant?.name ?? 'Shield'})`, shieldEnhancementBonus),
        ...rowIf(classAcBonus > 0, classAcLabel, classAcBonus),
        { label: '½ Level',                value: halfLevel   },
        ...rowIf(magicBonuses.ac > 0, 'Magic items', magicBonuses.ac),
        ...rowIf((pb.ac ?? 0) > 0, paragonLabel, pb.ac!),
        ...rowIf(featBonuses.ac > 0, 'Feats', featBonuses.ac),
        ...rowIf(magicArmorDefBonuses.ac > 0, `Armor property (${magicArmorDefSources.join(', ')})`, magicArmorDefBonuses.ac),
      ],
      fort: [
        { label: 'Base', value: 10 },
        { label: `max(STR ${formatModifier(mods.str)}, CON ${formatModifier(mods.con)})`, value: Math.max(mods.str, mods.con) },
        { label: '½ Level', value: halfLevel },
        ...rowIf((cls?.fortitudeBonus ?? 0) > 0, `Class (${cls?.name ?? ''})`, cls?.fortitudeBonus ?? 0),
        ...rowIf(classFortBonus > 0, classFortLabel, classFortBonus),
        ...rowIf(humanDefBonus > 0, 'Racial (Human)', humanDefBonus),
        ...rowIf(magicBonuses.fortitude > 0, 'Magic items', magicBonuses.fortitude),
        ...rowIf((pb.fortitude ?? 0) > 0, paragonLabel, pb.fortitude!),
        ...rowIf(featBonuses.fortitude > 0, 'Feats', featBonuses.fortitude),
        ...rowIf(magicArmorDefBonuses.fortitude > 0, `Armor property (${magicArmorDefSources.join(', ')})`, magicArmorDefBonuses.fortitude),
      ],
      ref: [
        { label: 'Base', value: 10 },
        { label: `max(DEX ${formatModifier(mods.dex)}, INT ${formatModifier(mods.int)})`, value: Math.max(mods.dex, mods.int) },
        { label: '½ Level', value: halfLevel },
        ...rowIf((cls?.reflexBonus ?? 0) > 0, `Class (${cls?.name ?? ''})`, cls?.reflexBonus ?? 0),
        ...rowIf(classReflexBonus > 0, classReflexLabel, classReflexBonus),
        ...rowIf(shieldAcBonus > 0, `Shield (${shieldName})`, shieldAcBonus),
        ...rowIf(humanDefBonus > 0, 'Racial (Human)', humanDefBonus),
        ...rowIf(magicBonuses.reflex > 0, 'Magic items', magicBonuses.reflex),
        ...rowIf((pb.reflex ?? 0) > 0, paragonLabel, pb.reflex!),
        ...rowIf(featBonuses.reflex > 0, 'Feats', featBonuses.reflex),
        ...rowIf(magicArmorDefBonuses.reflex > 0, `Armor property (${magicArmorDefSources.join(', ')})`, magicArmorDefBonuses.reflex),
      ],
      will: [
        { label: 'Base', value: 10 },
        { label: `max(WIS ${formatModifier(mods.wis)}, CHA ${formatModifier(mods.cha)})`, value: Math.max(mods.wis, mods.cha) },
        { label: '½ Level', value: halfLevel },
        ...rowIf((cls?.willBonus ?? 0) > 0, `Class (${cls?.name ?? ''})`, cls?.willBonus ?? 0),
        ...rowIf(classWillBonus > 0, classWillLabel, classWillBonus),
        ...rowIf(totalRacialWillBonus > 0, racialWillLabel, totalRacialWillBonus),
        ...rowIf(magicBonuses.will > 0, 'Magic items', magicBonuses.will),
        ...rowIf((pb.will ?? 0) > 0, paragonLabel, pb.will!),
        ...rowIf(featBonuses.will > 0, 'Feats', featBonuses.will),
        ...rowIf(magicArmorDefBonuses.will > 0, `Armor property (${magicArmorDefSources.join(', ')})`, magicArmorDefBonuses.will),
      ],
    };

    // Hit Points
    const maxHp = calculateMaxHp(
      cls?.hpAtFirstLevel ?? 12,
      cls?.hpPerLevel ?? 5,
      finalAbilityScores.con,
      character.level,
    ) + featBonuses.hp;
    const bloodiedValue = calculateBloodied(maxHp);
    const isDragonborn = character.raceId === 'dragonborn';
    const healingSurgeValue = calculateHealingSurgeValue(maxHp, mods.con, isDragonborn) + magicBonuses.healingSurgeBonus;
    const surgesPerDay = calculateSurgesPerDay(cls?.healingSurgesPerDay ?? 6, mods.con) + magicBonuses.surgesPerDay + featBonuses.surgesPerDay;

    // Initiative and speed
    const initiative = mods.dex + halfLevel + magicBonuses.initiative + (pb.initiative ?? 0) + featBonuses.initiative + magicArmorInitiativeBonus;
    const speed = (race?.speed ?? 6) + magicBonuses.speed + featBonuses.speed + armorSpeedPenalty + magicArmorSpeedBonus;

    // Saving throw bonus (half-level is NOT added here — 4e saving throws are flat d20, 10+ succeeds;
    // only explicit bonuses from feats, paragon paths, etc. modify the roll)
    const savingThrowBonus = (pb.savingThrowBonus ?? 0) + featBonuses.savingThrowBonus;

    // Skills
    const hasJoaT = character.selectedFeatIds.includes('jack-of-all-trades');
    const skillBreakdowns: Record<string, SkillBreakdown> = {};
    const skillBonuses = SKILLS.reduce<Record<string, number>>((acc, skill) => {
      const isTrained = character.trainedSkills.includes(skill.id);
      const baseRacialBonus = race?.skillBonuses.find((s) => s.skillId === skill.id)?.bonus ?? 0;
      const subraceSkillBonus = subrace?.skillBonuses?.find((s) => s.skillId === skill.id)?.bonus ?? 0;
      const racialBonus = baseRacialBonus + subraceSkillBonus;
      const abilityMod = mods[skill.keyAbility];
      const armorPenalty = skill.armorPenalty ? Math.abs(armorCheckPenalty) : 0;
      // Jack of All Trades: +2 to untrained skills; plus any per-skill feat bonuses (e.g. Alertness → Perception)
      const joatBonus = (hasJoaT && !isTrained) ? 2 : 0;
      const perSkillFeatBonus = featBonuses.skills[skill.id] ?? 0;
      const featBonus = joatBonus + perSkillFeatBonus;
      // Build itemised labels for tooltip
      const featBonusDetails: { label: string; bonus: number }[] = [];
      if (joatBonus > 0) featBonusDetails.push({ label: 'Jack of All Trades', bonus: joatBonus });
      if (perSkillFeatBonus > 0) {
        for (const featId of character.selectedFeatIds) {
          const feat = getFeatById(featId);
          const sb = feat?.bonuses?.skills?.[skill.id];
          if (sb) featBonusDetails.push({ label: feat!.name, bonus: sb });
        }
      }
      const trainedBonus = isTrained ? 5 : 0;
      // Magic armor property bonus for this skill
      const maSkill = magicArmorSkillBonuses[skill.id];
      const itemBonus = maSkill?.bonus ?? 0;
      const itemBonusSource = maSkill?.source;
      const total = calculateSkillBonus(isTrained, abilityMod, halfLevel, racialBonus, featBonus, armorPenalty, itemBonus);
      acc[skill.id] = total;
      skillBreakdowns[skill.id] = { abilityMod, halfLevel, trainedBonus, racialBonus, featBonus, featBonusDetails, armorPenalty, itemBonus, itemBonusSource, total };
      return acc;
    }, {});

    return {
      finalAbilityScores,
      abilityModifiers: mods,
      abilityBreakdowns,
      armorClass,
      fortitude,
      reflex,
      will,
      defenseBreakdowns,
      maxHp,
      bloodiedValue,
      healingSurgeValue,
      surgesPerDay,
      initiative,
      speed,
      skillBonuses,
      skillBreakdowns,
      meleeBasicAttack: mods.str + halfLevel + (equippedWeaponData && !equippedWeaponData.category.includes('Ranged') ? equippedWeaponData.proficiencyBonus + weaponEnhancementBonus : 0),
      rangedBasicAttack: mods.dex + halfLevel + (equippedWeaponData && equippedWeaponData.category.includes('Ranged') ? equippedWeaponData.proficiencyBonus + weaponEnhancementBonus : 0),
      weaponEnhancementBonus,
      equippedWeaponName: equippedWeaponData?.name,
      equippedWeaponDamage: equippedWeaponData?.damage,
      equippedWeaponProficiency: equippedWeaponData?.proficiencyBonus ?? 0,
      savingThrowBonus,
    };
  }, [character]);
}
