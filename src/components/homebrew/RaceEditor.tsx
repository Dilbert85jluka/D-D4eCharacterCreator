import { useState } from 'react';
import type { EditorProps } from './HomebrewEditorModal';
import { EditorLayout, Field, inputCls, selectCls, textareaCls } from './EditorLayout';
import { useHomebrewStore } from '../../store/useHomebrewStore';
import type { RaceData, RacialTrait, RacialSkillBonus } from '../../types/gameData';
import type { Ability } from '../../types/character';
import { SKILLS } from '../../data/skills';
import { CHOOSABLE_LANGUAGES } from '../../data/languages';

const ABILITIES: { id: Ability; label: string }[] = [
  { id: 'str', label: 'Strength' },
  { id: 'con', label: 'Constitution' },
  { id: 'dex', label: 'Dexterity' },
  { id: 'int', label: 'Intelligence' },
  { id: 'wis', label: 'Wisdom' },
  { id: 'cha', label: 'Charisma' },
];

const SIZES: ('Small' | 'Medium')[] = ['Small', 'Medium'];
const VISIONS: ('Normal' | 'Low-light' | 'Darkvision')[] = ['Normal', 'Low-light', 'Darkvision'];

const ALL_LANGUAGES = ['Common', ...CHOOSABLE_LANGUAGES.map((l) => l.name)];

function defaults(): RaceData {
  return {
    id: '',
    name: '',
    size: 'Medium',
    speed: 6,
    vision: 'Normal',
    languages: ['Common'],
    abilityBonuses: {},
    skillBonuses: [],
    traits: [],
    racialPowerIds: [],
  };
}

// ---------- Reusable sub-components ----------

function TraitRow({ trait, index, onUpdate, onRemove }: {
  trait: RacialTrait;
  index: number;
  onUpdate: (index: number, updated: RacialTrait) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="border border-stone-200 rounded-lg p-3 space-y-2 bg-stone-50">
      <div className="flex items-center gap-2">
        <input
          className={inputCls}
          value={trait.name}
          onChange={(e) => onUpdate(index, { ...trait, name: e.target.value })}
          placeholder="Trait name"
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
        value={trait.description}
        onChange={(e) => onUpdate(index, { ...trait, description: e.target.value })}
        placeholder="Trait description"
        rows={2}
      />
      <label className="flex items-center gap-2 text-xs text-stone-500">
        <input
          type="checkbox"
          checked={trait.conditional ?? false}
          onChange={(e) => onUpdate(index, { ...trait, conditional: e.target.checked || undefined })}
          className="rounded"
        />
        Situational / conditional bonus (displayed but not auto-applied)
      </label>
    </div>
  );
}

