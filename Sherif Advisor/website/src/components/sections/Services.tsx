'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
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
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

// Maps the icon names saved by the admin service form to lucide components.
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

// Fallback list used only when the CMS has no published services yet, so the
// homepage never renders empty. These link to the generic /services page.
const fallbackServices = [
  { id: 'f01', title: 'الاستشارات الضريبية', titleEn: 'Tax Advisory', desc: 'الامتثال للفاتورة الالكترونية وهيكلة ضريبة الشركات والتخطيط الضريبي عبر الحدود.', descEn: 'E-invoicing compliance, corporate tax structuring, and cross-border tax planning.', href: '/services', icon: '$' },
  { id: 'f02', title: 'الاستشارات المالية', titleEn: 'Financial Advisory', desc: 'النمذجة المالية والتقييم والتخطيط المالي الاستراتيجي للشركات المتنامية.', descEn: 'Financial modelling, valuation, and strategic financial planning for growing firms.', href: '/services', icon: '%' },
  { id: 'f03', title: 'المدير المالي بالتعاقد', titleEn: 'Fractional CFO', desc: 'قيادة مالية تنفيذية عند الطلب لدفع النمو وتحسين التدفق النقدي.', descEn: 'On-demand executive financial leadership to drive growth and optimise cash flow.', href: '/services', icon: '#' },
  { id: 'f04', title: 'المخاطر والحوكمة', titleEn: 'Risk and Governance', desc: 'اطر COSO والمراجعة الداخلية وادارة مخاطر المؤسسات.', descEn: 'COSO frameworks, internal audit, and enterprise risk management.', href: '/services', icon: '@' },
  { id: 'f05', title: 'التوسع الدولي', titleEn: 'International Expansion', desc: 'تاسيس الشركات وخدمات المستثمرين والملاحة التنظيمية في السعودية والامارات.', descEn: 'Company formation, investor services, and regulatory navigation in KSA and UAE.', href: '/services', icon: '>' },
];

interface CmsService {
  id: string;
  title: string;
  body: string;
  metadata: { icon?: string; image?: string };
}

interface DisplayService {
  key: string;
  title: string;
  desc: string;
  href: string;
  /** A single-character symbol (used by the fallback list). */
  symbol?: string;
  /** A lucide icon component (used by CMS services with an icon set). */
  Icon?: LucideIcon;
}

function ServiceCard({
  svc,
  lang,
  delay,
}: {
  svc: DisplayService;
  lang: Language;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <Link
        href={svc.href}
        className="group flex flex-col gap-4 p-8 bg-gradient-to-br from-brand-navy-mid to-brand-navy border border-white/5 hover:border-brand-gold hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 relative overflow-hidden h-full"
      >
        <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-l from-brand-gold to-transparent scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-300" />
        <div className="w-11 h-11 flex items-center justify-center bg-brand-gold/10 text-brand-gold text-xl rounded group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-500">
          {svc.Icon ? <svc.Icon className="w-5 h-5" /> : svc.symbol ?? <ArrowRight className="w-5 h-5" />}
        </div>
        <h4 className="font-semibold text-text-primary text-lg group-hover:text-brand-gold transition-colors duration-300">
          {svc.title}
        </h4>
        <p className="text-text-muted text-sm flex-grow leading-7 line-clamp-4">
          {svc.desc}
        </p>
        <span className="flex items-center gap-2 text-brand-gold font-mono text-xs tracking-wider group-hover:gap-3 transition-all duration-300">
          {t(lang, 'اعرف المزيد', 'Learn more')} &rarr;
        </span>
      </Link>
    </div>
  );
}

export function Services() {
  const [lang, setLang] = useState<Language>('ar');
  const [langReady, setLangReady] = useState(false);
  const [cmsServices, setCmsServices] = useState<CmsService[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [heading, setHeading] = useState<{ label: string; title: string } | null>(null);

  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

  // Editable heading from CMS homepage/services.
  useEffect(() => {
    if (!langReady) return;
    let cancelled = false;
    fetch(`/api/content/sections/homepage/services?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && (data.title || data.body)) {
          setHeading({
            label: (data.body ?? '').replace(/<[^>]*>/g, '').trim(),
            title: (data.title ?? '').replace(/<[^>]*>/g, '').trim(),
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang, langReady]);

  useEffect(() => {
    if (!langReady) return;
    let cancelled = false;
    async function fetchServices() {
      try {
        const res = await fetch(`/api/content/services?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && Array.isArray(data.items)) {
            setCmsServices(data.items);
          }
        }
      } catch {
        // fall back to static list
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    fetchServices();
    return () => {
      cancelled = true;
    };
  }, [lang, langReady]);

  // Map CMS services (or fallback) into a uniform display shape.
  const display: DisplayService[] =
    loaded && cmsServices.length > 0
      ? cmsServices.map((s) => ({
          key: s.id,
          title: s.title,
          desc: s.body,
          href: `/services/${s.id}`,
          Icon: s.metadata?.icon ? ICON_MAP[s.metadata.icon] : undefined,
        }))
      : fallbackServices.map((s) => ({
          key: s.id,
          title: t(lang, s.title, s.titleEn),
          desc: t(lang, s.desc, s.descEn),
          href: s.href,
          symbol: s.icon,
        }));

  return (
    <section className="py-24 bg-brand-navy-dark" id="services" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <span className="section-label mb-4 block">
          {heading?.label || t(lang, 'خدماتنا', 'Our Services')}
        </span>
        <h2 className="section-title mb-14">
          {heading?.title ||
            t(
              lang,
              'استشارات شاملة مبنية على التزاماتك.',
              'Comprehensive advisory built on your commitments.'
            )}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {display.map((svc, i) => (
            <ServiceCard key={svc.key} svc={svc} lang={lang} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
