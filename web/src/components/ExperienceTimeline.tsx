import { useState } from "react";
import { FilterBar, type Emphasis } from "./FilterBar";

interface Period {
  from: string | number;
  to?: string | number | null;
}

interface Highlights {
  leadership: string[];
  engineering: string[];
}

interface Job {
  period: Period;
  role: string;
  company: string;
  location: string;
  tags?: string[];
  highlights: Highlights;
}

interface Props {
  jobs: Job[];
  defaultEmphasis: Emphasis;
  activeTag?: string | null;
  filterLabels: { hybrid: string; leadership: string; engineering: string };
}

function formatPeriod(p: Period, presentLabel: string): string {
  const to = p.to == null ? presentLabel : String(p.to);
  return `${p.from} – ${to}`;
}

function getBullets(job: Job, emphasis: Emphasis): string[] {
  if (emphasis === "leadership") return job.highlights.leadership;
  if (emphasis === "engineering") return job.highlights.engineering;
  const seen = new Set<string>();
  const all: string[] = [];
  for (const b of [...job.highlights.leadership, ...job.highlights.engineering]) {
    if (b && !seen.has(b)) {
      seen.add(b);
      all.push(b);
    }
  }
  return all;
}

export function ExperienceTimeline({
  jobs,
  defaultEmphasis,
  activeTag,
  filterLabels,
}: Props) {
  const [emphasis, setEmphasis] = useState<Emphasis>(defaultEmphasis);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const presentLabel = filterLabels.hybrid === "Entrambi" ? "presente" : "present";

  const visible = activeTag
    ? jobs.filter((j) => j.tags?.includes(activeTag))
    : jobs;

  return (
    <div>
      <FilterBar value={emphasis} onChange={setEmphasis} labels={filterLabels} />
      <div>
        {visible.map((job, i) => {
          const bullets = getBullets(job, emphasis).filter(Boolean);
          const isOpen = openIdx === i;
          return (
            <div
              key={`${job.company}-${job.period.from}`}
              className="exp-item"
              data-num={String(i + 1).padStart(2, "0")}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => setOpenIdx(isOpen ? null : i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenIdx(isOpen ? null : i);
                }
              }}
            >
              <div className="exp-header">
                <div>
                  <div className="exp-role">{job.role}</div>
                  <div className="exp-company">
                    {job.company}, {job.location}
                  </div>
                </div>
                <div className="exp-period">{formatPeriod(job.period, presentLabel)}</div>
              </div>
              {isOpen && bullets.length > 0 && (
                <ul className="exp-bullets">
                  {bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              )}
              {isOpen && job.tags && job.tags.length > 0 && (
                <div className="tag-group" style={{ marginTop: "0.5rem" }}>
                  {job.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
