'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { getClientLanguage, setLanguagePreference, type Language } from '@/lib/language';

// Root-relative anchors (/#section) so they always resolve to the homepage
// section, even when the user is on another page like an article or service.
const navItems = [
  { href: '/#services',   labelAr: 'الخدمات',    labelEn: 'Services' },
  { href: '/#markets',    labelAr: 'الأسواق',     labelEn: 'Markets' },
  { href: '/#why-us',     labelAr: 'لماذا نحن',   labelEn: 'Why Us' },
  { href: '/#insights',   labelAr: 'الأفكار',      labelEn: 'Insights' },
  { href: '/#contact',    labelAr: 'تواصل معنا',  labelEn: 'Contact' },
];

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [lang, setLang]             = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleLanguage() {
    const next: Language = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    setLanguagePreference(next);
    window.location.reload();
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-navy-dark/95 backdrop-blur-md border-b border-brand-gold/10 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-amiri text-brand-gold text-2xl font-bold">
            {t(lang, 'شريف يسري', 'Sherif Yousry')}
          </span>
          <span className="font-sans text-text-secondary font-light text-xs tracking-wider mt-0.5">
            {t(lang, 'للاستشارات', 'Advisory')}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-sm after:content-[''] after:absolute after:-bottom-1 after:right-0 after:w-0 after:h-px after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {t(lang, item.labelAr, item.labelEn)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="text-xs text-text-muted hover:text-brand-gold border border-white/10 hover:border-brand-gold px-3 py-1.5 rounded transition-all duration-300"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <Link href="/#contact" className="btn-primary !py-3 !px-5 !text-[11px]">
            {t(lang, 'احجز استشارة', 'Book Consultation')}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-brand-gold z-[1000]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-brand-navy-dark flex flex-col items-center justify-center gap-8 z-[999]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-text-secondary hover:text-brand-gold text-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t(lang, item.labelAr, item.labelEn)}
            </Link>
          ))}
          <div className="flex gap-3 mt-4">
            <button
              onClick={toggleLanguage}
              className="text-xs text-text-muted border border-white/10 px-3 py-2 rounded"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <Link href="/#contact" className="btn-primary !py-3 !px-5" onClick={() => setIsMenuOpen(false)}>
              {t(lang, 'احجز استشارة', 'Book Consultation')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
