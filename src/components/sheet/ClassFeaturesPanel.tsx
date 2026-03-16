import type { Character } from '../../types/character';
import { getClassById } from '../../data/classes';

interface Props {
  character: Character;
}

// Extra detail blocks shown beneath specific features when the character
// has made a relevant sub-choice (implement mastery, eldritch pact, etc.)
function ImplementDetail({ impl }: { impl: 'orb' | 'staff' | 'wand' }) {
  const details = {
    orb: {
      name: 'Orb of Imposition',
      usage: 'Encounter · Free Action',
      text:
        'You can designate one creature you have cast a wizard spell upon that has an effect that lasts until ' +
        'the subject succeeds on a saving throw. That creature takes a penalty to its next saving throw against ' +
        'that effect equal to your Wisdom modifier. Alternatively, you can extend the duration of an effect ' +
        'created by a wizard at-will spell that would otherwise end at the end of your current turn — it instead ' +
        'ends at the end of your next turn.',
    },
    staff: {
      name: 'Staff of Defense',
      usage: 'Encounter · Immediate Interrupt',
      text:
        'Passive: +1 bonus to AC while wielding your staff. ' +
        'Trigger: You are hit by an attack. ' +
        'Effect: You gain a bonus to defense against the triggering attack equal to your Constitution modifier.',
    },
    wand: {
      name: 'Wand of Accuracy',
      usage: 'Encounter · Free Action',
      text: 'You gain a bonus to a single attack roll equal to your Dexterity modifier. You must wield your wand.',
    },
  }[impl];

  return (
    <div className="mt-3 pt-3 border-t border-amber-200">
      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">
        Chosen Mastery: {details.name}
      </p>
      <p className="text-[10px] font-medium text-amber-600 mb-1">{details.usage}</p>
      <p className="text-xs text-stone-600 leading-relaxed">{details.text}</p>
    </div>
  );
}

function PactDetail({ pact }: { pact: 'infernal' | 'fey' | 'star' }) {
  const details = {
    infernal: {
      name: 'Infernal Pact',
      boon: "Dark One's Blessing",
      text:
        'Trigger: You reduce an enemy to 0 hit points or fewer. ' +
        'Effect: You gain temporary hit points equal to your Charisma modifier + your level.',
      lore:
        'Your power is drawn from dark bargains with devils and demons. Your eldritch blast ' +
        'deals fire and necrotic damage, and your curse empowers strikes with infernal wrath.',
    },
    fey: {
      name: 'Fey Pact',
      boon: 'Misty Step',
      text:
        'Trigger: You reduce an enemy to 0 hit points or fewer. ' +
        'Effect: You teleport 3 squares.',
      lore:
        'Your power is bound to the capricious lords of the Feywild. Your eldritch blast ' +
        'deals radiant and psychic damage, and your curse grants supernatural speed.',
    },
    star: {
      name: 'Star Pact',
      boon: 'Fate of the Void',
      text:
        'Trigger: You reduce an enemy to 0 hit points or fewer. ' +
        'Effect: You gain a cumulative +1 bonus to attack rolls until the end of the encounter.',
      lore:
        'Your power connects you to alien entities beyond the known planes. Your eldritch blast ' +
        'deals psychic and necrotic damage, and each kill fuels your growing power.',
    },
  }[pact];

  return (
    <div className="mt-3 pt-3 border-t border-amber-200">
      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">
        Chosen Pact: {details.name}
      </p>
      <p className="text-xs italic text-amber-700 mb-2 leading-relaxed">{details.lore}</p>
      <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wide mb-0.5">
        Pact Boon: {details.boon}
      </p>
      <p className="text-xs text-stone-600 leading-relaxed">{details.text}</p>
    </div>
  );
}

