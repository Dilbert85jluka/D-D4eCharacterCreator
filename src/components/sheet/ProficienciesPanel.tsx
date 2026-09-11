import type { Character } from '../../types/character';
import { getWeaponProficiencyLabels, getGearProficiencies } from '../../utils/proficiencies';

interface Props {
  character: Character;
}

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
  // Armor / shields / implements (class + feat grants + paragon extras) and the
  // weapon list both come from src/utils/proficiencies.ts, so this panel, the
  // attack-bonus check in CombatActionsPanel and the printable sheet cannot drift.
  const { armor: armorList, shields: shieldList, implements: implementList } =
    getGearProficiencies(character);
  const weaponList = getWeaponProficiencyLabels(character);

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
