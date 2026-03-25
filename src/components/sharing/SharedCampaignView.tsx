import { useState, useEffect } from 'react';
import { useSharingStore } from '../../store/useSharingStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { useRealtimeCampaign } from '../../hooks/useRealtimeCampaign';
import { ShareCampaignModal } from './ShareCampaignModal';
import { LinkCharacterModal } from './LinkCharacterModal';
import { MemberCard } from './PartyRosterCards';
import type { PublicSession } from '../../types/sharing';

interface SharedCampaignViewProps {
  campaignId: string;
}

export function SharedCampaignView({ campaignId }: SharedCampaignViewProps) {
  const user = useAuthStore((s) => s.user);
  useRealtimeCampaign(campaignId);
  const showToast = useAppStore((s) => s.showToast);

  const {
    sharedCampaigns,
    activeCampaignMembers,
    activeCampaignSummaries,
    loadCampaignDetail,
    unlinkCharacter,
    leaveCampaign,
    deleteCampaign,
    loadSharedCampaigns,
  } = useSharingStore();

  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  const campaign = sharedCampaigns.find((c) => c.id === campaignId);
  const isDm = campaign?.created_by === user?.id;
  const content = campaign?.campaign_content;

  // Find the current user's member entry
  const currentMember = activeCampaignMembers.find((m) => m.user_id === user?.id);

  // Find the current user's linked character summary
  const myCharacterSummary = activeCampaignSummaries.find((s) => s.user_id === user?.id);

  useEffect(() => {
    setLoading(true);
    loadCampaignDetail(campaignId).finally(() => setLoading(false));
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

  const toggleSession = (id: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading && activeCampaignMembers.length === 0) {
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
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-stone-800 truncate">{campaign.name}</h2>
            {(content?.description || campaign.description) && (
              <p className="text-sm text-stone-500 mt-1">{content?.description || campaign.description}</p>
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

      {/* Public Notes (player-visible) */}
      {content?.publicNotes && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">
            Campaign Notes
          </h3>
          <p className="text-sm text-stone-600 whitespace-pre-wrap">{content.publicNotes}</p>
        </div>
      )}

      {/* Sessions (player-visible read-only) */}
      {content && content.sessions.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">
            Sessions ({content.sessions.length})
          </h3>
          <div className="space-y-2">
            {content.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                expanded={expandedSessions.has(session.id)}
                onToggle={() => toggleSession(session.id)}
              />
            ))}
          </div>
        </div>
      )}

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

// ── Session Card (read-only for players) ──────────────────────────────────────

interface SessionCardProps {
  session: PublicSession;
  expanded: boolean;
  onToggle: () => void;
}

function SessionCard({ session, expanded, onToggle }: SessionCardProps) {
  const hasContent = !!(session.importantEvents || session.additionalNotes);

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-stone-50 transition-colors min-h-[44px]"
      >
        <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full flex-shrink-0">
          #{session.sessionNumber}
        </span>
        <span className="text-sm font-semibold text-stone-700 truncate flex-1">{session.name}</span>
        {session.date && (
          <span className="text-xs text-stone-400 flex-shrink-0">{session.date}</span>
        )}
        {hasContent && (
          <svg
            className={`w-3.5 h-3.5 text-stone-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-90' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {expanded && hasContent && (
        <div className="px-4 pb-3 space-y-2 border-t border-stone-100 pt-2">
          {session.importantEvents && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-0.5">Important Events</p>
              <p className="text-sm text-stone-600 whitespace-pre-wrap">{session.importantEvents}</p>
            </div>
          )}
          {session.additionalNotes && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-0.5">Notes</p>
              <p className="text-sm text-stone-600 whitespace-pre-wrap">{session.additionalNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
