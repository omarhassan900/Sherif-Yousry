import "dotenv/config";
import { defineConfig } from "prisma/config";

// GoDaddy's hosted database injects DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD
// separately. Prisma CLI (migrate/db) needs a single URL, so assemble it here.
// Falls back to DATABASE_URL for local dev or manual override.
function buildDatabaseUrl(): string {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0) {
    return process.env.DATABASE_URL;
  }
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ?? "3306";
  const name = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD ?? "";
  if (!host || !name || !user) {
    // Empty string so `prisma generate` (which loads this config at install
    // time) does not crash when DB vars are absent.
    return "";
  }
  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(
    password
  )}@${host}:${port}/${name}`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: buildDatabaseUrl(),
  },
});
