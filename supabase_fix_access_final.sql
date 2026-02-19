-- ==========================================
-- EMERGENCY FIX: FINAL ACCESS SCRIPT
-- Run this to fix "Access Denied" permanently
-- ==========================================

-- 1. Disable RLS on user_roles temporarily to debug (or permanently if RLS is too complex for now)
-- We will Re-Enable it with a very simple policy
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 2. Ensure the user has the role (Just in case)
INSERT INTO public.user_roles (user_id, role)
VALUES ('fc71b0ee-802f-4336-8f62-05f46b00da60', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';

-- 3. Re-Enable RLS with a broad "Read Own" policy
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
CREATE POLICY "Users can read own role" ON public.user_roles
FOR SELECT USING (
  -- Allow users to read their own role
  auth.uid() = user_id 
  -- OR allow admins to read everything (simplified)
  OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 4. Grant Usage on Schema (Standard fix for new tables)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Force public.user_roles to be readable by authenticated users (Fallback)
-- If the Policy fails, this ensures basic select rights exist at postgres level
GRANT SELECT ON public.user_roles TO authenticated;
