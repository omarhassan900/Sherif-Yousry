'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

interface Article {
  id: string;
  title: string;
  body?: string;
  metadata?: {
    category?: string;
    publishDate?: string;
    featuredImageId?: string;
    featuredImage?: string;
  };
}

// ✅ Slideshow data for the right section
const featureSlides = [
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    quoteAr: '"المنظور الصحيح اليوم يخلق غدًا أقوى."',
    quoteEn: '"The right perspective today creates a stronger tomorrow."',
    link: '/about',
  },
  {
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=600',
    quoteAr: '"الخبرة المحلية بمنظور عالمي."',
    quoteEn: '"Local expertise with a global perspective."',
    link: '/services',
  },
  {
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=600',
    quoteAr: '"شريكك نحو غدٍ أقوى."',
    quoteEn: '"Your partner for a stronger tomorrow."',
    link: '/contact',
  },
];

const tabs = [
  { id: 'all', labelAr: 'الكل', labelEn: 'ALL', category: '' },
  { id: 'tax', labelAr: 'تنبيهات ضريبية', labelEn: 'TAX ALERTS', category: 'Tax Update' },
  { id: 'legal', labelAr: 'تنبيهات قانونية', labelEn: 'LEGAL ALERTS', category: 'Regulatory' },
  { id: 'financial', labelAr: 'تنبيهات مالية', labelEn: 'FINANCIAL ALERTS', category: 'Market Updates' },
];

const fallback = [
  {
    id: '1',
    category: 'تحديث ضريبي',
    catEn: 'Tax Update',
    titleAr: 'المرحلة الثانية للفاتورة الإلكترونية: ما يتغيّر للمجموعات المتوسطة في مصر؟',
    titleEn: 'E-invoicing Phase 2: What changes for mid-size groups in Egypt?',
    descAr: 'نظرة على متطلبات المرحلة الثانية للفاتورة الإلكترونية وأثرها على التزام المجموعات المتوسطة.',
    descEn: 'A look at the Phase 2 e-invoicing requirements and their impact on mid-size group compliance.',
    date: '2024',
    dateEn: 'April 15, 2025',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    category: 'حوكمة',
    catEn: 'Regulatory',
    titleAr: 'إطار COSO 2024 — أبرز التحديثات وأثرها على الشركات المصرية.',
    titleEn: 'COSO 2024 Framework — Key updates and impact on Egyptian companies.',
    descAr: 'أهم التحديثات في إطار COSO 2024 وما تعنيه للرقابة الداخلية في الشركات المصرية.',
    descEn: 'The key updates in the COSO 2024 framework and what they mean for internal control in Egyptian companies.',
    date: '2024',
    dateEn: 'April 10, 2025',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    category: 'توسّع إقليمي',
    catEn: 'Market Updates',
    titleAr: 'ضريبة الشركات في الإمارات: دليل الالتزام الأولي والهيكلة.',
    titleEn: 'UAE Corporate Tax: A guide to initial compliance and structuring.',
    descAr: 'دليل عملي للالتزام الأولي بضريبة الشركات في الإمارات وأفضل ممارسات الهيكلة.',
    descEn: 'A practical guide to initial UAE corporate tax compliance and structuring best practices.',
    date: '2024',
    dateEn: 'April 2, 2025',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400',
  },
];

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

function ArticleCard({ item, lang, delay }: { item: typeof fallback[0]; lang: Language; delay: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      href={`/knowledge/${item.id}`}
      className="group relative rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col h-64"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <img
        src={item.image}
        alt={t(lang, item.titleAr, item.titleEn)}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 bg-brand-navy/95 p-4 flex flex-col gap-2">
        <span className="text-[10px] font-bold tracking-wider text-brand-gold uppercase block">
          {t(lang, item.category, item.catEn)}
        </span>
        <h3 className="text-[15px] leading-snug font-semibold text-white line-clamp-2">
          {t(lang, item.titleAr, item.titleEn)}
        </h3>

        <p className="text-[12px] leading-relaxed text-gray-300 line-clamp-3 max-h-0 opacity-0 overflow-hidden transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
          {t(lang, item.descAr, item.descEn)}
        </p>

        <span className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-wider text-white uppercase">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white/40 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            {lang === 'ar'
              ? <ArrowLeft className="w-3.5 h-3.5 transition-colors group-hover:text-brand-navy" />
              : <ArrowRight className="w-3.5 h-3.5 transition-colors group-hover:text-brand-navy" />}
          </span>
          {t(lang, 'اقرأ المزيد', 'Learn More')}
        </span>
      </div>
    </Link>
  );
}

