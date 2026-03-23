import { useState } from 'react';
import type { Character, PowerUsage } from '../../types/character';
import { useCharacterDerived } from '../../hooks/useCharacterDerived';
import type { PowerData } from '../../types/gameData';
import { getPowerById } from '../../data/powers';
import { PowerCard } from '../wizard/shared/PowerCard';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { isPsionicClass, getMaxPowerPoints, parseAugments, getNonAugmentSpecialText } from '../../utils/psionics';

const PAGE_SIZE = 9;

interface Props {
  character: Character;
}

export function QuickTrayPanel({ character }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState(0);
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const derived = useCharacterDerived(character);
  const abilityMods = derived.abilityModifiers;
  const trayIds = character.quickTrayPowerIds ?? [];
  const trayPowers = trayIds
    .map((id) => ({ id, power: getPowerById(id) }))
    .filter((entry): entry is { id: string; power: PowerData } => !!entry.power);

  // Psionic support
  const isPsionic = isPsionicClass(character.classId);
  const maxPP = isPsionic ? getMaxPowerPoints(character.level) : 0;
  const currentPP = isPsionic ? (character.currentPowerPoints ?? maxPP) : 0;

  // ── DB helper ──
  const patch = async (changes: Partial<Character>) => {
    await characterRepository.patch(character.id, changes);
    updateCharacter({ ...character, ...changes });
  };

  const removeFromTray = async (powerId: string) => {
    const quickTrayPowerIds = trayIds.filter((id) => id !== powerId);
    await patch({ quickTrayPowerIds });
  };

  const toggleUsed = async (powerId: string, usage: PowerUsage) => {
    if (usage === 'at-will') return;
    if (usage === 'encounter') {
      const usedEncounterPowers = character.usedEncounterPowers.includes(powerId)
        ? character.usedEncounterPowers.filter((id) => id !== powerId)
        : [...character.usedEncounterPowers, powerId];
      await patch({ usedEncounterPowers });
    } else {
      const usedDailyPowers = character.usedDailyPowers.includes(powerId)
        ? character.usedDailyPowers.filter((id) => id !== powerId)
        : [...character.usedDailyPowers, powerId];
      await patch({ usedDailyPowers });
    }
  };

  const isUsed = (power: PowerData): boolean => {
    if (power.usage === 'encounter') return character.usedEncounterPowers.includes(power.id);
    if (power.usage === 'daily') return character.usedDailyPowers.includes(power.id);
    return false;
  };

  const spendAugment = async (cost: number) => {
    const newPP = Math.max(0, currentPP - cost);
    await patch({ currentPowerPoints: newPP });
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(trayPowers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * PAGE_SIZE;
  const pagePowers = trayPowers.slice(pageStart, pageStart + PAGE_SIZE);
  const emptySlots = safePage < totalPages - 1 ? 0 : PAGE_SIZE - pagePowers.length;

  return (
    <div className="bg-white rounded-xl border border-amber-300 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <span className="text-sm font-bold text-amber-800">Quick Access Powers</span>
          <span className="text-[10px] bg-amber-200 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
            {trayPowers.length}
          </span>
        </div>
        <span className="text-amber-600 text-sm">{collapsed ? '▼' : '▲'}</span>
      </button>

      {!collapsed && (
        <div className="p-3">
          {trayPowers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-stone-400 text-sm">No powers pinned yet</p>
              <p className="text-stone-300 text-xs mt-1">
                Use the ⚡ button on any power in the Powers or Actions tab to pin it here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {pagePowers.map(({ id, power }) => {
                // Psionic augment props
                const psionicAugmentProps = isPsionic && power.usage === 'at-will' && power.special
                  ? (() => {
                      const options = parseAugments(power.special);
                      if (options.length === 0) return {};
                      return {
                        augmentOptions: options,
                        currentPowerPoints: currentPP,
                        nonAugmentSpecialText: getNonAugmentSpecialText(power.special),
                        onSpendAugment: (cost: number) => spendAugment(cost),
                      };
                    })()
                  : {};

                return (
                  <div key={id}>
                    {/* Remove button */}
                    <div className="flex items-center justify-end mb-0.5 px-1">
                      <button
                        onClick={() => removeFromTray(id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-100 text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors text-sm leading-none border border-stone-200"
                        title="Remove from quick tray"
                      >×</button>
                    </div>
                    <PowerCard
                      power={power}
                      used={isUsed(power)}
                      onToggleUsed={
                        power.usage !== 'at-will'
                          ? () => toggleUsed(id, power.usage)
                          : undefined
                      }
                      abilityModifiers={abilityMods}
                      {...psionicAugmentProps}
                    />
                  </div>
                );
              })}

              {/* Empty placeholder slots */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="border-2 border-dashed border-stone-200 rounded-lg flex items-center justify-center min-h-[120px] bg-stone-50/50"
                >
                  <span className="text-stone-300 text-xs text-center px-2">Empty slot</span>
                </div>
              ))}

            {/* Page navigation */}
            {totalPages > 1 && (
              <div className="col-span-3 flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setPage(Math.max(0, safePage - 1))}
                  disabled={safePage === 0}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold min-h-[44px] min-w-[44px]"
                >←</button>
                <span className="text-xs font-semibold text-stone-500">
                  Page {safePage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
                  disabled={safePage >= totalPages - 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold min-h-[44px] min-w-[44px]"
                >→</button>
              </div>
            )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
