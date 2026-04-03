import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { ClassData, ClassFeature } from '../../types/gameData';
import type { Ability } from '../../types/character';
import { SKILLS } from '../../data/skills';

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
    </EditorLayout>
  );
}
