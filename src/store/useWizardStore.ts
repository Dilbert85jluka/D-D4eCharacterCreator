import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Ability, AbilityScores, Character, EquipmentItem, Alignment, WizardSpellbook, RitualBook } from '../types/character';
import { defaultAbilityScores, totalPointsSpent, POINT_BUY_BUDGET, POINT_BUY_COSTS, ABILITY_MIN, ABILITY_MAX } from '../utils/abilityScores';
import { getClassById } from '../data/classes';
import { getRaceById } from '../data/races';
import { getStartingGoldByClass } from '../data/equipment';
import { calculateMaxHp } from '../utils/hitPoints';
import { parseRaceLanguages } from '../data/languages';
import { getMulticlassId } from '../data/feats';
import { getPowerById } from '../data/powers';
import { usesPowerPoints, getMaxPowerPoints } from '../utils/psionics';
import { getRitualById } from '../data/rituals';

const DEFAULT_SCORES: AbilityScores = defaultAbilityScores();
const TOTAL_STEPS = 10;

interface WizardState {
  currentStep: number;

  // Step 1 - Basics
  name: string;
  playerName: string;
  gender: string;
  age: string;
  alignment: Alignment;
  deity: string;
  background: string;

  // Step 1 - Appearance
  height: string;
  weight: string;
  build: string;
  eyeColor: string;
  hairColor: string;

  // Step 2
  raceId: string;
  subraceId: string; // e.g. 'longtooth' or 'razorclaw' for Shifter
  humanAbilityBonus: Ability | '';
  racialAbilityBonusChoice: Ability | ''; // For non-human races with two ability bonus options
  bonusLanguage: string; // Chosen bonus language for races that get a language choice

  // Step 3
  classId: string;
  arcaneImplement: 'orb' | 'staff' | 'wand' | '';
  warlockPact: 'infernal' | 'fey' | 'star' | '';
  fighterCombatStyle: 'superiority' | 'agility' | '';
  // PHB2 class build choices
  avengerCensure: 'pursuit' | 'retribution' | '';
  barbarianFeralMight: 'rageblood' | 'thaneborn' | '';
  bardVirtue: 'cunning' | 'valor' | '';
  druidPrimalAspect: 'guardian' | 'predator' | '';
  invokerCovenant: 'preservation' | 'wrath' | '';
  shamanSpirit: 'protector' | 'stalker' | '';
  sorcererSpellSource: 'dragon' | 'wild' | '';
  wardenGuardianMight: 'earthstrength' | 'wildblood' | '';
  // PHB3 class build choices
  ardentMantle: 'clarity' | 'elation' | '';
  battlemindOption: 'resilience' | 'speed' | '';
  monkTradition: 'centered-breath' | 'stone-fist' | '';
  psionDiscipline: 'telekinesis' | 'telepathy' | '';
  psionStartingRitualId: string;  // Psion gets one of 'sending' or 'tensers-floating-disk'
  runepriestArtistry: 'defiant' | 'wrathful' | '';
  seekerBond: 'bloodbond' | 'spiritbond' | '';

  // Step 4
  baseAbilityScores: AbilityScores;

  // Step 5
  trainedSkills: string[];
  mandatorySkillChoicePick: string; // Ranger: Dungeoneering or Nature
  bonusSkillTrained: string; // Human bonus skill

  // Step 6
  selectedPowerIds: string[];
  dilettanteClassId: string; // Half-Elf bonus at-will class
  dilettantePowerId: string;

  // Step 7
  selectedFeatIds: string[];
  mcFeatSkillChoices: Record<string, string>;
  mcFeatProficiencyChoices: Record<string, string>;

  // Step 8
  equipment: EquipmentItem[];
  goldPieces: number;

  // Wizard spellbook — starting mastered rituals (class feature, 3 at level 1)
  wizardStartingRitualIds: string[];

  // Step 9 - Hit Points
  customHp: number | null; // null = use auto-calculated

  // Step 1 - Leveling preference
  levelingMode: 'milestone' | 'xp';
  setLevelingMode: (mode: 'milestone' | 'xp') => void;

