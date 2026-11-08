-- ==============================================================================
-- QUANTUMWEAR X — SUPABASE COMPLETE DATABASE SCHEMA MIGRATION
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard:
--    https://supabase.com/dashboard/project/ukyiqvuxqhzohaufnryr/sql/new
-- 2. Paste this entire SQL script into the SQL Editor.
-- 3. Click "Run" (or Ctrl + Enter).
-- 4. Open the "Table Editor" on the left: all new columns and the subcategories
--    table will now appear with all fields fully visible!
-- ==============================================================================

-- 1. Create subcategories table (if not exists)
CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(category, name)
);

-- 2. Enable Row Level Security (RLS) on subcategories
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for subcategories
DROP POLICY IF EXISTS "Public can view subcategories" ON public.subcategories;
CREATE POLICY "Public can view subcategories" ON public.subcategories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable all operations for subcategories" ON public.subcategories;
CREATE POLICY "Enable all operations for subcategories" ON public.subcategories FOR ALL USING (true) WITH CHECK (true);

-- 4. Add new columns to products table (for new product detail view & admin forms)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_image_1 TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_image_2 TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_image_3 TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_images TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS feature_image_1 TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS feature_image_2 TEXT;

-- 5. Add helpful documentation comments to columns
COMMENT ON COLUMN public.products.long_description IS 'Detailed multi-paragraph product overview and manufacturing specifications';
COMMENT ON COLUMN public.products.secondary_image_1 IS 'First secondary gallery thumbnail image';
COMMENT ON COLUMN public.products.secondary_image_2 IS 'Second secondary gallery thumbnail image';
COMMENT ON COLUMN public.products.secondary_image_3 IS 'Third secondary gallery thumbnail image';
COMMENT ON COLUMN public.products.secondary_images IS 'Array of all secondary gallery images for thumbnail switcher';
COMMENT ON COLUMN public.products.feature_image_1 IS 'First column section image displayed directly above quote section';
COMMENT ON COLUMN public.products.feature_image_2 IS 'Second column section image displayed directly above quote section';
COMMENT ON COLUMN public.products.subcategory IS 'Associated subcategory name';
COMMENT ON COLUMN public.products.subcategory_id IS 'Foreign key reference to subcategories table';

-- 6. Seed initial subcategories linked to each category
-- Activewear
INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Gym T-shirts and tank tops', 'Activewear', id, 1 FROM public.categories WHERE name = 'Activewear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Leggings and sports bras', 'Activewear', id, 2 FROM public.categories WHERE name = 'Activewear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Compression wear', 'Activewear', id, 3 FROM public.categories WHERE name = 'Activewear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Workout shorts and joggers', 'Activewear', id, 4 FROM public.categories WHERE name = 'Activewear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Custom fitness sets', 'Activewear', id, 5 FROM public.categories WHERE name = 'Activewear'
ON CONFLICT (category, name) DO NOTHING;

-- Sportswear
INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Football and hockey uniforms', 'Sportswear', id, 1 FROM public.categories WHERE name = 'Sportswear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Tracksuits and training suits', 'Sportswear', id, 2 FROM public.categories WHERE name = 'Sportswear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Cycling jerseys and bib shorts', 'Sportswear', id, 3 FROM public.categories WHERE name = 'Sportswear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Basketball jerseys and shorts', 'Sportswear', id, 4 FROM public.categories WHERE name = 'Sportswear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Sports jackets and teamwear', 'Sportswear', id, 5 FROM public.categories WHERE name = 'Sportswear'
ON CONFLICT (category, name) DO NOTHING;

-- Streetwear
INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Oversized T-shirts', 'Streetwear', id, 1 FROM public.categories WHERE name = 'Streetwear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Hoodies and sweatshirts', 'Streetwear', id, 2 FROM public.categories WHERE name = 'Streetwear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Baggy jeans and joggers', 'Streetwear', id, 3 FROM public.categories WHERE name = 'Streetwear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Varsity and bomber jackets', 'Streetwear', id, 4 FROM public.categories WHERE name = 'Streetwear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Custom caps and beanies', 'Streetwear', id, 5 FROM public.categories WHERE name = 'Streetwear'
ON CONFLICT (category, name) DO NOTHING;

-- Safety Wear
INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'High-visibility safety vests', 'Safety Wear', id, 1 FROM public.categories WHERE name = 'Safety Wear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Reflective jackets and trousers', 'Safety Wear', id, 2 FROM public.categories WHERE name = 'Safety Wear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Work shirts and uniforms', 'Safety Wear', id, 3 FROM public.categories WHERE name = 'Safety Wear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Industrial coveralls', 'Safety Wear', id, 4 FROM public.categories WHERE name = 'Safety Wear'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Company-branded workwear', 'Safety Wear', id, 5 FROM public.categories WHERE name = 'Safety Wear'
ON CONFLICT (category, name) DO NOTHING;

-- Leather Products
INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Leather jackets', 'Leather Products', id, 1 FROM public.categories WHERE name = 'Leather Products'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Leather wallets and cardholders', 'Leather Products', id, 2 FROM public.categories WHERE name = 'Leather Products'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Leather belts', 'Leather Products', id, 3 FROM public.categories WHERE name = 'Leather Products'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Leather accessories', 'Leather Products', id, 4 FROM public.categories WHERE name = 'Leather Products'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Custom leather products', 'Leather Products', id, 5 FROM public.categories WHERE name = 'Leather Products'
ON CONFLICT (category, name) DO NOTHING;

-- Custom Bags
INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Backpacks', 'Custom Bags', id, 1 FROM public.categories WHERE name = 'Custom Bags'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Gym and duffel bags', 'Custom Bags', id, 2 FROM public.categories WHERE name = 'Custom Bags'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Sports and team bags', 'Custom Bags', id, 3 FROM public.categories WHERE name = 'Custom Bags'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Travel bags', 'Custom Bags', id, 4 FROM public.categories WHERE name = 'Custom Bags'
ON CONFLICT (category, name) DO NOTHING;

INSERT INTO public.subcategories (name, category, category_id, display_order)
SELECT 'Custom promotional bags', 'Custom Bags', id, 5 FROM public.categories WHERE name = 'Custom Bags'
ON CONFLICT (category, name) DO NOTHING;

-- 7. Backfill subcategory and subcategory_id on existing products
UPDATE public.products p
SET subcategory = s.name,
    subcategory_id = s.id
FROM public.subcategories s
WHERE p.subcategory IS NULL
  AND (
    p.title = s.name
    OR p.description LIKE ('%' || s.name || '%')
    OR p.description LIKE ('%<!--subcategory:' || s.name || '-->%')
  );

-- Specifically assign gjg to Company-branded workwear
UPDATE public.products
SET subcategory = 'Company-branded workwear',
    subcategory_id = (SELECT id FROM public.subcategories WHERE name = 'Company-branded workwear' LIMIT 1)
WHERE title = 'gjg';

