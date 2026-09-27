import { code } from "@streamdown/code";
import { mermaid } from "@streamdown/mermaid";
import { Streamdown } from "streamdown";

import { useTheme } from "@/components/theme/provider";

export function ChatMessageMarkdownContent({ text }: { text: string }) {
  const { theme } = useTheme();

  return (
    <Streamdown
      plugins={{ code, mermaid }}
      mermaid={{
        config: { theme: theme === "light" ? "default" : "dark" },
      }}
    >
      {text}
    </Streamdown>
  );
}
