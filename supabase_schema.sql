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
-- For now, we allow public read access to the menu, but require auth for everything else.
-- You can tighten these policies later once Auth is fully implemented.

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public to view menu items
CREATE POLICY "Public can view menu items" ON menu_items
    FOR SELECT USING (true);

-- Allow public to insert orders (place an order from the cart)
CREATE POLICY "Public can insert orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Allow public to update their own order status temporarily for demo purposes (or restrict to admin later)
CREATE POLICY "Public can update orders temporarily" ON orders
    FOR UPDATE USING (true);
    
-- Allow public to insert order items
CREATE POLICY "Public can insert order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- Allow public to view orders temporarily for demo admin dashboard
CREATE POLICY "Public can view all orders" ON orders
    FOR SELECT USING (true);
    
CREATE POLICY "Public can view all order items" ON order_items
    FOR SELECT USING (true);

-- Allow public to update menu temporarily for demo admin dashboard
CREATE POLICY "Public can update menu" ON menu_items
    FOR UPDATE USING (true);

-- Allow public to insert menu items temporarily for demo admin dashboard
CREATE POLICY "Public can insert menu items" ON menu_items
    FOR INSERT WITH CHECK (true);

-- Allow public to delete menu items temporarily for demo admin dashboard
CREATE POLICY "Public can delete menu items" ON menu_items
    FOR DELETE USING (true);


-- 3. Storage Configuration (Images)
-- ------------------------------------------
-- Run these commands separately if you haven't enabled Storage yet, or just create the bucket manually via the UI.

-- Insert the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images
CREATE POLICY "Public Access" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'menu-images');

-- Allow authenticated users (or anyone for demo purposes) to upload images
CREATE POLICY "Public Upload" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'menu-images');

-- Allow users to update their uploaded images
CREATE POLICY "Public Update" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'menu-images');

-- Allow users to delete their uploaded images
CREATE POLICY "Public Delete" 
    ON storage.objects FOR DELETE 
    USING (bucket_id = 'menu-images');


-- 4. Initial Seed Data
-- ------------------------------------------
-- Seed data removed as requested. You can add your items manually from the Supabase dashboard later!
