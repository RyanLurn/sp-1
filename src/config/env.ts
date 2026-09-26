import { z } from "zod";

export const EnvSchema = z.object({
  DB_FILE_PATH: z.templateLiteral([z.string().min(1), ".sqlite"]),
  GROQ_API_KEY: z.templateLiteral(["gsk_", z.string().min(1)]),
});

export const env = EnvSchema.parse(process.env);
