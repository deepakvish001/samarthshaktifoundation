
CREATE TABLE IF NOT EXISTS public.certificate_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  issue_date DATE NOT NULL,
  completion_date DATE,
  grade TEXT,
  certificate_type TEXT NOT NULL DEFAULT 'course_completion',
  status TEXT NOT NULL DEFAULT 'active',
  certificate_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificate_management TO authenticated;
GRANT ALL ON public.certificate_management TO service_role;
ALTER TABLE public.certificate_management ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage certificate_management" ON public.certificate_management FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.marksheet_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  examination_date DATE NOT NULL,
  total_marks INTEGER NOT NULL,
  obtained_marks INTEGER NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  grade TEXT NOT NULL,
  result_status TEXT NOT NULL DEFAULT 'pass',
  marksheet_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.marksheet_management TO authenticated;
GRANT ALL ON public.marksheet_management TO service_role;
ALTER TABLE public.marksheet_management ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage marksheet_management" ON public.marksheet_management FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.attendance_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  attendance_date DATE NOT NULL,
  status TEXT NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'theory',
  remarks TEXT,
  marked_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance_management TO authenticated;
GRANT ALL ON public.attendance_management TO service_role;
ALTER TABLE public.attendance_management ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage attendance_management" ON public.attendance_management FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.payment_modes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mode_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  processing_fee NUMERIC(10,2) DEFAULT 0,
  gateway_details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_modes TO authenticated;
GRANT ALL ON public.payment_modes TO service_role;
ALTER TABLE public.payment_modes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payment_modes" ON public.payment_modes FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  designation TEXT,
  department TEXT,
  profile_image_url TEXT,
  bio TEXT,
  permissions JSONB DEFAULT '{}',
  last_login TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_profiles TO authenticated;
GRANT ALL ON public.admin_profiles TO service_role;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage admin_profiles" ON public.admin_profiles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_certificate_management_updated_at BEFORE UPDATE ON public.certificate_management FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marksheet_management_updated_at BEFORE UPDATE ON public.marksheet_management FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendance_management_updated_at BEFORE UPDATE ON public.attendance_management FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_modes_updated_at BEFORE UPDATE ON public.payment_modes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON public.admin_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
