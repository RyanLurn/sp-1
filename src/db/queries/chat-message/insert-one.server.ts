import type { Result } from "@little-nebulae/result";

import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { fail, succeed } from "@little-nebulae/result";
import { createServerOnlyFn } from "@tanstack/react-start";

import type {
  InsertedChatMessage,
  SelectedChatMessage,
} from "@/db/tables/chat-message.server";

import { db } from "@/db";
import { chatMessageTable } from "@/db/tables/chat-message.server";

export const insertOneChatMessage = createServerOnlyFn(
  async ({
    insertedChatMessage,
  }: {
    insertedChatMessage: InsertedChatMessage;
  }): Promise<Result<SelectedChatMessage, UnexpectedError>> => {
    try {
      const [returnedChatMessage] = await db
        .insert(chatMessageTable)
        .values(insertedChatMessage)
        .returning();

      if (returnedChatMessage) {
        return succeed(returnedChatMessage);
      }

      return fail(
        new UnexpectedError({
          message: composeErrorMessage({
            operation: "insert one chat message",
            reason: "undefined returned chat message",
          }),
          cause: "returnedChatMessage is undefined",
          meta: null,
        }),
      );
    } catch (error) {
      return fail(
        new UnexpectedError({
          message: composeErrorMessage({
            operation: "insert one chat message",
            reason: "some unexpected error",
          }),
          cause: error,
          meta: null,
        }),
      );
    }
  },
);
