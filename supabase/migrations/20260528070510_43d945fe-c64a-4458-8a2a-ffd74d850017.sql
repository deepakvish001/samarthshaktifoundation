
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT,
  course_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  enrollment_date TIMESTAMPTZ DEFAULT now(),
  city TEXT, state TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_profiles TO authenticated;
GRANT ALL ON public.student_profiles TO service_role;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all student profiles" ON public.student_profiles FOR ALL USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Users can view their own student profile" ON public.student_profiles FOR SELECT USING (email = auth.email());
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.head_offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT, address TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
  website TEXT, city TEXT, state TEXT, postal_code TEXT, country TEXT DEFAULT 'India',
  is_primary BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.head_offices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.head_offices TO authenticated;
GRANT ALL ON public.head_offices TO service_role;
ALTER TABLE public.head_offices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all head offices" ON public.head_offices FOR ALL USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Users can view active head offices" ON public.head_offices FOR SELECT USING (status='active');
CREATE TRIGGER update_head_offices_updated_at BEFORE UPDATE ON public.head_offices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.head_offices (name,address,phone,email,website,city,state,postal_code,is_primary,status)
VALUES ('Bina Soft Edu Head Office','Near Union Bank Of India, Vill & Post - Bilariyaganj, Dist- Azamgarh, Uttar Pradesh - 276121','7007939906','infobinasoft@gmail.com','www.binasoftedu.org.in','Azamgarh','Uttar Pradesh','276121',true,'active');

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['head_offices','student_profiles','courses','assignments','certificates','notifications','user_courses','user_assignments','user_stats','profiles','user_roles'] LOOP
    EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL', t);
    BEGIN EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t); EXCEPTION WHEN duplicate_object THEN NULL; END;
  END LOOP;
END $$;

CREATE TABLE public.menu_content (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), course TEXT NOT NULL, upload_file_title TEXT NOT NULL, course_file TEXT, date TEXT NOT NULL, notes TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.photo_gallery (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, image_url TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.bank_details (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), bank_name TEXT NOT NULL, account_number TEXT NOT NULL, branch_name TEXT NOT NULL, ifsc_code TEXT NOT NULL, micr_code TEXT NOT NULL, bank_photo_url TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.state_master (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), city_id INTEGER NOT NULL, city_name TEXT NOT NULL, created_date TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.district_master (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), site_id INTEGER NOT NULL, city_id INTEGER NOT NULL, site_name TEXT NOT NULL, created_date TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.course_categories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), category_id INTEGER NOT NULL, course_category TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.news (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), news_id INTEGER NOT NULL, news_title TEXT NOT NULL, news_description TEXT NOT NULL, news_date TEXT NOT NULL, photo TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.visions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), content TEXT NOT NULL, image TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.missions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), content TEXT NOT NULL, image TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.director_messages (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), message TEXT NOT NULL, photo TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.contact_us (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.enquiries (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, state TEXT NOT NULL, city TEXT, organization TEXT, address TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['menu_content','photo_gallery','bank_details','state_master','district_master','course_categories','news','visions','missions','director_messages','contact_us','enquiries'] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin''))', 'Admins manage ' || t, t);
    EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t, t);
    EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL', t);
    BEGIN EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t); EXCEPTION WHEN duplicate_object THEN NULL; END;
  END LOOP;
END $$;

CREATE POLICY "Anyone can submit contact" ON public.contact_us FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read visions" ON public.visions FOR SELECT USING (true);
CREATE POLICY "Public read missions" ON public.missions FOR SELECT USING (true);
CREATE POLICY "Public read director_messages" ON public.director_messages FOR SELECT USING (true);
CREATE POLICY "Public read photo_gallery" ON public.photo_gallery FOR SELECT USING (true);
CREATE POLICY "Public read bank_details" ON public.bank_details FOR SELECT USING (true);
CREATE POLICY "Public read state_master" ON public.state_master FOR SELECT USING (true);
CREATE POLICY "Public read district_master" ON public.district_master FOR SELECT USING (true);
CREATE POLICY "Public read course_categories" ON public.course_categories FOR SELECT USING (true);
CREATE POLICY "Public read menu_content" ON public.menu_content FOR SELECT USING (true);

CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT NOT NULL UNIQUE, employee_password TEXT NOT NULL,
  full_name TEXT NOT NULL, father_name TEXT, contact_no TEXT NOT NULL,
  email_id TEXT NOT NULL UNIQUE, country TEXT DEFAULT 'India', state TEXT, district TEXT,
  address TEXT, other_details TEXT, pincode TEXT, salary TEXT,
  registration_date DATE, photo_url TEXT, status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage employees" ON public.employees FOR ALL USING (has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.employees REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.employees;

CREATE TABLE public.course_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name TEXT NOT NULL, course_sort_name TEXT NOT NULL,
  duration TEXT NOT NULL, fees TEXT NOT NULL, category TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_master TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_master TO authenticated;
