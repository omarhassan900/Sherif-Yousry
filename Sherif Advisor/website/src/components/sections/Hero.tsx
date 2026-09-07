'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

// Generic translation function
const t = <T extends string | ReactNode>(lang: Language, ar: T, en: T): T => 
  (lang === 'ar' ? ar : en);

interface CmsSection {
  title: string;
  body: string;
}

const FallbackTitleAr = (
  <>
   
  </>
);

const FallbackTitleEn = (
  <>
   
  </>
);

export function Hero() {
  const [lang, setLang] = useState<Language>('ar');
  const [isMounted, setIsMounted] = useState(false);
  const [cms, setCms] = useState<CmsSection | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const detectedLang = getClientLanguage();
    setLang(detectedLang);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let cancelled = false;

    fetch(`/api/content/sections/homepage/hero?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) {
          const item = Array.isArray(data) ? data[0] : data;
          if (item && (item.title || item.body)) {
            setCms({ title: item.title ?? '', body: item.body ?? '' });
          } else {
            setCms(null);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setCms(null);
      });

    return () => {
      cancelled = true;
    };
  }, [lang, isMounted]);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: 'url("/images/hero-bg.png")', // Ensure this matches your public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay to ensure text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(5,9,15,0.75) 0%, rgba(14,39,73,0.65) 100%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">
        {/* Eyebrow */}
        <div
          className="flex items-center gap-4 font-mono text-brand-gold text-sm tracking-[0.2em] mb-6"
          style={{ animation: 'fadeInRight 0.8s ease 0.4s both' }}
        >
          <span className="w-10 h-px bg-brand-gold" />
          {t(lang, 'مصر · السعودية · الإمارات', 'Egypt · Saudi Arabia · UAE')}
        </div>

        {/* Heading */}
        <h1
          className="font-amiri text-white mb-6 max-w-3xl"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: '1.2',
            animation: 'fadeInUp 0.8s ease 0.6s both',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          {cms?.title ? (
            <span className="[&_em]:text-brand-gold [&_em]:not-italic">
              {cms.title}
            </span>
          ) : (
            t(lang, FallbackTitleAr, FallbackTitleEn)
          )}
        </h1>

        {/* ✅ Body: Renders HTML from CMS, or falls back to plain text */}
        <div
          className="text-gray-200 text-lg max-w-2xl mb-10"
          style={{ 
            animation: 'fadeInUp 0.8s ease 0.8s both',
            textShadow: '0 1px 10px rgba(0,0,0,0.5)',
          }}
        >
          {cms?.body ? (
            <div 
              // Tailwind arbitrary variants ensure the CMS HTML matches your design system
              className="[&_p]:mb-0 [&_strong]:font-bold [&_em]:text-brand-gold [&_em]:not-italic"
              dangerouslySetInnerHTML={{ __html: cms.body }} 
            />
          ) : (
            <p>
              {t(
                lang,
               '',''
              )}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-4"
          style={{ animation: 'fadeInUp 0.8s ease 1s both' }}
        >
          <a href="#services" className="btn-primary">
            {t(lang, 'استكشف الخدمات ←', 'Explore Services →')}
          </a>
          <a href="#assessment" className="btn-outline">
            {t(lang, 'تقييم مجاني لأعمالك', 'Free Business Assessment')}
          </a>
        </div>

        {/* Market dots */}
        <div
          className="flex items-center gap-6 mt-16"
          style={{ animation: 'fadeInUp 0.8s ease 1.2s both' }}
        >
          <span className="font-mono text-gray-300 text-xs tracking-[0.1em]">
            {t(lang, 'الأسواق التي نغطيها', 'Markets we cover')}
          </span>
          <div className="flex gap-2">
            {[
              { ar: 'مصر', en: 'Egypt' },
              { ar: 'السعودية', en: 'KSA' },
              { ar: 'الإمارات', en: 'UAE' },
            ].map((m, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-brand-gold shadow-[0_0_10px_#C9A961]"
                title={t(lang, m.ar, m.en)}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}