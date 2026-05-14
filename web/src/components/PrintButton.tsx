interface Props {
  pdfUrl: string;
  label: string;
  printLabel: string;
}

export function PrintButton({ pdfUrl, label, printLabel }: Props) {
  return (
    <div
      className="print-btn"
      style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.25rem" }}
    >
      <a
        href={pdfUrl}
        download
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.45rem 1rem",
          border: "1px solid var(--accent)",
          background: "var(--accent)",
          color: "var(--bg)",
          fontSize: "0.75rem",
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          letterSpacing: "0.04em",
          textDecoration: "none",
          borderRadius: "2px",
          transition: "opacity 0.15s",
        }}
      >
        ↓ {label}
      </a>
      <button
        onClick={() => window.print()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.45rem 1rem",
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--text-dim)",
          fontSize: "0.75rem",
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          letterSpacing: "0.04em",
          cursor: "pointer",
          borderRadius: "2px",
        }}
      >
        ⎙ {printLabel}
      </button>
    </div>
  );
}
