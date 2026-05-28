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
    const awardedOn = fmt(data.issueDate);
    const periodFrom = data.dob ? fmt(data.dob) : awardedOn;
    const periodTo = awardedOn;
    const slNo = `NCTI/${data.certificateNumber || "—"}`;
    const regNo = data.studentId || "—";
    const corpId = `U85306UP${new Date(data.issueDate || Date.now()).getFullYear()}NPL${(data.certificateNumber || "000000").replace(/\D/g, "").slice(-6).padStart(6, "0")}`;

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

            <div style={{ position: "relative", padding: "22px 50px", boxSizing: "border-box", height: "100%" }}>
              {/* Top row: Sl No. / Reg No. (centered, leaves room for seal on right) */}
              <div style={{ display: "flex", justifyContent: "space-around", fontSize: 13, color: "#0a0a0a", fontWeight: 600, padding: "0 130px 0 40px" }}>
                <span>Sl No. <b>{slNo}</b></span>
                <span>Reg No. <b>{regNo}</b></span>
              </div>

              {/* ISO line */}
              <div style={{ textAlign: "center", marginTop: 6, fontSize: 14, color: "#0a0a0a", paddingRight: 110 }}>
                An ISO 9001:2015 Certified Education Organization
              </div>

              {/* Main institute name (right padding clears the ISO badge) */}
              <h1
                style={{
                  textAlign: "center",
                  margin: "4px 130px 2px 40px",
                  fontSize: 34,
                  fontWeight: 900,
                  color: "#b91c1c",
                  letterSpacing: "0.3px",
                  lineHeight: 1.05,
                }}
              >
                NESAN COMPUTER AND TECHNICAL INSTITUTE
              </h1>
              <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 15, color: "#0a0a0a", paddingRight: 110 }}>
                A Venture of Samarth Shakti Foundation
              </div>

              {/* Green band */}
              <div
                style={{
                  margin: "8px auto 4px",
                  background: "#15803d",
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "4px 14px",
                  width: "fit-content",
                  border: "1px solid #064e2c",
                }}
              >
                Registered Under Societies Registration Act, 1860, Govt. of India
              </div>

              {/* Corporate ID line */}
              <div style={{ textAlign: "center", fontSize: 14, color: "#b91c1c", fontWeight: 700, paddingRight: 110 }}>
                Corporate Identification No.: {corpId}
              </div>

              {/* Top-right SSF logo */}
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  right: 50,
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "3px solid #b91c1c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src="/lovable-uploads/samarth-shakti-logo.png"
                  alt="SSF Logo"
                  crossOrigin="anonymous"
                  style={{ width: "92%", height: "92%", objectFit: "contain" }}
                />
              </div>

              {/* Certificate of Achievement ribbon */}
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <div style={{ fontSize: 14, color: "#b91c1c", letterSpacing: 8, marginBottom: 2 }}>❖ ❖ ❖</div>
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                    fontSize: 48,
                    color: "#b91c1c",
                    padding: "2px 60px",
                    borderTop: "2px solid #b91c1c",
                    borderBottom: "2px solid #b91c1c",
                    letterSpacing: "1px",
                    fontWeight: 700,
                  }}
                >
                  Certificate of Achievement
                </div>
                <div style={{ fontSize: 14, color: "#b91c1c", letterSpacing: 8, marginTop: 2 }}>❖ ❖ ❖</div>
              </div>

              {/* QR (left) */}
              {data.verifyUrl && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(data.verifyUrl)}`}
                  alt="verify"
                  crossOrigin="anonymous"
                  style={{ position: "absolute", top: 300, left: 60, width: 90, height: 90, border: "1px solid #0b2a6b", padding: 2, background: "#fff" }}
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
                    top: 340,
                    right: 70,
                    width: 120,
                    height: 140,
                    objectFit: "cover",
                    border: "2px solid #0b2a6b",
                  }}
                />
              )}

              {/* Body */}
              <div
                style={{
                  marginTop: 24,
                  padding: "0 210px 0 170px",
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "#0a0a0a",
                  textAlign: "justify",
                }}
              >
                This is to certify That{" "}
                <b>{data.studentName}</b>
                {data.fatherName ? <>, Son/Daughter of <b>{data.fatherName}</b></> : null}
                {data.motherName ? <> and <b>{data.motherName}</b></> : null}{" "}
                Has Successfully Completed The Course of{" "}
                <b>{data.course.certificateTitle} ({data.course.code})</b> At Our Authorised Study Centre{" "}
                <b>{data.centerName || "—"}</b>
                {data.centerCode ? <> (Code: <b>{data.centerCode}</b>)</> : null}
                , Period from <b>{periodFrom}</b> to <b>{periodTo}</b>. This Certificate Was Awarded on{" "}
                <b>{awardedOn}</b>. Securing <b>{data.percentage.toFixed(2)}%</b> with grade <b>{data.grade}</b>.
              </div>

              {/* Footer: logos row + signature */}
              <div
                style={{
                  position: "absolute",
                  bottom: 64,
                  left: 50,
                  right: 50,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
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

              {/* Grading scale red strip + website */}
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 50,
                  right: 50,
                  background: "#b91c1c",
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "4px 8px",
                  letterSpacing: "0.5px",
                }}
              >
                AA&gt;=90%, A+&gt;=80%, A&gt;=60%, B+&gt;=45%, B&gt;=35%, C&gt;=30%
              </div>
              <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, textAlign: "center", fontSize: 12, color: "#0b2a6b", fontWeight: 700 }}>
                www.samarthshaktifoundation.in
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
  const size = 150;
  const isTop = position === "tl" || position === "tr";
  const isLeft = position === "tl" || position === "bl";
  // Layered colored arcs (orange, teal, blue) matching reference corner art
  const layers = [
    { c: "#f59e0b", s: size },
    { c: "#0ea5a4", s: size - 36 },
    { c: "#1e40af", s: size - 72 },
  ];
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        overflow: "hidden",
        [isTop ? "top" : "bottom"]: 0,
        [isLeft ? "left" : "right"]: 0,
        pointerEvents: "none",
      }}
    >
      {layers.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: l.s,
            height: l.s,
            background: l.c,
            borderRadius: "50%",
            [isTop ? "top" : "bottom"]: -l.s / 2,
            [isLeft ? "left" : "right"]: -l.s / 2,
          }}
        />
      ))}
    </div>
  );
};

// Rectangular logo badge — title row + small colored sub bar (ITDB / MSME style)
const RectBadge = ({
  title, subtitle, titleColor, subBg, wide,
}: { title: string; subtitle: string; titleColor: string; subBg: string; wide?: boolean }) => (
  <div
    style={{
      border: `2px solid ${titleColor}`,
      borderRadius: 3,
      background: "#fff",
      width: wide ? 78 : 64,
      textAlign: "center",
      overflow: "hidden",
      fontFamily: "Arial, sans-serif",
      lineHeight: 1.1,
    }}
  >
    <div style={{ color: titleColor, fontWeight: 900, fontSize: 13, padding: "4px 2px 2px" }}>{title}</div>
    <div style={{ background: subBg, color: "#fff", fontWeight: 700, fontSize: 8, padding: "2px 2px" }}>
      {subtitle}
    </div>
  </div>
);

// Shield-style badge (London Cert Ltd style)
const ShieldBadge = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div
    style={{
      width: 56,
      height: 56,
      background: "linear-gradient(180deg, #fde047 0%, #f59e0b 100%)",
      border: "2px solid #92400e",
      borderRadius: "6px 6px 22px 22px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      lineHeight: 1.05,
      textAlign: "center",
      color: "#7c2d12",
    }}
  >
    <div style={{ fontWeight: 900, fontSize: 12 }}>{title}</div>
    <div style={{ fontWeight: 800, fontSize: 7, marginTop: 2 }}>{subtitle}</div>
  </div>
);

// Circular seal (ISO / SMCS style)
const SealBadge = ({ title, subtitle, ringColor }: { title: string; subtitle: string; ringColor: string }) => (
  <div
    style={{
      width: 54,
      height: 54,
      borderRadius: "50%",
      background: "#fff",
      border: `3px solid ${ringColor}`,
      boxShadow: `inset 0 0 0 2px ${ringColor}33`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      lineHeight: 1,
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div style={{ fontWeight: 900, fontSize: 12, color: ringColor }}>{title}</div>
    <div style={{ fontWeight: 800, fontSize: 8, color: "#0a0a0a", marginTop: 2 }}>{subtitle}</div>
  </div>
);