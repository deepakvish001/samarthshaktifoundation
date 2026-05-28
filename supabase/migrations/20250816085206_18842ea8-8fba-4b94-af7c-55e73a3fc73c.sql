-- Create student_verifications table for verification management
CREATE TABLE public.student_verifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state text NOT NULL,
  district text NOT NULL,
  center_code text NOT NULL,
  enrollment_no text NOT NULL UNIQUE,
  student_name text NOT NULL,
  father_name text NOT NULL,
  course_name text NOT NULL,
  rank_or_marks text,
  course_duration text,
  date_of_birth date,
  admission_date date,
  photo_url text,
  marksheet_url text,
  certificate_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by text,
  verification_date timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage student_verifications" 
ON public.student_verifications 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_student_verifications_updated_at
BEFORE UPDATE ON public.student_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add sample data for testing
INSERT INTO student_verifications (
  state, district, center_code, enrollment_no, student_name, father_name, 
  course_name, rank_or_marks, course_duration, date_of_birth, admission_date,
  status, notes
) VALUES
('Uttar Pradesh', 'Azamgarh', 'AZM001', 'ENR2024001', 'Priya Sharma', 'Rajesh Sharma', 'Advance Diploma in Computer Application (ADCA)', 'First Class with 85%', '1 Year', '2000-05-15', '2024-01-15', 'verified', 'Excellent academic performance'),
('Uttar Pradesh', 'Mau', 'MAU002', 'ENR2024002', 'Rahul Kumar', 'Suresh Kumar', 'Diploma in Computer Application (DCA)', 'Second Class with 75%', '6 Months', '1999-08-22', '2024-02-01', 'pending', 'Documents under review'),
('Bihar', 'Patna', 'PAT001', 'ENR2024003', 'Anjali Gupta', 'Vinod Gupta', 'Post Graduate Diploma in Computer Application (PGDCA)', 'First Class with 90%', '1.5 Years', '1998-12-10', '2024-01-20', 'verified', 'Outstanding performance in programming'),
('Uttar Pradesh', 'Lucknow', 'LKO001', 'ENR2024004', 'Suresh Patel', 'Mohan Patel', 'Diploma in Computer Hardware and Networking', 'First Class with 88%', '8 Months', '2001-03-18', '2024-02-15', 'pending', 'Hardware practical assessment pending'),
('Rajasthan', 'Jaipur', 'JAI001', 'ENR2024005', 'Neha Singh', 'Arun Singh', 'Web Design & Development', 'First Class with 82%', '6 Months', '2000-11-25', '2024-03-01', 'verified', 'Excellent web development projects'),
('Madhya Pradesh', 'Bhopal', 'BHO001', 'ENR2024006', 'Vikash Yadav', 'Ram Yadav', 'Advance Diploma in Computer Application (ADCA)', 'Second Class with 78%', '1 Year', '1999-07-14', '2024-01-10', 'rejected', 'Incomplete documentation'),
('Haryana', 'Gurgaon', 'GUR001', 'ENR2024007', 'Pooja Verma', 'Ashok Verma', 'Diploma in Computer Application (DCA)', 'First Class with 86%', '6 Months', '2000-09-30', '2024-02-20', 'pending', 'Final exam results awaited'),
('Uttar Pradesh', 'Hardoi', 'HAR001', 'ENR2024008', 'Amit Mishra', 'Rakesh Mishra', 'Post Graduate Diploma in Computer Application (PGDCA)', 'First Class with 91%', '1.5 Years', '1997-04-12', '2024-01-25', 'verified', 'Research project completed successfully');