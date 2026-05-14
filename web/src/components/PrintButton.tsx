interface Props {
  pdfUrl: string;
  label: string;
}

export function PrintButton({ pdfUrl, label }: Props) {
  return (
    <div className="print-btn" style={{ marginTop: "1.25rem" }}>
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
    </div>
  );
}
