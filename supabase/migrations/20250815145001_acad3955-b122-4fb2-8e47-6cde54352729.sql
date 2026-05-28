-- Create student_data table
CREATE TABLE public.student_data (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  details text NOT NULL,
  course_category text NOT NULL,
  photo_url text,
  publish_date text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.student_data ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage student_data" 
ON public.student_data 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_data_updated_at
BEFORE UPDATE ON public.student_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();