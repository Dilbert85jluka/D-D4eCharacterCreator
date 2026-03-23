import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { useCharactersStore } from './store/useCharactersStore';
import { useCampaignsStore } from './store/useCampaignsStore';
import { useSessionsStore } from './store/useSessionsStore';
import { useEncountersStore } from './store/useEncountersStore';
import { useAuthStore } from './store/useAuthStore';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/layout/Toast';
import { HomePage } from './pages/HomePage';
import { WizardPage } from './pages/WizardPage';
import { SheetPage } from './pages/SheetPage';
import { PortraitPage } from './pages/PortraitPage';
import { MonsterCompendiumPage } from './pages/MonsterCompendiumPage';
import { CampaignManagementPage } from './pages/CampaignManagementPage';
import { MagicItemCompendiumPage } from './pages/MagicItemCompendiumPage';
import { LoginPage } from './components/auth/LoginPage';
import { useCharacterCloudSync } from './hooks/useCharacterCloudSync';
import { useCampaignCloudSync } from './hooks/useCampaignCloudSync';

export default function App() {
  const currentView    = useAppStore((s) => s.currentView);
  const loadCharacters    = useCharactersStore((s) => s.loadCharacters);
  const loadCampaigns     = useCampaignsStore((s) => s.loadCampaigns);
  const loadAllSessions   = useSessionsStore((s) => s.loadAllSessions);
  const loadAllEncounters = useEncountersStore((s) => s.loadAllEncounters);
  const initializeAuth  = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // Load all data from IndexedDB on app start
  useEffect(() => { loadCharacters(); }, [loadCharacters]);
  useEffect(() => { loadCampaigns(); }, [loadCampaigns]);
  useEffect(() => { loadAllSessions(); }, [loadAllSessions]);
  useEffect(() => { loadAllEncounters(); }, [loadAllEncounters]);
  // Initialize Supabase auth (checks existing session, subscribes to changes)
  useEffect(() => { initializeAuth(); }, [initializeAuth]);
  useCharacterCloudSync();
  useCampaignCloudSync();


  // Show nothing while auth is initializing (checking existing session)
  if (!isInitialized) {
    return <div className="min-h-screen bg-parchment-100" />;
  }

  // Require login — show LoginPage if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-parchment-100">
        <LoginPage />
        <Toast />
      </div>
    );
  }

  const isWizard    = currentView === 'wizard';
  const isFullPage  = isWizard || currentView === 'portrait';
  const isMonsters  = currentView === 'monsters';
  const isCampaigns = currentView === 'campaigns';

  return (
    <div className="min-h-screen bg-parchment-100">
      {/* Top navigation bar — hidden during wizard and portrait */}
      {!isFullPage && <TopBar />}

      {/* Sidebar drawer — hidden during wizard and portrait (full-page views only) */}
      {!isFullPage && <Sidebar />}

      {/* Main content */}
      <main className={isFullPage ? '' : 'pt-14'}>
        {currentView === 'home'      && <HomePage />}
        {currentView === 'wizard'    && <WizardPage />}
        {currentView === 'sheet'     && <SheetPage />}
        {currentView === 'portrait'  && <PortraitPage />}
        {currentView === 'monsters'  && <MonsterCompendiumPage />}
        {currentView === 'campaigns' && <CampaignManagementPage />}
        {currentView === 'magicItems' && <MagicItemCompendiumPage />}
        {currentView === 'login'     && <LoginPage />}
      </main>

      {/* Toast notifications */}
      <Toast />
    </div>
  );
}
