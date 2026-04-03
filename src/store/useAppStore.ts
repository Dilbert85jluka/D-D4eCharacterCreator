import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppView = 'home' | 'wizard' | 'sheet' | 'portrait' | 'monsters' | 'campaigns' | 'magicItems' | 'homebrew' | 'login';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  currentView: AppView;
  sidebarOpen: boolean;
  activeToast: Toast | null;
  activeCharacterId: string | null;

  navigate: (view: AppView, characterId?: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  showToast: (message: string, type: Toast['type']) => void;
  clearToast: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'home',
      sidebarOpen: false,
      activeToast: null,
      activeCharacterId: null,

      navigate: (view, characterId) =>
        set({ currentView: view, activeCharacterId: characterId ?? null }),

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      showToast: (message, type) => set({ activeToast: { message, type } }),
      clearToast: () => set({ activeToast: null }),
    }),
    {
      name: 'dnd4e-app-nav',
      storage: createJSONStorage(() => sessionStorage),
      // Persist the view + character for sheet and portrait views.
      // Wizard progress is lost on refresh anyway, so always fall back to home.
      // Refreshing on the portrait page returns to the sheet.
      partialize: (state) => ({
        currentView:
          state.currentView === 'sheet' || state.currentView === 'portrait'
            ? 'sheet'
            : state.currentView === 'monsters'
            ? 'monsters'
            : state.currentView === 'campaigns'
            ? 'campaigns'
            : state.currentView === 'magicItems'
            ? 'magicItems'
            : 'home',
        activeCharacterId: state.activeCharacterId,
      }),
    },
  ),
);
