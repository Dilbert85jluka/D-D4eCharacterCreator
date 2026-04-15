import type { Character, DerivedStats, Ability } from '../../types/character';
import type { WeaponData } from '../../types/gameData';
import type { ClassData } from '../../types/gameData';
import { WEAPONS } from '../../data/equipment/weapons';
import { getClassById } from '../../data/classes';
import { formatModifier } from '../../utils/abilityScores';

interface Props {
  character: Character;
  derived: DerivedStats;
}

function isProficientWith(weapon: WeaponData, cls: ClassData): boolean {
  const profs = cls.weaponProficiencies.map((p) => p.toLowerCase());
  return profs.some(
    (p) =>
      p === weapon.category.toLowerCase() ||
      p === weapon.name.toLowerCase(),
  );
}

function weaponAbilityMod(weapon: WeaponData, mods: Record<Ability, number>): number {
  return weapon.category.toLowerCase().includes('ranged') ? mods.dex : mods.str;
}

function formatDamageTotal(weapon: WeaponData, abilityMod: number, featBonus: number): string {
  const total = abilityMod + featBonus;
  if (total === 0) return weapon.damage;
  return `${weapon.damage}${total > 0 ? '+' : ''}${total}`;
}

/** Compute feat-based damage bonus for a specific weapon based on character's selected feats. */
function weaponFeatDamageBonus(weapon: WeaponData, character: Character): { bonus: number; source: string } {
  const feats = character.selectedFeatIds;
  const props = weapon.properties.map((p) => p.toLowerCase());
  const nameLower = weapon.name.toLowerCase();
  const level = character.level;
  let bonus = 0;
  let source = '';

  // Dwarven Weapon Training: +2 damage with axes and hammers
  if (feats.includes('dwarven-weapon-training') && (props.includes('axe') || props.includes('hammer'))) {
    bonus += 2;
    source = 'Dwarven Weapon Training';
  }

  // Eladrin Soldier: +2 damage with longswords and spears
  if (feats.includes('eladrin-soldier') && (nameLower === 'longsword' || props.includes('spear'))) {
    bonus += 2;
    source = source ? `${source}, Eladrin Soldier` : 'Eladrin Soldier';
  }

  // Goliath Greatweapon Prowess: +2/+3/+4 damage with two-handed simple/military melee weapons
  if (feats.includes('goliath-greatweapon-prowess') &&
      props.includes('two-handed') &&
      (weapon.category === 'Simple Melee' || weapon.category === 'Military Melee')) {
    const gwpBonus = level >= 21 ? 4 : level >= 11 ? 3 : 2;
    bonus += gwpBonus;
    source = source ? `${source}, Goliath Greatweapon` : 'Goliath Greatweapon';
  }

  return { bonus, source };
}

