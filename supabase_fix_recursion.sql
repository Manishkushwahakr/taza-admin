-- ==========================================
-- FIX INFINITE RECURSION (Error 42P17)
-- This script creates a secure function to check admin status
-- preventing the policy from looping on itself.
-- ==========================================

-- 1. Create a Secure Function to check if a user is an admin
-- SECURITY DEFINER means this function runs with the privileges of the creator (postgres)
-- bypassing RLS checks to avoid the infinite loop.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role::text = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Reset RLS on user_roles
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Drop all potentially recursive policies
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;

-- 4. Create Non-Recursive Policies

-- Policy A: Simple check for users reading their own data
-- No recursion because it doesn't query the table, just checks the ID
CREATE POLICY "Users can read own role" ON public.user_roles
FOR SELECT USING (
  auth.uid() = user_id
);

-- Policy B: Admin Access using the Secure Function
-- This calls is_admin(), which bypasses RLS, so no recursion happens!
CREATE POLICY "Admins can read all roles" ON public.user_roles
FOR SELECT USING (
  public.is_admin() = true
);

CREATE POLICY "Admins can update roles" ON public.user_roles
FOR UPDATE USING (
  public.is_admin() = true
);

-- 5. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO anon;
