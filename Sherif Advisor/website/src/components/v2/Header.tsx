'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Menu, X, Globe, Search, Map, User, FileText, BarChart2, 
  Briefcase, Users, Shield, Calculator, ShoppingCart, ChevronRight,
  Heart, Route, MapPin, Building2, Users2, Landmark
} from 'lucide-react';
import { getClientLanguage, setLanguagePreference, type Language } from '@/lib/language';

const navItems = [
  { href: '/',           labelAr: 'الرئيسية',    labelEn: 'Home',       id: 'home' },
  { href: '/#journey',    labelAr: 'رحلتك',       labelEn: 'Your Journey', id: 'journey' },
  { href: '/#services',  labelAr: 'الخدمات',     labelEn: 'Services',   id: 'services' },
  { href: '/#markets',   labelAr: 'الأسواق',     labelEn: 'Markets',    id: 'markets' },
  { href: '/#insights',  labelAr: 'الأفكار',     labelEn: 'Insights',   id: 'insights' },
  { href: '/#contact',   labelAr: 'تواصل معنا',  labelEn: 'Contact',    id: 'contact' },
  { href: '/about',      labelAr: 'من نحن',      labelEn: 'About Us',   id: 'about' },
];

// A CMS service item (from /api/content/services).
interface CmsService {
  id: string;
  title: string;
  metadata?: { icon?: string };
}

// Category definitions. Real services (from the CMS) are matched into these
// by keywords in their title — no hardcoded/fake services.
const serviceCategories = [
  {
    id: 'tax-compliance',
    categoryAr: 'الضرائب والامتثال',
    categoryEn: 'Tax & Compliance',
    match: ['tax', 'audit', 'accounting', 'assurance', 'ضريب', 'تدقيق', 'محاسب', 'تأكيد'],
  },
  {
    id: 'financial-business',
    categoryAr: 'المالية والأعمال',
    categoryEn: 'Financial & Business',
    match: ['financial', 'business', 'economic', 'management', 'مالي', 'أعمال', 'اقتصاد', 'إدار'],
  },
  {
    id: 'corporate-operations',
    categoryAr: 'الشؤون المؤسسية والتشغيل',
    categoryEn: 'Corporate & Operations',
    match: ['corporate', 'legal', 'payroll', 'insurance', 'مؤسس', 'قانون', 'رواتب', 'تأمين'],
  },
  {
    id: 'digital',
    categoryAr: 'الرقمية',
    categoryEn: 'Digital',
    match: ['e-commerce', 'ecommerce', 'commerce', 'digital', 'تجارة', 'رقمي', 'إلكترون'],
  },
];

