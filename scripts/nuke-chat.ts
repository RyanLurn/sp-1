import { db } from "@/db";
import { chatMessageTable } from "@/db/tables/chat-message.server";

try {
  await db.delete(chatMessageTable);
  console.log("Deleted all rows in the chat message table.");
} catch (error) {
  console.error(error);
}
