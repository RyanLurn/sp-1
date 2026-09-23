import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ChatMessageThread } from "@/features/chat/components/message/thread";
import { PromptEditor } from "@/features/chat/components/prompt/editor";
import { SendPromptButton } from "@/features/chat/components/prompt/send-button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [prompt, setPrompt] = useState("");
  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
  });

  return (
    <div className="flex h-full flex-col">
      <ChatMessageThread
        className="mx-auto mt-5 max-w-2xl flex-1"
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
        <PromptEditor
          value={prompt}
          onChange={(event) => setPrompt(event.currentTarget.value)}
        />
        <SendPromptButton className="m-1 self-end" isLoading={isLoading} />
      </form>
    </div>
  );
}
