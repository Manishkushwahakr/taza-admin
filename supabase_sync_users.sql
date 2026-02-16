-- 1. Backfill profiles from existing auth.users
INSERT INTO public.profiles (user_id, name)
SELECT id, COALESCE(raw_user_meta_data->>'name', 'New User')
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- 2. Backfill roles for existing profiles (default to 'user')
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'user'
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- 3. (Optional but Recommended) Create a trigger to automatically sync new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'New User'));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
