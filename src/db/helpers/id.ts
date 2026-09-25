import { text } from "drizzle-orm/sqlite-core";

import { generateUuidV7 } from "@/lib/uuid";

export const id = text("id")
  .primaryKey()
  .$defaultFn(() => generateUuidV7());
