import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type { ComponentProps } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

import type { ChatMessageReasoningPart } from "@/features/chat/schemas";

import { BubbleContent, Bubble } from "@/components/ui/bubble";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChatMessageMarkdown } from "@/features/chat/components/message/markdown";

interface ChatMessageReasoningBubbleProps extends OmitKnownKeys<
  ComponentProps<typeof Bubble>,
  "variant"
> {
  reasoningPart: ChatMessageReasoningPart;
}

export function ChatMessageReasoningBubble({
  reasoningPart,
  ...props
}: ChatMessageReasoningBubbleProps) {
  const [open, setOpen] = useState(false);

  return (
    <Bubble variant="ghost" {...props}>
      <BubbleContent>
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="text-muted-foreground"
        >
          <CollapsibleTrigger className="flex flex-row items-center gap-x-1">
            Reasoning
            {open ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 rounded-md border px-3 py-2">
            <ChatMessageMarkdown text={reasoningPart.text} />
          </CollapsibleContent>
        </Collapsible>
      </BubbleContent>
    </Bubble>
  );
}
