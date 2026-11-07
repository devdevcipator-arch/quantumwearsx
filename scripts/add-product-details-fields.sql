-- ==========================================================
-- QUANTUMWEAR X — ADD SECONDARY IMAGES & LONG DESCRIPTION
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ukyiqvuxqhzohaufnryr/sql/new
-- ==========================================================

-- 1. Add long_description column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS long_description TEXT;

-- 2. Add 3 secondary image columns to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_image_1 TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_image_2 TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_image_3 TEXT;

-- 3. Add secondary_images array column for convenient bulk querying
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_images TEXT[];

-- 4. Document column purposes
COMMENT ON COLUMN public.products.long_description IS 'Detailed multi-paragraph product overview and manufacturing specifications';
COMMENT ON COLUMN public.products.secondary_image_1 IS 'First secondary gallery thumbnail image';
COMMENT ON COLUMN public.products.secondary_image_2 IS 'Second secondary gallery thumbnail image';
COMMENT ON COLUMN public.products.secondary_image_3 IS 'Third secondary gallery thumbnail image';
COMMENT ON COLUMN public.products.secondary_images IS 'Array of all secondary gallery images for thumbnail switcher';

