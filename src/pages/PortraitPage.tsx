import { useRef, useState } from 'react';
import { useCharactersStore } from '../store/useCharactersStore';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { characterRepository } from '../db/characterRepository';
import { getClassById } from '../data/classes';
import { supabase } from '../lib/supabase';
import { upsertCharacterSummary } from '../lib/sharingService';
import { extractSummary } from '../lib/summarySync';
import { useCharacterDerived } from '../hooks/useCharacterDerived';
import type { Character } from '../types/character';

const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3 MB
const OUT_SIZE = 150; // pixels

/** Center-crops the image to a square then scales it down to 150 × 150 JPEG. */
function processImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode the image.'));
      img.onload = () => {
        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - side) / 2;
        const sy = (img.naturalHeight - side) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = OUT_SIZE;
        canvas.height = OUT_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas unavailable.')); return; }

        ctx.drawImage(img, sx, sy, side, side, 0, 0, OUT_SIZE, OUT_SIZE);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function PortraitPage() {
  const activeCharacterId = useAppStore((s) => s.activeCharacterId);
  const navigate          = useAppStore((s) => s.navigate);
  const showToast         = useAppStore((s) => s.showToast);

  const character      = useCharactersStore((s) =>
    activeCharacterId ? s.getCharacterById(activeCharacterId) : undefined,
  );
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const user = useAuthStore((s) => s.user);
  const derived = useCharacterDerived(character as Character);

  const fileRef = useRef<HTMLInputElement>(null);
  const [error,  setError]  = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // If the character is gone (e.g. navigated here stale), bail out.
  if (!character) {
    navigate('home');
    return null;
  }

  const cls = getClassById(character.classId);
  const rolePlaceholder =
    cls?.role === 'Controller' ? '🧙' :
    cls?.role === 'Defender'   ? '🛡️' :
    cls?.role === 'Leader'     ? '⚕️' : '🗡️';

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input so the same file can be re-selected after an error.
    if (fileRef.current) fileRef.current.value = '';
    if (!file) return;

    setError(null);

    if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
      setError('Please select a PNG, JPEG, or GIF image.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError('Image must be 3 MB or smaller.');
      return;
    }

    setSaving(true);
    try {
      const dataUrl = await processImage(file);
      const now = Date.now();
      await characterRepository.patch(character.id, { portrait: dataUrl });
      // Bump updatedAt in the in-memory store so useCharacterSync fires and pushes the new portrait to Supabase
      updateCharacter({ ...character, portrait: dataUrl, updatedAt: now });
      showToast('Portrait saved!', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { portrait: _removed, ...rest } = character;
      const updated = { ...rest, updatedAt: Date.now() } as typeof character;
      await characterRepository.patch(character.id, { portrait: undefined });
      // Bump updatedAt so useCharacterSync fires and pushes the portrait removal to Supabase
      updateCharacter(updated);
      showToast('Portrait removed.', 'info');
    } finally {
      setSaving(false);
    }
  };

  /** Manually force-push the entire local character summary to Supabase.
   *  Useful when the auto-sync silently failed, or when the campaign link was established
   *  before the sync hook could see it. Surfaces errors in the UI rather than swallowing them. */
  const handleManualSync = async () => {
    if (!user) {
      showToast('You must be signed in to sync to a campaign.', 'error');
      return;
    }
    setSyncing(true);
    try {
      // Find the campaign this character is linked to
      const { data, error: lookupError } = await supabase
        .from('character_summaries')
        .select('campaign_id')
        .eq('id', character.id)
        .eq('user_id', user.id)
        .limit(1);

      if (lookupError) throw lookupError;
      if (!data || data.length === 0) {
        showToast('This character is not linked to any campaign.', 'error');
        return;
      }

      const campaignId = data[0].campaign_id;
      const summary = extractSummary(character, campaignId, user.id, derived.maxHp);
      await upsertCharacterSummary(summary);
      showToast('Character synced to campaign!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[handleManualSync] Failed:', err);
      showToast(`Sync failed: ${msg}`, 'error');
    } finally {
      setSyncing(false);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-parchment-100 pb-12">
      {/* Page header */}
      <div className="bg-amber-950 text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('sheet', character.id)}
            className="text-amber-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
          >
            ← Back to {character.name}
          </button>
        </div>
      </div>

      {/* Content card */}
      <div className="max-w-lg mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-stone-800 mb-6 text-center">
          Character Portrait
        </h1>

        {/* Portrait preview */}
        <div className="flex justify-center mb-6">
          <div className="w-40 h-40 rounded-2xl border-4 border-amber-200 bg-amber-50 overflow-hidden flex items-center justify-center shadow-md">
            {character.portrait ? (
              <img
                src={character.portrait}
                alt={`${character.name} portrait`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl select-none">{rolePlaceholder}</span>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-600 text-sm text-center mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={saving}
            className="w-full min-h-[48px] bg-amber-700 hover:bg-amber-600 active:bg-amber-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-base"
          >
            {saving
              ? 'Saving…'
              : character.portrait
                ? 'Change Portrait'
                : 'Select Portrait'}
          </button>

          {character.portrait && (
            <button
              onClick={handleRemove}
              disabled={saving}
              className="w-full min-h-[48px] border-2 border-red-300 hover:border-red-400 hover:bg-red-50 active:bg-red-100 disabled:opacity-50 text-red-600 font-semibold rounded-xl transition-colors text-base"
            >
              Remove Portrait
            </button>
          )}

          {/* Manual sync — useful when auto-sync silently failed */}
          {user && (
            <button
              onClick={handleManualSync}
              disabled={syncing || saving}
              className="w-full min-h-[48px] border-2 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 active:bg-emerald-100 disabled:opacity-50 text-emerald-700 font-semibold rounded-xl transition-colors text-base"
              title="Force push this character (portrait, HP, level, etc.) to any linked campaign"
            >
              {syncing ? 'Syncing…' : '↻ Sync to Campaign'}
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Helper text */}
        <p className="text-xs text-stone-400 text-center mt-5 leading-relaxed">
          Accepted formats: PNG, JPEG, GIF&nbsp;·&nbsp;Max 3 MB
          <br />
          Images are cropped to a square and saved at 150 × 150 px
        </p>
      </div>
    </div>
  );
}
