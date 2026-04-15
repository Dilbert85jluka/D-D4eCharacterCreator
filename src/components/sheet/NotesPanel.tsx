import { useState } from 'react';
import type { Character } from '../../types/character';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { LANGUAGES } from '../../data/languages';
import { useReadOnly } from './ReadOnlyContext';
import { RichTextEditor } from '../ui/RichTextEditor';
import { RichTextDisplay } from '../ui/RichTextDisplay';

interface Props {
  character: Character;
}

/** Resolve a language entry which may be a plain name ("Common") or an ID ("deep-speech"). */
function resolveLanguageName(entry: string): string {
  return LANGUAGES.find((l) => l.id === entry)?.name ?? entry;
}

export function NotesPanel({ character }: Props) {
  const readOnly = useReadOnly();
  const [activeTab, setActiveTab] = useState<'notes' | 'profile'>('notes');
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const updateNotes = async (notes: string) => {
    const updated = { ...character, notes };
    await characterRepository.patch(character.id, { notes });
    updateCharacter(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Notes</h3>
      </div>

      <div className="flex border-b border-stone-200">
        {(['notes', 'profile'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={[
              'flex-1 py-2.5 text-sm font-semibold capitalize transition-colors min-h-[44px]',
              activeTab === t ? 'border-b-2 border-amber-600 text-amber-700' : 'text-stone-500 hover:text-stone-700',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-3">
        {activeTab === 'notes' && (
          readOnly ? (
            <RichTextDisplay content={character.notes} />
          ) : (
            <RichTextEditor
              content={character.notes}
              onChange={updateNotes}
              placeholder="Character notes, session log, important NPCs, quest details..."
            />
          )
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Appearance */}
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Appearance</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Gender',     value: character.gender },
                  { label: 'Age',        value: character.age },
                  { label: 'Height',     value: character.height },
                  { label: 'Weight',     value: character.weight },
                  { label: 'Build',      value: character.build },
                  { label: 'Eye Color',  value: character.eyeColor },
                  { label: 'Hair Color', value: character.hairColor },
                ].filter((row) => row.value).map(({ label, value }) => (
                  <div key={label} className="bg-stone-50 rounded-lg border border-stone-200 px-3 py-2">
                    <p className="text-xs text-stone-400 font-semibold">{label}</p>
                    <p className="text-sm text-stone-800 font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {!character.gender && !character.height && !character.build && !character.eyeColor && (
                <p className="text-xs text-stone-400 italic">No appearance details recorded.</p>
              )}
            </div>

            {/* Languages */}
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Languages</p>
              {(character.selectedLanguages ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(character.selectedLanguages ?? []).map((lang) => {
                    const displayName = resolveLanguageName(lang);
                    return (
                      <span
                        key={lang}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                                   bg-amber-100 text-amber-800 border border-amber-200"
                      >
                        {displayName}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic">No languages recorded.</p>
              )}
            </div>

            {/* Background */}
            {character.background && (
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Background</p>
                <RichTextDisplay content={character.background} className="text-sm text-stone-700 leading-relaxed" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
