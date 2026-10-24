import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import type { PoolConfig } from 'mariadb';
import { getDatabaseUrl } from './db-url';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Parse a `mysql://user:pass@host:port/db` URL into the structured pool config
 * the mariadb driver expects. Passing a config object (rather than a bare
 * connection string) lets us tune pool behaviour so the pool stays healthy in
 * long-running server processes and recovers from dropped connections instead
 * of hanging until `acquireTimeout` and reporting `active=0 idle=0`.
 */
function buildPoolConfig(url: string): PoolConfig {
  const parsed = new URL(url);

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),

    // --- Pool health / resilience ---
    connectionLimit: 10,
    // Fail fast when establishing a brand-new socket to the DB instead of
    // silently queueing behind a dead connection.
    connectTimeout: 10_000,
    // Max time to wait for a free connection from the pool before erroring.
    acquireTimeout: 10_000,
    // Recycle idle connections so stale sockets (e.g. after the DB restarts or
    // a dev hot-reload) are dropped and replaced rather than reused forever.
    idleTimeout: 60,
    // Validate a pooled connection is still alive before handing it out; a dead
    // connection is discarded and a fresh one is opened transparently.
    minDelayValidation: 500,
    // Don't keep the event loop alive; lets the process exit cleanly.
    // (left to driver defaults otherwise)
  };
}

function createPrismaClient(): PrismaClient {
  // Prisma 7 requires a driver adapter. GoDaddy's MySQL speaks the MariaDB
  // wire protocol, so the official @prisma/adapter-mariadb works. It accepts
  // either a connection string or a structured pool config; we use the latter
  // to apply pool-tuning options.
  const url = getDatabaseUrl();
  const adapter = new PrismaMariaDb(buildPoolConfig(url));
  return new PrismaClient({ adapter });
}

/**
 * Lazily-initialised Prisma client. The Proxy defers creation until first use
 * so `next build` doesn't instantiate it (and connect) at import time.
 *
 * The underlying client is cached on `globalThis` so that Next.js hot-reloads
 * in development reuse a single pool instead of leaking a new one on every
 * module reload.
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
