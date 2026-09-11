import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * "A new version is available — Reload" banner.
 *
 * Why this exists: the PWA used `registerType: 'autoUpdate'`, which swaps the
 * service worker silently. The page you are already looking at keeps running the
 * OLD bundle until it is reloaded, and nothing on screen says so. In practice
 * that meant shipping a fix, being told it was live, and the user still staring
 * at the old build with no way to tell — iOS Safari is especially reluctant to
 * pick up a new worker. Now the worker waits and the app asks.
 *
 * Deliberately a prompt rather than an auto-reload: this app gets used live at
 * the table, and yanking the page out from under someone mid-combat to apply a
 * cosmetic patch is worse than letting them finish the fight. `registerType` is
 * set to 'prompt' in vite.config.ts to match — the two must stay in sync, or the
 * worker auto-activates and `needRefresh` never fires.
 */

/** How often an already-open tab re-checks for a new deploy. */
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Without this, a tab left open all session never notices a deploy — the
      // browser only checks for a new worker on navigation. A DM with the
      // campaign page open for four hours is exactly the case that matters.
      if (!registration) return;
      setInterval(() => {
        registration.update().catch(() => {
          /* offline, or the server is unreachable — try again next interval */
        });
      }, UPDATE_CHECK_INTERVAL_MS);
    },
    onRegisterError(err) {
      console.warn('[UpdatePrompt] service worker registration failed:', err);
    },
  });

  if (!needRefresh) return null;

  return (
    // Bottom-RIGHT, not bottom-centre: Toast already owns bottom-centre and the
    // two would sit on top of each other.
    <div className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)]">
      <div className="flex items-center gap-3 rounded-xl bg-amber-950 text-white shadow-lg ring-1 ring-black/20 pl-4 pr-2 py-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight">Update available</p>
          <p className="text-xs text-amber-200 leading-tight">
            Reload to get the latest version.
          </p>
        </div>
        <button
          onClick={() => updateServiceWorker(true)}
          className="flex-shrink-0 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white text-sm font-semibold rounded-lg px-3 min-h-[44px] transition-colors"
        >
          Reload
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="flex-shrink-0 text-amber-300 hover:text-white text-xl leading-none rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          title="Dismiss — the update applies next time the app is reopened"
          aria-label="Dismiss update notice"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
