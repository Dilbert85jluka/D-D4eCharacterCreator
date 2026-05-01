# CLAUDE.md — D&D 4e Character Creator

Project memory file. Read this at the start of every session.

---

## Project Overview

A Progressive Web App (PWA) for D&D 4th Edition character creation and management.
Local-first: primary data in IndexedDB (Dexie.js), with Supabase cloud backup for cross-device sync.
Auth required (magic link email via Supabase). Hosted on Azure (free tier) with IP whitelisting.
Designed for tablet use (touch targets ≥44px, responsive layouts).

**Repository:** `https://github.com/Dilbert85jluka/D-D4eCharacterCreator.git`
**Location:** `C:\Claude\GITHUB\DnD4e\D-D4eCharacterCreator\`
**Dev server:** `npm run dev` → http://localhost:5173 (hot-reload)
**Build:** `npm run build` → outputs to `dist/`
**Preview build:** `npm run preview` → serves `dist/` on http://localhost:4173
**App version:** `1.1.0` — Sourced from `package.json` `version` field, injected at build time via Vite `define` as `__APP_VERSION__` global constant (declared in `src/vite-env.d.ts`). Displayed at the bottom of the sidebar menu. To bump the version, update `package.json` `version` — no other changes needed.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19.1.0 | UI framework |
| TypeScript | 5.7.2 | Type safety |
| Vite | 6.2.0 | Build tool + dev server |
| Tailwind CSS | v4 | Styling (note: v4 syntax differs from v3) |
| Zustand | 5.0.3 | Global state management |
| Dexie.js | 4.0.10 | IndexedDB wrapper for persistence |
| vite-plugin-pwa | 0.21.1 | PWA manifest + service worker |
| uuid | 11.1.0 | ID generation |
| @supabase/supabase-js | latest | Supabase client (auth, database, realtime) |

**Important:** Tailwind CSS v4 is used. Syntax differs from v3 — no `tailwind.config.js`, config is in CSS. Don't suggest v3 patterns.

---

## Directory Structure

```
src/
├── App.tsx                    # Root: routes between views (home/wizard/sheet/etc.)
├── main.tsx                   # Entry point
├── components/
│   ├── layout/                # TopBar, Sidebar, Toast
│   ├── management/            # CharacterList, CharacterListItem, EmptyState
│   ├── magicItems/            # MagicItemModal, RandomItemRoller
│   ├── monsters/              # MonsterModal
│   ├── homebrew/              # HomebrewEditorModal, HomebrewImportModal, EditorLayout, TierEditor, HomebrewBadge, 12 type-specific editors (incl. RaceEditor, ClassEditor)
│   ├── settings/              # ImportExportModal
│   ├── auth/                  # LoginPage.tsx — magic link email sign-in
│   ├── sharing/               # ShareCampaignModal, JoinCampaignModal, LinkCharacterModal, SharedCampaignView, PartyRosterCards
│   ├── dice/                  # DiceRollerModal.tsx — floating dice roller (d2–d20 + d%)
│   ├── sheet/                 # Character sheet panels (23 files — see below)
│   ├── ui/                    # Button, Card, Badge, Modal, RichTextEditor, RichTextDisplay (primitive components)
│   └── wizard/                # CreationWizard, WizardNav, 10 step components, PowerCard
├── data/
│   ├── advancement.ts         # FEAT_LEVELS array + featsEarnedByLevel() — shared source of truth
│   ├── classes/               # 22 class definitions (8 PHB1 + 8 PHB2 + 6 PHB3) + index.ts (getClassById, registerHomebrewClasses/unregisterHomebrewClasses)
│   ├── races/                 # 20 race definitions (8 PHB1 + 5 PHB2 + 4 PHB3 + 3 HotF) + index.ts (getRaceById, registerHomebrewRaces/unregisterHomebrewRaces)
│   ├── powers/                # 22 class power files (8 PHB1 + 8 PHB2 + 6 PHB3) + featPowers.ts + index.ts (query functions)
│   ├── feats/                 # index.ts — 497 feats (161 PHB1 + 132 PHB2 + 172 PHB3 + 32 HotF)
│   ├── equipment/             # weapons, armor, masterworkArmor, magicArmor, magicWeapons, implements, superiorImplements, magicImplements (364 magic), magicItems (788 slot items), consumables, gear + index.ts
│   ├── magicItems/            # potions, scrolls, rings, rods, staves, wands, miscA/G/O, armor, weapons + index.ts
│   ├── monsters/              # mm1.ts, mm2.ts, mm3.ts, dmg.ts, dmg2.ts, mv.ts, mvttnv.ts + index.ts
│   ├── skills.ts
│   ├── deities.ts
│   └── languages.ts
├── db/
│   ├── database.ts            # Dexie schema (7 versions, includes homebrew table)
│   ├── characterRepository.ts # Character CRUD: getAll, getById, create, update, patch, delete
│   ├── campaignRepository.ts
│   ├── sessionRepository.ts
│   ├── encounterRepository.ts
│   └── homebrewRepository.ts  # Homebrew CRUD: getAll, getByContentType, getByCampaignId, create, update, patch, delete
├── lib/
│   ├── supabase.ts            # Supabase client singleton
│   ├── sharingService.ts      # Supabase CRUD: campaigns, members, character summaries
│   ├── summarySync.ts         # extractSummary() + createSyncDebouncer()
│   ├── characterCloudService.ts # Cloud backup: pushCharacterToCloud, pullAllCharactersFromCloud, deleteCloudCharacter
│   ├── campaignCloudService.ts  # Cloud backup: pushCampaignToCloud, pullAllCampaignsFromCloud, deleteCloudCampaign
│   ├── campaignContentSync.ts   # extractPublicContent() + pushCampaignContent() — DM content sync to Supabase
│   ├── homebrewContentSync.ts  # extractHomebrewContent() + pushHomebrewContent() + registerCampaignHomebrew() — homebrew sync to campaigns
│   ├── homebrewCloudService.ts # Cloud backup: pushHomebrewToCloud, pullAllHomebrewFromCloud, deleteCloudHomebrew
│   ├── homebrewExport.ts       # Player-to-player homebrew sharing: buildExport, downloadExport, parseHomebrewImport, prepareImport (skip/replace/duplicate conflict modes)
│   └── imageProcessing.ts      # Shared center-crop-to-square + JPEG scale for portraits + homebrew monster art
├── hooks/
│   ├── useCharacterDerived.ts # Memoized derived stats (modifiers, defenses, HP, skills, feat bonuses)
│   ├── useCharacterSync.ts    # Auto-sync character summary to Supabase (debounced 2s)
│   ├── useRealtimeCampaign.ts # Supabase Realtime subscriptions for campaign updates
│   ├── useCharacterCloudSync.ts # Cloud backup: pull on startup + debounced push on character changes
│   ├── useCampaignCloudSync.ts  # Cloud backup: pull on startup + per-campaign debounced push; watches campaigns/sessions/encounters stores
│   ├── useHomebrewCloudSync.ts  # Cloud backup: pull on startup + debounced push on homebrew changes
│   ├── useCampaignContentSync.ts # Auto-sync public campaign content (desc, notes, sessions) to Supabase
│   └── useHomebrewContentSync.ts # Auto-sync homebrew items to shared campaigns (debounced 3s)
├── pages/
│   ├── HomePage.tsx
│   ├── WizardPage.tsx
│   ├── SheetPage.tsx
│   ├── PortraitPage.tsx
│   ├── MonsterCompendiumPage.tsx
│   ├── MagicItemCompendiumPage.tsx
│   ├── CampaignManagementPage.tsx
│   ├── HomebrewWorkshopPage.tsx   # Homebrew Workshop — create/edit/delete custom content + per-item Export, Export All, Import (player-to-player JSON sharing)
│   └── InstructionsPage.tsx       # User manual (Sidebar → Settings → User Instructions)
├── store/
│   ├── useAppStore.ts         # Navigation, sidebar, toasts, active character
│   ├── useCharactersStore.ts  # Character list CRUD + DB loading
│   ├── useWizardStore.ts      # Multi-step wizard state (persisted to localStorage via Zustand persist)
│   ├── useCampaignsStore.ts
│   ├── useSessionsStore.ts
│   ├── useEncountersStore.ts
│   ├── useAuthStore.ts        # Supabase auth: magic link login/logout, profile
│   ├── useSharingStore.ts    # Shared campaign state: campaigns, members, summaries
│   └── useHomebrewStore.ts   # Homebrew CRUD + data layer registration (syncToDataLayer) + importItems (bulk-put preserving IDs, used by HomebrewImportModal)
├── types/
│   ├── character.ts           # Character, DerivedStats, SelectedPower, EquipmentItem
│   ├── gameData.ts            # RaceData, ClassData, PowerData, FeatData, WeaponData, etc.
│   ├── campaign.ts
│   ├── encounter.ts
│   ├── session.ts
│   ├── magicItem.ts
│   ├── monster.ts
│   ├── wizard.ts
│   ├── sharing.ts             # Profile, SharedCampaign, CampaignMember, CharacterSummary, PublicSession, CampaignContent
│   ├── homebrew.ts            # HomebrewItem, HomebrewContentType, HomebrewDataMap, HOMEBREW_CONTENT_TYPES
│   └── supabase.ts            # Database type definitions for Supabase client
└── utils/
    ├── abilityScores.ts       # Point-buy, modifier calculations
    ├── defenses.ts            # AC, Fort, Ref, Will
    ├── diceSound.ts           # Web Audio API dice-roll sound synthesis (no audio files)
    ├── hitPoints.ts           # HP, bloodied, healing surges
    ├── skillUtils.ts          # Skill bonus calculations
    ├── psionics.ts            # Psionic augmentation: isPsionicClass, getMaxPowerPoints, parseAugments
    ├── spellbook.ts           # Wizard spellbook helpers: page counts, ID aggregation, best-book finder
    ├── powerText.ts           # substituteMods() — replaces "Dexterity modifier" with "3 (Dexterity modifier)" in power text
    ├── magicArmorPowers.ts    # parseMagicArmorPower() — converts magic armor power text to PowerData for display in Powers/Actions tabs
    ├── magicWeaponPowers.ts   # parseMagicWeaponPower() — converts magic weapon power text to PowerData for display in Powers/Actions tabs
    ├── magicImplementPowers.ts # parseMagicImplementPower() — converts magic implement power text to PowerData for display in Powers/Actions tabs
    ├── magicItemPowers.ts     # parseMagicItemPower() — converts magic item (head/neck/arms/hands/ring/waist/feet/companion/wondrous) power text to PowerData; supports At-Will/Encounter/Daily
    └── fullDiscipline.ts      # isFullDisciplinePower() + extractMovementTechnique() — splits monk Full Discipline powers into Attack + Movement technique PowerData
```

---

## Core Data Types

### Character (src/types/character.ts)

```typescript
type Ability = 'str' | 'con' | 'dex' | 'int' | 'wis' | 'cha';
type PowerUsage = 'at-will' | 'encounter' | 'daily';   // 'utility' removed — see Power Types below
type Alignment = 'Lawful Good' | 'Good' | 'Unaligned' | 'Evil' | 'Chaotic Evil';

interface SelectedPower { powerId: string; used: boolean; }
interface EquipmentItem {
  instanceId?: string;   // For duplicate items
  itemId: string;
  name: string;
  quantity: number;
  equipped: boolean;
  slot?: string;
  notes?: string;
  masterworkId?: string;     // Masterwork upgrade ID (overrides base armor stats)
  magicArmorId?: string;     // Magic armor enchantment ID (adds enhancement bonus to AC)
  magicArmorTier?: number;   // Selected tier level (determines +N and cost)
  magicWeaponId?: string;    // Magic weapon ID (adds enhancement bonus to attack/damage)
  magicWeaponTier?: number;  // Selected tier level (determines +N and cost)
  magicImplementId?: string; // Magic implement enchantment ID
  magicImplementTier?: number; // Selected tier level (determines +N and cost)
  magicItemTier?: number;      // For magic items (head/neck/arms/hands/ring/waist/feet/companion/wondrous): selected tier level
}

interface Character {
  id: string;
  createdAt / updatedAt: string;   // ISO timestamps
  // Basic info
  name, playerName, raceId, classId: string;
  level: number;                   // 1–30
  xp: number;
  alignment: Alignment;
  deity, gender, age, height, weight, build, eyeColor, hairColor, background: string;
  selectedLanguages: string[];
  paragonPath, epicDestiny: string;
  // Class-specific choices (set during wizard, stored permanently)
  arcaneImplement?: 'orb' | 'staff' | 'wand';   // Wizard only
  warlockPact?: 'infernal' | 'fey' | 'star';    // Warlock only
  fighterCombatStyle?: 'superiority' | 'agility'; // Fighter only — Combat Superiority (PHB) or Combat Agility (Martial Power 2 houserule)
  // PHB2 class build choices
  avengerCensure?: 'pursuit' | 'retribution';
  barbarianFeralMight?: 'rageblood' | 'thaneborn';
  bardVirtue?: 'cunning' | 'valor';
  druidPrimalAspect?: 'guardian' | 'predator';
  invokerCovenant?: 'preservation' | 'wrath';
  shamanSpirit?: 'protector' | 'stalker';
  sorcererSpellSource?: 'dragon' | 'wild' | 'storm';
  wardenGuardianMight?: 'earthstrength' | 'wildblood';
  // PHB3 class build choices
  ardentMantle?: 'clarity' | 'elation';
  battlemindOption?: 'resilience' | 'speed';
  monkTradition?: 'centered-breath' | 'stone-fist';
  psionDiscipline?: 'telekinesis' | 'telepathy';
  runepriestArtistry?: 'defiant' | 'wrathful';
  seekerBond?: 'bloodbond' | 'spiritbond';
  // Subrace (Shifter only for now)
  subraceId?: string;              // e.g. 'longtooth' or 'razorclaw' for Shifter
  // Half-Elf Dilettante (set during wizard, editable on sheet)
  dilettantePowerId?: string;      // ID of the chosen at-will power from another class
  dilettanteClassId?: string;      // ID of the source class for the dilettante power
  // Stats
  baseAbilityScores: AbilityScores;         // Before racial bonuses
  racialAbilityChoiceBonus: Partial<AbilityScores>;
  trainedSkills: string[];
  selectedFeatIds: string[];
  mcFeatSkillChoices: Record<string, string>;        // featId → chosen skill ID
  mcFeatProficiencyChoices: Record<string, string>;  // featId → chosen proficiency string
  superiorImplementChoices?: Record<number, string>;  // SIT feat index → equipment instanceId
  selectedPowers: SelectedPower[];
  equipment: EquipmentItem[];
  goldPieces, silverPieces, copperPieces: number;
  // Session tracking
  currentHp: number;
  temporaryHp: number;
  actionPoints: number;
  currentSurges: number;
  usedEncounterPowers: string[];   // Array of powerIds
  usedDailyPowers: string[];
  secondWindUsed?: boolean;        // Resets on short/extended rest
  quickTrayPowerIds?: string[];    // Up to 9 pinned power IDs for quick access tray
  // Wizard spellbook (wizard only)
  hasSpellbook?: boolean;
  spellbooks?: WizardSpellbook[];              // Canonical multi-book structure (new)
  /** @deprecated Use spellbooks[*].powerIds — kept for backward compat */
  spellbookPowerIds?: string[];
  /** @deprecated Use spellbooks[*].ritualIds — kept for backward compat */
  spellbookMasteredRitualIds?: string[];
  // Freeform
  notes, appearance, personality, backstory: string;
  portrait: string;               // Base64 JPEG data URL, 150×150px max ~3MB
}

interface WizardSpellbook {
  id: string;
  name: string;
  powerIds: string[];    // Daily + utility power IDs in this book; pages = sum of power levels
  ritualIds: string[];   // Mastered ritual IDs in this book; pages = sum of ritual levels
}
```

### PowerData (src/types/gameData.ts)

```typescript
interface PowerData {
  id: string;          // e.g. 'fighter-cleave', 'cleric-sacred-flame'
  name: string;
  classId: string;     // e.g. 'fighter', 'cleric'
  level: number;
  usage: 'at-will' | 'encounter' | 'daily';   // frequency of use
  powerType?: 'attack' | 'utility' | 'channel-divinity';  // omitted = attack; utility = non-attack buff/support
  actionType: 'standard' | 'move' | 'minor' | 'free' | 'immediate-interrupt' | 'immediate-reaction' | 'opportunity';
  range?: string;      // e.g. 'Melee weapon', 'Ranged 10', 'Close burst 2', 'Close blast 3', 'Area burst 1 within 10 squares', 'Personal'
  keywords: string[];
  attackAbility?: Ability;
  defense?: 'AC' | 'Fortitude' | 'Reflex' | 'Will';
  target?: string;
  attack?: string;
  hit?: string;
  miss?: string;
  effect?: string;
  // Multi-stage attack chains (e.g. Thunder Ram Assault, Ferocious Maul) — all optional.
  // PowerCard renders each stage as its own block with a left-border accent + uppercase header.
  secondaryTarget?: string;
  secondaryAttack?: string;
  secondaryHit?: string;
  secondaryMiss?: string;
  secondaryEffect?: string;
  tertiaryTarget?: string;
  tertiaryAttack?: string;
  tertiaryHit?: string;
  tertiaryMiss?: string;
  tertiaryEffect?: string;
  special?: string;
  trigger?: string;
  requirement?: string;
  flavor?: string;
  // Class-specific auto-grant flags
  cantrip?: boolean;                           // Wizard only — auto-granted by arcaneImplement choice; not selectable
  pactBoon?: 'infernal' | 'fey' | 'star';     // Warlock only — auto-granted by warlockPact choice; not selectable
}
```

**Wizard cantrips** and **Warlock pact boon powers** are auto-granted at character creation — they do NOT count against power selection slots. They are filtered out of power pickers and displayed separately:
- Cantrips shown in PowersPanel At-Will tab (no remove button)
- Pact boon shown in PowersPanel At-Will tab (no remove button)
- Both are also displayed in their dedicated sub-panels (ArcaneImplementMasteryPanel, EldritchPactPanel)

### Power Query Functions (src/data/powers/index.ts)

```typescript
getPowerById(id: string): PowerData | undefined
getPowersByClass(classId, usage?, level?): PowerData[]          // Exact level match
getPowersByClassUpToLevel(classId, characterLevel, usage?): PowerData[]  // level <= characterLevel
```

---

## D&D 4e Game Rules Implemented

### Classes (22 total — 8 PHB1 + 8 PHB2 + 6 PHB3)
**PHB1:** fighter, rogue, wizard, cleric, ranger, paladin, warlord, warlock
**PHB2:** avenger, barbarian, bard, druid, invoker, shaman, sorcerer, warden
**PHB3:** ardent, battlemind, monk, psion, runepriest, seeker

Each class defines: role, powerSource, keyAbilities, HP, healingSurges, defenseBonus, skills, powerCounts, features, mandatorySkills, mandatorySkillChoice.

### Races (20 total — 8 PHB1 + 5 PHB2 + 4 PHB3 + 3 HotF)
**PHB1:** dragonborn, dwarf, eladrin, elf, half-elf, halfling, human, tiefling
**PHB2:** deva, gnome, goliath, half-orc, shifter (longtooth/razorclaw sub-races)
**PHB3:** githzerai, minotaur, shardmind, wilden
**HotF:** hamadryad, pixie, satyr

Half-Elf gets a bonus at-will power (Dilettante — see section below). Human gets bonus feat + bonus skill.

Each race defines: size, speed, vision, languages, abilityBonuses, abilityBonusOptions, skillBonuses, traits (with source + conditional flags), racialPowerIds, fortitudeBonus, reflexBonus, willBonus, initiativeBonus, surgesPerDayBonus, bonusFeat, bonusSkill, bonusAtWill, bonusSkillOptions, bonusLanguageOptions, subraces.

### Power Progression (Full 30 levels — all 22 classes)

| Type | Gained at levels |
|---|---|
| Encounter | 1, 3, 7, 13, 17, 23, 27 |
| Daily | 1, 5, 9, 15, 19, 25, 29 |
| Utility | 2, 6, 10, 16, 22 |

At-will count = class base (usually 2) + 1 if Half-Elf.

Power slot counts by level:
- **Encounter:** L1=1, L3=2, L7=3, L13=4, L17=5, L23=6, L27=7
- **Daily:** L1=1, L5=2, L9=3, L15=4, L19=5, L25=6, L29=7
- **Utility:** L2=1, L6=2, L10=3, L16=4, L22=5

Damage scaling convention: Heroic (1–10) = 1–2[W], Paragon (11–20) = 3[W], Epic (21–30) = 4[W]+.

### Feat Schedule (D&D 4e PHB p.29) — CRITICAL

**Do NOT use `character.level` as the feat count.** Feats are NOT granted every level.
The correct grant levels (shared constant in `src/data/advancement.ts`):

```typescript
// src/data/advancement.ts
export const FEAT_LEVELS: readonly number[] = [
  1, 2, 4, 6, 8, 10,       // Heroic Tier  (6 feats by L10)
  11, 12, 14, 16, 18,       // Paragon Tier (5 more, 11 total by L18)
  21, 22, 24, 28, 30,       // Epic Tier    (5 more, 16 total by L30)
];

