import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ChatMessageThread } from "@/features/chat/components/message/thread";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading, stop } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
  });

  return (
    <div className="flex h-full flex-col">
      <ChatMessageThread
        className="mx-auto mt-5 max-w-2xl"
        messages={messages}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (input.trim() === "") {
            return;
          }
          void sendMessage(input);
          setInput("");
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        {isLoading ? (
          <button type="button" onClick={stop}>
            Stop
          </button>
        ) : (
          <button type="submit">Send</button>
        )}
      </form>
    </div>
  );
}
