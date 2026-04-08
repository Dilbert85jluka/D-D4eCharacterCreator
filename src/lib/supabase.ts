import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Untyped client — we use our own types in sharing.ts for row shapes.
// Supabase's Database generic causes type conflicts with .update()/.insert() in tsc -b mode.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Visibility-based session refresh ─────────────────────────────────────────
// When the browser tab is minimized/backgrounded, the Supabase client's JWT
// can expire. When the tab regains focus, proactively refresh the token so all
// subsequent Supabase client calls (REST + Realtime) work immediately.
// Uses the same raw-fetch approach that works reliably after idle.
const _storageKey = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;

function refreshTokenOnVisibility() {
  if (document.visibilityState !== 'visible') return;

  try {
    const raw = localStorage.getItem(_storageKey);
    if (!raw) return;
    const session = JSON.parse(raw);
    if (!session?.refresh_token) return;

    // Fire-and-forget: refresh the JWT via raw fetch, then update both
    // localStorage and the Supabase client's in-memory session.
    fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.access_token) return;
        // Update localStorage only — the Supabase client reads from localStorage
        // on each request. Avoid setSession() as it creates conflicting GoTrueClient
        // instances and lock contention warnings.
        localStorage.setItem(_storageKey, JSON.stringify(data));
      })
      .catch(() => { /* best-effort */ });
  } catch {
    // best-effort
  }
}

document.addEventListener('visibilitychange', refreshTokenOnVisibility);
