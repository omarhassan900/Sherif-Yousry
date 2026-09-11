'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const journeyCards = [
  {
    href: '/services',
    img: '/images/primds.jpeg',
    titleAr: 'أستثمر في مصر',
    titleEn: "I'm investing in Egypt",
    descAr: 'اكتشف الفرص في سوق ديناميكي ومتنامي.',
    descEn: 'Unlock opportunities in a dynamic market.'
  },
  {
    href: '/services',
    img: '/images/Bussniess.jpeg',
    titleAr: 'أبني أو أوسع أعمالي',
    titleEn: "I'm building / expanding a business",
    descAr: 'حوّل طموحك إلى نمو مستدام وقابل للقياس.',
    descEn: 'Turn ambition into sustainable growth.'
  },
  {
    href: '/services',
    img: '/images/Greek.jpeg',
    titleAr: 'أحتاج إلى استشارات ضريبية وامتثال',
    titleEn: "I need tax & compliance advisory",
    descAr: 'ابقَ متوافقاً مع الأنظمة وتقدم بثقة.',
    descEn: 'Stay compliant. Move forward with confidence.'
  },
  {
    href: '/services',
    img: '/images/airport.jpeg',
    titleAr: 'أفكر في إجراء صفقة أو استحواذ',
    titleEn: "I'm considering a transaction",
    descAr: 'دعم خبير في كل خطوة على الطريق.',
    descEn: 'Expert support every step of the way.'
  }
];

export function Journey() {
  const [lang, setLang] = useState<Language>('en');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  // ✅ Scroll-triggered animation using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Trigger only once
        }
      },
      { threshold: 0.15 } // Triggers when 15% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-gray-50" id="journey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section: Animates from TOP */}
        <div 
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-end mb-12 md:mb-16 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* 1st Column: BIG */}
          <div className="lg:col-span-6">
            <span className="text-xs font-bold tracking-widest text-text-muted uppercase mb-4 block">
              {t(lang, 'رحلتك معنا', 'YOUR JOURNEY')}
            </span>
            <h2 className="font-amiri text-3xl md:text-4xl lg:text-5xl text-brand-navy leading-tight">
              {t(lang, 'كيف يمكننا مساعدتك على المضي قدماً؟', 'How can we help you move forward?')}
            </h2>
          </div>

          {/* 2nd Column: SMALLER */}
          <div className="lg:col-span-3">
            <p className="text-text-secondary leading-relaxed text-sm md:text-base">
              {t(
                lang,
                'مهما كان طموحك، نحن هنا لمساعدتك على تجاوز التعقيدات وخلق قيمة مستدامة.',
                "Whatever your ambition, we're here to help you navigate complexity and create lasting value."
              )}
            </p>
          </div>

          {/* 3rd Column: SAME SIZE, JUSTIFIED END (Starts aligned left on mobile, right on desktop) */}
          <div className="lg:col-span-3 flex justify-start lg:justify-end items-end">
            <Link 
              href="/services" 
              className="text-xs font-bold uppercase tracking-wider text-brand-navy hover:text-brand-gold transition-colors inline-flex items-center gap-2 group"
            >
              {t(lang, 'استكشف جميع الخدمات', 'Explore All Services')} 
              <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Grid: Cards animate from BOTTOM with staggered delay */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {journeyCards.map((card, index) => (
            <Link 
              key={index} 
              href={card.href}
              // ✅ Staggered delay for each card (0ms, 150ms, 300ms, 450ms)
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : '0ms' }}
              className={`group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-brand-gold/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={card.img} 
                  alt={t(lang, card.titleAr, card.titleEn)} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-navy/5 group-hover:bg-brand-navy/0 transition-colors duration-300" />
              </div>
              
              <div className="p-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-amiri text-xl text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">
                    {t(lang, card.titleAr, card.titleEn)}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t(lang, card.descAr, card.descEn)}
                  </p>
                </div>
                {/* flex-shrink-0 prevents the arrow from squishing on small screens */}
                <span className="text-brand-gold text-2xl transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 mt-1 flex-shrink-0">
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