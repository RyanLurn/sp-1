import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ChatMessageThread } from "@/features/chat/components/message/thread";
import { PromptEditor } from "@/features/chat/components/prompt/editor";
import { SendPromptButton } from "@/features/chat/components/prompt/send-button";
import { mockMessages } from "@/features/chat/mock-data";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [prompt, setPrompt] = useState("");
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
      <form
        className="mx-auto mb-3 flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border bg-background shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          if (prompt.trim() === "") {
            return;
          }
          void sendMessage(prompt);
          setPrompt("");
        }}
      >
        <PromptEditor prompt={prompt} setPrompt={setPrompt} />
        <SendPromptButton className="m-1 self-end" isLoading={isLoading} />
      </form>
    </div>
  );
}
