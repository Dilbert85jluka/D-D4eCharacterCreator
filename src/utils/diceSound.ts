/**
 * Synthesizes a realistic dice-in-a-tray sound using the Web Audio API.
 * No audio files required — works fully offline in the PWA.
 *
 * Sound layers (in order):
 *  1. Hand rattle  – dice clacking in cupped hands before release
 *  2. Tray impact  – two-layer hit: low thud (tray body) + sharp clack (plastic)
 *  3. Bounce seqs  – per-die physics: intervals shrink exponentially as die settles
 *  4. Wall hits    – occasional boxier resonance when a die catches the tray wall
 *  5. Final settle – faint scrape as the last die comes to rest
 */

// ── Internal helpers ─────────────────────────────────────────────────────────

interface BurstOpts {
  filterType?: BiquadFilterType;
  freq: number;
  q: number;
  vol: number;
  attackMs: number;
  decayMs: number;
}

function burst(ctx: AudioContext, time: number, opts: BurstOpts): void {
  const { filterType = 'bandpass', freq, q, vol, attackMs, decayMs } = opts;
  const attackSec = attackMs / 1000;
  const decaySec  = decayMs  / 1000;
  const totalSec  = attackSec + decaySec + 0.01;

  const bufLen = Math.floor(ctx.sampleRate * totalSec);
  const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data   = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const src    = ctx.createBufferSource();
  src.buffer   = buf;

  const filter = ctx.createBiquadFilter();
  filter.type            = filterType;
  filter.frequency.value = freq;
  filter.Q.value         = q;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(vol, time + attackSec);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + attackSec + decaySec);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(time);
  src.stop(time + totalSec);
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Play a dice-rolling sound.
 * @param totalDice  Number of dice being rolled — affects density of the sound.
 *                   Use 1 for a single skill-check d20.
 */
export function playDiceRollSound(totalDice = 1): void {
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    const now = ctx.currentTime;

    // ── 1. Hand rattle (0 – 0.25 s) ──────────────────────────────────────────
    // Dice clacking against each other in the hand before being thrown.
    // More dice → denser rattle.
    const rattleCount = Math.min(totalDice * 2 + 2, 9);
    for (let i = 0; i < rattleCount; i++) {
      burst(ctx, now + Math.random() * 0.22, {
        freq:     3500 + Math.random() * 2500,
        q:        3 + Math.random() * 4,
        vol:      0.06 + Math.random() * 0.09,
        attackMs: 1,
        decayMs:  18 + Math.random() * 18,
      });
    }

    // ── 2. Primary tray impact (≈ 0.28 s) ────────────────────────────────────
    // Two simultaneous layers when dice first hit the tray surface:
    //   a) Low thud  – tray body resonating (felt / wood)
    //   b) High clack – hard plastic/resin striking the surface
    const impactT = 0.27 + Math.random() * 0.04;

    // Low thud
    burst(ctx, now + impactT, {
      filterType: 'lowpass',
      freq:       120 + Math.random() * 160,
      q:          0.7,
      vol:        0.45,
      attackMs:   10,
      decayMs:    130,
    });
    // Sharp clack
    burst(ctx, now + impactT, {
      freq:     2200 + Math.random() * 1800,
      q:        2.5 + Math.random() * 2,
      vol:      0.55,
      attackMs: 1,
      decayMs:  45,
    });
    // Extra mid-range body (die corners)
    burst(ctx, now + impactT + 0.005, {
      freq:     700 + Math.random() * 500,
      q:        1.5,
      vol:      0.25,
      attackMs: 3,
      decayMs:  70,
    });

    // ── 3. Per-die bounce sequences ───────────────────────────────────────────
    // Each die follows exponential bounce decay: intervals shrink by `restitution`
    // each bounce, volume decreases proportionally — just like a real bouncing object.
    const diceToSim = Math.min(totalDice, 6);

    for (let d = 0; d < diceToSim; d++) {
      // Stagger each die's first bounce slightly (they don't all land at once)
      let t         = impactT + 0.04 + d * 0.03 + Math.random() * 0.04;
      let vol       = 0.42 - d * 0.05;
      let interval  = 0.20 + Math.random() * 0.07; // time until first bounce
      const restitution = 0.52 + Math.random() * 0.14; // lower = settles faster

      while (vol > 0.018 && t < 1.92) {
        // Main surface bounce
        burst(ctx, now + t, {
          freq:     1200 + Math.random() * 2800,
          q:        1.8 + Math.random() * 2.5,
          vol,
          attackMs: 1,
          decayMs:  30 + Math.random() * 30,
        });

        // ── 4. Occasional wall impact ──────────────────────────────────────
        // ~20% chance a die catches the tray wall — deeper, boxier tone
        if (Math.random() < 0.20) {
          burst(ctx, now + t + 0.008, {
            filterType: 'lowpass',
            freq:       250 + Math.random() * 250,
            q:          0.8,
            vol:        vol * 0.7,
            attackMs:   6,
            decayMs:    90,
          });
        }

        t        += interval;
        interval *= restitution;        // bounces get shorter
        vol      *= restitution * 0.88; // bounces get quieter
      }

      // ── 5. Final settle / scrape ───────────────────────────────────────────
      // Faint rasping noise as the die slides to rest on the felt.
      if (t < 2.05) {
        burst(ctx, now + t, {
          freq:     600 + Math.random() * 500,
          q:        0.6,
          vol:      0.022,
          attackMs: 12,
          decayMs:  180,
        });
      }
    }

    setTimeout(() => ctx.close().catch(() => {}), 2600);
  } catch {
    // Audio unavailable or blocked — fail silently
  }
}
