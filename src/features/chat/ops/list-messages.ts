import type { UnexpectedErrorCode } from "@little-nebulae/error";
import type { Result } from "@little-nebulae/result";
import type { FlatErrorObject } from "@little-nebulae/serialize-error";

import { HTTP_ERROR_RESPONSE_STATUS_RECORD } from "@little-nebulae/http";
import { fail, succeed } from "@little-nebulae/result";
import { serializeErrorShallowly } from "@little-nebulae/serialize-error";
import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";

import type { ChatMessage } from "@/features/chat/schemas";

import { selectAllChatMessages } from "@/db/queries/chat-message/select-all.server";
import { ChatMessageSchema } from "@/features/chat/schemas";

export const listChatMessages = createServerFn().handler(
  async (): Promise<
    Result<ChatMessage[], FlatErrorObject<UnexpectedErrorCode>>
  > => {
    const selectResult = await selectAllChatMessages();

    if (selectResult.success) {
      const chatMessages = z.array(ChatMessageSchema).parse(selectResult.data);
      return succeed(chatMessages);
    }

    const error = selectResult.error;
    console.error(error);

    const httpError = HTTP_ERROR_RESPONSE_STATUS_RECORD.INTERNAL_SERVER_ERROR;
    setResponseStatus(httpError.code, httpError.text);

    const flatErrorObject = serializeErrorShallowly({
      error,
      meta: error.meta,
    });
    return fail(flatErrorObject);
  },
);
