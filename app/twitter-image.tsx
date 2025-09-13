import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
  const title = "Homborsund AI";
  const subtitle = "Summits on agents, robotics, and tools.";

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%), linear-gradient(135deg, #0a3a43 0%, #7b4b56 100%)",
          color: "white",
          textAlign: "center",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ marginTop: 20, fontSize: 34, opacity: 0.9 }}>{subtitle}</div>
      </div>
    ),
    size
  );
}
