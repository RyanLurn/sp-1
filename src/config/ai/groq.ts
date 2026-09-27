import { createGroq } from "@ai-sdk/groq";

import { env } from "@/config/env.server";

export const groqProvider = createGroq({ apiKey: env.GROQ_API_KEY });
