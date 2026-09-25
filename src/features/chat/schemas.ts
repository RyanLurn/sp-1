import type { UIMessage } from "ai";

import { z } from "zod";

export const ChatMessageMetadataSchema = z.json();
export type ChatMessageMetadata = z.infer<typeof ChatMessageMetadataSchema>;

export type ChatMessage = UIMessage<ChatMessageMetadata, {}, {}>;
