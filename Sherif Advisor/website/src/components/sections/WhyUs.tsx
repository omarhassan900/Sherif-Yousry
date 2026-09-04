'use client';

import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: React.ReactNode, en: React.ReactNode): React.ReactNode =>
  lang === 'ar' ? ar : en;

const reasons = [
  {
    id: '٠١', idEn: '01',
    titleAr: 'انضباط المكاتب الكبرى',    titleEn: 'Big-Firm Discipline',
    descAr: 'منهجية يقودها كبار المهنيين مع مراجعة جودة موثقة ومعايير امتثال صارمة.',
    descEn: 'Expert-led methodology with documented quality reviews and strict compliance standards.',
  },
  {
    id: '٠٢', idEn: '02',
    titleAr: 'تركيز على العميل',           titleEn: 'Client-First Focus',
    descAr: 'نطاق مصمم خصيصاً لك مع تواصل مباشر مع الشريك المسؤول، بدون وسطاء.',
    descEn: 'Tailored scope with direct partner access — no middlemen.',
  },
  {
    id: '٠٣', idEn: '03',
    titleAr: 'خبرة محلية',                 titleEn: 'Local Expertise',
    descAr: 'معرفة عميقة باللوائح التنظيمية والتطبيق العملي في مصر ومنطقة الخليج.',
    descEn: 'Deep knowledge of regulations and practice in Egypt and the Gulf.',
  },
  {
    id: '٠٤', idEn: '04',
    titleAr: 'حضور إقليمي',                titleEn: 'Regional Presence',
    descAr: 'التوسع في السعودية والإمارات جنباً إلى جنب مع عملائنا لدعم النمو عبر الحدود.',
    descEn: 'Expanding into KSA and UAE alongside our clients for cross-border growth.',
  },
  {
    id: '٠٥', idEn: '05',
    titleAr: 'تنفيذ رقمي',                 titleEn: 'Digital Execution',
    descAr: 'بوابة عملاء، لوحات معلومات، ومخرجات متتابعة كإجراء أساسي وليس كفكرة لاحقة.',
    descEn: 'Client portal, dashboards, and tracked deliverables as standard — not an afterthought.',
  },
];

function Card({ reason, lang, delay }: { reason: typeof reasons[0]; lang: Language; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="why-card"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <span className="font-mono text-brand-gold text-xs mb-4 block">
        {lang === 'ar' ? reason.id : reason.idEn}
      </span>
      <h4 className="text-text-primary font-semibold text-lg mb-3">
        {lang === 'ar' ? reason.titleAr : reason.titleEn}
      </h4>
      <p className="text-text-secondary text-sm leading-7">
        {lang === 'ar' ? reason.descAr : reason.descEn}
      </p>
    </div>
  );
}

export function WhyUs() {
  const [lang, setLang] = useState<Language>('ar');
  const [langReady, setLangReady] = useState(false);
  const [cms, setCms] = useState<{ label: string; title: string } | null>(null);

  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

  // Editable heading from CMS homepage/why-us: body = label (eyebrow), title = heading.
  useEffect(() => {
    if (!langReady) return;
    let cancelled = false;
    fetch(`/api/content/sections/homepage/why-us?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && (data.title || data.body)) {
          setCms({
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

  return (
    <section className="py-24 bg-brand-navy-dark" id="why-us">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <span className="section-label mb-4 block">
          {cms?.label ||
            (lang === 'ar' ? 'لماذا شريف يسري للاستشارات؟' : 'Why Sherif Yousry Advisory?')}
        </span>
        <h2 className="section-title mb-12">
          {cms?.title ? (
            cms.title
          ) : (
            t(lang,
              <>انضباط المكاتب الكبرى.<br />ومرونة المكاتب المتخصصة.</>,
              <>Big-firm discipline.<br />Boutique agility.</>
            )
          )}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <Card key={r.idEn} reason={r} lang={lang} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
