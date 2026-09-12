'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const journeyPaths = [
  {
    href: '/v2/services',
    img: '/images/primds.jpeg',
    kickerAr: 'الاستثمار',
    kickerEn: 'Investment',
    titleAr: 'أستثمر في مصر',
    titleEn: "I'm investing in Egypt",
    descAr: 'اكتشف الفرص في سوق ديناميكي ومتنامٍ، مع دعم كامل من الدخول إلى التوسع.',
    descEn: 'Unlock opportunities in a dynamic, growing market — with full support from entry to expansion.',
    ctaAr: 'ابدأ رحلة الاستثمار',
    ctaEn: 'Start your investment journey',
  },
  {
    href: '/v2/services',
    img: '/images/Bussniess.jpeg',
    kickerAr: 'النمو',
    kickerEn: 'Growth',
    titleAr: 'أبني أو أوسّع أعمالي',
    titleEn: "I'm building / expanding a business",
    descAr: 'حوّل طموحك إلى نمو مستدام وقابل للقياس عبر خبرة مالية وتشغيلية متكاملة.',
    descEn: 'Turn ambition into sustainable, measurable growth with integrated financial and operational expertise.',
    ctaAr: 'خطّط لنموّك',
    ctaEn: 'Plan your growth',
  },
  {
    href: '/v2/services',
    img: '/images/Greek.jpeg',
    kickerAr: 'الامتثال',
    kickerEn: 'Compliance',
    titleAr: 'أحتاج إلى استشارات ضريبية وامتثال',
    titleEn: "I need tax & compliance advisory",
    descAr: 'ابقَ متوافقاً مع الأنظمة وتقدّم بثقة، مع فريق يتابع كل تفصيلة نيابة عنك.',
    descEn: 'Stay compliant and move forward with confidence — a team that tracks every detail for you.',
    ctaAr: 'اطمئن على امتثالك',
    ctaEn: 'Review your compliance',
  },
  {
    href: '/v2/services',
    img: '/images/airport.jpeg',
    kickerAr: 'الصفقات',
    kickerEn: 'Transactions',
    titleAr: 'أفكّر في إجراء صفقة أو استحواذ',
    titleEn: "I'm considering a transaction",
    descAr: 'دعم خبير في كل خطوة، من التقييم والعناية الواجبة حتى إتمام الصفقة.',
    descEn: 'Expert support every step of the way — from valuation and due diligence to closing.',
    ctaAr: 'ناقش صفقتك',
    ctaEn: 'Discuss your transaction',
  },
];

export function Journey() {
  const [lang, setLang] = useState<Language>('en');
  const [isVisible, setIsVisible] = useState(false);
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  // Scroll-triggered reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const current = journeyPaths[active];

  return (
    <section ref={sectionRef} className="py-10 md:py-12 bg-[#fbf9f6]" id="journey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className={`max-w-3xl mb-6 md:mb-8 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-xs font-bold tracking-widest text-brand-gold uppercase mb-2 block">
            {t(lang, 'رحلتك معنا', 'YOUR JOURNEY')}
          </span>
          <h2 className="font-amiri text-2xl md:text-3xl text-brand-navy leading-tight">
            {t(lang, 'أين أنت الآن؟ سنوضّح لك كيف نساعدك.', 'Where are you now? See exactly how we help.')}
          </h2>
        </div>

        {/* Interactive selector + dynamic panel */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch transition-all duration-700 ease-out delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* LEFT: selectable paths */}
          <div className="lg:col-span-5 flex flex-col">
            <ul className="flex flex-col divide-y divide-black/10 border-y border-black/10">
              {journeyPaths.map((path, index) => {
                const isActive = index === active;
                return (
                  <li key={index}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onClick={() => setActive(index)}
                      aria-pressed={isActive}
                      className="group w-full text-start py-3 md:py-3.5 flex items-center gap-4 md:gap-5 transition-colors"
                    >
                      {/* Number / accent */}
                      <span
                        className={`relative flex-shrink-0 w-9 text-sm font-bold tabular-nums transition-colors ${
                          isActive ? 'text-brand-gold' : 'text-text-muted group-hover:text-brand-navy'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                        <span
                          className={`absolute -bottom-2 start-0 h-0.5 bg-brand-gold transition-all duration-300 ${
                            isActive ? 'w-8' : 'w-0'
                          }`}
                        />
                      </span>

                      <span className="flex-1 min-w-0">
                        <span
                          className={`block text-[10px] font-bold tracking-widest uppercase mb-1 transition-colors ${
                            isActive ? 'text-brand-gold' : 'text-text-muted'
                          }`}
                        >
                          {t(lang, path.kickerAr, path.kickerEn)}
                        </span>
                        <span
                          className={`block font-amiri text-base md:text-lg leading-snug transition-colors ${
                            isActive ? 'text-brand-navy' : 'text-text-secondary group-hover:text-brand-navy'
                          }`}
                        >
                          {t(lang, path.titleAr, path.titleEn)}
                        </span>
                      </span>

                      <ArrowRight
                        className={`w-5 h-5 flex-shrink-0 transition-all duration-300 rtl:rotate-180 ${
                          isActive
                            ? 'text-brand-gold translate-x-0 opacity-100'
                            : 'text-text-muted -translate-x-1 rtl:translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/v2/services"
              className="mt-5 self-start text-xs font-bold uppercase tracking-wider text-brand-navy hover:text-brand-gold transition-colors inline-flex items-center gap-2 group"
            >
              {t(lang, 'استكشف جميع الخدمات', 'Explore All Services')}
              <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">
                →
              </span>
            </Link>
          </div>

          {/* RIGHT: dynamic panel that reacts to the selected path */}
          <div className="lg:col-span-7">
            <div className="relative h-[260px] md:h-[300px] lg:h-full min-h-[260px] rounded-xl overflow-hidden shadow-xl">
              {/* Cross-fading images */}
              {journeyPaths.map((path, index) => (
                <img
                  key={index}
                  src={path.img}
                  alt={t(lang, path.titleAr, path.titleEn)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                    index === active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                />
              ))}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent" />

              {/* Content overlay, keyed so it re-animates on change */}
              <div
                key={active}
                className="absolute inset-x-0 bottom-0 p-5 md:p-7"
                style={{ animation: 'journeyFade 0.5s ease both' }}
              >
                <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-brand-gold mb-2">
                  {t(lang, current.kickerAr, current.kickerEn)}
                </span>
                <h3 className="font-amiri text-xl md:text-2xl text-white leading-snug mb-2 max-w-xl">
                  {t(lang, current.titleAr, current.titleEn)}
                </h3>
                <p className="text-xs md:text-sm text-gray-200 leading-relaxed max-w-lg mb-4">
                  {t(lang, current.descAr, current.descEn)}
                </p>
                <Link
                  href={current.href}
                  className="inline-flex items-center gap-2.5 bg-[#f7f3e9] text-brand-navy px-5 py-2.5 text-[11px] font-bold tracking-[1.5px] uppercase hover:bg-white transition-colors duration-200 group"
                >
                  {t(lang, current.ctaAr, current.ctaEn)}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                </Link>
              </div>

              {/* Progress dots */}
              <div className="absolute top-5 end-5 flex gap-1.5">
                {journeyPaths.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === active ? 'w-6 bg-brand-gold' : 'w-1.5 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes journeyFade {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

