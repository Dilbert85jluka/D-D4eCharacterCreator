import type { Character } from '../../types/character';
import type { ParagonPathData } from '../../types/gameData';
import { getParagonPathById, getParagonPathsForCharacter } from '../../data/paragonPaths';
import { getClassById } from '../../data/classes';

interface Props {
  character: Character;
}

export function ParagonPanel({ character }: Props) {
  const cls           = getClassById(character.classId);
  const selectedPath  = character.paragonPath ? getParagonPathById(character.paragonPath) : undefined;
  const allPaths      = getParagonPathsForCharacter(character.classId, character.raceId);
  const otherPaths    = allPaths.filter((p) => p.id !== character.paragonPath);

  // ── Locked state (level < 11) ──────────────────────────────────────────────
  if (character.level < 11) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-stone-400 px-4 py-3">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide">⭐ Paragon Path</h3>
        </div>

        {/* Locked message */}
        <div className="p-6 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <p className="font-bold text-stone-700 text-base mb-1">Unlocks at Paragon Tier</p>
          <p className="text-sm text-stone-500 mb-5">
            Paragon Paths become available at <span className="font-semibold">Level 11</span>.
            You are currently Level {character.level} — {10 - character.level + 1} level{10 - character.level + 1 !== 1 ? 's' : ''} away.
          </p>

          {/* Preview of available paths for this class */}
          {allPaths.length > 0 && (
            <>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">
                Preview — Paths available for {cls?.name ?? 'your class'}
              </p>
              <div className="space-y-2 text-left">
                {allPaths.map((path) => (
                  <LockedPathCard key={path.id} path={path} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Paragon tier reached ───────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Selected path card */}
      <div className="bg-white rounded-xl border border-amber-300 overflow-hidden">
        <div className="bg-amber-600 px-4 py-3 flex items-center justify-between">
          <h3 className="text-white font-bold text-sm uppercase tracking-wide">⭐ Your Paragon Path</h3>
          {selectedPath && (
            <span className="text-amber-100 text-xs font-semibold">Level 11+</span>
          )}
        </div>

        {selectedPath ? (
          <SelectedPathCard path={selectedPath} />
        ) : (
          <div className="p-5 text-center">
            <p className="text-stone-500 text-sm mb-1">No Paragon Path chosen yet.</p>
            <p className="text-xs text-stone-400">
              Open the <span className="font-semibold">Level Up</span> screen to select your path.
            </p>
          </div>
        )}
      </div>

      {/* Other available paths */}
      {otherPaths.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="bg-stone-100 px-4 py-2.5 border-b border-stone-200">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              Other {cls?.name ?? ''} Paths
            </p>
          </div>
          <div className="divide-y divide-stone-100">
            {otherPaths.map((path) => (
              <AlternatePathCard key={path.id} path={path} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SelectedPathCard({ path }: { path: ParagonPathData }) {
  return (
    <div className="p-4 bg-amber-50/40 space-y-3">
      {/* Name + prerequisite */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <h4 className="font-bold text-stone-900 text-lg leading-tight">{path.name}</h4>
        {path.prerequisite && (
          <span className="text-[11px] text-amber-700 font-semibold bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full flex-shrink-0">
            Req: {path.prerequisite}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-stone-700 leading-relaxed">{path.description}</p>

      {/* Features */}
      <div className="bg-white border border-amber-200 rounded-lg p-3">
        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-2">
          Features &amp; Powers
        </p>
        {/* Split features by ". " boundary to render each on its own line */}
        <ul className="space-y-1.5">
          {splitFeatures(path.features).map((feat, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
              <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">⭐</span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AlternatePathCard({ path }: { path: ParagonPathData }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
        <p className="font-semibold text-stone-800 text-sm">{path.name}</p>
        {path.prerequisite && (
          <span className="text-[10px] text-stone-500 font-medium flex-shrink-0">
            Req: {path.prerequisite}
          </span>
        )}
      </div>
      <p className="text-xs text-stone-500 leading-relaxed">{path.description}</p>
      <p className="text-[11px] text-stone-400 mt-1.5 leading-relaxed line-clamp-2">{path.features}</p>
    </div>
  );
}

function LockedPathCard({ path }: { path: ParagonPathData }) {
  return (
    <div className="border border-stone-200 rounded-lg p-3 opacity-60">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-stone-400">🔒</span>
        <p className="font-semibold text-stone-600 text-sm">{path.name}</p>
        {path.prerequisite && (
          <span className="text-[10px] text-stone-400 ml-auto">{path.prerequisite}</span>
        )}
      </div>
      <p className="text-xs text-stone-400 leading-relaxed">{path.description}</p>
    </div>
  );
}

/**
 * Splits a features string into individual bullet points.
 * Features are separated by ". NAME (L1X):" pattern — split on the period before
 * each capital-letter segment that looks like "FeatureName (L11):".
 */
function splitFeatures(features: string): string[] {
  // Split on ". " followed by a capital letter and something that contains "(L"
  const parts = features
    .split(/\.\s+(?=[A-Z][^.]*\(L\d+\))/)
    .map((s) => s.trim())
    .filter(Boolean);

  // If splitting didn't work (no level tags), fall back to ". " split
  if (parts.length <= 1) {
    return features
      .split(/\.\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return parts;
}