GRANT ALL ON public.course_master TO service_role;
ALTER TABLE public.course_master ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage course_master" ON public.course_master FOR ALL USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Anyone can view active courses" ON public.course_master FOR SELECT USING (status='active');
CREATE TRIGGER update_course_master_updated_at BEFORE UPDATE ON public.course_master FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.course_master REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.course_master;

CREATE TABLE public.competition_courses (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL, date TEXT NOT NULL, file TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.expense_master (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), service_name TEXT NOT NULL, description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.course_subjects (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), course_name TEXT NOT NULL, semester_year TEXT NOT NULL, subject TEXT NOT NULL, theory_marks TEXT NOT NULL, practical_marks TEXT NOT NULL, description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.videos (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), label TEXT NOT NULL, video_url TEXT, file_name TEXT, file_size INTEGER, file_type TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.class_fees (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), course_type TEXT NOT NULL, board_university TEXT, course_name TEXT NOT NULL, student_cv TEXT, duration TEXT, fees_entry TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.expense_entries (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), service_name TEXT NOT NULL, expense_name TEXT NOT NULL, quantity TEXT NOT NULL, given_to TEXT NOT NULL, description TEXT, expense_date DATE NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.alot_numbers (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), student_id TEXT NOT NULL, course_name TEXT NOT NULL, theory_max_marks TEXT, practical_max_marks TEXT, obtain_theory_marks TEXT, obtain_practical_marks TEXT, student_name TEXT, student_father_name TEXT, student_mother_name TEXT, course_examination_date TEXT, center_name TEXT, center_code TEXT, issue_date TEXT, place TEXT, student_photo_url TEXT, director_signature_url TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.student_data (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, details TEXT NOT NULL, course_category TEXT NOT NULL, photo_url TEXT, publish_date TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.opening_balances (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), amount DECIMAL(15,2) NOT NULL, entry_date DATE NOT NULL, description TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.day_book_entries (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), service_name TEXT NOT NULL, amount DECIMAL(15,2) NOT NULL, entry_date DATE NOT NULL, description TEXT, transaction_type TEXT NOT NULL DEFAULT 'expense', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE public.fees_receipts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), receipt_no TEXT NOT NULL, franchise_name TEXT NOT NULL, franchise_id TEXT NOT NULL, receipt_date DATE NOT NULL, course TEXT NOT NULL, student TEXT NOT NULL, student_id TEXT NOT NULL, total_fee NUMERIC NOT NULL, amount_paid NUMERIC NOT NULL, payment_details TEXT, amount_due NUMERIC NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE TABLE public.franchise_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_type TEXT NOT NULL, institute_sort_name TEXT NOT NULL, institute_full_name TEXT NOT NULL,
  year_of_establishment TEXT NOT NULL, postal_address TEXT NOT NULL, pin_code TEXT NOT NULL,
  city_town_village TEXT, state_name TEXT NOT NULL, district_name TEXT NOT NULL,
  state_sort_name TEXT NOT NULL, district_sort_name TEXT NOT NULL, date_of_registration DATE NOT NULL,
  mobile_country_code TEXT NOT NULL DEFAULT '+91', mobile_number TEXT NOT NULL, email TEXT NOT NULL,
  centre_head_name TEXT NOT NULL, designation TEXT NOT NULL, head_state TEXT NOT NULL,
  head_district TEXT NOT NULL, head_postal_address TEXT NOT NULL, head_pin_code TEXT NOT NULL,
  head_mobile_number TEXT NOT NULL, head_email TEXT NOT NULL, head_date_of_birth DATE,
  gender TEXT, educational_qualification TEXT, experience TEXT, marital_status TEXT, religion TEXT,
  infrastructure_data JSONB, internet_connectivity TEXT, connectivity_type TEXT, internet_speed TEXT,
  number_of_servers TEXT, server_remark TEXT, operating_system TEXT, os_remark TEXT,
  antivirus TEXT, antivirus_remark TEXT, printers_scanner TEXT, printer_remark TEXT,
  power_backup TEXT, power_remark TEXT, type_of_faculties TEXT, number_of_faculties TEXT,
  faculty_indicate TEXT, documents JSONB,
  status TEXT NOT NULL DEFAULT 'pending', approval_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['competition_courses','expense_master','course_subjects','videos','class_fees','expense_entries','alot_numbers','student_data','opening_balances','day_book_entries','fees_receipts','franchise_registrations'] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL USING (has_role(auth.uid(), ''admin''::app_role))', 'Admins manage ' || t, t);
    EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t, t);
  END LOOP;
END $$;

CREATE POLICY "Public read competition_courses" ON public.competition_courses FOR SELECT USING (true);
CREATE POLICY "Public read videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public read student_data" ON public.student_data FOR SELECT USING (true);
CREATE POLICY "Public read course_subjects" ON public.course_subjects FOR SELECT USING (true);
GRANT SELECT ON public.competition_courses, public.videos, public.student_data, public.course_subjects TO anon;
