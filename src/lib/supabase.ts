import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Untyped client — we use our own types in sharing.ts for row shapes.
// Supabase's Database generic causes type conflicts with .update()/.insert() in tsc -b mode.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
