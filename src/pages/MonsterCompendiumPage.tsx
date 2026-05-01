import { useState, useMemo, useCallback, useEffect } from 'react';
import type { MonsterData, MonsterRole, MonsterRoleModifier, MonsterSource, MonsterFilters, MonsterCreatureType } from '../types/monster';
import { ALL_MONSTERS } from '../data/monsters';
import { MonsterModal, ROLE_COLORS } from '../components/monsters/MonsterModal';

const ROLE_BADGE_BG: Record<MonsterRole, string> = {
  Brute:      'bg-red-100 text-red-800',
  Soldier:    'bg-blue-100 text-blue-800',
  Artillery:  'bg-yellow-100 text-yellow-800',
  Lurker:     'bg-purple-100 text-purple-800',
  Controller: 'bg-emerald-100 text-emerald-800',
  Skirmisher: 'bg-orange-100 text-orange-800',
  Solo:       'bg-amber-100 text-amber-800',
  Minion:     'bg-stone-100 text-stone-600',
};

// ─── Filter helpers ────────────────────────────────────────────────────────────
const ALL_CREATURE_TYPES: MonsterCreatureType[] = [
  'Aberrant', 'Animate', 'Beast', 'Construct', 'Elemental',
  'Fey', 'Giant', 'Humanoid', 'Immortal', 'Magical Beast',
  'Ooze', 'Plant', 'Shadow', 'Undead',
];

const DEFAULT_FILTERS: MonsterFilters = {
  sources:       ['mm1', 'mm2', 'mm3', 'dmg', 'dmg2', 'mv', 'mvttnv'],
  roles:         ['Brute', 'Soldier', 'Artillery', 'Lurker', 'Controller', 'Skirmisher', 'Solo', 'Minion'],
  roleModifiers: ['Standard', 'Elite', 'Solo', 'Minion'],
  types:         [...ALL_CREATURE_TYPES],
  tier:          'all',
  query:         '',
};

function tierForLevel(lvl: number): 'heroic' | 'paragon' | 'epic' {
  if (lvl <= 10) return 'heroic';
  if (lvl <= 20) return 'paragon';
  return 'epic';
}

