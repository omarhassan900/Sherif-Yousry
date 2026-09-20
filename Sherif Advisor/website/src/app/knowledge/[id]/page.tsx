'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, Calendar, Tag, Mail, Phone } from 'lucide-react';
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
  
  // Check if it's a valid image URL (local or external)
  const isImageUrl =
    typeof featuredImage === 'string' && (featuredImage.startsWith('/') || featuredImage.startsWith('http'));

  // Prepare background style for the Hero section
  const bgImageStyle = typeof featuredImage === 'string' ? {
    backgroundImage: `url(${featuredImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

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
          {/* Hero with Background Image */}
          <div 
            className="relative py-20 lg:py-28 overflow-hidden"
            style={bgImageStyle}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-brand-navy/80" />
            
            <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
              <Link
                href="/knowledge"
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-brand-gold transition-colors mb-6"
              >
                <BackIcon className="w-4 h-4" />
                {t(lang, 'العودة إلى الأفكار', 'Back to Insights')}
              </Link>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                {article.metadata?.category && (
                  <span className="inline-flex items-center gap-1.5 text-brand-gold font-mono text-xs tracking-wider">
                    <Tag className="w-3.5 h-3.5" />
                    {article.metadata.category}
                  </span>
                )}
                {article.metadata?.publishDate && (
                  <span className="inline-flex items-center gap-1.5 text-white/70">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(article.metadata.publishDate).toLocaleDateString(
                      lang === 'ar' ? 'ar-EG' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </span>
                )}
              </div>

              <h1 className="font-amiri text-3xl md:text-4xl lg:text-5xl text-white leading-relaxed drop-shadow-lg">
                {article.title}
              </h1>
            </div>
          </div>

          {/* Body with Sidebar */}
          <section className="bg-surface-light py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Content */}
                <div className="lg:col-span-2">
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

                  {/* Bottom CTA (Kept for mobile users or end-of-article readers) */}
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

                {/* Sidebar - Contact Us Component */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-100 p-6 lg:p-8">
                    <h3 className="font-cormorant text-2xl text-text-dark mb-3">
                      {t(lang, 'تواصل معنا', 'Contact Us')}
                    </h3>
                    <p className="text-text-dark-secondary text-sm leading-relaxed mb-6">
                      {t(
                        lang,
                        'هل لديك سؤال حول هذا الموضوع أو تحتاج إلى استشارة متخصصة؟ فريقنا جاهز لمساعدتك.',
                        'Have a question about this topic or need specialized advice? Our team is ready to help.'
                      )}
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center w-full gap-2 bg-brand-navy text-white font-medium py-3 px-6 rounded-full hover:bg-brand-navy-mid transition-colors text-center"
                    >
                      {t(lang, 'تواصل معنا', 'Contact Us')}
                      <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </Link>
                    
                    {/* Contact Details */}
                    <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                       <a href="mailto:info@example.com" className="flex items-center gap-3 text-sm text-text-dark-secondary hover:text-brand-navy transition-colors">
                          <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
                          <span>info@example.com</span>
                       </a>
                       <a href="tel:+201234567890" className="flex items-center gap-3 text-sm text-text-dark-secondary hover:text-brand-navy transition-colors">
                          <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
                          <span dir="ltr">+20 123 456 789</span>
                       </a>
                    </div>
                  </div>
                </div>

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