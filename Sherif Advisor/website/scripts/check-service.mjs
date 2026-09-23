import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:./prisma/dev.db', authToken: undefined });
const prisma = new PrismaClient({ adapter });

const r = await prisma.contentItem.findFirst({
  where: { type: 'service', titleEn: 'Direct & Indirect Taxation' }
});
console.log('bodyEn length:', r?.bodyEn?.length);
console.log('first 300 chars:\n', r?.bodyEn?.substring(0, 300));
await prisma.$disconnect();