export function CombatActionsPanel({ character, derived }: Props) {
  const cls = getClassById(character.classId);
  const halfLevel = Math.floor(character.level / 2);
  const mods = derived.abilityModifiers;

  // Only show weapons that are currently equipped
  const equippedWeapons = character.equipment
    .filter((item) => item.equipped)
    .map((item) => ({ item, weapon: WEAPONS.find((w) => w.id === item.itemId) }))
    .filter((entry): entry is { item: typeof entry.item; weapon: WeaponData } => !!entry.weapon);

  const strMod = mods.str;
  const unarmedAttack = strMod + halfLevel;
  const unarmedDamage = 1 + strMod;

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Combat Actions</h3>
        <p className="text-amber-300 text-xs mt-0.5">Equip weapons and armor from the Inventory tab</p>
      </div>

      <div className="p-3 space-y-3">

        {/* Empty state — no equipped weapons */}
        {equippedWeapons.length === 0 && (
          <p className="text-stone-400 text-sm text-center py-3">
            No weapons equipped — visit the{' '}
            <span className="font-semibold text-amber-600">Inventory</span> tab to equip one.
          </p>
        )}

        {/* Equipped weapon cards */}
        {equippedWeapons.map(({ item, weapon }) => {
          const proficient = cls ? isProficientWith(weapon, cls) : false;
          const abilityMod = weaponAbilityMod(weapon, mods);
          const profBonus = proficient ? weapon.proficiencyBonus : 0;
          const weaponTalentBonus = (character.classId === 'fighter' && proficient) ? 1 : 0;
          const attackBonus = abilityMod + halfLevel + profBonus + weaponTalentBonus;
          const isRanged = weapon.category.toLowerCase().includes('ranged');
          const featDmg = weaponFeatDamageBonus(weapon, character);

          return (
            <div
              key={item.instanceId ?? item.itemId}
              className="rounded-lg border border-amber-300 border-l-4 border-l-amber-500 bg-amber-50"
            >
              {/* Weapon name row */}
              <div className="px-3 pt-2.5 pb-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-stone-800 text-sm">{weapon.name}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                    Equipped
                  </span>
                  {proficient ? (
                    <span className="text-xs text-emerald-600 font-semibold">✓ Proficient</span>
                  ) : (
                    <span className="text-xs text-amber-600 font-semibold">⚠ Not proficient</span>
                  )}
                </div>
                {/* Category + properties */}
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-xs bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded">
                    {weapon.category}
                  </span>
                  {weapon.properties.map((prop) => (
                    <span
                      key={prop}
                      className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded border border-stone-200"
                    >
                      {prop}
                    </span>
                  ))}
                  {weapon.range && (
                    <span className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded border border-stone-200">
                      Range {weapon.range}
                    </span>
                  )}
                </div>
              </div>

              {/* Attack / Damage stats */}
              <div className="px-3 pb-2.5 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xs text-stone-400 font-medium">Attack</div>
                  <div className="text-base font-bold text-stone-800">
                    {formatModifier(attackBonus)} vs AC
                  </div>
                  <div className="text-xs text-stone-400">
                    {formatModifier(abilityMod)} {isRanged ? 'DEX' : 'STR'}
                    {halfLevel > 0 ? ` +${halfLevel} lvl` : ''}
                    {proficient ? ` +${weapon.proficiencyBonus} prof` : ' (no prof)'}
                    {weaponTalentBonus > 0 ? ' +1 talent' : ''}
                  </div>
                </div>
                <div className="w-px h-8 bg-stone-200" />
                <div className="text-center">
                  <div className="text-xs text-stone-400 font-medium">Damage</div>
                  <div className="text-base font-bold text-stone-800">
                    {formatDamageTotal(weapon, abilityMod, featDmg.bonus)}
                  </div>
                  <div className="text-xs text-stone-400">
                    {weapon.damage} + {isRanged ? 'DEX' : 'STR'} {formatModifier(abilityMod)}
                    {featDmg.bonus > 0 && <span className="text-amber-600"> +{featDmg.bonus} {featDmg.source}</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-xs text-stone-400 font-medium uppercase tracking-wide">Always available</span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Unarmed Strike */}
        <div className="bg-stone-50 rounded-lg border border-stone-200 px-3 py-2.5">
          <div className="mb-2">
            <span className="font-bold text-stone-800 text-sm">Unarmed Strike</span>
            <span className="ml-2 text-xs bg-stone-200 text-stone-500 px-1.5 py-0.5 rounded">Melee</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-stone-400 font-medium">Attack</div>
              <div className="text-base font-bold text-stone-800">
                {formatModifier(unarmedAttack)} vs AC
              </div>
              <div className="text-xs text-stone-400">
                {formatModifier(strMod)} STR{halfLevel > 0 ? ` +${halfLevel} lvl` : ''}
              </div>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div className="text-center">
              <div className="text-xs text-stone-400 font-medium">Damage</div>
              <div className="text-base font-bold text-stone-800">
                {Math.max(1, unarmedDamage)}
              </div>
              <div className="text-xs text-stone-400">
                1 + STR {formatModifier(strMod)}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
