-- Create class_fees table
CREATE TABLE public.class_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_type TEXT NOT NULL,
  board_university TEXT,
  course_name TEXT NOT NULL,
  student_cv TEXT,
  duration TEXT,
  fees_entry TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expense_entries table  
CREATE TABLE public.expense_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  expense_name TEXT NOT NULL,
  quantity TEXT NOT NULL,
  given_to TEXT NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alot_numbers table
CREATE TABLE public.alot_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  theory_max_marks TEXT,
  practical_max_marks TEXT,
  obtain_theory_marks TEXT,
  obtain_practical_marks TEXT,
  student_name TEXT,
  student_father_name TEXT,
  student_mother_name TEXT,
  course_examination_date TEXT,
  center_name TEXT,
  center_code TEXT,
  issue_date TEXT,
  place TEXT,
  student_photo_url TEXT,
  director_signature_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.class_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alot_numbers ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage class_fees" 
ON public.class_fees 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage expense_entries" 
ON public.expense_entries 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage alot_numbers" 
ON public.alot_numbers 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_class_fees_updated_at
BEFORE UPDATE ON public.class_fees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expense_entries_updated_at
BEFORE UPDATE ON public.expense_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alot_numbers_updated_at
BEFORE UPDATE ON public.alot_numbers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();