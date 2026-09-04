'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import React from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

const steps = [
  { idAr: '١', idEn: '1', textAr: 'أجب على تسعة أسئلة قصيرة عن عمليات أعمالك.',     textEn: 'Answer nine short questions about your business operations.' },
  { idAr: '٢', idEn: '2', textAr: 'استلم ملف أعمالك ومؤشرات المخاطر الفورية.',       textEn: 'Receive your business profile and instant risk indicators.' },
  { idAr: '٣', idEn: '3', textAr: 'احصل على خدمة وخطة استراتيجية موصى بهما.',       textEn: 'Get a recommended service and strategic plan.' },
  { idAr: '٤', idEn: '4', textAr: 'احجز استشارة أو اطلب عرضاً رسمياً.',              textEn: 'Book a consultation or request a formal proposal.' },
];

const t = (lang: Language, ar: React.ReactNode, en: React.ReactNode): React.ReactNode =>
  lang === 'ar' ? ar : en;

export function Assessment() {
  const [lang, setLang] = useState<Language>('ar');
  const [langReady, setLangReady] = useState(false);
  const [vis, setVis] = useState(false);
  const [cms, setCms] = useState<{ title: string; body: string } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

  // Editable heading + intro from CMS homepage/assessment.
  useEffect(() => {
    if (!langReady) return;
    let cancelled = false;
    fetch(`/api/content/sections/homepage/assessment?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && (data.title || data.body)) {
          setCms({
            title: (data.title ?? '').replace(/<[^>]*>/g, '').trim(),
            body: (data.body ?? '').replace(/<[^>]*>/g, '').trim(),
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang, langReady]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="py-24 bg-gradient-to-br from-brand-navy to-brand-navy-dark border-y border-brand-gold/20"
      id="assessment"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div>
            <span className="section-label mb-4 block">
              {t(lang, 'أداة تفاعلية', 'Interactive Tool')}
            </span>
            <h2 className="section-title mb-6">
              {cms?.title ? (
                cms.title
              ) : (
                t(lang, <>لست متأكداً من موقعك؟<br />ابدأ التقييم المجاني لأعمالك.</>, <>Not sure where you stand?<br />Start your free business assessment.</>)
              )}
            </h2>
            <p className="text-text-secondary text-base leading-relaxed mb-8 max-w-lg">
              {cms?.body ||
                t(
                  lang,
                  'تسعة أسئلة عن الحجم والالتزام والنضج المالي تُنتج درجة جاهزية ومؤشرات مخاطر وخطة استشارية موصى بها — في أقل من أربع دقائق.',
                  'Nine questions on size, compliance and financial maturity produce a readiness score, risk indicators, and a recommended advisory plan — in under four minutes.',
                )}
            </p>
            <Link href="/assessment" className="btn-primary">
              {t(lang, 'ابدأ التقييم الآن ←', 'Start Assessment Now →')}
            </Link>
          </div>

          {/* Steps card */}
          <div
            ref={ref}
            className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-9 transition-all duration-700"
            style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(-30px)' }}
          >
            <h3 className="font-amiri text-brand-gold text-2xl mb-7">
              {t(lang, 'خارطة طريقك في 4 خطوات', 'Your roadmap in 4 steps')}
            </h3>
            <div className="flex flex-col gap-5">
              {steps.map((step, i) => (
                <div
                  key={step.idEn}
                  className="flex gap-4 items-start group"
                  style={{
                    opacity: vis ? 1 : 0,
                    transform: vis ? 'translateX(0)' : 'translateX(20px)',
                    transition: `opacity 0.5s ease ${i * 150}ms, transform 0.5s ease ${i * 150}ms`,
                  }}
                >
                  <span className="w-7 h-7 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(201,169,97,0.5)] transition-all duration-300">
                    {t(lang, step.idAr, step.idEn)}
                  </span>
                  <p className="text-text-secondary text-sm leading-7">
                    {t(lang, step.textAr, step.textEn)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
