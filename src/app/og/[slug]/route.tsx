import { ImageResponse } from "next/og";
import { guideBySlug } from "@/lib/guides";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        color: "#0f1b33",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 36,
          fontWeight: 800,
        }}
      >
        <span style={{ color: "#5170ff" }}>REAHUB</span>
        <span style={{ fontSize: 28, fontWeight: 600, color: "#5b6b88" }}>
          {guide?.category ?? "Guide"}
        </span>
      </div>
      <div
        style={{
          fontSize: 74,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -2,
        }}
      >
        {guide?.h1 ?? "Compliance guide"}
      </div>
      <div style={{ fontSize: 30, color: "#5b6b88" }}>
        Compliance guides for NSW real estate agencies
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
