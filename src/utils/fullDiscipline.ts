import type { PowerData } from '../types/gameData';

/**
 * Checks if a power is a Full Discipline monk power (has both Attack + Movement techniques).
 */
export function isFullDisciplinePower(power: PowerData): boolean {
  return power.keywords.includes('Full Discipline') &&
    !!power.special?.startsWith('Movement Technique');
}

/**
 * Extracts the Movement Technique from a Full Discipline power as a separate PowerData.
 * The movement technique power gets a '-mt' suffix on its ID and actionType 'move'.
 * Returns null if the power is not a Full Discipline power.
 */
export function extractMovementTechnique(power: PowerData): PowerData | null {
  if (!isFullDisciplinePower(power)) return null;

  const mtMatch = power.special!.match(/^Movement Technique\s*\(([^)]+)\):\s*([\s\S]*)$/);
  const mtAction = mtMatch?.[1]?.toLowerCase().trim() ?? 'move';
  const mtBody = mtMatch?.[2] ?? power.special!;

  // Map action text to PowerData actionType
  const actionType = mtAction.includes('minor') ? 'minor' as const
    : mtAction.includes('free') ? 'free' as const
    : 'move' as const;

  return {
    id: `${power.id}-mt`,
    name: power.name,
    classId: power.classId,
    level: power.level,
    usage: power.usage,
    powerType: power.powerType,
    actionType,
    keywords: power.keywords,
    effect: mtBody,
    // Store the parent attack technique info so the card can show it as a sub-section
    special: `Attack Technique (${power.actionType === 'standard' ? 'Standard Action' : power.actionType.replace('-', ' ')}): ${[
      power.attack ? `Attack: ${power.attack}.` : '',
      power.target ? `Target: ${power.target}.` : '',
      power.hit ? `Hit: ${power.hit}` : '',
      power.miss ? `Miss: ${power.miss}` : '',
      power.effect ? `Effect: ${power.effect}` : '',
    ].filter(Boolean).join(' ')}`,
  };
}
