'use client';

// ─────────────────────────────────────────────────────────────
// V2 SERVICES PAGE — Sherif's design POV (isolated)
// Groups the CMS services into categories, styled to match the
// dark/gold aesthetic of the v2 homepage. Uses v2 layout copies
// so nothing here affects the live /services page or Omar's work.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Building2,
  Scale,
  ShieldCheck,
  FileText,
  TrendingUp,
  Users,
  Globe,
  Award,
  Calculator,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Header } from '@/components/v2/Header';
import { Footer } from '@/components/v2/Footer';
import { WhatsAppFloat } from '@/components/v2/WhatsAppFloat';
import { getClientLanguage, type Language } from '@/lib/language';

interface ServiceItem {
  id: string;
  title: string;
  body: string;
  metadata?: {
    icon?: string;
    displayOrder?: number;
    descriptionAr?: string;
    descriptionEn?: string;
    image?: string;
  };
}

// Same icon mapping the live site uses for CMS service icons.
const ICON_MAP: Record<string, LucideIcon> = {
  Briefcase,
  Building2,
  Scale,
  ShieldCheck,
  FileText,
  TrendingUp,
  Users,
  Globe,
  Award,
  Calculator,
};

const categories: {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  match: string[];
}[] = [
  {
    id: 'tax-compliance',
    titleAr: 'الضرائب والامتثال',
    titleEn: 'Tax & Compliance',
    descAr: 'الالتزام الضريبي والتدقيق والتأكيد بثقة ووضوح.',
    descEn: 'Tax compliance, audit and assurance with clarity and confidence.',
    match: ['tax', 'audit', 'accounting', 'assurance', 'ضريب', 'تدقيق', 'محاسب', 'تأكيد'],
  },
  {
    id: 'financial-business',
    titleAr: 'الاستشارات المالية والأعمال',
    titleEn: 'Financial & Business Advisory',
    descAr: 'رؤى مالية وإدارية تدفع النمو وتعظّم القيمة.',
    descEn: 'Financial and management insight that drives growth and value.',
    match: ['financial', 'business', 'economic', 'management', 'مالي', 'أعمال', 'اقتصاد', 'إدار'],
  },
  {
    id: 'corporate-operations',
    titleAr: 'الشؤون المؤسسية والتشغيل',
    titleEn: 'Corporate & Operations',
    descAr: 'الخدمات المؤسسية والقانونية والرواتب والتأمينات.',
    descEn: 'Corporate, legal, payroll and social insurance services.',
    match: ['corporate', 'legal', 'payroll', 'insurance', 'مؤسس', 'قانون', 'رواتب', 'تأمين'],
  },
  {
    id: 'digital',
    titleAr: 'الرقمية',
    titleEn: 'Digital',
    descAr: 'التجارة الإلكترونية والأعمال الرقمية.',
    descEn: 'E-commerce and digital business.',
    match: ['e-commerce', 'ecommerce', 'commerce', 'digital', 'تجارة', 'رقمي', 'إلكترون'],
  },
];

function categorize(services: ServiceItem[]) {
  const groups: Record<string, ServiceItem[]> = {};
  categories.forEach((c) => (groups[c.id] = []));
  const other: ServiceItem[] = [];

  services.forEach((svc) => {
    const title = (svc.title || '').toLowerCase();
    const cat = categories.find((c) => c.match.some((kw) => title.includes(kw)));
    if (cat) groups[cat.id].push(svc);
    else other.push(svc);
  });

  return { groups, other };
}

export default function ServicesV2Page() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('ar');
  const [langReady, setLangReady] = useState(false);

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
          if (!cancelled && data.items) setServices(data.items);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchServices();
    return () => {
      cancelled = true;
    };
  }, [lang, langReady]);

  const { groups, other } = categorize(services);
  const t = (ar: string, en: string) => (lang === 'ar' ? ar : en);

  const ServiceCard = ({ service, index }: { service: ServiceItem; index: number }) => {
    const Icon = service.metadata?.icon ? ICON_MAP[service.metadata.icon] : undefined;
    const image = service.metadata?.image;
    return (
      <Link
        href={`/services/${service.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-brand-navy/20 bg-brand-navy shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-gold/50"
      >
        {/* Gold top accent that grows on hover */}
        <span className="absolute inset-x-0 top-0 z-10 h-0.5 w-0 bg-brand-gold transition-all duration-300 group-hover:w-full" />

        {/* Fixed-height media slot on EVERY card, so heights always match. */}
        <div className="relative h-20 w-full overflow-hidden">
          {image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={service.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
            </>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  'radial-gradient(ellipse 80% 80% at 50% 30%, rgba(255,255,255,0.06) 0%, rgba(10,30,60,0) 75%), #0E2749',
              }}
            >
              {Icon ? (
                <Icon className="h-7 w-7 text-white/80 transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <span className="font-serif text-2xl text-white/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center justify-between">
            {/* Icon badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-all duration-300 group-hover:bg-brand-gold group-hover:text-brand-navy">
              {Icon ? <Icon className="h-4 w-4" /> : (
                <span className="font-mono text-xs font-bold">{String(index + 1).padStart(2, '0')}</span>
              )}
            </div>
            <span className="font-mono text-[11px] text-white/40 tracking-widest">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <h3 className="font-serif text-base text-white mt-2.5 leading-snug group-hover:text-brand-gold transition-colors">
            {service.title}
          </h3>
          <p className="text-xs leading-5 text-gray-300 mt-1.5 line-clamp-2 flex-1">
            {service.body}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-gold group-hover:gap-2.5 transition-all">
            {t('اقرأ المزيد', 'Read more')}
            {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="bg-[#fbf9f6]">
      <Header />

      {/* Compact page header — dark blue band */}
      <div className="pt-32 pb-10 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="text-xs font-semibold tracking-widest text-brand-gold uppercase block mb-3">
            {t('ما نقدمه', 'What We Offer')}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight max-w-2xl">
            {t('خدمات استشارية متكاملة، مصنّفة حسب المجال.', 'Comprehensive advisory services, organized by category.')}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-text-secondary">
          {t('جاري التحميل...', 'Loading...')}
        </div>
      ) : (
        <div className="pb-16">
          {categories.map((cat, ci) => {
            const items = groups[cat.id];
            if (!items || items.length === 0) return null;
            return (
              <section key={cat.id} className="py-10 border-t border-gray-200 first:border-t-0">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                  {/* Compact category header */}
                  <div className="flex items-center justify-between gap-6 mb-6">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-sm text-brand-navy tracking-widest">
                        {String(ci + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl text-brand-navy leading-tight">
                          {t(cat.titleAr, cat.titleEn)}
                        </h2>
                        <p className="text-xs text-text-secondary mt-1 max-w-xl">
                          {t(cat.descAr, cat.descEn)}
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:block text-[11px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                      {items.length} {t('خدمة', items.length === 1 ? 'Service' : 'Services')}
                    </span>
                  </div>

                  {/* Compact service grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((service, i) => (
                      <ServiceCard key={service.id} service={service} index={i} />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}

          {other.length > 0 && (
            <section className="py-10 border-t border-gray-200">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <h2 className="font-serif text-2xl md:text-3xl text-brand-navy mb-6">
                  {t('خدمات أخرى', 'Other Services')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {other.map((service, i) => (
                    <ServiceCard key={service.id} service={service} index={i} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {services.length === 0 && (
            <div className="py-24 text-center text-text-secondary">
              {t('لا توجد خدمات لعرضها حالياً.', 'No services to display right now.')}
            </div>
          )}
        </div>
      )}

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
