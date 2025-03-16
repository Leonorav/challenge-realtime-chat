import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key
// The Supabase values shouldn't be here, but I did it for the challenge only.

const supabaseUrl = 'https://lhafcprsixjfbadigtfp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoYWZjcHJzaXhqZmJhZGlndGZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NTMwNDUsImV4cCI6MjA1NzUyOTA0NX0.Ntyobc9vRhDXXWofSjscw_vgAl9Ubmok9v2Hf1OScTQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