// ── PHB2 build choice detail component ──────────────────────────────────────
const PHB2_BUILD_CHOICES: Record<string, Record<string, { label: string; description: string }>> = {
  avenger: {
    pursuit: { label: 'Censure of Pursuit', description: 'If your oath of enmity target moves away from you willingly, you gain a bonus to damage rolls against the target equal to your Dexterity modifier until the end of your next turn.' },
    retribution: { label: 'Censure of Retribution', description: 'When any enemy other than your oath of enmity target hits you, you gain a bonus to damage rolls against your oath of enmity target equal to your Intelligence modifier until the end of your next turn.' },
  },
  barbarian: {
    rageblood: { label: 'Rageblood Vigor', description: 'While you are raging, you gain temporary hit points equal to your Constitution modifier the first time you are bloodied during the encounter. Also, your swift charge power gains a bonus to damage equal to your Constitution modifier.' },
    thaneborn: { label: 'Thaneborn Triumph', description: 'While you are raging, whenever your attack reduces an enemy to 0 hit points, each enemy adjacent to you takes a penalty to attack rolls equal to your Charisma modifier until the end of your next turn. Also, your swift charge power gains a bonus to the attack roll equal to your Charisma modifier.' },
  },
  bard: {
    cunning: { label: 'Virtue of Cunning', description: 'Once per round, when an enemy attack misses an ally within a number of squares of you equal to 5 + your Intelligence modifier, you can slide that ally 1 square as a free action.' },
    valor: { label: 'Virtue of Valor', description: 'Once per round, when any ally within 5 squares of you reduces an enemy to 0 hit points or bloodies an enemy, you can grant temporary hit points to that ally as a free action. The number of temporary hit points equals 1 + your Constitution modifier at 1st level, 3 + your Constitution modifier at 11th level, and 5 + your Constitution modifier at 21st level.' },
  },
  druid: {
    guardian: { label: 'Primal Guardian', description: 'While you are not wearing heavy armor, you can use your Constitution modifier in place of your Dexterity or Intelligence modifier to determine your AC.' },
    predator: { label: 'Primal Predator', description: 'While you are not wearing heavy armor, you gain a +1 bonus to your speed.' },
  },
  invoker: {
    preservation: { label: 'Covenant of Preservation', description: 'When you use a divine encounter or daily attack power on your turn, you can slide an ally within 10 squares of you 1 square.' },
    wrath: { label: 'Covenant of Wrath', description: 'When you use a divine encounter or daily attack power on your turn, you gain a bonus to the damage roll equal to 1 for each enemy you hit with the power. At 5th level, the bonus increases to 2, at 15th level to 3, and at 25th level to 4.' },
  },
  shaman: {
    protector: { label: 'Protector Spirit', description: 'Any ally adjacent to your spirit companion regains additional hit points equal to your Constitution modifier when he or she uses second wind or when you use a healing power on that ally.' },
    stalker: { label: 'Stalker Spirit', description: 'Any ally adjacent to your spirit companion gains a bonus to damage rolls against bloodied enemies equal to your Intelligence modifier.' },
  },
  sorcerer: {
    dragon: { label: 'Dragon Magic', description: 'You gain a bonus to AC equal to your Strength modifier while you are wearing cloth armor or no armor and not using a shield. You also gain +2 bonus to Intimidate checks and resist 5 to your chosen damage type (increases at L11 and L21).' },
    wild: { label: 'Wild Magic', description: 'You gain a bonus to AC equal to your Dexterity modifier while you are wearing cloth armor or no armor and not using a shield. You also gain a +1 bonus to Reflex. Additionally, whenever you roll a natural 20 on an attack roll for an arcane power, you slide the target 1 square and knock it prone after applying the attack\'s effects.' },
    storm: { label: 'Storm Magic', description: 'You gain a bonus to AC equal to your Strength modifier while you are wearing cloth armor or no armor and not using a shield. When you hit an enemy with a thunder or lightning power, you push that enemy a number of squares equal to your Dexterity modifier.' },
  },
  warden: {
    earthstrength: { label: 'Earthstrength', description: 'While you are not wearing heavy armor, you can use your Constitution modifier in place of your Dexterity or Intelligence modifier to determine your AC. When you use your second wind, you also gain an additional bonus to AC equal to your Constitution modifier. This bonus lasts until the end of your next turn.' },
    wildblood: { label: 'Wildblood', description: 'While you are not wearing heavy armor, you can use your Wisdom modifier in place of your Dexterity or Intelligence modifier to determine your AC. When you use your second wind, each enemy marked by you takes an additional penalty of -2 to attack rolls for attacks that don\'t include you as a target. This penalty lasts until the end of your next turn.' },
  },
  // PHB3
  ardent: {
    clarity: { label: 'Mantle of Clarity', description: 'You and each ally within 5 squares of you gain a bonus to all defenses against opportunity attacks equal to your Wisdom modifier. When you use ardent surge, the target can also make a saving throw.' },
    elation: { label: 'Mantle of Elation', description: 'You and each ally within 5 squares of you gain a bonus to damage rolls for opportunity attacks equal to your Constitution modifier. When you use ardent surge, each ally in the burst gains a +1 bonus to attack rolls until the end of your next turn.' },
  },
  battlemind: {
    resilience: { label: 'Battle Resilience', description: 'You gain the battle resilience power. When an attack hits or misses you for the first time during an encounter, you gain resistance to all damage equal to 3 + your Wisdom modifier until the end of your next turn.' },
    speed: { label: 'Speed of Thought', description: 'You gain the speed of thought power. When you roll initiative, you can move a number of squares equal to 3 + your Charisma modifier as a free action, even if you are surprised.' },
  },
  monk: {
    'centered-breath': { label: 'Centered Breath', description: 'You gain the centered flurry of blows power. When you hit with an attack during your turn, you deal Wisdom modifier damage to one adjacent creature and slide it 1 square.' },
    'stone-fist': { label: 'Stone Fist', description: 'You gain the stone fist flurry of blows power. When you hit with an attack during your turn, you deal 3 + Strength modifier damage to one adjacent creature.' },
  },
  psion: {
    telekinesis: { label: 'Telekinesis Focus', description: 'You gain the far hand and forceful push powers. Far hand lets you move objects with your mind; forceful push lets you slide enemies.' },
    telepathy: { label: 'Telepathy Focus', description: 'You gain the distract and send thoughts powers. Distract forces enemies to grant combat advantage; send thoughts lets you communicate mentally.' },
  },
  runepriest: {
    defiant: { label: 'Defiant Word', description: 'When you hit an enemy with a runepriest at-will attack power, each bloodied ally within 5 squares of you gains temporary hit points equal to your Constitution modifier.' },
    wrathful: { label: 'Wrathful Hammer', description: 'When you hit an enemy with a runepriest at-will attack power, you push that enemy 1 square. Once per round, an ally adjacent to the pushed enemy can make a melee basic attack against it as a free action.' },
  },
  seeker: {
    bloodbond: { label: 'Bloodbond', description: 'You gain encaging spirits (encounter, minor, close burst 1; push each enemy 1 and slow until end of next turn). While not wearing heavy armor, you can shift as a minor action.' },
    spiritbond: { label: 'Spiritbond', description: 'You gain spirits\' rebuke (encounter, immediate reaction when enemy misses you with melee, 1[W] + Str damage and push 1). You gain +1 to attack rolls with thrown weapons, and thrown weapons return to you after an attack.' },
  },
};

