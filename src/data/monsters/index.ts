import { mm1Monsters } from './mm1';
import { mm2Monsters } from './mm2';
import { mm3Monsters } from './mm3';
import { dmgMonsters } from './dmg';
import { dmg2Monsters } from './dmg2';
import { mvMonsters } from './mv';
import { mvttnvMonsters } from './mvttnv';
import type { MonsterData, MonsterFilters } from '../../types/monster';

export { mm1Monsters, mm2Monsters, mm3Monsters, dmgMonsters, dmg2Monsters, mvMonsters, mvttnvMonsters };

export const ALL_MONSTERS: MonsterData[] = [
  ...mm1Monsters,
  ...mm2Monsters,
  ...mm3Monsters,
  ...dmgMonsters,
  ...dmg2Monsters,
  ...mvMonsters,
  ...mvttnvMonsters,
];

export function getMonsterById(id: string): MonsterData | undefined {
  return ALL_MONSTERS.find((m) => m.id === id);
}

export function searchMonsters(query: string, filters?: Partial<MonsterFilters>): MonsterData[] {
  const q = query.toLowerCase();
  return ALL_MONSTERS.filter((m) => {
    // Text match
    if (q && !m.name.toLowerCase().includes(q) &&
        !m.type.toLowerCase().includes(q) &&
        !(m.keywords ?? []).some((k) => k.toLowerCase().includes(q))) {
      return false;
    }
    // Source filter
    if (filters?.sources && !filters.sources.includes(m.source)) return false;
    // Role filter
    if (filters?.roles && !filters.roles.includes(m.role)) return false;
    // Modifier filter
    if (filters?.roleModifiers) {
      const mod = m.roleModifier ?? 'Standard';
      if (!filters.roleModifiers.includes(mod)) return false;
    }
    // Tier filter
    if (filters?.tier && filters.tier !== 'all') {
      const level = m.level;
      if (filters.tier === 'heroic'  && level > 10)  return false;
      if (filters.tier === 'paragon' && (level < 11 || level > 20)) return false;
      if (filters.tier === 'epic'    && level < 21)  return false;
    }
    return true;
  });
}
