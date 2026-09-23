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
      type: 'page_section' as const,
      titleAr: 'انضباط المكاتب الكبرى. ومرونة المكاتب المتخصصة.',
      titleEn: 'Big-firm discipline. Boutique agility.',
      bodyAr: 'لماذا شريف يسري للاستشارات؟',
      bodyEn: 'Why Sherif Yousry Advisory?',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'why-us' }),
    },
    {
      type: 'page_section' as const,
      titleAr: 'أسواق استراتيجية في الشرق الأوسط',
      titleEn: 'Strategic Markets in the Middle East',
      bodyAr: 'حضورنا الإقليمي',
      bodyEn: 'Regional Presence',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'markets' }),
    },
    {
      type: 'page_section' as const,
      titleAr: 'لست متأكداً من موقعك؟ ابدأ التقييم المجاني لأعمالك.',
      titleEn: 'Not sure where you stand? Start your free business assessment.',
      bodyAr: 'تسعة أسئلة عن الحجم والالتزام والنضج المالي تُنتج درجة جاهزية ومؤشرات مخاطر وخطة استشارية موصى بها — في أقل من أربع دقائق.',
      bodyEn: 'Nine questions on size, compliance and financial maturity produce a readiness score, risk indicators, and a recommended advisory plan — in under four minutes.',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'assessment' }),
    },
    {
      type: 'page_section' as const,
      titleAr: 'استشارات شاملة مبنية على التزاماتك.',
      titleEn: 'Comprehensive advisory built on your commitments.',
      bodyAr: 'خدماتنا',
      bodyEn: 'Our Services',
      metadata: JSON.stringify({ page: 'homepage', sectionKey: 'services' }),
    },
    {
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
    // ── About page – new sections ──────────────────────────────────────────
    {
      type: 'page_section' as const,
      titleAr: 'بدأنا بحلم تحويل الاستشارات إلى أثر حقيقي.',
      titleEn: 'We started with a vision to turn advisory into real-world impact.',
      bodyAr:
        'تأسست شريف يسري للاستشارات بهدف تقديم خدمات استشارية متخصصة تجمع بين الخبرة الفنية العميقة والفهم الحقيقي لاحتياجات الأعمال.\n\nعلى مدار السنوات الماضية، أصبحنا شريكاً موثوقاً للشركات المتوسطة والكبيرة في مصر ومنطقة الشرق الأوسط وشمال أفريقيا، نساعدهم على التعامل مع التحديات الضريبية والقانونية والمالية بثقة وكفاءة.\n\nما يميّزنا هو التزامنا بالجودة والنزاهة، ورؤيتنا الشاملة التي تجمع بين الخبرة المحلية والمنظور الدولي.',
      bodyEn:
        'Sherif Yousry Advisory was founded with a clear purpose: to deliver specialised advisory services that combine deep technical expertise with a genuine understanding of business needs.\n\nOver the years we have become a trusted partner for medium and large enterprises across Egypt and the MENA region, helping them navigate tax, legal, and financial challenges with confidence and precision.\n\nWhat sets us apart is our commitment to quality and integrity, and our holistic view combining local expertise with an international perspective.',
      metadata: JSON.stringify({
        page: 'about',
        sectionKey: 'story',
        fields: {
          eyebrow: { ar: 'قصتنا', en: 'OUR STORY' },
        },
      }),
    },
    {
      type: 'page_section' as const,
      titleAr: 'ما نؤمن به وما نسعى إليه.',
      titleEn: 'What we believe. What we strive for.',
      bodyAr:
        'تمكين الشركات والمستثمرين والأفراد من اتخاذ قرارات مالية وتجارية مدروسة من خلال تقديم استشارات متكاملة تجمع بين الدقة والعمق والمرونة.',
      bodyEn:
        'To empower businesses, investors, and individuals to make informed financial and commercial decisions through integrated advisory services that combine precision, depth, and agility.',
      metadata: JSON.stringify({
        page: 'about',
        sectionKey: 'mission',
        fields: {
          eyebrow: { ar: 'رسالتنا ورؤيتنا', en: 'MISSION & VISION' },
          missionTitle: { ar: 'الرسالة', en: 'Our Mission' },
          visionTitle: { ar: 'الرؤية', en: 'Our Vision' },
          visionBody: {
            ar: 'أن نكون الشريك الاستشاري الأول في مصر والمنطقة، المعروف بالنزاهة والتميّز والقدرة على إحداث أثر حقيقي وملموس في قطاعات الأعمال المختلفة.',
            en: 'To be the leading advisory partner in Egypt and the region — recognised for integrity, excellence, and the ability to create real and measurable impact across business sectors.',
          },
          value1: { ar: 'النزاهة', en: 'Integrity' },
          value2: { ar: 'التميّز', en: 'Excellence' },
          value3: { ar: 'الشراكة', en: 'Partnership' },
          value4: { ar: 'الابتكار', en: 'Innovation' },
        },
      }),
    },
    {
      type: 'page_section' as const,
      titleAr: 'تعرّف على الفريق الذي يقف وراء نجاحنا.',
      titleEn: 'Meet the people behind our success.',
      bodyAr: 'فريق من الخبراء الملتزمين بتقديم التميّز في كل مشروع.',
      bodyEn: 'A dedicated team of experts committed to delivering excellence across every project.',
      metadata: JSON.stringify({
        page: 'about',
        sectionKey: 'team',
        fields: {
          eyebrow: { ar: 'فريقنا', en: 'OUR TEAM' },
        },
      }),
    },
    {
      type: 'page_section' as const,
      titleAr: 'انضم إلى فريقنا واصنع مستقبلك معنا.',
      titleEn: 'Join our team and build your future with us.',
      bodyAr:
        'نبحث عن مواهب طموحة تسعى للتميّز في مجال الاستشارات المالية والضريبية والقانونية. قدّم طلبك الآن وكن جزءاً من رحلتنا.',
      bodyEn:
        'We are looking for ambitious talent who strive for excellence in financial, tax, and legal advisory. Apply now and be part of our journey.',
      metadata: JSON.stringify({
        page: 'about',
        sectionKey: 'careers',
        fields: {
          eyebrow: { ar: 'الوظائف', en: 'CAREERS' },
          ctaLabel: { ar: 'استعرض الوظائف', en: 'View All Openings' },
          applyLabel: { ar: 'قدّم الآن', en: 'Apply Now' },
          bannerHeading: { ar: 'هل أنت مستعد للخطوة التالية؟', en: 'Ready to take the next step?' },
          bannerBody: {
            ar: 'نبحث عن مواهب طموحة تسعى للتميّز. قدّم طلبك الآن وكن جزءاً من رحلتنا.',
            en: 'We are looking for ambitious talent who strive for excellence. Apply now and be part of our journey.',
          },
        },
      }),
    },
    {
      type: 'page_section' as const,
      titleAr: 'تواصل معنا',
      titleEn: 'Contact Page',
      bodyAr: 'تواصل معنا للحصول على استشارة',
      bodyEn: 'Contact us for a consultation',
      metadata: JSON.stringify({ page: 'contact', sectionKey: 'main' }),
    },
    {
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
  const existingSections = await prisma.contentItem.findMany({
    where: { type: 'page_section' },
  });

  function findExistingSection(metadataJson: string) {
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

  // Create or update page sections
  for (const section of pageSections) {
    const existing = findExistingSection(section.metadata);

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

  // ─────────────────────────────────────────────────────────────
  // EVENTS SEED DATA
  // ─────────────────────────────────────────────────────────────
  const events = [
    {
      type: 'event' as const,
      titleAr: 'ورشة عمل: تحديث ضريبة الشركات في مصر 2025',
      titleEn: 'Egypt Corporate Tax Update 2025 Workshop',
      bodyAr: 'ورشة عمل شاملة تغطي أحدث التعديلات على قوانين ضريبة الشركات المصرية واستراتيجيات الامتثال للشركات الحديثة.',
      bodyEn: 'A comprehensive workshop covering the latest amendments to Egyptian corporate tax laws and compliance strategies for modern businesses.',
      metadata: JSON.stringify({
        startDate: '2025-10-24T09:00:00.000Z',
        endDate: '2025-10-24T13:00:00.000Z',
        startTime: '09:00 AM',
        endTime: '01:00 PM',
        location: 'New Administrative Capital, Cairo',
        category: 'workshop',
        categoryLabel: 'Tax Workshop',
        eventType: 'In-Person',
        image: '/images/events/tax-workshop.jpg',
        isPaid: true,
      }),
    },
    {
      type: 'event' as const,
      titleAr: 'الإطار القانوني للمستثمرين الأجانب في منطقة الشرق الأوسط وشمال أفريقيا',
      titleEn: 'Legal Framework for Foreign Investors in the MENA Region',
      bodyAr: 'فهم المشهد التنظيمي، وحماية الاستثمارات، والهيكلة القانونية للكيانات الأجنبية التي تعمل في منطقة الشرق الأوسط وشمال أفريقيا.',
      bodyEn: 'Understanding the regulatory landscape, investment protections, and legal structuring for foreign entities operating in the MENA region.',
      metadata: JSON.stringify({
        startDate: '2025-11-12T14:00:00.000Z',
        endDate: '2025-11-12T16:30:00.000Z',
        startTime: '02:00 PM',
        endTime: '04:30 PM',
        location: 'Online via Zoom',
        category: 'seminar',
        categoryLabel: 'Legal Seminar',
        eventType: 'Virtual',
        image: '/images/events/legal-seminar.jpg',
        isPaid: false,
      }),
    },
    {
      type: 'event' as const,
      titleAr: 'المرحلة الثانية من الفوترة الإلكترونية: استراتيجيات الامتثال والتكامل',
      titleEn: 'E-Invoicing Phase 2: Compliance & Integration Strategies',
      bodyAr: 'خطوات عملية للشركات متوسطة الحجم لضمان التكامل السلس مع بوابة هيئة الضرائب المصرية.',
      bodyEn: 'Practical steps for mid-sized companies to ensure seamless integration with the Egyptian Tax Authority portal.',
      metadata: JSON.stringify({
        startDate: '2025-11-28T11:00:00.000Z',
        endDate: '2025-11-28T12:30:00.000Z',
        startTime: '11:00 AM',
        endTime: '12:30 PM',
        location: 'Online via Teams',
        category: 'webinar',
        categoryLabel: 'Financial Webinar',
        eventType: 'Virtual',
        image: '/images/events/e-invoicing.jpg',
        isPaid: false,
      }),
    },
    {
      type: 'event' as const,
      titleAr: 'قمة شريف يسري للاستشارات للأعمال السنوية',
      titleEn: 'Annual Sherif Yousry Advisory Business Summit',
      bodyAr: 'انضم إلى قادة الصناعة والمستثمرين وصناع السياسات ليوم كامل من الرؤى الاستراتيجية وتوقعات السوق والتواصل رفيع المستوى في قلب القاهرة.',
      bodyEn: 'Join industry leaders, investors, and policymakers for a full day of strategic insights, market forecasts, and high-level networking in the heart of Cairo.',
      metadata: JSON.stringify({
        startDate: '2025-12-15T08:00:00.000Z',
        endDate: '2025-12-15T18:00:00.000Z',
        startTime: '08:00 AM',
        endTime: '06:00 PM',
        location: 'The St. Regis Cairo',
        category: 'conference',
        categoryLabel: 'Conference',
        eventType: 'In-Person',
        image: '/images/events/summit.jpg',
        isPaid: true,
      }),
    },
    {
      type: 'event' as const,
      titleAr: 'تحديثات المعايير الدولية لإعداد التقارير المالية (IFRS) وأفضل الممارسات',
      titleEn: 'IFRS Updates and Financial Reporting Best Practices',
      bodyAr: 'تعمق في أحدث معايير التقارير المالية الدولية وتأثيرها على إعداد التقارير المحلية.',
      bodyEn: 'Deep dive into the latest International Financial Reporting Standards and their impact on local reporting.',
      metadata: JSON.stringify({
        startDate: '2026-01-10T10:00:00.000Z',
        endDate: '2026-01-10T14:00:00.000Z',
        startTime: '10:00 AM',
        endTime: '02:00 PM',
        location: 'Sherif Yousry Advisory HQ',
        category: 'workshop',
        categoryLabel: 'Tax Workshop',
        eventType: 'In-Person',
        image: '/images/events/ifrs.jpg',
        isPaid: true,
      }),
    },
    {
      type: 'event' as const,
      titleAr: 'التنقل في ضريبة الشركات في الإمارات: دليل للشركات المصرية',
      titleEn: 'Navigating UAE Corporate Tax: A Guide for Egyptian Businesses',
      bodyAr: 'مشورة استراتيجية للشركات المصرية التي تتوسع في دولة الإمارات العربية المتحدة والتنقل في نظام ضريبة الشركات الجديد.',
      bodyEn: 'Strategic advice for Egyptian companies expanding to the UAE and navigating the new corporate tax regime.',
      metadata: JSON.stringify({
        startDate: '2026-01-22T15:00:00.000Z',
        endDate: '2026-01-22T17:00:00.000Z',
        startTime: '03:00 PM',
        endTime: '05:00 PM',
        location: 'Online via Zoom',
        category: 'seminar',
        categoryLabel: 'Legal Seminar',
        eventType: 'Virtual',
        image: '/images/events/uae-tax.jpg',
        isPaid: false,
      }),
    },
  ];

  // Load all existing events once so we can match by titleEn to avoid duplicates
  const existingEvents = await prisma.contentItem.findMany({
    where: { type: 'event' },
  });

  function findExistingEvent(titleEn: string) {
    return existingEvents.find((row) => row.titleEn === titleEn);
  }

  // Create or update events
  for (const event of events) {
    const existing = findExistingEvent(event.titleEn);

    if (existing) {
      await prisma.contentItem.update({
        where: { id: existing.id },
        data: {
          titleAr: event.titleAr,
          titleEn: event.titleEn,
          bodyAr: event.bodyAr,
          bodyEn: event.bodyEn,
          metadata: event.metadata,
          updatedById: adminUser.id,
        },
      });
      console.log(`✓ Updated event: ${event.titleEn}`);
    } else {
      await prisma.contentItem.create({
        data: {
          ...event,
          status: 'published',
          createdById: adminUser.id,
          updatedById: adminUser.id,
        },
      });
      console.log(`✓ Created event: ${event.titleEn}`);
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