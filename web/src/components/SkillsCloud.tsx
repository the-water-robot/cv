import { useState } from "react";

interface Props {
  technologies: Record<string, string[]>;
  onTagClick?: (tag: string | null) => void;
}

export function SkillsCloud({ technologies, onTagClick }: Props) {
  const [active, setActive] = useState<string | null>(null);

  function handleClick(tag: string) {
    const next = active === tag ? null : tag;
    setActive(next);
    onTagClick?.(next);
  }

  return (
    <div>
      {Object.entries(technologies).map(([group, items]) => (
        <div key={group} className="skills-group">
          <div className="skills-group-label">{group}</div>
          <div className="tag-group">
            {items.map((item) => (
              <button
                key={item}
                className={`tag${active === item ? " active" : ""}`}
                onClick={() => handleClick(item)}
                aria-pressed={active === item}
                style={{
                  background: "none",
                  font: "inherit",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
