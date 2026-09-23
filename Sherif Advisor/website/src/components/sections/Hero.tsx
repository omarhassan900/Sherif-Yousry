'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, XCircle, ArrowRight, ArrowDown, BarChart2, ShieldCheck, Globe2 } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { useV2Section } from '@/lib/use-v2-section';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function Hero() {
  const [lang, setLang] = useState<Language>('en');
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // CMS-backed content from the homepage/hero section (admin: Sections → Hero Banner).
  const section = useV2Section('hero', lang, 'homepage');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  // Close video modal on Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVideoOpen(false);
    };
    if (isVideoOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isVideoOpen]);

  const videoUrl = 'https://www.youtube-nocookie.com/embed/GYBuD3JpxOI?rel=0';

  return (
    <section id="home" className="relative h-screen flex flex-col overflow-hidden">
      <ScrollProgress />

      {/* ── Full-bleed background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/bg.jpeg")' }}
      />
      {/* Light overall scrim so the photo stays bright */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030a12]/35 via-[#030a12]/15 to-[#030a12]/45" />
      {/* Soft side scrim behind the left text column for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030a12]/60 via-[#030a12]/10 to-transparent" />

      {/* ── Main hero content (vertically centered, flex-1) ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-10 items-center">

            {/* Left column */}
            <div className="space-y-6">
              {/* Eyebrow */}
              <div
                className="font-mono text-sm tracking-[0.3em] text-brand-gold"
                style={{ animation: 'heroFadeRight 0.8s ease 0.4s both' }}
              >
                {section.field('eyebrow', 'استراتيجية • ضرائب • استشارات أعمال', 'STRATEGY • TAX • BUSINESS ADVISORY')}
              </div>

              {/* Headline — CMS title (gold italic) or the two-line fallback */}
              <h1
                className="font-serif text-white leading-[1.05] max-w-2xl"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  animation: 'heroFadeUp 0.8s ease 0.6s both',
                  textShadow: '0 4px 24px rgba(0,0,0,0.6)',
                }}
              >
                {section.title ? (
                  <span className="italic text-brand-gold">{section.title}</span>
                ) : (
                  <>
                    {t(lang, 'خبرة لصنع', 'EXPERTISE FOR')}<br />
                    <span className="italic text-brand-gold">
                      {t(lang, 'قرارات تصنع الفارق.', 'DECISIONS THAT MATTER.')}
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p
                className="text-gray-300 text-base max-w-xl leading-relaxed"
                style={{ animation: 'heroFadeUp 0.8s ease 0.8s both', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                {section.body || t(
                  lang,
                  'نقدم حلولاً استشارية عملية ومخصصة للشركات والمستثمرين والأفراد في مصر وخارجها. من الاستراتيجية إلى التنفيذ، نجلب الوضوح للتعقيدات ونساعد في تحويل القرارات المهمة إلى نتائج ملموسة.',
                  'We provide practical and tailored advisory solutions for businesses, investors, and individuals operating in Egypt and beyond. From strategy to execution, we bring clarity to complexity and help turn critical decisions into measurable results.'
                )}
              </p>

              {/* CTA buttons — Apollo style: at rest just a filled arrow circle
                  + bare label (no pill). On hover a rounded border expands to
                  wrap the whole button and the arrow nudges forward. */}
              <div className="flex flex-wrap gap-4" style={{ animation: 'heroFadeUp 0.8s ease 1s both' }}>
                <Link
                  href="/#contact"
                  className="cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase"
                >
                  {/* Expanding gold fill — grows from the circle on hover (pure Tailwind) */}
                  <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-gold transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                  <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-gold text-[#030a12] flex-shrink-0">
                    <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                  <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#030a12]">
                    {section.field('ctaPrimary', 'احجز استشارة', 'Schedule a Consultation')}
                  </span>
                </Link>
                <Link
                  href="/services"
                  className="cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase"
                >
                  {/* Expanding gold fill — grows from the circle on hover (pure Tailwind) */}
                  <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-gold transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                  <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-gold text-[#030a12] flex-shrink-0">
                    <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                  <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#030a12]">
                    {section.field('ctaSecondary', 'استكشف خدماتنا', 'Explore Our Services')}
                  </span>
                </Link>
              </div>
            </div>

            {/* Right column — partner tag */}
            <div
              className="hidden lg:flex flex-col items-end justify-start pt-4"
              style={{ animation: 'heroFadeRight 0.8s ease 1s both' }}
            >
              <div className="border-l-2 border-brand-gold/50 pl-6 text-right">
                <p className="text-white text-sm font-bold tracking-[0.2em] uppercase leading-relaxed">
                  {t(lang, 'شريكك', 'YOUR')}<br />
                  {t(lang, 'لغدٍ', 'PARTNER')}<br />
                  {t(lang, 'أقوى', 'FOR A STRONGER')}<br />
                  <span className="text-brand-gold">{t(lang, '', 'TOMORROW')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 border-t border-white/10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">

          {/* Scroll to discover — label with the arrow beneath it */}
          <div
            className="hidden md:flex flex-col gap-1 text-gray-400"
            style={{ animation: 'heroFadeUp 0.8s ease 1.4s both' }}
          >
            <span className="text-[10px] tracking-[0.2em] uppercase">{t(lang, 'اسحب', 'SCROLL')}</span>
            <span className="text-[10px] tracking-[0.2em] uppercase">{t(lang, 'للاكتشاف', 'TO DISCOVER')}</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce mt-0.5" />
          </div>

          {/* Stats pills */}
          <div
            className="flex items-center gap-4 lg:gap-6"
            style={{ animation: 'heroFadeUp 0.8s ease 1.2s both' }}
          >
            {[
              { Icon: BarChart2, titleAr: 'تركيز على المستثمر', titleEn: 'INVESTOR FOCUS', descAr: 'فرص حقيقية', descEn: 'Real Opportunities' },
              { Icon: ShieldCheck, titleAr: 'مستشار موثوق', titleEn: 'TRUSTED ADVISOR', descAr: 'نمو مستدام', descEn: 'Sustainable Growth' },
              { Icon: Globe2, titleAr: 'خبرة محلية', titleEn: 'LOCAL EXPERTISE', descAr: 'منظور عالمي', descEn: 'Global Perspective' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {i > 0 && <span className="w-px h-7 bg-white/15 hidden sm:block" />}
                <stat.Icon className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[9px] font-bold tracking-[0.12em] text-white uppercase">
                    {t(lang, stat.titleAr, stat.titleEn)}
                  </span>
                  <span className="text-[9px] text-gray-400">
                    {t(lang, stat.descAr, stat.descEn)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Watch Our Story + Egypt location */}
          <div className="flex items-center gap-4" style={{ animation: 'heroFadeRight 0.8s ease 1.2s both' }}>
            <button
              onClick={() => setIsVideoOpen(true)}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <span className="relative flex items-center justify-center w-16 h-16">
                {/* Soft pulsing halo */}
                <span className="absolute inset-0 rounded-full bg-white/20 hero-halo" aria-hidden="true" />
                {/* Rotating conic gradient ring */}
                <span className="hero-ring absolute inset-0 rounded-full" aria-hidden="true" />
                {/* Solid glass play button */}
                <span className="relative z-10 w-14 h-14 rounded-full border-2 border-white bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/30 transition-all duration-300 group-hover:bg-white group-hover:scale-110">
                  <Play className="w-6 h-6 text-white ml-0.5 transition-colors duration-300 group-hover:text-[#030a12]" fill="currentColor" />
                </span>
              </span>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-white text-[10px] font-bold tracking-[0.12em] uppercase">{t(lang, 'شاهد', 'WATCH')}</p>
                <p className="text-white text-[10px] font-bold tracking-[0.12em] uppercase">{t(lang, 'قصتنا', 'OUR STORY')}</p>
              </div>
            </button>

            <span className="w-px h-7 bg-white/15 hidden sm:block" />

            <div className="hidden sm:flex flex-col leading-tight text-right">
              <span className="w-6 h-px bg-brand-gold/70 mb-1.5 ms-auto" aria-hidden="true" />
              <span className="text-[10px] font-bold text-white tracking-[0.12em] uppercase">{t(lang, 'مصر', 'EGYPT')}</span>
              <span className="text-[9px] text-gray-400 tracking-[0.08em]">{t(lang, 'العاصمة الإدارية الجديدة', 'A NEW ADMINISTRATIVE CAPITAL')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── VIDEO MODAL ── */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
          onClick={() => setIsVideoOpen(false)}
        >
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close video"
          >
            <XCircle className="w-10 h-10" />
          </button>
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              key={videoUrl}
              src={videoUrl}
              title="Sherif Yousry Advisory Story"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <a
              href="https://www.youtube.com/watch?v=GYBuD3JpxOI"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 z-10 text-[11px] text-white/70 hover:text-white underline"
            >
              {t(lang, 'مشاهدة على يوتيوب', 'Watch on YouTube')}
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        /* Modern play button: rotating gradient ring + breathing halo */
        .hero-ring {
          background: conic-gradient(
            from 0deg,
            rgba(255,255,255,0) 0deg,
            rgba(255,255,255,0.95) 120deg,
            rgba(255,255,255,0) 260deg
          );
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
          animation: heroSpin 3.5s linear infinite;
        }
        @keyframes heroSpin {
          to { transform: rotate(360deg); }
        }
        .hero-halo {
          animation: heroHalo 2.4s ease-in-out infinite;
        }
        @keyframes heroHalo {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.4); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-ring, .hero-halo { animation: none; }
          .hero-halo { opacity: 0; }
        }

      `}</style>
    </section>
  );
}
