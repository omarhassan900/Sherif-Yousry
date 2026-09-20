'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, TrendingUp, Shield, Users, Briefcase, Globe, PieChart } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { CTABanner } from '@/components/sections/CTABanner';
import { Contact } from '@/components/sections/Contact';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const services = [
  {
    id: 1,
    titleAr: 'الاستشارات الضريبية',
    titleEn: 'Tax Advisory',
    subtitleAr: 'حلول ضريبية استراتيجية',
    subtitleEn: 'Strategic Tax Solutions',
    descriptionAr: 'تنقل عبر اللوائح الضريبية المعقدة بثقة. يقدم فريقنا الخبير خدمات تخطيط ضريبي شاملة ومتوافقة مصممة خصيصاً لاحتياجات عملك.',
    descriptionEn: 'Navigate complex tax regulations with confidence. Our expert team provides comprehensive tax planning and compliance services tailored to your business needs.',
    icon: PieChart,
    featuresAr: ['تخطيط ضريبة الشركات', 'الامتثال الضريبي والإيداع', 'الهيكلة الضريبية الدولية', 'تسجيل واستشارات ضريبة القيمة المضافة', 'تسوية المنازعات الضريبية'],
    featuresEn: ['Corporate Tax Planning', 'Tax Compliance & Filing', 'International Tax Structuring', 'VAT Registration & Consulting', 'Tax Dispute Resolution'],
    image: '/images/services/tax-advisory.jpeg'
  },
  {
    id: 2,
    titleAr: 'الخدمات القانونية',
    titleEn: 'Legal Services',
    subtitleAr: 'استشارات قانونية خبيرة',
    subtitleEn: 'Expert Legal Counsel',
    descriptionAr: 'احمِ مصالح عملك من خلال خدماتنا القانونية الشاملة. من حوكمة الشركات إلى مفاوضات العقود، نقدم دعماً قانونياً استراتيجياً.',
    descriptionEn: 'Protect your business interests with our comprehensive legal services. From corporate governance to contract negotiations, we provide strategic legal support.',
    icon: Shield,
    featuresAr: ['قانون الشركات والحوكمة', 'صياغة ومراجعة العقود', 'الامتثال التنظيمي', 'قانون العمل', 'دعم التقاضي التجاري'],
    featuresEn: ['Corporate Law & Governance', 'Contract Drafting & Review', 'Regulatory Compliance', 'Employment Law', 'Commercial Litigation Support'],
    image: '/images/services/legal.jpeg'
  },
  {
    id: 3,
    titleAr: 'استشارات الأعمال',
    titleEn: 'Business Advisory',
    subtitleAr: 'نمو استراتيجي للأعمال',
    subtitleEn: 'Strategic Business Growth',
    descriptionAr: 'حوّل استراتيجية عملك من خلال رؤى مدعومة بالبيانات. نساعدك في تحديد الفرص، وتحسين العمليات، وتحقيق نمو مستدام.',
    descriptionEn: 'Transform your business strategy with data-driven insights. We help you identify opportunities, optimize operations, and achieve sustainable growth.',
    icon: TrendingUp,
    featuresAr: ['تطوير استراتيجية الأعمال', 'استشارات دخول السوق', 'التخطيط والتحليل المالي', 'إدارة المخاطر', 'تحسين الأداء'],
    featuresEn: ['Business Strategy Development', 'Market Entry Consulting', 'Financial Planning & Analysis', 'Risk Management', 'Performance Optimization'],
    image: '/images/services/business-advisory.jpeg'
  },
  {
    id: 4,
    titleAr: 'تمويل الشركات',
    titleEn: 'Corporate Finance',
    subtitleAr: 'حلول رأس المال والاستثمار',
    subtitleEn: 'Capital & Investment Solutions',
    descriptionAr: 'حقق أقصى إمكاناتك المالية من خلال خبرتنا في تمويل الشركات. من جمع الأموال إلى استشارات الاندماج والاستحواذ.',
    descriptionEn: 'Maximize your financial potential with our corporate finance expertise. From fundraising to M&A advisory, we guide you through complex financial decisions.',
    icon: Briefcase,
    featuresAr: ['عمليات الاندماج والاستحواذ', 'جمع رأس المال', 'العناية الواجبة المالية', 'خدمات التقييم', 'الاستشارات الاستثمارية'],
    featuresEn: ['Mergers & Acquisitions', 'Capital Raising', 'Financial Due Diligence', 'Valuation Services', 'Investment Advisory'],
    image: '/images/services/corporate-finance.jpeg'
  },
  {
    id: 5,
    titleAr: 'الأعمال الدولية',
    titleEn: 'International Business',
    subtitleAr: 'دعم التوسع العالمي',
    subtitleEn: 'Global Expansion Support',
    descriptionAr: 'وسع نطاق وصولك عبر الحدود بثقة. تساعدك خدمات الأعمال الدولية لدينا على التنقل في الأسواق العالمية.',
    descriptionEn: 'Expand your reach across borders with confidence. Our international business services help you navigate global markets and cross-border transactions.',
    icon: Globe,
    featuresAr: ['استراتيجية دخول السوق', 'المعاملات عبر الحدود', 'الامتثال الدولي', 'استشارات الاستثمار الأجنبي', 'التخطيط الضريبي العالمي'],
    featuresEn: ['Market Entry Strategy', 'Cross-Border Transactions', 'International Compliance', 'Foreign Investment Advisory', 'Global Tax Planning'],
    image: '/images/services/international.jpg'
  },
  {
    id: 6,
    titleAr: 'حلول الموارد البشرية',
    titleEn: 'HR & Workforce Solutions',
    subtitleAr: 'تميز رأس المال البشري',
    subtitleEn: 'Human Capital Excellence',
    descriptionAr: 'ابنِ قوة عمل عالية الأداء من خلال خدمات استشارات الموارد البشرية لدينا. من اكتساب المواهب إلى التطوير التنظيمي.',
    descriptionEn: 'Build a high-performing workforce with our HR consulting services. From talent acquisition to organizational development, we optimize your human capital.',
    icon: Users,
    featuresAr: ['استراتيجية اكتساب المواهب', 'التعويضات والمزايا', 'التطوير التنظيمي', 'امتثال الموارد البشرية', 'التدريب والتطوير'],
    featuresEn: ['Talent Acquisition Strategy', 'Compensation & Benefits', 'Organizational Development', 'HR Compliance', 'Training & Development'],
    image: '/images/services/hr.jpeg'
  }
];

