'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, Loader2, Briefcase, FileText } from 'lucide-react';
import type { Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

interface SearchResult {
  id: string;
  type: 'service' | 'article';
  title: string;
  body: string;
  category?: string;
  url: string;
}

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

/** Strip HTML and clip body text into a short snippet. */
function snippet(html: string, max = 120): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/**
 * SearchOverlay — Full-screen search modal for the V2 site.
 *
 * Searches published services and insights (articles) by keyword via
 * /api/content/search, debounced as the user types, and lists results grouped
 * by type. Closes on Escape, backdrop click, or selecting a result.
 */
export function SearchOverlay({ isOpen, onClose, lang }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input and lock body scroll while open. Reset on close.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Delay focus until the element is painted.
      const id = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
    document.body.style.overflow = '';
    setQuery('');
    setResults([]);
    setSearched(false);
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const runSearch = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) {
        setResults([]);
        setSearched(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/content/search?q=${encodeURIComponent(q)}&lang=${lang}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data.items) ? data.items : []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    },
    [lang]
  );

  // Debounce searches as the user types.
  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => runSearch(query), 300);
    return () => window.clearTimeout(id);
  }, [query, isOpen, runSearch]);

  if (!isOpen) return null;

  const services = results.filter((r) => r.type === 'service');
  const articles = results.filter((r) => r.type === 'article');

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#030a12]/95 backdrop-blur-md"
      onClick={onClose}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div
        className="max-w-3xl mx-auto px-6 pt-24 pb-10 h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(lang, 'ابحث في الخدمات والرؤى...', 'Search services & insights...')}
            className="w-full bg-white/5 border border-white/20 rounded-full py-4 ps-12 pe-12 text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-gold/60 transition-colors"
          />
          <button
            onClick={onClose}
            aria-label={t(lang, 'إغلاق البحث', 'Close search')}
            className="absolute top-1/2 -translate-y-1/2 end-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-6 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : query.trim().length < 2 ? (
            <p className="text-center text-gray-500 text-sm py-16">
              {t(lang, 'اكتب كلمتين على الأقل للبحث.', 'Type at least 2 characters to search.')}
            </p>
          ) : searched && results.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-16">
              {t(lang, 'لا توجد نتائج مطابقة.', 'No matching results.')}
            </p>
          ) : (
            <div className="space-y-8">
              {services.length > 0 && (
                <ResultGroup
                  title={t(lang, 'الخدمات', 'Services')}
                  icon={Briefcase}
                  items={services}
                  lang={lang}
                  onSelect={onClose}
                />
              )}
              {articles.length > 0 && (
                <ResultGroup
                  title={t(lang, 'الرؤى', 'Insights')}
                  icon={FileText}
                  items={articles}
                  lang={lang}
                  onSelect={onClose}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ResultGroupProps {
  title: string;
  icon: typeof Briefcase;
  items: SearchResult[];
  lang: Language;
  onSelect: () => void;
}

function ResultGroup({ title, icon: Icon, items, lang, onSelect }: ResultGroupProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
        <Icon className="w-4 h-4 text-brand-gold" />
        <h3 className="text-xs font-bold tracking-widest uppercase text-brand-gold">
          {title}
        </h3>
        <span className="text-xs text-gray-500">({items.length})</span>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.url}
              onClick={onSelect}
              className="block rounded-lg px-4 py-3 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-white font-medium group-hover:text-brand-gold transition-colors">
                  {item.title}
                </span>
                {item.category && (
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-white/15 rounded-full px-2 py-0.5">
                    {item.category}
                  </span>
                )}
              </div>
              {item.body && (
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {snippet(item.body)}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
