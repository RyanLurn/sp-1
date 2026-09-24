import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { createFileRoute } from "@tanstack/react-router";

import { ChatMessageThread } from "@/features/chat/components/message/thread";
import { PromptContainer } from "@/features/chat/components/prompt/container";
import { mockMessages } from "@/features/chat/mock-data";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { messages, sendMessage, isLoading } = useChat({
    initialMessages: mockMessages,
    connection: fetchServerSentEvents("/api/chat"),
  });

  return (
    <div className="flex h-full flex-col gap-y-3">
      <ChatMessageThread
        className="mx-auto mt-3 max-w-2xl flex-1"
        messages={messages}
      />
      <PromptContainer
        sendMessage={sendMessage}
        isLoading={isLoading}
        className="mx-auto mb-3 max-w-2xl"
      />
    </div>
  );
}
