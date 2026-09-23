'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, ArrowRight, ArrowLeft, Users, Sparkles } from 'lucide-react';
import { getClientLanguage, type Language } from '@/lib/language';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

interface EventItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  dateAr: string;
  dateEn: string;
  locationAr: string;
  locationEn: string;
  image: string;
}

export function Events() {
  const [lang, setLang] = useState<Language>('en');
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(getClientLanguage());
  }, []);

  // Scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch ONLY events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/events?lang=${lang}&page=1&pageSize=12`);
        const data = await res.json();

        if (data.items) {
          // Filter out training categories to ensure this section is strictly for events
          const filteredItems = data.items.filter((item: any) => {
            const meta = item.metadata || {};
            const category = meta.category?.toLowerCase();
            return !['workshop', 'webinar', 'seminar', 'training'].includes(category);
          });

          const mappedEvents = filteredItems.map((item: any) => {
            const meta = item.metadata || {};

            // Format date based on language
            const formattedDate = meta.startDate
              ? new Date(meta.startDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })
              : 'TBA';

            // Clean up description length
            const cleanDesc = item.body
              ? (item.body.length > 120 ? item.body.substring(0, 120).replace(/<[^>]*>/g, '') + '...' : item.body.replace(/<[^>]*>/g, ''))
              : '';

            return {
              id: item.id,
              titleAr: item.titleAr || '',
              titleEn: item.titleEn || '',
              descAr: cleanDesc,
              descEn: cleanDesc,
              dateAr: formattedDate,
              dateEn: formattedDate,
              locationAr: meta.location || 'TBA',
              locationEn: meta.location || 'TBA',
              image: meta.image || '/images/events/default.jpg',
            };
          });
          setEvents(mappedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (lang) {
      fetchEvents();
    }
  }, [lang]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  const PrevArrow = lang === 'ar' ? ArrowRight : ArrowLeft;
  const NextArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={sectionRef}
      id="events"
      className="py-16 md:py-20 bg-gray-50"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Modern dark separator — a bold navy pill flanked by thick navy lines */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <span className="h-[3px] flex-1 rounded-full bg-gradient-to-r from-transparent via-brand-navy/40 to-brand-navy" />
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 shadow-lg shadow-brand-navy/20">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-white">
                {t(lang, 'فعاليات', 'Events')}
              </span>
            </span>
            <span className="h-[3px] flex-1 rounded-full bg-gradient-to-l from-transparent via-brand-navy/40 to-brand-navy" />
          </div>
        </div>

        {/* Header Section: Animates from TOP */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-end mb-12 md:mb-16 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          {/* 1st Column: BIG */}
          <div className="lg:col-span-6">
            <span className="text-xs font-bold tracking-widest text-brand-gold uppercase mb-3 block">
              {t(lang, 'فعاليات مميزة', 'Featured Events')}
            </span>
            <h2 className="font-amiri text-3xl md:text-4xl lg:text-5xl text-brand-navy leading-tight">
              {t(lang, 'استكشف أحدث الفعاليات والتجارب.', 'Explore our upcoming events and experiences.')}
            </h2>
          </div>

          {/* 2nd Column: SMALLER */}
          <div className="lg:col-span-3">
            <p className="text-text-secondary leading-relaxed text-sm md:text-base">
              {t(
                lang,
                'انضم إلى الفعاليات المميزة التي نقدمها لمساعدة أعمالك على مواكبة أحدث المستجدات.',
                'Join our exclusive events designed to keep your business ahead of the curve.'
              )}
            </p>
          </div>

          {/* 3rd Column: SAME SIZE, JUSTIFIED END */}
          <div className="lg:col-span-3 flex justify-start lg:justify-end items-end">
            <Link
              href="/events"
              className="border-brand-navy border group relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-navy transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
              <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-navy text-white flex-shrink-0">
                {lang === 'ar'
                  ? <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  : <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
              </span>
              <span className="relative z-10 text-brand-navy transition-colors duration-300 group-hover:text-white">
                {t(lang, 'استكشف الفعاليات', 'Explore Events')}
              </span>
            </Link>
          </div>
        </div>

        {/* ✅ FIXED: Removed 'group' from this container so it doesn't trigger all buttons at once */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isLoading ? (
              // Loading Skeletons
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="snap-start shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white rounded-lg overflow-hidden border border-gray-100 h-96 animate-pulse"
                  style={{
                    transitionDelay: isVisible ? `${(i - 1) * 150}ms` : '0ms',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.7s ease-out'
                  }}
                >
                  <div className="h-44 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))
            ) : events.length > 0 ? (
              events.map((item, index) => (
                <div
                  key={item.id}
                  className="snap-start shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  style={{
                    transitionDelay: isVisible ? `${index * 150}ms` : '0ms',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.7s ease-out'
                  }}
                >
                  {/* ✅ FIXED: 'group' is ONLY on the individual card Link */}
                  <Link
                    href={`/events/${item.id}`}
                    className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-brand-gold/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-700 ease-out flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={t(lang, item.titleAr, item.titleEn)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Event Badge (Always shown) */}
                      <span className="absolute top-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-brand-navy/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-white">
                        <Users className="w-3.5 h-3.5 text-brand-gold" />
                        {t(lang, 'فعالية', 'Event')}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-amiri text-xl text-brand-navy mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">
                        {t(lang, item.titleAr, item.titleEn)}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1 line-clamp-3">
                        {t(lang, item.descAr, item.descEn)}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-col gap-1.5 mb-4">
                        <span className="flex items-center gap-2 text-xs text-text-secondary">
                          <Calendar className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                          {t(lang, item.dateAr, item.dateEn)}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-text-secondary">
                          <MapPin className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                          {t(lang, item.locationAr, item.locationEn)}
                        </span>
                      </div>

                      {/* ✅ FIXED: Changed nested <Link> to a <span>. 
                          The whole card is already a link, so this prevents invalid HTML. 
                          Added 'mt-auto' to keep buttons aligned at the bottom of the card. */}
                      <span className="border-brand-navy border relative inline-flex items-center gap-3 h-12 ps-1.5 pe-6 rounded-full text-xs font-bold uppercase tracking-wider mt-auto w-fit cursor-pointer">
                        <span className="pointer-events-none absolute top-0 bottom-0 start-0 w-12 opacity-0 rounded-full bg-brand-navy transition-all duration-500 ease-out group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
                        <span className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-brand-navy text-white flex-shrink-0">
                          {lang === 'ar'
                            ? <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                            : <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
                        </span>
                        <span className="relative z-10 text-brand-navy transition-colors duration-300 group-hover:text-white">
                          {t(lang, 'سجّل الآن', 'Register Now')}
                        </span>
                      </span>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="snap-start shrink-0 w-full text-center py-10 text-text-secondary bg-white rounded-lg border border-gray-100">
                {t(lang, 'لا توجد فعاليات متاحة حالياً.', 'No events available at the moment.')}
              </div>
            )}
          </div>

          {/* Navigation Arrows (Hidden on mobile, visible on desktop) */}
          {!isLoading && events.length > 3 && (
            <>
              <button
                onClick={() => scrollCarousel('left')}
                className="absolute top-1/2 -start-4 lg:-start-12 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-all duration-300 z-10 hidden lg:flex"
                aria-label="Previous slide"
              >
                <PrevArrow className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="absolute top-1/2 -end-4 lg:-end-12 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-all duration-300 z-10 hidden lg:flex"
                aria-label="Next slide"
              >
                <NextArrow className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}