import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sparkles, Download, Eye, Save, Loader2, FileText, Award } from "lucide-react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  COURSE_LIST,
  COURSE_TEMPLATES,
  calcGrade,
  courseTotalMax,
  CourseTemplate,
} from "@/lib/courseTemplates";
import { CertificateTemplate, CertificateData } from "./templates/CertificateTemplate";
import { MarksheetTemplate, MarksheetData } from "./templates/MarksheetTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface StudentOption {
  student_id: string;
  student_name: string;
  father_name?: string;
  mother_name?: string;
  photo_url?: string;
  course_name?: string;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const AutoGenerateContent = () => {
  const [courseCode, setCourseCode] = useState<string>("ADCA");
  const course: CourseTemplate = COURSE_TEMPLATES[courseCode];

  const [manualMode, setManualMode] = useState(false);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [selectedStudentKey, setSelectedStudentKey] = useState<string>("");

  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    fatherName: "",
    motherName: "",
    rollNumber: "",
    photoUrl: "",
    certificateNumber: "",
    issueDate: todayStr(),
    examinationDate: todayStr(),
    place: "Delhi",
    dob: "",
    centerCode: "",
    centerName: "",
    batch: "",
  });

  const [marks, setMarks] = useState<Array<{ theoryObtained: number; practicalObtained: number }>>([]);
  const [directorSignUrl, setDirectorSignUrl] = useState<string>("");

  const [previewOpen, setPreviewOpen] = useState<null | "cert" | "marks">(null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);
  const marksRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Load students + director sign once
  useEffect(() => {
    (async () => {
      const [a, b, d] = await Promise.all([
        supabase.from("alot_numbers").select("student_id, student_name, student_father_name, student_mother_name, student_photo_url, course_name").limit(500),
        supabase.from("student_profiles").select("id, full_name, course_name").limit(500),
        supabase.from("director_messages").select("photo").limit(1).maybeSingle(),
      ]);
      const merged: StudentOption[] = [];
      a.data?.forEach((r: any) => merged.push({
        student_id: r.student_id,
        student_name: r.student_name || "",
        father_name: r.student_father_name || "",
        mother_name: r.student_mother_name || "",
        photo_url: r.student_photo_url || "",
        course_name: r.course_name,
      }));
      b.data?.forEach((r: any) => {
        if (!merged.find((m) => m.student_id === r.id)) {
          merged.push({ student_id: r.id, student_name: r.full_name, course_name: r.course_name });
        }
      });
      setStudents(merged);
      if (d.data?.photo) setDirectorSignUrl(d.data.photo);
    })();
  }, []);

  // Reset marks rows on course change
  useEffect(() => {
    setMarks(course.subjects.map(() => ({ theoryObtained: 0, practicalObtained: 0 })));
    // auto certificate number
    setForm((f) => ({
      ...f,
      certificateNumber: `SSF/${course.code}/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
    }));
  }, [courseCode]);

  const onPickStudent = (key: string) => {
    setSelectedStudentKey(key);
    const s = students.find((x) => x.student_id === key);
    if (s) {
      setForm((f) => ({
        ...f,
        studentId: s.student_id,
        studentName: s.student_name,
        fatherName: s.father_name || "",
        motherName: s.mother_name || "",
        rollNumber: s.student_id,
        photoUrl: s.photo_url || "",
      }));
    }
  };

  const totals = useMemo(() => {
    const totalMax = courseTotalMax(course);
    const totalObtained = marks.reduce((s, m, i) => s + Number(m.theoryObtained || 0) + Number(m.practicalObtained || 0), 0);
    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    const grade = calcGrade(percentage);
    // pass check per subject
    const passAll = course.subjects.every((sub, i) => {
      const t = Number(marks[i]?.theoryObtained || 0);
      const p = Number(marks[i]?.practicalObtained || 0);
      const tOk = sub.theoryMax === 0 || (t / sub.theoryMax) * 100 >= course.passingTheoryPct;
      const pOk = sub.practicalMax === 0 || (p / sub.practicalMax) * 100 >= course.passingPracticalPct;
      return tOk && pOk;
    });
    const result: "PASS" | "FAIL" = passAll && percentage >= 40 ? "PASS" : "FAIL";
    return { totalMax, totalObtained, percentage, grade, result };
  }, [marks, course]);

  const certData: CertificateData = {
    studentName: form.studentName,
    fatherName: form.fatherName,
    motherName: form.motherName,
    studentId: form.studentId,
    certificateNumber: form.certificateNumber,
    issueDate: form.issueDate,
    place: form.place,
    grade: totals.grade,
    percentage: totals.percentage,
    course,
    photoUrl: form.photoUrl,
    directorSignUrl,
    sealUrl: "/favicon.png",
    dob: form.dob,
    centerCode: form.centerCode,
    centerName: form.centerName,
    batch: form.batch,
    verifyUrl: `${window.location.origin}/verify/${form.certificateNumber}`,
  };

  const marksData: MarksheetData = {
    studentName: form.studentName,
    fatherName: form.fatherName,
    motherName: form.motherName,
    studentId: form.studentId,
    rollNumber: form.rollNumber || form.studentId,
    examinationDate: form.examinationDate,
    issueDate: form.issueDate,
    place: form.place,
    course,
    marks: course.subjects.map((s, i) => ({
      subject: s,
      theoryObtained: Number(marks[i]?.theoryObtained || 0),
      practicalObtained: Number(marks[i]?.practicalObtained || 0),
    })),
    totalMax: totals.totalMax,
    totalObtained: totals.totalObtained,
    percentage: totals.percentage,
    grade: totals.grade,
    result: totals.result,
    photoUrl: form.photoUrl,
    directorSignUrl,
    sealUrl: "/favicon.png",
    dob: form.dob,
    centerCode: form.centerCode,
    centerName: form.centerName,
    batch: form.batch,
  };

  const validate = () => {
    if (!form.studentId || !form.studentName) {
      toast.error("Student ID and Name required");
      return false;
    }
    return true;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Only JPG/PNG allowed"); return;
    }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    setUploading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const folder = u.user?.id || "shared";
      const path = `${folder}/cert-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setForm((f) => ({ ...f, photoUrl: data.publicUrl }));
      toast.success("Photo uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const certInsert = supabase.from("certificate_management").insert({
        student_id: form.studentId,
        student_name: form.studentName,
        course_name: course.certificateTitle,
        certificate_number: form.certificateNumber,
        issue_date: form.issueDate,
        completion_date: form.issueDate,
        grade: totals.grade,
        certificate_type: "course_completion",
        status: "active",
      });
      const marksInsert = supabase.from("marksheet_management").insert({
        student_id: form.studentId,
        student_name: form.studentName,
        course_name: course.certificateTitle,
        roll_number: form.rollNumber || form.studentId,
        examination_date: form.examinationDate,
        total_marks: totals.totalMax,
        obtained_marks: totals.totalObtained,
        percentage: Number(totals.percentage.toFixed(2)),
        grade: totals.grade,
        result_status: totals.result.toLowerCase(),
      });
      const [c, m] = await Promise.all([certInsert, marksInsert]);
      if (c.error) throw c.error;
      if (m.error) throw m.error;
      toast.success("Saved to database");
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const renderNodeToCanvas = async (node: HTMLElement) => {
    return html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
  };

  const handleDownload = async () => {
    if (!validate()) return;
    if (!certRef.current || !marksRef.current) {
      toast.error("Templates not ready");
      return;
    }
    setDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1123, 794] });
      const c1 = await renderNodeToCanvas(certRef.current);
      pdf.addImage(c1.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 1123, 794);
      pdf.addPage([1123, 794], "landscape");
      const c2 = await renderNodeToCanvas(marksRef.current);
      pdf.addImage(c2.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 1123, 794);
      pdf.save(`${form.studentId || "student"}_${course.code}_Certificate_Marksheet.pdf`);
      toast.success("PDF downloaded");
    } catch (e: any) {
      toast.error(e.message || "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full"><Sparkles className="h-8 w-8 text-primary" /></div>
          <div>
            <h1 className="text-3xl font-bold">Auto Certificate &amp; Marksheet Generator</h1>
            <p className="text-muted-foreground">ADCA · DCA · Typing — dynamic auto-fill</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Course &amp; Student</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Course *</Label>
                <Select value={courseCode} onValueChange={setCourseCode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COURSE_LIST.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.code} — {c.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Duration: {course.duration} · Total max: {courseTotalMax(course)}</p>
              </div>
              <div className="space-y-1">
                <Label>Student (auto-fill)</Label>
                <Select value={selectedStudentKey} onValueChange={onPickStudent} disabled={manualMode}>
                  <SelectTrigger><SelectValue placeholder={manualMode ? "Manual mode" : "Select student"} /></SelectTrigger>
                  <SelectContent>
                    {students.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">No students found</div>}
                    {students.slice(0, 200).map((s) => (
                      <SelectItem key={s.student_id} value={s.student_id}>
                        {s.student_id} — {s.student_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Switch checked={manualMode} onCheckedChange={setManualMode} id="manual" />
                <Label htmlFor="manual">Manual entry mode</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Student ID *" value={form.studentId} onChange={(v) => setForm({ ...form, studentId: v })} />
              <Field label="Student Name *" value={form.studentName} onChange={(v) => setForm({ ...form, studentName: v })} />
              <Field label="Roll Number" value={form.rollNumber} onChange={(v) => setForm({ ...form, rollNumber: v })} />
              <Field label="Father's Name" value={form.fatherName} onChange={(v) => setForm({ ...form, fatherName: v })} />
              <Field label="Mother's Name" value={form.motherName} onChange={(v) => setForm({ ...form, motherName: v })} />
              <Field label="Photo URL" value={form.photoUrl} onChange={(v) => setForm({ ...form, photoUrl: v })} placeholder="https://…" />
              <Field label="Certificate Number" value={form.certificateNumber} onChange={(v) => setForm({ ...form, certificateNumber: v })} />
              <Field label="Issue Date" type="date" value={form.issueDate} onChange={(v) => setForm({ ...form, issueDate: v })} />
              <Field label="Examination Date" type="date" value={form.examinationDate} onChange={(v) => setForm({ ...form, examinationDate: v })} />
              <Field label="Place" value={form.place} onChange={(v) => setForm({ ...form, place: v })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Marks — {course.code}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Theory Max</TableHead>
                  <TableHead className="text-center">Theory Obt.</TableHead>
                  <TableHead className="text-center">Practical Max</TableHead>
                  <TableHead className="text-center">Practical Obt.</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.subjects.map((s, i) => {
                  const m = marks[i] || { theoryObtained: 0, practicalObtained: 0 };
                  return (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-center">{s.theoryMax || "—"}</TableCell>
                      <TableCell className="text-center">
                        {s.theoryMax > 0 ? (
                          <Input
                            type="number"
                            min={0}
                            max={s.theoryMax}
                            value={m.theoryObtained}
                            onChange={(e) => {
                              const v = Math.min(Number(e.target.value || 0), s.theoryMax);
                              setMarks((prev) => prev.map((p, idx) => (idx === i ? { ...p, theoryObtained: v } : p)));
                            }}
                            className="h-8 w-20 mx-auto text-center"
                          />
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-center">{s.practicalMax || "—"}</TableCell>
                      <TableCell className="text-center">
                        {s.practicalMax > 0 ? (
                          <Input
                            type="number"
                            min={0}
                            max={s.practicalMax}
                            value={m.practicalObtained}
                            onChange={(e) => {
                              const v = Math.min(Number(e.target.value || 0), s.practicalMax);
                              setMarks((prev) => prev.map((p, idx) => (idx === i ? { ...p, practicalObtained: v } : p)));
                            }}
                            className="h-8 w-20 mx-auto text-center"
                          />
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-center font-semibold">{Number(m.theoryObtained || 0) + Number(m.practicalObtained || 0)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-4 bg-muted/40 rounded-lg">
              <Stat label="Total Obtained" value={`${totals.totalObtained} / ${totals.totalMax}`} />
              <Stat label="Percentage" value={`${totals.percentage.toFixed(2)}%`} />
              <Stat label="Grade" value={totals.grade} />
              <Stat label="Result" value={totals.result} accent={totals.result === "PASS" ? "text-green-600" : "text-red-600"} />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setPreviewOpen("cert")} variant="outline"><Eye className="h-4 w-4 mr-2" /> Preview Certificate</Button>
          <Button onClick={() => setPreviewOpen("marks")} variant="outline"><Eye className="h-4 w-4 mr-2" /> Preview Marksheet</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save to Database
          </Button>
          <Button onClick={handleDownload} disabled={downloading} className="bg-gradient-to-r from-primary to-primary/80">
            {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Download Both as PDF
          </Button>
        </div>
      </div>

      {/* Hidden render targets for PDF */}
      <div style={{ position: "fixed", left: -10000, top: 0 }}>
        <CertificateTemplate ref={certRef} data={certData} />
        <MarksheetTemplate ref={marksRef} data={marksData} />
      </div>

      {/* Preview modal */}
      <Dialog open={previewOpen !== null} onOpenChange={(o) => !o && setPreviewOpen(null)}>
        <DialogContent className="max-w-[1180px] p-2 overflow-auto">
          <div style={{ transform: "scale(0.78)", transformOrigin: "top left", width: 1123 }}>
            {previewOpen === "cert" ? <CertificateTemplate data={certData} /> : previewOpen === "marks" ? <MarksheetTemplate data={marksData} /> : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

const Stat = ({ label, value, accent }: { label: string; value: string; accent?: string }) => (
  <div className="text-center">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`text-xl font-bold ${accent || ""}`}>{value}</p>
  </div>
);

export default AutoGenerateContent;