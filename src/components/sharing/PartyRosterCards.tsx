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

      {/* View indicator */}
      {onClick && (
        <svg className="w-4 h-4 text-stone-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );
}
