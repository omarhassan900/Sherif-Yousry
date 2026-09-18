'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, ArrowRight, ArrowLeft, GraduationCap, Users } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

interface EventItem {
  kind: 'event' | 'training';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  dateAr: string;
  dateEn: string;
  locationAr: string;
  locationEn: string;
  image: string;
}

// Placeholder content — swap for CMS-driven data later if needed.
const items: EventItem[] = [
  {
    kind: 'training',
    titleAr: 'ورشة المرحلة الثانية للفاتورة الإلكترونية',
    titleEn: 'E-Invoicing Phase 2 Workshop',
    descAr: 'تدريب عملي حول متطلبات المرحلة الثانية وأثرها على المجموعات المتوسطة.',
    descEn: 'A hands-on workshop covering Phase 2 requirements and their impact on mid-size groups.',
    dateAr: '١٥ مايو ٢٠٢٥',
    dateEn: 'May 15, 2025',
    locationAr: 'العاصمة الإدارية، القاهرة',
    locationEn: 'New Administrative Capital, Cairo',
    image: '/images/Bussniess.jpeg',
  },
  {
    kind: 'event',
    titleAr: 'ملتقى الاستثمار والضرائب',
    titleEn: 'Investment & Tax Forum',
    descAr: 'لقاء يجمع المستثمرين والخبراء لمناقشة أحدث التطورات الضريبية والاستثمارية.',
    descEn: 'A forum bringing investors and experts together to discuss the latest tax and investment developments.',
    dateAr: '٢ يونيو ٢٠٢٥',
    dateEn: 'June 2, 2025',
    locationAr: 'القاهرة الجديدة',
    locationEn: 'New Cairo',
    image: '/images/cairo.jpg',
  },
  {
    kind: 'training',
    titleAr: 'برنامج الحوكمة والامتثال المؤسسي',
    titleEn: 'Corporate Governance & Compliance Program',
    descAr: 'برنامج تدريبي متقدم حول إطار COSO 2024 وأفضل ممارسات الحوكمة.',
    descEn: 'An advanced training program on the COSO 2024 framework and governance best practices.',
    dateAr: '٢٠ يونيو ٢٠٢٥',
    dateEn: 'June 20, 2025',
    locationAr: 'عبر الإنترنت',
    locationEn: 'Online',
    image: '/images/Greek.jpeg',
  },
];

export function EventsTraining() {
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={sectionRef}
      id="events"
      className="py-16 md:py-20 bg-gray-50"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div
          className={`flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div>
            <span className="text-xs font-bold tracking-widest text-brand-gold uppercase mb-3 block">
              {t(lang, 'فعاليات وتدريب', 'Events & Training')}
            </span>
            <h2 className="font-amiri text-3xl md:text-4xl text-brand-navy leading-tight">
              {t(lang, 'نُطوّر المعرفة ونبني القدرات.', 'Building knowledge. Growing capabilities.')}
            </h2>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed max-w-md">
            {t(
              lang,
              'انضم إلى ورش العمل والبرامج التدريبية والفعاليات التي نقدمها لمساعدة أعمالك على مواكبة أحدث المستجدات.',
              'Join our workshops, training programs, and events designed to keep your business ahead of the curve.'
            )}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Link
              key={index}
              href="/contact"
              style={{ transitionDelay: isVisible ? `${index * 150}ms` : '0ms' }}
              className={`group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-brand-gold/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-700 ease-out flex flex-col
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={t(lang, item.titleAr, item.titleEn)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Kind badge */}
                <span className="absolute top-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-brand-navy/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-white">
                  {item.kind === 'training' ? <GraduationCap className="w-3.5 h-3.5 text-brand-gold" /> : <Users className="w-3.5 h-3.5 text-brand-gold" />}
                  {item.kind === 'training' ? t(lang, 'تدريب', 'Training') : t(lang, 'فعالية', 'Event')}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-amiri text-xl text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">
                  {t(lang, item.titleAr, item.titleEn)}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">
                  {t(lang, item.descAr, item.descEn)}
                </p>

                {/* Meta */}
                <div className="flex flex-col gap-1.5 mb-4">
                  <span className="flex items-center gap-2 text-xs text-text-secondary">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                    {t(lang, item.dateAr, item.dateEn)}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-text-secondary">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                    {t(lang, item.locationAr, item.locationEn)}
                  </span>
                </div>

                <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-brand-navy group-hover:text-brand-gold transition-colors">
                  {t(lang, 'سجّل الآن', 'Register Now')}
                  <Arrow className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
