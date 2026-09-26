import { drizzle } from "drizzle-orm/tursodatabase/database";

import { env } from "@/config/env";

export const db = drizzle(env.DB_FILE_PATH);
