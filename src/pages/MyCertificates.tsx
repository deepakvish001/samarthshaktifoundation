import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Award, Loader2, Download, Search, Share2, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Certificate {
  id: string;
  certificate_number: string;
  course_id: string;
  issued_date: string;
  status: string | null;
  course_title?: string | null;
}

const MyCertificates = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from('certificates')
      .select('*')
      .eq('user_id', user.id)
      .order('issued_date', { ascending: false });

    const list: Certificate[] = data || [];
    if (list.length) {
      const ids = list.map((c) => c.course_id);
      const { data: courses } = await (supabase as any)
        .from('courses')
        .select('id, title')
        .in('id', ids);
      const map = new Map<string, any>((courses || []).map((c: any) => [c.id, c.title]));
      list.forEach((c) => (c.course_title = (map.get(c.course_id) as string) || null));
    }
    setCerts(list);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
    if (!user) return;
    const channel = supabase
      .channel(`certificates-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'certificates', filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, load]);

  const handleShare = async (c: Certificate) => {
    const text = `I earned a certificate in ${c.course_title || 'a course'}! Certificate No: ${c.certificate_number}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'My Certificate', text }); } catch {}
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  const filtered = certs.filter((c) =>
    !query || (c.course_title || '').toLowerCase().includes(query.toLowerCase()) ||
    c.certificate_number.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Award className="h-7 w-7 text-amber-500" /> My Certificates
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {certs.length} {certs.length === 1 ? 'achievement' : 'achievements'} earned
            </p>
          </div>
          {certs.length > 0 && (
            <div className="relative max-w-xs w-full">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search certificates..." className="pl-9" />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : certs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="font-semibold text-lg">No certificates yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Complete a course to earn your first certificate. Your achievements will appear here.
              </p>
              <Button asChild className="mt-5">
                <Link to="/my-courses">View My Courses <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <Card key={c.id} className="group overflow-hidden hover:shadow-xl transition-all">
                {/* Decorative certificate face */}
                <div className="relative h-44 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-orange-950/40 border-b">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.08),transparent_60%)]" />
                  {/* Corner ornaments */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500/40 rounded-tl-md" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500/40 rounded-tr-md" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500/40 rounded-bl-md" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500/40 rounded-br-md" />
                  <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <div className="relative">
                      <Award className="h-12 w-12 text-amber-500" strokeWidth={1.5} />
                      <Sparkles className="h-4 w-4 text-amber-400 absolute -top-1 -right-1.5" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400 mt-2 font-semibold">
                      Certificate of Completion
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-1 line-clamp-2 max-w-full">
                      {c.course_title || 'Course Certificate'}
                    </p>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="capitalize gap-1">
                      <Sparkles className="h-3 w-3" /> {c.status || 'issued'}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(c.issued_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="rounded-md bg-muted/50 border px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Certificate No.</p>
                    <p className="font-mono text-xs font-medium truncate">{c.certificate_number}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="flex-1" onClick={() => window.print()}>
                      <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare(c)}>
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;