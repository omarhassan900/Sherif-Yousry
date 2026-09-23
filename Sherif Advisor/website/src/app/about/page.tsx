'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
<<<<<<< HEAD
import { Team } from '@/components/sections/Team';
=======
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { Team } from '@/components/sections/Team';
import { ArrowRight, Eye, Target, Briefcase, TrendingUp, Users, Heart } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';
>>>>>>> a1aeb90 (UI & portal)

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

/* ── CMS section shape ──────────────────────────────────────────────── */
interface CmsSection {
  title: string;
  body: string;
  metadata: {
    fields?: Record<string, { ar: string; en: string }>;
  };
}

function useCmsSection(page: string, key: string, lang: Language, ready: boolean) {
  const [data, setData] = useState<CmsSection | null>(null);
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    fetch(`/api/content/sections/${page}/${key}?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [page, key, lang, ready]);
  return data;
}

/* ── Fade-in on scroll ──────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}>
      {children}
    </div>
  );
}

/* ── Stats ──────────────────────────────────────────────────────────── */
const stats = [
  { valueEn: '15+', valueAr: '+15', labelEn: 'Years of Experience', labelAr: 'سنوات خبرة' },
  { valueEn: '500+', valueAr: '+500', labelEn: 'Clients Served', labelAr: 'عميل محكوم' },
  { valueEn: '20+', valueAr: '+20', labelEn: 'Industry Sectors', labelAr: 'قطاع صناعي' },
  { valueEn: '5', valueAr: '5', labelEn: 'Partners', labelAr: 'شركاء' },
];

/* ── Careers perks (static — visual only) ───────────────────────────── */
const perks = [
  { icon: TrendingUp, titleEn: 'Professional Growth', titleAr: 'نمو مهني مستمر', descEn: 'Advanced training programs and clear paths for career advancement.', descAr: 'برامج تدريبية متطورة ومسارات واضحة للترقي المهني.' },
  { icon: Users,     titleEn: 'Collaborative Culture', titleAr: 'ثقافة تعاونية',   descEn: 'Work alongside top experts and share ideas across departments.', descAr: 'العمل جنباً إلى جنب مع كبار الخبراء وتبادل الأفكار عبر الأقسام.' },
  { icon: Heart,     titleEn: 'Work-Life Balance',     titleAr: 'توازن الحياة والعمل', descEn: 'We value your wellbeing and offer a flexible, supportive environment.', descAr: 'نقدّر رفاهيتك ونوفر بيئة عمل مرنة وداعمة.' },
  { icon: Briefcase, titleEn: 'Global Exposure',       titleAr: 'تعرض دولي',        descEn: 'Engage with international clients and cross-border projects.', descAr: 'التعامل مع العملاء الدوليين والمشاريع العابرة للحدود.' },
];

/* ── Core value icons (static) ──────────────────────────────────────── */
const valueIcons = ['⚖️', '🏆', '🤝', '💡'];

export default function AboutPage() {
  const [lang, setLang] = useState<Language>('en');
  const [langReady, setLangReady] = useState(false);

  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

  /* Fetch all CMS sections */
  const heroSection    = useCmsSection('about', 'main',    lang, langReady);
  const storySection   = useCmsSection('about', 'story',   lang, langReady);
  const missionSection = useCmsSection('about', 'mission', lang, langReady);
  const teamSection    = useCmsSection('about', 'team',    lang, langReady);
  const careersSection = useCmsSection('about', 'careers', lang, langReady);

  /* Helper: read a bilingual field from a section's metadata.fields */
  function field(section: CmsSection | null, key: string, fallbackAr: string, fallbackEn: string) {
    const f = section?.metadata?.fields?.[key];
    if (!f) return t(lang, fallbackAr, fallbackEn);
    return lang === 'ar' ? (f.ar || fallbackAr) : (f.en || fallbackEn);
  }

  return (
    <main className="min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <ScrollProgress />
      <Header />

      {/* ════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[70vh] min-h-[560px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/bg-3.jpeg" alt="About us hero" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030a12]/90 via-[#030a12]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24">
          <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5" style={{ animation: 'aboutFadeRight 0.8s ease 0.2s both' }}>
            {t(lang, 'من نحن', 'ABOUT US')}
          </p>
          <h1
            className="font-serif text-white leading-[1.05] max-w-2xl mb-6"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', animation: 'aboutFadeUp 0.8s ease 0.4s both', textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}
          >
            {heroSection?.title || t(lang, 'شريك استشاري يقودك', 'An Advisory Partner')}
            <br />
            <span className="italic text-brand-gold">
              {t(lang, 'نحو القرار الصائب.', 'Guiding Every Decision.')}
            </span>
          </h1>
          <p
            className="text-gray-300 text-base max-w-xl leading-relaxed mb-8"
            style={{ animation: 'aboutFadeUp 0.8s ease 0.6s both' }}
            dangerouslySetInnerHTML={{
              __html: heroSection?.body || t(
                lang,
                'شريف يسري للاستشارات — شركة استشارية متخصصة تقدم خدمات الضرائب والتمويل وإدارة الأعمال للشركات في مصر ومنطقة الشرق الأوسط وشمال أفريقيا.',
                'Sherif Yousry Advisory — a specialised firm delivering tax, finance, and business management services to enterprises across Egypt and the MENA region.'
              ),
            }}
          />

          {/* Stat pills */}
          <div className="flex flex-wrap gap-6" style={{ animation: 'aboutFadeUp 0.8s ease 0.8s both' }}>
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-3xl font-serif text-brand-gold leading-none">{t(lang, s.valueAr, s.valueEn)}</span>
                <span className="text-[11px] tracking-widest text-gray-300 uppercase mt-1">{t(lang, s.labelAr, s.labelEn)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <style jsx>{`
          @keyframes aboutFadeUp    { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
          @keyframes aboutFadeRight { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
        `}</style>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          OUR STORY
      ════════════════════════════════════════════════════════════════ */}
      <section id="our-story" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative h-[480px] rounded-sm overflow-hidden shadow-2xl">
                <Image src="/images/bg-4.jpeg" alt="Our story" fill className="object-cover" />
                <div className="absolute inset-0 bg-brand-navy/20" />
                <span className="absolute top-0 start-0 w-1.5 h-full bg-brand-gold" aria-hidden="true" />
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="font-mono text-xs tracking-[0.3em] text-brand-gold uppercase mb-4">
                {field(storySection, 'eyebrow', 'قصتنا', 'OUR STORY')}
              </p>
              <h2 className="font-serif text-brand-navy mb-6 leading-tight" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
                {storySection?.title || t(lang, 'بدأنا بحلم تحويل الاستشارات إلى أثر حقيقي.', 'We started with a vision to turn advisory into real-world impact.')}
              </h2>
              {storySection?.body ? (
                /* CMS body — rendered as HTML (the BilingualEditor stores rich text) */
                <div
                  className="space-y-4 text-gray-600 leading-relaxed text-[15px] prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: storySection.body }}
                />
              ) : (
                <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
                  <p>{t(lang, 'تأسست شريف يسري للاستشارات بهدف تقديم خدمات استشارية متخصصة تجمع بين الخبرة الفنية العميقة والفهم الحقيقي لاحتياجات الأعمال.', 'Sherif Yousry Advisory was founded with a clear purpose: to deliver specialised advisory services that combine deep technical expertise with a genuine understanding of business needs.')}</p>
                  <p>{t(lang, 'على مدار السنوات الماضية، أصبحنا شريكاً موثوقاً للشركات في مصر ومنطقة الشرق الأوسط وشمال أفريقيا.', 'Over the years we have become a trusted partner for enterprises across Egypt and the MENA region.')}</p>
                  <p>{t(lang, 'ما يميّزنا هو التزامنا بالجودة والنزاهة، ورؤيتنا الشاملة.', 'What sets us apart is our commitment to quality and integrity, and our holistic view.')}</p>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MISSION & VISION
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="mission-vision"
        className="py-24"
        style={{ backgroundColor: '#030a12', backgroundImage: 'radial-gradient(ellipse 60% 50% at 35% 20%, rgba(14,55,99,0.45) 0%, transparent 80%), radial-gradient(ellipse 40% 40% at 70% 60%, rgba(8,38,70,0.3) 0%, transparent 70%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.3em] text-brand-gold uppercase mb-4">
              {field(missionSection, 'eyebrow', 'رسالتنا ورؤيتنا', 'MISSION & VISION')}
            </p>
            <h2 className="font-serif text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
              {missionSection?.title || t(lang, 'ما نؤمن به وما نسعى إليه.', 'What we believe. What we strive for.')}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <FadeIn delay={100}>
              <div className="relative rounded-sm border border-white/10 bg-white/5 backdrop-blur-sm p-10 h-full group hover:border-brand-gold/40 transition-colors duration-300">
                <span className="absolute inset-y-0 start-0 w-1 bg-brand-gold/70 rounded-full" aria-hidden="true" />
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-4">
                  {field(missionSection, 'missionTitle', 'الرسالة', 'Our Mission')}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {missionSection?.body || t(lang, 'تمكين الشركات والمستثمرين والأفراد من اتخاذ قرارات مالية وتجارية مدروسة.', 'To empower businesses, investors, and individuals to make informed financial and commercial decisions.')}
                </p>
              </div>
            </FadeIn>

            {/* Vision */}
            <FadeIn delay={200}>
              <div className="relative rounded-sm border border-white/10 bg-white/5 backdrop-blur-sm p-10 h-full group hover:border-brand-gold/40 transition-colors duration-300">
                <span className="absolute inset-y-0 start-0 w-1 bg-brand-gold/70 rounded-full" aria-hidden="true" />
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-serif text-2xl text-white mb-4">
                  {field(missionSection, 'visionTitle', 'الرؤية', 'Our Vision')}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {field(missionSection, 'visionBody',
                    'أن نكون الشريك الاستشاري الأول في مصر والمنطقة، المعروف بالنزاهة والتميّز.',
                    'To be the leading advisory partner in Egypt and the region — recognised for integrity, excellence, and the ability to create real and measurable impact.'
                  )}
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Values row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {(['value1', 'value2', 'value3', 'value4'] as const).map((key, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="border border-white/10 bg-white/5 rounded-sm p-6 text-center hover:border-brand-gold/40 hover:bg-white/10 transition-all duration-300">
                  <span className="text-2xl block mb-3">{valueIcons[i]}</span>
                  <p className="font-serif text-white text-lg">
                    {field(missionSection, key,
                      ['النزاهة', 'التميّز', 'الشراكة', 'الابتكار'][i],
                      ['Integrity', 'Excellence', 'Partnership', 'Innovation'][i]
                    )}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          OUR TEAM  (uses existing Team carousel component)
      ════════════════════════════════════════════════════════════════ */}
      <section id="our-team">
        {/* Override heading text with CMS if available */}
        {teamSection && (
          <div className="pt-20 pb-4 bg-gray-50">
            <div className="max-w-2xl mx-auto px-6 text-center">
              <span className="inline-block text-sm font-semibold tracking-wider uppercase text-primary mb-3">
                {field(teamSection, 'eyebrow', 'فريقنا', 'Our Team')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {teamSection.title}
              </h2>
              <p className="text-gray-600 text-lg">{teamSection.body}</p>
            </div>
          </div>
        )}
        <Team hideHeader={!!teamSection} />
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CAREERS TEASER
      ════════════════════════════════════════════════════════════════ */}
      <section id="careers" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <FadeIn className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-brand-gold uppercase mb-4">
                {field(careersSection, 'eyebrow', 'الوظائف', 'CAREERS')}
              </p>
              <h2 className="font-serif text-brand-navy leading-tight" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
                {careersSection?.title
                  ? careersSection.title
                  : (
                    <>
                      {t(lang, 'انضم إلى فريقنا', 'Join Our Team')}
                      <br />
                      <span className="italic text-brand-gold">
                        {t(lang, 'واصنع مستقبلك معنا.', 'Build Your Future With Us.')}
                      </span>
                    </>
                  )
                }
              </h2>
            </div>
            <div className="flex items-end">
              <Link
                href="/careers"
                className="border-brand-navy border group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-xs font-bold uppercase tracking-wider"
              >
                <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-navy transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-navy text-white flex-shrink-0">
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
                <span className="relative z-10 text-brand-navy transition-colors duration-300 group-hover:text-white">
                  {field(careersSection, 'ctaLabel', 'استعرض الوظائف', 'View All Openings')}
                </span>
              </Link>
            </div>
          </FadeIn>

          {/* Perks grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {perks.map((perk, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white p-8 rounded-sm border border-gray-100 hover:border-brand-gold/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="w-12 h-12 bg-brand-navy/5 rounded-full flex items-center justify-center mb-5">
                    <perk.icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h3 className="font-serif text-lg text-brand-navy mb-2">{t(lang, perk.titleAr, perk.titleEn)}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{t(lang, perk.descAr, perk.descEn)}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA banner */}
          <FadeIn delay={300}>
            <div className="relative rounded-sm overflow-hidden">
              <Image src="/images/bg.jpeg" alt="Join our team" fill className="object-cover" />
              <div className="absolute inset-0 bg-brand-navy/85" />
              <div className="relative z-10 py-16 px-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">
                    {field(careersSection, 'bannerHeading', 'هل أنت مستعد للخطوة التالية؟', 'Ready to take the next step?')}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                    {field(careersSection, 'bannerBody',
                      'نبحث عن مواهب طموحة تسعى للتميّز. قدّم طلبك الآن وكن جزءاً من رحلتنا.',
                      'We are looking for ambitious talent who strive for excellence. Apply now and be part of our journey.'
                    )}
                  </p>
                </div>
                <Link
                  href="/careers#apply-now"
                  className="shrink-0 border border-brand-gold/50 group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-gold transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                  <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-gold text-white flex-shrink-0">
                    <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                  <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#030a12]">
                    {field(careersSection, 'applyLabel', 'قدّم الآن', 'Apply Now')}
                  </span>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

<<<<<<< HEAD
      <WhyUs />
        <Team />
=======
>>>>>>> a1aeb90 (UI & portal)
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
