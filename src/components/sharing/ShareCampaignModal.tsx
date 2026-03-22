import { useAppStore } from '../../store/useAppStore';

interface ShareCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
  campaignName: string;
}

export function ShareCampaignModal({ isOpen, onClose, inviteCode, campaignName }: ShareCampaignModalProps) {
  const showToast = useAppStore((s) => s.showToast);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      showToast('Invite code copied to clipboard', 'success');
    } catch {
      showToast('Failed to copy code', 'error');
    }
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}?join=${inviteCode}`;
    try {
      await navigator.clipboard.writeText(link);
      showToast('Invite link copied to clipboard', 'success');
    } catch {
      showToast('Failed to copy link', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">Share Campaign</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-2xl leading-none p-1 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          <p className="text-sm text-stone-600">
            Share this code with players so they can join{' '}
            <span className="font-semibold text-stone-800">{campaignName}</span>.
          </p>

          {/* Invite Code Display */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 text-center">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
              Invite Code
            </p>
            <p className="text-4xl font-mono font-bold text-amber-900 tracking-[0.3em] uppercase select-all">
              {inviteCode}
            </p>
          </div>

          <p className="text-xs text-stone-400 text-center">
            Players enter this code on their device to join. The code does not expire.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopyCode}
              className="flex-1 min-h-[44px] bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl px-4 py-3 text-sm transition-colors"
            >
              Copy Code
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 min-h-[44px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl px-4 py-3 text-sm transition-colors border border-stone-300"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
