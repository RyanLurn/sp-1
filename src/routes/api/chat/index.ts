import { HTTP_ERROR_RESPONSE_STATUS_RECORD } from "@little-nebulae/http";
import { parseJsonRequestBody } from "@little-nebulae/web-fetch";
import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";

import type { ChatMessage } from "@/features/chat/schemas";

import { groqProvider } from "@/config/ai/groq";
import { insertOneChatMessage } from "@/db/queries/chat-message/insert-one.server";
import { selectAllChatMessages } from "@/db/queries/chat-message/select-all.server";
import { SendMessageRequestBodySchema } from "@/features/chat/schemas";

export const Route = createFileRoute("/api/chat/")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Parse and validate the request's body to get the new user message
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

        // Insert the new user message into the database
        const insertResult = await insertOneChatMessage({
          insertedChatMessage: newUserMessage,
        });
        if (!insertResult.success) {
          const error = insertResult.error;
          console.error(error);
          const httpError =
            HTTP_ERROR_RESPONSE_STATUS_RECORD.INTERNAL_SERVER_ERROR;
          return new Response(error.message, {
            status: httpError.code,
            statusText: httpError.text,
          });
        }

        // Select all chat messages (including the newly inserted one)
        const selectResult = await selectAllChatMessages();
        if (!selectResult.success) {
          const error = selectResult.error;
          console.error(error);
          const httpError =
            HTTP_ERROR_RESPONSE_STATUS_RECORD.INTERNAL_SERVER_ERROR;
          return new Response(error.message, {
            status: httpError.code,
            statusText: httpError.text,
          });
        }
        const chatMessages = selectResult.data;

        // Stream AI response
        const { stream } = streamText({
          model: groqProvider("openai/gpt-oss-20b"),
          messages: await convertToModelMessages<ChatMessage>(chatMessages),
        });

        return createUIMessageStreamResponse({
          stream: toUIMessageStream({
            stream,
            originalMessages: chatMessages,
            onEnd: async ({ responseMessage }) => {
              const insertResult = await insertOneChatMessage({
                insertedChatMessage: responseMessage,
              });
              if (!insertResult.success) {
                const error = insertResult.error;
                console.error(error);
              }
            },
          }),
        });
      },
    },
  },
});
