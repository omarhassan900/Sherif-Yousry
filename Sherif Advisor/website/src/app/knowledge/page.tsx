'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Knowledge } from '@/components/sections/Knowledge';
import { BookOpen, Search } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

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

const CATEGORIES_AR = ['الكل', 'Advisory', 'Market Updates', 'Regulatory', 'Industry Insights', 'General'];
const CATEGORIES_EN = ['All', 'Advisory', 'Market Updates', 'Regulatory', 'Industry Insights', 'General'];

export default function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  const categories = lang === 'ar' ? CATEGORIES_AR : CATEGORIES_EN;

  useEffect(() => {
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
      } catch {
        // fallback to static
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [lang, page, selectedCategory]);

  const filteredArticles = searchQuery.length >= 2
    ? articles.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : articles;

  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="bg-brand-navy py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 section-label mb-4">
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'ar' ? 'الأفكار والرؤى' : 'Insights'}</span>
              </div>
              <h1 className="font-amiri text-4xl md:text-5xl text-text-primary leading-relaxed">
                {lang === 'ar' ? 'رؤى تزيد وعي عملائنا' : 'Insights to Raise Our Clients’ Awareness'}
              </h1>
              <p className="text-text-secondary mt-4 max-w-xl leading-7">
                {lang === 'ar'
                  ? 'مقالات وأدلة إرشادية وتحديثات ضريبية وتنظيمية من فريق خبرائنا لمساعدتك في فهم التغييرات وتطبيقها.'
                  : 'Articles, guides, and regulatory updates from our team of experts to help you understand and apply changes.'}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="search"
                placeholder={lang === 'ar' ? 'ابحث في المقالات...' : 'Search articles...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-navy-deep border border-white/10 pr-11 pl-4 py-3 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-brand-navy-mid py-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedCategory(i === 0 ? '' : cat);
                  setPage(1);
                }}
                className={`px-4 py-2 text-xs tracking-wider rounded border transition-colors ${
                  (i === 0 && !selectedCategory) || selectedCategory === cat
                    ? 'bg-brand-gold text-brand-navy border-brand-gold'
                    : 'border-white/20 text-text-muted hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      {!loading && filteredArticles.length > 0 ? (
        <section className="bg-surface-light py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredArticles.map((article) => {
                const cover =
                  article.metadata?.featuredImage ||
                  article.metadata?.featuredImageId;
                const hasImage =
                  typeof cover === 'string' && cover.startsWith('/');
                return (
                  <Link
                    key={article.id}
                    href={`/knowledge/${article.id}`}
                    className="bg-white rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col"
                  >
                    {/* Cover */}
                    {hasImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover as string}
                        alt={article.title}
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-40 flex items-center justify-center font-mono text-xs tracking-wider text-text-muted"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(135deg, #E7EAEF 0px, #E7EAEF 8px, #F1F3F6 8px, #F1F3F6 16px)',
                        }}
                      >
                        ARTICLE COVER
                      </div>
                    )}
                    <div className="p-7 flex flex-col gap-3">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-brand-gold">
                        {article.metadata?.category || 'General'}
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
    </main>
  );
}
