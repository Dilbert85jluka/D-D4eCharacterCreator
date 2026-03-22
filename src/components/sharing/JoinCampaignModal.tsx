import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSharingStore } from '../../store/useSharingStore';
import { useAppStore } from '../../store/useAppStore';
import { lookupCampaignByInviteCode } from '../../lib/sharingService';

interface JoinCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CampaignPreview {
  id: string;
  name: string;
  dm_display_name: string;
}

export function JoinCampaignModal({ isOpen, onClose }: JoinCampaignModalProps) {
  const user = useAuthStore((s) => s.user);
  const joinWithCode = useSharingStore((s) => s.joinWithCode);
  const loadSharedCampaigns = useSharingStore((s) => s.loadSharedCampaigns);
  const showToast = useAppStore((s) => s.showToast);

  const [code, setCode] = useState('');
  const [preview, setPreview] = useState<CampaignPreview | null>(null);
  const [error, setError] = useState('');
  const [isLooking, setIsLooking] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const resetState = () => {
    setCode('');
    setPreview(null);
    setError('');
    setIsLooking(false);
    setIsJoining(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCodeChange = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setCode(cleaned);
    setPreview(null);
    setError('');
  };

  const handleLookup = async () => {
    if (code.length !== 6) {
      setError('Code must be 6 characters');
      return;
    }

    setIsLooking(true);
    setError('');
    setPreview(null);

    try {
      const result = await lookupCampaignByInviteCode(code);
      if (!result) {
        setError('No campaign found with that code');
      } else {
        setPreview({
          id: result.id,
          name: result.name,
          dm_display_name: result.dm_display_name,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to look up code';
      setError(message);
    } finally {
      setIsLooking(false);
    }
  };

  const handleJoin = async () => {
    if (!user || !preview) return;

    setIsJoining(true);
    setError('');

    const result = await joinWithCode(code, user.id);

    if (result.success) {
      showToast(`Joined "${result.campaignName}"!`, 'success');
      await loadSharedCampaigns(user.id);
      handleClose();
    } else {
      setError(result.error || 'Failed to join campaign');
      setIsJoining(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={handleClose} />
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">Join Campaign</h2>
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-stone-600 text-2xl leading-none p-1 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-stone-600">
            Enter the 6-character invite code from your DM to join their campaign.
          </p>

          {/* Code Input */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              Invite Code
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="ABC123"
                maxLength={6}
                className="flex-1 min-h-[44px] border border-stone-300 rounded-xl px-4 py-3 text-center text-xl font-mono font-bold tracking-[0.2em] uppercase text-stone-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors placeholder:text-stone-300"
              />
              <button
                onClick={handleLookup}
                disabled={code.length !== 6 || isLooking}
                className="min-h-[44px] min-w-[44px] bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-3 text-sm transition-colors"
              >
                {isLooking ? 'Looking...' : 'Look Up'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Campaign Preview */}
          {preview && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Campaign Found
              </p>
              <p className="text-lg font-bold text-stone-800">{preview.name}</p>
              <p className="text-sm text-stone-600">
                DM: <span className="font-medium text-stone-700">{preview.dm_display_name}</span>
              </p>
            </div>
          )}

          {/* Join Button */}
          {preview && (
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full min-h-[44px] bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-xl px-4 py-3 text-sm transition-colors"
            >
              {isJoining ? 'Joining...' : 'Join Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
