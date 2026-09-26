import type { UIMessage } from "ai";

import { safeValidateUIMessages } from "ai";
import { z } from "zod";

export const ChatMessageMetadataSchema = z.json();
export type ChatMessageMetadata = z.infer<typeof ChatMessageMetadataSchema>;

export const ChatMessageDataPartSchema = z.record(z.string(), z.json());
export type ChatMessageDataPart = z.infer<typeof ChatMessageDataPartSchema>;

export type ChatMessage = UIMessage<
  ChatMessageMetadata,
  ChatMessageDataPart,
  {}
>;

export async function safeValidateChatMessages({
  messages,
}: {
  messages: unknown;
}) {
  return safeValidateUIMessages<ChatMessage>({
    messages,
    metadataSchema: ChatMessageMetadataSchema.optional(),
  });
}
