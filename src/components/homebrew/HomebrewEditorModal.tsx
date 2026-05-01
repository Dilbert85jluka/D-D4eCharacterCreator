import type { HomebrewContentType, HomebrewItem } from '../../types/homebrew';
import { RaceEditor } from './RaceEditor';
import { ClassEditor } from './ClassEditor';
import { PowerEditor } from './PowerEditor';
import { FeatEditor } from './FeatEditor';
import { WeaponEditor } from './WeaponEditor';
import { ArmorEditor } from './ArmorEditor';
import { GearEditor } from './GearEditor';
import { ConsumableEditor } from './ConsumableEditor';
import { MagicItemEditor } from './MagicItemEditor';
import { MagicArmorEditor } from './MagicArmorEditor';
import { MagicWeaponEditor } from './MagicWeaponEditor';
import { MagicImplementEditor } from './MagicImplementEditor';
import { MonsterEditor } from './MonsterEditor';

interface Props {
  contentType: HomebrewContentType;
  editingItem: HomebrewItem | null;
  userId: string;
  onClose: () => void;
}

const EDITORS: Record<HomebrewContentType, React.ComponentType<EditorProps>> = {
  race: RaceEditor,
  class: ClassEditor,
  power: PowerEditor,
  feat: FeatEditor,
  weapon: WeaponEditor,
  armor: ArmorEditor,
  gear: GearEditor,
  consumable: ConsumableEditor,
  magicItem: MagicItemEditor,
  magicArmor: MagicArmorEditor,
  magicWeapon: MagicWeaponEditor,
  magicImplement: MagicImplementEditor,
  monster: MonsterEditor,
};

export interface EditorProps {
  editingItem: HomebrewItem | null;
  userId: string;
  onClose: () => void;
}

export function HomebrewEditorModal({ contentType, editingItem, userId, onClose }: Props) {
  const Editor = EDITORS[contentType];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pb-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-5rem)] overflow-y-auto">
        <Editor editingItem={editingItem} userId={userId} onClose={onClose} />
      </div>
    </div>
  );
}
