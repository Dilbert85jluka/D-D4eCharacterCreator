import type { PowerData } from '../types/gameData';
import type { MagicImplementData, MagicImplementTier } from '../types/gameData';

/**
 * Parses a magic implement's power text into a structured PowerData object.
 * Returns null if the implement has no power text.
 */
export function parseMagicImplementPower(mi: MagicImplementData, tier: MagicImplementTier): PowerData | null {
  if (!mi.power) return null;

  const raw = mi.power;

  // Parse usage: Daily, Encounter, At-Will
  let usage: 'at-will' | 'encounter' | 'daily' = 'daily';
  if (/^Encounter/i.test(raw)) usage = 'encounter';
  else if (/^At-Will/i.test(raw)) usage = 'at-will';

  // Parse action type from parenthetical
  let actionType: PowerData['actionType'] = 'standard';
  const actionMatch = raw.match(/\((Free Action|Minor Action|Move Action|Standard Action|Immediate Interrupt|Immediate Reaction)\)/i);
  if (actionMatch) {
    const a = actionMatch[1].toLowerCase();
    if (a === 'free action') actionType = 'free';
    else if (a === 'minor action') actionType = 'minor';
    else if (a === 'move action') actionType = 'move';
    else if (a === 'immediate interrupt') actionType = 'immediate-interrupt';
    else if (a === 'immediate reaction') actionType = 'immediate-reaction';
  }

  // Parse keywords from parenthetical before ✦ if present
  const keywords: string[] = [];
  const kwMatch = raw.match(/\(([^)]+)\)\s*✦/);
  if (kwMatch) {
    kwMatch[1].split(',').forEach(k => {
      const trimmed = k.trim();
      if (trimmed && !trimmed.includes('Action')) keywords.push(trimmed);
    });
  }

  // Extract trigger and effect
  let trigger: string | undefined;
  let effect: string | undefined;

  const triggerMatch = raw.match(/Trigger\s*:\s*([\s\S]*?)(?:\.\s*Effect|$)/i);
  if (triggerMatch) trigger = triggerMatch[1].trim();

  const effectMatch = raw.match(/Effect\s*:\s*([\s\S]*?)$/i);
  if (effectMatch) {
    effect = effectMatch[1].trim();
  } else {
    // No explicit Effect label — everything after the action type is the effect
    const afterAction = raw.replace(/^(?:Daily|Encounter|At-Will)\s*\([^)]*\)\s*/, '').trim();
    if (afterAction && !triggerMatch) {
      effect = afterAction;
    } else if (!effectMatch && triggerMatch) {
      // Trigger but no effect label — rest after trigger is effect
      const afterTrigger = raw.substring(raw.indexOf(triggerMatch[0]) + triggerMatch[0].length).trim();
      if (afterTrigger) effect = afterTrigger;
    }
  }

  return {
    id: `magic-implement-${mi.id}-${tier.level}`,
    name: `${mi.name} Power`,
    classId: 'implement',
    level: 0,
    usage,
    actionType,
    keywords,
    trigger,
    effect,
    target: undefined,
  };
}
