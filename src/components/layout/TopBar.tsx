import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';

export function TopBar() {
  const { toggleSidebar, currentView, navigate } = useAppStore();
  const profile = useAuthStore((s) => s.profile);

  const isCharacterSection = currentView === 'sheet' || currentView === 'wizard' || currentView === 'portrait';
  const isCreatorActive    = currentView === 'home' || isCharacterSection;
  const isCompendiumActive = currentView === 'monsters';
  const isCampaignActive   = currentView === 'campaigns';
  const isMagicItemsActive = currentView === 'magicItems';
  const isHomebrewActive   = currentView === 'homebrew';

  const tabCls = (active: boolean) =>
    [
      'flex items-center gap-1.5 px-3 text-sm font-semibold transition-colors border-b-2 min-h-[44px]',
      active
        ? 'text-amber-300 border-amber-300'
        : 'text-amber-200/70 border-transparent hover:text-amber-200 hover:border-amber-200/50',
    ].join(' ');

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-amber-950 shadow-lg flex items-center px-4 gap-2">
      {/* Hamburger */}
      <button
        onClick={toggleSidebar}
        className="text-amber-100 hover:text-white p-2 rounded-lg hover:bg-amber-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Section Nav Tabs.
          Label visibility is breakpoint-gated so the bar never clips on tablet-portrait widths
          (the five short labels total ~557px and, alongside the "← Characters" button + avatar,
          overflow the sheet view below ~800px CSS — exactly where Samsung tablets land):
            • below lg (<1024): icon only — fits every tablet portrait down to ~360px
            • lg–xl (1024–1279): short labels
            • xl+ (≥1280): full titles
          Each tab keeps a title tooltip and aria-label so the icon-only state stays discoverable,
          and the full sidebar menu still lists every section by name. */}
      <nav className="flex items-stretch h-full gap-1 overflow-x-auto">
        {/* Character Creator tab */}
        <button onClick={() => navigate('home')} className={tabCls(isCreatorActive)} title="Character Creator" aria-label="Character Creator">
          <span className="text-base">⚔️</span>
          <span className="hidden lg:inline xl:hidden">Creator</span>
          <span className="hidden xl:inline">Character Creator</span>
        </button>

        {/* Campaign Management tab */}
        <button onClick={() => navigate('campaigns')} className={tabCls(isCampaignActive)} title="Campaign Management" aria-label="Campaign Management">
          <span className="text-base">🏰</span>
          <span className="hidden lg:inline xl:hidden">Campaigns</span>
          <span className="hidden xl:inline">Campaign Management</span>
        </button>

        {/* Monster Compendium tab */}
        <button onClick={() => navigate('monsters')} className={tabCls(isCompendiumActive)} title="Monster Compendium" aria-label="Monster Compendium">
          <span className="text-base">🐉</span>
          <span className="hidden lg:inline xl:hidden">Monsters</span>
          <span className="hidden xl:inline">Monster Compendium</span>
        </button>

        {/* Magic Item Compendium tab */}
        <button onClick={() => navigate('magicItems')} className={tabCls(isMagicItemsActive)} title="Magic Item Compendium" aria-label="Magic Item Compendium">
          <span className="text-base">✨</span>
          <span className="hidden lg:inline xl:hidden">Items</span>
          <span className="hidden xl:inline">Magic Item Compendium</span>
        </button>

        {/* Homebrew Workshop tab */}
        <button onClick={() => navigate('homebrew')} className={tabCls(isHomebrewActive)} title="Homebrew Workshop" aria-label="Homebrew Workshop">
          <span className="text-base">🔧</span>
          <span className="hidden lg:inline xl:hidden">Homebrew</span>
          <span className="hidden xl:inline">Homebrew Workshop</span>
        </button>
      </nav>

      <div className="flex-1" />

      {/* Back to Characters — only when viewing a character */}
      {isCharacterSection && (
        <button
          onClick={() => navigate('home')}
          className="text-amber-200 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-amber-800 transition-colors flex-shrink-0"
        >
          ← Characters
        </button>
      )}

      {/* User indicator */}
      <button
        onClick={() => navigate('login')}
        className="flex-shrink-0 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center text-xs font-bold transition-colors border border-amber-700 hover:bg-amber-800"
        title={profile ? profile.display_name || profile.email : 'Sign in'}
      >
        {profile ? (
          <span className="text-amber-200">
            {(profile.display_name || profile.email || '?').substring(0, 2).toUpperCase()}
          </span>
        ) : (
          <span className="text-amber-400/60">?</span>
        )}
      </button>
    </header>
  );
}
