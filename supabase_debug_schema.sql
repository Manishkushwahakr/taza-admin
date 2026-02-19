-- ==========================================
-- DEBUG SCHEMA & ENUMS
-- Run this to help me verify why "admin" is causing an error
-- ==========================================

-- 1. Check the Column Type of 'role' in 'user_roles'
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'user_roles' AND column_name = 'role';

-- 2. Check the Values inside the Enum (if it IS an enum)
SELECT t.typname, e.enumlabel
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'app_role' OR t.typname = 'user_role';

-- 3. Check for any weird Policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_roles';

-- 4. Check if a database role named "admin" actually exists (Postgres level)
SELECT rolname FROM pg_roles WHERE rolname = 'admin';
