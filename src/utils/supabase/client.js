import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bqacfcanqwmyabubnzkp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_QXD5m3vw287hQqcTzE8CKg_ri3AK18M';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials not found in environment variables. Please check your .env.local file.");
}

const createSafeStorage = () => {
    if (typeof window === "undefined") return null;
    try {
        window.localStorage.getItem('test');
        return window.localStorage;
    } catch (e) {
        console.warn('localStorage is disabled or unavailable. Falling back to memory storage.');
        return null;
    }
};

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            storage: createSafeStorage(),
            persistSession: !!createSafeStorage(),
            autoRefreshToken: !!createSafeStorage(),
            detectSessionInUrl: false
        }
    }
);
