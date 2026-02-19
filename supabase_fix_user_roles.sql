-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their OWN role
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' 
        AND policyname = 'Users can read own role'
    ) THEN
        CREATE POLICY "Users can read own role" ON public.user_roles
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Allow Admins to read ALL roles (for User Management page)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' 
        AND policyname = 'Admins can read all roles'
    ) THEN
        CREATE POLICY "Admins can read all roles" ON public.user_roles
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
