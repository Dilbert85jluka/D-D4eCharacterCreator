import { useState } from 'react';
import type { Character } from '../../types/character';
import { useCharacterDerived } from '../../hooks/useCharacterDerived';
import { SheetHeader } from './SheetHeader';
import { AbilityBlock } from './AbilityBlock';
import { DefensesBlock } from './DefensesBlock';
import { HitPointsBlock } from './HitPointsBlock';
import { SkillsPanel } from './SkillsPanel';
import { CombatActionsPanel } from './CombatActionsPanel';
import { PowersPanel } from './PowersPanel';
import { ParagonPanel } from './ParagonPanel';
import { FeatsPanel } from './FeatsPanel';
import { CurrencyPanel } from './CurrencyPanel';
import { EquipmentPanel } from './EquipmentPanel';
import { NotesPanel } from './NotesPanel';
import { ProficienciesPanel } from './ProficienciesPanel';
import { ChannelDivinityPanel, CHANNEL_DIVINITY_CLASSES } from './ChannelDivinityPanel';
import { getFeatById } from '../../data/feats';
import { getPowerById } from '../../data/powers';
import { DisciplinePowersPanel, DISCIPLINE_CLASSES } from './DisciplinePowersPanel';
import { ArcaneImplementMasteryPanel } from './ArcaneImplementMasteryPanel';
import { EldritchPactPanel } from './EldritchPactPanel';
import { ClassFeaturesPanel } from './ClassFeaturesPanel';
import { RacialFeaturesPanel } from './RacialFeaturesPanel';
import { AvailableActionsPanel } from './AvailableActionsPanel';
import { ActionsByTypePanel } from './ActionsByTypePanel';
import { QuickTrayPanel } from './QuickTrayPanel';
import { DiceRollerModal } from '../dice/DiceRollerModal';
import { RitualsPanel } from './RitualsPanel';
import { SpellbookPanel } from './SpellbookPanel';

type Tab = 'combat' | 'powers' | 'features' | 'paragon' | 'inventory' | 'notes';

interface Props {
  character: Character;
}

