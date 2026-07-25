import { db } from './database';

/**
 * Tombstones older than this are purged on startup (60 days). A tombstone only
 * needs to live long enough for every one of the DM's devices to pull a bundle
 * containing it — a device that stays offline longer than the TTL may resurrect
 * a deleted record on its next push. Accepted trade-off to keep the Dexie
 * tables and cloud bundles from growing forever.
 */
const TOMBSTONE_TTL_MS = 60 * 24 * 60 * 60 * 1000;

/** Hard-delete expired tombstones from sessions, encounters, and NPCs. Fire-and-forget on app start. */
export async function purgeExpiredTombstones(): Promise<void> {
  const cutoff = Date.now() - TOMBSTONE_TTL_MS;
  const isExpired = (r: { deleted?: boolean; updatedAt: number }) =>
    r.deleted === true && r.updatedAt < cutoff;

  try {
    const [sessions, encounters, npcs] = await Promise.all([
      db.sessions.filter(isExpired).delete(),
      db.encounters.filter(isExpired).delete(),
      db.npcs.filter(isExpired).delete(),
    ]);
    const total = sessions + encounters + npcs;
    if (total > 0) {
      console.info(
        `[tombstones] Purged ${sessions} session, ${encounters} encounter, ${npcs} NPC tombstone(s) past the 60-day TTL`,
      );
    }
  } catch (err) {
    console.warn('[tombstones] Purge failed (will retry next startup):', err);
  }
}
