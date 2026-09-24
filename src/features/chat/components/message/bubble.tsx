import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type { UIMessage } from "@tanstack/ai-react";
import type { ComponentProps } from "react";

import { code } from "@streamdown/code";
import { Streamdown } from "streamdown";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";

interface ChatMessageBubbleProps extends OmitKnownKeys<
  ComponentProps<typeof Message>,
  "align"
> {
  message: UIMessage;
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
                  <Streamdown plugins={{ code }}>{part.content}</Streamdown>
                </BubbleContent>
              </Bubble>
            );
          }
        })}
      </MessageContent>
    </Message>
  );
}
