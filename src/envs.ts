import { z } from 'zod';

export const envSchema = z.object({
  SPREADSHEET_ID: z.string(),
  SHEET_NAME: z.string().default('Sheet1'),
  OTTA_EMAIL: z.string().email(),
  OTTA_PASSWORD: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
