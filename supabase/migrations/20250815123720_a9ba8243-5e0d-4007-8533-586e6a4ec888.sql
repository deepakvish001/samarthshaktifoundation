-- Create head_offices table for admin management
CREATE TABLE public.head_offices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  website TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  is_primary BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.head_offices ENABLE ROW LEVEL SECURITY;

-- Create policies for head offices
CREATE POLICY "Admins can manage all head offices" 
ON public.head_offices 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view active head offices" 
ON public.head_offices 
FOR SELECT 
USING (status = 'active');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_head_offices_updated_at
BEFORE UPDATE ON public.head_offices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_head_offices_status ON public.head_offices(status);
CREATE INDEX idx_head_offices_email ON public.head_offices(email);
CREATE INDEX idx_head_offices_primary ON public.head_offices(is_primary);
CREATE INDEX idx_head_offices_created_at ON public.head_offices(created_at);

-- Insert the existing head office data
INSERT INTO public.head_offices (
  name, 
  address, 
  phone, 
  email, 
  website,
  city,
  state,
  postal_code,
  is_primary,
  status
) VALUES (
  'Bina Soft Edu Head Office',
  'Near Union Bank Of India, Vill & Post - Bilariyaganj, Dist- Azamgarh, Uttar Pradesh - 276121',
  '7007939906',
  'infobinasoft@gmail.com',
  'www.binasoftedu.org.in',
  'Azamgarh',
  'Uttar Pradesh',
  '276121',
  true,
  'active'
);