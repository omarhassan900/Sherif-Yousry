/**
 * Remove "Audit, Accounting & Assurance" category and all its sub-services from the DB.
 * Run: node scripts/remove-audit-category.mjs
 */
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL || 'file:./prisma/dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const all = await prisma.contentItem.findMany({ where: { type: 'service' } });

  const toDelete = all.filter(item => {
    try {
      const m = JSON.parse(item.metadata);
      return m.categorySlug === 'audit-accounting-assurance';
    } catch { return false; }
  });

  if (toDelete.length === 0) {
    console.log('No records found for audit-accounting-assurance.');
    return;
  }

  for (const item of toDelete) {
    await prisma.contentItem.delete({ where: { id: item.id } });
    console.log(`  ✓ Deleted: ${item.titleEn} (${item.metadata.includes('"category"') ? 'category' : 'sub-service'})`);
  }

  console.log(`\n✅ Removed ${toDelete.length} records.`);
}

main()
  .catch(e => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
