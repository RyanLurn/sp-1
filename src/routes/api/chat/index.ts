import {
  chat,
  chatParamsFromRequest,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { createFileRoute } from "@tanstack/react-router";

import { groqTextAdapter } from "@/config/ai/groq";

export const Route = createFileRoute("/api/chat/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, threadId, runId } =
          await chatParamsFromRequest(request);

        const stream = chat({
          adapter: groqTextAdapter("openai/gpt-oss-120b"),
          messages,
          threadId,
          runId,
        });

        return toServerSentEventsResponse(stream);
      },
    },
  },
});
