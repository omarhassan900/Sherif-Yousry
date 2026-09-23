'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, CheckCircle, TrendingUp, Shield, Users, Briefcase, Globe, PieChart,
  Building2, Scale, ShieldCheck, FileText, Award, Calculator
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { CTABanner } from '@/components/sections/CTABanner';
import { Contact } from '@/components/sections/Contact';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

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

export default function ServicesPage() {
  const [lang, setLang] = useState<Language>('en');
  const [services, setServices] = useState<ApiService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

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
    <main className="min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <ScrollProgress />
      <Header />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-3.jpeg"
            alt="Services Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1929]/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="font-mono text-sm tracking-[0.3em] text-brand-gold mb-5"
             style={{ animation: 'heroFadeRight 0.8s ease 0.2s both' }}>
            {t(lang, 'ما نقدمه', 'What We Offer')}
          </p>
          <h1 className="font-serif text-white leading-[1.05] max-w-2xl mx-auto mb-5"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                animation: 'heroFadeUp 0.8s ease 0.4s both',
                textShadow: '0 4px 24px rgba(0,0,0,0.6)',
              }}>
            {t(lang, 'استشارات شاملة', 'Comprehensive Advisory')}<br />
            <span className="italic">{t(lang, 'خدمات', 'Services')}</span>
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed mb-5"
             style={{ animation: 'heroFadeUp 0.8s ease 0.6s both', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {t(
              lang,
              'نمكن الشركات من خلال الحلول الاستراتيجية التي تدفع النمو، وتضمن الامتثال، وتخلق قيمة مستدامة.',
              'Empowering businesses with strategic solutions that drive growth, ensure compliance, and create lasting value.'
            )}
          </p>
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
        </div>
      </section>

      <CTABanner />
      <Contact />
      <Footer />
      <WhatsAppFloat />

      <style jsx>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </main>
  );
}