export default function ServicesPage() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

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
              href="/contact"
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
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group relative rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col h-64"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={lang === 'ar' ? service.titleAr : service.titleEn}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Navy Overlay Content - Matches INSIGHTS style */}
                <div className="rounded-lg absolute inset-x-0 bottom-0 z-10 bg-brand-navy/95 p-4 flex flex-col gap-2">
                  <service.icon className="w-8 h-8 text-brand-gold mb-1" />
                  <span className="text-[10px] font-bold tracking-wider text-brand-gold uppercase block">
                    {lang === 'ar' ? service.subtitleAr : service.subtitleEn}
                  </span>
                  <h3 className="text-[15px] leading-snug font-semibold text-white line-clamp-2">
                    {lang === 'ar' ? service.titleAr : service.titleEn}
                  </h3>

                  {/* Hidden description that appears on hover */}
                  <p className="text-[12px] leading-relaxed text-gray-300 line-clamp-3 max-h-0 opacity-0 overflow-hidden transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                    {lang === 'ar' ? service.descriptionAr : service.descriptionEn}
                  </p>

                  <span className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-wider text-white uppercase">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white/40 transition-all duration-300 group-hover:border-brand-gold group-hover:bg-brand-gold/15">
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 transition-colors group-hover:text-brand-gold" />
                    </span>
                    {t(lang, 'اعرف المزيد', 'Learn More')}
                  </span>
                </div>
              </Link>
            ))}
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