'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

interface Article {
  id: string;
  title: string;
  body: string;
  metadata: { category?: string; publishDate?: string };
}

const fallback = [
  { category: 'تحديث ضريبي', catEn: 'Tax Update',         titleAr: 'المرحلة الثانية للفاتورة الإلكترونية: ما يتغيّر للمجموعات المتوسطة في مصر؟', titleEn: 'E-invoicing Phase 2: What changes for mid-size groups in Egypt?', gradient: 'from-brand-navy-mid to-brand-gold/40',  date: '2024' },
  { category: 'حوكمة',       catEn: 'Governance',          titleAr: 'إطار COSO 2024 — أبرز التحديثات وأثرها على الشركات المصرية.',                 titleEn: 'COSO 2024 Framework — Key updates and impact on Egyptian companies.',         gradient: 'from-brand-navy-dark to-brand-navy-mid', date: '2024' },
  { category: 'توسّع إقليمي', catEn: 'Regional Expansion', titleAr: 'ضريبة الشركات في الإمارات: دليل الالتزام الأولي والهيكلة.',                   titleEn: 'UAE Corporate Tax: A guide to initial compliance and structuring.',            gradient: 'from-brand-navy to-brand-gold/30',       date: '2024' },
];

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

function ArticleCard({ item, lang, delay }: { item: typeof fallback[0]; lang: Language; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group border border-white/5 bg-white/[0.02] hover:border-brand-gold hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden cursor-pointer"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s, box-shadow 0.3s`,
      }}
    >
      {/* Cover image area */}
      <div className={`h-48 bg-gradient-to-br ${item.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/10 transition-all duration-400" />
        <span className="absolute top-4 right-4 bg-brand-gold text-brand-navy text-[11px] font-bold px-3 py-1 group-hover:scale-105 transition-transform duration-300">
          {t(lang, item.category, item.catEn)}
        </span>
      </div>

      <div className="p-6">
        <span className="font-mono text-text-muted text-xs">{item.date}</span>
        <h4 className="font-amiri text-text-primary text-lg leading-snug mt-2 group-hover:text-brand-gold transition-colors duration-300">
          {t(lang, item.titleAr, item.titleEn)}
        </h4>
      </div>
    </div>
  );
}

export function Knowledge() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loaded,   setLoaded]   = useState(false);
  const [lang,     setLang]     = useState<Language>('ar');

  useEffect(() => { setLang(getClientLanguage()); }, []);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(`/api/content/articles?lang=${lang}&page=1`);
        if (res.ok) {
          const data = await res.json();
          if (data.items?.length) setArticles(data.items.slice(0, 3));
        }
      } catch { /* use fallback */ } finally { setLoaded(true); }
    }
    fetchArticles();
  }, [lang]);

  return (
    <section className="py-24 bg-brand-navy-dark" id="insights">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label mb-4 block">
              {t(lang, 'المعرفة والتحديثات التنظيمية', 'Knowledge & Regulatory Updates')}
            </span>
            <h2 className="section-title">
              {t(lang, 'ابقَ في المقدمة.', 'Stay ahead.')}
            </h2>
          </div>
          <Link href="/knowledge" className="hidden md:flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-light transition-colors">
            {t(lang, 'جميع المقالات', 'All Articles')} <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loaded && articles.length > 0
            ? articles.map((a, i) => (
                <div key={a.id} className="group border border-white/5 bg-white/[0.02] overflow-hidden hover:border-brand-gold hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300">
                  <div className="h-48 bg-brand-navy-mid flex items-center justify-center font-mono text-xs text-text-muted">
                    ARTICLE COVER
                  </div>
                  <div className="p-6">
                    <span className="font-mono text-brand-gold text-xs">{a.metadata?.category ?? ''}</span>
                    <h4 className="font-amiri text-text-primary text-lg mt-2 leading-snug group-hover:text-brand-gold transition-colors duration-300">{a.title}</h4>
                    <span className="font-mono text-text-muted text-xs mt-2 block">{a.metadata?.publishDate ? new Date(a.metadata.publishDate).getFullYear() : ''}</span>
                  </div>
                </div>
              ))
            : fallback.map((item, i) => (
                <ArticleCard key={item.catEn} item={item} lang={lang} delay={i * 120} />
              ))}
        </div>

        <Link href="/knowledge" className="md:hidden flex items-center justify-center gap-2 mt-8 text-sm text-brand-gold">
          {t(lang, 'جميع المقالات', 'All Articles')} <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
