'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhyUs } from '@/components/sections/WhyUs';
import { Shield, Award, Users, Target } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

interface SectionContent {
  id: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
}

export default function AboutPage() {
  const [heroContent, setHeroContent] = useState<SectionContent | null>(null);
  const [valuesContent, setValuesContent] = useState<SectionContent | null>(null);
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  useEffect(() => {
    // Fetch about page sections from CMS
    async function fetchSections() {
      try {
        const [heroRes, valuesRes] = await Promise.all([
          fetch(`/api/content/sections/about/hero?lang=${lang}`),
          fetch(`/api/content/sections/about/values?lang=${lang}`),
        ]);

        if (heroRes.ok) {
          const data = await heroRes.json();
          setHeroContent(data);
        }
        if (valuesRes.ok) {
          const data = await valuesRes.json();
          setValuesContent(data);
        }
      } catch {
        // Use static fallback
      }
    }
    fetchSections();
  }, [lang]);

  // Static fallback values
  const defaultValues = [
    {
      icon: Shield,
      title: lang === 'ar' ? 'النزاهة' : 'Integrity',
      desc: lang === 'ar'
        ? 'نلتزم بأعلى المعايير المهنية والأخلاقية في كل مشاركة.'
        : 'We adhere to the highest professional and ethical standards in every engagement.',
    },
    {
      icon: Award,
      title: lang === 'ar' ? 'التميّز' : 'Excellence',
      desc: lang === 'ar'
        ? 'نسعى للجودة في كل مخرج ونتائج قابلة للقياس.'
        : 'We strive for quality in every output and measurable results.',
    },
    {
      icon: Users,
      title: lang === 'ar' ? 'الشراكة' : 'Partnership',
      desc: lang === 'ar'
        ? 'نبني علاقات طويلة الأمد قائمة على الثقة والشفافية.'
        : 'We build long-term relationships based on trust and transparency.',
    },
    {
      icon: Target,
      title: lang === 'ar' ? 'الابتكار' : 'Innovation',
      desc: lang === 'ar'
        ? 'نوظّف التقنية لتقديم حلول أسرع وأكثر دقة.'
        : 'We leverage technology to deliver faster and more accurate solutions.',
    },
  ];

  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="bg-brand-navy py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="section-label mb-4 block">
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </span>
            <h1 className="font-amiri text-4xl md:text-5xl text-text-primary leading-relaxed mb-6">
              {heroContent?.title || (lang === 'ar'
                ? 'شريك استشاري يقودك نحو الثقة في القرار.'
                : 'An advisory partner guiding you toward confident decisions.')}
            </h1>
            <div
              className="text-text-secondary text-lg leading-8"
              dangerouslySetInnerHTML={{
                __html: heroContent?.body || (lang === 'ar'
                  ? 'شريف يسري للاستشارات هي شركة استشارية متخصصة تقدم خدمات الضرائب والتمويل وإدارة المخاطر والأعمال للشركات المتوسطة والكبيرة في مصر ومنطقة الشرق الأوسط وشمال أفريقيا.'
                  : 'Sherif Yousry Advisory is a specialized advisory firm providing tax, finance, risk management, and business services to medium and large enterprises in Egypt and the MENA region.'),
              }}
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface-light py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="section-title-dark mb-12">
            {valuesContent?.title || (lang === 'ar' ? 'قيمنا' : 'Our Values')}
          </h2>
          {valuesContent?.body ? (
            <div
              className="prose prose-lg max-w-none text-text-dark-secondary"
              dangerouslySetInnerHTML={{ __html: valuesContent.body }}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {defaultValues.map((value, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-lg flex flex-col gap-4"
                >
                  <value.icon className="w-8 h-8 text-brand-gold" />
                  <h3 className="font-cormorant text-xl text-text-dark">
                    {value.title}
                  </h3>
                  <p className="text-sm text-text-dark-secondary leading-6">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <WhyUs />
      <Footer />
    </main>
  );
}
