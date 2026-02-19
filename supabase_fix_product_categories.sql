-- ==========================================
-- FIX PRODUCT CATEGORIES VISIBILITY
-- The Products page joins 'product_categories'. If this is RLS-blocked, products might disappear or categories wont show.
-- ==========================================

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- 1. Check if policies exist, if so drop them
DROP POLICY IF EXISTS "Public can view product_categories" ON public.product_categories;
DROP POLICY IF EXISTS "Admins can manage product_categories" ON public.product_categories;

-- 2. Public Read (for Customers)
CREATE POLICY "Public can view product_categories" ON public.product_categories
FOR SELECT USING (true);

-- 3. Admin Full Access
CREATE POLICY "Admins can manage product_categories" ON public.product_categories
FOR ALL USING (public.is_admin());
