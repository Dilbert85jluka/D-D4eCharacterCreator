import { useCampaignsStore } from '../../store/useCampaignsStore';

interface Props {
  title: string;
  campaignIds: string[];
  onCampaignToggle: (campaignId: string) => void;
  onSave: () => void;
  onCancel: () => void;
  canSave: boolean;
  children: React.ReactNode;
}

export function EditorLayout({ title, campaignIds, onCampaignToggle, onSave, onCancel, canSave, children }: Props) {
  const campaigns = useCampaignsStore((s) => s.campaigns);

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
      <div className="flex justify-end gap-3 px-5 py-3 border-t border-stone-200 bg-stone-50 rounded-b-xl">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-stone-600 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors min-h-[44px]"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className={[
            'px-4 py-2 text-sm font-semibold rounded-lg transition-colors min-h-[44px]',
            canSave
              ? 'bg-amber-700 text-white hover:bg-amber-600'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed',
          ].join(' ')}
        >
          Save
        </button>
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
