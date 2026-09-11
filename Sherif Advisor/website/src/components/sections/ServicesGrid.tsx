'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const servicesData = [
  {
    num: '01',
    titleAr: 'الاستشارات\nالضريبية',
    titleEn: 'Tax\nAdvisory',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 3h6" />
      </>
    )
  },
  {
    num: '02',
    titleAr: 'التدقيق والمحاسبة\nوالتأكيد',
    titleEn: 'Audit, Accounting\n& Assurance',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    )
  },
  {
    num: '03',
    titleAr: 'الاستشارات\nالمالية',
    titleEn: 'Financial\nAdvisory',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    )
  },
  {
    num: '04',
    titleAr: 'استشارات الأعمال\nوالاقتصاد والإدارة',
    titleEn: 'Business, Economic\n& Management\nAdvisory',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    )
  },
  {
    num: '05',
    titleAr: 'الخدمات المؤسسية\nوالقانونية',
    titleEn: 'Corporate &\nLegal Services',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5M2.25 21h19.5" />
    )
  },
  {
    num: '06',
    titleAr: 'الرواتب\nوالتأمينات الاجتماعية',
    titleEn: 'Payroll &\nSocial Insurance',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Z" />
    )
  },
  {
    num: '07',
    titleAr: 'التجارة الإلكترونية\nوالأعمال الرقمية',
    titleEn: 'E-Commerce &\nDigital Business',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m-17.432 0A8.959 8.959 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
    )
  }
];

export function ServicesGrid() {
  const [lang, setLang] = useState<Language>('en');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

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

  return (
    <section 
      ref={sectionRef}
      className="w-full py-16 px-6 md:px-10 border-t border-b border-white/12"
      style={{
        backgroundColor: '#030a12',
        backgroundImage: `
          radial-gradient(ellipse 60% 50% at 35% 20%, rgba(14, 55, 99, 0.45) 0%, rgba(3, 10, 18, 0) 80%),
          radial-gradient(ellipse 40% 40% at 70% 60%, rgba(8, 38, 70, 0.3) 0%, rgba(3, 10, 18, 0) 70%)
        `
      }}
      id="services"
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div 
          className={`flex flex-col lg:flex-row justify-between items-start gap-10 mb-12 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex-1">
            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase block mb-3">
              {t(lang, 'خدماتنا', 'Our Services')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight tracking-wide text-white">
              {t(lang, 'خبرة متكاملة.', 'INTEGRATED EXPERTISE.')}<br/>
              {t(lang, 'أثر حقيقي.', 'REAL-WORLD IMPACT.')}
            </h2>
          </div>
          
          <div className="flex-1 max-w-[520px] flex flex-col items-start gap-4">
            <p className="text-sm text-gray-400 leading-relaxed">
              {t(
                lang,
                'نقدم خدمات استشارية وإدارية شاملة، نجمع فيها بين الخبرة الفنية العميقة والفهم العملي لطبيعة الأعمال.',
                'We provide end-to-end advisory and business management services, combining deep technical expertise with practical business understanding.'
              )}
            </p>
            <Link 
              href="/services" 
              className="text-white text-xs font-semibold tracking-wider no-underline uppercase inline-flex items-center gap-2 hover:text-sky-400 transition-colors"
            >
              {t(lang, 'استكشف خدماتنا', 'Explore Our Services')} 
              <span className="rtl:rotate-180">→</span>
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 border-l border-white/12">
          {servicesData.map((service, index) => (
            <Link
              key={index}
              href="/services"
              style={{ 
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
              }}
              className={`group border-r border-white/12 px-5 flex flex-col justify-between min-h-[220px] transition-all duration-500 ease-out hover:bg-white/5
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            >
              <div className="flex flex-col gap-6">
                <span className="text-sm text-gray-400 font-normal">
                  {service.num}
                </span>
                <svg 
                  className="w-7 h-7 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {service.icon}
                </svg>
              </div>
              
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium leading-snug text-white whitespace-pre-line">
                  {t(lang, service.titleAr, service.titleEn)}
                </h3>
                <span className="text-base text-gray-400 transition-all duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:text-white">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}