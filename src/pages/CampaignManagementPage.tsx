import { useState, useEffect, useCallback } from 'react';
import { useCampaignsStore } from '../store/useCampaignsStore';
import { useCharactersStore } from '../store/useCharactersStore';
import { useSessionsStore } from '../store/useSessionsStore';
import { useEncountersStore } from '../store/useEncountersStore';
import { useAppStore } from '../store/useAppStore';
import { campaignRepository } from '../db/campaignRepository';
import { sessionRepository } from '../db/sessionRepository';
import { encounterRepository } from '../db/encounterRepository';
import { getRaceById } from '../data/races';
import { getClassById } from '../data/classes';
import { searchMonsters, getMonsterById } from '../data/monsters/index';
import { MonsterModal } from '../components/monsters/MonsterModal';
import type { MonsterRole, MonsterData } from '../types/monster';
import type { Campaign } from '../types/campaign';
import type { CampaignSession } from '../types/session';
import type { SessionEncounter, InitiativeEntry, SavedInitiativeState } from '../types/encounter';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '../store/useAuthStore';
import { useSharingStore } from '../store/useSharingStore';
import { SharedCampaignView } from '../components/sharing/SharedCampaignView';
import { JoinCampaignModal } from '../components/sharing/JoinCampaignModal';
import { ShareCampaignModal } from '../components/sharing/ShareCampaignModal';
import { LinkCharacterModal } from '../components/sharing/LinkCharacterModal';
import { MemberCard } from '../components/sharing/PartyRosterCards';
import type { CharacterSummary } from '../types/sharing';
import { CharacterSheet } from '../components/sheet/CharacterSheet';
import { useRealtimeCampaign } from '../hooks/useRealtimeCampaign';
import { useCampaignContentSync } from '../hooks/useCampaignContentSync';
import { extractPublicContent, pushCampaignContent } from '../lib/campaignContentSync';
import { RichTextEditor } from '../components/ui/RichTextEditor';
import { RichTextDisplay } from '../components/ui/RichTextDisplay';

// ── Types ─────────────────────────────────────────────────────────────────────

type EditorMode =
  | { type: 'none' }
  | { type: 'new-campaign' }
  | { type: 'campaign'; campaignId: string }
  | { type: 'new-session'; campaignId: string }
  | { type: 'session'; campaignId: string; sessionId: string }
  | { type: 'shared-campaign'; sharedCampaignId: string };

// ── Form shape types ──────────────────────────────────────────────────────────

const CAMPAIGN_EMPTY = { name: '', description: '', privateNotes: '', publicNotes: '', characterIds: [] as string[] };
type CampaignDraft = typeof CAMPAIGN_EMPTY;

const SESSION_EMPTY = {
  sessionNumber: 0,
  name: '',
  date: '',
  importantEvents: '',
  plannedSummary: '',
  additionalNotes: '',
};
type SessionDraft = typeof SESSION_EMPTY;

// ── Small shared helpers ──────────────────────────────────────────────────────

function charAvatar(portrait?: string, role?: string) {
  return (
    <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-200 flex-shrink-0
                    flex items-center justify-center text-lg overflow-hidden">
      {portrait
        ? <img src={portrait} alt="" className="w-full h-full object-cover" />
        : (role === 'Controller' ? '🧙' : role === 'Defender' ? '🛡️' : role === 'Leader' ? '⚕️' : '🗡️')}
    </div>
  );
}

const fieldCls =
  'w-full border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-700 outline-none ' +
  'focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors ' +
  'placeholder:text-stone-400 resize-y';

const labelCls = 'block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1';
const hintCls  = 'text-xs text-stone-400 mb-1.5';

function monsterRoleCls(role: MonsterRole): string {
  switch (role) {
    case 'Brute':      return 'bg-red-100 text-red-700';
    case 'Soldier':    return 'bg-blue-100 text-blue-700';
    case 'Artillery':  return 'bg-yellow-100 text-yellow-800';
    case 'Lurker':     return 'bg-purple-100 text-purple-700';
    case 'Controller': return 'bg-emerald-100 text-emerald-700';
    case 'Skirmisher': return 'bg-orange-100 text-orange-700';
    default:           return 'bg-stone-100 text-stone-600';
  }
}

// ── Main Component ────────────────────────────────────────────────────────────

