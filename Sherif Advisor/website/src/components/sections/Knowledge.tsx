'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

interface Article {
  id: string;
  title: string;
  body: string;
  metadata: {
    category?: string;
    publishDate?: string;
  };
}

const fallbackArticles = [
  {
    category: 'تحديث ضريبي',
    title: 'المرحلة الثانية للفاتورة الإلكترونية: ما يتغيّر للمجموعات المتوسطة',
    date: '2024',
  },
  {
    category: 'حوكمة',
    title: 'إطار COSO 2024 — أبرز التحديثات وأثرها على الشركات المصرية',
    date: '2024',
  },
  {
    category: 'توسّع إقليمي',
    title: 'ضريبة الشركات في الإمارات: دليل الالتزام الأولي',
    date: '2024',
  },
];

export function Knowledge() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(`/api/content/articles?lang=${lang}&page=1`);
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setArticles(data.items.slice(0, 3));
          }
        }
      } catch {
        // Use fallback
      } finally {
        setLoaded(true);
      }
    }
    fetchArticles();
  }, [lang]);

  return (
    <section className="bg-surface-light py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-brand-gold" />
            <h2 className="section-title-dark">
              {lang === 'ar' ? 'المعرفة والتحديثات التنظيمية' : 'Knowledge & Regulatory Updates'}
            </h2>
          </div>
          <Link
            href="/knowledge"
            className="hidden md:flex items-center gap-1 text-sm text-brand-gold hover:text-brand-gold-dark transition-colors"
          >
            {lang === 'ar' ? 'جميع المقالات' : 'All Articles'} <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {loaded && articles.length > 0
            ? articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div
                    className="h-40 flex items-center justify-center font-mono text-xs tracking-wider text-text-muted"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(135deg, #E7EAEF 0px, #E7EAEF 8px, #F1F3F6 8px, #F1F3F6 16px)',
                    }}
                  >
                    ARTICLE COVER
                  </div>
                  <div className="p-7 flex flex-col gap-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-brand-gold">
                      {article.metadata?.category || 'General'}
                    </span>
                    <h3 className="font-cormorant text-xl text-text-dark leading-snug group-hover:text-brand-navy-mid transition-colors">
                      {article.title}
                    </h3>
                    <span className="text-xs text-text-dark-secondary">
                      {article.metadata?.publishDate
                        ? new Date(article.metadata.publishDate).toLocaleDateString(
                            lang === 'ar' ? 'ar-EG' : 'en-US',
                            { year: 'numeric', month: 'short' }
                          )
                        : ''}
                    </span>
                  </div>
                </article>
              ))
            : fallbackArticles.map((article, i) => (
                <article
                  key={i}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div
                    className="h-40 flex items-center justify-center font-mono text-xs tracking-wider text-text-muted"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(135deg, #E7EAEF 0px, #E7EAEF 8px, #F1F3F6 8px, #F1F3F6 16px)',
                    }}
                  >
                    ARTICLE COVER
                  </div>
                  <div className="p-7 flex flex-col gap-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-brand-gold">
                      {article.category}
                    </span>
                    <h3 className="font-cormorant text-xl text-text-dark leading-snug group-hover:text-brand-navy-mid transition-colors">
                      {article.title}
                    </h3>
                    <span className="text-xs text-text-dark-secondary">
                      {article.date}
                    </span>
                  </div>
                </article>
              ))}
        </div>

        <Link
          href="/knowledge"
          className="md:hidden flex items-center justify-center gap-1 mt-8 text-sm text-brand-gold"
        >
          {lang === 'ar' ? 'جميع المقالات' : 'All Articles'} <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
