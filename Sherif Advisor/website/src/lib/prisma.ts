import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // ✅ Pass the config object directly to the adapter
  const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Cache the client on the global object in every environment. Without this,
// each module load / serverless invocation could create a brand-new
// PrismaClient (and a new libSQL connection), adding cold-start latency to
// requests. The global cache ensures a single reused instance per process.
globalForPrisma.prisma = prisma;

export default prisma;