-- Create certificate management table
CREATE TABLE public.certificate_management (
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create marksheet management table
CREATE TABLE public.marksheet_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  examination_date DATE NOT NULL,
  total_marks INTEGER NOT NULL,
  obtained_marks INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  grade TEXT NOT NULL,
  result_status TEXT NOT NULL DEFAULT 'pass',
  marksheet_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance management table
CREATE TABLE public.attendance_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  attendance_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  session_type TEXT NOT NULL DEFAULT 'theory',
  remarks TEXT,
  marked_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment modes table
CREATE TABLE public.payment_modes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mode_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  processing_fee DECIMAL(10,2) DEFAULT 0,
  gateway_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin profile table
CREATE TABLE public.admin_profiles (
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
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certificate_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marksheet_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins
CREATE POLICY "Admins can manage certificate_management" 
ON public.certificate_management 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage marksheet_management" 
ON public.marksheet_management 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage attendance_management" 
ON public.attendance_management 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage payment_modes" 
ON public.payment_modes 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage admin_profiles" 
ON public.admin_profiles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_certificate_management_updated_at
BEFORE UPDATE ON public.certificate_management
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marksheet_management_updated_at
BEFORE UPDATE ON public.marksheet_management
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_management_updated_at
BEFORE UPDATE ON public.attendance_management
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_modes_updated_at
BEFORE UPDATE ON public.payment_modes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_certificate_management_student_id ON public.certificate_management(student_id);
CREATE INDEX idx_marksheet_management_student_id ON public.marksheet_management(student_id);
CREATE INDEX idx_attendance_management_student_id ON public.attendance_management(student_id);
CREATE INDEX idx_attendance_management_date ON public.attendance_management(attendance_date);
CREATE INDEX idx_admin_profiles_user_id ON public.admin_profiles(user_id);