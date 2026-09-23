'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, MessageSquare, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import InquiryForm from '@/components/forms/InquiryForm';
import { getClientLanguage, getDirection, type Language } from '@/lib/language';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

interface ServiceDetail {
  id: string;
  title: string;
  body: string;
  metadata: {
    image?: string;
    fullDescriptionAr?: string;
    fullDescriptionEn?: string;
    descriptionAr?: string;
    descriptionEn?: string;
    serviceType?: string;
    categorySlug?: string;
  };
}

interface ServiceListItem {
  id: string;
  title: string;
  metadata?: { serviceType?: string; categorySlug?: string };
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [lang, setLang] = useState<Language>('ar');
  const [langReady, setLangReady] = useState(false);
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [allServices, setAllServices] = useState<ServiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Table of Contents state
  const [processedHtml, setProcessedHtml] = useState('');
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

  // Load the sub-services in the same category for the left sidebar navigation.
  useEffect(() => {
    if (!langReady) return;
    let cancelled = false;
    fetch(`/api/content/services?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.items)) {
          // Only show sub-services — filter out categories from the sidebar
          const subs = data.items.filter((s: { id: string; title: string; metadata?: { serviceType?: string } }) =>
            s.metadata?.serviceType !== 'category'
          );
          setAllServices(subs.map((s: { id: string; title: string; metadata?: { serviceType?: string; categorySlug?: string } }) => ({ id: s.id, title: s.title, metadata: s.metadata })));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang, langReady]);

  useEffect(() => {
    if (!id || !langReady) return;
    let cancelled = false;
    async function fetchService() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/services/${id}?lang=${lang}`);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setService(data);
        } else {
          if (!cancelled) setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchService();
    return () => {
      cancelled = true;
    };
  }, [id, lang, langReady]);

  // Extract Headers from HTML to build the Table of Contents and inject IDs for smooth scrolling
  useEffect(() => {
    const fullDescription =
      (lang === 'ar'
        ? service?.metadata?.fullDescriptionAr
        : service?.metadata?.fullDescriptionEn) || service?.body || '';

    if (!fullDescription || typeof window === 'undefined') {
      setProcessedHtml(fullDescription);
      setToc([]);
      return;
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(fullDescription, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');
    const newToc: TocItem[] = [];

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      newToc.push({
        id: heading.id,
        text: heading.textContent || '',
        level: heading.tagName === 'H2' ? 2 : 3,
      });
    });

    setToc(newToc);
    setProcessedHtml(doc.body.innerHTML);
  }, [service, lang]);

  const dir = getDirection(lang);

