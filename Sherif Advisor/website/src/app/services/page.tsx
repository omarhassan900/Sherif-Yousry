'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Services } from '@/components/sections/Services';
import { getClientLanguage, type Language } from '@/lib/language';

interface ServiceItem {
  id: string;
  title: string;
  body: string;
  metadata: {
    icon?: string;
    displayOrder?: number;
    descriptionAr?: string;
    descriptionEn?: string;
    image?: string;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('ar');
  const [langReady, setLangReady] = useState(false);

  // Resolve the client language before any fetch happens.
  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

  useEffect(() => {
    if (!langReady) return;
    let cancelled = false;
    async function fetchServices() {
      try {
        const res = await fetch(`/api/content/services?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          // Ignore this response if a newer language change superseded it.
          if (!cancelled && data.items && data.items.length > 0) {
            setServices(data.items);
          }
        }
      } catch {
        // Fall through to static content
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchServices();
    return () => {
      cancelled = true;
    };
  }, [lang, langReady]);

  return (
    <main>
      <Header />
      <div className="bg-brand-navy py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="section-label mb-4 block">
            {lang === 'ar' ? 'ما نقدمه' : 'What We Offer'}
          </span>
          <h1 className="font-amiri text-4xl md:text-5xl text-text-primary leading-relaxed">
            {lang === 'ar' ? 'خدمات استشارية متكاملة' : 'Comprehensive Advisory Services'}
          </h1>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto leading-7">
            {lang === 'ar'
              ? 'نقدم تسع مجالات ممارسة متكاملة تغطي احتياجات شركتك من الالتزام الضريبي إلى التوسع الإقليمي مروراً بالحوكمة والإدارة المالية.'
              : 'We offer nine integrated practice areas covering your company\'s needs from tax compliance to regional expansion through governance and financial management.'}
          </p>
        </div>
      </div>
      {/* Smart index of the seven service categories */}
      <ServicesIndex lang={lang} services={services} />
      <Footer />
    </main>
  );
}

// The seven service categories (matches the home-page ServicesGrid). Each has
// `match` keywords used to pull the real CMS services that belong to it.
const SERVICE_CATEGORIES = [
  {
    titleAr: 'الاستشارات الضريبية',
    titleEn: 'Tax Advisory',
    descAr: 'تحويل تعقيدات الضرائب إلى وضوح وقيمة استراتيجية.',
    descEn: 'Turning tax complexity into clarity and strategic value.',
    match: ['tax', 'ضريب'],
  },
  {
    titleAr: 'التدقيق والمحاسبة والتأكيد',
    titleEn: 'Audit, Accounting & Assurance',
    descAr: 'معلومات مالية موثوقة وثقة أكبر في كل قرار.',
    descEn: 'Reliable financial information and greater confidence in every decision.',
    match: ['audit', 'accounting', 'assurance', 'تدقيق', 'محاسب', 'تأكيد'],
  },
  {
    titleAr: 'الاستشارات المالية',
    titleEn: 'Financial Advisory',
    descAr: 'من الرؤية المالية إلى قرارات أفضل للأعمال.',
    descEn: 'From financial insight to better business decisions.',
    match: ['financial', 'finance', 'مالي'],
  },
  {
    titleAr: 'استشارات الأعمال والاقتصاد والإدارة',
    titleEn: 'Business, Economic & Management Advisory',
    descAr: 'تحويل تحديات الأعمال إلى فرص عملية.',
    descEn: 'Turning business challenges into practical opportunities.',
    match: ['business', 'economic', 'management', 'أعمال', 'اقتصاد', 'إدار'],
  },
  {
    titleAr: 'الخدمات المؤسسية والقانونية',
    titleEn: 'Corporate & Legal Services',
    descAr: 'بناء الأساس المؤسسي الصحيح لأعمالك.',
    descEn: 'Building the right corporate foundation for your business.',
    match: ['corporate', 'legal', 'مؤسس', 'قانون'],
  },
  {
    titleAr: 'الرواتب والتأمينات الاجتماعية',
    titleEn: 'Payroll & Social Insurance',
    descAr: 'عمليات دقيقة والتزام كامل وراحة بال.',
    descEn: 'Accurate processes, full compliance, peace of mind.',
    match: ['payroll', 'insurance', 'رواتب', 'تأمين'],
  },
  {
    titleAr: 'التجارة الإلكترونية والأعمال الرقمية',
    titleEn: 'E-Commerce & Digital Business',
    descAr: 'دعم انطلاق ونمو أعمالك الرقمية.',
    descEn: 'Supporting the launch and growth of your digital business.',
    match: ['e-commerce', 'ecommerce', 'commerce', 'digital', 'تجارة', 'رقمي', 'إلكترون'],
  },
];

/**
 * ServicesIndex — an interactive "smart index" of the seven service categories.
 *
 * Left: a numbered list of the categories. Hovering (or focusing) a row makes it
 * the active item. Right: a sticky preview panel that cross-fades to the active
 * category's title + description with a subtle slide/scale animation.
 */
function ServicesIndex({ lang, services }: { lang: Language; services: ServiceItem[] }) {
  const [active, setActive] = useState(0);
  const isAr = lang === 'ar';
  const activeCat = SERVICE_CATEGORIES[active];

  // Real CMS services that belong to the active category. Match against the
  // title plus the English/Arabic descriptions so it works regardless of the
  // display language (some CMS titles are Arabic, some English).
  const matched = services.filter((svc) => {
    const haystack = [
      svc.title,
      svc.metadata?.descriptionEn,
      svc.metadata?.descriptionAr,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return activeCat.match.some((kw) => haystack.includes(kw));
  });

  return (
    <section className="bg-surface-light py-16 lg:py-24" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
        {/* Left: the seven-category index list */}
        <ul className="flex flex-col divide-y divide-gray-200 border-y border-gray-200">
          {SERVICE_CATEGORIES.map((cat, index) => {
            const isActive = index === active;
            return (
              <li key={index}>
                <Link
                  href="/services"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className="group relative flex items-center gap-4 py-4 outline-none"
                >
                  {/* Gold sweep that fills in behind the active/hovered row */}
                  <span
                    className={`absolute inset-y-0 start-0 bg-brand-gold/10 transition-all duration-500 ease-out ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                    aria-hidden="true"
                  />

                  {/* Index number */}
                  <span
                    className={`relative font-mono text-xs transition-colors duration-300 ${
                      isActive ? 'text-brand-gold' : 'text-gray-400'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <h3
                    className={`relative font-cormorant text-lg md:text-xl leading-tight transition-all duration-300 ${
                      isActive
                        ? 'text-brand-navy translate-x-2 rtl:-translate-x-2'
                        : 'text-text-dark'
                    }`}
                  >
                    {isAr ? cat.titleAr : cat.titleEn}
                  </h3>

                  {/* Arrow that appears on the active row */}
                  <span
                    className={`relative ms-auto flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold opacity-100 translate-x-0'
                        : 'border-transparent text-gray-300 opacity-0 -translate-x-2 rtl:translate-x-2'
                    }`}
                  >
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: sticky animated preview — shows the services under the active category */}
        <div className="hidden lg:block lg:sticky lg:top-28">
          <div
            key={active}
            className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg"
            style={{ animation: 'svcPreviewIn 0.5s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {/* Numbered header band */}
            <div className="relative h-32 overflow-hidden bg-brand-navy flex items-center justify-center">
              <span className="font-cormorant text-6xl text-brand-gold/40">
                {String(active + 1).padStart(2, '0')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
            </div>
            <div className="p-7">
              <h3 className="font-cormorant text-2xl text-brand-navy mb-1.5">
                {isAr ? activeCat.titleAr : activeCat.titleEn}
              </h3>
              <p className="text-[13px] leading-6 text-text-dark-secondary mb-5">
                {isAr ? activeCat.descAr : activeCat.descEn}
              </p>

              {/* Services under this category */}
              {matched.length > 0 ? (
                <ul className="flex flex-col divide-y divide-gray-100 border-t border-gray-100">
                  {matched.map((svc, i) => (
                    <li
                      key={svc.id}
                      style={{ animation: `svcItemIn 0.4s ease ${i * 60}ms both` }}
                    >
                      <Link
                        href={`/services/${svc.id}`}
                        className="group flex items-center justify-between gap-3 py-3 text-sm text-text-dark hover:text-brand-gold transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
                          {svc.title}
                        </span>
                        <span className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 text-gray-400 transition-all duration-300 group-hover:border-brand-gold group-hover:text-brand-gold group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                          {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 py-4">
                  {isAr ? 'لا توجد خدمات مدرجة بعد.' : 'No services listed yet.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes svcPreviewIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes svcItemIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
