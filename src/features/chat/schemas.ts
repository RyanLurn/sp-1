import type { UIMessage } from "ai";

import { safeValidateUIMessages } from "ai";
import { z } from "zod";

export const ChatMessageMetadataSchema = z.union([z.undefined(), z.json()]);
export type ChatMessageMetadata = z.infer<typeof ChatMessageMetadataSchema>;

export type ChatMessage = UIMessage<ChatMessageMetadata, {}, {}>;

export async function safeValidateChatMessages({
  messages,
}: {
  messages: unknown;
}) {
  return safeValidateUIMessages<ChatMessage>({
    messages,
    metadataSchema: ChatMessageMetadataSchema,
  });
}