export function CampaignManagementPage() {
  const { campaigns, loadCampaigns, addCampaign, updateCampaign, deleteCampaign } = useCampaignsStore();
  const { characters, loadCharacters } = useCharactersStore();
  const {
    loadAllSessions, addSession, updateSession, deleteSession,
    getSessionsForCampaign, nextSessionNumber,
  } = useSessionsStore();
  const navigate = useAppStore((s) => s.navigate);

  // ── Sharing state ──────────────────────────────────────────────────────────
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const {
    sharedCampaigns, loadSharedCampaigns, createCampaign: createSharedCampaign,
    activeCampaignMembers, activeCampaignSummaries, loadCampaignDetail,
    unlinkCharacter,
    viewingCharacter, viewingCharacterLoading, fetchCharacterData, clearViewingCharacter,
  } = useSharingStore();
  const [viewingSummaryId, setViewingSummaryId] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDmLinkModal, setShowDmLinkModal] = useState(false);
  const [shareInviteCode, setShareInviteCode] = useState("");
  const [shareCampaignName, setShareCampaignName] = useState("");
  useEffect(() => { if (user) loadSharedCampaigns(user.id); }, [user, loadSharedCampaigns]);
  useCampaignContentSync();

  // One-time migration: link existing local campaigns to shared campaigns by name
  const [migrationDone, setMigrationDone] = useState(false);
  useEffect(() => {
    if (!user || migrationDone || sharedCampaigns.length === 0 || campaigns.length === 0) return;
    setMigrationDone(true);
    (async () => {
      for (const c of campaigns) {
        if (c.sharedCampaignId) continue;
        const match = sharedCampaigns.find((sc) => sc.name === c.name && sc.created_by === user.id);
        if (match) {
          await campaignRepository.patch(c.id, { sharedCampaignId: match.id });
          updateCampaign({ ...c, sharedCampaignId: match.id });
        }
      }
    })();
  }, [user, campaigns, sharedCampaigns, migrationDone]);


  const {
    getEncountersForSession, addEncounter, updateEncounter,
    deleteEncounter: deleteEncounterFromStore, nextSortOrder,
  } = useEncountersStore();

  // ── Boot ─────────────────────────────────────────────────────────────────
  useEffect(() => { loadCampaigns(); }, [loadCampaigns]);
  useEffect(() => { loadCharacters(); }, [loadCharacters]);
  useEffect(() => { loadAllSessions(); }, [loadAllSessions]);

  // ── Navigation / selection state ─────────────────────────────────────────
  const [mode, setMode] = useState<EditorMode>({ type: 'none' });
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showEditor, setShowEditor] = useState(false); // mobile: editor panel visible

  const toggleExpand = (campaignId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(campaignId) ? next.delete(campaignId) : next.add(campaignId);
      return next;
    });
  };

  // ── Campaign form ─────────────────────────────────────────────────────────
  const [campaignDraft, setCampaignDraft] = useState<CampaignDraft>(CAMPAIGN_EMPTY);
  const [campaignSaving, setCampaignSaving] = useState(false);
  const [campaignError, setCampaignError]   = useState<string | null>(null);
  const [editingNotes, setEditingNotes]     = useState(false);

  const loadCampaignDraft = useCallback((c: Campaign) => {
    setCampaignDraft({
      name: c.name,
      description: c.description,
      privateNotes: c.privateNotes ?? '',
      publicNotes: c.publicNotes,
      characterIds: [...c.characterIds],
    });
  }, []);

  const selectCampaign = (c: Campaign) => {
    setMode({ type: 'campaign', campaignId: c.id });
    loadCampaignDraft(c);
    setExpandedIds((prev) => new Set([...prev, c.id])); // auto-expand
    setShowEditor(true);
    setCampaignError(null);
    setEditingNotes(false);
  };

  const startNewCampaign = () => {
    setMode({ type: 'new-campaign' });
    setCampaignDraft(CAMPAIGN_EMPTY);
    setShowEditor(true);
    setCampaignError(null);
    setEditingNotes(true); // new campaigns start in edit mode
  };

  const isCampaignDirty = (() => {
    if (mode.type === 'new-campaign') {
      return campaignDraft.name.trim() !== '' || campaignDraft.description !== '' ||
        campaignDraft.privateNotes !== '' || campaignDraft.publicNotes !== '' || campaignDraft.characterIds.length > 0;
    }
    if (mode.type !== 'campaign') return false;
    const orig = campaigns.find((c) => c.id === mode.campaignId);
    if (!orig) return false;
    return campaignDraft.name.trim() !== orig.name ||
      campaignDraft.description !== orig.description ||
      campaignDraft.privateNotes !== (orig.privateNotes ?? '') ||
      campaignDraft.publicNotes !== orig.publicNotes ||
      JSON.stringify(campaignDraft.characterIds) !== JSON.stringify(orig.characterIds);
  })();

  // DM's own linked character in the shared campaign
  const dmCharacterSummary = activeCampaignSummaries.find((s) => s.user_id === user?.id);

  const handleDmCharacterClick = (summary: CharacterSummary) => {
    const sharedId = activeCampaign?.sharedCampaignId;
    if (!sharedId) return;
    setViewingSummaryId(summary.id);
    fetchCharacterData(summary.id, sharedId);
  };

  const handleCloseViewer = () => {
    setViewingSummaryId(null);
    clearViewingCharacter();
  };

  const handleDmUnlink = async () => {
    if (!dmCharacterSummary || !activeCampaign?.sharedCampaignId) return;
    await unlinkCharacter(dmCharacterSummary.id, activeCampaign.sharedCampaignId);
  };

  const handleSaveCampaign = async () => {
    const name = campaignDraft.name.trim();
    if (!name) { setCampaignError('Campaign name is required.'); return; }
    setCampaignError(null);
    setCampaignSaving(true);
    try {
      if (mode.type === 'new-campaign') {
        const created = await campaignRepository.create({
          name,
          description: campaignDraft.description,
          privateNotes: campaignDraft.privateNotes,
          publicNotes: campaignDraft.publicNotes,
          characterIds: campaignDraft.characterIds,
        });
        addCampaign(created);
        setExpandedIds((prev) => new Set([...prev, created.id]));
        setMode({ type: 'campaign', campaignId: created.id });
      } else if (mode.type === 'campaign') {
        const existing = campaigns.find((c) => c.id === mode.campaignId);
        if (!existing) return;
        const updated: Campaign = {
          ...existing,
          name,
          description: campaignDraft.description,
          privateNotes: campaignDraft.privateNotes,
          publicNotes: campaignDraft.publicNotes,
          characterIds: campaignDraft.characterIds,
          updatedAt: Date.now(),
        };
        await campaignRepository.update(updated);
        updateCampaign(updated);
      }
    } catch {
      setCampaignError('Failed to save. Please try again.');
    } finally {
      setCampaignSaving(false);
    }
  };

  // ── Character picker (for campaigns) ─────────────────────────────────────
  const [showCharPicker, setShowCharPicker] = useState(false);
  const [charSearch, setCharSearch]         = useState('');

  const q = charSearch.trim().toLowerCase();
  const availableChars = characters.filter((c) => {
    if (campaignDraft.characterIds.includes(c.id)) return false;
    if (!q) return true;
    return c.name.toLowerCase().includes(q) ||
      (getRaceById(c.raceId)?.name ?? '').toLowerCase().includes(q) ||
      (getClassById(c.classId)?.name ?? '').toLowerCase().includes(q);
  });

  // ── Session form ──────────────────────────────────────────────────────────
  const [sessionDraft, setSessionDraft] = useState<SessionDraft>(SESSION_EMPTY);
  const [sessionSaving, setSessionSaving] = useState(false);
  const [sessionError, setSessionError]   = useState<string | null>(null);

  const loadSessionDraft = useCallback((s: CampaignSession) => {
    setSessionDraft({
      sessionNumber: s.sessionNumber,
      name: s.name,
      date: s.date,
      importantEvents: s.importantEvents,
      plannedSummary: s.plannedSummary,
      additionalNotes: s.additionalNotes,
    });
  }, []);

  const selectSession = (campaignId: string, session: CampaignSession) => {
    setMode({ type: 'session', campaignId, sessionId: session.id });
    loadSessionDraft(session);
    setShowEditor(true);
    setSessionError(null);
  };

  const startNewSession = (campaignId: string) => {
    const next = nextSessionNumber(campaignId);
    setMode({ type: 'new-session', campaignId });
    setSessionDraft({ ...SESSION_EMPTY, sessionNumber: next });
    setShowEditor(true);
    setSessionError(null);
  };

  const isSessionDirty = (() => {
    if (mode.type === 'new-session') {
      return sessionDraft.name.trim() !== '' || sessionDraft.date !== '' ||
        sessionDraft.importantEvents !== '' || sessionDraft.plannedSummary !== '' ||
        sessionDraft.additionalNotes !== '';
    }
    if (mode.type !== 'session') return false;
    const sessions = getSessionsForCampaign(mode.campaignId);
    const orig = sessions.find((s) => s.id === mode.sessionId);
    if (!orig) return false;
    return sessionDraft.sessionNumber !== orig.sessionNumber ||
      sessionDraft.name.trim() !== orig.name ||
      sessionDraft.date !== orig.date ||
      sessionDraft.importantEvents !== orig.importantEvents ||
      sessionDraft.plannedSummary !== orig.plannedSummary ||
      sessionDraft.additionalNotes !== orig.additionalNotes;
  })();

  const handleSaveSession = async () => {
    if (mode.type !== 'new-session' && mode.type !== 'session') return;
    const name = sessionDraft.name.trim();
    if (!name) { setSessionError('Session name is required.'); return; }
    setSessionError(null);
    setSessionSaving(true);
    try {
      if (mode.type === 'new-session') {
        const created = await sessionRepository.create({
          campaignId: mode.campaignId,
          sessionNumber: sessionDraft.sessionNumber,
          name,
          date: sessionDraft.date,
          importantEvents: sessionDraft.importantEvents,
          plannedSummary: sessionDraft.plannedSummary,
          additionalNotes: sessionDraft.additionalNotes,
        });
        addSession(created);
        setMode({ type: 'session', campaignId: mode.campaignId, sessionId: created.id });
      } else {
        const sessions = getSessionsForCampaign(mode.campaignId);
        const existing = sessions.find((s) => s.id === mode.sessionId);
        if (!existing) return;
        const updated: CampaignSession = {
          ...existing,
          sessionNumber: sessionDraft.sessionNumber,
          name,
          date: sessionDraft.date,
          importantEvents: sessionDraft.importantEvents,
          plannedSummary: sessionDraft.plannedSummary,
          additionalNotes: sessionDraft.additionalNotes,
          updatedAt: Date.now(),
        };
        await sessionRepository.update(updated);
        updateSession(updated);
      }
    } catch {
      setSessionError('Failed to save. Please try again.');
    } finally {
      setSessionSaving(false);
    }
  };

  // ── Delete state ──────────────────────────────────────────────────────────
  const [pendingDelete, setPendingDelete] = useState<
    | { kind: 'campaign'; id: string }
    | { kind: 'session'; id: string; campaignId: string }
    | null
  >(null);

  const handleDeleteCampaign = async (id: string) => {
    await deleteCampaign(id); // cascade deletes sessions too (store handles it)
    setPendingDelete(null);
    if ((mode.type === 'campaign' || mode.type === 'new-session' || mode.type === 'session') &&
        'campaignId' in mode && mode.campaignId === id) {
      setMode({ type: 'none' });
      setShowEditor(false);
    }
  };

  const handleDeleteSession = async (id: string, campaignId: string) => {
    await deleteSession(id, campaignId);
    setPendingDelete(null);
    if (mode.type === 'session' && mode.sessionId === id) {
      setMode({ type: 'campaign', campaignId });
      const c = campaigns.find((c) => c.id === campaignId);
      if (c) loadCampaignDraft(c);
    }
  };

  // ── Derived (early — used by initiative tracker) ─────────────────────────
  const activeCampaign =
    mode.type === 'campaign' ? campaigns.find((c) => c.id === mode.campaignId) :
    mode.type === 'new-session' ? campaigns.find((c) => c.id === mode.campaignId) :
    mode.type === 'session' ? campaigns.find((c) => c.id === mode.campaignId) : undefined;

  // Inline party roster: subscribe to realtime updates for the active campaign's shared ID
  const activeSharedId = activeCampaign?.sharedCampaignId ?? null;
  useRealtimeCampaign(activeSharedId);
  useEffect(() => {
    if (activeSharedId) loadCampaignDetail(activeSharedId);
  }, [activeSharedId, loadCampaignDetail]);

  const handleShareOnline = async () => {
    if (!user || !activeCampaign) return;
    try {
      // Check if already linked via sharedCampaignId
      if (activeCampaign.sharedCampaignId) {
        const existing = sharedCampaigns.find((sc) => sc.id === activeCampaign.sharedCampaignId);
        if (existing) {
          setShareInviteCode(existing.invite_code);
          setShareCampaignName(existing.name);
          setShowShareModal(true);
          return;
        }
      }
      // Fallback: check by name + creator (for campaigns shared before sharedCampaignId was added)
      const existingByName = sharedCampaigns.find(
        (sc) => sc.name === activeCampaign.name && sc.created_by === user.id
      );
      if (existingByName) {
        // Link it now
        await campaignRepository.patch(activeCampaign.id, { sharedCampaignId: existingByName.id });
        updateCampaign({ ...activeCampaign, sharedCampaignId: existingByName.id });
        setShareInviteCode(existingByName.invite_code);
        setShareCampaignName(existingByName.name);
        setShowShareModal(true);
        return;
      }
      // Create new shared campaign
      const shared = await createSharedCampaign(activeCampaign.name, activeCampaign.description, user.id);
      // Store the link
      await campaignRepository.patch(activeCampaign.id, { sharedCampaignId: shared.id });
      updateCampaign({ ...activeCampaign, sharedCampaignId: shared.id });
      // Push initial content
      const sessions = getSessionsForCampaign(activeCampaign.id);
      const content = extractPublicContent(activeCampaign, sessions);
      pushCampaignContent(shared.id, content).catch(() => {});
      setShareInviteCode(shared.invite_code);
      setShareCampaignName(shared.name);
      setShowShareModal(true);
      loadSharedCampaigns(user.id);
    } catch (err) {
      console.error("Failed to share campaign:", err);
    }
  };

  const activeSession =
    mode.type === 'session'
      ? getSessionsForCampaign(mode.campaignId).find((s) => s.id === mode.sessionId)
      : undefined;

  // ── Encounters ────────────────────────────────────────────────────────────
  const [showMonsterPicker, setShowMonsterPicker]               = useState(false);
  const [pickerTargetEncounterId, setPickerTargetEncounterId]   = useState<string | null>(null);
  const [monsterSearch, setMonsterSearch]                       = useState('');
  const [viewingMonster, setViewingMonster]                     = useState<MonsterData | null>(null);

  // ── Initiative Tracker state ──────────────────────────────────────────
  const [activeEncounterId, setActiveEncounterId]   = useState<string | null>(null);
  const [initiativeEntries, setInitiativeEntries]   = useState<InitiativeEntry[]>([]);
  const [addingCombatant, setAddingCombatant]       = useState<{
    type: 'monster' | 'pc';
    monsterId?: string;
    characterId?: string;
    displayName: string;
    defaultHp: number;
    instanceKey: string;  // unique key for this pool row
  } | null>(null);
  const [promptInit, setPromptInit] = useState('');
  const [promptHp, setPromptHp]     = useState('');
  const [activeTurnIndex, setActiveTurnIndex] = useState(-1);
  // Track which pool items have been added (by instanceKey)
  const [addedInstanceKeys, setAddedInstanceKeys] = useState<Set<string>>(new Set());
  // Track ad-hoc monsters added to initiative (not from encounter plan)
  const [adHocMonsters, setAdHocMonsters] = useState<Array<{
    instanceKey: string;
    monsterId: string;
    displayName: string;
    monster: MonsterData;
  }>>([]);
  // Whether the monster picker is being used for ad-hoc initiative adds
  const [monsterPickerForInitiative, setMonsterPickerForInitiative] = useState(false);

  const activeSessionId    = mode.type === 'session' ? mode.sessionId : null;
  const sessionEncounters  = activeSessionId ? getEncountersForSession(activeSessionId) : [];

  const handleAddEncounter = async () => {
    if (mode.type !== 'session') return;
    const created = await encounterRepository.create({
      sessionId:    mode.sessionId,
      campaignId:   mode.campaignId,
      sortOrder:    nextSortOrder(mode.sessionId),
      title:        'New Encounter',
      description:  '',
      monsterEntries: [],
    });
    addEncounter(created);
  };

  const handleDeleteEncounter = async (encounterId: string) => {
    if (!activeSessionId) return;
    await encounterRepository.delete(encounterId);
    deleteEncounterFromStore(encounterId, activeSessionId);
  };

  const handleEncounterBlur = async (enc: SessionEncounter, patch: Partial<SessionEncounter>) => {
    const updated = { ...enc, ...patch, updatedAt: Date.now() };
    await encounterRepository.update(updated);
    updateEncounter(updated);
  };

  const changeMonsterQty = async (enc: SessionEncounter, monsterId: string, delta: number) => {
    const entries = enc.monsterEntries.map((e) =>
      e.monsterId === monsterId ? { ...e, quantity: Math.max(1, e.quantity + delta) } : e,
    );
    const updated = { ...enc, monsterEntries: entries, updatedAt: Date.now() };
    await encounterRepository.update(updated);
    updateEncounter(updated);
  };

  const handleRemoveMonster = async (enc: SessionEncounter, monsterId: string) => {
    const entries = enc.monsterEntries.filter((e) => e.monsterId !== monsterId);
    const updated = { ...enc, monsterEntries: entries, updatedAt: Date.now() };
    await encounterRepository.update(updated);
    updateEncounter(updated);
  };

  const handlePickMonster = async (monsterId: string) => {
    if (!pickerTargetEncounterId) return;
    const enc = sessionEncounters.find((e) => e.id === pickerTargetEncounterId);
    if (!enc) return;
    const existing = enc.monsterEntries.find((e) => e.monsterId === monsterId);
    const entries = existing
      ? enc.monsterEntries.map((e) =>
          e.monsterId === monsterId ? { ...e, quantity: e.quantity + 1 } : e,
        )
      : [...enc.monsterEntries, { monsterId, quantity: 1 }];
    const updated = { ...enc, monsterEntries: entries, updatedAt: Date.now() };
    await encounterRepository.update(updated);
    updateEncounter(updated);
    setShowMonsterPicker(false);
    setMonsterSearch('');
  };

  // ── Initiative Tracker handlers ──────────────────────────────────────
  const activeEncounter = activeEncounterId
    ? sessionEncounters.find((e) => e.id === activeEncounterId)
    : null;

  // Build the expanded monster pool for the active encounter
  const monsterPool = activeEncounter
    ? activeEncounter.monsterEntries.flatMap(({ monsterId, quantity }) => {
        const monster = getMonsterById(monsterId);
        if (!monster) return [];
        return Array.from({ length: quantity }, (_, i) => ({
          instanceKey: `${monsterId}-${i}`,
          monsterId,
          displayName: quantity > 1 ? `${monster.name} #${i + 1}` : monster.name,
          monster,
          index: i,
        }));
      })
    : [];

  // PC pool: campaign characters
  const pcPool = activeCampaign
    ? activeCampaign.characterIds
        .map((id) => characters.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => !!c)
    : [];

  // addedInstanceKeys tracks which pool items have been added

  // Sorted initiative list (descending by initiative, ties by insertion order)
  const sortedInitiative = [...initiativeEntries].sort((a, b) => b.initiative - a.initiative);

  const handleStartEncounter = (encounterId: string) => {
    const enc = sessionEncounters.find((e) => e.id === encounterId);
    setActiveEncounterId(encounterId);
    setAddingCombatant(null);
    setPromptInit('');
    setPromptHp('');

    if (enc?.initiativeState) {
      // Resume from saved state
      setInitiativeEntries(enc.initiativeState.initiativeEntries);
      setActiveTurnIndex(enc.initiativeState.activeTurnIndex);
      setAddedInstanceKeys(new Set(enc.initiativeState.addedInstanceKeys));
      // Reconstruct adHocMonsters with full MonsterData from compendium
      setAdHocMonsters(
        enc.initiativeState.adHocMonsters
          .map((m) => {
            const monster = getMonsterById(m.monsterId);
            if (!monster) return null;
            return { ...m, monster };
          })
          .filter((m): m is NonNullable<typeof m> => m !== null),
      );
    } else {
      // Fresh start
      setInitiativeEntries([]);
      setActiveTurnIndex(-1);
      setAddedInstanceKeys(new Set());
      setAdHocMonsters([]);
    }
  };

  /** Close tracker UI — auto-saves current state if combatants exist, used by back arrow */
  const handleCloseTracker = async () => {
    // Auto-save if there are combatants in the initiative
    if (activeEncounterId && initiativeEntries.length > 0) {
      await handleSaveEncounterState();
    }
    setActiveEncounterId(null);
    setInitiativeEntries([]);
    setAddingCombatant(null);
    setActiveTurnIndex(-1);
    setAddedInstanceKeys(new Set());
    setAdHocMonsters([]);
  };

  /** End encounter deliberately — clears saved state from DB */
  const handleEndEncounter = async () => {
    if (activeEncounterId) {
      const enc = sessionEncounters.find((e) => e.id === activeEncounterId);
      if (enc?.initiativeState) {
        const updated = { ...enc, initiativeState: null, updatedAt: Date.now() };
        await encounterRepository.update(updated);
        updateEncounter(updated);
      }
    }
    handleCloseTracker();
  };

  const handleBeginAdd = (combatant: typeof addingCombatant) => {
    setAddingCombatant(combatant);
    setPromptInit('');
    setPromptHp(combatant ? String(combatant.defaultHp) : '');
  };

  const handleConfirmAdd = () => {
    if (!addingCombatant) return;
    const init = parseInt(promptInit);
    if (isNaN(init)) return;
    const hp = parseInt(promptHp) || addingCombatant.defaultHp;
    const entry: InitiativeEntry = {
      id: uuidv4(),
      type: addingCombatant.type,
      monsterId: addingCombatant.monsterId,
      characterId: addingCombatant.characterId,
      displayName: addingCombatant.displayName,
      initiative: init,
      hp,
      maxHp: hp,
      instanceKey: addingCombatant.instanceKey,
    };
    setInitiativeEntries((prev) => [...prev, entry]);
    setAddedInstanceKeys((prev) => new Set([...prev, addingCombatant.instanceKey]));
    setAddingCombatant(null);
    setPromptInit('');
    setPromptHp('');
  };

  const handleRemoveFromInitiative = (entryId: string, instanceKey: string) => {
    setInitiativeEntries((prev) => prev.filter((e) => e.id !== entryId));
    setAddedInstanceKeys((prev) => {
      const next = new Set(prev);
      next.delete(instanceKey);
      return next;
    });
    // Reset active turn if needed
    setActiveTurnIndex((idx) => {
      const newList = initiativeEntries.filter((e) => e.id !== entryId);
      if (newList.length === 0) return -1;
      if (idx >= newList.length) return 0;
      return idx;
    });
  };

  const handleNextTurn = () => {
    if (sortedInitiative.length === 0) return;
    setActiveTurnIndex((prev) => {
      if (prev < 0) return 0;
      return (prev + 1) % sortedInitiative.length;
    });
  };

  const handleAdHocMonsterPick = (monsterId: string) => {
    const monster = getMonsterById(monsterId);
    if (!monster) return;
    // Find a unique instance number for this monster type among ad-hoc entries
    const existingCount = adHocMonsters.filter((m) => m.monsterId === monsterId).length;
    const instanceNum = existingCount + 1;
    // Also count how many are in the planned pool
    const plannedCount = monsterPool.filter((m) => m.monsterId === monsterId).length;
    const totalCount = plannedCount + instanceNum;
    const displayName = (plannedCount > 0 || instanceNum > 1)
      ? `${monster.name} #${totalCount}`
      : monster.name;
    const instanceKey = `adhoc-${monsterId}-${instanceNum}`;

    const entry = { instanceKey, monsterId, displayName, monster };
    setAdHocMonsters((prev) => [...prev, entry]);
    setShowMonsterPicker(false);
    setMonsterSearch('');
    setMonsterPickerForInitiative(false);
    // Immediately open the add prompt for this monster
    handleBeginAdd({
      type: 'monster',
      monsterId,
      displayName,
      defaultHp: monster.hp,
      instanceKey,
    });
  };

  // Per-combatant HP adjustment amount (keyed by entry ID)
  const [hpAmounts, setHpAmounts] = useState<Record<string, string>>({});

  const handleHpChange = (entryId: string, direction: 1 | -1) => {
    const raw = hpAmounts[entryId];
    const amount = raw ? parseInt(raw) : 1;
    const delta = (isNaN(amount) ? 1 : Math.max(1, amount)) * direction;
    setInitiativeEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, hp: Math.max(0, Math.min(e.maxHp, e.hp + delta)) }
          : e,
      ),
    );
    // Clear the input back to empty (defaults to 1)
    setHpAmounts((prev) => {
      const next = { ...prev };
      delete next[entryId];
      return next;
    });
  };

  // ── Save / Resume encounter state ──────────────────────────────────
  const [saveConfirm, setSaveConfirm] = useState(false);

  const handleSaveEncounterState = async () => {
    if (!activeEncounterId) return;
    const enc = sessionEncounters.find((e) => e.id === activeEncounterId);
    if (!enc) return;

    const state: SavedInitiativeState = {
      initiativeEntries,
      activeTurnIndex,
      addedInstanceKeys: Array.from(addedInstanceKeys),
      adHocMonsters: adHocMonsters.map((m) => ({
        instanceKey: m.instanceKey,
        monsterId: m.monsterId,
        displayName: m.displayName,
      })),
    };

    const updated = { ...enc, initiativeState: state, updatedAt: Date.now() };
    await encounterRepository.update(updated);
    updateEncounter(updated);
    // Brief visual confirmation
    setSaveConfirm(true);
    setTimeout(() => setSaveConfirm(false), 1500);
  };

  // ── Back (mobile) ─────────────────────────────────────────────────────────
  const handleBack = () => {
    setShowEditor(false);
    // Sync drafts back to original on cancel
    if (mode.type === 'campaign') {
      const c = campaigns.find((c) => c.id === mode.campaignId);
      if (c) loadCampaignDraft(c);
    }
    if (mode.type === 'session') {
      const sessions = getSessionsForCampaign(mode.campaignId);
      const s = sessions.find((s) => s.id === mode.sessionId);
      if (s) loadSessionDraft(s);
    }
    if (mode.type === 'new-campaign' || mode.type === 'new-session') {
      setMode({ type: 'none' });
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const editorVisible = showEditor || (mode.type !== 'none');

  // ── Editor header label ───────────────────────────────────────────────────
  const editorTitle =
    mode.type === 'new-campaign' ? 'New Campaign' :
    mode.type === 'campaign' ? (activeCampaign?.name ?? 'Edit Campaign') :
    mode.type === 'new-session' ? 'New Session' :
    mode.type === 'session' ? `Session ${activeSession?.sessionNumber ?? ''}: ${activeSession?.name ?? ''}` :
    '';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-56px)] bg-stone-100 flex flex-col">

      {/* ── Campaign Management Mural Banner ──────────────────────────────── */}
      <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: '160px' }}>
        <svg
          viewBox="0 0 1200 160"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="campSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d0500"/>
              <stop offset="55%" stopColor="#2a1200"/>
              <stop offset="100%" stopColor="#472000"/>
            </linearGradient>
            <radialGradient id="campGlow" cx="50%" cy="20%" r="60%">
              <stop offset="0%" stopColor="#92400e" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#0d0500" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="campMoon" cx="78%" cy="18%" r="12%">
              <stop offset="0%" stopColor="#fde68a" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#0d0500" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="campFog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78350f" stopOpacity="0"/>
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.4"/>
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="1200" height="160" fill="url(#campSky)"/>
          <rect width="1200" height="160" fill="url(#campGlow)"/>
          <rect width="1200" height="160" fill="url(#campMoon)"/>

          {/* Stars */}
          <circle cx="40"   cy="10" r="1.3" fill="#fde68a" opacity="0.8"/>
          <circle cx="120"  cy="18" r="1"   fill="#fde68a" opacity="0.6"/>
          <circle cx="210"  cy="7"  r="1.5" fill="#fde68a" opacity="0.9"/>
          <circle cx="310"  cy="14" r="1.1" fill="#fde68a" opacity="0.7"/>
          <circle cx="440"  cy="9"  r="1.3" fill="#fde68a" opacity="0.8"/>
          <circle cx="520"  cy="22" r="1"   fill="#fde68a" opacity="0.6"/>
          <circle cx="680"  cy="8"  r="1.4" fill="#fde68a" opacity="0.9"/>
          <circle cx="760"  cy="19" r="1"   fill="#fde68a" opacity="0.5"/>
          <circle cx="930"  cy="6"  r="1.5" fill="#fde68a" opacity="0.8"/>
          <circle cx="1020" cy="15" r="1.1" fill="#fde68a" opacity="0.7"/>
          <circle cx="1140" cy="9"  r="1.3" fill="#fde68a" opacity="0.9"/>

          {/* Moon disc */}
          <circle cx="940" cy="28" r="16" fill="#fde68a" opacity="0.08"/>
          <circle cx="940" cy="28" r="11" fill="#fde68a" opacity="0.06"/>

          {/* Ground */}
          <rect x="0" y="128" width="1200" height="32" fill="#1a0800" opacity="0.85"/>
          {/* Fog */}
          <rect width="1200" height="160" fill="url(#campFog)" opacity="0.4"/>

          {/* ── Planning table with 3 figures (left) ─────────────────────── */}
          {/* Round table surface */}
          <ellipse cx="210" cy="115" rx="72" ry="20" fill="#1a0800" opacity="0.95"/>
          {/* Map on table (slightly lighter tint) */}
          <ellipse cx="210" cy="113" rx="60" ry="14" fill="#2a0e00" opacity="0.9"/>
          {/* Map detail lines */}
          <line x1="175" y1="113" x2="245" y2="113" stroke="#3d1400" strokeWidth="1" opacity="0.6"/>
          <line x1="210" y1="100" x2="210" y2="126" stroke="#3d1400" strokeWidth="1" opacity="0.6"/>
          <line x1="178" y1="106" x2="240" y2="120" stroke="#3d1400" strokeWidth="0.7" opacity="0.4"/>
          {/* Table base */}
          <rect x="207" y="128" width="6" height="10" fill="#1a0800"/>
          {/* Candle on table */}
          <rect x="222" y="104" width="4" height="9"  rx="1" fill="#1a0800"/>
          <circle cx="224" cy="103" r="4"  fill="#b45309" opacity="0.5"/>
          <circle cx="224" cy="102" r="2.5" fill="#fbbf24" opacity="0.65"/>
          <circle cx="224" cy="101" r="1.5" fill="#fde68a" opacity="0.85"/>

          {/* Figure 1 — left, standing, pointing at map */}
          <rect x="135" y="73" width="20" height="52" rx="3" fill="#1a0800"/>
          <ellipse cx="145" cy="66" rx="10" ry="10" fill="#1a0800"/>
          {/* Arm pointing to table */}
          <path d="M 155,88 L 175,110" stroke="#1a0800" strokeWidth="4" strokeLinecap="round"/>

          {/* Figure 2 — center, leaning over map */}
          <rect x="196" y="78" width="22" height="42" rx="3" fill="#1a0800"/>
          <ellipse cx="207" cy="71" rx="11" ry="10" fill="#1a0800"/>
          {/* Both arms on table */}
          <path d="M 200,90 L 192,110" stroke="#1a0800" strokeWidth="4" strokeLinecap="round"/>
          <path d="M 216,90 L 224,110" stroke="#1a0800" strokeWidth="4" strokeLinecap="round"/>

          {/* Figure 3 — right, cloaked, gesturing */}
          <path d="M 267,130 L 262,88 Q 260,76 272,72 L 286,72 Q 298,76 296,88 L 290,130 Z" fill="#1a0800"/>
          <ellipse cx="279" cy="65" rx="11" ry="10" fill="#1a0800"/>
          {/* Hood */}
          <path d="M 268,62 Q 272,52 279,54 Q 286,52 290,62" fill="#1a0800"/>
          {/* Arm gesturing down at map */}
          <path d="M 265,88 L 252,108" stroke="#1a0800" strokeWidth="4" strokeLinecap="round"/>

          {/* ── Flying Raven (center sky) ─────────────────────────────────── */}
          {/* Body */}
          <ellipse cx="598" cy="52" rx="18" ry="9" fill="#1a0800"/>
          {/* Head */}
          <ellipse cx="613" cy="48" rx="9" ry="8" fill="#1a0800"/>
          {/* Beak */}
          <path d="M 621,47 L 632,44 L 621,50 Z" fill="#1a0800"/>
          {/* Left wing spread up */}
          <path d="M 598,50 Q 570,22 545,38 Q 562,42 575,50" fill="#1a0800"/>
          {/* Right wing spread up */}
          <path d="M 598,50 Q 628,22 652,38 Q 636,42 622,50" fill="#1a0800"/>
          {/* Tail feathers */}
          <path d="M 581,58 L 568,72 L 576,66 L 566,78 L 577,70" stroke="#1a0800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

          {/* ── Castle (right) ────────────────────────────────────────────── */}
          {/* Main curtain wall */}
          <rect x="790" y="78" width="290" height="57" fill="#1a0800"/>

          {/* Left tower (taller) */}
          <rect x="778" y="45" width="58" height="90" rx="2" fill="#1a0800"/>
          {/* Left tower battlements */}
          <rect x="778" y="37" width="11" height="12" fill="#1a0800"/>
          <rect x="793" y="37" width="11" height="12" fill="#1a0800"/>
          <rect x="808" y="37" width="11" height="12" fill="#1a0800"/>
          <rect x="823" y="37" width="11" height="12" fill="#1a0800"/>

          {/* Right tower */}
          <rect x="1042" y="52" width="52" height="83" rx="2" fill="#1a0800"/>
          {/* Right tower battlements */}
          <rect x="1042" y="44" width="11" height="12" fill="#1a0800"/>
          <rect x="1057" y="44" width="11" height="12" fill="#1a0800"/>
          <rect x="1072" y="44" width="11" height="12" fill="#1a0800"/>
          <rect x="1087" y="44" width="11" height="12" fill="#1a0800"/>

          {/* Main wall battlements */}
          <rect x="850"  y="70" width="12" height="12" fill="#1a0800"/>
          <rect x="868"  y="70" width="12" height="12" fill="#1a0800"/>
          <rect x="886"  y="70" width="12" height="12" fill="#1a0800"/>
          <rect x="904"  y="70" width="12" height="12" fill="#1a0800"/>
          <rect x="922"  y="70" width="12" height="12" fill="#1a0800"/>
          <rect x="940"  y="70" width="12" height="12" fill="#1a0800"/>
          <rect x="958"  y="70" width="12" height="12" fill="#1a0800"/>
          <rect x="976"  y="70" width="12" height="12" fill="#1a0800"/>
          <rect x="994"  y="70" width="12" height="12" fill="#1a0800"/>
          <rect x="1012" y="70" width="12" height="12" fill="#1a0800"/>
          <rect x="1030" y="70" width="12" height="12" fill="#1a0800"/>

          {/* Gate arch */}
          <rect x="900" y="94" width="78" height="46" fill="#2d1400"/>
          <path d="M 900,94 Q 939,76 978,94" fill="#2d1400"/>
          {/* Portcullis bars vertical */}
          <line x1="914" y1="94" x2="914" y2="140" stroke="#1a0800" strokeWidth="2.5"/>
          <line x1="929" y1="94" x2="929" y2="140" stroke="#1a0800" strokeWidth="2.5"/>
          <line x1="944" y1="94" x2="944" y2="140" stroke="#1a0800" strokeWidth="2.5"/>
          <line x1="959" y1="94" x2="959" y2="140" stroke="#1a0800" strokeWidth="2.5"/>
          <line x1="974" y1="94" x2="974" y2="140" stroke="#1a0800" strokeWidth="2.5"/>
          {/* Portcullis bars horizontal */}
          <line x1="900" y1="108" x2="978" y2="108" stroke="#1a0800" strokeWidth="2"/>
          <line x1="900" y1="122" x2="978" y2="122" stroke="#1a0800" strokeWidth="2"/>

          {/* Left tower lit windows */}
          <rect x="792" y="58" width="10" height="13" rx="1" fill="#b45309" opacity="0.75"/>
          <rect x="808" y="58" width="10" height="13" rx="1" fill="#92400e" opacity="0.55"/>
          <rect x="792" y="80" width="10" height="13" rx="1" fill="#b45309" opacity="0.65"/>
          <rect x="808" y="80" width="10" height="13" rx="1" fill="#b45309" opacity="0.8"/>

          {/* Right tower lit windows */}
          <rect x="1053" y="62" width="10" height="13" rx="1" fill="#b45309" opacity="0.7"/>
          <rect x="1067" y="62" width="10" height="13" rx="1" fill="#92400e" opacity="0.5"/>
          <rect x="1053" y="82" width="10" height="13" rx="1" fill="#b45309" opacity="0.8"/>
          <rect x="1067" y="82" width="10" height="13" rx="1" fill="#b45309" opacity="0.5"/>

          {/* Main wall windows */}
          <rect x="856"  y="86" width="14" height="10" rx="1" fill="#b45309" opacity="0.5"/>
          <rect x="1008" y="86" width="14" height="10" rx="1" fill="#b45309" opacity="0.6"/>

          {/* Flag on left tower */}
          <line x1="808" y1="37" x2="808" y2="16" stroke="#1a0800" strokeWidth="2.5"/>
          <path d="M 808,16 L 828,23 L 808,30 Z" fill="#7f1d1d"/>

          {/* Flag on right tower */}
          <line x1="1062" y1="44" x2="1062" y2="23" stroke="#1a0800" strokeWidth="2.5"/>
          <path d="M 1062,23 L 1082,30 L 1062,37 Z" fill="#7f1d1d"/>
        </svg>

        {/* Title overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span
            className="text-amber-100 font-black text-3xl tracking-wide leading-tight"
            style={{ textShadow: '0 0 20px #92400e, 0 2px 8px #000, 0 0 40px #b45309' }}
          >
            🏰 Campaign Management
          </span>
          <span
            className="text-amber-300 text-sm font-semibold mt-1 tracking-widest uppercase"
            style={{ textShadow: '0 0 12px #92400e, 0 2px 4px #000' }}
          >
            D&D 4th Edition
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">

        {/* ── Left nav / tree panel ─────────────────────────────────────── */}
        <div className={[
          'flex flex-col bg-white border-r border-stone-200 flex-shrink-0',
          'w-full md:w-72',
          showEditor ? 'hidden md:flex' : 'flex',
        ].join(' ')}>

          {/* Panel header */}
          <div className="bg-amber-900 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <h2 className="text-white font-bold text-base">Campaigns</h2>
            <button
              onClick={startNewCampaign}
              className="text-xs bg-amber-600 hover:bg-amber-500 text-white font-semibold
                         px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
            >
              + New
            </button>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-y-auto">
            {campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
                <div className="text-5xl mb-4">🏰</div>
                <p className="text-stone-500 font-medium mb-1">No campaigns yet</p>
                <p className="text-stone-400 text-sm mb-5">Create your first campaign to get started.</p>
                <button
                  onClick={startNewCampaign}
                  className="bg-amber-700 hover:bg-amber-600 text-white font-semibold
                             px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  + New Campaign
                </button>
              </div>
            ) : (
              <ul>
                {campaigns.map((c) => {
                  const sessions = getSessionsForCampaign(c.id);
                  const isExpanded = expandedIds.has(c.id);
                  const isCampaignSelected = (mode.type === 'campaign' && mode.campaignId === c.id) ||
                    (mode.type === 'new-campaign');

                  return (
                    <li key={c.id} className="border-b border-stone-100 last:border-0">
                      {/* Campaign row */}
                      <div className={[
                        'flex items-center group',
                        isCampaignSelected ? 'bg-amber-50' : 'hover:bg-stone-50',
                      ].join(' ')}>
                        {/* Expand/collapse chevron */}
                        <button
                          onClick={(e) => toggleExpand(c.id, e)}
                          className="flex-shrink-0 w-9 h-10 flex items-center justify-center
                                     text-stone-400 hover:text-amber-700 transition-colors"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          <svg
                            className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                  d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Campaign name button */}
                        <button
                          onClick={() => selectCampaign(c)}
                          className={[
                            'flex-1 text-left py-2.5 pr-3 min-h-[44px] flex flex-col justify-center',
                          ].join(' ')}
                        >
                          <span className={`text-sm font-semibold truncate leading-tight
                            ${isCampaignSelected ? 'text-amber-800' : 'text-stone-700'}`}>
                            🏰 {c.name}
                          </span>
                          <span className="text-xs text-stone-400 mt-0.5">
                            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                            {c.sharedCampaignId
                              ? ' · 🌐 shared'
                              : ` · ${c.characterIds.length} char${c.characterIds.length !== 1 ? 's' : ''}`
                            }
                          </span>
                        </button>
                      </div>

                      {/* Sessions subtree */}
                      {isExpanded && (
                        <ul className="bg-stone-50 border-t border-stone-100">
                          {sessions.length === 0 ? (
                            <li className="px-4 py-2 text-xs text-stone-400 italic pl-9">
                              No sessions yet
                            </li>
                          ) : (
                            sessions.map((s) => {
                              const isSessionSelected = mode.type === 'session' && mode.sessionId === s.id;
                              return (
                                <li key={s.id}>
                                  <button
                                    onClick={() => selectSession(c.id, s)}
                                    className={[
                                      'w-full text-left pl-9 pr-3 py-2 flex items-center gap-2',
                                      'min-h-[40px] transition-colors border-l-2',
                                      isSessionSelected
                                        ? 'bg-amber-100 border-amber-500 text-amber-800'
                                        : 'border-transparent hover:bg-stone-100 text-stone-600',
                                    ].join(' ')}
                                  >
                                    <span className="text-xs flex-shrink-0 font-bold tabular-nums
                                                     bg-stone-200 text-stone-500 rounded px-1.5 py-0.5
                                                     leading-none">
                                      #{s.sessionNumber}
                                    </span>
                                    <span className="text-xs font-medium truncate">{s.name}</span>
                                  </button>
                                </li>
                              );
                            })
                          )}

                          {/* Add Session row */}
                          <li>
                            <button
                              onClick={() => startNewSession(c.id)}
                              className="w-full text-left pl-9 pr-3 py-2 min-h-[40px]
                                         text-xs text-amber-700 hover:text-amber-600 font-semibold
                                         hover:bg-amber-50 transition-colors flex items-center gap-1.5"
                            >
                              <span className="text-base leading-none">+</span>
                              <span>Add Session</span>
                            </button>
                          </li>
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* ── Shared Campaigns ───────────────────────────────────────── */}
          {profile && (
            <div className="border-t border-stone-200 flex-shrink-0">
              <div className="bg-indigo-900 px-4 py-3 flex items-center justify-between">
                <h2 className="text-white font-bold text-base">Shared Campaigns</h2>
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="text-indigo-200 hover:text-white text-xs font-semibold
                             bg-indigo-700 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors min-h-[36px]"
                >
                  Join
                </button>
              </div>
              <div className="overflow-y-auto max-h-48">
                {(() => {
                  // Only show campaigns where user is a player (not the DM) — DM campaigns show in the local list
                  const playerCampaigns = sharedCampaigns.filter((sc) => sc.created_by !== user?.id);
                  return playerCampaigns.length === 0 ? (
                  <div className="px-4 py-4 text-center">
                    <p className="text-stone-400 text-xs">No shared campaigns joined yet</p>
                  </div>
                ) : (
                  <ul>
                    {playerCampaigns.map((sc) => (
                      <li key={sc.id}>
                        <button
                          onClick={() => { setMode({ type: 'shared-campaign', sharedCampaignId: sc.id }); setShowEditor(true); }}
                          className={[
                            'w-full text-left px-4 py-3 text-sm border-b border-stone-100 transition-colors min-h-[44px]',
                            mode.type === 'shared-campaign' && mode.sharedCampaignId === sc.id
                              ? 'bg-indigo-50 text-indigo-800 font-semibold'
                              : 'text-stone-700 hover:bg-stone-50',
                          ].join(' ')}
                        >
                          <span className="text-indigo-500 mr-1">🌐</span> {sc.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* ── Editor panel ──────────────────────────────────────────────── */}
        <div className={[
          'flex-1 flex flex-col overflow-hidden',
          showEditor ? 'flex' : 'hidden md:flex',
        ].join(' ')}>

          {/* Nothing selected yet (desktop) */}
{/* Shared campaign view */}          {mode.type === 'shared-campaign' && (            <div className="flex-1 overflow-y-auto">              <SharedCampaignView campaignId={mode.sharedCampaignId} />            </div>          )}
          {mode.type === 'none' && (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center px-8">
              <div className="text-6xl mb-4">🏰</div>
              <h3 className="text-stone-600 font-semibold text-lg mb-2">Select a Campaign</h3>
              <p className="text-stone-400 text-sm mb-6">
                Choose a campaign or session from the list, or create a new campaign to get started.
              </p>
              <button
                onClick={startNewCampaign}
                className="bg-amber-700 hover:bg-amber-600 text-white font-semibold
                           px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                + New Campaign
              </button>
            </div>
          )}

          {/* ── Campaign editor ──────────────────────────────────────────── */}
          {(mode.type === 'campaign' || mode.type === 'new-campaign') && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="bg-amber-900 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <button onClick={handleBack}
                  className="md:hidden text-amber-200 hover:text-white transition-colors
                             min-h-[44px] min-w-[44px] flex items-center justify-center -ml-1 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-white font-bold text-base flex-1 truncate">{editorTitle}</h2>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {mode.type === 'campaign' && activeCampaign && (
                    <button
                      onClick={() => setPendingDelete({ kind: 'campaign', id: activeCampaign.id })}
                      className="text-xs text-red-300 hover:text-red-100 font-semibold px-2.5 py-1.5
                                 rounded-lg hover:bg-red-900/40 transition-colors min-h-[36px]"
                    >Delete</button>
                  )}
                  {mode.type === 'campaign' && activeCampaign && profile && (
                    <button
                      onClick={handleShareOnline}
                      className="text-xs text-indigo-200 hover:text-white font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 transition-colors min-h-[36px]"
                    >🌐 Share Campaign</button>
                  )}
                  <button
                    onClick={handleSaveCampaign}
                    disabled={campaignSaving || !isCampaignDirty}
                    className={[
                      'text-xs font-bold px-4 py-1.5 rounded-lg transition-colors min-h-[36px]',
                      isCampaignDirty && !campaignSaving
                        ? 'bg-amber-500 hover:bg-amber-400 text-white'
                        : 'bg-amber-800 text-amber-500/60 cursor-not-allowed',
                    ].join(' ')}
                  >{campaignSaving ? 'Saving…' : 'Save'}</button>
                </div>
              </div>

              {campaignError && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-red-600 text-sm">
                  {campaignError}
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

                  {/* Name */}
                  <section>
                    <label className={labelCls}>Campaign Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={campaignDraft.name}
                      onChange={(e) => setCampaignDraft((d) => ({ ...d, name: e.target.value }))}
                      placeholder="e.g. The Fall of Nerath"
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-base font-semibold
                                 text-stone-800 outline-none focus:border-amber-500 focus:ring-2
                                 focus:ring-amber-200 transition-colors placeholder:font-normal placeholder:text-stone-400"
                    />
                  </section>

                  {/* Notes edit/read toggle */}
                  <div className="flex items-center justify-between">
                    <label className={labelCls}>Campaign Notes</label>
                    <button
                      onClick={() => setEditingNotes(!editingNotes)}
                      className={[
                        'px-4 py-2 rounded-lg text-sm font-bold min-h-[44px] transition-colors',
                        editingNotes
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-amber-600 text-white hover:bg-amber-700',
                      ].join(' ')}
                    >
                      {editingNotes ? 'Done Editing' : 'Edit Notes'}
                    </button>
                  </div>

                  {/* Description */}
                  <section>
                    <label className={labelCls}>Description</label>
                    <p className={hintCls}>DM-facing notes — world details, plot hooks, campaign overview.</p>
                    {editingNotes ? (
                      <RichTextEditor
                        content={campaignDraft.description}
                        onChange={(html) => setCampaignDraft((d) => ({ ...d, description: html }))}
                        placeholder="Describe your campaign setting, ongoing story, or DM reminders…"
                      />
                    ) : (
                      <div className="border border-stone-200 rounded-xl bg-white px-4 py-3 min-h-[60px]">
                        <RichTextDisplay content={campaignDraft.description} />
                      </div>
                    )}
                  </section>

                  {/* Private Notes (DM only) */}
                  <section>
                    <label className={labelCls}>Private Notes (DM Only)</label>
                    <p className={hintCls}>Only you can see these — session prep, secret plot details, NPC motivations.</p>
                    {editingNotes ? (
                      <RichTextEditor
                        content={campaignDraft.privateNotes}
                        onChange={(html) => setCampaignDraft((d) => ({ ...d, privateNotes: html }))}
                        placeholder="Secret plots, NPC motivations, upcoming encounters…"
                      />
                    ) : (
                      <div className="border border-stone-200 rounded-xl bg-white px-4 py-3 min-h-[60px]">
                        <RichTextDisplay content={campaignDraft.privateNotes} />
                      </div>
                    )}
                  </section>

                  {/* Public Notes */}
                  <section>
                    <label className={labelCls}>Public Notes for Players</label>
                    <p className={hintCls}>Information shared with your players — handouts, lore, house rules.</p>
                    {editingNotes ? (
                      <RichTextEditor
                        content={campaignDraft.publicNotes}
                        onChange={(html) => setCampaignDraft((d) => ({ ...d, publicNotes: html }))}
                        placeholder="House rules, world lore, quest hooks the players know about…"
                      />
                    ) : (
                      <div className="border border-stone-200 rounded-xl bg-white px-4 py-3 min-h-[60px]">
                        <RichTextDisplay content={campaignDraft.publicNotes} />
                      </div>
                    )}
                  </section>

                  {/* Characters */}
                  <section>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={labelCls}>Characters</p>
                        <p className={hintCls}>
                          {campaignDraft.characterIds.length} character{campaignDraft.characterIds.length !== 1 ? 's' : ''} in this campaign
                        </p>
                      </div>
                      <button
                        onClick={() => { setCharSearch(''); setShowCharPicker(true); }}
                        className="text-xs bg-amber-700 hover:bg-amber-600 text-white font-semibold
                                   px-3 py-2 rounded-lg transition-colors min-h-[36px]"
                      >+ Add Character</button>
                    </div>

                    {campaignDraft.characterIds.length === 0 ? (
                      <div className="border-2 border-dashed border-stone-200 rounded-xl py-8 text-center">
                        <p className="text-stone-400 text-sm mb-3">No characters added yet.</p>
                        <button
                          onClick={() => { setCharSearch(''); setShowCharPicker(true); }}
                          className="text-xs text-amber-700 hover:text-amber-600 font-semibold
                                     underline underline-offset-2 transition-colors"
                        >Add your first character →</button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {campaignDraft.characterIds.map((charId) => {
                          const char = characters.find((c) => c.id === charId);
                          if (!char) return (
                            <div key={charId} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                              <span className="text-xs text-stone-400 italic flex-1">
                                Character not found (ID: {charId.slice(0, 8)}…)
                              </span>
                              <button
                                onClick={() => setCampaignDraft((d) => ({ ...d, characterIds: d.characterIds.filter((id) => id !== charId) }))}
                                className="text-red-400 hover:text-red-600 text-lg leading-none w-8 h-8
                                           flex items-center justify-center rounded hover:bg-red-50 transition-colors"
                              >×</button>
                            </div>
                          );
                          const race = getRaceById(char.raceId);
                          const cls  = getClassById(char.classId);
                          return (
                            <div key={charId} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 shadow-sm">
                              {charAvatar(char.portrait, cls?.role)}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-stone-800 truncate">{char.name}</p>
                                <p className="text-xs text-stone-400">Lv {char.level} · {race?.name} {cls?.name}</p>
                              </div>
                              <button
                                onClick={() => navigate('sheet', char.id)}
                                className="text-xs text-amber-700 hover:text-amber-600 font-medium px-2 py-1 rounded transition-colors"
                              >Sheet</button>
                              <button
                                onClick={() => setCampaignDraft((d) => ({ ...d, characterIds: d.characterIds.filter((id) => id !== charId) }))}
                                className="text-red-400 hover:text-red-600 text-lg leading-none w-8 h-8
                                           flex items-center justify-center rounded hover:bg-red-50 transition-colors"
                                title="Remove from campaign"
                              >×</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {/* Party Roster (Online) — only visible when campaign is shared */}
                  {activeCampaign?.sharedCampaignId && (
                    <section>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className={labelCls}>Party Roster (Online)</p>
                          <p className={hintCls}>
                            {activeCampaignMembers.length} member{activeCampaignMembers.length !== 1 ? 's' : ''} connected via invite code
                          </p>
                        </div>
                        {(() => {
                          const sc = sharedCampaigns.find((s) => s.id === activeCampaign.sharedCampaignId);
                          return sc ? (
                            <span className="text-xs font-mono text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
                              Code: {sc.invite_code}
                            </span>
                          ) : null;
                        })()}
                      </div>

                      {activeCampaignMembers.length === 0 ? (
                        <div className="border-2 border-dashed border-indigo-200 rounded-xl py-6 text-center">
                          <p className="text-stone-400 text-sm">No players have joined yet</p>
                          <p className="text-stone-300 text-xs mt-1">Share the invite code with your players</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {activeCampaignMembers.map((member) => {
                            const summary = activeCampaignSummaries.find((s) => s.user_id === member.user_id);
                            return (
                              <MemberCard
                                key={member.id}
                                member={member}
                                summary={summary || null}
                                isDm={member.role === 'dm'}
                                isCurrentUser={member.user_id === user?.id}
                                onCharacterClick={handleDmCharacterClick}
                                onLinkClick={member.user_id === user?.id ? () => setShowDmLinkModal(true) : undefined}
                              />
                            );
                          })}
                        </div>
                      )}

                      {/* DM link/unlink actions */}
                      {dmCharacterSummary && (
                        <button
                          onClick={handleDmUnlink}
                          className="mt-3 text-xs text-stone-400 hover:text-red-600 transition-colors"
                        >
                          Unlink your character
                        </button>
                      )}
                    </section>
                  )}

                  <div className="h-6" />
                </div>
              </div>
            </div>
          )}

          {/* ── Initiative Tracker ─────────────────────────────────────── */}
          {activeEncounterId && activeEncounter && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="bg-teal-900 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <button onClick={handleCloseTracker}
                  className="text-teal-200 hover:text-white transition-colors
                             min-h-[44px] min-w-[44px] flex items-center justify-center -ml-1 flex-shrink-0"
                  title="Back to session"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-teal-300 text-xs font-medium truncate">Initiative Tracker</p>
                  <h2 className="text-white font-bold text-base truncate">{activeEncounter.title}</h2>
                </div>
                <button
                  onClick={handleSaveEncounterState}
                  className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-colors min-h-[36px]
                             border-2 ${saveConfirm
                               ? 'border-emerald-400 bg-emerald-600 text-white'
                               : 'border-teal-400 bg-transparent hover:bg-teal-700 text-teal-100'}`}
                >{saveConfirm ? '✓ Saved' : '💾 Save'}</button>
                <button
                  onClick={handleEndEncounter}
                  className="text-xs font-bold px-4 py-1.5 rounded-lg transition-colors min-h-[36px]
                             bg-teal-700 hover:bg-teal-600 text-white"
                >End Encounter</button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

                  {/* ── Initiative Table ──────────────────────────────── */}
                  <section>
                    <div className="flex items-center justify-between mb-2">
                      <label className={labelCls}>Initiative Order</label>
                      {sortedInitiative.length > 0 && (
                        <button
                          onClick={handleNextTurn}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg
                                     bg-teal-700 hover:bg-teal-600 text-white transition-colors min-h-[32px]"
                        >Next Turn →</button>
                      )}
                    </div>

                    {sortedInitiative.length === 0 ? (
                      <div className="border-2 border-dashed border-stone-200 rounded-xl py-8 text-center">
                        <p className="text-stone-400 text-sm">
                          No combatants yet — add monsters and PCs from the pool below.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {sortedInitiative.map((entry, idx) => {
                          const isActive = idx === activeTurnIndex;
                          const hpPct = entry.maxHp > 0 ? Math.round((entry.hp / entry.maxHp) * 100) : 0;
                          const hpColor = hpPct > 50 ? 'text-emerald-700' : hpPct > 25 ? 'text-amber-700' : 'text-red-700';
                          const monster = entry.type === 'monster' && entry.monsterId ? getMonsterById(entry.monsterId) : null;
                          const pc = entry.type === 'pc' && entry.characterId ? characters.find((c) => c.id === entry.characterId) : null;
                          const cls = pc ? getClassById(pc.classId) : null;

                          return (
                            <div key={entry.id}
                              className={[
                                'flex items-center gap-2 p-2.5 rounded-xl border transition-colors',
                                isActive
                                  ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-200'
                                  : 'bg-white border-stone-200',
                                entry.hp <= 0 ? 'opacity-50' : '',
                              ].join(' ')}
                            >
                              {/* Initiative number */}
                              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-100 text-teal-800
                                               font-bold text-sm flex items-center justify-center">
                                {entry.initiative}
                              </span>

                              {/* Avatar / role badge */}
                              {entry.type === 'monster' && monster ? (
                                <span className={[
                                  'flex-shrink-0 px-1.5 py-0.5 rounded-full text-xs font-bold',
                                  monsterRoleCls(monster.role),
                                ].join(' ')}>
                                  {monster.roleModifier ? monster.roleModifier[0] : monster.role[0]}
                                </span>
                              ) : (
                                charAvatar(pc?.portrait, cls?.role)
                              )}

                              {/* Name */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-stone-800 truncate">
                                  {entry.displayName}
                                  {isActive && <span className="ml-1.5 text-teal-600 text-xs font-bold">← TURN</span>}
                                </p>
                                {entry.hp <= 0 && (
                                  <p className="text-xs text-red-500 font-medium">Unconscious / Defeated</p>
                                )}
                              </div>

                              {/* HP controls */}
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => handleHpChange(entry.id, -1)}
                                  className="w-8 h-8 rounded-md bg-red-100 hover:bg-red-200
                                             text-red-700 text-sm font-bold transition-colors min-h-[32px]"
                                >−</button>
                                <span className={`text-xs font-bold tabular-nums min-w-[3.5rem] text-center ${hpColor}`}>
                                  {entry.hp}/{entry.maxHp}
                                </span>
                                <input
                                  type="number"
                                  min="1"
                                  value={hpAmounts[entry.id] ?? ''}
                                  onChange={(e) => setHpAmounts((prev) => ({ ...prev, [entry.id]: e.target.value }))}
                                  placeholder="1"
                                  className="w-12 h-8 rounded-md border border-stone-300 text-center text-xs font-semibold
                                             text-stone-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200
                                             placeholder:text-stone-300 [appearance:textfield]
                                             [&::-webkit-inner-spin-button]:appearance-none
                                             [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <button
                                  onClick={() => handleHpChange(entry.id, 1)}
                                  className="w-8 h-8 rounded-md bg-emerald-100 hover:bg-emerald-200
                                             text-emerald-700 text-sm font-bold transition-colors min-h-[32px]"
                                >+</button>
                              </div>

                              {/* Remove */}
                              <button
                                onClick={() => handleRemoveFromInitiative(entry.id, entry.instanceKey)}
                                className="text-stone-300 hover:text-red-400 text-lg leading-none
                                           flex-shrink-0 transition-colors w-7 h-7 flex items-center justify-center"
                                title="Remove from initiative"
                              >×</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {/* ── Combatant Pool: Monsters ─────────────────────── */}
                  <section>
                    <label className={labelCls}>Monsters</label>
                    <p className="text-xs text-stone-400 mb-2">Click "Add" to enter initiative and HP, then add to the table.</p>
                    {monsterPool.length === 0 ? (
                      <p className="text-sm text-stone-400 italic text-center py-4
                                    bg-stone-50 rounded-xl border border-stone-200">
                        No monsters in this encounter.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {monsterPool.map((mp) => {
                          const isAdded = addedInstanceKeys.has(mp.instanceKey);
                          const isPrompting = addingCombatant?.instanceKey === mp.instanceKey;

                          return (
                            <div key={mp.instanceKey}>
                              <div className={[
                                'flex items-center gap-2 p-2.5 rounded-xl border transition-colors',
                                isAdded ? 'bg-stone-50 border-stone-100 opacity-50' : 'bg-white border-stone-200',
                              ].join(' ')}>
                                <span className={[
                                  'flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold',
                                  monsterRoleCls(mp.monster.role),
                                ].join(' ')}>
                                  {mp.monster.roleModifier
                                    ? `${mp.monster.roleModifier[0]}`
                                    : mp.monster.role[0]}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-stone-800 truncate">{mp.displayName}</p>
                                  <p className="text-xs text-stone-400">
                                    Lv {mp.monster.level} · {mp.monster.hp} HP · {mp.monster.xp} XP
                                  </p>
                                </div>
                                {!isAdded && !isPrompting && (
                                  <button
                                    onClick={() => handleBeginAdd({
                                      type: 'monster',
                                      monsterId: mp.monsterId,
                                      displayName: mp.displayName,
                                      defaultHp: mp.monster.hp,
                                      instanceKey: mp.instanceKey,
                                    })}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg
                                               bg-teal-700 hover:bg-teal-600 text-white transition-colors
                                               flex-shrink-0 min-h-[32px]"
                                  >Add</button>
                                )}
                                {isAdded && (
                                  <span className="text-xs text-stone-400 font-medium flex-shrink-0">Added</span>
                                )}
                              </div>

                              {/* Inline add prompt */}
                              {isPrompting && (
                                <div className="ml-4 mt-1.5 p-3 bg-teal-50 border border-teal-200 rounded-xl
                                                flex items-center gap-3 flex-wrap">
                                  <div className="flex items-center gap-1.5">
                                    <label className="text-xs font-bold text-teal-800">Init:</label>
                                    <input
                                      type="number"
                                      value={promptInit}
                                      onChange={(e) => setPromptInit(e.target.value)}
                                      className="w-16 border border-teal-300 rounded-lg px-2 py-1.5 text-sm
                                                 text-center font-bold outline-none focus:border-teal-500
                                                 focus:ring-2 focus:ring-teal-200"
                                      placeholder="#"
                                      autoFocus
                                    />
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <label className="text-xs font-bold text-teal-800">HP:</label>
                                    <input
                                      type="number"
                                      value={promptHp}
                                      onChange={(e) => setPromptHp(e.target.value)}
                                      className="w-20 border border-teal-300 rounded-lg px-2 py-1.5 text-sm
                                                 text-center font-bold outline-none focus:border-teal-500
                                                 focus:ring-2 focus:ring-teal-200"
                                    />
                                  </div>
                                  <button
                                    onClick={handleConfirmAdd}
                                    disabled={promptInit === ''}
                                    className={[
                                      'text-xs font-bold px-3 py-1.5 rounded-lg transition-colors min-h-[32px]',
                                      promptInit !== ''
                                        ? 'bg-teal-700 hover:bg-teal-600 text-white'
                                        : 'bg-teal-200 text-teal-400 cursor-not-allowed',
                                    ].join(' ')}
                                  >Confirm</button>
                                  <button
                                    onClick={() => setAddingCombatant(null)}
                                    className="text-xs text-stone-500 hover:text-stone-700 font-medium
                                               transition-colors"
                                  >Cancel</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Ad-hoc monsters (added from compendium during combat) */}
                    {adHocMonsters.length > 0 && (
                      <div className="space-y-1.5 mt-2">
                        <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Ad-hoc Additions</p>
                        {adHocMonsters.map((am) => {
                          const isAdded = addedInstanceKeys.has(am.instanceKey);
                          const isPrompting = addingCombatant?.instanceKey === am.instanceKey;

                          return (
                            <div key={am.instanceKey}>
                              <div className={[
                                'flex items-center gap-2 p-2.5 rounded-xl border transition-colors',
                                isAdded ? 'bg-stone-50 border-stone-100 opacity-50' : 'bg-white border-stone-200',
                              ].join(' ')}>
                                <span className={[
                                  'flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold',
                                  monsterRoleCls(am.monster.role),
                                ].join(' ')}>
                                  {am.monster.roleModifier
                                    ? am.monster.roleModifier[0]
                                    : am.monster.role[0]}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-stone-800 truncate">{am.displayName}</p>
                                  <p className="text-xs text-stone-400">
                                    Lv {am.monster.level} · {am.monster.hp} HP · {am.monster.xp} XP
                                  </p>
                                </div>
                                {!isAdded && !isPrompting && (
                                  <button
                                    onClick={() => handleBeginAdd({
                                      type: 'monster',
                                      monsterId: am.monsterId,
                                      displayName: am.displayName,
                                      defaultHp: am.monster.hp,
                                      instanceKey: am.instanceKey,
                                    })}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg
                                               bg-teal-700 hover:bg-teal-600 text-white transition-colors
                                               flex-shrink-0 min-h-[32px]"
                                  >Add</button>
                                )}
                                {isAdded && (
                                  <span className="text-xs text-stone-400 font-medium flex-shrink-0">Added</span>
                                )}
                              </div>

                              {/* Inline add prompt */}
                              {isPrompting && (
                                <div className="ml-4 mt-1.5 p-3 bg-teal-50 border border-teal-200 rounded-xl
                                                flex items-center gap-3 flex-wrap">
                                  <div className="flex items-center gap-1.5">
                                    <label className="text-xs font-bold text-teal-800">Init:</label>
                                    <input
                                      type="number"
                                      value={promptInit}
                                      onChange={(e) => setPromptInit(e.target.value)}
                                      className="w-16 border border-teal-300 rounded-lg px-2 py-1.5 text-sm
                                                 text-center font-bold outline-none focus:border-teal-500
                                                 focus:ring-2 focus:ring-teal-200"
                                      placeholder="#"
                                      autoFocus
                                    />
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <label className="text-xs font-bold text-teal-800">HP:</label>
                                    <input
                                      type="number"
                                      value={promptHp}
                                      onChange={(e) => setPromptHp(e.target.value)}
                                      className="w-20 border border-teal-300 rounded-lg px-2 py-1.5 text-sm
                                                 text-center font-bold outline-none focus:border-teal-500
                                                 focus:ring-2 focus:ring-teal-200"
                                    />
                                  </div>
                                  <button
                                    onClick={handleConfirmAdd}
                                    disabled={promptInit === ''}
                                    className={[
                                      'text-xs font-bold px-3 py-1.5 rounded-lg transition-colors min-h-[32px]',
                                      promptInit !== ''
                                        ? 'bg-teal-700 hover:bg-teal-600 text-white'
                                        : 'bg-teal-200 text-teal-400 cursor-not-allowed',
                                    ].join(' ')}
                                  >Confirm</button>
                                  <button
                                    onClick={() => setAddingCombatant(null)}
                                    className="text-xs text-stone-500 hover:text-stone-700 font-medium
                                               transition-colors"
                                  >Cancel</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add monster from compendium button */}
                    <button
                      onClick={() => {
                        setMonsterPickerForInitiative(true);
                        setMonsterSearch('');
                        setShowMonsterPicker(true);
                      }}
                      className="w-full mt-2 text-xs font-semibold text-teal-700 border border-teal-200
                                 border-dashed rounded-lg py-2 hover:bg-teal-50 transition-colors"
                    >
                      ＋ Add Monster from Compendium
                    </button>
                  </section>

                  {/* ── Combatant Pool: Player Characters ────────────── */}
                  <section>
                    <label className={labelCls}>Player Characters</label>
                    {pcPool.length === 0 ? (
                      <p className="text-sm text-stone-400 italic text-center py-4
                                    bg-stone-50 rounded-xl border border-stone-200">
                        No characters in this campaign.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {pcPool.map((char) => {
                          const race = getRaceById(char.raceId);
                          const cls  = getClassById(char.classId);
                          const instanceKey = `pc-${char.id}`;
                          const isAdded = addedInstanceKeys.has(instanceKey);
                          const isPrompting = addingCombatant?.instanceKey === instanceKey;

                          return (
                            <div key={char.id}>
                              <div className={[
                                'flex items-center gap-3 p-2.5 rounded-xl border transition-colors',
                                isAdded ? 'bg-stone-50 border-stone-100 opacity-50' : 'bg-white border-stone-200',
                              ].join(' ')}>
                                {charAvatar(char.portrait, cls?.role)}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-stone-800 truncate">{char.name}</p>
                                  <p className="text-xs text-stone-400">
                                    Lv {char.level} · {race?.name} {cls?.name} · HP: {char.currentHp}
                                  </p>
                                </div>
                                {!isAdded && !isPrompting && (
                                  <button
                                    onClick={() => handleBeginAdd({
                                      type: 'pc',
                                      characterId: char.id,
                                      displayName: char.name,
                                      defaultHp: char.currentHp,
                                      instanceKey,
                                    })}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg
                                               bg-teal-700 hover:bg-teal-600 text-white transition-colors
                                               flex-shrink-0 min-h-[32px]"
                                  >Add</button>
                                )}
                                {isAdded && (
                                  <span className="text-xs text-stone-400 font-medium flex-shrink-0">Added</span>
                                )}
                              </div>

                              {/* Inline add prompt */}
                              {isPrompting && (
                                <div className="ml-4 mt-1.5 p-3 bg-teal-50 border border-teal-200 rounded-xl
                                                flex items-center gap-3 flex-wrap">
                                  <div className="flex items-center gap-1.5">
                                    <label className="text-xs font-bold text-teal-800">Init:</label>
                                    <input
                                      type="number"
                                      value={promptInit}
                                      onChange={(e) => setPromptInit(e.target.value)}
                                      className="w-16 border border-teal-300 rounded-lg px-2 py-1.5 text-sm
                                                 text-center font-bold outline-none focus:border-teal-500
                                                 focus:ring-2 focus:ring-teal-200"
                                      placeholder="#"
                                      autoFocus
                                    />
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <label className="text-xs font-bold text-teal-800">HP:</label>
                                    <input
                                      type="number"
                                      value={promptHp}
                                      onChange={(e) => setPromptHp(e.target.value)}
                                      className="w-20 border border-teal-300 rounded-lg px-2 py-1.5 text-sm
                                                 text-center font-bold outline-none focus:border-teal-500
                                                 focus:ring-2 focus:ring-teal-200"
                                    />
                                  </div>
                                  <button
                                    onClick={handleConfirmAdd}
                                    disabled={promptInit === ''}
                                    className={[
                                      'text-xs font-bold px-3 py-1.5 rounded-lg transition-colors min-h-[32px]',
                                      promptInit !== ''
                                        ? 'bg-teal-700 hover:bg-teal-600 text-white'
                                        : 'bg-teal-200 text-teal-400 cursor-not-allowed',
                                    ].join(' ')}
                                  >Confirm</button>
                                  <button
                                    onClick={() => setAddingCombatant(null)}
                                    className="text-xs text-stone-500 hover:text-stone-700 font-medium
                                               transition-colors"
                                  >Cancel</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  <div className="h-6" />
                </div>
              </div>
            </div>
          )}

          {/* ── Session editor ───────────────────────────────────────────── */}
          {!activeEncounterId && (mode.type === 'session' || mode.type === 'new-session') && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="bg-amber-900 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <button onClick={handleBack}
                  className="md:hidden text-amber-200 hover:text-white transition-colors
                             min-h-[44px] min-w-[44px] flex items-center justify-center -ml-1 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-amber-300 text-xs font-medium truncate">
                    📖 Campaign Journal · {activeCampaign?.name}
                  </p>
                  <h2 className="text-white font-bold text-base truncate">{editorTitle}</h2>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {mode.type === 'session' && activeSession && (
                    <button
                      onClick={() => setPendingDelete({ kind: 'session', id: activeSession.id, campaignId: mode.campaignId })}
                      className="text-xs text-red-300 hover:text-red-100 font-semibold px-2.5 py-1.5
                                 rounded-lg hover:bg-red-900/40 transition-colors min-h-[36px]"
                    >Delete</button>
                  )}
                  <button
                    onClick={handleSaveSession}
                    disabled={sessionSaving || !isSessionDirty}
                    className={[
                      'text-xs font-bold px-4 py-1.5 rounded-lg transition-colors min-h-[36px]',
                      isSessionDirty && !sessionSaving
                        ? 'bg-amber-500 hover:bg-amber-400 text-white'
                        : 'bg-amber-800 text-amber-500/60 cursor-not-allowed',
                    ].join(' ')}
                  >{sessionSaving ? 'Saving…' : 'Save'}</button>
                </div>
              </div>

              {sessionError && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-red-600 text-sm">
                  {sessionError}
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

                  {/* Session number + name row */}
                  <section>
                    <div className="flex gap-3">
                      <div className="w-28 flex-shrink-0">
                        <label className={labelCls}>Session #</label>
                        <input
                          type="number"
                          min={0}
                          value={sessionDraft.sessionNumber}
                          onChange={(e) => setSessionDraft((d) => ({ ...d, sessionNumber: Math.max(0, parseInt(e.target.value) || 0) }))}
                          className="w-full border border-stone-300 rounded-xl px-3 py-3 text-sm text-stone-700
                                     outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                                     transition-colors text-center font-bold"
                        />
                      </div>
                      <div className="flex-1">
                        <label className={labelCls}>Session Name <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          value={sessionDraft.name}
                          onChange={(e) => setSessionDraft((d) => ({ ...d, name: e.target.value }))}
                          placeholder="e.g. Into the Dungeon"
                          className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm font-semibold
                                     text-stone-800 outline-none focus:border-amber-500 focus:ring-2
                                     focus:ring-amber-200 transition-colors placeholder:font-normal placeholder:text-stone-400"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Date */}
                  <section>
                    <label className={labelCls}>Session Date</label>
                    <input
                      type="date"
                      value={sessionDraft.date}
                      onChange={(e) => setSessionDraft((d) => ({ ...d, date: e.target.value }))}
                      className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-700
                                 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
                                 transition-colors"
                    />
                  </section>

                  {/* Important Events */}
                  <section>
                    <label className={labelCls}>Important Events from Previous Sessions</label>
                    <p className={hintCls}>
                      Context carried forward — what happened that may have bearing on this session.
                    </p>
                    <textarea
                      value={sessionDraft.importantEvents}
                      onChange={(e) => setSessionDraft((d) => ({ ...d, importantEvents: e.target.value }))}
                      placeholder="The party defeated the goblin king in Session 3. The mysterious hooded figure escaped…"
                      rows={6} className={fieldCls}
                    />
                  </section>

                  {/* Planned Summary */}
                  <section>
                    <label className={labelCls}>Planned Summary</label>
                    <p className={hintCls}>
                      Brief overview of what you intend to run — encounters, NPCs, objectives.
                    </p>
                    <textarea
                      value={sessionDraft.plannedSummary}
                      onChange={(e) => setSessionDraft((d) => ({ ...d, plannedSummary: e.target.value }))}
                      placeholder="The party will arrive at the city of Fallcrest. Key encounter: ambush at the bridge. NPC: Lord Warden Faren Markelhay…"
                      rows={6} className={fieldCls}
                    />
                  </section>

                  {/* Session Encounters */}
                  <section>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <label className={labelCls}>Session Encounters</label>
                        <p className={hintCls}>
                          Plan combat or skill challenge encounters. Add monsters from the compendium.
                        </p>
                      </div>
                      {mode.type === 'session' && (
                        <button
                          onClick={handleAddEncounter}
                          className="flex-shrink-0 text-xs font-semibold px-3 py-2 rounded-lg
                                     bg-amber-700 hover:bg-amber-600 text-white transition-colors min-h-[36px]"
                        >
                          + Add Encounter
                        </button>
                      )}
                    </div>

                    {mode.type === 'new-session' ? (
                      <p className="text-sm text-stone-400 italic text-center py-4
                                    bg-stone-50 rounded-xl border border-stone-200">
                        Save the session first to add encounters.
                      </p>
                    ) : sessionEncounters.length === 0 ? (
                      <p className="text-sm text-stone-400 italic text-center py-4
                                    bg-stone-50 rounded-xl border border-stone-200">
                        No encounters yet — click "Add Encounter" to plan your first.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {sessionEncounters.map((enc) => (
                          <div key={enc.id}
                            className="bg-white border border-stone-200 rounded-xl overflow-hidden"
                          >
                            {/* Encounter header */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-stone-50
                                            border-b border-stone-200">
                              <input
                                type="text"
                                key={enc.id + '-title'}
                                defaultValue={enc.title}
                                onBlur={(e) => {
                                  const val = e.target.value.trim();
                                  if (val !== enc.title)
                                    handleEncounterBlur(enc, { title: val || 'Untitled Encounter' });
                                }}
                                className="flex-1 text-sm font-semibold text-stone-800 bg-transparent
                                           border-none outline-none min-w-0
                                           focus:bg-white focus:border focus:border-amber-400
                                           focus:rounded-lg focus:px-2 focus:py-0.5 transition-all"
                                placeholder="Encounter title"
                              />
                              {enc.initiativeState && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full
                                                 bg-teal-100 text-teal-700 flex-shrink-0">
                                  ⚔️ In Progress
                                </span>
                              )}
                              <button
                                onClick={() => handleStartEncounter(enc.id)}
                                className="text-xs font-semibold px-2.5 py-1 rounded-lg
                                           bg-teal-700 hover:bg-teal-600 text-white transition-colors
                                           flex-shrink-0 min-h-[28px]"
                                title={enc.initiativeState
                                  ? "Resume encounter — restore initiative tracker"
                                  : "Start encounter — open initiative tracker"}
                              >{enc.initiativeState ? 'Resume' : 'Start'}</button>
                              <button
                                onClick={() => handleDeleteEncounter(enc.id)}
                                className="text-stone-400 hover:text-red-500 transition-colors
                                           w-7 h-7 flex items-center justify-center flex-shrink-0
                                           text-base leading-none"
                                title="Delete encounter"
                              >🗑</button>
                            </div>

                            {/* Description */}
                            <div className="px-3 pt-2 pb-1">
                              <textarea
                                key={enc.id + '-desc'}
                                defaultValue={enc.description}
                                onBlur={(e) => {
                                  const val = e.target.value;
                                  if (val !== enc.description)
                                    handleEncounterBlur(enc, { description: val });
                                }}
                                rows={2}
                                placeholder="Encounter description, objectives, terrain, special rules…"
                                className="w-full text-sm text-stone-700 border border-stone-200 rounded-lg
                                           px-3 py-2 resize-y outline-none focus:border-amber-400
                                           focus:ring-2 focus:ring-amber-100 placeholder:text-stone-400"
                              />
                            </div>

                            {/* Monsters */}
                            <div className="px-3 pb-3">
                              {enc.monsterEntries.length > 0 && (
                                <div className="space-y-1.5 mb-2">
                                  {enc.monsterEntries.map(({ monsterId, quantity }) => {
                                    const monster = getMonsterById(monsterId);
                                    if (!monster) return null;
                                    return (
                                      <div key={monsterId}
                                        className="flex items-center gap-2 py-1"
                                      >
                                        <span className={[
                                          'flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold',
                                          monsterRoleCls(monster.role),
                                        ].join(' ')}>
                                          {monster.roleModifier
                                            ? `${monster.roleModifier} ${monster.role}`
                                            : monster.role}
                                        </span>
                                        <button
                                          onClick={() => setViewingMonster(monster)}
                                          className="flex-1 text-sm text-stone-800 font-medium truncate min-w-0
                                                     text-left hover:text-amber-700 hover:underline transition-colors"
                                          title="View stat block"
                                        >
                                          {monster.name}
                                        </button>
                                        <span className="text-xs text-stone-400 flex-shrink-0">
                                          Lv {monster.level}
                                        </span>
                                        {/* Quantity controls */}
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                          <button
                                            onClick={() => changeMonsterQty(enc, monsterId, -1)}
                                            className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200
                                                       text-stone-600 text-xs font-bold transition-colors"
                                          >−</button>
                                          <span className="w-5 text-center text-xs font-bold text-stone-700">
                                            {quantity}
                                          </span>
                                          <button
                                            onClick={() => changeMonsterQty(enc, monsterId, +1)}
                                            className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200
                                                       text-stone-600 text-xs font-bold transition-colors"
                                          >+</button>
                                        </div>
                                        <button
                                          onClick={() => handleRemoveMonster(enc, monsterId)}
                                          className="text-stone-300 hover:text-red-400 text-xl
                                                     leading-none flex-shrink-0 transition-colors"
                                          title="Remove monster"
                                        >×</button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  setPickerTargetEncounterId(enc.id);
                                  setMonsterSearch('');
                                  setShowMonsterPicker(true);
                                }}
                                className="w-full text-xs font-semibold text-amber-700 border border-amber-200
                                           border-dashed rounded-lg py-2 hover:bg-amber-50 transition-colors"
                              >
                                ＋ Add Monster from Compendium
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Additional Notes */}
                  <section>
                    <label className={labelCls}>Additional Notes</label>
                    <p className={hintCls}>
                      Post-session recap, rule reminders, experience awarded, loot given out, etc.
                    </p>
                    <textarea
                      value={sessionDraft.additionalNotes}
                      onChange={(e) => setSessionDraft((d) => ({ ...d, additionalNotes: e.target.value }))}
                      placeholder="Post-session notes…"
                      rows={5} className={fieldCls}
                    />
                  </section>

                  <div className="h-6" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Character Picker Modal ─────────────────────────────────────────── */}
      {showCharPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-3 pb-3 sm:pb-0"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCharPicker(false); }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-amber-900 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <h3 className="text-white font-bold">Add Character to Campaign</h3>
              <button onClick={() => setShowCharPicker(false)}
                className="text-amber-200 hover:text-white text-2xl leading-none w-9 h-9 flex items-center justify-center"
              >×</button>
            </div>
            <div className="px-4 py-3 border-b border-stone-100 flex-shrink-0">
              <input type="text" placeholder="Search characters…" value={charSearch}
                onChange={(e) => setCharSearch(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-2">
              {characters.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-stone-400 text-sm mb-3">No characters exist yet.</p>
                  <button onClick={() => { setShowCharPicker(false); navigate('wizard'); }}
                    className="text-xs bg-amber-700 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                  >Create a Character</button>
                </div>
              ) : availableChars.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-8">
                  All characters are already in this campaign.
                </p>
              ) : (
                availableChars.map((char) => {
                  const race = getRaceById(char.raceId);
                  const cls  = getClassById(char.classId);
                  return (
                    <div key={char.id}
                      className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 hover:border-amber-300 transition-colors"
                    >
                      {charAvatar(char.portrait, cls?.role)}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-stone-800 truncate">{char.name}</p>
                        <p className="text-xs text-stone-400">Lv {char.level} · {race?.name} {cls?.name}</p>
                      </div>
                      <button
                        onClick={() => setCampaignDraft((d) => ({ ...d, characterIds: [...d.characterIds, char.id] }))}
                        className="text-xs bg-amber-700 hover:bg-amber-600 text-white font-semibold
                                   px-3 py-2 rounded-lg transition-colors min-h-[36px] flex-shrink-0"
                      >Add</button>
                    </div>
                  );
                })
              )}
            </div>
            {campaignDraft.characterIds.length > 0 && (
              <div className="border-t border-stone-100 px-4 py-2 flex-shrink-0 bg-stone-50">
                <p className="text-xs text-stone-400 font-medium">
                  Already in campaign: {campaignDraft.characterIds.map((id) => characters.find((c) => c.id === id)?.name ?? '?').join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Monster Picker Modal ───────────────────────────────────────────── */}
      {showMonsterPicker && (() => {
        const q = monsterSearch.trim();
        const results = q
          ? searchMonsters(q)
          : searchMonsters('').slice(0, 120);
        return (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-3 pb-3 sm:pb-0"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowMonsterPicker(false); setMonsterPickerForInitiative(false); } }}
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              {/* Header */}
              <div className={`${monsterPickerForInitiative ? 'bg-teal-900' : 'bg-amber-900'} px-4 py-3 flex items-center justify-between flex-shrink-0`}>
                <h3 className="text-white font-bold">{monsterPickerForInitiative ? 'Add Monster to Initiative' : 'Add Monster to Encounter'}</h3>
                <button
                  onClick={() => { setShowMonsterPicker(false); setMonsterPickerForInitiative(false); }}
                  className="text-amber-200 hover:text-white text-2xl leading-none w-9 h-9
                             flex items-center justify-center"
                >×</button>
              </div>

              {/* Search */}
              <div className="px-4 py-3 border-b border-stone-100 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Search monsters by name…"
                  value={monsterSearch}
                  onChange={(e) => setMonsterSearch(e.target.value)}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm
                             outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>

              {/* Results list */}
              <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
                {results.length === 0 ? (
                  <p className="text-stone-400 text-sm text-center py-8">No monsters found.</p>
                ) : (
                  results.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => monsterPickerForInitiative ? handleAdHocMonsterPick(m.id) : handlePickMonster(m.id)}
                      className="w-full flex items-center gap-2 p-2.5 bg-stone-50 rounded-xl
                                 border border-stone-200 hover:border-amber-300 hover:bg-amber-50
                                 transition-colors text-left"
                    >
                      <span className={[
                        'flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold',
                        monsterRoleCls(m.role),
                      ].join(' ')}>
                        {m.roleModifier ? m.roleModifier[0] : m.role[0]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-800 truncate">{m.name}</p>
                        <p className="text-xs text-stone-400">
                          {m.size} {m.origin} {m.type}
                          {m.roleModifier ? ` · ${m.roleModifier}` : ''}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs font-bold text-stone-700">Lv {m.level}</p>
                        <p className="text-xs text-stone-400">{m.xp} XP</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-stone-100 px-4 py-2 flex-shrink-0 bg-stone-50">
                <p className="text-xs text-stone-400">
                  {results.length} monster{results.length !== 1 ? 's' : ''}
                  {!q ? ' shown (type to search all)' : ' found'}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Monster Stat Block Modal ──────────────────────────────────────── */}
      {viewingMonster && (
        <MonsterModal
          monster={viewingMonster}
          onClose={() => setViewingMonster(null)}
        />
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {pendingDelete && (() => {
        const isCamp = pendingDelete.kind === 'campaign';
        const label  = isCamp
          ? campaigns.find((c) => c.id === pendingDelete.id)?.name
          : (() => {
              const s = getSessionsForCampaign((pendingDelete as { kind: 'session'; id: string; campaignId: string }).campaignId)
                .find((s) => s.id === pendingDelete.id);
              return s ? `Session ${s.sessionNumber}: ${s.name}` : 'this session';
            })();
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setPendingDelete(null); }}
          >
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-red-700 px-4 py-3">
                <h3 className="text-white font-bold">Delete {isCamp ? 'Campaign' : 'Session'}?</h3>
              </div>
              <div className="p-5">
                <p className="text-stone-600 text-sm mb-1">
                  Are you sure you want to delete <strong className="text-stone-800">{label}</strong>?
                </p>
                <p className="text-stone-400 text-xs mb-5">
                  {isCamp
                    ? 'This will also delete all sessions in this campaign. Characters will not be deleted.'
                    : 'This action cannot be undone.'}
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setPendingDelete(null)}
                    className="flex-1 border border-stone-300 text-stone-600 font-semibold py-2.5
                               rounded-xl hover:bg-stone-50 transition-colors text-sm"
                  >Cancel</button>
                  <button
                    onClick={() => {
                      if (pendingDelete.kind === 'campaign') handleDeleteCampaign(pendingDelete.id);
                      else handleDeleteSession(pendingDelete.id, pendingDelete.campaignId);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5
                               rounded-xl transition-colors text-sm"
                  >Delete</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {/* Join Campaign Modal */}
      <JoinCampaignModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
      <ShareCampaignModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} inviteCode={shareInviteCode} campaignName={shareCampaignName} />

      {/* DM Link Character Modal */}
      {user && activeCampaign?.sharedCampaignId && (
        <LinkCharacterModal
          isOpen={showDmLinkModal}
          onClose={() => setShowDmLinkModal(false)}
          campaignId={activeCampaign.sharedCampaignId}
          userId={user.id}
        />
      )}

      {/* Read-only character sheet viewer (DM view) */}
      {viewingSummaryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={handleCloseViewer} />
          <div className="relative bg-parchment-100 rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto mx-4">
            <button
              onClick={handleCloseViewer}
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-stone-500 hover:text-stone-700 rounded-full text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm transition-colors"
            >
              &times;
            </button>
            {viewingCharacterLoading ? (
              <div className="flex items-center justify-center py-16 text-stone-400">Loading character sheet...</div>
            ) : viewingCharacter ? (
              <CharacterSheet character={viewingCharacter} readOnly />
            ) : (
              <div className="flex items-center justify-center py-16 text-stone-400 text-sm px-6 text-center">
                Character data not available. The player may not have synced recently.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
