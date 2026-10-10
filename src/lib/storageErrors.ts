/**
 * Turn whatever a failed IndexedDB write threw into something a player can act on.
 *
 * Exists because homebrew Save AND Delete both used to fail in total silence — no
 * try/catch, and the UI only advanced after the await, so a rejection looked exactly
 * like a button that did nothing. On an iPad there's no console to read the
 * rejection from either, so the message has to be on screen.
 *
 * Dexie wraps the underlying DOMException, so the name worth checking can be on the
 * error itself or on its `inner`.
 */
export type StorageAction = 'save' | 'delete';

export function describeStorageError(err: unknown, action: StorageAction): string {
  const e = err as { name?: string; message?: string; inner?: { name?: string; message?: string } };
  const names = [e?.name, e?.inner?.name].filter(Boolean).join(' ');
  const message = e?.message || e?.inner?.message || '';
  const verb = action === 'save' ? 'saved' : 'deleted';

  // WebKit (which is what every iOS browser, Chrome included, runs on) can drop
  // its IndexedDB connection after the app has been backgrounded. Everything
  // already loaded stays visible from memory, but every write fails until reload.
  if (
    /DatabaseClosed/i.test(names)
    || /connection to indexed database server lost|database connection is closing/i.test(message)
  ) {
    return `The browser's storage connection dropped, so this could not be ${verb}. `
      + 'Fully close the app (swipe it away, not just switch apps) and open it again.';
  }

  // The NAME is authoritative when there is one. Only fall back to sniffing the
  // text for an unnamed failure — otherwise an unrelated error that happens to
  // mention "quota" in passing gets reported as a full disk.
  const quota = names
    ? /quota/i.test(names)
    : /quota|storage (is )?full/i.test(message);

  if (quota) {
    return `Your browser has run out of storage space for this app, so this could not be ${verb}. `
      + 'Free some up — deleting unused battle maps or character portraits reclaims the most — then try again.';
  }
  if (/DataClone/i.test(names)) {
    return 'This content contains something the browser cannot store. Please report what you entered — this is a bug.';
  }
  if (/ConstraintError/i.test(names)) {
    return 'An item with that identifier already exists. Reload the page and try again.';
  }
  return `Could not ${action}: ${message || names || 'unknown error'}`;
}
