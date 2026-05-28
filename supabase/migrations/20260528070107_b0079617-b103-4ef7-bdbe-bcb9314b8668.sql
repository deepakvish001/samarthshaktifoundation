
-- Baseline: functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role)
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS public.app_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.user_roles WHERE user_id=_user_id LIMIT 1
$$;

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT, phone TEXT, avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT, instructor TEXT,
  duration_weeks INT, total_lessons INT, status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins manage courses" ON public.courses FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- assignments
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL, description TEXT, due_date TIMESTAMPTZ, status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.assignments TO authenticated;
GRANT ALL ON public.assignments TO service_role;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read assignments" ON public.assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage assignments" ON public.assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL,
  issued_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'issued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own certificates" ON public.certificates FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage certificates" ON public.certificates FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL, message TEXT, type TEXT, is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- user_courses
CREATE TABLE public.user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  progress INT DEFAULT 0, completed_lessons INT DEFAULT 0, status TEXT DEFAULT 'enrolled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_courses TO authenticated;
GRANT ALL ON public.user_courses TO service_role;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own enrollments" ON public.user_courses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_user_courses_updated_at BEFORE UPDATE ON public.user_courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- user_assignments
CREATE TABLE public.user_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', grade NUMERIC, feedback TEXT, submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_assignments TO authenticated;
GRANT ALL ON public.user_assignments TO service_role;
ALTER TABLE public.user_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own assignments" ON public.user_assignments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_user_assignments_updated_at BEFORE UPDATE ON public.user_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- user_stats
CREATE TABLE public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  total_courses INT DEFAULT 0, completed_courses INT DEFAULT 0,
  certificates_earned INT DEFAULT 0, total_study_hours INT DEFAULT 0,
  study_streak_days INT DEFAULT 0, last_activity TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_stats TO authenticated;
GRANT ALL ON public.user_stats TO service_role;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own stats" ON public.user_stats FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- franchise_certificates
CREATE TABLE public.franchise_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id TEXT NOT NULL, franchise_name TEXT NOT NULL,
  centre_head TEXT NOT NULL, certificate_number TEXT NOT NULL,
  certificate_type TEXT DEFAULT 'franchise',
  location TEXT NOT NULL, operating_area TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_from TIMESTAMPTZ NOT NULL, valid_to TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.franchise_certificates TO authenticated;
GRANT ALL ON public.franchise_certificates TO service_role;
ALTER TABLE public.franchise_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage franchise_certificates" ON public.franchise_certificates FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_franchise_certificates_updated_at BEFORE UPDATE ON public.franchise_certificates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- student_admit_cards
CREATE TABLE public.student_admit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL, student_name TEXT NOT NULL,
  roll_number TEXT NOT NULL, course_name TEXT NOT NULL,
  batch TEXT, fathers_name TEXT, mothers_name TEXT, pwd_status TEXT,
  exam_date TIMESTAMPTZ, exam_start_time TEXT, exam_duration TEXT,
  reporting_time TEXT, gate_closing_time TEXT,
  exam_center_code TEXT, exam_center_address TEXT,
  student_photo_url TEXT, status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_admit_cards TO authenticated;
GRANT ALL ON public.student_admit_cards TO service_role;
ALTER TABLE public.student_admit_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage student_admit_cards" ON public.student_admit_cards FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER update_student_admit_cards_updated_at BEFORE UPDATE ON public.student_admit_cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
