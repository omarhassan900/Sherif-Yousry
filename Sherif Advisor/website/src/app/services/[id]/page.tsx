'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
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
  };
}

interface ServiceListItem {
  id: string;
  title: string;
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

  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

  // Load the full services list for the left sidebar navigation.
  useEffect(() => {
    if (!langReady) return;
    let cancelled = false;
    fetch(`/api/content/services?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.items)) {
          setAllServices(data.items.map((s: { id: string; title: string }) => ({ id: s.id, title: s.title })));
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

  const dir = getDirection(lang);

  // Full description prefers the dedicated full-description metadata,
  // falling back to the body (short description) if not set.
  const fullDescription =
    (lang === 'ar'
      ? service?.metadata?.fullDescriptionAr
      : service?.metadata?.fullDescriptionEn) || service?.body || '';

  return (
    <main dir={dir}>
      <Header />

      {loading ? (
        <div className="bg-brand-navy min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
        </div>
      ) : notFound || !service ? (
        <div className="bg-brand-navy min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-amiri text-3xl text-text-primary">
            {t(lang, 'الخدمة غير موجودة', 'Service Not Found')}
          </h1>
          <p className="text-text-secondary">
            {t(
              lang,
              'الخدمة التي تبحث عنها غير متاحة.',
              'The service you are looking for is not available.'
            )}
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light transition-colors"
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
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-gold transition-colors mb-6"
              >
                {lang === 'ar' ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
                {t(lang, 'العودة إلى الخدمات', 'Back to Services')}
              </Link>
              <span className="section-label mb-4 block">
                {t(lang, 'خدمة', 'Service')}
              </span>
              <h1 className="font-amiri text-3xl md:text-4xl lg:text-5xl text-text-primary leading-relaxed">
                {service.title}
              </h1>
            </div>
          </div>

          {/* Body — left services sidebar + main content (Andersen-style) */}
          <section className="bg-surface-light py-16 lg:py-20">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-14 items-start">
              {/* Left sidebar: list of all services */}
              <aside className="lg:sticky lg:top-28">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-brand-navy px-5 py-4">
                    <h2 className="text-white font-semibold text-sm tracking-wide">
                      {t(lang, 'خدماتنا', 'Our Services')}
                    </h2>
                  </div>
                  <nav className="p-2">
                    {allServices.map((s) => {
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
                  </nav>
                </div>
              </aside>

              {/* Main content + inquiry form */}
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
                    className="text-text-dark-secondary leading-8 whitespace-pre-line text-[15px]"
                    dangerouslySetInnerHTML={{ __html: fullDescription }}
                  />
                </div>

                {/* Inquiry form */}
                <div className="max-w-xl">
                  <InquiryForm
                    lang={lang}
                    source="service"
                    lockedService={{ id: service.id, name: service.title }}
                    title={t(lang, 'اطلب هذه الخدمة', 'Request This Service')}
                  />
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
