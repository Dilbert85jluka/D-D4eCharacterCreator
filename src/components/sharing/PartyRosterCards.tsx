import { useEffect, useState } from 'react';
import { getRaceById } from '../../data/races';
import { getClassById } from '../../data/classes';
import type { CharacterSummary, CampaignMember, Profile } from '../../types/sharing';

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

// ── Member Card ────────────────────────────────────────────────────────────────

interface MemberCardProps {
  member: CampaignMember & { profile: Profile };
  summary: CharacterSummary | null;
  isDm: boolean;
  isCurrentUser: boolean;
  onCharacterClick?: (summary: CharacterSummary) => void;
  onLinkClick?: () => void;
}

export function MemberCard({ member, summary, isDm, isCurrentUser, onCharacterClick, onLinkClick }: MemberCardProps) {
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
        <CharacterCard
          summary={summary}
          onClick={onCharacterClick ? () => onCharacterClick(summary) : undefined}
        />
      ) : isCurrentUser && onLinkClick ? (
        <button
          onClick={onLinkClick}
          className="text-sm text-amber-600 hover:text-amber-700 font-medium py-2 cursor-pointer transition-colors"
        >
          + Link a character
        </button>
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
  onClick?: () => void;
}

export function CharacterCard({ summary, onClick }: CharacterCardProps) {
  const race = getRaceById(summary.race_id);
  const cls = getClassById(summary.class_id);
  const raceName = race?.name || 'Unknown';
  const className = cls?.name || 'Unknown';

  const hpPercent = summary.max_hp > 0
    ? Math.min(100, Math.round((summary.current_hp / summary.max_hp) * 100))
    : 0;
  const colorKey = getHpColorKey(summary.current_hp, summary.max_hp);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasPortrait = Boolean(summary.portrait_url);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  return (
    <div
      className={[
        'flex items-center gap-3',
        onClick ? 'cursor-pointer hover:bg-amber-50 rounded-lg p-1 -m-1 transition-colors' : '',
      ].join(' ')}
      onClick={onClick || undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Portrait — clickable to enlarge when an image is present.
          Hover state grows the thumbnail and overlays a "+" zoom-in cue. */}
      {hasPortrait ? (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
          className="group relative w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex-shrink-0 overflow-hidden cursor-zoom-in hover:ring-2 hover:ring-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 hover:scale-110 transition-all duration-200"
          title="View portrait"
          aria-label={`View portrait of ${summary.name}`}
        >
          <img
            src={summary.portrait_url ?? ''}
            alt={`Portrait of ${summary.name}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
          />
          {/* Hover overlay — darkens the image and reveals a magnifier "+" cue */}
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M11 8v6M8 11h6M20 20l-3.5-3.5" />
            </svg>
          </span>
        </button>
      ) : (
        <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 flex-shrink-0 flex items-center justify-center text-xl overflow-hidden">
          <span className="text-amber-500">?</span>
        </div>
      )}

      {/* Portrait lightbox overlay */}
      {lightboxOpen && hasPortrait && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out"
          onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
          role="dialog"
          aria-label={`Portrait of ${summary.name}`}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors"
            aria-label="Close portrait"
          >
            ×
          </button>
          <img
            src={summary.portrait_url ?? ''}
            alt={`Portrait of ${summary.name}`}
            className="max-w-[min(90vw,90vh)] max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-sm bg-black/40 px-3 py-1 rounded-full font-medium">
            {summary.name}
          </p>
        </div>
      )}

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

      {/* View indicator */}
      {onClick && (
        <svg className="w-4 h-4 text-stone-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
}
