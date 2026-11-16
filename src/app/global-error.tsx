"use client";

/** Last-resort screen when the root layout itself fails. It brings its own document and inline styles. */
export default function GlobalError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html lang="en-AU">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#ffffff",
          color: "#1b2540",
          textAlign: "center",
          padding: 24,
        }}
      >
        <title>Something went wrong | REAHUB</title>
        <div>
          <p
            style={{
              color: "#5170ff",
              fontWeight: 800,
              fontSize: 22,
              margin: 0,
            }}
          >
            REAHUB
          </p>
          <h1 style={{ fontSize: 32, margin: "16px 0 8px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#5b6b88", margin: "0 0 24px" }}>
            REAHUB couldn&apos;t load. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              background: "#5170ff",
              color: "#fff",
              border: 0,
              borderRadius: 999,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
