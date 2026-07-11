import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vnspipodxzxuwsailgok.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuc3BpcG9keHp4dXdzYWlsZ29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTIyNTgsImV4cCI6MjA5NjMyODI1OH0.wI8_OVKRzSGDTMyNQd5I_U1wZmQwVkDWYR2g-eiU78s';

export const supabase = createClient(supabaseUrl, supabaseKey);
