import { useState } from 'react';
import { useWizardStore } from '../../../store/useWizardStore';
import { useCharactersStore } from '../../../store/useCharactersStore';
import { useAppStore } from '../../../store/useAppStore';
import { characterRepository } from '../../../db/characterRepository';
import { getRaceById } from '../../../data/races';
import { getClassById } from '../../../data/classes';
import { getPowerById } from '../../../data/powers';
import { getFeatById } from '../../../data/feats';
import { abilityModifier, formatModifier, ABILITY_ABBR, ABILITIES } from '../../../utils/abilityScores';
import { calculateMaxHp } from '../../../utils/hitPoints';
import { Button } from '../../ui/Button';
import { Badge, RoleBadge } from '../../ui/Badge';
import type { Ability } from '../../../types/character';
import { parseRaceLanguages, CHOOSABLE_LANGUAGES } from '../../../data/languages';

/** Build choice descriptions keyed by classId → choiceValue. */
const BUILD_CHOICE_DESCRIPTIONS: Record<string, Record<string, { label: string; desc: string }>> = {
  wizard: {
    orb:   { label: 'Orb of Imposition',  desc: 'Extends charm/fear durations. Once per encounter, waive one power aftereffect or miss penalty.' },
    staff: { label: 'Staff of Defense',   desc: '+1 bonus to AC. Once per encounter as an immediate interrupt, add CHA modifier to one defense.' },
    wand:  { label: 'Wand of Accuracy',   desc: 'Once per encounter as a free action, add DEX modifier to a single attack roll.' },
  },
  warlock: {
    infernal: { label: 'Infernal Pact', desc: 'When you reduce an enemy to 0 HP, gain temporary HP equal to your CHA modifier + level.' },
    fey:      { label: 'Fey Pact',      desc: 'When you reduce an enemy to 0 HP, teleport 3 squares as a free action.' },
    star:     { label: 'Star Pact',     desc: 'When you reduce an enemy to 0 HP, gain a cumulative +1 bonus to attack rolls until end of encounter.' },
  },
  fighter: {
    superiority: { label: 'Combat Superiority (PHB)', desc: 'You gain a bonus to opportunity attacks equal to your Wisdom modifier. An enemy struck by your opportunity attack stops moving if a move provoked the attack.' },
    agility:     { label: 'Combat Agility (Martial Power 2)', desc: 'You can take opportunity attacks even when prone or slowed. Leaving an enemy\'s threatened area provokes an opportunity attack from you.' },
  },
  avenger: {
    pursuit:     { label: 'Censure of Pursuit', desc: 'If your oath of enmity target moves away from you willingly, you gain a bonus to damage rolls against it equal to your Dexterity modifier until the end of your next turn.' },
    retribution: { label: 'Censure of Retribution', desc: 'When any enemy other than your oath of enmity target hits you, you gain a bonus to damage rolls against your oath target equal to your Intelligence modifier until the end of your next turn.' },
  },
  barbarian: {
    rageblood: { label: 'Rageblood Vigor', desc: 'When you reduce an enemy to 0 HP, you gain temporary HP equal to your Constitution modifier (+5 at 11th, +10 at 21st level).' },
    thaneborn: { label: 'Thaneborn Triumph', desc: 'When you reduce an enemy to 0 HP, each enemy within 5 squares takes a penalty to attack rolls equal to your Charisma modifier until the end of your next turn.' },
  },
  bard: {
    cunning: { label: 'Virtue of Cunning', desc: 'Once per round, when an enemy attack misses an ally within 5 + INT modifier squares, you can slide that ally 1 square as a free action.' },
    valor:   { label: 'Virtue of Valor', desc: 'Once per round, when an ally within 5 squares reduces an enemy to 0 HP or bloodies an enemy, grant that ally temporary HP equal to 1 + your CON modifier (+3 at 11th, +5 at 21st).' },
  },
  druid: {
    guardian: { label: 'Primal Guardian', desc: 'While not wearing heavy armor, you can use CON modifier for AC instead of DEX or INT. While in beast form, you gain +1 AC.' },
    predator: { label: 'Primal Predator', desc: 'While in beast form, your speed increases by 1.' },
  },
  invoker: {
    preservation: { label: 'Covenant of Preservation', desc: 'When you use a divine encounter or daily attack power on your turn, you can slide an ally within 10 squares 1 square.' },
    wrath:        { label: 'Covenant of Wrath', desc: 'When you use a divine encounter or daily attack power, gain a damage bonus equal to the number of enemies you hit. +1 damage on single-target at-wills.' },
  },
  shaman: {
    protector: { label: 'Protector Spirit', desc: 'Allies adjacent to your spirit companion regain additional HP equal to your CON modifier when using second wind or when you use a healing power on them.' },
    stalker:   { label: 'Stalker Spirit', desc: 'Allies adjacent to your spirit companion gain +1 to attack rolls against bloodied enemies.' },
  },
  sorcerer: {
    dragon: { label: 'Dragon Magic', desc: '+2 AC while not wearing heavy armor. Bonus to arcane damage rolls equal to your STR modifier (+2 at 11th, +4 at 21st).' },
    wild:   { label: 'Wild Magic', desc: 'On a natural 20 with an arcane power, slide target 1 square and knock it prone. Bonus to arcane damage rolls equal to your DEX modifier.' },
  },
  warden: {
    earthstrength: { label: 'Earthstrength', desc: 'While not wearing heavy armor, use CON modifier for AC instead of DEX or INT. When you use second wind, gain temporary HP equal to your CON modifier.' },
    wildblood:     { label: 'Wildblood', desc: 'While not wearing heavy armor, use WIS modifier for AC instead of DEX or INT. When you use second wind, enemies you mark take an additional -2 to attacks that don\'t include you.' },
  },
  ardent: {
    clarity:  { label: 'Mantle of Clarity', desc: 'Allies within 5 squares gain a bonus to all defenses against opportunity attacks equal to your Wisdom modifier. You gain +2 to Insight and Perception checks.' },
    elation:  { label: 'Mantle of Elation', desc: 'Allies within 5 squares gain a bonus to damage rolls for opportunity attacks equal to your Constitution modifier. You gain +2 to Diplomacy and Intimidate checks.' },
  },
  battlemind: {
    resilience: { label: 'Battle Resilience', desc: 'When you hit or miss with your first attack in an encounter, gain resist all equal to 3 + your Wisdom modifier until the end of your next turn.' },
    speed:      { label: 'Speed of Thought', desc: 'When you roll initiative, as a free action move a number of squares equal to 3 + your Charisma modifier. Usable even if you are surprised.' },
  },
  monk: {
    'centered-breath': { label: 'Centered Breath', desc: 'You gain Centered Flurry of Blows (Wisdom modifier damage, slide target 1 square). Mental Equilibrium: +1 Fortitude (+2 at 11th, +3 at 21st).' },
    'stone-fist':      { label: 'Stone Fist', desc: 'You gain Stone Fist Flurry of Blows (3 + Strength modifier damage). Mental Bastion: +1 Will (+2 at 11th, +3 at 21st).' },
  },
  psion: {
    telekinesis: { label: 'Telekinesis Focus', desc: 'You gain Far Hand (move/manipulate objects up to 20 lbs) and Forceful Push (slide target 1 square; 2 at 11th, 3 at 21st).' },
    telepathy:   { label: 'Telepathy Focus', desc: 'You gain Distract (target grants combat advantage to next attacker) and Send Thoughts (send a mental message of 25 words to one creature within 20 squares).' },
  },
  runepriest: {
    defiant:  { label: 'Defiant Word', desc: 'When an enemy misses you with an attack, you gain a bonus to damage rolls against that enemy equal to your Wisdom modifier until the end of your next turn.' },
    wrathful: { label: 'Wrathful Hammer', desc: 'You gain proficiency with military hammers and military maces. When an enemy damages you, gain a bonus to damage rolls against that enemy equal to your Constitution modifier until the end of your next turn.' },
  },
  seeker: {
    bloodbond:  { label: 'Bloodbond', desc: 'You gain Encaging Spirits (push and slow nearby enemies). While not wearing heavy armor, you can shift as a minor action.' },
    spiritbond: { label: 'Spiritbond', desc: "You gain Spirits' Rebuke (counterattack when missed by melee). +1 to attack rolls with thrown weapons. Thrown weapons return after attack. Use STR for AC instead of DEX/INT." },
  },
};

