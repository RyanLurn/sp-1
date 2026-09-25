import type { ComponentProps } from "react";

import { cn } from "cn";

import type { ChatMessage } from "@/features/chat/schemas";

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
  messages: ChatMessage[];
}

export function ChatMessageThread({
  messages,
  className,
  ...props
}: ChatMessageThreadProps) {
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport>
          <MessageScrollerContent className={cn("pt-3", className)} {...props}>
            {messages.map((message, index) => (
              <MessageScrollerItem
                key={index}
                messageId={message.id}
                scrollAnchor={message.role === "user"}
              >
                <ChatMessageBubble message={message} />
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
