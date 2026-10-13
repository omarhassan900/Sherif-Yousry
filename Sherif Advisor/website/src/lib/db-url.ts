/**
 * Builds a Prisma-compatible MySQL connection URL.
 *
 * GoDaddy's hosted database injects five separate environment variables
 * (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD) rather than a single
 * connection string. Prisma needs one DATABASE_URL, so we assemble it here.
 *
 * Precedence:
 *   1. If DATABASE_URL is already set (local dev or manual override), use it.
 *   2. Otherwise build it from the GoDaddy DB_* parts.
 */
export function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ?? "3306";
  const name = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD ?? "";

  if (!host || !name || !user) {
    // Return empty string instead of throwing so that `prisma generate`
    // (which loads this at build/install time) doesn't crash when the DB
    // vars aren't present yet.
    return "";
  }

  // URL-encode the password in case it contains special characters.
  const encodedPassword = encodeURIComponent(password);
  const encodedUser = encodeURIComponent(user);

  return `mysql://${encodedUser}:${encodedPassword}@${host}:${port}/${name}`;
}
