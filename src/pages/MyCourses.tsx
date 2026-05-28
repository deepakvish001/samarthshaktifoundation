import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Loader2, Search, Clock, GraduationCap, PlayCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Enrollment {
  id: string;
  status: string | null;
  progress: number | null;
  completed_lessons: number | null;
  enrolled_at: string;
  course_id: string;
  course?: {
    title: string;
    description: string | null;
    instructor: string | null;
    duration_weeks: number | null;
    total_lessons: number | null;
  } | null;
}

const MyCourses = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const load = useCallback(async () => {
    if (!user) return;
    const { data: enrolls } = await (supabase as any)
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false });

    const list: Enrollment[] = enrolls || [];
    if (list.length) {
      const ids = list.map((e) => e.course_id);
      const { data: courses } = await (supabase as any)
        .from('courses')
        .select('id, title, description, instructor, duration_weeks, total_lessons')
        .in('id', ids);
      const map = new Map<string, any>((courses || []).map((c: any) => [c.id, c]));
      list.forEach((e) => (e.course = (map.get(e.course_id) as Enrollment['course']) || null));
    }
    setEnrollments(list);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
    if (!user) return;
    const channel = supabase
      .channel(`user_courses-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_courses', filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, load]);

  const counts = {
    all: enrollments.length,
    in_progress: enrollments.filter((e) => e.status !== 'completed').length,
    completed: enrollments.filter((e) => e.status === 'completed').length,
  };

  const filtered = enrollments.filter((e) => {
    const matchQ = !query || (e.course?.title || '').toLowerCase().includes(query.toLowerCase());
    const matchF =
      filter === 'all' ||
      (filter === 'completed' && e.status === 'completed') ||
      (filter === 'in_progress' && e.status !== 'completed');
    return matchQ && matchF;
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" /> My Courses
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Continue learning where you left off</p>
          </div>
          <Button asChild>
            <Link to="/courses">Browse all courses <ArrowRight className="h-4 w-4 ml-2" /></Link>
          </Button>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All <span className="ml-1.5 text-xs opacity-60">{counts.all}</span></TabsTrigger>
              <TabsTrigger value="in_progress">In Progress <span className="ml-1.5 text-xs opacity-60">{counts.in_progress}</span></TabsTrigger>
              <TabsTrigger value="completed">Completed <span className="ml-1.5 text-xs opacity-60">{counts.completed}</span></TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative flex-1 max-w-sm sm:ml-auto">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses..." className="pl-9" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">
                {enrollments.length === 0 ? 'Start your learning journey' : 'No courses match your filters'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                {enrollments.length === 0
                  ? 'Enroll in your first course to track progress and earn certificates.'
                  : 'Try adjusting your search or filter.'}
              </p>
              {enrollments.length === 0 && (
                <Button asChild className="mt-5">
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => {
              const isDone = e.status === 'completed';
              const pct = e.progress || 0;
              return (
                <Card key={e.id} className="group overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                  <div className="h-24 bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 relative flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-primary/40" />
                    <Badge
                      variant={isDone ? 'default' : 'secondary'}
                      className="absolute top-3 right-3 gap-1 capitalize"
                    >
                      {isDone ? <CheckCircle2 className="h-3 w-3" /> : <PlayCircle className="h-3 w-3" />}
                      {e.status || 'enrolled'}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base line-clamp-2 leading-snug">{e.course?.title || 'Course'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 flex-1 flex flex-col">
                    {e.course?.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{e.course.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {e.course?.instructor && <span className="truncate">By {e.course.instructor}</span>}
                      {e.course?.duration_weeks && (
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {e.course.duration_weeks}w</span>
                      )}
                    </div>
                    <div className="mt-auto pt-2">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">
                          {e.completed_lessons || 0} / {e.course?.total_lessons || 0} lessons
                        </span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                      <Button variant={isDone ? 'outline' : 'default'} size="sm" className="w-full mt-3">
                        {isDone ? 'Review course' : pct > 0 ? 'Continue' : 'Start learning'}
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;