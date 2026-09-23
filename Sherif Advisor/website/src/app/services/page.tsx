'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import Image from 'next/image';
import { 
  ArrowRight, CheckCircle, TrendingUp, Shield, Users, Briefcase, Globe, PieChart,
  Building2, Scale, ShieldCheck, FileText, Award, Calculator
=======
import {
  ArrowRight, ArrowLeft, Briefcase, Building2, Scale, ShieldCheck,
  FileText, TrendingUp, Users, Globe, Award, Calculator, BarChart2, ChevronDown,
>>>>>>> a1aeb90 (UI & portal)
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { CTABanner } from '@/components/sections/CTABanner';
import { Contact } from '@/components/sections/Contact';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

<<<<<<< HEAD
// Map icon names from the database to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  Building2,
  Scale,
  ShieldCheck,
  FileText,
  TrendingUp,
  Users,
  Globe,
  Award,
  PieChart,
  Shield,
  Calculator,
};

interface ApiService {
  id: string;
  title: string;
  body: string;
  metadata?: {
    image?: string;
    icon?: string;
  };
}
=======
// ── Icon map (matches metadata.icon values set in seed) ───────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase, Building2, Scale, ShieldCheck, FileText,
  TrendingUp, Users, Globe, Award, Calculator, BarChart2,
};
>>>>>>> a1aeb90 (UI & portal)

// ── Types ─────────────────────────────────────────────────────────────────────
interface ServiceItem {
  id: string;
  title: string;
  body: string;
  metadata: {
    serviceType?: string;
    categorySlug?: string;
    displayOrder?: number;
    icon?: string;
    shortDescriptionEn?: string;
    shortDescriptionAr?: string;
    image?: string;
  };
}

// ── Fade-in helper ────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ServicesPage() {
<<<<<<< HEAD
  const [lang, setLang] = useState<Language>('en');
  const [services, setServices] = useState<ApiService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
=======
  const [lang, setLang]           = useState<Language>('en');
  const [items, setItems]         = useState<ServiceItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => { setLang(getClientLanguage()); }, []);
