import type { Character } from '../../types/character';
import { characterRepository } from '../../db/characterRepository';
import { useCharactersStore } from '../../store/useCharactersStore';
import { useReadOnly } from './ReadOnlyContext';
import { RichTextEditor } from '../ui/RichTextEditor';
import { RichTextDisplay } from '../ui/RichTextDisplay';

interface Props {
  character: Character;
}

export function NotesPanel({ character }: Props) {
  const readOnly = useReadOnly();
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

      <div className="p-3">
        {readOnly ? (
          <RichTextDisplay content={character.notes} />
        ) : (
          <RichTextEditor
            content={character.notes}
            onChange={updateNotes}
            placeholder="Character notes, session log, important NPCs, quest details..."
          />
        )}
      </div>
    </div>
  );
}
