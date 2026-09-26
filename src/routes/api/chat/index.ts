import { HTTP_ERROR_RESPONSE_STATUS_RECORD } from "@little-nebulae/http";
import { parseJsonRequestBody } from "@little-nebulae/web-fetch";
import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { z } from "zod";

import { groqProvider } from "@/config/ai/groq";
import { db } from "@/db";
import {
  safeValidateChatMessages,
  SendMessageRequestBodySchema,
} from "@/features/chat/schemas";

export const Route = createFileRoute("/api/chat/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Parse and validate the request's body to get the messages array
        const parseRequestBodyResult = await parseJsonRequestBody({ request });
        if (!parseRequestBodyResult.success) {
          const error = parseRequestBodyResult.error;
          console.error(error);
          const httpError = HTTP_ERROR_RESPONSE_STATUS_RECORD.BAD_REQUEST;
          return new Response(error.message, {
            status: httpError.code,
            statusText: httpError.text,
          });
        }
        const jsonBody = parseRequestBodyResult.data;

        const parseJsonBodyResult =
          SendMessageRequestBodySchema.safeParse(jsonBody);
        if (!parseJsonBodyResult.success) {
          const error = parseJsonBodyResult.error;
          console.error(error);
          const httpError = HTTP_ERROR_RESPONSE_STATUS_RECORD.BAD_REQUEST;
          return new Response(error.message, {
            status: httpError.code,
            statusText: httpError.text,
          });
        }
        const { newUserMessage } = parseJsonBodyResult.data;

        const validateMessagesResult = await safeValidateChatMessages({
          messages,
        });
        if (!validateMessagesResult.success) {
          const error = validateMessagesResult.error;
          console.error(error);
          const httpError = HTTP_ERROR_RESPONSE_STATUS_RECORD.BAD_REQUEST;
          return new Response(error.message, {
            status: httpError.code,
            statusText: httpError.text,
          });
        }
        const validMessages = validateMessagesResult.data;

        // Stream AI response
        const { stream } = streamText({
          model: groqProvider("openai/gpt-oss-20b"),
          messages: await convertToModelMessages(validMessages),
        });

        return createUIMessageStreamResponse({
          stream: toUIMessageStream({ stream }),
        });
      },
    },
  },
});
