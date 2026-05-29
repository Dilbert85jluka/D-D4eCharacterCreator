import { useMemo, useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { ClassData, ClassFeature, PowerData } from '../../types/gameData';
import type { Ability } from '../../types/character';
import { SKILLS } from '../../data/skills';
import { ALL_POWERS } from '../../data/powers';
import { getClassById } from '../../data/classes';

const ROLES: ClassData['role'][] = ['Controller', 'Defender', 'Leader', 'Striker'];
const POWER_SOURCES: ClassData['powerSource'][] = ['Arcane', 'Divine', 'Martial', 'Primal', 'Psionic'];

const ABILITIES: { id: Ability; label: string }[] = [
  { id: 'str', label: 'Strength' },
  { id: 'con', label: 'Constitution' },
  { id: 'dex', label: 'Dexterity' },
  { id: 'int', label: 'Intelligence' },
  { id: 'wis', label: 'Wisdom' },
  { id: 'cha', label: 'Charisma' },
];

const ARMOR_PROFS = ['Cloth', 'Leather', 'Hide', 'Chainmail', 'Scale', 'Plate'];
const WEAPON_PROFS = ['Simple melee', 'Military melee', 'Superior melee', 'Simple ranged', 'Military ranged', 'Superior ranged'];
const IMPLEMENT_TYPES = ['Holy Symbol', 'Orb', 'Rod', 'Staff', 'Totem', 'Wand', 'Ki Focus', 'Tome'];

function defaults(): ClassData {
  return {
    id: '',
    name: '',
    role: 'Striker',
    powerSource: 'Martial',
    keyAbilities: [],
    armorProficiencies: ['Cloth'],
    weaponProficiencies: ['Simple melee', 'Simple ranged'],
    shieldProficiency: false,
    hpAtFirstLevel: 12,
    hpPerLevel: 5,
    healingSurgesPerDay: 6,
    fortitudeBonus: 0,
    reflexBonus: 0,
    willBonus: 0,
    trainedSkillCount: 4,
    availableSkills: [],
    atWillPowerCount: 2,
    encounterPowerCount: 1,
    dailyPowerCount: 1,
    features: [],
  };
}

// ---------- Sub-components ----------

function FeatureRow({ feature, index, onUpdate, onRemove }: {
  feature: ClassFeature;
  index: number;
  onUpdate: (index: number, updated: ClassFeature) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="border border-stone-200 rounded-lg p-3 space-y-2 bg-stone-50">
      <div className="flex items-center gap-2">
        <input
          className={inputCls + ' flex-1'}
          value={feature.name}
          onChange={(e) => onUpdate(index, { ...feature, name: e.target.value })}
          placeholder="Feature name"
        />
        <label className="text-xs text-stone-500 flex-shrink-0">Lvl</label>
        <input
          className={inputCls + ' !w-16 text-center'}
          type="number"
          min={1}
          max={30}
          value={feature.level}
          onChange={(e) => onUpdate(index, { ...feature, level: Number(e.target.value) })}
        />
        <button
          onClick={() => onRemove(index)}
          className="px-2.5 py-1.5 text-xs font-semibold bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors min-h-[36px] flex-shrink-0"
        >
          Remove
        </button>
      </div>
      <textarea
        className={textareaCls}
        value={feature.description}
        onChange={(e) => onUpdate(index, { ...feature, description: e.target.value })}
        placeholder="Feature description"
        rows={2}
      />
    </div>
  );
}

function MultiToggle({ items, selected, onToggle, label }: {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  label: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={[
                'px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px]',
                active
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-stone-500 border-stone-300 hover:border-amber-400',
              ].join(' ')}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Main editor ----------

export function ClassEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const homebrewItems = useHomebrewStore((s) => s.items);
  const existing = editingItem?.data as ClassData | undefined;

  const [form, setForm] = useState<ClassData>(existing ? { ...existing } : defaults());
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  // --- Key abilities ---
  const [keyAbilities, setKeyAbilities] = useState<Ability[]>(existing?.keyAbilities ?? []);

  // --- Proficiencies ---
  const [armorProfs, setArmorProfs] = useState<string[]>(existing?.armorProficiencies ?? ['Cloth']);
  const [weaponProfs, setWeaponProfs] = useState<string[]>(existing?.weaponProficiencies ?? ['Simple melee', 'Simple ranged']);
  const [shieldProf, setShieldProf] = useState(existing?.shieldProficiency ?? false);
  const [implProfs, setImplProfs] = useState<string[]>(existing?.implements ?? []);

  // --- Available skills ---
  const [availableSkills, setAvailableSkills] = useState<string[]>(existing?.availableSkills ?? []);
  const [mandatorySkills, setMandatorySkills] = useState<string[]>(existing?.mandatorySkills ?? []);

  // --- Features ---
  const [features, setFeatures] = useState<ClassFeature[]>(existing?.features ?? []);

  // --- Class Powers (auto-granted) ---
  const [classPowerIds, setClassPowerIds] = useState<string[]>(existing?.classPowerIds ?? []);
  const [powerSearch, setPowerSearch] = useState('');
  const [powerFilter, setPowerFilter] = useState<'all' | 'homebrew' | 'official'>('all');

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0;

  const set = <K extends keyof ClassData>(key: K, val: ClassData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  // --- Toggle helpers ---
  const toggleItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const toggleAbility = (ab: Ability) =>
    setKeyAbilities((prev) => prev.includes(ab) ? prev.filter((a) => a !== ab) : [...prev, ab]);

  // --- Feature CRUD ---
  const addFeature = () => setFeatures((f) => [...f, { name: '', description: '', level: 1 }]);
  const updateFeature = (idx: number, updated: ClassFeature) =>
    setFeatures((f) => f.map((ft, i) => (i === idx ? updated : ft)));
  const removeFeature = (idx: number) => setFeatures((f) => f.filter((_, i) => i !== idx));

  // --- Class Power picker ---
  // Eligible class powers = all homebrew powers (any classId) + all official class powers.
  // Each carries an `isHomebrew` flag for display.
  const eligiblePowers = useMemo(() => {
    const homebrewIdSet = new Set(
      homebrewItems.filter((i) => i.contentType === 'power').map((i) => i.id),
    );
    const homebrew = homebrewItems
      .filter((i) => i.contentType === 'power')
      .map((i) => ({ power: i.data as PowerData, isHomebrew: true }));
    const official = ALL_POWERS
      .filter((p) => !homebrewIdSet.has(p.id))
      .map((p) => ({ power: p, isHomebrew: false }));
    return [...homebrew, ...official].sort((a, b) =>
      a.power.name.localeCompare(b.power.name),
    );
  }, [homebrewItems]);

  const visiblePowers = useMemo(() => {
    const q = powerSearch.trim().toLowerCase();
    return eligiblePowers.filter(({ power, isHomebrew }) => {
      if (powerFilter === 'homebrew' && !isHomebrew) return false;
      if (powerFilter === 'official' && isHomebrew) return false;
      if (q && !power.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [eligiblePowers, powerSearch, powerFilter]);

  const toggleClassPower = (id: string) =>
    setClassPowerIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  // Linked IDs that don't match any currently-loaded power — shown so the user knows they exist.
  const orphanPowerIds = classPowerIds.filter((id) => !eligiblePowers.some(({ power }) => power.id === id));

  const handleSave = async () => {
    const data: ClassData = {
      ...form,
      id: existing?.id ?? '',
      keyAbilities,
      armorProficiencies: armorProfs,
      weaponProficiencies: weaponProfs,
      shieldProficiency: shieldProf,
      implements: implProfs.length > 0 ? implProfs : undefined,
      availableSkills,
      mandatorySkills: mandatorySkills.length > 0 ? mandatorySkills : undefined,
      features: features.filter((f) => f.name.trim()),
      classPowerIds: classPowerIds.length > 0 ? classPowerIds : undefined,
    };

    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({ contentType: 'class', name: data.name, createdBy: userId, campaignIds, data: { ...data, id: '' } });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout
      title={editingItem ? 'Edit Class' : 'New Class'}
      campaignIds={campaignIds}
      onCampaignToggle={toggleCampaign}
      onSave={handleSave}
      onCancel={onClose}
      canSave={canSave}
    >
      {/* ── Basic Info ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Class Name" required>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Blood Hunter"
          />
        </Field>
        <Field label="Role">
          <select className={selectCls} value={form.role} onChange={(e) => set('role', e.target.value as ClassData['role'])}>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Power Source">
          <select className={selectCls} value={form.powerSource} onChange={(e) => set('powerSource', e.target.value as ClassData['powerSource'])}>
            {POWER_SOURCES.map((ps) => <option key={ps} value={ps}>{ps}</option>)}
          </select>
        </Field>
      </div>

      {/* ── Key Abilities ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Key Abilities</label>
        <div className="flex flex-wrap gap-2">
          {ABILITIES.map((ab) => {
            const selected = keyAbilities.includes(ab.id);
            return (
              <button
                key={ab.id}
                onClick={() => toggleAbility(ab.id)}
                className={[
                  'px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px]',
                  selected
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-stone-500 border-stone-300 hover:border-amber-400',
                ].join(' ')}
              >
                {ab.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-stone-400 mt-1">Select the primary and secondary abilities for this class</p>
      </div>

      {/* ── HP & Surges ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Hit Points & Healing</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">HP at 1st Level</label>
            <input className={inputCls} type="number" min={1} value={form.hpAtFirstLevel} onChange={(e) => set('hpAtFirstLevel', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">HP per Level</label>
            <input className={inputCls} type="number" min={1} value={form.hpPerLevel} onChange={(e) => set('hpPerLevel', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Surges/Day</label>
            <input className={inputCls} type="number" min={1} value={form.healingSurgesPerDay} onChange={(e) => set('healingSurgesPerDay', Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* ── Defense Bonuses ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Defense Bonuses</label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Fortitude</label>
            <input className={inputCls} type="number" min={0} max={4} value={form.fortitudeBonus} onChange={(e) => set('fortitudeBonus', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Reflex</label>
            <input className={inputCls} type="number" min={0} max={4} value={form.reflexBonus} onChange={(e) => set('reflexBonus', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Will</label>
            <input className={inputCls} type="number" min={0} max={4} value={form.willBonus} onChange={(e) => set('willBonus', Number(e.target.value))} />
          </div>
        </div>
        <p className="text-xs text-stone-400 mt-1">Most classes get +2 to one or two defenses</p>
      </div>

      {/* ── Proficiencies ── */}
      <MultiToggle items={ARMOR_PROFS} selected={armorProfs} onToggle={(item) => setArmorProfs(toggleItem(armorProfs, item))} label="Armor Proficiencies" />
      <MultiToggle items={WEAPON_PROFS} selected={weaponProfs} onToggle={(item) => setWeaponProfs(toggleItem(weaponProfs, item))} label="Weapon Proficiencies" />

      <label className="flex items-center gap-2 text-sm text-stone-600">
        <input type="checkbox" checked={shieldProf} onChange={(e) => setShieldProf(e.target.checked)} className="rounded" />
        <span className="font-semibold">Shield Proficiency</span>
      </label>

      <MultiToggle items={IMPLEMENT_TYPES} selected={implProfs} onToggle={(item) => setImplProfs(toggleItem(implProfs, item))} label="Implement Proficiencies (optional)" />

      {/* ── Skills ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">
          Available Skills
          <span className="text-xs text-stone-400 font-normal ml-2">
            (players choose {form.trainedSkillCount} from this list)
          </span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {SKILLS.map((skill) => {
            const selected = availableSkills.includes(skill.id);
            return (
              <button
                key={skill.id}
                onClick={() => setAvailableSkills(toggleItem(availableSkills, skill.id))}
                className={[
                  'px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px]',
                  selected
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-stone-500 border-stone-300 hover:border-sky-400',
                ].join(' ')}
              >
                {skill.name}
              </button>
            );
          })}
        </div>
        <Field label="Trained Skill Count">
          <input className={inputCls + ' !w-20'} type="number" min={1} max={8} value={form.trainedSkillCount} onChange={(e) => set('trainedSkillCount', Number(e.target.value))} />
        </Field>
      </div>

      {/* ── Mandatory Skills ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">
          Mandatory Trained Skills
          <span className="text-xs text-stone-400 font-normal ml-2">(optional, auto-trained)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => {
            const selected = mandatorySkills.includes(skill.id);
            return (
              <button
                key={skill.id}
                onClick={() => setMandatorySkills(toggleItem(mandatorySkills, skill.id))}
                className={[
                  'px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px]',
                  selected
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-stone-500 border-stone-300 hover:border-emerald-400',
                ].join(' ')}
              >
                {skill.name}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-stone-400 mt-1">Skills that are automatically trained (e.g. Rogue: Stealth + Thievery)</p>
      </div>

      {/* ── Power Counts ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Power Counts at 1st Level</label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">At-Will</label>
            <input className={inputCls} type="number" min={0} max={4} value={form.atWillPowerCount} onChange={(e) => set('atWillPowerCount', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Encounter</label>
            <input className={inputCls} type="number" min={0} max={4} value={form.encounterPowerCount} onChange={(e) => set('encounterPowerCount', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Daily</label>
            <input className={inputCls} type="number" min={0} max={4} value={form.dailyPowerCount} onChange={(e) => set('dailyPowerCount', Number(e.target.value))} />
          </div>
        </div>
        <p className="text-xs text-stone-400 mt-1">Most classes start with 2 at-will, 1 encounter, 1 daily</p>
      </div>

      {/* ── Class Features ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Class Features</label>
        <p className="text-xs text-stone-400 mb-2">Define class features with their granted level. These appear on the character sheet under Class Features.</p>
        <div className="space-y-3">
          {features.map((feat, idx) => (
            <FeatureRow key={idx} feature={feat} index={idx} onUpdate={updateFeature} onRemove={removeFeature} />
          ))}
        </div>
        <button
          onClick={addFeature}
          className="mt-2 px-3 py-1.5 text-xs font-semibold bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors min-h-[36px]"
        >
          + Add Feature
        </button>
      </div>

      {/* ── Class Powers (auto-granted) ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Class Powers</label>
        <p className="text-xs text-stone-400 mb-2">
          Pick official class powers and/or your own homebrew powers. Selected powers are auto-granted to characters of this class and appear on the Class Features sheet.
        </p>

        {/* Source filter pills */}
        <div className="flex gap-1 mb-2">
          {(['all', 'official', 'homebrew'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setPowerFilter(f)}
              className={[
                'px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors min-h-[32px] capitalize',
                powerFilter === f
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200',
              ].join(' ')}
            >
              {f}
            </button>
          ))}
        </div>

        <input
          className={inputCls + ' mb-2'}
          type="text"
          value={powerSearch}
          onChange={(e) => setPowerSearch(e.target.value)}
          placeholder={`Search ${eligiblePowers.length} power${eligiblePowers.length !== 1 ? 's' : ''}...`}
        />

        {visiblePowers.length > 0 ? (
          <div className="border border-stone-200 rounded-lg max-h-56 overflow-y-auto divide-y divide-stone-100">
            {visiblePowers.slice(0, 200).map(({ power: p, isHomebrew }) => {
              const selected = classPowerIds.includes(p.id);
              const sourceClass = !isHomebrew ? getClassById(p.classId)?.name : undefined;
              return (
                <label
                  key={p.id}
                  className={[
                    'flex items-start gap-2 px-3 py-2 cursor-pointer transition-colors',
                    selected ? 'bg-amber-50' : 'hover:bg-stone-50',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleClassPower(p.id)}
                    className="mt-0.5 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-stone-800 truncate">{p.name}</span>
                      <span
                        className={[
                          'text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded font-bold',
                          isHomebrew ? 'bg-violet-100 text-violet-700' : 'bg-stone-100 text-stone-500',
                        ].join(' ')}
                      >
                        {isHomebrew ? 'Homebrew' : 'Official'}
                      </span>
                      {sourceClass && (
                        <span className="text-[10px] uppercase tracking-wide bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                          {sourceClass} L{p.level}
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-wide bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded font-bold">
                        {p.usage}
                      </span>
                      {p.actionType && (
                        <span className="text-[10px] uppercase tracking-wide bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                          {p.actionType}
                        </span>
                      )}
                    </div>
                    {p.flavor && (
                      <p className="text-xs italic text-stone-400 mt-0.5 line-clamp-1">{p.flavor}</p>
                    )}
                  </div>
                </label>
              );
            })}
            {visiblePowers.length > 200 && (
              <div className="px-3 py-2 text-xs text-stone-400 italic text-center">
                Showing first 200 of {visiblePowers.length} — narrow the search to see more.
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">
            {eligiblePowers.length === 0
              ? 'No powers available. Create a homebrew power in the Workshop\'s Powers section.'
              : 'No powers match that search.'}
          </p>
        )}

        {orphanPowerIds.length > 0 && (
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 space-y-1">
            <p className="text-xs font-semibold text-amber-800">
              {orphanPowerIds.length} linked power{orphanPowerIds.length !== 1 ? 's' : ''} not currently loaded:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {orphanPowerIds.map((id) => (
                <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-amber-300 text-amber-800 rounded text-[11px] font-mono">
                  {id}
                  <button
                    onClick={() => toggleClassPower(id)}
                    className="hover:text-red-600 font-bold"
                    title="Remove"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <p className="text-[11px] text-amber-700">
              These powers aren't loaded yet (homebrew not imported, or unknown ID). They'll resolve at runtime if found.
            </p>
          </div>
        )}
      </div>
    </EditorLayout>
  );
}
