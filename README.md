# D&D 4th Edition Character Creator

A full-featured, offline-capable Progressive Web App (PWA) for creating and managing D&D 4th Edition characters. Optimized for tablets.

## Features

- **9-step Character Creation Wizard**
  - Name & background
  - Race selection (8 PHB1 races)
  - Class selection (8 PHB1 classes)
  - Point-buy ability scores (22-point budget)
  - Trained skills
  - Powers (at-will, encounter, daily)
  - Feats
  - Equipment shop with gold tracking
  - Review & create

- **Full Character Sheet**
  - Live-calculated defenses (AC, Fort, Ref, Will)
  - HP tracking with bloodied indicator
  - Healing surge management
  - Power usage tracking (encounter/daily toggles)
  - Reset Encounter / Extended Rest buttons
  - Skills with computed bonuses
  - Feats, equipment, class features
  - Notes editor

- **PWA — Installable & Offline**
  - Works fully offline after first load
  - Installable on iPad, Android tablets, and desktop
  - All character data stored in IndexedDB (no server needed)

- **Tablet-Friendly**
  - Touch targets ≥ 44px
  - Responsive 2–3 column layouts
  - Slide-out character list sidebar

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

## Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | UI framework + build tool |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Zustand | State management |
| Dexie.js | IndexedDB (character persistence) |
| vite-plugin-pwa | Service worker + Web App Manifest |
| uuid | UUID generation for character IDs |

## D&D 4e Content (PHB1)

**Races:** Dragonborn, Dwarf, Eladrin, Elf, Half-Elf, Halfling, Human, Tiefling

**Classes:** Cleric, Fighter, Paladin, Ranger, Rogue, Warlock, Warlord, Wizard

**Powers:** Level 1 at-will, encounter, and daily powers for all 8 classes (~80 powers total)

**Feats:** ~50 PHB1 Heroic-tier feats with prerequisite checking

**Equipment:** 25+ weapons, 8 armor types, 20 adventuring gear items

## Project Structure

```
src/
├── components/
│   ├── ui/          # Button, Card, Badge, Modal
│   ├── layout/      # TopBar, Sidebar, Toast
│   ├── management/  # CharacterList, CharacterListItem
│   ├── wizard/      # 9-step creation wizard + shared power card
│   └── sheet/       # Character sheet panels
├── data/            # All D&D 4e static game data
├── db/              # Dexie database + character repository
├── hooks/           # useCharacterDerived (memoized stat calculations)
├── pages/           # HomePage, WizardPage, SheetPage
├── store/           # Zustand stores (app, characters, wizard)
├── types/           # TypeScript interfaces
└── utils/           # Ability scores, defenses, HP, skills math
```
