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
    return (
      <div
        ref={ref}
        style={{
          width: "1123px",
          height: "794px",
          background: "linear-gradient(135deg, #fffaf0 0%, #fef3c7 50%, #fffaf0 100%)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#1a1a1a",
          position: "relative",
          padding: "30px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Corner ornaments */}
        <CornerOrnament position="tl" />
        <CornerOrnament position="tr" />
        <CornerOrnament position="bl" />
        <CornerOrnament position="br" />

        {/* Watermark logo */}
        <img
          src="/favicon.png"
          alt=""
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            opacity: 0.05,
            pointerEvents: "none",
          }}
        />

        {/* Decorative gold border */}
        <div
          style={{
            border: "6px double #b8860b",
            outline: "2px solid #d4af37",
            outlineOffset: "6px",
            borderRadius: "12px",
            height: "100%",
            padding: "30px 60px",
            position: "relative",
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.4)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "10px" }}>
            <img src="/favicon.png" alt="logo" style={{ width: 80, height: 80, objectFit: "contain" }} crossOrigin="anonymous" />
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: "34px", margin: 0, color: "#7c2d12", fontWeight: 700, letterSpacing: "1px" }}>
                SAMARTH SHAKTI FOUNDATION
              </h1>
              <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontStyle: "italic" }}>
                Registered under Govt. of India | An ISO Certified Organization
              </p>
            </div>
          </div>

          <div style={{ borderTop: "2px solid #b8860b", margin: "10px 0" }} />

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <h2 style={{ fontSize: "28px", margin: 0, color: "#b8860b", fontWeight: 700, letterSpacing: "4px" }}>
              CERTIFICATE OF COMPLETION
            </h2>
            <p style={{ fontSize: "14px", color: "#4b5563", marginTop: "4px" }}>
              Certificate No: <b>{data.certificateNumber}</b> &nbsp;|&nbsp; Student ID: <b>{data.studentId}</b>
              {data.batch ? <> &nbsp;|&nbsp; Batch: <b>{data.batch}</b></> : null}
            </p>
          </div>

          {/* Photo */}
          {data.photoUrl && (
            <img
              src={data.photoUrl}
              alt="student"
              crossOrigin="anonymous"
              style={{
                position: "absolute",
                top: "120px",
                right: "70px",
                width: "110px",
                height: "130px",
                objectFit: "cover",
                border: "3px solid #b8860b",
                borderRadius: "4px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            />
          )}

          {/* Body */}
          <div style={{ marginTop: "30px", textAlign: "center", padding: "0 60px", lineHeight: 1.8 }}>
            <p style={{ fontSize: "18px" }}>This is to certify that</p>
            <h3 style={{ fontSize: "34px", color: "#7c2d12", margin: "10px 0", borderBottom: "2px dashed #b8860b", display: "inline-block", padding: "0 40px", fontFamily: "'Brush Script MT', cursive" }}>
              {data.studentName}
            </h3>
            <p style={{ fontSize: "15px", marginTop: "12px" }}>
              Son/Daughter of <b>{data.fatherName || "—"}</b> and <b>{data.motherName || "—"}</b>
              {data.dob ? <> &nbsp;·&nbsp; DOB: <b>{data.dob}</b></> : null}
            </p>
            <p style={{ fontSize: "15px" }}>
              has successfully completed the course
            </p>
            <h4 style={{ fontSize: "26px", color: "#b8860b", margin: "6px 0", fontWeight: 700 }}>
              {data.course.certificateTitle}
            </h4>
            <p style={{ fontSize: "15px" }}>
              of duration <b>{data.course.duration}</b>, securing <b>{data.percentage.toFixed(2)}%</b> with grade <b>{data.grade}</b>.
            </p>
            {(data.centerName || data.centerCode) && (
              <p style={{ fontSize: "13px", color: "#4b5563", marginTop: 4 }}>
                Examination conducted at <b>{data.centerName}</b>{data.centerCode ? ` (Code: ${data.centerCode})` : ""}
              </p>
            )}
          </div>

          {/* Footer */}
          <div style={{ position: "absolute", bottom: "50px", left: "60px", right: "60px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ textAlign: "center" }}>
              {data.verifyUrl && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(data.verifyUrl)}`}
                  alt="verify"
                  crossOrigin="anonymous"
                  style={{ width: 80, height: 80, marginBottom: 4 }}
                />
              )}
              <p style={{ fontSize: "10px", margin: 0, color: "#6b7280" }}>Scan to verify</p>
              <p style={{ fontSize: "13px", margin: 0, color: "#374151" }}>
                Date: <b>{data.issueDate}</b>
              </p>
              <p style={{ fontSize: "13px", margin: 0, color: "#374151" }}>
                Place: <b>{data.place}</b>
              </p>
            </div>
            {data.sealUrl && (
              <div style={{ textAlign: "center" }}>
                <img src={data.sealUrl} alt="seal" crossOrigin="anonymous" style={{ width: 100, height: 100, opacity: 0.9 }} />
                <p style={{ fontSize: 10, margin: 0, color: "#6b7280" }}>Official Seal</p>
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              {data.directorSignUrl && (
                <img src={data.directorSignUrl} alt="sign" crossOrigin="anonymous" style={{ height: 50, objectFit: "contain", marginBottom: 4 }} />
              )}
              <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 4, minWidth: 180 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>Director</p>
                <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>Samarth Shakti Foundation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CertificateTemplate.displayName = "CertificateTemplate";

const CornerOrnament = ({ position }: { position: "tl" | "tr" | "bl" | "br" }) => {
  const map: Record<string, React.CSSProperties> = {
    tl: { top: 10, left: 10, borderTop: "4px solid #b8860b", borderLeft: "4px solid #b8860b" },
    tr: { top: 10, right: 10, borderTop: "4px solid #b8860b", borderRight: "4px solid #b8860b" },
    bl: { bottom: 10, left: 10, borderBottom: "4px solid #b8860b", borderLeft: "4px solid #b8860b" },
    br: { bottom: 10, right: 10, borderBottom: "4px solid #b8860b", borderRight: "4px solid #b8860b" },
  };
  return <div style={{ position: "absolute", width: 40, height: 40, ...map[position] }} />;
};