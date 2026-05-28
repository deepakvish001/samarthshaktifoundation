import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sparkles, Download, Eye, Save, Loader2, FileText, Award, Printer, X } from "lucide-react";
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

  const sectionCard = "bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm";
  const sectionHeader = "px-8 py-5 bg-[#4f46e5]/5 border-b border-slate-200 flex items-center justify-between";
  const inputCls = "w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 focus-visible:ring-2 focus-visible:ring-[#4f46e5]/40 focus-visible:ring-offset-0 focus-visible:border-[#4f46e5] h-auto";
  const selectTriggerCls = "w-full bg-white border-slate-200 text-slate-900 rounded-xl px-4 py-3 h-auto focus:ring-2 focus:ring-[#4f46e5]/40";
  const labelCls = "text-xs font-bold text-slate-500 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#4f46e5]/5 text-slate-700 font-['DM_Sans',sans-serif] p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Title */}
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#4f46e5]/10 border border-[#4f46e5]/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-7 h-7 text-[#4f46e5]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
              Auto Certificate &amp; Marksheet Generator
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              ADCA · DCA · Typing — Professional document issuance engine
            </p>
          </div>
        </div>

        {/* Course & Student card */}
        <div className={sectionCard}>
          <div className={sectionHeader}>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[#4f46e5]" />
              <span className="font-semibold text-slate-900">Course &amp; Student Details</span>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="manual" className="text-xs text-slate-500 uppercase tracking-wider">Manual Entry Mode</Label>
              <Switch checked={manualMode} onCheckedChange={setManualMode} id="manual" />
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5">
              <div className="md:col-span-6 space-y-2">
                <Label className={labelCls}>Course <span className="text-red-500">*</span></Label>
                <Select value={courseCode} onValueChange={setCourseCode}>
                  <SelectTrigger className={selectTriggerCls}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COURSE_LIST.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.code} — {c.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-4 text-xs text-slate-500 px-1">
                  <span>Duration: {course.duration}</span>
                  <span>Total Max: {courseTotalMax(course)}</span>
                </div>
              </div>

              <div className="md:col-span-6 space-y-2">
                <Label className={labelCls}>Student <span className="text-slate-500 normal-case">(Auto-fill)</span></Label>
                <Select value={selectedStudentKey} onValueChange={onPickStudent} disabled={manualMode}>
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder={manualMode ? "Manual mode" : "Select student"} />
                  </SelectTrigger>
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

              <DarkField className="md:col-span-4" label={<>Student ID <span className="text-red-500">*</span></>} value={form.studentId} onChange={(v) => setForm({ ...form, studentId: v })} inputCls={inputCls} labelCls={labelCls} />
              <DarkField className="md:col-span-4" label={<>Student Name <span className="text-red-500">*</span></>} value={form.studentName} onChange={(v) => setForm({ ...form, studentName: v })} inputCls={inputCls} labelCls={labelCls} />
              <DarkField className="md:col-span-4" label="Roll Number" value={form.rollNumber} onChange={(v) => setForm({ ...form, rollNumber: v })} inputCls={inputCls} labelCls={labelCls} />

              <DarkField className="md:col-span-4" label="Father's Name" value={form.fatherName} onChange={(v) => setForm({ ...form, fatherName: v })} inputCls={inputCls} labelCls={labelCls} />
              <DarkField className="md:col-span-4" label="Mother's Name" value={form.motherName} onChange={(v) => setForm({ ...form, motherName: v })} inputCls={inputCls} labelCls={labelCls} />

              <div className="md:col-span-4 space-y-2">
                <Label className={labelCls}>Student Photo</Label>
                <div className="flex items-center gap-2">
                  <Input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="URL or upload →" className={inputCls} />
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handlePhotoUpload} />
                  <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-white border-slate-200 text-slate-600 hover:bg-[#4f46e5]/5 hover:text-[#4f46e5] hover:border-[#4f46e5]/40 shrink-0 h-12 w-12 rounded-xl">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  </Button>
                </div>
                {form.photoUrl && <img src={form.photoUrl} alt="" className="h-16 w-12 object-cover rounded-lg border border-slate-200 mt-1" />}
              </div>

              <DarkField className="md:col-span-4" label="Date of Birth" type="date" value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} inputCls={inputCls} labelCls={labelCls} />
              <DarkField className="md:col-span-4" label="Batch" value={form.batch} onChange={(v) => setForm({ ...form, batch: v })} placeholder="e.g. 2025-A" inputCls={inputCls} labelCls={labelCls} />
              <DarkField className="md:col-span-4" label="Center Name" value={form.centerName} onChange={(v) => setForm({ ...form, centerName: v })} inputCls={inputCls} labelCls={labelCls} />
              <DarkField className="md:col-span-4" label="Center Code" value={form.centerCode} onChange={(v) => setForm({ ...form, centerCode: v })} inputCls={inputCls} labelCls={labelCls} />

              <div className="md:col-span-4 space-y-2">
                <Label className={labelCls}>Certificate Number</Label>
                <div className="bg-[#4f46e5]/5 border border-[#4f46e5]/20 rounded-xl px-4 py-3 text-[#4f46e5] font-mono text-sm truncate">
                  {form.certificateNumber}
                </div>
              </div>
              <DarkField className="md:col-span-4" label="Issue Date" type="date" value={form.issueDate} onChange={(v) => setForm({ ...form, issueDate: v })} inputCls={inputCls} labelCls={labelCls} />
              <DarkField className="md:col-span-4" label="Examination Date" type="date" value={form.examinationDate} onChange={(v) => setForm({ ...form, examinationDate: v })} inputCls={inputCls} labelCls={labelCls} />
              <DarkField className="md:col-span-4" label="Place" value={form.place} onChange={(v) => setForm({ ...form, place: v })} inputCls={inputCls} labelCls={labelCls} />
            </div>
          </div>
        </div>

        {/* Marks card */}
        <div className={sectionCard}>
          <div className={sectionHeader}>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#4f46e5]" />
              <span className="font-semibold text-slate-900">Examination Scores — {course.code}</span>
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">{course.subjects.length} Subjects</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">#</th>
                  <th className="text-left py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Subject</th>
                  <th className="text-center py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Theory Max</th>
                  <th className="text-center py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Theory Obt.</th>
                  <th className="text-center py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Practical Max</th>
                  <th className="text-center py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Practical Obt.</th>
                  <th className="text-center py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {course.subjects.map((s, i) => {
                  const m = marks[i] || { theoryObtained: 0, practicalObtained: 0 };
                  return (
                    <tr key={i} className="hover:bg-[#4f46e5]/5 transition-colors">
                      <td className="py-3 px-6 font-mono text-slate-400">{String(i + 1).padStart(2, "0")}</td>
                      <td className="py-3 px-6 text-slate-900 font-medium">{s.name}</td>
                      <td className="py-3 px-4 text-center text-slate-500">{s.theoryMax || "—"}</td>
                      <td className="py-3 px-4 text-center">
                        {s.theoryMax > 0 ? (
                          <Input
                            type="number" min={0} max={s.theoryMax}
                            value={m.theoryObtained}
                            onChange={(e) => {
                              const v = Math.min(Number(e.target.value || 0), s.theoryMax);
                              setMarks((prev) => prev.map((p, idx) => (idx === i ? { ...p, theoryObtained: v } : p)));
                            }}
                            className="h-9 w-20 mx-auto text-center bg-white border-slate-200 text-slate-900 rounded-lg focus-visible:ring-1 focus-visible:ring-[#4f46e5]"
                          />
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500">{s.practicalMax || "—"}</td>
                      <td className="py-3 px-4 text-center">
                        {s.practicalMax > 0 ? (
                          <Input
                            type="number" min={0} max={s.practicalMax}
                            value={m.practicalObtained}
                            onChange={(e) => {
                              const v = Math.min(Number(e.target.value || 0), s.practicalMax);
                              setMarks((prev) => prev.map((p, idx) => (idx === i ? { ...p, practicalObtained: v } : p)));
                            }}
                            className="h-9 w-20 mx-auto text-center bg-white border-slate-200 text-slate-900 rounded-lg focus-visible:ring-1 focus-visible:ring-[#4f46e5]"
                          />
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3 px-6 text-center font-bold text-slate-900">{Number(m.theoryObtained || 0) + Number(m.practicalObtained || 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <DarkStat label="Total Obtained" value={`${totals.totalObtained} / ${totals.totalMax}`} />
            <DarkStat label="Percentage" value={`${totals.percentage.toFixed(2)}%`} accent="text-[#4f46e5]" />
            <DarkStat label="Grade" value={totals.grade} accent="text-slate-900" />
            <DarkStat
              label="Result"
              value={totals.result}
              accent={totals.result === "PASS" ? "text-emerald-400" : "text-red-400"}
              badge
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-end gap-3 pb-4">
          <Button onClick={() => setPreviewOpen("cert")} variant="outline" className="bg-transparent border-[#1e1e5a] text-slate-300 hover:bg-[#1e1e5a] hover:text-white rounded-xl px-6 py-3 h-auto font-semibold">
            <Eye className="h-4 w-4 mr-2" /> Preview Certificate
          </Button>
          <Button onClick={() => setPreviewOpen("marks")} variant="outline" className="bg-transparent border-[#1e1e5a] text-slate-300 hover:bg-[#1e1e5a] hover:text-white rounded-xl px-6 py-3 h-auto font-semibold">
            <Eye className="h-4 w-4 mr-2" /> Preview Marksheet
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-6 py-3 h-auto font-semibold">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save to Database
          </Button>
          <Button onClick={handleDownload} disabled={downloading} className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white rounded-xl px-8 py-3 h-auto font-bold shadow-lg shadow-[#4f46e5]/30 hover:scale-[1.02] active:scale-95 transition-all">
            {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Generate &amp; Download
          </Button>
        </div>
      </div>

      {/* Hidden render targets for PDF */}
      <div style={{ position: "fixed", left: -10000, top: 0 }}>
        <CertificateTemplate ref={certRef} data={certData} />
        <MarksheetTemplate ref={marksRef} data={marksData} />
      </div>

      {/* Preview modal */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(null)}
        certData={certData}
        marksData={marksData}
      />
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

const DarkField = ({
  label, value, onChange, type = "text", placeholder, className = "", inputCls, labelCls,
}: {
  label: React.ReactNode; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; className?: string; inputCls: string; labelCls: string;
}) => (
  <div className={`space-y-2 ${className}`}>
    <Label className={labelCls}>{label}</Label>
    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
  </div>
);

const DarkStat = ({ label, value, accent, badge }: { label: string; value: string; accent?: string; badge?: boolean }) => (
  <div className="text-center">
    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</p>
    {badge ? (
      <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-sm font-bold ${value === "PASS" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>{value}</span>
    ) : (
      <p className={`text-xl font-bold mt-1 ${accent || "text-white"}`}>{value}</p>
    )}
  </div>
);

export default AutoGenerateContent;

// =================== Preview modal with proper scaling + Print/Cancel ===================
const PreviewModal = ({
  open,
  onClose,
  certData,
  marksData,
}: {
  open: null | "cert" | "marks";
  onClose: () => void;
  certData: CertificateData;
  marksData: MarksheetData;
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);

  // Fit-to-width scaling based on stage size
  useEffect(() => {
    if (!open) return;
    const fit = () => {
      const el = stageRef.current;
      if (!el) return;
      const w = el.clientWidth - 24;
      const h = el.clientHeight - 24;
      const s = Math.min(w / 1123, h / 794, 1);
      setScale(s > 0 ? s : 0.7);
    };
    fit();
    window.addEventListener("resize", fit);
    const t = setTimeout(fit, 50);
    return () => {
      window.removeEventListener("resize", fit);
      clearTimeout(t);
    };
  }, [open]);

  const handlePrint = () => {
    if (!printRef.current) return;
    const html = printRef.current.innerHTML;
    const w = window.open("", "_blank", "width=1200,height=800");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Print</title>
      <meta charset="utf-8" />
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @page { size: A4 landscape; margin: 0; }
        body { margin: 0; padding: 0; background: white; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head><body>${html}</body></html>`);
    w.document.close();
    w.onload = () => {
      setTimeout(() => {
        w.focus();
        w.print();
      }, 400);
    };
  };

  return (
    <Dialog open={open !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[98vw] w-[98vw] h-[95vh] p-0 gap-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
          <h2 className="font-semibold text-sm">
            {open === "cert" ? "Certificate Preview" : "Marksheet Preview"}
          </h2>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        </div>
        <div ref={stageRef} className="flex-1 overflow-auto bg-muted/20 flex items-start justify-center p-3">
          <div style={{ width: 1123 * scale, height: 794 * scale }}>
            <div
              ref={printRef}
              style={{
                width: 1123,
                height: 794,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              {open === "cert" ? (
                <CertificateTemplate data={certData} />
              ) : open === "marks" ? (
                <MarksheetTemplate data={marksData} />
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};