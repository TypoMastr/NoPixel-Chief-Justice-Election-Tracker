import { createClient } from '@supabase/supabase-js';

// User provided credentials
// We use these as defaults if environment variables are missing
const DEFAULT_URL = 'https://ulsmiezomntmaihonqaa.supabase.co';
const DEFAULT_KEY = 'sb_publishable_Gd5TJ0HGWfR83NNDHZLjXA_P4kUfUar';

let url = DEFAULT_URL;
let key = DEFAULT_KEY;

try {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    if (import.meta.env.VITE_SUPABASE_URL) url = import.meta.env.VITE_SUPABASE_URL;
    // @ts-ignore
    if (import.meta.env.VITE_SUPABASE_ANON_KEY) key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
} catch (error) {
  // Ignore errors
}

// Clean inputs
const clean = (str: string) => str ? str.trim().replace(/^["']|["']$/g, '') : '';
const supabaseUrl = clean(url);
const supabaseAnonKey = clean(key);

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn("WARNING: Using placeholder or missing credentials. App will likely default to offline mode.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);