import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  // Loader mới sẽ tự động quét toàn bộ file .md trong thư mục projects
  loader: glob({ pattern: "**/*.md", base: "src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    category: z.enum(['game', 'tool', 'script']),
    featured: z.boolean().default(false),
    publishDate: z.coerce.date(),
  })
});

const students = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/students" }),
  schema: z.object({
    studentName: z.string(),
    age: z.number(),
    title: z.string(),
    techStack: z.array(z.string()),
    mentorNote: z.string().optional(),
    featured: z.boolean().default(false),
    publishDate: z.coerce.date(),
  })
});

const knowledge = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/knowledge" }),
  schema: z.object({
    title: z.string(),
    category: z.string().optional().default('General'),
    description: z.string().optional().default(''),
    tags: z.array(z.string()).default([]),
    techStack: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    publishDate: z.coerce.date(),
    stage: z.enum(['seed', 'sapling', 'evergreen']).default('seed'),
  })
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    stage: z.enum(['seed', 'sapling', 'evergreen']).default('seed'),
  })
});

export const collections = { projects, students, knowledge, blog };