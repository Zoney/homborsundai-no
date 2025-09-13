import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  const title = "Homborsund AI";
  const subtitle =
    "Experience raw, honest dialogue in an intimate setting. No corporate fluff, just genuine passion for AI's potential.";

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
            "linear-gradient(135deg, #0a3a43 0%, #7b4b56 50%, #f8b3b1 100%)",
          color: "white",
          textAlign: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.1,
            textShadow: "0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            opacity: 0.9,
            maxWidth: 1000,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    size
  );
}
