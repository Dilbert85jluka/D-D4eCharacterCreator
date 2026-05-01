/**
 * Shared monster stat-block modal (bottom sheet).
 * Used by MonsterCompendiumPage and CampaignManagementPage encounter cards.
 */
import type { MonsterData, MonsterRole } from '../../types/monster';

// ─── Role header colours (used by MonsterModal header + MonsterCompendiumPage row strip) ────
export const ROLE_COLORS: Record<MonsterRole, string> = {
  Brute:      'bg-red-600 text-white',
  Soldier:    'bg-blue-700 text-white',
  Artillery:  'bg-yellow-600 text-white',
  Lurker:     'bg-purple-700 text-white',
  Controller: 'bg-emerald-700 text-white',
  Skirmisher: 'bg-orange-600 text-white',
  Solo:       'bg-amber-700 text-white',
  Minion:     'bg-stone-500 text-white',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center bg-stone-50 rounded-lg px-2 py-1.5 min-w-[52px]">
      <span className="text-xs text-stone-400 font-semibold uppercase leading-none">{label}</span>
      <span className="text-lg font-bold text-stone-800 leading-tight">{value}</span>
    </div>
  );
}

function actionChipClass(action: string): string {
  switch (action) {
    case 'Standard':  return 'bg-red-100 text-red-700';
    case 'Move':      return 'bg-blue-100 text-blue-700';
    case 'Minor':     return 'bg-emerald-100 text-emerald-700';
    case 'Free':      return 'bg-stone-100 text-stone-600';
    case 'Triggered': return 'bg-orange-100 text-orange-700';
    case 'Aura':      return 'bg-purple-100 text-purple-700';
    case 'Trait':     return 'bg-amber-100 text-amber-700';
    default:          return 'bg-stone-100 text-stone-600';
  }
}

// ─── Exported modal ───────────────────────────────────────────────────────────

export function MonsterModal({
  monster,
  onClose,
}: {
  monster: MonsterData;
  onClose: () => void;
}) {
  const modLabel   = monster.roleModifier ? ` ${monster.roleModifier}` : '';
  const bloodied   = Math.floor(monster.hp / 2);
  const headerClass = ROLE_COLORS[monster.role];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-stone-300" />
        </div>

        {/* Header */}
        <div className={`px-4 py-3 flex items-start justify-between gap-3 flex-shrink-0 ${headerClass}`}>
          <div>
            <h2 className="text-white font-bold text-xl leading-tight">{monster.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white/80 text-sm">Level {monster.level}</span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                {monster.role}{modLabel}
              </span>
              <span className="text-white/70 text-xs">{monster.xp} XP</span>
            </div>
            <div className="text-white/70 text-xs mt-1 capitalize">
              {monster.size} {monster.origin} {monster.type}
              {(monster.keywords ?? []).length > 0 && ` · ${(monster.keywords ?? []).join(', ')}`}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none mt-0.5 w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">

          {/* Portrait (homebrew monsters only) */}
          {monster.portrait && (
            <div className="flex justify-center">
              <img
                src={monster.portrait}
                alt={monster.name}
                className="w-40 h-40 rounded-xl border-2 border-stone-200 object-cover shadow-md"
              />
            </div>
          )}

          {/* Flavor description (homebrew monsters only) */}
          {monster.description && (
            <p className="text-sm text-stone-600 italic leading-relaxed bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              {monster.description}
            </p>
          )}

          {/* Core stats grid */}
          <div className="flex flex-wrap gap-1.5">
            <StatCell label="HP"       value={monster.hp} />
            <StatCell label="Bloodied" value={bloodied} />
            <StatCell label="AC"       value={monster.ac} />
            <StatCell label="Fort"     value={monster.fort} />
            <StatCell label="Ref"      value={monster.ref} />
            <StatCell label="Will"     value={monster.will} />
            <StatCell label="Init"     value={`+${monster.initiative}`} />
            <StatCell label="Perc"     value={`+${monster.perception}`} />
          </div>

          {/* Speed & senses */}
          <div className="bg-stone-50 rounded-lg px-3 py-2 text-sm space-y-1">
            <div>
              <span className="font-semibold text-stone-600">Speed</span>
              <span className="text-stone-800 ml-2">{monster.speed}</span>
            </div>
            {(monster.senses ?? []).length > 0 && (
              <div>
                <span className="font-semibold text-stone-600">Senses</span>
                <span className="text-stone-800 ml-2">{(monster.senses ?? []).join('; ')}</span>
              </div>
            )}
          </div>

          {/* Resist / Immune / Vulnerable pills */}
          {((monster.resist ?? []).length > 0 ||
            (monster.immune ?? []).length > 0 ||
            (monster.vulnerable ?? []).length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {(monster.resist ?? []).map((r) => (
                <span key={r} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Resist {r}
                </span>
              ))}
              {(monster.immune ?? []).map((i) => (
                <span key={i} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                  Immune {i}
                </span>
              ))}
              {(monster.vulnerable ?? []).map((v) => (
                <span key={v} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                  Vulnerable {v}
                </span>
              ))}
            </div>
          )}

          {/* Powers */}
          <div className="space-y-2">
            <h3 className="font-bold text-stone-700 text-sm uppercase tracking-wide">Powers</h3>
            {monster.powers.map((power, idx) => (
              <div key={idx} className="border border-stone-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 border-b border-stone-200">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${actionChipClass(power.action)}`}>
                    {power.action}
                  </span>
                  {power.recharge && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                      {power.recharge}
                    </span>
                  )}
                  <span className="font-semibold text-stone-800 text-sm">{power.name}</span>
                  {(power.keywords ?? []).length > 0 && (
                    <span className="text-xs text-stone-400 ml-auto">
                      {(power.keywords ?? []).join(', ')}
                    </span>
                  )}
                </div>
                <div className="px-3 py-2 text-xs text-stone-700 leading-relaxed">
                  {power.description}
                </div>
              </div>
            ))}
          </div>

          {/* Footer: alignment + languages */}
          <div className="border-t border-stone-200 pt-3 flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-semibold text-stone-500">Alignment </span>
              <span className="text-stone-700">{monster.alignment}</span>
            </div>
            {(monster.languages ?? []).length > 0 && (
              <div>
                <span className="font-semibold text-stone-500">Languages </span>
                <span className="text-stone-700">{(monster.languages ?? []).join(', ')}</span>
              </div>
            )}
            <div className="ml-auto">
              <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-mono uppercase">
                {monster.source}
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
