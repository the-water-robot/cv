interface Props {
  pdfUrl: string;
  label: string;
  printLabel: string;
}

export function PrintButton({ pdfUrl, label, printLabel }: Props) {
  return (
    <div
      className="print-btn"
      style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}
    >
      <a
        href={pdfUrl}
        download
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.4rem 1rem",
          borderRadius: "var(--radius-sm)",
          background: "var(--color-accent)",
          color: "#fff",
          fontSize: "0.875rem",
          fontWeight: 500,
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
          gap: "0.35rem",
          padding: "0.4rem 1rem",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--color-border)",
          background: "transparent",
          color: "var(--color-text)",
          fontSize: "0.875rem",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        ⎙ {printLabel}
      </button>
    </div>
  );
}
