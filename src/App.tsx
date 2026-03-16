import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { useCharactersStore } from './store/useCharactersStore';
import { useCampaignsStore } from './store/useCampaignsStore';
import { useSessionsStore } from './store/useSessionsStore';
import { useEncountersStore } from './store/useEncountersStore';
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

export default function App() {
  const currentView    = useAppStore((s) => s.currentView);
  const loadCharacters    = useCharactersStore((s) => s.loadCharacters);
  const loadCampaigns     = useCampaignsStore((s) => s.loadCampaigns);
  const loadAllSessions   = useSessionsStore((s) => s.loadAllSessions);
  const loadAllEncounters = useEncountersStore((s) => s.loadAllEncounters);

  // Load all data from IndexedDB on app start
  useEffect(() => { loadCharacters(); }, [loadCharacters]);
  useEffect(() => { loadCampaigns(); }, [loadCampaigns]);
  useEffect(() => { loadAllSessions(); }, [loadAllSessions]);
  useEffect(() => { loadAllEncounters(); }, [loadAllEncounters]);

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
      </main>

      {/* Toast notifications */}
      <Toast />
    </div>
  );
}