function matchesFilters(m: MonsterData, f: MonsterFilters): boolean {
  if (!f.sources.includes(m.source)) return false;
  if (!f.roles.includes(m.role)) return false;
  const mod: 'Standard' | MonsterRoleModifier = m.roleModifier ?? 'Standard';
  if (!f.roleModifiers.includes(mod)) return false;
  if (!f.types.includes(m.type as MonsterCreatureType)) return false;
  if (f.tier !== 'all' && tierForLevel(m.level) !== f.tier) return false;
  if (f.query) {
    const q = f.query.toLowerCase();
    if (!m.name.toLowerCase().includes(q) &&
        !m.type.toLowerCase().includes(q) &&
        !(m.keywords ?? []).some((k) => k.toLowerCase().includes(q))) {
      return false;
    }
  }
  return true;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ToggleChip<T extends string>({
  label, value, active, onToggle,
}: { label: string; value: T; active: boolean; onToggle: (v: T) => void }) {
  return (
    <button
      onClick={() => onToggle(value)}
      className={[
        'px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors min-h-[32px]',
        active
          ? 'bg-amber-700 text-white border-amber-700'
          : 'bg-white text-stone-600 border-stone-300 hover:border-amber-400',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function MonsterRow({ monster, onClick }: { monster: MonsterData; onClick: () => void }) {
  const modLabel = monster.roleModifier ? ` ${monster.roleModifier}` : '';
  const xpK = monster.xp >= 1000 ? `${(monster.xp / 1000).toFixed(1)}k` : String(monster.xp);

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2.5 border-b border-stone-100 hover:bg-amber-50 transition-colors flex items-center gap-3 min-h-[52px]"
    >
      {/* Role colour strip */}
      <span className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${ROLE_COLORS[monster.role].split(' ')[0]}`} />

      {/* Portrait thumbnail (when present) */}
      {monster.portrait && (
        <img
          src={monster.portrait}
          alt=""
          className="w-10 h-10 rounded-lg object-cover border border-stone-200 flex-shrink-0"
        />
      )}

      {/* Name + descriptor */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-stone-800 text-sm truncate">{monster.name}</div>
        <div className="text-xs text-stone-400 truncate">
          {monster.size} {monster.origin} {monster.type}
          {(monster.keywords ?? []).length > 0 && ` · ${(monster.keywords ?? []).join(', ')}`}
        </div>
      </div>

      {/* Level + Role badge */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-xs text-stone-500 font-medium">Lvl {monster.level}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${ROLE_BADGE_BG[monster.role]}`}>
          {monster.role}{modLabel}
        </span>
      </div>

      {/* XP */}
      <span className="text-xs text-stone-400 font-medium w-10 text-right flex-shrink-0">{xpK} XP</span>

      {/* Source badge */}
      <span className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded font-mono flex-shrink-0 uppercase">
        {monster.source}
      </span>
    </button>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const SOURCES: { key: MonsterSource; label: string }[] = [
  { key: 'mm1', label: 'MM1' },
  { key: 'mm2', label: 'MM2' },
  { key: 'mm3', label: 'MM3' },
  { key: 'dmg', label: 'DMG' },
  { key: 'dmg2', label: 'DMG2' },
  { key: 'mv', label: 'MV' },
  { key: 'mvttnv', label: "MV:TttNV" },
  { key: 'homebrew', label: 'Homebrew' },
];

const ROLES: MonsterRole[] = ['Brute', 'Soldier', 'Artillery', 'Lurker', 'Controller', 'Skirmisher'];
const MODIFIERS: { key: 'Standard' | MonsterRoleModifier; label: string }[] = [
  { key: 'Standard', label: 'Standard' },
  { key: 'Elite',    label: 'Elite' },
  { key: 'Solo',     label: 'Solo' },
  { key: 'Minion',   label: 'Minion' },
];
const TIERS: { key: MonsterFilters['tier']; label: string }[] = [
  { key: 'all',     label: 'All Tiers' },
  { key: 'heroic',  label: 'Heroic (1–10)' },
  { key: 'paragon', label: 'Paragon (11–20)' },
  { key: 'epic',    label: 'Epic (21–30)' },
];

const PAGE_SIZE = 30;

export function MonsterCompendiumPage() {
  const [filters, setFilters] = useState<MonsterFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<MonsterData | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'level'>('name');
  const [currentPage, setCurrentPage] = useState(1);

  const toggle = useCallback(<T extends string>(
    key: keyof MonsterFilters,
    value: T,
    current: T[],
  ) => {
    setFilters((f) => ({
      ...f,
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    }));
  }, []);

  const filtered = useMemo(() => {
    const list = ALL_MONSTERS.filter((m) => matchesFilters(m, filters));
    if (sortBy === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return [...list].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  }, [filters, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-stone-100">

      {/* ── Monster Mural Banner ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: '160px' }}>
        <svg
          viewBox="0 0 1200 160"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#0a0200" />
              <stop offset="40%"  stopColor="#1c0800" />
              <stop offset="70%"  stopColor="#2d1000" />
              <stop offset="100%" stopColor="#0a0200" />
            </linearGradient>
            <radialGradient id="mc-glow-l" cx="25%" cy="70%" r="35%">
              <stop offset="0%"   stopColor="#b45309" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mc-glow-r" cx="78%" cy="50%" r="30%">
              <stop offset="0%"   stopColor="#92400e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#92400e" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mc-moon" cx="50%" cy="20%" r="25%">
              <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="mc-fog" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#7c2d12" stopOpacity="0" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="1200" height="160" fill="url(#mc-bg)" />
          <rect width="1200" height="160" fill="url(#mc-glow-l)" />
          <rect width="1200" height="160" fill="url(#mc-glow-r)" />
          <rect width="1200" height="160" fill="url(#mc-moon)" />

          {/* Stars */}
          {[
            [60,12,1],[180,7,1.5],[310,18,1],[430,9,1.2],[550,14,1],[660,6,1.5],
            [750,19,1],[870,11,1.2],[990,16,1],[1080,8,1.5],[1150,20,1],[1190,12,1],
            [140,30,0.8],[390,25,0.8],[700,28,0.8],[1020,27,0.8]
          ].map(([x,y,r],i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#fde68a" opacity={0.4 + Math.random()*0.3}/>
          ))}

          {/* ── SPIDER (far left) ── */}
          <ellipse cx="90" cy="126" rx="30" ry="22" fill="#0a0200"/>
          <ellipse cx="90" cy="106" rx="19" ry="15" fill="#0a0200"/>
          <circle  cx="83" cy="103" r="2.5" fill="#dc2626" opacity="0.85"/>
          <circle  cx="97" cy="103" r="2.5" fill="#dc2626" opacity="0.85"/>
          <path d="M 83,119 L 78,130 L 84,127 Z" fill="#0a0200"/>
          <path d="M 97,119 L 102,130 L 96,127 Z" fill="#0a0200"/>
          {/* Left legs */}
          <path d="M 63,116 C 45,104 28,96 10,88"  stroke="#0a0200" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 63,122 C 42,120 22,118 4,122"  stroke="#0a0200" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 64,129 C 46,130 28,136 10,142" stroke="#0a0200" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 65,136 C 50,142 36,150 22,158" stroke="#0a0200" strokeWidth="5" fill="none" strokeLinecap="round"/>
          {/* Right legs */}
          <path d="M 117,116 C 135,104 152,96 170,88"  stroke="#0a0200" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 117,122 C 138,120 158,118 176,122" stroke="#0a0200" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 116,129 C 134,130 152,136 170,142" stroke="#0a0200" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 115,136 C 130,142 144,150 158,158" stroke="#0a0200" strokeWidth="5" fill="none" strokeLinecap="round"/>

          {/* ── SKELETON WARRIOR ── */}
          {/* Skull */}
          <ellipse cx="258" cy="58" rx="19" ry="21" fill="#0a0200"/>
          <ellipse cx="251" cy="58" rx="5.5" ry="5.5" fill="#1c0800"/>
          <ellipse cx="265" cy="58" rx="5.5" ry="5.5" fill="#1c0800"/>
          {/* Jaw */}
          <path d="M 245,72 Q 258,80 271,72 L 269,80 Q 258,86 247,80 Z" fill="#0a0200"/>
          {/* Neck + torso */}
          <rect x="254" y="79" width="8"  height="12" rx="2" fill="#0a0200"/>
          <rect x="242" y="91" width="32" height="40" rx="4" fill="#0a0200"/>
          {/* Rib lines */}
          <path d="M 249,98  Q 258,95 267,98"  stroke="#1c0800" strokeWidth="1.5" fill="none"/>
          <path d="M 248,106 Q 258,103 268,106" stroke="#1c0800" strokeWidth="1.5" fill="none"/>
          <path d="M 248,114 Q 258,111 268,114" stroke="#1c0800" strokeWidth="1.5" fill="none"/>
          {/* Arms */}
          <path d="M 242,97 L 210,88 L 198,86" stroke="#0a0200" strokeWidth="9"  fill="none" strokeLinecap="round"/>
          <path d="M 274,97 L 298,80"          stroke="#0a0200" strokeWidth="9"  fill="none" strokeLinecap="round"/>
          {/* Sword */}
          <rect x="294" y="30" width="7" height="56" rx="2" fill="#0a0200"/>
          <rect x="285" y="62" width="25" height="5" rx="2" fill="#0a0200"/>
          {/* Legs */}
          <rect x="247" y="130" width="12" height="30" rx="3" fill="#0a0200"/>
          <rect x="263" y="130" width="12" height="30" rx="3" fill="#0a0200"/>

          {/* ── ORC WARRIOR ── */}
          {/* Horned helmet */}
          <ellipse cx="385" cy="53" rx="24" ry="27" fill="#0a0200"/>
          <path d="M 365,43 L 354,16 L 371,36 Z" fill="#0a0200"/>
          <path d="M 405,43 L 416,16 L 399,36 Z" fill="#0a0200"/>
          <rect x="361" y="40" width="48" height="9" rx="2" fill="#0a0200"/>
          {/* Torso */}
          <path d="M 358,80 L 348,155 L 422,155 L 412,80 Z" fill="#0a0200"/>
          <ellipse cx="348" cy="83" rx="20" ry="13" fill="#0a0200"/>
          <ellipse cx="422" cy="83" rx="20" ry="13" fill="#0a0200"/>
          {/* Left arm + axe */}
          <path d="M 340,87 L 314,114 L 306,132" stroke="#0a0200" strokeWidth="14" fill="none" strokeLinecap="round"/>
          <path d="M 297,122 Q 286,110 294,103 Q 305,94 316,106 Z" fill="#0a0200"/>
          <path d="M 297,122 Q 285,132 292,140 Q 302,146 313,136 Z" fill="#0a0200"/>
          {/* Right arm + shield */}
          <path d="M 430,87 L 454,72" stroke="#0a0200" strokeWidth="14" fill="none" strokeLinecap="round"/>
          <path d="M 448,55 Q 468,52 474,70 Q 476,88 456,94 Q 442,92 442,74 Z" fill="#0a0200"/>

          {/* ── BATS (background) ── */}
          {[[490,32],[530,20],[760,38],[800,24]].map(([x,y],i) => (
            <g key={i} opacity="0.55">
              <path d={`M ${x},${y} Q ${x-10},${y-8} ${x-20},${y-5} Q ${x-15},${y+2} ${x-10},${y+5} Q ${x-5},${y+2} ${x},${y} Z`} fill="#0a0200"/>
              <path d={`M ${x},${y} Q ${x+10},${y-8} ${x+20},${y-5} Q ${x+15},${y+2} ${x+10},${y+5} Q ${x+5},${y+2} ${x},${y} Z`} fill="#0a0200"/>
              <ellipse cx={x} cy={y+3} rx="4" ry="5" fill="#0a0200"/>
            </g>
          ))}

          {/* ── BEHOLDER ── */}
          <circle cx="838" cy="78" r="42" fill="#0a0200"/>
          <circle cx="838" cy="78" r="16" fill="#1c0800"/>
          <circle cx="838" cy="78" r="9"  fill="#dc2626" opacity="0.75"/>
          <circle cx="835" cy="75" r="3"  fill="#0a0200"/>
          {/* Eye stalks (8) */}
          {[
            [838,36,834,18,833,14],
            [862,47,876,34,880,30],
            [874,70,890,66,896,64],
            [870,94,880,112,882,118],
            [838,120,836,138,835,144],
            [814,94,800,110,796,116],
            [802,70,786,65,780,63],
            [814,47,800,34,796,30],
          ].map(([x1,y1,cx1,cy1,x2,y2], i) => (
            <g key={i}>
              <path d={`M ${x1},${y1} Q ${cx1},${cy1} ${x2},${y2}`} stroke="#0a0200" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <circle cx={x2} cy={y2} r="6"  fill="#0a0200"/>
              <circle cx={x2} cy={y2} r="2.5" fill="#7f1d1d" opacity="0.85"/>
            </g>
          ))}

          {/* ── DRAGON (upper right, large) ── */}
          {/* Tail */}
          <path d="M 990,145 Q 978,128 968,110 Q 960,95 975,88" stroke="#0a0200" strokeWidth="13" fill="none" strokeLinecap="round"/>
          <path d="M 990,145 Q 998,155 992,160 Q 982,160 978,150 Q 985,148 990,145 Z" fill="#0a0200"/>
          {/* Body */}
          <ellipse cx="1048" cy="90" rx="65" ry="32" fill="#0a0200"/>
          {/* Neck */}
          <path d="M 1005,76 Q 990,55 978,38 Q 973,26 985,18" stroke="#0a0200" strokeWidth="22" fill="none" strokeLinecap="round"/>
          {/* Head */}
          <path d="M 982,18 Q 966,10 955,5 Q 950,1 956,−2 Q 967,−1 976,8 Q 986,4 996,12 Q 1004,20 997,29 Q 989,34 982,18 Z" fill="#0a0200"/>
          {/* Lower jaw / open mouth */}
          <path d="M 955,8 Q 968,4 981,10 L 978,18 Q 967,13 956,18 Z" fill="#1c0800"/>
          {/* Flame breath */}
          <path d="M 952,10 Q 938,5 920,2 Q 930,12 925,18 Q 912,14 900,16 Q 915,24 910,32 Q 930,26 935,34" stroke="#b45309" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
          <path d="M 948,14 Q 932,12 918,14 Q 928,22 920,28" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
          {/* Left wing */}
          <path d="M 1010,75 Q 962,32 916,8 Q 938,44 942,76 Q 975,73 1010,75 Z" fill="#0a0200"/>
          <path d="M 1010,75 Q 972,50 938,26 Q 948,54 950,73" stroke="#1c0800" strokeWidth="1.5" fill="none"/>
          <path d="M 1010,75 Q 978,44 942,18 Q 950,48 952,72" stroke="#1c0800" strokeWidth="1.5" fill="none"/>
          {/* Right wing */}
          <path d="M 1086,84 Q 1130,40 1182,14 Q 1165,50 1170,84 Q 1136,82 1086,84 Z" fill="#0a0200"/>
          <path d="M 1086,84 Q 1118,56 1160,30 Q 1152,58 1155,81" stroke="#1c0800" strokeWidth="1.5" fill="none"/>
          <path d="M 1086,84 Q 1122,48 1170,20 Q 1165,50 1168,80" stroke="#1c0800" strokeWidth="1.5" fill="none"/>
          {/* Claws */}
          <path d="M 1020,118 Q 1018,132 1014,146 Q 1009,154 1003,148 M 1014,146 Q 1016,154 1020,148 M 1019,146 Q 1024,154 1027,148" stroke="#0a0200" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M 1062,120 Q 1066,134 1068,148 Q 1064,156 1058,150 M 1068,148 Q 1071,156 1074,150 M 1069,148 Q 1074,156 1078,150" stroke="#0a0200" strokeWidth="8" fill="none" strokeLinecap="round"/>
          {/* Dragon eye */}
          <circle cx="976" cy="16" r="3.5" fill="#fbbf24" opacity="0.9"/>

          {/* Ground fog overlay */}
          <rect x="0" y="108" width="1200" height="52" fill="url(#mc-fog)"/>
        </svg>

        {/* Title overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="text-center">
            <h1
              className="text-3xl font-bold tracking-widest text-amber-300 uppercase"
              style={{ textShadow: '0 0 24px rgba(217,119,6,0.9), 0 0 8px rgba(0,0,0,1), 0 2px 6px rgba(0,0,0,1)' }}
            >
              🐉 Monster Compendium
            </h1>
            <p
              className="text-sm tracking-widest mt-1 text-amber-500/80 uppercase"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,1)' }}
            >
              D&amp;D 4th Edition · {ALL_MONSTERS.length} Creatures
            </p>
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 py-3 space-y-2">

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search monsters, types, keywords…"
                value={filters.query}
                onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-amber-500 min-h-[40px]"
              />
              {filters.query && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, query: '' }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'level')}
              className="border border-stone-300 rounded-lg text-sm px-2 py-2 focus:outline-none focus:border-amber-500 min-h-[40px] bg-white"
            >
              <option value="level">Sort: Level</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>

          {/* Source chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-stone-400 uppercase w-14 flex-shrink-0">Source</span>
            {SOURCES.map(({ key, label }) => (
              <ToggleChip
                key={key}
                label={label}
                value={key}
                active={filters.sources.includes(key)}
                onToggle={(v) => toggle('sources', v, filters.sources)}
              />
            ))}
          </div>

          {/* Role chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-stone-400 uppercase w-14 flex-shrink-0">Role</span>
            {ROLES.map((role) => (
              <ToggleChip
                key={role}
                label={role}
                value={role}
                active={filters.roles.includes(role)}
                onToggle={(v) => toggle('roles', v, filters.roles)}
              />
            ))}
          </div>

          {/* Rank row */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-stone-400 uppercase w-14 flex-shrink-0">Rank</span>
            {MODIFIERS.map(({ key, label }) => (
              <ToggleChip
                key={key}
                label={label}
                value={key}
                active={filters.roleModifiers.includes(key)}
                onToggle={(v) => toggle('roleModifiers', v, filters.roleModifiers)}
              />
            ))}
          </div>

          {/* Tier row */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-stone-400 uppercase w-14 flex-shrink-0">Tier</span>
            {TIERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilters((f) => ({ ...f, tier: key }))}
                className={[
                  'px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors min-h-[32px]',
                  filters.tier === key
                    ? 'bg-amber-700 text-white border-amber-700'
                    : 'bg-white text-stone-600 border-stone-300 hover:border-amber-400',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Creature Type chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-stone-400 uppercase w-14 flex-shrink-0">Type</span>
            {ALL_CREATURE_TYPES.map((t) => (
              <ToggleChip
                key={t}
                label={t}
                value={t}
                active={filters.types.includes(t)}
                onToggle={(v) => toggle('types', v, filters.types)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Results count */}
      <div className="max-w-4xl mx-auto px-3 pt-3 pb-1 flex items-center justify-between">
        <span className="text-sm text-stone-500">
          {filtered.length === 0
            ? '0 monsters found'
            : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} monster${filtered.length !== 1 ? 's' : ''}`}
        </span>
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="text-xs text-amber-700 hover:text-amber-900 underline"
        >
          Reset filters
        </button>
      </div>

      {/* Monster list */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-stone-200 mx-3 mb-8 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <div className="text-4xl mb-3">🐉</div>
            <div className="font-semibold">No monsters match your filters</div>
            <div className="text-sm mt-1">Try broadening your search or resetting the filters</div>
          </div>
        ) : (
          paginated.map((m) => (
            <MonsterRow key={m.id} monster={m} onClick={() => setSelected(m)} />
          ))
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-4 border-t border-stone-100">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-amber-800 text-amber-100 disabled:opacity-40 hover:bg-amber-700 min-w-[80px] min-h-[44px] font-medium"
            >
              ← Prev
            </button>
            <span className="text-stone-600 font-medium text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-amber-800 text-amber-100 disabled:opacity-40 hover:bg-amber-700 min-w-[80px] min-h-[44px] font-medium"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <MonsterModal monster={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
