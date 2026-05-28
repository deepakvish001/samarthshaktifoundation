import { createRoot } from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { supabase } from "@/integrations/supabase/client";
import { COURSE_TEMPLATES, calcGrade, courseTotalMax, CourseTemplate } from "@/lib/courseTemplates";
import { CertificateTemplate, CertificateData } from "@/components/admin/templates/CertificateTemplate";
import { MarksheetTemplate, MarksheetData } from "@/components/admin/templates/MarksheetTemplate";

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

const matchCourse = (courseName: string, fallback = "ADCA"): CourseTemplate => {
  const matched = Object.keys(COURSE_TEMPLATES).find((code) => {
    const t = COURSE_TEMPLATES[code];
    return (
      (courseName || "").toUpperCase().includes(code.toUpperCase()) ||
      (t.fullName && (courseName || "").toLowerCase().includes(t.fullName.toLowerCase()))
    );
  });
  return COURSE_TEMPLATES[matched || fallback] || COURSE_TEMPLATES.ADCA;
};

async function buildData(studentId: string) {
  const { data: students } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("student_id", studentId)
    .limit(1);
  const student: any = students?.[0] || {};

  const { data: alotRows } = await supabase
    .from("alot_numbers")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1);
  const alot: any = alotRows?.[0] || {};

  const { data: cert } = await supabase
    .from("certificate_management")
    .select("*")
    .eq("student_id", studentId)
    .order("issue_date", { ascending: false })
    .limit(1);
  const certRow: any = cert?.[0] || {};

  const { data: dm } = await supabase
    .from("director_messages")
    .select("photo")
    .limit(1)
    .maybeSingle();

  const courseName = certRow.course_name || alot.course_name || student.course_name || "";
  const course = matchCourse(courseName);

  const marks = course.subjects.map((sub, i) => {
    const subj = Array.isArray(alot.subjects) ? alot.subjects : [];
    const row: any = subj.find((s: any) => (s.name || "").toLowerCase() === sub.name.toLowerCase()) || subj[i] || {};
    return {
      subject: sub,
      theoryObtained: Number(row.theory ?? row.theoryObtained ?? 0),
      practicalObtained: Number(row.practical ?? row.practicalObtained ?? 0),
    };
  });

  const totalMax = courseTotalMax(course);
  const totalObtained = marks.reduce((s, m) => s + m.theoryObtained + m.practicalObtained, 0);
  const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  const grade = certRow.grade || calcGrade(percentage);
  const passAll = marks.every((m) => {
    const tOk = m.subject.theoryMax === 0 || (m.theoryObtained / m.subject.theoryMax) * 100 >= course.passingTheoryPct;
    const pOk = m.subject.practicalMax === 0 || (m.practicalObtained / m.subject.practicalMax) * 100 >= course.passingPracticalPct;
    return tOk && pOk;
  });
  const result: "PASS" | "FAIL" = passAll && percentage >= 40 ? "PASS" : "FAIL";

  const photo = resolveImg(student.photo_url) || resolveImg(alot.student_photo_url);
  const sign = resolveImg(alot.director_signature_url) || resolveImg(dm?.photo);

  const studentName = student.full_name || alot.student_name || certRow.student_name || "";
  const fatherName = student.father_name || alot.student_father_name || "";
  const motherName = student.mother_name || alot.student_mother_name || "";
  const issueDate = certRow.issue_date || alot.issue_date || new Date().toISOString().slice(0, 10);
  const examDate = alot.course_examination_date || issueDate;
  const place = alot.place || student.city || "Delhi";
  const centerName = alot.center_name || student.study_center || "";
  const centerCode = alot.center_code || "";
  const certificateNumber = certRow.certificate_number || `SSF/${course.code}/${new Date(issueDate).getFullYear()}/0000`;

  const certData: CertificateData = {
    studentName,
    fatherName,
    motherName,
    studentId,
    certificateNumber,
    issueDate,
    place,
    grade,
    percentage,
    course,
    photoUrl: photo,
    directorSignUrl: sign,
    sealUrl: "/favicon.png",
    dob: student.date_of_birth || "",
    centerCode,
    centerName,
    batch: "",
    verifyUrl: `${window.location.origin}/verify/${certificateNumber}`,
  };

  const marksData: MarksheetData = {
    studentName,
    fatherName,
    motherName,
    studentId,
    rollNumber: studentId,
    examinationDate: examDate,
    issueDate,
    place,
    course,
    marks,
    totalObtained,
    totalMax,
    percentage,
    grade,
    result,
    photoUrl: photo,
    directorSignUrl: sign,
    sealUrl: "/favicon.png",
    dob: student.date_of_birth || "",
    centerCode,
    centerName,
    batch: "",
  };

  return { certData, marksData, course, studentId, studentName };
}

