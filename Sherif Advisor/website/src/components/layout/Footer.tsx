'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

const services = [
  { labelAr: 'الاستشارات الضريبية', labelEn: 'Tax Advisory', href: '/services/tax' },
  { labelAr: 'الاستشارات المالية', labelEn: 'Financial Advisory', href: '/services/finance' },
  { labelAr: 'المدير المالي بالتعاقد', labelEn: 'Fractional CFO', href: '/services/cfo' },
  { labelAr: 'المخاطر والحوكمة', labelEn: 'Risk & Governance', href: '/services/risk' },
  { labelAr: 'إدارة الأعمال', labelEn: 'Business Management', href: '/services/business' },
  { labelAr: 'التوسع الدولي', labelEn: 'International Expansion', href: '/services/international' },
];

const quickLinks = [
  { labelAr: 'من نحن', labelEn: 'About', href: '/about' },
  { labelAr: 'مركز المعرفة', labelEn: 'Knowledge', href: '/knowledge' },
  { labelAr: 'بوابة العملاء', labelEn: 'Client Portal', href: '/portal' },
  { labelAr: 'سياسة الخصوصية', labelEn: 'Privacy Policy', href: '/privacy' },
  { labelAr: 'الشروط والأحكام', labelEn: 'Terms & Conditions', href: '/terms' },
];

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function Footer() {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  return (
    <footer className="bg-brand-navy-deep border-t border-white/5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7 text-brand-gold" />
              <span className="font-cormorant text-xl text-text-primary">
                Sherif Yousry Advisory
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t(
                lang,
                'استشارات متكاملة للشركات التي تخطّط لما هو قادم. الضرائب والتمويل والمخاطر وإدارة الأعمال.',
                'Integrated advisory for companies planning for what comes next. Tax, finance, risk, and business management.'
              )}
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>{t(lang, 'مصر · السعودية · الإمارات', 'Egypt · Saudi Arabia · UAE')}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Mail className="w-4 h-4 text-brand-gold" />
                <span>info@sherifadvisory.com</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Phone className="w-4 h-4 text-brand-gold" />
                <span dir="ltr">+20 xxx xxx xxxx</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-brand-gold mb-5 uppercase">
              {t(lang, 'خدماتنا', 'Services')}
            </h3>
            <ul className="flex flex-col gap-3">
              {services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-brand-gold transition-colors"
                  >
                    {t(lang, item.labelAr, item.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-brand-gold mb-5 uppercase">
              {t(lang, 'روابط سريعة', 'Quick Links')}
            </h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-brand-gold transition-colors"
                  >
                    {t(lang, item.labelAr, item.labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Security Badge */}
          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-brand-gold mb-5 uppercase">
              {t(lang, 'ابق على اطلاع', 'Stay Informed')}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {t(
                lang,
                'اشترك في نشرتنا لتلقي آخر التحديثات الضريبية والتنظيمية.',
                'Subscribe to our newsletter for the latest tax and regulatory updates.'
              )}
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t(lang, 'بريدك الإلكتروني', 'Your email')}
                className="flex-1 bg-brand-navy/50 border border-white/10 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted rounded focus:outline-none focus:border-brand-gold transition-colors"
              />
              <button type="submit" className="bg-brand-gold text-brand-navy px-4 py-2.5 text-xs font-medium tracking-wider rounded hover:bg-brand-gold-light transition-colors">
                {t(lang, 'اشتراك', 'Subscribe')}
              </button>
            </form>
            <div className="mt-6 flex items-center gap-2 text-xs text-text-muted">
              <Shield className="w-4 h-4 text-green-400" />
              <span>
                {t(
                  lang,
                  'بياناتك مشفرة ومحمية بأعلى معايير الأمان',
                  'Your data is encrypted and protected to the highest security standards'
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Sherif Yousry Advisory.{' '}
            {t(lang, 'جميع الحقوق محفوظة.', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-6 text-xs text-text-muted">
            <span>ISO 27001 Compliant</span>
            <span>•</span>
            <span>SOC 2 Ready</span>
            <span>•</span>
            <span>GDPR Aware</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
