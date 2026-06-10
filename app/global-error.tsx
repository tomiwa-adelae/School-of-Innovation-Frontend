"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#0a0a0a", color: "#fff" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "5rem", fontWeight: 900, color: "#ef4444", margin: 0 }}>
            500
          </p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "1rem 0 0.5rem" }}>
            Critical error
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "2rem" }}>
            A critical application error occurred.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "10px 24px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
