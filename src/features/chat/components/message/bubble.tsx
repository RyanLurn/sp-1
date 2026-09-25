import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type { ComponentProps } from "react";

import { code } from "@streamdown/code";
import { mermaid } from "@streamdown/mermaid";
import { Streamdown } from "streamdown";

import type { ChatMessage } from "@/features/chat/schemas";

import { useTheme } from "@/components/theme/provider";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";

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
  const { theme } = useTheme();
  const isUser = message.role === "user";

  return (
    <Message align={isUser ? "end" : "start"} {...props}>
      <MessageContent className="typeset">
        {message.parts.map((part, index) => {
          if (part.type === "text") {
            return (
              <Bubble key={index} variant={isUser ? "secondary" : "ghost"}>
                <BubbleContent>
                  <Streamdown
                    plugins={{ code, mermaid }}
                    mermaid={{
                      config: { theme: theme === "light" ? "default" : "dark" },
                    }}
                  >
                    {part.text}
                  </Streamdown>
                </BubbleContent>
              </Bubble>
            );
          }
        })}
      </MessageContent>
    </Message>
  );
}
