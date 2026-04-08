import { useState } from 'react';
import { useCharactersStore } from '../../store/useCharactersStore';
import { useSharingStore } from '../../store/useSharingStore';
import { useAppStore } from '../../store/useAppStore';
import { getRaceById } from '../../data/races';
import { getClassById } from '../../data/classes';

interface LinkCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  userId: string;
}

export function LinkCharacterModal({ isOpen, onClose, campaignId, userId }: LinkCharacterModalProps) {
  const characters = useCharactersStore((s) => s.characters);
  const linkCharacter = useSharingStore((s) => s.linkCharacter);
  const showToast = useAppStore((s) => s.showToast);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  const handleClose = () => {
    setSelectedId(null);
    setIsLinking(false);
    onClose();
  };

  const handleLink = async () => {
    if (!selectedId) return;

    const character = characters.find((c) => c.id === selectedId);
    if (!character) return;

    setIsLinking(true);

    try {
      await linkCharacter({
        id: character.id,
        campaign_id: campaignId,
        user_id: userId,
        name: character.name,
        class_id: character.classId,
        race_id: character.raceId,
        level: character.level,
        current_hp: character.currentHp,
        max_hp: 0, // Will be filled by auto-sync hook
        paragon_path: character.paragonPath || '',
        epic_destiny: character.epicDestiny || '',
        alignment: character.alignment || 'Unaligned',
        deity: character.deity || '',
        player_name: character.playerName || '',
        portrait_url: character.portrait || null,
        character_data: { ...character, portrait: undefined },
      });

      showToast(`Linked "${character.name}" to campaign`, 'success');
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to link character';
      showToast(message, 'error');
      setIsLinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={handleClose} />
      <div
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">Link Character</h2>
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-stone-600 text-2xl leading-none p-1 rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-stone-600">
            Select a character to share with the campaign. Other members will see their summary.
          </p>

          {/* Character List */}
          {characters.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-sm">
              No characters found. Create a character first.
            </div>
          ) : (
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {characters.map((char) => {
                const race = getRaceById(char.raceId);
                const cls = getClassById(char.classId);
                const isSelected = selectedId === char.id;

                return (
                  <button
                    key={char.id}
                    onClick={() => setSelectedId(char.id)}
                    className={
                      'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors min-h-[44px] ' +
                      (isSelected
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-amber-50/50')
                    }
                  >
                    {/* Portrait */}
                    <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-200 flex-shrink-0 flex items-center justify-center text-lg overflow-hidden">
                      {char.portrait ? (
                        <img src={char.portrait} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-amber-600">?</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-800 text-sm truncate">
                        {char.name || 'Unnamed'}
                      </p>
                      <p className="text-xs text-stone-500 truncate">
                        Level {char.level} {race?.name || 'Unknown'} {cls?.name || 'Unknown'}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    <div className={
                      'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ' +
                      (isSelected ? 'border-amber-500 bg-amber-500' : 'border-stone-300')
                    }>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Link Button */}
          <button
            onClick={handleLink}
            disabled={!selectedId || isLinking}
            className="w-full min-h-[44px] bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-xl px-4 py-3 text-sm transition-colors"
          >
            {isLinking ? 'Linking...' : 'Link Character'}
          </button>
        </div>
      </div>
    </div>
  );
}
