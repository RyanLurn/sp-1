import { z } from "zod";

import {
  CHAT_MESSAGE_ASSISTANT_ROLE,
  CHAT_MESSAGE_PART_STREAMING_STATE_LIST,
  CHAT_MESSAGE_PART_TYPE_KEY,
  CHAT_MESSAGE_ROLE_KEY,
  CHAT_MESSAGE_ROLE_LIST,
  CHAT_MESSAGE_SYSTEM_ROLE,
  CHAT_MESSAGE_USER_ROLE,
} from "@/features/chat/constants";

export const ChatMessageIdSchema = z.uuidv7().brand<"ChatMessageId">();
export type ChatMessageId = z.infer<typeof ChatMessageIdSchema>;

export const ChatMessageRoleSchema = z.enum(CHAT_MESSAGE_ROLE_LIST);
export type ChatMessageRole = z.infer<typeof ChatMessageRoleSchema>;

export const ChatMessageTextPartSchema = z.object({
  [CHAT_MESSAGE_PART_TYPE_KEY]: z.literal("text"),
  text: z.string(),
  state: z.enum(CHAT_MESSAGE_PART_STREAMING_STATE_LIST).exactOptional(),
});
export type ChatMessageTextPart = z.infer<typeof ChatMessageTextPartSchema>;

export const ChatMessageReasoningPartSchema = z.object({
  [CHAT_MESSAGE_PART_TYPE_KEY]: z.literal("reasoning"),
  id: z.string().exactOptional(),
  text: z.string(),
  state: z.enum(CHAT_MESSAGE_PART_STREAMING_STATE_LIST).exactOptional(),
  providerMetadata: z.record(z.string(), z.any()).exactOptional(),
});
export type ChatMessageReasoningPart = z.infer<
  typeof ChatMessageReasoningPartSchema
>;

export const SystemChatMessageSchema = z.object({
  id: ChatMessageIdSchema,
  [CHAT_MESSAGE_ROLE_KEY]: z.literal(CHAT_MESSAGE_SYSTEM_ROLE),
  parts: z.tuple([ChatMessageTextPartSchema]),
});
export type SystemChatMessage = z.infer<typeof SystemChatMessageSchema>;

export const UserChatMessageSchema = z.object({
  id: ChatMessageIdSchema,
  [CHAT_MESSAGE_ROLE_KEY]: z.literal(CHAT_MESSAGE_USER_ROLE),
  parts: z.tuple([ChatMessageTextPartSchema]),
});
export type UserChatMessage = z.infer<typeof UserChatMessageSchema>;

export const AssistantChatMessageSchema = z.object({
  id: ChatMessageIdSchema,
  [CHAT_MESSAGE_ROLE_KEY]: z.literal(CHAT_MESSAGE_ASSISTANT_ROLE),
  parts: z.array(
    z.discriminatedUnion(CHAT_MESSAGE_PART_TYPE_KEY, [
      ChatMessageTextPartSchema,
      ChatMessageReasoningPartSchema,
    ]),
  ),
});
export type AssistantChatMessage = z.infer<typeof AssistantChatMessageSchema>;

export const ChatMessageSchema = z.discriminatedUnion(CHAT_MESSAGE_ROLE_KEY, [
  SystemChatMessageSchema,
  UserChatMessageSchema,
  AssistantChatMessageSchema,
]);
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
