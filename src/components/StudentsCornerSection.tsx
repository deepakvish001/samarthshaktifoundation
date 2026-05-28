import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, FileText, Loader2, Search, ExternalLink, GraduationCap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type StudentDetails = {
  full_name?: string | null;
  student_id?: string | null;
  course_name?: string | null;
  father_name?: string | null;
  mother_name?: string | null;
  date_of_birth?: string | null;
  photo_url?: string | null;
  study_center?: string | null;
};

const fetchStudent = async (studentId: string): Promise<StudentDetails | null> => {
  if (!studentId) return null;
  const { data } = await supabase
    .from("student_profiles")
    .select("full_name,student_id,course_name,father_name,mother_name,date_of_birth,photo_url,study_center")
    .eq("student_id", studentId)
    .limit(1);
  const student = (data?.[0] as StudentDetails) || null;
  if (student && !student.photo_url) {
    const { data: alot } = await supabase
      .from("alot_numbers")
      .select("student_photo_url")
      .eq("student_id", studentId)
      .not("student_photo_url", "is", null)
      .limit(1);
    let photo = alot?.[0]?.student_photo_url as string | undefined;
    if (!photo) {
      const { data: admit } = await supabase
        .from("student_admit_cards")
        .select("student_photo_url")
        .eq("student_id", studentId)
        .not("student_photo_url", "is", null)
        .limit(1);
      photo = admit?.[0]?.student_photo_url as string | undefined;
    }
    if (photo) student.photo_url = photo;
  }
  return student;
};

