import { defineConfig } from "drizzle-kit";

process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "./src/db/tables",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE_PATH!,
  },
});
