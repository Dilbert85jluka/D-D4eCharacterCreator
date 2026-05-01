import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppView = 'home' | 'wizard' | 'sheet' | 'portrait' | 'monsters' | 'campaigns' | 'magicItems' | 'homebrew' | 'login' | 'instructions';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  currentView: AppView;
  sidebarOpen: boolean;
  activeToast: Toast | null;
  activeCharacterId: string | null;
  /** Share code captured from `?import=<code>` URL. HomebrewWorkshopPage reads + clears this. */
  pendingImportCode: string | null;

  navigate: (view: AppView, characterId?: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  showToast: (message: string, type: Toast['type']) => void;
  clearToast: () => void;
  setPendingImportCode: (code: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'home',
      sidebarOpen: false,
      activeToast: null,
      activeCharacterId: null,
      pendingImportCode: null,

      navigate: (view, characterId) =>
        set({ currentView: view, activeCharacterId: characterId ?? null }),

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      showToast: (message, type) => set({ activeToast: { message, type } }),
      clearToast: () => set({ activeToast: null }),
      setPendingImportCode: (code) => set({ pendingImportCode: code }),
    }),
    {
      name: 'dnd4e-app-nav',
      storage: createJSONStorage(() => sessionStorage),
      // Persist the view + character across refresh.
      // Refreshing on the portrait page returns to the sheet.
      // Wizard state is persisted separately in localStorage.
      partialize: (state) => ({
        currentView:
          state.currentView === 'sheet' || state.currentView === 'portrait'
            ? 'sheet'
            : state.currentView === 'wizard'
            ? 'wizard'
            : state.currentView === 'monsters'
            ? 'monsters'
            : state.currentView === 'campaigns'
            ? 'campaigns'
            : state.currentView === 'magicItems'
            ? 'magicItems'
            : 'home',
        activeCharacterId: state.activeCharacterId,
        // Persist pending import code so it survives the magic-link login round-trip
        // (the magic link callback reloads the page).
        pendingImportCode: state.pendingImportCode,
      }),
    },
  ),
);
