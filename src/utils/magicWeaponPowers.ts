import type { PowerData, MagicWeaponData, MagicWeaponTier } from '../types/gameData';
import type { PowerAction } from '../types/character';

/**
 * Parse a magic weapon's power text into a PowerData-compatible object.
 * Returns null if the weapon has no power or it can't be parsed.
 */
export function parseMagicWeaponPower(
  mw: MagicWeaponData,
  tier: MagicWeaponTier,
): PowerData | null {
  if (!mw.power) return null;

  const text = mw.power;

  // Extract usage: Daily or Encounter
  let usage: 'daily' | 'encounter' = 'daily';
  if (/✦\s*Encounter/i.test(text)) usage = 'encounter';
  else if (/✦\s*Daily/i.test(text)) usage = 'daily';

  // Extract action type from parenthetical after usage
  let actionType: PowerAction = 'free';
  const actionMatch = text.match(/✦\s*(?:Daily|Encounter)\s*\(([^)]+)\)/i);
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

  // Extract keywords from leading parenthetical
  const keywords: string[] = [];
  const kwMatch = text.match(/^\(([^)]+)\)\s*✦/);
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

  if (!trigger && !effect) {
    const afterAction = text.replace(/^.*?\)\s*/, '');
    if (afterAction) effect = afterAction;
  }

  const id = `magic-weapon-${mw.id}-${tier.level}`;

  return {
    id,
    name: `${mw.name} Power`,
    classId: 'item',
    level: 0,
    usage,
    powerType: 'utility',
    actionType,
    keywords,
    trigger,
    effect: effect ?? text,
    flavor: `${mw.name} +${tier.enhancement} (${mw.source})`,
  };
}
