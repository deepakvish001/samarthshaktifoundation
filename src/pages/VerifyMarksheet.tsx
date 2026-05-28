import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface StudentRow {
  id: string;
  student_id: string | null;
  full_name: string;
  course_name?: string | null;
  father_name?: string | null;
  mother_name?: string | null;
  photo_url?: string | null;
}

interface MarksheetRow {
  id: string;
  student_id: string;
  course_name: string;
  roll_number: string;
  examination_date: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  result_status: string;
}

interface SubjectRow {
  id: string;
  subject: string;
  theory_marks: string;
  practical_marks: string;
}

const mth: React.CSSProperties = { border: "1px solid #111", padding: "6px", fontWeight: 700, textAlign: "center", fontSize: 12, background: "#fff" };
const mtd: React.CSSProperties = { border: "1px solid #111", padding: "5px", textAlign: "center", fontSize: 12 };

const VerifyMarksheet = () => {
  const { studentId = "" } = useParams();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [marksheet, setMarksheet] = useState<MarksheetRow | null>(null);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data: students } = await supabase
          .from("student_profiles")
          .select("id,student_id,full_name,course_name,father_name,mother_name,photo_url")
          .eq("student_id", studentId)
          .limit(1);
        const s = students?.[0] as StudentRow | undefined;

        const { data: mk } = await supabase
          .from("marksheet_management")
          .select("*")
          .eq("student_id", studentId)
          .maybeSingle();

        const { data: alotRows } = await supabase
          .from("alot_numbers")
          .select("*")
          .eq("student_id", studentId)
          .order("created_at", { ascending: false })
          .limit(1);
        const alot: any = alotRows?.[0] || null;

        let subj: SubjectRow[] = [];
        const courseName = s?.course_name || alot?.course_name;
        if (courseName) {
          const { data: cs } = await supabase
            .from("course_subjects")
            .select("*")
            .eq("course_name", courseName);
          if (cs && cs.length) subj = cs as any;
        }
        if (subj.length === 0 && alot?.subjects && Array.isArray(alot.subjects)) {
          subj = alot.subjects.map((x: any, i: number) => ({
            id: `${alot.id}-${i}`,
            subject: x.name || "",
            theory_marks: String(x.theoryMax || ""),
            practical_marks: String(x.practicalMax || ""),
          }));
        }

        // Build merged student
        const merged: StudentRow | null = s
          ? {
              ...s,
              father_name: s.father_name || alot?.student_father_name,
              mother_name: s.mother_name || alot?.student_mother_name,
              photo_url: s.photo_url || alot?.student_photo_url,
            }
          : alot
          ? {
              id: alot.id,
              student_id: alot.student_id,
              full_name: alot.student_name || "",
              course_name: alot.course_name,
              father_name: alot.student_father_name,
              mother_name: alot.student_mother_name,
              photo_url: alot.student_photo_url,
            }
          : null;

        // Build marksheet if missing
        let mkFinal: MarksheetRow | null = (mk as any) || null;
        if (!mkFinal && alot) {
          const alotSubs: any[] = Array.isArray(alot.subjects) ? alot.subjects : [];
          const totalMax = alotSubs.reduce((sum, x) => sum + (Number(x.theoryMax) || 0) + (Number(x.practicalMax) || 0), 0);
          const totalObt = alotSubs.reduce((sum, x) => sum + (Number(x.theory) || 0) + (Number(x.practical) || 0), 0);
          const pct = totalMax > 0 ? (totalObt / totalMax) * 100 : 0;
          const grade = pct >= 80 ? "A+" : pct >= 70 ? "A" : pct >= 60 ? "B" : pct >= 50 ? "C" : pct >= 40 ? "D" : "F";
          mkFinal = {
            id: alot.id,
            student_id: alot.student_id,
            course_name: alot.course_name,
            roll_number: alot.student_id,
            examination_date: alot.course_examination_date || alot.issue_date || "",
            total_marks: totalMax,
            obtained_marks: totalObt,
            percentage: Math.round(pct * 100) / 100,
            grade,
            result_status: pct >= 40 ? "pass" : "fail",
          };
        }

        if (!cancelled) {
          setStudent(merged);
          setMarksheet(mkFinal);
          setSubjects(subj);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-600">Loading certificate…</div>;
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Certificate Not Found</h1>
          <p className="text-slate-600">No record exists for ID <span className="font-mono">{studentId}</span>.</p>
        </div>
      </div>
    );
  }

  const theoryMaxTotal = subjects.reduce((s, x) => s + (parseInt(x.theory_marks || "0") || 0), 0);
  const pracMaxTotal = subjects.reduce((s, x) => s + (parseInt(x.practical_marks || "0") || 0), 0);
  const overallMax = theoryMaxTotal + pracMaxTotal;
  const ratio = overallMax > 0 && marksheet?.obtained_marks ? marksheet.obtained_marks / overallMax : 0;
  const theoryObt = Math.round(theoryMaxTotal * ratio);
  const pracObt = Math.round(pracMaxTotal * ratio);
  const grandMax = marksheet?.total_marks || overallMax;
  const grandObt = marksheet?.obtained_marks || theoryObt + pracObt;
  const pct = marksheet?.percentage ?? (grandMax ? (grandObt / grandMax) * 100 : 0);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="mx-auto bg-white shadow-xl" style={{ width: "min(794px, 100%)", minHeight: 1123, color: "#111", fontFamily: "'Times New Roman', Times, serif" }}>
        <div style={{ padding: "28px 40px", borderTop: "1px solid #555" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
            <img src="/favicon.png" alt="logo" style={{ width: 70, height: 70, objectFit: "contain" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 8 }}>
            <div>
              <div style={{ fontWeight: 700 }}>Enroll. Number</div>
              <div>{student.student_id || "—"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>Sl. No.</div>
              <div>{marksheet?.roll_number || marksheet?.id?.slice(0, 10).toUpperCase() || "—"}</div>
            </div>
          </div>

          <h1 style={{ textAlign: "center", color: "#1d4ed8", fontWeight: 800, fontSize: 32, margin: "4px 0 6px" }}>SAMARTH SHAKTI FOUNDATION</h1>
          <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 13, marginBottom: 6 }}>A Unit of Nesan Computer And Technical Institute</div>
          <div style={{ textAlign: "center", fontSize: 12, lineHeight: 1.6 }}>
            <div>Registered Under Societies Registration Act, 1860 Regd. No. <span style={{ color: "#dc2626", fontWeight: 700 }}>UP/2019/BAL/10760</span></div>
            <div>MSME Reg. No. : <span style={{ color: "#dc2626", fontWeight: 700 }}>BAL/10760/2019-20</span></div>
            <div>ISO 9001:2015 CERTIFIED / No. <span style={{ color: "#dc2626", fontWeight: 700 }}>SSF-2024-CERT</span></div>
          </div>

          <div style={{ textAlign: "center", color: "#c026d3", fontWeight: 700, fontSize: 13, margin: "10px 0 4px" }}>(Awarded to Under the Management)</div>
          <div style={{ textAlign: "center", margin: "8px 0 4px" }}>
            <span style={{ color: "#0891b2", fontWeight: 700, fontSize: 16, textDecoration: "underline" }}>{student.course_name || "—"}</span>
          </div>

          <h2 style={{ textAlign: "center", color: "#dc2626", fontSize: 22, fontWeight: 700, margin: "6px 0 10px" }}>CERTIFICATE-CUM-MARKS SHEET</h2>

          <div style={{ position: "relative", minHeight: 130 }}>
            <div style={{ position: "absolute", right: 0, top: -120, width: 110, height: 130, border: "1px solid #333", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#6b7280", overflow: "hidden" }}>
              {student.photo_url ? <img src={student.photo_url} alt="student" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>STUDENT PHOTO</span>}
            </div>

            <div style={{ fontSize: 14, lineHeight: 1.9, paddingRight: 130 }}>
              <div>
                This is to certify that according to organization{" "}
                <span style={{ fontWeight: 700, textDecoration: "underline" }}>Mr./श्री {student.full_name}</span>
              </div>
              <div>
                Son/Daughter of Mr. <span style={{ fontWeight: 700, textDecoration: "underline" }}>Mr./श्री {student.father_name || "____________________"}</span> and Mrs.{" "}
                <span style={{ fontWeight: 700, textDecoration: "underline" }}>Mrs./श्रीमती {student.mother_name || "____________________"}</span>
              </div>
              <div>
                has passed one year <span style={{ fontWeight: 700 }}>{student.course_name}</span> Course examination held in{" "}
                <span style={{ fontWeight: 700, textDecoration: "underline" }}>{marksheet?.examination_date ? new Date(marksheet.examination_date).toLocaleDateString("en-GB") : "—"}</span>
              </div>
              <div>
                from <span style={{ color: "#dc2626", fontWeight: 700, textDecoration: "underline" }}>Samarth Shakti Foundation</span>
              </div>
              <div>Center Code: <span style={{ fontWeight: 700, textDecoration: "underline" }}>SSF/AZM/0001</span>. His/Her grading in Individual Papers are given below.</div>
            </div>
          </div>

          <h3 style={{ textAlign: "center", color: "#1d4ed8", fontWeight: 700, fontSize: 16, margin: "10px 0 6px" }}>GRADES AWARDED</h3>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, border: "1.5px solid #111" }}>
            <thead>
              <tr>
                <th style={mth}>Subjects</th>
                <th style={mth}>Max.Theory Marks</th>
                <th style={mth}>Max.Practical Marks</th>
                <th style={mth}>Obtain Theory Marks.</th>
                <th style={mth}>Obtain Practical Marks.</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr><td colSpan={5} style={{ ...mtd, padding: 14, color: "#6b7280" }}>No subjects added for this course.</td></tr>
              ) : subjects.map((sub) => {
                const tMax = parseInt(sub.theory_marks || "0") || 0;
                const pMax = parseInt(sub.practical_marks || "0") || 0;
                return (
                  <tr key={sub.id}>
                    <td style={{ ...mtd, textAlign: "left", paddingLeft: 8 }}>{sub.subject}</td>
                    <td style={mtd}>{tMax || "—"}</td>
                    <td style={mtd}>{pMax || "—"}</td>
                    <td style={mtd}>{tMax ? Math.round(tMax * ratio) : "—"}</td>
                    <td style={mtd}>{pMax ? Math.round(pMax * ratio) : "—"}</td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: 700 }}>
                <td style={{ ...mtd, textAlign: "center" }}>Total</td>
                <td style={mtd}>{theoryMaxTotal}</td>
                <td style={mtd}>{pracMaxTotal}</td>
                <td style={mtd}>{theoryObt}</td>
                <td style={mtd}>{pracObt}</td>
              </tr>
              <tr style={{ fontWeight: 700 }}>
                <td style={{ ...mtd, textAlign: "center" }}>Grand Total</td>
                <td style={mtd} colSpan={2}>{grandMax}</td>
                <td style={mtd} colSpan={2}>{grandObt}</td>
              </tr>
              <tr style={{ fontWeight: 700 }}>
                <td style={{ ...mtd, textAlign: "center" }}>Percentage (%)</td>
                <td style={{ ...mtd, color: "#dc2626" }} colSpan={4}>{pct.toFixed(1)} %</td>
              </tr>
              <tr style={{ fontWeight: 700 }}>
                <td style={{ ...mtd, textAlign: "center" }}>Grade</td>
                <td style={{ ...mtd, color: "#dc2626" }} colSpan={4}>{marksheet?.grade || "—"}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>LEGEND OF GRADES</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", fontSize: 12, marginTop: 6, rowGap: 4, columnGap: 30, paddingLeft: 12 }}>
              <div>S &nbsp;: 85% &amp; Above</div>
              <div>A &nbsp;: 75%-84%</div>
              <div>B &nbsp;: 65%-74%</div>
              <div>C &nbsp;: 55%-64%</div>
              <div>D &nbsp;: 50%-54%</div>
              <div>F &nbsp;: Less than 50% - Fail</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 30, fontSize: 13 }}>
            <div>
              <div><b>Issue Date :</b> {marksheet?.examination_date ? new Date(marksheet.examination_date).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB")}</div>
              <div style={{ marginTop: 6 }}><b>Place :</b> AZAMGARH</div>
            </div>
            <div style={{ textAlign: "center", fontSize: 11 }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=2&data=${encodeURIComponent(`${window.location.origin}/verify/${student.student_id}`)}`} alt="QR" style={{ width: 90, height: 90 }} />
              <div style={{ fontSize: 9, marginTop: 2 }}>Scan to verify</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontStyle: "italic", marginBottom: 4 }}>Digitally signed by</div>
              <div style={{ borderTop: "1px solid #111", paddingTop: 4, minWidth: 160, fontWeight: 700 }}>SECRETARY/DIRECTOR</div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "#374151" }}>
            This Diploma may be Verified at <span style={{ color: "#1d4ed8" }}>www.samarthshaktifoundation.org</span> using the diploma holder's enrollment number
          </div>
          <div style={{ textAlign: "center", marginTop: 4, fontSize: 11, fontWeight: 700 }}>Head Office Address - Samarth Shakti Foundation, AZAMGARH - 276121, Uttar Pradesh</div>

          <div className="mt-6 text-center text-xs text-emerald-700 font-semibold">✓ Verified certificate · Issued by Samarth Shakti Foundation</div>
        </div>
      </div>
    </div>
  );
};

export default VerifyMarksheet;