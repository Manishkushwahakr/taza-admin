-- ==========================================
-- ASSIGN ADMIN ROLE MANUALLY
-- Run this script to fix "Access Denied" for your specific user
-- ==========================================

-- 1. Insert or Update the user's role in public.user_roles
INSERT INTO public.user_roles (user_id, role)
VALUES ('fc71b0ee-802f-4336-8f62-05f46b00da60', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';

-- 2. Verify the insertion (Optional - just for you to see in results)
SELECT * FROM public.user_roles WHERE user_id = 'fc71b0ee-802f-4336-8f62-05f46b00da60';
