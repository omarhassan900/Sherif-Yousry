/**
 * One-off script: update the homepage/hero CMS record with the real hero copy
 * (title, body, and the extra fields the Hero component reads). Run with:
 *   node scripts/seed-hero.mjs
 */
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL || 'file:./prisma/dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const prisma = new PrismaClient({ adapter });

const HERO_ID = 'cmt5qom2e00012cvcwchvpkmc';

// Bilingual extra fields consumed by the Hero via section.field(...).
const fields = {
  eyebrow: {
    ar: 'استراتيجية • ضرائب • استشارات أعمال',
    en: 'STRATEGY • TAX • BUSINESS ADVISORY',
  },
  ctaPrimary: {
    ar: 'احجز استشارة',
    en: 'Schedule a Consultation',
  },
  ctaSecondary: {
    ar: 'استكشف خدماتنا',
    en: 'Explore Our Services',
  },
  location: {
    ar: 'مصر · العاصمة الإدارية الجديدة',
    en: 'EGYPT — NEW ADMINISTRATIVE CAPITAL',
  },
  watchStory: {
    ar: 'شاهد قصتنا',
    en: 'WATCH OUR STORY',
  },
};

async function main() {
  const existing = await prisma.contentItem.findUnique({ where: { id: HERO_ID } });
  if (!existing) {
    throw new Error(`Hero record ${HERO_ID} not found.`);
  }

  // Preserve any existing metadata keys (page, sectionKey, ...) and merge fields.
  let metadata = {};
  try {
    metadata = JSON.parse(existing.metadata || '{}');
  } catch {
    metadata = {};
  }
  metadata.page = metadata.page || 'homepage';
  metadata.sectionKey = metadata.sectionKey || 'hero';
  metadata.fields = fields;

  const updated = await prisma.contentItem.update({
    where: { id: HERO_ID },
    data: {
      titleAr: 'خبرة لصنع قرارات تصنع الفارق.',
      titleEn: 'EXPERTISE FOR DECISIONS THAT MATTER.',
      bodyAr:
        'نقدم حلولاً استشارية عملية ومخصصة للشركات والمستثمرين والأفراد في مصر وخارجها. من الاستراتيجية إلى التنفيذ، نجلب الوضوح للتعقيدات ونساعد في تحويل القرارات المهمة إلى نتائج ملموسة.',
      bodyEn:
        'We provide practical and tailored advisory solutions for businesses, investors, and individuals operating in Egypt and beyond. From strategy to execution, we bring clarity to complexity and help turn critical decisions into measurable results.',
      status: 'published',
      metadata: JSON.stringify(metadata),
    },
  });

  console.log('✅ Hero updated:', {
    id: updated.id,
    titleEn: updated.titleEn,
    status: updated.status,
  });
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
