-- ==============================================================================
-- QUANTUMWEAR X — ADD COLOR CHART & SIZE CHART COLUMNS TO PRODUCTS TABLE
-- ==============================================================================
-- INSTRUCTIONS:
-- 1. Open Supabase SQL Editor:
--    https://supabase.com/dashboard/project/ukyiqvuxqhzohaufnryr/sql/new
-- 2. Paste this SQL snippet into the editor.
-- 3. Click "Run" (or Ctrl + Enter).
-- 4. Open Table Editor: the new columns are immediately ready!
-- ==============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS feature_image_1 TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS feature_image_2 TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color_chart_image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_chart_image TEXT;

COMMENT ON COLUMN public.products.feature_image_1 IS 'Color Chart image displayed in left column above quote section';
COMMENT ON COLUMN public.products.feature_image_2 IS 'Size Chart image displayed in right column above quote section';
COMMENT ON COLUMN public.products.color_chart_image IS 'Color Chart image displayed in left column above quote section';
COMMENT ON COLUMN public.products.size_chart_image IS 'Size Chart image displayed in right column above quote section';