export function Knowledge() {
  const [lang, setLang] = useState<Language>('ar');
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [heading, setHeading] = useState<{ label: string; title: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const detectedLang = getClientLanguage();
    setLang(detectedLang);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (!isMounted) return;
    
    async function fetchArticles() {
      setLoaded(false);
      try {
        const activeTabObj = tabs.find(t => t.id === activeTab);
        let url = `/api/content/articles?lang=${lang}&page=1`;
        
        if (activeTabObj?.category) {
          url += `&category=${encodeURIComponent(activeTabObj.category)}`;
        }
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.items?.length) {
            setArticles(data.items.slice(0, 3));
          } else {
            setArticles([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoaded(true);
      }
    }
    fetchArticles();
  }, [lang, isMounted, activeTab]);

  useEffect(() => {
    if (!isMounted) return;
    
    let cancelled = false;
    fetch(`/api/content/sections/homepage/insights?lang=${lang}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && (data.title || data.body)) {
          setHeading({
            label: (data.body ?? '').replace(/<[^>]*>/g, '').trim(),
            title: (data.title ?? '').replace(/<[^>]*>/g, '').trim(),
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang, isMounted]);

  const activeCategory = tabs.find(t => t.id === activeTab)?.category || '';

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length);
  };

  return (
    <section className="bg-[#fbf9f6]" id="insights">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-8 lg:gap-12">
          
          {/* LEFT SECTION: Main Content */}
          <div className="main-content mx-4 px-8 py-16">
            <span className="text-[11px] font-semibold tracking-[1.5px] text-[#7d7d7d] uppercase block mb-2">
              {heading?.label || t(lang, 'الأفكار والرؤى', 'INSIGHTS')}
            </span>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-6 gap-4">
              <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#1a1a1a]">
                {heading?.title || t(lang, 'أفكار اليوم. غدٌ أقوى.', 'Ideas today. A stronger tomorrow.')}
              </h2>
              <Link 
                href="/knowledge" 
                className="text-[11px] font-bold tracking-wider text-[#1a1a1a] hover:text-brand-gold transition-colors inline-flex items-center gap-1.5 group"
              >
                {t(lang, 'عرض جميع الرؤى', 'VIEW ALL INSIGHTS')}
                <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">
                  {lang === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </span>
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-[#e5e5e5] mb-6 overflow-x-auto pb-px scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-[12px] font-bold tracking-wider pb-2.5 transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'text-[#1a1a1a] after:absolute after:bottom-0 after:start-0 after:w-full after:h-0.5 after:bg-[#1a1a1a]' 
                      : 'text-[#7d7d7d] hover:text-[#1a1a1a]'
                  }`}
                >
                  {t(lang, tab.labelAr, tab.labelEn)}
                </button>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loaded && articles.length > 0
                ? articles.map((a, index) => {
                    const cover = a.metadata?.featuredImage || a.metadata?.featuredImageId;
                    const hasImage = typeof cover === 'string' && (cover.startsWith('/') || cover.startsWith('http'));
                    
                    const snippet = (a.body || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                    return (
                      <Link 
                        key={a.id} 
                        href={`/knowledge/${a.id}`}
                        className="group relative rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col h-64"
                      >
                        {hasImage ? (
                          cover.startsWith('http') ? (
                            <img 
                              src={cover} 
                              alt={a.title} 
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading={index === 0 ? 'eager' : 'lazy'}
                            />
                          ) : (
                            <Image 
                              src={cover} 
                              alt={a.title} 
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              loading={index === 0 ? 'eager' : 'lazy'}
                            />
                          )
                        ) : (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            {t(lang, 'بدون صورة', 'No Image')}
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 z-10 bg-brand-navy/95 p-4 flex flex-col gap-2">
                          {a.metadata?.category && (
                            <span className="text-[10px] font-bold tracking-wider text-brand-gold uppercase block">
                              {t(lang, a.metadata.category, a.metadata.category)}
                            </span>
                          )}
                          <h3 className="text-[15px] leading-snug font-semibold text-white line-clamp-2">
                            {a.title}
                          </h3>

                          {snippet && (
                            <p className="text-[12px] leading-relaxed text-gray-300 line-clamp-3 max-h-0 opacity-0 overflow-hidden transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                              {snippet}
                            </p>
                          )}

                          <span className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-wider text-white uppercase">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white/40 transition-all duration-300 group-hover:border-brand-gold group-hover:bg-brand-gold/15">
                              {lang === 'ar'
                                ? <ArrowLeft className="w-3.5 h-3.5 transition-colors group-hover:text-brand-gold" />
                                : <ArrowRight className="w-3.5 h-3.5 transition-colors group-hover:text-brand-gold" />}
                            </span>
                            {t(lang, 'اقرأ المزيد', 'Learn More')}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                : fallback
                    .filter(item => !activeCategory || item.catEn === activeCategory || item.category === activeCategory)
                    .map((item, i) => (
                      <ArticleCard key={item.id} item={item} lang={lang} delay={i * 120} />
                    ))}
            </div>
          </div>

          {/* ✅ RIGHT SECTION: Feature Slideshow (Fixed) */}
          <div 
            className="relative min-h-[320px] rounded-sm overflow-hidden flex flex-col justify-end p-8 lg:p-10 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slideshow Images with Fade Transition */}
            {featureSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  backgroundImage: `url('${slide.image}')`,
                  backgroundSize: 'cover',       // ✅ Ensures it covers the area
                  backgroundPosition: 'center',  // ✅ Centers the image
                  backgroundRepeat: 'no-repeat'  // ✅ Prevents repeating
                }}
              />
            ))}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
            
            {/* Content (Only the text is clickable now) */}
            <div className="relative z-10 max-w-xs">
              {featureSlides.map((slide, index) => (
                <Link
                  key={index}
                  href={slide.link}
                  className={`block transition-all duration-700 ${
                    index === currentSlide 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4 absolute pointer-events-none'
                  }`}
                >
                  <p className="font-serif text-xl md:text-2xl leading-snug text-white mb-5">
                    {t(lang, slide.quoteAr, slide.quoteEn)}
                  </p>
                  <div className="w-8 h-0.5 bg-white" />
                </Link>
              ))}
            </div>

            {/* ✅ Navigation Arrows (z-20 ensures they are above the link and don't trigger navigation) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 hover:border-white/60 transition-all duration-300 z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 hover:border-white/60 transition-all duration-300 z-20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* ✅ Dots Indicator */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              {featureSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-6' 
                      : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}