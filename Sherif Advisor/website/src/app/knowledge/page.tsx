'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // ✅ Added for optimized local images
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Knowledge } from '@/components/sections/Knowledge';
import { BookOpen, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

interface Article {
  id: string;
  title: string;
  body: string;
  metadata: {
    category?: string;
    publishDate?: string;
    featuredImageId?: string;
    featuredImage?: string;
  };
  updatedAt: string;
}

const CATEGORIES_AR = ['الكل', 'قانوني', 'ضريبي', 'مالي'];
const CATEGORIES_EN = ['All', 'Legal', 'Tax', 'Financial'];

// ✅ Use 'en' as the SSR default — matches DEFAULT_LANGUAGE in language.ts
// so server & client initial renders always agree.
const SSR_DEFAULT_LANG: Language = 'en';

export default function KnowledgePage() {
  const [lang, setLang] = useState<Language>(SSR_DEFAULT_LANG);
  const [isMounted, setIsMounted] = useState(false);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 2. After mount, update to the real client language (no dependency on lang to avoid loops)
  useEffect(() => {
    setIsMounted(true);
    setLang(getClientLanguage());
  }, []);

  const categories = lang === 'ar' ? CATEGORIES_AR : CATEGORIES_EN;

  // 3. Fetch articles ONLY after mounting to prevent fetching with the wrong default language
  useEffect(() => {
    if (!isMounted) return;

    async function fetchArticles() {
      setLoading(true);
      try {
        let url = `/api/content/articles?lang=${lang}&page=${page}`;
        if (selectedCategory && selectedCategory !== 'الكل' && selectedCategory !== 'All') {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setArticles(data.items || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [lang, page, selectedCategory, isMounted]);

  const filteredArticles = searchQuery.length >= 2
    ? articles.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : articles;

  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-3.jpeg"
            alt="Services Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1929]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5"
             style={{ animation: 'heroFadeRight 0.8s ease 0.2s both' }}>
            {t(lang, 'رؤى ومعرفة', 'Insights & Knowledge')}
          </p>
          <h1 className="font-serif text-white leading-[1.05] max-w-2xl mx-auto mb-5"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                animation: 'heroFadeUp 0.8s ease 0.4s both',
                textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              }}>
            {t(lang, 'أحدث المقالات', 'Latest Articles')}<br />
            <span className="italic">{t(lang, 'والتحليلات', '& Insights')}</span>
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed mb-5"
             style={{ animation: 'heroFadeUp 0.8s ease 0.6s both', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {t(
              lang,
              'ابقَ على اطلاع بأحدث الرؤى والتحليلات والتوجهات في مجالات الضرائب والمحاسبة والامتثال.',
              'Stay informed with the latest insights, analysis, and trends in tax, accounting, and compliance.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="border cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase"
            >
              <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-white transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
              <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#030a12] flex-shrink-0">
                {lang === 'ar'
                  ? <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  : <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
              </span>
              <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#030a12]">
                {t(lang, 'احجز استشارة', 'Schedule a Consultation')}
              </span>
            </Link>
            <Link
              href="/about"
              className="border cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase"
            >
              <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-gold transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
              <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-gold text-white flex-shrink-0">
                {lang === 'ar'
                  ? <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  : <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
              </span>
              <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-white">
                {t(lang, 'تعرف علينا', 'Learn More About Us')}
              </span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>


      {/* Categories */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {categories.map((cat, i) => {
              const isActive = (i === 0 && !selectedCategory) || selectedCategory === cat;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedCategory(i === 0 ? '' : cat);
                    setPage(1);
                  }}
                  className={`relative px-6 py-4 text-[11px] font-bold tracking-[0.15em] uppercase whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-brand-navy'
                      : 'text-gray-400 hover:text-brand-navy'
                  }`}
                >
                  {cat}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold rounded-t" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Articles */}
      {!loading && filteredArticles.length > 0 ? (
        <section className="bg-surface-light py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredArticles.map((article, index) => {
                const cover = article.metadata?.featuredImage || article.metadata?.featuredImageId;
                
                // ✅ FIX: Check for both relative paths (/...) AND absolute URLs (http...)
                const hasImage = typeof cover === 'string' && (cover.startsWith('/') || cover.startsWith('http'));
                
                return (
                  <Link
                    key={article.id}
                    href={`/knowledge/${article.id}`}
                    className="bg-white rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col"
                  >
                    {/* Cover */}
                    {hasImage ? (
                      cover.startsWith('http') ? (
                        // External URL (e.g., Pexels)
                        <img
                          src={cover}
                          alt={article.title}
                          className="h-40 w-full object-cover"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      ) : (
                        // Local path: use Next.js Image for optimization
                        <Image
                          src={cover}
                          alt={article.title}
                          width={400}
                          height={160}
                          className="h-40 w-full object-cover"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      )
                    ) : (
                      <div
                        className="h-40 flex items-center justify-center font-mono text-xs tracking-wider text-text-muted"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(135deg, #E7EAEF 0px, #E7EAEF 8px, #F1F3F6 8px, #F1F3F6 16px)',
                        }}
                      >
                        {lang === 'ar' ? 'بدون صورة' : 'NO IMAGE'}
                      </div>
                    )}
                    <div className="p-7 flex flex-col gap-3">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-brand-gold">
                        {article.metadata?.category || (lang === 'ar' ? 'عام' : 'General')}
                      </span>
                      <h3 className="font-cormorant text-xl text-text-dark leading-snug group-hover:text-brand-navy-mid transition-colors">
                        {article.title}
                      </h3>
                      <span className="text-xs text-text-dark-secondary">
                        {article.metadata?.publishDate
                          ? new Date(article.metadata.publishDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                          : ''}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 text-sm border border-white/20 text-text-muted rounded hover:border-brand-gold hover:text-brand-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {lang === 'ar' ? 'السابق' : 'Previous'}
                </button>
                <span className="text-sm text-text-dark-secondary">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-sm border border-white/20 text-text-muted rounded hover:border-brand-gold hover:text-brand-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {lang === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            )}
          </div>
        </section>
      ) : loading ? (
        <section className="bg-surface-light py-20">
          <div className="text-center text-text-dark-secondary text-sm">
            {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </div>
        </section>
      ) : (
        <Knowledge />
      )}

      <Footer />
      <WhatsAppFloat />

    </main>
  );
}