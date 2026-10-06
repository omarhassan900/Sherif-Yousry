'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

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

interface KnowledgeClientProps {
  /** Articles pre-fetched server-side for the initial render (page 1, no filter). */
  initialArticles: Article[];
  initialTotalPages: number;
}

/**
 * KnowledgeClient
 *
 * Handles interactive state: category filter, search, pagination.
 * The first page of articles is received as props (server-rendered, no flash).
 * Subsequent pages / category changes fetch from the API client-side.
 */
export function KnowledgeClient({
  initialArticles,
  initialTotalPages,
}: KnowledgeClientProps) {
  const [lang, setLang] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Track whether the current view differs from the pre-fetched initial data
  const isInitialView = page === 1 && !selectedCategory;

  useEffect(() => {
    setIsMounted(true);
    setLang(getClientLanguage());
  }, []);

  const categories = lang === 'ar' ? CATEGORIES_AR : CATEGORIES_EN;

  const fetchArticles = useCallback(
    async (targetPage: number, category: string, currentLang: Language) => {
      setLoading(true);
      try {
        let url = `/api/content/articles?lang=${currentLang}&page=${targetPage}`;
        if (category && category !== 'الكل' && category !== 'All') {
          url += `&category=${encodeURIComponent(category)}`;
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
    },
    []
  );

  // Only fetch when something actually changes from the initial server-rendered state
  useEffect(() => {
    if (!isMounted) return;
    // Skip the very first render when we already have server data for page=1 no-filter
    if (isInitialView) return;
    fetchArticles(page, selectedCategory, lang);
  }, [lang, page, selectedCategory, isMounted, isInitialView, fetchArticles]);

  // Reset to page 1 on category change
  const handleCategoryChange = (cat: string, index: number) => {
    const newCat = index === 0 ? '' : cat;
    setSelectedCategory(newCat);
    setPage(1);
    // If going back to page 1 / no filter, restore the server data immediately
    if (!newCat) {
      setArticles(initialArticles);
      setTotalPages(initialTotalPages);
    }
  };

  const filteredArticles =
    searchQuery.length >= 2
      ? articles.filter((a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : articles;

  return (
    <>
      {/* Categories */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {categories.map((cat, i) => {
              const isActive =
                (i === 0 && !selectedCategory) || selectedCategory === cat;
              return (
                <button
                  key={i}
                  onClick={() => handleCategoryChange(cat, i)}
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

      {/* Articles grid */}
      <section className="bg-surface-light py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            /* Loading skeleton — matches card height so there's no layout shift */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden animate-pulse"
                >
                  <div className="h-40 bg-gray-200" />
                  <div className="p-7 flex flex-col gap-3">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredArticles.map((article, index) => {
                const cover =
                  article.metadata?.featuredImage ||
                  article.metadata?.featuredImageId;
                const hasImage =
                  typeof cover === 'string' &&
                  (cover.startsWith('/') || cover.startsWith('http'));

                return (
                  <Link
                    key={article.id}
                    href={`/knowledge/${article.id}`}
                    className="bg-white rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col"
                  >
                    {hasImage ? (
                      cover.startsWith('http') ? (
                        <img
                          src={cover}
                          alt={article.title}
                          className="h-40 w-full object-cover"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      ) : (
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
                        {t(lang, 'بدون صورة', 'NO IMAGE')}
                      </div>
                    )}
                    <div className="p-7 flex flex-col gap-3">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-brand-gold">
                        {article.metadata?.category ||
                          t(lang, 'عام', 'General')}
                      </span>
                      <h3 className="font-cormorant text-xl text-text-dark leading-snug group-hover:text-brand-navy-mid transition-colors">
                        {article.title}
                      </h3>
                      <span className="text-xs text-text-dark-secondary">
                        {article.metadata?.publishDate
                          ? new Date(
                              article.metadata.publishDate
                            ).toLocaleDateString(
                              lang === 'ar' ? 'ar-EG' : 'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )
                          : ''}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-text-dark-secondary text-sm">
              {t(lang, 'لا توجد مقالات متاحة.', 'No articles available.')}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 text-sm border border-white/20 text-text-muted rounded hover:border-brand-gold hover:text-brand-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t(lang, 'السابق', 'Previous')}
              </button>
              <span className="text-sm text-text-dark-secondary">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 text-sm border border-white/20 text-text-muted rounded hover:border-brand-gold hover:text-brand-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t(lang, 'التالي', 'Next')}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
