import { useState } from 'react';
import type { Character } from '../../types/character';
import { getRaceById } from '../../data/races';
import { getClassById } from '../../data/classes';
import { useAppStore } from '../../store/useAppStore';
import { useCharactersStore } from '../../store/useCharactersStore';
import { RoleBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface Props {
  character: Character;
}

export function CharacterListItem({ character }: Props) {
  const [showDelete, setShowDelete] = useState(false);
  const navigate = useAppStore((s) => s.navigate);
  const deleteCharacter = useCharactersStore((s) => s.deleteCharacter);
  const race = getRaceById(character.raceId);
  const cls = getClassById(character.classId);

  const handleDelete = async () => {
    await deleteCharacter(character.id);
    setShowDelete(false);
  };

  const hpDisplay = `${character.currentHp} HP`;

  return (
    <>
      <div
        className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden
                   hover:shadow-md hover:border-amber-300 transition-all cursor-pointer"
        onClick={() => navigate('sheet', character.id)}
      >
        <div className="flex items-start p-4 gap-4">
          {/* Portrait */}
          <div className="w-14 h-14 rounded-xl bg-amber-100 border border-amber-200 flex-shrink-0
                          flex items-center justify-center text-2xl overflow-hidden">
            {character.portrait
              ? <img src={character.portrait} alt={character.name} className="w-full h-full object-cover" />
              : (cls?.role === 'Controller' ? '🧙' :
                 cls?.role === 'Defender' ? '🛡️' :
                 cls?.role === 'Leader' ? '⚕️' : '🗡️')
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-stone-800 text-lg leading-tight truncate">
                {character.name}
              </h3>
              <span className="flex-shrink-0 bg-amber-100 text-amber-800 text-xs font-bold
                               px-2 py-1 rounded-full border border-amber-200">
                Lv {character.level}
              </span>
            </div>
            <p className="text-stone-500 text-sm mt-0.5">
              {race?.name} · {cls?.name}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {cls && <RoleBadge role={cls.role} />}
              <span className="text-xs text-stone-400">{hpDisplay}</span>
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div
          className="flex border-t border-stone-100 divide-x divide-stone-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => navigate('sheet', character.id)}
            className="flex-1 py-3 text-sm text-amber-700 font-medium hover:bg-amber-50 transition-colors min-h-[44px]"
          >
            Open Sheet
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
          >
            Delete
          </button>
        </div>
      </div>

      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Character?"
      >
        <p className="text-stone-600 mb-6">
          Are you sure you want to delete <strong>{character.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth onClick={handleDelete}>
            Delete Forever
          </Button>
        </div>
      </Modal>
    </>
  );
}
