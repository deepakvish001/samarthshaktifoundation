
-- 1. STUDENT PROFILES: lock down + safe public view
DROP POLICY IF EXISTS "Public read student_profiles for verification" ON public.student_profiles;

CREATE OR REPLACE VIEW public.student_profiles_public
WITH (security_invoker = on) AS
SELECT
  id,
  student_id,
  full_name,
  course_name,
  course_category,
  father_name,
  mother_name,
  date_of_birth,
  photo_url,
  study_center
FROM public.student_profiles;

GRANT SELECT ON public.student_profiles_public TO anon, authenticated;

-- Helper: lookup a student's email by Student ID for the login flow (no enumeration of other fields).
CREATE OR REPLACE FUNCTION public.get_student_email_by_id(_student_id text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.student_profiles WHERE student_id = _student_id LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.get_student_email_by_id(text) TO anon, authenticated;

-- Allow a logged-in student to update their own row (used by reset password bookkeeping).
DROP POLICY IF EXISTS "Users update own student profile" ON public.student_profiles;
CREATE POLICY "Users update own student profile"
ON public.student_profiles
FOR UPDATE
TO authenticated
USING (email = auth.email())
WITH CHECK (email = auth.email());

-- 2. ALOT_NUMBERS: lock down + safe public photo view
DROP POLICY IF EXISTS "Public read alot_numbers" ON public.alot_numbers;

CREATE OR REPLACE VIEW public.alot_numbers_public
WITH (security_invoker = on) AS
SELECT
  id,
  student_id,
  student_photo_url,
  course_name
FROM public.alot_numbers;

GRANT SELECT ON public.alot_numbers_public TO anon, authenticated;

-- 3. REALTIME: remove user-private tables from the realtime publication
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.certificates; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.user_courses; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime DROP TABLE public.user_stats; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- 4. AVATARS STORAGE: drop broad public listing policy (public URL access still works).
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
