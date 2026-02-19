-- ==========================================
-- FIX ROLE MANAGEMENT
-- Run this to allow Admins to Assign (Insert) and Remove (Delete) roles.
-- efficiently using the is_admin() function.
-- ==========================================

-- 1. Ensure we don't have conflicting policies
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- 2. Add INSERT Permission (Critical for assigning new roles)
CREATE POLICY "Admins can insert roles" ON public.user_roles
FOR INSERT WITH CHECK (
  public.is_admin() = true
);

-- 3. Add DELETE Permission (Critical for removing roles)
CREATE POLICY "Admins can delete roles" ON public.user_roles
FOR DELETE USING (
  public.is_admin() = true
);

-- 4. Verify UPDATE is present (re-applying just in case)
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles" ON public.user_roles
FOR UPDATE USING (
  public.is_admin() = true
);
