import { createClient } from '@supabase/supabase-js';

// Get environment variables - NO hardcoded fallbacks (old project hit quota limit)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl || 'NOT SET');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'SET' : 'NOT SET');
  console.error('Please set these in your .env file (see NEW_SUPABASE_SETUP.md)');
}

// Create client - uses placeholder if not configured (prevents crash, shows error in console)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
