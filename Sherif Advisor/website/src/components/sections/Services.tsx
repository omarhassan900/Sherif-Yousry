'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getClientLanguage, type Language } from '@/lib/language';

const services = [
  { id: '01', titleAr: 'الاستشارات الضريبية', titleEn: 'Tax Advisory', descAr: 'الامتثال للفاتورة الالكترونية وهيكلة ضريبة الشركات والتخطيط الضريبي عبر الحدود.', descEn: 'E-invoicing compliance, corporate tax structuring, and cross-border tax planning.', href: '/services/tax', icon: '$' },
  { id: '02', titleAr: 'الاستشارات المالية', titleEn: 'Financial Advisory', descAr: 'النمذجة المالية والتقييم والتخطيط المالي الاستراتيجي للشركات المتنامية.', descEn: 'Financial modelling, valuation, and strategic financial planning for growing firms.', href: '/services/finance', icon: '%' },
  { id: '03', titleAr: 'المدير المالي بالتعاقد', titleEn: 'Fractional CFO', descAr: 'قيادة مالية تنفيذية عند الطلب لدفع النمو وتحسين التدفق النقدي.', descEn: 'On-demand executive financial leadership to drive growth and optimise cash flow.', href: '/services/cfo', icon: '#' },
  { id: '04', titleAr: 'المخاطر والحوكمة', titleEn: 'Risk and Governance', descAr: 'اطر COSO والمراجعة الداخلية وادارة مخاطر المؤسسات.', descEn: 'COSO frameworks, internal audit, and enterprise risk management.', href: '/services/risk', icon: '@' },
  { id: '06', titleAr: 'التوسع الدولي', titleEn: 'International Expansion', descAr: 'تاسيس الشركات وخدمات المستثمرين والملاحة التنظيمية في السعودية والامارات.', descEn: 'Company formation, investor services, and regulatory navigation in KSA and UAE.', href: '/services/international', icon: '>' },
];

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

function ServiceCard({ svc, lang, delay }: { svc: typeof services[0]; lang: Language; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(30px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      <Link href={svc.href} className="group flex flex-col gap-4 p-8 bg-gradient-to-br from-brand-navy-mid to-brand-navy border border-white/5 hover:border-brand-gold hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-l from-brand-gold to-transparent scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-300" />
        <div className="w-11 h-11 flex items-center justify-center bg-brand-gold/10 text-brand-gold text-xl rounded group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-500">
          {svc.icon}
        </div>
        <h4 className="font-semibold text-text-primary text-lg group-hover:text-brand-gold transition-colors duration-300">
          {t(lang, svc.titleAr, svc.titleEn)}
        </h4>
        <p className="text-text-muted text-sm flex-grow leading-7">
          {t(lang, svc.descAr, svc.descEn)}
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
  useEffect(() => { setLang(getClientLanguage()); }, []);

  return (
    <section className="py-24 bg-brand-navy-dark" id="services">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <span className="section-label mb-4 block">
          {t(lang, 'خدماتنا', 'Our Services')}
        </span>
        <h2 className="section-title mb-14">
          {t(lang, 'استشارات شاملة مبنية على التزاماتك.', 'Comprehensive advisory built on your commitments.')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} lang={lang} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
