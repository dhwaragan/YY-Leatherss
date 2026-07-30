import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl || 'NOT SET');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'SET' : 'NOT SET');
  console.error('Please set these in Netlify UI: Site settings → Environment variables');
}

// Use fallback values if not set (for local development)
const finalUrl = supabaseUrl || 'https://vnspipodxzxuwsailgok.supabase.co';
const finalKey = supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuc3BpcG9keHp4dXdzYWlsZ29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTIyNTgsImV4cCI6MjA5NjMyODI1OH0.wI8_OVKRzSGDTMyNQd5I_U1wZmQwVkDWYR2g-eiU78s';

export const supabase = createClient(finalUrl, finalKey);
