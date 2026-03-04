// scripts/data_import/seed_settings.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Ensure we have the service role key to bypass RLS and create tables if necessary
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStoreSettings() {
    console.log("Setting up store_settings table...");

    // 1. Create the table and enforcing RLS policies
    // We use the supabase.rpc to execute raw SQL, but since we don't have a raw query mechanism defined on client,
    // we assume the user has to run this manually if table doesn't exist, OR we can try to insert and catch "relation does not exist"

    // Instead of raw SQL here (which requires postgres admin access that service_role usually doesn't have),
    // we will document the SQL to run in the dashboard and just attempt to upsert the row.
    // However, if the user doesn't create the table, this script will fail.

    // Let's first provide the SQL string for the user just in case
    const tableSql = `
        CREATE TABLE IF NOT EXISTS store_settings (
            id INT PRIMARY KEY DEFAULT 1,
            contact_phone TEXT,
            contact_email TEXT,
            contact_hours TEXT,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            CONSTRAINT single_row CHECK (id = 1)
        );

        -- Security
        ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
        
        -- Public read
        CREATE POLICY "Public can view store settings" 
            ON store_settings FOR SELECT USING (true);
        
        -- Admin write
        CREATE POLICY "Admin can update store settings" 
            ON store_settings FOR UPDATE TO authenticated USING (true);
        
        CREATE POLICY "Admin can insert store settings" 
            ON store_settings FOR INSERT TO authenticated WITH CHECK (true);
    `;

    console.log("\n=================================");
    console.log("IMPORTANT: Please ensure the store_settings table exists.");
    console.log("If not, run this SQL in your Supabase SQL Editor:");
    console.log("---------------------------------");
    console.log(tableSql);
    console.log("=================================\n");

    console.log("Attempting to seed initial data...");

    const { data, error } = await supabase
        .from('store_settings')
        .upsert({
            id: 1, // Enforced single row
            contact_phone: "+91 98765 43210",
            contact_email: "support@cloudkitchen.in",
            contact_hours: "10 AM – 10 PM, Mon–Sun"
        }, { onConflict: 'id' })
        .select();

    if (error) {
        if (error.code === '42P01') {
            console.error("❌ ERROR: The 'store_settings' table does not exist.");
            console.error("Please run the SQL printed above in your Supabase dashboard first!");
        } else {
            console.error("❌ Error seeding settings:", error.message);
        }
    } else {
        console.log("✅ Store settings seeded successfully:", data[0]);
    }
}

setupStoreSettings();
