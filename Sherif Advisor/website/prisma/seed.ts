import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';

// Use the same libSQL adapter as the app runtime (src/lib/prisma.ts) so the
// seed writes to the exact database the app reads from. libSQL is pure JS,
// which also avoids the native-binding build that better-sqlite3 requires.
// Fall back to DATABASE_URL when the TURSO_* vars aren't set (local dev uses
// a file: URL for both).
const adapter = new PrismaLibSql({
  url:
    process.env.TURSO_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'file:./prisma/dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
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

    // ─────────────────────────────────────────────────────────────
    // V2 PAGE SECTIONS — editable content for the /v2 landing page.
    // `title`/`body` are the two primary bilingual strings; everything
    // else lives in `metadata.fields` as { ar, en } pairs so the V2
    // components can resolve them per-language on the client.
    // ─────────────────────────────────────────────────────────────
    {
      // Hero — headline, subtitle, CTAs, eyebrow, location, feature cards.
      type: 'page_section' as const,
      titleAr: 'حيث تخلق الخبرة القيمة.',
      titleEn: 'WHERE EXPERTISE CREATES VALUE.',
      bodyAr: 'خدمات استشارية وإدارية متكاملة لغد أكثر مرونة.',
      bodyEn: 'Integrated Advisory & Business Management Services for a more resilient tomorrow.',
      metadata: JSON.stringify({
        page: 'v2',
        sectionKey: 'hero',
        fields: {
          eyebrow: { ar: 'الناس • الرؤى • الفرص', en: 'PEOPLE • INSIGHT • OPPORTUNITY' },
          ctaPrimary: { ar: 'استكشف نهجنا', en: 'EXPLORE OUR APPROACH' },
          ctaSecondary: { ar: 'ابدأ محادثة', en: 'START A CONVERSATION' },
          location: { ar: 'مصر · العاصمة الإدارية الجديدة', en: 'EGYPT — NEW ADMINISTRATIVE CAPITAL' },
          watchStory: { ar: 'شاهد قصتنا', en: 'WATCH OUR STORY' },
          card1Title: { ar: 'خبرة محلية', en: 'LOCAL EXPERTISE' },
          card1Desc: { ar: 'فهم عميق للأسواق المحلية', en: 'Deep understanding of local markets' },
          card2Title: { ar: 'منظور دولي', en: 'INTERNATIONAL PERSPECTIVE' },
          card2Desc: { ar: 'رؤية عالمية لأعمالك', en: 'Global vision for your business' },
          card3Title: { ar: 'أثر دائم', en: 'LASTING IMPACT' },
          card3Desc: { ar: 'نتائج مستدامة وطويلة الأمد', en: 'Sustainable and long-term results' },
        },
      }),
    },
    {
      // Journey — section heading + eyebrow.
      type: 'page_section' as const,
      titleAr: 'أين أنت الآن؟ سنوضّح لك كيف نساعدك.',
      titleEn: 'Where are you now? See exactly how we help.',
      bodyAr: 'رحلتك معنا',
      bodyEn: 'YOUR JOURNEY',
      metadata: JSON.stringify({
        page: 'v2',
        sectionKey: 'journey',
        fields: {
          exploreCta: { ar: 'استكشف جميع الخدمات', en: 'Explore All Services' },
        },
      }),
    },
    {
      // Services grid — heading, eyebrow, intro paragraph, CTA.
      type: 'page_section' as const,
      titleAr: 'خبرة متكاملة. أثر حقيقي.',
      titleEn: 'INTEGRATED EXPERTISE. REAL-WORLD IMPACT.',
      bodyAr: 'خدماتنا',
      bodyEn: 'Our Services',
      metadata: JSON.stringify({
        page: 'v2',
        sectionKey: 'services',
        fields: {
          intro: {
            ar: 'نقدم خدمات استشارية وإدارية شاملة، نجمع فيها بين الخبرة الفنية العميقة والفهم العملي لطبيعة الأعمال.',
            en: 'We provide end-to-end advisory and business management services, combining deep technical expertise with practical business understanding.',
          },
          cta: { ar: 'استكشف خدماتنا', en: 'Explore Our Services' },
        },
      }),
    },
    {
      // Markets banner — heading, eyebrow, description, right heading, CTA.
      type: 'page_section' as const,
      titleAr: 'ربط الأسواق.\nصنع الفرص.',
      titleEn: 'Connecting Markets.\nCreating Opportunity.',
      bodyAr: 'رؤية أوسع',
      bodyEn: 'A Broader Perspective',
      metadata: JSON.stringify({
        page: 'v2',
        sectionKey: 'markets',
        fields: {
          description: {
            ar: 'ندعم المستثمرين والشركات في مصر ومنطقة الشرق الأوسط وشمال أفريقيا للوصول إلى الأسواق الأوروبية، من خلال الخبرة المحلية والمنظور الدولي.',
            en: 'Supporting investors and businesses in Egypt and across the MENA region, with access to European markets, through local expertise and international perspective.',
          },
          cta: { ar: 'نهجنا', en: 'Our Approach' },
          rightHeading: { ar: 'أسواق مختلفة.\nغدٌ أقوى.', en: 'Different Markets.\nA Stronger Tomorrow.' },
        },
      }),
    },
    {
      // Digital experience — heading, subtitle, badge, section eyebrow.
      type: 'page_section' as const,
      titleAr: 'أعمالك. متصلة.',
      titleEn: 'Your Business. Connected.',
      bodyAr: 'نطلق قريباً تطبيقنا الرقمي الجديد — مساحة آمنة وسلسة تجمع مهامك ومستنداتك وتقاريرك ومواعيدك الضريبية في مكان واحد. كن أول من يعرف.',
      bodyEn: 'We’re launching our new digital app soon — a secure, seamless space that brings your engagements, documents, reports, and tax deadlines together in one place. Be the first to know.',
      metadata: JSON.stringify({
        page: 'v2',
        sectionKey: 'digital',
        fields: {
          badge: { ar: 'قريباً', en: 'Coming Soon' },
          eyebrow: { ar: 'التطبيق الجديد للعملاء', en: 'The New Client App' },
          notifyCta: { ar: 'أعلمني', en: 'Notify Me' },
        },
      }),
    },
    {
      // Packages — heading + eyebrow + custom note.
      type: 'page_section' as const,
      titleAr: 'باقات مصممة لكل مرحلة من مراحل أعمالك.',
      titleEn: 'Packages built for every stage of your business.',
      bodyAr: 'الباقات',
      bodyEn: 'Packages',
      metadata: JSON.stringify({
        page: 'v2',
        sectionKey: 'packages',
        fields: {
          customNote: { ar: 'تحتاج شيئاً مختلفاً؟', en: 'Need something different?' },
          customCta: { ar: 'صمّم باقتك الخاصة', en: 'Build a custom package' },
        },
      }),
    },
    {
      // Contact — heading, eyebrow, contact detail labels/values.
      type: 'page_section' as const,
      titleAr: 'نحن هنا لمساعدتك في التخطيط لما هو قادم.',
      titleEn: 'We are here to help you plan for what comes next.',
      bodyAr: 'تواصل معنا',
      bodyEn: 'Contact Us',
      metadata: JSON.stringify({
        page: 'v2',
        sectionKey: 'contact',
        fields: {
          callLabel: { ar: 'اتصل بنا', en: 'Call us' },
          phone: { ar: '+۲۰ ۱۱۱ ۲۰٤ ۲۰۹۸', en: '+20 111 204 2098' },
          emailLabel: { ar: 'البريد الإلكتروني', en: 'Email' },
          email: { ar: 'info@sherifadvisory.com', en: 'info@sherifadvisory.com' },
          hqLabel: { ar: 'المقر الرئيسي', en: 'Headquarters' },
          hqValue: { ar: 'القاهرة الجديدة، القاهرة، مصر', en: 'New Cairo, Cairo, Egypt' },
          formTitle: { ar: 'لنبدأ العمل', en: "Let's get you started" },
        },
      }),
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
