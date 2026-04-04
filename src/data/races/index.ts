import { dragonborn } from './dragonborn';
import { dwarf } from './dwarf';
import { eladrin } from './eladrin';
import { elf } from './elf';
import { halfElf } from './halfElf';
import { halfling } from './halfling';
import { human } from './human';
import { tiefling } from './tiefling';
// PHB2 races
import { deva } from './deva';
import { gnome } from './gnome';
import { goliath } from './goliath';
import { halfOrc } from './halfOrc';
import { shifter } from './shifter';
// PHB3 races
import { githzerai } from './githzerai';
import { minotaur } from './minotaur';
import { shardmind } from './shardmind';
import { wilden } from './wilden';
// HotF (Heroes of the Feywild) races
import { hamadryad } from './hamadryad';
import { pixie } from './pixie';
import { satyr } from './satyr';
import type { RaceData } from '../../types/gameData';

const OFFICIAL_RACES: RaceData[] = [
  dragonborn,
  dwarf,
  eladrin,
  elf,
  halfElf,
  halfling,
  human,
  tiefling,
  // PHB2
  deva,
  gnome,
  goliath,
  halfOrc,
  shifter,
  // PHB3
  githzerai,
  minotaur,
  shardmind,
  wilden,
  // HotF (Heroes of the Feywild)
  hamadryad,
  pixie,
  satyr,
];

// Mutable array that includes official + homebrew races
export let RACES: RaceData[] = [...OFFICIAL_RACES];

/** Register homebrew races into the global races array */
export function registerHomebrewRaces(races: RaceData[]): void {
  RACES = [...OFFICIAL_RACES, ...races];
}

/** Remove all homebrew races, restoring to official-only */
export function unregisterHomebrewRaces(): void {
  RACES = [...OFFICIAL_RACES];
}

export function getRaceById(id: string): RaceData | undefined {
  return RACES.find((r) => r.id === id);
}
