import { ImageResponse } from "next/og";

export const alt = "Wearlivo — Wear What’s Next";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f5f1ea",
          color: "#191919",
          display: "flex",
          height: "100%",
          padding: "58px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid #191919",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "54px 62px",
            position: "relative",
          }}
        >
          <div
            style={{
              background: "#7a263a",
              display: "flex",
              height: "14px",
              position: "absolute",
              right: "62px",
              top: "62px",
              width: "180px",
            }}
          />
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "86px",
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            WEARLIVO
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#7a263a",
                fontFamily: "Arial, sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Fashion editorial
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "72px",
                lineHeight: 1,
                marginTop: "20px",
              }}
            >
              Wear What’s Next
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
