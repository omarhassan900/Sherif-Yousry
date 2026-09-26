'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Loader2, MessageSquare } from 'lucide-react';
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
    serviceType?: string;
    categorySlug?: string;
    shortDescriptionEn?: string;
    shortDescriptionAr?: string;
    fullDescriptionEn?: string;
    fullDescriptionAr?: string;
    [key: string]: unknown;
  };
}

interface ServiceListItem {
  id: string;
  title: string;
  metadata?: { serviceType?: string; categorySlug?: string };
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

  // Load sidebar: sub-services in same category
  useEffect(() => {
    if (!langReady) return;
    let cancelled = false;
    fetch(`/api/content/services?lang=${lang}`)
      .then(res => res.ok ? res.json() : { items: [] })
      .then(data => {
        if (!cancelled && Array.isArray(data.items)) {
          const subs = data.items.filter((s: ServiceListItem) => s.metadata?.serviceType !== 'category');
          setAllServices(subs);
        }
      })
      .catch(() => { });
    return () => { cancelled = true; };
  }, [lang, langReady]);

  // Load service detail
  useEffect(() => {
    if (!id || !langReady) return;
    let cancelled = false;
    async function fetchService() {
      setLoading(true);
      try {
        const res = await fetch(`/api/content/services/${id}?lang=${lang}`);
        if (!cancelled) {
          if (res.ok) setService(await res.json());
          else setNotFound(true);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchService();
    return () => { cancelled = true; };
  }, [id, lang, langReady]);

  const dir = getDirection(lang);

  // Same-category siblings for sidebar
  const siblings = allServices.filter(s =>
    s.metadata?.categorySlug === service?.metadata?.categorySlug
  );

  // Rich HTML — prefer fullDescriptionEn from metadata (set by admin editor),
  // fall back to bodyEn (set by seed script), then short description.
  const richContent =
    (lang === 'ar'
      ? service?.metadata?.fullDescriptionAr
      : service?.metadata?.fullDescriptionEn)
    || service?.body
    || '';

  // Smooth scroll to the contact form
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
          <h1 className="font-amiri text-3xl text-text-primary">{t(lang, 'الخدمة غير موجودة', 'Service Not Found')}</h1>
          <p className="text-text-secondary">{t(lang, 'الخدمة التي تبحث عنها غير متاحة.', 'The service you are looking for is not available.')}</p>
          <Link href="/services" className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light transition-colors">
            {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t(lang, 'العودة إلى الخدمات', 'Back to Services')}
          </Link>
        </div>
      ) : (
        <>
          {/* Hero */}
          <div className="bg-brand-navy py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <Link href="/services" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-gold transition-colors mb-6">
                {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {t(lang, 'العودة إلى الخدمات', 'Back to Services')}
              </Link>
              <span className="section-label mb-4 block">{t(lang, 'خدمة', 'Service')}</span>
              <h1 className="font-amiri text-3xl md:text-4xl lg:text-5xl text-text-primary leading-relaxed">
                {service.title}
              </h1>
            </div>
          </div>

          {/* Body — 3 Column Layout: Related Services | Main Content | Contact Card */}
          <section className="bg-surface-light py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[260px_1fr_340px] gap-10 lg:gap-12 items-start">

              {/* Left sidebar: Related Services */}
              <aside className="lg:sticky lg:top-28">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-brand-navy px-5 py-4">
                    <h2 className="text-white font-semibold text-sm tracking-wide">{t(lang, 'الخدمات ذات الصلة', 'Related Services')}</h2>
                  </div>
                  <nav className="p-2">
                    <Link href="/services" className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-text-muted hover:text-brand-gold transition-colors mb-1">
                      {lang === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                      {t(lang, 'جميع الخدمات', 'All Services')}
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    {(siblings.length > 0 ? siblings : allServices.slice(0, 10)).map(s => {
                      const active = s.id === service.id;
                      return (
                        <Link key={s.id} href={`/services/${s.id}`}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors ${active
                              ? 'bg-brand-gold/10 text-brand-navy font-semibold border-s-2 border-brand-gold'
                              : 'text-text-dark-secondary hover:bg-gray-50 hover:text-brand-gold'
                            }`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-brand-gold' : 'bg-gray-300'}`} />
                          {s.title}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </aside>

              {/* Main content */}
              <div className="min-w-0 space-y-10">
                {/* Cover image — from metadata.image or a category default */}
                {(() => {
                  const img = service.metadata?.image;
                  const categoryDefaults: Record<string, string> = {
                    'tax-advisory': '/images/bg.jpeg',
                    'financial-advisory': '/images/bg-2.jpeg',
                    'business-management-advisory': '/images/bg-3.jpeg',
                    'corporate-legal-services': '/images/bg-4.jpeg',
                    'payroll-social-insurance': '/images/bg_.jpeg',
                    'ecommerce-digital-business': '/images/bg__.jpeg',
                  };
                  const coverSrc = img || categoryDefaults[service.metadata?.categorySlug ?? ''] || '/images/bg.jpeg';
                  return (
                    <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden shadow-sm mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverSrc}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 to-transparent" />
                    </div>
                  );
                })()}

                {/* Rich HTML content from DB */}
                {richContent ? (
                  <div
                    className="service-content"
                    dangerouslySetInnerHTML={{ __html: richContent }}
                  />
                ) : (
                  <p className="text-text-dark-secondary leading-8 text-[15px]">
                    {t(lang,
                      'محتوى هذه الخدمة قيد الإعداد.',
                      'Content for this service is being prepared.'
                    )}
                  </p>
                )}

                {/* Inquiry form */}
                <div id="contact-form-section" className="max-w-xl pt-6 border-t border-gray-200 scroll-mt-28">
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
                    className="w-full border border-brand-gold/40 cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase"
                  >
                    <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-gold transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                    <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-gold text-[#030a12] flex-shrink-0">
                      <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </span>
                    <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#030a12]">
                    {t(lang, 'تواصل معنا', 'Contact Us')}
                    </span>
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