import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://szzofkefbrqvsfkwojdj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6em9ma2VmYnJxdnNma3dvamRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTUwNjMsImV4cCI6MjA5MDI5MTA2M30.euvg_NuoNi_tgioOJFB2nvV7Cbe1J5_-veE8Z3Qw0JY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { supabaseUrl };
