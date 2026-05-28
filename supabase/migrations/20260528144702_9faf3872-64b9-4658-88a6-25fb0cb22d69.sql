ALTER TABLE public.alot_numbers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alot_numbers;