export function featsEarnedByLevel(level: number): number {
  return FEAT_LEVELS.filter((l) => l <= level).length;
}
```

**Absent at:** encounter-power levels (3,7,13,17,23,27), daily-power levels (5,9,15,19,25,29), paragon/epic capstones (20,26).
Human gets +1 bonus feat (handled by `expectedFeatCount` in FeatsPanel.tsx).
Both `LevelUpModal.tsx` and `FeatsPanel.tsx` import from `advancement.ts` — never duplicate this constant locally.

### Feats Data (src/data/feats/index.ts) — 497 feats (161 PHB1 + 132 PHB2 + 172 PHB3 + 32 HotF)

| Source | Heroic | Paragon | Epic | Total |
|---|---|---|---|---|
| PHB1 | 95 | 49 | 17 | 161 |
| PHB2 | 70 | 39 | 23 | 132 |
| PHB3 | 89 | 52 | 31 | 172 |
| HotF | 28 | 3 | 1 | 32 |
| **Combined** | **282** | **143** | **72** | **497** |

All 497 feats have accurate benefit text sourced from the iws.mx raw database (`feat/_listing.js` + `feat/_index.js`).
PHB2 feats include 8 multiclass feats (one per PHB2 class) with `multiclassFor` field, plus class-specific, race-specific, and general feats.
PHB3 feats include 6 multiclass feats (one per PHB3 class) with `multiclassFor` field.
HotF feats include 3 multiclass feats (barbarian, druid, bard/wizard) with `multiclassFor` field, plus race-specific feats for pixie, hamadryad, satyr, gnome, eladrin, elf, and wilden.

**Exports:** `FEATS`, `getFeatById`, `getMulticlassId`, `featMeetsPrerequisites`, `isFeatRepeatable`

```typescript
featMeetsPrerequisites(
  feat: FeatData,
  raceId: string,
  classId: string,
  trainedSkills: string[],
  selectedFeatIds: string[],
  level: number,
  abilityScores?: Record<string, number>,
  deity?: string
): boolean
```

The `special` field on FeatData stores the raw prerequisite string from iws.mx. Structured `prerequisites` object is parsed from it (abilities, race, class, trainedSkill, minLevel, anyMulticlassFeat, deity).

### FeatBonuses — Passive Mechanical Bonuses (src/types/gameData.ts)

Feats with flat, unconditional stat bonuses carry a `bonuses?: FeatBonuses` field. These are automatically summed and applied in `useCharacterDerived.ts`.

```typescript
interface FeatBonuses {
  fortitude?: number;      // e.g. Great Fortitude
  reflex?: number;         // e.g. Lightning Reflexes
  will?: number;           // e.g. Iron Will
  ac?: number;             // e.g. Armor Specialization (conditional — see acArmorCondition)
  initiative?: number;     // e.g. Improved Initiative: +4
  speed?: number;          // e.g. Fleet-Footed: +1
  hp?: number;             // e.g. Toughness: +5/+10/+15
  surgesPerDay?: number;   // e.g. Durable: +2
  skills?: Record<string, number>;  // e.g. Alertness: { perception: 2 }
  savingThrowBonus?: number;        // e.g. Human Perseverance: +1
  acArmorCondition?: string;        // Armor type required for ac bonus (e.g. 'Chainmail', 'Plate')
  tieredBonus?: boolean;   // If true: defense/ac bonuses +1 at L11 and L21; hp bonus +5 at L11 and L21
}
```

**Feats with bonuses populated:**

| Feat | Bonuses |
|---|---|
| Alertness | `{ skills: { perception: 2 } }` |
| Durable | `{ surgesPerDay: 2 }` |
| Great Fortitude | `{ fortitude: 2, tieredBonus: true }` → +2/+3/+4 |
| Improved Initiative | `{ initiative: 4 }` |
| Iron Will | `{ will: 2, tieredBonus: true }` → +2/+3/+4 |
| Lightning Reflexes | `{ reflex: 2, tieredBonus: true }` → +2/+3/+4 |
| Toughness | `{ hp: 5, tieredBonus: true }` → +5/+10/+15 |
| Human Perseverance | `{ savingThrowBonus: 1 }` |
| Fleet-Footed (Paragon) | `{ speed: 1 }` |
| Armor Specialization (Chainmail/Hide/Plate/Scale) | `{ ac: 1, acArmorCondition: 'Type' }` |

**Note on Skill Focus:** The feat requires choosing a trained skill per instance and can be taken multiple times. No structured `bonuses` field is assigned — it is not yet automatically applied. Future work would require `featChoices: Record<string, string>` on Character to track the per-instance skill choice.

**Repeatable Feats:** Some feats (Superior Implement Training, Skill Focus, Weapon Focus, etc.) can be taken multiple times. Detected by `isFeatRepeatable(feat)` which checks for "more than once" in the feat's special/benefit text. `selectedFeatIds` can contain duplicate entries for repeatable feats. `FeatsPanel`, `Step7_Feats`, and `LevelUpModal` all allow re-selecting repeatable feats. Removal uses `indexOf` + splice (removes one instance, not all).

**Superior Implement Training:** Each instance of this feat is associated with a specific superior implement from the character's inventory via `superiorImplementChoices: Record<number, string>` on Character (maps SIT feat index → equipment instanceId). Constraints: one implement per feat instance, one feat per implement, no two instances can share the same base implement type (e.g., can't have two instances both linked to Holy Symbol).

### Feat-Granted Powers (FeatData.grantedPowerIds)

Some feats grant structured powers that appear as PowerCards on the character sheet. These feats carry a `grantedPowerIds?: string[]` field pointing to `PowerData` entries in `src/data/powers/featPowers.ts`.

Currently implemented: **11 deity Channel Divinity feats** (PHB1). Each grants an encounter power with `keywords: ['Channel Divinity', 'Divine']`, `classId: 'feat'`, `level: 0`. These share the per-encounter CD resource with class CD powers.

| Feat | Deity | Power ID | Action Type |
|---|---|---|---|
| Armor of Bahamut | bahamut | `feat-armor-of-bahamut` | Immediate Interrupt |
| Avandra's Rescue | avandra | `feat-avandras-rescue` | Move |
| Corellon's Grace | corellon | `feat-corellons-grace` | Immediate Interrupt |
| Harmony of Erathis | erathis | `feat-harmony-of-erathis` | Minor |
| Ioun's Poise | ioun | `feat-iouns-poise` | Minor |
| Kord's Favor | kord | `feat-kords-favor` | Free |
| Melora's Tide | melora | `feat-meloras-tide` | Minor |
| Moradin's Resolve | moradin | `feat-moradins-resolve` | Minor |
| Pelor's Radiance | pelor | `feat-pelors-radiance` | Standard |
| Raven Queen's Blessing | raven-queen | `feat-raven-queens-blessing` | Free |
| Sehanine's Reversal | sehanine | `feat-sehanines-reversal` | Free |

Feat-granted powers are collected in:
- **ActionsByTypePanel** `collectAllPowers()` — grouped by action type with ⚡ pin + usage toggle
- **PowersPanel** Encounter tab — shown with "Feat" badge, ⚡ pin button, usage toggle (no remove button)
- **ChannelDivinityPanel** — merged into CD pool, shares per-encounter use

### Ability Scores
Three methods supported in wizard Step 4:
1. **Customizing Scores (Point Buy):** Two-phase flow — Phase 1: assign starting values from pool [10, 10, 10, 10, 10, 8] via dropdowns (each value used once). Phase 2: +/- buttons to spend 22 points (costs: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=5, 15=8, 16=9, 17=12, 18=16). `pointBuyStartingSet` flag tracks phase transition.
2. **Standard Array:** Assign values [16, 14, 13, 12, 11, 10] to abilities via dropdowns. All start unassigned (0/"--").
3. **Rolling Scores:** Roll 4d6 drop lowest for 6 scores. Multiple roll groups supported; assign via dropdowns; apply chosen group.

All methods start with `baseAbilityScores` at 0 (unassigned). `canProceed` Step 4 requires all 6 abilities > 0; point buy additionally requires `pointBuyStartingSet === true`.
Racial bonuses applied on top of base scores.

### Defenses
- **AC** = 10 + armor bonus (base or masterwork) + shield + armor enhancement bonus + shield enhancement bonus + level/2 + magic item bonus + paragon bonus + feat bonus
- **Fortitude/Reflex/Will** = 10 + class bonus + ability mod + half level + magic item bonus + paragon bonus + feat bonus
- Defense breakdowns in `useCharacterDerived.ts` include a "Feats" row when feat bonus > 0

### HP
- Max HP = class base at L1 + (hpPerLevel × (level - 1)) + Constitution modifier + feat bonus (Toughness)
- Bloodied = maxHp / 2
- Healing surge value = maxHp / 4
- Surges per day = class base + Constitution modifier + feat bonus (Durable)

---

## Dice Roller (src/components/dice/DiceRollerModal.tsx)

Floating action button (🎲) fixed bottom-right on the character sheet. Opens a modal with:

- **8 dice:** d20, d12, d10, d% (percentile), d8, d6, d4, d2 — in a 2×4 grid
- **Quantity selector:** +/− buttons per die type, 0–10
- **Roll:** Counts reset to 0 immediately; dice sound plays; "Rolling…" shown for ~2.2 s while sound plays; results appear after sound finishes
- **Results:** Individual roll chips, color-coded per die type; large total at bottom
- **Clear:** Resets results and counts

### Key implementation notes
- `colorMap` lookup object holds all Tailwind class strings statically (Tailwind v4 requirement — no template literals)
- Results are computed eagerly (before counts reset) then revealed via `setTimeout(…, 2200)` to sync with sound
- Modal triggered from `CharacterSheet.tsx` local state (`showDiceRoller`)
- `z-40` for FAB, `z-50` for modal overlay (consistent with other modals)

### RULE: Always play dice sound when rolling
**Whenever any dice are rolled anywhere in the app, `playDiceRollSound()` from `src/utils/diceSound.ts` MUST be called.**
- Pass the total number of dice being rolled so the sound density scales correctly
- For a single d20 (skill checks, saving throws, attack rolls) pass `1`
- The function uses Web Audio API synthesis — no audio files, works fully offline
- Never add a new roll mechanic without importing and calling `playDiceRollSound`

---

## Sheet Components (src/components/sheet/)

### Tab Structure

**Main tabs (CharacterSheet.tsx):** Actions · Powers · Feats · Features · Paragon · Inventory

| Main Tab | Sub-tabs |
|---|---|
| Actions | Available Actions · Actions Descriptions |
| Powers | Powers · Channel Divinity\* · Discipline Powers\*\*\*\*\* · Implement Mastery\*\* · Eldritch Pact\*\*\* (sub-tab bar hidden when only the base Powers tab is present) |
| Feats | (no sub-tabs) |
| Features | Class Features · Racial Features · Proficiencies · Profile · Notes |
| Paragon | (no sub-tabs) |
| Inventory | Coin Purse · Equipment · Rituals · Spellbooks\*\*\*\* |

\* Channel Divinity: cleric + paladin only
\*\* Implement Mastery: wizard only
\*\*\* Eldritch Pact: warlock only
\*\*\*\* Spellbooks: wizard only (and any class that purchased a spellbook)
\*\*\*\*\* Discipline Powers: psion + ardent + battlemind

### Panel Files

| File | Purpose |
|---|---|
| ReadOnlyContext.ts | `ReadOnlyContext` + `useReadOnly()` hook — consumed by 11 panels to hide/disable edit controls when `readOnly` prop is true |
| CharacterSheet.tsx | Main tab container — 6 top-level tabs with sub-tab routing; accepts `readOnly` prop, wraps in `ReadOnlyContext.Provider` |
| SheetHeader.tsx | Character header bar — mobile-first layout. Top row: portrait + name + ▼/▲ Info toggle button. Collapsible info section (race/class/tier, role/size/initiative/vision, player identity, alignment/deity/leveling, XP bar) — default expanded, collapses to save vertical space. Action buttons row (always visible, `flex-wrap`): Speed badge, Level badge, Level Up, Short Rest, Extended Rest, Initiative, Saving Throw. Roll result boxes drop upward (`bottom-full`) to avoid overlapping content below; rolling one clears the other's result so they never overlap. |
| AbilityBlock.tsx | Six ability scores with +/- adjusters, hover breakdown panel, click-to-roll |
| DefensesBlock.tsx | AC, Fort, Ref, Will in 2×2 grid |
| HitPointsBlock.tsx | HP/bloodied/surge tracker with rest buttons; Power Points row for psionic classes |
| SkillsPanel.tsx | All 17 skills with trained/untrained indicators. Click a skill to roll d20 + bonus; result card renders **inline above the rolled skill** (tracked by `skillId`) so you never lose sight of what you rolled — auto-dismisses after 4 seconds or click × to clear. |
| CombatActionsPanel.tsx | Weapon attack cards from equipped weapons (Actions → Available Actions, top section); Fighter Weapon Talent +1 attack bonus applied when proficient; feat-based weapon damage bonuses (Dwarven Weapon Training +2 axes/hammers, Eladrin Soldier +2 longswords/spears, Goliath Greatweapon Prowess +2/+3/+4 two-handed melee) shown in damage breakdown |
| ActionsByTypePanel.tsx | Read-only power cards grouped by action type with 5 sub-tabs: Standard, Minor, Move, Immediate (interrupt + reaction), Free. Powers collected from selectedPowers + level 0 class powers + dilettante + racial powers + feat-granted powers + equipment powers. Encounter/daily powers toggleable (used/available) with circle button, synced to DB. No remove button. Rendered inside a "POWER ACTIONS" header card in `CharacterSheet.tsx` (Actions → Available Actions, below Combat Actions and Second Wind). |
| AvailableActionsPanel.tsx | PHB p.289 "Actions in Combat" reference table — 7 category tabs: Standard, Move, Minor, Free, Immediate Interrupts, Immediate Reactions, Opportunity (Actions → Actions Descriptions) |
| StandardActionsPanel.tsx | Second Wind encounter action card with usage toggle circle. Rendered inline between Combat Actions and Power Actions on the Available Actions tab (no longer has its own sub-tab). Shows healing surge value, +2 defense bonus, surges remaining. Dwarf auto-shows "Minor Action" via Dwarven Resilience. `secondWindUsed?: boolean` on Character, reset on short/extended rest. |
| ProficienciesPanel.tsx | Shows all proficiencies (armor, weapons, shields, implements) sourced from class + feats + MC feat choices (Features → Proficiencies) |
| PowersPanel.tsx | At-will / Encounter / Daily tabs with picker modal. Utility powers appear within encounter/daily tabs. Auto-shows wizard cantrip and warlock pact boon (no remove button). Racial powers shown with emerald "Race" badge, ⚡ pin, usage toggle. |
| ChannelDivinityPanel.tsx | Channel Divinity powers for cleric/paladin; Encounter/At-Will sub-tabs |
| DisciplinePowersPanel.tsx | Psion discipline powers + Ardent mantle powers + Battlemind psionic study/defense powers; encounter powers per discipline/mantle/study; Battlemind also shows 3 Psionic Defense at-will powers (teal-themed, no Use button); individually tracked; dynamic labels ("Discipline Powers" for psion, "Ardent Powers" for ardent, "Battlemind Powers" for battlemind) |
| ArcaneImplementMasteryPanel.tsx | Shows all 3 implement options; chosen one highlighted; full encounter power text |
| EldritchPactPanel.tsx | Shows all 3 pact options; chosen one highlighted amber; pact lore + boon trigger/effect |
| ClassFeaturesPanel.tsx | All class features for chosen class; enhanced detail for wizard implement + warlock pact choices. Wrapped in the standard maroon (amber-800) "CLASS FEATURES" header card with the class name as the subtitle (Features → Class Features). |
| RacialFeaturesPanel.tsx | Racial traits with source badges + conditional indicators, racial stat summary, racial power cards, subrace support. Wrapped in the standard maroon "RACIAL FEATURES" header card. Racial Summary uses the same card-grid layout as Profile → Appearance: `grid grid-cols-2 gap-2` of `bg-stone-50` cards; single-value rows span 1 column, multi-value rows span both (Features → Racial Features). |
| FeatsPanel.tsx | Feats list with picker modal — uses `featsEarnedByLevel()` for correct budget; "Eligible only" toggle (default ON); alphabetical sort. Top-level tab (Feats), no longer a sub-tab under Powers. |
| ParagonPanel.tsx | Paragon Path tab: locked state (< L11), selected path details, alternate paths |
| EquipmentPanel.tsx | Multi-tab equipment (weapons/implements/armor/magic/consumables/gear) with collapsible sub-groups in picker |
| CurrencyPanel.tsx | Gold/silver/copper |
| RitualsPanel.tsx | Ritual scroll shop + ritual book; BuyScrollModal; AddToBookModal; skill check table display |
| SpellbookPanel.tsx | Wizard multi-spellbook UI (Inventory → Spellbooks tab). Per-book cards with page bar, rename, delete. Prepare/unprepare daily and utility powers. Mastered ritual management. Buy additional books (50 gp). Auto-migrates legacy flat data to `spellbooks[]` on first open. |
| NotesPanel.tsx | Notes-only panel (Profile content split out to ProfilePanel). Uses TipTap `RichTextEditor` (bold, italic, headings, lists, links, tables, etc.); read-only mode renders via `RichTextDisplay`. Rendered as Features → Notes sub-tab. |
| ProfilePanel.tsx | Split out of NotesPanel. Shows appearance (gender/age/height/weight/build/eye color/hair color — card grid), selected languages (pill chips), and background (rendered via `RichTextDisplay` for rich HTML). Rendered as Features → Profile sub-tab. |
| QuickTrayPanel.tsx | Quick Access Powers tray — paginated 3×3 grid of pinned PowerCards below the 3-column layout. Unlimited powers (9 per page with ← → navigation). Remove button per card; encounter/daily toggle synced to DB; psionic augment support. `quickTrayPowerIds: string[]` on Character. ⚡ pin button in PowersPanel and ActionsByTypePanel. Resolves equipment powers (magic armor/weapon) via `equipmentPowerMap` fallback — dynamically-generated power IDs not in static power DB are regenerated from equipped items. |
| LevelUpModal.tsx | Level-up flow: power gain picker + feat (only on FEAT_LEVELS) + paragon path (L11) + ability scores. Feat picker uses searchable scrollable card list with ℹ expand/collapse for details (not a dropdown). Ability score prerequisites enforced via `derived.finalAbilityScores` + in-progress boosts. |

---

## PowersPanel.tsx — Key Implementation Details

- **3 tabs:** At-Will, Encounter, Daily
- **Power types:** `powerType: 'attack' | 'utility'` on PowerData — utility powers are non-attack buffs/support. They use `usage: 'encounter'` or `usage: 'daily'` like attack powers. Utility powers appear **alongside** attack powers in the encounter/daily tabs — they are additional options, not a separate tab.
- PowerCard shows an **Attack** (white) or **Utility** (blue) badge on every power card.
- `slotLevels` array: canonical D&D 4e levels at which each power type is gained
- **Greedy slot assignment**: `slotAssignment` Map — for each slot level, finds first
  unassigned power with `power.level <= slotLvl`. This ensures a L9 power fills the L9
  slot, not the L5 slot. Do NOT revert to index-based `powersForTab[idx]` assignment.
- Power picker grouped by level with "Level X Powers" divider headers
- Picker filtered to `character.level` (only shows powers at or below current level)
- Empty slots show amber dashed "Encounter/Daily power — empty" hints
- Level badge "Lvl X" displayed on filled power cards
- MC power pickers (`mcPickerSlot` modal) filter to `powerType !== 'utility'` — MC slots are attack-only
- **Dilettante handling:** Half-Elf dilettante power is excluded from `powersForTab` and `primaryCount`. It renders in a dedicated section below primary at-wills with a violet source class badge, a "Replace" button (no remove), and its own picker modal. `primaryMax['at-will']` does NOT include the dilettante — `maxCounts['at-will']` adds +1 separately for the dilettante slot. `atLimit` for the at-will tab checks `primaryCount >= primaryMax` (not the total), so the primary picker is independent of the dilettante.

---

## LevelUpModal.tsx — Key Implementation Details

- `getPowerGains(classId, newLevel, selectedIds)` returns a `PowerGain[]`:
  - Checks if newLevel is in ENCOUNTER_LEVELS, DAILY_LEVELS, UTILITY_LEVELS
  - Returns options at or below the gain level (e.g., at L3 encounter gain, shows L1 + L3 encounter powers) filtered to available (not already selected)
- `picks` state: `Record<string, string>` maps gain label → selected powerId
- On confirm: appends new powers to `selectedPowers`, then patches DB
- Shows "Skip for now" hint if no power picked
- Color-coded sections: encounter=red-700, daily=gray-800, utility=amber-700
- **Feat picker** only renders when `FEAT_LEVELS.includes(newLevel)` — imported from `advancement.ts`
- `hasFeat` boolean guards both the UI section and the `handleConfirm` save logic
- **Feat picker UI**: searchable scrollable card list (not a dropdown). Each card shows name, multiclass badge, prerequisites. ℹ button expands/collapses full benefit + special text. Amber "Select" / violet "✓ Selected" toggle buttons. Search filters by name or benefit text. `max-h-64` scrollable container.
- **Ability score prerequisites enforced**: `levelUpAbilityScores` computed from `derived.finalAbilityScores` + any `abilityBoosts` selected during the same level-up, passed to `featMeetsPrerequisites()`. At overlapping levels (4, 8, 14, 18, 24, 28), boosting an ability dynamically updates the eligible feat list.

### Wizard daily/utility gains — NO auto-prepare
`isWizardSpellbookGain` flag is set when `isWizard && (gain.usage === 'daily' || gain.usage === 'utility')`.
For these gains **only the spellbook is updated** — `newPowers` (selectedPowers) is NOT touched.
User prepares from the Spellbook tab after leveling up. Non-wizard gains still auto-add to `selectedPowers`.
Also updates `spellbooks[0]` (creates one if none exists) alongside the legacy `spellbookPowerIds` flat list.

---

## FeatsPanel.tsx — Key Implementation Details

```typescript
import { featsEarnedByLevel } from '../../data/advancement';

