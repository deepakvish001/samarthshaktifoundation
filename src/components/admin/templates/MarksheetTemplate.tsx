import { forwardRef } from "react";
import { CourseTemplate, SubjectDef } from "@/lib/courseTemplates";

export interface MarksheetData {
  studentName: string;
  fatherName: string;
  motherName: string;
  studentId: string;
  rollNumber: string;
  examinationDate: string;
  issueDate: string;
  place: string;
  course: CourseTemplate;
  marks: Array<{ subject: SubjectDef; theoryObtained: number; practicalObtained: number }>;
  totalObtained: number;
  totalMax: number;
  percentage: number;
  grade: string;
  result: "PASS" | "FAIL";
  photoUrl?: string;
  directorSignUrl?: string;
  sealUrl?: string;
}

export const MarksheetTemplate = forwardRef<HTMLDivElement, { data: MarksheetData }>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "1123px",
          height: "794px",
          background: "#ffffff",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#1a1a1a",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ border: "5px double #1e3a8a", borderRadius: "8px", height: "100%", padding: "20px 40px", boxSizing: "border-box", position: "relative" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 6 }}>
            <img src="/favicon.png" alt="logo" crossOrigin="anonymous" style={{ width: 70, height: 70 }} />
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: 28, margin: 0, color: "#1e3a8a", fontWeight: 700 }}>SAMARTH SHAKTI FOUNDATION</h1>
              <p style={{ margin: 0, fontSize: 12, color: "#374151" }}>Registered under Govt. of India | ISO Certified Organization</p>
              <h2 style={{ fontSize: 18, margin: "4px 0 0 0", color: "#b8860b", letterSpacing: 2 }}>STATEMENT OF MARKS</h2>
            </div>
            {data.photoUrl && (
              <img src={data.photoUrl} alt="student" crossOrigin="anonymous" style={{ width: 80, height: 95, objectFit: "cover", border: "2px solid #1e3a8a" }} />
            )}
          </div>

          <div style={{ borderTop: "2px solid #1e3a8a", margin: "6px 0 12px" }} />

          {/* Student info grid */}
          <table style={{ width: "100%", fontSize: 13, marginBottom: 10 }}>
            <tbody>
              <tr>
                <td style={{ padding: "3px 6px" }}><b>Student Name:</b> {data.studentName}</td>
                <td style={{ padding: "3px 6px" }}><b>Student ID:</b> {data.studentId}</td>
                <td style={{ padding: "3px 6px" }}><b>Roll No:</b> {data.rollNumber}</td>
              </tr>
              <tr>
                <td style={{ padding: "3px 6px" }}><b>Father's Name:</b> {data.fatherName || "—"}</td>
                <td style={{ padding: "3px 6px" }}><b>Mother's Name:</b> {data.motherName || "—"}</td>
                <td style={{ padding: "3px 6px" }}><b>Exam Date:</b> {data.examinationDate}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ padding: "3px 6px" }}><b>Course:</b> {data.course.certificateTitle}</td>
                <td style={{ padding: "3px 6px" }}><b>Duration:</b> {data.course.duration}</td>
              </tr>
            </tbody>
          </table>

          {/* Marks table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#1e3a8a", color: "#fff" }}>
                <th style={th}>S.No</th>
                <th style={{ ...th, textAlign: "left", paddingLeft: 8 }}>Subject</th>
                <th style={th}>Theory Max</th>
                <th style={th}>Theory Obt.</th>
                <th style={th}>Practical Max</th>
                <th style={th}>Practical Obt.</th>
                <th style={th}>Total Max</th>
                <th style={th}>Total Obt.</th>
              </tr>
            </thead>
            <tbody>
              {data.marks.map((m, i) => {
                const tot = m.theoryObtained + m.practicalObtained;
                const max = m.subject.theoryMax + m.subject.practicalMax;
                return (
                  <tr key={i} style={{ background: i % 2 ? "#f8fafc" : "#fff" }}>
                    <td style={td}>{i + 1}</td>
                    <td style={{ ...td, textAlign: "left", paddingLeft: 8 }}>{m.subject.name}</td>
                    <td style={td}>{m.subject.theoryMax || "—"}</td>
                    <td style={td}>{m.subject.theoryMax ? m.theoryObtained : "—"}</td>
                    <td style={td}>{m.subject.practicalMax || "—"}</td>
                    <td style={td}>{m.subject.practicalMax ? m.practicalObtained : "—"}</td>
                    <td style={td}>{max}</td>
                    <td style={{ ...td, fontWeight: 700 }}>{tot}</td>
                  </tr>
                );
              })}
              <tr style={{ background: "#fef3c7", fontWeight: 700 }}>
                <td style={td} colSpan={6}>GRAND TOTAL</td>
                <td style={td}>{data.totalMax}</td>
                <td style={td}>{data.totalObtained}</td>
              </tr>
            </tbody>
          </table>

          {/* Result */}
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-around", padding: 10, background: "#f1f5f9", borderRadius: 6, fontSize: 14 }}>
            <span><b>Percentage:</b> {data.percentage.toFixed(2)}%</span>
            <span><b>Grade:</b> {data.grade}</span>
            <span style={{ color: data.result === "PASS" ? "#059669" : "#dc2626", fontWeight: 700 }}>
              Result: {data.result}
            </span>
          </div>

          {/* Footer */}
          <div style={{ position: "absolute", bottom: 30, left: 40, right: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontSize: 12 }}>
              <p style={{ margin: 0 }}>Date: <b>{data.issueDate}</b></p>
              <p style={{ margin: 0 }}>Place: <b>{data.place}</b></p>
            </div>
            {data.sealUrl && <img src={data.sealUrl} crossOrigin="anonymous" alt="seal" style={{ width: 70, height: 70, opacity: 0.85 }} />}
            <div style={{ textAlign: "center" }}>
              {data.directorSignUrl && (
                <img src={data.directorSignUrl} alt="sign" crossOrigin="anonymous" style={{ height: 40, marginBottom: 2 }} />
              )}
              <div style={{ borderTop: "1px solid #000", paddingTop: 2, minWidth: 160 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>Director</p>
                <p style={{ margin: 0, fontSize: 10, color: "#6b7280" }}>Samarth Shakti Foundation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
MarksheetTemplate.displayName = "MarksheetTemplate";

const th: React.CSSProperties = { border: "1px solid #1e3a8a", padding: "6px 4px", textAlign: "center", fontSize: 12 };
const td: React.CSSProperties = { border: "1px solid #cbd5e1", padding: "5px 4px", textAlign: "center" };