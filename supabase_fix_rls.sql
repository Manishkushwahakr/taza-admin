-- Enable RLS on Orders tables if not already enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;

-- 1. Create Policy for Admins to VIEW ALL Orders
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'orders' 
        AND policyname = 'Admins can view all orders'
    ) THEN
        CREATE POLICY "Admins can view all orders" ON public.orders
        FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'::public.app_role
            )
        );
    END IF;
END $$;

-- 2. Create Policy for Admins to VIEW ALL Order Items
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_items' 
        AND policyname = 'Admins can view all order items'
    ) THEN
        CREATE POLICY "Admins can view all order items" ON public.order_items
        FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'::public.app_role
            )
        );
    END IF;
END $$;

-- 3. Create Policy for Admins to VIEW ALL Order Payments
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_payments' 
        AND policyname = 'Admins can view all order payments'
    ) THEN
        CREATE POLICY "Admins can view all order payments" ON public.order_payments
        FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'::public.app_role
            )
        );
    END IF;
END $$;

-- 4. Create Policy for Admins to UPDATE Orders (e.g. changing status)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'orders' 
        AND policyname = 'Admins can update orders'
    ) THEN
        CREATE POLICY "Admins can update orders" ON public.orders
        FOR UPDATE
        USING (
            EXISTS (
                SELECT 1 FROM public.user_roles 
                WHERE user_id = auth.uid() 
                AND role = 'admin'::public.app_role
            )
        );
    END IF;
END $$;
