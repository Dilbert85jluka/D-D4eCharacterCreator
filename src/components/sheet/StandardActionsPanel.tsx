import type { Character, DerivedStats } from '../../types/character';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { useReadOnly } from './ReadOnlyContext';
import { getRaceById } from '../../data/races';

interface Props {
  character: Character;
  derived: DerivedStats;
}

export function StandardActionsPanel({ character, derived }: Props) {
  const readOnly = useReadOnly();
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const used = character.secondWindUsed ?? false;
  const race = getRaceById(character.raceId);
  const isDwarf = race?.id === 'dwarf';

  const toggleSecondWind = async () => {
    if (readOnly) return;
    const next = !used;
    await characterRepository.patch(character.id, { secondWindUsed: next });
    updateCharacter({ ...character, secondWindUsed: next });
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Standard Actions</h3>
        <p className="text-amber-300 text-xs mt-0.5">Encounter actions that use your standard action</p>
      </div>

      <div className="p-3 space-y-3">
        {/* Second Wind */}
        <div className={`rounded-lg border-2 overflow-hidden transition-all ${used ? 'border-stone-300 opacity-50' : 'border-red-300'}`}>
          {/* Header — encounter-power red */}
          <div className="bg-red-800 px-3 py-2 flex items-center justify-between gap-2 text-white">
            <div className="flex items-center gap-2">
              {/* Usage toggle circle */}
              {!readOnly && (
                <button
                  onClick={toggleSecondWind}
                  className={[
                    'w-5 h-5 rounded-full flex-shrink-0 border-2 border-white/80 transition-all',
                    'hover:border-white hover:scale-110 focus:outline-none focus:ring-1 focus:ring-white',
                    used ? 'bg-white' : 'bg-transparent',
                  ].join(' ')}
                  title={used ? 'Used — resets on Short Rest. Click to restore.' : 'Available — click to mark as used'}
                  aria-label={used ? 'Mark second wind as available' : 'Mark second wind as used'}
                />
              )}
              <span className="font-bold text-sm">Second Wind</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">Encounter</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded capitalize">
                {isDwarf ? 'Minor Action' : 'Standard Action'}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-3 py-3 bg-white space-y-3">
            {/* Quick stats row */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-stone-400 font-medium">Heals</div>
                <div className="text-xl font-bold text-emerald-700">{derived.healingSurgeValue} HP</div>
                <div className="text-xs text-stone-400">surge value</div>
              </div>
              <div className="w-px h-10 bg-stone-200" />
              <div className="text-center">
                <div className="text-xs text-stone-400 font-medium">Defense Bonus</div>
                <div className="text-xl font-bold text-blue-700">+2</div>
                <div className="text-xs text-stone-400">all defenses</div>
              </div>
              <div className="w-px h-10 bg-stone-200" />
              <div className="text-center">
                <div className="text-xs text-stone-400 font-medium">Surges Left</div>
                <div className="text-xl font-bold text-stone-800">{character.currentSurges}</div>
                <div className="text-xs text-stone-400">of {derived.surgesPerDay}</div>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs text-stone-600 leading-relaxed space-y-1">
              <p>
                <span className="font-semibold text-blue-700">Effect:</span> You spend a healing surge and regain hit points equal to your healing surge value ({derived.healingSurgeValue} HP). You gain a +2 bonus to all defenses until the start of your next turn.
              </p>
              {isDwarf && (
                <p className="text-amber-700 font-medium">
                  Dwarven Resilience: You can use your second wind as a minor action instead of a standard action.
                </p>
              )}
              <p className="text-stone-400 italic">Once per encounter. Resets on a short or extended rest.</p>
            </div>

            {/* Status */}
            <div className={`text-center py-1.5 rounded-lg text-xs font-bold ${used ? 'bg-stone-100 text-stone-400' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {used ? 'Used this encounter' : 'Available'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
