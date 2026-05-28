-- Create franchise_uploads table
CREATE TABLE public.franchise_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  center_code TEXT NOT NULL,
  message TEXT NOT NULL,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  file_name TEXT,
  file_url TEXT,
  upload_type TEXT NOT NULL DEFAULT 'document',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.franchise_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for franchise uploads
CREATE POLICY "Admins can manage franchise_uploads" 
ON public.franchise_uploads 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_franchise_uploads_updated_at
  BEFORE UPDATE ON public.franchise_uploads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add some indexes for better performance
CREATE INDEX idx_franchise_uploads_center_code ON public.franchise_uploads(center_code);
CREATE INDEX idx_franchise_uploads_status ON public.franchise_uploads(status);
CREATE INDEX idx_franchise_uploads_upload_type ON public.franchise_uploads(upload_type);
CREATE INDEX idx_franchise_uploads_upload_date ON public.franchise_uploads(upload_date DESC);