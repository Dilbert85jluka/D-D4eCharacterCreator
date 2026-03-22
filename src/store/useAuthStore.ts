import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/sharing';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  login: (email: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    // Prevent double init
    if (get().isInitialized) return;

    // Check existing session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      set({ user: session.user, profile, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }

    // Listen for auth changes (magic link callback, logout, etc.)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        set({ user: session.user, profile });
      } else {
        set({ user: null, profile: null });
      }
    });
  },

  login: async (email: string) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // After clicking magic link, redirect back to the app
        emailRedirectTo: window.location.origin,
      },
    });
    set({ isLoading: false });
    return { error: error?.message ?? null };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  updateDisplayName: async (name: string) => {
    const userId = get().user?.id;
    if (!userId) return;
    await supabase
      .from('profiles')
      .update({ display_name: name, updated_at: new Date().toISOString() })
      .eq('id', userId);
    set({ profile: { ...get().profile!, display_name: name } });
  },
}));

/** Fetch (or wait for trigger-created) profile row */
async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}
