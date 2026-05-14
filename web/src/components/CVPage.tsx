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
  projects: Array<{
    name: string;
    url?: string;
    role?: string;
    description: string;
    tags?: string[];
  }>;
  languages: Array<{ name: string; level: string }>;
  beyond_work?: Array<{
    title: string;
    description: string;
    url?: string;
    period?: string;
  }>;
}

interface Labels {
  filterLabels: { hybrid: string; leadership: string; engineering: string };
  sectionExperience: string;
  sectionSkills: string;
  sectionDomains: string;
  sectionEducation: string;
  sectionProjects: string;
  sectionLanguages: string;
  sectionBeyond: string;
  downloadPdf: string;
}

interface Props {
  data: CVData;
  pdfUrl: string;
  labels: Labels;
}

function cleanUrl(s?: string): string | undefined {
  if (!s) return undefined;
  if (s.startsWith("<")) return undefined;
  return s;
}

export function CVPage({ data, pdfUrl, labels }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const email = cleanUrl(data.person.email);
  const linkedin = cleanUrl(data.person.links.linkedin);
  const github = cleanUrl(data.person.links.github);
  const website = cleanUrl(data.person.links.website);

  return (
    <>
      {/* Hero */}
      <section className="cv-hero container">
        <h1>{data.person.name}</h1>
        <div className="title">{data.person.title}</div>
        <div className="meta-row">
          <span>{data.person.location}</span>
          {email && <a href={`mailto:${email}`}>{email}</a>}
          {linkedin && (
            <a href={`https://linkedin.com/in/${linkedin}`} rel="noopener noreferrer">
              linkedin/{linkedin}
            </a>
          )}
          {github && (
            <a href={`https://github.com/${github}`} rel="noopener noreferrer">
              github/{github}
            </a>
          )}
          {website && (
            <a href={website} rel="noopener noreferrer">
              {website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
        <PrintButton pdfUrl={pdfUrl} label={labels.downloadPdf} />
      </section>

      {/* Summary */}
      <section className="cv-summary container">
        <p>{data.summary.trim()}</p>
      </section>

      {/* Body */}
      <div className="cv-body container">
        {/* Left: Experience + Beyond work */}
        <section>
          <h2 className="section-title">{labels.sectionExperience}</h2>
          <ExperienceTimeline
            jobs={data.experience}
            defaultEmphasis={data.meta.emphasis}
            activeTag={activeTag}
            filterLabels={labels.filterLabels}
          />

          {data.beyond_work && data.beyond_work.length > 0 && (
            <section style={{ marginTop: "2.5rem" }}>
              <h2 className="section-title">{labels.sectionBeyond}</h2>
              {data.beyond_work.map((b, i) => (
                <div key={i} className="beyond-item">
                  <div className="beyond-title">
                    {b.url && !b.url.startsWith("<") ? (
                      <a href={b.url} rel="noopener noreferrer">{b.title}</a>
                    ) : b.title}
                  </div>
                  <div className="beyond-desc">{b.description.trim()}</div>
                </div>
              ))}
            </section>
          )}
        </section>

        {/* Right: Skills + Projects + Education + Languages */}
        <aside>
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 className="section-title">{labels.sectionSkills}</h2>
            <div className="skills-group">
              <div className="skills-group-label">{labels.sectionDomains}</div>
              <div className="tag-group">
                {data.skills.domains.map((d) => (
                  <span key={d} className="tag">{d}</span>
                ))}
              </div>
            </div>
            <SkillsCloud technologies={data.skills.technologies} onTagClick={setActiveTag} />
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 className="section-title">{labels.sectionProjects}</h2>
            {data.projects.map((proj, i) => {
              const url = cleanUrl(proj.url);
              return (
                <div key={i} className="project-item">
                  <div className="project-name">
                    {url ? (
                      <a href={url} rel="noopener noreferrer">{proj.name}</a>
                    ) : proj.name}
                  </div>
                  {proj.role && <div className="project-meta">{proj.role}</div>}
                  <div className="project-desc">{proj.description.trim()}</div>
                </div>
              );
            })}
          </section>

          <section style={{ marginBottom: "2.5rem" }}>
            <h2 className="section-title">{labels.sectionEducation}</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="edu-item">
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-meta">
                  {edu.institution} {"//"} {edu.period.from}–{edu.period.to}
                  {edu.grade && ` // ${edu.grade}`}
                </div>
              </div>
            ))}
          </section>

          <section>
            <h2 className="section-title">{labels.sectionLanguages}</h2>
            {data.languages.map((l) => (
              <div key={l.name} className="lang-row">
                <span className="lang-name">{l.name}</span>
                <span className="lang-level">{l.level}</span>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </>
  );
}
