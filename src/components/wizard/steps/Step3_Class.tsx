import { useState } from 'react';
import { CLASSES } from '../../../data/classes';
import { useWizardStore } from '../../../store/useWizardStore';
import { getPowersByClass } from '../../../data/powers';
import { Card } from '../../ui/Card';
import { RoleBadge, Badge } from '../../ui/Badge';
import { PowerCard } from '../shared/PowerCard';
import { ABILITY_ABBR } from '../../../utils/abilityScores';
import type { Ability } from '../../../types/character';

/** Reusable build-choice picker for PHB2 class features (2 options with descriptions). */
function BuildChoicePicker({ label, value, options, onSelect }: {
  label: string;
  value: string;
  options: { key: string; label: string; desc: string }[];
  onSelect: (key: string) => void;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-stone-200">
      <p className="text-xs font-semibold text-stone-600 mb-2">
        {label}
        {!value && <span className="ml-1 text-amber-600 font-normal">— choose one</span>}
      </p>
      <div className="space-y-1.5">
        {options.map((opt) => {
          const selected = value === opt.key;
          return (
            <button
              key={opt.key}
              onClick={(e) => { e.stopPropagation(); onSelect(opt.key); }}
              className={`w-full text-left px-2.5 py-2 rounded-lg border transition-colors min-h-[44px] ${
                selected
                  ? 'bg-amber-600 border-amber-600 text-white'
                  : 'bg-white border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-700'
              }`}
            >
              <p className="text-xs font-semibold leading-tight">{opt.label}</p>
              <p className={`text-[10px] mt-0.5 leading-snug ${selected ? 'text-amber-100' : 'text-stone-400'}`}>{opt.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Step3_Class() {
  const {
    classId, setClass,
    arcaneImplement, setArcaneImplement,
    warlockPact, setWarlockPact,
    avengerCensure, setAvengerCensure,
    barbarianFeralMight, setBarbarianFeralMight,
    bardVirtue, setBardVirtue,
    druidPrimalAspect, setDruidPrimalAspect,
    invokerCovenant, setInvokerCovenant,
    shamanSpirit, setShamanSpirit,
    sorcererSpellSource, setSorcererSpellSource,
    wardenGuardianMight, setWardenGuardianMight,
    ardentMantle, setArdentMantle,
    battlemindOption, setBattlemindOption,
    monkTradition, setMonkTradition,
    psionDiscipline, setPsionDiscipline,
    psionStartingRitualId, setPsionStartingRitualId,
    runepriestArtistry, setRunepriestArtistry,
    seekerBond, setSeekerBond,
  } = useWizardStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-amber-900 mb-1">Choose Your Class</h2>
        <p className="text-stone-500 text-sm">Your class defines your role, powers, and combat style.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CLASSES.map((cls) => {
          const isSelected = classId === cls.id;
          const isExpanded = expanded === cls.id;

          return (
            <Card
              key={cls.id}
              interactive
              selected={isSelected}
              onClick={() => {
                setClass(cls.id);
                setExpanded(isExpanded ? null : cls.id);
              }}
            >
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-stone-800">{cls.name}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">{cls.powerSource}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <RoleBadge role={cls.role} />
                    {isSelected && <span className="text-amber-600 text-xl">✓</span>}
                  </div>
                </div>

                {/* Key abilities */}
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs text-stone-500">Key:</span>
                  {cls.keyAbilities.slice(0, 3).map((ab) => (
                    <Badge key={ab} color="amber">{ABILITY_ABBR[ab as Ability]}</Badge>
                  ))}
                </div>

                {/* HP and surges */}
                <div className="flex gap-4 mt-2 text-xs text-stone-500">
                  <span>HP: {cls.hpAtFirstLevel}+CON</span>
                  <span>Surges: {cls.healingSurgesPerDay}+CON</span>
                </div>

                {/* Armor */}
                <p className="text-xs text-stone-400 mt-1 truncate">
                  Armor: {cls.armorProficiencies.join(', ')}
                </p>

                {/* Expand */}
                <button
                  onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : cls.id); }}
                  className="mt-2 text-xs text-amber-700 font-medium"
                >
                  {isExpanded ? '▲ Hide features' : '▼ Show features'}
                </button>

                {isExpanded && (
                  <div className="mt-2 space-y-2 border-t border-stone-100 pt-2">
                    {cls.features.filter((f) => f.level === 1).map((f) => (
                      <div key={f.name}>
                        <p className="text-xs font-semibold text-stone-700">{f.name}</p>
                        <p className="text-xs text-stone-500 mt-0.5 line-clamp-3">{f.description}</p>
                      </div>
                    ))}

                    {/* Wizard-only: Arcane Implement Mastery picker */}
                    {cls.id === 'wizard' && (
                      <div className="mt-3 pt-3 border-t border-stone-200">
                        <p className="text-xs font-semibold text-stone-600 mb-2">
                          Arcane Implement Mastery
                          {!arcaneImplement && (
                            <span className="ml-1 text-amber-600 font-normal">— choose one</span>
                          )}
                        </p>
                        <div className="space-y-1.5">
                          {(['orb', 'staff', 'wand'] as const).map((impl) => {
                            const options = {
                              orb:   { label: 'Orb of Imposition',  desc: 'Extends charm/fear durations. Once per encounter, waive one power aftereffect or miss penalty.' },
                              staff: { label: 'Staff of Defense',   desc: '+1 bonus to AC. Once per encounter as an immediate interrupt, add CHA modifier to one defense.' },
                              wand:  { label: 'Wand of Accuracy',   desc: 'Once per encounter as a free action, add DEX modifier to a single attack roll.' },
                            };
                            const { label, desc } = options[impl];
                            const selected = arcaneImplement === impl;
                            return (
                              <button
                                key={impl}
                                onClick={(e) => { e.stopPropagation(); setArcaneImplement(impl); }}
                                className={`w-full text-left px-2.5 py-2 rounded-lg border transition-colors ${
                                  selected
                                    ? 'bg-amber-600 border-amber-600 text-white'
                                    : 'bg-white border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-700'
                                }`}
                              >
                                <p className="text-xs font-semibold leading-tight">{label}</p>
                                <p className={`text-[10px] mt-0.5 leading-snug ${selected ? 'text-amber-100' : 'text-stone-400'}`}>{desc}</p>
                              </button>
                            );
                          })}
                        </div>
                        {arcaneImplement && (() => {
                          const implementFeature = {
                            orb:   { name: 'Orb of Imposition (Encounter)',  text: 'When you use a wizard encounter or daily attack power through your orb, you can target one creature affected by your power that has an aftereffect or is affected by a charm or fear. That creature takes a –2 penalty to saving throws against that aftereffect or effect until the end of your next turn.' },
                            staff: { name: 'Staff of Defense (Immediate Interrupt)',  text: 'Trigger: You are hit by an attack. Effect: You gain a bonus to all defenses equal to your Constitution modifier against the triggering attack.' },
                            wand:  { name: 'Wand of Accuracy (Free Action)', text: 'Once per encounter, gain a bonus to a single attack roll equal to your Dexterity modifier.' },
                          }[arcaneImplement];
                          return (
                            <div className="mt-2 p-2.5 bg-stone-50 border border-stone-200 rounded-lg">
                              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1">Granted Feature</p>
                              <p className="text-xs font-semibold text-stone-700">{implementFeature.name}</p>
                              <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">{implementFeature.text}</p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Warlock-only: Eldritch Pact picker */}
                    {cls.id === 'warlock' && (
                      <div className="mt-3 pt-3 border-t border-stone-200">
                        <p className="text-xs font-semibold text-stone-600 mb-2">
                          Eldritch Pact
                          {!warlockPact && (
                            <span className="ml-1 text-amber-600 font-normal">— choose one</span>
                          )}
                        </p>
                        <div className="space-y-1.5">
                          {(['infernal', 'fey', 'star'] as const).map((pact) => {
                            const options = {
                              infernal: { label: 'Infernal Pact', boon: "Dark One's Blessing", desc: 'When you reduce an enemy to 0 HP, gain temporary HP equal to your CHA modifier + level.' },
                              fey:      { label: 'Fey Pact',      boon: 'Misty Step',          desc: 'When you reduce an enemy to 0 HP, teleport 3 squares as a free action.' },
                              star:     { label: 'Star Pact',     boon: 'Fate of the Void',    desc: 'When you reduce an enemy to 0 HP, gain a cumulative +1 bonus to attack rolls until end of encounter.' },
                            };
                            const { label, boon, desc } = options[pact];
                            const selected = warlockPact === pact;
                            return (
                              <button
                                key={pact}
                                onClick={(e) => { e.stopPropagation(); setWarlockPact(pact); }}
                                className={`w-full text-left px-2.5 py-2 rounded-lg border transition-colors ${
                                  selected
                                    ? 'bg-amber-600 border-amber-600 text-white'
                                    : 'bg-white border-stone-300 text-stone-600 hover:border-amber-400 hover:text-amber-700'
                                }`}
                              >
                                <p className="text-xs font-semibold leading-tight">{label}</p>
                                <p className={`text-[10px] font-medium mt-0.5 ${selected ? 'text-amber-200' : 'text-amber-700'}`}>Pact Boon: {boon}</p>
                                <p className={`text-[10px] mt-0.5 leading-snug ${selected ? 'text-amber-100' : 'text-stone-400'}`}>{desc}</p>
                              </button>
                            );
                          })}
                        </div>
                        {warlockPact && (() => {
                          const boonPower = getPowersByClass('warlock').find((p) => p.pactBoon === warlockPact);
                          return boonPower ? (
                            <div className="mt-2">
                              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-1.5">Pact Boon Power</p>
                              <div className="pointer-events-none">
                                <PowerCard power={boonPower} />
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}

                    {/* Avenger: Censure picker */}
                    {cls.id === 'avenger' && (
                      <BuildChoicePicker
                        label="Avenger's Censure"
                        value={avengerCensure}
                        options={[
                          { key: 'pursuit', label: 'Censure of Pursuit', desc: 'If your oath of enmity target moves away from you willingly, you gain a bonus to damage rolls against it equal to your Dexterity modifier until the end of your next turn.' },
                          { key: 'retribution', label: 'Censure of Retribution', desc: 'When any enemy other than your oath of enmity target hits you, you gain a bonus to damage rolls against your oath target equal to your Intelligence modifier until the end of your next turn.' },
                        ]}
                        onSelect={(v) => setAvengerCensure(v as 'pursuit' | 'retribution')}
                      />
                    )}

                    {/* Barbarian: Feral Might picker */}
                    {cls.id === 'barbarian' && (
                      <BuildChoicePicker
                        label="Feral Might"
                        value={barbarianFeralMight}
                        options={[
                          { key: 'rageblood', label: 'Rageblood Vigor', desc: 'When you reduce an enemy to 0 HP, you gain temporary HP equal to your Constitution modifier (+5 at 11th, +10 at 21st level).' },
                          { key: 'thaneborn', label: 'Thaneborn Triumph', desc: 'When you reduce an enemy to 0 HP, each enemy within 5 squares takes a penalty to attack rolls equal to your Charisma modifier until the end of your next turn.' },
                        ]}
                        onSelect={(v) => setBarbarianFeralMight(v as 'rageblood' | 'thaneborn')}
                      />
                    )}

                    {/* Bard: Bardic Virtue picker */}
                    {cls.id === 'bard' && (
                      <BuildChoicePicker
                        label="Bardic Virtue"
                        value={bardVirtue}
                        options={[
                          { key: 'cunning', label: 'Virtue of Cunning', desc: 'Once per round, when an enemy attack misses an ally within 5 + INT modifier squares, you can slide that ally 1 square as a free action.' },
                          { key: 'valor', label: 'Virtue of Valor', desc: 'Once per round, when an ally within 5 squares reduces an enemy to 0 HP or bloodies an enemy, grant that ally temporary HP equal to 1 + your CON modifier (+3 at 11th, +5 at 21st).' },
                        ]}
                        onSelect={(v) => setBardVirtue(v as 'cunning' | 'valor')}
                      />
                    )}

                    {/* Druid: Primal Aspect picker */}
                    {cls.id === 'druid' && (
                      <BuildChoicePicker
                        label="Primal Aspect"
                        value={druidPrimalAspect}
                        options={[
                          { key: 'guardian', label: 'Primal Guardian', desc: 'While not wearing heavy armor, you can use CON modifier for AC instead of DEX or INT. While in beast form, you gain +1 AC.' },
                          { key: 'predator', label: 'Primal Predator', desc: 'While in beast form, your speed increases by 1.' },
                        ]}
                        onSelect={(v) => setDruidPrimalAspect(v as 'guardian' | 'predator')}
                      />
                    )}

                    {/* Invoker: Divine Covenant picker */}
                    {cls.id === 'invoker' && (
                      <BuildChoicePicker
                        label="Divine Covenant"
                        value={invokerCovenant}
                        options={[
                          { key: 'preservation', label: 'Covenant of Preservation', desc: 'When you use a divine encounter or daily attack power on your turn, you can slide an ally within 10 squares 1 square.' },
                          { key: 'wrath', label: 'Covenant of Wrath', desc: 'When you use a divine encounter or daily attack power, gain a damage bonus equal to the number of enemies you hit. +1 damage on single-target at-wills.' },
                        ]}
                        onSelect={(v) => setInvokerCovenant(v as 'preservation' | 'wrath')}
                      />
                    )}

                    {/* Shaman: Companion Spirit picker */}
                    {cls.id === 'shaman' && (
                      <BuildChoicePicker
                        label="Companion Spirit"
                        value={shamanSpirit}
                        options={[
                          { key: 'protector', label: 'Protector Spirit', desc: 'Allies adjacent to your spirit companion regain additional HP equal to your CON modifier when using second wind or when you use a healing power on them.' },
                          { key: 'stalker', label: 'Stalker Spirit', desc: 'Allies adjacent to your spirit companion gain +1 to attack rolls against bloodied enemies.' },
                        ]}
                        onSelect={(v) => setShamanSpirit(v as 'protector' | 'stalker')}
                      />
                    )}

                    {/* Sorcerer: Spell Source picker */}
                    {cls.id === 'sorcerer' && (
                      <BuildChoicePicker
                        label="Spell Source"
                        value={sorcererSpellSource}
                        options={[
                          { key: 'dragon', label: 'Dragon Magic', desc: '+2 AC while not wearing heavy armor. Bonus to arcane damage rolls equal to your STR modifier (+2 at 11th, +4 at 21st).' },
                          { key: 'wild', label: 'Wild Magic', desc: 'On a natural 20 with an arcane power, slide target 1 square and knock it prone. Bonus to arcane damage rolls equal to your DEX modifier.' },
                        ]}
                        onSelect={(v) => setSorcererSpellSource(v as 'dragon' | 'wild')}
                      />
                    )}

                    {/* Warden: Guardian Might picker */}
                    {cls.id === 'warden' && (
                      <BuildChoicePicker
                        label="Guardian Might"
                        value={wardenGuardianMight}
                        options={[
                          { key: 'earthstrength', label: 'Earthstrength', desc: 'While not wearing heavy armor, use CON modifier for AC instead of DEX or INT. When you use second wind, gain temporary HP equal to your CON modifier.' },
                          { key: 'wildblood', label: 'Wildblood', desc: 'While not wearing heavy armor, use WIS modifier for AC instead of DEX or INT. When you use second wind, enemies you mark take an additional -2 to attacks that don\'t include you.' },
                        ]}
                        onSelect={(v) => setWardenGuardianMight(v as 'earthstrength' | 'wildblood')}
                      />
                    )}

                    {/* ── PHB3 BUILD CHOICE PICKERS ── */}

                    {/* Ardent: Mantle picker */}
                    {cls.id === 'ardent' && (
                      <BuildChoicePicker
                        label="Ardent Mantle"
                        value={ardentMantle}
                        options={[
                          { key: 'clarity', label: 'Mantle of Clarity', desc: 'Allies within 5 squares gain a bonus to all defenses against opportunity attacks equal to your Wisdom modifier. You gain +2 to Insight and Perception checks.' },
                          { key: 'elation', label: 'Mantle of Elation', desc: 'Allies within 5 squares gain a bonus to damage rolls for opportunity attacks equal to your Constitution modifier. You gain +2 to Diplomacy and Intimidate checks.' },
                        ]}
                        onSelect={(v) => setArdentMantle(v as 'clarity' | 'elation')}
                      />
                    )}

                    {/* Battlemind: Psionic Study picker */}
                    {cls.id === 'battlemind' && (
                      <BuildChoicePicker
                        label="Psionic Study"
                        value={battlemindOption}
                        options={[
                          { key: 'resilience', label: 'Battle Resilience', desc: 'When you hit or miss with your first attack in an encounter, gain resist all equal to 3 + your Wisdom modifier until the end of your next turn.' },
                          { key: 'speed', label: 'Speed of Thought', desc: 'When you roll initiative, as a free action move a number of squares equal to 3 + your Charisma modifier. Usable even if you are surprised.' },
                        ]}
                        onSelect={(v) => setBattlemindOption(v as 'resilience' | 'speed')}
                      />
                    )}

                    {/* Monk: Monastic Tradition picker */}
                    {cls.id === 'monk' && (
                      <BuildChoicePicker
                        label="Monastic Tradition"
                        value={monkTradition}
                        options={[
                          { key: 'centered-breath', label: 'Centered Breath', desc: 'You gain Centered Flurry of Blows (Wisdom modifier damage, slide target 1 square). Mental Equilibrium: +1 Fortitude (+2 at 11th, +3 at 21st).' },
                          { key: 'stone-fist', label: 'Stone Fist', desc: 'You gain Stone Fist Flurry of Blows (3 + Strength modifier damage). Mental Bastion: +1 Will (+2 at 11th, +3 at 21st).' },
                        ]}
                        onSelect={(v) => setMonkTradition(v as 'centered-breath' | 'stone-fist')}
                      />
                    )}

                    {/* Psion: Discipline Focus picker */}
                    {cls.id === 'psion' && (
                      <>
                        <BuildChoicePicker
                          label="Discipline Focus"
                          value={psionDiscipline}
                          options={[
                            { key: 'telekinesis', label: 'Telekinesis Focus', desc: 'You gain Far Hand (move/manipulate objects up to 20 lbs) and Forceful Push (slide target 1 square; 2 at 11th, 3 at 21st).' },
                            { key: 'telepathy', label: 'Telepathy Focus', desc: 'You gain Distract (target grants combat advantage to next attacker) and Send Thoughts (send a mental message of 25 words to one creature within 20 squares).' },
                          ]}
                          onSelect={(v) => setPsionDiscipline(v as 'telekinesis' | 'telepathy')}
                        />
                        <BuildChoicePicker
                          label="Starting Ritual"
                          value={psionStartingRitualId}
                          options={[
                            { key: 'sending', label: 'Sending', desc: 'Level 6 ritual. You convey a mental message of up to 25 words to a person you know. The target can reply with a message of up to 25 words.' },
                            { key: 'tensers-floating-disk', label: "Tenser's Floating Disk", desc: 'Level 1 ritual. You create a slightly concave, circular plane of force that follows you and carries up to 250 pounds of gear.' },
                          ]}
                          onSelect={(v) => setPsionStartingRitualId(v)}
                        />
                      </>
                    )}

                    {/* Runepriest: Runic Artistry picker */}
                    {cls.id === 'runepriest' && (
                      <BuildChoicePicker
                        label="Runic Artistry"
                        value={runepriestArtistry}
                        options={[
                          { key: 'defiant', label: 'Defiant Word', desc: 'When an enemy misses you with an attack, you gain a bonus to damage rolls against that enemy equal to your Wisdom modifier until the end of your next turn.' },
                          { key: 'wrathful', label: 'Wrathful Hammer', desc: 'You gain proficiency with military hammers and military maces. When an enemy damages you, gain a bonus to damage rolls against that enemy equal to your Constitution modifier until the end of your next turn.' },
                        ]}
                        onSelect={(v) => setRunepriestArtistry(v as 'defiant' | 'wrathful')}
                      />
                    )}

                    {/* Seeker: Bond picker */}
                    {cls.id === 'seeker' && (
                      <BuildChoicePicker
                        label="Seeker's Bond"
                        value={seekerBond}
                        options={[
                          { key: 'bloodbond', label: 'Bloodbond', desc: 'You gain Encaging Spirits (push and slow nearby enemies). While not wearing heavy armor, you can shift as a minor action.' },
                          { key: 'spiritbond', label: 'Spiritbond', desc: "You gain Spirits' Rebuke (counterattack when missed by melee). +1 to attack rolls with thrown weapons. Thrown weapons return after attack. Use STR for AC instead of DEX/INT." },
                        ]}
                        onSelect={(v) => setSeekerBond(v as 'bloodbond' | 'spiritbond')}
                      />
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