  // --- Actions ---
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  setName: (name: string) => void;
  setPlayerName: (v: string) => void;
  setGender: (v: string) => void;
  setAge: (v: string) => void;
  setAlignment: (v: Alignment) => void;
  setDeity: (v: string) => void;
  setBackground: (v: string) => void;
  setHeight: (v: string) => void;
  setWeight: (v: string) => void;
  setBuild: (v: string) => void;
  setEyeColor: (v: string) => void;
  setHairColor: (v: string) => void;
  setBonusLanguage: (v: string) => void;

  setRace: (raceId: string) => void;
  setSubrace: (subraceId: string) => void;
  setHumanAbilityBonus: (ab: Ability) => void;
  setRacialAbilityBonusChoice: (ab: Ability) => void;

  setClass: (classId: string) => void;
  setArcaneImplement: (v: 'orb' | 'staff' | 'wand' | '') => void;
  setWarlockPact: (v: 'infernal' | 'fey' | 'star' | '') => void;
  setFighterCombatStyle: (v: 'superiority' | 'agility' | '') => void;
  setAvengerCensure: (v: 'pursuit' | 'retribution' | '') => void;
  setBarbarianFeralMight: (v: 'rageblood' | 'thaneborn' | '') => void;
  setBardVirtue: (v: 'cunning' | 'valor' | '') => void;
  setDruidPrimalAspect: (v: 'guardian' | 'predator' | '') => void;
  setInvokerCovenant: (v: 'preservation' | 'wrath' | '') => void;
  setShamanSpirit: (v: 'protector' | 'stalker' | '') => void;
  setSorcererSpellSource: (v: 'dragon' | 'wild' | '') => void;
  setWardenGuardianMight: (v: 'earthstrength' | 'wildblood' | '') => void;
  setArdentMantle: (v: 'clarity' | 'elation' | '') => void;
  setBattlemindOption: (v: 'resilience' | 'speed' | '') => void;
  setMonkTradition: (v: 'centered-breath' | 'stone-fist' | '') => void;
  setPsionDiscipline: (v: 'telekinesis' | 'telepathy' | '') => void;
  setPsionStartingRitualId: (v: string) => void;
  setRunepriestArtistry: (v: 'defiant' | 'wrathful' | '') => void;
  setSeekerBond: (v: 'bloodbond' | 'spiritbond' | '') => void;

  setAbilityScore: (ability: Ability, value: number) => void;

  toggleSkill: (skillId: string) => void;
  setMandatorySkillChoicePick: (skillId: string) => void;
  setBonusSkill: (skillId: string) => void;

  togglePower: (powerId: string, usage: string) => void;
  setDilettante: (classId: string, powerId: string) => void;

  toggleFeat: (featId: string) => void;
  setMcFeatSkillChoice: (featId: string, skillId: string) => void;
  setMcFeatProficiencyChoice: (featId: string, proficiency: string) => void;
  clearMcFeatChoices: (featId: string) => void;

  addEquipment: (item: EquipmentItem) => void;
  removeEquipment: (itemId: string) => void;
  removeEquipmentByInstance: (instanceId: string) => void;
  updateEquipmentQuantity: (itemId: string, newQty: number) => void;
  spendGold: (amount: number) => void;
  refundGold: (amount: number) => void;

  setCustomHp: (hp: number | null) => void;

  toggleWizardStartingRitual: (ritualId: string) => void;

  buildCharacter: () => Omit<Character, 'id' | 'createdAt' | 'updatedAt'>;
  resetWizard: () => void;
}

