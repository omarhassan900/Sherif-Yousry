'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getClientLanguage, getDirection, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export default function PrivacyPage() {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  return (
    <main dir={getDirection(lang)}>
      <Header />
      <section className="bg-brand-navy py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="font-amiri text-3xl md:text-4xl text-text-primary leading-relaxed">
            {t(lang, 'سياسة الخصوصية', 'Privacy Policy')}
          </h1>
        </div>
      </section>
      <section className="bg-surface-light py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-text-dark-secondary leading-8 space-y-4">
          <p>
            {t(
              lang,
              'نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. تُستخدم المعلومات التي تقدمها للرد على استفساراتك فقط. سيتم تحديث هذه الصفحة بالتفاصيل الكاملة قريباً.',
              'We respect your privacy and are committed to protecting your personal data. The information you provide is used solely to respond to your inquiries. This page will be updated with full details soon.'
            )}
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
