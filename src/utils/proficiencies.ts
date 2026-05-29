import type { Character } from '../types/character';
import type { WeaponData } from '../types/gameData';
import { getClassById } from '../data/classes';
import { getParagonPathById } from '../data/paragonPaths';

// Single source of truth for feat-granted weapon proficiencies.
// Keep in sync with src/components/sheet/ProficienciesPanel.tsx if extended.
export const FEAT_WEAPON_PROFICIENCIES: Record<string, string[]> = {
  'weapon-proficiency-bastard-sword': ['Bastard Sword'],
  'weapon-proficiency-greatbow':      ['Greatbow'],
  'dwarven-weapon-training':          ['Throwing Hammer', 'Warhammer'],
  'eladrin-soldier':                  ['Longsword', 'Bastard Sword'],
};

/**
 * Build the list of weapon proficiencies for a character, including:
 *  - Class base proficiencies
 *  - Feat-granted proficiencies (Weapon Proficiency feats, Dwarven Weapon Training, Eladrin Soldier)
 *  - Multiclass feat choices (`mcFeatProficiencyChoices`)
 *  - Paragon path extras (level 11+)
 *  - Class build choices that grant proficiencies (Runepriest Wrathful Hammer, etc.)
 *
 * Entries are a mix of category strings ("Simple melee", "Military melee") and specific weapon
 * names ("Longsword", "Warhammer"). Build-choice proficiencies that target a class of weapons by
 * property (e.g. "Military hammers", "Military maces") are represented as their human-readable
 * labels here for display; the runtime match is performed by `isProficientWithWeapon`.
 */
export function getWeaponProficiencyLabels(character: Character): string[] {
  const cls = getClassById(character.classId);
  const set = new Set<string>(cls?.weaponProficiencies ?? []);

  for (const featId of character.selectedFeatIds) {
    FEAT_WEAPON_PROFICIENCIES[featId]?.forEach((w) => set.add(w));
  }
  for (const prof of Object.values(character.mcFeatProficiencyChoices ?? {})) {
    set.add(prof);
  }
  if (character.level >= 11 && character.paragonPath) {
    const path = getParagonPathById(character.paragonPath);
    path?.bonuses?.extraWeaponProficiencies?.forEach((p) => set.add(p));
  }

  // ── Class build-choice grants ──
  if (character.classId === 'runepriest' && character.runepriestArtistry === 'wrathful') {
    set.add('Military hammers');
    set.add('Military maces');
  }

  return Array.from(set);
}

/**
 * Return true if the character is proficient with the given weapon.
 * Match semantics:
 *  - Exact case-insensitive name match (e.g. "Longsword")
 *  - Exact case-insensitive category match (e.g. "Military melee")
 *  - Property-class proficiencies — "Military hammers" matches Military Melee weapons with the
 *    'Hammer' property; "Military maces" matches Military Melee with the 'Mace' property; same
 *    pattern for "Simple hammers"/"Simple maces" (theoretical — future-proofing).
 */
export function isProficientWithWeapon(character: Character, weapon: WeaponData): boolean {
  const labels = getWeaponProficiencyLabels(character).map((p) => p.toLowerCase());
  const wName = weapon.name.toLowerCase();
  const wCat = weapon.category.toLowerCase();
  const wProps = weapon.properties.map((p) => p.toLowerCase());

  for (const label of labels) {
    if (label === wName || label === wCat) return true;

    // Property-class matches: "<tier> <propertyPlural>" — e.g. "Military hammers" → category 'military melee' + property 'hammer'.
    // Properties listed here must match `WeaponData.properties` values in src/data/equipment/weapons.ts.
    const m = label.match(/^(simple|military|superior)\s+(hammers?|maces?|axes?|bows?|crossbows?|spears?|picks?|flails?|staves|staffs)$/);
    if (m) {
      const tier = m[1]; // simple | military | superior
      const propWord = m[2].replace(/s$/, ''); // hammers → hammer
      // Singularize the property word back to the form used in weapons.ts
      const targetProp = (propWord === 'stave' || propWord === 'staff') ? 'staff' : propWord;
      const tierMatch = wCat.startsWith(tier);
      if (tierMatch && wProps.includes(targetProp)) return true;
    }
  }
  return false;
}
