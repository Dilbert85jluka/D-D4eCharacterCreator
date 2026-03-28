export type Ability = 'str' | 'con' | 'dex' | 'int' | 'wis' | 'cha';

export type PowerUsage = 'at-will' | 'encounter' | 'daily';

export type PowerAction =
  | 'standard'
  | 'move'
  | 'minor'
  | 'free'
  | 'immediate-interrupt'
  | 'immediate-reaction'
  | 'opportunity';

export type Alignment =
  | 'Lawful Good'
  | 'Good'
  | 'Unaligned'
  | 'Evil'
  | 'Chaotic Evil';

export interface AbilityScores {
  str: number;
  con: number;
  dex: number;
  int: number;
  wis: number;
  cha: number;
}

export interface SelectedPower {
  powerId: string;
  used: boolean;
}

export interface SkillBreakdown {
  abilityMod: number;
  halfLevel: number;
  trainedBonus: number;   // 5 if trained, 0 otherwise
  racialBonus: number;
  featBonus: number;      // combined total: JoAT + per-skill feat bonuses (e.g. Alertness)
  /** Itemised breakdown of feat bonuses for tooltip display */
  featBonusDetails: { label: string; bonus: number }[];
  armorPenalty: number;   // positive number (applied as subtraction in total)
  /** Item bonus from equipped magic armor properties */
  itemBonus: number;
  itemBonusSource?: string;
  total: number;
}

export interface RitualScroll {
  id: string;
  ritualId: string;
  name: string;
  level: number;
  componentCost: number;
  keySkill: string;
  acquired: 'purchased' | 'found';
  /** How many copies of this scroll are held; defaults to 1 for existing saved data */
  quantity?: number;
}

export interface RitualBookEntry {
  ritualId: string;
  name: string;
  /** Also the number of pages used by this entry */
  level: number;
  /** True when the character has mastered this ritual and can cast it from the book */
  mastered?: boolean;
}

export interface RitualBook {
  id: string;
  name: string;
  rituals: RitualBookEntry[];
}

/**
 * A physical wizard's spellbook.
 * Wizard gets 1 free as a class feature; additional books cost 50 gp.
 * Each power uses pages equal to its level. Each mastered ritual uses pages equal to its level.
 * Max 128 pages per book.
 */
export interface WizardSpellbook {
  id: string;
  name: string;
  /** Daily + utility power IDs written in this book. Pages used = sum of power levels. */
  powerIds: string[];
  /** Mastered ritual IDs (class-feature grants or later additions) written in this book. */
  ritualIds: string[];
}

export interface EquipmentItem {
  /** Stable unique key for this inventory row (allows multiple copies of same itemId) */
  instanceId?: string;
  itemId: string;
  name: string;
  quantity: number;
  equipped: boolean;
  slot?: string;
  notes?: string;
  /** For armor: ID of the masterwork upgrade applied */
  masterworkId?: string;
  /** For armor: ID of the magic armor enchantment applied */
  magicArmorId?: string;
  /** For armor: selected tier level of the magic armor enchantment */
  magicArmorTier?: number;
  /** For weapons: ID of the magic weapon applied */
  magicWeaponId?: string;
  /** For weapons: selected tier level of the magic weapon */
  magicWeaponTier?: number;
  /** For implements: ID of the magic implement applied */
  magicImplementId?: string;
  /** For implements: selected tier level of the magic implement */
  magicImplementTier?: number;
}

export interface Character {
  // Identity
  id: string;
  createdAt: number;
  updatedAt: number;

  // Basic Info
  name: string;
  playerName: string;
  raceId: string;
  classId: string;
  level: number;
  xp: number;
  levelingMode: 'milestone' | 'xp';
  alignment: Alignment;
  deity: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  build: string;
  eyeColor: string;
  hairColor: string;
  background: string;

  // Languages the character speaks (automatic racial + any chosen bonus language)
  selectedLanguages: string[];

  // Multiclassing — secondary class ID derived from whichever multiclass feat was taken
  multiclassId?: string;

  // Paragon / Epic
  paragonPath: string;
  epicDestiny: string;

  // Ability Scores (base, before racial bonuses)
  baseAbilityScores: AbilityScores;
  /** Racial ability bonus chosen by the player (for races with an option, e.g. +2 INT or WIS) */
  racialAbilityChoiceBonus?: Partial<Record<Ability, number>>;

  // Skills
  trainedSkills: string[];

  // Powers
  selectedPowers: SelectedPower[];

  // Feats
  selectedFeatIds: string[];
  /** Maps featId → chosen skill ID for MC feats granting a class skill choice */
  mcFeatSkillChoices: Record<string, string>;
  /** Maps featId → chosen proficiency string for MC feats granting a proficiency choice */
  mcFeatProficiencyChoices: Record<string, string>;
  /** Maps index (among SIT feat instances in selectedFeatIds) → equipment instanceId for Superior Implement Training. */
  superiorImplementChoices?: Record<number, string>;

