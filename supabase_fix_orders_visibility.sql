-- ==========================================
-- FIX ORDERS VISIBILITY
-- Run this to make orders appear in the Admin Panel
-- ==========================================

-- 1. Enable RLS on Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. Drop old/broken policies
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- 3. Create NEW Policies using the secure is_admin() function
-- This ensures that if you are an admin (verified by the previous script), you see ALL orders.

CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (
  public.is_admin() = true
);

CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE USING (
  public.is_admin() = true
);

-- 4. Do the same for Order Items (otherwise details will be empty)
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view order items" ON public.order_items;

CREATE POLICY "Admins can view order items" ON public.order_items
FOR SELECT USING (
  public.is_admin() = true
);

-- 5. Do the same for Order Payments
ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view order payments" ON public.order_payments;

CREATE POLICY "Admins can view order payments" ON public.order_payments
FOR SELECT USING (
  public.is_admin() = true
);
