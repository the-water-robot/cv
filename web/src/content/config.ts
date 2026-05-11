import { defineCollection, z } from "astro:content";

const periodSchema = z.object({
  from: z.union([z.string(), z.number()]),
  to: z.union([z.string(), z.number(), z.null()]).optional(),
});

const highlightsSchema = z.object({
  leadership: z.array(z.string()),
  engineering: z.array(z.string()),
});

const cvCollection = defineCollection({
  type: "data",
  schema: z.object({
    meta: z.object({
      language: z.enum(["it", "en"]),
      emphasis: z.enum(["leadership", "engineering", "hybrid"]),
      updated: z.string(),
    }),
    person: z.object({
      name: z.string(),
      title: z.string(),
      location: z.string(),
      email: z.string(),
      links: z.object({
        linkedin: z.string(),
        github: z.string(),
        website: z.string(),
      }),
    }),
    summary: z.string(),
    experience: z.array(
      z.object({
        period: periodSchema,
        role: z.string(),
        company: z.string(),
        location: z.string(),
        tags: z.array(z.string()).optional().default([]),
        highlights: highlightsSchema,
      }),
    ),
    education: z.array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        period: z.object({ from: z.number(), to: z.number() }),
        grade: z.string().optional(),
      }),
    ),
    skills: z.object({
      domains: z.array(z.string()),
      technologies: z.record(z.array(z.string())),
    }),
    projects: z.array(
      z.object({
        name: z.string(),
        url: z.string().optional(),
        role: z.string().optional(),
        description: z.string(),
        tags: z.array(z.string()).optional().default([]),
      }),
    ),
    languages: z.array(
      z.object({
        name: z.string(),
        level: z.string(),
      }),
    ),
  }),
});

export const collections = { cv: cvCollection };
