import { createClient } from '@supabase/supabase-js';

// We must access environment variables statically (explicitly) for Vite to replace them at build time.
let url = '';
let key = '';

try {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    url = import.meta.env.VITE_SUPABASE_URL;
    // @ts-ignore
    key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
} catch (error) {
  // Ignore errors
}

if (!url || !key) {
  try {
    if (typeof process !== 'undefined' && process.env) {
      url = url || process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || '';
      key = key || process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || '';
    }
  } catch (error) {
    // Ignore errors
  }
}

// Clean inputs (remove potential whitespace or quotes from copy-paste)
const clean = (str: string) => str ? str.trim().replace(/^["']|["']$/g, '') : '';
const cleanUrl = clean(url);
const cleanKey = clean(key);

// Fallback logic
const supabaseUrl = cleanUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = cleanKey || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn("WARNING: Supabase credentials are missing. Check your environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);