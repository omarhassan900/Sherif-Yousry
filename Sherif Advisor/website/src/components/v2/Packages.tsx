'use client';

// ─────────────────────────────────────────────────────────────
// V2 PACKAGES SECTION — POC (Option A)
// Packages are defined here in code. Each package lists the
// services it includes by keyword; those are matched against the
// real CMS services (from /api/content/services) at render time,
// so the displayed service names stay in sync with the CMS.
// No backend/schema changes — fully isolated in v2.
// ─────────────────────────────────────────────────────────────

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';
import { useV2Section } from '@/lib/use-v2-section';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

interface CmsService {
  id: string;
  title: string;
}

// Package definitions. `serviceMatch` holds lowercased keywords; a CMS
// service is included in the package if its title contains any keyword.
// `extras` are bullet points that aren't tied to a specific service.
const packages = [
  {
    id: 'starter',
    nameAr: 'الباقة الأساسية',
    nameEn: 'Starter',
    taglineAr: 'للشركات الناشئة والأعمال الصغيرة',
    taglineEn: 'For startups & small businesses',
    priceAr: 'تواصل للسعر',
    priceEn: 'Contact for pricing',
    highlighted: false,
    serviceMatch: ['tax', 'audit', 'accounting', 'ضريب', 'تدقيق', 'محاسب'],
    extrasAr: ['استشارة أولية مجانية', 'دعم عبر البريد الإلكتروني'],
    extrasEn: ['Free initial consultation', 'Email support'],
  },
  {
    id: 'growth',
    nameAr: 'باقة النمو',
    nameEn: 'Growth',
    taglineAr: 'للشركات في مرحلة التوسع',
    taglineEn: 'For scaling companies',
    priceAr: 'تواصل للسعر',
    priceEn: 'Contact for pricing',
    highlighted: true,
    serviceMatch: [
      'tax', 'audit', 'financial', 'business', 'payroll',
      'ضريب', 'تدقيق', 'مالي', 'أعمال', 'رواتب',
    ],
    extrasAr: ['مدير حساب مخصص', 'مراجعة ربع سنوية', 'دعم ذو أولوية'],
    extrasEn: ['Dedicated account manager', 'Quarterly reviews', 'Priority support'],
  },
  {
    id: 'enterprise',
    nameAr: 'باقة المؤسسات',
    nameEn: 'Enterprise',
    taglineAr: 'للمجموعات والشركات الكبرى',
    taglineEn: 'For groups & large enterprises',
    priceAr: 'تواصل للسعر',
    priceEn: 'Contact for pricing',
    highlighted: false,
    serviceMatch: [
      'tax', 'audit', 'financial', 'business', 'corporate',
      'legal', 'payroll', 'commerce', 'digital',
      'ضريب', 'تدقيق', 'مالي', 'أعمال', 'مؤسس', 'قانون', 'رواتب', 'تجارة', 'رقمي',
    ],
    extrasAr: ['فريق استشاري متكامل', 'تقارير شهرية', 'دعم على مدار الساعة'],
    extrasEn: ['Full advisory team', 'Monthly reporting', '24/7 support'],
  },
];