  // Equipment
  equipment: EquipmentItem[];
  goldPieces: number;
  silverPieces: number;
  copperPieces: number;

  // Rituals
  ritualScrolls: RitualScroll[];
  ritualBooks: RitualBook[];

  // Wizard: chosen Arcane Implement Mastery option
  arcaneImplement?: 'orb' | 'staff' | 'wand';

  // Warlock: chosen Eldritch Pact
  warlockPact?: 'infernal' | 'fey' | 'star';

  // Sub-race (e.g. Shifter → Longtooth or Razorclaw)
  subraceId?: string;

  // PHB2 class-specific build choices
  avengerCensure?: 'pursuit' | 'retribution';
  barbarianFeralMight?: 'rageblood' | 'thaneborn';
  bardVirtue?: 'cunning' | 'valor';
  druidPrimalAspect?: 'guardian' | 'predator';
  invokerCovenant?: 'preservation' | 'wrath';
  shamanSpirit?: 'protector' | 'stalker';
  sorcererSpellSource?: 'dragon' | 'wild';
  wardenGuardianMight?: 'earthstrength' | 'wildblood';

  // PHB3 class-specific build choices
  ardentMantle?: 'clarity' | 'elation';
  battlemindOption?: 'resilience' | 'speed';
  monkTradition?: 'centered-breath' | 'stone-fist';
  psionDiscipline?: 'telekinesis' | 'telepathy';
  runepriestArtistry?: 'defiant' | 'wrathful';
  seekerBond?: 'bloodbond' | 'spiritbond';

  // Half-Elf Dilettante: bonus at-will from another class
  dilettantePowerId?: string;
  dilettanteClassId?: string;

  // Spellbook
  /** True if character owns a spellbook (wizard class feature, or purchased blank spellbook) */
  hasSpellbook?: boolean;
  /**
   * Physical spellbooks owned by this character. Replaces the legacy flat lists below.
   * Use getAllSpellbookPowerIds() / getAllSpellbookRitualIds() helpers to get the full sets.
   * Wizard gets 1 free (class feature); additional books cost 50 gp each.
   */
  spellbooks?: WizardSpellbook[];
  /**
   * @deprecated Use spellbooks[*].powerIds instead.
   * Kept for backward-compat reads when spellbooks is undefined.
   */
  spellbookPowerIds?: string[];
  /**
   * @deprecated Use spellbooks[*].ritualIds instead.
   * Kept for backward-compat reads when spellbooks is undefined.
   */
  spellbookMasteredRitualIds?: string[];

  // Play-session tracking
  currentHp: number;
  temporaryHp: number;
  actionPoints: number;
  currentSurges: number;
  usedEncounterPowers: string[];
  usedDailyPowers: string[];
  /** Psionic: current power points remaining. Undefined = full pool (defaults to max). */
  currentPowerPoints?: number;
  /** Quick Access Powers tray — up to 9 power IDs pinned for fast combat reference */
  quickTrayPowerIds?: string[];

  // Notes
  notes: string;
  appearance: string;
  personality: string;
  backstory: string;

  // Portrait — base64 JPEG data URL, 150 × 150 px, max ~3 MB original file
  portrait?: string;
}

export interface AbilityBreakdownRow {
  label: string;
  value: number;
}

export type AbilityBreakdowns = Record<Ability, AbilityBreakdownRow[]>;

export interface DefenseBreakdownRow {
  label: string;
  value: number;
}

export interface DefenseBreakdowns {
  ac:   DefenseBreakdownRow[];
  fort: DefenseBreakdownRow[];
  ref:  DefenseBreakdownRow[];
  will: DefenseBreakdownRow[];
}

export interface DerivedStats {
  finalAbilityScores: AbilityScores;
  abilityModifiers: Record<Ability, number>;
  /** Component-by-component breakdown for each ability score (for tooltip display). */
  abilityBreakdowns: AbilityBreakdowns;
  armorClass: number;
  fortitude: number;
  reflex: number;
  will: number;
  /** Component-by-component breakdown for each defense (for tooltip display). */
  defenseBreakdowns: DefenseBreakdowns;
  maxHp: number;
  bloodiedValue: number;
  healingSurgeValue: number;
  surgesPerDay: number;
  initiative: number;
  speed: number;
  skillBonuses: Record<string, number>;
  skillBreakdowns: Record<string, SkillBreakdown>;
  meleeBasicAttack: number;
  rangedBasicAttack: number;
  /** Magic weapon enhancement bonus (from equipped weapon) */
  weaponEnhancementBonus: number;
  /** Name of equipped weapon (for display) */
  equippedWeaponName?: string;
  /** Damage die of equipped weapon */
  equippedWeaponDamage?: string;
  /** Proficiency bonus of equipped weapon */
  equippedWeaponProficiency: number;
  /** Flat bonus added to saving throw rolls (d20, needing 10+ to succeed) */
  savingThrowBonus: number;
}
