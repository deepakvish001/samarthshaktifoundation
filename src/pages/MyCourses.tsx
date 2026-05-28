import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const MyCourses = () => (
  <div className="min-h-screen bg-background pt-24 pb-12 px-4">
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> My Courses</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">You are not enrolled in any courses yet.</p></CardContent>
      </Card>
    </div>
  </div>
);

export default MyCourses;