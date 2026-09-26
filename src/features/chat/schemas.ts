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

export const ChatMessageIdSchema = z.uuidv7().brand<"ChatMessageId">();
export type ChatMessageId = z.infer<typeof ChatMessageIdSchema>;

export const ChatMessageTextPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  state: z.enum(["streaming", "done"]).exactOptional(),
});
export type ChatMessageTextPart = z.infer<typeof ChatMessageTextPartSchema>;

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