const initialState = {
  currentStep: 1,
  name: '',
  playerName: '',
  gender: '',
  age: '',
  alignment: 'Unaligned' as Alignment,
  deity: '',
  background: '',
  height: '',
  weight: '',
  build: '',
  eyeColor: '',
  hairColor: '',
  raceId: '',
  subraceId: '',
  humanAbilityBonus: '' as Ability | '',
  racialAbilityBonusChoice: '' as Ability | '',
  bonusLanguage: '',
  classId: '',
  arcaneImplement: '' as 'orb' | 'staff' | 'wand' | '',
  warlockPact: '' as 'infernal' | 'fey' | 'star' | '',
  fighterCombatStyle: '' as 'superiority' | 'agility' | '',
  avengerCensure: '' as 'pursuit' | 'retribution' | '',
  barbarianFeralMight: '' as 'rageblood' | 'thaneborn' | '',
  bardVirtue: '' as 'cunning' | 'valor' | '',
  druidPrimalAspect: '' as 'guardian' | 'predator' | '',
  invokerCovenant: '' as 'preservation' | 'wrath' | '',
  shamanSpirit: '' as 'protector' | 'stalker' | '',
  sorcererSpellSource: '' as 'dragon' | 'wild' | '',
  wardenGuardianMight: '' as 'earthstrength' | 'wildblood' | '',
  ardentMantle: '' as 'clarity' | 'elation' | '',
  battlemindOption: '' as 'resilience' | 'speed' | '',
  monkTradition: '' as 'centered-breath' | 'stone-fist' | '',
  psionDiscipline: '' as 'telekinesis' | 'telepathy' | '',
  psionStartingRitualId: '' as string,
  runepriestArtistry: '' as 'defiant' | 'wrathful' | '',
  seekerBond: '' as 'bloodbond' | 'spiritbond' | '',
  baseAbilityScores: { ...DEFAULT_SCORES },
  trainedSkills: [] as string[],
  mandatorySkillChoicePick: '',
  bonusSkillTrained: '',
  selectedPowerIds: [] as string[],
  dilettanteClassId: '',
  dilettantePowerId: '',
  selectedFeatIds: [] as string[],
  mcFeatSkillChoices: {} as Record<string, string>,
  mcFeatProficiencyChoices: {} as Record<string, string>,
  equipment: [] as EquipmentItem[],
  goldPieces: 100,
  customHp: null as number | null,
  wizardStartingRitualIds: [] as string[],
  levelingMode: 'milestone' as 'milestone' | 'xp',
};

