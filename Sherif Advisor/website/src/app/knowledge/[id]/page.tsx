'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Calendar, Tag } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getClientLanguage, getDirection, type Language } from '@/lib/language';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

interface ArticleDetail {
  id: string;
  title: string;
  body: string;
  metadata: {
    category?: string;
    publishDate?: string;
    featuredImageId?: string;
    featuredImage?: string;
  };
}

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [lang, setLang] = useState<Language>('ar');
  const [langReady, setLangReady] = useState(false);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

  useEffect(() => {
    if (!id || !langReady) return;
    let cancelled = false;
    async function fetchArticle() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/articles/${id}?lang=${lang}`);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setArticle(data);
        } else if (!cancelled) {
          setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchArticle();
    return () => {
      cancelled = true;
    };
  }, [id, lang, langReady]);

  const dir = getDirection(lang);
  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;
  const featuredImage =
    article?.metadata?.featuredImage || article?.metadata?.featuredImageId;
  const isImageUrl =
    typeof featuredImage === 'string' && featuredImage.startsWith('/');

  return (
    <main dir={dir}>
      <Header />

      {loading ? (
        <div className="bg-brand-navy min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
        </div>
      ) : notFound || !article ? (
        <div className="bg-brand-navy min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-amiri text-3xl text-text-primary">
            {t(lang, 'المقال غير موجود', 'Article Not Found')}
          </h1>
          <p className="text-text-secondary">
            {t(
              lang,
              'المقال الذي تبحث عنه غير متاح.',
              'The article you are looking for is not available.'
            )}
          </p>
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light transition-colors"
          >
            <BackIcon className="w-4 h-4" />
            {t(lang, 'العودة إلى الأفكار', 'Back to Insights')}
          </Link>
        </div>
      ) : (
        <>
          {/* Hero */}
          <div className="bg-brand-navy py-16 lg:py-20">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
              <Link
                href="/knowledge"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-gold transition-colors mb-6"
              >
                <BackIcon className="w-4 h-4" />
                {t(lang, 'العودة إلى الأفكار', 'Back to Insights')}
              </Link>

              <div className="flex items-center gap-4 mb-4 text-sm">
                {article.metadata?.category && (
                  <span className="inline-flex items-center gap-1.5 text-brand-gold font-mono text-xs tracking-wider">
                    <Tag className="w-3.5 h-3.5" />
                    {article.metadata.category}
                  </span>
                )}
                {article.metadata?.publishDate && (
                  <span className="inline-flex items-center gap-1.5 text-text-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(article.metadata.publishDate).toLocaleDateString(
                      lang === 'ar' ? 'ar-EG' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </span>
                )}
              </div>

              <h1 className="font-amiri text-3xl md:text-4xl lg:text-5xl text-text-primary leading-relaxed">
                {article.title}
              </h1>
            </div>
          </div>

          {/* Body */}
          <section className="bg-surface-light py-16 lg:py-20">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
              {isImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredImage as string}
                  alt={article.title}
                  className="w-full rounded-lg shadow-sm object-cover max-h-96 mb-10"
                />
              )}
              <div
                className="article-body text-text-dark-secondary leading-8 text-[16px]"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />

              {/* CTA */}
              <div className="mt-14 pt-10 border-t border-gray-200 text-center">
                <h3 className="font-cormorant text-2xl text-text-dark">
                  {t(
                    lang,
                    'هل لديك سؤال حول هذا الموضوع؟',
                    'Have a question about this topic?'
                  )}
                </h3>
                <p className="text-text-dark-secondary text-sm mt-2">
                  {t(
                    lang,
                    'تواصل مع فريقنا للحصول على استشارة.',
                    'Reach out to our team for a consultation.'
                  )}
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 mt-5 bg-brand-navy text-white font-medium py-3 px-6 rounded-full hover:bg-brand-navy-mid transition-colors"
                >
                  {t(lang, 'تواصل معنا', 'Contact Us')}
                  <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
      <WhatsAppFloat />

    </main>
  );
}
