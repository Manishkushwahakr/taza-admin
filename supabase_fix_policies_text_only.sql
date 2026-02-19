-- ==========================================
-- FIX ENUM/ROLE ERROR (Text-Only Mode)
-- Run this to fix Error 22023
-- ==========================================

-- 1. Disable RLS momentarily
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 2. Drop the problematic policies
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;

-- 3. Create NEW policies using ::text to avoid Enum confusion
-- This treats the role column as simple text, ignoring 'app_role' types

CREATE POLICY "Users can read own role" ON public.user_roles
FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Admins can read all roles" ON public.user_roles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role::text = 'admin' -- Force search as Text
  )
);

CREATE POLICY "Admins can update roles" ON public.user_roles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role::text = 'admin' -- Force search as Text
  )
);

-- 4. Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Ensure permissions
GRANT SELECT ON public.user_roles TO authenticated;
