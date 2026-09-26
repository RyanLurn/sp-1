import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { ChatMessage, ChatMessageId } from "@/features/chat/schemas";

import { id } from "@/db/helpers/id";
import { timestamps } from "@/db/helpers/timestamps";
import { CHAT_MESSAGE_ROLE_LIST } from "@/features/chat/constants";

export const chatMessageTable = sqliteTable("chat_messages", {
  id: id.$type<ChatMessageId>(),
  role: text("role", { enum: CHAT_MESSAGE_ROLE_LIST }).notNull(),
  parts: text("parts", { mode: "json" })
    .notNull()
    .$type<ChatMessage["parts"]>(),
  ...timestamps,
});

export type SelectedChatMessage = typeof chatMessageTable.$inferSelect;
export type InsertedChatMessage = typeof chatMessageTable.$inferInsert;
