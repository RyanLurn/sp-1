import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type { GROQ_CHAT_MODELS, GroqTextConfig } from "@tanstack/ai-groq";

import { createGroqText } from "@tanstack/ai-groq";

import { env } from "@/config/env";

export function groqTextAdapter<
  TModel extends (typeof GROQ_CHAT_MODELS)[number],
>(model: TModel, config?: OmitKnownKeys<GroqTextConfig, "apiKey">) {
  return createGroqText(model, env.GROQ_API_KEY, config);
}
