import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type { ComponentProps, KeyboardEvent } from "react";

import { cn } from "cn";

import { Textarea } from "@/components/ui/textarea";

interface PromptEditorProps extends OmitKnownKeys<
  ComponentProps<typeof Textarea>,
  "onKeyDown"
> {}

export function PromptEditor({ className, ...props }: PromptEditorProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      const form = event.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  }

  return (
    <Textarea
      className={cn(
        "field-sizing-content max-h-[6lh] w-full resize-none rounded-none border-none bg-transparent p-3 shadow-none ring-0 outline-none focus-visible:ring-0 dark:bg-transparent",
        className,
      )}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}