export const useWizardStore = create<WizardState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  setName: (name) => set({ name }),
  setPlayerName: (v) => set({ playerName: v }),
  setGender: (v) => set({ gender: v }),
  setAge: (v) => set({ age: v }),
  setAlignment: (v) => set({ alignment: v }),
  setDeity: (v) => set({ deity: v }),
  setBackground: (v) => set({ background: v }),
  setHeight: (v) => set({ height: v }),
  setWeight: (v) => set({ weight: v }),
  setBuild: (v) => set({ build: v }),
  setEyeColor: (v) => set({ eyeColor: v }),
  setHairColor: (v) => set({ hairColor: v }),
  setBonusLanguage: (v) => set({ bonusLanguage: v }),

  setRace: (raceId) => {
    const cls = getClassById(get().classId);
    set({ raceId, subraceId: '', trainedSkills: cls?.mandatorySkills ? [...cls.mandatorySkills] : [], mandatorySkillChoicePick: '', selectedPowerIds: [], selectedFeatIds: [], mcFeatSkillChoices: {}, mcFeatProficiencyChoices: {}, racialAbilityBonusChoice: '', bonusLanguage: '', bonusSkillTrained: '', dilettanteClassId: '', dilettantePowerId: '' });
  },

  setSubrace: (subraceId) => set({ subraceId, racialAbilityBonusChoice: '' }),

  setHumanAbilityBonus: (ab) => set({ humanAbilityBonus: ab }),
  setRacialAbilityBonusChoice: (ab) => set({ racialAbilityBonusChoice: ab }),

  setArcaneImplement: (v) => set({ arcaneImplement: v }),
  setWarlockPact: (v) => set({ warlockPact: v }),
  setFighterCombatStyle: (v) => set({ fighterCombatStyle: v }),
  setAvengerCensure: (v) => set({ avengerCensure: v }),
  setBarbarianFeralMight: (v) => set({ barbarianFeralMight: v }),
  setBardVirtue: (v) => set({ bardVirtue: v }),
  setDruidPrimalAspect: (v) => set({ druidPrimalAspect: v }),
  setInvokerCovenant: (v) => set({ invokerCovenant: v }),
  setShamanSpirit: (v) => set({ shamanSpirit: v }),
  setSorcererSpellSource: (v) => set({ sorcererSpellSource: v }),
  setWardenGuardianMight: (v) => set({ wardenGuardianMight: v }),
  setArdentMantle: (v) => set({ ardentMantle: v }),
  setBattlemindOption: (v) => set({ battlemindOption: v }),
  setMonkTradition: (v) => set({ monkTradition: v }),
  setPsionDiscipline: (v) => set({ psionDiscipline: v }),
  setPsionStartingRitualId: (v) => set({ psionStartingRitualId: v }),
  setRunepriestArtistry: (v) => set({ runepriestArtistry: v }),
  setSeekerBond: (v) => set({ seekerBond: v }),

  setClass: (classId) => {
    const cls = getClassById(classId);
    const gold = getStartingGoldByClass(classId);
    set({
      classId,
      trainedSkills: cls?.mandatorySkills ? [...cls.mandatorySkills] : [],
      mandatorySkillChoicePick: '',
      selectedPowerIds: [],
      selectedFeatIds: [],
      mcFeatSkillChoices: {},
      mcFeatProficiencyChoices: {},
      equipment: [],
      goldPieces: gold,
      bonusSkillTrained: '',
      // Reset implement mastery if switching away from wizard
      ...(classId !== 'wizard' ? { arcaneImplement: '' as const } : {}),
      // Reset pact if switching away from warlock
      ...(classId !== 'warlock' ? { warlockPact: '' as const } : {}),
      // Reset fighter combat style if switching away from fighter
      ...(classId !== 'fighter' ? { fighterCombatStyle: '' as const } : {}),
      // Reset PHB2 build choices when switching classes
      ...(classId !== 'avenger' ? { avengerCensure: '' as const } : {}),
      ...(classId !== 'barbarian' ? { barbarianFeralMight: '' as const } : {}),
      ...(classId !== 'bard' ? { bardVirtue: '' as const } : {}),
      ...(classId !== 'druid' ? { druidPrimalAspect: '' as const } : {}),
      ...(classId !== 'invoker' ? { invokerCovenant: '' as const } : {}),
      ...(classId !== 'shaman' ? { shamanSpirit: '' as const } : {}),
      ...(classId !== 'sorcerer' ? { sorcererSpellSource: '' as const } : {}),
      ...(classId !== 'warden' ? { wardenGuardianMight: '' as const } : {}),
      // Reset PHB3 build choices when switching classes
      ...(classId !== 'ardent' ? { ardentMantle: '' as const } : {}),
      ...(classId !== 'battlemind' ? { battlemindOption: '' as const } : {}),
      ...(classId !== 'monk' ? { monkTradition: '' as const } : {}),
      ...(classId !== 'psion' ? { psionDiscipline: '' as const, psionStartingRitualId: '' } : {}),
      ...(classId !== 'runepriest' ? { runepriestArtistry: '' as const } : {}),
      ...(classId !== 'seeker' ? { seekerBond: '' as const } : {}),
      // Reset wizard starting rituals
      wizardStartingRitualIds: [],
    });
    // Reset ability scores only if switching class
    if (cls && !get().classId) {
      set({ baseAbilityScores: { ...DEFAULT_SCORES } });
    }
  },

  setAbilityScore: (ability, value) => {
    const clamped = Math.max(ABILITY_MIN, Math.min(ABILITY_MAX, value));
    const current = get().baseAbilityScores;
    const newScores = { ...current, [ability]: clamped };
    const spent = totalPointsSpent(newScores);
    if (spent <= POINT_BUY_BUDGET && POINT_BUY_COSTS[clamped] !== undefined) {
      set({ baseAbilityScores: newScores });
    }
  },

  toggleSkill: (skillId) => {
    const cls = getClassById(get().classId);
    if (!cls) return;
    // Prevent removing mandatory auto-trained skills
    if (cls.mandatorySkills?.includes(skillId)) return;
    // Prevent removing the mandatory skill choice pick (use setMandatorySkillChoicePick to swap it)
    if (get().mandatorySkillChoicePick === skillId && cls.mandatorySkillChoice?.includes(skillId)) return;
    const maxSkills = cls.trainedSkillCount;
    set((s) => {
      const current = s.trainedSkills;
      if (current.includes(skillId)) {
        return { trainedSkills: current.filter((sk) => sk !== skillId) };
      }
      if (current.length >= maxSkills) return s; // at cap
      return { trainedSkills: [...current, skillId] };
    });
  },

  setMandatorySkillChoicePick: (skillId) => {
    set((s) => {
      const cls = getClassById(s.classId);
      if (!cls?.mandatorySkillChoice) return s;
      const prevPick = s.mandatorySkillChoicePick;
      // If clicking the same one, deselect it
      if (prevPick === skillId) {
        return {
          mandatorySkillChoicePick: '',
          trainedSkills: s.trainedSkills.filter((sk) => sk !== skillId),
        };
      }
      // Remove old pick from trainedSkills, add new one
      let newSkills = prevPick
        ? s.trainedSkills.filter((sk) => sk !== prevPick)
        : [...s.trainedSkills];
      if (!newSkills.includes(skillId)) {
        newSkills = [...newSkills, skillId];
      }
      return { mandatorySkillChoicePick: skillId, trainedSkills: newSkills };
    });
  },

  setBonusSkill: (skillId) => set({ bonusSkillTrained: skillId }),

  togglePower: (powerId, usage) => {
    set((s) => {
      const cls = getClassById(s.classId);
      if (!cls) return s;

      const current = s.selectedPowerIds;

      if (current.includes(powerId)) {
        return { selectedPowerIds: current.filter((id) => id !== powerId) };
      }

      // Count how many of this usage type are selected
      // We need to import powers here to check usage type
      // Keep it simple: caller ensures usage matches
      const limits: Record<string, number> = {
        'at-will': s.raceId === 'human' ? cls.atWillPowerCount + 1 : cls.atWillPowerCount,
        'encounter': cls.encounterPowerCount,
        'daily': cls.dailyPowerCount,
      };

      // Count current selections of same usage
      // For now just push and let step validation handle display
      return { selectedPowerIds: [...current, powerId] };
    });
  },

  setDilettante: (classId, powerId) => set({ dilettanteClassId: classId, dilettantePowerId: powerId }),

  toggleFeat: (featId) => {
    set((s) => {
      const current = s.selectedFeatIds;
      if (current.includes(featId)) {
        return { selectedFeatIds: current.filter((id) => id !== featId) };
      }
      const maxFeats = s.raceId === 'human' ? 2 : 1;
      if (current.length >= maxFeats) {
        // Replace the last one
        return { selectedFeatIds: [...current.slice(0, maxFeats - 1), featId] };
      }
      return { selectedFeatIds: [...current, featId] };
    });
  },

  setMcFeatSkillChoice: (featId, skillId) =>
    set((s) => ({
      mcFeatSkillChoices: { ...s.mcFeatSkillChoices, [featId]: skillId },
      trainedSkills: s.trainedSkills.includes(skillId)
        ? s.trainedSkills
        : [...s.trainedSkills, skillId],
    })),

  setMcFeatProficiencyChoice: (featId, proficiency) =>
    set((s) => ({
      mcFeatProficiencyChoices: { ...s.mcFeatProficiencyChoices, [featId]: proficiency },
    })),

  clearMcFeatChoices: (featId) =>
    set((s) => {
      const skillToRemove = s.mcFeatSkillChoices[featId];
      const newSkillChoices = { ...s.mcFeatSkillChoices };
      const newProfChoices = { ...s.mcFeatProficiencyChoices };
      delete newSkillChoices[featId];
      delete newProfChoices[featId];
      return {
        mcFeatSkillChoices: newSkillChoices,
        mcFeatProficiencyChoices: newProfChoices,
        trainedSkills: skillToRemove
          ? s.trainedSkills.filter((sk) => sk !== skillToRemove)
          : s.trainedSkills,
      };
    }),

  addEquipment: (item) =>
    set((s) => ({ equipment: [...s.equipment, item] })),

  removeEquipment: (itemId) =>
    set((s) => ({ equipment: s.equipment.filter((e) => e.itemId !== itemId) })),

  removeEquipmentByInstance: (instanceId) =>
    set((s) => ({ equipment: s.equipment.filter((e) => (e.instanceId ?? e.itemId) !== instanceId) })),

  updateEquipmentQuantity: (itemId, newQty) =>
    set((s) => ({
      equipment: s.equipment.map((e) =>
        e.itemId === itemId ? { ...e, quantity: newQty } : e
      ),
    })),

  spendGold: (amount) =>
    set((s) => ({ goldPieces: Math.max(0, s.goldPieces - amount) })),

  refundGold: (amount) =>
    set((s) => ({ goldPieces: s.goldPieces + amount })),

  setCustomHp: (hp) => set({ customHp: hp }),
  setLevelingMode: (mode) => set({ levelingMode: mode }),

  toggleWizardStartingRitual: (ritualId) =>
    set((s) => {
      const current = s.wizardStartingRitualIds;
      if (current.includes(ritualId)) {
        return { wizardStartingRitualIds: current.filter((id) => id !== ritualId) };
      }
      if (current.length >= 3) return s; // max 3
      return { wizardStartingRitualIds: [...current, ritualId] };
    }),

  buildCharacter: () => {
    const s = get();
    const cls = getClassById(s.classId);
    const raceData = getRaceById(s.raceId);

    // Apply human +2 bonus to chosen ability
    const finalBaseScores = { ...s.baseAbilityScores };
    if (s.raceId === 'human' && s.humanAbilityBonus) {
      finalBaseScores[s.humanAbilityBonus] = finalBaseScores[s.humanAbilityBonus] + 2;
    }

    // Compile trained skills (including racial bonus skill — Human class skill, Eladrin Education)
    const allTrainedSkills = [...s.trainedSkills];
    if (raceData?.bonusSkill && s.bonusSkillTrained && !allTrainedSkills.includes(s.bonusSkillTrained)) {
      allTrainedSkills.push(s.bonusSkillTrained);
    }

    // Compile all powers including dilettante
    const allPowerIds = [...s.selectedPowerIds];
    if (s.raceId === 'half-elf' && s.dilettantePowerId) {
      allPowerIds.push(s.dilettantePowerId);
    }

    // Build racial ability choice bonus map
    const racialAbilityChoiceBonus: Partial<Record<Ability, number>> = {};
    if (s.racialAbilityBonusChoice && s.raceId !== 'human') {
      racialAbilityChoiceBonus[s.racialAbilityBonusChoice] = 2;
    }

    // Get subrace data if applicable
    const subraceData = raceData?.subraces?.find((sr) => sr.id === s.subraceId);

    // Compute final CON score (base + fixed racial bonus + subrace bonus + chosen racial bonus)
    // This matches useCharacterDerived so currentHp === maxHp at creation.
    const finalCon = finalBaseScores.con
      + (raceData?.abilityBonuses.con ?? 0)
      + (subraceData?.abilityBonuses.con ?? 0)
      + (racialAbilityChoiceBonus.con ?? 0);
    const autoHp = cls ? calculateMaxHp(cls.hpAtFirstLevel, cls.hpPerLevel, finalCon, 1) : 12;

    // Build selected languages list from racial automatics + chosen bonus
    const { automatic: autoLangs, hasBonusChoice } = parseRaceLanguages(raceData?.languages ?? []);
    const selectedLanguages = [...autoLangs];
    if (hasBonusChoice && s.bonusLanguage) selectedLanguages.push(s.bonusLanguage);

    const multiclassId = getMulticlassId(s.selectedFeatIds);

    // Wizard spellbook: all dailies+utilities go into the spellbook only.
    // User manually prepares them from the Spellbook tab — nothing is auto-prepared.
    const isWizard = s.classId === 'wizard';
    const allDailyIds = allPowerIds.filter((id) => { const p = getPowerById(id); return p?.usage === 'daily'; });
    const allUtilityIds = allPowerIds.filter((id) => { const p = getPowerById(id); return p?.powerType === 'utility'; });
    // effectivePowerIds: wizards never auto-prepare dailies or utilities — strip them all out
    const effectivePowerIds = isWizard
      ? allPowerIds.filter((id) => !allDailyIds.includes(id) && !allUtilityIds.includes(id))
      : allPowerIds;
    const spellbookPowerIds = isWizard
      ? [...allDailyIds, ...allUtilityIds].filter((id, i, arr) => arr.indexOf(id) === i)
      : [];

    // Build initial wizard spellbook (free class feature — 1 book, named "My Spellbook")
    const initialSpellbook: WizardSpellbook | undefined = isWizard
      ? {
          id: uuidv4(),
          name: 'My Spellbook',
          powerIds: spellbookPowerIds,
          ritualIds: [...s.wizardStartingRitualIds],
        }
      : undefined;

    return {
      name: s.name,
      playerName: s.playerName,
      raceId: s.raceId,
      classId: s.classId,
      multiclassId,
      level: 1,
      xp: 0,
      levelingMode: s.levelingMode,
      alignment: s.alignment,
      deity: s.deity,
      gender: s.gender,
      age: s.age,
      height: s.height,
      weight: s.weight,
      build: s.build,
      eyeColor: s.eyeColor,
      hairColor: s.hairColor,
      background: s.background,
      selectedLanguages,
      paragonPath: '',
      epicDestiny: '',
      baseAbilityScores: finalBaseScores,
      racialAbilityChoiceBonus,
      trainedSkills: allTrainedSkills,
      selectedPowers: effectivePowerIds.map((id) => ({ powerId: id, used: false })),
      selectedFeatIds: s.selectedFeatIds,
      mcFeatSkillChoices: s.mcFeatSkillChoices,
      mcFeatProficiencyChoices: s.mcFeatProficiencyChoices,
      equipment: s.equipment,
      goldPieces: s.goldPieces,
      silverPieces: 0,
      copperPieces: 0,
      currentHp: s.customHp ?? autoHp,
      temporaryHp: 0,
      actionPoints: 1,
      currentSurges: (cls?.healingSurgesPerDay ?? 6),
      usedEncounterPowers: [],
      usedDailyPowers: [],
      // Psionic power points — initialize at max for psionic classes
      currentPowerPoints: usesPowerPoints(s.classId) ? getMaxPowerPoints(1) : undefined,
      ritualScrolls: [],
      ritualBooks: (() => {
        // Psion gets a free ritual book with one chosen ritual (Sending or Tenser's Floating Disk)
        if (s.classId === 'psion' && s.psionStartingRitualId) {
          const ritual = getRitualById(s.psionStartingRitualId);
          if (ritual) {
            const book: RitualBook = {
              id: uuidv4(),
              name: 'Ritual Book',
              rituals: [{ ritualId: ritual.id, name: ritual.name, level: ritual.level, mastered: true }],
            };
            return [book];
          }
        }
        return [];
      })(),
      subraceId: s.subraceId || undefined,
      arcaneImplement: s.arcaneImplement || undefined,
      warlockPact: s.warlockPact || undefined,
      fighterCombatStyle: s.fighterCombatStyle || undefined,
      avengerCensure: s.avengerCensure || undefined,
      barbarianFeralMight: s.barbarianFeralMight || undefined,
      bardVirtue: s.bardVirtue || undefined,
      druidPrimalAspect: s.druidPrimalAspect || undefined,
      invokerCovenant: s.invokerCovenant || undefined,
      shamanSpirit: s.shamanSpirit || undefined,
      sorcererSpellSource: s.sorcererSpellSource || undefined,
      wardenGuardianMight: s.wardenGuardianMight || undefined,
      ardentMantle: s.ardentMantle || undefined,
      battlemindOption: s.battlemindOption || undefined,
      monkTradition: s.monkTradition || undefined,
      psionDiscipline: s.psionDiscipline || undefined,
      runepriestArtistry: s.runepriestArtistry || undefined,
      seekerBond: s.seekerBond || undefined,
      dilettantePowerId: s.dilettantePowerId || undefined,
      dilettanteClassId: s.dilettanteClassId || undefined,
      hasSpellbook: isWizard ? true : undefined,
      spellbooks: initialSpellbook ? [initialSpellbook] : undefined,
      // Legacy flat lists — kept for backward compat; spellbooks is the canonical source
      spellbookPowerIds: isWizard ? spellbookPowerIds : undefined,
      spellbookMasteredRitualIds: isWizard ? [...s.wizardStartingRitualIds] : undefined,
      notes: '',
      appearance: s.build
        ? `Build: ${s.build}${s.eyeColor ? ` · Eyes: ${s.eyeColor}` : ''}${s.hairColor ? ` · Hair: ${s.hairColor}` : ''}`
        : '',
      personality: '',
      backstory: '',
    };
  },

  resetWizard: () => set({ ...initialState, baseAbilityScores: { ...DEFAULT_SCORES } }),
}));
