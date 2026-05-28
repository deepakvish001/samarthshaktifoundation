import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    if (!user) return;
    (async () => {
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
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">My Courses</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : enrollments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {enrollments.map((e) => (
              <Card key={e.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{e.course?.title || 'Course'}</CardTitle>
                    <Badge variant={e.status === 'completed' ? 'default' : 'secondary'}>{e.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {e.course?.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{e.course.description}</p>
                  )}
                  {e.course?.instructor && (
                    <p className="text-xs text-muted-foreground">Instructor: {e.course.instructor}</p>
                  )}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{e.progress || 0}%</span>
                    </div>
                    <Progress value={e.progress || 0} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {e.completed_lessons || 0} / {e.course?.total_lessons || 0} lessons completed
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;