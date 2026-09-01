'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Services } from '@/components/sections/Services';
import { getClientLanguage, type Language } from '@/lib/language';

interface ServiceItem {
  id: string;
  title: string;
  body: string;
  metadata: {
    icon?: string;
    displayOrder?: number;
    descriptionAr?: string;
    descriptionEn?: string;
    image?: string;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('ar');
  const [langReady, setLangReady] = useState(false);

  // Resolve the client language before any fetch happens.
  useEffect(() => {
    setLang(getClientLanguage());
    setLangReady(true);
  }, []);

  useEffect(() => {
    if (!langReady) return;
    let cancelled = false;
    async function fetchServices() {
      try {
        const res = await fetch(`/api/content/services?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          // Ignore this response if a newer language change superseded it.
          if (!cancelled && data.items && data.items.length > 0) {
            setServices(data.items);
          }
        }
      } catch {
        // Fall through to static content
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchServices();
    return () => {
      cancelled = true;
    };
  }, [lang, langReady]);

  return (
    <main>
      <Header />
      <div className="bg-brand-navy py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="section-label mb-4 block">
            {lang === 'ar' ? 'ما نقدمه' : 'What We Offer'}
          </span>
          <h1 className="font-amiri text-4xl md:text-5xl text-text-primary leading-relaxed">
            {lang === 'ar' ? 'خدمات استشارية متكاملة' : 'Comprehensive Advisory Services'}
          </h1>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto leading-7">
            {lang === 'ar'
              ? 'نقدم تسع مجالات ممارسة متكاملة تغطي احتياجات شركتك من الالتزام الضريبي إلى التوسع الإقليمي مروراً بالحوكمة والإدارة المالية.'
              : 'We offer nine integrated practice areas covering your company\'s needs from tax compliance to regional expansion through governance and financial management.'}
          </p>
        </div>
      </div>
      {/* If CMS has services, render them; otherwise use static component */}
      {!loading && services.length > 0 ? (
        <section className="bg-surface-light py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="group flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden"
                >
                  {service.metadata?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={service.metadata.image}
                      alt={service.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="font-mono text-xs text-brand-gold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-cormorant text-2xl text-text-dark mt-2">
                      {service.title}
                    </h3>
                    <p className="text-[13px] leading-7 text-text-dark-secondary mt-2 line-clamp-3">
                      {service.body}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-gold-dark font-medium group-hover:gap-2.5 transition-all">
                      {lang === 'ar' ? 'اقرأ المزيد' : 'Read more'}
                      {lang === 'ar' ? (
                        <ArrowLeft className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <Services />
      )}
      <Footer />
    </main>
  );
}
