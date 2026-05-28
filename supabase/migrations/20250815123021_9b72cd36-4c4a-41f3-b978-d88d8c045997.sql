-- Create student_profiles table for admin management
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  course_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  city TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for student profiles
CREATE POLICY "Admins can manage all student profiles" 
ON public.student_profiles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own student profile" 
ON public.student_profiles 
FOR SELECT 
USING (email = auth.email());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_profiles_updated_at
BEFORE UPDATE ON public.student_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_student_profiles_email ON public.student_profiles(email);
CREATE INDEX idx_student_profiles_status ON public.student_profiles(status);
CREATE INDEX idx_student_profiles_course ON public.student_profiles(course_name);
CREATE INDEX idx_student_profiles_created_at ON public.student_profiles(created_at);

-- Insert some sample data for testing
INSERT INTO public.student_profiles (full_name, email, phone, course_name, city, state, status) VALUES
('Raj Kumar', 'raj.kumar@example.com', '+91-9876543210', 'ADCA', 'Azamgarh', 'Uttar Pradesh', 'active'),
('Priya Sharma', 'priya.sharma@example.com', '+91-9876543211', 'PGDCA', 'Mau', 'Uttar Pradesh', 'active'),
('Amit Singh', 'amit.singh@example.com', '+91-9876543212', 'DCHN', 'Baliya', 'Uttar Pradesh', 'inactive'),
('Sunita Devi', 'sunita.devi@example.com', '+91-9876543213', 'DTP', 'Azamgarh', 'Uttar Pradesh', 'active'),
('Rohit Gupta', 'rohit.gupta@example.com', '+91-9876543214', 'ADCA', 'Mau', 'Uttar Pradesh', 'suspended');