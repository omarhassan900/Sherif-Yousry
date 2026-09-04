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
      // "Why Us" section heading (label / title). The 5 reason cards below
      // it remain fixed in the design for now.
      type: 'page_section' as const,
      titleAr: 'انضباط المكاتب الكبرى. ومرونة المكاتب المتخصصة.',
      titleEn: 'Big-firm discipline. Boutique agility.',
      bodyAr: 'لماذا شريف يسري للاستشارات؟',
      bodyEn: 'Why Sherif Yousry Advisory?',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'why-us' }),
    },
    {
      // Regional map / markets section heading.
      type: 'page_section' as const,
      titleAr: 'أسواق استراتيجية في الشرق الأوسط',
      titleEn: 'Strategic Markets in the Middle East',
      bodyAr: 'حضورنا الإقليمي',
      bodyEn: 'Regional Presence',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'markets' }),
    },
    {
      // Assessment CTA section heading + intro.
      type: 'page_section' as const,
      titleAr: 'لست متأكداً من موقعك؟ ابدأ التقييم المجاني لأعمالك.',
      titleEn: 'Not sure where you stand? Start your free business assessment.',
      bodyAr: 'تسعة أسئلة عن الحجم والالتزام والنضج المالي تُنتج درجة جاهزية ومؤشرات مخاطر وخطة استشارية موصى بها — في أقل من أربع دقائق.',
      bodyEn: 'Nine questions on size, compliance and financial maturity produce a readiness score, risk indicators, and a recommended advisory plan — in under four minutes.',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'assessment' }),
    },
    {
      // Services section heading on the homepage (the cards come from CMS Services).
      type: 'page_section' as const,
      titleAr: 'استشارات شاملة مبنية على التزاماتك.',
      titleEn: 'Comprehensive advisory built on your commitments.',
      bodyAr: 'خدماتنا',
      bodyEn: 'Our Services',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'services' }),
    },
    {
      // Insights section heading on the homepage (the cards come from CMS Articles).
      type: 'page_section' as const,
      titleAr: 'رؤى تزيد وعي عملائنا.',
      titleEn: 'Insights that raise our clients’ awareness.',
      bodyAr: 'الأفكار والرؤى',
      bodyEn: 'Insights',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'insights' }),
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

  // Load all existing page sections once so we can match by page+sectionKey
  // (robust against JSON string/whitespace differences that caused duplicates).
  const existingSections = await prisma.contentItem.findMany({
    where: { type: 'page_section' },
  });

  function findExisting(metadataJson: string) {
    const target = JSON.parse(metadataJson);
    return existingSections.find((row) => {
      try {
        const m = JSON.parse(row.metadata);
        return m.page === target.page && m.sectionKey === target.sectionKey;
      } catch {
        return false;
      }
    });
  }

  // Create page sections (match by page+sectionKey to avoid duplicates)
  for (const section of pageSections) {
    const existing = findExisting(section.metadata);

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
