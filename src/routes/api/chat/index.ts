import type { UIMessage } from "ai";

import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";

import { groqProvider } from "@/config/ai/groq";

export const Route = createFileRoute("/api/chat/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages }: { messages: UIMessage[] } = await request.json();

        const { stream } = streamText({
          model: groqProvider("openai/gpt-oss-20b"),
          messages: await convertToModelMessages(messages),
        });

        return createUIMessageStreamResponse({
          stream: toUIMessageStream({ stream }),
        });
      },
    },
  },
});
