import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type { ComponentProps } from "react";

import type { ChatMessage } from "@/features/chat/schemas";

import { Message, MessageContent } from "@/components/ui/message";
import { ChatMessageReasoningBubble } from "@/features/chat/components/message/bubble/reasoning";
import { ChatMessageTextBubble } from "@/features/chat/components/message/bubble/text";

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
          if (part.type === "reasoning") {
            return (
              <ChatMessageReasoningBubble key={index} reasoningPart={part} />
            );
          }

          if (part.type === "text") {
            return (
              <ChatMessageTextBubble
                key={index}
                isUser={isUser}
                textPart={part}
              />
            );
          }
        })}
      </MessageContent>
    </Message>
  );
}
