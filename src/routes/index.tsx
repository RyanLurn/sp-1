import { useChat } from "@ai-sdk/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";

import type { ChatMessage } from "@/features/chat/schemas";

import { ChatMessageThread } from "@/features/chat/components/message/thread";
import { PromptContainer } from "@/features/chat/components/prompt/container";
import { NEW_USER_MESSAGE_KEY } from "@/features/chat/constants";
import { listChatMessages } from "@/features/chat/ops/list-messages";
import { generateUuidV7 } from "@/lib/uuid";

export const Route = createFileRoute("/")({
  loader: async () => {
    const listResult = await listChatMessages();

    if (listResult.success) {
      return listResult.data;
    }

    throw redirect({ to: "/500" });
  },
  component: HomePage,
});

function HomePage() {
  const initialMessages = Route.useLoaderData();
  const { messages, sendMessage, status } = useChat<ChatMessage>({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ messages }) => {
        return {
          body: { [NEW_USER_MESSAGE_KEY]: messages[messages.length - 1] },
        };
      },
    }),
    generateId: generateUuidV7,
  });

  return (
    <div className="flex h-full flex-col gap-y-3">
      <ChatMessageThread
        className="mx-auto max-w-2xl flex-1"
        messages={messages}
      />
      <PromptContainer
        sendMessage={sendMessage}
        isLoading={status === "streaming"}
        className="mx-auto mb-3 max-w-2xl"
      />
    </div>
  );
}
