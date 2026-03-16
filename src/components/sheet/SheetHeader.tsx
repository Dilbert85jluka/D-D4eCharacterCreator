import { useRef, useState } from 'react';
import type { Character, DerivedStats } from '../../types/character';

import { getRaceById } from '../../data/races';
import { getClassById } from '../../data/classes';
import { getMulticlassId } from '../../data/feats';
import { getParagonPathById } from '../../data/paragonPaths';
import { RoleBadge } from '../ui/Badge';
import { formatModifier } from '../../utils/abilityScores';
import { xpForNextLevel, xpProgress } from '../../data/xpThresholds';
import { LevelUpModal } from './LevelUpModal';
import { useAppStore } from '../../store/useAppStore';
import { useCharactersStore } from '../../store/useCharactersStore';
import { characterRepository } from '../../db/characterRepository';
import { playDiceRollSound } from '../../utils/diceSound';
import { isPsionicClass, getMaxPowerPoints } from '../../utils/psionics';

interface Props {
  character: Character;
  derived: DerivedStats;
}

function getTier(level: number): string {
  if (level <= 10) return 'Heroic';
  if (level <= 20) return 'Paragon';
  return 'Epic';
}

export function SheetHeader({ character, derived }: Props) {
  const race            = getRaceById(character.raceId);
  const cls             = getClassById(character.classId);
  const multiclassId    = getMulticlassId(character.selectedFeatIds);
  const secondaryCls    = multiclassId ? getClassById(multiclassId) : undefined;
  const paragonPath     = character.paragonPath ? getParagonPathById(character.paragonPath) : undefined;

  const [showLevelUp, setShowLevelUp] = useState(false);
  const navigate        = useAppStore((s) => s.navigate);
  const showToast       = useAppStore((s) => s.showToast);
  const updateCharacter = useCharactersStore((s) => s.updateCharacter);

  // Inline name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName]         = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Rest confirmation modal
  const [restModal, setRestModal] = useState<'short' | 'extended' | null>(null);

  // Saving throw result — null = not yet rolled, object = last roll
  const [saveResult, setSaveResult] = useState<{
    roll: number;
    bonus: number;
    bonusLabel: string;
    total: number;
    success: boolean;
  } | null>(null);

  const handleSavingThrow = () => {
    playDiceRollSound(1);
    const roll  = Math.floor(Math.random() * 20) + 1;
    const bonus = derived.savingThrowBonus;
    const total = roll + bonus;
    const bonusLabel = bonus !== 0 && paragonPath ? paragonPath.name : '';
    setSaveResult({ roll, bonus, bonusLabel, total, success: total >= 10 });
  };

  // Initiative roll result
  const [initResult, setInitResult] = useState<{
    roll: number;
    bonus: number;
    total: number;
  } | null>(null);

  const handleInitiativeRoll = () => {
    playDiceRollSound(1);
    const roll  = Math.floor(Math.random() * 20) + 1;
    const bonus = derived.initiative;   // DEX mod + half level + magic + paragon
    const total = roll + bonus;
    setInitResult({ roll, bonus, total });
  };

  // XP modal
  const [xpModal, setXpModal] = useState<'add' | 'sub' | null>(null);
  const [xpInput, setXpInput] = useState('');

  const patch = async (changes: Partial<Character>) => {
    const updated = { ...character, ...changes };
    await characterRepository.patch(character.id, changes);
    updateCharacter(updated);
  };

  const startEditName = () => {
    setDraftName(character.name);
    setIsEditingName(true);
    // Input is rendered next tick — focus via setTimeout
    setTimeout(() => nameInputRef.current?.select(), 0);
  };

  const commitName = async () => {
    const trimmed = draftName.trim();
    setIsEditingName(false);
    if (!trimmed || trimmed === character.name) return;
    const updated = { ...character, name: trimmed };
    await characterRepository.patch(character.id, { name: trimmed });
    updateCharacter(updated);
    showToast('Name updated.', 'success');
  };

  const cancelEditName = () => {
    setIsEditingName(false);
    setDraftName('');
  };

  const applyXp = async (delta: number) => {
    const newXp = Math.max(0, character.xp + delta);
    const next = xpForNextLevel(character.level);
    await patch({ xp: newXp });
    setXpModal(null);
    setXpInput('');
    if (next !== undefined && character.xp < next && newXp >= next) {
      showToast('You have enough XP to level up!', 'success');
    }
  };

  const isPsionic = isPsionicClass(character.classId);
  const maxPP     = isPsionic ? getMaxPowerPoints(character.level) : 0;

  const applyShortRest = async () => {
    const changes: Partial<Character> = { usedEncounterPowers: [], actionPoints: 1 };
    if (isPsionic) {
      changes.currentPowerPoints = maxPP;
    }
    await patch(changes);
    setRestModal(null);
    showToast('Short rest taken — encounter powers refreshed!', 'success');
  };

  const applyExtendedRest = async () => {
    const changes: Partial<Character> = {
      currentHp: derived.maxHp,
      temporaryHp: 0,
      currentSurges: derived.surgesPerDay,
      usedEncounterPowers: [],
      usedDailyPowers: [],
      actionPoints: 1,
    };
    if (isPsionic) {
      changes.currentPowerPoints = maxPP;
    }
    await patch(changes);
    setRestModal(null);
    showToast('Extended rest complete — fully restored!', 'success');
  };

  const rolePlaceholder =
    cls?.role === 'Controller' ? '🧙' :
    cls?.role === 'Defender'   ? '🛡️' :
    cls?.role === 'Leader'     ? '⚕️' : '🗡️';

  return (
    <>
      <div className="bg-amber-950 text-white px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">

          {/* ── Top row: portrait · name · right-side controls ── */}
          <div className="flex items-start gap-4">

            {/* Portrait — click to open portrait management page */}
            <button
              onClick={() => navigate('portrait', character.id)}
              className="w-16 h-16 rounded-xl bg-amber-700 flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden hover:ring-2 hover:ring-amber-400 active:ring-amber-300 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
              title="Change portrait"
              aria-label="Change character portrait"
            >
              {character.portrait
                ? <img src={character.portrait} alt="Portrait" className="w-full h-full object-cover" />
                : rolePlaceholder}
            </button>

            {/* Name (left) + level / rest / roll buttons (right) */}
            <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
              {isEditingName ? (
                <input
                  ref={nameInputRef}
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onBlur={commitName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.currentTarget.blur(); }
                    if (e.key === 'Escape') { cancelEditName(); }
                  }}
                  className="text-2xl font-bold text-white leading-tight bg-transparent border-b-2 border-amber-400 outline-none w-full min-w-0 placeholder-amber-300"
                  maxLength={80}
                  aria-label="Character name"
                />
              ) : (
                <h1
                  className="text-2xl font-bold text-white leading-tight cursor-pointer hover:text-amber-200 transition-colors"
                  onClick={startEditName}
                  title="Click to edit name"
                >
                  {character.name}
                </h1>
              )}

              {/* Right column: level badge, rest buttons, initiative + saving throw */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {/* Level badge + Level Up */}
                <div className="flex items-center gap-2">
                  <div className="bg-amber-600 px-3 py-1.5 rounded-lg text-sm font-bold">
                    Level {character.level}
                  </div>
                  {character.level < 30 && (
                    <button
                      onClick={() => setShowLevelUp(true)}
                      className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                      title="Level Up"
                    >
                      Level Up ↑
                    </button>
                  )}
                </div>
                {/* Rest buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setRestModal('short')}
                    className="bg-blue-700 hover:bg-blue-600 active:bg-blue-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition-colors"
                    title="Short Rest"
                  >
                    Short Rest
                  </button>
                  <button
                    onClick={() => setRestModal('extended')}
                    className="bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition-colors"
                    title="Extended Rest"
                  >
                    Extended Rest
                  </button>
                </div>

                {/* Initiative + Saving Throw — spread apart so result cards don't overlap */}
                <div className="flex items-center justify-between min-w-[24rem]">

                  {/* Initiative — left side, result drops left-anchored */}
                  <div className="relative">
                    <button
                      onClick={handleInitiativeRoll}
                      className="bg-teal-700 hover:bg-teal-600 active:bg-teal-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition-colors"
                      title={`d20 ${derived.initiative >= 0 ? '+' : ''}${derived.initiative} initiative`}
                    >
                      ⚡ Initiative ({derived.initiative >= 0 ? `+${derived.initiative}` : derived.initiative})
                    </button>

                    {initResult && (
                      <div className="absolute top-full left-0 mt-1.5 z-20 w-44 rounded-lg px-2.5 py-2 text-xs text-white shadow-lg bg-teal-800">
                        <div className="flex items-baseline gap-1 flex-wrap leading-snug">
                          <span className="opacity-75">d20:</span>
                          <span className="font-bold text-sm">{initResult.roll}</span>
                          {initResult.bonus !== 0 && (
                            <>
                              <span className="opacity-60">{initResult.bonus >= 0 ? '+' : '−'}</span>
                              <span className="font-semibold">{Math.abs(initResult.bonus)}</span>
                              <span className="opacity-70">(Initiative)</span>
                            </>
                          )}
                          <span className="opacity-60">=</span>
                          <span className="font-black text-base">{initResult.total}</span>
                        </div>
                        <div className="flex justify-end mt-1">
                          <button
                            onClick={() => setInitResult(null)}
                            className="opacity-60 hover:opacity-100 transition-opacity text-sm leading-none"
                            aria-label="Dismiss initiative result"
                          >×</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Saving Throw — right side, result drops right-anchored */}
                  <div className="relative">
                    <button
                      onClick={handleSavingThrow}
                      className="bg-rose-700 hover:bg-rose-600 active:bg-rose-800 px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition-colors"
                      title={derived.savingThrowBonus !== 0 ? `d20 + ${derived.savingThrowBonus} vs 10` : 'd20 vs 10'}
                    >
                      🎲 Saving Throw
                      {derived.savingThrowBonus !== 0 && (
                        <span className="ml-1 opacity-80 font-normal">
                          ({derived.savingThrowBonus > 0 ? `+${derived.savingThrowBonus}` : derived.savingThrowBonus})
                        </span>
                      )}
                    </button>

                    {saveResult && (
                      <div className={[
                        'absolute top-full right-0 mt-1.5 z-20 w-48 rounded-lg px-2.5 py-2 text-xs text-white shadow-lg',
                        saveResult.success ? 'bg-emerald-700' : 'bg-stone-700',
                      ].join(' ')}>
                        <div className="flex items-baseline gap-1 flex-wrap leading-snug">
                          <span className="opacity-75">d20:</span>
                          <span className="font-bold text-sm">{saveResult.roll}</span>
                          {saveResult.bonus !== 0 && (
                            <>
                              <span className="opacity-60">+</span>
                              <span className="font-semibold">{saveResult.bonus}</span>
                              {saveResult.bonusLabel && (
                                <span className="opacity-70">({saveResult.bonusLabel})</span>
                              )}
                            </>
                          )}
                          <span className="opacity-60">=</span>
                          <span className="font-black text-base">{saveResult.total}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold tracking-wide">
                            {saveResult.success ? '✓ Save!' : '✗ Failed'}
                            <span className="font-normal opacity-70 ml-1">(need 10+)</span>
                          </span>
                          <button
                            onClick={() => setSaveResult(null)}
                            className="opacity-60 hover:opacity-100 transition-opacity text-sm leading-none ml-2"
                            aria-label="Dismiss result"
                          >×</button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* ── Info rows — full-width, left-justified ── */}

          {/* Race · Class · Tier [· Paragon Path] */}
          <p className="text-amber-200 text-sm mt-1">
            {race?.name} · {cls?.name}{secondaryCls && (
              <span className="text-indigo-300"> / {secondaryCls.name} <span className="text-xs opacity-75">(MC)</span></span>
            )} · {getTier(character.level)} Tier{paragonPath && (
              <span className="text-amber-400"> · ⭐ {paragonPath.name}</span>
            )}
          </p>

          {/* Row 2 — Role badge, speed, initiative, vision */}
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {cls && <RoleBadge role={cls.role} />}
            {race && <span className="text-xs text-amber-300">Size: {race.size}</span>}
            <span className="text-xs text-amber-300">Speed {derived.speed}</span>
            <span className="text-xs text-amber-300">
              Initiative {derived.initiative >= 0 ? `+${derived.initiative}` : derived.initiative}
            </span>
            {race && <span className="text-xs text-amber-300">Vision: {race.vision}</span>}
          </div>

          {/* Row 3 — Player identity */}
          <div className="flex flex-wrap gap-3 mt-1 text-xs text-amber-300">
            {character.playerName && <span>Player: {character.playerName}</span>}
            {character.gender && <span>{character.gender}</span>}
            {character.age && <span>Age {character.age}</span>}
          </div>

          {/* Row 4 — Alignment / Deity / Leveling */}
          <div className="flex flex-wrap gap-3 mt-0.5 text-xs text-amber-300">
            {character.alignment && <span>Alignment: {character.alignment}</span>}
            {character.deity && <span>Deity: {character.deity}</span>}
            {character.levelingMode === 'xp' ? (
              <span className="flex items-center gap-1">
                <span>
                  XP: {character.xp.toLocaleString()}
                  {character.level < 30 && ` / ${xpForNextLevel(character.level)!.toLocaleString()}`}
                </span>
                <button
                  onClick={() => { setXpInput(''); setXpModal('add'); }}
                  className="text-amber-400 hover:text-white font-bold text-sm leading-none w-5 h-5 flex items-center justify-center transition-colors"
                  title="Award XP"
                >+</button>
                <button
                  onClick={() => { setXpInput(''); setXpModal('sub'); }}
                  className="text-amber-400 hover:text-white font-bold text-sm leading-none w-5 h-5 flex items-center justify-center transition-colors"
                  title="Subtract XP"
                >−</button>
              </span>
            ) : (
              <span className="text-amber-400">Milestone leveling</span>
            )}
          </div>

          {/* XP progress bar */}
          {character.levelingMode === 'xp' && character.level < 30 && (
            <div className="mt-1.5 h-1.5 bg-amber-900 rounded-full overflow-hidden w-full max-w-xs">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${xpProgress(character.xp, character.level)}%` }}
              />
            </div>
          )}

        </div>
      </div>

      {showLevelUp && (
        <LevelUpModal
          character={character}
          derived={derived}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      {/* XP modal */}
      {xpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setXpModal(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
            <div className="bg-amber-700 px-5 py-4 text-white">
              <h3 className="font-bold text-lg">{xpModal === 'add' ? 'Award XP' : 'Subtract XP'}</h3>
              <p className="text-sm opacity-80 mt-0.5">Current XP: {character.xp.toLocaleString()}</p>
            </div>
            <div className="px-5 py-4">
              <label className="block text-sm font-semibold text-stone-700 mb-1">Amount</label>
              <input
                type="number"
                min="0"
                value={xpInput}
                onChange={(e) => setXpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const n = parseInt(xpInput, 10);
                    if (!isNaN(n) && n > 0) applyXp(xpModal === 'add' ? n : -n);
                  }
                  if (e.key === 'Escape') setXpModal(null);
                }}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="e.g. 500"
                autoFocus
              />
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setXpModal(null)}
                className="flex-1 py-2.5 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const n = parseInt(xpInput, 10);
                  if (!isNaN(n) && n > 0) applyXp(xpModal === 'add' ? n : -n);
                }}
                className="flex-1 py-2.5 rounded-xl text-white font-semibold bg-amber-600 hover:bg-amber-500 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest confirmation modal */}
      {restModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setRestModal(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Modal header */}
            <div className={`px-5 py-4 text-white ${restModal === 'short' ? 'bg-blue-700' : 'bg-indigo-700'}`}>
              <h3 className="font-bold text-lg">
                {restModal === 'short' ? '💤 Short Rest' : '🌙 Extended Rest'}
              </h3>
              <p className="text-sm opacity-80 mt-0.5">
                {restModal === 'short'
                  ? 'Your party pauses to catch its breath (5 minutes).'
                  : 'Your party sleeps and recuperates (6 hours).'}
              </p>
            </div>

            {/* Benefits list */}
            <div className="px-5 py-4">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Benefits</p>
              <ul className="space-y-1.5 text-sm text-stone-700">
                {restModal === 'short' ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">✓</span>
                      Encounter powers refreshed
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">✓</span>
                      Action points reset to 1
                    </li>
                    {isPsionic && (
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-0.5">✓</span>
                        Power points restored ({maxPP} PP)
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="text-stone-300 font-bold mt-0.5">·</span>
                      <span className="text-stone-400">
                        You may spend healing surges from the HP panel to recover HP
                      </span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold mt-0.5">✓</span>
                      HP restored to maximum ({derived.maxHp})
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold mt-0.5">✓</span>
                      Healing surges restored ({derived.surgesPerDay} surges)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold mt-0.5">✓</span>
                      All encounter powers refreshed
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold mt-0.5">✓</span>
                      All daily powers refreshed
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold mt-0.5">✓</span>
                      Action points reset to 1
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold mt-0.5">✓</span>
                      Temporary HP cleared
                    </li>
                    {isPsionic && (
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold mt-0.5">✓</span>
                        Power points restored ({maxPP} PP)
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setRestModal(null)}
                className="flex-1 py-2.5 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={restModal === 'short' ? applyShortRest : applyExtendedRest}
                className={`flex-1 py-2.5 rounded-xl text-white font-semibold transition-colors ${
                  restModal === 'short'
                    ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700'
                }`}
              >
                Take Rest
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
