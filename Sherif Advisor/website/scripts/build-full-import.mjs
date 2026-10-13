/**
 * Builds a single self-contained import file for GoDaddy:
 *   schema (CREATE TABLE) + migrated data (INSERTs) + GoDaddy admin user.
 *
 * GoDaddy's Import SQL DROPS all tables first, so the file MUST recreate the
 * schema and then insert data in one go.
 *
 * Output: prisma/mysql-complete-import.sql
 */
import Database from 'better-sqlite3';
import { writeFileSync, readFileSync } from 'node:fs';

const SQLITE_PATH = 'prisma/dev.db';
const SCHEMA_FILE = 'prisma/mysql-full-import.sql'; // schema + GoDaddy admin insert
const OUT = 'prisma/mysql-complete-import.sql';

// Data tables, FK-safe order. Exclude AdminUser (GoDaddy admin comes from the
// schema file) and PageView (analytics noise). We remap old content author IDs
// to the GoDaddy admin so foreign keys resolve.
const DATA_TABLES = ['ContentItem', 'ContentRevision', 'MediaItem', 'MediaReference', 'ServiceInquiry'];

const GODADDY_ADMIN_ID = 'cadmini0o95r2vx5mux5f59q';

const BOOLEAN_COLUMNS = {
  ServiceInquiry: ['consent'],
};
const DATETIME_COLUMNS = {
  ContentItem: ['createdAt', 'updatedAt'],
  ContentRevision: ['createdAt'],
  MediaItem: ['uploadedAt'],
  ServiceInquiry: ['createdAt'],
};
// Columns that reference AdminUser.id — remap to the GoDaddy admin id.
const AUTHOR_COLUMNS = {
  ContentItem: ['createdById', 'updatedById'],
  ContentRevision: ['changedById'],
  MediaItem: ['uploadedById'],
};

function toMysqlDateTime(v) {
  if (v === null || v === undefined) return null;
  const d = typeof v === 'number' ? new Date(v) : new Date(String(v));
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 23).replace('T', ' ');
}

function sqlValue(table, col, val) {
  if (val === null || val === undefined) return 'NULL';
  if ((AUTHOR_COLUMNS[table] ?? []).includes(col)) {
    return `'${GODADDY_ADMIN_ID}'`; // remap author to GoDaddy admin
  }
  if ((BOOLEAN_COLUMNS[table] ?? []).includes(col)) return val ? '1' : '0';
  if ((DATETIME_COLUMNS[table] ?? []).includes(col)) {
    const dt = toMysqlDateTime(val);
    return dt === null ? 'NULL' : `'${dt}'`;
  }
  if (typeof val === 'number') return String(val);
  const s = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${s}'`;
}

const schema = readFileSync(SCHEMA_FILE, 'utf8');

// Strip the trailing "SET FOREIGN_KEY_CHECKS = 1;" from schema so we can append
// data before re-enabling FK checks.
const schemaBody = schema.replace(/SET FOREIGN_KEY_CHECKS = 1;\s*$/, '');

const db = new Database(SQLITE_PATH, { readonly: true });
let out = schemaBody + '\n\n-- ===== Migrated content data =====\n\n';

let total = 0;
for (const table of DATA_TABLES) {
  let rows = [];
  try {
    rows = db.prepare(`SELECT * FROM "${table}"`).all();
  } catch {
    out += `-- ${table}: not present in SQLite\n`;
    continue;
  }
  if (rows.length === 0) {
    out += `-- ${table}: 0 rows\n`;
    continue;
  }
  const cols = Object.keys(rows[0]);
  out += `-- ${table}: ${rows.length} rows\n`;
  for (const row of rows) {
    const colList = cols.map((c) => `\`${c}\``).join(', ');
    const valList = cols.map((c) => sqlValue(table, c, row[c])).join(', ');
    out += `INSERT IGNORE INTO \`${table}\` (${colList}) VALUES (${valList});\n`;
    total++;
  }
  out += '\n';
}

out += '\nSET FOREIGN_KEY_CHECKS = 1;\n';
db.close();
writeFileSync(OUT, out, 'utf8');
console.log(`Wrote schema + ${total} data rows to ${OUT}`);
