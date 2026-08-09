-- ============================================================
-- YY LEATHERS - Optimized Supabase Schema
-- Run this in your NEW Supabase project's SQL Editor
-- ============================================================

-- ============================================================
-- 1. KEY-VALUE SYNC TABLE (stores all storefront data as JSON)
-- ============================================================
CREATE TABLE IF NOT EXISTS yy_store_sync (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by key
CREATE INDEX IF NOT EXISTS idx_yy_store_sync_key ON yy_store_sync (key);

-- Disable Row Level Security on yy_store_sync so both client-side bypass logins
-- and server-side sync queries (using anon key) can write successfully.
DROP POLICY IF EXISTS "Public read access" ON yy_store_sync;
DROP POLICY IF EXISTS "Authenticated write access" ON yy_store_sync;
ALTER TABLE yy_store_sync DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. PROFILES TABLE (user accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Customer',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  phone TEXT,
  avatar TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for email lookups (used in login)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile, admins can read all
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
  ));

-- Users can update their own profile
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Anyone can insert (for signup)
CREATE POLICY "Anyone can insert profile" ON profiles
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- 3. STORAGE BUCKET for product images
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('yy-images', 'yy-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies (allow all operations for simplicity)
CREATE POLICY "Public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'yy-images');

CREATE POLICY "Allow upload storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'yy-images');

CREATE POLICY "Allow update storage" ON storage.objects
  FOR UPDATE USING (bucket_id = 'yy-images');

CREATE POLICY "Allow delete storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'yy-images');

-- ============================================================
-- 4. SEED DATA - Insert default content blocks and categories
-- ============================================================
INSERT INTO yy_store_sync (key, value, updated_at) VALUES
  ('custom_categories', '["FORMAL - DERBY", "PENNY LOAFERS", "DRIVING LOAFERS", "CHELSEA BOOT", "TRAVEL BOOTS", "SUEDE LOAFER", "SANDALS", "MULES", "SNEAKERS", "PREMIUM CHELSEA", "WALLET", "BELT"]'::jsonb, now()),
  ('content_blocks', '[
    {"id":"cb-about","key":"about","value":"{\"title\":\"About YY Leathers\",\"tagline\":\"Premium Leather Footwear Since 2026\",\"mission\":\"To craft timeless leather footwear\",\"paragraphs\":[]}"},
    {"id":"cb-history","key":"history","value":"[]"},
    {"id":"cb-policies","key":"policies","value":"{\"returns\":\"30-day return policy. Items must be unworn with original packaging.\",\"privacy\":\"We respect your privacy. No data is shared with third parties.\",\"terms\":\"By using our website you agree to our terms of service.\",\"shipping\":\"Shipping calculated by weight and destination. See delivery rates at checkout.\",\"buyback\":\"Trade in your old YY Leathers footwear for store credit.\"}"}
  ]'::jsonb, now()),
  ('offers', '[]'::jsonb, now()),
  ('hero_slides', '[]'::jsonb, now()),
  ('products', '[]'::jsonb, now()),
  ('orders', '[]'::jsonb, now()),
  ('preorders', '[]'::jsonb, now())
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 5. INSERT ADMIN PROFILE
-- ============================================================
INSERT INTO profiles (id, email, name, role, phone, address)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'dhwaragandhwaragan9@gmail.com',
  'YY Leathers Admin',
  'admin',
  '+91 98765 43210',
  'YY Leathers, Chennai, Tamil Nadu'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- DONE! Now run the migration script to add products.
-- ============================================================