type DetailPanel = 'race' | 'class' | 'build' | null;

export function Step10_Review() {
  const wizard = useWizardStore();
  const addCharacter = useCharactersStore((s) => s.addCharacter);
  const { navigate, showToast } = useAppStore();
  const [openDetail, setOpenDetail] = useState<DetailPanel>(null);
  const [expandedPowerId, setExpandedPowerId] = useState<string | null>(null);
  const [expandedFeatId, setExpandedFeatId] = useState<string | null>(null);

  const toggleDetail = (panel: DetailPanel) =>
    setOpenDetail((prev) => (prev === panel ? null : panel));

  const togglePower = (id: string) =>
    setExpandedPowerId((prev) => (prev === id ? null : id));

  const toggleFeat = (id: string) =>
    setExpandedFeatId((prev) => (prev === id ? null : id));

  const race = getRaceById(wizard.raceId);
  const cls = getClassById(wizard.classId);

  const isValid = wizard.name.trim().length > 0 && wizard.raceId && wizard.classId;

  // Resolve class build choice (subclass) for display
  const buildChoice = (() => {
    const map: Record<string, { label: string; value: string }> = {
      wizard:     { label: 'Arcane Implement', value: wizard.arcaneImplement },
      warlock:    { label: 'Eldritch Pact',    value: wizard.warlockPact },
      fighter:    { label: 'Combat Style',     value: wizard.fighterCombatStyle },
      avenger:    { label: 'Censure',          value: wizard.avengerCensure },
      barbarian:  { label: 'Feral Might',      value: wizard.barbarianFeralMight },
      bard:       { label: 'Bardic Virtue',    value: wizard.bardVirtue },
      druid:      { label: 'Primal Aspect',    value: wizard.druidPrimalAspect },
      invoker:    { label: 'Divine Covenant',  value: wizard.invokerCovenant },
      shaman:     { label: 'Companion Spirit', value: wizard.shamanSpirit },
      sorcerer:   { label: 'Spell Source',     value: wizard.sorcererSpellSource },
      warden:     { label: 'Guardian Might',   value: wizard.wardenGuardianMight },
      ardent:     { label: 'Mantle',           value: wizard.ardentMantle },
      battlemind: { label: 'Psionic Study',    value: wizard.battlemindOption },
      monk:       { label: 'Monastic Tradition', value: wizard.monkTradition },
      psion:      { label: 'Discipline Focus', value: wizard.psionDiscipline },
      runepriest: { label: 'Runic Artistry',   value: wizard.runepriestArtistry },
      seeker:     { label: 'Bond',             value: wizard.seekerBond },
    };
    const entry = map[wizard.classId];
    if (!entry || !entry.value) return null;
    // Format value: "rageblood" → "Rageblood", "stone-fist" → "Stone Fist", "centered-breath" → "Centered Breath"
    const formatted = entry.value.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return { label: entry.label, value: formatted, rawValue: entry.value };
  })();

  const handleCreate = async () => {
    const data = wizard.buildCharacter();
    const character = await characterRepository.create(data);
    addCharacter(character);
    wizard.resetWizard();
    showToast(`${character.name} created!`, 'success');
    navigate('sheet', character.id);
  };

  // Calculate final scores for review (matching buildCharacter + useCharacterDerived)
  const finalScores = { ...wizard.baseAbilityScores };
  if (wizard.raceId === 'human' && wizard.humanAbilityBonus) {
    finalScores[wizard.humanAbilityBonus] = finalScores[wizard.humanAbilityBonus] + 2;
  }
  if (race) {
    Object.entries(race.abilityBonuses).forEach(([ab, val]) => {
      (finalScores as Record<string, number>)[ab] += (val ?? 0);
    });
  }
  // Apply racial ability choice bonus (e.g. Half-Elf choosing CON)
  if (wizard.racialAbilityBonusChoice && wizard.raceId !== 'human') {
    finalScores[wizard.racialAbilityBonusChoice] = finalScores[wizard.racialAbilityBonusChoice] + 2;
  }

  const maxHp = cls ? calculateMaxHp(cls.hpAtFirstLevel, cls.hpPerLevel, finalScores.con, 1) : 12;
  const startingHp = wizard.customHp ?? maxHp;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Review & Create</h2>
        <p className="text-stone-500 text-sm">Review your character before finalizing.</p>
      </div>

      {!isValid && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Please complete all required steps (name, race, and class) before creating.
        </div>
      )}

      {/* Identity */}
      <section className="mb-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="text-lg font-bold text-stone-900">{wizard.name || '(No name)'}</h3>
              <p className="text-stone-500 text-sm">
                {race ? (
                  <button
                    type="button"
                    onClick={() => toggleDetail('race')}
                    className={`underline decoration-dotted underline-offset-2 hover:text-amber-700 transition-colors min-h-[44px] inline-flex items-center ${openDetail === 'race' ? 'text-amber-700 font-semibold' : ''}`}
                  >
                    {race.name}
                  </button>
                ) : '—'}{' '}
                {cls ? (
                  <button
                    type="button"
                    onClick={() => toggleDetail('class')}
                    className={`underline decoration-dotted underline-offset-2 hover:text-amber-700 transition-colors min-h-[44px] inline-flex items-center ${openDetail === 'class' ? 'text-amber-700 font-semibold' : ''}`}
                  >
                    {cls.name}
                  </button>
                ) : '—'} · Level 1
              </p>
              {buildChoice && (
                <button
                  type="button"
                  onClick={() => toggleDetail('build')}
                  className={`text-amber-700 text-sm font-medium underline decoration-dotted underline-offset-2 hover:text-amber-900 transition-colors min-h-[44px] inline-flex items-center ${openDetail === 'build' ? 'font-bold' : ''}`}
                >
                  {buildChoice.label}: {buildChoice.value}
                </button>
              )}
            </div>
            {cls && <RoleBadge role={cls.role} />}
          </div>

          {/* ── Expandable Race Details ── */}
          {openDetail === 'race' && race && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-in">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">{race.name} — Race Details</p>
                <button type="button" onClick={() => setOpenDetail(null)} className="text-amber-400 hover:text-amber-700 text-xs font-bold min-w-[44px] min-h-[44px] flex items-center justify-center">✕</button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-stone-600 mb-2">
                <div><span className="font-semibold text-stone-500">Size:</span> {race.size}</div>
                <div><span className="font-semibold text-stone-500">Speed:</span> {race.speed}</div>
                <div><span className="font-semibold text-stone-500">Vision:</span> {race.vision}</div>
              </div>
              {race.skillBonuses.length > 0 && (
                <div className="text-xs text-stone-600 mb-2">
                  <span className="font-semibold text-stone-500">Skill Bonuses:</span>{' '}
                  {race.skillBonuses.map((sb) => `+${sb.bonus} ${sb.skillId.charAt(0).toUpperCase() + sb.skillId.slice(1)}`).join(', ')}
                </div>
              )}
              <div className="space-y-1.5 mt-2">
                {race.traits.map((trait) => (
                  <div key={trait.name}>
                    <p className="text-xs font-semibold text-stone-700">{trait.name}</p>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{trait.description}</p>
                  </div>
                ))}
              </div>
              {race.racialPowerIds.length > 0 && (
                <div className="mt-2 pt-2 border-t border-amber-200">
                  <p className="text-xs font-semibold text-stone-500 mb-1">Racial Powers</p>
                  {race.racialPowerIds.map((pid) => {
                    const pw = getPowerById(pid);
                    return pw ? (
                      <div key={pid} className="text-xs text-stone-600">
                        <span className="font-semibold">{pw.name}</span>{pw.effect ? ` — ${pw.effect}` : ''}
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Expandable Class Details ── */}
          {openDetail === 'class' && cls && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-in">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">{cls.name} — Class Details</p>
                <button type="button" onClick={() => setOpenDetail(null)} className="text-amber-400 hover:text-amber-700 text-xs font-bold min-w-[44px] min-h-[44px] flex items-center justify-center">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-600 mb-2">
                <div><span className="font-semibold text-stone-500">Role:</span> {cls.role}</div>
                <div><span className="font-semibold text-stone-500">Power Source:</span> {cls.powerSource}</div>
                <div><span className="font-semibold text-stone-500">HP at 1st:</span> {cls.hpAtFirstLevel} + CON</div>
                <div><span className="font-semibold text-stone-500">HP/Level:</span> {cls.hpPerLevel}</div>
                <div><span className="font-semibold text-stone-500">Surges/Day:</span> {cls.healingSurgesPerDay}</div>
                <div><span className="font-semibold text-stone-500">Key Abilities:</span> {cls.keyAbilities.map((a) => ABILITY_ABBR[a]).join(', ')}</div>
              </div>
              <div className="text-xs text-stone-600 mb-1">
                <span className="font-semibold text-stone-500">Armor:</span> {cls.armorProficiencies.join(', ')}{cls.shieldProficiency ? ', Shields' : ''}
              </div>
              <div className="text-xs text-stone-600 mb-2">
                <span className="font-semibold text-stone-500">Weapons:</span> {cls.weaponProficiencies.join(', ')}
              </div>
              {cls.implements && cls.implements.length > 0 && (
                <div className="text-xs text-stone-600 mb-2">
                  <span className="font-semibold text-stone-500">Implements:</span> {cls.implements.join(', ')}
                </div>
              )}
              <div className="space-y-1.5 mt-2 pt-2 border-t border-amber-200">
                <p className="text-xs font-semibold text-stone-500">Level 1 Features</p>
                {cls.features.filter((f) => f.level === 1).map((f) => (
                  <div key={f.name}>
                    <p className="text-xs font-semibold text-stone-700">{f.name}</p>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Expandable Build Choice Details ── */}
          {openDetail === 'build' && buildChoice && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-in">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">{buildChoice.label} — {buildChoice.value}</p>
                <button type="button" onClick={() => setOpenDetail(null)} className="text-amber-400 hover:text-amber-700 text-xs font-bold min-w-[44px] min-h-[44px] flex items-center justify-center">✕</button>
              </div>
              {(() => {
                const classChoices = BUILD_CHOICE_DESCRIPTIONS[wizard.classId];
                if (!classChoices) return null;
                return (
                  <div className="space-y-2">
                    {Object.entries(classChoices).map(([key, opt]) => {
                      const selected = key === buildChoice.rawValue;
                      return (
                        <div
                          key={key}
                          className={`px-3 py-2 rounded-lg border text-xs ${
                            selected
                              ? 'bg-amber-100 border-amber-400'
                              : 'bg-white border-stone-200'
                          }`}
                        >
                          <p className={`font-semibold ${selected ? 'text-amber-800' : 'text-stone-500'}`}>
                            {opt.label}
                            {selected && <span className="ml-1.5 text-amber-600 font-bold">(selected)</span>}
                          </p>
                          <p className={`mt-0.5 leading-relaxed ${selected ? 'text-amber-700' : 'text-stone-400'}`}>{opt.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          <div className="flex flex-wrap gap-2 text-sm text-stone-600 mb-2">
            {wizard.alignment && <Badge color="stone">{wizard.alignment}</Badge>}
            {wizard.gender && <Badge color="stone">{wizard.gender}</Badge>}
            {wizard.age && <span className="text-stone-500 text-xs">Age {wizard.age}</span>}
            {wizard.deity && <span className="text-stone-500 text-xs">Deity: {wizard.deity}</span>}
          </div>

          {/* Appearance */}
          {(wizard.height || wizard.weight || wizard.build || wizard.eyeColor || wizard.hairColor) && (
            <div className="mt-2 pt-2 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Appearance</p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-stone-500">
                {wizard.height    && <span>Height: {wizard.height}</span>}
                {wizard.weight    && <span>Weight: {wizard.weight}</span>}
                {wizard.build     && <span>Build: {wizard.build}</span>}
                {wizard.eyeColor  && <span>Eyes: {wizard.eyeColor}</span>}
                {wizard.hairColor && <span>Hair: {wizard.hairColor}</span>}
              </div>
            </div>
          )}

          {/* Languages */}
          {race && (() => {
            const { automatic, hasBonusChoice } = parseRaceLanguages(race.languages);
            const langs = [...automatic];
            if (hasBonusChoice && wizard.bonusLanguage) {
              const found = CHOOSABLE_LANGUAGES.find((l) => l.id === wizard.bonusLanguage);
              langs.push(found?.name ?? wizard.bonusLanguage);
            }
            if (langs.length === 0) return null;
            return (
              <div className="mt-2 pt-2 border-t border-stone-100">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1.5">Languages</p>
                <div className="flex flex-wrap gap-1.5">
                  {langs.map((l) => (
                    <span key={l} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      {l}
                    </span>
                  ))}
                  {hasBonusChoice && !wizard.bonusLanguage && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600 border border-red-200">
                      ⚠ Bonus language not chosen
                    </span>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Ability Scores */}
      <section className="mb-4">
        <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Ability Scores</h4>
        <div className="grid grid-cols-3 gap-2">
          {ABILITIES.map((ab) => {
            const base = wizard.baseAbilityScores[ab];
            const score = finalScores[ab];
            const mod = abilityModifier(score);
            const racialBonus = race?.abilityBonuses[ab] ?? 0;
            const humanBonus = (wizard.raceId === 'human' && wizard.humanAbilityBonus === ab) ? 2 : 0;
            const choiceBonus = (wizard.racialAbilityBonusChoice === ab && wizard.raceId !== 'human' && race?.abilityBonusOptions) ? 2 : 0;
            const hasBonus = racialBonus !== 0 || humanBonus !== 0 || choiceBonus !== 0;
            return (
              <div key={ab} className="bg-white border border-stone-200 rounded-lg p-2 text-center">
                <div className="text-xs text-stone-400 font-semibold">{ABILITY_ABBR[ab as Ability]}</div>
                <div className="text-xl font-bold text-stone-800">{score}</div>
                <div className={`text-sm font-semibold ${mod >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {formatModifier(mod)}
                </div>
                {hasBonus && (
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {base}
                    {racialBonus !== 0 && <span className="text-emerald-600"> +{racialBonus} race</span>}
                    {humanBonus !== 0 && <span className="text-emerald-600"> +{humanBonus} human</span>}
                    {choiceBonus !== 0 && <span className="text-emerald-600"> +{choiceBonus} race</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Defenses preview */}
      {cls && race && (() => {
        const strMod = abilityModifier(finalScores.str);
        const conMod = abilityModifier(finalScores.con);
        const dexMod = abilityModifier(finalScores.dex);
        const intMod = abilityModifier(finalScores.int);
        const wisMod = abilityModifier(finalScores.wis);
        const chaMod = abilityModifier(finalScores.cha);
        const humanBonus = wizard.raceId === 'human' ? 1 : 0;
        const eladrinBonus = wizard.raceId === 'eladrin' ? 1 : 0;
        const racialWillBonus = race.willBonus ?? 0;
        const armorBonus = cls.armorProficiencies.includes('Scale') || cls.armorProficiencies.includes('Plate') ? 6 : 2;

        const defenses = [
          {
            label: 'AC',
            value: 10 + armorBonus,
            parts: [
              { text: '10 base', color: '' },
              { text: `+${armorBonus} armor`, color: 'text-blue-600' },
            ],
          },
          {
            label: 'Fort',
            value: 10 + Math.max(strMod, conMod) + cls.fortitudeBonus + humanBonus,
            parts: [
              { text: '10 base', color: '' },
              { text: `${formatModifier(Math.max(strMod, conMod))} ${strMod >= conMod ? 'STR' : 'CON'}`, color: 'text-emerald-600' },
              ...(cls.fortitudeBonus > 0 ? [{ text: `+${cls.fortitudeBonus} ${cls.name}`, color: 'text-blue-600' }] : []),
              ...(humanBonus > 0 ? [{ text: `+${humanBonus} race`, color: 'text-amber-600' }] : []),
            ],
          },
          {
            label: 'Ref',
            value: 10 + Math.max(dexMod, intMod) + cls.reflexBonus + humanBonus,
            parts: [
              { text: '10 base', color: '' },
              { text: `${formatModifier(Math.max(dexMod, intMod))} ${dexMod >= intMod ? 'DEX' : 'INT'}`, color: 'text-emerald-600' },
              ...(cls.reflexBonus > 0 ? [{ text: `+${cls.reflexBonus} ${cls.name}`, color: 'text-blue-600' }] : []),
              ...(humanBonus > 0 ? [{ text: `+${humanBonus} race`, color: 'text-amber-600' }] : []),
            ],
          },
          {
            label: 'Will',
            value: 10 + Math.max(wisMod, chaMod) + cls.willBonus + humanBonus + eladrinBonus + racialWillBonus,
            parts: [
              { text: '10 base', color: '' },
              { text: `${formatModifier(Math.max(wisMod, chaMod))} ${wisMod >= chaMod ? 'WIS' : 'CHA'}`, color: 'text-emerald-600' },
              ...(cls.willBonus > 0 ? [{ text: `+${cls.willBonus} ${cls.name}`, color: 'text-blue-600' }] : []),
              ...(humanBonus > 0 ? [{ text: `+${humanBonus} Human`, color: 'text-amber-600' }] : []),
              ...(eladrinBonus > 0 ? [{ text: `+${eladrinBonus} Eladrin`, color: 'text-amber-600' }] : []),
              ...(racialWillBonus > 0 ? [{ text: `+${racialWillBonus} ${race.name}`, color: 'text-amber-600' }] : []),
            ],
          },
        ];

        return (
          <section className="mb-4">
            <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Defenses (estimated)</h4>
            <div className="grid grid-cols-4 gap-2">
              {defenses.map((d) => (
                <div key={d.label} className="bg-white border border-stone-200 rounded-lg p-2 text-center">
                  <div className="text-xs text-stone-400 font-semibold">{d.label}</div>
                  <div className="text-xl font-bold text-stone-800">{d.value}</div>
                  <div className="mt-1 space-y-px">
                    {d.parts.map((p, i) => (
                      <div key={i} className={`text-[10px] leading-tight ${p.color || 'text-stone-400'}`}>{p.text}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* HP */}
      {cls && (
        <section className="mb-4">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Hit Points</h4>
          <div className="bg-white border border-stone-200 rounded-lg p-3 flex items-center gap-4">
            <div>
              <span className="text-2xl font-bold text-stone-800">{startingHp}</span>
              <span className="text-stone-400 ml-1 text-sm">starting HP</span>
              {wizard.customHp !== null && wizard.customHp !== maxHp && (
                <span className="ml-2 text-xs text-amber-600 font-semibold">(custom)</span>
              )}
            </div>
            <div className="text-stone-400 text-sm">
              Max: {maxHp} · Bloodied: {Math.floor(maxHp / 2)}
            </div>
          </div>
        </section>
      )}

      {/* Trained Skills */}
      {wizard.trainedSkills.length > 0 && (
        <section className="mb-4">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Trained Skills</h4>
          <div className="flex flex-wrap gap-2">
            {wizard.trainedSkills.map((s) => (
              <Badge key={s} color="teal">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Badge>
            ))}
            {wizard.bonusSkillTrained && (
              <Badge color="amber">
                {wizard.bonusSkillTrained.charAt(0).toUpperCase() + wizard.bonusSkillTrained.slice(1)} ({race?.bonusSkillOptions ? `${race.name} Education` : 'human'})
              </Badge>
            )}
          </div>
        </section>
      )}

      {/* Powers */}
      {(() => {
        const subrace = race?.subraces?.find((sr) => sr.id === wizard.subraceId);
        const racialPowerIds = [
          ...(race?.racialPowerIds ?? []),
          ...(subrace?.racialPowerIds ?? []),
        ];
        const hasAnyPowers =
          wizard.selectedPowerIds.length > 0 || wizard.dilettantePowerId || racialPowerIds.length > 0;
        if (!hasAnyPowers) return null;
        return (
        <section className="mb-4">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Powers</h4>
          <div className="space-y-1">
            {/* Racial powers (from race + subrace) */}
            {racialPowerIds.map((pid) => {
              const pw = getPowerById(pid);
              if (!pw) return null;
              const isOpen = expandedPowerId === pid;
              return (
                <div key={`racial-${pid}`}>
                  <button
                    type="button"
                    onClick={() => togglePower(pid)}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors min-h-[44px] border ${
                      isOpen ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                    }`}
                  >
                    <span className={`text-sm underline decoration-dotted underline-offset-2 ${isOpen ? 'text-amber-800 font-semibold' : 'text-stone-800'}`}>{pw.name}</span>
                    <Badge color={pw.usage === 'at-will' ? 'green' : pw.usage === 'encounter' ? 'blue' : 'purple'}>
                      {pw.usage === 'at-will' ? 'At-Will' : pw.usage.charAt(0).toUpperCase() + pw.usage.slice(1)}
                    </Badge>
                    <Badge color="green">Race</Badge>
                  </button>
                  {isOpen && <PowerDetail power={pw} />}
                </div>
              );
            })}
            {wizard.selectedPowerIds.map((pid) => {
              const pw = getPowerById(pid);
              if (!pw) return null;
              const isOpen = expandedPowerId === pid;
              return (
                <div key={pid}>
                  <button
                    type="button"
                    onClick={() => togglePower(pid)}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors min-h-[44px] border ${
                      isOpen ? 'bg-amber-50 border-amber-300' : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <span className={`text-sm underline decoration-dotted underline-offset-2 ${isOpen ? 'text-amber-800 font-semibold' : 'text-stone-800'}`}>{pw.name}</span>
                    <Badge color={pw.usage === 'at-will' ? 'green' : pw.usage === 'encounter' ? 'blue' : 'purple'}>
                      {pw.usage === 'at-will' ? 'At-Will' : pw.usage.charAt(0).toUpperCase() + pw.usage.slice(1)}
                    </Badge>
                  </button>
                  {isOpen && <PowerDetail power={pw} />}
                </div>
              );
            })}
            {/* Half-Elf Dilettante power */}
            {wizard.dilettantePowerId && (() => {
              const pw = getPowerById(wizard.dilettantePowerId);
              if (!pw) return null;
              const isOpen = expandedPowerId === wizard.dilettantePowerId;
              return (
                <div>
                  <button
                    type="button"
                    onClick={() => togglePower(wizard.dilettantePowerId!)}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors min-h-[44px] border ${
                      isOpen ? 'bg-amber-50 border-amber-300' : 'bg-amber-50 border-amber-200 hover:border-amber-300'
                    }`}
                  >
                    <span className={`text-sm underline decoration-dotted underline-offset-2 ${isOpen ? 'text-amber-800 font-semibold' : 'text-stone-800'}`}>{pw.name}</span>
                    <Badge color="green">At-Will</Badge>
                    <Badge color="amber">Dilettante</Badge>
                  </button>
                  {isOpen && <PowerDetail power={pw} />}
                </div>
              );
            })()}
          </div>
        </section>
        );
      })()}

      {/* Feats */}
      {wizard.selectedFeatIds.length > 0 && (
        <section className="mb-4">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">Feats</h4>
          <div className="space-y-1">
            {wizard.selectedFeatIds.map((fid) => {
              const feat = getFeatById(fid);
              if (!feat) return null;
              const isOpen = expandedFeatId === fid;
              return (
                <div key={fid}>
                  <button
                    type="button"
                    onClick={() => toggleFeat(fid)}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors min-h-[44px] border ${
                      isOpen ? 'bg-amber-50 border-amber-300' : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <span className={`text-sm underline decoration-dotted underline-offset-2 ${isOpen ? 'text-amber-800 font-semibold' : 'text-stone-800'}`}>{feat.name}</span>
                    <Badge color="amber">{feat.tier}</Badge>
                  </button>
                  {isOpen && (
                    <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-stone-700 leading-relaxed">{feat.benefit}</p>
                      {feat.special && (
                        <p className="text-xs text-stone-500 mt-1.5 italic">{feat.special}</p>
                      )}
                      {feat.grantedPowerIds && feat.grantedPowerIds.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-amber-200">
                          <p className="text-xs font-semibold text-stone-500 mb-1">Granted Powers</p>
                          {feat.grantedPowerIds.map((pid) => {
                            const pw = getPowerById(pid);
                            return pw ? (
                              <div key={pid} className="text-xs text-stone-600">
                                <span className="font-semibold">{pw.name}</span>{pw.effect ? ` — ${pw.effect}` : ''}
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Equipment */}
      {wizard.equipment.length > 0 && (
        <section className="mb-6">
          <h4 className="text-sm font-semibold text-stone-600 mb-2 uppercase tracking-wide">
            Equipment <span className="text-amber-600 font-bold">({wizard.goldPieces} gp remaining)</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {wizard.equipment.map((e) => (
              <Badge key={e.itemId} color="stone">{e.name}</Badge>
            ))}
          </div>
        </section>
      )}

      {/* Create button */}
      <Button
        size="lg"
        fullWidth
        disabled={!isValid}
        onClick={handleCreate}
      >
        ⚔️ Create Character
      </Button>
    </div>
  );
}

// ── Power detail panel ─────────────────────────────────────────────────────────

import type { PowerData } from '../../../types/gameData';

function PowerDetail({ power }: { power: PowerData }) {
  const row = (label: string, value: string | undefined, color = 'text-stone-700') =>
    value ? <p className="text-xs"><span className={`font-semibold ${color}`}>{label}:</span> {value}</p> : null;

  return (
    <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
      <div className="flex flex-wrap gap-1.5 mb-1">
        <span className="text-[10px] font-bold bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded capitalize">{power.actionType.replace('-', ' ')}</span>
        {power.range && <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">{power.range}</span>}
        {power.keywords.map((kw) => (
          <span key={kw} className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{kw}</span>
        ))}
      </div>
      {row('Requirement', power.requirement)}
      {row('Trigger', power.trigger, 'text-orange-700')}
      {row('Target', power.target)}
      {row('Attack', power.attack)}
      {row('Hit', power.hit, 'text-emerald-700')}
      {row('Miss', power.miss, 'text-red-600')}
      {row('Effect', power.effect, 'text-blue-700')}
      {row('Special', power.special, 'text-amber-700')}
      {power.flavor && <p className="text-xs italic text-stone-400 mt-1">{power.flavor}</p>}
    </div>
  );
}
