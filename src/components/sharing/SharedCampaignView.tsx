import { useState, useEffect } from 'react';
import { useSharingStore } from '../../store/useSharingStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { getRaceById } from '../../data/races';
import { useRealtimeCampaign } from '../../hooks/useRealtimeCampaign';
import { getClassById } from '../../data/classes';
import { ShareCampaignModal } from './ShareCampaignModal';
import { LinkCharacterModal } from './LinkCharacterModal';
import type { CharacterSummary, CampaignMember, Profile } from '../../types/sharing';

interface SharedCampaignViewProps {
  campaignId: string;
}

// HP bar color thresholds — static lookup for Tailwind v4
const hpBarColor: Record<string, string> = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-400',
  red: 'bg-red-500',
  empty: 'bg-stone-200',
};

function getHpColorKey(current: number, max: number): string {
  if (max <= 0) return 'empty';
  const ratio = current / max;
  if (ratio > 0.5) return 'green';
  if (ratio > 0.25) return 'yellow';
  return 'red';
}

export function SharedCampaignView({ campaignId }: SharedCampaignViewProps) {
  const user = useAuthStore((s) => s.user);
  useRealtimeCampaign(campaignId);
  const showToast = useAppStore((s) => s.showToast);

  const {
    sharedCampaigns,
    activeCampaignMembers,
    activeCampaignSummaries,
    isLoading,
    loadCampaignDetail,
    unlinkCharacter,
    leaveCampaign,
    deleteCampaign,
    loadSharedCampaigns,
  } = useSharingStore();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const campaign = sharedCampaigns.find((c) => c.id === campaignId);
  const isDm = campaign?.created_by === user?.id;

  // Find the current user's member entry
  const currentMember = activeCampaignMembers.find((m) => m.user_id === user?.id);

  // Find the current user's linked character summary
  const myCharacterSummary = activeCampaignSummaries.find((s) => s.user_id === user?.id);

  useEffect(() => {
    loadCampaignDetail(campaignId);
  }, [campaignId, loadCampaignDetail]);

  const handleUnlink = async () => {
    if (!myCharacterSummary) return;
    try {
      await unlinkCharacter(myCharacterSummary.id, campaignId);
      showToast('Character unlinked', 'success');
    } catch {
      showToast('Failed to unlink character', 'error');
    }
  };

  const handleLeave = async () => {
    if (!user) return;
    try {
      await leaveCampaign(campaignId, user.id);
      showToast('Left campaign', 'success');
    } catch {
      showToast('Failed to leave campaign', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCampaign(campaignId);
      if (user) await loadSharedCampaigns(user.id);
      showToast('Campaign deleted', 'success');
    } catch {
      showToast('Failed to delete campaign', 'error');
    }
  };

  if (isLoading && activeCampaignMembers.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-stone-400 text-sm">
        Loading campaign...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center py-16 text-stone-400 text-sm">
        Campaign not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-stone-800 truncate">{campaign.name}</h2>
            {campaign.description && (
              <p className="text-sm text-stone-500 mt-1">{campaign.description}</p>
            )}
            {isDm && (
              <p className="text-xs text-amber-700 font-mono mt-2 tracking-wider">
                Code: {campaign.invite_code}
              </p>
            )}
          </div>

          {isDm && (
            <button
              onClick={() => setShowShareModal(true)}
              className="min-h-[44px] min-w-[44px] bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors flex-shrink-0"
            >
              Share
            </button>
          )}
        </div>
      </div>

      {/* Member Roster */}
      <div>
        <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">
          Party Members ({activeCampaignMembers.length})
        </h3>

        <div className="space-y-3">
          {activeCampaignMembers.map((member) => {
            const summary = activeCampaignSummaries.find((s) => s.user_id === member.user_id);
            return (
              <MemberCard
                key={member.id}
                member={member}
                summary={summary || null}
                isDm={member.role === 'dm'}
                isCurrentUser={member.user_id === user?.id}
              />
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {/* Link / Unlink Character */}
        {currentMember && !myCharacterSummary && (
          <button
            onClick={() => setShowLinkModal(true)}
            className="w-full min-h-[44px] bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl px-4 py-3 text-sm transition-colors"
          >
            Link Character
          </button>
        )}

        {currentMember && myCharacterSummary && (
          <button
            onClick={handleUnlink}
            className="w-full min-h-[44px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl px-4 py-3 text-sm transition-colors border border-stone-300"
          >
            Unlink Character
          </button>
        )}

        {/* Leave Campaign (players only) */}
        {currentMember && !isDm && (
          <>
            {!confirmLeave ? (
              <button
                onClick={() => setConfirmLeave(true)}
                className="w-full min-h-[44px] bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl px-4 py-3 text-sm transition-colors border border-red-200"
              >
                Leave Campaign
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleLeave}
                  className="flex-1 min-h-[44px] bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-4 py-3 text-sm transition-colors"
                >
                  Confirm Leave
                </button>
                <button
                  onClick={() => setConfirmLeave(false)}
                  className="flex-1 min-h-[44px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl px-4 py-3 text-sm transition-colors border border-stone-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}

        {/* Delete Campaign (DM only) */}
        {isDm && (
          <>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full min-h-[44px] bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl px-4 py-3 text-sm transition-colors border border-red-200"
              >
                Delete Campaign
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 min-h-[44px] bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-4 py-3 text-sm transition-colors"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 min-h-[44px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl px-4 py-3 text-sm transition-colors border border-stone-300"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ShareCampaignModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        inviteCode={campaign.invite_code}
        campaignName={campaign.name}
      />

      {user && (
        <LinkCharacterModal
          isOpen={showLinkModal}
          onClose={() => setShowLinkModal(false)}
          campaignId={campaignId}
          userId={user.id}
        />
      )}
    </div>
  );
}

// ── Member Card ────────────────────────────────────────────────────────────────

interface MemberCardProps {
  member: CampaignMember & { profile: Profile };
  summary: CharacterSummary | null;
  isDm: boolean;
  isCurrentUser: boolean;
}

function MemberCard({ member, summary, isDm, isCurrentUser }: MemberCardProps) {
  const displayName = member.profile?.display_name || member.profile?.email || 'Unknown';

  return (
    <div className={
      'border rounded-2xl p-4 transition-colors ' +
      (isCurrentUser ? 'border-amber-300 bg-amber-50/50' : 'border-stone-200 bg-white')
    }>
      {/* Player info row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-stone-600 truncate">{displayName}</span>
        {isDm && (
          <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full flex-shrink-0">
            DM
          </span>
        )}
        {isCurrentUser && (
          <span className="text-xs text-stone-400 flex-shrink-0">(you)</span>
        )}
      </div>

      {/* Character summary or placeholder */}
      {summary ? (
        <CharacterCard summary={summary} />
      ) : (
        <div className="text-sm text-stone-400 italic py-2">
          No character linked
        </div>
      )}
    </div>
  );
}

// ── Character Card ─────────────────────────────────────────────────────────────

interface CharacterCardProps {
  summary: CharacterSummary;
}

function CharacterCard({ summary }: CharacterCardProps) {
  const race = getRaceById(summary.race_id);
  const cls = getClassById(summary.class_id);
  const raceName = race?.name || 'Unknown';
  const className = cls?.name || 'Unknown';

  const hpPercent = summary.max_hp > 0
    ? Math.min(100, Math.round((summary.current_hp / summary.max_hp) * 100))
    : 0;
  const colorKey = getHpColorKey(summary.current_hp, summary.max_hp);

  return (
    <div className="flex items-center gap-3">
      {/* Portrait */}
      <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden">
        {summary.portrait_url ? (
          <img src={summary.portrait_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-amber-500">?</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="font-bold text-stone-800 text-sm truncate">{summary.name}</p>
          <span className="text-xs text-stone-400 flex-shrink-0">Lvl {summary.level}</span>
        </div>
        <p className="text-xs text-stone-500 truncate">
          {raceName} {className}
          {summary.paragon_path ? ` \u00b7 ${summary.paragon_path}` : ''}
        </p>
        {summary.alignment && summary.alignment !== 'Unaligned' && (
          <p className="text-xs text-stone-400 truncate">{summary.alignment}</p>
        )}

        {/* HP Bar */}
        {summary.max_hp > 0 && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={hpBarColor[colorKey] + ' h-full rounded-full transition-all'}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
            <span className="text-xs text-stone-500 font-mono flex-shrink-0">
              {summary.current_hp}/{summary.max_hp}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
