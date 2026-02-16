-- 1. Ensure the backfill handles the enum type public.app_role
-- Note: This assumes 'user' is a valid value in your public.app_role enum.
-- If your enum uses 'customer' or similar, please adjust the 'user' string below.

INSERT INTO public.profiles (user_id, name)
SELECT id, COALESCE(raw_user_meta_data->>'name', 'New User')
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- 2. Backfill roles for existing users
-- casting the string 'user' to public.app_role
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'user'::public.app_role
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- 3. Create/Update the trigger function to automatically sync new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'New User'));
  
  -- Automatically assign the 'user' role on signup
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user'::public.app_role);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-bind the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
