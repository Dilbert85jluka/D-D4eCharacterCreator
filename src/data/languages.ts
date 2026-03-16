/**
 * D&D 4e Player's Handbook languages.
 *
 * Language rules:
 *  - Every character speaks Common automatically.
 *  - Each race grants additional automatic languages (see race data).
 *  - Races with "Choice of one other" / "One extra language of choice" in their
 *    language list let the player pick one additional language from this list.
 *  - Races with a bonus language choice: Human, Half-Elf, Tiefling.
 *  - All other races have fixed languages with no player choice.
 */

export interface LanguageData {
  id: string;
  name: string;
  /** Typical speakers */
  speakers: string;
}

export const LANGUAGES: LanguageData[] = [
  {
    id: 'common',
    name: 'Common',
    speakers: 'Humans and most civilized races; trade language of the world.',
  },
  {
    id: 'deep-speech',
    name: 'Deep Speech',
    speakers: 'Aberrations — mind flayers, beholders, aboleths, and creatures of the Far Realm.',
  },
  {
    id: 'draconic',
    name: 'Draconic',
    speakers: 'Dragons, dragonborn, and those who study draconic magic.',
  },
  {
    id: 'dwarven',
    name: 'Dwarven',
    speakers: 'Dwarves and denizens of the deep mountain halls.',
  },
  {
    id: 'elven',
    name: 'Elven',
    speakers: 'Elves, eladrin, and half-elves; also used in fey courts.',
  },
  {
    id: 'giant',
    name: 'Giant',
    speakers: 'Giants, ogres, ettins, and other giant-kin.',
  },
  {
    id: 'goblin',
    name: 'Goblin',
    speakers: 'Goblins, hobgoblins, bugbears, and other goblinoids.',
  },
  {
    id: 'primordial',
    name: 'Primordial',
    speakers: 'Elementals and those connected to the Elemental Chaos.',
  },
  {
    id: 'supernal',
    name: 'Supernal',
    speakers: 'Angels, devils, and other immortal beings; the language of the gods.',
  },
  {
    id: 'abyssal',
    name: 'Abyssal',
    speakers: 'Demons and other creatures of the Abyss.',
  },
];

/** Languages that can be chosen as a bonus language (excludes Common, which all characters know). */
export const CHOOSABLE_LANGUAGES: LanguageData[] = LANGUAGES.filter(
  (l) => l.id !== 'common',
);

/**
 * Given a race's language list, return which languages are automatic (granted
 * to every character of that race) and whether the race gets a bonus language
 * choice.
 */
export function parseRaceLanguages(raceLanguages: string[]): {
  automatic: string[];
  hasBonusChoice: boolean;
} {
  const automatic: string[] = [];
  let hasBonusChoice = false;

  for (const lang of raceLanguages) {
    if (lang.toLowerCase().includes('choice') || lang.toLowerCase().includes('extra')) {
      hasBonusChoice = true;
    } else {
      automatic.push(lang);
    }
  }

  return { automatic, hasBonusChoice };
}
