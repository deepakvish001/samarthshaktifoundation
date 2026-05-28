-- Enable real-time for existing tables (only if not already enabled)
ALTER TABLE public.head_offices REPLICA IDENTITY FULL;
ALTER TABLE public.student_profiles REPLICA IDENTITY FULL;
ALTER TABLE public.assignments REPLICA IDENTITY FULL;
ALTER TABLE public.certificates REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.user_courses REPLICA IDENTITY FULL;
ALTER TABLE public.user_assignments REPLICA IDENTITY FULL;
ALTER TABLE public.user_stats REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;

-- Add tables to real-time publication (only if not already added)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.head_offices;
    EXCEPTION
        WHEN duplicate_object THEN
            NULL; -- Table already in publication
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.student_profiles;
    EXCEPTION
        WHEN duplicate_object THEN
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;
    EXCEPTION
        WHEN duplicate_object THEN
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;
    EXCEPTION
        WHEN duplicate_object THEN
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    EXCEPTION
        WHEN duplicate_object THEN
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_courses;
    EXCEPTION
        WHEN duplicate_object THEN
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_assignments;
    EXCEPTION
        WHEN duplicate_object THEN
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
    EXCEPTION
        WHEN duplicate_object THEN
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    EXCEPTION
        WHEN duplicate_object THEN
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;
    EXCEPTION
        WHEN duplicate_object THEN
            NULL;
    END;
END $$;