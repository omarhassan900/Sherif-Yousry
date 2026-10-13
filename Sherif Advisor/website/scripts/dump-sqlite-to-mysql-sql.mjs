/**
 * Reads prisma/dev.db (SQLite) and writes a MySQL-compatible .sql file of
 * INSERT statements for all data. Import the output via GoDaddy's Import SQL.
 *
 * Usage: node scripts/dump-sqlite-to-mysql-sql.mjs
 * Output: prisma/mysql-data.sql
 */
import Database from 'better-sqlite3';
import { writeFileSync } from 'node:fs';

const SQLITE_PATH = process.env.SQLITE_PATH || 'prisma/dev.db';
const OUT = process.env.OUT || 'prisma/mysql-data.sql';

// FK-safe order (parents first).
// PageView excluded: 1800+ rows of analytics noise, not needed on fresh deploy.
const TABLES = [
  'AdminUser',
  'ContentItem',
  'ContentRevision',
  'MediaItem',
  'MediaReference',
  'ServiceInquiry',
];

const BOOLEAN_COLUMNS = {
  AdminUser: ['isActive', 'requiresPasswordChange'],
  ServiceInquiry: ['consent'],
};

const DATETIME_COLUMNS = {
  AdminUser: ['lockedUntil', 'createdAt', 'updatedAt'],
  ContentItem: ['createdAt', 'updatedAt'],
  ContentRevision: ['createdAt'],
  MediaItem: ['uploadedAt'],
  PageView: ['createdAt'],
  ServiceInquiry: ['createdAt'],
};

function toMysqlDateTime(v) {
  if (v === null || v === undefined) return null;
  const d = typeof v === 'number' ? new Date(v) : new Date(String(v));
  if (isNaN(d.getTime())) return null;
  // 'YYYY-MM-DD HH:MM:SS.mmm'
  return d.toISOString().slice(0, 23).replace('T', ' ');
}

function sqlValue(table, col, val) {
  if (val === null || val === undefined) return 'NULL';
  if ((BOOLEAN_COLUMNS[table] ?? []).includes(col)) return val ? '1' : '0';
  if ((DATETIME_COLUMNS[table] ?? []).includes(col)) {
    const dt = toMysqlDateTime(val);
    return dt === null ? 'NULL' : `'${dt}'`;
  }
  if (typeof val === 'number') return String(val);
  // string: escape backslashes and single quotes
  const s = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${s}'`;
}

const db = new Database(SQLITE_PATH, { readonly: true });
let out = '';
out += '-- Data migrated from SQLite dev.db\n';
out += 'SET FOREIGN_KEY_CHECKS = 0;\nSET NAMES utf8mb4;\n\n';

let total = 0;
for (const table of TABLES) {
  let rows = [];
  try {
    rows = db.prepare(`SELECT * FROM "${table}"`).all();
  } catch {
    out += `-- ${table}: not present in SQLite, skipped\n\n`;
    continue;
  }
  if (rows.length === 0) {
    out += `-- ${table}: 0 rows\n\n`;
    continue;
  }
  const cols = Object.keys(rows[0]);
  out += `-- ${table}: ${rows.length} rows\n`;
  for (const row of rows) {
    const colList = cols.map((c) => `\`${c}\``).join(', ');
    const valList = cols.map((c) => sqlValue(table, c, row[c])).join(', ');
    // INSERT IGNORE: safe to re-run; won't fail on existing rows (e.g. the
    // admin user already created on GoDaddy via the earlier import).
    out += `INSERT IGNORE INTO \`${table}\` (${colList}) VALUES (${valList});\n`;
    total++;
  }
  out += '\n';
}

out += 'SET FOREIGN_KEY_CHECKS = 1;\n';
db.close();
writeFileSync(OUT, out, 'utf8');
console.log(`Wrote ${total} INSERT rows across ${TABLES.length} tables to ${OUT}`);
