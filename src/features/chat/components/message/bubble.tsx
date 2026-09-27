import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type { ComponentProps } from "react";

import type { ChatMessage } from "@/features/chat/schemas";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
import { ChatMessageMarkdownContent } from "@/features/chat/components/message/content/markdown";

interface ChatMessageBubbleProps extends OmitKnownKeys<
  ComponentProps<typeof Message>,
  "align"
> {
  message: ChatMessage;
}

export function ChatMessageBubble({
  message,
  ...props
}: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <Message align={isUser ? "end" : "start"} {...props}>
      <MessageContent className="typeset">
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            return (
              <Bubble key={index} variant={isUser ? "secondary" : "ghost"}>
                <BubbleContent>
                  <ChatMessageMarkdownContent text={part.text} />
                </BubbleContent>
              </Bubble>
            );
          }
        })}
      </MessageContent>
    </Message>
  );
}
