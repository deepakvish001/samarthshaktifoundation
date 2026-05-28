import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Award, Clock, Flame, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  total_courses: number;
  completed_courses: number;
  certificates_earned: number;
  total_study_hours: number;
  study_streak_days: number;
}

const Profile = () => {
  const { user, profile, userRole } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await (supabase as any)
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setStats(data);
      } else {
        // compute from enrollments + certificates as fallback
        const [{ count: totalCourses }, { count: completed }, { count: certs }] = await Promise.all([
          (supabase as any).from('user_courses').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          (supabase as any).from('user_courses').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
          (supabase as any).from('certificates').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        ]);
        setStats({
          total_courses: totalCourses || 0,
          completed_courses: completed || 0,
          certificates_earned: certs || 0,
          total_study_hours: 0,
          study_streak_days: 0,
        });
      }
    })();
  }, [user]);

  const statCards = [
    { label: 'Enrolled Courses', value: stats?.total_courses ?? 0, icon: BookOpen },
    { label: 'Completed', value: stats?.completed_courses ?? 0, icon: Award },
    { label: 'Certificates', value: stats?.certificates_earned ?? 0, icon: Award },
    { label: 'Study Hours', value: stats?.total_study_hours ?? 0, icon: Clock },
    { label: 'Streak (days)', value: stats?.study_streak_days ?? 0, icon: Flame },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Profile</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/settings"><SettingsIcon className="h-4 w-4 mr-2" /> Edit</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{displayName}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                {userRole && <Badge className="mt-2 capitalize">{userRole.role}</Badge>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{profile?.full_name || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{profile?.phone || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{userRole?.role || 'user'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <s.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Button asChild variant="outline" className="h-auto py-4 justify-start">
            <Link to="/my-courses"><BookOpen className="h-5 w-5 mr-3" /> View My Courses</Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 justify-start">
            <Link to="/my-certificates"><Award className="h-5 w-5 mr-3" /> View My Certificates</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;