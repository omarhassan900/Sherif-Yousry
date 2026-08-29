import 'dotenv/config';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

function resolveDatabaseUrl(): string {
  let url = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  if (url.startsWith('file:')) {
    url = url.slice(5);
  }
  url = url.replace(/^["']|["']$/g, '');
  if (!path.isAbsolute(url)) {
    url = path.resolve(process.cwd(), url);
  }
  return url;
}

const adapter = new PrismaBetterSqlite3({
  url: resolveDatabaseUrl(),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables'
    );
  }

  // Hash the admin password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create or update the super_admin user
  const adminUser = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'super_admin',
      isActive: true,
    },
    create: {
      email,
      displayName: 'Super Admin',
      passwordHash,
      role: 'super_admin',
      isActive: true,
      requiresPasswordChange: true,
    },
  });

  console.log(`✓ Admin user created/updated: ${adminUser.email}`);

  // Define predefined page sections
  const pageSections = [
    {
      type: 'page_section' as const,
      titleAr: 'القسم الرئيسي',
      titleEn: 'Homepage Hero',
      bodyAr: 'مرحباً بكم في شريف يسري للاستشارات المالية والضريبية',
      bodyEn: 'Welcome to Sherif Yousry Advisory for Finance & Tax',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'hero' }),
    },
    {
      type: 'page_section' as const,
      titleAr: 'الإحصائيات',
      titleEn: 'Homepage Stats',
      bodyAr: 'إحصائيات الصفحة الرئيسية',
      bodyEn: 'Homepage statistics section',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'stats' }),
    },
    {
      type: 'page_section' as const,
      titleAr: 'من نحن',
      titleEn: 'About Page',
      bodyAr: 'نبذة عن شريف يسري للاستشارات',
      bodyEn: 'About Sherif Yousry Advisory',
      metadata: JSON.stringify({ page: 'about', sectionKey: 'main' }),
    },
    {
      type: 'page_section' as const,
      titleAr: 'تواصل معنا',
      titleEn: 'Contact Page',
      bodyAr: 'تواصل معنا للحصول على استشارة',
      bodyEn: 'Contact us for a consultation',
      metadata: JSON.stringify({ page: 'contact', sectionKey: 'main' }),
    },
  ];

  // Create page sections (upsert based on metadata to avoid duplicates)
  for (const section of pageSections) {
    const existing = await prisma.contentItem.findFirst({
      where: {
        type: 'page_section',
        metadata: section.metadata,
      },
    });

    if (existing) {
      await prisma.contentItem.update({
        where: { id: existing.id },
        data: {
          titleAr: section.titleAr,
          titleEn: section.titleEn,
          bodyAr: section.bodyAr,
          bodyEn: section.bodyEn,
          updatedById: adminUser.id,
        },
      });
      console.log(`✓ Updated page section: ${section.titleEn}`);
    } else {
      await prisma.contentItem.create({
        data: {
          ...section,
          status: 'published',
          createdById: adminUser.id,
          updatedById: adminUser.id,
        },
      });
      console.log(`✓ Created page section: ${section.titleEn}`);
    }
  }

  console.log('\n✓ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
