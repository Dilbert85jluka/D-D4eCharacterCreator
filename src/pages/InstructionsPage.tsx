import { useAppStore } from '../store/useAppStore';

interface Section {
  id: string;
  title: string;
  emoji: string;
  body: React.ReactNode;
}

const SECTIONS: Section[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    emoji: '🚀',
    body: (
      <>
        <p>
          Welcome! This is a local-first D&D 4e character creator and manager. Your characters, campaigns,
          and homebrew content are stored in your browser (IndexedDB). Sign in to back up to the cloud and
          share with other players.
        </p>
        <ol className="list-decimal pl-6 space-y-1 mt-2">
          <li>Open the sidebar (☰ in the top-left) and sign in.</li>
          <li>From the Character Creator screen, tap <strong>New Character</strong> to launch the 10-step wizard.</li>
          <li>After creation, your character card appears on the home screen. Tap it to open the sheet.</li>
        </ol>
      </>
    ),
  },
  {
    id: 'wizard',
    title: 'Character Creation Wizard',
    emoji: '🧙',
    body: (
      <>
        <p>The wizard walks you through 10 steps. Your progress is auto-saved to a draft — you can close and resume later.</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><strong>Step 1 — Basics:</strong> Name, player name, gender, alignment, deity. Background uses a rich text editor.</li>
          <li><strong>Step 2 — Race:</strong> Choose a race (tap the card to expand details). Some races have sub-races or language choices.</li>
          <li><strong>Step 3 — Class:</strong> Choose a class. Classes with a "build choice" (e.g. Warlock pact, Fighter combat style) show a picker.</li>
          <li><strong>Step 4 — Ability Scores:</strong> Point Buy, Standard Array, or Rolling Scores.</li>
          <li><strong>Step 5 — Skills:</strong> Pick your class-trained skills.</li>
          <li><strong>Step 6 — Powers:</strong> Pick your at-will, encounter, and daily powers.</li>
          <li><strong>Step 7 — Feats:</strong> Pick feats (humans get a bonus feat). "Eligible only" toggle filters the list.</li>
          <li><strong>Step 8 — Equipment:</strong> Spend your starting gold on weapons, armor, and gear.</li>
          <li><strong>Step 9 — Leveling:</strong> Choose Milestone or XP leveling.</li>
          <li><strong>Step 10 — Review:</strong> Tap Race, Class, Build Choice, powers, or feats to expand details. Confirm with Create Character.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'sheet',
    title: 'The Character Sheet',
    emoji: '📜',
    body: (
      <>
        <p>The sheet has six top-level tabs:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><strong>Actions:</strong> Combat Actions (weapon attacks), Second Wind, Power Actions (by action type), and Actions Descriptions (PHB reference).</li>
          <li><strong>Powers:</strong> At-Will / Encounter / Daily / Utility picker. Class-specific sub-tabs (Channel Divinity, Implement Mastery, Pact, Discipline Powers) appear when relevant.</li>
          <li><strong>Feats:</strong> Manage your feats with a searchable picker.</li>
          <li><strong>Features:</strong> Class Features, Racial Features, Proficiencies, Profile (appearance + languages + background), and Notes (rich text editor).</li>
          <li><strong>Paragon:</strong> Paragon path tracker, unlocks at level 11.</li>
          <li><strong>Inventory:</strong> Coin Purse, Equipment, Rituals, Spellbooks.</li>
        </ul>
        <p className="mt-2">
          The header shows portrait, name, and a collapsible info section (▼/▲ Info). Below that, an action bar
          with Speed, Level, Level Up, Short Rest, Extended Rest, Initiative, and Saving Throw buttons.
        </p>
      </>
    ),
  },
  {
    id: 'rests',
    title: 'Short & Extended Rests',
    emoji: '💤',
    body: (
      <>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Short Rest</strong> (5 minutes in-game): Refreshes encounter powers, refreshes Second Wind. Does NOT restore action points, HP, or surges.</li>
          <li><strong>Extended Rest</strong> (6 hours in-game): Fully restores HP, healing surges, encounter + daily powers, Second Wind, and action points.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'campaigns',
    title: 'Campaigns & Party Sharing',
    emoji: '🏰',
    body: (
      <>
        <p>
          Create a campaign as DM to manage sessions, encounters, shared notes, and a party roster. Share a
          campaign code with players so they can link their characters to the party. DMs see player sheets
          as read-only from the Party Roster.
        </p>
      </>
    ),
  },
  {
    id: 'homebrew',
    title: 'Homebrew Workshop',
    emoji: '🔧',
    body: (
      <>
        <p>
          Create custom races, classes, powers, feats, weapons, armor, and magic items. Homebrew content is
          tagged and appears in all relevant pickers alongside official content. Attach homebrew to a shared
          campaign so players see it automatically.
        </p>
      </>
    ),
  },
  {
    id: 'import-export',
    title: 'Backup & Transfer',
    emoji: '📦',
    body: (
      <>
        <p>
          Use <strong>Import / Export</strong> in the sidebar to download a JSON backup of all characters,
          campaigns, sessions, encounters, and homebrew. Import a backup to restore on another device.
          Signed-in users also get automatic cloud backup.
        </p>
      </>
    ),
  },
  {
    id: 'tips',
    title: 'Tips & Tricks',
    emoji: '💡',
    body: (
      <>
        <ul className="list-disc pl-6 space-y-1">
          <li>Tap any ability score or skill to roll a d20 check — the result shows inline next to the roll.</li>
          <li>Pin frequently-used powers to the Quick Tray (⚡ button) for one-tap access.</li>
          <li>On the Review step, tap race/class/build choice/feats/powers to expand full details.</li>
          <li>The Notes tab supports rich text — bold, italic, lists, tables, links, and more.</li>
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
