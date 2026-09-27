import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type { ComponentProps } from "react";

import type { ChatMessageTextPart } from "@/features/chat/schemas";

import { BubbleContent, Bubble } from "@/components/ui/bubble";
import { ChatMessageMarkdown } from "@/features/chat/components/message/markdown";

interface ChatMessageTextBubbleProps extends OmitKnownKeys<
  ComponentProps<typeof Bubble>,
  "variant"
> {
  isUser: boolean;
  textPart: ChatMessageTextPart;
}

export function ChatMessageTextBubble({
  isUser,
  textPart,
  ...props
}: ChatMessageTextBubbleProps) {
  return (
    <Bubble variant={isUser ? "secondary" : "ghost"} {...props}>
      <BubbleContent>
        <ChatMessageMarkdown text={textPart.text} />
      </BubbleContent>
    </Bubble>
  );
}
