'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function Hero() {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #05090F 0%, #0E2749 100%)' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='g' width='10' height='10' patternUnits='userSpaceOnUse'><path d='M 10 0 L 0 0 0 10' fill='none' stroke='rgba(201,169,97,0.05)' stroke-width='0.5'/></pattern></defs><rect width='100' height='100' fill='url(%23g)'/></svg>")`,
          animation: 'gridMove 20s linear infinite',
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
          className="font-amiri text-text-primary mb-6 max-w-3xl"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: '1.2',
            animation: 'fadeInUp 0.8s ease 0.6s both',
          }}
        >
          {t(lang, (
            <>
              مرحباً بكم في شريف يسري <br />
              للاستشارات{' '}
              <em className="text-brand-gold not-italic">المالية والضريبية</em>
            </>
          ) as unknown as string, (
            <>
              Welcome to Sherif Yousry <br />
              <em className="text-brand-gold not-italic">Financial & Tax Advisory</em>
            </>
          ) as unknown as string)}
        </h1>

        {/* Body */}
        <p
          className="text-text-secondary text-lg max-w-2xl mb-10"
          style={{ animation: 'fadeInUp 0.8s ease 0.8s both' }}
        >
          {t(
            lang,
            'استشارات متكاملة للشركات التي تخطّط لما هو قادم. نجمع بين انضباط المكاتب الكبرى والخبرة المحلية والتنفيذ الرقمي عبر منطقة الشرق الأوسط وشمال أفريقيا.',
            'Integrated advisory for companies planning ahead. We combine big-firm discipline with local expertise and digital execution across the MENA region.',
          )}
        </p>

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
          <span className="font-mono text-text-muted text-xs tracking-[0.1em]">
            {t(lang, 'الأسواق التي نغطيها', 'Markets we cover')}
          </span>
          <div className="flex gap-2">
            {[t(lang,'مصر','Egypt'), t(lang,'السعودية','KSA'), t(lang,'الإمارات','UAE')].map((m) => (
              <span
                key={m}
                className="w-2.5 h-2.5 rounded-full bg-brand-gold shadow-[0_0_10px_#C9A961]"
                title={m}
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
