import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type { ComponentProps } from "react";

import { cn } from "cn";
import { useState } from "react";

import { PromptEditor } from "@/features/chat/components/prompt/editor";
import { SendPromptButton } from "@/features/chat/components/prompt/send-button";

interface PromptContainerProps extends OmitKnownKeys<
  ComponentProps<"form">,
  "onSubmit"
> {
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

export function PromptContainer({
  sendMessage,
  isLoading,
  className,
  ...props
}: PromptContainerProps) {
  const [prompt, setPrompt] = useState("");

  return (
    <form
      className={cn(
        "flex min-h-fit w-full flex-col overflow-hidden rounded-xl border bg-background p-1",
        className,
      )}
      onSubmit={(event) => {
        event.preventDefault();
        if (prompt.trim() === "") {
          return;
        }
        void sendMessage(prompt);
        setPrompt("");
      }}
      {...props}
    >
      <PromptEditor prompt={prompt} setPrompt={setPrompt} />
      <SendPromptButton className="self-end" isLoading={isLoading} />
    </form>
  );
}
