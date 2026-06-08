import { useAppStore } from '../store/useAppStore';

interface Section {
  id: string;
  title: string;
  emoji: string;
  body: React.ReactNode;
}

// Shared styles for in-section sub-headers and definition lists. Kept terse so the
// bulk of the file stays content rather than markup.
const h3 = 'font-bold text-stone-800 text-sm mt-3 mb-1';
const ul = 'list-disc pl-6 space-y-1 mt-1';
const ol = 'list-decimal pl-6 space-y-1 mt-1';
const k = 'font-semibold text-amber-800';

const SECTIONS: Section[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'getting-started',
    title: 'Getting Started',
    emoji: '🚀',
    body: (
      <>
        <p>
          A local-first D&D 4e character creator and campaign manager. Characters, campaigns,
          and homebrew live in your browser (IndexedDB). Sign in to back them up to the cloud and
          to share campaigns with other players.
        </p>

        <h3 className={h3}>First time here?</h3>
        <ol className={ol}>
          <li>Open the sidebar with the ☰ button (top-left) and tap <span className={k}>Sign In</span>.</li>
          <li>Enter your email — a magic link is sent. Click the link to authenticate. No passwords.</li>
          <li>Back on the home screen, tap <span className={k}>+ New Character</span> to launch the 10-step wizard.</li>
          <li>After saving, your character card appears on the home screen. Tap it to open the sheet.</li>
        </ol>

        <h3 className={h3}>Top-level navigation</h3>
        <ul className={ul}>
          <li><span className={k}>TopBar tabs</span> — Characters, Magic Items, Monsters (and Homebrew when signed in).</li>
          <li><span className={k}>Sidebar (☰)</span> — Campaigns, Magic Items, User Instructions, Import/Export, Sign In/Out, and a list of campaigns you've joined.</li>
          <li><span className={k}>Auto-version</span> — the build number at the bottom of the sidebar bumps on every deploy.</li>
        </ul>

        <h3 className={h3}>Offline support</h3>
        <p>
          The app is a Progressive Web App. After your first visit, it works fully offline — even creating
          characters, editing sheets, and managing campaigns. When you come back online, your changes
          auto-sync to the cloud.
        </p>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'wizard',
    title: 'Character Creation Wizard',
    emoji: '🧙',
    body: (
      <>
        <p>
          10 steps. Your draft auto-saves on every change — close the tab or switch screens and you'll see a
          <span className={k}> Resume / Discard</span> banner next time you open the home screen.
        </p>

        <h3 className={h3}>The 10 steps</h3>
        <ul className={ul}>
          <li><span className={k}>1. Basics</span> — Name, player name, gender, age, alignment, deity, and a rich-text background.</li>
          <li><span className={k}>2. Race</span> — Choose from PHB1+2+3 + Heroes of the Feywild. Cards expand on tap to show traits and powers. Some races (Shifter) have sub-races; others (Human, Half-Elf) have language/skill choices.</li>
          <li><span className={k}>3. Class</span> — Choose a class. Classes with a build choice (Warlock pact, Wizard implement, Fighter combat style, all PHB2/PHB3 build choices) show a picker. Some classes (Wizard, Psion, Bard, Druid) also pick starting rituals here.</li>
          <li><span className={k}>4. Ability Scores</span> — Three methods:
            <ul className={ul}>
              <li><em>Point Buy</em> — two-phase: first assign the pool [10,10,10,10,10,8] to your six abilities, then spend 22 points to raise them.</li>
              <li><em>Standard Array</em> — assign [16,14,13,12,11,10] to your six abilities.</li>
              <li><em>Rolling Scores</em> — 4d6 drop lowest, multiple roll groups, pick the one you want.</li>
            </ul>
            Racial bonuses are displayed live on each panel.
          </li>
          <li><span className={k}>5. Skills</span> — Pick your class-trained skills. Mandatory ones (e.g. Rogue's Stealth+Thievery) are pre-checked and locked. The selectable count varies by class.</li>
          <li><span className={k}>6. Powers</span> — Pick your at-will, encounter, daily powers. Half-Elves additionally pick a Dilettante power (an at-will from another class — separate slot). All slots must be filled to advance.</li>
          <li><span className={k}>7. Feats</span> — Pick your starting feats. Most characters get 1; Humans get 2. The <span className={k}>Eligible only</span> toggle filters out feats you don't qualify for. Tap the ℹ icon on a card to see the full benefit text.</li>
          <li><span className={k}>8. Equipment</span> — Spend starting gold on weapons, armor, and gear. Search and category tabs. Bards pick two starting rituals here.</li>
          <li><span className={k}>9. Leveling</span> — Choose <em>Milestone</em> (DM tells you when to level) or <em>XP</em> (track XP totals). Can be changed later from the sheet.</li>
          <li><span className={k}>10. Review</span> — Final summary. Tap race, class, build choice, any power, or any feat to expand details. <span className={k}>Create Character</span> at the bottom saves to IndexedDB and (if signed in) the cloud.</li>
        </ul>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'sheet',
    title: 'The Character Sheet',
    emoji: '📜',
    body: (
      <>
        <h3 className={h3}>Layout</h3>
        <p>
          A sticky header at the top, a three-column body below (collapses to one column on phones), and a
          Quick Access tray at the bottom.
        </p>

        <h3 className={h3}>The header bar</h3>
        <ul className={ul}>
          <li><span className={k}>Portrait</span> — tap to upload or change. Tap your own portrait → opens Portrait page; tapping another player's (in a campaign view) opens a full-size lightbox.</li>
          <li><span className={k}>Name</span> — tap to inline-edit.</li>
          <li><span className={k}>▲ Info / ▼ Info</span> — collapses the race/class/role/alignment info rows to save vertical space.</li>
          <li><span className={k}>▲ Min</span> — collapses the entire header to a thin 32px strip. Useful on phones. Preference is remembered per character.</li>
          <li><span className={k}>Action buttons</span> — Speed, Level, Level Up, Short Rest, Extended Rest, Initiative, Saving Throw. The Initiative and Saving Throw buttons drop a result card with the d20 roll and the math.</li>
        </ul>

        <h3 className={h3}>Six top-level tabs</h3>
        <ul className={ul}>
          <li><span className={k}>Actions</span> — weapon attacks, Second Wind, all your powers grouped by action type, and a PHB reference for combat actions.</li>
          <li><span className={k}>Powers</span> — At-Will / Encounter / Daily / Utility picker. Special sub-tabs appear for Channel Divinity (cleric/paladin/avenger/invoker), Implement Mastery (wizard), Eldritch Pact (warlock), and Discipline Powers (psion/ardent/battlemind).</li>
          <li><span className={k}>Feats</span> — Manage feats with a searchable picker, eligibility filter, and inline detail expand.</li>
          <li><span className={k}>Features</span> — sub-tabs: Class Features, Racial Features, Proficiencies, Profile, Notes.</li>
          <li><span className={k}>Paragon</span> — Locked until level 11. Shows your chosen paragon path, its features, and lets you preview alternates.</li>
          <li><span className={k}>Inventory</span> — sub-tabs: Coin Purse, Equipment, Rituals, Spellbooks (wizard only).</li>
        </ul>

        <h3 className={h3}>Click-to-roll and hover-to-explain</h3>
        <ul className={ul}>
          <li><span className={k}>Ability scores</span> — click the number to roll d20 + ability modifier. Hover (or tap on touch) shows a breakdown of base + racial + subrace + choice bonuses.</li>
          <li><span className={k}>Defenses (AC/Fort/Ref/Will)</span> — hover/tap "details" to see every contributing source.</li>
          <li><span className={k}>Skills</span> — click the row to roll. The result appears inline above the rolled skill and auto-dismisses after 4 seconds.</li>
        </ul>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'actions-and-dice',
    title: 'Actions & Dice Rolling',
    emoji: '🎲',
    body: (
      <>
        <h3 className={h3}>The Actions tab</h3>
        <ul className={ul}>
          <li><span className={k}>Combat Actions</span> — Cards for each equipped weapon showing attack bonus, damage roll, proficiency, and any feat damage bonuses (Dwarven Weapon Training, Eladrin Soldier, Goliath Greatweapon Prowess, etc.). Magic item attack/damage bonuses also appear here.</li>
          <li><span className={k}>Second Wind</span> — Encounter-resource toggle (red header). Shows your healing surge value and the +2 defense bonus. Dwarves automatically see "Minor Action" instead of "Standard Action".</li>
          <li><span className={k}>Power Actions</span> — All your powers grouped by action type (Standard / Move / Minor / Free / Immediate). Encounter/daily powers have a usage toggle circle. Pin powers to Quick Tray with the ⚡ button.</li>
          <li><span className={k}>Actions Descriptions</span> — Reference table of common D&D 4e combat actions across 7 categories.</li>
        </ul>

        <h3 className={h3}>The floating dice roller (🎲)</h3>
        <p>
          A floating button bottom-right of any character sheet. Tap to open the dice modal.
        </p>
        <ul className={ul}>
          <li>Build a roll with d2 / d4 / d6 / d8 / d10 / d% / d12 / d20 — up to 10 of each, counts shown.</li>
          <li>Tap <span className={k}>Roll</span> — dice sound plays (Web Audio synthesized, no audio files), results appear after the ~2-second sound finishes.</li>
          <li>Each result chip is color-coded per die. Total at bottom. Tap <span className={k}>Clear</span> to reset.</li>
        </ul>

        <h3 className={h3}>Implicit rolls</h3>
        <p>
          The dice sound plays for every roll anywhere in the app — skill checks, ability checks, attack rolls,
          saving throws, initiative, and the magic-item random roller.
        </p>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'powers-and-classes',
    title: 'Powers & Class-Specific Systems',
    emoji: '✨',
    body: (
      <>
        <h3 className={h3}>How powers work</h3>
        <ul className={ul}>
          <li><span className={k}>At-Will</span> — unlimited use.</li>
          <li><span className={k}>Encounter</span> — one use per encounter; refreshed by Short Rest.</li>
          <li><span className={k}>Daily</span> — one use per day; refreshed by Extended Rest.</li>
          <li><span className={k}>Utility</span> — non-attack support powers, shown within the encounter/daily tabs depending on their usage. Marked with a blue "Utility" badge.</li>
        </ul>
        <p>
          Slot counts scale by level: 1 encounter at L1 → 7 at L27, 1 daily at L1 → 7 at L29, 0 utility at L1 → 5 at L22.
        </p>

        <h3 className={h3}>The power picker</h3>
        <ul className={ul}>
          <li>Filtered by level — never shows powers above your current level.</li>
          <li>Grouped by "Level X Powers" headers.</li>
          <li>Empty slots show as dashed placeholders telling you which gain level they came from.</li>
          <li>Greedy slot assignment — a level 9 power fills the level 9 slot, not your level 5 slot.</li>
        </ul>

        <h3 className={h3}>Used / available toggles</h3>
        <p>
          Encounter and daily power cards have a circle button on the left. Tap it to mark the power used —
          card dims. Tapping again restores it. State syncs to the database and resets on rest.
        </p>

        <h3 className={h3}>Quick Access Tray</h3>
        <p>
          Pin frequently-used powers to a 3×3 grid at the bottom of the sheet using the ⚡ button on any
          power card. Paginated — pin as many as you want. Works for class powers, magic item powers,
          racial powers, feat-granted powers — anything.
        </p>

        <h3 className={h3}>Wizard</h3>
        <ul className={ul}>
          <li><span className={k}>Arcane Implement Mastery</span> — picked at creation (orb / staff / wand). Grants an at-will cantrip + an encounter mastery power, both auto-granted.</li>
          <li><span className={k}>Cantrips</span> — Ghost Sound, Light, Mage Hand, Prestidigitation are auto-granted. They never count against power slots.</li>
          <li><span className={k}>Spellbooks</span> — Wizards get one free book at creation. Each book holds 128 pages (pages = power level). Daily and utility powers are <em>known</em> (in books) vs <em>prepared</em> (in your selected powers). Open the Spellbooks tab → prepare from your book each day. Buy additional books for 50gp.</li>
        </ul>

        <h3 className={h3}>Warlock</h3>
        <ul className={ul}>
          <li>Pick a pact at creation: Infernal / Fey / Star.</li>
          <li>The pact grants a boon power (auto-granted, doesn't count against slots).</li>
          <li>EldritchPactPanel shows all three pacts; yours is highlighted.</li>
        </ul>

        <h3 className={h3}>Psion / Ardent / Battlemind (psionic classes)</h3>
        <ul className={ul}>
          <li>No encounter slots — instead, augmentable at-wills.</li>
          <li>Power Points row in HitPoints block. Spend PP via "Augment +1 PP" / "Augment +2 PP" buttons on psionic at-will cards to upgrade their effect.</li>
          <li>PP fully restores on rest. Battlemind also gets three Psionic Defense at-will powers shown in the Discipline Powers sub-tab.</li>
        </ul>

        <h3 className={h3}>Other class-specific systems</h3>
        <ul className={ul}>
          <li><span className={k}>Fighter Combat Style</span> — Combat Superiority (PHB) or Combat Agility (Martial Power 2 houserule). Picked at creation.</li>
          <li><span className={k}>Monk Full Discipline</span> — 32 monk powers render as <em>two linked cards</em> (Attack Technique + Movement Technique). Both share the same encounter/daily resource.</li>
          <li><span className={k}>Cleric / Paladin / Avenger / Invoker</span> — Channel Divinity sub-tab. CD powers share a per-encounter resource pool. Feat-granted deity CD powers (Bahamut, Avandra, etc.) join the same pool.</li>
          <li><span className={k}>Half-Elf Dilettante</span> — pick an at-will power from another class at creation. Lives in its own slot (doesn't count against your primary at-will limit).</li>
        </ul>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'feats',
    title: 'Feats',
    emoji: '🎯',
    body: (
      <>
        <h3 className={h3}>Budget</h3>
        <p>
          Feats are gained at specific levels (1, 2, 4, 6, 8, 10, 11, 12, 14, 16, 18, 21, 22, 24, 28, 30) — not
          every level. Humans get a bonus feat. Some classes (Wizard, Cleric, Bard, Druid, Invoker, Psion) get
          Ritual Caster automatically and don't pay a feat slot for it.
        </p>

        <h3 className={h3}>Prerequisites</h3>
        <p>
          Enforced everywhere — wizard, sheet picker, level-up modal. Includes ability score requirements,
          race, class, trained-skill, deity, and "any multiclass feat" prereqs. The level-up picker even tracks
          ability boosts you're choosing in the same flow.
        </p>

        <h3 className={h3}>Granted powers</h3>
        <p>
          Some feats (notably deity Channel Divinity feats — Armor of Bahamut, Avandra's Rescue, etc.) grant
          actual structured powers. These appear in the Encounter tab with a "Feat" badge, share the Channel
          Divinity resource, and can be pinned to Quick Tray.
        </p>

        <h3 className={h3}>Repeatable feats</h3>
        <p>
          Skill Focus, Weapon Focus, Superior Implement Training, and similar can be taken multiple times.
          Each instance is a separate entry.
        </p>

        <h3 className={h3}>Superior Implement Training</h3>
        <p>
          Each SIT instance is associated with a specific superior implement from your inventory via a
          dropdown on the feat card. Constraint: one implement per instance, one instance per implement, no
          two instances of the same base implement type.
        </p>

        <h3 className={h3}>Passive bonuses</h3>
        <p>
          Feats with flat stat bonuses (Great Fortitude, Iron Will, Lightning Reflexes, Improved Initiative,
          Toughness, Durable, Alertness, Unarmored Agility, the four Armor Specializations, etc.) auto-apply
          to your derived stats and appear in the defense breakdown panel.
        </p>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'features-profile',
    title: 'Features, Profile & Notes',
    emoji: '📋',
    body: (
      <>
        <h3 className={h3}>Class Features</h3>
        <p>
          Auto-populated list of your class features by level. Wizard implement mastery, warlock pact, PHB2/3
          build choices, and similar get expanded detail. Level 0 class powers (cantrips, Combat Challenge,
          etc.) shown as read-only info cards.
        </p>

        <h3 className={h3}>Racial Features</h3>
        <p>
          Racial summary (size/speed/vision/languages/bonuses) + every racial trait with source-book badge and
          a "Situational" indicator on conditional traits. Subrace traits (Shifter Longtooth/Razorclaw) shown
          when applicable. Racial powers (Fey Step, Dragon Breath, Second Chance, etc.) render as power cards
          and also appear in the Powers/Actions tabs.
        </p>

        <h3 className={h3}>Proficiencies</h3>
        <p>
          Aggregated from class + feats + multiclass feat choices + paragon path + class build choices
          (e.g. Runepriest Wrathful Hammer adds Military Hammers and Military Maces). The displayed list and
          the attack-bonus check share one source of truth — what you see is what your attack rolls use.
        </p>

        <h3 className={h3}>Profile</h3>
        <p>
          Inline-editable: gender, age, height, weight, build, eye color, hair color. Languages shown as pill
          chips. Background renders any rich text you wrote in the wizard (or in the Notes tab).
        </p>

        <h3 className={h3}>Notes</h3>
        <p>
          Full rich text editor — bold, italic, headings, bulleted/numbered lists, links, tables, images,
          colors, alignment. Edit your character's backstory, session journal, or anything else.
        </p>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'inventory',
    title: 'Inventory & Magic Items',
    emoji: '🎒',
    body: (
      <>
        <h3 className={h3}>Equipment tabs</h3>
        <p>
          Weapons / Implements / Armor / Items / Consumables / Gear. Items in the picker are alphabetical
          within each section after any search filter. Collapsible sub-groups by tier and item slot.
        </p>

        <h3 className={h3}>Masterwork + Magic enchants on armor and weapons</h3>
        <ul className={ul}>
          <li>Click an equipped armor item to expand → pick a masterwork upgrade (Feyweave, Forgemail, Warplate, etc.) which overrides base stats.</li>
          <li>Add a magic armor enchantment with a tier dropdown to set its enhancement level.</li>
          <li>Same pattern for weapons (38 mundane + 248 magic options across PHB/PHB2/PHB3/AV/AV2).</li>
          <li>Same pattern for implements (8 basic, 27 superior, 361 magic across 8 implement types).</li>
        </ul>

        <h3 className={h3}>Magic items (slot-based)</h3>
        <p>
          788 magic items across 9 slot categories (head, neck, arms, hands, ring, waist, feet, companion,
          wondrous). Each item has tiered levels; pick the tier when adding. Neck items auto-apply enhancement
          to Fort/Ref/Will. Item powers (At-Will / Encounter / Daily) appear in Powers and Actions tabs.
        </p>

        <h3 className={h3}>Powers from equipped items</h3>
        <p>
          Magic armor / weapon / implement / item powers all auto-appear as power cards when the item is
          equipped, and disappear when unequipped. Pin them to Quick Tray like any other power.
        </p>

        <h3 className={h3}>Rituals</h3>
        <p>
          72 rituals (49 PHB1 + 23 PHB2). Ritual Caster classes get a ritual book. Wizards bind rituals to a
          spellbook. Buy ritual scrolls from the shop. Skill check tables shown inline. Bard-only rituals
          (Glib Limerick, Traveler's Chant) are tagged.
        </p>

        <h3 className={h3}>Currency</h3>
        <p>
          Gold / silver / copper, each with +/- buttons and direct input.
        </p>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'rests-leveling',
    title: 'Rests & Leveling Up',
    emoji: '💤',
    body: (
      <>
        <h3 className={h3}>Rests</h3>
        <ul className={ul}>
          <li><span className={k}>Short Rest</span> (5 minutes in-game) — refreshes encounter powers and Second Wind. Does <em>not</em> restore HP, surges, action points, or daily powers.</li>
          <li><span className={k}>Extended Rest</span> (6 hours in-game) — fully restores HP, healing surges, encounter and daily powers, Second Wind, action points, and (for psionics) power points.</li>
        </ul>

        <h3 className={h3}>Leveling up</h3>
        <p>
          Tap <span className={k}>Level Up ↑</span> in the header. The modal walks you through everything you
          gain at the new level:
        </p>
        <ul className={ul}>
          <li><span className={k}>Power gains</span> — encounter (1, 3, 7, 13, 17, 23, 27), daily (1, 5, 9, 15, 19, 25, 29), utility (2, 6, 10, 16, 22). Picker shows powers up to your new level.</li>
          <li><span className={k}>Feat</span> — only shown on feat levels (1, 2, 4, 6, 8, 10, 11, 12, 14, 16, 18, 21, 22, 24, 28, 30). Searchable card list with prerequisite enforcement and ℹ detail expand.</li>
          <li><span className={k}>Paragon path</span> — picker at level 11. Filtered by your class and race.</li>
          <li><span className={k}>Ability score increase</span> — at levels 4, 8, 14, 18, 24, 28 (boost 2 abilities by 1) and 11, 21 (boost all by 1).</li>
          <li><span className={k}>Psionic at-will swap</span> — psionic classes can replace an at-will at levels 7/13/17/23/27.</li>
        </ul>

        <h3 className={h3}>Milestone vs XP leveling</h3>
        <p>
          Set during creation, can be changed later. In XP mode the header shows your XP and a progress bar to
          the next level; tap + to award XP. In Milestone mode the DM tells the table when to level up.
        </p>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'campaigns',
    title: 'Campaigns & Party Sharing',
    emoji: '🏰',
    body: (
      <>
        <h3 className={h3}>Creating a campaign (DM)</h3>
        <ol className={ol}>
          <li>Open the sidebar → <span className={k}>Campaigns</span> → <span className={k}>+ New Campaign</span>.</li>
          <li>Name, description, public notes (visible to players), private notes (DM only). All rich text.</li>
          <li>Tap <span className={k}>🌐 Share Campaign</span> to generate a 6-character invite code + a copyable share link.</li>
        </ol>

        <h3 className={h3}>Joining a campaign (player)</h3>
        <ol className={ol}>
          <li>Open the sidebar → tap <span className={k}>+ Join</span> next to "Joined Campaigns".</li>
          <li>Enter the 6-character code your DM gave you.</li>
          <li>Preview the campaign → tap <span className={k}>Join</span>. The campaign now shows in your Joined Campaigns list.</li>
          <li>Tap it to open the player view. Click <span className={k}>Link Character</span> to attach one of your local characters to the party.</li>
        </ol>

        <h3 className={h3}>The party roster</h3>
        <p>
          Both DM and players see a roster of party member cards: portrait, name, race/class, level, HP bar,
          paragon path. Tap any card to open a read-only view of that character's full sheet (in a modal).
          Tap the portrait specifically to open a full-screen lightbox of the image.
        </p>

        <h3 className={h3}>Automatic sync</h3>
        <ul className={ul}>
          <li>Character changes auto-sync within ~2 seconds via Supabase Realtime.</li>
          <li>Campaign description, public notes, and session list sync within ~3 seconds.</li>
          <li>Homebrew content the DM tags to a campaign also auto-syncs — players see it in pickers app-wide.</li>
          <li>NPC visibility toggles sync within ~3 seconds (see <em>For DMs</em> below).</li>
        </ul>

        <h3 className={h3}>Cross-device cloud backup</h3>
        <p>
          When signed in, characters, campaigns, sessions, encounters, and homebrew automatically back up to
          your account. Log in on any device to see everything. Local changes still take priority on conflict
          (newer-wins by timestamp).
        </p>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'dm-tools',
    title: 'For DMs: Sessions, Encounters & NPCs',
    emoji: '🛠️',
    body: (
      <>
        <h3 className={h3}>Sessions</h3>
        <p>
          A campaign holds a list of numbered sessions. Each session has:
        </p>
        <ul className={ul}>
          <li><span className={k}>Important Events from Previous Sessions</span> — recap for the players (rich text, syncs to players).</li>
          <li><span className={k}>Planned Summary</span> — your private notes for what you intend to run (rich text, DM-only).</li>
          <li><span className={k}>Additional Notes</span> — overflow notes (syncs to players).</li>
          <li><span className={k}>Encounters</span> — combat or skill challenges.</li>
        </ul>

        <h3 className={h3}>Encounters & Initiative Tracker</h3>
        <ul className={ul}>
          <li>Add encounters to a session with title + rich-text description.</li>
          <li>Add monsters from any source book (filter by source: MM1, MM2, MM3, DMG, DMG2, MV, MV:TttNV, Draco: Chromatic, Draco: Metallic, Homebrew).</li>
          <li>Add player characters to the encounter — both DM-added locals and player-roster-linked summaries appear in the picker.</li>
          <li>Tap an encounter to open the <span className={k}>Initiative Tracker</span> — roll initiative, sort combatants, track HP, advance turns.</li>
        </ul>

        <h3 className={h3}>NPC Glossary</h3>
        <p>
          A new section in the campaign view, below the party roster. Build a glossary of named NPCs across
          your campaign so long campaigns stay manageable.
        </p>
        <ul className={ul}>
          <li><span className={k}>+ New NPC</span> — opens an editor with name, sex, alignment, race (free-text), class/role (free-text), level, current/max HP, location, portrait, and two rich text editors: <em>Public</em> (what players see when visible) and <em>Private</em> (DM-only, never synced).</li>
          <li><span className={k}>Visibility toggle</span> (👁 / 🔒) — controls whether players see the NPC. Default hidden.</li>
          <li><span className={k}>Filter pills</span> — All / Visible / Hidden, plus name/location/race/class search.</li>
          <li><span className={k}>Player-side</span> — visible NPCs show in <em>NPC Glossary</em> on the player's Shared Campaign view with portrait, name, race/class, location, and the public description. Private description is never synced.</li>
        </ul>

        <h3 className={h3}>Linking the DM's own character</h3>
        <p>
          DMs can also have a character in the party. From the party roster, click <span className={k}>+ Link a character</span> on your own card to attach a PC.
        </p>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'compendiums',
    title: 'Magic Item & Monster Compendiums',
    emoji: '📚',
    body: (
      <>
        <h3 className={h3}>Magic Item Compendium</h3>
        <p>
          576 magic items from "The Complete Book of Magical Items" (Talivar V1.11). Open via TopBar or
          Sidebar → Magic Items.
        </p>
        <ul className={ul}>
          <li>Filter chips: Potions, Scrolls, Rings, Rods, Staves, Wands, Miscellaneous, Armor, Weapons.</li>
          <li>Search by name. Pagination (30 per page).</li>
          <li><span className={k}>3-edition toggle</span> on the detail modal — switch between AD&D 2e (original), D&D 4e (converted), and D&D 5e (converted).</li>
          <li><span className={k}>Random Item Roller</span> — set d10 + d% values, tap Roll, get a random item (and dice sound plays).</li>
        </ul>

        <h3 className={h3}>Monster Compendium</h3>
        <p>
          1,700+ monsters from MM1, MM2, MM3, DMG, DMG2, MV, MV:TttNV, Draconomicon: Chromatic, and
          Draconomicon: Metallic. Plus any homebrew monsters you've created.
        </p>
        <ul className={ul}>
          <li>Filter by source book, role, role modifier (Elite/Solo/Minion), creature type, and tier (Heroic/Paragon/Epic).</li>
          <li>Search by name, type, or keywords.</li>
          <li>Tap a monster to open its full stat block in a modal. Homebrew monsters show their portrait + description at the top.</li>
        </ul>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'homebrew',
    title: 'Homebrew Workshop',
    emoji: '🔧',
    body: (
      <>
        <p>
          Open via Sidebar → <span className={k}>Homebrew</span>. Author 13 kinds of custom content. Each shows
          up in the relevant picker alongside official content, with a violet "Homebrew" badge.
        </p>

        <h3 className={h3}>Content types</h3>
        <p>
          🧝 Races · ⚔️ Classes · ✨ Powers · 🎯 Feats · 🗡️ Weapons · 🛡️ Armor · 🎒 Gear · 💎 Magic Items ·
          🧿 Magic Armor · ⚡ Magic Weapons · 🔮 Magic Implements · 🧪 Consumables · 🐉 Monsters.
        </p>

        <h3 className={h3}>Notable editor features</h3>
        <ul className={ul}>
          <li><span className={k}>Races + Classes</span> — full editors with ability bonuses, skills, languages, defense bonuses, traits, racial powers (mix-and-match official + your homebrew via filter pills + search), feats, build choices.</li>
          <li><span className={k}>Powers</span> — structured form: action type, range, keywords, target, attack, hit/miss/effect, secondary/tertiary attack stages (Druid Ferocious Maul, Thunder Ram Assault style), flavor.</li>
          <li><span className={k}>Magic Items + Implements</span> — multi-select enhancement targets (AC / Fortitude / Reflex / Will / Attack rolls / Damage rolls). Pick any combination — e.g. +1 Will and +1 attack rolls on the same item.</li>
          <li><span className={k}>Monsters</span> — full stat block editor with structured powers (range, target, attack, hit/miss/effect, plus traits and auras). Portrait upload.</li>
        </ul>

        <h3 className={h3}>Sharing homebrew</h3>
        <p>Three ways to share, plus an automatic campaign-attached route:</p>
        <ul className={ul}>
          <li><span className={k}>Per-item file export</span> — tap <em>Export</em> on a row. Downloads a JSON file. Other players use <em>Import</em> to add it.</li>
          <li><span className={k}>Bulk export</span> — <em>Export All</em> at the top of the workshop downloads everything.</li>
          <li><span className={k}>Share code / share URL</span> — tap <em>Share</em> on a row to get a URL-safe code and a deep link (<code className="text-xs">?import=...</code>). Recipients paste either form into the import modal, or just click the link — the app auto-opens the import preview.</li>
          <li><span className={k}>Campaign-attached</span> — in any homebrew editor, check a campaign in the "Share with campaign" picker. Save → the item auto-pushes to the campaign's homebrew list. Every joined player sees it in their pickers app-wide (no extra step).</li>
        </ul>

        <h3 className={h3}>Conflict resolution on import</h3>
        <p>
          When an imported item's ID matches one you already have, choose: <em>Skip</em> (keep yours),
          <em>Replace</em> (overwrite), or <em>Import as a copy</em> (regenerate ID, both versions exist).
        </p>
      </>
    ),
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'backup-tips',
    title: 'Backup, Mobile Tips & Tricks',
    emoji: '💡',
    body: (
      <>
        <h3 className={h3}>Cloud backup</h3>
        <p>
          When signed in, your characters, campaigns, sessions, encounters, and homebrew all auto-back up to
          your account. Open the app on any device + sign in → everything appears. On conflict, the newer
          version (by <code>updatedAt</code>) wins.
        </p>

        <h3 className={h3}>Manual export / import</h3>
        <p>
          Sidebar → <span className={k}>Import / Export</span>:
        </p>
        <ul className={ul}>
          <li><span className={k}>Export</span> — downloads a single JSON containing everything.</li>
          <li><span className={k}>Import</span> — choose <em>Merge</em> (adds and updates) or <em>Replace</em> (deletes everything first). Be careful with Replace.</li>
        </ul>

        <h3 className={h3}>Mobile / small-screen tips</h3>
        <ul className={ul}>
          <li><span className={k}>▲ Min</span> on the sheet header — collapses the entire banner to a 32px strip. Tap the chevron when you need to roll initiative or take an action.</li>
          <li><span className={k}>▼ Info</span> — middle-ground: hides the info rows but keeps action buttons.</li>
          <li>Sub-tabs and main tabs scroll horizontally on narrow screens instead of crushing text.</li>
          <li>Three-column layout collapses to one column under 1024px.</li>
        </ul>

        <h3 className={h3}>Quick tricks</h3>
        <ul className={ul}>
          <li>Tap any <span className={k}>ability score</span> or <span className={k}>skill</span> to roll a d20 check. Result appears inline.</li>
          <li>Hover (or tap) the <span className={k}>details</span> link under any defense (AC/Fort/Ref/Will) to see every contributing source.</li>
          <li>Pin frequently-used powers to <span className={k}>Quick Access Tray</span> with the ⚡ button on any power card.</li>
          <li><span className={k}>Notes tab</span> + character background + campaign notes all support full rich text: bold, italic, headings, lists, links, tables, images, colors.</li>
          <li>On the Review step (wizard), tap any race/class/build-choice/power/feat to expand full details.</li>
          <li><span className={k}>Eligible only</span> toggle on feat pickers hides feats you don't qualify for.</li>
          <li>Click another player's <span className={k}>portrait</span> in the party roster to see it full-size in a lightbox; click the rest of the card to open their full read-only sheet.</li>
        </ul>
      </>
    ),
  },
];

export function InstructionsPage() {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <div className="min-h-screen bg-parchment-100 pb-12">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mb-4">
          <div className="bg-amber-800 px-4 py-3">
            <h1 className="text-white font-bold text-lg uppercase tracking-wide">📖 User Instructions</h1>
            <p className="text-amber-300 text-xs mt-0.5">How to use the D&D 4e Character Creator</p>
          </div>
          <div className="p-4">
            <button
              onClick={() => navigate('home')}
              className="text-sm text-amber-700 hover:text-amber-900 font-semibold"
            >
              ← Back to Characters
            </button>
          </div>
        </div>

        {/* Table of contents */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mb-4">
          <div className="bg-amber-800 px-4 py-2">
            <h2 className="text-white font-bold text-sm uppercase tracking-wide">Contents</h2>
          </div>
          <nav className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SECTIONS.map(({ id, title, emoji }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50 text-sm text-stone-700 hover:text-amber-800 transition-colors"
              >
                <span className="text-base">{emoji}</span>
                <span className="font-medium">{title}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map(({ id, title, emoji, body }) => (
            <section
              key={id}
              id={id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden scroll-mt-20"
            >
              <div className="bg-amber-800 px-4 py-2">
                <h2 className="text-white font-bold text-sm uppercase tracking-wide">
                  {emoji} {title}
                </h2>
              </div>
              <div className="p-4 text-sm text-stone-700 leading-relaxed">
                {body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
