import { createServerOnlyFn } from "@tanstack/react-start";

import { db } from "@/db";
import { chatMessageTable } from "@/db/tables/chat-message.server";

export const listChatMessages = createServerOnlyFn(async () => {
  const selectedChatMessages = await db.select().from(chatMessageTable);
  return selectedChatMessages;
});
