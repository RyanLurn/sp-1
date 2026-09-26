import type { InferUITools, ToolSet, UIMessage } from "ai";

import { safeValidateUIMessages } from "ai";
import { z } from "zod";

export const ChatMessageMetadataSchema = z.json();
export type ChatMessageMetadata = z.infer<typeof ChatMessageMetadataSchema>;

export const ChatMessageDataPartSchema = z.object();
export type ChatMessageDataPart = z.infer<typeof ChatMessageDataPartSchema>;

export const tools = {} satisfies ToolSet;
export type ChatMessageTools = InferUITools<typeof tools>;

export type ChatMessage = UIMessage<
  ChatMessageMetadata,
  ChatMessageDataPart,
  ChatMessageTools
>;

export async function safeValidateChatMessages({
  messages,
}: {
  messages: unknown;
}) {
  return safeValidateUIMessages<ChatMessage>({
    messages,
    metadataSchema: ChatMessageMetadataSchema.optional(),
    tools,
  });
}
