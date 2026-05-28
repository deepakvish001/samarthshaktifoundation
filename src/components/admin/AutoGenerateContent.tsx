import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sparkles, Download, Eye, Save, Loader2, FileText, Award, Printer, X, Search } from "lucide-react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { generateAndUploadReportPdf } from "@/lib/reportPdfGenerator";

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
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

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

  const [previewOpen, setPreviewOpen] = useState<null | "cert">(null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Load students + director sign once
  useEffect(() => {
    (async () => {
      const { data: d } = await supabase
        .from("director_messages")
        .select("photo")
        .limit(1)
        .maybeSingle();
      if (d?.photo) setDirectorSignUrl(d.photo);
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

  const resolveImg = (value?: string | null) => {
    const t = value?.trim();
    if (!t) return "";
    if (/^(https?:|data:|blob:|\/)/i.test(t)) return t;
    if (t.includes("/")) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(t);
      return data.publicUrl;
    }
    return "";
  };

  const searchStudents = async () => {
    if (!searchValue.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .or(
          `student_id.ilike.%${searchValue}%,full_name.ilike.%${searchValue}%,email.ilike.%${searchValue}%,phone.ilike.%${searchValue}%,course_name.ilike.%${searchValue}%`
        )
        .limit(10);
      if (error) throw error;
      setSearchResults(data || []);
      setShowResults(true);
      if (!data || data.length === 0) toast.info("No students found");
    } catch (e: any) {
      toast.error(e.message || "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const selectStudent = async (student: any) => {
    setShowResults(false);
    setSearchValue(student.full_name || student.student_id);
    const sid = student.student_id || student.id;

    const { data: alotRows } = await supabase
      .from("alot_numbers")
      .select("*")
      .eq("student_id", sid)
      .order("created_at", { ascending: false })
      .limit(1);
    const alot: any = alotRows && alotRows.length > 0 ? alotRows[0] : null;

    const courseName: string = (student.course_name || alot?.course_name || "").toString();
    const matchedCode = Object.keys(COURSE_TEMPLATES).find((code) => {
      const t = COURSE_TEMPLATES[code];
      return (
        courseName.toUpperCase().includes(code.toUpperCase()) ||
        (t.fullName && courseName.toLowerCase().includes(t.fullName.toLowerCase()))
      );
    });
    const finalCode = matchedCode || courseCode;
    if (matchedCode && matchedCode !== courseCode) setCourseCode(matchedCode);

    const photo = resolveImg(student.photo_url) || resolveImg(alot?.student_photo_url);
    const sign = resolveImg(alot?.director_signature_url);
    if (sign) setDirectorSignUrl(sign);

    setForm((f) => ({
      ...f,
      studentId: sid,
      studentName: student.full_name || alot?.student_name || "",
      fatherName: student.father_name || alot?.student_father_name || "",
      motherName: student.mother_name || alot?.student_mother_name || "",
      rollNumber: sid,
      photoUrl: photo || "",
      dob: student.date_of_birth || f.dob,
      centerName: student.study_center || alot?.center_name || f.centerName,
      centerCode: alot?.center_code || f.centerCode,
      issueDate: alot?.issue_date || f.issueDate,
      examinationDate: alot?.course_examination_date || f.examinationDate,
      place: alot?.place || f.place,
    }));

    if (alot?.subjects && Array.isArray(alot.subjects)) {
      const template = COURSE_TEMPLATES[finalCode];
      const mapped = template.subjects.map((sub, i) => {
        const row: any =
          (alot.subjects as any[]).find(
            (s) => (s.name || "").toLowerCase() === sub.name.toLowerCase()
          ) || (alot.subjects as any[])[i] || {};
        return {
          theoryObtained: Number(row.theory ?? row.theoryObtained ?? 0),
          practicalObtained: Number(row.practical ?? row.practicalObtained ?? 0),
        };
      });
      setMarks(mapped);
    }

    toast.success("Student data loaded");
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
      }).select().single();
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
      toast.success("Saved to database. Generating PDF...");
      const pdfUrl = await generateAndUploadReportPdf(form.studentId);
      if (pdfUrl && c.data?.id) {
        await supabase
          .from("certificate_management")
          .update({ certificate_url: pdfUrl })
          .eq("id", (c.data as any).id);
        toast.success("Certificate PDF stored");
      }
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
    if (!certRef.current) {
      toast.error("Templates not ready");
      return;
    }
    setDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1123, 794] });
      const c1 = await renderNodeToCanvas(certRef.current);
      pdf.addImage(c1.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 1123, 794);
      pdf.save(`${form.studentId || "student"}_${course.code}_Certificate.pdf`);
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
              Auto Certificate Generator
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

              <div className="md:col-span-6 space-y-2 relative">
                <Label className={labelCls}>Search Student <span className="text-slate-500 normal-case">(by ID, name, email, phone, course)</span></Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchStudents()}
                      placeholder="Search by name, ID, email…"
                      disabled={manualMode}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                  <Button type="button" onClick={searchStudents} disabled={searching || manualMode} className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white rounded-xl px-5 h-auto">
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                  </Button>
                </div>
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
                    {searchResults.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => selectStudent(s)}
                        className="w-full text-left px-4 py-3 hover:bg-[#4f46e5]/5 border-b border-slate-100 last:border-0"
                      >
                        <div className="text-sm font-semibold text-slate-900">{s.full_name}</div>
                        <div className="text-xs text-slate-500 font-mono">{s.student_id || s.id?.slice(0, 8)} · {s.course_name || "—"}</div>
                      </button>
                    ))}
                  </div>
                )}
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

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-end gap-3 pb-4">
          <Button onClick={() => setPreviewOpen("cert")} variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-[#4f46e5]/5 hover:text-[#4f46e5] hover:border-[#4f46e5]/40 rounded-xl px-6 py-3 h-auto font-semibold">
            <Eye className="h-4 w-4 mr-2" /> Preview Certificate
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 py-3 h-auto font-semibold">
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
      </div>

      {/* Preview modal */}
      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(null)}
        certData={certData}
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
      <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-sm font-bold ${value === "PASS" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{value}</span>
    ) : (
      <p className={`text-xl font-bold mt-1 ${accent || "text-slate-900"}`}>{value}</p>
    )}
  </div>
);

export default AutoGenerateContent;

// =================== Preview modal with proper scaling + Print/Cancel ===================
const PreviewModal = ({
  open,
  onClose,
  certData,
}: {
  open: null | "cert";
  onClose: () => void;
  certData: CertificateData;
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
              {open === "cert" ? <CertificateTemplate data={certData} /> : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};