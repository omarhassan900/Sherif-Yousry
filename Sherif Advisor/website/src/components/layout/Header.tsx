'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Shield } from 'lucide-react';
import { getClientLanguage, setLanguagePreference, type Language } from '@/lib/language';

const navLinks = [
  { href: '/', label: 'الرئيسية', labelEn: 'Home' },
  { href: '/services', label: 'خدماتنا', labelEn: 'Services' },
  { href: '/about', label: 'من نحن', labelEn: 'About' },
  { href: '/knowledge', label: 'مركز المعرفة', labelEn: 'Knowledge' },
  { href: '/contact', label: 'تواصل معنا', labelEn: 'Contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  function toggleLanguage() {
    const newLang: Language = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    setLanguagePreference(newLang);
    // Reload to re-render content in new language
    window.location.reload();
  }

  return (
    <header className="sticky top-0 z-50 bg-brand-navy-deep/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-brand-gold" />
            <div>
              <div className="font-cormorant text-xl text-text-primary tracking-wide">
                Sherif Yousry
              </div>
              <div className="font-mono text-[9px] tracking-[0.2em] text-text-muted uppercase">
                Advisory
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {lang === 'ar' ? link.label : link.labelEn}
              </Link>
            ))}
          </nav>

          {/* CTA + Language + Portal */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/portal"
              className="text-xs tracking-wider text-text-muted hover:text-brand-gold transition-colors border border-white/20 px-4 py-2 rounded"
            >
              {lang === 'ar' ? 'بوابة العملاء' : 'Client Portal'}
            </Link>
            <button
              onClick={toggleLanguage}
              className="text-xs tracking-wider text-text-muted hover:text-text-primary transition-colors border border-white/10 px-3 py-1.5 rounded"
              aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <Link href="/contact" className="btn-primary text-[11px] px-5 py-3">
              {lang === 'ar' ? 'احجز استشارة' : 'Book Consultation'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-white/10 animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {lang === 'ar' ? link.label : link.labelEn}
                </Link>
              ))}
              <hr className="border-white/10 my-2" />
              <div className="flex items-center justify-between">
                <Link href="/portal" className="nav-link py-2">
                  {lang === 'ar' ? 'بوابة العملاء' : 'Client Portal'}
                </Link>
                <button
                  onClick={toggleLanguage}
                  className="text-xs text-text-muted hover:text-text-primary border border-white/10 px-3 py-1.5 rounded"
                >
                  {lang === 'ar' ? 'EN' : 'عربي'}
                </button>
              </div>
              <Link href="/contact" className="btn-primary text-center mt-2">
                {lang === 'ar' ? 'احجز استشارة' : 'Book Consultation'}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
