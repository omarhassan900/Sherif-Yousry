'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { getClientLanguage, setLanguagePreference, type Language } from '@/lib/language';

const navItems = [
  { href: '/about',       labelAr: 'من نحن',    labelEn: 'About US' },
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
          ? 'bg-brand-navy-dark/95 backdrop-blur-md border-b border-brand-gold/10 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* ✅ LOGO - INCREASED SIZE */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image 
            src="/images/logo.png"
            alt="Sherif Yousry Advisory Logo"
            width={70}  // 👈 Increased from 160
            height={32}  // 👈 Increased from 40
            priority
            className="h-20 w-auto object-contain transition-opacity group-hover:opacity-90" // 👈 Increased from h-10 to h-12
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link relative text-sm text-text-primary hover:text-brand-gold transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:start-0 after:w-0 after:h-px after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full"
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