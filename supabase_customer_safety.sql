-- ==========================================
-- CUSTOMER APP SAFETY SCRIPT
-- Run this to ENSURE customers can still see products and their own orders.
-- This prevents the "Admin Fix" from breaking the "Customer App".
-- ==========================================

-- 1. PRODUCTS & CATEGORIES (Public Read)
-- Everyone (anon and logged in) must be able to see products.

DROP POLICY IF EXISTS "Public can view all products" ON public.products;
CREATE POLICY "Public can view all products" ON public.products
FOR SELECT USING (true); -- 'true' means visible to everyone

DROP POLICY IF EXISTS "Public can view all categories" ON public.categories;
CREATE POLICY "Public can view all categories" ON public.categories
FOR SELECT USING (true);

-- 2. ORDERS (Own Data Read)
-- Customers must see only their own orders.

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can view own order payments" ON public.order_payments;
CREATE POLICY "Users can view own order payments" ON public.order_payments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_payments.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- 3. PROFILES & ROLES
-- Users need to read their own profile.

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);
