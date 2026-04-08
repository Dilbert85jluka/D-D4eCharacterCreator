import type { Character } from '../../types/character';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { useReadOnly } from './ReadOnlyContext';

interface Props {
  character: Character;
}

type CoinKey = 'goldPieces' | 'silverPieces' | 'copperPieces';

const COINS: { key: CoinKey; label: string; abbr: string; textColor: string; bg: string; border: string }[] = [
  { key: 'goldPieces',   label: 'Gold',   abbr: 'gp', textColor: 'text-yellow-600', bg: 'bg-yellow-50',  border: 'border-yellow-200' },
  { key: 'silverPieces', label: 'Silver', abbr: 'sp', textColor: 'text-stone-500',  bg: 'bg-stone-50',   border: 'border-stone-200'  },
  { key: 'copperPieces', label: 'Copper', abbr: 'cp', textColor: 'text-orange-700', bg: 'bg-orange-50',  border: 'border-orange-200' },
];

export function CurrencyPanel({ character }: Props) {
  const readOnly = useReadOnly();
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const patch = async (changes: Partial<Character>) => {
    await characterRepository.patch(character.id, changes);
    updateCharacter({ ...character, ...changes });
  };

  const adjust = (key: CoinKey, delta: number) => {
    const next = Math.max(0, (character[key] as number) + delta);
    patch({ [key]: next } as Partial<Character>);
  };

  const setValue = (key: CoinKey, raw: string) => {
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 0) {
      patch({ [key]: num } as Partial<Character>);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Coin Purse</h3>
      </div>

      <div className="p-3 space-y-2">
        {COINS.map(({ key, label, abbr, textColor, bg, border }) => (
          <div key={key} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${bg} border ${border}`}>
            {/* Label */}
            <span className={`text-sm font-bold w-12 flex-shrink-0 ${textColor}`}>{label}</span>
            <span className="text-xs text-stone-400 w-5 flex-shrink-0">{abbr}</span>

            {/* Subtract 10 */}
            {!readOnly && (
              <button
                onClick={() => adjust(key, -10)}
                className="w-9 h-9 rounded-lg bg-white border border-stone-300 text-stone-500 text-xs font-bold hover:bg-stone-50 hover:border-stone-400 transition-colors flex-shrink-0 flex items-center justify-center"
                title="Subtract 10"
              >−10</button>
            )}

            {/* Subtract 1 */}
            {!readOnly && (
              <button
                onClick={() => adjust(key, -1)}
                className="w-9 h-9 rounded-lg bg-white border border-stone-300 text-stone-600 text-lg font-bold hover:bg-stone-50 hover:border-stone-400 transition-colors flex-shrink-0 flex items-center justify-center"
              >−</button>
            )}

            {/* Editable amount */}
            <input
              type="number"
              min={0}
              value={character[key] as number}
              onChange={(e) => setValue(key, e.target.value)}
              disabled={readOnly}
              className="flex-1 text-center font-bold text-stone-800 text-base bg-white border border-stone-200 rounded-lg px-2 py-1.5 outline-none focus:border-amber-400 min-w-0"
            />

            {/* Add 1 */}
            {!readOnly && (
              <button
                onClick={() => adjust(key, 1)}
                className="w-9 h-9 rounded-lg bg-white border border-stone-300 text-stone-600 text-lg font-bold hover:bg-stone-50 hover:border-stone-400 transition-colors flex-shrink-0 flex items-center justify-center"
              >+</button>
            )}

            {/* Add 10 */}
            {!readOnly && (
              <button
                onClick={() => adjust(key, 10)}
                className="w-9 h-9 rounded-lg bg-white border border-stone-300 text-stone-500 text-xs font-bold hover:bg-stone-50 hover:border-stone-400 transition-colors flex-shrink-0 flex items-center justify-center"
                title="Add 10"
              >+10</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