function SkillBonusRow({ bonus, index, onUpdate, onRemove, usedSkillIds }: {
  bonus: RacialSkillBonus;
  index: number;
  onUpdate: (index: number, updated: RacialSkillBonus) => void;
  onRemove: (index: number) => void;
  usedSkillIds: string[];
}) {
  const availableSkills = SKILLS.filter((s) => s.id === bonus.skillId || !usedSkillIds.includes(s.id));

  return (
    <div className="flex items-center gap-2">
      <select
        className={selectCls}
        value={bonus.skillId}
        onChange={(e) => onUpdate(index, { ...bonus, skillId: e.target.value })}
      >
        <option value="">Select skill...</option>
        {availableSkills.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <span className="text-sm text-stone-500 flex-shrink-0">+</span>
      <input
        className={inputCls + ' !w-20'}
        type="number"
        min={1}
        value={bonus.bonus}
        onChange={(e) => onUpdate(index, { ...bonus, bonus: Number(e.target.value) })}
      />
      <button
        onClick={() => onRemove(index)}
        className="px-2.5 py-1.5 text-xs font-semibold bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors min-h-[36px] flex-shrink-0"
      >
        &times;
      </button>
    </div>
  );
}

// ---------- Main editor ----------

export function RaceEditor({ editingItem, userId, onClose }: EditorProps) {
  const addItem = useHomebrewStore((s) => s.addItem);
  const updateItem = useHomebrewStore((s) => s.updateItem);
  const existing = editingItem?.data as RaceData | undefined;

  const [form, setForm] = useState<RaceData>(existing ? { ...existing } : defaults());
  const [campaignIds, setCampaignIds] = useState<string[]>(editingItem?.campaignIds ?? []);

  // --- Ability bonus state ---
  const [abilityBonuses, setAbilityBonuses] = useState<Partial<Record<Ability, number>>>(
    existing?.abilityBonuses ?? {},
  );
  const [hasAbilityChoice, setHasAbilityChoice] = useState(!!existing?.abilityBonusOptions);
  const [choiceAmount, setChoiceAmount] = useState(existing?.abilityBonusOptions?.amount ?? 2);
  const [choiceOptions, setChoiceOptions] = useState<Ability[]>(
    existing?.abilityBonusOptions?.options ?? [],
  );

  // --- Traits state ---
  const [traits, setTraits] = useState<RacialTrait[]>(existing?.traits ?? []);

  // --- Skill bonuses state ---
  const [skillBonuses, setSkillBonuses] = useState<RacialSkillBonus[]>(existing?.skillBonuses ?? []);

  // --- Languages state ---
  const [languages, setLanguages] = useState<string[]>(existing?.languages ?? ['Common']);
  const [pendingLang, setPendingLang] = useState('');

  // --- Defense/stat bonuses ---
  const [fortBonus, setFortBonus] = useState(existing?.fortitudeBonus ?? 0);
  const [refBonus, setRefBonus] = useState(existing?.reflexBonus ?? 0);
  const [willBonus, setWillBonus] = useState(existing?.willBonus ?? 0);
  const [initBonus, setInitBonus] = useState(existing?.initiativeBonus ?? 0);
  const [surgeBonus, setSurgeBonus] = useState(existing?.surgesPerDayBonus ?? 0);

  // --- Racial flags ---
  const [bonusFeat, setBonusFeat] = useState(existing?.bonusFeat ?? false);
  const [bonusSkill, setBonusSkill] = useState(existing?.bonusSkill ?? false);
  const [bonusAtWill, setBonusAtWill] = useState(existing?.bonusAtWill ?? false);

  const toggleCampaign = (id: string) =>
    setCampaignIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  const canSave = form.name.trim().length > 0;

  // --- Trait CRUD ---
  const addTrait = () => setTraits((t) => [...t, { name: '', description: '' }]);
  const updateTrait = (idx: number, updated: RacialTrait) =>
    setTraits((t) => t.map((tr, i) => (i === idx ? updated : tr)));
  const removeTrait = (idx: number) => setTraits((t) => t.filter((_, i) => i !== idx));

  // --- Skill bonus CRUD ---
  const addSkillBonus = () => setSkillBonuses((s) => [...s, { skillId: '', bonus: 2 }]);
  const updateSkillBonus = (idx: number, updated: RacialSkillBonus) =>
    setSkillBonuses((s) => s.map((sb, i) => (i === idx ? updated : sb)));
  const removeSkillBonus = (idx: number) => setSkillBonuses((s) => s.filter((_, i) => i !== idx));
  const usedSkillIds = skillBonuses.map((sb) => sb.skillId);

  // --- Language CRUD ---
  const addLanguage = () => {
    if (pendingLang && !languages.includes(pendingLang)) {
      setLanguages((l) => [...l, pendingLang]);
      setPendingLang('');
    }
  };
  const removeLanguage = (lang: string) => setLanguages((l) => l.filter((x) => x !== lang));
  const availableLangs = ALL_LANGUAGES.filter((l) => !languages.includes(l));

  // --- Ability choice option toggle ---
  const toggleChoiceOption = (ab: Ability) => {
    setChoiceOptions((prev) =>
      prev.includes(ab) ? prev.filter((a) => a !== ab) : [...prev, ab],
    );
  };

  const handleSave = async () => {
    // Build the RaceData from form state
    const data: RaceData = {
      ...form,
      id: existing?.id ?? '',
      abilityBonuses,
      abilityBonusOptions: hasAbilityChoice && choiceOptions.length > 0
        ? { amount: choiceAmount, options: choiceOptions }
        : undefined,
      skillBonuses: skillBonuses.filter((sb) => sb.skillId),
      traits: traits.filter((t) => t.name.trim()),
      languages,
      racialPowerIds: existing?.racialPowerIds ?? [],
      fortitudeBonus: fortBonus || undefined,
      reflexBonus: refBonus || undefined,
      willBonus: willBonus || undefined,
      initiativeBonus: initBonus || undefined,
      surgesPerDayBonus: surgeBonus || undefined,
      bonusFeat: bonusFeat || undefined,
      bonusSkill: bonusSkill || undefined,
      bonusAtWill: bonusAtWill || undefined,
    };

    if (editingItem) {
      await updateItem({ ...editingItem, name: data.name, data, campaignIds });
    } else {
      const item = await addItem({ contentType: 'race', name: data.name, createdBy: userId, campaignIds, data: { ...data, id: '' } });
      data.id = item.id;
      await updateItem({ ...item, data });
    }
    onClose();
  };

  return (
    <EditorLayout
      title={editingItem ? 'Edit Race' : 'New Race'}
      campaignIds={campaignIds}
      onCampaignToggle={toggleCampaign}
      onSave={handleSave}
      onCancel={onClose}
      canSave={canSave}
    >
      {/* ── Basic Info ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Race Name" required>
          <input
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Warforged"
          />
        </Field>
        <Field label="Size">
          <select className={selectCls} value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value as 'Small' | 'Medium' }))}>
            {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Speed">
          <input className={inputCls} type="number" min={1} max={12} value={form.speed} onChange={(e) => setForm((f) => ({ ...f, speed: Number(e.target.value) }))} />
        </Field>
        <Field label="Vision">
          <select className={selectCls} value={form.vision} onChange={(e) => setForm((f) => ({ ...f, vision: e.target.value as 'Normal' | 'Low-light' | 'Darkvision' }))}>
            {VISIONS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>
      </div>

      {/* ── Ability Bonuses ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Fixed Ability Bonuses</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ABILITIES.map((ab) => (
            <div key={ab.id} className="text-center">
              <label className="block text-xs text-stone-500 mb-0.5">{ab.label.substring(0, 3).toUpperCase()}</label>
              <input
                className={inputCls + ' text-center !px-1'}
                type="number"
                min={-2}
                max={6}
                value={abilityBonuses[ab.id] ?? 0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAbilityBonuses((prev) => {
                    const next = { ...prev };
                    if (val === 0) delete next[ab.id];
                    else next[ab.id] = val;
                    return next;
                  });
                }}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 mt-1">Enter +2 for each fixed racial bonus (e.g. Elf gets +2 DEX, +2 WIS)</p>
      </div>

      {/* ── Ability Choice Bonus ── */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-stone-700">
          <input
            type="checkbox"
            checked={hasAbilityChoice}
            onChange={(e) => setHasAbilityChoice(e.target.checked)}
            className="rounded"
          />
          Player chooses an additional ability bonus
        </label>
        {hasAbilityChoice && (
          <div className="mt-2 ml-6 space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-stone-500">Bonus amount:</label>
              <input
                className={inputCls + ' !w-16 text-center'}
                type="number"
                min={1}
                max={4}
                value={choiceAmount}
                onChange={(e) => setChoiceAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Choose from (leave empty = any ability):</label>
              <div className="flex flex-wrap gap-2">
                {ABILITIES.map((ab) => {
                  const selected = choiceOptions.includes(ab.id);
                  return (
                    <button
                      key={ab.id}
                      onClick={() => toggleChoiceOption(ab.id)}
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
            </div>
          </div>
        )}
      </div>

      {/* ── Skill Bonuses ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Racial Skill Bonuses</label>
        <div className="space-y-2">
          {skillBonuses.map((sb, idx) => (
            <SkillBonusRow
              key={idx}
              bonus={sb}
              index={idx}
              onUpdate={updateSkillBonus}
              onRemove={removeSkillBonus}
              usedSkillIds={usedSkillIds}
            />
          ))}
        </div>
        <button
          onClick={addSkillBonus}
          className="mt-2 px-3 py-1.5 text-xs font-semibold bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors min-h-[36px]"
        >
          + Add Skill Bonus
        </button>
      </div>

      {/* ── Languages ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Languages</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {languages.map((lang) => (
            <span key={lang} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
              {lang}
              <button onClick={() => removeLanguage(lang)} className="hover:text-red-600 font-bold">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <select className={selectCls} value={pendingLang} onChange={(e) => setPendingLang(e.target.value)}>
            <option value="">Select language...</option>
            {availableLangs.map((l) => <option key={l} value={l}>{l}</option>)}
            <option value="One extra language of choice">Player&apos;s choice (any)</option>
          </select>
          <button
            onClick={addLanguage}
            disabled={!pendingLang}
            className={[
              'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] flex-shrink-0',
              pendingLang
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed',
            ].join(' ')}
          >
            + Add
          </button>
        </div>
      </div>

      {/* ── Defense & Stat Bonuses ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Racial Defense / Stat Bonuses</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Fortitude</label>
            <input className={inputCls} type="number" min={0} max={5} value={fortBonus} onChange={(e) => setFortBonus(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Reflex</label>
            <input className={inputCls} type="number" min={0} max={5} value={refBonus} onChange={(e) => setRefBonus(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Will</label>
            <input className={inputCls} type="number" min={0} max={5} value={willBonus} onChange={(e) => setWillBonus(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Initiative</label>
            <input className={inputCls} type="number" min={0} max={5} value={initBonus} onChange={(e) => setInitBonus(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-0.5">Surges/Day</label>
            <input className={inputCls} type="number" min={0} max={5} value={surgeBonus} onChange={(e) => setSurgeBonus(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* ── Racial Flags ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-2">Racial Features</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input type="checkbox" checked={bonusFeat} onChange={(e) => setBonusFeat(e.target.checked)} className="rounded" />
            Bonus feat at 1st level (like Human)
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input type="checkbox" checked={bonusSkill} onChange={(e) => setBonusSkill(e.target.checked)} className="rounded" />
            Bonus trained skill (from class skill list)
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input type="checkbox" checked={bonusAtWill} onChange={(e) => setBonusAtWill(e.target.checked)} className="rounded" />
            Bonus at-will power (like Half-Elf Dilettante)
          </label>
        </div>
      </div>

      {/* ── Racial Traits ── */}
      <div>
        <label className="block text-sm font-semibold text-stone-700 mb-1.5">Racial Traits</label>
        <p className="text-xs text-stone-400 mb-2">Add descriptive traits for this race. These appear on the character sheet under Racial Features.</p>
        <div className="space-y-3">
          {traits.map((trait, idx) => (
            <TraitRow key={idx} trait={trait} index={idx} onUpdate={updateTrait} onRemove={removeTrait} />
          ))}
        </div>
        <button
          onClick={addTrait}
          className="mt-2 px-3 py-1.5 text-xs font-semibold bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors min-h-[36px]"
        >
          + Add Trait
        </button>
      </div>
    </EditorLayout>
  );
}
