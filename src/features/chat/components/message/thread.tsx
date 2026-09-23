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
  typeof MessageScroller
> {
  messages: UIMessage[];
}

export function ChatMessageThread({
  messages,
  ...props
}: ChatMessageThreadProps) {
  return (
    <MessageScrollerProvider>
      <MessageScroller {...props}>
        <MessageScrollerViewport>
          <MessageScrollerContent>
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
