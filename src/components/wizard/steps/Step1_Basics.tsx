import { useState } from 'react';
import { useWizardStore } from '../../../store/useWizardStore';
import { DEITIES, DEITY_ALIGNMENT_ORDER } from '../../../data/deities';
import type { Alignment } from '../../../types/character';

const ALIGNMENTS: Alignment[] = ['Lawful Good', 'Good', 'Unaligned', 'Evil', 'Chaotic Evil'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;

const inputCls =
  'w-full border border-stone-300 rounded-lg px-3 py-2.5 text-base focus:outline-none ' +
  'focus:ring-2 focus:ring-amber-400 bg-white min-h-[44px]';

const labelCls = 'block text-sm font-semibold text-stone-700 mb-1';
const sectionHeadingCls =
  'text-base font-bold text-amber-900 border-b border-amber-200 pb-1 mb-3';

// Group deities by alignment for dropdown optgroups
const DEITIES_BY_ALIGNMENT = DEITY_ALIGNMENT_ORDER.map((al) => ({
  alignment: al,
  deities: DEITIES.filter((d) => d.alignment === al),
}));

export function Step1_Basics() {
  const {
    name, playerName, gender, age, alignment, deity, background,
    height, weight, build, eyeColor, hairColor, levelingMode,
    setName, setPlayerName, setGender, setAge, setAlignment, setDeity, setBackground,
    setHeight, setWeight, setBuild, setEyeColor, setHairColor, setLevelingMode,
  } = useWizardStore();

  // Track "Other" free-text separately from the store value
  const isMaleOrFemale = gender === 'Male' || gender === 'Female';
  const [genderOther, setGenderOther] = useState(
    !isMaleOrFemale && gender !== '' ? gender : '',
  );

  const selectedGenderOption: typeof GENDER_OPTIONS[number] =
    gender === 'Male' ? 'Male' :
    gender === 'Female' ? 'Female' :
    'Other';

  const handleGenderRadio = (opt: typeof GENDER_OPTIONS[number]) => {
    if (opt !== 'Other') {
      setGender(opt);
      setGenderOther('');
    } else {
      // Keep whatever is in the free-text box (may be empty)
      setGender(genderOther);
    }
  };

  const handleGenderOther = (val: string) => {
    setGenderOther(val);
    setGender(val);
  };

  const selectedDeity = DEITIES.find((d) => d.id === deity);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-amber-900 mb-1">Character Basics</h2>
        <p className="text-stone-500 text-sm">Enter your character's name and basic information.</p>
      </div>

      {/* ── Identity ─────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <p className={sectionHeadingCls}>Identity</p>

        <div>
          <label className={labelCls}>
            Character Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputCls}
            placeholder="e.g. Thordin Ironforge"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <label className={labelCls}>Player Name</label>
          <input
            type="text"
            className={inputCls}
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>

        {/* Gender — radio buttons */}
        <div>
          <label className={labelCls}>Gender</label>
          <div className="flex gap-2 flex-wrap">
            {GENDER_OPTIONS.map((opt) => {
              const isSelected = selectedGenderOption === opt;
              return (
                <label
                  key={opt}
                  className={[
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer',
                    'text-sm font-medium transition-colors min-h-[44px] select-none',
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-amber-400',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={opt}
                    checked={isSelected}
                    onChange={() => handleGenderRadio(opt)}
                    className="sr-only"
                  />
                  {/* Custom radio dot */}
                  <span className={[
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    isSelected ? 'border-white' : 'border-stone-400',
                  ].join(' ')}>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                  {opt}
                </label>
              );
            })}
          </div>
          {selectedGenderOption === 'Other' && (
            <input
              type="text"
              className={`${inputCls} mt-2`}
              placeholder="Specify gender…"
              value={genderOther}
              onChange={(e) => handleGenderOther(e.target.value)}
            />
          )}
        </div>

        <div>
          <label className={labelCls}>Age</label>
          <input
            type="text"
            className={inputCls}
            placeholder="e.g. 25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      </section>

      {/* ── Appearance ───────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <p className={sectionHeadingCls}>Appearance</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Height</label>
            <input
              type="text"
              className={inputCls}
              placeholder='e.g. 5&apos;10"'
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Weight</label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. 175 lbs"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Build</label>
          <input
            type="text"
            className={inputCls}
            placeholder="e.g. Muscular, Slender, Stocky…"
            value={build}
            onChange={(e) => setBuild(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Eye Color</label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. Amber, Steel grey…"
              value={eyeColor}
              onChange={(e) => setEyeColor(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Hair Color</label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. Raven black, Auburn…"
              value={hairColor}
              onChange={(e) => setHairColor(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Alignment ────────────────────────────────────────────────────── */}
      <section>
        <p className={sectionHeadingCls}>Alignment</p>
        <div className="flex flex-wrap gap-2">
          {ALIGNMENTS.map((al) => (
            <button
              key={al}
              onClick={() => setAlignment(al)}
              className={[
                'px-3 py-2 rounded-lg border text-sm font-medium transition-colors min-h-[44px]',
                alignment === al
                  ? 'bg-amber-600 text-white border-amber-700'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-amber-400',
              ].join(' ')}
            >
              {al}
            </button>
          ))}
        </div>
      </section>

      {/* ── Deity ────────────────────────────────────────────────────────── */}
      <section>
        <p className={sectionHeadingCls}>Deity</p>
        <label className={labelCls}>Patron Deity</label>
        <select
          value={deity}
          onChange={(e) => setDeity(e.target.value)}
          className={`${inputCls} cursor-pointer`}
        >
          <option value="">— None / Unaffiliated —</option>
          {DEITIES_BY_ALIGNMENT.map(({ alignment: al, deities }) => (
            <optgroup key={al} label={`── ${al} ──`}>
              {deities.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}  ({d.domain})
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {/* Deity description card */}
        {selectedDeity && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-800">{selectedDeity.name}</span>
              <span className="text-xs text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                {selectedDeity.alignment}
              </span>
              <span className="text-xs text-stone-500 italic">{selectedDeity.domain}</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">{selectedDeity.description}</p>
          </div>
        )}
      </section>

      {/* ── Background ───────────────────────────────────────────────────── */}
      <section>
        <p className={sectionHeadingCls}>Background</p>
        <label className={labelCls}>Background / Notes</label>
        <textarea
          className={`${inputCls} resize-none h-24`}
          placeholder="Describe your character's background, personality, or notes…"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
        />
      </section>

      {/* ── Leveling Mode ────────────────────────────────────────────────── */}
      <section>
        <p className={sectionHeadingCls}>Leveling Mode</p>
        <div className="grid grid-cols-2 gap-3">
          {(['milestone', 'xp'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setLevelingMode(mode)}
              className={[
                'rounded-xl border-2 p-4 text-left transition-all',
                levelingMode === mode
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-stone-200 bg-white hover:border-amber-300',
              ].join(' ')}
            >
              <p className="font-bold text-stone-800">
                {mode === 'milestone' ? 'Milestone' : 'Experience Points'}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                {mode === 'milestone'
                  ? 'DM awards levels at story milestones — no XP tracking needed.'
                  : 'Earn XP from encounters and track progress toward each level threshold.'}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
