import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Loader2, Download } from 'lucide-react';
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

  useEffect(() => {
    if (!user) return;
    (async () => {
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
    })();
  }, [user]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">My Certificates</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : certs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No certificates issued yet. Complete a course to earn one.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {certs.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{c.course_title || 'Course Certificate'}</CardTitle>
                    <Badge>{c.status || 'issued'}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm"><span className="text-muted-foreground">Certificate No:</span> <span className="font-mono">{c.certificate_number}</span></p>
                  <p className="text-sm"><span className="text-muted-foreground">Issued:</span> {new Date(c.issued_date).toLocaleDateString()}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => window.print()}>
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
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