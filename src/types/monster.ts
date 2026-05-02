export type MonsterSource = 'mm1' | 'mm2' | 'mm3' | 'dmg' | 'dmg2' | 'mv' | 'mvttnv' | 'dracochromatic' | 'dracometallic' | 'homebrew';

export type MonsterRole =
  | 'Brute'
  | 'Soldier'
  | 'Artillery'
  | 'Lurker'
  | 'Controller'
  | 'Skirmisher'
  | 'Solo'
  | 'Minion';

export type MonsterRoleModifier = 'Elite' | 'Solo' | 'Minion';

export type MonsterSize = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';

export type MonsterOrigin =
  | 'Natural'
  | 'Fey'
  | 'Shadow'
  | 'Elemental'
  | 'Immortal'
  | 'Aberrant'
  | 'Undead'
  | 'Astral';

export type MonsterCreatureType =
  | 'Humanoid'
  | 'Magical Beast'
  | 'Undead'
  | 'Beast'
  | 'Fey'
  | 'Aberrant'
  | 'Elemental'
  | 'Plant'
  | 'Construct'
  | 'Animate'
  | 'Giant'
  | 'Immortal'
  | 'Shadow'
  | 'Ooze';

export interface MonsterPower {
  name: string;
  action: 'Standard' | 'Move' | 'Minor' | 'Free' | 'Triggered' | 'Trait' | 'Aura';
  keywords?: string[];
  recharge?: string; // 'Encounter', 'Recharge 5-6', 'Recharge 4-6', etc.
  description: string;
}

export interface MonsterData {
  id: string;
  name: string;
  source: MonsterSource;
  level: number;
  role: MonsterRole;
  roleModifier?: MonsterRoleModifier;
  xp: number;
  size: MonsterSize;
  origin: MonsterOrigin;
  type: string;        // 'Humanoid', 'Magical Beast', 'Beast', 'Animate', 'Plant', etc.
  keywords?: string[]; // 'Dragon', 'Demon', 'Devil', 'Undead', 'Giant', 'Goblinoid', etc.
  hp: number;
  ac: number;
  fort: number;
  ref: number;
  will: number;
  initiative: number;
  perception: number;
  speed: string;        // '6', '5, fly 8 (clumsy)', 'swim 8', etc.
  senses?: string[];    // 'Darkvision', 'Low-light vision', 'Tremorsense 10', etc.
  resist?: string[];    // '10 fire', '5 cold', etc.
  immune?: string[];    // 'disease', 'poison', 'fear', 'charm', etc.
  vulnerable?: string[]; // '5 radiant', '10 fire', etc.
  powers: MonsterPower[];
  alignment: 'Lawful Good' | 'Good' | 'Unaligned' | 'Evil' | 'Chaotic Evil';
  languages?: string[];
  /** Optional portrait/illustration. Base64 data URL (JPEG). Only set on homebrew monsters. */
  portrait?: string;
  /** Optional flavor description — shown in MonsterModal when present. Homebrew-only field. */
  description?: string;
}

/** Filters for the compendium search */
export interface MonsterFilters {
  sources: MonsterSource[];
  roles: MonsterRole[];
  roleModifiers: ('Standard' | MonsterRoleModifier)[];
  types: MonsterCreatureType[];
  tier: 'all' | 'heroic' | 'paragon' | 'epic';
  query: string;
}
