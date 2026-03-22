import { useEffect } from 'react';
import { useCharactersStore } from '../store/useCharactersStore';
import { useAppStore } from '../store/useAppStore';
import { CharacterSheet } from '../components/sheet/CharacterSheet';
import { useCharacterSync } from '../hooks/useCharacterSync';

export function SheetPage() {
  const activeCharacterId = useAppStore((s) => s.activeCharacterId);
  const navigate = useAppStore((s) => s.navigate);
  const character = useCharactersStore((s) =>
    activeCharacterId ? s.getCharacterById(activeCharacterId) : undefined,
  );
  const hasLoaded = useCharactersStore((s) => s.hasLoaded);
  useCharacterSync(character);

  // Only redirect after IndexedDB has finished loading — avoids a false
  // "not found" during the async startup before characters are in the store.
  useEffect(() => {
    if (hasLoaded && activeCharacterId && !character) {
      navigate('home');
    }
  }, [hasLoaded, activeCharacterId, character, navigate]);

  if (!character) {
    // Show nothing while the redirect is in flight
    return null;
  }

  return <CharacterSheet character={character} />;
}
