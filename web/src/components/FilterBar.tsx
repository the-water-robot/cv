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
    <div className="filter-bar" role="group" aria-label="Emphasis filter">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
          style={{
            padding: "0.25rem 0.85rem",
            border: "1px solid",
            cursor: "pointer",
            fontSize: "0.72rem",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.06em",
            transition: "all 0.12s",
            background: value === opt ? "var(--accent-dim)" : "transparent",
            color: value === opt ? "var(--accent)" : "var(--text-dim)",
            borderColor: value === opt ? "var(--accent)" : "var(--border)",
          }}
        >
          {value === opt ? `[${labels[opt]}]` : labels[opt]}
        </button>
      ))}
    </div>
  );
}
