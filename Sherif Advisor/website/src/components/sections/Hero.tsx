'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

interface SectionContent {
  title: string;
  body: string;
}

export function Hero() {
  const [content, setContent] = useState<SectionContent | null>(null);
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await fetch(`/api/content/sections/homepage/hero?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        }
      } catch {
        // Use static fallback
      }
    }
    fetchHero();
  }, [lang]);

  const title = content?.title || (lang === 'ar'
    ? 'استشارات متكاملة للشركات التي تخطّط لما هو قادم.'
    : 'Comprehensive advisory for companies planning what\'s next.');
  const body = content?.body || (lang === 'ar'
    ? 'الضرائب والتمويل والمخاطر وإدارة الأعمال من خلال منصة استشارية رقمية واحدة — من الالتزام الضريبي إلى التوسع الإقليمي.'
    : 'Tax, finance, risk, and business management through a single digital advisory platform — from tax compliance to regional expansion.');
  return (
    <section className="relative bg-brand-navy min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #122A4E 0px, #122A4E 10px, #0D2143 10px, #0D2143 20px)',
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-7">
            <div className="section-label flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>مصر · السعودية · الإمارات</span>
            </div>

            <h1 className="font-amiri text-4xl md:text-5xl lg:text-[52px] leading-[1.55] text-text-primary text-pretty">
              {lang === 'ar' ? (
                <>
                  {title.includes('التي تخطّط') ? (
                    <>
                      استشارات متكاملة للشركات{' '}
                      <span className="text-brand-gold">التي تخطّط لما هو قادم.</span>
                    </>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: title }} />
                  )}
                </>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: title }} />
              )}
            </h1>

            <div
              className="text-base lg:text-lg text-text-secondary leading-[1.85] max-w-xl"
              dangerouslySetInnerHTML={{ __html: body }}
            />

            <div className="flex flex-wrap gap-4 mt-2">
              <Link href="/services" className="btn-primary flex items-center gap-2">
                <span>{lang === 'ar' ? 'استعرض خدماتنا' : 'Explore Services'}</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-outline">
                {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </div>
          </div>

          {/* Visual Side */}
          <div className="hidden lg:flex flex-col items-center justify-center relative">
            <div className="w-full h-[500px] rounded-lg border border-brand-gold/25 bg-gradient-to-br from-brand-navy-mid to-brand-navy-deep flex items-center justify-center">
              <div className="text-center">
                <p className="font-mono text-xs tracking-[0.2em] text-text-muted leading-8">
                  SKYLINE PHOTOGRAPH
                  <br />
                  CAIRO · RIYADH · DUBAI
                </p>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute bottom-8 left-8 border border-brand-gold/60 bg-brand-navy/90 backdrop-blur-sm px-7 py-5 flex flex-col gap-1.5">
              <span className="text-xs tracking-wider text-text-primary">
                توسّع في
              </span>
              <span className="font-cormorant text-3xl tracking-wider text-brand-gold-light">
                MENA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
