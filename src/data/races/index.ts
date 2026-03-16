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
import type { RaceData } from '../../types/gameData';

export const RACES: RaceData[] = [
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
];

export function getRaceById(id: string): RaceData | undefined {
  return RACES.find((r) => r.id === id);
}