export function CharacterSheet({ character }: Props) {
  const derived = useCharacterDerived(character);
  const [activeTab, setActiveTab] = useState<Tab>('combat');
  const [showDiceRoller, setShowDiceRoller] = useState(false);

  type CombatTab = 'actions' | 'available-actions' | 'proficiencies';
  const [combatTab, setCombatTab] = useState<CombatTab>('actions');
  const combatTabs: { key: CombatTab; label: string }[] = [
    { key: 'actions',           label: 'Available Actions'    },
    { key: 'available-actions', label: 'Actions Descriptions' },
    { key: 'proficiencies',     label: 'Proficiencies'        },
  ];

  const hasClassCd = (CHANNEL_DIVINITY_CLASSES as readonly string[]).includes(character.classId);
  const hasFeatCd = character.selectedFeatIds.some((fid) => {
    const feat = getFeatById(fid);
    return feat?.grantedPowerIds?.some((pid) => {
      const power = getPowerById(pid);
      return power?.keywords.includes('Channel Divinity');
    });
  });
  const hasChannelDivinity = hasClassCd || hasFeatCd;
  const hasDisciplinePowers = (DISCIPLINE_CLASSES as readonly string[]).includes(character.classId);
  const hasArcaneImplementMastery = character.classId === 'wizard';
  const hasEldritchPact = character.classId === 'warlock';
  type PowersTab = 'powers' | 'channel-divinity' | 'discipline-powers' | 'arcane-implement' | 'eldritch-pact' | 'feats';
  const [powersTab, setPowersTab] = useState<PowersTab>('powers');
  const powersTabs: { key: PowersTab; label: string }[] = [
    { key: 'powers',           label: 'Powers'             },
    ...(hasChannelDivinity        ? [{ key: 'channel-divinity'  as PowersTab, label: 'Channel Divinity'  }] : []),
    ...(hasDisciplinePowers       ? [{ key: 'discipline-powers' as PowersTab, label: character.classId === 'ardent' ? 'Ardent Powers' : character.classId === 'battlemind' ? 'Battlemind Powers' : 'Discipline Powers' }] : []),
    ...(hasArcaneImplementMastery ? [{ key: 'arcane-implement'  as PowersTab, label: 'Implement Mastery' }] : []),
    ...(hasEldritchPact           ? [{ key: 'eldritch-pact'    as PowersTab, label: 'Eldritch Pact'     }] : []),
    { key: 'feats',              label: 'Feats'              },
  ];

  type FeaturesTab = 'class' | 'racial';
  const [featuresTab, setFeaturesTab] = useState<FeaturesTab>('class');
  const featuresTabs: { key: FeaturesTab; label: string }[] = [
    { key: 'class',  label: 'Class Features'  },
    { key: 'racial', label: 'Racial Features' },
  ];

  type InventoryTab = 'purse' | 'equipment' | 'rituals' | 'spellbooks';
  const [inventoryTab, setInventoryTab] = useState<InventoryTab>('equipment');
  const inventoryTabs: { key: InventoryTab; label: string }[] = [
    { key: 'purse',      label: 'Coin Purse'  },
    { key: 'equipment',  label: 'Equipment'   },
    { key: 'rituals',    label: 'Rituals'     },
    { key: 'spellbooks', label: 'Spellbooks'  },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'combat',    label: 'Actions'   },
    { key: 'powers',    label: 'Powers'    },
    { key: 'features',  label: 'Features'  },
    { key: 'paragon',   label: 'Paragon'   },
    { key: 'inventory', label: 'Inventory' },
    { key: 'notes',     label: 'Notes'     },
  ];

  return (
    <div className="bg-parchment-100 min-h-screen pb-8">
      <SheetHeader character={character} derived={derived} />

      <div className="max-w-6xl mx-auto px-3 pt-4 flex flex-col md:flex-row gap-4 md:items-stretch">

        {/* Left pair: Column 1 + 2 share a sub-flex so Skills matches HP block bottom */}
        <div className="flex flex-col md:flex-row md:flex-shrink-0 gap-4 md:items-stretch">

          {/* Column 1: Abilities + Defenses + HP */}
          <div className="w-full md:w-64 flex flex-col gap-4">
            <AbilityBlock character={character} derived={derived} />
            <DefensesBlock derived={derived} />
            <HitPointsBlock character={character} derived={derived} />
          </div>

          {/* Column 2: Skills */}
          <div className="w-full md:w-64 flex flex-col">
            <SkillsPanel character={character} derived={derived} />
          </div>

        </div>

        {/* Column 3: zero intrinsic height (relative + absolute inner) so Column 1 drives outer height */}
        <div className="flex-1 min-w-0 relative">
        <div className="absolute inset-0 flex flex-col gap-4 overflow-hidden">

          {/* Tab bar — pinned, never scrolls */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex-shrink-0">
            <div className="flex">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={[
                    'flex-1 py-3 text-sm font-semibold transition-colors',
                    activeTab === key
                      ? 'border-b-2 border-amber-600 text-amber-700'
                      : 'text-stone-500 hover:text-stone-700',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content — sub-tab bars are pinned flex items; panels scroll inside flex-1 wrapper */}
          {activeTab === 'combat' && (
            <>
              {/* Combat sub-tab bar — pinned */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex-shrink-0">
                <div className="flex">
                  {combatTabs.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setCombatTab(key)}
                      className={[
                        'flex-1 py-3 text-sm font-semibold transition-colors',
                        combatTab === key
                          ? 'border-b-2 border-amber-600 text-amber-700'
                          : 'text-stone-500 hover:text-stone-700',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                {combatTab === 'actions'            && (
                  <div className="space-y-3">
                    <CombatActionsPanel character={character} derived={derived} />
                    <ActionsByTypePanel character={character} />
                  </div>
                )}
                {combatTab === 'available-actions' && <AvailableActionsPanel />}
                {combatTab === 'proficiencies'     && <ProficienciesPanel character={character} />}
              </div>
            </>
          )}
          {activeTab === 'powers' && (
            <>
              {/* Powers sub-tab bar — pinned */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex-shrink-0">
                <div className="flex">
                  {powersTabs.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setPowersTab(key)}
                      className={[
                        'flex-1 py-3 text-sm font-semibold transition-colors',
                        powersTab === key
                          ? 'border-b-2 border-amber-600 text-amber-700'
                          : 'text-stone-500 hover:text-stone-700',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                {powersTab === 'powers'            && <PowersPanel character={character} />}
                {powersTab === 'channel-divinity'  && <ChannelDivinityPanel character={character} />}
                {powersTab === 'discipline-powers' && <DisciplinePowersPanel character={character} />}
                {powersTab === 'arcane-implement'  && <ArcaneImplementMasteryPanel character={character} />}
                {powersTab === 'eldritch-pact'   && <EldritchPactPanel character={character} />}
                {powersTab === 'feats'            && <FeatsPanel character={character} />}
              </div>
            </>
          )}
          {activeTab === 'features' && (
            <>
              {/* Features sub-tab bar — pinned */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex-shrink-0">
                <div className="flex">
                  {featuresTabs.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFeaturesTab(key)}
                      className={[
                        'flex-1 py-3 text-sm font-semibold transition-colors',
                        featuresTab === key
                          ? 'border-b-2 border-amber-600 text-amber-700'
                          : 'text-stone-500 hover:text-stone-700',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                {featuresTab === 'class'  && <ClassFeaturesPanel character={character} />}
                {featuresTab === 'racial' && <RacialFeaturesPanel character={character} />}
              </div>
            </>
          )}
          {activeTab === 'paragon' && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ParagonPanel character={character} />
            </div>
          )}
          {activeTab === 'inventory' && (
            <>
              {/* Inventory sub-tab bar — pinned */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex-shrink-0">
                <div className="flex">
                  {inventoryTabs.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setInventoryTab(key)}
                      className={[
                        'flex-1 py-3 text-sm font-semibold transition-colors',
                        inventoryTab === key
                          ? 'border-b-2 border-amber-600 text-amber-700'
                          : 'text-stone-500 hover:text-stone-700',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                {inventoryTab === 'purse'      && <CurrencyPanel character={character} />}
                {inventoryTab === 'equipment'  && <EquipmentPanel character={character} derived={derived} />}
                {inventoryTab === 'rituals'    && <RitualsPanel character={character} />}
                {inventoryTab === 'spellbooks' && <SpellbookPanel character={character} />}
              </div>
            </>
          )}
          {activeTab === 'notes' && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <NotesPanel character={character} />
            </div>
          )}

        </div>{/* end absolute inner */}
        </div>{/* end Column 3 */}
      </div>

      {/* ── Quick Access Powers Tray ── */}
      <div className="max-w-6xl mx-auto px-3 mt-4">
        <QuickTrayPanel character={character} />
      </div>

      {/* ── Floating Dice Roller FAB ── */}
      <button
        onClick={() => setShowDiceRoller(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white shadow-lg flex items-center justify-center text-2xl transition-colors"
        title="Dice Roller"
        aria-label="Open dice roller"
      >
        🎲
      </button>

      <DiceRollerModal isOpen={showDiceRoller} onClose={() => setShowDiceRoller(false)} />
    </div>
  );
}
