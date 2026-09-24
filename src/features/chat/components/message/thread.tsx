import type { UIMessage } from "@tanstack/ai-react";
import type { ComponentProps } from "react";

import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
} from "@/components/ui/message-scroller";
import { ChatMessageBubble } from "@/features/chat/components/message/bubble";

interface ChatMessageThreadProps extends ComponentProps<
  typeof MessageScrollerContent
> {
  messages: UIMessage[];
}

export function ChatMessageThread({
  messages,
  ...props
}: ChatMessageThreadProps) {
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent {...props}>
            {messages.map((message, index) => (
              <MessageScrollerItem key={index}>
                <ChatMessageBubble message={message} />
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
