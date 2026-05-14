export type Emphasis = "hybrid" | "leadership" | "engineering";

interface Props {
  value: Emphasis;
  onChange: (v: Emphasis) => void;
  labels: { hybrid: string; leadership: string; engineering: string };
}

export function FilterBar({ value, onChange, labels }: Props) {
  const options: Emphasis[] = ["hybrid", "leadership", "engineering"];
  return (
    <div className="filter-bar" role="group" aria-label="Emphasis filter">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            aria-pressed={active}
            style={{
              padding: "0.3rem 0.85rem",
              border: "1px solid",
              cursor: "pointer",
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              letterSpacing: "0.05em",
              transition: "all 0.12s",
              borderRadius: "2px",
              background: active ? "var(--accent)" : "transparent",
              color: active ? "var(--bg)" : "var(--text-dim)",
              borderColor: active ? "var(--accent)" : "var(--border)",
            }}
          >
            {labels[opt]}
          </button>
        );
      })}
    </div>
  );
}
