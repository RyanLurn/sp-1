import type { Result } from "@little-nebulae/result";

import { composeErrorMessage, UnexpectedError } from "@little-nebulae/error";
import { fail, succeed } from "@little-nebulae/result";
import { createServerOnlyFn } from "@tanstack/react-start";

import type { SelectedChatMessage } from "@/db/tables/chat-message.server";

import { db } from "@/db";
import { chatMessageTable } from "@/db/tables/chat-message.server";

export const selectAllChatMessages = createServerOnlyFn(
  async (): Promise<Result<SelectedChatMessage[], UnexpectedError>> => {
    try {
      const selectedChatMessages = await db.select().from(chatMessageTable);
      return succeed(selectedChatMessages);
    } catch (error) {
      return fail(
        new UnexpectedError({
          message: composeErrorMessage({
            operation: "select all chat messages",
            reason: "some unexpected error",
          }),
          cause: error,
          meta: null,
        }),
      );
    }
  },
);