export function Packages() {
  const [lang, setLang] = useState<Language>('en');
  const [isVisible, setIsVisible] = useState(false);
  const [cmsServices, setCmsServices] = useState<CmsService[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // CMS-backed heading/eyebrow/custom note (falls back to hardcoded copy).
  const section = useV2Section('packages', lang);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch real services so package contents reflect the CMS.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/content/services?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.items)) setCmsServices(data.items);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Resolve which real services belong to a package.
  const servicesFor = (match: string[]) =>
    cmsServices.filter((svc) =>
      match.some((kw) => (svc.title || '').toLowerCase().includes(kw))
    );

  return (
    <section ref={sectionRef} className="pt-6 pb-8 md:pt-7 md:pb-9 bg-[#fbf9f6]" id="packages">
      {/* Modern dark separator — a bold navy pill flanked by thick navy lines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8">
        <div className="flex items-center gap-4">
          <span className="h-[3px] flex-1 rounded-full bg-gradient-to-r from-transparent via-brand-navy/40 to-brand-navy" />
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 shadow-lg shadow-brand-navy/20">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase text-white">
              {section.body || t(lang, 'الباقات', 'Packages')}
            </span>
          </span>
          <span className="h-[3px] flex-1 rounded-full bg-gradient-to-l from-transparent via-brand-navy/40 to-brand-navy" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — centered, compact */}
        <div
          className={`text-center max-w-2xl mx-auto mb-5 md:mb-6 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-serif text-2xl md:text-3xl text-brand-navy leading-tight">
            {section.title || t(lang, 'باقات مصممة لكل مرحلة من مراحل أعمالك.', 'Packages built for every stage of your business.')}
          </h2>
        </div>

        {/* Package cards */}
        <div className="pkg-grid grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {packages.map((pkg, index) => {
            const allSvcs = servicesFor(pkg.serviceMatch);
            const MAX_ITEMS = 4;
            const svcs = allSvcs.slice(0, MAX_ITEMS);
            const moreCount = allSvcs.length - svcs.length;
            const extras = (lang === 'ar' ? pkg.extrasAr : pkg.extrasEn).slice(0, 2);
            const highlighted = pkg.highlighted;
            return (
              <div
                key={pkg.id}
                style={{
                  animation: isVisible ? `pkgReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index * 200}ms both` : 'none',
                }}
                className={`pkg-card overflow-hidden relative flex flex-col rounded-xl border p-4
                  ${
                    highlighted
                      ? 'bg-brand-navy border-brand-navy shadow-2xl lg:-translate-y-2'
                      : 'bg-white border-gray-200 shadow-sm'
                  }
                  ${isVisible ? 'shine' : 'opacity-0'}`}
              >
                {/* Popular badge (inside the card so overflow-hidden shine won't clip it) */}
                {highlighted && (
                  <span className="relative z-10 mb-2 self-start inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-brand-navy shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    {t(lang, 'الأكثر اختياراً', 'Most Popular')}
                  </span>
                )}

                {/* Name + tagline */}
                <h3 className={`relative z-10 font-serif text-xl ${highlighted ? 'text-white' : 'text-brand-navy'}`}>
                  {t(lang, pkg.nameAr, pkg.nameEn)}
                </h3>
                <p className={`text-xs mt-0.5 ${highlighted ? 'text-gray-300' : 'text-text-secondary'}`}>
                  {t(lang, pkg.taglineAr, pkg.taglineEn)}
                </p>

                {/* Price */}
                <div className={`mt-3 pb-3 border-b ${highlighted ? 'border-white/15' : 'border-gray-200'}`}>
                  <span className={`font-serif text-lg ${highlighted ? 'text-brand-gold' : 'text-brand-navy'}`}>
                    {t(lang, pkg.priceAr, pkg.priceEn)}
                  </span>
                </div>

                {/* Included services + extras (capped to keep cards compact) */}
                <ul className="mt-3 space-y-1.5 flex-1">
                  {svcs.map((svc) => (
                    <li key={svc.id} className="flex items-start gap-2">
                      <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${highlighted ? 'text-brand-gold' : 'text-brand-navy'}`} />
                      <span className={`text-[13px] leading-snug ${highlighted ? 'text-gray-100' : 'text-text-dark'}`}>
                        {svc.title}
                      </span>
                    </li>
                  ))}
                  {moreCount > 0 && (
                    <li className={`text-[12px] ps-6 ${highlighted ? 'text-gray-400' : 'text-text-secondary'}`}>
                      {t(lang, `+ ${moreCount} خدمات أخرى`, `+ ${moreCount} more services`)}
                    </li>
                  )}
                  {extras.map((extra, i) => (
                    <li key={`extra-${i}`} className="flex items-start gap-2">
                      <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${highlighted ? 'text-brand-gold' : 'text-brand-navy'}`} />
                      <span className={`text-[13px] leading-snug ${highlighted ? 'text-gray-300' : 'text-text-secondary'}`}>
                        {extra}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/v2#contact"
                  className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full px-6 py-2 text-[11px] font-bold tracking-[1.5px] uppercase transition-colors duration-300
                    ${
                      highlighted
                        ? 'bg-brand-gold text-brand-navy hover:bg-white'
                        : 'bg-brand-navy text-white hover:bg-brand-navy-mid'
                    }`}
                >
                  {t(lang, 'ابدأ الآن', 'Get Started')}
                  <span className="rtl:rotate-180">→</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Custom package note */}
        <p className="text-center text-sm text-text-secondary mt-5">
          {section.field('customNote', 'تحتاج شيئاً مختلفاً؟', 'Need something different?')}{' '}
          <Link href="/v2#contact" className="text-brand-navy font-semibold underline hover:text-brand-gold transition-colors">
            {section.field('customCta', 'صمّم باقتك الخاصة', 'Build a custom package')}
          </Link>
        </p>
      </div>

      <style jsx>{`
        /* Give the grid perspective so the 3D reveal reads clearly */
        .pkg-grid {
          perspective: 1400px;
        }

        /* Modern, noticeable reveal: cards flip up from below, blurred and
           rotated on the X axis, then snap into focus with an overshoot. */
        @keyframes pkgReveal {
          0% {
            opacity: 0;
            transform: perspective(1400px) rotateX(-35deg) translateY(60px) scale(0.9);
            filter: blur(10px);
          }
          60% {
            opacity: 1;
            filter: blur(0);
          }
          80% {
            transform: perspective(1400px) rotateX(0deg) translateY(-6px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: perspective(1400px) rotateX(0deg) translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* Animated gold shine that sweeps across each card as it appears */
        .pkg-card::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 20;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            transparent 30%,
            rgba(201, 169, 97, 0.4) 48%,
            transparent 66%
          );
          transform: translateX(-120%);
          opacity: 0;
        }
        .pkg-card.shine::after {
          animation: pkgShine 1s ease 0.4s 1;
        }
        @keyframes pkgShine {
          0% { transform: translateX(-120%); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }

        /* Hover lift */
        .pkg-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
          transform-style: preserve-3d;
        }
        .pkg-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(10, 30, 60, 0.22);
        }

        @media (prefers-reduced-motion: reduce) {
          .pkg-card {
            animation: none !important;
            opacity: 1 !important;
          }
          .pkg-card::after { display: none; }
        }
      `}</style>
    </section>
  );
}