// CORRECT — uses feat schedule, not character level
function expectedFeatCount(character: Character): number {
  return featsEarnedByLevel(character.level) + (character.raceId === 'human' ? 1 : 0);
}
```

Do NOT use `character.level` directly — that gives 1 feat per level which is wrong.

---

## Database (Dexie / IndexedDB)

**Database name:** `dnd4e-character-creator`
**Schema (latest):** characters, campaigns, sessions, encounters tables

```typescript
// characterRepository key methods:
characterRepository.getAll()            // Returns Character[] ordered by updatedAt desc
characterRepository.getById(id)         // Returns Character | undefined
characterRepository.create(data)        // Generates UUID, timestamps, returns Character
characterRepository.update(character)   // Full replace
characterRepository.patch(id, changes)  // Partial update — USE THIS for sheet edits
characterRepository.delete(id)
```

**Pattern for sheet edits:**
```typescript
const patch = async (changes: Partial<Character>) => {
  await characterRepository.patch(character.id, changes);
  updateCharacter({ ...character, ...changes });  // Update Zustand store too
};
```

---
## Supabase Backend (Multi-User Campaign Sharing)

**Supabase URL:** configured in `.env.local` (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`)
**Auth:** Magic link (email, no passwords). `useAuthStore` manages session + profile. Login is mandatory — `App.tsx` gates all views behind auth check. Supabase Redirect URLs must include both production (`https://dnd4ebuilder.com`) and dev (`http://localhost:5173`) URLs.
**Database:** 7 tables — `profiles`, `shared_campaigns` (has `campaign_content JSONB` + `homebrew_content JSONB` columns), `campaign_members`, `character_summaries` (has `character_data JSONB` column for full character sheet sync), `user_characters`, `user_campaigns`, `user_homebrew`
**Realtime:** Subscriptions on `character_summaries`, `campaign_members`, and `shared_campaigns` (content updates) for live updates.

### Key Files

| File | Purpose |
|---|---|
| `src/lib/supabase.ts` | Supabase client singleton |
| `src/lib/sharingService.ts` | All CRUD: create/join/leave campaign, link/unlink character, invite codes, `getCharacterData()` for read-only sheet |
| `src/lib/summarySync.ts` | `extractSummary()` builds payload from Character + maxHp; `createSyncDebouncer()` |
| `src/lib/characterCloudService.ts` | Cloud backup: `pushCharacterToCloud()`, `pullAllCharactersFromCloud()`, `deleteCloudCharacter()` |
| `src/lib/campaignCloudService.ts` | Cloud backup: `pushCampaignToCloud()`, `pullAllCampaignsFromCloud()`, `deleteCloudCampaign()` |
| `src/lib/campaignContentSync.ts` | DM content sync: `extractPublicContent()` + `pushCampaignContent()` — pushes desc/notes/sessions to Supabase |
| `src/store/useAuthStore.ts` | Auth state: `user`, `profile`, `login(email)`, `logout()`, `updateDisplayName()` |
| `src/store/useSharingStore.ts` | Shared campaigns, members, summaries; actions + realtime mutation handlers |
| `src/hooks/useCharacterSync.ts` | Auto-syncs character summary to Supabase on field changes (debounced 2s) |
| `src/lib/homebrewCloudService.ts` | Cloud backup: `pushHomebrewToCloud()`, `pullAllHomebrewFromCloud()`, `deleteCloudHomebrew()` |
| `src/hooks/useCharacterCloudSync.ts` | Cloud backup: pull on startup, debounced push on character changes |
| `src/hooks/useCampaignCloudSync.ts` | Cloud backup: pull on startup, per-campaign debounced push (3s). Watches `campaigns`, `sessionsByCampaign`, `encountersBySession` stores — any session/encounter edit triggers a push of its parent campaign (only). Per-campaign fingerprints prevent wasteful multi-campaign pushes. Info/debug/error logging at every gate: signed-in check, pull status, change detection, push success/failure. |
| `src/hooks/useHomebrewCloudSync.ts` | Cloud backup: pull on startup, debounced push on homebrew changes |
| `src/hooks/useRealtimeCampaign.ts` | Subscribes to Realtime for campaign updates (summaries, members, campaign content); wired into SharedCampaignView + CampaignManagementPage |
| `src/hooks/useCampaignContentSync.ts` | Auto-syncs public campaign content (desc, notes, sessions) for DM-owned shared campaigns (debounced 3s) |
| `src/components/auth/LoginPage.tsx` | Magic link email sign-in page |
| `src/components/sharing/ShareCampaignModal.tsx` | Copy invite code/link for DM sharing |
| `src/components/sharing/JoinCampaignModal.tsx` | Enter invite code → preview → join campaign |
| `src/components/sharing/LinkCharacterModal.tsx` | Pick local character to link to campaign |
| `src/components/sharing/SharedCampaignView.tsx` | Player view: campaign description, public notes (always-visible headers), session list, party roster with clickable character cards, leave/unlink actions |
| `src/components/sharing/PartyRosterCards.tsx` | Extracted `MemberCard` + `CharacterCard` — reused in both SharedCampaignView and CampaignManagementPage. `MemberCard` accepts `onLinkClick` for current-user linking |

### Campaign Sharing Flow

1. DM signs in (magic link) → creates campaign → clicks "🌐 Share Campaign" → gets 6-char invite code
2. DM shares code via Discord/text (subsequent clicks reuse existing code, not create new)
3. Player signs in → enters code in Join modal → previews campaign → confirms join
4. Player links a local character → summary pushed to Supabase
5. Character changes auto-sync (debounced 2s) — DM sees updates in real-time
6. Supabase Realtime pushes INSERT/UPDATE/DELETE events to all connected clients

### Character Summary Auto-Sync

`useCharacterSync(character)` hook in SheetPage.tsx:
- Checks if character is linked to any campaign (Supabase query on mount)
- Watches: `character.updatedAt` (triggers on any character change, not just specific fields)
- On change: debounced 2s → calls `upsertCharacterSummary()` → Supabase upsert
- Summary includes full `character_data` JSONB (portrait stripped to keep <50KB) alongside the 12-field summary
- `extractSummary()` in `summarySync.ts` builds both the lightweight summary fields and the full character JSON
- `getCharacterData()` in `sharingService.ts` fetches character_data + portrait_url for read-only sheet viewing
- Gracefully handles offline (silent fail, retries on next change)

### Cloud Character + Campaign Backup (Cross-Device Sync)

Dexie stays primary (fast, offline). Supabase `user_characters`, `user_campaigns`, and `user_homebrew` tables store full JSON backups per user.

**Push:** `useCharacterCloudSync` / `useCampaignCloudSync` / `useHomebrewCloudSync` hooks in App.tsx detect changes and debounce 3s before pushing. Error-aware logging (`console.info` success, `console.error` failure) — no silent fails.
**Pull:** One-time pull on startup (after auth + Dexie load). `mergeCloudCharacters()` / `mergeCloudCampaigns()` / `mergeCloudHomebrew()` in stores compare `updatedAt` timestamps — newer wins. New-from-cloud items inserted into local Dexie. Homebrew pull also calls `syncToDataLayer()` to register items into the data arrays.
**Delete:** Local delete soft-deletes in cloud (`deleted: true`). Cloud-deleted items not pulled on next startup.
**Portrait handling:** Stored inline in JSONB (~30-50KB per portrait). Well within Supabase free tier limits.
**Campaign bundle format:** `pushCampaignToCloud()` bundles the Campaign + all its CampaignSessions + all SessionEncounters into a single `CampaignBundle` JSONB payload (`{ campaign, sessions, encounters }`). Push logs `[pushCampaignToCloud] "<name>" — bundling N session(s), N encounter(s) from Dexie` for diagnostics.
**Campaign sync — per-campaign diff:** `useCampaignCloudSync` keeps a Map of per-campaign fingerprints (`campaign.updatedAt` + every session's `updatedAt` + every encounter's `updatedAt`). On any change, only campaigns whose fingerprint changed are pushed. Previous combined-hash approach pushed every campaign on every edit (wasteful on Supabase free tier). Also watches `sessionsByCampaign` and `encountersBySession` from their stores — required because a session/encounter edit does **not** bump the parent campaign's `updatedAt`.
**Campaign merge — per-record:** `mergeCloudCampaigns()` in `useCampaignsStore` merges sessions and encounters **per-record** by their own `updatedAt`, not by the parent campaign's. Previously merge was gated on `cloudCampaign.updatedAt > local.updatedAt` — which meant if only a session or encounter had changed (common case), the parent campaign's timestamp was unchanged and incoming session/encounter updates were silently dropped. Now each session/encounter is evaluated individually. Logs counts: `[mergeCloudCampaigns] Wrote N campaign(s), N session(s), N encounter(s) from cloud`.

### Supabase RLS Notes

- `shared_campaigns` and `campaign_members` SELECT policies use `USING (true)` (any authenticated user can see) — safe because app is IP whitelisted for friend group
- `generate_invite_code()` and `lookup_campaign_by_invite_code()` are `SECURITY DEFINER` to bypass RLS
- INSERT/UPDATE/DELETE policies enforce ownership (only owner can modify)

---

## Zustand Stores

```typescript
// useAppStore — navigation
const currentView = useAppStore(s => s.currentView);   // 'home'|'wizard'|'sheet'|etc.
const setCurrentView = useAppStore(s => s.setCurrentView);
const activeCharacterId = useAppStore(s => s.activeCharacterId);

// useCharactersStore — character list
const characters = useCharactersStore(s => s.characters);
const updateCharacter = useCharactersStore(s => s.updateCharacter);

// useWizardStore — creation wizard state
// Tracks all wizard form fields across all 10 steps
// Persisted to localStorage (key: 'dnd4e-wizard-draft') via Zustand persist middleware
// resetWizard() clears the draft; CharacterList shows "Resume" banner when draft exists
```

---

## Completed Features

