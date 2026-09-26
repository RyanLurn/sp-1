export const CHAT_MESSAGE_ROLE_KEY = "role";
export const CHAT_MESSAGE_SYSTEM_ROLE = "system";
export const CHAT_MESSAGE_USER_ROLE = "user";
export const CHAT_MESSAGE_ASSISTANT_ROLE = "assistant";
export const CHAT_MESSAGE_ROLE_LIST = [
  CHAT_MESSAGE_SYSTEM_ROLE,
  CHAT_MESSAGE_USER_ROLE,
  CHAT_MESSAGE_ASSISTANT_ROLE,
] as const;

export const CHAT_MESSAGE_PART_TYPE_KEY = "type";

export const CHAT_MESSAGE_PART_STREAMING_STATE_LIST = [
  "streaming",
  "done",
] as const;

export const NEW_USER_MESSAGE_KEY = "newUserMessage";
