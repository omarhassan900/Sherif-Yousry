/**
 * One-time data migration: SQLite (prisma/dev.db) -> MySQL.
 *
 * Reads every row from the old SQLite database and inserts it into the target
 * MySQL database (GoDaddy hosted DB). Order respects foreign keys.
 *
 * Usage:
 *   Set the target connection first (either DATABASE_URL or DB_* parts), then:
 *     node scripts/migrate-sqlite-to-mysql.mjs
 *
 * Example (PowerShell):
 *   $env:DATABASE_URL="mysql://USER:PASS@HOST:3306/DBNAME"
 *   node scripts/migrate-sqlite-to-mysql.mjs
 */
import 'dotenv/config';
import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

function getTargetUrl() {
  if (process.env.MYSQL_URL && process.env.MYSQL_URL.length > 0) return process.env.MYSQL_URL;
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mysql://')) return process.env.DATABASE_URL;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ?? '3306';
  const name = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD ?? '';
  if (!host || !name || !user) {
    throw new Error('No MySQL target. Set MYSQL_URL or DATABASE_URL (mysql://...) or DB_HOST/DB_NAME/DB_USER/DB_PASSWORD.');
  }
  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
}

const SQLITE_PATH = process.env.SQLITE_PATH || 'prisma/dev.db';

// Tables in FK-safe insert order (parents first).
const TABLES = [
  'AdminUser',
  'ContentItem',
  'ContentRevision',
  'MediaItem',
  'MediaReference',
  'PageView',
  'ServiceInquiry',
];

// Boolean columns per table (SQLite stores 0/1; MySQL via Prisma wants real booleans).
const BOOLEAN_COLUMNS = {
  AdminUser: ['isActive', 'requiresPasswordChange'],
  ServiceInquiry: ['consent'],
};

// DateTime columns (SQLite stores as string/number; convert to JS Date).
const DATETIME_COLUMNS = {
  AdminUser: ['lockedUntil', 'createdAt', 'updatedAt'],
  ContentItem: ['createdAt', 'updatedAt'],
  ContentRevision: ['createdAt'],
  MediaItem: ['uploadedAt'],
  PageView: ['createdAt'],
  ServiceInquiry: ['createdAt'],
};

function coerceRow(table, row) {
  const out = { ...row };
  for (const col of BOOLEAN_COLUMNS[table] ?? []) {
    if (out[col] !== null && out[col] !== undefined) out[col] = Boolean(out[col]);
  }
  for (const col of DATETIME_COLUMNS[table] ?? []) {
    const v = out[col];
    if (v === null || v === undefined) continue;
    // SQLite may store ISO strings or epoch ms
    const d = typeof v === 'number' ? new Date(v) : new Date(String(v));
    out[col] = isNaN(d.getTime()) ? new Date() : d;
  }
  return out;
}

async function main() {
  const targetUrl = getTargetUrl();
  const masked = targetUrl.replace(/:\/\/([^:]+):[^@]+@/, '://$1:****@');
  console.log(`Source SQLite : ${SQLITE_PATH}`);
  console.log(`Target MySQL  : ${masked}`);

  const sqlite = new Database(SQLITE_PATH, { readonly: true });
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(targetUrl) });

  try {
    for (const table of TABLES) {
      let rows = [];
      try {
        rows = sqlite.prepare(`SELECT * FROM "${table}"`).all();
      } catch (e) {
        console.log(`- ${table}: not found in SQLite, skipping`);
        continue;
      }
      if (rows.length === 0) {
        console.log(`- ${table}: 0 rows`);
        continue;
      }

      const model = table.charAt(0).toLowerCase() + table.slice(1);
      let inserted = 0;
      for (const raw of rows) {
        const data = coerceRow(table, raw);
        try {
          await prisma[model].upsert({
            where: { id: data.id },
            update: data,
            create: data,
          });
          inserted++;
        } catch (e) {
          console.error(`  ! ${table} id=${data.id} failed: ${e.message.split('\n')[0]}`);
        }
      }
      console.log(`+ ${table}: migrated ${inserted}/${rows.length}`);
    }
    console.log('\n✓ Migration complete.');
  } finally {
    sqlite.close();
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
