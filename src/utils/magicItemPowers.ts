import type { PowerData, MagicItemData, MagicItemTier } from '../types/gameData';
import type { PowerAction } from '../types/character';

/**
 * Parse a magic item's power text into a PowerData-compatible object.
 * Returns null if the item has no power or it can't be parsed.
 */
export function parseMagicItemPower(
  mi: MagicItemData,
  tier: MagicItemTier,
): PowerData | null {
  if (!mi.power) return null;

  const text = mi.power;

  // Extract usage: Daily, Encounter, or At-Will
  let usage: 'daily' | 'encounter' | 'at-will' = 'daily';
  if (/✦\s*At-Will/i.test(text)) usage = 'at-will';
  else if (/✦\s*Encounter/i.test(text)) usage = 'encounter';
  else if (/✦\s*Daily/i.test(text)) usage = 'daily';

  // Extract action type from parenthetical after usage
  let actionType: PowerAction = 'free';
  const actionMatch = text.match(/✦\s*(?:Daily|Encounter|At-Will)\s*\(([^)]+)\)/i);
  if (actionMatch) {
    const raw = actionMatch[1].trim().toLowerCase();
    if (raw.includes('standard')) actionType = 'standard';
    else if (raw.includes('move')) actionType = 'move';
    else if (raw.includes('minor')) actionType = 'minor';
    else if (raw.includes('free')) actionType = 'free';
    else if (raw.includes('immediate interrupt')) actionType = 'immediate-interrupt';
    else if (raw.includes('immediate reaction')) actionType = 'immediate-reaction';
    else if (raw.includes('no action')) actionType = 'free';
  }

  // Extract keywords from leading parenthetical (e.g., "(Healing)", "(Fire, Healing)")
  const keywords: string[] = [];
  const kwMatch = text.match(/(?:Power\s*)?\(([^)]+)\)\s*✦/);
  if (kwMatch) {
    keywords.push(...kwMatch[1].split(',').map(k => k.trim()));
  }

  // Extract trigger and effect
  let trigger: string | undefined;
  let effect: string | undefined;
  const triggerMatch = text.match(/Trigger:\s*(.+?)(?:\.\s*Effect:|$)/i);
  if (triggerMatch) trigger = triggerMatch[1].trim().replace(/\.$/, '');
  const effectMatch = text.match(/Effect:\s*(.+)/i);
  if (effectMatch) effect = effectMatch[1].trim();

  // If no trigger/effect split, the whole text after the action type is the effect
  if (!trigger && !effect) {
    const afterAction = text.replace(/^.*?\)\s*/, '');
    if (afterAction) effect = afterAction;
  }

  // Extract range
  let range: string | undefined;
  const rangeMatch = text.match(/(?:Standard|Minor|Move|Free|Immediate (?:Interrupt|Reaction)|No) Action\)\.?\s*((?:Melee|Ranged|Close (?:burst|blast)|Area (?:burst|blast|wall)|Personal)[^.]*?)(?:\.\s|$)/i);
  if (rangeMatch) range = rangeMatch[1].trim();

  // Build a unique ID for this item power
  const id = `magic-item-${mi.id}-${tier.level}`;
  const enhLabel = tier.enhancement > 0 ? ` +${tier.enhancement}` : '';

  return {
    id,
    name: `${mi.name} Power`,
    classId: 'item',
    level: 0,
    usage,
    powerType: 'utility',
    actionType,
    range,
    keywords,
    trigger,
    effect: effect ?? text,
    flavor: `${mi.name}${enhLabel} (${mi.source})`,
  };
}
