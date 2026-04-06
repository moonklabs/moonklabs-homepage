import { ImageResponse } from "next/og";
export const dynamic = "force-static";

export const alt = "뭉클랩 — 기업을 위한 AI 에이전트·LLM 엔지니어링 스튜디오";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #050505 0%, #0d0d0d 55%, #1b1039 100%)",
          color: "white",
          padding: "56px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#c4b5fd" }}>
          <div style={{ width: 12, height: 12, borderRadius: 9999, background: "#8b5cf6" }} />
          MOONKLABS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 920 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
            }}
          >
            <span>기업을 위한</span>
            <span>AI 에이전트 · LLM 엔지니어링</span>
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.45, color: "#d4d4d8" }}>
            AI 에이전트, LLM 시스템, MCP 기반 내부 툴링을 설계·구축·운영하는
            엔지니어링 스튜디오
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#a1a1aa" }}>moonklabs.com</div>
      </div>
    ),
    size,
  );
}
