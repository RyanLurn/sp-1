import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type {
  InferUITools,
  TextUIPart,
  ToolSet,
  UIMessage,
  UIMessagePart,
} from "ai";

import { safeValidateUIMessages } from "ai";
import { z } from "zod";

export const ChatMessageMetadataSchema = z.json();
export type ChatMessageMetadata = z.infer<typeof ChatMessageMetadataSchema>;

export const ChatMessageDataPartSchema = z.object();
export type ChatMessageDataPart = z.infer<typeof ChatMessageDataPartSchema>;

export const tools = {} satisfies ToolSet;
export type ChatMessageTools = InferUITools<typeof tools>;

export type ChatMessagePart = Extract<
  UIMessagePart<ChatMessageDataPart, ChatMessageTools>,
  TextUIPart
>;

export type ChatMessage = OmitKnownKeys<
  UIMessage<ChatMessageMetadata, ChatMessageDataPart, ChatMessageTools>,
  "parts"
> & {
  parts: ChatMessagePart[];
};

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
