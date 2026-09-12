'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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

// ✅ Added 'category' field to match your database category names (same as KnowledgePage)
const tabs = [
  { id: 'all', labelAr: 'الكل', labelEn: 'ALL', category: '' },
  { id: 'tax', labelAr: 'تنبيهات ضريبية', labelEn: 'TAX ALERTS', category: 'Tax Update' }, // ⚠️ Ensure this matches your DB
  { id: 'legal', labelAr: 'تنبيهات قانونية', labelEn: 'LEGAL ALERTS', category: 'Regulatory' }, // ⚠️ Ensure this matches your DB
  { id: 'financial', labelAr: 'تنبيهات مالية', labelEn: 'FINANCIAL ALERTS', category: 'Market Updates' }, // ⚠️ Ensure this matches your DB
];

const fallback = [
  {
    id: '1',
    category: 'تحديث ضريبي',
    catEn: 'Tax Update',
    titleAr: 'المرحلة الثانية للفاتورة الإلكترونية: ما يتغيّر للمجموعات المتوسطة في مصر؟',
    titleEn: 'E-invoicing Phase 2: What changes for mid-size groups in Egypt?',
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
    date: '2024',
    dateEn: 'April 2, 2025',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400',
  },
];

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

function ArticleCard({ item, lang, delay }: { item: typeof fallback[0]; lang: Language; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group bg-white rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="relative h-28 w-full overflow-hidden">
        <Image 
          src={item.image} 
          alt={t(lang, item.titleAr, item.titleEn)}
          width={400}
          height={150}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <span className="text-[10px] font-bold tracking-wider text-brand-gold uppercase block mb-2">
          {t(lang, item.category, item.catEn)}
        </span>
        <h3 className="text-[13px] leading-snug font-medium text-[#333333] mb-3 group-hover:text-brand-gold transition-colors">
          {t(lang, item.titleAr, item.titleEn)}
        </h3>
        <div className="flex justify-between items-center text-[11px] text-[#8d8d8d]">
          <span>{t(lang, item.date, item.dateEn)}</span>
          <span className="text-[#555555]">→</span>
        </div>
      </div>
    </div>
  );
}

export function Knowledge() {
  const [lang, setLang] = useState<Language>('ar');
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [heading, setHeading] = useState<{ label: string; title: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const detectedLang = getClientLanguage();
    setLang(detectedLang);
  }, []);

  // ✅ 3. Fetch articles with category filtering (same logic as KnowledgePage)
  useEffect(() => {
    if (!isMounted) return;
    
    async function fetchArticles() {
      setLoaded(false);
      try {
        const activeTabObj = tabs.find(t => t.id === activeTab);
        let url = `/api/content/articles?lang=${lang}&page=1`;
        
        // ✅ Append category to URL if a specific tab is selected
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
  }, [lang, isMounted, activeTab]); // ✅ Added activeTab to dependencies

  // ✅ 4. Fetch heading only after mounting
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

  // Get the active category string for fallback filtering
  const activeCategory = tabs.find(t => t.id === activeTab)?.category || '';

  return (
    <section className=" bg-[#fbf9f6]" id="insights">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr] gap-8 lg:gap-12">
          
          {/* LEFT SECTION: Main Content */}
          <div className="main-content  mx-4 px-8 py-16">
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
                    const imageUrl = hasImage 
                      ? cover 
                      : 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400';
                    
                    return (
                      <Link 
                        key={a.id} 
                        href={`/knowledge/${a.id}`}
                        className="group bg-white rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col"
                      >
                        {hasImage ? (
                          cover.startsWith('http') ? (
                            <img 
                              src={cover} 
                              alt={a.title} 
                              className="h-28 w-full object-cover"
                              loading={index === 0 ? 'eager' : 'lazy'}
                            />
                          ) : (
                            <Image 
                              src={cover} 
                              alt={a.title} 
                              width={400}
                              height={150}
                              className="h-28 w-full object-cover"
                              loading={index === 0 ? 'eager' : 'lazy'}
                            />
                          )
                        ) : (
                          <div className="h-28 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            {t(lang, 'بدون صورة', 'No Image')}
                          </div>
                        )}
                        <div className="p-4 flex flex-col flex-grow justify-between">
                          {a.metadata?.category && (
                            <span className="text-[10px] font-bold tracking-wider text-brand-gold uppercase mb-2">
                              {t(lang, a.metadata.category, a.metadata.category)}
                            </span>
                          )}
                          <h3 className="text-[13px] leading-snug font-medium text-[#333333] mb-3 group-hover:text-brand-gold transition-colors">
                            {a.title}
                          </h3>
                          <div className="flex justify-between items-center text-[11px] text-[#8d8d8d]">
                            <span>{a.metadata?.publishDate ? new Date(a.metadata.publishDate).getFullYear() : ''}</span>
                            <span className="text-[#555555] group-hover:text-brand-gold transition-colors">
                              {lang === 'ar' ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                : fallback
                    // ✅ Filter fallback articles by category if a specific tab is active
                    .filter(item => !activeCategory || item.catEn === activeCategory || item.category === activeCategory)
                    .map((item, i) => (
                      <ArticleCard key={item.id} item={item} lang={lang} delay={i * 120} />
                    ))}
            </div>
          </div>

          {/* RIGHT SECTION: Feature Card */}
          <Link 
            href="/about"
            className="relative min-h-[320px] rounded-sm overflow-hidden flex flex-col justify-end p-8 lg:p-10 bg-cover bg-center group cursor-pointer"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600')" }}
          >
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
            
            <div className="relative z-10 max-w-xs">
              <p className="font-serif text-xl md:text-2xl leading-snug text-white mb-5">
                {t(lang, '"المنظور الصحيح اليوم يخلق غدًا أقوى."', '"The right perspective today creates a stronger tomorrow."')}
              </p>
              <div className="w-8 h-0.5 bg-white" />
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}