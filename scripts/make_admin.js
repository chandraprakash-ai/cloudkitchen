#!/usr/bin/env node

/**
 * Script to grant a user admin privileges in Supabase.
 * It updates the user's metadata to include `role: "admin"`.
 * 
 * Usage:
 * 1. Make sure you are in the project root.
 * 2. Get your Supabase Service Role Key from the dashboard (Settings > API).
 * 3. Run:
 *    SUPABASE_SERVICE_KEY="your_service_role_key" node scripts/make_admin.js "user@example.com"
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function makeAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    const email = process.argv[2];

    if (!url || !serviceKey) {
        console.error("❌ Error: Missing Supabase URL or Service Role Key.");
        console.error("Please provide SUPABASE_SERVICE_KEY as an environment variable.");
        console.error("Example: SUPABASE_SERVICE_KEY=xxx node scripts/make_admin.js user@email.com");
        process.exit(1);
    }

    if (!email) {
        console.error("❌ Error: Missing email address.");
        console.error("Usage: node scripts/make_admin.js <email>");
        process.exit(1);
    }

    console.log(`🔍 Looking for user with email: ${email}...`);

    // Create a Supabase client with the SERVICE_ROLE key (bypasses RLS & allows admin actions)
    const supabaseAdmin = createClient(url, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        // 1. Find the user ID by email via the Admin API
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;

        const user = users.find(u => u.email === email);
        if (!user) {
            console.error(`❌ User not found: ${email}. Make sure they have signed up first.`);
            process.exit(1);
        }

        console.log(`✅ Found user: ${user.id}`);

        // 2. Update their user metadata to include role: "admin"
        console.log("⚙️  Updating user metadata...");
        const newMetadata = {
            ...user.user_metadata,
            role: "admin"
        };

        const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { user_metadata: newMetadata }
        );

        if (updateError) throw updateError;

        console.log(`🎉 Success! ${email} has been granted admin privileges.`);
        console.log(`They can now log in at /admin/login`);

    } catch (err) {
        console.error("❌ Failed to update user:", err.message);
        process.exit(1);
    }
}

makeAdmin();