- [x] 10-step character creation wizard
- [x] Full character sheet with all panels
- [x] Power system: at-will, encounter, daily tabs (utility powers shown within encounter/daily)
- [x] Attack/Utility badge on every power card
- [x] Full powers for all 8 classes, all 30 levels (heroic + paragon + epic tiers)
- [x] Level-gated power picker (only shows powers ≤ current level)
- [x] Greedy slot assignment for correct slot ↔ power level matching
- [x] LevelUpModal with inline power selection when leveling up
- [x] LevelUpModal feat picker only shown on correct FEAT_LEVELS (not every level)
- [x] Empty slot hints labeled by canonical gain level
- [x] Proficiencies panel (Combat → Proficiencies sub-tab): armor, weapons, shields, implements from class + feats + MC choices
- [x] Feat system with prerequisites (91 Heroic, 25 Paragon, 20 Epic feats)
- [x] FeatsPanel uses `featsEarnedByLevel()` for correct feat budget (not 1-per-level)
- [x] Shared advancement constants in `src/data/advancement.ts`
- [x] Equipment manager with multi-tab layout
- [x] HP/surge tracking with rest buttons
- [x] Monster compendium (MM1 482, MM2 315, MM3 295, DMG 8, DMG2 30, MV 164, MV:TttNV 182 = 1,476 total monsters)
- [x] Campaign management
- [x] Import/export characters as JSON
- [x] Portrait upload (150×150px JPEG, stored as base64)
- [x] PWA installable, fully offline
- [x] SVG mural banner on character list page
- [x] Dice roller (floating FAB on character sheet): d2, d4, d6, d8, d10, d%, d12, d20; up to 10 of each; counts reset on roll; results revealed after sound finishes (~2.2 s)
- [x] Dice roll sound (Web Audio synthesis, no files) plays on every roll — DiceRollerModal, Saving Throw, and skill checks all use `playDiceRollSound()`
- [x] Channel Divinity tab under Powers (cleric + paladin); Encounter/At-Will sub-tabs; resets on Short/Extended Rest
- [x] Paragon path bonuses applied to defenses, initiative, proficiencies, saving throws, and cross-class power grants
- [x] Saving Throw button with full math breakdown, success/fail card, dismiss button
- [x] Initiative Roll button (d20 + initiative bonus) with math breakdown card, dismiss button
- [x] SheetHeader sticky banner (`sticky top-0 z-10`) with speed+level badges, info rows: race/class/tier, role/initiative/vision, player identity, alignment/deity/leveling
- [x] Ritual system: 72 rituals (49 PHB1 + 23 PHB2) in `src/data/rituals.ts`; `RitualData` type with `skillCheckTable` + `prerequisite`; RitualsPanel with scroll shop, ritual book, BuyScrollModal, AddToBookModal, and skill check table display
- [x] Warlock Eldritch Pact system: infernal/fey/star pact selection in wizard Step 3; pact boon auto-granted (not counted against slots); EldritchPactPanel showing all 3 pacts with chosen highlighted; pact boon shown in PowersPanel
- [x] Wizard Arcane Implement Mastery: orb/staff/wand selection in wizard Step 3; cantrip auto-granted; ArcaneImplementMasteryPanel showing all 3 implements
- [x] Descriptive pickers in Step 3 for both pact and implement — show lore text + granted power card before advancing
- [x] canProceed validation in CreationWizard: wizard requires arcaneImplement, warlock requires warlockPact before Step 4
- [x] Class Features tab: sub-tab under "Features" parent tab (alongside Racial Features) showing all features for chosen class with enhanced detail for wizard/warlock choices
- [x] Actions Descriptions tab: PHB p.289 reference table under Actions → Actions Descriptions; 7 category tabs (Standard, Move, Minor, Free, Immediate Interrupts, Immediate Reactions, Opportunity)
- [x] Feats expanded to 161 PHB1 feats (95 Heroic, 49 Paragon, 17 Epic) with accurate benefit text from iws.mx
- [x] Removed redundant Features sub-tab from NotesPanel (class features now live in ClassFeaturesPanel)
- [x] Tab label swap: top-level "Combat" tab renamed "Actions"; sub-tabs renamed: "Combat" → "Available Actions", "Available Actions" → "Actions Descriptions"
- [x] Available Actions tab (Actions → Available Actions): CombatActionsPanel (weapon attack cards) at top + ActionsByTypePanel below with 5 action-type sub-tabs (Standard, Minor, Move, Immediate, Free). Shows all character powers as read-only PowerCards grouped by `actionType`. Encounter/daily powers have circle toggle for used/available state (synced to DB, restored on rest). No remove button — power management stays in Powers tab. Collects powers from `selectedPowers`, level 0 class powers (cantrips, pact boons, CD/class features), dilettante, racial powers, feat-granted powers, and equipment powers (magic armor/weapon/implement/item).
- [x] Feat bonuses integrated into derived stats: Great Fortitude (+2/+3/+4 Fortitude), Iron Will (+2/+3/+4 Will), Lightning Reflexes (+2/+3/+4 Reflex), Improved Initiative (+4 initiative), Toughness (+5/+10/+15 HP), Durable (+2 surges/day), Alertness (+2 Perception), Human Perseverance (+1 saves), Fleet-Footed (+1 speed), Armor Specialization feats (+1 AC when wearing matching armor). "Feats" row shown in defense breakdowns when non-zero.
- [x] Channel Divinity panel fixed: CD powers identified by `keywords.includes('Channel Divinity')` (not `powerType`); Healing Word and other non-CD level 0 class feature encounter powers tracked individually alongside CD powers
- [x] Wizard multi-spellbook system: `WizardSpellbook` type + `spellbooks[]` on Character; 128-page limit per book (pages = power/ritual level); 1 free book at creation; additional books 50 gp; rename/delete books; auto-migration from legacy flat fields; backward compat preserved
- [x] Wizard prepare system: daily/utility powers NEVER auto-prepared (not at creation, not on level-up); user prepares manually from Spellbook tab; correct `powerType` discriminator used throughout
- [x] AddRitualToBookModal: level-gating (rituals above character level visible but disabled); description + duration + skill check table always visible inline
- [x] Magic Item Compendium: 576 items from "Complete Book of Magical Items" (Talivar V1.11) across 9 categories; 3-edition toggle (AD&D 2e / D&D 4e / D&D 5e); category filter chips; search; pagination (PAGE_SIZE=30); random item roller (D10+D% seeded PRNG); bottom-sheet modal with edition-specific display; cross-category deduplication filter; keyword-driven 4e/5e conversions with name-based priority checks; full 2e descriptions bulk-updated from PDF (507 items updated)
- [x] Class mandatory trained skills: rogue (stealth+thievery), wizard (arcana), cleric (religion), ranger (dungeoneering or nature choice), paladin (religion) — auto-populated during creation; `mandatorySkills` and `mandatorySkillChoice` fields on ClassData
- [x] Half-Elf Dilettante system: separate slot from primary at-wills; source class badge (violet); replace-only picker restricted to level 1 at-wills from same source class; `dilettantePowerId`/`dilettanteClassId` stored on Character; backward-compat heuristic for older characters; `canProceed` Step 6 enforcement
- [x] Power selection enforcement: `canProceed` Step 6 validates all at-will, encounter, and daily slots are filled before advancing in creation wizard
- [x] PHB2 content expansion: 5 races (deva, gnome, goliath, half-orc, shifter w/ subraces), 8 classes (avenger, barbarian, bard, druid, invoker, shaman, sorcerer, warden) with build choice pickers, full powers for all 8 classes across 30 levels, 132 feats, 44 paragon paths, 23 rituals
- [x] PHB2 build choice system: 8 class-specific build choices (censure, feral might, virtue, primal aspect, covenant, companion spirit, spell source, guardian might) with wizard Step 3 pickers and ClassFeaturesPanel detail renderers
- [x] Avenger Armor of Faith (+3 AC in cloth/no armor, no shield) and Sorcerer Soul of the Sorcerer (ability mod AC in cloth) integrated in useCharacterDerived.ts
- [x] Channel Divinity extended for avenger and invoker (4 CD classes total: avenger, cleric, invoker, paladin)
- [x] Shifter sub-race system: subraces[] on RaceData with sub-race picker in wizard Step 1
- [x] PHB3 content expansion: 4 races (githzerai, minotaur, shardmind, wilden), 6 classes (ardent, battlemind, monk, psion, runepriest, seeker) with build choice pickers, 509 class powers + 7 racial powers across 30 levels, 172 feats (6 multiclass), 28 paragon paths
- [x] PHB3 build choice system: 6 class-specific build choices (mantle, psionic study, monastic tradition, discipline focus, runic artistry, seeker's bond) with wizard Step 3 pickers and ClassFeaturesPanel detail renderers
- [x] Psionic power source added to ClassData.powerSource union; Ardent/Battlemind/Psion use psionic augmentation (augmentable at-wills with augment text in `special` field, encounterPowerCount: 0)
- [x] Monk Full Discipline powers: combined attack + movement techniques in single power entries with movement details in `special` field
- [x] Monk Unarmored Defense: +2 AC in cloth, no shield; uses higher of DEX or WIS for AC ability modifier (integrated in useCharacterDerived.ts)
- [x] Paragon path race prerequisite filtering: `getParagonPathsForCharacter(classId, raceId)` enforces race-specific prerequisites; LevelUpModal and ParagonPanel both use filtered function; dropdown labels show prerequisite text; features displayed as bullet-pointed list (not wall of text) in LevelUpModal
- [x] SheetHeader sticky banner: outer div uses `sticky top-0 z-10`; role/speed/initiative/vision moved to Row 2; race vision type displayed
- [x] Magic item 2e descriptions bulk-updated from PDF: 507 items updated with full text from "Complete Book of Magical Items"; PWA cache limit increased to 8MB
- [x] Random item roller non-deterministic: seed now includes `Date.now()` + module-level rolling counter (×997 prime) so same D10+D% values produce different items each time
- [x] Size/Vision labels: "Size:" and "Vision:" labels added to Step2_Race.tsx and SheetHeader.tsx Row 2 for uniform display
- [x] Feat prerequisite enforcement: All 3 feat pickers (Step7_Feats, FeatsPanel, LevelUpModal) enforce ability score prerequisites via `featMeetsPrerequisites()`. LevelUpModal computes `levelUpAbilityScores` from `derived.finalAbilityScores` + in-progress `abilityBoosts` so that at overlapping levels (4, 8, 14, 18, 24, 28) boosting an ability dynamically updates the eligible feat list. Step7_Feats disables ineligible feats with `disabled` attribute and onClick guard.
- [x] Feat detail UI in LevelUpModal and Step7_Feats: Feat pickers in both LevelUpModal and Step7_Feats upgraded from name-only dropdowns to searchable scrollable card lists matching FeatsPanel UX. Each card shows name, multiclass badge, prerequisites text. ℹ button expands/collapses full benefit + special text. Amber "Select" / violet "✓ Selected" toggle buttons. Search filters by name or benefit text. `max-h-64` scrollable container.
- [x] Step4 ability score display fix: racial choice bonus (`racialAbilityBonusChoice`) now included in final score calculation and "+N race" annotation display, so scores match Step 7 feat prerequisite checks
- [x] Step10 Review ability score breakdown: shows base score + racial/human/choice bonus annotations under each ability score card
- [x] Step10 Review defense breakdown: each defense card (AC, Fort, Ref, Will) shows line-by-line breakdown (base, ability mod, class bonus, racial bonus) with color-coded labels
- [x] AbilityBlock hover breakdown: hover over any ability score on character sheet to see expandable breakdown panel (Base Score, Racial, Subrace, Racial Choice) matching DefensesBlock pattern; `AbilityBreakdownRow` type + `abilityBreakdowns` field added to `DerivedStats` and computed in `useCharacterDerived.ts`
- [x] AbilityBlock click-to-roll: click any ability score on character sheet to roll d20 + ability modifier with result card (d20 chip, mod chip, total, Nat 20/Nat 1 badges), matching SkillsPanel pattern; plays `playDiceRollSound(1)`
- [x] Psionic augmentation system: Power point tracking + augment selector for Ardent, Battlemind, Psion. `currentPowerPoints` and `augmentSelections` on Character; violet-themed PP row in HitPointsBlock with +/− buttons; augment selector bar on psionic at-will PowerCards (Base / +1 PP / +2 PP buttons) with structured augment descriptions; PP spend/refund managed in PowersPanel `selectAugment` handler; PP restored on short/extended rest (SheetHeader); PP initialized at creation (useWizardStore). Utility functions in `src/utils/psionics.ts`: `isPsionicClass`, `getMaxPowerPoints`, `parseAugments`, `getNonAugmentSpecialText`.
- [x] Psionic at-will power progression: All psionic classes (Ardent, Battlemind, Psion) gain a 3rd at-will attack power at level 3 via LevelUpModal teal-themed picker. At levels 7/13/17/23/27, psionic classes can optionally replace one existing at-will with another (up to current level) via dropdown swap UI. `maxPowersForLevel` in PowersPanel returns `baseCount + 1` for psionic classes at level 3+. Uses `isPsionicClass()` from `src/utils/psionics.ts` (not hardcoded Psion check). At-will data exists at levels 1/3/7/13/17/23/27 in each psionic class's power file.
- [x] Discipline/Ardent/Battlemind Powers panel: shared `DisciplinePowersPanel.tsx` sub-tab under Powers for Psion, Ardent, and Battlemind. `DISCIPLINE_CLASSES = ['psion', 'ardent', 'battlemind']` drives tab visibility in CharacterSheet.tsx. `DISCIPLINE_POWER_MAP` maps discipline/mantle/study choice keys to auto-granted encounter power IDs: telekinesis → Far Hand + Forceful Push; telepathy → Distract + Send Thoughts; clarity → Ardent Alacrity + Ardent Surge; elation → Ardent Outrage + Ardent Surge; resilience → Battle Resilience; speed → Speed of Thought. Battlemind also shows 3 Psionic Defense at-will powers (Battlemind's Demand, Blurred Step, Mind Spike) via `BATTLEMIND_DEFENSE_POWERS` constant — rendered as teal-themed `AtWillPowerCard` components (no Use button). Dynamic labels: "Discipline Powers" for Psion, "Ardent Powers" for Ardent, "Battlemind Powers" for Battlemind. Badge: "Discipline" / "Mantle" / "Study". Sub-tab label in CharacterSheet also dynamic. Encounter powers individually tracked in `usedEncounterPowers`; indigo-themed encounter cards, teal-themed at-will cards.
- [x] Ritual Caster auto-granted feat: Classes with Ritual Casting class feature (wizard, cleric, bard, druid, invoker, psion) show Ritual Caster under Feats as a known feat that doesn't count against budget, cannot be removed, marked "Class Feature". `AUTO_GRANTED` map in FeatsPanel, Step7_Feats, and LevelUpModal.
- [x] Quick Access Powers tray: `QuickTrayPanel.tsx` rendered below the 3-column layout in CharacterSheet, spanning full width. Paginated 3×3 grid (9 per page, unlimited total) with ← → page navigation. `quickTrayPowerIds: string[]` on Character (DB v5). ⚡ pin button added to `renderFilledCard` in PowersPanel.tsx and to each power in ActionsByTypePanel.tsx — amber-themed, shows ✓ when already pinned. No max limit on pinned powers. Tray supports encounter/daily used toggle (synced to `usedEncounterPowers`/`usedDailyPowers`), psionic augment buttons, ability modifier substitution, and × remove from tray. Collapsible header with power count badge. Empty slots rendered as dashed placeholders on last page. Equipment powers (magic armor/weapon) resolved via memoized `equipmentPowerMap` fallback — dynamically-generated power IDs (e.g. `magic-armor-dwarven-armor-2`) are regenerated from equipped items when `getPowerById()` returns undefined.
- [x] Psion ritual book: Psion gets a ritual book (not spellbook) at creation with choice of Sending or Tenser's Floating Disk; stored in `ritualBooks: RitualBook[]` on Character; picker in Step3_Class; `psionStartingRitualId` in useWizardStore
- [x] Supabase multi-user campaign sharing: Magic link auth (email, no passwords); `profiles`, `shared_campaigns`, `campaign_members`, `character_summaries` tables with RLS policies; 6-char invite codes for campaign sharing; DM creates campaign + shares code, players join via code + link local character; `SharedCampaignView` shows campaign roster with character cards (HP bars, race/class, level, portrait); auto-sync character summaries on sheet changes (debounced 2s via `useCharacterSync` hook); Supabase Realtime subscriptions for live updates (`useRealtimeCampaign` hook); TopBar user indicator (initials circle); Sidebar account section (login/logout); `LoginPage` with magic link flow; all sharing UI in `src/components/sharing/`; Dexie DB v5.
- [x] Mandatory auth gate: App.tsx checks `useAuthStore.isInitialized` + `user` before rendering. If not authenticated, only `LoginPage` is shown (no skip button). "Back to App" button on LoginPage only visible when already logged in. Auth session persists across refreshes via Supabase session.
- [x] Share Campaign button: "🌐 Share Campaign" button in CampaignManagementPage campaign editor header (visible when logged in). First click creates a shared campaign in Supabase + shows invite code modal. Subsequent clicks reuse the existing shared campaign (matched by name + creator). `ShareCampaignModal` shows large monospace invite code with "Copy Code" and "Copy Link" buttons.
- [x] SVG favicon: `public/favicon.svg` — d20 die icon in amber/gold tones with "20" text. Referenced in `index.html` as `<link rel="icon" type="image/svg+xml">`.
- [x] Equipment multi-buy in wizard: Step8_Equipment.tsx `addItem()` no longer blocks duplicate purchases. Weapons/armor create unique instances (`instanceId` via `crypto.randomUUID()`); gear stacks by quantity. Buy button always visible (disabled only when can't afford). Inventory shows per-instance rows for weapons/armor, quantity badge for gear. `removeEquipmentByInstance()` and `updateEquipmentQuantity()` added to useWizardStore.
- [x] Ability modifier substitution in power text: `substituteMods()` in `src/utils/powerText.ts` replaces "Dexterity modifier" → "3 (Dexterity modifier)" using character's computed ability modifiers. Applied via optional `abilityModifiers` prop on PowerCard. Wired into all 5 sheet panels (PowersPanel, ActionsByTypePanel, QuickTrayPanel, ChannelDivinityPanel, DisciplinePowersPanel) via `useCharacterDerived()`. Wizard pickers show raw text (no character yet). Works for all 6 abilities across all power text fields (attack, hit, miss, effect, special, augment descriptions).
- [x] Cloud character backup + cross-device sync: `user_characters` Supabase table stores full Character JSON (JSONB) per user. `characterCloudService.ts` provides `pushCharacterToCloud()`, `pullAllCharactersFromCloud()`, `deleteCloudCharacter()`. `useCharacterCloudSync` hook in App.tsx: one-time pull on startup (after auth + Dexie load) merges cloud characters into local Dexie (newer wins via `updatedAt`); debounced 3s push on every character change. `mergeCloudCharacters()` action in useCharactersStore. `upsertFromCloud()` in characterRepository preserves cloud timestamps. Character delete soft-deletes in cloud (`deleted: true`). Works across browsers and devices — log in anywhere to see all characters.
- [x] Cloud campaign backup + cross-device sync (with sessions + encounters): `user_campaigns` Supabase table stores `CampaignBundle` JSONB per user — includes Campaign + all CampaignSessions + all SessionEncounters in a single payload. `campaignCloudService.ts` provides `pushCampaignToCloud()` (bundles sessions/encounters from Dexie), `pullAllCampaignsFromCloud()` (returns `CampaignBundle[]`), `deleteCloudCampaign()`. `useCampaignCloudSync` hook in App.tsx: one-time pull on startup merges cloud campaigns + sessions + encounters into local Dexie (newer wins via `updatedAt`); debounced 3s push on every campaign change. `mergeCloudCampaigns()` in useCampaignsStore upserts sessions/encounters via `db.sessions.put()` / `db.encounters.put()` then force-reloads stores. Campaign delete soft-deletes in cloud. Backward compatible with legacy format (pre-bundle cloud data returns empty sessions/encounters). Works across browsers and devices.
- [x] Unified local + shared campaign views: DM sees party roster inline in campaign editor alongside sessions/encounters/notes. Players see campaign description, public notes, session list, and party roster in SharedCampaignView. DM's content auto-syncs to Supabase via `useCampaignContentSync` hook (debounced 3s). `campaign_content` JSONB column on `shared_campaigns` stores `CampaignContent` (description, publicNotes, sessions — deliberately excludes `plannedSummary` which is DM-only). `sharedCampaignId` on local `Campaign` provides stable link to shared counterpart. One-time client-side migration links pre-existing campaigns by name. `useRealtimeCampaign` subscribes to `shared_campaigns` UPDATE events for live content updates. `PartyRosterCards.tsx` extracted for reuse in both views. DM-owned campaigns filtered from "Shared Campaigns" sidebar section. `SharedCampaignView` loading bug fixed (local `useState` replaces shared `isLoading` race condition).
- [x] Feat-granted powers system: Feats that grant powers (e.g. deity Channel Divinity feats) now produce actual PowerCard entries in the correct panels. `FeatData.grantedPowerIds?: string[]` links feats to structured `PowerData` entries in `src/data/powers/featPowers.ts` (11 deity CD powers: Bahamut, Avandra, Corellon, Erathis, Ioun, Kord, Melora, Moradin, Pelor, Raven Queen, Sehanine). `FeatPrerequisites.deity?: string` enforces deity worship requirement — checked in `featMeetsPrerequisites()` across all 3 call sites (Step7_Feats, LevelUpModal, FeatsPanel). Feat-granted powers appear in: PowersPanel Encounter tab (with "Feat" badge, ⚡ pin button, usage toggle), ActionsByTypePanel (grouped by action type with pin + usage toggle), ChannelDivinityPanel (shares per-encounter CD resource with class CD powers). CD tab in CharacterSheet now shows for ANY class with a feat-granted CD power (not just the 4 CD classes). All feat powers use `classId: 'feat'`, `level: 0`.
- [x] Armor system overhaul: Full magic armor + masterwork armor from PHB/PHB2/PHB3/AV/AV2 (314 entries: 8 mundane, 12 masterwork, 294 magic). New types `MasterworkArmorData` and `MagicArmorData` in `gameData.ts`; shared `ArmorType` union. Data in `src/data/equipment/masterworkArmor.ts` (12 PHB masterwork armors: Feyweave, Feyleather, Darkhide, Forgemail, Wyrmscale, Warplate, etc.) and `src/data/equipment/magicArmor.ts` (294 magic enchantments with level tiers, properties, powers — includes Shield of Deflection). `EquipmentItem` extended with `masterworkId`, `magicArmorId`, `magicArmorTier` fields. EquipmentPanel armor items expand on click to show masterwork upgrade dropdown + tier selector + property/power display. Enhancement bonus from magic armor/shield applied to AC in `useCharacterDerived.ts` with breakdown row. Armor speed penalties fixed (heavy armor -1 per PHB p.214). Shield check penalties now stack with armor. Scale armor check penalty corrected from -2 to 0. Generator scripts at `C:\Claude\generate_armor.js` and `C:\Claude\generate_armor_ts.js`.
- [x] Magic armor in equipment picker: Magic armor enchantments (294 items) browsable and searchable in the Armor tab of the equipment picker, below base armor. Each entry shows name, rarity badge (Common/Uncommon/Rare), compatible armor types, enhancement type, first tier level/bonus/cost, description, and property. Clicking "Add" creates a base armor item with the enchantment pre-applied (first compatible base type, lowest tier). User can change base type and tier in the expanded inventory view. `filteredMagicArmor` search covers name, rarity, property, and description. `addMagicArmorItem()` function handles creation.
- [x] Magic armor powers in Powers & Actions tabs: `parseMagicArmorPower()` in `src/utils/magicArmorPowers.ts` converts raw power text from `MagicArmorData.power` into structured `PowerData` objects by parsing usage (Daily/Encounter), action type (Standard/Move/Minor/Free/Immediate), keywords, trigger, and effect. Magic armor powers from equipped armor appear in: PowersPanel Encounter tab (teal "Armor" badge, ⚡ pin, usage toggle), PowersPanel Daily tab (teal "Armor" badge, ⚡ pin, usage toggle), ActionsByTypePanel (grouped by action type with pin + toggle). Powers auto-appear when armor is equipped, auto-disappear when unequipped. Power IDs are `magic-armor-${ma.id}-${tier.level}`. Usage toggle syncs to `usedEncounterPowers`/`usedDailyPowers`; cleared on rest.
- [x] Speed badge in SheetHeader: Speed moved from Row 2 info text to a styled badge (sky-blue `bg-sky-700`) positioned to the left of the Level badge in the top-right controls row. Shows 🏃 icon + "Speed N" + colored bonus indicator (green for positive, red for negative) when speed differs from base race speed. Layout: `[🏃 Speed 5 (-1)] [Level 10] [Level Up ↑]`.
- [x] Weapon system overhaul: Full mundane + magic weapons from PHB/PHB2/PHB3/AV/AV2 (286 entries: 38 mundane, 248 magic). New types `MagicWeaponData` and `MagicWeaponTier` in `gameData.ts`. Data in `src/data/equipment/weapons.ts` (38 mundane weapons: Simple/Military/Superior Melee/Ranged with full properties including Off-hand, Heavy thrown, High crit, Reach, Versatile, Load, etc.) and `src/data/equipment/magicWeapons.ts` (248 magic weapons with tiers, critical text, properties, powers). `EquipmentItem` extended with `magicWeaponId`, `magicWeaponTier` fields. Equipment picker: magic weapons appear in Weapons tab filtered by character level, each tier as separate entry with rarity badge, compatible types, cost, critical/property/power preview. Two-step add flow: click Add → pick base weapon type. Weapon inventory: click to expand, shows base weapon stats + magic weapon details (critical, special, property, power cards). `DerivedStats` extended with `weaponEnhancementBonus`, `equippedWeaponName`, `equippedWeaponDamage`, `equippedWeaponProficiency`. Melee/ranged basic attack includes weapon proficiency + enhancement bonus. Magic weapon powers appear in Powers tab (orange "Weapon" badge) and Actions tab via `parseMagicWeaponPower()` in `src/utils/magicWeaponPowers.ts`. Generator scripts at `C:\Claude\generate_weapons.js` and `C:\Claude\generate_weapons_ts.js`.
- [x] App version display: Version sourced from `package.json` `version` field, injected at build time via Vite `define` (`__APP_VERSION__`), declared in `src/vite-env.d.ts`. Displayed at bottom of Sidebar menu (`Sidebar.tsx`) in faded amber text. Bump version by editing `package.json` only.
- [x] Monk Monastic Tradition defensive bonuses: Centered Breath grants Mental Equilibrium (+1/+2/+3 Fortitude at heroic/L11/L21); Stone Fist grants Mental Bastion (+1/+2/+3 Will at heroic/L11/L21). Applied in `useCharacterDerived.ts` based on `character.monkTradition`; shown in defense breakdown panel with feature name label.
- [x] Monk Flurry of Blows in Powers tab: Tradition-specific Flurry of Blows (level 0 at-will, free action) now appears in PowersPanel At-Will tab as auto-granted class feature (no remove button). Only the chosen tradition's flurry shows (Centered Flurry of Blows or Stone Fist Flurry of Blows). ActionsByTypePanel also filtered to only show the matching tradition's flurry.
- [x] Monk Full Discipline dual-technique powers: 32 Full Discipline monk powers now render as two linked power cards. `extractMovementTechnique()` in `src/utils/fullDiscipline.ts` generates a virtual Movement Technique PowerData (ID = `{parentId}-mt`, actionType = 'move') from the parent power's `special` field. Attack Technique card shows Movement Technique as teal sub-section; Movement Technique card shows Attack Technique as amber sub-section. Both cards appear in: PowersPanel (at-will/encounter/daily/utility tabs), ActionsByTypePanel (under respective action type sub-tabs), and QuickTrayPanel (resolves `-mt` IDs via `resolvePower()` fallback). Both techniques share the same encounter/daily used state. ⚡ pin button on movement technique cards. Removing a power from Powers tab also removes both technique IDs from Quick Access tray.
- [x] Implement system: Full implement equipment (396 entries: 8 basic, 27 superior, 361 magic) from PHB/PHB2/PHB3/AV/AV2. 8 implement types: Holy Symbol, Orb, Rod, Staff, Wand, Totem, Ki Focus, Tome. New types `ImplementData`, `SuperiorImplementData`, `MagicImplementData` in `gameData.ts`. Data in `src/data/equipment/implements.ts`, `superiorImplements.ts`, `magicImplements.ts`. Implements tab in EquipmentPanel between Weapons and Armor. Basic implements free/cheap with description. Superior implements require Superior Implement Training feat and have special properties (Accurate, Energized, Empowered Crit, etc.). Magic implements have enhancement tiers with critical/property/power text (361 total: 38 PHB + 21 PHB2 + 41 PHB3 + 136 AV + 125 AV2). Two-step add flow for magic implements (pick base implement type). `parseMagicImplementPower()` in `src/utils/magicImplementPowers.ts` converts power text to PowerData. Magic implement powers appear in PowersPanel (indigo "Implement" badge, ⚡ pin, usage toggle) and ActionsByTypePanel. Generator scripts at `C:\Claude\generate_implements.js` and `C:\Claude\generate_implements_ts.js`.
- [x] Repeatable feats: Feats like Superior Implement Training, Skill Focus, Weapon Focus can be taken multiple times. `isFeatRepeatable(feat)` in `src/data/feats/index.ts` detects via "more than once" in special/benefit text. `selectedFeatIds` supports duplicate entries. FeatsPanel, Step7_Feats, LevelUpModal all updated to allow re-selection of repeatable feats. Removal uses indexOf + splice (one instance at a time).
- [x] Superior Implement Training feat-implement association: `superiorImplementChoices: Record<number, string>` on Character maps SIT feat instance index to equipment instanceId. Dropdown UI in FeatsPanel for each SIT card. Constraints: one implement per feat, one feat per implement, no duplicate base types across instances.
- [x] Weapon enhancement prefix: Weapon enhancement type text in expanded inventory view now prefixed with "Enhancement:" (matching "Critical:" pattern).
- [x] Collapsible sub-groups in equipment picker: All section headers (Base Weapons, Magic Weapons, Basic Implements, Superior Implements, Magic Implements, Base Armor, Magic Armor, and Magic Items by slot — Head/Neck/Arms/Hands/Ring/Waist/Feet/Companion/Wondrous) are clickable toggle buttons. Collapsed state shows item count; expanded shows full list. State resets when switching tabs.
- [x] Level-up power picker shows all unlocked levels: When gaining a new power slot (encounter/daily/utility), the picker shows powers from all unlocked levels of that type, not just the exact gain level. E.g., at L3 encounter gain, player can choose L1 or L3 encounter powers.
- [x] Magic items system overhaul: 788 real magic items from PHB/PHB2/PHB3/AV/AV2 across 9 slot categories (Arms 47, Companion 6, Feet 93, Hands 78, Head 112, Neck 114, Ring 103, Waist 64, Wondrous 171). Tiered structure matching magic weapons/armor/implements pattern. New types `MagicItemTier` and `MagicItemSlot` in `gameData.ts`. Data in `src/data/equipment/magicItems.ts`. "Magic" tab renamed to "Items" in EquipmentPanel. Inventory shows rarity badges (Common/Uncommon/Rare), tier selector dropdown for multi-tier items, property text, power preview. Neck slot items (114) auto-apply enhancement bonus to Fort/Ref/Will in `useCharacterDerived.ts`. `parseMagicItemPower()` in `src/utils/magicItemPowers.ts` handles At-Will/Encounter/Daily item powers. Magic item powers appear in PowersPanel (cyan "Item" badge, pin, usage toggle), ActionsByTypePanel (grouped by action type), and QuickTrayPanel (equipment power map fallback). `EquipmentItem` extended with `magicItemTier` field. Click-to-expand inventory: collapsed view shows name+enhancement, equipped/rarity badges, level/cost, truncated property & power; expanded view shows full item info header, enhancement box (emerald, neck only), property box (blue), power box (violet), tier selector dropdown. `expandedMagicItem` state; Equip/Unequip and tier selector use `e.stopPropagation()`. Inventory grouped by slot category (Head, Neck, Arms, Hands, Ring, Waist, Feet, Companion, Wondrous) with collapsible amber-themed headers showing item counts. `collapsedSlotGroups` state + `toggleSlotGroup()`. Slot label removed from individual item rows (redundant with group header). Picker also grouped by slot with collapsible amber-themed headers via `collapsedGroups` (shared picker state, keyed `picker-magic-{slot}`). Generator scripts at `C:\Claude\fetch_items.js` and `C:\Claude\generate_magic_items_ts.js`.
- [x] Auto-increment version on build: GitHub Actions workflow bumps patch version (npm version patch) on every push to main, commits with `[skip ci]` to prevent infinite loops. Version bump committed by github-actions[bot].
- [x] Racial Features tab: Sub-tab under "Features" parent tab (alongside "Class Features") on character sheet. `RacialFeaturesPanel.tsx` shows racial summary card (size/speed/vision/languages/ability bonuses/skill bonuses/defense bonuses), all racial traits with source badges (PHB/PHB2/PHB3/HotFK/HotFL) and conditional "Situational" indicators, subrace traits for Shifter, and racial power cards from `racialPowerIds`. `RacialTrait` type enhanced with `source?: string` and `conditional?: boolean`. `RaceData` enhanced with `fortitudeBonus`, `reflexBonus`, `initiativeBonus`, `surgesPerDayBonus` fields. All 17 race data files updated with source attribution per trait and conditional flags. Racial defense bonuses now data-driven: `useCharacterDerived.ts` replaced hardcoded Human/Eladrin race ID checks with generic `race.fortitudeBonus`/`race.reflexBonus`/`race.willBonus` fields. Defense breakdowns show dynamic `Racial (RaceName)` labels. Githzerai +2 initiative bonus and Minotaur +1 surge/day bonus wired into derived stats. Additional alternate traits from Heroes of the Forgotten Kingdoms included: Dragonborn Dragonfear (HotFK), Half-Elf Knack for Success (HotFK), Human Heroic Effort (HotFK). Racial powers also appear in PowersPanel (emerald "Race" badge, ⚡ pin, usage toggle), ActionsByTypePanel (grouped by action type), and QuickTrayPanel (resolved via `getPowerById()` from static power DB). Generator script at `C:\Claude\fetch_racial_features.js`.
- [x] Power range field: All 1,815 class powers now have a `range?: string` field (e.g. 'Melee weapon', 'Ranged 10', 'Close burst 2', 'Area burst 1 within 10 squares', 'Personal'). Displayed in `PowerCard.tsx` as bold indigo text above keywords. Magic equipment power parsers (`magicArmorPowers.ts`, `magicWeaponPowers.ts`, `magicImplementPowers.ts`, `magicItemPowers.ts`) also extract range from power text via regex. Range data sourced from iws.mx power database (`_listing.js` + `_index.js`). Generator scripts at `C:\Claude\fetch_power_ranges*.js`, `C:\Claude\add_power_ranges.js`, `C:\Claude\fix_*_ranges.js`.
- [x] Fighter Combat Style (houserule): Fighters choose between Combat Superiority (PHB) and Combat Agility (Martial Power 2) at character creation. `fighterCombatStyle: 'superiority' | 'agility'` on Character. Combat Superiority grants `fighter-combat-challenge` (opportunity attack, mark), Combat Agility grants `fighter-combat-agility` (opportunity attack, shift + knock prone). Both are level 0 at-will powers with `actionType: 'opportunity'`. Wizard Step 3 picker via `BuildChoicePicker`. `canProceed` Step 3 enforces choice. `ClassFeaturesPanel` shows choice detail via `BUILD_CHOICE_MAP` + `PHB2_BUILD_CHOICES`. Powers conditionally auto-granted in `ActionsByTypePanel` and `PowersPanel` based on `character.fighterCombatStyle`. Fighter class features restructured: Combat Challenge, Combat Style (choice), Fighter Weapon Talent.
- [x] Fighter Weapon Talent: +1 attack bonus with proficient weapons now mechanically applied in `CombatActionsPanel.tsx`. Added to attack calculation (`attackBonus`) and shown in breakdown as "+1 talent". Applies to both melee and ranged weapons when the character is a fighter and proficient with the weapon.
- [x] Homebrew Workshop: New top-level tab (`AppView: 'homebrew'`) for creating custom game content. Supports 13 content types: races, classes, powers, feats, weapons, armor, gear, magic items, magic armor, magic weapons, magic implements, consumables, monsters. Stored locally in Dexie.js (`homebrew` table, schema v7) with `HomebrewItem` type (`src/types/homebrew.ts`). Data registration pattern: each data index file (`races/index.ts`, `classes/index.ts`, `powers/index.ts`, `feats/index.ts`, equipment files) has `registerHomebrew*()` / `unregisterHomebrew*()` functions that merge homebrew items into the official arrays — zero changes to existing consumer components. IDs prefixed with `homebrew-` for collision avoidance. CRUD editors in `src/components/homebrew/` (12 type-specific editors + shared `EditorLayout`, `TierEditor`). Campaign sharing: `campaignIds` field on `HomebrewItem`, `homebrew_content` JSONB column on `shared_campaigns`, `useHomebrewContentSync` hook (debounced 3s DM push), `registerCampaignHomebrew()` for player-side registration via `useRealtimeCampaign`. Homebrew badges (violet) shown on PowerCard, FeatsPanel, EquipmentPanel. Graceful degradation: `MissingHomebrewPlaceholder` component (`HomebrewBadge.tsx`) shows a red warning card with Remove button when a character references a deleted/unavailable homebrew item. Integrated in PowersPanel (detects `homebrew-` IDs where `getPowerById()` returns undefined), FeatsPanel (detects `homebrew-` IDs where `getFeatById()` returns undefined), and EquipmentPanel (detects `homebrew-` gear items not found in GEAR array). Deleted homebrew weapons/armor/magic items naturally fall into the gear tab catch-all and render as missing placeholders. Editor UX improvements: all free-text fields that reference official game data replaced with structured dropdowns. WeaponEditor: properties field is dropdown+add+tags from 23 official weapon properties. GearEditor: category is dropdown (7 categories: Gear, Component, Musical Instrument, Food & Drink, Lodging, Transport, Mount). MagicItemEditor: enhancementType is dropdown (None, AC, Attack rolls and damage rolls, Fortitude/Reflex/Will). MagicArmorEditor: armorTypes uses Preset/Specific toggle (presets: Any, Any shield; specific: dropdown+add+tags for 7 armor types); enhancementType is dropdown (AC). MagicWeaponEditor: weaponTypes uses Preset/Specific toggle (presets: Any, Any melee, Any ranged; specific: dropdown+add+tags for 15 weapon groups); enhancementType is dropdown. MagicImplementEditor: enhancementType is dropdown; critical uses checkbox + quantity input + die dropdown (d6/d8/d10/d12) + static "damage per plus" text. FeatEditor: prerequisite race/class/trained skill fields are dropdown+add+tags populated from RACES, CLASSES, SKILLS arrays. PowerEditor: keywords field is dropdown+add+tags from 38 official keywords; range field is structured as range type dropdown (12 types: Melee weapon, Ranged, Close burst, etc.) + conditional value text input. RaceEditor: full editor with basic info (name, size, speed, vision), fixed ability bonuses (6-column grid), optional ability choice bonus (checkbox + amount + ability picker), racial skill bonuses (dropdown+add), languages (tag chips with dropdown+add), defense/stat bonuses (Fort/Ref/Will/Initiative/Surges), racial flags (bonus feat, bonus skill, bonus at-will), and racial traits (repeating name+description groups with conditional toggle). ClassEditor: full editor with basic info (name, role dropdown, power source dropdown), key abilities (toggle buttons), HP & healing (HP at 1st/per level, surges/day), defense bonuses (Fort/Ref/Will), proficiencies (armor/weapon/shield/implement toggle grids), available skills (toggle buttons from all 17 skills + trained count), mandatory trained skills (auto-trained like Rogue's Stealth), power counts (at-will/encounter/daily), and class features (repeating name+description+level groups). Homebrew races and classes automatically appear in character creator race/class pickers, plus in PowerEditor class dropdown and FeatEditor prerequisite pickers, via the live `let RACES`/`let CLASSES` arrays. Cloud sync: `user_homebrew` Supabase table (same schema as `user_characters`), `homebrewCloudService.ts` (push/pull/soft-delete), `useHomebrewCloudSync.ts` hook (pull on startup, debounced 3s push per item, soft-delete on local delete), `mergeCloudHomebrew()` store action (newer-wins by `updatedAt`). Export/import v2: backup version bumped to 2, now includes all 5 Dexie tables (characters, campaigns, sessions, encounters, homebrew); backward compatible with v1 files (missing homebrew gracefully skipped); preview shows homebrew count + v1 notice.
- [x] Heroes of the Feywild (HotF) content expansion: 3 races (hamadryad, pixie, satyr) with 5 racial powers (Hamadryad Aspects, Pixie Dust, Shrink, Lure of Enchantment), 32 feats (28 heroic, 3 paragon, 1 epic — includes 3 multiclass feats for barbarian/druid/bard+wizard, race-specific feats for pixie/hamadryad/satyr/gnome/eladrin/elf/wilden, expertise feats, and Fey Bond/Cantrip chain), 3 magic totems (Wrath of Nature, Reclaimer's, Shepherd's), 22 Feywild-themed gear items (Cold Iron Shackles, Doppelganger Mask, False Path Stones, Pixie Music Box, Wolfsbane, etc.), 4 consumables (Horse's Breath L6, Unseelie Candle L7, Hag's Doorknob L12, Ray of Feywild Sunshine L17). No HotF weapons or armor exist in the source. `RaceData.size` type union expanded to include `'Tiny'` for Pixie. Pixie is the first Tiny PC race with fly speed 6 (altitude limit 1), reach 1, and space-sharing rules. Race data in `src/data/races/hamadryad.ts`, `pixie.ts`, `satyr.ts`; racial powers in `src/data/powers/racial.ts`; feats in `src/data/feats/index.ts` with `hotf-` ID prefix.
- [x] Class Features tab: Level 0 auto-granted class powers now shown as read-only info cards (no pin button). Pin-to-quick-tray buttons are only available on the Powers tab and Actions tab. Generic level 0 class power rendering added to PowersPanel covering all classes (not just wizard/warlock/monk/fighter) — shows teal "Class" badge with pin button for at-will and encounter class powers.
- [x] Feat picker UX improvements: All 3 feat pickers (FeatsPanel, Step7_Feats, LevelUpModal) now sort feats alphabetically. FeatsPanel picker now has an "Eligible only" toggle button (defaults ON, white when active) that filters out feats the character doesn't meet prerequisites for — matching Step7_Feats which already had this toggle. LevelUpModal pre-filters to eligible feats only (no toggle needed).
- [x] Wizard draft auto-save: `useWizardStore` persisted to `localStorage` (key: `dnd4e-wizard-draft`) via Zustand `persist` middleware. All wizard form state saved automatically on every change. `useAppStore` also persists the `'wizard'` view so refreshing returns to the wizard. `resetWizard()` clears the persisted draft. CharacterList shows a "Draft in progress — Step N/10" banner with Resume/Discard buttons when a draft exists (detected by non-empty name, raceId, or classId).
- [x] Equipment search in wizard: Step8_Equipment now has a search bar that filters weapons, armor, and gear by name. Search clears when switching between equipment tabs.
- [x] Responsive character sheet layout: 3-column layout now activates at `lg:` (1024px+) instead of `md:` (768px). On tablets (768-1023px), columns 1+2 sit side by side and column 3 goes full-width below. All tab bars (main tabs + sub-tabs) use `overflow-x-auto` + `min-w-max` + `whitespace-nowrap` for horizontal scrolling on narrow screens instead of crushing text. Column 3 absolute positioning only activates at `lg:` so it flows naturally on smaller screens.
- [x] Three ability score methods in wizard Step 4: Point Buy (two-phase: dropdown assignment from pool [10,10,10,10,10,8] then +/- point spend with 22 budget), Standard Array (assign [16,14,13,12,11,10] via dropdowns, all start unassigned), Rolling Scores (4d6 drop lowest, multiple groups, assign+apply). All methods start with `baseAbilityScores` at 0. `pointBuyStartingSet` flag on wizard store tracks point-buy phase. `canProceed` Step 4 enforces all scores assigned + point-buy in adjust phase. `abilityScoreMethod` field on wizard store (`'point-buy' | 'standard-array' | 'rolled'`). Class key ability recommendation shown. Racial bonuses displayed on all panels.
- [x] Bard starting rituals (Bardic Training): Bards get a ritual book with 2 level 1 rituals chosen during Step 8 (Equipment). `bardStartingRitualIds: string[]` on wizard store (max 2, persisted). Violet-themed picker in Step8_Equipment.tsx shows all level 1 rituals including bard-only ones (Glib Limerick, Traveler's Chant) with "Bard Only" badge. `toggleBardStartingRitual` action. `buildCharacter()` creates a `RitualBook` entry (same as psion pattern). Resets on class switch. Mirrors existing wizard starting rituals (3 rituals, teal) and psion (1 ritual, picker in Step 3).
- [x] Ritual Caster free feat banner for all ritual-casting classes: Step7_Feats.tsx now shows the "Class Feature — Free Feat: Ritual Caster" banner for all 6 classes with Ritual Casting (wizard, bard, cleric, druid, invoker, psion) with class-specific description text, not just wizard.
- [x] Feat picker default filter state: "Eligible only" button in Step7_Feats defaults to OFF (`availableOnly = false`) — all feats shown on load with ineligible ones greyed out/disabled. Clicking the button (turns amber) hides ineligible feats entirely. Button styling correctly reflects filter state: amber = filter active, white = filter inactive.
- [x] Read-only character sheet in campaign view: Clicking a character in the Party Roster (SharedCampaignView or CampaignManagementPage) opens a full read-only `CharacterSheet` in a modal overlay. `ReadOnlyContext` (`src/components/sheet/ReadOnlyContext.ts`) provides `useReadOnly()` hook consumed by 11 panel components to hide/disable edit controls (buttons, inputs, pickers, modals). `character_data JSONB` column on `character_summaries` stores full Character JSON (portrait stripped to keep <50KB); portrait restored from separate `portrait_url` field. `extractSummary()` now includes `character_data`. `useCharacterSync` watches `character.updatedAt` for full-data sync. `useSharingStore` provides `viewingCharacter`/`viewingCharacterLoading` state + `fetchCharacterData()`/`clearViewingCharacter()` actions. `CharacterSheet` accepts `readOnly` prop; hides QuickTrayPanel and DiceRoller FAB when read-only. Panels guarded: SheetHeader (Level Up, Rest buttons), HitPointsBlock (+/- buttons, HP input), PowersPanel (add/remove/choose, usage toggles, augment controls), FeatsPanel (add/remove, picker), EquipmentPanel (add/remove/equip, tier selectors), CurrencyPanel (+/- buttons, inputs), NotesPanel (textarea), RitualsPanel (buy/add/remove), SpellbookPanel (buy/add/prepare/rename/delete), ActionsByTypePanel (pin buttons, usage toggles), ChannelDivinityPanel (Use toggles), DisciplinePowersPanel (Use toggles).
- [x] DM character linking in Party Roster: DM can now link/unlink a character to their own Party Roster card from `CampaignManagementPage`. `MemberCard` component accepts `onLinkClick` prop — when it's the current user's card with no character linked, shows clickable "+ Link a character" (amber text) instead of passive "No character linked". `LinkCharacterModal` imported and wired in `CampaignManagementPage` with `showDmLinkModal` state. Unlink button shown below roster when DM has linked character. Same `onLinkClick` prop wired in `SharedCampaignView` for player cards.
- [x] Campaign sidebar layout: "Your Campaigns" and "Joined Campaigns" sections now in a single scrollable panel instead of joined campaigns being pinned to the bottom with a fixed `max-h-48`. Clear uppercase labels ("YOUR CAMPAIGNS" / "JOINED CAMPAIGNS") distinguish sections. "+ Join" button inline with the "Joined Campaigns" label. Removed old bottom-pinned indigo "Shared Campaigns" bar.
- [x] Player campaign view always-visible headers: `SharedCampaignView` now always shows "CAMPAIGN DESCRIPTION" and "CAMPAIGN NOTES" section headers even when content is empty (displays "No description yet." / "No notes yet." in italic). Campaign description moved from inline in the name header card to its own dedicated section.
- [x] Stale connection resilience for character data fetch: `getCharacterData()` in `sharingService.ts` bypasses the Supabase JS client entirely — uses raw `fetch()` to the PostgREST endpoint with the access token read directly from localStorage (`getStoredAccessToken()`). On 401 (expired JWT after idle/minimize), automatically refreshes the token via raw `fetch()` to `/auth/v1/token?grant_type=refresh_token` using the stored refresh token (`refreshAccessToken()`), updates localStorage, and retries the query. Store has 10s `Promise.race` timeout per attempt with one auto-retry. `useRealtimeCampaign` hook reconnects Supabase realtime channels on `visibilitychange` (tab restore after minimize).
- [x] Player characters in DM's Characters section: `CampaignManagementPage` CHARACTERS section now shows a "Player Characters" subsection below the DM's local characters. Populated from `activeCampaignSummaries` (filtered to exclude DM's own). Each card shows character name, level, race/class, player name (indigo accent), portrait, and clickable chevron to open read-only sheet. Indigo border distinguishes player characters from DM-added local characters.
- [x] Rich text editor for Notes and Background: Replaced plain `<textarea>` in `NotesPanel.tsx` (character sheet Notes tab) and `Step1_Basics.tsx` (wizard Background/Notes field) with TipTap `RichTextEditor` component (bold, italic, underline, headings, lists, links, tables, images, colors, alignment). Background displayed in NotesPanel Profile tab via `RichTextDisplay` (DOMPurify-sanitized HTML). Existing plain-text values render fine — TipTap handles plain text gracefully. Fixed TipTap infinite update loop by guarding `useEffect` content sync with `!editor.isFocused`. Fixed placeholder positioning (wrapped editor in `relative` container with `absolute` overlay).
- [x] Wizard Review step detail panels: Race, class, and build choice (subclass) on `Step10_Review.tsx` are now clickable (dotted underline, 44px touch targets). Clicking opens an inline amber detail panel: Race panel shows size/speed/vision/skill bonuses/traits/racial powers. Class panel shows role/power source/HP/surges/key abilities/armor+weapon proficiencies/implements/level 1 features. Build Choice panel shows all options side-by-side with selected one highlighted. Only one panel open at a time. `BUILD_CHOICE_DESCRIPTIONS` constant maps all 17 class build choices to labels and descriptions. Powers and feats also clickable — powers expand to show action type/range/keywords/target/attack/hit/miss/effect/special/flavor via `PowerDetail` component; feats expand to show benefit text, special notes, and granted powers.
- [x] Standard Actions tab: New "Standard Actions" sub-tab in Combat tab (`StandardActionsPanel.tsx`). Contains Second Wind encounter action card with red encounter-power header, circle usage toggle (same pattern as encounter powers), healing surge value display, +2 defense bonus, current surges remaining. Dwarf auto-detects Dwarven Resilience and shows "Minor Action" instead of "Standard Action". `secondWindUsed?: boolean` field on Character type, reset on short and extended rest in `SheetHeader.tsx`. Action points now only reset on extended rest (not short rest).
- [x] Weapon feat damage bonuses in combat actions: `CombatActionsPanel.tsx` `weaponFeatDamageBonus()` function checks character feats and applies weapon-group-specific damage bonuses: Dwarven Weapon Training (+2 axes/hammers), Eladrin Soldier (+2 longswords/spears), Goliath Greatweapon Prowess (+2/+3/+4 by tier for two-handed simple/military melee). Bonus shown in damage total and amber breakdown text with feat source name.
- [x] Mobile header reorganization: `SheetHeader.tsx` restructured for mobile screens. Previously the right-side control column (Speed, Level, Level Up, Rest, Initiative, Save) had `min-w-[24rem]` which forced the header wider than phone screens and squished body content. Now: top row is just portrait + name + ▼/▲ Info toggle button; info section (race/class/tier, role/size/initiative/vision, player, alignment/deity, XP bar) is collapsible (default expanded) with a single toggle button; action buttons moved to their own `flex-wrap` row below the info section so they wrap across multiple lines on narrow screens. Smaller button sizing (`text-xs`, `px-2.5 py-1`) to fit more per row. Initiative/Save result cards now drop upward (`bottom-full`) instead of downward so they don't overlap the sheet content below the sticky header. Rolling one clears the other's result so the two result boxes never overlap each other on screen.
- [x] Available Actions tab restructuring: Removed standalone "Standard Actions" sub-tab — Second Wind card (`StandardActionsPanel`) now renders inline on the "Available Actions" tab between Combat Actions and Power Actions. ActionsByTypePanel wrapped in a white card with amber "POWER ACTIONS" header (matching "COMBAT ACTIONS" style) for clearer visual separation between the two power sections.
- [x] Skills roll result inline: `SkillsPanel.tsx` now renders the roll result card **directly above the rolled skill** instead of at the top of the panel. `SkillRoll` interface gained a `skillId` field; the active-row check switched from name comparison to ID comparison. Much better UX on tablet and phone — the result stays visible next to the skill you tapped, no scroll required. Still auto-dismisses after 4 seconds.
- [x] Tab reorganization (sheet layout pass):
  - **Notes top-level tab removed** — Notes moved into Features as a sub-tab.
  - **Profile split from NotesPanel** into new `ProfilePanel.tsx` and promoted to a Features sub-tab between Racial Features and Notes. `NotesPanel` simplified to just the rich text editor (no internal sub-tabs).
  - **Proficiencies moved** from Actions → Proficiencies (gone) to Features → Proficiencies (between Racial Features and Profile).
  - **Feats promoted** from a Powers sub-tab to a top-level tab between Powers and Features. Top-level tab order is now: Actions · Powers · Feats · Features · Paragon · Inventory.
  - **Powers sub-tab bar hidden when only one sub-tab** — previously showed a redundant "Powers" label for classes without Channel Divinity / Discipline Powers / Implement Mastery / Eldritch Pact. Now the sub-tab bar only renders when `powersTabs.length > 1`.
  - **Features sub-tab order:** Class Features · Racial Features · Proficiencies · Profile · Notes.
- [x] Class Features / Racial Features layout consistency: Both panels wrapped in the standard white card + maroon (amber-800) uppercase header (matching Profile, Notes, Skills, Combat Actions, etc.) with a small amber subtitle showing the class/race name. `RacialFeaturesPanel` Racial Summary rebuilt to use the same appearance-style card grid as `ProfilePanel` → Appearance: `grid grid-cols-2 gap-2` of `bg-stone-50 rounded-lg border border-stone-200 px-3 py-2` cards with stone-400 uppercase label + stone-800 value. Single-value rows span 1 column (Size, Speed, Vision, Languages); multi-value rows span both (Ability Bonuses, Skill Bonuses, Defense Bonuses, Initiative Bonus, Extra Healing Surges). Old teal-bordered summary card removed.
- [x] User Instructions page: New `InstructionsPage.tsx` accessible from the sidebar under Settings → "📖 User Instructions" (above Import / Export). `AppView` type gained `'instructions'`. Scrollable help page with a table of contents and 8 card sections (Getting Started, Character Creation Wizard, The Character Sheet, Short & Extended Rests, Campaigns & Party Sharing, Homebrew Workshop, Backup & Transfer, Tips & Tricks). Uses the same maroon-header card pattern as the rest of the app. `SECTIONS` constant in the file is easy to edit to add/modify content.
- [x] Portrait sync reliability: `PortraitPage.tsx` now bumps `updatedAt: Date.now()` on the in-memory character object after DB patch, so `useCharacterSync`'s dep array re-fires and pushes the new portrait to Supabase. Added "↻ Sync to Campaign" button that forces a full push with explicit error toasts (diagnostic aid when auto-sync silently fails). `useCharacterSync` restructured: `campaignIdRef` (ref) → `campaignId` (useState) so the initial sync fires when the campaign lookup resolves (previously refs didn't trigger re-renders, so first-time syncs got stuck). Added `console.debug`/`console.warn` logging to surface previously-silent sync failures.
- [x] Campaign unified characters list: `CampaignManagementPage` Characters section now counts and renders both DM-added local characters AND party-roster-linked player characters as one list. Removed the separate "Player Characters" subsection. "X characters in this campaign" count reflects the combined total. Empty state shows only when both lists are empty. Player-linked cards still visually distinct with indigo border and "Player:" label.
- [x] Encounter character assignment: `SessionEncounter` type gained optional `characterIds?: string[]`. Encounter cards now have a "Characters" section below "Monsters" (separated by labeled dividers) with green "PC" badges listing characters assigned to that encounter. "+ Add Character from Campaign" button opens an emerald-themed picker modal showing all campaign characters (both DM-added locals and party-roster-linked players). Already-added characters are greyed out with an "Added" label. Initiative tracker `pcPool` now pulls from `activeEncounter.characterIds` instead of campaign-wide list, resolving each ID to either a local Character or a CharacterSummary and normalizing to a common shape `{ id, name, level, raceId, classId, portrait, currentHp }`.
- [x] Rich text editors for session + encounter fields: `CampaignManagementPage` session fields (Important Events from Previous Sessions, Planned Summary, Additional Notes) and encounter description now use TipTap `RichTextEditor`. Encounter description wrapped in new `EncounterDescriptionEditor` helper component at the bottom of the file — keeps HTML in local state while typing, debounces DB save to 1 second, flushes immediately on unmount to prevent data loss. **Reads the live encounter from Dexie by ID at save time** (via `encounterRepository.getById(encounterId)`), not from a captured `encounter` prop — avoids stale-closure clobbering when other concurrent edits (monster add, character add) change the encounter between keystrokes and the debounced save. Logs `[EncounterDescriptionEditor] Saved description for <id> (len N)`. On save failure the dirty flag is restored so the next edit retries.
- [x] Campaign cloud sync — fixed silent data loss: `useCampaignCloudSync` + `useCampaignsStore.mergeCloudCampaigns` rewritten to handle session/encounter updates correctly. **Bug:** a campaign's `updatedAt` only changes when the campaign's own fields (name/notes/description) change — editing a child session or encounter doesn't bump the parent. The old push hook's combined-hash check missed session/encounter changes entirely, so encounter edits never reached Supabase. Even when the bundle pushed, the old merge logic was gated on `cloudCampaign.updatedAt > local.updatedAt` — if only a session or encounter was new, the gate stayed false and the bundle's sessions/encounters were silently discarded. **Fix:** (1) Push hook watches `sessionsByCampaign` + `encountersBySession` stores and uses per-campaign fingerprints (campaign `updatedAt` + each nested session/encounter `updatedAt`) — so any nested change triggers a push, and only the specific campaign(s) that changed are pushed. (2) Merge logic evaluates sessions and encounters **per-record** by their own `updatedAt` — independent of the parent campaign's timestamp. Added detailed diagnostic logging to every layer (`[pushCampaignToCloud]`, `[useCampaignCloudSync]`, `[mergeCloudCampaigns]`, `[EncounterDescriptionEditor]`) so future sync issues can be diagnosed from the console instead of guessed at. Captured baseline hashes on first run to avoid spurious pushes on mount.
- [x] Homebrew Workshop banner: `HomebrewWorkshopPage.tsx` banner rebuilt to match Monster Compendium and Magic Item Compendium style. 160px tall, themed SVG artwork (dark amber/rust gradient background with anvil + hammer + wrench + gears + forge glow + rising embers). Centered uppercase title with text-shadow glow and dynamic subtitle showing item count. Previous flat gradient banner replaced.
- [x] Homebrew Monsters (13th content type): Added `'monster'` to `HomebrewContentType` and `HOMEBREW_CONTENT_TYPES`; `HomebrewDataMap.monster = MonsterData`. New `MonsterEditor.tsx` (`src/components/homebrew/`) — full editor covering all D&D 4e monster fields: identity (level/role/role modifier/XP/size/origin/type/alignment/keywords), defenses + stats grid (HP/AC/Fort/Ref/Will/Init/Perception/speed), senses/resist/immune/vulnerable/languages (comma-separated lists via `ListInput` helper), flavor description, repeating powers blocks (name/action/keywords/recharge/description). **Image upload**: PNG/JPEG/GIF/WebP up to 3 MB, center-cropped to a 300×300 JPEG (≈25–40 KB) via new shared `src/lib/imageProcessing.ts` (`processSquareImage()`, `validateImageFile()`, `MAX_IMAGE_FILE_BYTES`). `MonsterData` type gained optional `portrait?: string` (base64 data URL) and `description?: string` (flavor text) — both backwards-compatible with 1000+ official monsters. `MonsterSource` union extended with `'homebrew'`. `src/data/monsters/index.ts` gained `registerHomebrewMonsters()` / `unregisterHomebrewMonsters()` (converted `ALL_MONSTERS` from `const` to mutable `let` merged with `OFFICIAL_MONSTERS`). `useHomebrewStore.syncToDataLayer()` wires monsters the same as every other homebrew type. `MonsterModal` shows the portrait (160px) and flavor description at the top of the stat block when present. `MonsterCompendiumPage` `MonsterRow` renders a 40px portrait thumbnail when present and adds `homebrew` to the source filter chips. Encounter monster picker automatically shows homebrew monsters since it reads the merged `ALL_MONSTERS` array via `searchMonsters()`.
- [x] Homebrew Workshop pill grid redesign: `HomebrewWorkshopPage.tsx` content-type selector changed from a single horizontal scrolling row to a responsive grid (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`) — 13 content types fit in 3 rows on desktop (5+5+3), wrap gracefully on mobile. Each type now has its own icon + color theme via `CONTENT_TYPE_META` map: 🧝 Races (violet), ⚔️ Classes (red), ✨ Powers (purple), 🎯 Feats (orange), 🗡️ Weapons (stone), 🛡️ Armor (sky), 🎒 Gear (amber), 💎 Magic Items (indigo), 🧿 Magic Armor (blue), ⚡ Magic Weapons (rose), 🔮 Magic Implements (fuchsia), 🧪 Consumables (emerald), 🐉 Monsters (teal). Active pill fills with its theme color + slight lift (`shadow-md scale-[1.02]`); idle pills have themed 2px border + tinted icon square; hover tints the background.
- [x] Multi-stage attack chains in PowerData: Powers with chained Secondary (and rare Tertiary) attacks now have first-class structured fields instead of cramming everything into a single `hit`/`effect` string. Added to `PowerData` (`src/types/gameData.ts`): `secondaryTarget`, `secondaryAttack`, `secondaryHit`, `secondaryMiss`, `secondaryEffect`, `tertiaryTarget`, `tertiaryAttack`, `tertiaryHit`, `tertiaryMiss`, `tertiaryEffect` — all optional, backward compatible. PowerCard (`src/components/wizard/shared/PowerCard.tsx`) renders each stage as its own block with a left-border accent (`border-l-2 border-stone-200 pl-2`) and a small uppercase "SECONDARY ATTACK" / "TERTIARY ATTACK" header; reuses the same color scheme as primary (emerald Hit, red Miss, blue Effect). `Druid Ferocious Maul` (level 25 daily) migrated to structured form — three distinct attack stages render with proper visual separation. Other multi-stage powers still inline the secondary text in `hit`/`effect`; can be migrated incrementally.
- [x] Power data parser truncation sweep: Fixed 33 powers across 8 class files where the original iws.mx scraper truncated multi-stage attack text after the orphan word `Secondary`. Affected: ardent (Prescient Strike, Intellect Bomb), barbarian (Terror's Cry, Shoulder Slam, Rampaging Dragon Strike), druid (Predator's Flurry, Feast of Fury, Lightning Cascade, Ferocious Maul), monk (Strike the Avalanche, Relentless Hound Technique, Whirlwind Kick, Duel in the Heavens, Fist of Golden Light, Tap the Life Well, Stunning Fist), psion (Ravening Thought, Mind Cannon, Shred Reality), seeker (Corralling Shot, Tremor Shot, Quill Storm, Lightning Burst, Thundering Shot), warden (Thunder Ram Assault, Thorn Burst, Icy Shards, Call Forth the Harvest, Nature's Ally, Weight of the Mountain), sorcerer (Chaos Bolt, Acidic Implantation, Thunder Leap, Wildfire Curse). Methodology: connected via `Claude_in_Chrome` MCP to iws.mx, force-loaded all 20 power data files (9,415 entries decompressed in-browser via `<script>` injection), located each truncated power by name+class in `od.data.category.power.list`, extracted rendered HTML from `od.data.category.power.data[id]`, parsed to plain text. Applied via Node script (`C:\Claude\fix_secondary_powers.js`) that scopes each replacement to its specific entry by `id` to prevent cross-power collisions on shared placeholder strings (`'Make a secondary attack. Secondary'` appears in 5+ powers). Script aborts atomically if any single match is ambiguous, preventing partial application. Also fixed `target: 'One creature Primary'` → `'One creature'` parser artifact and removed bogus `'m'` keyword from Ferocious Maul. All replacement text verified directly from iws.mx (PHB2/PHB3) per the source-accuracy rule.
- [x] Homebrew player-to-player export/import: Players can share custom races, classes, powers, feats, equipment, and monsters with each other as JSON files — independent of the campaign sharing system, works without auth or VPN. **Export single item:** every row in `HomebrewWorkshopPage` has an Export button that downloads just that item as `homebrew-<contentType>-<safeName>-<YYYY-MM-DD>.json`. **Export All:** toolbar button downloads every homebrew item the user has as `homebrew-all-<YYYY-MM-DD>.json`. **Import:** toolbar button opens `HomebrewImportModal` (`src/components/homebrew/`) — file picker, type-broken-down preview, conflict resolution. **File format** (`src/lib/homebrewExport.ts`): `{ type: 'dnd4e-homebrew', version: 1, exportedAt: ISO8601, items: HomebrewItem[] }` — `parseHomebrewImport()` validates the envelope and per-item required fields (`id`, `contentType`, `name`, `data`); throws specific error messages on malformed input. **Cross-user safety:** `buildExport()` strips `campaignIds` (local Dexie campaign IDs that don't translate across users) before writing the file; on import, `prepareImport()` strips `campaignIds` again and rewrites `createdBy` to the importing user so cloud sync (`useHomebrewCloudSync`) treats imported items as the importer's own. **Conflict modes** (offered only when duplicates exist by ID): `skip` (default — keep existing), `replace` (overwrite, preserves original `createdAt`, bumps `updatedAt`), `duplicate` (regenerate ID via `homebrew-${uuidv4()}` so both versions coexist). **Store integration:** new `importItems(items)` action on `useHomebrewStore` calls `db.homebrew.bulkPut()` (preserves IDs, unlike `addItem` which always generates new ones), then re-reads from Dexie and calls `syncToDataLayer()` so imported races/classes/powers immediately appear in pickers. The existing cloud-sync hook picks up the new items and pushes them to Supabase debounced.

---

## Multiclassing System

Implemented via feats — no separate "multiclass" step.

- **8 multiclass feats** in `src/data/feats/index.ts` — each has `multiclassFor: 'classId'`
- **3 power-swap feats**: `novice-power`, `acolyte-power`, `adept-power` (prereq: `anyMulticlassFeat: true`)
- **Helpers** in feats/index.ts: `MULTICLASS_FEAT_MAP`, `getMulticlassId(selectedFeatIds)`, `POWER_SWAP_FEAT_IDS`
- Secondary class derived at render time from `selectedFeatIds` — NOT stored separately
- MC feats may grant a **skill choice** (`mcProficiencyChoices?: string[]`) or **fixed skill** (`mcFixedSkill?`) and/or a **weapon proficiency choice** (`mcProficiencyChoices`) or **fixed proficiency** (`mcFixedProficiency`)
- Player choices stored on Character: `mcFeatSkillChoices[featId]` and `mcFeatProficiencyChoices[featId]`
- Proficiencies from MC feats surfaced in **ProficienciesPanel** → Weapons section

### Power Swap Rules (D&D 4e)
| Feat | Reduces | Adds |
|---|---|---|
| Novice Power | 1 at-will slot | 1 secondary class L1 encounter slot |
| Acolyte Power | 1 encounter slot | 1 secondary class L1 daily slot |
| Adept Power | 1 daily slot | 1 secondary class L3 encounter slot |

### Implementation Details
- `PowersPanel.tsx`: detects MC feats → computes `mcEncounterSlots` / `mcDailySlots` arrays
- MC slots render with **indigo** border/color (vs primary amber)
- Separate `mcPickerSlot` state opens a dedicated indigo-themed MC picker modal
- `PickerRow` component accepts `accentColor: 'amber' | 'indigo'` prop
- `SheetHeader.tsx`: shows "ClassName / SecondaryName (MC)" when multiclassed
- `Step7_Feats.tsx`: `meetsPrerequisites()` checks `anyMulticlassFeat` prereq

---

## Paragon Paths (src/data/paragonPaths.ts)

96 paths defined — 24 PHB1 (3 per PHB1 class) + 44 PHB2 (class-specific + race-specific) + 28 PHB3 (4 per PHB3 class + 4 race-specific).

```typescript
interface ParagonPathBonuses {
  ac?: number;
  fortitude?: number;
  reflex?: number;
  will?: number;
  initiative?: number;
  savingThrowBonus?: number;
  extraWeaponProficiencies?: string[];
  extraArmorProficiencies?: string[];
  /** Power IDs cross-granted to this character (e.g. Warpriest cleric gaining paladin's Divine Challenge) */
  grantedPowerIds?: string[];
}

interface ParagonPathData {
  id: string;
  name: string;
  classId: string | null;  // null = any class
  prerequisite?: string;
  description: string;
  features: string;
  bonuses?: ParagonPathBonuses;   // Applied only at level >= 11
}

getParagonPathById(id): ParagonPathData | undefined
getParagonPathsByClass(classId): ParagonPathData[]   // includes null-classId paths
getParagonPathsForCharacter(classId, raceId): ParagonPathData[]  // filtered by class AND race prerequisites
```

- **Use `getParagonPathsForCharacter()`** (not `getParagonPathsByClass()`) in UI code — it enforces race prerequisites for race-specific paths (classId: null). `getParagonPathsByClass()` returns ALL null-classId paths regardless of race.
- All 24 PHB1 paths have a `bonuses` object — defense bonuses applied in `useCharacterDerived.ts`
- 44 PHB2 paths include class-specific (classId set) and race-specific (classId: null with prerequisite text)
- PHB2 race-specific paths: Deva, Gnome, Goliath, Half-Orc, Human, Shifter
- Proficiency grants applied in `ProficienciesPanel.tsx`
- `grantedPowerIds` resolved in `ChannelDivinityPanel.tsx` to merge cross-class CD powers
- Bonuses only apply when `character.level >= 11` (checked at every consumption site)
- Notable: **Warpriest** grants `{ ac: 1, fortitude: 1, extraWeaponProficiencies: ['Military Melee', 'Military Ranged'], grantedPowerIds: ['paladin-divine-challenge'] }`
- Notable: **Anointed Champion** grants `{ fortitude: 1, will: 1, savingThrowBonus: 1 }`

Selected at level 11 via `LevelUpModal` → `ParagonPathPickSection` (amber/gold themed).
Stored as `character.paragonPath: string` (the path ID).
Displayed in `ClassFeaturesPanel` when `character.level >= 11`.

---

## Half-Elf Dilettante System

Half-Elves gain a bonus at-will power from a **different** class at character creation (Dilettante racial feature). This power is usable as an encounter power per D&D 4e rules.

### Data model

```typescript
// On Character:
dilettantePowerId?: string;   // ID of the chosen at-will power from another class
dilettanteClassId?: string;   // ID of the source class (different from character.classId)
```

### Key implementation details

- **Separate slot:** The dilettante power is NOT counted in the primary at-will max. `primaryMax['at-will']` = class base + human bonus − novice swap. The dilettante adds +1 to `maxCounts['at-will']` separately.
- **Separate display:** In `PowersPanel.tsx`, the dilettante renders in its own section below the primary at-wills, with a "Dilettante — {ClassName}" divider header and a violet source class badge.
- **Replace-only:** No remove button on the dilettante power. A violet "Replace" button opens a dedicated picker modal restricted to **level 1 at-will powers from the same source class** (`dilettanteClassId`). The source class cannot be changed after creation.
- **Backward compatibility:** For characters created before `dilettantePowerId`/`dilettanteClassId` were added, `PowersPanel.tsx` falls back to a heuristic: finds the first at-will power in `selectedPowers` where `classId !== character.classId`.
- **Wizard store:** `setRace()` resets `dilettanteClassId` and `dilettantePowerId` when switching races. `buildCharacter()` saves both fields and merges the dilettante power into `selectedPowers`.
- **Creation enforcement:** `canProceed` Step 6 requires `dilettantePowerId` when race is half-elf.

### Files involved

| File | Role |
|---|---|
| `Step6_Powers.tsx` | Dilettante picker during creation (class dropdown + power list, at-will tab only) |
| `PowersPanel.tsx` | Sheet display: separate section, class badge, replace picker modal |
| `Step10_Review.tsx` | Shows dilettante power with "Dilettante" badge in review |
| `CreationWizard.tsx` | `canProceed` Step 6 validation |
| `useWizardStore.ts` | `buildCharacter()` saves fields; `setRace()` resets them |

---

## Warlock Pact System

Warlocks choose a pact at character creation (wizard Step 3). The pact must be chosen before advancing past Step 3 (`canProceed` check in `CreationWizard.tsx`).

| Pact | Boon Name | Power ID |
|---|---|---|
| Infernal | Dark One's Blessing | `warlock-dark-ones-blessing` |
| Fey | Misty Step | `warlock-misty-step` |
| Star | Fate of the Void | `warlock-fate-of-the-void` |

- Pact stored as `character.warlockPact?: 'infernal' | 'fey' | 'star'`
- Pact boon powers have `pactBoon: 'infernal' | 'fey' | 'star'` on `PowerData`
- These powers have no `level` field (no level assigned — they're pact grants, not level picks)
- Auto-granted: filtered out of all power pickers; shown locked in Step6_Powers; shown without remove button in PowersPanel At-Will tab
- `EldritchPactPanel` on character sheet: all 3 pacts shown; chosen one highlighted amber; others 40% opacity; shows lore + boon trigger/effect
- `ClassFeaturesPanel`: when classId === 'warlock', renders `<PactDetail pact={character.warlockPact} />` for Eldritch Pact feature entry

Resetting: `setClass()` in `useWizardStore` resets `warlockPact: ''` when switching away from warlock.

---

## Wizard Arcane Implement Mastery System

Wizards choose an implement at character creation (wizard Step 3). Analogous to the warlock pact.

| Implement | Mastery Encounter Power |
|---|---|
| Orb | Orb of Imposition |
| Staff | Staff of Defense |
| Wand | Wand of Accuracy |

- Implement stored as `character.arcaneImplement?: 'orb' | 'staff' | 'wand'`
- Cantrip powers have `cantrip: true` on `PowerData` (no level assigned)
- Auto-granted; filtered out of power pickers; shown without remove button in PowersPanel
- `ArcaneImplementMasteryPanel` on character sheet: all 3 implements shown; chosen one highlighted
- `ClassFeaturesPanel`: when classId === 'wizard', renders `<ImplementDetail impl={character.arcaneImplement} />` for Arcane Implement Proficiency feature entry

---

## Wizard Spellbook System

### Overview

Wizards use a **multi-spellbook** system analogous to the Ritual Book. Spellbooks store daily and utility powers (not at-wills or encounter powers). Powers are **known** (in spellbooks) vs **prepared** (in `selectedPowers`). Each day the wizard chooses which known powers to prepare.

- Wizard gets **1 free spellbook** ("My Spellbook") at character creation
- Additional books cost **50 gp** each (via "Buy Book" button in SpellbookPanel header)
- Each book holds **128 pages** max; each power/ritual uses pages equal to its level
- Books can be renamed or deleted (deleting moves contents to book 1; wizard must keep ≥1 book)

### Data model

```typescript
// src/types/character.ts
interface WizardSpellbook {
  id: string;
  name: string;
  powerIds: string[];    // daily + utility power IDs; pages used = sum of power levels
  ritualIds: string[];   // mastered ritual IDs; pages used = sum of ritual levels
}
// On Character:
spellbooks?: WizardSpellbook[];        // canonical source
spellbookPowerIds?: string[];          // @deprecated — kept for backward compat
spellbookMasteredRitualIds?: string[]; // @deprecated — kept for backward compat
```

### Helper functions (src/utils/spellbook.ts)

```typescript
export const SPELLBOOK_MAX_PAGES = 128;

// Aggregate all power IDs across books (tries spellbooks first, falls back to legacy)
getAllSpellbookPowerIds(character: Character): string[]

// Aggregate all ritual IDs across books (same fallback logic)
getAllSpellbookRitualIds(character: Character): string[]

// Total pages consumed by one book (sum of power levels + sum of ritual levels)
spellbookPagesUsed(book: WizardSpellbook): number

// Find the best book index with enough space for an entry of the given level
bestBookIndexForEntry(books: WizardSpellbook[], entryLevel: number): number
```

**Always use `getAllSpellbookPowerIds()` / `getAllSpellbookRitualIds()`** (not the deprecated flat fields) whenever you need the full set of known powers/rituals. `PowersPanel.tsx` uses `getAllSpellbookPowerIds()` to mark spellbook powers with the book icon.

### Prepare / unprepare (SpellbookPanel.tsx)

Wizard daily/utility powers are NEVER auto-prepared — not at creation, not on level-up. The user prepares them manually from the Spellbook tab.

```typescript
// Prepare limits per level
maxDailyForLevel(level):   L1=1, L5=2, L9=3, L15=4, L19=5, L25=6, L29=7
maxUtilityForLevel(level): L2=1, L6=2, L10=3, L16=4, L22=5

// Correct discriminator — powerType, NOT usage:
const isUtility  = power.powerType === 'utility';
const isPrepared = isUtility ? preparedUtilityIds.has(id) : preparedDailyIds.has(id);

// preparedDailyIds must exclude utility powers (daily-usage utilities inflate the count otherwise):
const preparedDailyIds = new Set(
  character.selectedPowers
    .map(sp => getPowerById(sp.powerId))
    .filter((p): p is PowerData => !!p && p.usage === 'daily' && p.powerType !== 'utility')
    .map(p => p.id)
);
```

### Auto-migration

`SpellbookPanel.tsx` has a `useEffect` that runs on first open for characters that have `spellbookPowerIds` (legacy) but no `spellbooks` array. It creates a single "My Spellbook" populated with all known legacy powers and rituals. After migration the deprecated fields are kept in sync for backward compat.

### AddRitualToBookModal

- Shows ALL unmastered rituals (none hidden)
- Rituals **above character level** are shown but disabled with "Requires character level N" (amber) — enforced via `r.level <= characterLevel` check
- Rituals that don't fit in the book are disabled with "Not enough pages" (red)
- **Description, duration, and skill check table are always visible** (no expand/collapse)

---

## Channel Divinity (src/components/sheet/ChannelDivinityPanel.tsx)

Available for classes with Channel Divinity: **avenger, cleric, invoker, paladin** (defined in `CHANNEL_DIVINITY_CLASSES` const in `ChannelDivinityPanel.tsx`), **or any class that has a feat-granted CD power** (e.g. a Fighter who takes Armor of Bahamut).

- Appears as a sub-tab in the **Powers** tab (between Powers and Feats)
- Tab visibility: `CharacterSheet.tsx` checks both `CHANNEL_DIVINITY_CLASSES.includes(classId)` and whether any selected feat grants a CD power
- Has internal **Encounter** / **At-Will** sub-tabs (At-Will tab only shown when `hasAtWill` is true)
- Encounter powers tracked in `usedEncounterPowers[]` — reset on Short/Extended Rest (no manual reset button)
- At-will powers (e.g. Lay on Hands, Divine Challenge for Paladin) are unlimited
- **Cross-class grants:** `ChannelDivinityPanel` merges paragon-granted CD powers at level 11+:
  ```typescript
  // Any paragonPath.bonuses.grantedPowerIds entries that resolve to channel-divinity powers
  // are merged into the character's CD pool (de-duped against base class powers)
  ```
- **Feat-granted CD powers:** `ChannelDivinityPanel` also merges CD powers from selected feats (e.g. deity Channel Divinity feats). These share the same per-encounter CD resource as class CD powers.
- Example: Warpriest Cleric gains `paladin-divine-challenge` via paragon path at L11
- Example: Any class worshipping Bahamut with the Armor of Bahamut feat gains `feat-armor-of-bahamut` CD power

### Level 0 Power Architecture — CRITICAL

`level: 0` on a `PowerData` entry means it is an **auto-granted class feature power** (not a player choice). The panel fetches all level 0 powers for the class and splits them:

```typescript
const allLevel0Powers  = getPowersByClass(classId).filter(p => p.level === 0);
const encounterPowers  = allLevel0Powers.filter(p => p.usage === 'encounter');
const atWillPowers     = allLevel0Powers.filter(p => p.usage === 'at-will');

// CD-tagged encounter powers share a single per-encounter use
const cdEncounterPowers = encounterPowers.filter(p => p.keywords.includes('Channel Divinity'));
// Non-CD encounter powers (e.g. Healing Word) track individually
const cfEncounterPowers = encounterPowers.filter(p => !p.keywords.includes('Channel Divinity'));
```

**IMPORTANT:** CD powers are identified by `p.keywords.includes('Channel Divinity')`, NOT by `p.powerType === 'channel-divinity'`. The `powerType` field on CD powers is `'utility'` or `'attack'` — the `'channel-divinity'` value exists in the type definition but is never set in the actual data.

- `cdEncounterPowers`: expend the shared CD resource (using any one blocks all others)
- `cfEncounterPowers`: each tracked independently in `usedEncounterPowers` — separate "Use" button per power
- `atWillPowers`: unlimited (no tracking needed)

---

## SheetHeader Layout (src/components/sheet/SheetHeader.tsx)

Mobile-first layout. Three stacked sections inside the sticky header banner.

### Top row (portrait + name + info toggle)
```
[Portrait]  Character Name                                          [▼ Info]
```
- Portrait (64×64) is a button that navigates to the portrait management page
- Name is click-to-edit inline
- Info toggle button expands/collapses the info section. Controlled by `infoExpanded` state (default `true`).

### Info section (collapsible, full-width, left-justified)
Rendered conditionally when `infoExpanded === true`.
```
Row 1: Elf · Cleric · Paragon Tier · ⭐ Warpriest
Row 2: [Leader badge]  Size: Medium  Initiative +8  Vision: Low-light
Row 3: Player: dilbery  Male  Age 35
Row 4: Alignment: Good  Deity: Ioun  Milestone leveling
XP progress bar (when levelingMode === 'xp')
```

### Action buttons row (always visible, `flex-wrap`, `mt-3`)
```
[🏃 Speed 5 (-1)] [Level 11] [Level Up ↑] [Short Rest] [Extended Rest] [⚡ Initiative (+8)] [🎲 Saving Throw]
```
- Uses `flex flex-wrap gap-1.5` so buttons wrap to multiple rows on narrow screens (mobile)
- Speed badge (sky-blue `bg-sky-700`) shows 🏃 icon + speed value + bonus/penalty indicator (green/red) when speed differs from base race speed
- All buttons are smaller than before (`text-xs`, `px-2.5 py-1`) to fit more per row on mobile
- Initiative and Save result cards drop **upward** (`bottom-full mb-1.5`) so they never overlap the sheet content below the header
- Rolling Initiative clears `saveResult`; rolling Saving Throw clears `initResult` — only one result box shown at a time so they can't overlap each other

The outer header div uses `sticky top-0 z-10` to pin the banner when scrolling.

---

## Initiative Roll (src/components/sheet/SheetHeader.tsx)

- Teal "⚡ Initiative (+n)" button in the action buttons row
- Rolls d20 + `derived.initiative` (DEX mod + half level + magic item bonuses + paragon bonus + feat bonuses)
- **Always calls `playDiceRollSound(1)`** when clicked
- Clears `saveResult` on click so the two result boxes never overlap
- Result card: `absolute bottom-full left-0 mb-1.5` (drops upward, left-anchored), teal, w-44
- Shows full math: `d20: [roll] + [bonus] (Initiative) = [total]`
- × button to dismiss

---

## Saving Throw (src/components/sheet/SheetHeader.tsx)

- Rose "🎲 Saving Throw" button in the action buttons row
- Rolls d20 + `derived.savingThrowBonus`; 10+ = success
- **Always calls `playDiceRollSound(1)`** when clicked
- Clears `initResult` on click so the two result boxes never overlap
- Result card: `absolute bottom-full right-0 mb-1.5` (drops upward, right-anchored), emerald (success) or stone (fail), w-48
- Shows full math: `d20: [roll] + [bonus] ([source]) = [total]`
- Bonus label sourced from paragon path name (when applicable)
- Green card for success (✓ Save!), grey card for failure (✗ Failed)
- × button to dismiss the result card
- `derived.savingThrowBonus` computed in `useCharacterDerived.ts` from `paragonPath.bonuses.savingThrowBonus` + feat bonuses (e.g. Human Perseverance)

### Why result cards use `position: absolute` and drop upward
Both cards use `absolute bottom-full` so they float out of layout flow (never stretching the header height) and drop above the button so they don't overlap the ability scores / tab content below the sticky header.

---

## Source Material Accuracy — CRITICAL RULE

**NEVER make up game data.** All D&D 4e mechanical data (rituals, powers, feats, races, classes, items) must come directly from verified source material. Do not invent stats, skill check tables, costs, levels, durations, or descriptions from memory or inference.

- If you are unsure of a value, look it up at the iws.mx database (see section below) before writing it.
- If you cannot verify a value from a primary source, say so and ask the user rather than guessing.
- This rule applies equally to skill check table tiers, component costs, casting times, key skills, categories, durations, and descriptions.
- Fabricated data has caused multiple full rewrites in this project. Accuracy is non-negotiable.

---

## iws.mx D&D 4e Compendium Database

The authoritative online reference for this project. Contains the full D&D 4e compendium data in a JavaScript-driven offline format.

**Base URL:** `https://iws.mx/dnd/`
**Data files root:** `https://iws.mx/dnd/4e_database_files/`

### Directory structure per data type

Each entity type (ritual, power, feat, race, class, item, monster, etc.) has its own subdirectory:
```
https://iws.mx/dnd/4e_database_files/ritual/
  _listing.js   ← compact list of ALL entries: id, name, level, source book, etc.
  _index.js     ← index mapping entry IDs to data file + offset (OR full text for monsters — see below)
  data0.js      ← compressed data (LZMA + Base85 encoding)
  data1.js
  ...
  data19.js     ← 20 data files total per type
```

Replace `ritual` with other types to access them (e.g. `power`, `feat`, `race`, `class`).

### How to fetch data via WebFetch

- **`_listing.js`** — fetch this first to get a full list of all items with their source book. Use it to identify which entries belong to PHB only. Readable plain text.
- **`data0.js` through `data19.js`** — these are LZMA+Base85 compressed. WebFetch can only read ~15–20 **uncompressed** entries per file (those happen to appear at the start of each file uncompressed). To find a specific ritual, fetch multiple data files and search by name.
- **Searching all 20 data files** is often required to locate a specific entry — be systematic and check all 20.

### Browsing the live site (Chrome browser MCP)

The site runs a JavaScript app that decompresses all data on demand.

- **Listing URL:** `https://iws.mx/dnd/?list.name.ritual&sort=SourceBook`
  - Replace `ritual` with any type; `sort=SourceBook` groups by source
- **Individual entry URL:** `https://iws.mx/dnd/?view=ENTRY_ID` (note: `view=` works; `?id=` redirects to listing)
- **JavaScript API** (use via `mcp__Claude_in_Chrome__javascript_tool` on the live tab):
  ```javascript
  // Load the listing (id, name, level, source, classname, etc. — no body text)
  window.od.data.load_all_listing('power', function() {});
  // After ~10–30s the listing populates: window.od.data.category.power.list
  // Listing entries have ID, Name, ClassName, Level, Type, Action, Keywords, SourceBook
  ```
- **Bulk-loading full body text — fastest approach**: inject all 20 data files at once as `<script>` tags. The server-side data files are LZMA+Base85 compressed; they self-decompress on load and populate `window.od.data.category.<type>.data[id]` with the rendered HTML for every entry in that file (~470 entries per file).
  ```javascript
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('script');
    s.src = `4e_database_files/power/data${i}.js`;
    document.head.appendChild(s);
  }
  // Wait ~12–25s for decompression; then access:
  // window.od.data.category.power.data['power5101'] // = raw HTML string
  ```
  This loads all 9,415 power entries (~3 MB decompressed) in one batch — far faster than navigating per-entry. Same pattern works for `feat`, `ritual`, `item`, etc.
- **CDP timeout caveats**: `mcp__Claude_in_Chrome__javascript_tool` has a ~45s timeout. Don't use top-level `await` or return a `Promise` — the renderer hangs. Instead: kick off async work, store the result on `window`, return immediately, then re-poll in a separate JS call. Avoid stringifying `od.data.category.<type>.list` directly (circular references via `_category` back-pointers) — strip those keys first or call `JSON.stringify(list.slice(...).map(p => ({ ID: p.ID, Name: p.Name, ... })))`.
- **Tool output truncation**: `javascript_tool` truncates returned strings around ~1000 chars. For longer payloads, `console.log()` each item with a unique marker and read back via `mcp__Claude_in_Chrome__read_console_messages` with a regex pattern — full lines come through intact.

### Source book abbreviations

| Abbreviation | Book |
|---|---|
| `PH` or `PHB` | Player's Handbook (PHB1) — **the only source used for this project** |
| `PHB2` | Player's Handbook 2 — excluded |
| `PHB3` | Player's Handbook 3 — excluded |
| `Dra405` | Dragon Magazine #405 — excluded |
| `MM` | Monster Manual 1 |
| `MM2` | Monster Manual 2 |
| `MM3` | Monster Manual 3 |
| `DMG` | Dungeon Master's Guide |
| `DMG2` | Dungeon Master's Guide 2 |
| `MV` | Monster Vault (2010) |
| `MV:TttNV` | Monster Vault: Threats to the Nentir Vale (2011) |

**Character data includes PHB1 + PHB2 + PHB3.** Filter to `source === 'PHB' || source.startsWith('PHB,') || source === 'PHB2' || source.startsWith('PHB2,') || source === 'PHB3' || source.startsWith('PHB3,')` when fetching from iws.mx. Other sources are excluded unless the user explicitly requests them. The source field in `_listing.js` is the ground truth for book attribution — do not rely on memory.

### Ritual-specific notes

- **72 rituals** total (49 PHB1 + 23 PHB2, levels 1–28).
- Data is in `src/data/rituals.ts` — `RITUALS: RitualData[]` array.
- The `RitualData` interface (`src/types/gameData.ts`) requires: `id`, `name`, `level`, `category`, `componentCost`, `marketPrice`, `keySkill`, `castingTime`, `duration`, `description`; optional: `componentNote?`, `skillCheckTable?: { result: string; effect: string }[]`, `prerequisite?` (class prereq, e.g. 'Bard').
- Some rituals have **two key skills** (e.g. `'Arcana or Nature'`, `'Arcana or Religion'`) — store as a single string.
- `skillCheckTable` rows use exact PHB tier labels (e.g. `'19 or lower'`, `'20–29'`, `'40 or higher'`).
- Ritual categories seen in PHB/PHB2: Exploration, Warding, Restoration, Creation, Divination, Deception, Binding, Scrying, Travel.
- PHB2 rituals include several Bard-only rituals (Glib Limerick, Traveler's Chant, Lullaby, Fool's Speech, etc.) with `prerequisite: 'Bard'`.
- `componentCost` stores only gp; healing-surge requirements go in `componentNote`.
- Focus items (not consumed) are documented in `componentNote`, not in `componentCost`.

---

## Monster Data Pipeline

### Overview

All large data sets (monsters, PHB2 powers, feats, paragon paths, rituals) are fetched from iws.mx via **Node.js generator scripts** stored at `C:\Claude\generate_*.js`. These are run once to regenerate the `.ts` data files whenever a new source book is added. They are **not part of the app** — they're offline tooling.

Generator script pattern: `generate_phb2_<type>.js` (fetcher) → `<type>_raw.json` → `generate_phb2_<type>_ts.js` (converter) → `<type>_output.ts` (paste into app).

### iws.mx Monster Files — CRITICAL DIFFERENCE

The monster type uses a **different `_index.js` format** from all other types:

```
https://iws.mx/dnd/4e_database_files/monster/_listing.js  (~300KB)
https://iws.mx/dnd/4e_database_files/monster/_index.js    (~7MB, plain text)
```

**`_listing.js`** format:
```javascript
od.reader.jsonp_data_listing(timestamp, "monster", [columns], [rows])
// rows is an array of arrays: [id, name, level, role, modifier, size, keywords, sourceBook]
// sourceBook may be a comma-separated list: "MM2,MM" means primary=MM2, also in MM
// The primary source is always the FIRST item before any comma
```

**`_index.js`** format — **NOT compressed, NOT data0-data19 files**:
```javascript
od.reader.jsonp_data_index(timestamp, "monster", { "monsterid": "full plain-text stat block", ... })
// Keys are monster IDs from the listing; values are complete plain-text stat blocks
// This file is ~7MB and contains ALL monsters — fetch once and parse in memory
```

To use in a Node.js generator script:
```javascript
const listingJs = await get('https://iws.mx/dnd/4e_database_files/monster/_listing.js');
const listingMatch = listingJs.match(/jsonp_data_listing\(\d+,\s*"monster",\s*(\[[\s\S]*?\]),\s*(\[[\s\S]*\])\s*\)/);
const rows = JSON.parse(listingMatch[2]);   // array of [id, name, level, role, modifier, size, kws, source]

const indexJs = await get('https://iws.mx/dnd/4e_database_files/monster/_index.js');
const indexMatch = indexJs.match(/jsonp_data_index\(\d+,\s*"monster",\s*(\{[\s\S]*\})\s*\)/);
const monsterIndex = JSON.parse(indexMatch[1]);  // { id: "plain text stat block", ... }
```

### Source Book Filter Strategy

| Goal | Filter |
|---|---|
| Exact source only (no shared entries) | `r[7] === 'SRC'` |
| All entries where SRC is primary (including shared) | `r[7] && (r[7] === 'SRC' \|\| r[7].startsWith('SRC,'))` |

**Counts confirmed from `_listing.js`:**

| Source Code | Book | Count |
|---|---|---|
| `MM` | Monster Manual 1 | 482 |
| `MM2` | Monster Manual 2 | 315 |
| `MM3` | Monster Manual 3 | 295 |
| `DMG` | Dungeon Master's Guide | 8 |
| `DMG2` | Dungeon Master's Guide 2 | 30 (41 total, 11 exclusive to other books) |
| `MV` | Monster Vault | 164 |
| `MV:TttNV` | Monster Vault: Threats to the Nentir Vale | 182 |

When adding a new source book, always build an `existingNames` set from already-loaded sources and filter out duplicates by name (case-insensitive). In practice, the MV-family books had zero name collisions with MM/MM2/MM3/DMG/DMG2.

### Generator Scripts

| Script | Output | Monsters |
|---|---|---|
| `C:\Claude\generate_mm2.js` | `src/data/monsters/mm2.ts` | 315 |
| `C:\Claude\generate_mm3.js` | `src/data/monsters/mm3.ts` | 295 |
| `C:\Claude\generate_dmg.js` | `src/data/monsters/dmg.ts` | 8 |
| `C:\Claude\generate_dmg2.js` | `src/data/monsters/dmg2.ts` | 30 |
| `C:\Claude\generate_mv.js` | `src/data/monsters/mv.ts` | 164 |
| `C:\Claude\generate_mvttnv.js` | `src/data/monsters/mvttnv.ts` | 182 |

**All generators share the same parser** (copy-pasted body). `generate_mm3.js` is the canonical reference — it has all parser fixes applied. When adding a new source, copy `generate_mm3.js` and change: source filter, `source:` literal, ID prefix (`mv-`), export name (`mvMonsters`), output path.

To regenerate a file: `cd /c/Claude && node generate_mv.js`

### Parser Architecture (parsePowerText v3+v4)

The stat block parser converts plain-text monster stat blocks into structured `MonsterData`. Key constants:

```javascript
const SIZES   = ['Gargantuan','Huge','Large','Medium','Small','Tiny'];
const ORIGINS = ['Natural','Fey','Shadow','Elemental','Immortal','Aberrant','Undead','Astral'];
```

**Parser fixes applied (must be preserved in all generators):**

| Fix | Problem Solved | Implementation |
|---|---|---|
| **v3: `parenRe` guard** | `parenRe` was matching ✦-format power keywords as the action type | `if (parenM && !parenM[1].includes('✦'))` |
| **v3: `whenM`** | `(when condition)` and `(while condition)` formats weren't parsed | Regex before diamond path; `while` → `action:'Trait'` |
| **v4a: `parseActionsText` split** | Multi-power chunks (e.g. Hive Soldier) fused into one 60+ char name | Split on `. CapitalWord (minor\|free\|...)` boundary before calling `parsePowerChunk` |
| **v4c: `explicitTriggerRe`** | MM3+ `"Name (kw) Trigger: cond. Effect (action): desc"` format — `parenRe` grabbed `(Immediate Interrupt)` as action | Matched before `parenRe`; **gated with `diamondIdx < 0`** to prevent over-matching ✦-format powers |
| **v4d: Compound origin fix** | "Large magical beast" — "Magical" extracted as origin, not in ORIGINS | `if (!ORIGINS.includes(origin)) { creatureType = origin + ' ' + creatureType; origin = 'Natural'; }` |

**Quality check** — always run after generation; expect "Quality check: ALL CLEAR":
```javascript
// Flags: name contains ✦, name.length > 60, power name.length > 60, description starts with ':'
```

### MonsterData Type (`src/types/monster.ts`)

```typescript
export type MonsterSource = 'mm1' | 'mm2' | 'mm3' | 'dmg' | 'dmg2' | 'mv' | 'mvttnv';

interface MonsterData {
  id: string;            // e.g. 'mv-goblin-warrior'
  name: string;
  source: MonsterSource;
  level: number;
  role: MonsterRole;     // Brute | Soldier | Artillery | Lurker | Controller | Skirmisher | Solo | Minion
  roleModifier?: 'Elite' | 'Solo' | 'Minion';
  xp: number;
  size: MonsterSize;     // Tiny | Small | Medium | Large | Huge | Gargantuan
  origin: MonsterOrigin; // Natural | Fey | Shadow | Elemental | Immortal | Aberrant | Undead | Astral
  type: string;          // e.g. 'Humanoid', 'Beast', 'Magical Beast'
  keywords?: string[];
  hp: number;
  ac: number; fort: number; ref: number; will: number;
  initiative: number;
  perception: number;
  speed: string;
  senses?: string[];
  resist?: string[]; immune?: string[]; vulnerable?: string[];
  powers: MonsterPower[];
  alignment: string;
  languages?: string[];
}

interface MonsterPower {
  name: string;
  action: 'Standard' | 'Move' | 'Minor' | 'Free' | 'Triggered' | 'Trait' | 'Aura';
  keywords?: string[];
  recharge?: string;   // e.g. 'Encounter', 'Daily', 'Recharge 5-6', '2/Encounter'
  description: string;
}
```

### Adding a New Source Book

1. Run `node find_mv_sources.js` (or equivalent) to confirm the exact source code string in `_listing.js`
2. Copy `generate_mm3.js` → `generate_newbook.js`; update: source filter, `source:` string, ID prefix, export name, output path
3. `node generate_newbook.js` — check quality; fix parser issues if any
4. Add `'newbook'` to `MonsterSource` union in `src/types/monster.ts`
5. Import + spread in `src/data/monsters/index.ts`
6. Add to `DEFAULT_FILTERS.sources` and `SOURCES` array in `MonsterCompendiumPage.tsx`
7. `npm run build` to verify clean TypeScript compile

---

## Magic Item Compendium

### Overview

A browsable compendium of 576 magic items extracted from "The Complete Book of Magical Items" (AD&D 2e, Talivar V1.11). Each item has three edition versions: AD&D 2e (original), D&D 4e (converted), and D&D 5e (converted).

**Accessed via:** TopBar tab (✨ Magic Items) or Sidebar → Magic Items (`currentView === 'magicItems'`)

### Data Architecture

```typescript
// src/types/magicItem.ts
type MagicItemCategory = 'Potion' | 'Scroll' | 'Ring' | 'Rod' | 'Staff' | 'Wand' | 'Miscellaneous' | 'Armor' | 'Weapon';
type EditionKey = '2e' | '4e' | '5e';

interface MagicItemEdition {
  description: string;
  rarity?: string;
  xpValue?: number;       // 2e only
  gpValue?: number;        // 2e only
  duration?: string;
  level?: number;          // 4e item level (1-30)
  slot?: string;           // 4e body slot
  powerText?: string;      // 4e item power
  attunement?: string;     // 5e attunement requirement
}

interface MagicItemData {
  id: string;
  name: string;
  category: MagicItemCategory;
  source: string;          // Source book abbreviation (DMG, ToM, etc.)
  editions: Record<EditionKey, MagicItemEdition>;
}
```

### Data Files (`src/data/magicItems/`)

| File | Category | Count |
|---|---|---|
| `potions.ts` | Potions & Oils | 65 |
| `scrolls.ts` | Protection Scrolls | 20 |
| `rings.ts` | Rings | 44 |
| `rods.ts` | Rods | 14 |
| `staves.ts` | Staves | 14 |
| `wands.ts` | Wands | 26 |
| `miscA.ts` | Miscellaneous A–F | 118 |
| `miscG.ts` | Miscellaneous G–N | 99 |
| `miscO.ts` | Miscellaneous O–Z | 102 |
| `armor.ts` | Armor & Shields | 11 |
| `weapons.ts` | Weapons | 63 |
| `index.ts` | Aggregation + helpers | — |

**Total: 576 items** (5 cross-category duplicates removed by `filterMiscategorized()`)

### Components

| File | Purpose |
|---|---|
| `MagicItemCompendiumPage.tsx` | Main page with banner, filter bar, category chips, paginated list, random roller |
| `MagicItemModal.tsx` | Bottom-sheet detail modal with 3-segment edition toggle (AD&D 2e / D&D 4e / D&D 5e) |
| `RandomItemRoller.tsx` | D10 + D% dice input panel; deterministic PRNG (mulberry32) selects item |

### Edition Toggle

The modal shows one edition at a time. The list view is edition-agnostic (name, category, source only).
- `editions['2e']` — original AD&D 2e text from the PDF
- `editions['4e']` — creative conversion to D&D 4e mechanics (item levels, slots, powers)
- `editions['5e']` — creative conversion to D&D 5e mechanics (rarity, attunement)

### Random Item Roller

Uses mulberry32 PRNG seeded with `(d10 * 100 + dPercent) + Date.now() + (++rollCounter * 997)`. The dice values influence the seed but each roll produces a different item thanks to the timestamp and a module-level counter (multiplied by prime 997 to avoid collisions).
**Always calls `playDiceRollSound(2)` when rolling.**

### Category Colors

```
Potion: emerald-700    Ring: amber-700
Scroll: sky-700        Rod: red-700
Staff: purple-700      Wand: indigo-700
Miscellaneous: teal-700  Armor: stone-700
Weapon: rose-700
```

### Creative Liberties Rule — MAGIC ITEMS ONLY

When converting AD&D 2e magic items to D&D 4e and 5e editions, creative adaptation is allowed. The essence and flavor of each item must be preserved, but mechanical details should be adapted to the target edition's conventions. The AD&D 2e version must remain faithful to the original PDF text.

### 2e Description Bulk Update

The original 2e descriptions were truncated (64% under 200 chars). A bulk update from the PDF source text fixed this:

- **Source:** `C:\Claude\magic_items_full.txt` (pdftotext extraction of "Complete Book of Magical Items")
- **Extraction script:** `C:\Claude\parse_pdf_columns.js` — handles 2-column PDF layout, extracts 527 items to `magic_items_extracted.json`
- **Update script:** `C:\Claude\update_magic_items.js` — patches TypeScript data files; only updates when PDF desc is 30%+ longer AND 50+ chars more
- **Remaining items script:** `C:\Claude\update_remaining_items.js` — manually maps 13 items with different name formats (e.g., "Sword +2, Dragon Slayer" in PDF → "Dragon Slayer" in code)
- **Total updated:** 507 items (494 bulk + 13 manual)
- **PWA cache limit:** Increased from 5MB to 8MB in `vite.config.ts` to accommodate larger bundle
- **Known issue:** ~40 items have corrupted or sub-item names in code that couldn't be matched to PDF headings. These retain their original shorter descriptions.
- **4e/5e descriptions:** When 4e/5e descriptions were previously identical to the old truncated 2e text, they were updated to the full 2e text. The edition-specific mechanics remain in `powerText`, `rarity`, `level`, and `attunement` fields. Future enhancement: regenerate 4e/5e flavor descriptions from the now-complete 2e text.

### Generator Script

`C:\Claude\generate_magic_items.mjs` — offline tooling that parses PDF text extracts and generates TypeScript data files. Run with: `node generate_magic_items.mjs`

Key functions in the generator:

| Function | Purpose |
|---|---|
| `parseItemsFromText()` | Extracts items from PDF text using `(Source:...)` pattern, with BLACKLIST for false positives |
| `estimate4eLevel()` | Keyword-based heuristic to assign 4e item levels (1-30) |
| `rarityFrom4eLevel()` | Maps 4e level → 5e rarity (Common/Uncommon/Rare/Very Rare/Legendary) |
| `bonusFromRarity()` | Maps 5e rarity → enhancement bonus (+1/+2/+3) for weapons, armor, implements |
| `categoryNoun()` | Returns correct item-type noun based on category and item name (e.g. Misc → "amulet", "boots", "cloak") |
| `adapt4eStyle()` | Converts first 2 sentences of 2e text to 4e-compatible flavor; strips XP/GP values |
| `gen4eDesc()` | Generates 4e flavor descriptions — category-specific sections with keyword matching (name + description); cursed items detected; falls through to `adapt4eStyle()` |
| `gen4ePower()` | Generates 4e power text — name-based checks first (most reliable), then description keyword fallback; enhancement bonuses scaled by level; category-specific templates (Ring/Rod/Staff/Wand/Weapon/Armor/Misc) |
| `gen5eDesc()` | Generates 5e descriptions — keyword matches (name + description) with specific 5e mechanics (DC values, damage dice, bonus amounts); falls through to `adaptTo5eStyle()` |
| `adaptTo5eStyle()` | Fallback: takes first 2-3 sentences of 2e text and converts terminology (pronouns → neutral, "saving throw vs. X" → "saving throw", "18/00 Strength" → "Strength score of 21", "man-sized" → "Medium or smaller", rounds → seconds, turns → minutes) |
| `filterMiscategorized()` | Cross-category deduplication — removes items whose name belongs to a different category (e.g. "Rod of Absorption" parsed into rings file) |
| `cleanItemName()` | Strips section headers and normalizes parsed names |

### Keyword Matching Strategy — CRITICAL

All three generation functions (`gen4eDesc`, `gen4ePower`, `gen5eDesc`) follow this priority order:

1. **Name-based checks first** (`nameLower`) — most reliable, catches items where the 2e description is truncated or doesn't contain the relevant keyword (e.g. "Boots of Dancing" where the extracted 2e text only describes fitting, not the curse)
2. **Description-based keyword checks** (`lower`) — broader coverage but needs guards against false positives
3. **`adapt4eStyle()` / `adaptTo5eStyle()` fallback** — converts raw 2e prose for items with no keyword match

**Known false-positive guards:**
- `fire` in weapon descriptions: the verb "fire" (= shoot, as in "fire bolts") must be distinguished from the element "fire". Use `flame`/`flaming`/`burning`/`ignite` for description checks; only check name for `fire`
- `light` in weapon descriptions: "light crossbow" (weight) vs "light" (radiance). Guard with `!lower.includes('light crossbow') && !lower.includes('lightweight')`
- `frost` in Giant Slayer: the 2e text lists "frost, fire, cloud, storm" as giant types. Guard with `!lower.includes('frost, fire') && !lower.includes('frost giant')`
- `detect/detected` in misc items: many 2e descriptions say "radiate magic if detected" (passive). Guard with `!lower.includes('detected') && !lower.includes('detection is')`

**5e description generation priority:** keyword-specific 5e description (with numeric bonuses like +1/+2/+3) → adapted 2e text via `adaptTo5eStyle()`. Both the item **name** and **description** are checked for keywords (important for items where the effect is in the name but not the first 2-3 sentences of the 2e text).

---

## Known Limitations / Future Work

- LevelUpModal now shows all powers at or below the gain level for each slot type. "Power swap" mechanic (replacing old encounter/daily at certain levels per 4e rules) not implemented for non-psionic classes. Psionic at-will swap is implemented for all psionic classes (Ardent, Battlemind, Psion).
- No Epic Destiny selection (level 21 milestone message shown but no picker).
- Campaign encounter tracker is basic.
- Paragon/Epic class-specific feats only cover some PHB1 classes (Fighter, Rogue, Warlord, Cleric). Other PHB1 classes and PHB2 classes may have gaps in class-specific paragon/epic feats.
- PHB2 paragon path bonuses may not be fully wired into `useCharacterDerived.ts` for all 44 paths (defense bonuses parsed automatically but edge cases possible).
- PHB3 psionic augmentation system: Fully implemented — see Completed Features.
- PHB3 hybrid classes (24): Major subsystem requiring dual-class selection. Deferred.
- Magic item 4e/5e `description` fields for many items contain raw 2e text rather than edition-adapted flavor. The actual edition-specific mechanics are in `powerText`/`rarity`/`level`/`attunement`. Future enhancement: regenerate 4e/5e descriptions using `gen4eDesc()`/`gen5eDesc()` from the now-complete 2e text.
- ~40 magic items have corrupted or sub-item names that don't match PDF headings, retaining shorter original descriptions.

---

## Code Conventions

- **Functional components** only, no class components
- **Tailwind CSS** for all styling — no CSS modules or inline styles
- **Async DB operations** always followed by Zustand store update
- **`patch()`** for incremental sheet changes, **`update()`** for full character saves
- Power IDs use kebab-case with class prefix: `'fighter-cleave'`, `'cleric-sacred-flame'`
- Each power file exports a `const [className]Powers: PowerData[]` array
- All power files end with `];` — if editing with bash scripts, verify the closing bracket is not truncated
- `index.ts` in each data folder re-exports and provides query functions
- Components receive `character: Character` prop — they do NOT fetch from DB themselves
- **Never** duplicate `FEAT_LEVELS` locally — always import from `src/data/advancement.ts`
