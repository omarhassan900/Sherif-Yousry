import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Resolves the DATABASE_URL to an absolute file path that better-sqlite3 can use.
 * Strips the "file:" prefix if present and resolves relative paths from project root.
 */
function resolveDatabaseUrl(): string {
  let url = process.env.DATABASE_URL || 'file:./prisma/dev.db';

  // Strip the "file:" prefix that Prisma uses
  if (url.startsWith('file:')) {
    url = url.slice(5);
  }

  // Strip surrounding quotes if present
  url = url.replace(/^["']|["']$/g, '');

  // Resolve relative paths from the project root (process.cwd())
  if (!path.isAbsolute(url)) {
    url = path.resolve(process.cwd(), url);
  }

  return url;
}

function createPrismaClient() {
  const dbPath = resolveDatabaseUrl();
  const adapter = new PrismaBetterSqlite3({
    url: dbPath,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
