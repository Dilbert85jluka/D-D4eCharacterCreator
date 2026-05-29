import { getClassById } from '../../data/classes';
import { getParagonPathById } from '../../data/paragonPaths';
import type { Character } from '../../types/character';
import { getWeaponProficiencyLabels } from '../../utils/proficiencies';

interface Props {
  character: Character;
}

// ── Feat ID → proficiency mappings ────────────────────────────────────────────
const FEAT_ARMOR: Record<string, string> = {
  'armor-proficiency-leather':   'Leather',
  'armor-proficiency-hide':      'Hide',
  'armor-proficiency-chainmail': 'Chainmail',
  'armor-proficiency-scale':     'Scale',
  'armor-proficiency-plate':     'Plate',
};

const FEAT_SHIELD: Record<string, string> = {
  'shield-proficiency-light': 'Light Shield',
  'shield-proficiency-heavy': 'Heavy Shield',
};

// Weapon proficiencies are sourced from `getWeaponProficiencyLabels(character)` so that
// the displayed list, the attack-bonus check in CombatActionsPanel, and any future
// consumers all share one source of truth (including class build-choice grants like
// Runepriest Wrathful Hammer).

// ── Render helper ─────────────────────────────────────────────────────────────
function ProficiencySection({
  title,
  items,
  pillColor = 'stone',
}: {
  title: string;
  items: string[];
  pillColor?: 'stone' | 'amber' | 'blue' | 'green';
}) {
  if (items.length === 0) return null;

  const pillClass =
    pillColor === 'amber' ? 'bg-amber-50 text-amber-800 border-amber-300'
    : pillColor === 'blue'  ? 'bg-blue-50 text-blue-800 border-blue-300'
    : pillColor === 'green' ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
    : 'bg-stone-100 text-stone-700 border-stone-300';

  return (
    <div>
      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`border rounded-full px-3 py-1 text-sm font-medium ${pillClass}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function ProficienciesPanel({ character }: Props) {
  const cls = getClassById(character.classId);

  // Start with class base proficiencies for armor / shields / implements
  // (Weapon list is built by the shared `getWeaponProficiencyLabels(character)` helper below
  // so the panel display and the combat-attack-bonus check stay in sync.)
  const armor      = new Set<string>(cls?.armorProficiencies ?? []);
  const shields    = new Set<string>(cls?.shieldProficiency ? ['Shield'] : []);
  const implements_ = new Set<string>(cls?.implements ?? []);

  // Add proficiencies granted by feats
  for (const featId of character.selectedFeatIds) {
    if (FEAT_ARMOR[featId])  armor.add(FEAT_ARMOR[featId]);
    if (FEAT_SHIELD[featId]) shields.add(FEAT_SHIELD[featId]);
  }

  // Add proficiencies from paragon path (level 11+)
  if (character.level >= 11 && character.paragonPath) {
    const path = getParagonPathById(character.paragonPath);
    path?.bonuses?.extraArmorProficiencies?.forEach((p) => armor.add(p));
  }

  const armorList      = Array.from(armor);
  const weaponList     = getWeaponProficiencyLabels(character);
  const shieldList     = Array.from(shields);
  const implementList  = Array.from(implements_);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Proficiencies</h3>
      </div>

      <div className="p-4 space-y-5">
        <ProficiencySection
          title="Armor Proficiencies"
          items={armorList}
          pillColor="amber"
        />
        <ProficiencySection
          title="Weapon Proficiencies"
          items={weaponList}
          pillColor="stone"
        />
        {shieldList.length > 0 && (
          <ProficiencySection
            title="Shield Proficiency"
            items={shieldList}
            pillColor="green"
          />
        )}
        {implementList.length > 0 && (
          <ProficiencySection
            title="Implements"
            items={implementList}
            pillColor="blue"
          />
        )}
      </div>
    </div>
  );
}