async function renderTemplates(certData: CertificateData, marksData: MarksheetData) {
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-10000px;top:0;z-index:-1;";
  document.body.appendChild(host);
  const root = createRoot(host);

  await new Promise<void>((resolve) => {
    root.render(
      <div>
        <div id="__pdf_cert"><CertificateTemplate data={certData} /></div>
        <div id="__pdf_marks"><MarksheetTemplate data={marksData} /></div>
      </div>
    );
    // Wait for paint + images
    setTimeout(resolve, 100);
  });

  // Wait for all images inside host to load
  const imgs = Array.from(host.querySelectorAll("img"));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((res) => {
          if (img.complete && img.naturalWidth > 0) return res();
          img.addEventListener("load", () => res(), { once: true });
          img.addEventListener("error", () => res(), { once: true });
          setTimeout(res, 5000);
        })
    )
  );

  const certNode = host.querySelector("#__pdf_cert > div") as HTMLElement;
  const marksNode = host.querySelector("#__pdf_marks > div") as HTMLElement;

  const opts = { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false } as any;
  const c1 = await html2canvas(certNode, opts);
  const c2 = await html2canvas(marksNode, opts);

  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1123, 794] });
  pdf.addImage(c1.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 1123, 794);
  pdf.addPage([1123, 794], "landscape");
  pdf.addImage(c2.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 1123, 794);

  root.unmount();
  host.remove();
  return pdf;
}

export async function downloadReportPdf(studentId: string) {
  const { certData, marksData, course, studentName } = await buildData(studentId);
  const pdf = await renderTemplates(certData, marksData);
  const safe = (studentName || studentId).replace(/[^a-z0-9]+/gi, "_");
  pdf.save(`${safe}_${course.code}_Certificate_Marksheet.pdf`);
}

export async function printReportPdf(studentId: string) {
  const { certData, marksData } = await buildData(studentId);
  const pdf = await renderTemplates(certData, marksData);
  const url = pdf.output("bloburl");
  const w = window.open(url as any, "_blank");
  if (w) {
    w.onload = () => {
      try {
        w.focus();
        w.print();
      } catch {}
    };
  }
}

export async function generateAndUploadReportPdf(studentId: string): Promise<string | null> {
  try {
    const { certData, marksData, course, studentName } = await buildData(studentId);
    const pdf = await renderTemplates(certData, marksData);
    const blob = pdf.output("blob") as Blob;
    const safe = (studentName || studentId).replace(/[^a-z0-9]+/gi, "_");
    const { data: u } = await supabase.auth.getUser();
    const folder = u.user?.id || "shared";
    const path = `${folder}/certificates/${safe}_${course.code}_${Date.now()}.pdf`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, blob, { upsert: true, contentType: "application/pdf" });
    if (error) throw error;
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  } catch (e) {
    console.error("generateAndUploadReportPdf failed", e);
    return null;
  }
}

export async function downloadSavedPdf(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const objUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
}

export function printSavedPdf(url: string) {
  const w = window.open(url, "_blank");
  if (w) {
    w.onload = () => {
      try {
        w.focus();
        w.print();
      } catch {}
    };
  }
}