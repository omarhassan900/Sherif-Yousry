import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { getDatabaseUrl } from './db-url';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Prisma 7 requires a driver adapter. GoDaddy's MySQL speaks the MariaDB
  // wire protocol, so the official @prisma/adapter-mariadb works. It accepts a
  // connection string built from GoDaddy's injected DB_* vars (or DATABASE_URL).
  const url = getDatabaseUrl();
  const adapter = new PrismaMariaDb(url);
  return new PrismaClient({ adapter });
}

/**
 * Lazily-initialised Prisma client. The Proxy defers creation until first use
 * so `next build` doesn't instantiate it (and connect) at import time.
 */
const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    const client = globalForPrisma.prisma as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export { prisma };
export default prisma;
