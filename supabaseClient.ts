
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ulsmiezomntmaihonqaa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsc21pZXpvbW50bWFpaG9ucWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NTQwOTgsImV4cCI6MjA4MjAzMDA5OH0.wCJvUGkoqCo7xRBWIIf1QwBZGt-J5alcKhxEYQ0TfmY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
