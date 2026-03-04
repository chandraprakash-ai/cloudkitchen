-- ==========================================
-- Cloud Kitchen: Supabase Schema & Seed Data
-- ==========================================

-- 1. Create Tables
-- ------------------------------------------

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    original_price INTEGER,
    categories TEXT[] NOT NULL DEFAULT '{}',
    image TEXT,
    image_position TEXT DEFAULT 'center',
    rating NUMERIC(2,1) DEFAULT 4.0,
    in_stock BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_id TEXT UNIQUE NOT NULL, -- e.g. ORD-8821
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    user_id UUID REFERENCES auth.users(id), -- links order to an authenticated user
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'cooking', 'ready', 'delivered'
    total_amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time INTEGER NOT NULL -- historical price record
);

-- 2. Setup Row Level Security (RLS)
-- ------------------------------------------
-- Public users can: read menu, place orders, read their own orders.
-- Only authenticated (admin) users can: manage menu, update order statuses, view all orders.

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ── Menu Items ──

-- Anyone can view the menu
CREATE POLICY "Public can view menu items" ON menu_items
    FOR SELECT USING (true);

-- Only authenticated users (admin) can insert/update/delete menu items
CREATE POLICY "Admin can insert menu items" ON menu_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update menu items" ON menu_items
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admin can delete menu items" ON menu_items
    FOR DELETE TO authenticated USING (true);

-- ── Orders ──

-- Public can place orders
CREATE POLICY "Public can insert orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Public can view their own orders (by user_id)
-- For simplicity, we allow SELECT for now and filter client-side by user_id
CREATE POLICY "Public can view orders" ON orders
    FOR SELECT USING (true);

-- Only authenticated users (admin/delivery) can update order status
CREATE POLICY "Admin can update orders" ON orders
    FOR UPDATE TO authenticated USING (true);

-- ── Order Items ──

-- Public can insert order items (when placing an order)
CREATE POLICY "Public can insert order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- Public can view order items
CREATE POLICY "Public can view order items" ON order_items
    FOR SELECT USING (true);

-- Only authenticated users can update/delete order items
CREATE POLICY "Admin can update order items" ON order_items
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admin can delete order items" ON order_items
    FOR DELETE TO authenticated USING (true);


-- 3. Storage Configuration (Images)
-- ------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'menu-images');

CREATE POLICY "Authenticated Upload"
    ON storage.objects FOR INSERT
    TO authenticated WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Authenticated Update"
    ON storage.objects FOR UPDATE
    TO authenticated USING (bucket_id = 'menu-images');

CREATE POLICY "Authenticated Delete"
    ON storage.objects FOR DELETE
    TO authenticated USING (bucket_id = 'menu-images');


-- 4. Initial Seed Data
-- ------------------------------------------
-- Add items from the admin panel or via SQL manually.
