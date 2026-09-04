'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClientLanguage, type Language } from '@/lib/language';

const services = [
  // These slugs aren't real routes; link to the services listing which lists
  // the real CMS services (each linking to its own detail page).
  { labelAr: 'الاستشارات الضريبية',   labelEn: 'Tax Advisory',            href: '/services' },
  { labelAr: 'الاستشارات المالية',     labelEn: 'Financial Advisory',      href: '/services' },
  { labelAr: 'المدير المالي بالتعاقد', labelEn: 'Fractional CFO',          href: '/services' },
  { labelAr: 'المخاطر والحوكمة',       labelEn: 'Risk & Governance',       href: '/services' },
  { labelAr: 'التوسع الدولي',          labelEn: 'International Expansion',  href: '/services' },
];

const quickLinks = [
  { labelAr: 'من نحن',           labelEn: 'About',           href: '/about' },
  { labelAr: 'الأفكار والرؤى',   labelEn: 'Insights',        href: '/knowledge' },
  { labelAr: 'بوابة العملاء',    labelEn: 'Client Portal',   href: '/portal' },
  { labelAr: 'سياسة الخصوصية',  labelEn: 'Privacy Policy',  href: '/privacy' },
  { labelAr: 'الشروط والأحكام', labelEn: 'Terms',            href: '/terms' },
];

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function Footer() {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => { setLang(getClientLanguage()); }, []);

  return (
    <footer className="bg-[#03060A] border-t border-white/5 pt-20 pb-8" id="contact" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="font-amiri text-brand-gold text-2xl font-bold block mb-4">
              {t(lang, 'شريف يسري', 'Sherif Yousry')}{' '}
              <span className="font-sans font-light text-text-secondary text-sm">
                {t(lang, 'للاستشارات', 'Advisory')}
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-7 mb-5">
              {t(lang,
                'استشارات متكاملة للشركات التي تخطّط لما هو قادم. الضرائب والتمويل والمخاطر وإدارة الأعمال.',
                'Integrated advisory for companies planning for what comes next. Tax, finance, risk and business management.',
              )}
            </p>
            <div className="flex gap-2 flex-wrap">
              {['ISO 27001', 'SOC 2 Ready', 'GDPR Aware'].map((b) => (
                <span
                  key={b}
                  className="font-mono text-[11px] text-text-muted border border-white/10 px-2 py-1 rounded hover:border-brand-gold hover:text-brand-gold hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h5 className="font-mono text-brand-gold text-xs tracking-[0.1em] uppercase mb-5 relative after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-10 after:h-[2px] after:bg-brand-gold">
              {t(lang, 'خدماتنا', 'Services')}
            </h5>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-text-secondary text-sm hover:text-brand-gold hover:pr-3 rtl:hover:pr-3 ltr:hover:pl-3 transition-all duration-300"
                  >
                    {t(lang, s.labelAr, s.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-mono text-brand-gold text-xs tracking-[0.1em] uppercase mb-5 relative after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-10 after:h-[2px] after:bg-brand-gold">
              {t(lang, 'روابط سريعة', 'Quick Links')}
            </h5>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((q) => (
                <li key={q.href}>
                  <Link
                    href={q.href}
                    className="text-text-secondary text-sm hover:text-brand-gold hover:pr-3 rtl:hover:pr-3 ltr:hover:pl-3 transition-all duration-300"
                  >
                    {t(lang, q.labelAr, q.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="font-mono text-brand-gold text-xs tracking-[0.1em] uppercase mb-5 relative after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-10 after:h-[2px] after:bg-brand-gold">
              {t(lang, 'ابق على اطلاع', 'Stay Informed')}
            </h5>
            <p className="text-text-muted text-sm mb-4">
              {t(lang,
                'اشترك في نشرتنا لتلقي آخر التحديثات الضريبية والتنظيمية.',
                'Subscribe for the latest tax and regulatory updates.',
              )}
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => { e.preventDefault(); }}
            >
              <input
                type="email"
                required
                placeholder={t(lang, 'بريدك الإلكتروني', 'Your email')}
                className="flex-1 bg-white/5 border border-white/10 text-text-primary placeholder:text-text-muted text-sm px-4 py-2.5 outline-none focus:border-brand-gold focus:shadow-[0_0_20px_rgba(201,169,97,0.15)] transition-all duration-300"
              />
              <button
                type="submit"
                className="bg-brand-gold text-brand-navy font-bold px-4 py-2.5 hover:bg-brand-gold-light hover:-translate-y-0.5 transition-all duration-300"
              >
                ←
              </button>
            </form>
            <p className="font-mono text-text-muted text-[11px] mt-2">
              {t(lang, 'بياناتك مشفرة ومحمية بأعلى معايير الأمان.', 'Your data is encrypted and protected.')}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} {t(lang, 'شريف يسري للاستشارات. جميع الحقوق محفوظة.', 'Sherif Yousry Advisory. All rights reserved.')}</p>
          <p>{t(lang, 'القاهرة · الرياض · دبي | info@sherifadvisory.com', 'Cairo · Riyadh · Dubai | info@sherifadvisory.com')}</p>
        </div>
      </div>
    </footer>
  );
}
