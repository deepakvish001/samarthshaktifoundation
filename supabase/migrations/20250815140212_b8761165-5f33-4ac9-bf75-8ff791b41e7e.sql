-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL UNIQUE,
  employee_password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  father_name TEXT,
  contact_no TEXT NOT NULL,
  email_id TEXT NOT NULL UNIQUE,
  country TEXT DEFAULT 'India',
  state TEXT,
  district TEXT,
  address TEXT,
  other_details TEXT,
  pincode TEXT,
  salary TEXT,
  registration_date DATE,
  photo_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_master table 
CREATE TABLE public.course_master (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  course_sort_name TEXT NOT NULL,
  duration TEXT NOT NULL,
  fees TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_master ENABLE ROW LEVEL SECURITY;

-- Create policies for employees
CREATE POLICY "Admins can manage employees" 
ON public.employees 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for course_master
CREATE POLICY "Admins can manage course_master" 
ON public.course_master 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active courses" 
ON public.course_master 
FOR SELECT 
USING (status = 'active');

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_master_updated_at
  BEFORE UPDATE ON public.course_master
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable real-time for new tables
ALTER TABLE public.employees REPLICA IDENTITY FULL;
ALTER TABLE public.course_master REPLICA IDENTITY FULL;

-- Add to supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.employees;
ALTER PUBLICATION supabase_realtime ADD TABLE public.course_master;