import type { AbilityScores, Alignment, EquipmentItem } from './character';

export interface WizardBasics {
  name: string;
  playerName: string;
  gender: string;
  age: string;
  alignment: Alignment;
  deity: string;
  background: string;
}

export interface WizardState extends WizardBasics {
  currentStep: number;
  raceId: string;
  classId: string;
  baseAbilityScores: AbilityScores;
  pointBuySpent: number;
  trainedSkills: string[];
  selectedPowerIds: string[];
  selectedFeatIds: string[];
  equipment: EquipmentItem[];
  goldPieces: number;
}
