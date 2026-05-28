import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

const MyCertificates = () => (
  <div className="min-h-screen bg-background pt-24 pb-12 px-4">
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> My Certificates</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">No certificates issued yet.</p></CardContent>
      </Card>
    </div>
  </div>
);

export default MyCertificates;