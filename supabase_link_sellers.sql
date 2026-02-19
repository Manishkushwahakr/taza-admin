-- ============================================================
-- LINK SELLER SECTION (Tables, Relations, & RLS)
-- ============================================================

-- 1. Ensure AREAS table exists ( Referenced by Sellers )
CREATE TABLE IF NOT EXISTS public.areas (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    pincode text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT areas_pkey PRIMARY KEY (id)
);

-- Enable RLS on Areas
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read areas" ON public.areas;
DROP POLICY IF EXISTS "Admins manage areas" ON public.areas;
CREATE POLICY "Public read areas" ON public.areas FOR SELECT USING (true);
CREATE POLICY "Admins manage areas" ON public.areas FOR ALL USING (public.is_admin());


-- 2. Create/Update SELLERS table
-- We use CREATE TABLE IF NOT EXISTS to avoid errors if it exists.
-- Then we verify/add columns and constraints.

CREATE TABLE IF NOT EXISTS public.sellers (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  area_id uuid null,
  commission_percentage numeric null default 0,
  tech_fee_type text null default 'per_order'::text,
  tech_fee_amount numeric null default 0,
  is_active boolean null default true,
  created_at timestamp without time zone null default now(),
  "Seller_name" text not null,
  area_name text null,
  constraint sellers_pkey primary key (id),
  constraint sellers_area_id_key unique (area_id),
  constraint sellers_tech_fee_type_check check (
    (
      tech_fee_type = any (array['fixed'::text, 'per_order'::text])
    )
  )
);

-- 3. Fix Relationships (CRITICAL FOR FRONTEND JOINS)
-- The frontend uses `profiles:user_id`. For Supabase to detect this,
-- user_id should reference public.profiles, OR we depend on the identical name.
-- Using public.profiles is safer for the join alias.

-- Drop existing constraints to ensure we point to the right tables
ALTER TABLE public.sellers DROP CONSTRAINT IF EXISTS sellers_area_id_fkey;
ALTER TABLE public.sellers DROP CONSTRAINT IF EXISTS sellers_user_id_fkey;

-- Re-add constraints
ALTER TABLE public.sellers 
    ADD CONSTRAINT sellers_area_id_fkey 
    FOREIGN KEY (area_id) REFERENCES public.areas (id) ON DELETE CASCADE;

-- Pointing to profiles(user_id) allows fetching "profiles:user_id" easily
ALTER TABLE public.sellers 
    ADD CONSTRAINT sellers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.profiles (user_id) ON DELETE CASCADE;

-- 4. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON public.sellers USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_sellers_is_active ON public.sellers USING btree (is_active);

-- 5. Row Level Security (RLS)
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Remove old policies
DROP POLICY IF EXISTS "Admins manage sellers" ON public.sellers;
DROP POLICY IF EXISTS "Sellers read own data" ON public.sellers;

-- Admin Full Access
CREATE POLICY "Admins manage sellers" ON public.sellers
    FOR ALL
    USING (public.is_admin());

-- Sellers Read Own Data (If they log in to a dashboard)
CREATE POLICY "Sellers read own data" ON public.sellers
    FOR SELECT
    USING (auth.uid() = user_id);
