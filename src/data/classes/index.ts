import { avenger } from './avenger';
import { barbarian } from './barbarian';
import { bard } from './bard';
import { cleric } from './cleric';
import { druid } from './druid';
import { fighter } from './fighter';
import { invoker } from './invoker';
import { paladin } from './paladin';
import { ranger } from './ranger';
import { rogue } from './rogue';
import { shaman } from './shaman';
import { sorcerer } from './sorcerer';
import { warlock } from './warlock';
import { warden } from './warden';
import { warlord } from './warlord';
import { wizard } from './wizard';
// PHB3 classes
import { ardent } from './ardent';
import { battlemind } from './battlemind';
import { monk } from './monk';
import { psion } from './psion';
import { runepriest } from './runepriest';
import { seeker } from './seeker';
import type { ClassData } from '../../types/gameData';

export const CLASSES: ClassData[] = [
  avenger,
  barbarian,
  bard,
  cleric,
  druid,
  fighter,
  invoker,
  paladin,
  ranger,
  rogue,
  shaman,
  sorcerer,
  warlock,
  warden,
  warlord,
  wizard,
  // PHB3
  ardent,
  battlemind,
  monk,
  psion,
  runepriest,
  seeker,
];

export function getClassById(id: string): ClassData | undefined {
  return CLASSES.find((c) => c.id === id);
}
