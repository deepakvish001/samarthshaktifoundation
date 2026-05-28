import { forwardRef } from "react";
import { CourseTemplate } from "@/lib/courseTemplates";

export interface CertificateData {
  studentName: string;
  fatherName: string;
  motherName: string;
  studentId: string;
  certificateNumber: string;
  issueDate: string;
  place: string;
  grade: string;
  percentage: number;
  course: CourseTemplate;
  photoUrl?: string;
  directorSignUrl?: string;
  sealUrl?: string;
  dob?: string;
  centerCode?: string;
  centerName?: string;
  batch?: string;
  verifyUrl?: string;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, { data: CertificateData }>(
  ({ data }, ref) => {
    // Format dates as DD.MM.YYYY for the body sentence
    const fmt = (s?: string) => {
      if (!s) return "—";
      const d = new Date(s);
      if (isNaN(d.getTime())) return s;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      return `${dd}.${mm}.${d.getFullYear()}`;
    };
    // Derive a "period from" — issueDate minus course duration is unknown here, so we
    // just show the issue date as the awarded date and let admin fill DOB for start.
    const awardedOn = fmt(data.issueDate);
    const periodFrom = data.dob ? fmt(data.dob) : awardedOn;
    const periodTo = awardedOn;

    return (
      <div
        ref={ref}
        style={{
          width: "1123px",
          height: "794px",
          background: "#ffffff",
          fontFamily: "'Times New Roman', Georgia, serif",
          color: "#0a0a0a",
          position: "relative",
          padding: "0",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Decorative outer border — multi-color frame, curved corners */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "conic-gradient(from 90deg at 50% 50%, #0b2a6b 0deg, #1e40af 60deg, #b91c1c 120deg, #f59e0b 180deg, #1e40af 240deg, #0b2a6b 360deg)",
            padding: "14px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: "0", position: "relative", boxSizing: "border-box" }}>
            {/* Inner thin red border */}
            <div style={{ position: "absolute", inset: 8, border: "2px solid #b91c1c", pointerEvents: "none" }} />

            {/* Curved corner arcs (decorative) */}
            <CornerArc position="tl" />
            <CornerArc position="tr" />
            <CornerArc position="bl" />
            <CornerArc position="br" />

            <div style={{ position: "relative", padding: "26px 50px", boxSizing: "border-box", height: "100%" }}>
              {/* Top row: Sl No. / Reg No. (right side leaves room for ISO badge) */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#0a0a0a", fontWeight: 600, paddingRight: 120 }}>
                <span>Sl No. <b>NCTI/{data.certificateNumber}</b></span>
                <span>Reg No. <b>{data.studentId || "—"}</b></span>
              </div>

              {/* ISO line */}
              <div style={{ textAlign: "center", marginTop: 6, fontSize: 14, color: "#0a0a0a" }}>
                An ISO 9001:2015 Certified Education Organization
              </div>

              {/* Main institute name (right padding clears the ISO badge) */}
              <h1
                style={{
                  textAlign: "center",
                  margin: "4px 130px 2px 60px",
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#0b2a6b",
                  letterSpacing: "0.3px",
                  lineHeight: 1.05,
                }}
              >
                NESAN COMPUTER AND TECHNICAL INSTITUTE
              </h1>
              <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 15, color: "#0a0a0a" }}>
                A Unit of Samarth Shakti Foundation
              </div>

              {/* Green band */}
              <div
                style={{
                  margin: "8px auto 0",
                  background: "#15803d",
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "5px 12px",
                  width: "fit-content",
                  border: "1px solid #064e2c",
                }}
              >
                Registered Under Societies Registration Act, 1860 · MSME Reg No BAL/10760/2019-20
              </div>

              {/* Top-right ISO badge */}
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  right: 60,
                  width: 92,
                  height: 92,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #fff 55%, #0b2a6b 56%)",
                  border: "3px solid #b91c1c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#0b2a6b",
                  lineHeight: 1.1,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                NCTI<br/>ISO 9001<br/>:2015
              </div>

              {/* Certificate of Achievement ribbon */}
              <div style={{ textAlign: "center", marginTop: 22 }}>
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                    fontSize: 46,
                    color: "#b91c1c",
                    padding: "2px 50px",
                    borderTop: "2px solid #b91c1c",
                    borderBottom: "2px solid #b91c1c",
                    letterSpacing: "1px",
                    fontWeight: 700,
                  }}
                >
                  Certificate of Achievement
                </div>
              </div>

              {/* QR (left) */}
              {data.verifyUrl && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(data.verifyUrl)}`}
                  alt="verify"
                  crossOrigin="anonymous"
                  style={{ position: "absolute", top: 215, left: 60, width: 80, height: 80 }}
                />
              )}

              {/* Photo (right) */}
              {data.photoUrl && (
                <img
                  src={data.photoUrl}
                  alt="student"
                  crossOrigin="anonymous"
                  style={{
                    position: "absolute",
                    top: 305,
                    right: 70,
                    width: 110,
                    height: 130,
                    objectFit: "cover",
                    border: "2px solid #0b2a6b",
                  }}
                />
              )}

              {/* Body */}
              <div
                style={{
                  marginTop: 30,
                  padding: "0 200px 0 60px",
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "#0a0a0a",
                  textAlign: "justify",
                }}
              >
                This is to certify That{" "}
                <b>{data.studentName}</b>
                {data.fatherName ? <>, Son/Daughter of <b>{data.fatherName}</b></> : null}
                {data.motherName ? <> and <b>{data.motherName}</b></> : null}{" "}
                Has Successfully Completed The Course of{" "}
                <b>{data.course.certificateTitle}</b> At Our Authorised Study Centre{" "}
                <b>{data.centerName || "—"}</b>
                {data.centerCode ? <> (Code: <b>{data.centerCode}</b>)</> : null}
                , Period from <b>{periodFrom}</b> to <b>{periodTo}</b>. This Certificate Was Awarded on{" "}
                <b>{awardedOn}</b>. Securing <b>{data.percentage.toFixed(2)}%</b> with grade <b>{data.grade}</b>.
              </div>

              {/* Footer: logos row + signature */}
              <div
                style={{
                  position: "absolute",
                  bottom: 60,
                  left: 50,
                  right: 50,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <FooterBadge label="NCTI" sub="Education" color="#0b2a6b" />
                  <FooterBadge label="SSF" sub="Foundation" color="#b91c1c" />
                  <FooterBadge label="MSME" sub="Govt. of India" color="#15803d" />
                  <FooterBadge label="ISO" sub="9001:2015" color="#0b2a6b" />
                  <FooterBadge label="SRA" sub="1860" color="#b91c1c" />
                </div>
                <div style={{ textAlign: "center" }}>
                  {data.directorSignUrl ? (
                    <img src={data.directorSignUrl} alt="sign" crossOrigin="anonymous" style={{ height: 44, objectFit: "contain" }} />
                  ) : (
                    <div style={{ height: 44, fontFamily: "'Brush Script MT', cursive", fontSize: 26, color: "#0b2a6b" }}>
                      Authorised
                    </div>
                  )}
                  <div style={{ borderTop: "1px solid #0a0a0a", paddingTop: 2, minWidth: 200, fontSize: 13, fontWeight: 700 }}>
                    Chairman's Signature
                  </div>
                  <div style={{ fontSize: 11, color: "#374151" }}>
                    Nesan Computer and Technical Institute
                  </div>
                </div>
              </div>

              {/* Grading scale red strip */}
              <div
                style={{
                  position: "absolute",
                  bottom: 22,
                  left: 50,
                  right: 50,
                  background: "#b91c1c",
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "5px 8px",
                  letterSpacing: "0.5px",
                }}
              >
                AA&gt;=90%, A+&gt;=80%, A&gt;=60%, B+&gt;=45%, B&gt;=35%, C&gt;=30%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CertificateTemplate.displayName = "CertificateTemplate";

const CornerArc = ({ position }: { position: "tl" | "tr" | "bl" | "br" }) => {
  const size = 110;
  const base: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    border: "6px solid #f59e0b",
    borderRadius: "50%",
    background: "transparent",
  };
  const map: Record<string, React.CSSProperties> = {
    tl: { top: -size / 2, left: -size / 2 },
    tr: { top: -size / 2, right: -size / 2 },
    bl: { bottom: -size / 2, left: -size / 2 },
    br: { bottom: -size / 2, right: -size / 2 },
  };
  return <div style={{ ...base, ...map[position] }} />;
};

const FooterBadge = ({ label, sub, color }: { label: string; sub: string; color: string }) => (
  <div style={{ textAlign: "center", minWidth: 60 }}>
    <div
      style={{
        background: color,
        color: "#fff",
        fontWeight: 800,
        fontSize: 13,
        padding: "4px 10px",
        borderRadius: 4,
        border: "1.5px solid #0a0a0a",
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 9, color: "#374151", marginTop: 2, fontWeight: 600 }}>{sub}</div>
  </div>
);