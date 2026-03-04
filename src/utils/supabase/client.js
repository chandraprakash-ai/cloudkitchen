import { createClient } from '@supabase/supabase-js';

const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!origUrl || !supabaseAnonKey) {
    console.error(
        "⚠️ Missing Supabase environment variables.\n" +
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    );
}

// On the client side, route through our Next.js rewrite proxy
// to bypass mobile ISP blocks on supabase.co domains in India
const isClient = typeof window !== 'undefined';
const supabaseUrl = isClient ? window.location.origin + '/req-proxy' : (origUrl || '');

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
    supabaseAnonKey || '',
    {
        auth: {
            storage: createSafeStorage(),
            persistSession: !!createSafeStorage(),
            autoRefreshToken: !!createSafeStorage(),
            detectSessionInUrl: false
        }
    }
);
