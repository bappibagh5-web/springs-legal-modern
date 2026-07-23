
-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.user_status AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL,
  role public.app_role NOT NULL DEFAULT 'admin',
  status public.user_status NOT NULL DEFAULT 'active',
  last_login timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security definer helper to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = _role AND status = 'active'
  )
$$;

-- Policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'admin')
    OR auth.uid() = id
  );

DROP POLICY IF EXISTS "Super admins can insert profiles" ON public.profiles;
CREATE POLICY "Super admins can insert profiles" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Super admins can update profiles" ON public.profiles;
CREATE POLICY "Super admins can update profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Users can update own name" ON public.profiles;
CREATE POLICY "Users can update own name" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.profiles;
CREATE POLICY "Super admins can delete profiles" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Seed super admin
DO $$
DECLARE
  new_user_id uuid;
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = 'bappibagh5@gmail.com';
  IF existing_id IS NULL THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'bappibagh5@gmail.com',
      crypt('Brian@7740', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Super Admin"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), new_user_id, new_user_id::text,
      jsonb_build_object('sub', new_user_id::text, 'email', 'bappibagh5@gmail.com', 'email_verified', true),
      'email', now(), now(), now()
    );
    INSERT INTO public.profiles (id, full_name, email, role, status)
    VALUES (new_user_id, 'Super Admin', 'bappibagh5@gmail.com', 'super_admin', 'active');
  ELSE
    INSERT INTO public.profiles (id, full_name, email, role, status)
    VALUES (existing_id, 'Super Admin', 'bappibagh5@gmail.com', 'super_admin', 'active')
    ON CONFLICT (id) DO UPDATE SET role = 'super_admin', status = 'active';
  END IF;
END $$;
