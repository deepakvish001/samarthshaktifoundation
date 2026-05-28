import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, Clock, Flame, Settings as SettingsIcon, Mail, Phone, Shield, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';
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
    { label: 'Enrolled', value: stats?.total_courses ?? 0, icon: BookOpen, tint: 'from-blue-500/20 to-blue-500/0 text-blue-500' },
    { label: 'Completed', value: stats?.completed_courses ?? 0, icon: CheckCircle2, tint: 'from-emerald-500/20 to-emerald-500/0 text-emerald-500' },
    { label: 'Certificates', value: stats?.certificates_earned ?? 0, icon: Award, tint: 'from-amber-500/20 to-amber-500/0 text-amber-500' },
    { label: 'Study Hours', value: stats?.total_study_hours ?? 0, icon: Clock, tint: 'from-violet-500/20 to-violet-500/0 text-violet-500' },
    { label: 'Day Streak', value: stats?.study_streak_days ?? 0, icon: Flame, tint: 'from-orange-500/20 to-orange-500/0 text-orange-500' },
  ];

  const completionPct = stats && stats.total_courses
    ? Math.round((stats.completed_courses / stats.total_courses) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Hero header */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-32 sm:h-40 bg-gradient-to-br from-primary via-primary/80 to-accent relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary-foreground)/0.15),transparent_50%)]" />
            <Button variant="secondary" size="sm" asChild className="absolute top-4 right-4 backdrop-blur-sm bg-background/80">
              <Link to="/settings"><SettingsIcon className="h-4 w-4 mr-2" /> Edit Profile</Link>
            </Button>
          </div>
          <CardContent className="pt-0 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 ring-4 ring-background shadow-xl">
                <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 sm:pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold truncate">{displayName}</h1>
                  {userRole && (
                    <Badge variant="secondary" className="capitalize gap-1">
                      <Shield className="h-3 w-3" /> {userRole.role}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Mail className="h-3.5 w-3.5" /> {user?.email}
                </p>
              </div>
            </div>

            {/* Completion progress */}
            <div className="mt-6 p-4 rounded-lg bg-muted/40 border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 text-primary" /> Course completion
                </div>
                <span className="text-sm font-semibold">{completionPct}%</span>
              </div>
              <Progress value={completionPct} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {stats?.completed_courses ?? 0} of {stats?.total_courses ?? 0} courses completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map((s) => (
            <Card key={s.label} className="relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.tint} opacity-50`} />
              <CardContent className="p-4 relative">
                <s.icon className={`h-5 w-5 mb-3 ${s.tint.split(' ').pop()}`} />
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personal info + quick links */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-muted"><Shield className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">Full Name</dt>
                    <dd className="font-medium truncate">{profile?.full_name || '—'}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-muted"><Mail className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">Email</dt>
                    <dd className="font-medium truncate">{user?.email}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-muted"><Phone className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">Phone</dt>
                    <dd className="font-medium truncate">{profile?.phone || '—'}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-muted"><Award className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">Role</dt>
                    <dd className="font-medium capitalize">{userRole?.role || 'user'}</dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Link to="/my-courses" className="group block">
              <Card className="hover:border-primary/40 hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary"><BookOpen className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">My Courses</p>
                    <p className="text-xs text-muted-foreground">Track your learning</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
                </CardContent>
              </Card>
            </Link>
            <Link to="/my-certificates" className="group block">
              <Card className="hover:border-primary/40 hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600"><Award className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Certificates</p>
                    <p className="text-xs text-muted-foreground">Your achievements</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;