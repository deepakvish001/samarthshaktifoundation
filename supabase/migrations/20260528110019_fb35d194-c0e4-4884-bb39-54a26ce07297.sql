
-- 1. Extend student_profiles
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS student_id TEXT,
  ADD COLUMN IF NOT EXISTS father_name TEXT,
  ADD COLUMN IF NOT EXISTS mother_name TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS caste_category TEXT,
  ADD COLUMN IF NOT EXISTS registration_date DATE,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS district TEXT,
  ADD COLUMN IF NOT EXISTS pin_code TEXT,
  ADD COLUMN IF NOT EXISTS qualification TEXT,
  ADD COLUMN IF NOT EXISTS year_of_passing TEXT,
  ADD COLUMN IF NOT EXISTS aadhar_number TEXT,
  ADD COLUMN IF NOT EXISTS study_center TEXT,
  ADD COLUMN IF NOT EXISTS course_category TEXT,
  ADD COLUMN IF NOT EXISTS course_fees TEXT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS login_password TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS student_profiles_student_id_key
  ON public.student_profiles(student_id)
  WHERE student_id IS NOT NULL;

-- 2. Sequence for auto-generated SSF-YYYY-NNNN student ids
CREATE SEQUENCE IF NOT EXISTS public.student_id_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  next_num INT;
BEGIN
  next_num := nextval('public.student_id_seq');
  RETURN 'SSF-' || to_char(now(), 'YYYY') || '-' || lpad(next_num::text, 4, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_student_id() TO anon, authenticated, service_role;

-- 3. Lookup tables (Master pages)

-- study_centers
CREATE TABLE IF NOT EXISTS public.study_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.study_centers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.study_centers TO authenticated;
GRANT ALL ON public.study_centers TO service_role;
ALTER TABLE public.study_centers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read study_centers" ON public.study_centers FOR SELECT USING (true);
CREATE POLICY "Admins manage study_centers" ON public.study_centers FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER study_centers_updated_at BEFORE UPDATE ON public.study_centers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.study_centers (name, code) VALUES
  ('Azamgarh', 'AZM'),
  ('Mau', 'MAU'),
  ('Baliya', 'BLY')
ON CONFLICT (name) DO NOTHING;

-- titles
CREATE TABLE IF NOT EXISTS public.titles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.titles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.titles TO authenticated;
GRANT ALL ON public.titles TO service_role;
ALTER TABLE public.titles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read titles" ON public.titles FOR SELECT USING (true);
CREATE POLICY "Admins manage titles" ON public.titles FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER titles_updated_at BEFORE UPDATE ON public.titles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.titles (name, sort_order) VALUES
  ('Mr./श्री', 1),
  ('Mrs./श्रीमती', 2),
  ('Ms./सुश्री', 3)
ON CONFLICT (name) DO NOTHING;

-- genders
CREATE TABLE IF NOT EXISTS public.genders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.genders TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.genders TO authenticated;
GRANT ALL ON public.genders TO service_role;
ALTER TABLE public.genders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read genders" ON public.genders FOR SELECT USING (true);
CREATE POLICY "Admins manage genders" ON public.genders FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER genders_updated_at BEFORE UPDATE ON public.genders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.genders (name, sort_order) VALUES
  ('Male', 1), ('Female', 2), ('Other', 3)
ON CONFLICT (name) DO NOTHING;

-- caste_categories
CREATE TABLE IF NOT EXISTS public.caste_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.caste_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.caste_categories TO authenticated;
GRANT ALL ON public.caste_categories TO service_role;
ALTER TABLE public.caste_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read caste_categories" ON public.caste_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage caste_categories" ON public.caste_categories FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER caste_categories_updated_at BEFORE UPDATE ON public.caste_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.caste_categories (name, sort_order) VALUES
  ('General', 1), ('OBC', 2), ('SC', 3), ('ST', 4), ('EWS', 5)
ON CONFLICT (name) DO NOTHING;

-- qualifications
CREATE TABLE IF NOT EXISTS public.qualifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.qualifications TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.qualifications TO authenticated;
GRANT ALL ON public.qualifications TO service_role;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read qualifications" ON public.qualifications FOR SELECT USING (true);
CREATE POLICY "Admins manage qualifications" ON public.qualifications FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER qualifications_updated_at BEFORE UPDATE ON public.qualifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.qualifications (name, sort_order) VALUES
  ('Below 10th', 1),
  ('10th Pass', 2),
  ('12th Pass', 3),
  ('Diploma', 4),
  ('Graduate', 5),
  ('Post Graduate', 6),
  ('PhD', 7)
ON CONFLICT (name) DO NOTHING;
