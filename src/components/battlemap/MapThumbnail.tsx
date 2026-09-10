import type { BattleMap } from '../../types/battlemap';
import { useMapImage } from './useMapImage';

/** Small preview of a map. Shares the same blob → remote-URL resolution as the
 *  board, so a thumbnail also works offline and back-fills the local cache. */
export function MapThumbnail({ map, className = '' }: { map: BattleMap; className?: string }) {
  const { src, status } = useMapImage(map);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={map.name} className="w-full h-full object-cover" draggable={false} />
      ) : (
        <div className="w-full h-full grid place-items-center text-stone-500 text-xs">
          {status === 'loading' ? 'Loading…' : 'No image'}
        </div>
      )}
    </div>
  );
}
