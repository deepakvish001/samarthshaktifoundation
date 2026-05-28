-- Create fees_receipts table for fees management
CREATE TABLE public.fees_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_no TEXT NOT NULL,
  franchise_name TEXT NOT NULL,
  franchise_id TEXT NOT NULL,
  receipt_date DATE NOT NULL,
  course TEXT NOT NULL,
  student TEXT NOT NULL,
  student_id TEXT NOT NULL,
  total_fee NUMERIC NOT NULL,
  amount_paid NUMERIC NOT NULL,
  payment_details TEXT,
  amount_due NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fees_receipts ENABLE ROW LEVEL SECURITY;

-- Create policies for fees_receipts
CREATE POLICY "Admins can manage fees_receipts" 
ON public.fees_receipts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create franchise_registrations table
CREATE TABLE public.franchise_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Institute Information
  franchise_type TEXT NOT NULL,
  institute_sort_name TEXT NOT NULL,
  institute_full_name TEXT NOT NULL,
  year_of_establishment TEXT NOT NULL,
  postal_address TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  city_town_village TEXT,
  state_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  state_sort_name TEXT NOT NULL,
  district_sort_name TEXT NOT NULL,
  date_of_registration DATE NOT NULL,
  mobile_country_code TEXT NOT NULL DEFAULT '+91',
  mobile_number TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Centre Head Information
  centre_head_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  head_state TEXT NOT NULL,
  head_district TEXT NOT NULL,
  head_postal_address TEXT NOT NULL,
  head_pin_code TEXT NOT NULL,
  head_mobile_number TEXT NOT NULL,
  head_email TEXT NOT NULL,
  head_date_of_birth DATE,
  gender TEXT,
  educational_qualification TEXT,
  experience TEXT,
  marital_status TEXT,
  religion TEXT,
  
  -- Infrastructure & Connectivity
  infrastructure_data JSONB,
  internet_connectivity TEXT,
  connectivity_type TEXT,
  internet_speed TEXT,
  number_of_servers TEXT,
  server_remark TEXT,
  operating_system TEXT,
  os_remark TEXT,
  antivirus TEXT,
  antivirus_remark TEXT,
  printers_scanner TEXT,
  printer_remark TEXT,
  power_backup TEXT,
  power_remark TEXT,
  
  -- Faculty Details
  type_of_faculties TEXT,
  number_of_faculties TEXT,
  faculty_indicate TEXT,
  
  -- Documents
  documents JSONB,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending',
  approval_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.franchise_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for franchise_registrations
CREATE POLICY "Admins can manage franchise_registrations" 
ON public.franchise_registrations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_fees_receipts_updated_at
BEFORE UPDATE ON public.fees_receipts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchise_registrations_updated_at
BEFORE UPDATE ON public.franchise_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();