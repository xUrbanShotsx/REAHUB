import { ImageResponse } from "next/og";

export const alt = "REAHUB, real estate compliance software for NSW agencies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#5170ff",
        color: "#ffffff",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
        REAHUB
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: -3,
          }}
        >
          Every closing file, cleared before the audit.
        </div>
        <div style={{ marginTop: 28, fontSize: 34, opacity: 0.9 }}>
          Compliance software for NSW real estate agencies
        </div>
      </div>
    </div>,
    size,
  );
}
