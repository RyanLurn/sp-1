import type { UnexpectedErrorCode } from "@little-nebulae/error";
import type { Result } from "@little-nebulae/result";
import type { FlatErrorObject } from "@little-nebulae/serialize-error";

import { HTTP_ERROR_RESPONSE_STATUS_RECORD } from "@little-nebulae/http";
import { fail, succeed } from "@little-nebulae/result";
import { serializeErrorShallowly } from "@little-nebulae/serialize-error";
import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";

import type { ChatMessage } from "@/features/chat/schemas";

import { listChatMessages } from "@/db/queries/chat-message/list.server";

export const loadChatMessages = createServerFn().handler(
  async (): Promise<
    Result<ChatMessage[], FlatErrorObject<UnexpectedErrorCode, null>>
  > => {
    const listResult = await listChatMessages();

    if (listResult.success) {
      const chatMessageList = listResult.data;
      const chatMessages = chatMessageList.map((message) => ({
        id: message.id,
        role: message.role,
        parts: message.parts,
        metadata: message.metadata,
      }));
      return succeed(chatMessages);
    }

    const error = listResult.error;
    console.error(error);

    const httpError = HTTP_ERROR_RESPONSE_STATUS_RECORD.INTERNAL_SERVER_ERROR;
    setResponseStatus(httpError.code, httpError.text);

    const errorObject = serializeErrorShallowly({ error, meta: error.meta });
    return fail(errorObject);
  },
);
