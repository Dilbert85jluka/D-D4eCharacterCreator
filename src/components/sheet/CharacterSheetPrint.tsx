import type { Character } from '../../types/character';
import type { PowerData } from '../../types/gameData';
import { useCharacterDerived } from '../../hooks/useCharacterDerived';
import { getRaceById } from '../../data/races';
import { getClassById } from '../../data/classes';
import { getFeatById, getMulticlassId } from '../../data/feats';
import { getParagonPathById } from '../../data/paragonPaths';
import { getPowerById } from '../../data/powers';
import { SKILLS } from '../../data/skills';
import { collectAllPowers } from '../../utils/characterPowers';
import { getWeaponProficiencyLabels, getGearProficiencies } from '../../utils/proficiencies';
import { formatModifier } from '../../utils/abilityScores';
import { getAllSpellbookPowerIds, getAllSpellbookRitualIds } from '../../utils/spellbook';
import { usesPowerPoints, getMaxPowerPoints } from '../../utils/psionics';
import { PowerCard } from '../wizard/shared/PowerCard';
import { RichTextDisplay, hasRichTextContent } from '../ui/RichTextDisplay';

/**
 * Paper version of the character sheet.
 *
 * Deliberately NOT a print mode bolted onto CharacterSheet. The live sheet is
 * tabbed — six top-level tabs, and Powers / Equipment / Actions each carry their
 * own inner tabs — so only a slice of the character is ever mounted. Printing it
 * would yield whichever tab happened to be open. Teaching every panel a "render
 * everything" mode would have meant touching a dozen interactive components for
 * a feature none of them otherwise care about, so this renders flat from the
 * character data instead.
 *
 * Powers come from the shared `collectAllPowers`, the same resolver the Actions
 * tab uses, so a printed sheet can't quietly disagree with the screen about what
 * a character has.
 *
 * Layout rules live in the `@media print` block in index.css; everything here is
 * plain flow content so the browser can paginate it.
 */

interface Props {
  character: Character;
}

const ABILITY_ORDER = [
  ['str', 'Strength'], ['con', 'Constitution'], ['dex', 'Dexterity'],
  ['int', 'Intelligence'], ['wis', 'Wisdom'], ['cha', 'Charisma'],
] as const;

/** Section wrapper — `print-block` asks the browser not to split it across pages. */
function Section({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <section className="print-section">
      <h2 className="print-h2">
        {title}
        {subtitle && <span className="print-h2-sub">{subtitle}</span>}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === '' || value === undefined || value === null) return null;
  return (
    <div className="print-field">
      <span className="print-field-label">{label}</span>
      <span className="print-field-value">{value}</span>
    </div>
  );
}

