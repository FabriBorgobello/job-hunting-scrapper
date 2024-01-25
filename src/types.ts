import { z } from 'zod';

export const jobDescriptionSchema = z.object({
  company: z.string().nullable(),
  title: z.string().nullable(),
  techStack: z.string().nullable(),
  salaryRange: z.string().nullable(),
  seniority: z.string().nullable(),
  location: z.string().nullable(),
  ottaLink: z.string().url().nullable(),
  linkedInHR: z.string().url().nullable(),
});

export type JobDescription = z.infer<typeof jobDescriptionSchema>;
