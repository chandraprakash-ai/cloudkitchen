const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bqacfcanqwmyabubnzkp.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_publishable_QXD5m3vw287hQqcTzE8CKg_ri3AK18M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCategories() {
    console.log("Fetching menu items to update categories...");

    // Fetch all current menu items
    const { data: items, error: fetchError } = await supabase.from('menu_items').select('id, categories');

    if (fetchError) {
        console.error("Error fetching items:", fetchError);
        return;
    }

    console.log(`Found ${items.length} items. Processing...`);

    let updatedCount = 0;

    for (const item of items) {
        if (!item.categories || !Array.isArray(item.categories)) continue;

        let changed = false;
        const newCategories = item.categories.map(cat => {
            if (cat === 'pizza') {
                changed = true;
                return 'fast food';
            }
            if (cat === 'biryani') {
                changed = true;
                return 'sabji';
            }
            return cat;
        });

        if (changed) {
            console.log(`Updating item ID ${item.id} categories:`, item.categories, '->', newCategories);
            // In a real scenario we'd use array_replace in SQL, but for a small dataset, sequential updates are fine
            const { error: updateError } = await supabase
                .from('menu_items')
                .update({ categories: newCategories })
                .eq('id', item.id);

            if (updateError) {
                console.error(`Failed to update item ${item.id}:`, updateError);
            } else {
                updatedCount++;
            }
        }
    }

    console.log(`Migration complete. Updated ${updatedCount} items.`);
}

migrateCategories();
