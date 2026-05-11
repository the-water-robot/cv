interface Props {
  pdfUrl: string;
  label: string;
  printLabel: string;
}

export function PrintButton({ pdfUrl, label, printLabel }: Props) {
  return (
    <div
      className="print-btn"
      style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}
    >
      <a
        href={pdfUrl}
        download
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          padding: "0.3rem 0.85rem",
          border: "1px solid var(--accent)",
          background: "var(--accent-dim)",
          color: "var(--accent)",
          fontSize: "0.72rem",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.05em",
          textDecoration: "none",
        }}
      >
        ↓ {label}
      </a>
      <button
        onClick={() => window.print()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          padding: "0.3rem 0.85rem",
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--text-dim)",
          fontSize: "0.72rem",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.05em",
          cursor: "pointer",
        }}
      >
        ⎙ {printLabel}
      </button>
    </div>
  );
}
