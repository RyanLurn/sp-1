import { z } from "zod";

export const EnvSchema = z.object({
  GROQ_API_KEY: z.templateLiteral(["gsk_", z.string().min(1)]),
});

export const env = EnvSchema.parse(process.env);
