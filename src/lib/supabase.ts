import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uogyayrcpqvclvqvmpth.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZ3lheXJjcHF2Y2x2cXZtcHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzE3NTMsImV4cCI6MjA4NzQ0Nzc1M30.s_jy_JrKwcla9Bgc-8MDpMN-ozp0QxEGOyw1zGFX2xc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
