import { useState } from 'react';
import { useCampaignsStore } from '../../store/useCampaignsStore';
import { describeStorageError } from '../../lib/storageErrors';

interface Props {
  title: string;
  campaignIds: string[];
  onCampaignToggle: (campaignId: string) => void;
  /** May be async. EditorLayout awaits it, so a rejection is reported rather than lost. */
  onSave: () => void | Promise<void>;
  onCancel: () => void;
  canSave: boolean;
  children: React.ReactNode;
}

export function EditorLayout({ title, campaignIds, onCampaignToggle, onSave, onCancel, canSave, children }: Props) {
  const campaigns = useCampaignsStore((s) => s.campaigns);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Every editor's own save handler ends in `onClose()` AFTER its awaits, so any
   * rejection used to skip the close and leave the modal sitting there with no
   * message anywhere — which is exactly what "nothing happens when I click Save"
   * looks like. The await + catch lives here so all 13 editors are covered by one
   * implementation and a new editor can't reintroduce the silence.
   */
  const handleSave = async () => {
    if (saving) return;      // also stops a double-tap writing twice
    setSaving(true);
    setError(null);
    try {
      await onSave();
    } catch (err) {
      console.error('[HomebrewEditor] Save failed', err);
      setError(describeStorageError(err, 'save'));
    } finally {
      setSaving(false);
    }
  };

  const saveDisabled = !canSave || saving;

  return (
    <div>
      {/* Header */}
      <div className="bg-amber-800 text-white px-5 py-3 rounded-t-xl">
        <h2 className="font-bold text-lg">{title}</h2>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {children}

        {/* Campaign sharing */}
        {campaigns.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Share to Campaigns</label>
            <div className="flex flex-wrap gap-2">
              {campaigns.map((c) => {
                const active = campaignIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => onCampaignToggle(c.id)}
                    className={[
                      'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px]',
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-stone-600 border-stone-300 hover:border-indigo-400',
                    ].join(' ')}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-stone-400 mt-1">Players in selected campaigns can use this content</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-stone-200 bg-stone-50 rounded-b-xl">
        {error && (
          <div
            role="alert"
            className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700"
          >
            <span className="font-bold">Save failed. </span>{error}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-stone-600 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveDisabled}
            className={[
              'px-4 py-2 text-sm font-semibold rounded-lg transition-colors min-h-[44px]',
              saveDisabled
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-amber-700 text-white hover:bg-amber-600',
            ].join(' ')}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Standard form field wrapper */
export function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputCls = 'w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[44px]';
export const selectCls = inputCls;
export const textareaCls = 'w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[80px] resize-y';
