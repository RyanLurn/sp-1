import { z } from "zod";

import {
  CHAT_MESSAGE_PART_STREAMING_STATE_LIST,
  CHAT_MESSAGE_ROLE_LIST,
} from "@/features/chat/constants";

export const ChatMessageIdSchema = z.uuidv7().brand<"ChatMessageId">();
export type ChatMessageId = z.infer<typeof ChatMessageIdSchema>;

export const ChatMessageRoleSchema = z.enum(CHAT_MESSAGE_ROLE_LIST);
export type ChatMessageRole = z.infer<typeof ChatMessageRoleSchema>;

export const ChatMessageTextPartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  state: z.enum(CHAT_MESSAGE_PART_STREAMING_STATE_LIST).exactOptional(),
});
export type ChatMessageTextPart = z.infer<typeof ChatMessageTextPartSchema>;

export const ChatMessageReasoningPartSchema = z.object({
  type: z.literal("reasoning"),
  id: z.string().exactOptional(),
  text: z.string(),
  state: z.enum(CHAT_MESSAGE_PART_STREAMING_STATE_LIST).exactOptional(),
  providerMetadata: z.record(z.string(), z.any()).exactOptional(),
});
export type ChatMessageReasoningPart = z.infer<
  typeof ChatMessageReasoningPartSchema
>;
