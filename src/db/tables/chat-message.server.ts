import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import type {
  ChatMessageMetadata,
  ChatMessagePart,
} from "@/features/chat/schemas";

import { id } from "@/db/helpers/id";
import { timestamps } from "@/db/helpers/timestamps";
import { CHAT_MESSAGE_ROLE_LIST } from "@/features/chat/constants";

export const chatMessageTable = sqliteTable("chat_messages", {
  id,
  role: text("role", { enum: CHAT_MESSAGE_ROLE_LIST }).notNull(),
  metadata: text("metadata", { mode: "json" }).$type<ChatMessageMetadata>(),
  parts: text("parts", { mode: "json" }).notNull().$type<ChatMessagePart[]>(),
  ...timestamps,
});

export type SelectedChatMessage = typeof chatMessageTable.$inferSelect;
export type InsertedChatMessage = typeof chatMessageTable.$inferInsert;