const StudentInfo = ({ s }: { s: StudentDetails | null | undefined }) => {
  if (!s) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 p-4 rounded-lg bg-muted/40 border border-border">
      {s.photo_url ? (
        <img src={s.photo_url} alt={s.full_name || "student"} className="w-28 h-28 object-cover rounded-md border border-border" />
      ) : (
        <div className="w-28 h-28 rounded-md bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground">No Photo</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Name:</span> <b>{s.full_name || "—"}</b></div>
        <div><span className="text-muted-foreground">Student ID:</span> <b>{s.student_id || "—"}</b></div>
        <div><span className="text-muted-foreground">Father:</span> <b>{s.father_name || "—"}</b></div>
        <div><span className="text-muted-foreground">Mother:</span> <b>{s.mother_name || "—"}</b></div>
        <div><span className="text-muted-foreground">DOB:</span> <b>{s.date_of_birth || "—"}</b></div>
        <div><span className="text-muted-foreground">Course:</span> <b>{s.course_name || "—"}</b></div>
        <div className="sm:col-span-2"><span className="text-muted-foreground">Study Center:</span> <b>{s.study_center || "—"}</b></div>
      </div>
    </div>
  );
};

const StudentsCornerSection = () => {
  const { user } = useAuth();
  const [certNo, setCertNo] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [certLoading, setCertLoading] = useState(false);
  const [marksLoading, setMarksLoading] = useState(false);
  const [certResult, setCertResult] = useState<any>(null);
  const [marksResult, setMarksResult] = useState<any>(null);
  const [certNotFound, setCertNotFound] = useState(false);
  const [marksNotFound, setMarksNotFound] = useState(false);

  if (!user) return null;

  const verifyCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = certNo.trim();
    if (!q) { toast({ title: "Enter Certificate Number", variant: "destructive" }); return; }
    setCertLoading(true); setCertResult(null); setCertNotFound(false);
    try {
      const { data, error } = await supabase
        .from("certificate_management")
        .select("*")
        .or(`certificate_number.eq.${q},student_id.eq.${q}`)
        .order("issue_date", { ascending: false })
        .limit(1);
      if (error) throw error;
      const row = data?.[0];
      if (!row) { setCertNotFound(true); }
      else {
        const student = await fetchStudent(row.student_id);
        setCertResult({ ...row, student });
      }
    } catch (err: any) {
      toast({ title: "Verification failed", description: err.message, variant: "destructive" });
    } finally { setCertLoading(false); }
  };

  const verifyMarksheet = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = rollNo.trim();
    if (!q) { toast({ title: "Enter Marksheet / Roll Number", variant: "destructive" }); return; }
    setMarksLoading(true); setMarksResult(null); setMarksNotFound(false);
    try {
      const { data, error } = await supabase
        .from("marksheet_management")
        .select("*")
        .or(`roll_number.eq.${q},student_id.eq.${q}`)
        .order("examination_date", { ascending: false })
        .limit(1);
      if (error) throw error;
      const row = data?.[0];
      if (!row) { setMarksNotFound(true); }
      else {
        const student = await fetchStudent(row.student_id);
        setMarksResult({ ...row, student });
      }
    } catch (err: any) {
      toast({ title: "Verification failed", description: err.message, variant: "destructive" });
    } finally { setMarksLoading(false); }
  };

  return (
    <section id="students-corner" className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <GraduationCap className="h-4 w-4" /> Students Corner
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Verify Certificate & Marksheet</h2>
          <p className="text-muted-foreground">Enter your Certificate or Marksheet number to instantly view your details.</p>
        </div>

        <Tabs defaultValue="certificate" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6 max-w-md mx-auto">
            <TabsTrigger value="certificate" className="gap-2"><Award className="h-4 w-4" /> Certificate</TabsTrigger>
            <TabsTrigger value="marksheet" className="gap-2"><FileText className="h-4 w-4" /> Marksheet</TabsTrigger>
          </TabsList>

          <TabsContent value="certificate">
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Certificate Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={verifyCertificate} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Label htmlFor="home-certNo" className="sr-only">Certificate Number</Label>
                    <Input id="home-certNo" placeholder="Enter Certificate Number or Student ID" value={certNo} onChange={(e) => setCertNo(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={certLoading} className="gap-2">
                    {certLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Verify
                  </Button>
                </form>

                {certNotFound && (
                  <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                    No certificate found for this number.
                  </div>
                )}

                {certResult && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-md bg-green-500/10 border border-green-500/30 text-green-700 text-sm font-medium">
                      ✓ Certificate Verified — Status: {certResult.status?.toUpperCase()}
                    </div>
                    <StudentInfo s={certResult.student} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Certificate No:</span> <b>{certResult.certificate_number}</b></div>
                      <div><span className="text-muted-foreground">Course:</span> <b>{certResult.course_name}</b></div>
                      <div><span className="text-muted-foreground">Grade:</span> <b>{certResult.grade || "—"}</b></div>
                      <div><span className="text-muted-foreground">Issue Date:</span> <b>{certResult.issue_date}</b></div>
                      <div className="sm:col-span-2"><span className="text-muted-foreground">Completion Date:</span> <b>{certResult.completion_date || "—"}</b></div>
                    </div>
                    {certResult.certificate_url && (
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <a href={certResult.certificate_url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" /> View Certificate PDF
                        </a>
                      </Button>
                    )}
                    {certResult.student_id && (
                      <Link to={`/verify/${certResult.student_id}`} className="text-sm text-primary underline ml-3">
                        View full marksheet & certificate page
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marksheet">
            <Card className="shadow-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Marksheet Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={verifyMarksheet} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Label htmlFor="home-rollNo" className="sr-only">Roll / Marksheet Number</Label>
                    <Input id="home-rollNo" placeholder="Enter Marksheet / Roll Number or Student ID" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={marksLoading} className="gap-2">
                    {marksLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Verify
                  </Button>
                </form>

                {marksNotFound && (
                  <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                    No marksheet found for this number.
                  </div>
                )}

                {marksResult && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-md bg-green-500/10 border border-green-500/30 text-green-700 text-sm font-medium">
                      ✓ Marksheet Verified — Result: {marksResult.result_status?.toUpperCase()}
                    </div>
                    <StudentInfo s={marksResult.student} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Roll Number:</span> <b>{marksResult.roll_number}</b></div>
                      <div><span className="text-muted-foreground">Course:</span> <b>{marksResult.course_name}</b></div>
                      <div><span className="text-muted-foreground">Exam Date:</span> <b>{marksResult.examination_date}</b></div>
                      <div><span className="text-muted-foreground">Total / Obtained:</span> <b>{marksResult.obtained_marks} / {marksResult.total_marks}</b></div>
                      <div><span className="text-muted-foreground">Percentage:</span> <b>{Number(marksResult.percentage).toFixed(2)}%</b></div>
                      <div><span className="text-muted-foreground">Grade:</span> <b>{marksResult.grade}</b></div>
                    </div>
                    {marksResult.marksheet_url && (
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <a href={marksResult.marksheet_url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" /> View Marksheet PDF
                        </a>
                      </Button>
                    )}
                    {marksResult.student_id && (
                      <Link to={`/verify/${marksResult.student_id}`} className="text-sm text-primary underline ml-3">
                        View full marksheet page
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default StudentsCornerSection;