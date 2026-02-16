-- 1. Disable RLS temporarily to verify if this is the issue
-- (You can re-enable and add specific policies later for better security)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 2. OR, if you prefer to keep RLS enabled, run these policies:
/*
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
CREATE POLICY "Enable read access for all users" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_roles;
CREATE POLICY "Enable read access for all users" ON public.user_roles FOR SELECT USING (true);
*/

-- 3. Ensure the 'anon' role has usage on the public schema (usually granted by default)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
