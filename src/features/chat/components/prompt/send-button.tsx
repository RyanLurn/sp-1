import type { OmitKnownKeys } from "@little-nebulae/type-utils";
import type { ComponentProps } from "react";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface SendPromptButtonProps extends OmitKnownKeys<
  ComponentProps<typeof Button>,
  "size" | "type" | "disabled"
> {
  isLoading: boolean;
}

export function SendPromptButton({
  isLoading,
  ...props
}: SendPromptButtonProps) {
  return (
    <Button size="icon" type="submit" disabled={isLoading} {...props}>
      {isLoading ? <Spinner /> : <Send />}
    </Button>
  );
}