function BuildChoiceDetail({ classId, choice }: { classId: string; choice: string }) {
  const options = PHB2_BUILD_CHOICES[classId];
  if (!options) return null;
  const detail = options[choice];
  if (!detail) return null;

  return (
    <div className="mt-3 pt-3 border-t border-amber-200">
      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">
        Chosen: {detail.label}
      </p>
      <p className="text-xs text-stone-600 leading-relaxed">{detail.description}</p>
    </div>
  );
}

// Map classId → { featureName, characterField }
const BUILD_CHOICE_MAP: Record<string, { featureName: string; field: keyof Character }> = {
  avenger:   { featureName: "Avenger's Censure",       field: 'avengerCensure' },
  barbarian: { featureName: 'Feral Might',             field: 'barbarianFeralMight' },
  bard:      { featureName: 'Bardic Virtue',           field: 'bardVirtue' },
  druid:     { featureName: 'Primal Aspect',           field: 'druidPrimalAspect' },
  invoker:   { featureName: 'Divine Covenant',         field: 'invokerCovenant' },
  shaman:    { featureName: 'Companion Spirit Choice',  field: 'shamanSpirit' },
  sorcerer:  { featureName: 'Spell Source',            field: 'sorcererSpellSource' },
  warden:    { featureName: 'Guardian Might',          field: 'wardenGuardianMight' },
  // PHB3
  ardent:     { featureName: 'Ardent Mantle',           field: 'ardentMantle' },
  battlemind: { featureName: 'Psionic Study',           field: 'battlemindOption' },
  monk:       { featureName: 'Monastic Tradition',      field: 'monkTradition' },
  psion:      { featureName: 'Discipline Focus',        field: 'psionDiscipline' },
  runepriest: { featureName: 'Runic Artistry',          field: 'runepriestArtistry' },
  seeker:     { featureName: "Seeker's Bond",           field: 'seekerBond' },
};

export function ClassFeaturesPanel({ character }: Props) {
  const cls = getClassById(character.classId);
  if (!cls) return <p className="p-4 text-stone-400 italic">No class selected.</p>;

  const buildChoice = BUILD_CHOICE_MAP[cls.id];

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs text-stone-500 italic">
        Class features granted by the {cls.name} class.
      </p>

      {cls.features.map((feature) => {
        const isImplementFeature = cls.id === 'wizard' && feature.name === 'Arcane Implement Proficiency';
        const isPactFeature      = cls.id === 'warlock' && feature.name === 'Eldritch Pact';
        const isBuildChoice      = buildChoice && feature.name === buildChoice.featureName;

        return (
          <div
            key={feature.name}
            className="rounded-xl border border-stone-200 bg-white p-4"
          >
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-bold text-stone-800">{feature.name}</span>
              {feature.level > 1 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 font-medium shrink-0">
                  Level {feature.level}
                </span>
              )}
            </div>

            {/* ── Description ── */}
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              {feature.description}
            </p>

            {/* ── Wizard implement detail ── */}
            {isImplementFeature && character.arcaneImplement && (
              <ImplementDetail impl={character.arcaneImplement} />
            )}
            {isImplementFeature && !character.arcaneImplement && (
              <p className="mt-2 text-[10px] italic text-amber-600">
                No implement mastery chosen. Edit your character (Step 3) to select one.
              </p>
            )}

            {/* ── Warlock pact detail ── */}
            {isPactFeature && character.warlockPact && (
              <PactDetail pact={character.warlockPact} />
            )}
            {isPactFeature && !character.warlockPact && (
              <p className="mt-2 text-[10px] italic text-amber-600">
                No pact chosen. Edit your character (Step 3) to select one.
              </p>
            )}

            {/* ── PHB2 build choice detail ── */}
            {isBuildChoice && character[buildChoice.field] && (
              <BuildChoiceDetail classId={cls.id} choice={character[buildChoice.field] as string} />
            )}
            {isBuildChoice && !character[buildChoice.field] && (
              <p className="mt-2 text-[10px] italic text-amber-600">
                No choice made. Edit your character (Step 3) to select one.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
