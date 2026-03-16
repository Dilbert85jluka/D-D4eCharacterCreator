import { useState } from 'react';
import { useWizardStore } from '../../../store/useWizardStore';
import { getClassById } from '../../../data/classes';
import { CLASSES } from '../../../data/classes';
import { getPowersByClass } from '../../../data/powers';
import { PowerCard } from '../shared/PowerCard';
import type { PowerUsage } from '../../../types/character';

type Tab = 'at-will' | 'encounter' | 'daily';

export function Step6_Powers() {
  const {
    classId, raceId,
    selectedPowerIds, togglePower,
    dilettanteClassId, dilettantePowerId, setDilettante,
    warlockPact,
  } = useWizardStore();
  const [tab, setTab] = useState<Tab>('at-will');
  const [dilettanteClass, setDilettanteClass] = useState(dilettanteClassId);
  const isWizard = classId === 'wizard';

  const cls = getClassById(classId);
  const isHuman = raceId === 'human';
  const isHalfElf = raceId === 'half-elf';

  if (!cls) return <p className="text-stone-500">Please choose a class first.</p>;

  // Cantrips are auto-granted — exclude from all picker pools
  const cantrips = getPowersByClass(classId).filter((p) => p.cantrip);
  // Pact boon is auto-granted — exclude from picker pool
  const pactBoonPower = classId === 'warlock' && warlockPact
    ? getPowersByClass('warlock').find((p) => p.pactBoon === warlockPact) ?? null
    : null;
  const availableAtWills   = getPowersByClass(classId, 'at-will',   1).filter((p) => !p.cantrip && !p.pactBoon);
  const availableEncounters = getPowersByClass(classId, 'encounter', 1);
  const availableDailies   = getPowersByClass(classId, 'daily',     1);

  const atWillMax = Math.min(
    isHuman ? cls.atWillPowerCount + 1 : cls.atWillPowerCount,
    availableAtWills.length,
  );
  const encounterMax = Math.min(cls.encounterPowerCount, availableEncounters.length);
  // Wizards pick 2 dailies from a single list (both go to spellbook; first is auto-prepared)
  const dailyMax = isWizard
    ? Math.min(2, availableDailies.length)
    : Math.min(cls.dailyPowerCount, availableDailies.length);

  const powersForTab = tab === 'at-will' ? availableAtWills
    : tab === 'encounter' ? availableEncounters
    : availableDailies;

  const selectedOfType = (usage: PowerUsage) =>
    selectedPowerIds.filter((id) => {
      const pw = getPowersByClass(classId).find((p) => p.id === id);
      return pw?.usage === usage;
    });

  const maxForTab      = tab === 'at-will' ? atWillMax : tab === 'encounter' ? encounterMax : dailyMax;
  const selectedForTab = selectedOfType(tab as PowerUsage);

  const handleToggle = (powerId: string) => {
    const isSelected = selectedPowerIds.includes(powerId);
    if (!isSelected && selectedForTab.length >= maxForTab) {
      const lastSelected = selectedForTab[selectedForTab.length - 1];
      togglePower(lastSelected, tab);
    }
    togglePower(powerId, tab);
  };

  const getTabCount = (t: Tab) => selectedOfType(t as PowerUsage).length;
  const getTabMax   = (t: Tab) => t === 'at-will' ? atWillMax : t === 'encounter' ? encounterMax : dailyMax;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Choose Powers</h2>
        <p className="text-stone-500 text-sm">
          Select your starting powers. At-will: pick {atWillMax} of {availableAtWills.length}
          {encounterMax > 0 && <>, Encounter: pick {encounterMax} of {availableEncounters.length}</>}
          {', '}
          {isWizard
            ? <>Daily: pick <strong>2</strong> of {availableDailies.length} — both go into your spellbook. Manage preparation from the Spellbook tab.</>
            : <>Daily: pick {dailyMax} of {availableDailies.length}.</>
          }
          {encounterMax === 0 && <> <em className="text-violet-600">Psionic classes augment at-will powers instead of gaining encounter powers.</em></>}
        </p>
      </div>

      {/* Wizard Cantrips — auto-granted, not selectable */}
      {cantrips.length > 0 && (
        <div className="mb-5 p-3 bg-teal-50 border border-teal-200 rounded-xl">
          <p className="text-xs font-bold text-teal-800 mb-2 uppercase tracking-wide">
            Wizard Cantrips — Auto-granted
          </p>
          <p className="text-xs text-teal-700 mb-3">
            These at-will powers are class features. They do not count toward your {atWillMax} at-will selections.
          </p>
          <div className="space-y-2 opacity-80 pointer-events-none">
            {cantrips.map((p) => <PowerCard key={p.id} power={p} />)}
          </div>
        </div>
      )}

      {/* Warlock Pact Boon — auto-granted based on chosen pact, not selectable */}
      {pactBoonPower && (
        <div className="mb-5 p-3 bg-teal-50 border border-teal-200 rounded-xl">
          <p className="text-xs font-bold text-teal-800 mb-2 uppercase tracking-wide">
            Pact Boon — Auto-granted
          </p>
          <p className="text-xs text-teal-700 mb-3">
            This at-will power is granted by your Eldritch Pact. It does not count toward your {atWillMax} at-will selections.
          </p>
          <div className="opacity-80 pointer-events-none">
            <PowerCard power={pactBoonPower} />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-5">
        {((['at-will', ...(encounterMax > 0 ? ['encounter'] : []), 'daily'] as Tab[])).map((t) => {
          const selT = getTabCount(t);
          const maxT = getTabMax(t);
          const done = selT >= maxT;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'flex-1 py-2.5 px-2 rounded-lg text-sm font-semibold transition-colors capitalize min-h-[44px]',
                tab === t ? 'bg-white shadow text-stone-800' : 'text-stone-500 hover:text-stone-700',
              ].join(' ')}
            >
              {t === 'at-will' ? 'At-Will' : t.charAt(0).toUpperCase() + t.slice(1)}
              {' '}
              <span className={done ? 'text-emerald-600' : 'text-amber-600'}>
                ({selT}/{maxT})
              </span>
            </button>
          );
        })}
      </div>

      {/* Power list */}
      <div className="space-y-3">
        {powersForTab.map((power) => (
          <PowerCard
            key={power.id}
            power={power}
            selected={selectedPowerIds.includes(power.id)}
            showCheckbox
            onClick={() => handleToggle(power.id)}
          />
        ))}
      </div>

      {/* Half-Elf Dilettante — only shown on at-will tab */}
      {isHalfElf && tab === 'at-will' && (
        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="font-bold text-amber-900 mb-2">Half-Elf Dilettante</h3>
          <p className="text-sm text-stone-600 mb-3">
            Choose one at-will power from another class as an encounter power.
          </p>
          <select
            value={dilettanteClass}
            onChange={(e) => { setDilettanteClass(e.target.value); setDilettante(e.target.value, ''); }}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mb-3 min-h-[44px]"
          >
            <option value="">Select a class...</option>
            {CLASSES.filter((c) => c.id !== classId).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {dilettanteClass && (
            <div className="space-y-3">
              {getPowersByClass(dilettanteClass, 'at-will', 1).map((power) => {
                const isSel = dilettantePowerId === power.id;
                return (
                  <PowerCard
                    key={power.id}
                    power={power}
                    selected={isSel}
                    showCheckbox
                    onClick={() => setDilettante(dilettanteClass, isSel ? '' : power.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
