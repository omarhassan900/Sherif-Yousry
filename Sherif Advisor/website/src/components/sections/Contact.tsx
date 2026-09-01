'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import InquiryForm from '@/components/forms/InquiryForm';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function Contact() {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  return (
    <section
      className="bg-brand-navy py-20 lg:py-24"
      id="contact"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16">
          {/* Info Side */}
          <div className="flex flex-col gap-8">
            <div>
              <span className="section-label mb-3 block">
                {t(lang, 'تواصل معنا', 'Contact Us')}
              </span>
              <h2 className="font-amiri text-3xl leading-relaxed text-text-primary">
                {t(
                  lang,
                  'نحن هنا لمساعدتك في التخطيط لما هو قادم.',
                  'We are here to help you plan for what comes next.'
                )}
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">
                    {t(lang, 'اتصل بنا', 'Call us')}
                  </p>
                  <p className="text-sm text-text-primary" dir="ltr">
                    +20 xxx xxx xxxx
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">
                    {t(lang, 'البريد الإلكتروني', 'Email')}
                  </p>
                  <p className="text-sm text-text-primary">
                    info@sherifadvisory.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">
                    {t(lang, 'المقر الرئيسي', 'Headquarters')}
                  </p>
                  <p className="text-sm text-text-primary">
                    {t(lang, 'القاهرة، مصر', 'Cairo, Egypt')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shared inquiry form */}
          <InquiryForm
            lang={lang}
            source="contact"
            title={t(lang, 'لنبدأ العمل', "Let's get you started")}
          />
        </div>
      </div>
    </section>
  );
}
