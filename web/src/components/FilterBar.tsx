// FilterBar is stateless — emphasis state lives in the parent (CVPage/ExperienceTimeline)

export type Emphasis = "hybrid" | "leadership" | "engineering";

interface Props {
  value: Emphasis;
  onChange: (v: Emphasis) => void;
  labels: { hybrid: string; leadership: string; engineering: string };
}

export function FilterBar({ value, onChange, labels }: Props) {
  const options: Emphasis[] = ["hybrid", "leadership", "engineering"];
  return (
    <div
      className="filter-bar"
      role="group"
      aria-label="Emphasis filter"
      style={{
        display: "flex",
        gap: "0.5rem",
        padding: "0.75rem 0",
        borderBottom: "1px solid var(--color-border)",
        marginBottom: "1rem",
        flexWrap: "wrap",
      }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
          style={{
            padding: "0.35rem 1rem",
            borderRadius: "999px",
            border: "1px solid",
            cursor: "pointer",
            fontSize: "0.82rem",
            fontWeight: 500,
            transition: "all 0.15s",
            background: value === opt ? "var(--color-accent)" : "transparent",
            color: value === opt ? "#fff" : "var(--color-text-muted)",
            borderColor: value === opt ? "var(--color-accent)" : "var(--color-border)",
          }}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}
