'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
  };
}

const fallbackServices = [
  {
    id: '01',
    title: 'الاستشارات الضريبية',
    titleEn: 'Tax Advisory',
    description:
      'ضريبة الشركات، القيمة المضافة، الخصم والإضافة، أسعار التحويل، الالتزام والمنازعات.',
    href: '/services/tax',
  },
  {
    id: '02',
    title: 'الاستشارات المالية',
    titleEn: 'Financial Advisory',
    description:
      'التقييم، الفحص النافي للجهالة، إعادة الهيكلة ودعم المعاملات.',
    href: '/services/finance',
  },
  {
    id: '03',
    title: 'المدير المالي بالتعاقد',
    titleEn: 'Outsourced CFO',
    description:
      'التقارير الإدارية والموازنات والتنبؤات المالية باتفاقية شهرية.',
    href: '/services/cfo',
  },
  {
    id: '04',
    title: 'المخاطر والحوكمة',
    titleEn: 'Risk & Governance',
    description:
      'الرقابة الداخلية، أطر COSO، تقييم الضوابط والمراجعات الرقابية.',
    href: '/services/risk',
  },
  {
    id: '05',
    title: 'إدارة الأعمال',
    titleEn: 'Business Management',
    description:
      'الإسناد الخارجي، تحسين العمليات، نموذج التشغيل وإدارة الأداء.',
    href: '/services/business',
  },
  {
    id: '06',
    title: 'التوسع الدولي',
    titleEn: 'International Expansion',
    description:
      'دخول الأسواق والهيكلة الإقليمية والضرائب العابرة للحدود.',
    href: '/services/international',
  },
  {
    id: '07',
    title: 'تأسيس الشركات',
    titleEn: 'Company Formation',
    description:
      'إنشاء الكيان القانوني والتسجيلات الحكومية والتراخيص في مصر ودول الخليج.',
    href: '/services/formation',
  },
  {
    id: '08',
    title: 'خدمات المستثمرين',
    titleEn: 'Investor Services',
    description:
      'تسهيل إجراءات المستثمرين وتعاملاتهم مع الجهات الحكومية والتراخيص.',
    href: '/services/investors',
  },
  {
    id: '09',
    title: 'الخدمات الرقمية',
    titleEn: 'Digital Services',
    description:
      'بوابة العملاء الآمنة، مساعد AI ذكي، وإدارة المستندات المشفرة.',
    href: '/services/digital',
  },
];

export function Services() {
  const [cmsServices, setCmsServices] = useState<ServiceItem[]>([]);
  const [loaded, setLoaded] = useState(false);
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
          if (!cancelled && data.items && data.items.length > 0) {
            setCmsServices(data.items);
          }
        }
      } catch {
        // Use fallback
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    fetchServices();
    return () => {
      cancelled = true;
    };
  }, [lang, langReady]);

  return (
    <section className="bg-surface-light py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="section-label mb-3">
              {lang === 'ar' ? 'خدماتنا' : 'Our Services'}
            </div>
            <h2 className="section-title-dark">
              {lang === 'ar' ? 'استشارات مبنية على التزاماتك' : 'Advisory built on your commitments'}
            </h2>
          </div>
          <p className="text-sm text-text-dark-secondary max-w-sm leading-7">
            {lang === 'ar'
              ? 'كل صفحة خدمة تربط مشكلة العمل بنطاق محدّد ومخرجات واضحة ومسار تنفيذ رقمي داخل بوابة العميل.'
              : 'Each service page links a business problem to a defined scope, clear deliverables, and a digital execution path within the client portal.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-muted">
          {loaded && cmsServices.length > 0
            ? cmsServices.map((service, index) => (
                <div
                  key={service.id}
                  className="card-service group bg-white p-8 flex flex-col gap-3"
                >
                  <span className="font-mono text-xs text-brand-gold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-cormorant text-2xl text-text-dark group-hover:text-brand-navy-mid transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[13px] leading-7 text-text-dark-secondary">
                    {service.body}
                  </p>
                </div>
              ))
            : fallbackServices.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className="card-service group"
                >
                  <span className="font-mono text-xs text-brand-gold">
                    {service.id}
                  </span>
                  <h3 className="font-cormorant text-2xl text-text-dark group-hover:text-brand-navy-mid transition-colors">
                    {lang === 'ar' ? service.title : service.titleEn}
                  </h3>
                  <p className="text-[13px] leading-7 text-text-dark-secondary">
                    {service.description}
                  </p>
                  <span className="mt-auto flex items-center gap-1 text-xs text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">
                    {lang === 'ar' ? 'المزيد' : 'More'} <ArrowLeft className="w-3 h-3" />
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
