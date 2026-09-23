import { createFileRoute } from "@tanstack/react-router";

import { Chat } from "@/features/chat/components/chat";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return <Chat />;
}
