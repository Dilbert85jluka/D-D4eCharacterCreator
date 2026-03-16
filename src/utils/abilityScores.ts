import type { Ability, AbilityScores } from '../types/character';

export const ABILITIES: Ability[] = ['str', 'con', 'dex', 'int', 'wis', 'cha'];

export const ABILITY_NAMES: Record<Ability, string> = {
  str: 'Strength',
  con: 'Constitution',
  dex: 'Dexterity',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const ABILITY_ABBR: Record<Ability, string> = {
  str: 'STR',
  con: 'CON',
  dex: 'DEX',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

// D&D 4e: floor((score - 10) / 2)
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Point buy cost from score 8 baseline (PHB1 22-point buy)
export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 5,
  15: 8,
  16: 9,
  17: 12,
  18: 16,
};

export const POINT_BUY_BUDGET = 22;
export const ABILITY_MIN = 8;
export const ABILITY_MAX = 18;

export function pointBuyCost(score: number): number {
  return POINT_BUY_COSTS[score] ?? 0;
}

export function totalPointsSpent(scores: AbilityScores): number {
  return ABILITIES.reduce((total, ab) => total + pointBuyCost(scores[ab]), 0);
}

export function defaultAbilityScores(): AbilityScores {
  return { str: 10, con: 10, dex: 10, int: 10, wis: 10, cha: 10 };
}