  // Smooth scroll to a specific heading
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const headerOffset = 100; // Offset for sticky header
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Smooth scroll to the contact form at the bottom
  const scrollToForm = () => {
    const formElement = document.getElementById('contact-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main dir={dir}>
      <Header />

      {loading ? (
        <div className="bg-brand-navy min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
        </div>
      ) : notFound || !service ? (
        <div className="bg-brand-navy min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-amiri text-3xl text-white">
            {t(lang, 'الخدمة غير موجودة', 'Service Not Found')}
          </h1>
          <p className="text-gray-300">
            {t(
              lang,
              'الخدمة التي تبحث عنها غير متاحة.',
              'The service you are looking for is not available.'
            )}
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold/80 transition-colors"
          >
            {lang === 'ar' ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
            {t(lang, 'العودة إلى الخدمات', 'Back to Services')}
          </Link>
        </div>
      ) : (
        <>
          {/* Hero */}
          <div className="bg-brand-navy py-16 lg:py-20">
            <div className="mt-10 max-w-7xl mx-auto px-6 lg:px-8">
              
              {/* ✅ Breadcrumb Navigation */}
              <nav className="flex items-center gap-2 text-sm text-gray-300 mb-6 flex-wrap" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-brand-gold transition-colors">
                  {t(lang, 'الرئيسية', 'Home')}
                </Link>
                <ChevronRight className={`w-4 h-4 text-gray-500 flex-shrink-0 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                <Link href="/services" className="hover:text-brand-gold transition-colors">
                  {t(lang, 'الخدمات', 'Services')}
                </Link>
                <ChevronRight className={`w-4 h-4 text-gray-500 flex-shrink-0 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                <span className="text-brand-gold truncate max-w-[200px] md:max-w-md" title={service.title}>
                  {service.title}
                </span>
              </nav>

              <span className="text-brand-gold text-sm font-bold tracking-wider uppercase mb-4 block">
                {t(lang, 'خدمة', 'Service')}
              </span>
              <h1 className="font-amiri text-3xl md:text-4xl lg:text-5xl text-white leading-relaxed">
                {service.title}
              </h1>
            </div>
          </div>

<<<<<<< HEAD
          {/* Body — 3 Column Layout: Services List + TOC | Main Content | Contact Card */}
          <section className="bg-gray-50 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[260px_1fr_340px] gap-10 lg:gap-12 items-start">
              
              {/* Left sidebar: Our Services + Table of Contents */}
              <aside className="hidden lg:block lg:top-28 space-y-6">
                
                {/* 1. All Services List */}
=======
          {/* Body — left services sidebar + main content (Andersen-style) */}
          <section className="bg-surface-light py-16 lg:py-20">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-14 items-start">
              {/* Left sidebar: sub-services in the same category */}
              <aside className="lg:sticky lg:top-28">
>>>>>>> a1aeb90 (UI & portal)
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-brand-navy px-5 py-4">
                    <h2 className="text-white font-semibold text-sm tracking-wide">
                      {t(lang, 'الخدمات ذات الصلة', 'Related Services')}
                    </h2>
                  </div>
                  <nav className="p-2">
<<<<<<< HEAD
                    {allServices.map((s) => {
                      const active = s.id === service.id;
                      return (
                        <Link
                          key={s.id}
                          href={`/services/${s.id}`}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors ${
                            active
                              ? 'bg-brand-gold/10 text-brand-navy font-semibold'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-brand-gold'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-brand-gold' : 'bg-gray-300'}`} />
                          {s.title}
                        </Link>
                      );
                    })}
=======
                    {/* Back to all services */}
                    <Link href="/services"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-text-muted hover:text-brand-gold transition-colors mb-1">
                      {lang === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                      {t(lang, 'جميع الخدمات', 'All Services')}
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    {allServices
                      .filter(s => s.metadata?.categorySlug === service.metadata?.categorySlug || !s.metadata?.categorySlug)
                      .map((s) => {
                        const active = s.id === service.id;
                        return (
                          <Link
                            key={s.id}
                            href={`/services/${s.id}`}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors ${
                              active
                                ? 'bg-brand-gold/10 text-brand-navy font-semibold'
                                : 'text-text-dark-secondary hover:bg-gray-50 hover:text-brand-gold'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-brand-gold' : 'bg-gray-300'}`} />
                            {s.title}
                          </Link>
                        );
                      })}
>>>>>>> a1aeb90 (UI & portal)
                  </nav>
                </div>

                {/* 2. Table of Contents (Subtitles from HTML) */}
                {toc.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-brand-navy/90 px-5 py-4 border-t border-gray-200 lg:border-t-0">
                      <h2 className="text-white font-semibold text-sm tracking-wide">
                        {t(lang, 'محتوى الصفحة', 'Page Contents')}
                      </h2>
                    </div>
                    <nav className="p-4">
                      <ul className="space-y-2">
                        {toc.map((item) => (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              onClick={(e) => handleTocClick(e, item.id)}
                              className={`block transition-colors hover:text-brand-gold ${
                                item.level === 3 
                                  ? 'ps-4 text-xs text-gray-600' 
                                  : 'text-sm font-medium text-brand-navy'
                              }`}
                            >
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}
              </aside>

              {/* Main content */}
              <div className="min-w-0 space-y-10">
                <div className="space-y-6">
                  <h2 className="font-amiri text-2xl md:text-3xl text-brand-navy leading-relaxed">
                    {service.title}
                  </h2>
                  {service.metadata?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.metadata.image}
                      alt={service.title}
                      className="w-full rounded-lg shadow-sm object-cover max-h-80"
                    />
                  )}
                  <div
<<<<<<< HEAD
                    className="text-gray-700 leading-8 text-[15px] 
                      [&>h2]:text-brand-navy [&>h2]:font-amiri [&>h2]:text-2xl [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:scroll-mt-28
                      [&>h3]:text-brand-navy [&>h3]:font-amiri [&>h3]:text-xl [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:scroll-mt-28
                      [&>ul]:list-disc [&>ul]:ps-5 [&>ul]:mb-4
                      [&>ol]:list-decimal [&>ol]:ps-5 [&>ol]:mb-4
                      [&>p]:mb-4"
                    dir={dir}
                    dangerouslySetInnerHTML={{ __html: processedHtml }}
=======
                    className="service-content"
                    dangerouslySetInnerHTML={{ __html: fullDescription }}
>>>>>>> a1aeb90 (UI & portal)
                  />
                </div>

                {/* Inquiry Form at the bottom of the main content */}
                <div id="contact-form-section" className="scroll-mt-28">
                  <InquiryForm
                    lang={lang}
                    source="service"
                    lockedService={{ id: service.id, name: service.title }}
                    title={t(lang, 'اطلب هذه الخدمة', 'Request This Service')}
                  />
                </div>
              </div>

              {/* Right sidebar: Contact Us Card (Scrolls to form) */}
              <aside className="hidden lg:block lg:sticky lg:top-28">
                <div className="bg-brand-navy text-white rounded-lg p-6 shadow-lg border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-brand-gold" />
                    </div>
                    <h3 className="font-amiri text-xl">
                      {t(lang, 'هل لديك استفسار؟', 'Have a question?')}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                    {t(
                      lang,
                      'تواصل مع فريقنا للحصول على استشارة مخصصة حول هذه الخدمة وكيف يمكننا مساعدتك.',
                      'Reach out to our team for a customized consultation regarding this service and how we can help you.'
                    )}
                  </p>
                  <button
                    onClick={scrollToForm}
                    className="w-full bg-brand-gold text-brand-navy font-bold py-3 px-4 rounded-lg hover:bg-brand-gold/90 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    {t(lang, 'تواصل معنا', 'Contact Us')}
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </button>
                </div>
              </aside>

            </div>
          </section>
        </>
      )}

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}