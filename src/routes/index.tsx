import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";

import type { ChatMessage } from "@/features/chat/schemas";

import { ChatMessageThread } from "@/features/chat/components/message/thread";
import { PromptContainer } from "@/features/chat/components/prompt/container";
import { generateUuidV7 } from "@/lib/uuid";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { messages, sendMessage, status } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ messages }) => {
        return { body: { newUserMessage: messages[messages.length - 1] } };
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