// Lucide icons the CMS may reference, plus a sensible default per category.
const SERVICE_ICON_MAP: Record<string, typeof FileText> = {
  Briefcase, Building2, Shield, FileText, BarChart2, Users, Calculator, ShoppingCart,
};

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [lang, setLang] = useState<Language>('en'); 
  const [isMounted, setIsMounted] = useState(false);
  const [cmsServices, setCmsServices] = useState<CmsService[]>([]);
  
  const servicesTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsMounted(true);
    setLang(getClientLanguage());
  }, []);

  // Fetch real services from the CMS so the dropdown reflects actual data.
  useEffect(() => {
    if (!isMounted) return;
    let cancelled = false;
    fetch(`/api/content/services?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.items)) setCmsServices(data.items);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang, isMounted]);

  // Group the real CMS services into the defined categories by title keywords.
  const groupedServices = serviceCategories
    .map((cat) => ({
      ...cat,
      items: cmsServices.filter((svc) =>
        cat.match.some((kw) => (svc.title || '').toLowerCase().includes(kw))
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) setActiveSection(visibleEntry.target.id);
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

  // ✅ Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Treat both the homepage and the /v2 playground as single-page layouts
  // so the nav scroll-spy marks the section currently in view.
  const isSinglePage = pathname === '/' || pathname === '/v2';

  const isActive = (item: typeof navItems[0]) => {
    if (!isSinglePage) return item.href === pathname;
    if (item.href === '/') return activeSection === 'home' || activeSection === '';
    if (item.href.startsWith('/#')) return activeSection === item.href.replace('/#', '');
    return false;
  };

  function toggleLanguage() {
    const next: Language = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    setLanguagePreference(next);
    window.location.reload();
  }

  const showWhiteBg = scrolled || isHovered;

  const iconBtnClass = `flex items-center justify-center rounded-full border transition-all duration-300 ${
    showWhiteBg 
      ? 'border-gray-300 text-gray-700 hover:bg-gray-100' 
      : 'border-white/40 text-white hover:bg-white/10'
  }`;

  const handleServicesEnter = () => {
    clearTimeout(servicesTimeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 200);
  };

  return (
    <header 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showWhiteBg ? 'bg-white/95 shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
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
          </div>
        </Link>

        {/* Desktop Navigation with Mega Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const active = isActive(item);
            const isServices = item.id === 'services';
            
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={isServices ? handleServicesEnter : undefined}
                onMouseLeave={isServices ? handleServicesLeave : undefined}
              >
                <Link
                  href={item.href}
                  className={`text-xs tracking-widest transition-all duration-300 relative group flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
                    active
                      ? 'text-brand-gold bg-brand-gold/10 ring-1 ring-brand-gold/30'
                      : showWhiteBg ? 'text-gray-700 hover:text-brand-gold' : 'text-gray-300 hover:text-brand-gold'
                  }`}
                >
                  {/* Pulsing active dot marker */}
                  {active && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-gold" />
                    </span>
                  )}
                  {t(lang, item.labelAr, item.labelEn)}
                  {isServices && (
                    <svg 
                      className={`w-3 h-3 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  <span className={`absolute -bottom-0.5 left-3 h-0.5 bg-brand-gold transition-all duration-300 ${
                    active ? 'w-[calc(100%-1.5rem)]' : 'w-0 group-hover:w-[calc(100%-1.5rem)]'
                  }`} />
                </Link>

                {isServices && isServicesOpen && (
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[860px] max-w-[92vw] rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
                      showWhiteBg ? 'bg-white border border-gray-200' : 'bg-[#030a12] border border-white/10'
                    }`}
                    onMouseEnter={handleServicesEnter}
                    onMouseLeave={handleServicesLeave}
                  >
                    <div className="p-6">
                      {/* One column per category, real CMS sub-services under each */}
                      <div className="grid grid-cols-4 gap-x-5 gap-y-1">
                        {groupedServices.map((cat) => (
                          <div key={cat.id} className="flex flex-col">
                            {/* Category heading */}
                            <div className="flex items-center gap-2 px-2 pb-2 mb-2 border-b border-brand-gold/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                              <h4 className="text-sm font-bold tracking-wide uppercase text-brand-gold">
                                {t(lang, cat.categoryAr, cat.categoryEn)}
                              </h4>
                            </div>

                            {/* Sub-services (from CMS) */}
                            {cat.items.map((service) => {
                              const Icon = service.metadata?.icon
                                ? SERVICE_ICON_MAP[service.metadata.icon]
                                : undefined;
                              return (
                                <Link
                                  key={service.id}
                                  href={`/services/${service.id}`}
                                  className={`flex items-center gap-2.5 px-2 py-2 rounded-md transition-all duration-200 group/item ${
                                    showWhiteBg ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                                  }`}
                                >
                                  {Icon && (
                                    <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                                      showWhiteBg ? 'text-gray-400 group-hover/item:text-brand-gold' : 'text-gray-500 group-hover/item:text-brand-gold'
                                    }`} />
                                  )}
                                  <span className={`text-xs font-medium transition-colors ${
                                    showWhiteBg ? 'text-gray-800 group-hover/item:text-brand-gold' : 'text-gray-200 group-hover/item:text-brand-gold'
                                  }`}>
                                    {service.title}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      <div className={`mt-4 pt-4 border-t ${showWhiteBg ? 'border-gray-200' : 'border-white/10'}`}>
                        <Link href="/v2/services" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-brand-gold hover:text-brand-gold/80 transition-colors">
                          {t(lang, 'عرض جميع الخدمات', 'VIEW ALL SERVICES')}
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Actions: Icon Buttons (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <button 
            onClick={toggleLanguage}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 ${
              showWhiteBg ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-white/40 text-white hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-medium tracking-wide">{lang === 'ar' ? 'AR' : 'EN'}</span>
          </button>
          
          <button className={`${iconBtnClass} w-11 h-11`} aria-label="Search">
            <Search className="w-4 h-4" />
          </button>
        
          <Link href="/login" className={`${iconBtnClass} w-11 h-11`} aria-label="Login">
            <User className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`lg:hidden transition-colors ${
            showWhiteBg ? 'text-[#030a12]' : 'text-white'
          }`}
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ✅ FULL-SCREEN MOBILE MENU - Abu Dhabi Style */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-[#030a12] overflow-y-auto">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo.png"
                  alt="Sherif Yousry Advisory"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h3 className="text-white font-serif text-base tracking-wide">SHERIF YOUSRY</h3>
                <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase">ADVISORY</p>
              </div>
            </Link>
            
            {/* Language Button */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-white text-xs font-medium hover:bg-white/10 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'ar' ? 'AR' : 'EN'}</span>
            </button>
          </div>

                    {/* Main Navigation Items */}
          <div className="px-6 py-6">
            {navItems.map((item, index) => {
              const isServices = item.id === 'services';
              const active = isActive(item);
              
              return (
                <div key={item.href} style={{ animation: `slideIn 0.4s ease ${index * 0.05}s both` }}>
                  {/* ✅ FIXED: Use a button for the whole row to handle clicks cleanly */}
                  <button
                    onClick={() => {
                      if (isServices) {
                        setIsServicesOpen(!isServicesOpen);
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between py-4 border-b border-white/5 transition-colors ${
                      active ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
                    }`}
                  >
                    {/* ✅ FIXED: Conditionally render Link or Span to avoid undefined href */}
                    {isServices ? (
                      <span className="text-lg font-medium flex-1 text-left">
                        {t(lang, item.labelAr, item.labelEn)}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-lg font-medium flex-1 text-left"
                      >
                        {t(lang, item.labelAr, item.labelEn)}
                      </Link>
                    )}
                    
                    {/* Chevron Arrow */}
                    {(isServices || item.href === '/#journey' || item.href === '/#markets') && (
                      <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                        (isServices && isServicesOpen) ? 'rotate-90' : ''
                      }`} />
                    )}
                  </button>
                  
                  {/* Services Submenu */}
                  {isServices && isServicesOpen && (
                    <div className="pl-4 pb-2 space-y-3" style={{ animation: 'slideDown 0.3s ease' }}>
                      {groupedServices.map((cat) => (
                        <div key={cat.id}>
                          {/* Category heading */}
                          <div className="flex items-center gap-2 py-1.5 border-b border-brand-gold/30 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                            <span className="text-sm font-bold tracking-wide uppercase text-brand-gold">
                              {t(lang, cat.categoryAr, cat.categoryEn)}
                            </span>
                          </div>
                          {/* Sub-services (from CMS) */}
                          {cat.items.map((service) => {
                            const Icon = service.metadata?.icon
                              ? SERVICE_ICON_MAP[service.metadata.icon]
                              : undefined;
                            return (
                              <Link
                                key={service.id}
                                href={`/services/${service.id}`}
                                className="flex items-center gap-3 py-2.5 pl-3 text-sm text-gray-400 hover:text-brand-gold transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {Icon && <Icon className="w-4 h-4" />}
                                {service.title}
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ✅ Glassmorphism Action Buttons (2x2 Grid) */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-3">
              {/* Log In */}
              <Link 
                href="/admin/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-2 py-5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                style={{ animation: 'slideUp 0.4s ease 0.2s both' }}
              >
                <User className="w-6 h-6 text-white group-hover:text-brand-gold transition-colors" />
                <span className="text-xs font-bold tracking-wider text-white uppercase">
                  {t(lang, 'تسجيل الدخول', 'LOG IN')}
                </span>
              </Link>

              {/* Client Portal */}
              <Link 
                href="/portal"
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-2 py-5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                style={{ animation: 'slideUp 0.4s ease 0.25s both' }}
              >
                <Route className="w-6 h-6 text-white group-hover:text-brand-gold transition-colors" />
                <span className="text-xs font-bold tracking-wider text-white uppercase">
                  {t(lang, 'البوابة', 'PORTAL')}
                </span>
              </Link>

            
             
            </div>
          </div>

          {/* Secondary Links */}
          <div className="px-6 pb-6">
            <div className="space-y-3">
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block text-sm text-gray-400 hover:text-white transition-colors">
                {t(lang, 'من نحن', 'About Us')}
              </Link>
              <Link href="/#contact" onClick={() => setIsMenuOpen(false)} className="block text-sm text-gray-400 hover:text-white transition-colors">
                {t(lang, 'تواصل معنا', 'Contact')}
              </Link>
              <Link href="/careers" onClick={() => setIsMenuOpen(false)} className="block text-sm text-gray-400 hover:text-white transition-colors">
                {t(lang, 'الوظائف', 'Careers')}
              </Link>
              <Link href="/privacy" onClick={() => setIsMenuOpen(false)} className="block text-sm text-gray-400 hover:text-white transition-colors">
                {t(lang, 'الخصوصية', 'Privacy')}
              </Link>
              <Link href="/terms" onClick={() => setIsMenuOpen(false)} className="block text-sm text-gray-400 hover:text-white transition-colors">
                {t(lang, 'الشروط', 'Terms')}
              </Link>
            </div>
          </div>

          {/* ✅ Bottom Search Bar */}
          <div className="sticky bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-[#030a12] via-[#030a12] to-transparent">
            <div className="flex items-center justify-center gap-3">
              <div className={`flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 ${
                searchOpen ? 'w-full max-w-md' : 'w-auto'
              }`}>
                <Search className="w-5 h-5 text-white" />
                {searchOpen && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t(lang, 'ابحث...', 'Search...')}
                    className="bg-transparent text-white text-sm outline-none w-full placeholder:text-gray-400"
                    autoFocus
                  />
                )}
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-white hover:text-brand-gold transition-colors"
                >
                  {searchOpen ? <X className="w-5 h-5" /> : <span className="text-xs font-medium">|</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Close Button (Floating) */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="fixed top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}