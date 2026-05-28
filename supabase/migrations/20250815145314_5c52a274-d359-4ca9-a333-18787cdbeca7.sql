-- Create opening_balances table
CREATE TABLE public.opening_balances (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  amount decimal(15,2) NOT NULL,
  entry_date date NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create day_book_entries table
CREATE TABLE public.day_book_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name text NOT NULL,
  amount decimal(15,2) NOT NULL,
  entry_date date NOT NULL,
  description text,
  transaction_type text NOT NULL DEFAULT 'expense',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.opening_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_book_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage opening_balances" 
ON public.opening_balances 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage day_book_entries" 
ON public.day_book_entries 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_opening_balances_updated_at
BEFORE UPDATE ON public.opening_balances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_day_book_entries_updated_at
BEFORE UPDATE ON public.day_book_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();