import { useEffect, useState } from 'react';
import type { Character } from '../../types/character';
import { LANGUAGES } from '../../data/languages';
import { RichTextDisplay } from '../ui/RichTextDisplay';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { useReadOnly } from './ReadOnlyContext';

interface Props {
  character: Character;
}

type AppearanceField = 'gender' | 'age' | 'height' | 'weight' | 'build' | 'eyeColor' | 'hairColor';

const APPEARANCE_FIELDS: { key: AppearanceField; label: string; placeholder: string }[] = [
  { key: 'gender',    label: 'Gender',     placeholder: 'e.g. Male, Female, Nonbinary' },
  { key: 'age',       label: 'Age',        placeholder: 'e.g. 27' },
  { key: 'height',    label: 'Height',     placeholder: 'e.g. 5\'10"' },
  { key: 'weight',    label: 'Weight',     placeholder: 'e.g. 165 lb' },
  { key: 'build',     label: 'Build',      placeholder: 'e.g. Lean, Stocky' },
  { key: 'eyeColor',  label: 'Eye Color',  placeholder: 'e.g. Hazel' },
  { key: 'hairColor', label: 'Hair Color', placeholder: 'e.g. Auburn' },
];

/** Resolve a language entry which may be a plain name ("Common") or an ID ("deep-speech"). */
function resolveLanguageName(entry: string): string {
  return LANGUAGES.find((l) => l.id === entry)?.name ?? entry;
}

/** Inline editable text field — saves on blur if changed. */
function AppearanceInput({
  label,
  placeholder,
  value,
  onCommit,
}: {
  label: string;
  placeholder: string;
  value: string;
  onCommit: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  // Keep the local draft in sync if the upstream character changes (e.g. cloud sync).
  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <label className="bg-stone-50 rounded-lg border border-stone-200 px-3 py-2 block focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-colors">
      <span className="text-xs text-stone-400 font-semibold block">{label}</span>
      <input
        type="text"
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== value) onCommit(draft.trim());
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            (e.currentTarget as HTMLInputElement).blur();
          } else if (e.key === 'Escape') {
            setDraft(value);
            (e.currentTarget as HTMLInputElement).blur();
          }
        }}
        className="text-sm text-stone-800 font-medium w-full bg-transparent outline-none placeholder:text-stone-300 placeholder:font-normal"
      />
    </label>
  );
}

export function ProfilePanel({ character }: Props) {
  const readOnly = useReadOnly();
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  const updateField = async (key: AppearanceField, value: string) => {
    if (character[key] === value) return;
    const patch = { [key]: value } as Partial<Character>;
    await characterRepository.patch(character.id, patch);
    updateCharacter({ ...character, ...patch });
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="bg-amber-800 px-4 py-2">
        <h3 className="text-white font-bold text-sm uppercase tracking-wide">Profile</h3>
      </div>

      <div className="p-3 space-y-4">
        {/* Appearance */}
        <div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Appearance</p>
          {readOnly ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                {APPEARANCE_FIELDS.filter(({ key }) => character[key]).map(({ key, label }) => (
                  <div key={key} className="bg-stone-50 rounded-lg border border-stone-200 px-3 py-2">
                    <p className="text-xs text-stone-400 font-semibold">{label}</p>
                    <p className="text-sm text-stone-800 font-medium">{character[key]}</p>
                  </div>
                ))}
              </div>
              {APPEARANCE_FIELDS.every(({ key }) => !character[key]) && (
                <p className="text-xs text-stone-400 italic">No appearance details recorded.</p>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {APPEARANCE_FIELDS.map(({ key, label, placeholder }) => (
                <AppearanceInput
                  key={key}
                  label={label}
                  placeholder={placeholder}
                  value={character[key] ?? ''}
                  onCommit={(next) => updateField(key, next)}
                />
              ))}
            </div>
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
    </div>
  );
}
