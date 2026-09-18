'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Menu, X, Globe, Search, Map, User, FileText, BarChart2, 
  Briefcase, Users, Shield, Calculator, ShoppingCart, ChevronRight,
  Building2, Layers, Gem, Crown,
  Globe2, MapPin, Newspaper, BookOpen, Users2, Award, type LucideIcon,
} from 'lucide-react';
import { getClientLanguage, setLanguagePreference, type Language } from '@/lib/language';
import { SearchOverlay } from '@/components/v2/SearchOverlay';

const navItems = [
  { href: '/',           labelAr: 'الرئيسية',    labelEn: 'Home',       id: 'home' },
  { href: '/#services',  labelAr: 'الخدمات',     labelEn: 'Services',   id: 'services' },
  { href: '/#digital',   labelAr: 'التجربة الرقمية', labelEn: 'Digital Experience', id: 'markets' },
  { href: '/#insights',  labelAr: 'الأفكار',     labelEn: 'Insights',   id: 'insights' },
  { href: '/#packages',  labelAr: 'الباقات',     labelEn: 'Packages',   id: 'packages' },
  { href: '/#events',    labelAr: 'الفعاليات والتدريب', labelEn: 'Events & Training', id: 'events' },
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

// ─── Mega-menu content (Apollo-style: intro | links | featured card) ─────────
// Keyed by nav item id. `services` is handled separately (CMS-driven), so it
// is not listed here. Content sections only (Option A) — Home & Contact stay
// as plain links with no dropdown.
interface MegaLink {
  href: string;
  labelAr: string;
  labelEn: string;
  icon?: LucideIcon;
}
interface MegaMenu {
  introTitleAr: string;
  introTitleEn: string;
  introDescAr: string;
  introDescEn: string;
  ctaHref: string;
  links: MegaLink[];
  feature: {
    href: string;
    image: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
  };
}

const MEGA_MENUS: Record<string, MegaMenu> = {
  packages: {
    introTitleAr: 'الباقات',
    introTitleEn: 'Packages',
    introDescAr: 'باقات مرنة تناسب مختلف أحجام الأعمال ومراحل نموها.',
    introDescEn: 'Flexible packages tailored to different business sizes and growth stages.',
    ctaHref: '/#packages',
    links: [
      { href: '/#packages', labelAr: 'الباقة الأساسية', labelEn: 'Starter', icon: Layers },
      { href: '/#packages', labelAr: 'باقة النمو', labelEn: 'Growth', icon: Gem },
      { href: '/#packages', labelAr: 'الباقة المؤسسية', labelEn: 'Enterprise', icon: Crown },
    ],
    feature: {
      href: '/#packages',
      image: '/images/primds.jpeg',
      titleAr: 'قيمة واضحة، أسعار شفافة',
      titleEn: 'Clear Value, Transparent Pricing',
      descAr: 'اختر الباقة التي تناسب أهدافك مع إمكانية التخصيص الكامل.',
      descEn: 'Choose the package that fits your goals, with full customization available.',
    },
  },
  markets: {
    introTitleAr: 'الأسواق',
    introTitleEn: 'Markets',
    introDescAr: 'حضور وخبرة تمتد عبر الأسواق المحلية والإقليمية والدولية.',
    introDescEn: 'Presence and expertise spanning local, regional, and international markets.',
    ctaHref: '/#markets',
    links: [
      { href: '/#markets', labelAr: 'مصر', labelEn: 'Egypt', icon: MapPin },
      { href: '/#markets', labelAr: 'الخليج', labelEn: 'GCC', icon: Globe2 },
      { href: '/#markets', labelAr: 'أوروبا', labelEn: 'Europe', icon: Globe2 },
    ],
    feature: {
      href: '/#markets',
      image: '/images/markets-map.jpeg',
      titleAr: 'منظور محلي، رؤية عالمية',
      titleEn: 'Local Insight, Global Perspective',
      descAr: 'نجمع بين المعرفة العميقة بالأسواق المحلية والخبرة الدولية.',
      descEn: 'We combine deep local market knowledge with international experience.',
    },
  },
  insights: {
    introTitleAr: 'الأفكار',
    introTitleEn: 'Insights',
    introDescAr: 'مقالات وتحليلات تساعدك على اتخاذ قرارات أعمال أفضل.',
    introDescEn: 'Articles and analysis to help you make better business decisions.',
    ctaHref: '/knowledge',
    links: [
      { href: '/knowledge', labelAr: 'أحدث المقالات', labelEn: 'Latest Articles', icon: Newspaper },
      { href: '/knowledge', labelAr: 'قاعدة المعرفة', labelEn: 'Knowledge Base', icon: BookOpen },
    ],
    feature: {
      href: '/knowledge',
      image: '/images/cairo.jpg',
      titleAr: 'رؤى تصنع الفارق',
      titleEn: 'Insights That Make a Difference',
      descAr: 'اطّلع على أحدث تحليلاتنا حول الأعمال والأسواق.',
      descEn: 'Explore our latest analysis on business and markets.',
    },
  },
  about: {
    introTitleAr: 'من نحن',
    introTitleEn: 'About Us',
    introDescAr: 'قصتنا وفريقنا والقيم التي توجه عملنا كل يوم.',
    introDescEn: 'Our story, our team, and the values that guide our work every day.',
    ctaHref: '/about',
    links: [
      { href: '/about', labelAr: 'قصتنا', labelEn: 'Our Story', icon: BookOpen },
      { href: '/about#team', labelAr: 'الفريق', labelEn: 'Our Team', icon: Users2 },
      { href: '/careers', labelAr: 'الوظائف', labelEn: 'Careers', icon: Award },
    ],
    feature: {
      href: '/about',
      image: '/images/Greek.jpeg',
      titleAr: 'خبرة تصنع الثقة',
      titleEn: 'Expertise You Can Trust',
      descAr: 'فريق من الخبراء ملتزم بنجاحك على المدى الطويل.',
      descEn: 'A team of experts committed to your long-term success.',
    },
  },
};

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  // Which nav item's mega-menu is open (by id), or null. Used on desktop hover
  // and as the expanded row on mobile.
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // Controls the full-screen search overlay (services + insights).
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [lang, setLang] = useState<Language>('en'); 
  const [isMounted, setIsMounted] = useState(false);
  const [cmsServices, setCmsServices] = useState<CmsService[]>([]);
  
  const menuTimeoutRef = useRef<NodeJS.Timeout>();

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

  // The home page is a single-page layout, so the nav scroll-spy marks
  // the section currently in view.
  const isSinglePage = pathname === '/';

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

  // Nav items that show a dropdown: services (CMS) + those with a MEGA_MENUS entry.
  const hasMenu = (id: string) => id === 'services' || id in MEGA_MENUS;

  const openMenuById = (id: string) => {
    clearTimeout(menuTimeoutRef.current);
    setOpenMenu(id);
  };

  const closeMenu = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
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
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navItems.map((item) => {
            const active = isActive(item);
            const isServices = item.id === 'services';
            const itemHasMenu = hasMenu(item.id);
            const isOpen = openMenu === item.id;
            const mega = MEGA_MENUS[item.id];

            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={itemHasMenu ? () => openMenuById(item.id) : undefined}
                onMouseLeave={itemHasMenu ? closeMenu : undefined}
              >
                <Link
                  href={item.href}
                  className={`text-xs tracking-widest whitespace-nowrap transition-all duration-300 relative group flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
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
                  {itemHasMenu && (
                    <svg 
                      className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
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

                {itemHasMenu && isOpen && (
                  <div 
                    className={`fixed top-24 left-1/2 -translate-x-1/2 w-[920px] max-w-[94vw] rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
                      showWhiteBg ? 'bg-white border border-gray-200' : 'bg-[#030a12] border border-white/10'
                    }`}
                    onMouseEnter={() => openMenuById(item.id)}
                    onMouseLeave={closeMenu}
                  >
                    {/* Apollo-style 3-zone layout: intro | links | featured card */}
                    <div className="grid grid-cols-[240px_1fr_260px]">
                      {/* Left — intro column */}
                      <div className={`p-6 flex flex-col ${showWhiteBg ? 'border-r border-gray-200' : 'border-r border-white/10'}`}>
                        <h3 className={`font-serif text-xl mb-3 ${showWhiteBg ? 'text-[#030a12]' : 'text-white'}`}>
                          {isServices
                            ? t(lang, 'الخدمات', 'Services')
                            : t(lang, mega.introTitleAr, mega.introTitleEn)}
                        </h3>
                        <p className={`text-xs leading-relaxed mb-6 ${showWhiteBg ? 'text-gray-600' : 'text-gray-400'}`}>
                          {isServices
                            ? t(
                                lang,
                                'خدمات استشارية وإدارية متكاملة تجمع بين الخبرة الفنية العميقة والفهم العملي للأعمال.',
                                'End-to-end advisory and business management services, combining deep technical expertise with practical business understanding.'
                              )
                            : t(lang, mega.introDescAr, mega.introDescEn)}
                        </p>
                        <Link
                          href={isServices ? '/services' : mega.ctaHref}
                          className="inline-flex items-center gap-2 self-start rounded-full bg-brand-gold text-[#030a12] px-5 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-brand-gold/90 transition-colors mt-auto"
                        >
                          {t(lang, 'استكشف', 'Explore')}
                          <span className="rtl:rotate-180">→</span>
                        </Link>
                      </div>

                      {/* Middle — links (CMS categories for services, curated otherwise) */}
                      <div className="p-6">
                        {isServices ? (
                          <>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                              {groupedServices.map((cat) => (
                                <div key={cat.id} className="flex flex-col">
                                  <div className="flex items-center gap-2 pb-2 mb-1 border-b border-brand-gold/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                                    <h4 className="text-[11px] font-bold tracking-wide uppercase text-brand-gold">
                                      {t(lang, cat.categoryAr, cat.categoryEn)}
                                    </h4>
                                  </div>
                                  {cat.items.map((service) => {
                                    const Icon = service.metadata?.icon
                                      ? SERVICE_ICON_MAP[service.metadata.icon]
                                      : undefined;
                                    return (
                                      <Link
                                        key={service.id}
                                        href={`/services/${service.id}`}
                                        className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-all duration-200 group/item ${
                                          showWhiteBg ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                                        }`}
                                      >
                                        <span className="flex items-center gap-2.5">
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
                                        </span>
                                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0 rtl:rotate-180 ${
                                          showWhiteBg ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                      </Link>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                            <div className={`mt-5 pt-4 border-t ${showWhiteBg ? 'border-gray-200' : 'border-white/10'}`}>
                              <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-brand-gold hover:text-brand-gold/80 transition-colors">
                                {t(lang, 'عرض جميع الخدمات', 'VIEW ALL SERVICES')}
                                <span className="transition-transform group-hover:translate-x-1 rtl:rotate-180">→</span>
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col justify-center h-full gap-1">
                            {mega.links.map((link) => {
                              const Icon = link.icon;
                              return (
                                <Link
                                  key={`${link.href}-${link.labelEn}`}
                                  href={link.href}
                                  className={`flex items-center justify-between gap-2 px-3 py-3 rounded-md transition-all duration-200 group/item ${
                                    showWhiteBg ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                                  }`}
                                >
                                  <span className="flex items-center gap-3">
                                    {Icon && (
                                      <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                                        showWhiteBg ? 'text-gray-400 group-hover/item:text-brand-gold' : 'text-gray-500 group-hover/item:text-brand-gold'
                                      }`} />
                                    )}
                                    <span className={`text-sm font-medium transition-colors ${
                                      showWhiteBg ? 'text-gray-800 group-hover/item:text-brand-gold' : 'text-gray-200 group-hover/item:text-brand-gold'
                                    }`}>
                                      {t(lang, link.labelAr, link.labelEn)}
                                    </span>
                                  </span>
                                  <ChevronRight className={`w-4 h-4 shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0 rtl:rotate-180 ${
                                    showWhiteBg ? 'text-gray-400' : 'text-gray-500'
                                  }`} />
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Right — featured card with image */}
                      <Link
                        href={isServices ? '/services' : mega.feature.href}
                        className="relative m-4 rounded-lg overflow-hidden group/feat min-h-[220px] flex flex-col justify-end"
                      >
                        <Image
                          src={isServices ? '/images/Bussniess.jpeg' : mega.feature.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover/feat:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030a12]/90 via-[#030a12]/40 to-transparent" />
                        <div className="relative p-4">
                          <h4 className="text-white font-serif text-base leading-snug mb-1.5">
                            {isServices
                              ? t(lang, 'استشارات الأعمال المتكاملة', 'Integrated Business Advisory')
                              : t(lang, mega.feature.titleAr, mega.feature.titleEn)}
                          </h4>
                          <p className="text-gray-300 text-[11px] leading-relaxed">
                            {isServices
                              ? t(
                                  lang,
                                  'حلول عملية تدعم نمو أعمالك واستدامتها في الأسواق المحلية والدولية.',
                                  'Practical solutions that support your business growth and resilience across local and international markets.'
                                )
                              : t(lang, mega.feature.descAr, mega.feature.descEn)}
                          </p>
                        </div>
                      </Link>
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
          
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`${iconBtnClass} w-11 h-11`}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        
          <Link href="/login" className={`${iconBtnClass} w-11 h-11`} aria-label="Login">
            <User className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Mobile floating pill (bottom-center): search | menu */}
      {!isMenuOpen && (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[90]">
          <div className="flex items-center gap-1 rounded-full bg-brand-navy/95 backdrop-blur-md border border-white/10 shadow-xl shadow-black/30 px-2 py-1.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-11 h-11 rounded-full text-white hover:text-brand-gold transition-colors"
              aria-label={t(lang, 'بحث', 'Search')}
            >
              <Search className="w-5 h-5" />
            </button>
            <span className="w-px h-6 bg-white/20" />
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center justify-center w-11 h-11 rounded-full text-white hover:text-brand-gold transition-colors"
              aria-label={t(lang, 'القائمة', 'Menu')}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ✅ FULL-SCREEN MOBILE MENU */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[100] overflow-y-auto"
          style={{ animation: 'menuFade 0.35s ease both' }}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Layered branded background: deep navy + gold radial glow + arc */}
          <div className="absolute inset-0 -z-10 bg-[#030a12]" />
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 50% at 80% 0%, rgba(191,161,74,0.18) 0%, rgba(3,10,18,0) 60%)',
            }}
          />
          <div
            className="absolute inset-0 -z-10 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 100% 25%, #fff 0 2px, transparent 3px), radial-gradient(circle at 100% 25%, transparent 38%, #fff 39%, transparent 40%), radial-gradient(circle at 100% 25%, transparent 58%, #fff 59%, transparent 60%)',
            }}
          />

          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
              <div className="relative w-11 h-11">
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

            <div className="flex items-center gap-2">
              {/* Language Button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 text-white text-xs font-medium hover:bg-white/10 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{lang === 'ar' ? 'AR' : 'EN'}</span>
              </button>
              {/* Close */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                aria-label={t(lang, 'إغلاق القائمة', 'Close menu')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Navigation Items — large serif rows */}
          <nav className="px-6 pt-2 pb-4">
            {navItems.map((item, index) => {
              const isServices = item.id === 'services';
              const itemHasMenu = hasMenu(item.id);
              const isOpen = openMenu === item.id;
              const mega = MEGA_MENUS[item.id];
              const active = isActive(item);

              return (
                <div
                  key={item.href}
                  className="border-b border-white/10"
                  style={{ animation: `menuRowIn 0.45s cubic-bezier(0.16,1,0.3,1) ${index * 0.05}s both` }}
                >
                  <button
                    onClick={() => {
                      if (itemHasMenu) {
                        setOpenMenu(isOpen ? null : item.id);
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between py-4 group transition-colors ${
                      active ? 'text-brand-gold' : 'text-white'
                    }`}
                  >
                    {itemHasMenu ? (
                      <span className="font-serif text-2xl tracking-wide flex-1 text-start group-hover:text-brand-gold transition-colors">
                        {t(lang, item.labelAr, item.labelEn)}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="font-serif text-2xl tracking-wide flex-1 text-start group-hover:text-brand-gold transition-colors"
                      >
                        {t(lang, item.labelAr, item.labelEn)}
                      </Link>
                    )}

                    {/* Chevron — for any expandable row; RTL-aware */}
                    {itemHasMenu && (
                      <ChevronRight
                        className={`w-6 h-6 shrink-0 text-brand-gold/70 transition-transform duration-300 rtl:rotate-180 ${
                          isOpen ? 'rotate-90 rtl:-rotate-90' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Submenu — CMS categories for Services, curated links otherwise */}
                  {itemHasMenu && isOpen && (
                    <div className="pb-3 ps-2 space-y-4" style={{ animation: 'slideDown 0.3s ease' }}>
                      {isServices ? (
                        groupedServices.map((cat) => (
                          <div key={cat.id}>
                            <div className="flex items-center gap-2 py-1.5 border-b border-brand-gold/30 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                              <span className="text-xs font-bold tracking-wide uppercase text-brand-gold">
                                {t(lang, cat.categoryAr, cat.categoryEn)}
                              </span>
                            </div>
                            {cat.items.map((service) => {
                              const Icon = service.metadata?.icon
                                ? SERVICE_ICON_MAP[service.metadata.icon]
                                : undefined;
                              return (
                                <Link
                                  key={service.id}
                                  href={`/services/${service.id}`}
                                  className="flex items-center gap-3 py-2.5 ps-3 text-sm text-gray-300 hover:text-brand-gold transition-colors"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                                  {service.title}
                                </Link>
                              );
                            })}
                          </div>
                        ))
                      ) : (
                        <>
                          {mega.links.map((link) => {
                            const Icon = link.icon;
                            return (
                              <Link
                                key={`${link.href}-${link.labelEn}`}
                                href={link.href}
                                className="flex items-center gap-3 py-2.5 ps-3 text-sm text-gray-300 hover:text-brand-gold transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                                {t(lang, link.labelAr, link.labelEn)}
                              </Link>
                            );
                          })}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Glassmorphism Action Buttons (2x2 Grid) */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-3">
              {/* Search */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-brand-gold/40 transition-all duration-300 group"
                style={{ animation: 'slideUp 0.4s ease 0.2s both' }}
              >
                <Search className="w-6 h-6 text-white group-hover:text-brand-gold transition-colors" />
                <span className="text-xs font-bold tracking-wider text-white uppercase">
                  {t(lang, 'بحث', 'SEARCH')}
                </span>
              </button>

              {/* Maps */}
              <Link
                href="/#markets"
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-brand-gold/40 transition-all duration-300 group"
                style={{ animation: 'slideUp 0.4s ease 0.25s both' }}
              >
                <Map className="w-6 h-6 text-white group-hover:text-brand-gold transition-colors" />
                <span className="text-xs font-bold tracking-wider text-white uppercase">
                  {t(lang, 'الخريطة', 'MAPS')}
                </span>
              </Link>
            </div>
          </div>

          {/* Secondary Links */}
          <div className="px-6 pb-28">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-400 hover:text-white transition-colors">
                {t(lang, 'من نحن', 'About Us')}
              </Link>
              <Link href="/#contact" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-400 hover:text-white transition-colors">
                {t(lang, 'تواصل معنا', 'Contact')}
              </Link>
              <Link href="/careers" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-400 hover:text-white transition-colors">
                {t(lang, 'الوظائف', 'Careers')}
              </Link>
              <Link href="/privacy" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-400 hover:text-white transition-colors">
                {t(lang, 'الخصوصية', 'Privacy')}
              </Link>
              <Link href="/terms" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-400 hover:text-white transition-colors">
                {t(lang, 'الشروط', 'Terms')}
              </Link>
            </div>
          </div>

          {/* Floating search pill (fixed to viewport bottom) */}
          <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-10 bg-gradient-to-t from-[#030a12] via-[#030a12]/90 to-transparent">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center gap-3 px-5 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 hover:bg-white/15 hover:border-brand-gold/40 transition-colors shadow-lg"
            >
              <Search className="w-5 h-5 text-brand-gold shrink-0" />
              <span className="text-sm">
                {t(lang, 'ابحث في الخدمات والرؤى...', 'Search services & insights...')}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Full-screen search overlay (services + insights) */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        lang={lang}
      />

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
        @keyframes menuFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes menuRowIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
