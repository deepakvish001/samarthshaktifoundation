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

            <div style={{ position: "relative", padding: "26px 160px 22px 160px", boxSizing: "border-box", height: "100%" }}>
              {/* Top row: Sl No. / Reg No. */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#0a0a0a", fontWeight: 600 }}>
                <span>Sl No.&nbsp;<b>{slNo}</b></span>
                <span>Reg No.&nbsp;<b>{regNo}</b></span>
              </div>

              {/* ISO line */}
              <div style={{ textAlign: "center", marginTop: 4, fontSize: 13, color: "#0a0a0a", letterSpacing: 0.3 }}>
                An ISO 9001:2015 Certified Education Organization
              </div>

              {/* Main institute name */}
              <h1
                style={{
                  textAlign: "center",
                  margin: "2px 0 2px",
                  fontSize: 30,
                  fontWeight: 900,
                  color: "#b91c1c",
                  letterSpacing: "0.4px",
                  lineHeight: 1.1,
                }}
              >
                NESAN COMPUTER AND TECHNICAL INSTITUTE
              </h1>
              <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 14, color: "#374151" }}>
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
                  fontSize: 13,
                  padding: "4px 14px",
                  width: "fit-content",
                  border: "1px solid #064e2c",
                }}
              >
                Registered Under Societies Registration Act, 1860, Govt. of India
              </div>

              {/* Corporate ID line */}
              <div style={{ textAlign: "center", fontSize: 13, color: "#b91c1c", fontWeight: 700 }}>
                Corporate Identification No.: {corpId}
              </div>

              {/* Top-right SSF logo */}
              <div
                style={{
                  position: "absolute",
                  top: 26,
                  right: 36,
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
                  src="/lovable-uploads/nesan-logo.png"
                  alt="SSF Logo"
                  crossOrigin="anonymous"
                  style={{ width: "92%", height: "92%", objectFit: "contain", imageRendering: "auto" as any }}
                />
              </div>
              {/* Top-left MSME logo */}
              <div
                style={{
                  position: "absolute",
                  top: 26,
                  left: 36,
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: "#fff",
                  border: "3px solid #0b2a6b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src="/cert-logos/msme-full.png"
                  alt="MSME"
                  crossOrigin="anonymous"
                  style={{ width: "88%", height: "88%", objectFit: "contain" }}
                />
              </div>

              {/* Certificate of Achievement ribbon */}
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <div style={{ fontSize: 12, color: "#b91c1c", letterSpacing: 8, marginBottom: 2 }}>❖ ❖ ❖</div>
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                    fontSize: 44,
                    color: "#b91c1c",
                    padding: "0 70px",
                    borderTop: "2px solid #b91c1c",
                    borderBottom: "2px solid #b91c1c",
                    letterSpacing: "1px",
                    fontWeight: 700,
                    lineHeight: 1.25,
                  }}
                >
                  Certificate of Achievement
                </div>
                <div style={{ fontSize: 12, color: "#b91c1c", letterSpacing: 8, marginTop: 2 }}>❖ ❖ ❖</div>
              </div>

              {/* QR (left) */}
              {data.verifyUrl && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(data.verifyUrl)}`}
                  alt="verify"
                  crossOrigin="anonymous"
                  style={{ position: "absolute", top: 372, left: 46, width: 96, height: 96, border: "1px solid #0b2a6b", padding: 3, background: "#fff" }}
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
                    top: 362,
                    right: 46,
                    width: 110,
                    height: 130,
                    objectFit: "cover",
                    border: "2px solid #0b2a6b",
                  }}
                />
              )}

              {/* Accreditation logos: ISO, MSME, SSF — placed below QR, above Date of Issue */}
              <div
                style={{
                  position: "absolute",
                  left: 60,
                  top: 555,
                  width: 240,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <img src="/cert-logos/iso-9001.png" alt="ISO 9001:2015" crossOrigin="anonymous" style={{ height: 70, width: 70, objectFit: "contain" }} />
                  <img src="/cert-logos/msme-new.png" alt="MSME" crossOrigin="anonymous" style={{ height: 70, width: 70, objectFit: "contain" }} />
                  <img src="/cert-logos/ssf.png" alt="Samarth Shakti Foundation" crossOrigin="anonymous" style={{ height: 70, width: 70, objectFit: "contain" }} />
                </div>
              </div>

              {/* Body */}
              <div
                style={{
                  marginTop: 18,
                  padding: "0 90px",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#0a0a0a",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 14, color: "#374151", marginBottom: 4, letterSpacing: 0.5 }}>
                  This is to certify that
                </div>
                <div
                  style={{
                    fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                    fontSize: 42,
                    color: "#0b2a6b",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    margin: "2px auto 8px",
                    borderBottom: "1.5px solid #0b2a6b",
                    paddingBottom: 4,
                    maxWidth: 560,
                  }}
                >
                  {data.studentName}
                </div>
                <div style={{ textAlign: "justify", textAlignLast: "center", fontSize: 15, lineHeight: 1.85 }}>
                  {data.fatherName ? <>Son/Daughter of <b>{data.fatherName}</b></> : null}
                  {data.motherName ? <> and <b>{data.motherName}</b></> : null}
                  {(data.fatherName || data.motherName) ? ", " : ""}
                  has successfully completed the course of{" "}
                  <b>{data.course.certificateTitle}</b> at our Authorised Study Centre{" "}
                  <b>{data.centerName || "—"}</b>
                  {data.centerCode ? <> (Code:&nbsp;<b>{data.centerCode}</b>)</> : null}
                  {data.batch ? <>, Batch&nbsp;<b>{data.batch}</b></> : null}, during the period{" "}
                  <b>{periodFrom}</b> to <b>{periodTo}</b>, securing{" "}
                  <b>{data.percentage.toFixed(2)}%</b> marks with grade <b>{data.grade}</b>.
                </div>
              </div>

              {/* Footer: meta (left) + Chairman signature (right) */}
              <div
                style={{
                  position: "absolute",
                  bottom: 70,
                  left: 90,
                  right: 90,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: 40,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: "#0a0a0a",
                    lineHeight: 2,
                    paddingBottom: 6,
                    minWidth: 230,
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <span style={{ width: 110, color: "#374151" }}>Date of Issue</span>
                    <span style={{ marginRight: 6 }}>:</span>
                    <b>{awardedOn}</b>
                  </div>
                  <div style={{ display: "flex" }}>
                    <span style={{ width: 110, color: "#374151" }}>Place</span>
                    <span style={{ marginRight: 6 }}>:</span>
                    <b>{data.place || "—"}</b>
                  </div>
                </div>
                <div style={{ textAlign: "center", minWidth: 240 }}>
                  {data.directorSignUrl ? (
                    <img src={data.directorSignUrl} alt="sign" crossOrigin="anonymous" style={{ height: 48, objectFit: "contain" }} />
                  ) : (
                    <div style={{ height: 48, fontFamily: "'Brush Script MT', cursive", fontSize: 28, color: "#0b2a6b", lineHeight: "48px" }}>
                      Authorised
                    </div>
                  )}
                  <div style={{ borderTop: "1px solid #0a0a0a", paddingTop: 4, marginTop: 2, fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>
                    Chairman's Signature
                  </div>
                  <div style={{ fontSize: 11, color: "#374151", marginTop: 2 }}>
                    Samarth Shakti Foundation
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