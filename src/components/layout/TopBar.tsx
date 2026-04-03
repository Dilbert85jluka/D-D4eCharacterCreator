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

      {/* Section Nav Tabs */}
      <nav className="flex items-stretch h-full gap-1 overflow-x-auto">
        {/* Character Creator tab */}
        <button onClick={() => navigate('home')} className={tabCls(isCreatorActive)}>
          <span className="text-base">⚔️</span>
          <span className="hidden sm:inline">Character Creator</span>
          <span className="sm:hidden">Creator</span>
        </button>

        {/* Campaign Management tab */}
        <button onClick={() => navigate('campaigns')} className={tabCls(isCampaignActive)}>
          <span className="text-base">🏰</span>
          <span className="hidden sm:inline">Campaign Management</span>
          <span className="sm:hidden">Campaigns</span>
        </button>

        {/* Monster Compendium tab */}
        <button onClick={() => navigate('monsters')} className={tabCls(isCompendiumActive)}>
          <span className="text-base">🐉</span>
          <span className="hidden sm:inline">Monster Compendium</span>
          <span className="sm:hidden">Monsters</span>
        </button>

        {/* Magic Item Compendium tab */}
        <button onClick={() => navigate('magicItems')} className={tabCls(isMagicItemsActive)}>
          <span className="text-base">✨</span>
          <span className="hidden sm:inline">Magic Item Compendium</span>
          <span className="sm:hidden">Items</span>
        </button>

        {/* Homebrew Workshop tab */}
        <button onClick={() => navigate('homebrew')} className={tabCls(isHomebrewActive)}>
          <span className="text-base">🔧</span>
          <span className="hidden sm:inline">Homebrew Workshop</span>
          <span className="sm:hidden">Homebrew</span>
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