export function CharacterSheetPrint({ character }: Props) {
  const derived = useCharacterDerived(character);

  const race = getRaceById(character.raceId);
  const subrace = race?.subraces?.find((sr) => sr.id === character.subraceId);
  const cls = getClassById(character.classId);
  const multiclassId = getMulticlassId(character.selectedFeatIds);
  const secondaryCls = multiclassId ? getClassById(multiclassId) : undefined;
  const paragonPath = character.paragonPath ? getParagonPathById(character.paragonPath) : undefined;

  const tier = character.level <= 10 ? 'Heroic' : character.level <= 20 ? 'Paragon' : 'Epic';

  // Powers, grouped the way a player reaches for them at the table.
  const allPowers = collectAllPowers(character);
  const byUsage = (usage: PowerData['usage'], utility: boolean) =>
    allPowers.filter((p) => p.usage === usage && (p.powerType === 'utility') === utility);

  const powerGroups: { label: string; powers: PowerData[] }[] = [
    { label: 'At-Will Powers',   powers: byUsage('at-will', false) },
    { label: 'Encounter Powers', powers: byUsage('encounter', false) },
    { label: 'Daily Powers',     powers: byUsage('daily', false) },
    {
      label: 'Utility Powers',
      powers: allPowers.filter((p) => p.powerType === 'utility'),
    },
  ].filter((g) => g.powers.length > 0);

  const feats = character.selectedFeatIds
    .map((id) => getFeatById(id))
    .filter((f): f is NonNullable<typeof f> => !!f);

  // Both come from utils/proficiencies so the sheet reports exactly what the
  // Proficiencies tab does — including feat grants and paragon-path extras,
  // which a naive read of `cls.armorProficiencies` would silently miss.
  const weaponProfs = getWeaponProficiencyLabels(character);
  const gearProfs = getGearProficiencies(character);

  const equipped = character.equipment.filter((e) => e.equipped);
  const carried = character.equipment.filter((e) => !e.equipped);

  const isPsionic = usesPowerPoints(character.classId);

  // Wizard spellbooks and ritual books — only rendered when the character has them.
  const spellbookPowerIds = getAllSpellbookPowerIds(character);
  const spellbookRitualIds = getAllSpellbookRitualIds(character);
  const ritualBooks = (character.ritualBooks ?? []).filter((b) => b.rituals.length > 0);

  return (
    <div className="print-root" role="document" aria-label={`${character.name} character sheet`}>

      {/* ── Identity ─────────────────────────────────────────────── */}
      <header className="print-header">
        {character.portrait && (
          <img src={character.portrait} alt="" className="print-portrait" />
        )}
        <div className="print-header-text">
          <h1 className="print-name">{character.name}</h1>
          <p className="print-subtitle">
            Level {character.level} {race?.name ?? character.raceId}
            {subrace ? ` (${subrace.name})` : ''} {cls?.name ?? character.classId}
            {secondaryCls ? ` / ${secondaryCls.name} (MC)` : ''}
            {' · '}{tier} Tier
            {cls?.role ? ` · ${cls.role}` : ''}
          </p>
          {paragonPath && <p className="print-subtitle">Paragon Path: {paragonPath.name}</p>}
          <div className="print-field-grid">
            <Field label="Player" value={character.playerName} />
            <Field label="Alignment" value={character.alignment} />
            <Field label="Deity" value={character.deity} />
            <Field label="XP" value={character.xp} />
            <Field label="Size" value={race?.size} />
            <Field label="Vision" value={race?.vision} />
          </div>
        </div>
      </header>

      {/* ── Core stats ───────────────────────────────────────────── */}
      <Section title="Ability Scores">
        <table className="print-table">
          <thead>
            <tr><th>Ability</th><th>Score</th><th>Mod</th><th>Mod + ½ Level</th></tr>
          </thead>
          <tbody>
            {ABILITY_ORDER.map(([key, name]) => {
              const score = derived.finalAbilityScores[key];
              const mod = derived.abilityModifiers[key];
              return (
                <tr key={key}>
                  <td>{name}</td>
                  <td className="print-num">{score}</td>
                  <td className="print-num">{formatModifier(mod)}</td>
                  <td className="print-num">{formatModifier(mod + Math.floor(character.level / 2))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <Section title="Defenses & Vitals">
        <div className="print-stat-row">
          <div className="print-stat"><span>AC</span><strong>{derived.armorClass}</strong></div>
          <div className="print-stat"><span>Fortitude</span><strong>{derived.fortitude}</strong></div>
          <div className="print-stat"><span>Reflex</span><strong>{derived.reflex}</strong></div>
          <div className="print-stat"><span>Will</span><strong>{derived.will}</strong></div>
        </div>
        <div className="print-field-grid">
          <Field label="Max HP" value={derived.maxHp} />
          <Field label="Bloodied" value={derived.bloodiedValue} />
          <Field label="Surge Value" value={derived.healingSurgeValue} />
          <Field label="Surges / Day" value={derived.surgesPerDay} />
          <Field label="Initiative" value={formatModifier(derived.initiative)} />
          <Field label="Speed" value={`${derived.speed} squares`} />
          <Field label="Action Points" value={character.actionPoints} />
          <Field label="Saving Throws" value={formatModifier(derived.savingThrowBonus)} />
          {isPsionic && (
            <Field label="Power Points" value={getMaxPowerPoints(character.level)} />
          )}
        </div>
        {/* Blank boxes: the printed sheet is used at the table, where current
            values change constantly and a printed number would be wrong by the
            first round. */}
        <div className="print-writein">
          <span>Current HP __________</span>
          <span>Temp HP __________</span>
          <span>Surges Left __________</span>
          <span>AP __________</span>
          {isPsionic && <span>Power Points __________</span>}
        </div>
      </Section>

      <Section title="Skills">
        <table className="print-table print-skills">
          <thead>
            <tr><th>Trained</th><th>Skill</th><th>Ability</th><th>Total</th></tr>
          </thead>
          <tbody>
            {SKILLS.map((skill) => {
              const trained = character.trainedSkills.includes(skill.id);
              return (
                <tr key={skill.id} className={trained ? 'print-trained' : undefined}>
                  <td className="print-num">{trained ? '●' : '○'}</td>
                  <td>{skill.name}</td>
                  <td className="print-muted">{skill.keyAbility.toUpperCase()}</td>
                  <td className="print-num">{formatModifier(derived.skillBonuses[skill.id] ?? 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      {/* ── Powers ───────────────────────────────────────────────── */}
      {powerGroups.map((group) => (
        <Section key={group.label} title={group.label} subtitle={`${group.powers.length}`}>
          <div className="print-powers">
            {group.powers.map((power) => (
              <div key={power.id} className="print-power">
                <PowerCard power={power} abilityModifiers={derived.abilityModifiers} />
              </div>
            ))}
          </div>
        </Section>
      ))}

      {/* ── Feats ────────────────────────────────────────────────── */}
      {feats.length > 0 && (
        <Section title="Feats" subtitle={`${feats.length}`}>
          <dl className="print-deflist">
            {feats.map((feat, i) => (
              <div key={`${feat.id}-${i}`} className="print-defitem">
                <dt>{feat.name}</dt>
                <dd>{feat.benefit}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {/* ── Features ─────────────────────────────────────────────── */}
      {cls && cls.features.length > 0 && (
        <Section title="Class Features" subtitle={cls.name}>
          <dl className="print-deflist">
            {cls.features.map((f, i) => (
              <div key={i} className="print-defitem">
                <dt>{f.name}{f.level ? ` (Level ${f.level})` : ''}</dt>
                <dd>{f.description}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {race && race.traits.length > 0 && (
        <Section title="Racial Features" subtitle={race.name}>
          <dl className="print-deflist">
            {[...race.traits, ...(subrace?.traits ?? [])].map((t, i) => (
              <div key={i} className="print-defitem">
                <dt>{t.name}</dt>
                <dd>{t.description}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {paragonPath && character.level >= 11 && (
        <Section title="Paragon Path" subtitle={paragonPath.name}>
          <p className="print-para">{paragonPath.description}</p>
          <p className="print-para">{paragonPath.features}</p>
        </Section>
      )}

      <Section title="Proficiencies">
        <div className="print-field-grid">
          <Field label="Armor" value={gearProfs.armor.join(', ') || '—'} />
          <Field label="Shields" value={gearProfs.shields.join(', ') || '—'} />
          <Field label="Implements" value={gearProfs.implements.join(', ') || '—'} />
        </div>
        <Field label="Weapons" value={weaponProfs.join(', ') || '—'} />
      </Section>

      {/* ── Inventory ────────────────────────────────────────────── */}
      <Section title="Equipment">
        <div className="print-field-grid">
          <Field label="Gold" value={character.goldPieces} />
          <Field label="Silver" value={character.silverPieces} />
          <Field label="Copper" value={character.copperPieces} />
        </div>
        {equipped.length > 0 && (
          <>
            <h3 className="print-h3">Equipped</h3>
            <ul className="print-list">
              {equipped.map((item, i) => (
                <li key={item.instanceId ?? `${item.itemId}-${i}`}>
                  {item.name}
                  {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                  {item.slot ? <span className="print-muted"> — {item.slot}</span> : null}
                </li>
              ))}
            </ul>
          </>
        )}
        {carried.length > 0 && (
          <>
            <h3 className="print-h3">Carried</h3>
            <ul className="print-list">
              {carried.map((item, i) => (
                <li key={item.instanceId ?? `${item.itemId}-${i}`}>
                  {item.name}
                  {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                </li>
              ))}
            </ul>
          </>
        )}
        {equipped.length === 0 && carried.length === 0 && (
          <p className="print-muted">No equipment.</p>
        )}
      </Section>

      {(spellbookPowerIds.length > 0 || spellbookRitualIds.length > 0) && (
        <Section title="Spellbook">
          {spellbookPowerIds.length > 0 && (
            <>
              <h3 className="print-h3">Known Powers</h3>
              <ul className="print-list">
                {spellbookPowerIds.map((id) => {
                  const p = getPowerById(id);
                  return <li key={id}>{p ? `${p.name} (Level ${p.level})` : id}</li>;
                })}
              </ul>
            </>
          )}
          {spellbookRitualIds.length > 0 && (
            <>
              <h3 className="print-h3">Mastered Rituals</h3>
              <ul className="print-list">
                {spellbookRitualIds.map((id) => <li key={id}>{id}</li>)}
              </ul>
            </>
          )}
        </Section>
      )}

      {ritualBooks.length > 0 && (
        <Section title="Rituals">
          {ritualBooks.map((book) => (
            <div key={book.id}>
              <h3 className="print-h3">{book.name}</h3>
              <ul className="print-list">
                {book.rituals.map((r) => (
                  <li key={r.ritualId}>
                    {r.name} <span className="print-muted">(Level {r.level}{r.mastered ? ', mastered' : ''})</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* ── Profile ──────────────────────────────────────────────── */}
      <Section title="Profile">
        <div className="print-field-grid">
          <Field label="Gender" value={character.gender} />
          <Field label="Age" value={character.age} />
          <Field label="Height" value={character.height} />
          <Field label="Weight" value={character.weight} />
          <Field label="Build" value={character.build} />
          <Field label="Eyes" value={character.eyeColor} />
          <Field label="Hair" value={character.hairColor} />
        </div>
        <Field label="Languages" value={character.selectedLanguages.join(', ')} />
        {hasRichTextContent(character.background) && (
          <>
            <h3 className="print-h3">Background</h3>
            <RichTextDisplay content={character.background} className="print-para" />
          </>
        )}
        {hasRichTextContent(character.notes) && (
          <>
            <h3 className="print-h3">Notes</h3>
            <RichTextDisplay content={character.notes} className="print-para" />
          </>
        )}
      </Section>

      <footer className="print-footer">
        {character.name} · Level {character.level} {cls?.name} · generated from D&amp;D 4e Character Creator
      </footer>
    </div>
  );
}
