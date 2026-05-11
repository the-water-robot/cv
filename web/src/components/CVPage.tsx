/**
 * Top-level React island that wires FilterBar, ExperienceTimeline, and SkillsCloud
 * with shared state. Rendered client-side.
 */
import { useState } from "react";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { type Emphasis } from "./FilterBar";
import { PrintButton } from "./PrintButton";
import { SkillsCloud } from "./SkillsCloud";

interface CVData {
  meta: { emphasis: Emphasis };
  person: {
    name: string;
    title: string;
    location: string;
    email: string;
    links: { linkedin: string; github: string; website: string };
  };
  summary: string;
  experience: Array<{
    period: { from: string | number; to?: string | number | null };
    role: string;
    company: string;
    location: string;
    tags?: string[];
    highlights: { leadership: string[]; engineering: string[] };
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: { from: number; to: number };
    grade?: string;
  }>;
  skills: { domains: string[]; technologies: Record<string, string[]> };
  projects: Array<{ name: string; url?: string; role?: string; description: string; tags?: string[] }>;
  languages: Array<{ name: string; level: string }>;
}

interface Labels {
  filterLabels: { hybrid: string; leadership: string; engineering: string };
  sectionExperience: string;
  sectionSkills: string;
  sectionDomains: string;
  sectionEducation: string;
  sectionProjects: string;
  sectionLanguages: string;
  downloadPdf: string;
  printFriendly: string;
}

interface Props {
  data: CVData;
  pdfUrl: string;
  labels: Labels;
}

export function CVPage({ data, pdfUrl, labels }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="cv-hero container">
        <h1>{data.person.name}</h1>
        <div className="title">{data.person.title}</div>
        <div className="meta-row">
          <span>{data.person.location}</span>
          {!data.person.email.startsWith("<") && (
            <a href={`mailto:${data.person.email}`}>{data.person.email}</a>
          )}
          {!data.person.links.linkedin.startsWith("<") && (
            <a href={`https://linkedin.com/in/${data.person.links.linkedin}`} rel="noopener noreferrer">LinkedIn</a>
          )}
          {!data.person.links.github.startsWith("<") && (
            <a href={`https://github.com/${data.person.links.github}`} rel="noopener noreferrer">GitHub</a>
          )}
          {!data.person.links.website.startsWith("<") && (
            <a href={data.person.links.website} rel="noopener noreferrer">Website</a>
          )}
        </div>
        <PrintButton pdfUrl={pdfUrl} label={labels.downloadPdf} printLabel={labels.printFriendly} />
      </section>

      {/* Summary */}
      <section className="cv-summary container">
        <p>{data.summary.trim()}</p>
      </section>

      {/* Body */}
      <div className="cv-body container">
        {/* Left: Experience */}
        <section>
          <h2 className="section-title">{labels.sectionExperience}</h2>
          <ExperienceTimeline
            jobs={data.experience}
            defaultEmphasis={data.meta.emphasis}
            activeTag={activeTag}
            filterLabels={labels.filterLabels}
          />
        </section>

        {/* Right: Skills + Education + Projects + Languages */}
        <aside>
          <section style={{ marginBottom: "2rem" }}>
            <h2 className="section-title">{labels.sectionSkills}</h2>
            <div style={{ marginBottom: "1rem" }}>
              <div className="skills-group-label">{labels.sectionDomains}</div>
              <div className="tag-group">
                {data.skills.domains.map((d) => (
                  <span key={d} className="tag">{d}</span>
                ))}
              </div>
            </div>
            <SkillsCloud technologies={data.skills.technologies} onTagClick={setActiveTag} />
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 className="section-title">{labels.sectionEducation}</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="edu-item">
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-meta">
                  {edu.institution} · {edu.period.from}–{edu.period.to}
                  {edu.grade && ` · ${edu.grade}`}
                </div>
              </div>
            ))}
          </section>

          <section style={{ marginBottom: "2rem" }}>
            <h2 className="section-title">{labels.sectionProjects}</h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: "0.85rem" }}>
                <div style={{ fontWeight: 600, fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text)" }}>
                  {proj.url && !proj.url.startsWith("<") ? (
                    <a href={proj.url} rel="noopener noreferrer">{proj.name}</a>
                  ) : proj.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                  {proj.description}
                </div>
              </div>
            ))}
          </section>

          <section>
            <h2 className="section-title">{labels.sectionLanguages}</h2>
            {data.languages.map((l) => (
              <div key={l.name} style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono)", marginBottom: "0.4rem" }}>
                <span style={{ color: "var(--text)" }}>{l.name}</span>{" "}
                <span style={{ color: "var(--text-faint)" }}>{"// "}{l.level}</span>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </>
  );
}
