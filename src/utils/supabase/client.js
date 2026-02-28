import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bqacfcanqwmyabubnzkp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_QXD5m3vw287hQqcTzE8CKg_ri3AK18M';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not found in environment variables. Please check your .env.local file.");
}

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);
