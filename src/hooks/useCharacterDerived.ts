import { useMemo } from 'react';
import type { Character, DerivedStats, Ability, AbilityScores, AbilityBreakdownRow, DefenseBreakdownRow, SkillBreakdown } from '../types/character';
import { getRaceById } from '../data/races';
import { getClassById } from '../data/classes';
import { getParagonPathById } from '../data/paragonPaths';
import { getFeatById } from '../data/feats';
import { SKILLS } from '../data/skills';
import { ARMOR } from '../data/equipment/armor';
import { MAGIC_ITEMS } from '../data/equipment/magicItems';
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

    const armorAcBonus = equippedArmorData?.acBonus ?? 0;
    const shieldAcBonus = equippedShieldData?.acBonus ?? 0;
    const armorCheckPenalty = equippedArmorData?.checkPenalty ?? 0;
    const armorName = equippedArmorData?.name ?? 'Cloth (unarmored)';
    const shieldName = equippedShieldData?.name ?? 'Shield';

    // Determine AC ability modifier (some classes use INT or DEX to unarmored AC)
    let acAbilityMod = 0;
    let acAbilityLabel = '';
    let classAcBonus = 0;  // e.g. Avenger Armor of Faith
    let classAcLabel = '';
    const armorType = equippedArmorData?.type ?? 'Cloth';
    const isLightArmor = armorType === 'Cloth' || armorType === 'Leather' || armorType === 'Hide';
    let classReflexBonus = 0; // e.g. Barbarian Agility
    let classReflexLabel = '';
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

    const armorClass = calculateAC(armorAcBonus, acAbilityMod, halfLevel, shieldAcBonus) + classAcBonus + magicBonuses.ac + (pb.ac ?? 0) + featBonuses.ac;
    const fortitude = calculateFortitude(mods.str, mods.con, halfLevel, cls?.fortitudeBonus ?? 0, humanDefBonus) + magicBonuses.fortitude + (pb.fortitude ?? 0) + featBonuses.fortitude;
    const reflex = calculateReflex(mods.dex, mods.int, halfLevel, cls?.reflexBonus ?? 0, shieldAcBonus, humanDefBonus) + classReflexBonus + magicBonuses.reflex + (pb.reflex ?? 0) + featBonuses.reflex;
    const will = calculateWill(mods.wis, mods.cha, halfLevel, cls?.willBonus ?? 0, humanDefBonus + racialWillBonus) + magicBonuses.will + (pb.will ?? 0) + featBonuses.will;

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
        ...rowIf(acAbilityMod !== 0, acAbilityLabel, acAbilityMod),
        ...rowIf(shieldAcBonus > 0, `Shield (${shieldName})`, shieldAcBonus),
        ...rowIf(classAcBonus > 0, classAcLabel, classAcBonus),
        { label: '½ Level',                value: halfLevel   },
        ...rowIf(magicBonuses.ac > 0, 'Magic items', magicBonuses.ac),
        ...rowIf((pb.ac ?? 0) > 0, paragonLabel, pb.ac!),
        ...rowIf(featBonuses.ac > 0, 'Feats', featBonuses.ac),
      ],
      fort: [
        { label: 'Base', value: 10 },
        { label: `max(STR ${formatModifier(mods.str)}, CON ${formatModifier(mods.con)})`, value: Math.max(mods.str, mods.con) },
        { label: '½ Level', value: halfLevel },
        ...rowIf((cls?.fortitudeBonus ?? 0) > 0, `Class (${cls?.name ?? ''})`, cls?.fortitudeBonus ?? 0),
        ...rowIf(humanDefBonus > 0, 'Racial (Human)', humanDefBonus),
        ...rowIf(magicBonuses.fortitude > 0, 'Magic items', magicBonuses.fortitude),
        ...rowIf((pb.fortitude ?? 0) > 0, paragonLabel, pb.fortitude!),
        ...rowIf(featBonuses.fortitude > 0, 'Feats', featBonuses.fortitude),
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
      ],
      will: [
        { label: 'Base', value: 10 },
        { label: `max(WIS ${formatModifier(mods.wis)}, CHA ${formatModifier(mods.cha)})`, value: Math.max(mods.wis, mods.cha) },
        { label: '½ Level', value: halfLevel },
        ...rowIf((cls?.willBonus ?? 0) > 0, `Class (${cls?.name ?? ''})`, cls?.willBonus ?? 0),
        ...rowIf(totalRacialWillBonus > 0, racialWillLabel, totalRacialWillBonus),
        ...rowIf(magicBonuses.will > 0, 'Magic items', magicBonuses.will),
        ...rowIf((pb.will ?? 0) > 0, paragonLabel, pb.will!),
        ...rowIf(featBonuses.will > 0, 'Feats', featBonuses.will),
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
    const initiative = mods.dex + halfLevel + magicBonuses.initiative + (pb.initiative ?? 0) + featBonuses.initiative;
    const speed = (race?.speed ?? 6) + magicBonuses.speed + featBonuses.speed;

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
      const total = calculateSkillBonus(isTrained, abilityMod, halfLevel, racialBonus, featBonus, armorPenalty);
      acc[skill.id] = total;
      skillBreakdowns[skill.id] = { abilityMod, halfLevel, trainedBonus, racialBonus, featBonus, featBonusDetails, armorPenalty, total };
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
      meleeBasicAttack: mods.str + halfLevel,
      rangedBasicAttack: mods.dex + halfLevel,
      savingThrowBonus,
    };
  }, [character]);
}
