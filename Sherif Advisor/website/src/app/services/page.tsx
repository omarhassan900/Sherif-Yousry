'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, FileText, Briefcase, Building2, Scale,
  ShieldCheck, TrendingUp, Users, Globe, Award, Calculator, BarChart2,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { Contact } from '@/components/sections/Contact';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, Briefcase, Building2, Scale, ShieldCheck,
  TrendingUp, Users, Globe, Award, Calculator, BarChart2,
};

interface ServiceItem {
  id: string;
  title: string;
  body: string;
  metadata: {
    serviceType?: string;
    categorySlug?: string;
    displayOrder?: number;
    icon?: string;
    image?: string;
    imageId?: string;
  };
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect(); } },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {children}
    </div>
  );
}

export default function ServicesPage() {
  const [lang, setLang]           = useState<Language>('en');
  const [items, setItems]         = useState<ServiceItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => { setLang(getClientLanguage()); }, []);

  useEffect(() => {
    fetch(`/api/content/services?lang=${lang}`)
      .then(r => r.ok ? r.json() : { items: [] })
      .then(d => { setItems(d.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [lang]);

  const categories = items
    .filter(i => i.metadata?.serviceType === 'category')
    .sort((a, b) => (a.metadata?.displayOrder ?? 99) - (b.metadata?.displayOrder ?? 99));

  const subServices = (slug: string) =>
    items
      .filter(i => i.metadata?.serviceType !== 'category' && i.metadata?.categorySlug === slug)
      .sort((a, b) => (a.metadata?.displayOrder ?? 99) - (b.metadata?.displayOrder ?? 99));

  // Auto-select first category
  useEffect(() => {
    if (!activeSlug && categories.length > 0) {
      setActiveSlug(categories[0].metadata?.categorySlug ?? null);
    }
  }, [categories, activeSlug]);

  const activeCategory = categories.find(c => (c.metadata?.categorySlug ?? c.id) === activeSlug);
  const activeSubs = activeSlug ? subServices(activeSlug) : [];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <main dir={dir} className="min-h-screen bg-white">
      <ScrollProgress />
      <Header />

      {/* ── Hero ── */}
      <section className="bg-brand-navy py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="section-label mb-3 block">{t(lang, 'خدماتنا', 'OUR SERVICES')}</span>
          <h1 className="font-amiri text-4xl md:text-5xl text-text-primary leading-tight mb-4 max-w-2xl">
            {t(lang, 'خدمات', 'Services')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
            {t(lang,
              'خدمات استشارية وإدارية متكاملة للشركات في مصر والمستثمرين الأجانب.',
              'Tax, advisory and corporate services for companies in Egypt and foreign investors entering the Egyptian market.'
            )}
          </p>
        </div>
      </section>

      {loading ? (
        <section className="py-24 text-center text-text-muted bg-surface-light">
          {t(lang, 'جاري التحميل...', 'Loading services...')}
        </section>
      ) : (
        <section className="bg-surface-light py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-start">

              {/* ── LEFT SIDEBAR — category list (Andersen-style) ── */}
              <aside className="lg:sticky lg:top-28">
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                  {/* Sidebar header */}
                  <div className="bg-brand-navy px-5 py-4">
                    <h2 className="text-white font-semibold text-sm tracking-wide">
                      {t(lang, 'خدماتنا', 'Our Services')}
                    </h2>
                  </div>
                  <nav className="py-2">
                    {categories.map(cat => {
                      const slug = cat.metadata?.categorySlug ?? cat.id;
                      const active = activeSlug === slug;
                      const Icon = ICON_MAP[cat.metadata?.icon ?? ''] ?? FileText;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveSlug(slug)}
                          className={`w-full flex items-center gap-3 px-5 py-3 text-sm text-start transition-all duration-200 border-s-2 ${
                            active
                              ? 'border-brand-gold bg-brand-gold/5 text-brand-navy font-semibold'
                              : 'border-transparent text-text-dark-secondary hover:bg-gray-50 hover:text-brand-gold hover:border-brand-gold/40'
                          }`}
                        >
                          <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-brand-gold' : 'text-gray-400'}`} />
                          <span className="leading-snug">{cat.title}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </aside>

              {/* ── RIGHT CONTENT — active category + its sub-services ── */}
              <div className="min-w-0">
                {activeCategory && (
                  <FadeIn key={activeSlug ?? ''}>
                    {/* Category heading */}
                    <div className="mb-8 pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        {(() => {
                          const Icon = ICON_MAP[activeCategory.metadata?.icon ?? ''] ?? FileText;
                          return <Icon className="w-6 h-6 text-brand-gold flex-shrink-0" />;
                        })()}
                        <h2 className="font-amiri text-2xl md:text-3xl text-brand-navy">
                          {activeCategory.title}
                        </h2>
                      </div>
                      <p className="text-text-secondary leading-relaxed max-w-2xl">
                        {activeCategory.body}
                      </p>
                    </div>

                    {/* Sub-services grid */}
                    {activeSubs.length === 0 ? (
                      <p className="text-text-muted text-sm">
                        {t(lang, 'لا توجد خدمات محددة بعد.', 'No sub-services defined yet.')}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeSubs.map((svc, i) => (
                          <Link
                            key={svc.id}
                            href={`/services/${svc.id}`}
                            className="group bg-white border border-gray-100 rounded-sm overflow-hidden hover:border-brand-gold/40 hover:shadow-md transition-all duration-300 flex flex-col"
                            style={{ transitionDelay: `${i * 40}ms` }}
                          >
                            {/* Cover image */}
                            {svc.metadata?.image ? (
                              <div className="relative h-44 overflow-hidden bg-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={svc.metadata.image}
                                  alt={svc.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/0 transition-colors duration-300" />
                              </div>
                            ) : (
                              /* Fallback: gold-accent placeholder */
                              <div className="h-2 bg-gradient-to-r from-brand-gold/60 to-brand-gold/20" />
                            )}

                            {/* Text content */}
                            <div className="p-6 flex flex-col gap-3 flex-1">
                              <h3 className="font-semibold text-brand-navy text-base group-hover:text-brand-gold transition-colors leading-snug">
                                {svc.title}
                              </h3>
                              <p className="text-text-secondary text-sm leading-relaxed flex-1 line-clamp-3">
                                {svc.body}
                              </p>
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold mt-1 group-hover:gap-2.5 transition-all">
                                {t(lang, 'اقرأ المزيد', 'Learn more')}
                                {lang === 'ar'
                                  ? <ArrowLeft className="w-3.5 h-3.5" />
                                  : <ArrowRight className="w-3.5 h-3.5" />}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </FadeIn>
                )}
              </div>

            </div>
          </div>
        </section>
      )}

      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
