# Changelog

All notable changes to the D&D 4e Character Creator are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
uses [semantic versioning](https://semver.org/spec/v2.0.0.html).

> **Note on versioning:** the patch number is auto-bumped on every push to `main` by a GitHub
> Actions workflow (`npm version patch`). The headings below mark *notable* releases — minor
> patch numbers between them are version-bump commits with no user-visible changes. For a
> commit-level history see `git log`.

---

## [Unreleased]

### Changed
- **Version bump on push is now configurable.** The GitHub Actions workflow used to always run
  `npm version patch`. It now chooses major/minor/patch/none based on (priority order):
  1. The manual workflow_dispatch input — trigger the workflow from the Actions tab and pick a
     bump type from a dropdown.
  2. A `[major]` / `[minor]` / `[patch]` / `[none]` tag in the commit message subject or body.
  3. Default — `patch` (existing behavior, unchanged when no signal is present).
- Added `npm run version:patch` / `version:minor` / `version:major` helpers in `package.json` for
  local version bumps that don't touch git. If you bump locally, include `[none]` in the commit
  message to prevent the workflow from bumping again on top.

---

## [1.1.51] — 2026-05-29

A large feature pass focused on campaign tooling, mobile UX, and homebrew sharing.

### Added

- **NPC Glossary for DMs** — new "Non-Player Characters (NPCs)" section under each campaign. Build
  a glossary of named NPCs with portrait, name, sex, alignment, race + class (both free-text),
  level, current/max HP, location, and dual rich-text descriptions (Public + Private). Visibility
  toggle (👁/🔒) controls whether each NPC is revealed to players; default hidden. Visible NPCs
  sync to every player in the campaign within ~3 seconds; private descriptions and DM combat
  stats are stripped before sync.
- **Click-to-enlarge avatars** in any campaign party roster. Hovering shows a zoom-in cue with a
  scale animation; clicking opens a full-screen lightbox (close via X, click outside, or Escape).
  Clicking the rest of the row still opens the player's full read-only sheet — `stopPropagation`
  keeps the two interactions distinct.
- **Collapsible character-sheet banner for mobile** — second header toggle ▲ Min collapses the
  entire banner to a 32 px sticky strip (portrait thumb + name + level + expand chevron).
  Independent of the existing ▼ Info toggle. Choice persists per-character via `localStorage`.
- **Homebrew share via URL-safe code and one-click link** — every Workshop row gets a Share
  button that copies a URL-safe base64 share code OR a deep-link URL
  (`https://dnd4ebuilder.com/?import=eyJ0eXBl...`). Recipients paste either form into the import
  modal OR just click the link — App.tsx auto-captures the `?import=` parameter and the import
  preview opens after login.
- **Draconomicon: Chromatic Dragons** — 115 new monsters in the Monster Compendium (117 primary;
  2 deduped against MM/MV). New "Draco: Chromatic" filter chip.
- **Draconomicon: Metallic Dragons** — 108 new monsters (109 primary; 1 deduped). New
  "Draco: Metallic" filter chip. Combined with Chromatic: **223 new dragons** with zero name
  overlap between the two books.
- **Multi-stage attack chains in PowerData** — new `secondaryTarget` / `secondaryAttack` /
  `secondaryHit` / `secondaryMiss` / `secondaryEffect` and tertiary fields, rendered by
  PowerCard as left-border-accented sub-blocks. Ferocious Maul is the canonical 3-stage example.
- **Multi-select enhancement targets on Magic Items + Magic Implements** — old single-dropdown
  enhancement type replaced with a chip multi-select over AC / Fortitude / Reflex / Will /
  Attack rolls / Damage rolls. Homebrew can grant any combination (e.g. an amulet with +1 Will
  only, or +1 Will and +1 attack rolls).
- **Racial Powers picker in homebrew RaceEditor** — attach official racial powers AND/OR your
  own homebrew powers to a race. Filter pills (All / Official / Homebrew) + search, with source
  badges.
- **Class Powers picker in homebrew ClassEditor** — same UX as racial powers; browse all 1,800+
  official class powers + your homebrew with source-class+level badges. Caps display at 200
  matches with a "narrow your search" footer.
- **Homebrew Monster editor — structured powers** — Range / Target / Attack / Trigger / Hit /
  Miss / Effect fields per power instead of one big Description box. Action dropdown now
  includes Immediate Interrupt, Immediate Reaction, Opportunity Action, and "No Action (Trait)"
  for passive features like Aquatic. MonsterModal renders structured fields as colored labeled
  rows above any free-form description.
- **HotF class powers (Bard + Druid)** — 51 bard + 43 druid powers from Heroes of the Feywild
  appended to the respective class data files. Including the level-less Sentinel utilities and
  Druid Meld into Stone.
- **Racial powers shown in Step 10 (Review)** — the wizard's final-review POWERS list now
  includes powers from `race.racialPowerIds` + subrace, badged green "Race".
- **Auto-merge orchestrator for homebrew sources** (`src/lib/homebrewRegistry.ts`) — holds
  local items + per-campaign campaign items as separate sets and dispatches one merged register
  call per data type, so the two sources no longer wipe each other.
- **App-wide campaign-homebrew sync** (`useCampaignHomebrewSync` hook) — players now receive
  DM-shared homebrew everywhere in the app (wizard, sheet, pickers), not just inside the
  campaign view. Survives navigation and reload.
- **`CHANGELOG.md`** — this file.
- **Greatly expanded User Instructions** — 14 detailed sections covering every feature, with
  anchored table of contents. Open from the sidebar → User Instructions.

### Changed

- **Node 22 LTS** — GitHub Actions workflow + `package.json engines` + `.nvmrc` pinned. Bumped
  from Node 20 (EOL April 2026). The Azure App Service runtime-stack setting also needs to be
  bumped manually in the portal.
- **Equipment pickers sort alphabetically** — every equipment selection list in the wizard and
  on the character sheet now sorts by name (case-insensitive) after the search filter.
- **Weapon proficiency lookup unified** — a new `src/utils/proficiencies.ts` aggregates
  proficiencies from class + feats + multiclass choices + paragon path + class build choices,
  with three matching forms (exact name, category, property-class predicate). The
  Proficiencies panel and CombatActionsPanel attack-bonus check now share one source of truth.
- **Character-sheet portrait button is read-only inside the campaign viewer** — clicking another
  player's portrait no longer navigates you off-screen.

### Fixed

- **Unarmored Agility** — feat now actually applies its +2 AC. The feat data entry had no
  `bonuses` block, so taking it had no mechanical effect until this fix.
- **Runepriest Wrathful Hammer / Weapon Proficiency / Dwarven Weapon Training / Eladrin Soldier
  / multiclass weapon-proficiency choices / paragon-path weapon extras** — all of these
  proficiency sources were displayed on the Proficiencies panel but silently ignored by the
  attack-roll math. Now they all flow into the attack bonus correctly.
- **33 powers across 8 class files** — secondary-attack text was truncated by the original
  iws.mx scraper, ending with the orphan word "Secondary". All re-imported from iws.mx via the
  Chrome MCP live compendium: ardent (Prescient Strike, Intellect Bomb), barbarian (Terror's
  Cry, Shoulder Slam, Rampaging Dragon Strike), druid (Predator's Flurry, Feast of Fury,
  Lightning Cascade, Ferocious Maul), monk (Strike the Avalanche, Relentless Hound Technique,
  Whirlwind Kick, Duel in the Heavens, Fist of Golden Light, Tap the Life Well, Stunning Fist),
  psion (Ravening Thought, Mind Cannon, Shred Reality), seeker (Corralling Shot, Tremor Shot,
  Quill Storm, Lightning Burst, Thundering Shot), warden (Thunder Ram Assault, Thorn Burst,
  Icy Shards, Call Forth the Harvest, Nature's Ally, Weight of the Mountain), sorcerer (Chaos
  Bolt, Acidic Implantation, Thunder Leap, Wildfire Curse).
- **Read-only sheet crash** — clicking another player's portrait in a campaign roster
  previously crashed the app at `useCharacterDerived.character.raceId` and left the user stuck
  on a broken screen. The hook now accepts `Character | undefined` and returns a zero-filled
  sentinel; the SheetPage redirect can then run.
- **Local + campaign homebrew were wiping each other** — each data type's `registerHomebrew*()`
  REPLACES the homebrew section, so opening a campaign erased the user's local homebrew from
  the registry (and vice versa). Now both sources merge via a new registry orchestrator.

### Required migration (one-time, in Supabase SQL editor)

```sql
ALTER TABLE shared_campaigns
ADD COLUMN IF NOT EXISTS npc_content JSONB;
```

Without this column, the NPC glossary works locally for the DM but visible NPCs won't sync to
players (silent fail with a console warning). No RLS changes needed — existing
`shared_campaigns` policies cover the new column.

---

## Earlier history

Versions prior to 1.1.51 are not itemized in this file. See `git log` and `CLAUDE.md`'s
"Completed Features" section for the full history of what's been built. Highlights:

- **1.1.46 (~Apr 2026)** — Wrathful Hammer / weapon proficiency fix; homebrew monsters; Unarmored
  Agility AC fix.
- **1.1.45 (~Apr 2026)** — Homebrew Workshop expanded power authoring; class-powers picker.
- **1.1.40 (~Apr 2026)** — Read-only character sheet in campaign view; rich text editors for
  notes and background; encounter character assignment; per-campaign cloud sync diff.
- **1.1.x** — full PHB1 + PHB2 + PHB3 + HotF content; Heroes of the Feywild races, bard/druid
  powers, feats, magic totems and consumables; Magic Item Compendium (576 items, 3-edition
  toggle); Monster Compendium (MM1, MM2, MM3, DMG, DMG2, MV, MV:TttNV); psionic augmentation;
  monk Full Discipline; Channel Divinity; Half-Elf Dilettante; multi-spellbook system; Quick
  Access tray; campaign sharing via invite codes; cloud backup; magic-armor/weapon/implement/
  item systems; ritual + spellbook systems; mobile-responsive sheet layout.

---

[Unreleased]: https://github.com/Dilbert85jluka/D-D4eCharacterCreator/compare/v1.1.51...HEAD
[1.1.51]: https://github.com/Dilbert85jluka/D-D4eCharacterCreator/releases/tag/v1.1.51
