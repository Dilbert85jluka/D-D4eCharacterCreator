import type { Ability, PowerUsage, PowerAction } from './character';
export type { PowerUsage, PowerAction };

export interface RacialSkillBonus {
  skillId: string;
  bonus: number;
}

export interface RacialTrait {
  name: string;
  description: string;
}

/** Sub-race option (e.g. Shifter → Longtooth or Razorclaw) */
export interface SubraceData {
  id: string;
  name: string;
  abilityBonuses: Partial<Record<Ability, number>>;
  abilityBonusOptions?: { amount: number; options: Ability[] };
  skillBonuses?: RacialSkillBonus[];
  traits: RacialTrait[];
  racialPowerIds: string[];
}

export interface RaceData {
  id: string;
  name: string;
  size: 'Small' | 'Medium';
  speed: number;
  vision: 'Normal' | 'Low-light' | 'Darkvision';
  languages: string[];
  /** Always-applied ability bonuses (e.g. Elf always gets +2 DEX) */
  abilityBonuses: Partial<Record<Ability, number>>;
  /** Optional second ability bonus where the player chooses between two options */
  abilityBonusOptions?: { amount: number; options: Ability[] };
  skillBonuses: RacialSkillBonus[];
  traits: RacialTrait[];
  racialPowerIds: string[];
  bonusAtWill?: boolean; // Half-Elf
  bonusFeat?: boolean;   // Human
  bonusSkill?: boolean;  // Human, Eladrin
  /** If set, the bonus skill must be chosen from this list (e.g. Eladrin Education).
   *  If absent, bonus skill is chosen from the class skill list (e.g. Human). */
  bonusSkillOptions?: string[];
  /** If set, the bonus language must be chosen from this specific set (e.g. Goliath: Dwarven or Giant).
   *  If absent, bonus language is chosen from the full CHOOSABLE_LANGUAGES list. */
  bonusLanguageOptions?: string[];
  /** Racial bonus to Will defense (e.g. Goliath Mountain's Tenacity: +1) */
  willBonus?: number;
  /** Sub-race options (e.g. Shifter has Longtooth/Razorclaw). Player must choose one during creation. */
  subraces?: SubraceData[];
}

export interface ClassFeature {
  name: string;
  description: string;
  level: number;
}

