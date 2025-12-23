
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ulsmiezomntmaihonqaa.supabase.co';
const supabaseAnonKey = 'sb_publishable_Gd5TJ0HGWfR83NNDHZLjXA_P4kUfUar';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
