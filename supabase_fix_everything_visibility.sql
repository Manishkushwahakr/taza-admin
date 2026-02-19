-- ==========================================
-- MASTER VISIBILITY FIX (ALL TABLES)
-- Run this to fix empty tables everywhere (Orders, Products, Users, Sellers)
-- This uses the secure IS_ADMIN() function to avoid all previous errors.
-- ==========================================

-- 1. ORDERS & DETAILS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders; -- Added DROP
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.is_admin());

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view order items" ON public.order_items;
CREATE POLICY "Admins can view order items" ON public.order_items FOR SELECT USING (public.is_admin());

ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view order payments" ON public.order_payments;
CREATE POLICY "Admins can view order payments" ON public.order_payments FOR SELECT USING (public.is_admin());

-- 2. PRODUCTS & CATEGORIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Admins can view all products" ON public.products FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (public.is_admin());

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories; -- Added DROP
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories; -- Added DROP
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories; -- Added DROP

CREATE POLICY "Admins can view all categories" ON public.categories FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (public.is_admin());

-- 3. SELLERS & AREAS
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all sellers" ON public.sellers;
DROP POLICY IF EXISTS "Admins can update sellers" ON public.sellers; -- Added DROP

CREATE POLICY "Admins can view all sellers" ON public.sellers FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update sellers" ON public.sellers FOR UPDATE USING (public.is_admin());

ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage areas" ON public.areas;
CREATE POLICY "Admins can manage areas" ON public.areas FOR ALL USING (public.is_admin());

-- 4. USERS (PROFILES)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());

-- 5. ADDRESSES (Missing Link!)
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all addresses" ON public.addresses;
CREATE POLICY "Admins can view all addresses" ON public.addresses FOR SELECT USING (public.is_admin());