>>>>>>> a1aeb90 (UI & portal)

  useEffect(() => {
    fetch(`/api/content/services?lang=${lang}`)
      .then(r => r.ok ? r.json() : { items: [] })
      .then(d => { setItems(d.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [lang]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const categories = items
    .filter(i => i.metadata?.serviceType === 'category')
    .sort((a, b) => (a.metadata?.displayOrder ?? 99) - (b.metadata?.displayOrder ?? 99));

  const subServicesByCategory = (slug: string) =>
    items
      .filter(i => i.metadata?.serviceType !== 'category' && i.metadata?.categorySlug === slug)
      .sort((a, b) => (a.metadata?.displayOrder ?? 99) - (b.metadata?.displayOrder ?? 99));

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Auto-open first category once data loads
  useEffect(() => {
    if (!activeCategory && categories.length > 0) setActiveCategory(categories[0].metadata?.categorySlug ?? null);
  }, [categories, activeCategory]);

  // Fetch services from the API
  useEffect(() => {
    async function fetchServices() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/content/services?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          setServices(data.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, [lang]);

  return (
    <main dir={dir} className="min-h-screen bg-white">
      <ScrollProgress />
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="section-label mb-4 block">{t(lang, 'خدماتنا', 'OUR SERVICES')}</span>
          <h1 className="font-amiri text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight mb-6 max-w-2xl">
            {t(lang, 'خدمات', 'Services')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
            {t(lang,
              'خدمات ضريبية ومحاسبية واستشارية ومؤسسية للشركات في مصر وللمستثمرين الأجانب الراغبين في دخول السوق المصري.',
              'Tax, audit, advisory and corporate services for companies in Egypt and for foreign investors entering the Egyptian market, delivered through one engagement lead from set-up to year-end.'
            )}
          </p>
<<<<<<< HEAD
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="border cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase"
            >
              <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-white transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
              <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#030a12] flex-shrink-0">
                <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
              <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-[#030a12]">
                {t(lang, 'احجز استشارة', 'Schedule a Consultation')}
              </span>
            </Link>
            <Link
              href="/about"
              className="border cta group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase"
            >
              <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-gold transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
              <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-gold text-white flex-shrink-0">
                <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
              <span className="relative z-10 text-white transition-colors duration-300 group-hover:text-white">
                {t(lang, 'تعرف علينا', 'Learn More About Us')}
              </span>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5"
               style={{ animation: 'heroFadeRight 0.8s ease 0.2s both' }}>
              {t(lang, 'خبرتنا', 'Our Expertise')}
            </p>
            <h2 className="font-serif text-brand-navy"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  animation: 'heroFadeUp 0.8s ease 0.4s both',
                }}>
              {t(lang, 'الخدمات التي نقدمها', 'Services We Provide')}
            </h2>
            <p className="text-gray-700 text-base leading-relaxed mb-5"
               style={{ animation: 'heroFadeUp 0.8s ease 0.6s both' }}>
              {t(
                lang,
                'من التخطيط الضريبي إلى استراتيجية الشركات، نقدم حلولاً شاملة مصممة لتلبية احتياجات عملك في كل مرحلة من مراحل النمو.',
                'From tax planning to corporate strategy, we offer comprehensive solutions designed to meet your business needs at every stage of growth.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] h-64 bg-gray-100 animate-pulse" />
              ))
            ) : services.length > 0 ? (
              services.map((service, index) => {
                const IconComponent = service.metadata?.icon && ICON_MAP[service.metadata.icon] 
                  ? ICON_MAP[service.metadata.icon] 
                  : Briefcase; // Fallback icon

                // Strip HTML tags from body for the hover preview
                const plainTextBody = service.body ? service.body.replace(/<[^>]*>/g, '').trim() : '';

                return (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    className="group relative rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col h-64"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      {service.metadata?.image ? (
                        <Image
                          src={service.metadata.image}
                          alt={service.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          <IconComponent className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Navy Overlay Content - Matches INSIGHTS style */}
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-brand-navy/95 p-4 flex flex-col gap-2">
                      <IconComponent className="w-8 h-8 text-brand-gold mb-1" />
                      <h3 className="text-[15px] leading-snug font-semibold text-white line-clamp-2">
                        {service.title}
                      </h3>

                      {/* Hidden description that appears on hover */}
                      {plainTextBody && (
                        <p className="text-[12px] leading-relaxed text-gray-300 line-clamp-3 max-h-0 opacity-0 overflow-hidden transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                          {plainTextBody}
                        </p>
                      )}

                      <span className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-wider text-white uppercase">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white/40 transition-all duration-300 group-hover:border-brand-gold group-hover:bg-brand-gold/15">
                          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 transition-colors group-hover:text-brand-gold" />
                        </span>
                        {t(lang, 'اعرف المزيد', 'Learn More')}
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                {t(lang, 'لا توجد خدمات متاحة حالياً.', 'No services available at the moment.')}
              </div>
            )}
          </div>
=======
>>>>>>> a1aeb90 (UI & portal)
        </div>
      </section>

      {/* ── CATEGORIES GRID ───────────────────────────────────────────────── */}
      {loading ? (
        <section className="py-24 bg-surface-light">
          <div className="max-w-7xl mx-auto px-6 text-center text-text-muted">
            {t(lang, 'جاري التحميل...', 'Loading services...')}
          </div>
        </section>
      ) : (
        <>
          {/* Category tabs */}
          <section className="bg-surface-light border-b border-gray-200 sticky top-[72px] z-30">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex gap-0 overflow-x-auto scrollbar-hide">
                {categories.map(cat => {
                  const slug = cat.metadata?.categorySlug ?? cat.id;
                  const active = activeCategory === slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(slug)}
                      className={`flex-shrink-0 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        active
                          ? 'border-brand-gold text-brand-navy'
                          : 'border-transparent text-text-secondary hover:text-brand-navy'
                      }`}
                    >
                      {cat.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Active category content */}
          {categories.map(cat => {
            const slug = cat.metadata?.categorySlug ?? cat.id;
            if (activeCategory !== slug) return null;
            const subs = subServicesByCategory(slug);
            const Icon = ICON_MAP[cat.metadata?.icon ?? ''] ?? FileText;
            return (
              <section key={cat.id} className="py-16 lg:py-20 bg-surface-light">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                  <FadeIn>
                    {/* Category header */}
                    <div className="flex items-start gap-6 mb-12">
                      <div className="w-14 h-14 rounded-xl bg-brand-navy flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-brand-gold" />
                      </div>
                      <div>
                        <h2 className="font-amiri text-3xl md:text-4xl text-brand-navy mb-3">{cat.title}</h2>
                        <p className="text-text-secondary max-w-2xl leading-relaxed">{cat.body}</p>
                      </div>
                    </div>
                  </FadeIn>

                  {/* Sub-services grid */}
                  {subs.length === 0 ? (
                    <p className="text-text-muted text-sm">{t(lang, 'لا توجد خدمات محددة بعد.', 'No sub-services defined yet.')}</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {subs.map((svc, i) => (
                        <FadeIn key={svc.id} delay={i * 60}>
                          <Link
                            href={`/services/${svc.id}`}
                            className="group bg-white border border-gray-100 rounded-xl p-6 flex flex-col gap-3 hover:border-brand-gold/30 hover:shadow-lg transition-all duration-300"
                          >
                            <h3 className="font-semibold text-brand-navy text-lg group-hover:text-brand-gold transition-colors leading-snug">
                              {svc.title}
                            </h3>
                            <p className="text-text-secondary text-sm leading-relaxed flex-1 line-clamp-3">
                              {svc.body}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold mt-1">
                              {t(lang, 'اقرأ المزيد', 'Learn more')}
                              {lang === 'ar'
                                ? <ArrowLeft className="w-3.5 h-3.5" />
                                : <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}
                            </span>
                          </Link>
                        </FadeIn>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })}

          {/* All-categories overview (below the detail) */}
          <section className="py-16 lg:py-20 bg-brand-navy">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <FadeIn>
                <h2 className="font-amiri text-3xl text-white mb-3">{t(lang, 'جميع الخدمات', 'All Service Lines')}</h2>
                <p className="text-text-secondary mb-10 max-w-xl">
                  {t(lang, 'اضغط على أي خدمة للاطلاع على التفاصيل الكاملة.', 'Click any service line to see the full scope.')}
                </p>
              </FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((cat, ci) => {
                  const slug = cat.metadata?.categorySlug ?? cat.id;
                  const subs = subServicesByCategory(slug);
                  const Icon = ICON_MAP[cat.metadata?.icon ?? ''] ?? FileText;
                  return (
                    <FadeIn key={cat.id} delay={ci * 60}>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-brand-gold/30 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <Icon className="w-5 h-5 text-brand-gold flex-shrink-0" />
                          <h3 className="text-white font-semibold text-sm leading-snug">{cat.title}</h3>
                        </div>
                        <ul className="space-y-1.5">
                          {subs.map(svc => (
                            <li key={svc.id}>
                              <Link href={`/services/${svc.id}`}
                                className="text-text-secondary hover:text-brand-gold text-xs leading-relaxed transition-colors block">
                                {svc.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => { setActiveCategory(slug); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="mt-4 text-xs font-semibold text-brand-gold hover:underline flex items-center gap-1"
                        >
                          {t(lang, 'عرض الكل', 'View all')}
                          {lang === 'ar' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                        </button>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      <CTABanner />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
