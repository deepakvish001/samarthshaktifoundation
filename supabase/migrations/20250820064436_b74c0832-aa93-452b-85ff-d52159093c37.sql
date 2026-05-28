-- Create franchise_support table
CREATE TABLE public.franchise_support (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchise_code TEXT NOT NULL,
  franchise_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  support_type TEXT NOT NULL DEFAULT 'technical',
  priority TEXT NOT NULL DEFAULT 'medium',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  resolved_date DATE,
  assigned_to TEXT,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.franchise_support ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for franchise support
CREATE POLICY "Admins can manage franchise_support" 
ON public.franchise_support 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_franchise_support_updated_at
  BEFORE UPDATE ON public.franchise_support
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_franchise_support_franchise_code ON public.franchise_support(franchise_code);
CREATE INDEX idx_franchise_support_status ON public.franchise_support(status);
CREATE INDEX idx_franchise_support_priority ON public.franchise_support(priority);
CREATE INDEX idx_franchise_support_support_type ON public.franchise_support(support_type);
CREATE INDEX idx_franchise_support_created_date ON public.franchise_support(created_date DESC);

-- Add check constraints for valid values
ALTER TABLE public.franchise_support 
ADD CONSTRAINT check_support_type 
CHECK (support_type IN ('technical', 'billing', 'training', 'general', 'infrastructure'));

ALTER TABLE public.franchise_support 
ADD CONSTRAINT check_priority 
CHECK (priority IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE public.franchise_support 
ADD CONSTRAINT check_status 
CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'));