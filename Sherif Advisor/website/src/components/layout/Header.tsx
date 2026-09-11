'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { getClientLanguage, setLanguagePreference, type Language } from '@/lib/language';

const navItems = [
  { href: '/',           labelAr: 'الرئيسية',    labelEn: 'HOME',       id: 'home' },
  { href: '/#journey',    labelAr: 'رحلتك',       labelEn: 'YOUR JOURNEY', id: 'journey' },
  { href: '/#services',  labelAr: 'الخدمات',     labelEn: 'SERVICES',   id: 'services' },
  { href: '/#markets',   labelAr: 'الأسواق',     labelEn: 'MARKETS',    id: 'markets' },
  { href: '/#insights',  labelAr: 'الأفكار',     labelEn: 'INSIGHTS',   id: 'insights' },
  { href: '/#contact',   labelAr: 'تواصل معنا',  labelEn: 'CONTACT',    id: 'contact' },
  { href: '/about',      labelAr: 'من نحن',      labelEn: 'ABOUT US',   id: 'about' },
];

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  const [lang, setLang] = useState<Language>('en'); 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setLang(getClientLanguage());
  }, []);

  // 1. Scroll Detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 2. Scroll Spy
  useEffect(() => {
    if (!isMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    );

    navItems.forEach((item) => {
      if (item.id) {
        const el = document.getElementById(item.id);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [isMounted]);

  // 3. Active State Logic
  const isActive = (item: typeof navItems[0]) => {
    if (pathname !== '/') {
      return item.href === pathname;
    }

    if (pathname === '/') {
      if (item.href === '/') {
        return activeSection === 'home' || activeSection === '';
      }
      if (item.href.startsWith('/#')) {
        const hash = item.href.replace('/#', '');
        return activeSection === hash;
      }
    }
    return false;
  };

  function toggleLanguage() {
    const next: Language = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    setLanguagePreference(next);
    window.location.reload();
  }

  const showWhiteBg = scrolled || isHovered;

  return (
    <header 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showWhiteBg 
          ? 'bg-white/95 shadow-lg py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo with Company Info */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-14 h-14 lg:w-16 lg:h-16">
            <Image
              src="/images/logo.png"
              alt="Sherif Yousry Advisory"
              fill
              className={`object-contain transition-all duration-300 group-hover:scale-105 ${
                showWhiteBg ? 'brightness-0' : 'brightness-100'
              }`}
              priority
            />
          </div>
          <div className="hidden lg:block">
            <h3 className={`font-serif text-lg tracking-wide transition-colors duration-300 ${
              showWhiteBg ? 'text-[#030a12]' : 'text-white'
            }`}>
              SHERIF YOUSRY
            </h3>
            <p className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
              showWhiteBg ? 'text-gray-600' : 'text-gray-400'
            }`}>
              ADVISORY
            </p>
            <p className={`text-[10px] mt-0.5 transition-colors duration-300 ${
              showWhiteBg ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {t(lang, 'من الخبرة، نبني الثقة.', 'FROM EXPERTISE, WE BUILD TRUST.')}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs tracking-widest transition-colors duration-300 relative group ${
                  active 
                    ? 'text-brand-gold' 
                    : showWhiteBg 
                      ? 'text-gray-700 hover:text-brand-gold' 
                      : 'text-gray-300 hover:text-brand-gold'
                }`}
              >
                {t(lang, item.labelAr, item.labelEn)}
                <span 
                  className={`absolute -bottom-1 left-0 h-px bg-brand-gold transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} 
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Actions - Desktop Only */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Language Selector */}
          <button 
            onClick={toggleLanguage}
            className={`flex items-center gap-2 text-xs transition-colors ${
              showWhiteBg 
                ? 'text-gray-700 hover:text-brand-gold' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'AR' : 'EN'}
            <ChevronDown className="w-3 h-3" />
          </button>
          
          <div className={`w-px h-4 transition-colors ${
            showWhiteBg ? 'bg-gray-300' : 'bg-white/20'
          }`} />
          
          {/* Book Consultation Button */}
          <Link 
            href="/#contact" 
            className="inline-flex items-center gap-2 bg-[#f7f3e9] text-[#030a12] px-6 py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-brand-gold transition-all duration-300 group"
          >
            {t(lang, 'احجز استشارة', 'BOOK CONSULTATION')}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* ✅ Mobile Menu Toggle - ONLY visible on mobile */}
        <button 
          className={`lg:hidden transition-colors ${
            showWhiteBg ? 'text-[#030a12] hover:text-brand-gold' : 'text-white hover:text-brand-gold'
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu - Slide Down */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#030a12]/98 backdrop-blur-md border-t border-white/10 shadow-2xl">
          <div className="px-6 py-8 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm py-3 border-b border-white/5 transition-colors ${
                  isActive(item) ? 'text-brand-gold' : 'text-gray-300 hover:text-brand-gold'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(lang, item.labelAr, item.labelEn)}
              </Link>
            ))}
            
            <div className="border-t border-white/10 pt-6 mt-4 flex flex-col gap-3">
              <button 
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className="text-sm text-gray-300 hover:text-white transition-colors text-left py-2"
              >
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
              <Link 
                href="/#contact" 
                className="inline-flex items-center justify-center gap-2 bg-[#f7f3e9] text-[#030a12] px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-brand-gold transition-all duration-300 mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(lang, 'احجز استشارة', 'BOOK CONSULTATION')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}