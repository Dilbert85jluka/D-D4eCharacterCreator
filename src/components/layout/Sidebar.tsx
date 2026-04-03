import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { AppView } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ImportExportModal } from '../settings/ImportExportModal';

const SECTIONS: { label: string; emoji: string; view: AppView; activeFor: AppView[] }[] = [
  {
    label:     'Character Creator',
    emoji:     '⚔️',
    view:      'home',
    activeFor: ['home', 'sheet', 'wizard', 'portrait'],
  },
  {
    label:     'Campaign Management',
    emoji:     '🏰',
    view:      'campaigns',
    activeFor: ['campaigns'],
  },
  {
    label:     'Monster Compendium',
    emoji:     '🐉',
    view:      'monsters',
    activeFor: ['monsters'],
  },
  {
    label:     'Magic Item Compendium',
    emoji:     '✨',
    view:      'magicItems',
    activeFor: ['magicItems'],
  },
  {
    label:     'Homebrew Workshop',
    emoji:     '🔧',
    view:      'homebrew',
    activeFor: ['homebrew'],
  },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, navigate, currentView } = useAppStore();
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);
  const [showImportExport, setShowImportExport] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={[
          'fixed top-0 left-0 z-40 h-full w-72 bg-amber-950 shadow-xl',
          'flex flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="h-14 flex items-center px-4 border-b border-amber-800">
          <span className="text-amber-100 font-bold text-base tracking-wide flex-1">
            🎲 D&D 4e Tools
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-amber-300 hover:text-white p-2 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Section Navigation */}
        <nav className="flex-1 py-3 flex flex-col gap-1 px-3 overflow-y-auto">
          {SECTIONS.map(({ label, emoji, view, activeFor }) => {
            const isActive = activeFor.includes(currentView);
            return (
              <button
                key={view}
                onClick={() => { navigate(view); setSidebarOpen(false); }}
                className={[
                  'w-full flex items-center gap-4 px-4 rounded-xl transition-colors min-h-[64px] text-left',
                  isActive
                    ? 'bg-amber-700 text-white'
                    : 'text-amber-100 hover:bg-amber-800',
                ].join(' ')}
              >
                <span className="text-2xl leading-none flex-shrink-0">{emoji}</span>
                <span className="font-semibold text-base leading-tight">{label}</span>
              </button>
            );
          })}

          {/* Divider */}
          <div className="border-t border-amber-800 mx-1 my-2" />

          {/* Settings heading */}
          <div className="px-4 py-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">⚙️ Settings</span>
          </div>

          {/* Import / Export */}
          <button
            onClick={() => { setShowImportExport(true); setSidebarOpen(false); }}
            className="w-full flex items-center gap-4 px-4 rounded-xl transition-colors min-h-[52px] text-left text-amber-100 hover:bg-amber-800"
          >
            <span className="text-xl leading-none flex-shrink-0">📦</span>
            <span className="font-medium text-base leading-tight">Import / Export</span>
          </button>

          {/* Divider */}
          <div className="border-t border-amber-800 mx-1 my-2" />

          {/* Account */}
          <div className="px-4 py-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Account</span>
          </div>

          {profile ? (
            <>
              <div className="px-4 py-2 text-amber-200 text-sm">
                <p className="font-semibold">{profile.display_name || 'No display name'}</p>
                <p className="text-amber-400/70 text-xs mt-0.5">{profile.email}</p>
              </div>
              <button
                onClick={() => { logout(); setSidebarOpen(false); }}
                className="w-full flex items-center gap-4 px-4 rounded-xl transition-colors min-h-[52px] text-left text-amber-100 hover:bg-amber-800"
              >
                <span className="text-xl leading-none flex-shrink-0">🚪</span>
                <span className="font-medium text-base leading-tight">Log Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => { navigate('login'); setSidebarOpen(false); }}
              className="w-full flex items-center gap-4 px-4 rounded-xl transition-colors min-h-[52px] text-left text-amber-100 hover:bg-amber-800"
            >
              <span className="text-xl leading-none flex-shrink-0">🔑</span>
              <span className="font-medium text-base leading-tight">Sign In</span>
            </button>
          )}

          {/* Version */}
          <div className="mt-auto border-t border-amber-800 mx-1 pt-2 pb-3 px-4">
            <span className="text-xs text-amber-500/60">v{__APP_VERSION__}</span>
          </div>
        </nav>
      </aside>

      {/* Import/Export Modal */}
      {showImportExport && (
        <ImportExportModal onClose={() => setShowImportExport(false)} />
      )}
    </>
  );
}
