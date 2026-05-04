import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "رحلة الفيلسوف - اختبار الفلسفة للباكالوريا";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#000000",
          color: "white",
          fontFamily: "Arial, sans-serif",
          direction: "rtl",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(6,182,212,0.35), transparent 32%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.38), transparent 34%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 48,
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 44,
            background: "rgba(255,255,255,0.045)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            padding: "70px",
            boxShadow: "0 30px 100px rgba(0,0,0,0.55)",
          }}
        >
          <div style={{ fontSize: 34, color: "#67e8f9", marginBottom: 18 }}>
            تطبيق تعليمي مجاني لتلاميذ المغرب
          </div>
          <div
            style={{
              fontSize: 86,
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1.05,
              background: "linear-gradient(90deg, #22d3ee, #a78bfa, #f0abfc)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 26,
            }}
          >
            رحلة الفيلسوف
          </div>
          <div style={{ fontSize: 42, color: "#f8fafc", lineHeight: 1.35, maxWidth: 850 }}>
            اختبر معرفتك في الفلسفة للباكالوريا مع نقاط، مستويات، ومراجعة للأخطاء
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
            {["349 سؤال", "مراجعة الأخطاء", "يعمل بدون إنترنت"].map((label) => (
              <div
                key={label}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(103,232,249,0.35)",
                  background: "rgba(6,182,212,0.14)",
                  padding: "14px 24px",
                  fontSize: 24,
                  color: "#cffafe",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 74, bottom: 62, fontSize: 28, color: "#94a3b8" }}>
          zeos-2bac-philo-trivia.vercel.app
        </div>
      </div>
    ),
    size
  );
}