export interface ClassData {
  id: string;
  name: string;
  role: 'Controller' | 'Defender' | 'Leader' | 'Striker';
  powerSource: 'Arcane' | 'Divine' | 'Martial' | 'Primal' | 'Psionic';
  keyAbilities: Ability[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  shieldProficiency: boolean;
  implements?: string[];
  hpAtFirstLevel: number;
  hpPerLevel: number;
  healingSurgesPerDay: number;
  fortitudeBonus: number;
  reflexBonus: number;
  willBonus: number;
  trainedSkillCount: number;
  availableSkills: string[];
  /** Skills automatically trained with no player choice (e.g. Rogue → Stealth + Thievery) */
  mandatorySkills?: string[];
  /** Player must choose exactly one from this list as an additional mandatory trained skill (e.g. Ranger → Dungeoneering or Nature) */
  mandatorySkillChoice?: string[];
  atWillPowerCount: number;
  encounterPowerCount: number;
  dailyPowerCount: number;
  features: ClassFeature[];
}

export interface PowerData {
  id: string;
  name: string;
  classId: string;
  level: number;
  usage: PowerUsage;
  /** 'attack' = standard attack power; 'utility' = non-attack support/buff power; 'channel-divinity' = Channel Divinity class feature power. Defaults to 'attack' when omitted. */
  powerType?: 'attack' | 'utility' | 'channel-divinity';
  actionType: PowerAction;
  keywords: string[];
  attackAbility?: Ability;
  defense?: 'AC' | 'Fortitude' | 'Reflex' | 'Will';
  weaponMultiplier?: string;
  requirement?: string;
  trigger?: string;
  target?: string;
  attack?: string;
  hit?: string;
  miss?: string;
  effect?: string;
  special?: string;
  flavor?: string;
  /** True for wizard cantrips (Ghost Sound, Light, Mage Hand, Prestidigitation).
   *  Auto-granted class features — level 0, never consume power slots. */
  cantrip?: boolean;
  /** For warlock pact boon powers: which pact grants this power.
   *  Auto-granted class features — level 0, never consume power slots. */
  pactBoon?: 'infernal' | 'fey' | 'star';
  /** Avenger: which censure grants this auto-grant power */
  censure?: 'pursuit' | 'retribution';
  /** Barbarian: which feral might grants this auto-grant power */
  feralMight?: 'rageblood' | 'thaneborn';
  /** Sorcerer: which spell source grants this auto-grant power */
  sorcererSource?: 'dragon' | 'wild';
}

export interface FeatPrerequisites {
  minLevel?: number;
  race?: string[];
  class?: string[];
  abilities?: Partial<Record<Ability, number>>;
  trainedSkill?: string[];
  proficiency?: string;
  otherFeat?: string;
  /** True if the character must already have taken any multiclass feat */
  anyMulticlassFeat?: boolean;
  /** Deity ID the character must worship (e.g. 'bahamut') */
  deity?: string;
}

/** Passive stat bonuses a feat grants when selected. Applied in useCharacterDerived. */
export interface FeatBonuses {
  /** Flat feat bonus to Fortitude defense */
  fortitude?: number;
  /** Flat feat bonus to Reflex defense */
  reflex?: number;
  /** Flat feat bonus to Will defense */
  will?: number;
  /** Flat feat bonus to AC */
  ac?: number;
  /** Flat feat bonus to initiative checks */
  initiative?: number;
  /** Flat bonus to speed */
  speed?: number;
  /** Extra max HP */
  hp?: number;
  /** Extra healing surges per day */
  surgesPerDay?: number;
  /** Bonus to specific skills — keyed by skill ID (e.g. { perception: 2 }) */
  skills?: Partial<Record<string, number>>;
  /** Flat bonus to all saving throws */
  savingThrowBonus?: number;
  /**
   * If set, the `ac` bonus only applies when the character is wearing this armor type.
   * Matches ArmorData.type (e.g. 'Chainmail', 'Hide', 'Plate', 'Scale').
   * Used for Armor Specialization feats.
   */
  acArmorCondition?: string;
  /**
   * If true, the numeric bonuses above scale upward with character tier:
   *   — defense / ac / initiative bonuses: +1 at 11th level, +1 again at 21st level
   *   — hp bonus: +5 at 11th level, +5 again at 21st level
   *   — speed / surgesPerDay: does NOT scale (always flat)
   * Used for feats like Great Fortitude (+2/+3/+4) and Toughness (+5/+10/+15).
   */
  tieredBonus?: boolean;
}

export interface FeatData {
  id: string;
  name: string;
  tier: 'Heroic' | 'Paragon' | 'Epic';
  prerequisites: FeatPrerequisites;
  benefit: string;
  special?: string;
  /** Passive stat bonuses this feat grants (applied automatically in derived stats) */
  bonuses?: FeatBonuses;
  /** For multiclass feats: the classId of the secondary class this feat enables */
  multiclassFor?: string;
  /** For MC feats: skill ID auto-granted (no choice needed), e.g. 'arcana' for Arcane Initiate */
  mcFixedSkill?: string;
  /** For MC feats: ordered list of proficiency strings the player must pick from */
  mcProficiencyChoices?: string[];
  /** For MC feats: a single fixed proficiency granted (no choice), e.g. 'Hand Crossbow' */
  mcFixedProficiency?: string;
  /** Power IDs granted by this feat (e.g. deity Channel Divinity powers) */
  grantedPowerIds?: string[];
}

export interface SkillData {
  id: string;
  name: string;
  keyAbility: Ability;
  armorPenalty: boolean;
}

export interface WeaponData {
  id: string;
  name: string;
  category: 'Simple Melee' | 'Military Melee' | 'Simple Ranged' | 'Military Ranged' | 'Superior Melee' | 'Superior Ranged';
  proficiencyBonus: number;
  damage: string;
  range?: string;
  properties: string[];
  cost: number;
  weight: number;
}

export type ArmorType = 'Cloth' | 'Leather' | 'Hide' | 'Chainmail' | 'Scale' | 'Plate' | 'Shield';

export interface ArmorData {
  id: string;
  name: string;
  type: ArmorType;
  acBonus: number;
  checkPenalty: number;
  speedPenalty: number;
  minStrength?: number;
  cost: number;
  weight: number;
}

/** Masterwork armor — upgraded base armor with better stats, requires min enhancement */
export interface MasterworkArmorData {
  id: string;
  name: string;
  /** Which base armor category this upgrades */
  baseType: ArmorType;
  acBonus: number;
  checkPenalty: number;
  speedPenalty: number;
  minEnhancement: number;
  weight: number;
  source: string;
  description: string;
}

/** A level tier for magic armor — enhancement bonus + cost at that level */
export interface MagicArmorTier {
  level: number;
  enhancement: number;
  cost: number;
}

/** Magic armor enchantment — layers on top of base armor, providing enhancement bonus + properties/powers */
/** Structured bonuses from magic armor properties — only unconditional bonuses that always apply when equipped */
export interface MagicArmorBonuses {
  /** Flat bonus to skills: key = skill id (e.g. 'endurance'), value = bonus amount */
  skills?: Record<string, number>;
  /** Skill bonus that scales with enhancement: key = skill id, value is always 'enhancement' */
  skillsFromEnhancement?: string[];
  /** Flat bonus to defenses */
  fortitude?: number;
  reflex?: number;
  will?: number;
  ac?: number;
  /** Bonus to initiative */
  initiative?: number;
  /** Bonus to speed */
  speed?: number;
  /** Level-scaled skill bonuses: key = skill id, value = array of [minLevel, bonus] tuples */
  skillsByLevel?: Record<string, [number, number][]>;
}

export interface MagicArmorData {
  id: string;
  name: string;
  description: string;
  /** Which base armor types this enchantment can be applied to (e.g. ['Chain', 'Scale', 'Plate']) */
  armorTypes: ArmorType[] | 'Any' | 'Any shield';
  /** Enhancement bonus target — 'AC' for armor, 'AC and Reflex' for shields */
  enhancementType: string;
  /** Level/enhancement/cost tiers */
  tiers: MagicArmorTier[];
  rarity: 'Common' | 'Uncommon' | 'Rare';
  source: string;
  /** Property text (passive bonuses when worn) */
  property?: string;
  /** Power text (activatable abilities) */
  power?: string;
  /** Structured unconditional bonuses — applied automatically when equipped */
  bonuses?: MagicArmorBonuses;
}

export interface MagicWeaponTier {
  level: number;
  enhancement: number;
  cost: number;
}

export interface MagicWeaponData {
  id: string;
  name: string;
  description: string;
  /** Which weapon types this can be applied to (e.g. ['Axe', 'heavy blade']) or 'Any' / 'Any melee' / 'Any ranged' */
  weaponTypes: string[] | 'Any' | 'Any melee' | 'Any ranged';
  /** Enhancement bonus target — typically 'attack rolls and damage rolls' */
  enhancementType: string;
  /** Critical hit extra damage text */
  critical?: string;
  /** Special rules (e.g. Holy Avenger can be used as holy symbol) */
  special?: string;
  /** Level/enhancement/cost tiers */
  tiers: MagicWeaponTier[];
  rarity: 'Common' | 'Uncommon' | 'Rare';
  source: string;
  /** Property text (passive bonuses when wielded) */
  property?: string;
  /** Power text (activatable abilities) */
  power?: string;
}

// ── Implement types ─────────────────────────────────────────────────────────

export type ImplementType = 'Holy Symbol' | 'Orb' | 'Rod' | 'Staff' | 'Wand' | 'Totem' | 'Ki Focus' | 'Tome';

export interface ImplementData {
  id: string;
  name: string;
  type: ImplementType;
  cost: number;
  weight: number;
  source: string;
  description: string;
}

export interface SuperiorImplementProperty {
  name: string;
  description: string;
}

export interface SuperiorImplementData {
  id: string;
  name: string;
  type: ImplementType;
  cost: number;
  weight: number;
  source: string;
  description?: string;
  properties: SuperiorImplementProperty[];
}

export interface MagicImplementTier {
  level: number;
  enhancement: number;
  cost: number;
}

export interface MagicImplementData {
  id: string;
  name: string;
  type: ImplementType;
  enhancementType: string;
  critical?: string;
  property?: string;
  power?: string;
  description?: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  source: string;
  tiers: MagicImplementTier[];
}

export interface GearData {
  id: string;
  name: string;
  cost: number;
  weight: number;
  description: string;
  costLabel?: string;      // Display override for sub-gp costs (e.g. "1 sp", "1 cp")
  category?: string;       // Sub-category: Gear, Component, Musical Instrument, Food & Drink, Lodging, Mount & Transport
}

export interface ConsumableData {
  id: string;
  name: string;
  level: number;
  category: 'Potion' | 'Elixir' | 'Alchemical' | 'Other';
  effect: string;
  cost: number;
  weight: number;
  /** If the item heals HP when used */
  healType?: 'surge' | 'flat';
  /** surge: bonus HP on top of healing surge value; flat: total flat HP restored */
  healBonus?: number;
}

export interface MagicItemBonuses {
  ac?: number;
  fortitude?: number;
  reflex?: number;
  will?: number;
  initiative?: number;
  speed?: number;
  /** Bonus HP added to each healing surge value */
  healingSurgeBonus?: number;
  /** Extra healing surges per day */
  surgesPerDay?: number;
}

export interface MagicItemData {
  id: string;
  name: string;
  level: number;
  slot: 'head' | 'neck' | 'arms' | 'hands' | 'ring' | 'waist' | 'feet' | 'implement' | 'wondrous';
  /** Enhancement bonus (0 for non-enhancement items) */
  enhancement: number;
  properties: string;
  power?: string;
  cost: number;
  weight: number;
  /** Passive stat bonuses applied when the item is equipped */
  bonuses?: MagicItemBonuses;
}

export interface ParagonPathBonuses {
  /** Flat bonus added to AC once paragon tier is reached */
  ac?: number;
  /** Flat bonus added to Fortitude once paragon tier is reached */
  fortitude?: number;
  /** Flat bonus added to Reflex once paragon tier is reached */
  reflex?: number;
  /** Flat bonus added to Will once paragon tier is reached */
  will?: number;
  /** Flat bonus added to initiative once paragon tier is reached */
  initiative?: number;
  /** Weapon proficiency groups or specific weapons added (e.g. 'Military Melee') */
  extraWeaponProficiencies?: string[];
  /** Armor types added (e.g. 'Plate') */
  extraArmorProficiencies?: string[];
  /** IDs of specific powers granted by this paragon path (e.g. a cleric gaining a paladin power) */
  grantedPowerIds?: string[];
  /** Flat bonus added to all saving throws once paragon tier is reached */
  savingThrowBonus?: number;
}

export interface RitualData {
  id: string;
  name: string;
  level: number;
  /** Ritual category (e.g. Exploration, Warding, Restoration, Divination, Deception, Creation) */
  category: string;
  /** GP cost of material components consumed when casting */
  componentCost: number;
  /** GP cost to purchase a scroll or copy into a ritual book */
  marketPrice: number;
  /** Primary skill used to perform this ritual */
  keySkill: string;
  castingTime: string;
  /** How long the ritual's effect lasts (e.g. '24 hours', 'Permanent', 'Until triggered') */
  duration: string;
  /** Full description of the ritual's effect */
  description: string;
  /** Displayed instead of a plain number when cost is special (e.g. Make Whole) */
  componentNote?: string;
  /** Tiered skill check result table; present only for rituals whose outcome varies with the roll */
  skillCheckTable?: { result: string; effect: string }[];
  /** Class prerequisite for this ritual (e.g. 'Bard' for PHB2 bard rituals) */
  prerequisite?: string;
}

export interface ParagonPathData {
  id: string;
  name: string;
  /** classId required to enter this path; null means any class */
  classId: string | null;
  /** Human-readable prerequisite text, if any beyond the class requirement */
  prerequisite?: string;
  /** Short thematic overview of the path */
  description: string;
  /** Summary of the features and powers this path grants */
  features: string;
  /** Mechanical bonuses applied to the character sheet at level 11+ */
  bonuses?: ParagonPathBonuses;
}
