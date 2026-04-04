import { useCharactersStore } from '../../store/useCharactersStore';
import { useAppStore } from '../../store/useAppStore';
import { useWizardStore } from '../../store/useWizardStore';
import { CharacterListItem } from './CharacterListItem';
import { EmptyState } from './EmptyState';
import { Button } from '../ui/Button';
import { getRaceById } from '../../data/races';
import { getClassById } from '../../data/classes';

export function CharacterList() {
  const { characters, isLoading } = useCharactersStore();
  const navigate = useAppStore((s) => s.navigate);
  const wizardStep = useWizardStore((s) => s.currentStep);
  const wizardName = useWizardStore((s) => s.name);
  const wizardRaceId = useWizardStore((s) => s.raceId);
  const wizardClassId = useWizardStore((s) => s.classId);
  const resetWizard = useWizardStore((s) => s.resetWizard);

  // A draft exists if the user has progressed past step 1 or filled in meaningful data
  const hasDraft = wizardRaceId || wizardClassId || wizardName;
  const draftRace = wizardRaceId ? getRaceById(wizardRaceId) : undefined;
  const draftClass = wizardClassId ? getClassById(wizardClassId) : undefined;
  const draftLabel = [wizardName, draftRace?.name, draftClass?.name].filter(Boolean).join(' · ') || 'In progress';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-amber-700 text-lg">Loading characters...</div>
      </div>
    );
  }

  return (
    <>
      {/* ── Hero Mural Banner ─────────────────────────────────────────────── */}
      <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: '160px' }}>
        <svg
          viewBox="0 0 1200 160"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="ccSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c0a00"/>
              <stop offset="60%" stopColor="#3d1a00"/>
              <stop offset="100%" stopColor="#5c2a00"/>
            </linearGradient>
            <radialGradient id="ccGlow" cx="50%" cy="0%" r="60%">
              <stop offset="0%" stopColor="#b45309" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#1c0a00" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="ccFog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78350f" stopOpacity="0"/>
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.5"/>
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="1200" height="160" fill="url(#ccSky)"/>
          <rect width="1200" height="160" fill="url(#ccGlow)"/>

          {/* Stars */}
          <circle cx="50"   cy="12" r="1.2" fill="#fde68a" opacity="0.9"/>
          <circle cx="180"  cy="8"  r="1.5" fill="#fde68a" opacity="0.8"/>
          <circle cx="290"  cy="18" r="1"   fill="#fde68a" opacity="0.7"/>
          <circle cx="420"  cy="6"  r="1.3" fill="#fde68a" opacity="0.9"/>
          <circle cx="530"  cy="14" r="1"   fill="#fde68a" opacity="0.6"/>
          <circle cx="660"  cy="9"  r="1.4" fill="#fde68a" opacity="0.8"/>
          <circle cx="780"  cy="5"  r="1.2" fill="#fde68a" opacity="0.9"/>
          <circle cx="870"  cy="20" r="1"   fill="#fde68a" opacity="0.7"/>
          <circle cx="990"  cy="11" r="1.5" fill="#fde68a" opacity="0.8"/>
          <circle cx="1100" cy="7"  r="1.2" fill="#fde68a" opacity="0.9"/>
          <circle cx="1160" cy="16" r="1"   fill="#fde68a" opacity="0.7"/>

          {/* Ground */}
          <rect x="0" y="128" width="1200" height="32" fill="#2d1000" opacity="0.7"/>
          {/* Fog */}
          <rect width="1200" height="160" fill="url(#ccFog)" opacity="0.5"/>

          {/* ── Fighter (x≈130, armored warrior, sword raised) ───────────── */}
          {/* Body */}
          <rect x="118" y="75" width="26" height="50" rx="3" fill="#1a0800"/>
          {/* Head */}
          <ellipse cx="131" cy="68" rx="12" ry="11" fill="#1a0800"/>
          {/* Helmet crest */}
          <path d="M 122,62 L 126,50 L 140,55" fill="#1a0800"/>
          {/* Pauldrons */}
          <ellipse cx="116" cy="78" rx="9" ry="6" fill="#1a0800"/>
          <ellipse cx="146" cy="78" rx="9" ry="6" fill="#1a0800"/>
          {/* Raised sword arm */}
          <path d="M 144,82 L 162,48" stroke="#1a0800" strokeWidth="5" strokeLinecap="round"/>
          {/* Sword blade */}
          <path d="M 162,48 L 170,28" stroke="#1a0800" strokeWidth="3" strokeLinecap="round"/>
          {/* Crossguard */}
          <line x1="157" y1="52" x2="167" y2="44" stroke="#1a0800" strokeWidth="6" strokeLinecap="round"/>
          {/* Shield on left arm */}
          <ellipse cx="109" cy="93" rx="10" ry="14" fill="#1a0800"/>
          {/* Legs */}
          <rect x="119" y="122" width="10" height="14" rx="2" fill="#1a0800"/>
          <rect x="131" y="122" width="10" height="14" rx="2" fill="#1a0800"/>

          {/* ── Ranger (x≈350, hooded, bow at full draw) ────────────────── */}
          {/* Cloaked body */}
          <path d="M 338,130 L 332,92 Q 330,80 340,72 L 358,72 Q 368,80 366,92 L 360,130 Z" fill="#1a0800"/>
          {/* Hood */}
          <ellipse cx="349" cy="65" rx="13" ry="12" fill="#1a0800"/>
          <path d="M 336,60 Q 340,50 349,52 Q 358,50 362,60" fill="#1a0800"/>
          {/* Bow arc */}
          <path d="M 320,52 Q 308,75 320,98" stroke="#1a0800" strokeWidth="4" fill="none" strokeLinecap="round"/>
          {/* Bowstring */}
          <line x1="320" y1="52" x2="320" y2="98" stroke="#1a0800" strokeWidth="1.5"/>
          {/* Arrow nocked */}
          <line x1="321" y1="75" x2="367" y2="75" stroke="#1a0800" strokeWidth="2.5"/>
          {/* Arrowhead */}
          <polygon points="321,72 321,78 311,75" fill="#1a0800"/>
          {/* Draw arm */}
          <line x1="364" y1="75" x2="374" y2="78" stroke="#1a0800" strokeWidth="4" strokeLinecap="round"/>

          {/* ── Wizard (x≈600, pointed hat, glowing staff orb) ───────────── */}
          {/* Staff */}
          <rect x="576" y="35" width="5" height="97" rx="2" fill="#1a0800"/>
          {/* Orb glow layers */}
          <circle cx="578" cy="33" r="11" fill="#b45309" opacity="0.35"/>
          <circle cx="578" cy="33" r="8"  fill="#b45309" opacity="0.55"/>
          <circle cx="578" cy="33" r="5"  fill="#fbbf24" opacity="0.6"/>
          <circle cx="578" cy="33" r="3"  fill="#fde68a" opacity="0.85"/>
          {/* Robe */}
          <path d="M 586,130 L 590,90 L 592,72 L 612,72 L 614,90 L 618,130 Z" fill="#1a0800"/>
          {/* Robe flare at hem */}
          <path d="M 583,130 L 590,112 L 618,112 L 623,130 Z" fill="#1a0800"/>
          {/* Upper body */}
          <rect x="591" y="60" width="21" height="16" rx="2" fill="#1a0800"/>
          {/* Head */}
          <ellipse cx="602" cy="53" rx="11" ry="10" fill="#1a0800"/>
          {/* Hat brim */}
          <ellipse cx="602" cy="44" rx="18" ry="4" fill="#1a0800"/>
          {/* Hat cone */}
          <path d="M 586,44 L 602,10 L 618,44 Z" fill="#1a0800"/>
          {/* Arm outstretched to staff */}
          <path d="M 592,78 L 578,62" stroke="#1a0800" strokeWidth="4" strokeLinecap="round"/>

          {/* ── Rogue (x≈830, crouching, dual daggers ready) ─────────────── */}
          {/* Crouching legs */}
          <path d="M 815,130 L 820,108 L 826,100 L 840,100 L 848,108 L 853,130 Z" fill="#1a0800"/>
          {/* Upper body leaning forward */}
          <path d="M 820,105 L 822,88 Q 824,77 835,76 Q 847,77 850,88 L 848,105 Z" fill="#1a0800"/>
          {/* Hooded head */}
          <ellipse cx="837" cy="70" rx="11" ry="10" fill="#1a0800"/>
          <path d="M 826,65 Q 830,55 837,57 Q 844,55 848,65 L 837,60 Z" fill="#1a0800"/>
          {/* Left dagger thrust forward */}
          <path d="M 816,90 L 799,80" stroke="#1a0800" strokeWidth="3" strokeLinecap="round"/>
          <polygon points="799,80 793,77 795,83" fill="#1a0800"/>
          {/* Right dagger raised */}
          <path d="M 854,90 L 870,80" stroke="#1a0800" strokeWidth="3" strokeLinecap="round"/>
          <polygon points="870,80 876,77 874,83" fill="#1a0800"/>

          {/* ── Dwarf (x≈1060, stocky, horned helm, great axe) ───────────── */}
          {/* Wide stocky body */}
          <rect x="1040" y="88" width="36" height="40" rx="3" fill="#1a0800"/>
          {/* Head */}
          <ellipse cx="1058" cy="80" rx="14" ry="12" fill="#1a0800"/>
          {/* Helmet plate */}
          <rect x="1044" y="71" width="28" height="11" rx="3" fill="#1a0800"/>
          {/* Left horn */}
          <path d="M 1047,71 L 1039,54 L 1051,63" fill="#1a0800"/>
          {/* Right horn */}
          <path d="M 1069,71 L 1077,54 L 1065,63" fill="#1a0800"/>
          {/* Beard */}
          <path d="M 1044,85 Q 1051,98 1058,95 Q 1065,98 1072,85" fill="#1a0800"/>
          {/* Great axe shaft */}
          <rect x="1082" y="44" width="5" height="89" rx="2" fill="#1a0800"/>
          {/* Axe upper blade */}
          <path d="M 1087,44 L 1087,74 L 1112,59 Z" fill="#1a0800"/>
          {/* Axe lower blade */}
          <path d="M 1087,50 L 1087,73 L 1065,63 Z" fill="#1a0800"/>
          {/* Arm gripping axe */}
          <path d="M 1076,92 L 1083,72" stroke="#1a0800" strokeWidth="6" strokeLinecap="round"/>
          {/* Legs */}
          <rect x="1041" y="125" width="14" height="11" rx="2" fill="#1a0800"/>
          <rect x="1059" y="125" width="14" height="11" rx="2" fill="#1a0800"/>
        </svg>

        {/* Title overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span
            className="text-amber-100 font-black text-3xl tracking-wide leading-tight"
            style={{ textShadow: '0 0 20px #92400e, 0 2px 8px #000, 0 0 40px #b45309' }}
          >
            ⚔ Character Creator
          </span>
          <span
            className="text-amber-300 text-sm font-semibold mt-1 tracking-widest uppercase"
            style={{ textShadow: '0 0 12px #92400e, 0 2px 4px #000' }}
          >
            D&D 4th Edition
          </span>
        </div>
      </div>

      {/* ── Character list content ────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">Your Characters</h1>
            <p className="text-stone-500 text-sm mt-1">
              {characters.length} character{characters.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {characters.length > 0 && (
            <Button onClick={() => navigate('wizard')}>
              + New Character
            </Button>
          )}
        </div>

        {/* Resume draft banner */}
        {hasDraft && (
          <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-amber-900 font-semibold text-sm">Draft in progress — Step {wizardStep}/10</p>
              <p className="text-amber-700 text-xs mt-0.5 truncate">{draftLabel}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => { resetWizard(); }}
                className="px-3 py-2 text-xs font-medium text-stone-600 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 min-h-[44px] transition-colors"
              >
                Discard
              </button>
              <button
                onClick={() => navigate('wizard')}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 border border-amber-700 rounded-lg hover:bg-amber-700 min-h-[44px] transition-colors"
              >
                Resume
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {characters.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-4">
            {characters.map((char) => (
              <CharacterListItem key={char.id} character={char} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
