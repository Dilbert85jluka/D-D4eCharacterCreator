# D&D 4th Edition Character Creator

A full-featured, offline-capable Progressive Web App (PWA) for creating and managing D&D 4th Edition characters. Optimized for tablets.


## Setup

### Prerequisites

Install [Node.js](https://nodejs.org/) (v18 or later recommended).

### Install & Run

```bash
cd dnd4e-character-creator
npm install
npm run dev
```

Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

### PWA Icons

Place `icon-192.png` and `icon-512.png` (PNG format) into `public/icons/`.
Open `public/icons/generate-icons.html` in a browser for a quick generator.

## Project Overview

A Progressive Web App (PWA) for D&D 4th Edition character creation and management.
Fully offline — no server, no backend. All data stored in IndexedDB via Dexie.js.
Designed for tablet use (touch targets ≥44px, responsive layouts).

**Location:** `C:\Claude\dnd4e-character-creator\`
**Dev server:** `npm run dev` → http://localhost:5173 (hot-reload)
**Build:** `npm run build` → outputs to `dist/`
**Preview build:** `npm run preview` → serves `dist/` on http://localhost:4173

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
│   ├── settings/              # ImportExportModal
│   ├── dice/                  # DiceRollerModal.tsx — floating dice roller (d2–d20 + d%)
│   ├── sheet/                 # Character sheet panels (20 files — see below)
│   ├── ui/                    # Button, Card, Badge, Modal (primitive components)
│   └── wizard/                # CreationWizard, WizardNav, 10 step components, PowerCard
├── data/
│   ├── advancement.ts         # FEAT_LEVELS array + featsEarnedByLevel() — shared source of truth
│   ├── classes/               # 22 class definitions (8 PHB1 + 8 PHB2 + 6 PHB3) + index.ts (getClassById)
│   ├── races/                 # 17 race definitions (8 PHB1 + 5 PHB2 + 4 PHB3) + index.ts (getRaceById)
│   ├── powers/                # 22 class power files (8 PHB1 + 8 PHB2 + 6 PHB3) + index.ts (query functions)
│   ├── feats/                 # index.ts — 465 feats (161 PHB1 + 132 PHB2 + 172 PHB3)
│   ├── equipment/             # weapons, armor, magicItems, consumables, gear + index.ts
│   ├── magicItems/            # potions, scrolls, rings, rods, staves, wands, miscA/G/O, armor, weapons + index.ts
│   ├── monsters/              # mm1.ts, mm2.ts, mm3.ts, dmg.ts, dmg2.ts, mv.ts, mvttnv.ts + index.ts
│   ├── skills.ts
│   ├── deities.ts
│   └── languages.ts
├── db/
│   ├── database.ts            # Dexie schema (4 versions)
│   ├── characterRepository.ts # Character CRUD: getAll, getById, create, update, patch, delete
│   ├── campaignRepository.ts
│   ├── sessionRepository.ts
│   └── encounterRepository.ts
├── hooks/
│   └── useCharacterDerived.ts # Memoized derived stats (modifiers, defenses, HP, skills, feat bonuses)
├── pages/
│   ├── HomePage.tsx
│   ├── WizardPage.tsx
│   ├── SheetPage.tsx
│   ├── PortraitPage.tsx
│   ├── MonsterCompendiumPage.tsx
│   ├── MagicItemCompendiumPage.tsx
│   └── CampaignManagementPage.tsx
├── store/
│   ├── useAppStore.ts         # Navigation, sidebar, toasts, active character
│   ├── useCharactersStore.ts  # Character list CRUD + DB loading
│   ├── useWizardStore.ts      # Multi-step wizard state
│   ├── useCampaignsStore.ts
│   ├── useSessionsStore.ts
│   └── useEncountersStore.ts
├── types/
│   ├── character.ts           # Character, DerivedStats, SelectedPower, EquipmentItem
│   ├── gameData.ts            # RaceData, ClassData, PowerData, FeatData, WeaponData, etc.
│   ├── campaign.ts
│   ├── encounter.ts
│   ├── session.ts
│   ├── magicItem.ts
│   ├── monster.ts
│   └── wizard.ts
└── utils/
    ├── abilityScores.ts       # Point-buy, modifier calculations
    ├── defenses.ts            # AC, Fort, Ref, Will
    ├── diceSound.ts           # Web Audio API dice-roll sound synthesis (no audio files)
    ├── hitPoints.ts           # HP, bloodied, healing surges
    ├── skillUtils.ts          # Skill bonus calculations
    ├── psionics.ts            # Psionic augmentation: isPsionicClass, getMaxPowerPoints, parseAugments
    └── spellbook.ts           # Wizard spellbook helpers: page counts, ID aggregation, best-book finder
```

