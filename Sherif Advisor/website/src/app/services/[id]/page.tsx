'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import InquiryForm from '@/components/forms/InquiryForm';
import { getClientLanguage, getDirection, type Language } from '@/lib/language';

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

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [lang, setLang] = useState<Language>('ar');
  const [langReady, setLangReady] = useState(false);
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

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

          {/* Body */}
          <section className="bg-surface-light py-16 lg:py-20">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 grid lg:grid-cols-5 gap-10">
              {/* Content */}
              <div className="lg:col-span-3 space-y-6">
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
              <div className="lg:col-span-2">
                <InquiryForm
                  lang={lang}
                  source="service"
                  lockedService={{ id: service.id, name: service.title }}
                  title={t(lang, 'اطلب هذه الخدمة', 'Request This Service')}
                />
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </main>
  );
}
